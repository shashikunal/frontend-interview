/**
 * Meeting Guard — Idempotent Lifecycle State Machine Guard
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Provides:
 *   - Idempotent state transition check (concurrent calls are safe)
 *   - Distributed lock simulation (per-meeting mutex to prevent race conditions)
 *   - Meeting auto-end watchdog for orphaned ACTIVE meetings
 *   - Pre-transition validation with detailed rejection reason
 */

import type { MeetingStatus, MeetingRecord } from './meetingTypes.ts';

// Valid lifecycle transitions (mirrors meetingService.ts)
const VALID_TRANSITIONS: Record<MeetingStatus, MeetingStatus[]> = {
  SCHEDULED: ['STARTED', 'CANCELLED'],
  STARTED: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['ENDED'],
  ENDED: ['ARCHIVED'],
  CANCELLED: [],
  ARCHIVED: [],
};

const TERMINAL_STATES: MeetingStatus[] = ['CANCELLED', 'ARCHIVED'];

interface TransitionLock {
  meetingId: string;
  lockedAt: Date;
  lockedBy: string; // requestId or userId
}

export interface GuardResult {
  allowed: boolean;
  reason?: string;
  code?: string;
  isIdempotent?: boolean; // true if already in target state
}

export class MeetingGuard {
  // Per-meeting in-progress lock (prevents concurrent transitions)
  private locks: Map<string, TransitionLock> = new Map();
  private readonly lockTimeoutMs: number;

  // Auto-end watchdog: map of meetingId → timer
  private autoEndTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private autoEndCallback: ((meetingId: string) => void) | null = null;

  constructor(options: { lockTimeoutMs?: number } = {}) {
    this.lockTimeoutMs = options.lockTimeoutMs ?? 10_000;
  }

  /**
   * Register callback to be invoked when a meeting auto-ends.
   */
  public onAutoEnd(cb: (meetingId: string) => void): void {
    this.autoEndCallback = cb;
  }

  /**
   * Validate whether a lifecycle transition is allowed.
   * Thread-safe: acquires a per-meeting lock during validation.
   */
  public validateTransition(
    meeting: MeetingRecord,
    targetStatus: MeetingStatus,
    requestorId: string
  ): GuardResult {
    const { id: meetingId, status: currentStatus } = meeting;

    // 1. Idempotency: already in target state
    if (currentStatus === targetStatus) {
      return { allowed: true, isIdempotent: true };
    }

    // 2. Reject transition from terminal states
    if (TERMINAL_STATES.includes(currentStatus)) {
      return {
        allowed: false,
        code: 'TERMINAL_STATE',
        reason: `Meeting is in terminal state '${currentStatus}' and cannot be transitioned.`,
      };
    }

    // 3. Check if transition is valid
    const allowed = VALID_TRANSITIONS[currentStatus]?.includes(targetStatus) ?? false;
    if (!allowed) {
      return {
        allowed: false,
        code: 'INVALID_TRANSITION',
        reason: `Cannot transition from '${currentStatus}' to '${targetStatus}'. Allowed: [${VALID_TRANSITIONS[currentStatus]?.join(', ') || 'none'}].`,
      };
    }

    // 4. Check for concurrent lock
    const existingLock = this.locks.get(meetingId);
    if (existingLock) {
      const elapsed = Date.now() - existingLock.lockedAt.getTime();
      if (elapsed < this.lockTimeoutMs) {
        return {
          allowed: false,
          code: 'CONCURRENT_TRANSITION',
          reason: `Meeting '${meetingId}' transition already in progress. Retry shortly.`,
        };
      }
      // Lock expired — remove stale lock
      this.locks.delete(meetingId);
    }

    // 5. Acquire lock
    this.locks.set(meetingId, {
      meetingId,
      lockedAt: new Date(),
      lockedBy: requestorId,
    });

    return { allowed: true, isIdempotent: false };
  }

  /**
   * Release the transition lock for a meeting after the transition completes.
   */
  public releaseLock(meetingId: string): void {
    this.locks.delete(meetingId);
  }

  /**
   * Schedule auto-end for an ACTIVE meeting after a max duration.
   * Prevents orphaned meetings from remaining ACTIVE indefinitely.
   */
  public scheduleAutoEnd(meetingId: string, maxDurationMs: number): void {
    // Cancel any existing timer for this meeting
    this.clearAutoEnd(meetingId);

    const timer = setTimeout(() => {
      this.autoEndTimers.delete(meetingId);
      console.warn(`[MeetingGuard] Auto-ending orphaned meeting: ${meetingId}`);
      this.autoEndCallback?.(meetingId);
    }, maxDurationMs);

    if (timer.unref) timer.unref();
    this.autoEndTimers.set(meetingId, timer);
  }

  /**
   * Cancel a scheduled auto-end (e.g. when meeting ends normally).
   */
  public clearAutoEnd(meetingId: string): void {
    const timer = this.autoEndTimers.get(meetingId);
    if (timer) {
      clearTimeout(timer);
      this.autoEndTimers.delete(meetingId);
    }
  }

  /**
   * Check if a meeting ID has an active lock.
   */
  public isLocked(meetingId: string): boolean {
    const lock = this.locks.get(meetingId);
    if (!lock) return false;
    const elapsed = Date.now() - lock.lockedAt.getTime();
    if (elapsed >= this.lockTimeoutMs) {
      this.locks.delete(meetingId);
      return false;
    }
    return true;
  }

  public getStats(): { lockedMeetings: number; scheduledAutoEnds: number } {
    return {
      lockedMeetings: this.locks.size,
      scheduledAutoEnds: this.autoEndTimers.size,
    };
  }
}

export const meetingGuard = new MeetingGuard({ lockTimeoutMs: 10_000 });
