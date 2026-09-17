/**
 * Client-Side Invitation & Join Pipeline Service
 * Phase 3: Real-Time Collaboration Client Plane
 */

import type {
  MeetingInvitationRecord,
  CreateInvitationRequest,
  JoinMeetingResponse,
} from '../../../../server/meetings/invitationTypes';
import { meetingTokenService } from '../../auth/services/meetingTokenService';
import type { UserRole } from '../../auth/types/auth.types';

export class InvitationClientService {
  /**
   * Admin / Host: Create a secure meeting invitation
   */
  public async createInvitation(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    request: CreateInvitationRequest
  ): Promise<{ invitation: MeetingInvitationRecord; rawInviteToken: string; joinUrl: string }> {
    const token = await meetingTokenService.getMeetingToken(request.meetingId, currentUser);

    const response = await fetch('/api/v1/meetings/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Invitation creation failed (HTTP ${response.status})`);
    }

    return response.json();
  }

  /**
   * Validate and join a meeting via the secure join pipeline
   */
  public async joinMeeting(
    currentUser: { id: string; email: string; name: string; role: UserRole },
    meetingId: string,
    inviteToken?: string
  ): Promise<JoinMeetingResponse> {
    const sessionToken = await meetingTokenService.getMeetingToken('pre_join_auth', currentUser);

    const response = await fetch('/api/v1/meetings/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({
        meetingId,
        inviteToken,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Join pipeline rejected (HTTP ${response.status})`);
    }

    return data;
  }
}

export const invitationClientService = new InvitationClientService();
