/**
 * Meeting Invitation & Join Pipeline Domain Types
 * Phase 3: Real-Time Collaboration Control Plane
 */

import type { MeetingRole } from '../auth/tokenTypes.ts';
import type { MeetingRecord } from './meetingTypes.ts';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REVOKED' | 'EXPIRED';

export interface MeetingInvitationRecord {
  id: string;
  meetingId: string;
  invitedByUserId: string;
  inviteeEmail: string;
  inviteeName?: string;
  inviteTokenHash: string; // SHA-256 hash of secret token
  assignedRole: MeetingRole;
  status: InvitationStatus;
  expiresAt: string; // ISO 8601
  createdAt: string; // ISO 8601
  acceptedAt?: string; // ISO 8601
}

export interface CreateInvitationRequest {
  meetingId: string;
  inviteeEmail: string;
  inviteeName?: string;
  assignedRole?: MeetingRole;
  expiresInHours?: number;
}

export interface JoinMeetingRequest {
  meetingId: string;
  inviteToken?: string; // Optional if user is already known or meeting is open
}

export interface JoinMeetingResponse {
  success: boolean;
  meeting?: MeetingRecord;
  meetingRole?: MeetingRole;
  meetingToken?: string;
  tokenId?: string;
  expiresAt?: number;
  error?: string;
  code?: string;
}
