/**
 * Redis Cache Service with Cache Stampede Protection & TTL Jitter
 * Phase 8: Redis + Presence + Distributed Rate Limiting
 *
 * Features:
 * - TTL Jitter (±10%) to prevent synchronized thundering herd cache stampedes
 * - Request Coalescing (in-flight promise dedup)
 * - Safe invalidation on entity update
 * - Strict separation: Never caches authorization or secret credential data
 */

import { redisClient } from './redisClient.ts';

export interface CacheOptions {
  ttlSeconds?: number;
  enableJitter?: boolean;
}

export class CacheService {
  private inFlightRequests: Map<string, Promise<any>> = new Map();
  private hits = 0;
  private misses = 0;

  private readonly DEFAULT_TTL_SECONDS = 300; // 5 minutes

  /**
   * Generates TTL with ±10% random jitter to avoid thundering herd stampedes
   */
  private getJitteredTtl(baseTtlSeconds: number): number {
    const jitterRange = baseTtlSeconds * 0.1;
    const randomJitter = (Math.random() * 2 - 1) * jitterRange;
    return Math.max(1, Math.round(baseTtlSeconds + randomJitter));
  }

  /**
   * Get cached item or execute fetcher with request coalescing
   */
  public async getOrSet<T>(
    namespace: string,
    id: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const key = `cache:${namespace}:${id}`;

    // 1. Try reading from cache
    const cached = await redisClient.get(key);
    if (cached !== null) {
      this.hits++;
      try {
        return JSON.parse(cached);
      } catch {
        return cached as any;
      }
    }

    this.misses++;

    // 2. Request Coalescing: check if another request is already fetching this exact key
    if (this.inFlightRequests.has(key)) {
      return await this.inFlightRequests.get(key);
    }

    // 3. Execute fetcher
    const fetchPromise = (async () => {
      try {
        const result = await fetcher();
        if (result !== undefined && result !== null) {
          const baseTtl = options?.ttlSeconds || this.DEFAULT_TTL_SECONDS;
          const ttl = options?.enableJitter !== false ? this.getJitteredTtl(baseTtl) : baseTtl;
          await redisClient.set(key, JSON.stringify(result), 'EX', ttl);
        }
        return result;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, fetchPromise);
    return await fetchPromise;
  }

  /**
   * Invalidate a cached item
   */
  public async invalidate(namespace: string, id: string): Promise<void> {
    const key = `cache:${namespace}:${id}`;
    await redisClient.del(key);
  }

  /**
   * Cache metrics
   */
  public getMetrics(): { hits: number; misses: number; hitRate: number } {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? Number((this.hits / total).toFixed(4)) : 0;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate,
    };
  }

  public resetMetrics(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

export const cacheService = new CacheService();
