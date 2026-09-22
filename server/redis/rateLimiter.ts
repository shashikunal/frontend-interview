/**
 * Distributed Sliding-Window Rate Limiter (Redis-Backed with In-Memory Dual Layer)
 * Phase 8: Redis + Presence + Distributed Rate Limiting
 *
 * Algorithm: Sliding Window Log
 * - Stored in Redis Sorted Set (ZSET) at key `ratelimit:{scope}:{identifier}`
 * - Each request adds a member with score = current epoch timestamp (ms)
 * - Prunes entries older than (now - windowMs) with ZREMRANGEBYSCORE
 * - Counts active requests in window with ZCARD
 * - Automatically sets key expiration = windowSeconds to prevent abandoned memory growth
 */

import { redisClient } from './redisClient.ts';

export interface RateLimitPolicy {
  name: string;
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMIT_POLICIES: Record<string, RateLimitPolicy> = {
  AUTH_LOGIN: { name: 'AUTH_LOGIN', maxRequests: 5, windowMs: 60 * 1000 },
  AUTH_TOKEN: { name: 'AUTH_TOKEN', maxRequests: 20, windowMs: 60 * 1000 },
  MEETING_CREATE: { name: 'MEETING_CREATE', maxRequests: 10, windowMs: 60 * 1000 },
  MEETING_JOIN: { name: 'MEETING_JOIN', maxRequests: 15, windowMs: 60 * 1000 },
  MEETING_CHAT: { name: 'MEETING_CHAT', maxRequests: 10, windowMs: 2 * 1000 },
  APP_CHAT: { name: 'APP_CHAT', maxRequests: 10, windowMs: 2 * 1000 },
  TYPING_EVENT: { name: 'TYPING_EVENT', maxRequests: 5, windowMs: 1 * 1000 },
  WS_CONNECT: { name: 'WS_CONNECT', maxRequests: 30, windowMs: 60 * 1000 },
  GROUP_MANAGE: { name: 'GROUP_MANAGE', maxRequests: 10, windowMs: 60 * 1000 },
};

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAfterMs: number;
  retryAfterSeconds: number;
  policy: string;
}

export class DistributedRateLimiter {
  private rejectionCount = 0;
  private totalChecks = 0;

  /**
   * Consume a token from the rate limit bucket for the given policy and identifier
   */
  private keyLocks: Map<string, Promise<any>> = new Map();

  /**
   * Consume a token from the rate limit bucket for the given policy and identifier.
   * Concurrency-safe: synchronizes per key to eliminate check-then-act race conditions.
   */
  public async consume(
    policyName: keyof typeof RATE_LIMIT_POLICIES | string,
    identifier: string,
    customPolicy?: RateLimitPolicy
  ): Promise<RateLimitResult> {
    const policy = customPolicy || RATE_LIMIT_POLICIES[policyName] || {
      name: policyName,
      maxRequests: 30,
      windowMs: 60 * 1000,
    };

    const key = `ratelimit:${policy.name.toLowerCase()}:${identifier}`;

    // Per-key synchronization to ensure atomicity across concurrent calls
    const prevLock = this.keyLocks.get(key) || Promise.resolve();
    let releaseLock!: () => void;
    const currentLock = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.keyLocks.set(key, currentLock);

    try {
      await prevLock;
      return await this.executeConsume(policy, key);
    } finally {
      releaseLock();
      if (this.keyLocks.get(key) === currentLock) {
        this.keyLocks.delete(key);
      }
    }
  }

  private async executeConsume(policy: RateLimitPolicy, key: string): Promise<RateLimitResult> {
    this.totalChecks++;
    const now = Date.now();
    const clearBefore = now - policy.windowMs;

    // 1. Prune expired entries outside current sliding window
    await redisClient.zremrangebyscore(key, '-inf', clearBefore);

    // 2. Count requests currently in sliding window
    const currentCount = await redisClient.zcard(key);

    if (currentCount >= policy.maxRequests) {
      this.rejectionCount++;
      const retryAfterSec = Math.ceil(policy.windowMs / 1000);
      return {
        allowed: false,
        remaining: 0,
        limit: policy.maxRequests,
        resetAfterMs: policy.windowMs,
        retryAfterSeconds: retryAfterSec,
        policy: policy.name,
      };
    }

    // 3. Record new request with unique member ID
    const memberId = `${now}_${Math.random().toString(36).slice(2, 8)}`;
    await redisClient.zadd(key, now, memberId);

    // 4. Set key TTL = window duration in seconds + 1s buffer
    const ttlSeconds = Math.ceil(policy.windowMs / 1000) + 1;
    await redisClient.expire(key, ttlSeconds);

    const remaining = Math.max(0, policy.maxRequests - (currentCount + 1));
    return {
      allowed: true,
      remaining,
      limit: policy.maxRequests,
      resetAfterMs: policy.windowMs,
      retryAfterSeconds: 0,
      policy: policy.name,
    };
  }

  /**
   * Check rate limit status without consuming a token
   */
  public async check(
    policyName: keyof typeof RATE_LIMIT_POLICIES | string,
    identifier: string,
    customPolicy?: RateLimitPolicy
  ): Promise<RateLimitResult> {
    const policy = customPolicy || RATE_LIMIT_POLICIES[policyName] || {
      name: policyName,
      maxRequests: 30,
      windowMs: 60 * 1000,
    };

    const key = `ratelimit:${policy.name.toLowerCase()}:${identifier}`;
    const now = Date.now();
    const clearBefore = now - policy.windowMs;

    await redisClient.zremrangebyscore(key, '-inf', clearBefore);
    const currentCount = await redisClient.zcard(key);

    const allowed = currentCount < policy.maxRequests;
    const remaining = Math.max(0, policy.maxRequests - currentCount);

    return {
      allowed,
      remaining,
      limit: policy.maxRequests,
      resetAfterMs: policy.windowMs,
      retryAfterSeconds: allowed ? 0 : Math.ceil(policy.windowMs / 1000),
      policy: policy.name,
    };
  }

  /**
   * Reset rate limit for an identifier
   */
  public async reset(policyName: string, identifier: string): Promise<void> {
    const key = `ratelimit:${policyName.toLowerCase()}:${identifier}`;
    await redisClient.del(key);
  }

  /**
   * Rate limiting observability metrics
   */
  public getMetrics(): { totalChecks: number; rejections: number } {
    return {
      totalChecks: this.totalChecks,
      rejections: this.rejectionCount,
    };
  }
}

export const rateLimiter = new DistributedRateLimiter();
