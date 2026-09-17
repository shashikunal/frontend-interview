/**
 * Client-Side Meeting Token & Access Service
 * Phase 1: Real-Time Collaboration Authentication
 */

import type { UserRole } from '../types/auth.types';

export interface CachedMeetingToken {
  token: string;
  tokenId: string;
  meetingId: string;
  role: string;
  expiresAt: number; // Epoch seconds
}

class MeetingTokenService {
  private tokenCache: Map<string, CachedMeetingToken> = new Map(); // meetingId -> CachedMeetingToken
  private renewalTimers: Map<string, any> = new Map();

  /**
   * Retrieves or proactively refreshes an active meeting token
   */
  public async getMeetingToken(
    meetingId: string,
    currentUser: { id: string; email: string; name: string; role: UserRole }
  ): Promise<string> {
    const cached = this.tokenCache.get(meetingId);
    const now = Math.floor(Date.now() / 1000);

    // If cached and has more than 45 seconds of validity remaining, return it
    if (cached && cached.expiresAt - now > 45) {
      return cached.token;
    }

    // Otherwise, request a new signed meeting token from the API
    return this.requestNewToken(meetingId, currentUser);
  }

  /**
   * Requests a fresh signed token from the Control Plane /api/v1/auth/token endpoint
   */
  public async requestNewToken(
    meetingId: string,
    currentUser: { id: string; email: string; name: string; role: UserRole }
  ): Promise<string> {
    try {
      const response = await fetch('/api/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meetingId,
          userId: currentUser.id,
          userEmail: currentUser.email,
          userName: currentUser.name,
          userRole: currentUser.role,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Token request failed with HTTP ${response.status}`);
      }

      const data = await response.json();
      const tokenRecord: CachedMeetingToken = {
        token: data.token,
        tokenId: data.tokenId,
        meetingId,
        role: data.meetingRole || 'PARTICIPANT',
        expiresAt: data.expiresAt,
      };

      this.tokenCache.set(meetingId, tokenRecord);
      this.scheduleTokenRenewal(meetingId, currentUser, data.expiresAt);

      return data.token;
    } catch (err) {
      console.error('[MeetingTokenService] Failed to acquire meeting token:', err);
      throw err;
    }
  }

  /**
   * Schedules proactive renewal 30 seconds before expiration
   */
  private scheduleTokenRenewal(
    meetingId: string,
    currentUser: { id: string; email: string; name: string; role: UserRole },
    expiresAt: number
  ): void {
    if (this.renewalTimers.has(meetingId)) {
      clearTimeout(this.renewalTimers.get(meetingId));
    }

    const now = Math.floor(Date.now() / 1000);
    const delaySeconds = Math.max(expiresAt - now - 30, 10);

    const timer = setTimeout(() => {
      this.requestNewToken(meetingId, currentUser).catch(err => {
        console.warn('[MeetingTokenService] Background renewal notice:', err);
      });
    }, delaySeconds * 1000);

    this.renewalTimers.set(meetingId, timer);
  }

  /**
   * Clears cached tokens when user leaves meeting
   */
  public clearSessionToken(meetingId: string): void {
    this.tokenCache.delete(meetingId);
    if (this.renewalTimers.has(meetingId)) {
      clearTimeout(this.renewalTimers.get(meetingId));
      this.renewalTimers.delete(meetingId);
    }
  }
}

export const meetingTokenService = new MeetingTokenService();
