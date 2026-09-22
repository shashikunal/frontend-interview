/**
 * Distributed Presence, Connection Registry & Ephemeral Realtime State
 * Phase 8: Redis + Presence + Distributed Rate Limiting
 *
 * Implements:
 * - Connection Registry (unique connectionId per tab/device socket)
 * - Atomic connection counting per user (`presence:connections:{userId}`)
 * - Multi-tab and multi-device presence synchronization (User != Socket)
 * - Heartbeat sweep and stale connection pruning
 * - Ephemeral typing indicators with auto-expiry (3000ms TTL)
 * - Server-authoritative last-seen timestamps on final disconnect
 */

import { redisClient } from './redisClient.ts';

export interface UserPresence {
  userId: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen?: string;
  activeConnectionsCount: number;
}

export interface ConnectionInfo {
  connectionId: string;
  userId: string;
  connectedAt: string;
  lastHeartbeat: number;
  metadata?: Record<string, any>;
}

export class DistributedPresenceService {
  // Local active connection registry: connectionId -> ConnectionInfo
  private connections: Map<string, ConnectionInfo> = new Map();
  // Ephemeral typing timers for local callbacks: conversationId -> Map<userId, Timeout>
  private typingTimers: Map<string, Map<string, NodeJS.Timeout>> = new Map();

  private readonly TYPING_TTL_SECONDS = 3;
  private readonly HEARTBEAT_STALE_TIMEOUT_MS = 60 * 1000; // 60s without heartbeat is stale

  private userLocks: Map<string, Promise<any>> = new Map();

  // ──────────────────────────────────────────────────────────────────────────
  // CONNECTION REGISTRY & PRESENCE
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Register a new connection for a user
   */
  public async registerConnection(
    userId: string,
    connectionId: string,
    metadata?: Record<string, any>
  ): Promise<{ statusChanged: boolean; presence: UserPresence }> {
    if (!userId || !connectionId) {
      return {
        statusChanged: false,
        presence: { userId, status: 'OFFLINE', activeConnectionsCount: 0 },
      };
    }

    const prevLock = this.userLocks.get(userId) || Promise.resolve();
    let releaseLock!: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.userLocks.set(userId, currentLock);

    try {
      await prevLock;
      return await this.executeRegisterConnection(userId, connectionId, metadata);
    } finally {
      releaseLock();
      if (this.userLocks.get(userId) === currentLock) {
        this.userLocks.delete(userId);
      }
    }
  }

  private async executeRegisterConnection(
    userId: string,
    connectionId: string,
    metadata?: Record<string, any>
  ): Promise<{ statusChanged: boolean; presence: UserPresence }> {
    const now = new Date().toISOString();
    const connKey = `presence:connections:${userId}`;

    // 1. Get count before adding to determine if user transitioned from OFFLINE
    const prevCount = await redisClient.scard(connKey);
    const wasOffline = prevCount === 0;

    // 2. Add connectionId to user's Redis Set
    await redisClient.sadd(connKey, connectionId);
    // Connection key TTL: 2 hours to avoid orphan sets
    await redisClient.expire(connKey, 7200);

    // 3. Register in local connection registry
    this.connections.set(connectionId, {
      connectionId,
      userId,
      connectedAt: now,
      lastHeartbeat: Date.now(),
      metadata,
    });

    const activeCount = await redisClient.scard(connKey);

    // 4. Update user presence key
    const userPresenceKey = `presence:user:${userId}`;
    const presenceData: UserPresence = {
      userId,
      status: 'ONLINE',
      lastSeen: now,
      activeConnectionsCount: activeCount,
    };

    await redisClient.set(userPresenceKey, JSON.stringify(presenceData), 'EX', 86400 * 7); // 7 days

    return {
      statusChanged: wasOffline,
      presence: presenceData,
    };
  }

  /**
   * Unregister a connection for a user.
   * User only transitions to OFFLINE if activeConnectionsCount becomes 0.
   */
  public async unregisterConnection(
    userId: string,
    connectionId: string
  ): Promise<{ statusChanged: boolean; presence: UserPresence }> {
    if (!userId || !connectionId) {
      return {
        statusChanged: false,
        presence: { userId, status: 'OFFLINE', activeConnectionsCount: 0 },
      };
    }

    const prevLock = this.userLocks.get(userId) || Promise.resolve();
    let releaseLock!: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.userLocks.set(userId, currentLock);

    try {
      await prevLock;
      return await this.executeUnregisterConnection(userId, connectionId);
    } finally {
      releaseLock();
      if (this.userLocks.get(userId) === currentLock) {
        this.userLocks.delete(userId);
      }
    }
  }

  private async executeUnregisterConnection(
    userId: string,
    connectionId: string
  ): Promise<{ statusChanged: boolean; presence: UserPresence }> {
    const connKey = `presence:connections:${userId}`;

    // Security check: verify connection ownership
    const existing = this.connections.get(connectionId);
    if (existing && existing.userId !== userId) {
      const currentCount = await redisClient.scard(connKey);
      return {
        statusChanged: false,
        presence: {
          userId,
          status: currentCount > 0 ? 'ONLINE' : 'OFFLINE',
          activeConnectionsCount: currentCount,
        },
      };
    }

    // 1. Remove connection from Redis set
    await redisClient.srem(connKey, connectionId);
    this.connections.delete(connectionId);

    // 2. Count remaining active connections for this user
    const remainingCount = await redisClient.scard(connKey);
    const isNowOffline = remainingCount === 0;
    const now = new Date().toISOString();

    const presenceData: UserPresence = {
      userId,
      status: isNowOffline ? 'OFFLINE' : 'ONLINE',
      lastSeen: now,
      activeConnectionsCount: remainingCount,
    };

    const userPresenceKey = `presence:user:${userId}`;
    await redisClient.set(userPresenceKey, JSON.stringify(presenceData), 'EX', 86400 * 7);

    // Clean up typing indicators when user disconnects completely
    if (isNowOffline) {
      await this.clearUserTyping(userId);
    }

    return {
      statusChanged: isNowOffline,
      presence: presenceData,
    };
  }

  /**
   * Record a heartbeat from a connection
   */
  public recordHeartbeat(connectionId: string): boolean {
    const conn = this.connections.get(connectionId);
    if (!conn) return false;
    conn.lastHeartbeat = Date.now();
    return true;
  }

  /**
   * Prune stale connections that haven't sent a heartbeat within staleTimeoutMs
   */
  public async pruneStaleConnections(staleTimeoutMs = this.HEARTBEAT_STALE_TIMEOUT_MS): Promise<string[]> {
    const now = Date.now();
    const prunedIds: string[] = [];

    for (const [connId, conn] of this.connections.entries()) {
      if (now - conn.lastHeartbeat > staleTimeoutMs) {
        prunedIds.push(connId);
        await this.unregisterConnection(conn.userId, connId);
      }
    }

    return prunedIds;
  }

  /**
   * Get presence for a single user
   */
  public async getPresence(userId: string): Promise<UserPresence> {
    const userPresenceKey = `presence:user:${userId}`;
    const raw = await redisClient.get(userPresenceKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }

    const connKey = `presence:connections:${userId}`;
    const count = await redisClient.scard(connKey);
    return {
      userId,
      status: count > 0 ? 'ONLINE' : 'OFFLINE',
      activeConnectionsCount: count,
    };
  }

  /**
   * Get presences for multiple users
   */
  public async getPresences(userIds: string[]): Promise<Record<string, UserPresence>> {
    const result: Record<string, UserPresence> = {};
    for (const uid of userIds) {
      result[uid] = await this.getPresence(uid);
    }
    return result;
  }

  /**
   * Diagnostic: get connection count for a user
   */
  public async getConnectionCount(userId: string): Promise<number> {
    const connKey = `presence:connections:${userId}`;
    return await redisClient.scard(connKey);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TYPING INDICATORS (EPHEMERAL WITH 3000ms TTL)
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Start typing in a conversation.
   * Key: `typing:conversation:{conversationId}:{userId}` with TTL = 3 seconds.
   */
  public async startTyping(
    conversationId: string,
    userId: string,
    userName: string,
    onExpire?: (convId: string, uId: string, uName: string) => void
  ): Promise<boolean> {
    if (!conversationId || !userId) return false;

    const key = `typing:conversation:${conversationId}:${userId}`;
    await redisClient.set(key, userName, 'EX', this.TYPING_TTL_SECONDS);

    // Setup local timer for cleanup/expiration callback
    let convMap = this.typingTimers.get(conversationId);
    if (!convMap) {
      convMap = new Map();
      this.typingTimers.set(conversationId, convMap);
    }

    const existing = convMap.get(userId);
    if (existing) clearTimeout(existing);

    const timer = setTimeout(() => {
      this.stopTyping(conversationId, userId);
      onExpire?.(conversationId, userId, userName);
    }, this.TYPING_TTL_SECONDS * 1000);

    convMap.set(userId, timer);
    return true;
  }

  /**
   * Stop typing in a conversation
   */
  public async stopTyping(conversationId: string, userId: string): Promise<boolean> {
    const key = `typing:conversation:${conversationId}:${userId}`;
    await redisClient.del(key);

    const convMap = this.typingTimers.get(conversationId);
    if (convMap) {
      const existing = convMap.get(userId);
      if (existing) {
        clearTimeout(existing);
        convMap.delete(userId);
      }
      if (convMap.size === 0) {
        this.typingTimers.delete(conversationId);
      }
    }
    return true;
  }

  /**
   * Get active typers for a conversation
   */
  public async getActiveTypers(conversationId: string): Promise<Array<{ userId: string; userName: string }>> {
    const typers: Array<{ userId: string; userName: string }> = [];
    const convMap = this.typingTimers.get(conversationId);
    if (!convMap) return typers;

    for (const userId of convMap.keys()) {
      const key = `typing:conversation:${conversationId}:${userId}`;
      const name = await redisClient.get(key);
      if (name) {
        typers.push({ userId, userName: name });
      }
    }
    return typers;
  }

  /**
   * Check if a specific user is currently typing in a conversation
   */
  public async isTyping(conversationId: string, userId: string): Promise<boolean> {
    const key = `typing:conversation:${conversationId}:${userId}`;
    const val = await redisClient.get(key);
    return val !== null;
  }

  /**
   * Clear all typing state for a user
   */
  public async clearUserTyping(userId: string): Promise<void> {
    for (const [convId, convMap] of this.typingTimers.entries()) {
      const timer = convMap.get(userId);
      if (timer) {
        clearTimeout(timer);
        convMap.delete(userId);
      }
      const key = `typing:conversation:${convId}:${userId}`;
      await redisClient.del(key);
      if (convMap.size === 0) {
        this.typingTimers.delete(convId);
      }
    }
  }

  /**
   * Reset all state (useful for tests)
   */
  public async reset(): Promise<void> {
    for (const convMap of this.typingTimers.values()) {
      for (const timer of convMap.values()) {
        clearTimeout(timer);
      }
    }
    this.typingTimers.clear();
    this.connections.clear();
    redisClient.resetMemoryStore();
  }
}

export const presenceService = new DistributedPresenceService();
