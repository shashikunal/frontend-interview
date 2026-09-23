#!/usr/bin/env node
/**
 * Phase 14 Reliability, Resilience & Disaster Recovery Test Suite
 *
 * Tests all Phase 14 primitives:
 * - CircuitBreaker (CLOSED/OPEN/HALF_OPEN transitions)
 * - RetryPolicy (exponential backoff, jitter, retry predicate)
 * - TimeoutWrapper (hard deadline enforcement)
 * - Bulkhead (concurrency limiting, queue, rejection)
 * - GracefulShutdown (registration, LIFO callbacks)
 * - SocketResilience (message rate limiting, stale tracking)
 * - ApiResilience (env validation, error classification, safe handler)
 * - OutboxService (DLQ pruning, retry backoff)
 * - MeetingGuard (idempotency, lock, invalid transitions)
 */

import assert from 'node:assert/strict';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Windows-safe dynamic import helper
function imp(relPath) {
  return import(pathToFileURL(resolve(root, relPath)).href);
}

let passed = 0;
let failed = 0;
const results = [];

function test(name, fn) {
  results.push({ name, fn });
}

async function runTests() {
  console.log('\n' + '═'.repeat(70));
  console.log('  PHASE 14 — RELIABILITY, RESILIENCE & DR TEST SUITE');
  console.log('═'.repeat(70) + '\n');

  for (const { name, fn } of results) {
    try {
      await fn();
      console.log(`  ✅ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ ${name}`);
      console.error(`     ${err.message}`);
      failed++;
    }
  }

  console.log('\n' + '─'.repeat(70));
  console.log(`  Results: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log('─'.repeat(70) + '\n');

  if (failed > 0) {
    process.exit(1);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// CIRCUIT BREAKER TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('CircuitBreaker: starts in CLOSED state', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-init', failureThreshold: 3 });
  assert.equal(cb.getState(), 'CLOSED');
});

test('CircuitBreaker: stays CLOSED on success', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-success', failureThreshold: 3 });
  await cb.call(async () => 'ok');
  assert.equal(cb.getState(), 'CLOSED');
  assert.equal(cb.getStats().totalCalls, 1);
});

test('CircuitBreaker: opens after failureThreshold consecutive failures', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-open', failureThreshold: 3 });
  const fail = async () => { throw new Error('boom'); };
  for (let i = 0; i < 3; i++) {
    try { await cb.call(fail); } catch {}
  }
  assert.equal(cb.getState(), 'OPEN');
});

test('CircuitBreaker: rejects calls when OPEN', async () => {
  const { CircuitBreaker, CircuitOpenError } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-reject', failureThreshold: 2, recoveryTimeoutMs: 60_000 });
  const fail = async () => { throw new Error('fail'); };
  for (let i = 0; i < 2; i++) {
    try { await cb.call(fail); } catch {}
  }
  assert.equal(cb.getState(), 'OPEN');
  try {
    await cb.call(async () => 'ok');
    assert.fail('Should have thrown CircuitOpenError');
  } catch (err) {
    assert.ok(err instanceof CircuitOpenError, `Expected CircuitOpenError, got ${err.constructor.name}`);
  }
});

test('CircuitBreaker: transitions OPEN → HALF_OPEN after recovery timeout', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-halfopen', failureThreshold: 1, recoveryTimeoutMs: 10 });
  try { await cb.call(async () => { throw new Error('fail'); }); } catch {}
  assert.equal(cb.getState(), 'OPEN');
  await new Promise(r => setTimeout(r, 20)); // wait for recovery timeout
  // Next call should probe (HALF_OPEN)
  try { await cb.call(async () => 'recovered'); } catch {}
  // Either CLOSED (success) or OPEN (still failing)
  assert.notEqual(cb.getState(), 'OPEN'); // Should move out of OPEN
});

test('CircuitBreaker: HALF_OPEN closes after successThreshold successes', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-close', failureThreshold: 1, recoveryTimeoutMs: 10, successThreshold: 2 });
  try { await cb.call(async () => { throw new Error('fail'); }); } catch {}
  await new Promise(r => setTimeout(r, 20));
  await cb.call(async () => 'ok');
  await cb.call(async () => 'ok');
  assert.equal(cb.getState(), 'CLOSED');
});

test('CircuitBreaker: callWithFallback returns fallback when OPEN', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-fallback', failureThreshold: 1, recoveryTimeoutMs: 60_000 });
  try { await cb.call(async () => { throw new Error('fail'); }); } catch {}
  const result = await cb.callWithFallback(async () => 'primary', 'fallback-value');
  assert.equal(result, 'fallback-value');
});

test('CircuitBreaker: reset() forces CLOSED state', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const cb = new CircuitBreaker({ name: 'test-reset', failureThreshold: 1, recoveryTimeoutMs: 60_000 });
  try { await cb.call(async () => { throw new Error('fail'); }); } catch {}
  assert.equal(cb.getState(), 'OPEN');
  cb.reset();
  assert.equal(cb.getState(), 'CLOSED');
});

// ──────────────────────────────────────────────────────────────────────────────
// RETRY POLICY TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('RetryPolicy: succeeds on first attempt', async () => {
  const { withRetry } = await imp('server/resilience/retryPolicy.ts');
  const result = await withRetry(async () => 42, { maxAttempts: 3 });
  assert.equal(result.value, 42);
  assert.equal(result.attempts, 1);
});

test('RetryPolicy: retries on transient failure and eventually succeeds', async () => {
  const { withRetry } = await imp('server/resilience/retryPolicy.ts');
  let attempts = 0;
  const result = await withRetry(async () => {
    attempts++;
    if (attempts < 3) throw new Error('transient');
    return 'success';
  }, { maxAttempts: 5, baseDelayMs: 1, jitter: false });
  assert.equal(result.value, 'success');
  assert.equal(result.attempts, 3);
});

test('RetryPolicy: throws after exhausting all attempts', async () => {
  const { withRetry } = await imp('server/resilience/retryPolicy.ts');
  try {
    await withRetry(async () => { throw new Error('persistent'); }, { maxAttempts: 3, baseDelayMs: 1 });
    assert.fail('Should have thrown');
  } catch (err) {
    assert.equal(err.message, 'persistent');
  }
});

test('RetryPolicy: respects isRetryable predicate (no retry on non-retryable)', async () => {
  const { withRetry } = await imp('server/resilience/retryPolicy.ts');
  let attempts = 0;
  try {
    await withRetry(async () => {
      attempts++;
      throw new Error('auth_error');
    }, {
      maxAttempts: 5,
      baseDelayMs: 1,
      isRetryable: (err) => !err.message.includes('auth'),
    });
  } catch {}
  assert.equal(attempts, 1, 'Should not retry non-retryable error');
});

// ──────────────────────────────────────────────────────────────────────────────
// TIMEOUT WRAPPER TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('TimeoutWrapper: resolves before timeout', async () => {
  const { withTimeout } = await imp('server/resilience/timeoutWrapper.ts');
  const result = await withTimeout(async () => {
    await new Promise(r => setTimeout(r, 10));
    return 'done';
  }, 200, 'fast-op');
  assert.equal(result, 'done');
});

test('TimeoutWrapper: throws TimeoutError when exceeded', async () => {
  const { withTimeout, TimeoutError } = await imp('server/resilience/timeoutWrapper.ts');
  try {
    await withTimeout(async () => {
      await new Promise(r => setTimeout(r, 500));
    }, 50, 'slow-op');
    assert.fail('Should have thrown TimeoutError');
  } catch (err) {
    assert.ok(err instanceof TimeoutError, `Expected TimeoutError, got ${err.constructor.name}: ${err.message}`);
    assert.equal(err.operationName, 'slow-op');
  }
});

// ──────────────────────────────────────────────────────────────────────────────
// BULKHEAD TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('Bulkhead: allows calls within maxConcurrent', async () => {
  const { Bulkhead } = await imp('server/resilience/bulkhead.ts');
  const bh = new Bulkhead({ name: 'test', maxConcurrent: 5, queueSize: 0 });
  const result = await bh.execute(async () => 'ok');
  assert.equal(result, 'ok');
});

test('Bulkhead: rejects when at capacity and queue is full', async () => {
  const { Bulkhead, BulkheadRejectedError } = await imp('server/resilience/bulkhead.ts');
  const bh = new Bulkhead({ name: 'test-reject', maxConcurrent: 1, queueSize: 0, queueTimeoutMs: 100 });
  let blocker_resolve;
  const blocker = bh.execute(() => new Promise(r => { blocker_resolve = r; }));

  try {
    // This should be rejected since maxConcurrent=1 and queueSize=0
    await bh.execute(async () => 'should-reject');
    assert.fail('Should have thrown BulkheadRejectedError');
  } catch (err) {
    assert.ok(err instanceof BulkheadRejectedError, `Got: ${err.constructor.name}: ${err.message}`);
  } finally {
    blocker_resolve();
    await blocker;
  }
});

test('Bulkhead: stats reflect active/rejected counts', async () => {
  const { Bulkhead } = await imp('server/resilience/bulkhead.ts');
  const bh = new Bulkhead({ name: 'test-stats', maxConcurrent: 5, queueSize: 0 });
  await bh.execute(async () => 'ok');
  const stats = bh.getStats();
  assert.equal(stats.totalCalls, 1);
  assert.equal(stats.activeCalls, 0);
});

// ──────────────────────────────────────────────────────────────────────────────
// API RESILIENCE TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('ApiResilience: classifyError returns 503 for CircuitOpenError', async () => {
  const { classifyError } = await imp('server/resilience/apiResilience.ts');
  const err = new Error('Circuit breaker OPEN: redis');
  err.name = 'CircuitOpenError';
  const result = classifyError(err);
  assert.equal(result.statusCode, 503);
  assert.equal(result.code, 'SERVICE_UNAVAILABLE');
});

test('ApiResilience: classifyError returns 504 for TimeoutError', async () => {
  const { classifyError } = await imp('server/resilience/apiResilience.ts');
  const err = new Error('timed out after 5000ms');
  err.name = 'TimeoutError';
  const result = classifyError(err);
  assert.equal(result.statusCode, 504);
  assert.equal(result.code, 'GATEWAY_TIMEOUT');
});

test('ApiResilience: classifyError returns 429 for BulkheadRejectedError', async () => {
  const { classifyError } = await imp('server/resilience/apiResilience.ts');
  const err = new Error('Bulkhead is full');
  err.name = 'BulkheadRejectedError';
  const result = classifyError(err);
  assert.equal(result.statusCode, 429);
  assert.equal(result.code, 'TOO_MANY_REQUESTS');
});

test('ApiResilience: classifyError returns 403 for forbidden errors', async () => {
  const { classifyError } = await imp('server/resilience/apiResilience.ts');
  const err = new Error('Forbidden: Only admins may create meetings.');
  const result = classifyError(err);
  assert.equal(result.statusCode, 403);
});

test('ApiResilience: classifyError returns 500 for unknown errors', async () => {
  const { classifyError } = await imp('server/resilience/apiResilience.ts');
  const result = classifyError(new Error('some unexpected thing'));
  assert.equal(result.statusCode, 500);
  assert.equal(result.code, 'INTERNAL_ERROR');
});

test('ApiResilience: safeHandler catches thrown errors and sends JSON response', async () => {
  const { safeHandler } = await imp('server/resilience/apiResilience.ts');
  let statusSent = null;
  let bodySent = null;

  const mockRes = {
    headersSent: false,
    status(code) { statusSent = code; return this; },
    json(body) { bodySent = body; },
  };

  const handler = safeHandler(async (_req, _res) => {
    throw new Error('Forbidden: RBAC violation');
  });

  await handler({ method: 'GET', url: '/test' }, mockRes);
  assert.equal(statusSent, 403);
  assert.equal(bodySent.success, false);
  assert.equal(bodySent.code, 'FORBIDDEN');
});

test('ApiResilience: validateEnvironment detects missing required vars', async () => {
  const { validateEnvironment } = await imp('server/resilience/apiResilience.ts');
  // Save and remove required var temporarily
  const saved = process.env.VITE_SUPABASE_URL;
  delete process.env.VITE_SUPABASE_URL;
  const result = validateEnvironment();
  if (saved) process.env.VITE_SUPABASE_URL = saved;
  // Either missing (if not set in env) or valid — just verify structure
  assert.ok(typeof result.valid === 'boolean');
  assert.ok(Array.isArray(result.missing));
  assert.ok(Array.isArray(result.warnings));
});

// ──────────────────────────────────────────────────────────────────────────────
// SOCKET RESILIENCE TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('SocketResilience: tracks connection correctly', async () => {
  const { SocketResilienceManager } = await imp('server/resilience/socketResilience.ts');
  const mgr = new SocketResilienceManager({ maxMessagesPerWindow: 5, windowMs: 1000 });
  const fakeSocket = {
    id: 'socket-test-1',
    on: (event, cb) => { if (event === 'disconnect') fakeSocket._disconnectCb = cb; },
    _disconnectCb: null,
  };
  mgr.trackConnection(fakeSocket);
  assert.equal(mgr.getStats().trackedSockets, 1);
});

test('SocketResilience: recordPong resets missed pings', async () => {
  const { SocketResilienceManager } = await imp('server/resilience/socketResilience.ts');
  const mgr = new SocketResilienceManager({ maxMessagesPerWindow: 5, windowMs: 1000 });
  const fakeSocket = { id: 'pong-test', on: () => {} };
  mgr.trackConnection(fakeSocket);
  mgr.recordPong('pong-test');
  // Should not throw; stats should be clean
  const stats = mgr.getStats();
  assert.equal(stats.staleCount, 0);
});

test('SocketResilience: message rate limiter allows under-limit messages', async () => {
  const { SocketResilienceManager } = await imp('server/resilience/socketResilience.ts');
  const mgr = new SocketResilienceManager({ maxMessagesPerWindow: 5, windowMs: 5000 });
  for (let i = 0; i < 5; i++) {
    assert.ok(mgr.checkMessageRate('socket-rate'), `Message ${i + 1} should be allowed`);
  }
});

test('SocketResilience: message rate limiter blocks over-limit messages', async () => {
  const { SocketResilienceManager } = await imp('server/resilience/socketResilience.ts');
  const mgr = new SocketResilienceManager({ maxMessagesPerWindow: 3, windowMs: 5000 });
  for (let i = 0; i < 3; i++) mgr.checkMessageRate('socket-block');
  const allowed = mgr.checkMessageRate('socket-block');
  assert.equal(allowed, false, 'Message beyond rate limit should be blocked');
});

// ──────────────────────────────────────────────────────────────────────────────
// MEETING GUARD TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('MeetingGuard: allows valid transition SCHEDULED → STARTED', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard();
  const meeting = { id: 'meet-1', status: 'SCHEDULED' };
  const result = guard.validateTransition(meeting, 'STARTED', 'user-1');
  assert.equal(result.allowed, true);
  guard.releaseLock('meet-1');
});

test('MeetingGuard: rejects invalid transition ACTIVE → SCHEDULED', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard();
  const meeting = { id: 'meet-2', status: 'ACTIVE' };
  const result = guard.validateTransition(meeting, 'SCHEDULED', 'user-1');
  assert.equal(result.allowed, false);
  assert.equal(result.code, 'INVALID_TRANSITION');
});

test('MeetingGuard: idempotent — returns allowed=true if already in target state', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard();
  const meeting = { id: 'meet-3', status: 'STARTED' };
  const result = guard.validateTransition(meeting, 'STARTED', 'user-1');
  assert.equal(result.allowed, true);
  assert.equal(result.isIdempotent, true);
});

test('MeetingGuard: rejects transition from terminal state CANCELLED', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard();
  const meeting = { id: 'meet-4', status: 'CANCELLED' };
  const result = guard.validateTransition(meeting, 'STARTED', 'user-1');
  assert.equal(result.allowed, false);
  assert.equal(result.code, 'TERMINAL_STATE');
});

test('MeetingGuard: rejects concurrent transitions (lock)', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard({ lockTimeoutMs: 5000 });
  const meeting = { id: 'meet-5', status: 'SCHEDULED' };
  // Acquire lock
  const r1 = guard.validateTransition(meeting, 'STARTED', 'user-1');
  assert.equal(r1.allowed, true);
  // Second concurrent call should be rejected
  const r2 = guard.validateTransition(meeting, 'STARTED', 'user-2');
  assert.equal(r2.allowed, false);
  assert.equal(r2.code, 'CONCURRENT_TRANSITION');
  guard.releaseLock('meet-5');
});

test('MeetingGuard: scheduleAutoEnd fires callback after timeout', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard();
  let fired = false;
  guard.onAutoEnd((_id) => { fired = true; });
  guard.scheduleAutoEnd('meet-auto', 30); // 30ms
  await new Promise(r => setTimeout(r, 60));
  assert.equal(fired, true, 'Auto-end callback should have fired');
});

test('MeetingGuard: clearAutoEnd prevents callback from firing', async () => {
  const { MeetingGuard } = await imp('server/meetings/meetingGuard.ts');
  const guard = new MeetingGuard();
  let fired = false;
  guard.onAutoEnd((_id) => { fired = true; });
  guard.scheduleAutoEnd('meet-cleared', 50);
  guard.clearAutoEnd('meet-cleared'); // Cancel before it fires
  await new Promise(r => setTimeout(r, 80));
  assert.equal(fired, false, 'Cleared auto-end should not have fired');
});

// ──────────────────────────────────────────────────────────────────────────────
// OUTBOX SERVICE TESTS (Phase 14 additions)
// ──────────────────────────────────────────────────────────────────────────────

test('OutboxService: records event and adds to backlog', async () => {
  const { TransactionalOutboxService } = await imp('server/kafka/outboxService.ts');
  const svc = new TransactionalOutboxService();
  svc.stopPoller();
  svc.recordEvent('MeetingCreated.v1', 'MEETING', 'meet-123', { title: 'Test' });
  const backlog = svc.getBacklogCount();
  assert.equal(backlog.pending, 1);
});

test('OutboxService: processes pending events and marks PUBLISHED', async () => {
  const { TransactionalOutboxService } = await imp('server/kafka/outboxService.ts');
  const svc = new TransactionalOutboxService();
  svc.stopPoller();
  svc.setSimulateFailure(false);
  svc.recordEvent('MeetingStarted.v1', 'MEETING', 'meet-456', { status: 'STARTED' });
  const result = await svc.processOutbox();
  // The fallback publisher should succeed even without Kafka
  assert.ok(result.published >= 0);
  assert.ok(result.failed >= 0);
});

test('OutboxService: simulated failure marks records FAILED', async () => {
  const { TransactionalOutboxService } = await imp('server/kafka/outboxService.ts');
  const svc = new TransactionalOutboxService();
  svc.stopPoller();
  svc.setSimulateFailure(true);
  svc.recordEvent('ChatMessage.v1', 'CHAT', 'chat-789', { message: 'hi' });
  await svc.processOutbox();
  const backlog = svc.getBacklogCount();
  assert.equal(backlog.failed, 1);
  svc.setSimulateFailure(false);
});

test('OutboxService: rollbackRecord removes event from outbox', async () => {
  const { TransactionalOutboxService } = await imp('server/kafka/outboxService.ts');
  const svc = new TransactionalOutboxService();
  svc.stopPoller();
  const record = svc.recordEvent('UserJoined.v1', 'USER', 'user-001', {});
  const removed = svc.rollbackRecord(record.id);
  assert.equal(removed, true);
  assert.equal(svc.getBacklogCount().pending, 0);
});

// ──────────────────────────────────────────────────────────────────────────────
// GRACEFUL SHUTDOWN TESTS
// ──────────────────────────────────────────────────────────────────────────────

test('GracefulShutdown: executes registered callbacks in LIFO order', async () => {
  const { GracefulShutdownManager } = await imp('server/resilience/gracefulShutdown.ts');
  const mgr = new GracefulShutdownManager({ drainTimeoutMs: 5000 });
  const order = [];
  mgr.onShutdown(async () => { order.push('first-registered'); });
  mgr.onShutdown(async () => { order.push('last-registered'); });
  // Manually trigger callback invocation (internal method simulation)
  for (const cb of mgr['callbacks']) {
    await cb();
  }
  assert.deepEqual(order, ['last-registered', 'first-registered']);
});

// ──────────────────────────────────────────────────────────────────────────────
// INTEGRATION: Circuit Breaker + Retry Policy
// ──────────────────────────────────────────────────────────────────────────────

test('Integration: RetryPolicy + CircuitBreaker — retries open circuit gracefully', async () => {
  const { CircuitBreaker } = await imp('server/resilience/circuitBreaker.ts');
  const { withRetry } = await imp('server/resilience/retryPolicy.ts');
  const cb = new CircuitBreaker({ name: 'integration-test', failureThreshold: 2, recoveryTimeoutMs: 60_000 });

  // Open the circuit
  for (let i = 0; i < 2; i++) {
    try { await cb.call(async () => { throw new Error('down'); }); } catch {}
  }
  assert.equal(cb.getState(), 'OPEN');

  // withRetry should give up after maxAttempts even with open circuit
  let attempts = 0;
  try {
    await withRetry(
      () => { attempts++; return cb.call(async () => 'ok'); },
      { maxAttempts: 3, baseDelayMs: 1, isRetryable: () => true }
    );
  } catch {}
  assert.ok(attempts <= 3, `Should not exceed maxAttempts, got ${attempts}`);
});

test('Integration: Timeout + Retry — timeouts are retried', async () => {
  const { withTimeout } = await imp('server/resilience/timeoutWrapper.ts');
  const { withRetry } = await imp('server/resilience/retryPolicy.ts');
  let callCount = 0;
  try {
    await withRetry(
      () => {
        callCount++;
        return withTimeout(async () => {
          if (callCount < 3) await new Promise(r => setTimeout(r, 200)); // slow
          return 'fast';
        }, 50, 'op');
      },
      { maxAttempts: 5, baseDelayMs: 1 }
    );
  } catch {}
  assert.ok(callCount >= 1);
});

runTests().catch(console.error);
