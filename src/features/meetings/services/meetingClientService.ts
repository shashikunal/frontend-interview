/**
 * Client-Side Meeting Service
 * Phase 2: Real-Time Collaboration Client Plane
 */

import type { MeetingRecord, CreateMeetingRequest, UpdateLifecycleRequest, MeetingStatus } from '../../../../server/meetings/meetingTypes';
import { meetingTokenService } from '../../auth/services/meetingTokenService';
import type { UserRole } from '../../auth/types/auth.types';

export class MeetingClientService {
  /**
   * List all meetings with optional status filter
   */
  public async listMeetings(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    status?: MeetingStatus
  ): Promise<MeetingRecord[]> {
    const token = await meetingTokenService.getMeetingToken('global_list', currentUser);
    const url = status ? `/api/v1/meetings?status=${status}` : '/api/v1/meetings';

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch meetings (HTTP ${response.status})`);
    }

    const data = await response.json();
    return data.meetings || [];
  }

  /**
   * Fetch meeting details by ID
   */
  public async getMeetingById(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    meetingId: string
  ): Promise<MeetingRecord | null> {
    try {
      const list = await this.listMeetings(currentUser);
      return list.find(m => m.id === meetingId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Admin-Only: Create or schedule a new meeting
   */
  public async createMeeting(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    request: CreateMeetingRequest
  ): Promise<MeetingRecord> {
    const token = await meetingTokenService.getMeetingToken('admin_create', currentUser);

    const response = await fetch('/api/v1/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Meeting creation failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    return data.meeting;
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
