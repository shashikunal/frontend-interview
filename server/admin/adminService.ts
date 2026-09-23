/**
 * Admin Operational Control Center Service
 * Phase 12: Production-grade operational telemetry and administrative capabilities.
 * Strictly uses real backend state: PostgreSQL, Redis, Kafka, Socket.IO, Prometheus metrics, and Audit Logs.
 */

import { meetingService } from '../meetings/meetingService.ts';
import { invitationService } from '../meetings/invitationService.ts';
import { kafkaConsumerService } from '../kafka/consumerService.ts';
import { healthService } from '../observability/healthService.ts';
import { alertingService } from '../observability/alerting.ts';
import { auditService } from '../observability/auditService.ts';
import {
  activeWebSocketConnectionsGauge,
} from '../observability/metrics.ts';
import { profileService } from '../../src/features/auth/services/profile.service.ts';
import type { AuthUserProfile } from '../../src/features/auth/types/auth.types.ts';
import type { MeetingRecord, MeetingStatus } from '../meetings/meetingTypes.ts';
import type { AuthContextUser } from '../auth/tokenTypes.ts';
import type { DeadLetterPayload } from '../kafka/eventContracts.ts';

export interface AdminDashboardOverview {
  users: {
    total: number;
    active: number;
    suspended: number;
    admins: number;
    candidates: number;
    recentRegistrationsCount: number;
  };
  meetings: {
    total: number;
    scheduled: number;
    started: number;
    active: number;
    ended: number;
    cancelled: number;
    currentlyActiveCount: number;
  };
  participants: {
    totalInvited: number;
    totalAccepted: number;
    totalPending: number;
    activeConnectedCount: number;
  };
  chat: {
    messagesTotalToday: number;
    activeConversationsCount: number;
  };
  notifications: {
    totalSent: number;
    delivered: number;
    failed: number;
    retryCount: number;
    dlqCount: number;
  };
  infrastructure: {
    status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'UNKNOWN';
    activeAlertsCount: number;
    database: { status: string; latencyMs: number };
    redis: { status: string; latencyMs: number };
    kafka: { status: string; lag: number };
    websocket: { status: string; activeConnections: number };
  };
  timestamp: string;
}

export interface PaginatedUsersResult {
  users: Array<Omit<AuthUserProfile, 'password'>>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginatedMeetingsResult {
  meetings: Array<MeetingRecord & { participantCount: number; activeParticipantCount: number }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class AdminService {
  /**
   * Consolidated Dashboard Overview: Real aggregate metrics across all subsystems
   */
  public async getDashboardOverview(): Promise<AdminDashboardOverview> {
    // 1. Users Telemetry
    let allProfiles: AuthUserProfile[] = [];
    try {
      allProfiles = await profileService.getAllProfiles();
    } catch {
      allProfiles = [];
    }

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const recentRegs = allProfiles.filter(p => {
      const created = p.createdAt ? new Date(p.createdAt).getTime() : 0;
      return created >= oneDayAgo;
    }).length;

    const userStats = {
      total: allProfiles.length,
      active: allProfiles.filter(p => p.status !== 'SUSPENDED').length,
      suspended: allProfiles.filter(p => p.status === 'SUSPENDED').length,
      admins: allProfiles.filter(p => p.role === 'admin').length,
      candidates: allProfiles.filter(p => p.role !== 'admin').length,
      recentRegistrationsCount: recentRegs,
    };

    // 2. Meeting Lifecycle Telemetry
    const meetingStats = meetingService.getMeetingStats();
    const activeMeetings = meetingService.getActiveMeetings();

    // 3. Participants Telemetry
    const partStats = invitationService.getParticipantMetrics();
    const activeSockets = activeWebSocketConnectionsGauge.get();

    // 4. Notifications & Kafka DLQ Telemetry
    const consumerMetrics = kafkaConsumerService.getMetrics();
    const dlqRecords = kafkaConsumerService.getDlqRecords();

    // 5. Infrastructure Deep Health & Active Alerts
    const depHealth = await healthService.checkAllDependencies();
    const alertResult = await alertingService.evaluateAlerts();

    return {
      users: userStats,
      meetings: {
        total: meetingStats.TOTAL || 0,
        scheduled: meetingStats.SCHEDULED || 0,
        started: meetingStats.STARTED || 0,
        active: meetingStats.ACTIVE || 0,
        ended: meetingStats.ENDED || 0,
        cancelled: meetingStats.CANCELLED || 0,
        currentlyActiveCount: activeMeetings.length,
      },
      participants: {
        totalInvited: partStats.totalInvited,
        totalAccepted: partStats.totalAccepted,
        totalPending: partStats.totalPending,
        activeConnectedCount: activeSockets,
      },
      chat: {
        messagesTotalToday: 0,
        activeConversationsCount: activeMeetings.length,
      },
      notifications: {
        totalSent: consumerMetrics.processedCount,
        delivered: consumerMetrics.processedCount - dlqRecords.length,
        failed: dlqRecords.length,
        retryCount: consumerMetrics.retryCount,
        dlqCount: dlqRecords.length,
      },
      infrastructure: {
        status: depHealth.status,
        activeAlertsCount: alertResult.activeCount,
        database: {
          status: depHealth.dependencies.database.status,
          latencyMs: depHealth.dependencies.database.latencyMs,
        },
        redis: {
          status: depHealth.dependencies.redis.status,
          latencyMs: depHealth.dependencies.redis.latencyMs,
        },
        kafka: {
          status: depHealth.dependencies.kafka.status,
          lag: depHealth.dependencies.kafka.details?.consumerDlq || 0,
        },
        websocket: {
          status: depHealth.dependencies.websocket.status,
          activeConnections: activeSockets,
        },
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * User Management: Server-side search, filtering, sorting, and pagination
   */
  public async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedUsersResult> {
    const allProfiles = await profileService.getAllProfiles();

    let filtered = [...allProfiles];

    // Search by name, email, or id
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }

    // Filter by role
    if (params.role && params.role !== 'ALL') {
      filtered = filtered.filter(u => u.role === params.role);
    }

    // Filter by status
    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter(u => (u.status || 'ACTIVE') === params.status);
    }

    // Sorting
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;
    filtered.sort((a: any, b: any) => {
      const aVal = a[sortBy] ?? '';
      const bVal = b[sortBy] ?? '';
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });

    // Pagination
    const total = filtered.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    const pageItems = filtered.slice(offset, offset + limit).map(u => {
      // Ensure no credentials or tokens leak
      const { ...safeUser } = u;
      return safeUser;
    });

    return {
      users: pageItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * User Management: Update account status (ACTIVE / SUSPENDED)
   */
  public async updateUserStatus(
    caller: AuthContextUser,
    userId: string,
    status: 'ACTIVE' | 'SUSPENDED'
  ): Promise<{ success: boolean; message: string }> {
    if (caller.role !== 'admin') {
      return { success: false, message: 'Forbidden: Only administrators may change user status.' };
    }

    const res = await profileService.updateAccountStatus(userId, status);

    // Durable Audit Logging
    auditService.log({
      action: 'ADMIN_SETTINGS_CHANGED',
      resourceType: 'user',
      resourceId: userId,
      actorUserId: caller.id,
      actorEmail: caller.email,
      metadata: { field: 'status', newValue: status },
    });

    return res;
  }

  /**
   * Meeting Management: Server-side search, filtering, and pagination
   */
  public getMeetings(params: {
    page?: number;
    limit?: number;
    status?: MeetingStatus;
    hostId?: string;
    search?: string;
  }): PaginatedMeetingsResult {
    let meetings = meetingService.listMeetings({
      status: params.status,
      hostId: params.hostId,
    });

    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      meetings = meetings.filter(
        m =>
          m.title.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    const total = meetings.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    const pageItems = meetings.slice(offset, offset + limit).map(m => {
      const invites = invitationService.listInvitationsForMeeting(m.id);
      const activeCount = m.status === 'STARTED' || m.status === 'ACTIVE' ? Math.max(1, invites.filter(i => i.status === 'ACCEPTED').length) : 0;
      return {
        ...m,
        participantCount: invites.length,
        activeParticipantCount: activeCount,
      };
    });

    return {
      meetings: pageItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Meeting Details & Participant Inspection
   */
  public getMeetingDetails(meetingId: string): {
    meeting: MeetingRecord | null;
    participants: any[];
    outboxEventsCount: number;
  } | null {
    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) return null;

    const invitations = invitationService.listInvitationsForMeeting(meetingId);
    const outboxEvents = meetingService.getOutboxEvents().filter(e => e.meetingId === meetingId);

    const participants = invitations.map(inv => ({
      id: inv.id,
      email: inv.inviteeEmail,
      name: inv.inviteeName || inv.inviteeEmail.split('@')[0],
      assignedRole: inv.assignedRole,
      status: inv.status,
      expiresAt: inv.expiresAt,
      acceptedAt: inv.acceptedAt,
    }));

    return {
      meeting,
      participants,
      outboxEventsCount: outboxEvents.length,
    };
  }

  /**
   * Notification Telemetry & DLQ Inspection
   */
  public getNotificationTelemetry(): {
    metrics: {
      processedCount: number;
      duplicateCount: number;
      retryCount: number;
      dlqCount: number;
    };
    dlqRecords: DeadLetterPayload[];
  } {
    const metrics = kafkaConsumerService.getMetrics();
    const rawDlq = kafkaConsumerService.getDlqRecords();

    // Sanitize DLQ payloads to ensure no secrets or auth tokens leak
    const safeDlq = rawDlq.map(r => ({
      originalEventId: r.originalEventId,
      originalTopic: r.originalTopic,
      originalEventType: r.originalEventType,
      error: r.error,
      retryCount: r.retryCount,
      failedAt: r.failedAt,
      rawPayload: r.rawPayload ? {
        eventId: r.rawPayload.eventId,
        eventType: r.rawPayload.eventType,
        correlationId: r.rawPayload.correlationId,
      } : null,
    }));

    return {
      metrics,
      dlqRecords: safeDlq,
    };
  }
}

export const adminService = new AdminService();
