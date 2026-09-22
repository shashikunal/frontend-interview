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
    const defaultHostId = 'f16e43bf-2ff8-480c-ae49-e2285940bf46';
    const now = new Date();

    const sample1: MeetingRecord = {
      id: 'meet_meta_arch_live',
      title: 'Meta Staff Frontend Architecture Loop',
      description: 'Distributed UI State & Concurrent Fiber Execution Evaluation',
      hostId: defaultHostId,
      hostEmail: 'shashi@admin.com',
      hostName: 'Platform Administrator',
      meetingType: 'INTERVIEW',
      status: 'SCHEDULED',
      scheduledStartTime: new Date(now.getTime() + 3600 * 1000).toISOString(),
      scheduledEndTime: new Date(now.getTime() + 7200 * 1000).toISOString(),
      settings: DEFAULT_MEETING_SETTINGS,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.meetings.set(sample1.id, sample1);
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

    const meetingId = `meet_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
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

    return { success: true, meeting };
  }

  /**
   * Get Meeting by ID
   */
  public getMeetingById(meetingId: string): MeetingRecord | null {
    return this.meetings.get(meetingId) || null;
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
    // 1. RBAC Guard
    if (caller.role !== 'admin') {
      return {
        success: false,
        error: 'Forbidden: Only Platform Administrators may alter meeting lifecycle states.',
        code: 'FORBIDDEN',
      };
    }

    const meeting = this.meetings.get(meetingId);
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
}

export const meetingService = new MeetingService();
