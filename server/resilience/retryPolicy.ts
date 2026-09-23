/**
 * Retry Policy with Exponential Backoff + Full Jitter
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Implements industry-standard retry strategy:
 *   - Configurable attempt count
 *   - Exponential backoff: base * 2^attempt
 *   - Full jitter: random(0, computed_delay) to prevent thundering-herd
 *   - Configurable retry predicate (which errors are retryable)
 *   - Per-attempt timeout (optional)
 *
 * Usage:
 *   const result = await withRetry(() => fetchData(), { maxAttempts: 3, baseDelayMs: 100 });
 */

export interface RetryOptions {
  /** Total number of attempts (1 = no retry, 3 = initial + 2 retries) */
  maxAttempts?: number;
  /** Base delay in milliseconds before first retry */
  baseDelayMs?: number;
  /** Maximum delay cap in milliseconds */
  maxDelayMs?: number;
  /** Multiplier for exponential growth (default: 2) */
  backoffFactor?: number;
  /** Whether to apply full jitter (default: true) */
  jitter?: boolean;
  /** Predicate to determine if an error is retryable (default: all errors) */
  isRetryable?: (err: unknown, attempt: number) => boolean;
  /** Optional callback fired before each retry */
  onRetry?: (err: unknown, attempt: number, delayMs: number) => void;
}

export interface RetryResult<T> {
  value: T;
  attempts: number;
  totalDurationMs: number;
}

/**
 * Execute an async function with configurable retry policy.
 * Throws the last error if all attempts are exhausted.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    baseDelayMs = 100,
    maxDelayMs = 10_000,
    backoffFactor = 2,
    jitter = true,
    isRetryable = () => true,
    onRetry,
  } = options;

  const startTime = Date.now();
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await fn();
      return {
        value,
        attempts: attempt,
        totalDurationMs: Date.now() - startTime,
      };
    } catch (err) {
      lastError = err;

      const isLast = attempt >= maxAttempts;
      if (isLast || !isRetryable(err, attempt)) {
        break;
      }

      // Compute exponential backoff with optional full jitter
      const exponentialDelay = Math.min(
        baseDelayMs * Math.pow(backoffFactor, attempt - 1),
        maxDelayMs
      );
      const delayMs = jitter
        ? Math.floor(Math.random() * exponentialDelay)
        : exponentialDelay;

      onRetry?.(err, attempt, delayMs);

      if (process.env.NODE_ENV !== 'test') {
        console.warn(
          `[RetryPolicy] Attempt ${attempt}/${maxAttempts} failed. Retrying in ${delayMs}ms.`,
          err instanceof Error ? err.message : String(err)
        );
      }

      await sleep(delayMs);
    }
  }

  throw lastError;
}

/**
 * Retry factory — creates a bound retry function with preset options.
 *
 * Usage:
 *   const retryable = makeRetryable({ maxAttempts: 5, baseDelayMs: 200 });
 *   await retryable(() => dbQuery());
 */
export function makeRetryable(defaults: RetryOptions) {
  return <T>(fn: () => Promise<T>, overrides?: RetryOptions): Promise<RetryResult<T>> =>
    withRetry(fn, { ...defaults, ...overrides });
}

// Pre-configured retry policies for each platform dependency
export const dbRetry = makeRetryable({
  maxAttempts: 3,
  baseDelayMs: 200,
  maxDelayMs: 2_000,
  isRetryable: (err) => {
    const msg = err instanceof Error ? err.message.toLowerCase() : '';
    // Retry on transient connection errors; not on auth/permission errors
    return (
      msg.includes('timeout') ||
      msg.includes('connection') ||
      msg.includes('network') ||
      msg.includes('econnreset') ||
      msg.includes('econnrefused') ||
      msg.includes('etimedout')
    );
  },
});

export const redisRetry = makeRetryable({
  maxAttempts: 2,
  baseDelayMs: 50,
  maxDelayMs: 500,
  isRetryable: (err) => {
    const msg = err instanceof Error ? err.message.toLowerCase() : '';
    return msg.includes('econnrefused') || msg.includes('timeout') || msg.includes('connection');
  },
});

export const kafkaRetry = makeRetryable({
  maxAttempts: 3,
  baseDelayMs: 100,
  maxDelayMs: 3_000,
});

export const httpRetry = makeRetryable({
  maxAttempts: 3,
  baseDelayMs: 300,
  maxDelayMs: 5_000,
  isRetryable: (err) => {
    // Retry on network errors or 5xx responses
    if (err instanceof Error) {
      const msg = err.message.toLowerCase();
      return (
        msg.includes('fetch') ||
        msg.includes('network') ||
        msg.includes('timeout') ||
        msg.includes('500') ||
        msg.includes('502') ||
        msg.includes('503') ||
        msg.includes('504')
      );
    }
    return false;
  },
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
