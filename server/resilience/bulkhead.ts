/**
 * Concurrency Bulkhead (Semaphore)
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Prevents cascade failure by limiting the number of concurrent executions
 * of a given operation. Excess concurrent callers either queue (with optional
 * timeout) or reject immediately.
 *
 * Named after the ship's bulkhead design — compartmentalizing failures so
 * one flooded section cannot sink the whole vessel.
 *
 * Usage:
 *   const bulkhead = new Bulkhead({ name: 'db-queries', maxConcurrent: 10, queueSize: 20 });
 *   const result = await bulkhead.execute(() => dbQuery(id));
 */

export interface BulkheadOptions {
  /** Human-readable name for metrics */
  name: string;
  /** Maximum number of concurrent executions */
  maxConcurrent?: number;
  /** Maximum number of requests waiting in queue (0 = no queue, reject immediately) */
  queueSize?: number;
  /** How long a queued request waits before rejecting (ms) */
  queueTimeoutMs?: number;
}

export interface BulkheadStats {
  name: string;
  activeCalls: number;
  queuedCalls: number;
  totalCalls: number;
  rejectedCalls: number;
  maxConcurrent: number;
  queueSize: number;
}

export class BulkheadRejectedError extends Error {
  constructor(name: string) {
    super(`Bulkhead "${name}" is full. Request rejected to protect system stability.`);
    this.name = 'BulkheadRejectedError';
  }
}

export class BulkheadQueueTimeoutError extends Error {
  constructor(name: string, timeoutMs: number) {
    super(`Bulkhead "${name}" queue timeout after ${timeoutMs}ms.`);
    this.name = 'BulkheadQueueTimeoutError';
  }
}

type Resolver = () => void;

export class Bulkhead {
  private readonly name: string;
  private readonly maxConcurrent: number;
  private readonly queueSize: number;
  private readonly queueTimeoutMs: number;

  private activeCalls = 0;
  private totalCalls = 0;
  private rejectedCalls = 0;
  private queue: Resolver[] = [];

  constructor(options: BulkheadOptions) {
    this.name = options.name;
    this.maxConcurrent = options.maxConcurrent ?? 10;
    this.queueSize = options.queueSize ?? 50;
    this.queueTimeoutMs = options.queueTimeoutMs ?? 5_000;
  }

  /**
   * Execute a function within the bulkhead.
   * Queues if at capacity, rejects if queue is also full.
   */
  public async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.totalCalls++;

    if (this.activeCalls < this.maxConcurrent) {
      return this.run(fn);
    }

    // At capacity — try to queue
    if (this.queue.length >= this.queueSize) {
      this.rejectedCalls++;
      throw new BulkheadRejectedError(this.name);
    }

    // Wait in queue
    await this.waitInQueue();
    return this.run(fn);
  }

  private async run<T>(fn: () => Promise<T>): Promise<T> {
    this.activeCalls++;
    try {
      return await fn();
    } finally {
      this.activeCalls--;
      this.dequeue();
    }
  }

  private waitInQueue(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

      const resolver: Resolver = () => {
        if (timeoutHandle !== null) clearTimeout(timeoutHandle);
        resolve();
      };

      this.queue.push(resolver);

      timeoutHandle = setTimeout(() => {
        const idx = this.queue.indexOf(resolver);
        if (idx !== -1) {
          this.queue.splice(idx, 1);
          this.rejectedCalls++;
          reject(new BulkheadQueueTimeoutError(this.name, this.queueTimeoutMs));
        }
      }, this.queueTimeoutMs);
    });
  }

  private dequeue(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next?.();
    }
  }

  public getStats(): BulkheadStats {
    return {
      name: this.name,
      activeCalls: this.activeCalls,
      queuedCalls: this.queue.length,
      totalCalls: this.totalCalls,
      rejectedCalls: this.rejectedCalls,
      maxConcurrent: this.maxConcurrent,
      queueSize: this.queueSize,
    };
  }
}

// Pre-configured bulkheads for critical platform paths
export const dbBulkhead = new Bulkhead({
  name: 'postgres',
  maxConcurrent: 20,
  queueSize: 40,
  queueTimeoutMs: 5_000,
});

export const redisBulkhead = new Bulkhead({
  name: 'redis',
  maxConcurrent: 50,
  queueSize: 100,
  queueTimeoutMs: 1_000,
});

export const kafkaBulkhead = new Bulkhead({
  name: 'kafka',
  maxConcurrent: 30,
  queueSize: 60,
  queueTimeoutMs: 3_000,
});

export const socketBulkhead = new Bulkhead({
  name: 'websocket-connection',
  maxConcurrent: 100,
  queueSize: 50,
  queueTimeoutMs: 2_000,
});
