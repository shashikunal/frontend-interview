/**
 * Meeting Mutation & Race Condition Protection Tracker
 * Conforms to Requirements 21 & 22:
 * - Single Source of Truth enforcement
 * - Delete Race Condition Protection: prevents slow in-flight GET responses
 *   from resurrecting deleted meetings.
 */

export class MeetingMutationTracker {
  private static instance: MeetingMutationTracker;
  private deletedIds: Map<string, number> = new Map(); // meetingId -> timestamp
  private lastMutationTimestamp = 0;
  private inFlightGetControllers: Set<AbortController> = new Set();

  private constructor() {}

  public static getInstance(): MeetingMutationTracker {
    if (!MeetingMutationTracker.instance) {
      MeetingMutationTracker.instance = new MeetingMutationTracker();
    }
    return MeetingMutationTracker.instance;
  }

  /**
   * Register a new GET request and acquire an AbortSignal.
   * Allows automatic cancellation when a conflicting mutation starts.
   */
  public registerGetRequest(): { controller: AbortController; signal: AbortSignal } {
    const controller = new AbortController();
    this.inFlightGetControllers.add(controller);
    return { controller, signal: controller.signal };
  }

  /**
   * Helper to directly obtain an AbortSignal linked to mutation tracking
   */
  public getAbortSignal(): AbortSignal {
    return this.registerGetRequest().signal;
  }

  /**
   * Release controller when GET request finishes.
   */
  public releaseGetRequest(controller: AbortController): void {
    this.inFlightGetControllers.delete(controller);
  }

  /**
   * Register a DELETE mutation:
   * 1. Abort all in-flight GET requests immediately.
   * 2. Store meetingId in deletedIds map with timestamp.
   * 3. Update lastMutationTimestamp.
   */
  public registerDelete(meetingId: string): void {
    const now = Date.now();
    this.deletedIds.set(meetingId, now);
    this.lastMutationTimestamp = now;

    // Abort all obsolete in-flight GET requests immediately
    this.inFlightGetControllers.forEach(controller => {
      try {
        controller.abort();
      } catch (_) {}
    });
    this.inFlightGetControllers.clear();
  }

  /**
   * Register a CREATE or UPDATE mutation:
   * Aborts in-flight GET requests to prevent stale lists from overwriting fresh items.
   */
  public registerMutation(): void {
    this.lastMutationTimestamp = Date.now();
    this.inFlightGetControllers.forEach(controller => {
      try {
        controller.abort();
      } catch (_) {}
    });
    this.inFlightGetControllers.clear();
  }

  /**
   * Check if a meeting was marked deleted.
   */
  public isDeleted(meetingId: string): boolean {
    return this.deletedIds.has(meetingId);
  }

  public isMeetingDeleted(meetingId: string): boolean {
    return this.isDeleted(meetingId);
  }

  /**
   * Sanitize an incoming list of meetings:
   * Strips out any meetings that were deleted in a recent mutation,
   * guaranteeing that a delayed stale response CANNOT restore a deleted meeting.
   */
  public sanitizeMeetingList<T extends { id: string }>(meetings: T[]): T[] {
    if (!Array.isArray(meetings)) return [];
    return meetings.filter(m => !this.deletedIds.has(m.id));
  }

  /**
   * Get timestamp of the most recent mutation.
   */
  public getLastMutationTimestamp(): number {
    return this.lastMutationTimestamp;
  }

  /**
   * Clear tracked deletions (useful for testing or cache reset).
   */
  public reset(): void {
    this.deletedIds.clear();
    this.lastMutationTimestamp = 0;
    this.inFlightGetControllers.clear();
  }

  public clear(): void {
    this.reset();
  }
}

export const meetingMutationTracker = MeetingMutationTracker.getInstance();
