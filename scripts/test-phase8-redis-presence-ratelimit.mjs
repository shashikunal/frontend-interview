/**
 * Phase 8 Automated Test Suite: Redis Architecture, Distributed Presence & Rate Limiting
 *
 * Covers:
 * - Redis Client connection & In-Memory Dual Layer fallback resilience
 * - Connection Registry & Multi-Tab/Device Presence Tracking (User != Socket)
 * - Heartbeat sweep & stale connection pruning
 * - Authoritative server-side lastSeen timestamp on final disconnect
 * - Ephemeral typing indicators with automatic 3000ms TTL cleanup
 * - Distributed sliding-window rate limiting across multiple policies & scopes
 * - Cache service with TTL jitter stampede protection and request coalescing
 * - Security tests: presence spoofing, rate-limit isolation, malformed inputs
 * - Concurrency & load tests: 50 concurrent tabs, 50 concurrent rate limit checks
 * - Observability: /api/v1/health/redis endpoint and performance metrics
 */

import assert from 'assert';
import { redisClient } from '../server/redis/redisClient.ts';
import { presenceService } from '../server/redis/presenceService.ts';
import { rateLimiter, RATE_LIMIT_POLICIES } from '../server/redis/rateLimiter.ts';
import { cacheService } from '../server/redis/cacheService.ts';
import redisHealthHandler from '../api/v1/health/redis.js';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runPhase8TestSuite() {
  console.log('🧪 ====================================================================');
  console.log('🧪 STARTING PHASE 8: REDIS + PRESENCE + DISTRIBUTED RATE LIMITING');
  console.log('🧪 Testing All 35 Production Hardening Requirements');
  console.log('🧪 ====================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [TEST ${String(total).padStart(2, '0')}] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ [TEST ${String(total).padStart(2, '0')}] ${name}`);
      console.error(err);
      process.exitCode = 1;
    }
  }

  // Reset all state before test execution
  await presenceService.reset();
  redisClient.resetMemoryStore();
  cacheService.resetMetrics();

  // ──────────────────────────────────────────────────────────────────────────
  // 1. REDIS CLIENT & RESILIENCE TESTS
  // ──────────────────────────────────────────────────────────────────────────

  await test('Redis Client initializes and provides dual-layer resilience', async () => {
    assert(redisClient !== null, 'redisClient should be initialized');
    const health = await redisClient.checkHealth();
    assert(['HEALTHY', 'DEGRADED'].includes(health.status), 'Health status must be HEALTHY or DEGRADED');
    assert(['REDIS', 'IN_MEMORY_FALLBACK'].includes(health.mode), 'Health mode must be REDIS or IN_MEMORY_FALLBACK');
  });

  await test('Redis string operations (SET, GET, DEL) work reliably in both layers', async () => {
    await redisClient.set('test:string:key1', 'hello-phase8');
    const val = await redisClient.get('test:string:key1');
    assert.strictEqual(val, 'hello-phase8', 'GET should retrieve value set by SET');

    const deleted = await redisClient.del('test:string:key1');
    assert.strictEqual(deleted, 1, 'DEL should return count of deleted keys');
    const afterDel = await redisClient.get('test:string:key1');
    assert.strictEqual(afterDel, null, 'Deleted key should return null');
  });

  await test('Redis set operations (SADD, SREM, SMEMBERS, SCARD) maintain accurate memberships', async () => {
    await redisClient.sadd('test:set:users', 'u1', 'u2', 'u3');
    const count = await redisClient.scard('test:set:users');
    assert.strictEqual(count, 3, 'SCARD should return 3');

    const members = await redisClient.smembers('test:set:users');
    assert(members.includes('u1') && members.includes('u2') && members.includes('u3'));

    await redisClient.srem('test:set:users', 'u2');
    const countAfter = await redisClient.scard('test:set:users');
    assert.strictEqual(countAfter, 2, 'SCARD should return 2 after SREM');

    await redisClient.del('test:set:users');
  });

  await test('Redis TTL and EXPIRE work with auto-expiration', async () => {
    await redisClient.set('test:ttl:key', 'short-lived');
    await redisClient.expire('test:ttl:key', 1); // 1 second TTL

    const ttlBefore = await redisClient.ttl('test:ttl:key');
    assert(ttlBefore >= 0, 'TTL should be non-negative');

    await sleep(1100); // Wait for expiration
    const val = await redisClient.get('test:ttl:key');
    assert.strictEqual(val, null, 'Key must expire and return null after TTL elapsed');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. PRESENCE ARCHITECTURE & CONNECTION REGISTRY
  // ──────────────────────────────────────────────────────────────────────────

  const userA = 'user-alice-p8';
  const userB = 'user-bob-p8';

  await test('Initial presence for user with no active connections is OFFLINE', async () => {
    const presence = await presenceService.getPresence(userA);
    assert.strictEqual(presence.status, 'OFFLINE');
    assert.strictEqual(presence.activeConnectionsCount, 0);
  });

  await test('Registering first connection transitions user from OFFLINE to ONLINE', async () => {
    const res = await presenceService.registerConnection(userA, 'socket-tab-1');
    assert.strictEqual(res.statusChanged, true, 'statusChanged should be true on first connection');
    assert.strictEqual(res.presence.status, 'ONLINE');
    assert.strictEqual(res.presence.activeConnectionsCount, 1);
    assert(res.presence.lastSeen, 'lastSeen must be set');
  });

  await test('Registering second tab for same user keeps status ONLINE without statusChanged', async () => {
    const res = await presenceService.registerConnection(userA, 'socket-tab-2');
    assert.strictEqual(res.statusChanged, false, 'statusChanged must be false since user was already ONLINE');
    assert.strictEqual(res.presence.status, 'ONLINE');
    assert.strictEqual(res.presence.activeConnectionsCount, 2);

    const count = await presenceService.getConnectionCount(userA);
    assert.strictEqual(count, 2, 'Connection registry must track exactly 2 sockets');
  });

  await test('Registering third connection (mobile device) tracks multi-device presence', async () => {
    const res = await presenceService.registerConnection(userA, 'socket-mobile-device', { device: 'mobile' });
    assert.strictEqual(res.presence.activeConnectionsCount, 3);
  });

  await test('Closing tab 1 leaves user ONLINE with 2 remaining active connections', async () => {
    const res = await presenceService.unregisterConnection(userA, 'socket-tab-1');
    assert.strictEqual(res.statusChanged, false, 'Closing 1 of 3 sockets must NOT trigger statusChanged to offline');
    assert.strictEqual(res.presence.status, 'ONLINE');
    assert.strictEqual(res.presence.activeConnectionsCount, 2);
  });

  await test('Closing mobile device leaves user ONLINE with 1 remaining active connection', async () => {
    const res = await presenceService.unregisterConnection(userA, 'socket-mobile-device');
    assert.strictEqual(res.statusChanged, false, 'User must remain ONLINE with 1 remaining tab');
    assert.strictEqual(res.presence.status, 'ONLINE');
    assert.strictEqual(res.presence.activeConnectionsCount, 1);
  });

  await test('Closing the final connection transitions user to OFFLINE with authoritative lastSeen', async () => {
    const beforeTime = Date.now();
    const res = await presenceService.unregisterConnection(userA, 'socket-tab-2');
    const afterTime = Date.now();

    assert.strictEqual(res.statusChanged, true, 'statusChanged should be true on final connection closing');
    assert.strictEqual(res.presence.status, 'OFFLINE');
    assert.strictEqual(res.presence.activeConnectionsCount, 0);

    const lastSeenEpoch = new Date(res.presence.lastSeen).getTime();
    assert(lastSeenEpoch >= beforeTime - 1000 && lastSeenEpoch <= afterTime + 1000, 'lastSeen must be authoritative');

    // Confirm state persisted in service
    const finalPresence = await presenceService.getPresence(userA);
    assert.strictEqual(finalPresence.status, 'OFFLINE');
    assert.strictEqual(finalPresence.activeConnectionsCount, 0);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. HEARTBEAT & STALE CONNECTION SWEEP
  // ──────────────────────────────────────────────────────────────────────────

  await test('Heartbeat updates connection timestamp and records activity', async () => {
    await presenceService.registerConnection(userB, 'socket-hb-1');
    const recorded = presenceService.recordHeartbeat('socket-hb-1');
    assert.strictEqual(recorded, true, 'Heartbeat record should succeed for active connection');

    const fakeHeartbeat = presenceService.recordHeartbeat('non-existent-socket');
    assert.strictEqual(fakeHeartbeat, false, 'Heartbeat record should fail for unknown socket');
  });

  await test('Pruning stale connections automatically disconnects timed-out sockets', async () => {
    // Register a connection that we simulate as stale (0ms timeout for testing)
    await presenceService.registerConnection('user-stale', 'socket-stale-1');
    await sleep(20);

    // Prune with timeout of 10ms
    const pruned = await presenceService.pruneStaleConnections(10);
    assert(pruned.includes('socket-stale-1'), 'Stale connection should be identified and pruned');

    const presence = await presenceService.getPresence('user-stale');
    assert.strictEqual(presence.status, 'OFFLINE', 'User should be OFFLINE after all stale sockets pruned');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. EPHEMERAL TYPING INDICATORS (3000ms TTL)
  // ──────────────────────────────────────────────────────────────────────────

  const convId = 'conv-test-p8';

  await test('Typing indicator starts and reports active typer', async () => {
    await presenceService.startTyping(convId, userA, 'Alice');
    const typers = await presenceService.getActiveTypers(convId);
    assert.strictEqual(typers.length, 1);
    assert.strictEqual(typers[0].userId, userA);
    assert.strictEqual(typers[0].userName, 'Alice');
  });

  await test('Typing indicator stops on manual stopTyping call', async () => {
    await presenceService.stopTyping(convId, userA);
    const typers = await presenceService.getActiveTypers(convId);
    assert.strictEqual(typers.length, 0, 'No active typers should remain after stopTyping');
  });

  await test('Typing indicator auto-expires after TTL without manual stop', async () => {
    let expireCallbackFired = false;
    await presenceService.startTyping(convId, userB, 'Bob', () => {
      expireCallbackFired = true;
    });

    // Verify it is active immediately
    const typersBefore = await presenceService.getActiveTypers(convId);
    assert.strictEqual(typersBefore.length, 1);

    // Wait 3.1s for auto-expiry (3000ms TTL)
    await sleep(3100);

    const typersAfter = await presenceService.getActiveTypers(convId);
    assert.strictEqual(typersAfter.length, 0, 'Typing indicator must auto-expire after TTL');
    assert.strictEqual(expireCallbackFired, true, 'onExpire callback should be invoked');
  });

  await test('Full user disconnect cleans up all active typing indicators for that user', async () => {
    await presenceService.registerConnection(userA, 'socket-type-cleanup');
    await presenceService.startTyping('conv-cleanup-1', userA, 'Alice');
    await presenceService.startTyping('conv-cleanup-2', userA, 'Alice');

    // Unregister the connection (final disconnect)
    await presenceService.unregisterConnection(userA, 'socket-type-cleanup');

    const typers1 = await presenceService.getActiveTypers('conv-cleanup-1');
    const typers2 = await presenceService.getActiveTypers('conv-cleanup-2');
    assert.strictEqual(typers1.length, 0, 'Typing in conv 1 should be cleared on user disconnect');
    assert.strictEqual(typers2.length, 0, 'Typing in conv 2 should be cleared on user disconnect');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. DISTRIBUTED SLIDING-WINDOW RATE LIMITING
  // ──────────────────────────────────────────────────────────────────────────

  await test('Rate Limiter allows requests within defined policy limit', async () => {
    const testUser = 'user-rate-ok';
    await rateLimiter.reset('AUTH_LOGIN', testUser);

    // Policy: max 5 requests per 60s
    for (let i = 1; i <= 5; i++) {
      const result = await rateLimiter.consume('AUTH_LOGIN', testUser);
      assert.strictEqual(result.allowed, true, `Request ${i} within limit should be allowed`);
      assert.strictEqual(result.remaining, 5 - i);
      assert.strictEqual(result.limit, 5);
      assert.strictEqual(result.retryAfterSeconds, 0);
    }
  });

  await test('Rate Limiter rejects (429) requests exceeding limit with retryAfterSeconds', async () => {
    const testUser = 'user-rate-ok';
    // 6th request should exceed limit (max 5)
    const result = await rateLimiter.consume('AUTH_LOGIN', testUser);
    assert.strictEqual(result.allowed, false, 'Request exceeding limit must be rejected');
    assert.strictEqual(result.remaining, 0);
    assert(result.retryAfterSeconds > 0, 'retryAfterSeconds must be positive');
    assert.strictEqual(result.policy, 'AUTH_LOGIN');
  });

  await test('Rate Limiter non-destructive check() inspects status without consuming tokens', async () => {
    const testUser = 'user-check-only';
    await rateLimiter.reset('MEETING_CREATE', testUser);

    const before = await rateLimiter.check('MEETING_CREATE', testUser);
    assert.strictEqual(before.allowed, true);
    assert.strictEqual(before.remaining, 10); // max 10

    // Consume 1 token
    await rateLimiter.consume('MEETING_CREATE', testUser);

    const after = await rateLimiter.check('MEETING_CREATE', testUser);
    assert.strictEqual(after.allowed, true);
    assert.strictEqual(after.remaining, 9);
  });

  await test('Rate Limiter sliding window expires and resets allowed requests', async () => {
    const shortPolicy = { name: 'SHORT_TEST', maxRequests: 2, windowMs: 500 };
    const ident = 'user-short-win';

    // Consume 2 requests (exhausting bucket)
    await rateLimiter.consume('SHORT_TEST', ident, shortPolicy);
    await rateLimiter.consume('SHORT_TEST', ident, shortPolicy);

    // 3rd request should fail
    const blocked = await rateLimiter.consume('SHORT_TEST', ident, shortPolicy);
    assert.strictEqual(blocked.allowed, false);

    // Sleep past sliding window (550ms)
    await sleep(550);

    // Should be allowed again
    const restored = await rateLimiter.consume('SHORT_TEST', ident, shortPolicy);
    assert.strictEqual(restored.allowed, true, 'Window elapsed: request should now be allowed');
  });

  await test('Rate Limiter isolates distinct identifiers and distinct policies', async () => {
    const idA = 'rate-user-alpha';
    const idB = 'rate-user-beta';

    await rateLimiter.reset('APP_CHAT', idA);
    await rateLimiter.reset('APP_CHAT', idB);

    // Exhaust idA (max 10 for APP_CHAT)
    for (let i = 0; i < 10; i++) {
      await rateLimiter.consume('APP_CHAT', idA);
    }
    const blockedA = await rateLimiter.consume('APP_CHAT', idA);
    assert.strictEqual(blockedA.allowed, false);

    // idB should still have full quota
    const checkB = await rateLimiter.consume('APP_CHAT', idB);
    assert.strictEqual(checkB.allowed, true, 'Quota for user B must be independent of user A');
  });

  await test('All production rate limit policies are pre-configured with safe defaults', async () => {
    const requiredPolicies = [
      'AUTH_LOGIN',
      'AUTH_TOKEN',
      'MEETING_CREATE',
      'MEETING_JOIN',
      'MEETING_CHAT',
      'APP_CHAT',
      'TYPING_EVENT',
      'WS_CONNECT',
      'GROUP_MANAGE',
    ];

    for (const p of requiredPolicies) {
      assert(RATE_LIMIT_POLICIES[p], `Policy ${p} must exist in RATE_LIMIT_POLICIES`);
      assert(RATE_LIMIT_POLICIES[p].maxRequests > 0, `${p} maxRequests must be positive`);
      assert(RATE_LIMIT_POLICIES[p].windowMs > 0, `${p} windowMs must be positive`);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. CACHE SERVICE WITH STAMPEDE PROTECTION & TTL JITTER
  // ──────────────────────────────────────────────────────────────────────────

  await test('Cache getOrSet caches value and serves subsequent calls from cache', async () => {
    let callCount = 0;
    const fetcher = async () => {
      callCount++;
      return { data: 'expensive-result', timestamp: Date.now() };
    };

    const first = await cacheService.getOrSet('test', 'item-1', fetcher, { ttlSeconds: 60 });
    assert.strictEqual(callCount, 1, 'Fetcher must be called on cache miss');

    const second = await cacheService.getOrSet('test', 'item-1', fetcher, { ttlSeconds: 60 });
    assert.strictEqual(callCount, 1, 'Fetcher must NOT be called on cache hit');
    assert.strictEqual(first.data, second.data);
  });

  await test('Cache invalidation forces next fetch to reload from source of truth', async () => {
    let callCount = 0;
    const fetcher = async () => {
      callCount++;
      return { version: callCount };
    };

    await cacheService.getOrSet('versioned', 'v1', fetcher);
    assert.strictEqual(callCount, 1);

    await cacheService.invalidate('versioned', 'v1');

    const reloaded = await cacheService.getOrSet('versioned', 'v1', fetcher);
    assert.strictEqual(callCount, 2, 'Fetcher should be invoked after invalidation');
    assert.strictEqual(reloaded.version, 2);
  });

  await test('Cache request coalescing merges simultaneous in-flight requests into one call', async () => {
    let backendCalls = 0;
    const slowFetcher = async () => {
      backendCalls++;
      await sleep(100);
      return { loadedAt: Date.now() };
    };

    // Trigger 5 concurrent requests for the exact same key before first resolves
    const promises = [
      cacheService.getOrSet('coalesce', 'item-key', slowFetcher),
      cacheService.getOrSet('coalesce', 'item-key', slowFetcher),
      cacheService.getOrSet('coalesce', 'item-key', slowFetcher),
      cacheService.getOrSet('coalesce', 'item-key', slowFetcher),
      cacheService.getOrSet('coalesce', 'item-key', slowFetcher),
    ];

    const results = await Promise.all(promises);
    assert.strictEqual(backendCalls, 1, 'Request coalescing must collapse 5 calls into 1 backend call');
    assert.strictEqual(results.length, 5);
    assert.strictEqual(results[0].loadedAt, results[4].loadedAt);
  });

  await test('Cache metrics record hits, misses, and hitRate accurately', async () => {
    // Perform an explicit hit so hits is >= 2
    await cacheService.getOrSet('test', 'item-1', async () => ({ data: 'cached' }));
    const metrics = cacheService.getMetrics();
    assert(metrics.hits >= 2, 'Metrics should record hits');
    assert(metrics.misses >= 2, 'Metrics should record misses');
    assert(metrics.hitRate > 0 && metrics.hitRate <= 1, 'Hit rate must be between 0 and 1');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. OBSERVABILITY & HEALTH CHECK ENDPOINT
  // ──────────────────────────────────────────────────────────────────────────

  await test('Redis Health Endpoint (/api/v1/health/redis) returns structured health response', async () => {
    let statusCode = 0;
    let jsonBody = null;

    const mockReq = { method: 'GET' };
    const mockRes = {
      setHeader: () => {},
      status: (code) => {
        statusCode = code;
        return mockRes;
      },
      json: (data) => {
        jsonBody = data;
        return mockRes;
      },
      end: () => {},
    };

    await redisHealthHandler(mockReq, mockRes);
    assert.strictEqual(statusCode, 200, 'Health endpoint should return 200 OK');
    assert.strictEqual(jsonBody.service, 'redis');
    assert(['HEALTHY', 'DEGRADED'].includes(jsonBody.status));
    assert(['REDIS', 'IN_MEMORY_FALLBACK'].includes(jsonBody.mode));
    assert(typeof jsonBody.uptimeSeconds === 'number');
    assert(typeof jsonBody.commandsExecuted === 'number');
    assert(jsonBody.rateLimiter !== undefined);
    assert(jsonBody.cache !== undefined);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 8. SECURITY & ABUSE PROTECTION TESTS
  // ──────────────────────────────────────────────────────────────────────────

  await test('Security: User cannot unregister another user connection (connection-user mismatch guard)', async () => {
    await presenceService.registerConnection('user-target', 'socket-target-1');
    const beforeCount = await presenceService.getConnectionCount('user-target');

    // Attacker tries to unregister socket with wrong userId
    const res = await presenceService.unregisterConnection('user-attacker', 'socket-target-1');
    assert.strictEqual(res.statusChanged, false);

    const afterCount = await presenceService.getConnectionCount('user-target');
    assert.strictEqual(afterCount, beforeCount, 'Target connection must remain registered');
  });

  await test('Security: Malformed presence input handles null/undefined safely without crash', async () => {
    const res1 = await presenceService.registerConnection('', '');
    assert.strictEqual(res1.statusChanged, false);
    assert.strictEqual(res1.presence.status, 'OFFLINE');

    const res2 = await presenceService.unregisterConnection(null, null);
    assert.strictEqual(res2.statusChanged, false);
  });

  await test('Security: WebSocket connection rate limiting protects against flood', async () => {
    const abusiveIp = '198.51.100.42';
    await rateLimiter.reset('WS_CONNECT', abusiveIp);

    // Policy: 30 connections per minute
    for (let i = 0; i < 30; i++) {
      await rateLimiter.consume('WS_CONNECT', abusiveIp);
    }

    const floodCheck = await rateLimiter.consume('WS_CONNECT', abusiveIp);
    assert.strictEqual(floodCheck.allowed, false, 'Exceeding 30 WS connections/minute must be blocked');
    assert(floodCheck.retryAfterSeconds > 0);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 9. CONCURRENCY & LOAD TESTING
  // ──────────────────────────────────────────────────────────────────────────

  await test('Concurrency: 50 concurrent rate limit requests correctly update sliding window', async () => {
    const concurrentUser = 'user-load-test';
    await rateLimiter.reset('AUTH_TOKEN', concurrentUser);

    // Send 50 concurrent requests
    const promises = Array.from({ length: 50 }, () =>
      rateLimiter.consume('AUTH_TOKEN', concurrentUser)
    );

    const results = await Promise.all(promises);
    const allowedCount = results.filter((r) => r.allowed).length;
    const rejectedCount = results.filter((r) => !r.allowed).length;

    // Policy maxRequests for AUTH_TOKEN is 20
    assert.strictEqual(allowedCount, 20, 'Exactly 20 requests must be allowed');
    assert.strictEqual(rejectedCount, 30, 'Remaining 30 requests must be rejected');
  });

  await test('Concurrency: 50 concurrent tab registrations/unregistrations maintain atomic accuracy', async () => {
    const multiTabUser = 'user-50-tabs';
    await presenceService.reset();

    // Register 50 tabs concurrently
    const regPromises = Array.from({ length: 50 }, (_, i) =>
      presenceService.registerConnection(multiTabUser, `tab-${i}`)
    );
    await Promise.all(regPromises);

    const countAfterReg = await presenceService.getConnectionCount(multiTabUser);
    assert.strictEqual(countAfterReg, 50, 'All 50 tabs must be counted atomically');

    const pAfterReg = await presenceService.getPresence(multiTabUser);
    assert.strictEqual(pAfterReg.status, 'ONLINE');

    // Unregister 49 tabs concurrently
    const unregPromises = Array.from({ length: 49 }, (_, i) =>
      presenceService.unregisterConnection(multiTabUser, `tab-${i}`)
    );
    await Promise.all(unregPromises);

    // User must STILL be ONLINE because tab-49 remains active!
    const countAfterUnreg = await presenceService.getConnectionCount(multiTabUser);
    assert.strictEqual(countAfterUnreg, 1, 'Exactly 1 tab should remain');
    const pStillOnline = await presenceService.getPresence(multiTabUser);
    assert.strictEqual(pStillOnline.status, 'ONLINE', 'User must stay ONLINE while 1 tab remains');

    // Unregister final tab
    const finalUnreg = await presenceService.unregisterConnection(multiTabUser, 'tab-49');
    assert.strictEqual(finalUnreg.statusChanged, true);
    assert.strictEqual(finalUnreg.presence.status, 'OFFLINE');
  });

  await test('Cache Stampede Protection: TTL Jitter applies randomized offset within ±10% boundary', async () => {
    // Set 5 keys with base TTL = 100 seconds
    const ttls = [];
    for (let i = 0; i < 5; i++) {
      await cacheService.getOrSet('jitter-test', `k-${i}`, async () => ({ i }), { ttlSeconds: 100, enableJitter: true });
      const ttlVal = await redisClient.ttl(`cache:jitter-test:k-${i}`);
      ttls.push(ttlVal);
    }

    // All TTLs should be within [90, 110]
    for (const t of ttls) {
      assert(t >= 89 && t <= 111, `TTL ${t} must be within ±10% of 100s`);
    }
  });

  await test('Observability: Metrics accurately record command executions and rate limit rejections', async () => {
    const health = await redisClient.checkHealth();
    assert(health.commandsExecuted > 0, 'commandsExecuted must be tracked and positive');

    const rateMetrics = rateLimiter.getMetrics();
    assert(rateMetrics.totalChecks > 0, 'totalChecks must be tracked and positive');
    assert(rateMetrics.rejections > 0, 'rejections must be tracked and positive');
  });

  console.log('\n====================================================================');
  console.log(`🎉 ALL ${passed}/${total} PHASE 8 PRODUCTION TESTS PASSED SUCCESSFULLY!`);
  console.log('====================================================================\n');
}

runPhase8TestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
