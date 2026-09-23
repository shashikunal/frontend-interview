/**
 * Server Resilience Barrel Export
 * Phase 14: Reliability, Resilience & Disaster Recovery
 */

export { CircuitBreaker, CircuitOpenError, redisCircuitBreaker, postgresCircuitBreaker, kafkaCircuitBreaker, notificationCircuitBreaker } from './circuitBreaker.ts';
export type { CircuitState, CircuitBreakerOptions, CircuitBreakerStats } from './circuitBreaker.ts';

export { withRetry, makeRetryable, dbRetry, redisRetry, kafkaRetry, httpRetry } from './retryPolicy.ts';
export type { RetryOptions, RetryResult } from './retryPolicy.ts';

export { withTimeout, makeTimeout, TimeoutError, dbTimeout, redisTimeout, kafkaTimeout, httpTimeout, authTimeout } from './timeoutWrapper.ts';

export { Bulkhead, BulkheadRejectedError, BulkheadQueueTimeoutError, dbBulkhead, redisBulkhead, kafkaBulkhead, socketBulkhead } from './bulkhead.ts';
export type { BulkheadOptions, BulkheadStats } from './bulkhead.ts';

export { GracefulShutdownManager, gracefulShutdown, registerGracefulShutdown } from './gracefulShutdown.ts';

export { SocketResilienceManager, socketResilience } from './socketResilience.ts';

export { validateEnvironment, buildErrorResponse, classifyError, safeHandler } from './apiResilience.ts';
export type { EnvValidationResult, ApiErrorResponse } from './apiResilience.ts';
