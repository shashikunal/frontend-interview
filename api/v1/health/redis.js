// Health Check API: /api/v1/health/redis
// Phase 8: Redis Architecture, Presence & Distributed Rate Limiting Observability

import { redisClient } from '../../../server/redis/redisClient.ts';
import { rateLimiter } from '../../../server/redis/rateLimiter.ts';
import { cacheService } from '../../../server/redis/cacheService.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const health = await redisClient.checkHealth();
    const rateLimitMetrics = rateLimiter.getMetrics();
    const cacheMetrics = cacheService.getMetrics();

    const response = {
      timestamp: new Date().toISOString(),
      service: 'redis',
      ...health,
      rateLimiter: rateLimitMetrics,
      cache: cacheMetrics,
    };

    // Return 200 OK even if DEGRADED, because the in-memory fallback guarantees full application availability
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json({
      timestamp: new Date().toISOString(),
      service: 'redis',
      status: 'DOWN',
      error: err?.message || 'Failed to inspect Redis health',
    });
  }
}
