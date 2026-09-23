/**
 * Authentication & RBAC Token Domain Types
 * Phase 1: Real-Time Collaboration Control Plane
 */

import type { UserRole } from '../../src/features/auth/types/auth.types.js';

export type MeetingRole = 'HOST' | 'CO_HOST' | 'PARTICIPANT' | 'OBSERVER';

export interface MeetingTokenPayload {
  userId: string;
  userEmail: string;
  userName: string;
  userRole: UserRole;
  meetingId: string;
  meetingRole: MeetingRole;
  permissions: string[];
}

export interface DecodedMeetingToken extends MeetingTokenPayload {
  jti: string; // Unique JWT Token ID
  iat: number; // Issued At timestamp (epoch seconds)
  exp: number; // Expiration timestamp (epoch seconds)
  iss: string; // Issuer
  aud: string; // Audience
}

export interface TokenVerificationResult {
  valid: boolean;
  claims?: DecodedMeetingToken;
  error?: string;
  errorCode?: 'EXPIRED' | 'INVALID_SIGNATURE' | 'MALFORMED' | 'REVOKED' | 'UNAUTHORIZED' | 'UNSUPPORTED_ALGORITHM' | 'INVALID_TOKEN_TYPE';
}

export interface AuthContextUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
  meetingRole?: MeetingRole;
  meetingId?: string;
  tokenId?: string;
}

export interface StandardApiErrorResponse {
  success: false;
  error: string;
  message: string;
  code: string;
  timestamp: string;
  correlationId?: string;
}
