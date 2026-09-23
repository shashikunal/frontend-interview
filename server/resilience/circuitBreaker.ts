/**
 * Production Circuit Breaker
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Implements the classic three-state circuit breaker pattern:
 *   CLOSED   → Normal operation, calls pass through.
 *   OPEN     → Fault threshold exceeded; calls are rejected immediately.
 *   HALF_OPEN → Probe state; a single call is allowed through to test recovery.
 *
 * Usage:
 *   const cb = new CircuitBreaker({ name: 'redis', failureThreshold: 5, recoveryTimeoutMs: 10_000 });
 *   const result = await cb.call(() => redisClient.get(key));
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  /** Human-readable name for metrics/logs */
  name: string;
  /** Number of consecutive failures before opening the circuit */
  failureThreshold?: number;
  /** Milliseconds to wait in OPEN state before moving to HALF_OPEN */
  recoveryTimeoutMs?: number;
  /** Number of successful probe calls in HALF_OPEN before closing */
  successThreshold?: number;
  /** Optional callback fired on state transitions */
  onStateChange?: (name: string, from: CircuitState, to: CircuitState) => void;
}

export interface CircuitBreakerStats {
  name: string;
  state: CircuitState;
  failureCount: number;
  successCount: number;
  totalCalls: number;
  rejectedCalls: number;
  lastFailureAt: string | null;
  lastStateChangeAt: string;
}

export class CircuitBreaker {
  private readonly name: string;
  private readonly failureThreshold: number;
  private readonly recoveryTimeoutMs: number;
  private readonly successThreshold: number;
  private readonly onStateChange?: (name: string, from: CircuitState, to: CircuitState) => void;

  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private totalCalls = 0;
  private rejectedCalls = 0;
  private lastFailureAt: Date | null = null;
  private lastStateChangeAt: Date = new Date();
  private openedAt: Date | null = null;

  constructor(options: CircuitBreakerOptions) {
    this.name = options.name;
    this.failureThreshold = options.failureThreshold ?? 5;
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 30_000;
    this.successThreshold = options.successThreshold ?? 2;
    this.onStateChange = options.onStateChange;
  }

  /**
   * Execute a function through the circuit breaker.
   * Throws CircuitOpenError if the circuit is OPEN.
   */
  public async call<T>(fn: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    if (this.state === 'OPEN') {
      // Check if recovery timeout has elapsed
      if (this.openedAt && Date.now() - this.openedAt.getTime() >= this.recoveryTimeoutMs) {
        this.transition('HALF_OPEN');
      } else {
        this.rejectedCalls++;
        throw new CircuitOpenError(this.name);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  /**
   * Execute a function through the circuit breaker with a fallback.
   * If circuit is OPEN or the call fails, returns the fallback value.
   */
  public async callWithFallback<T>(fn: () => Promise<T>, fallback: T | (() => T | Promise<T>)): Promise<T> {
    try {
      return await this.call(fn);
    } catch {
      if (typeof fallback === 'function') {
        return (fallback as () => T | Promise<T>)();
      }
      return fallback;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.successCount = 0;
        this.transition('CLOSED');
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.successCount = 0;
    this.lastFailureAt = new Date();

    if (this.state === 'HALF_OPEN') {
      // Probe failed — back to OPEN
      this.transition('OPEN');
    } else if (this.state === 'CLOSED' && this.failureCount >= this.failureThreshold) {
      this.transition('OPEN');
    }
  }

  private transition(to: CircuitState): void {
    const from = this.state;
    this.state = to;
    this.lastStateChangeAt = new Date();

    if (to === 'OPEN') {
      this.openedAt = new Date();
    } else if (to === 'CLOSED') {
      this.openedAt = null;
      this.failureCount = 0;
    }

    if (from !== to) {
      this.onStateChange?.(this.name, from, to);
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[CircuitBreaker:${this.name}] State: ${from} → ${to}`);
      }
    }
  }

  /** Force-reset the circuit to CLOSED (use in tests / admin override). */
  public reset(): void {
    const from = this.state;
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.openedAt = null;
    this.lastStateChangeAt = new Date();
    this.onStateChange?.(this.name, from, 'CLOSED');
  }

  public getState(): CircuitState {
    return this.state;
  }

  public getStats(): CircuitBreakerStats {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalCalls: this.totalCalls,
      rejectedCalls: this.rejectedCalls,
      lastFailureAt: this.lastFailureAt?.toISOString() ?? null,
      lastStateChangeAt: this.lastStateChangeAt.toISOString(),
    };
  }
}

export class CircuitOpenError extends Error {
  public readonly circuitName: string;
  constructor(name: string) {
    super(`Circuit breaker OPEN: ${name}. Calls are being rejected to protect downstream services.`);
    this.name = 'CircuitOpenError';
    this.circuitName = name;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Pre-configured circuit breakers for platform dependencies
// ──────────────────────────────────────────────────────────────────────────────

export const redisCircuitBreaker = new CircuitBreaker({
  name: 'redis',
  failureThreshold: 5,
  recoveryTimeoutMs: 15_000,
  successThreshold: 2,
});

export const postgresCircuitBreaker = new CircuitBreaker({
  name: 'postgres',
  failureThreshold: 3,
  recoveryTimeoutMs: 20_000,
  successThreshold: 2,
});

export const kafkaCircuitBreaker = new CircuitBreaker({
  name: 'kafka',
  failureThreshold: 5,
  recoveryTimeoutMs: 30_000,
  successThreshold: 1,
});

export const notificationCircuitBreaker = new CircuitBreaker({
  name: 'notifications',
  failureThreshold: 5,
  recoveryTimeoutMs: 60_000,
  successThreshold: 2,
});
