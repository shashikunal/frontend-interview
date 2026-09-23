/**
 * Async Timeout Wrapper
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Enforces a hard deadline on any async operation.
 * If the operation does not resolve within `timeoutMs`, a TimeoutError is thrown
 * and the underlying promise is abandoned.
 *
 * Usage:
 *   const data = await withTimeout(() => slowDatabaseQuery(), 5000, 'db-query');
 */

export class TimeoutError extends Error {
  public readonly operationName: string;
  public readonly timeoutMs: number;

  constructor(operationName: string, timeoutMs: number) {
    super(`Operation "${operationName}" timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
    this.operationName = operationName;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Wraps an async function with a hard timeout.
 * @param fn         The async operation to execute
 * @param timeoutMs  Maximum allowed duration in milliseconds
 * @param name       Human-readable operation name for error messages
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  name = 'unknown'
): Promise<T> {
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => {
      reject(new TimeoutError(name, timeoutMs));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([fn(), timeoutPromise]);
    return result;
  } finally {
    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle);
    }
  }
}

/**
 * Creates a bound timeout function with a preset deadline.
 *
 * Usage:
 *   const dbTimeout = makeTimeout(5000);
 *   const row = await dbTimeout(() => client.from('users').select(), 'get-user');
 */
export function makeTimeout(defaultMs: number) {
  return <T>(fn: () => Promise<T>, name?: string): Promise<T> =>
    withTimeout(fn, defaultMs, name);
}

// Pre-configured timeouts for platform dependencies
export const dbTimeout = makeTimeout(5_000);        // 5s for PostgreSQL queries
export const redisTimeout = makeTimeout(1_000);     // 1s for Redis commands
export const kafkaTimeout = makeTimeout(3_000);     // 3s for Kafka publish
export const httpTimeout = makeTimeout(10_000);     // 10s for external HTTP calls
export const authTimeout = makeTimeout(3_000);      // 3s for token verification
