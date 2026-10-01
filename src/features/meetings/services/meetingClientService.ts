/**
 * Client-Side Meeting Service
 * Phase 2: Real-Time Collaboration Client Plane
 */

import type { MeetingRecord, CreateMeetingRequest, UpdateLifecycleRequest, MeetingStatus } from '../../../../server/meetings/meetingTypes';
import { meetingTokenService } from '../../auth/services/meetingTokenService';
import type { UserRole } from '../../auth/types/auth.types';
import { meetingMutationTracker } from './meetingMutationTracker';

export class MeetingClientService {
  /**
   * List all meetings with optional status filter.
   * Employs AbortController and mutation tracking to prevent stale/delayed GET responses
   * from resurrecting deleted meetings (Requirement 21 & 22).
   */
  public async listMeetings(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    status?: MeetingStatus,
    customSignal?: AbortSignal
  ): Promise<MeetingRecord[]> {
    const token = await meetingTokenService.getMeetingToken('global_list', currentUser);
    const url = status ? `/api/v1/meetings?status=${status}` : '/api/v1/meetings';

    // Link tracker abort signal so delete mutations immediately cancel stale GET queries
    const signal = customSignal || meetingMutationTracker.getAbortSignal();

    const response = await fetch(url, {
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch meetings (HTTP ${response.status})`);
    }

    const data = await response.json();
    const rawMeetings: MeetingRecord[] = data.meetings || [];
    
    // Purge any meetings deleted locally or remotely during query in-flight
    return meetingMutationTracker.sanitizeMeetingList(rawMeetings);
  }

  /**
   * Fetch meeting details by ID
   */
  public async getMeetingById(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    meetingId: string
  ): Promise<MeetingRecord | null> {
    if (meetingMutationTracker.isMeetingDeleted(meetingId)) {
      return null;
    }
    try {
      const list = await this.listMeetings(currentUser);
      return list.find(m => m.id === meetingId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Admin-Only: Create or schedule a new meeting with strict idempotency (Requirement 24)
   */
  public async createMeeting(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    request: CreateMeetingRequest & { idempotencyKey?: string }
  ): Promise<MeetingRecord> {
    const token = await meetingTokenService.getMeetingToken('admin_create', currentUser);
    const idempotencyKey = request.idempotencyKey || `idem_crt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const response = await fetch('/api/v1/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        ...request,
        idempotency_key: idempotencyKey,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Meeting creation failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    return data.meeting;
  }

  /**
   * Delete meeting with race-condition protection & idempotency (Requirements 22, 24, 25, 26)
   * 1. Registers deletion in local mutation tracker
   * 2. Cancels any in-flight GET requests
   * 3. Dispatches DELETE mutation to backend API
   */
  public async deleteMeeting(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    meetingId: string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    // 1. Immediately guard client state against stale response overwrite
    meetingMutationTracker.registerDelete(meetingId);

    const token = await meetingTokenService.getMeetingToken(meetingId, currentUser);

    const response = await fetch(`/api/v1/meetings?id=${encodeURIComponent(meetingId)}&reason=${encodeURIComponent(reason || 'Cancelled by user')}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Fallback to admin meetings endpoint if needed
      const adminFallback = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'delete_single',
          meetingId,
          reason,
        }),
      });

      if (!adminFallback.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete meeting (HTTP ${response.status})`);
      }
      return adminFallback.json();
    }

    return response.json();
  }

  /**
   * Admin-Only: Trigger lifecycle state transition
   */
  public async updateLifecycle(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    meetingId: string,
    update: UpdateLifecycleRequest
  ): Promise<MeetingRecord> {
    const token = await meetingTokenService.getMeetingToken(meetingId, currentUser);

    const response = await fetch('/api/v1/meetings/lifecycle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        meetingId,
        targetStatus: update.targetStatus,
        reason: update.reason,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Lifecycle transition failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    return data.meeting;
  }
}

export const meetingClientService = new MeetingClientService();

