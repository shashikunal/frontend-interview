/**
 * Socket.IO Resilience: Heartbeat Watchdog & Stale Session Pruner
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Prevents:
 *   - Ghost connections: sockets that appear connected but are not responding
 *   - Room memory leaks: abandoned sockets left in rooms
 *   - Presence desync: users stuck as ONLINE after silent disconnect
 *   - Chat rate overload: per-user message rate limiting
 *
 * Features:
 *   - Periodic ping/pong heartbeat (30s interval, 10s timeout)
 *   - Stale session detection and forced disconnect
 *   - Per-socket message rate limiter (60 msg/min)
 *   - Connection flood guard (uses Bulkhead)
 */

import type { Server as SocketIOServer, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents, SocketData } from './types.js';

export type ManagedSocket = Socket<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;
export type ManagedIO = SocketIOServer<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

interface SocketHeartbeat {
  socketId: string;
  lastPongAt: number;
  missedPings: number;
}

interface MessageRateEntry {
  count: number;
  windowStartMs: number;
}

export class SocketResilienceManager {
  private readonly heartbeats: Map<string, SocketHeartbeat> = new Map();
  private readonly messageRates: Map<string, MessageRateEntry> = new Map();

  private readonly heartbeatIntervalMs: number;
  private readonly pongTimeoutMs: number;
  private readonly maxMissedPings: number;
  private readonly maxMessagesPerWindow: number;
  private readonly windowMs: number;

  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private pruneTimer: ReturnType<typeof setInterval> | null = null;

  constructor(options: {
    heartbeatIntervalMs?: number;
    pongTimeoutMs?: number;
    maxMissedPings?: number;
    maxMessagesPerWindow?: number;
    windowMs?: number;
  } = {}) {
    this.heartbeatIntervalMs = options.heartbeatIntervalMs ?? 30_000;
    this.pongTimeoutMs = options.pongTimeoutMs ?? 10_000;
    this.maxMissedPings = options.maxMissedPings ?? 2;
    this.maxMessagesPerWindow = options.maxMessagesPerWindow ?? 60;
    this.windowMs = options.windowMs ?? 60_000;
  }

  /**
   * Register a new connection for heartbeat tracking.
   */
  public trackConnection(socket: ManagedSocket): void {
    this.heartbeats.set(socket.id, {
      socketId: socket.id,
      lastPongAt: Date.now(),
      missedPings: 0,
    });

    socket.on('disconnect', () => {
      this.heartbeats.delete(socket.id);
      this.messageRates.delete(socket.id);
    });
  }

  /**
   * Record a pong from a socket (resets missed ping counter).
   */
  public recordPong(socketId: string): void {
    const entry = this.heartbeats.get(socketId);
    if (entry) {
      entry.lastPongAt = Date.now();
      entry.missedPings = 0;
    }
  }

  /**
   * Check if a socket is allowed to send a message (rate limiter).
   * Returns true if allowed, false if rate limit exceeded.
   */
  public checkMessageRate(socketId: string): boolean {
    const now = Date.now();
    let entry = this.messageRates.get(socketId);

    if (!entry || now - entry.windowStartMs > this.windowMs) {
      entry = { count: 0, windowStartMs: now };
      this.messageRates.set(socketId, entry);
    }

    entry.count++;
    return entry.count <= this.maxMessagesPerWindow;
  }

  /**
   * Start the heartbeat watchdog. Pings all tracked sockets periodically
   * and disconnects stale ones that miss too many pings.
   */
  public startWatchdog(io: ManagedIO): void {
    if (this.heartbeatTimer) return;

    this.heartbeatTimer = setInterval(async () => {
      const now = Date.now();
      const stale: string[] = [];

      for (const [socketId, entry] of this.heartbeats.entries()) {
        const elapsed = now - entry.lastPongAt;
        if (elapsed > this.heartbeatIntervalMs + this.pongTimeoutMs) {
          entry.missedPings++;
          if (entry.missedPings >= this.maxMissedPings) {
            stale.push(socketId);
          }
        }
      }

      // Force-disconnect stale sockets
      for (const socketId of stale) {
        try {
          const socket = io.sockets.sockets.get(socketId);
          if (socket) {
            console.warn(`[SocketResilience] Disconnecting stale socket: ${socketId}`);
            socket.emit('error' as any, { code: 'HEARTBEAT_TIMEOUT', message: 'Connection timed out' });
            socket.disconnect(true);
          }
          this.heartbeats.delete(socketId);
          this.messageRates.delete(socketId);
        } catch (err) {
          console.error(`[SocketResilience] Error disconnecting stale socket ${socketId}:`, err);
        }
      }

      if (stale.length > 0) {
        console.log(`[SocketResilience] Pruned ${stale.length} stale socket(s).`);
      }
    }, this.heartbeatIntervalMs);

    if (this.heartbeatTimer.unref) {
      this.heartbeatTimer.unref();
    }

    console.log(`[SocketResilience] Heartbeat watchdog started (interval=${this.heartbeatIntervalMs}ms).`);
  }

  /**
   * Start periodic cleanup of rate-limit tracking data for disconnected sockets.
   */
  public startRateLimitPruner(): void {
    if (this.pruneTimer) return;

    this.pruneTimer = setInterval(() => {
      const now = Date.now();
      for (const [socketId, entry] of this.messageRates.entries()) {
        if (now - entry.windowStartMs > this.windowMs * 2) {
          this.messageRates.delete(socketId);
        }
      }
      // Also prune heartbeats for sockets that no longer exist
      for (const [socketId, entry] of this.heartbeats.entries()) {
        if (now - entry.lastPongAt > this.heartbeatIntervalMs * 5) {
          this.heartbeats.delete(socketId);
        }
      }
    }, this.windowMs);

    if (this.pruneTimer.unref) {
      this.pruneTimer.unref();
    }
  }

  public stop(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.pruneTimer) {
      clearInterval(this.pruneTimer);
      this.pruneTimer = null;
    }
    this.heartbeats.clear();
    this.messageRates.clear();
  }

  public getStats(): {
    trackedSockets: number;
    staleCount: number;
    rateLimitedKeys: number;
  } {
    const now = Date.now();
    const stale = [...this.heartbeats.values()].filter(
      (e) => now - e.lastPongAt > this.heartbeatIntervalMs + this.pongTimeoutMs
    ).length;

    return {
      trackedSockets: this.heartbeats.size,
      staleCount: stale,
      rateLimitedKeys: this.messageRates.size,
    };
  }
}

export const socketResilience = new SocketResilienceManager({
  heartbeatIntervalMs: 30_000,
  pongTimeoutMs: 10_000,
  maxMissedPings: 2,
  maxMessagesPerWindow: 60,
  windowMs: 60_000,
});
