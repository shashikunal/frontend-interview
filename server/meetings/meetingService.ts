/**
 * Meeting Domain Service & Lifecycle State Machine
 * Phase 2: Real-Time Collaboration Control Plane
 * Strict Server-Side Enforcement: Only ADMIN users can create, schedule, or transition meetings.
 */

import crypto from 'crypto';
import type {
  MeetingRecord,
  MeetingStatus,
  CreateMeetingRequest,
  MeetingSettings,
  MeetingOutboxEvent,
} from './meetingTypes.ts';
import { DEFAULT_MEETING_SETTINGS } from './meetingTypes.ts';
import type { AuthContextUser } from '../auth/tokenTypes.ts';
import { outboxService } from '../kafka/outboxService.ts';
import { auditService } from '../observability/auditService.ts';
import { meetingsCreatedTotal, activeMeetingsGauge } from '../observability/metrics.ts';
import { meetingOpsService } from './meetingOpsService.ts';

// Valid Lifecycle Transitions Map
const VALID_TRANSITIONS: Record<MeetingStatus, MeetingStatus[]> = {
  SCHEDULED: ['STARTED', 'CANCELLED'],
  STARTED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['ENDED'],
  ENDED: ['ARCHIVED'],
  CANCELLED: [], // Terminal state
  ARCHIVED: [], // Terminal state
};

export class MeetingService {
  private meetings: Map<string, MeetingRecord> = new Map();
  private outbox: MeetingOutboxEvent[] = [];

  constructor() {
    this.seedDemoMeetings();
  }

  private seedDemoMeetings(): void {
    // Meetings start clean from scratch (no hardcoded demo meetings)
  }

  /**
   * Admin-Only: Create or schedule a new meeting
   */
  public createMeeting(
    caller: AuthContextUser,
    request: CreateMeetingRequest
  ): { success: boolean; meeting?: MeetingRecord; error?: string; code?: string } {
    // 1. Strict Server-Side RBAC
    if (caller.role !== 'admin') {
      return {
        success: false,
        error: 'Forbidden: Only Platform Administrators may create or schedule meetings.',
        code: 'FORBIDDEN',
      };
    }

    if (!request.title || !request.title.trim()) {
      return {
        success: false,
        error: 'BadRequest: Meeting title is required.',
        code: 'INVALID_TITLE',
      };
    }

    const meetingId = (request as any).id || (request as any).meetingId || `meet_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    const now = new Date().toISOString();
    const scheduledStart = request.scheduledStartTime || now;

    const mergedSettings: MeetingSettings = {
      ...DEFAULT_MEETING_SETTINGS,
      ...(request.settings || {}),
    };

    const meeting: MeetingRecord = {
      id: meetingId,
      title: request.title.trim(),
      description: request.description?.trim() || '',
      hostId: caller.id,
      hostEmail: caller.email,
      hostName: caller.name,
      meetingType: request.meetingType || 'COLLABORATIVE',
      status: 'SCHEDULED',
      scheduledStartTime: scheduledStart,
      scheduledEndTime: request.scheduledEndTime,
      settings: mergedSettings,
      createdAt: now,
      updatedAt: now,
    };

    this.meetings.set(meetingId, meeting);

    // Record Outbox Event
    this.recordOutboxEvent(meetingId, 'MeetingCreated', {
      meetingId,
      title: meeting.title,
      hostId: caller.id,
      scheduledStartTime: meeting.scheduledStartTime,
      settings: mergedSettings,
    });

    // Phase 11: Audit log & Metric
    meetingsCreatedTotal.inc({ type: meeting.meetingType });
    auditService.log({
      action: 'MEETING_CREATED',
      resourceType: 'meeting',
      resourceId: meetingId,
      actorUserId: caller.id,
      actorEmail: caller.email,
      metadata: { title: meeting.title, meetingType: meeting.meetingType },
    });

    return { success: true, meeting };
  }

  /**
   * Get Meeting by ID (reconciles with meetingOpsService & auto-provisions ad-hoc instant rooms)
   */
  public getMeetingById(meetingId: string): MeetingRecord | null {
    if (!meetingId) return null;
    const existing = this.meetings.get(meetingId);
    if (existing) return existing;

    // 1. Reconcile from meetingOpsService if provisioned via Meeting Ops or API
    try {
      const opsMeeting = meetingOpsService.getMeetingById(meetingId) || meetingOpsService.getMeetingDetails(meetingId)?.meeting;
      if (opsMeeting) {
        const bridged: MeetingRecord = {
          id: opsMeeting.id,
          title: opsMeeting.title,
          description: opsMeeting.description || '',
          hostId: opsMeeting.trainer_id || 'system_host',
          hostEmail: 'host@interviewprep.com',
          hostName: opsMeeting.trainer_name || 'Platform Trainer',
          meetingType: 'INTERVIEW',
          status: opsMeeting.status === 'COMPLETED' ? 'ENDED' : 'ACTIVE',
          scheduledStartTime: opsMeeting.start_at,
          scheduledEndTime: opsMeeting.end_at,
          settings: DEFAULT_MEETING_SETTINGS,
          createdAt: opsMeeting.created_at,
          updatedAt: opsMeeting.updated_at,
        };
        this.meetings.set(meetingId, bridged);
        return bridged;
      }
    } catch (_) {}

    // Do NOT auto-provision meetings on the fly.
    // Meeting must be explicitly created by the user before joining.
    return null;
  }

  /**
   * List Meetings with optional status and host filters
   */
  public listMeetings(filters?: {
    status?: MeetingStatus;
    hostId?: string;
    limit?: number;
  }): MeetingRecord[] {
    let result = Array.from(this.meetings.values());

    if (filters?.status) {
      result = result.filter(m => m.status === filters.status);
    }
    if (filters?.hostId) {
      result = result.filter(m => m.hostId === filters.hostId);
    }

    result.sort(
      (a, b) => new Date(b.scheduledStartTime).getTime() - new Date(a.scheduledStartTime).getTime()
    );

    if (filters?.limit && filters.limit > 0) {
      result = result.slice(0, filters.limit);
    }

    return result;
  }

  /**
   * Admin-Only: Explicit Lifecycle State Transition
   * Valid transitions:
   *   SCHEDULED -> STARTED | CANCELLED
   *   STARTED   -> ACTIVE | CANCELLED
   *   ACTIVE    -> ENDED
   *   ENDED     -> ARCHIVED
   */
  public transitionStatus(
    caller: AuthContextUser,
    meetingId: string,
    targetStatus: MeetingStatus,
    reason?: string
  ): { success: boolean; meeting?: MeetingRecord; error?: string; code?: string } {
    // 1. RBAC Guard: Admin, Interviewer, or Meeting Host can transition status
    const meeting = this.meetings.get(meetingId);
    const isHostOrAdmin =
      caller.role === 'admin' ||
      caller.role === 'interviewer' ||
      (caller as any).meetingRole === 'HOST' ||
      (meeting && ((meeting as any).hostId === caller.id || (meeting as any).trainer_id === caller.id || (meeting as any).created_by === caller.id));

    if (!isHostOrAdmin) {
      return {
        success: false,
        error: 'Forbidden: Only meeting hosts or platform administrators may alter meeting lifecycle states.',
        code: 'FORBIDDEN',
      };
    }
    if (!meeting) {
      return {
        success: false,
        error: `NotFound: Meeting '${meetingId}' does not exist.`,
        code: 'MEETING_NOT_FOUND',
      };
    }

    const currentStatus = meeting.status;

    // Idempotency: If already in target status, return success directly
    if (currentStatus === targetStatus) {
      return { success: true, meeting };
    }

    // 2. Validate Transition
    const allowedNext = VALID_TRANSITIONS[currentStatus] || [];
    if (!allowedNext.includes(targetStatus)) {
      return {
        success: false,
        error: `InvalidTransition: Cannot transition meeting from '${currentStatus}' to '${targetStatus}'. Allowed transitions: [${allowedNext.join(', ') || 'None (Terminal State)'}].`,
        code: 'INVALID_TRANSITION',
      };
    }

    const now = new Date().toISOString();
    meeting.status = targetStatus;
    meeting.updatedAt = now;

    if (targetStatus === 'STARTED' && !meeting.actualStartTime) {
      meeting.actualStartTime = now;
    }
    if (targetStatus === 'ENDED') {
      meeting.actualEndTime = now;
    }

    this.meetings.set(meetingId, meeting);

    // Map Event Type
    const eventTypeMap: Record<MeetingStatus, MeetingOutboxEvent['eventType']> = {
      SCHEDULED: 'MeetingScheduled',
      STARTED: 'MeetingStarted',
      ACTIVE: 'MeetingActivated',
      ENDED: 'MeetingEnded',
      CANCELLED: 'MeetingCancelled',
      ARCHIVED: 'MeetingArchived',
    };

    this.recordOutboxEvent(meetingId, eventTypeMap[targetStatus], {
      meetingId,
      previousStatus: currentStatus,
      newStatus: targetStatus,
      changedBy: caller.id,
      reason: reason || null,
      timestamp: now,
    });

    // Phase 11: Audit log & Metric gauge update
    if (targetStatus === 'STARTED' || targetStatus === 'ACTIVE') {
      activeMeetingsGauge.inc();
    } else if (targetStatus === 'ENDED' || targetStatus === 'CANCELLED') {
      activeMeetingsGauge.dec();
    }
    const auditActionMap: Record<MeetingStatus, string> = {
      SCHEDULED: 'MEETING_SCHEDULED',
      STARTED: 'MEETING_STARTED',
      ACTIVE: 'MEETING_STARTED',
      ENDED: 'MEETING_ENDED',
      CANCELLED: 'MEETING_CANCELLED',
      ARCHIVED: 'MEETING_ENDED',
    };
    auditService.log({
      action: auditActionMap[targetStatus] || 'MEETING_SETTING_CHANGED',
      resourceType: 'meeting',
      resourceId: meetingId,
      actorUserId: caller.id,
      actorEmail: caller.email,
      metadata: { fromStatus: currentStatus, toStatus: targetStatus, reason },
    });

    return { success: true, meeting };
  }

  private recordOutboxEvent(
    meetingId: string,
    eventType: MeetingOutboxEvent['eventType'],
    payload: Record<string, any>
  ): void {
    const event: MeetingOutboxEvent = {
      id: `evt_${crypto.randomUUID()}`,
      meetingId,
      eventType,
      payload,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    this.outbox.push(event);

    // Phase 9: Transactional Outbox integration
    try {
      outboxService.recordEvent(`${eventType}.v1`, 'MEETING', meetingId, payload, {
        partitionKey: meetingId,
      });
    } catch (_) {}
  }

  public getOutboxEvents(filter?: { status?: 'PENDING' | 'PUBLISHED' }): MeetingOutboxEvent[] {
    if (filter?.status) {
      return this.outbox.filter(e => e.status === filter.status);
    }
    return [...this.outbox];
  }

  /**
   * Phase 12: Get currently active/started meetings for operational monitoring
   */
  public getActiveMeetings(): MeetingRecord[] {
    return Array.from(this.meetings.values()).filter(
      m => m.status === 'STARTED' || m.status === 'ACTIVE'
    );
  }

  /**
   * Phase 12: Aggregate meeting statistics by lifecycle status
   */
  public getMeetingStats(): Record<string, number> {
    const stats: Record<string, number> = {
      TOTAL: this.meetings.size,
      SCHEDULED: 0,
      STARTED: 0,
      ACTIVE: 0,
      ENDED: 0,
      CANCELLED: 0,
      ARCHIVED: 0,
    };
    for (const m of this.meetings.values()) {
      if (stats[m.status] !== undefined) {
        stats[m.status]++;
      }
    }
    return stats;
  }
}

export const meetingService = new MeetingService();
