/**
 * Meeting Presence & Real-Time Collaboration State Service
 * Phase 16: Enterprise Advanced Meeting Collaboration & Media Experience
 * Authoritative Server State for Participants, Hands Raised, Reactions, and Moderation
 */

export type ParticipantPresenceState =
  | 'online'
  | 'joining'
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'left';

export interface AuthoritativeParticipant {
  userId: string;
  socketId: string;
  meetingId: string;
  displayName: string;
  avatarUrl?: string;
  role: 'HOST' | 'CO_HOST' | 'PARTICIPANT' | 'OBSERVER';
  micState: boolean;
  cameraState: boolean;
  screenShareState: boolean;
  handRaised: boolean;
  handRaisedAt?: string;
  connectionState: ParticipantPresenceState;
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'POOR' | 'LOST';
  joinedAt: string;
  leftAt?: string;
}

export interface EphemeralReaction {
  reactionId: string;
  userId: string;
  userName: string;
  emoji: '👍' | '👏' | '❤️' | '😂' | '🎉';
  timestamp: number;
}

export const ALLOWED_REACTIONS = new Set(['👍', '👏', '❤️', '😂', '🎉']);

export class MeetingPresenceService {
  // Map<meetingId, Map<userId, AuthoritativeParticipant>>
  private roomParticipants: Map<string, Map<string, AuthoritativeParticipant>> = new Map();
  // Map<meetingId, Set<userId>> — Kicked / Removed Users (cannot rejoin without host authorization)
  private blacklistedUsers: Map<string, Set<string>> = new Map();
  // Map<userId, { count: number, windowStart: number }> — Token bucket rate limiter for reactions
  private reactionRateLimits: Map<string, { count: number; windowStart: number }> = new Map();

  /**
   * Add or update participant in meeting room
   */
  public registerParticipant(
    meetingId: string,
    participant: {
      userId: string;
      socketId: string;
      displayName: string;
      role: 'HOST' | 'CO_HOST' | 'PARTICIPANT' | 'OBSERVER';
      avatarUrl?: string;
      micState?: boolean;
      cameraState?: boolean;
    }
  ): { success: boolean; participant?: AuthoritativeParticipant; error?: string } {
    // Check if user was removed / blacklisted
    const blacklist = this.blacklistedUsers.get(meetingId);
    if (blacklist && blacklist.has(participant.userId)) {
      return {
        success: false,
        error: 'Forbidden: You have been removed from this meeting by the host.',
      };
    }

    if (!this.roomParticipants.has(meetingId)) {
      this.roomParticipants.set(meetingId, new Map());
    }

    const participants = this.roomParticipants.get(meetingId)!;
    const existing = participants.get(participant.userId);

    const now = new Date().toISOString();
    const entry: AuthoritativeParticipant = {
      userId: participant.userId,
      socketId: participant.socketId,
      meetingId,
      displayName: participant.displayName || existing?.displayName || 'Participant',
      avatarUrl: participant.avatarUrl || existing?.avatarUrl,
      role: participant.role || existing?.role || 'PARTICIPANT',
      micState: participant.micState ?? existing?.micState ?? true,
      cameraState: participant.cameraState ?? existing?.cameraState ?? true,
      screenShareState: existing?.screenShareState ?? false,
      handRaised: existing?.handRaised ?? false,
      handRaisedAt: existing?.handRaisedAt,
      connectionState: 'connected',
      connectionQuality: existing?.connectionQuality ?? 'EXCELLENT',
      joinedAt: existing?.joinedAt ?? now,
    };

    participants.set(participant.userId, entry);
    return { success: true, participant: entry };
  }

  /**
   * Update participant media or presence state
   */
  public updateParticipantState(
    meetingId: string,
    userId: string,
    updates: Partial<Pick<AuthoritativeParticipant, 'micState' | 'cameraState' | 'screenShareState' | 'connectionState' | 'connectionQuality'>>
  ): AuthoritativeParticipant | null {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return null;

    const participant = participants.get(userId);
    if (!participant) return null;

    if (updates.micState !== undefined) participant.micState = updates.micState;
    if (updates.cameraState !== undefined) participant.cameraState = updates.cameraState;
    if (updates.screenShareState !== undefined) participant.screenShareState = updates.screenShareState;
    if (updates.connectionState !== undefined) participant.connectionState = updates.connectionState;
    if (updates.connectionQuality !== undefined) participant.connectionQuality = updates.connectionQuality;

    return participant;
  }

  /**
   * Raise hand
   */
  public raiseHand(meetingId: string, userId: string): AuthoritativeParticipant | null {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return null;

    const participant = participants.get(userId);
    if (!participant) return null;

    participant.handRaised = true;
    participant.handRaisedAt = new Date().toISOString();
    return participant;
  }

  /**
   * Lower hand
   */
  public lowerHand(meetingId: string, userId: string): AuthoritativeParticipant | null {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return null;

    const participant = participants.get(userId);
    if (!participant) return null;

    participant.handRaised = false;
    participant.handRaisedAt = undefined;
    return participant;
  }

  /**
   * Host lowers another participant's hand
   */
  public hostLowerHand(
    meetingId: string,
    hostUserId: string,
    targetUserId: string
  ): { success: boolean; participant?: AuthoritativeParticipant; error?: string } {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return { success: false, error: 'Meeting room not found' };

    const host = participants.get(hostUserId);
    if (!host || (host.role !== 'HOST' && host.role !== 'CO_HOST')) {
      return { success: false, error: 'Unauthorized: Only meeting host or co-host can lower participant hands' };
    }

    const target = participants.get(targetUserId);
    if (!target) return { success: false, error: 'Target participant not found' };

    target.handRaised = false;
    target.handRaisedAt = undefined;
    return { success: true, participant: target };
  }

  /**
   * Check rate limit and validate reaction
   * Max 5 reactions per 5 seconds per user
   */
  public validateReaction(
    userId: string,
    emoji: string
  ): { allowed: boolean; error?: string } {
    if (!ALLOWED_REACTIONS.has(emoji)) {
      return { allowed: false, error: `Invalid emoji. Allowed: ${Array.from(ALLOWED_REACTIONS).join(' ')}` };
    }

    const now = Date.now();
    const windowMs = 5000;
    const maxReactions = 5;

    let bucket = this.reactionRateLimits.get(userId);
    if (!bucket || now - bucket.windowStart > windowMs) {
      bucket = { count: 1, windowStart: now };
      this.reactionRateLimits.set(userId, bucket);
      return { allowed: true };
    }

    if (bucket.count >= maxReactions) {
      return { allowed: false, error: 'Reaction rate limit exceeded. Please wait a few seconds.' };
    }

    bucket.count++;
    return { allowed: true };
  }

  /**
   * Host requests participant mute
   */
  public hostRequestMute(
    meetingId: string,
    hostUserId: string,
    targetUserId: string
  ): { success: boolean; error?: string } {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return { success: false, error: 'Meeting not found' };

    const host = participants.get(hostUserId);
    if (!host || (host.role !== 'HOST' && host.role !== 'CO_HOST')) {
      return { success: false, error: 'Unauthorized: Only hosts can mute participants' };
    }

    const target = participants.get(targetUserId);
    if (!target) return { success: false, error: 'Target participant not found' };

    return { success: true };
  }

  /**
   * Host removes participant from meeting
   */
  public hostRemoveParticipant(
    meetingId: string,
    hostUserId: string,
    targetUserId: string
  ): { success: boolean; targetSocketId?: string; error?: string } {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return { success: false, error: 'Meeting not found' };

    const host = participants.get(hostUserId);
    if (!host || host.role !== 'HOST') {
      return { success: false, error: 'Unauthorized: Only meeting host can remove participants' };
    }

    const target = participants.get(targetUserId);
    if (!target) return { success: false, error: 'Target participant not found' };

    // Add to blacklist to prevent rejoining
    if (!this.blacklistedUsers.has(meetingId)) {
      this.blacklistedUsers.set(meetingId, new Set());
    }
    this.blacklistedUsers.get(meetingId)!.add(targetUserId);

    const targetSocketId = target.socketId;
    participants.delete(targetUserId);

    return { success: true, targetSocketId };
  }

  /**
   * Participant disconnects or leaves
   */
  public removeParticipantBySocket(
    socketId: string
  ): { meetingId: string; participant: AuthoritativeParticipant } | null {
    for (const [meetingId, participants] of this.roomParticipants.entries()) {
      for (const [userId, p] of participants.entries()) {
        if (p.socketId === socketId) {
          p.connectionState = 'disconnected';
          p.leftAt = new Date().toISOString();
          participants.delete(userId);
          return { meetingId, participant: p };
        }
      }
    }
    return null;
  }

  /**
   * Get all active participants in a meeting
   */
  public getRoomParticipants(meetingId: string): AuthoritativeParticipant[] {
    const participants = this.roomParticipants.get(meetingId);
    if (!participants) return [];
    return Array.from(participants.values());
  }

  /**
   * Get single participant
   */
  public getParticipant(meetingId: string, userId: string): AuthoritativeParticipant | null {
    return this.roomParticipants.get(meetingId)?.get(userId) || null;
  }

  /**
   * Clean up entire meeting room upon meeting termination
   */
  public terminateRoom(meetingId: string): void {
    this.roomParticipants.delete(meetingId);
    this.blacklistedUsers.delete(meetingId);
  }
}

export const meetingPresenceService = new MeetingPresenceService();
