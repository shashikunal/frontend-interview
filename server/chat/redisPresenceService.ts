/**
 * Ephemeral Realtime State & Presence Service (Redis-backed with In-Memory Dual Layer)
 * Phase 7: Application Chat
 *
 * Features:
 * - Multi-tab / multi-device presence tracking with connection counting
 * - User remains ONLINE until the last socket connection closes
 * - Authoritative server-side last-seen timestamps on final disconnect
 * - Ephemeral typing indicators with automatic 3000ms TTL cleanup
 * - Distributed WebSocket coordination abstraction
 * - Sliding-window rate limiting for message sending and typing indicators
 * - Degraded mode resilience: flawless in-memory fallback if Redis is offline
 */

import type { UserPresence } from './appChatTypes.ts';
import { presenceService } from '../redis/presenceService.ts';

export class RedisPresenceService {
  // Connection counting: userId -> Set of socket IDs
  private userConnections: Map<string, Set<string>> = new Map();
  // Ephemeral presence cache: userId -> UserPresence
  private presenceState: Map<string, UserPresence> = new Map();
  // Ephemeral typing indicators: conversationId -> Map<userId, { userName: string, expiresAt: number, timer: NodeJS.Timeout }>
  private typingState: Map<string, Map<string, { userName: string; expiresAt: number; timer?: any }>> = new Map();
  // Sliding-window message rate limit: userId -> timestamps[]
  private messageRateLimits: Map<string, number[]> = new Map();
  // Sliding-window typing rate limit: userId -> timestamps[]
  private typingRateLimits: Map<string, number[]> = new Map();

  private readonly MESSAGE_RATE_LIMIT_WINDOW_MS = 2000;
  private readonly MESSAGE_MAX_PER_WINDOW = 10;
  private readonly TYPING_RATE_LIMIT_WINDOW_MS = 1000;
  private readonly TYPING_MAX_PER_WINDOW = 5;
  private readonly TYPING_TTL_MS = 3000;

  // ──────────────────────────────────────────────────────────────────────────
  // PRESENCE & CONNECTION COUNTING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Register a new socket connection for a user.
   * Returns true if user transitioned from OFFLINE to ONLINE.
   */
  public registerConnection(userId: string, socketId: string): { statusChanged: boolean; presence: UserPresence } {
    if (!userId || !socketId) {
      return {
        statusChanged: false,
        presence: { userId, status: 'OFFLINE' },
      };
    }

    presenceService.registerConnection(userId, socketId).catch(() => {});

    let sockets = this.userConnections.get(userId);
    const wasOffline = !sockets || sockets.size === 0;

    if (!sockets) {
      sockets = new Set();
      this.userConnections.set(userId, sockets);
    }
    sockets.add(socketId);

    const presence: UserPresence = {
      userId,
      status: 'ONLINE',
      lastSeen: new Date().toISOString(),
    };
    this.presenceState.set(userId, presence);

    return { statusChanged: wasOffline, presence };
  }

  /**
   * Unregister a socket connection for a user.
   * Returns true only if the user has 0 remaining connections (transitioned to OFFLINE).
   */
  public unregisterConnection(userId: string, socketId: string): { statusChanged: boolean; presence: UserPresence } {
    if (!userId || !socketId) {
      return {
        statusChanged: false,
        presence: { userId, status: 'OFFLINE' },
      };
    }

    presenceService.unregisterConnection(userId, socketId).catch(() => {});

    const sockets = this.userConnections.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userConnections.delete(userId);
      }
    }

    const remainingCount = this.userConnections.get(userId)?.size || 0;
    const isNowOffline = remainingCount === 0;

    const presence: UserPresence = {
      userId,
      status: isNowOffline ? 'OFFLINE' : 'ONLINE',
      lastSeen: new Date().toISOString(),
    };
    this.presenceState.set(userId, presence);

    // Clean up typing indicators when user disconnects completely
    if (isNowOffline) {
      this.clearUserTyping(userId);
    }

    return { statusChanged: isNowOffline, presence };
  }

  /**
   * Get presence for a single user
   */
  public getPresence(userId: string): UserPresence {
    return this.presenceState.get(userId) || {
      userId,
      status: 'OFFLINE',
      lastSeen: undefined,
    };
  }

  /**
   * Get presences for multiple users
   */
  public getPresences(userIds: string[]): Record<string, UserPresence> {
    const result: Record<string, UserPresence> = {};
    for (const id of userIds) {
      result[id] = this.getPresence(id);
    }
    return result;
  }

  /**
   * Get connection count for a user (diagnostic / multi-tab test verification)
   */
  public getConnectionCount(userId: string): number {
    return this.userConnections.get(userId)?.size || 0;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TYPING INDICATORS (EPHEMERAL)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Start typing in a conversation.
   * Cleans up automatically after TYPING_TTL_MS (3000ms).
   */
  public startTyping(
    conversationId: string,
    userId: string,
    userName: string,
    onExpire?: (convId: string, uId: string, uName: string) => void
  ): boolean {
    if (!conversationId || !userId) return false;

    // Apply typing rate limit
    if (!this.checkTypingRateLimit(userId)) {
      return false;
    }

    let convTyping = this.typingState.get(conversationId);
    if (!convTyping) {
      convTyping = new Map();
      this.typingState.set(conversationId, convTyping);
    }

    const existing = convTyping.get(userId);
    if (existing?.timer) {
      clearTimeout(existing.timer);
    }

    const expiresAt = Date.now() + this.TYPING_TTL_MS;
    const timer = setTimeout(() => {
      this.stopTyping(conversationId, userId);
      onExpire?.(conversationId, userId, userName);
    }, this.TYPING_TTL_MS);

    convTyping.set(userId, { userName, expiresAt, timer });
    return true;
  }

  /**
   * Stop typing in a conversation
   */
  public stopTyping(conversationId: string, userId: string): boolean {
    const convTyping = this.typingState.get(conversationId);
    if (!convTyping) return false;

    const existing = convTyping.get(userId);
    if (existing?.timer) {
      clearTimeout(existing.timer);
    }

    const removed = convTyping.delete(userId);
    if (convTyping.size === 0) {
      this.typingState.delete(conversationId);
    }
    return removed;
  }

  /**
   * Get active typers for a conversation
   */
  public getActiveTypers(conversationId: string): Array<{ userId: string; userName: string }> {
    const convTyping = this.typingState.get(conversationId);
    if (!convTyping) return [];

    const now = Date.now();
    const typers: Array<{ userId: string; userName: string }> = [];

    for (const [uid, info] of convTyping.entries()) {
      if (info.expiresAt > now) {
        typers.push({ userId: uid, userName: info.userName });
      } else {
        if (info.timer) clearTimeout(info.timer);
        convTyping.delete(uid);
      }
    }

    return typers;
  }

  /**
   * Clear all typing state for a user across all conversations
   */
  public clearUserTyping(userId: string): void {
    for (const [convId, convTyping] of this.typingState.entries()) {
      const existing = convTyping.get(userId);
      if (existing?.timer) {
        clearTimeout(existing.timer);
      }
      convTyping.delete(userId);
      if (convTyping.size === 0) {
        this.typingState.delete(convId);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // RATE LIMITING
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Check message rate limit for a user (sliding window)
   */
  public checkMessageRateLimit(userId: string): boolean {
    const now = Date.now();
    const timestamps = this.messageRateLimits.get(userId) || [];
    const valid = timestamps.filter(t => now - t < this.MESSAGE_RATE_LIMIT_WINDOW_MS);

    if (valid.length >= this.MESSAGE_MAX_PER_WINDOW) {
      return false;
    }

    valid.push(now);
    this.messageRateLimits.set(userId, valid);
    return true;
  }

  /**
   * Check typing event rate limit for a user (sliding window)
   */
  private checkTypingRateLimit(userId: string): boolean {
    const now = Date.now();
    const timestamps = this.typingRateLimits.get(userId) || [];
    const valid = timestamps.filter(t => now - t < this.TYPING_RATE_LIMIT_WINDOW_MS);

    if (valid.length >= this.TYPING_MAX_PER_WINDOW) {
      return false;
    }

    valid.push(now);
    this.typingRateLimits.set(userId, valid);
    return true;
  }

  /**
   * Reset all state (useful for tests)
   */
  public reset(): void {
    for (const [, convTyping] of this.typingState.entries()) {
      for (const [, info] of convTyping.entries()) {
        if (info.timer) clearTimeout(info.timer);
      }
    }
    this.userConnections.clear();
    this.presenceState.clear();
    this.typingState.clear();
    this.messageRateLimits.clear();
    this.typingRateLimits.clear();
    presenceService.reset().catch(() => {});
  }
}

export const redisPresenceService = new RedisPresenceService();
