/**
 * Meeting Invitation & Join Validation Pipeline Service
 * Phase 3: Real-Time Collaboration Control Plane
 * Strict Security: Never trust meeting URL alone. Validates status, invitations, rate limits, and issues short-lived tokens.
 */

import crypto from 'crypto';
import type {
  MeetingInvitationRecord,
  CreateInvitationRequest,
  JoinMeetingResponse,
} from './invitationTypes.ts';
import type { MeetingRole } from '../auth/tokenTypes.ts';
import { meetingService } from './meetingService.ts';
import { tokenService } from '../auth/tokenService.ts';
import type { AuthContextUser } from '../auth/tokenTypes.ts';

export class InvitationService {
  private invitations: Map<string, MeetingInvitationRecord> = new Map(); // id -> record
  private tokenHashToId: Map<string, string> = new Map(); // tokenHash -> id
  private joinRateLimits: Map<string, { count: number; resetAt: number }> = new Map();

  /**
   * Helper: Hash an invitation secret token with SHA-256
   */
  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Admin-Only: Create a secure meeting invitation
   */
  public createInvitation(
    caller: AuthContextUser,
    request: CreateInvitationRequest
  ): { success: boolean; invitation?: MeetingInvitationRecord; rawInviteToken?: string; error?: string; code?: string } {
    // 1. RBAC Guard: Caller must be Admin or Meeting Host
    const meeting = meetingService.getMeetingById(request.meetingId);
    if (!meeting) {
      return { success: false, error: 'Meeting not found.', code: 'MEETING_NOT_FOUND' };
    }

    const isHost = meeting.hostId === caller.id;
    const isAdmin = caller.role === 'admin';

    if (!isHost && !isAdmin) {
      return {
        success: false,
        error: 'Forbidden: Only the meeting host or platform administrators may invite participants.',
        code: 'FORBIDDEN',
      };
    }

    if (!request.inviteeEmail || !request.inviteeEmail.includes('@')) {
      return {
        success: false,
        error: 'BadRequest: Valid inviteeEmail is required.',
        code: 'INVALID_EMAIL',
      };
    }

    const rawInviteToken = crypto.randomBytes(32).toString('hex');
    const inviteTokenHash = this.hashToken(rawInviteToken);

    const now = new Date();
    const expiryHours = typeof request.expiresInHours === 'number' ? request.expiresInHours : 48;
    const expiresAt = new Date(now.getTime() + expiryHours * 3600 * 1000).toISOString();

    const inviteId = `inv_${crypto.randomUUID()}`;
    const record: MeetingInvitationRecord = {
      id: inviteId,
      meetingId: meeting.id,
      invitedByUserId: caller.id,
      inviteeEmail: request.inviteeEmail.trim().toLowerCase(),
      inviteeName: request.inviteeName?.trim(),
      inviteTokenHash,
      assignedRole: request.assignedRole || 'PARTICIPANT',
      status: 'PENDING',
      expiresAt,
      createdAt: now.toISOString(),
    };

    this.invitations.set(inviteId, record);
    this.tokenHashToId.set(inviteTokenHash, inviteId);

    return {
      success: true,
      invitation: record,
      rawInviteToken,
    };
  }

  /**
   * Secure Join Validation Pipeline
   * 1. Authenticate user context
   * 2. Apply Rate Limiting
   * 3. Validate Meeting exists
   * 4. Validate Meeting lifecycle status (reject CANCELLED, ENDED, ARCHIVED)
   * 5. Verify Invitation / Access permissions
   * 6. Generate short-lived meeting token (300s)
   */
  public validateJoin(
    user: AuthContextUser,
    meetingId: string,
    rawInviteToken?: string
  ): JoinMeetingResponse {
    // 1. Rate Limiting Check (15 attempts per minute per user)
    const rateLimitKey = `join_${user.id}_${meetingId}`;
    const nowEpoch = Math.floor(Date.now() / 1000);
    const rl = this.joinRateLimits.get(rateLimitKey) || { count: 0, resetAt: nowEpoch + 60 };

    if (rl.resetAt <= nowEpoch) {
      rl.count = 0;
      rl.resetAt = nowEpoch + 60;
    }

    rl.count++;
    this.joinRateLimits.set(rateLimitKey, rl);

    if (rl.count > 15) {
      return {
        success: false,
        error: 'Too Many Requests: Excessive join attempts. Please wait 1 minute before retrying.',
        code: 'RATE_LIMITED',
      };
    }

    // 2. Validate Meeting Exists
    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) {
      return {
        success: false,
        error: `NotFound: Meeting '${meetingId}' does not exist.`,
        code: 'MEETING_NOT_FOUND',
      };
    }

    // 3. Validate Meeting Status
    if (meeting.status === 'CANCELLED') {
      return {
        success: false,
        error: 'Meeting Cancelled: This meeting was cancelled by the administrator and cannot be joined.',
        code: 'MEETING_CANCELLED',
      };
    }

    if (meeting.status === 'ENDED' || meeting.status === 'ARCHIVED') {
      return {
        success: false,
        error: 'Meeting Ended: This session has concluded.',
        code: 'MEETING_ENDED',
      };
    }

    // 4. Determine Participant Role & Verify Access
    let meetingRole: MeetingRole = 'PARTICIPANT';
    let authorized = false;

    // Check A: Admin or Host
    if (user.role === 'admin' || meeting.hostId === user.id) {
      meetingRole = 'HOST';
      authorized = true;
    }

    // Check B: Raw Token Provided
    if (!authorized && rawInviteToken) {
      const hash = this.hashToken(rawInviteToken);
      const invId = this.tokenHashToId.get(hash);
      if (invId) {
        const inv = this.invitations.get(invId);
        if (inv && inv.meetingId === meetingId) {
          const expiresAtEpoch = Math.floor(new Date(inv.expiresAt).getTime() / 1000);
          if (expiresAtEpoch < nowEpoch) {
            return {
              success: false,
              error: 'Forbidden: Invitation has expired. Please request a new invite link.',
              code: 'INVITATION_EXPIRED',
            };
          }
          if (inv.status === 'REVOKED') {
            return {
              success: false,
              error: 'Forbidden: Invitation has been revoked by the administrator.',
              code: 'INVITATION_REVOKED',
            };
          }

          meetingRole = inv.assignedRole;
          authorized = true;
          inv.status = 'ACCEPTED';
          inv.acceptedAt = new Date().toISOString();
        }
      }
    }

    // Check C: Direct email invitation lookup
    if (!authorized && user.email) {
      for (const inv of this.invitations.values()) {
        if (
          inv.meetingId === meetingId &&
          inv.inviteeEmail.toLowerCase() === user.email.toLowerCase() &&
          inv.status !== 'REVOKED'
        ) {
          const expiresAtEpoch = Math.floor(new Date(inv.expiresAt).getTime() / 1000);
          if (expiresAtEpoch >= nowEpoch) {
            meetingRole = inv.assignedRole;
            authorized = true;
            inv.status = 'ACCEPTED';
            inv.acceptedAt = new Date().toISOString();
            break;
          }
        }
      }
    }

    if (!authorized) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to join this private meeting. A valid invitation is required.',
        code: 'UNAUTHORIZED_MEETING_ACCESS',
      };
    }

    // 5. Issue short-lived, cryptographically signed meeting token (300 seconds / 5 mins)
    const tokenData = tokenService.generateMeetingToken(
      {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        meetingId: meeting.id,
        meetingRole,
        permissions: meetingRole === 'HOST' ? ['meetings:manage', 'meetings:host'] : ['meetings:participate'],
      },
      300
    );

    return {
      success: true,
      meeting,
      meetingRole,
      meetingToken: tokenData.token,
      tokenId: tokenData.tokenId,
      expiresAt: tokenData.expiresAt,
    };
  }

  /**
   * List invitations for a meeting
   */
  public listInvitationsForMeeting(meetingId: string): MeetingInvitationRecord[] {
    return Array.from(this.invitations.values()).filter(i => i.meetingId === meetingId);
  }

  /**
   * Phase 12: List all invitations across all meetings
   */
  public listAllInvitations(): MeetingInvitationRecord[] {
    return Array.from(this.invitations.values());
  }

  /**
   * Phase 12: Aggregate participant metrics across invitations
   */
  public getParticipantMetrics(): {
    totalInvited: number;
    totalAccepted: number;
    totalRevoked: number;
    totalPending: number;
  } {
    const records = Array.from(this.invitations.values());
    return {
      totalInvited: records.length,
      totalAccepted: records.filter(r => r.status === 'ACCEPTED').length,
      totalRevoked: records.filter(r => r.status === 'REVOKED').length,
      totalPending: records.filter(r => r.status === 'PENDING').length,
    };
  }
}

export const invitationService = new InvitationService();
