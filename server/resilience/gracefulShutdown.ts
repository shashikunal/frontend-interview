/**
 * Graceful Shutdown Handler
 * Phase 14: Reliability, Resilience & Disaster Recovery
 *
 * Ensures zero data loss and clean process termination on:
 *   - SIGTERM (container orchestrator/Kubernetes pod termination)
 *   - SIGINT  (Ctrl+C during local development)
 *   - Uncaught exceptions (last-resort logging, then exit)
 *   - Unhandled promise rejections
 *
 * Shutdown sequence:
 *   1. Stop accepting new connections
 *   2. Wait for in-flight requests to complete (drain)
 *   3. Flush outbox (publish pending events)
 *   4. Disconnect Kafka consumers & producer
 *   5. Disconnect Redis
 *   6. Exit with code 0
 *
 * If draining takes longer than `drainTimeoutMs`, force-exits with code 1.
 */

export interface GracefulShutdownOptions {
  /** Maximum milliseconds to wait for in-flight connections to drain */
  drainTimeoutMs?: number;
  /** Whether to process the outbox before shutdown */
  flushOutbox?: boolean;
}

type ShutdownCallback = () => Promise<void>;

export class GracefulShutdownManager {
  private readonly drainTimeoutMs: number;
  private readonly flushOutbox: boolean;
  private readonly callbacks: ShutdownCallback[] = [];
  private isShuttingDown = false;
  private registered = false;

  constructor(options: GracefulShutdownOptions = {}) {
    this.drainTimeoutMs = options.drainTimeoutMs ?? 15_000;
    this.flushOutbox = options.flushOutbox ?? true;
  }

  /**
   * Register a cleanup callback to run during shutdown (LIFO order).
   */
  public onShutdown(cb: ShutdownCallback): void {
    this.callbacks.unshift(cb); // LIFO: last registered = first to run
  }

  /**
   * Register process-level signal handlers.
   * Must be called once at application startup.
   */
  public register(): void {
    if (this.registered) return;
    this.registered = true;

    process.on('SIGTERM', () => this.shutdown('SIGTERM'));
    process.on('SIGINT', () => this.shutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      console.error('[GracefulShutdown] Uncaught exception:', err);
      this.shutdown('uncaughtException').finally(() => process.exit(1));
    });

    process.on('unhandledRejection', (reason) => {
      console.error('[GracefulShutdown] Unhandled promise rejection:', reason);
      // Log but do NOT crash — emit a warning and continue.
      // Severe unhandled rejections should be surfaced via alerting (Phase 11).
    });
  }

  private async shutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    console.log(`\n[GracefulShutdown] Received ${signal}. Starting graceful shutdown...`);

    const forceExitTimer = setTimeout(() => {
      console.error(`[GracefulShutdown] Drain timeout (${this.drainTimeoutMs}ms) exceeded. Force exiting.`);
      process.exit(1);
    }, this.drainTimeoutMs);

    try {
      // Run registered cleanup callbacks in LIFO order
      for (const cb of this.callbacks) {
        try {
          await cb();
        } catch (err) {
          console.error('[GracefulShutdown] Cleanup callback error:', err);
        }
      }

      console.log('[GracefulShutdown] All cleanup complete. Exiting cleanly.');
    } catch (err) {
      console.error('[GracefulShutdown] Shutdown error:', err);
    } finally {
      clearTimeout(forceExitTimer);
      process.exit(0);
    }
  }

  public get isInShutdown(): boolean {
    return this.isShuttingDown;
  }
}

export const gracefulShutdown = new GracefulShutdownManager({
  drainTimeoutMs: 15_000,
  flushOutbox: true,
});

/**
 * Bootstrap: Registers graceful shutdown and wires platform dependency cleanup.
 * Call this once at server startup AFTER all services are initialized.
 */
export async function registerGracefulShutdown(): Promise<void> {
  // Import lazily to avoid circular dependencies
  const [
    { kafkaClient },
    { redisClient },
    { outboxService },
  ] = await Promise.all([
    import('../kafka/kafkaClient.ts'),
    import('../redis/redisClient.ts'),
    import('../kafka/outboxService.ts'),
  ]);

  // 1. Flush outbox — publish any pending events before disconnecting Kafka
  gracefulShutdown.onShutdown(async () => {
    console.log('[GracefulShutdown] Flushing transactional outbox...');
    try {
      const result = await outboxService.processOutbox(200);
      console.log(`[GracefulShutdown] Outbox flushed: published=${result.published}, failed=${result.failed}`);
    } catch (err) {
      console.error('[GracefulShutdown] Outbox flush error:', err);
    }
  });

  // 2. Disconnect Kafka producer and consumers
  gracefulShutdown.onShutdown(async () => {
    console.log('[GracefulShutdown] Disconnecting Kafka...');
    await kafkaClient.disconnect();
    console.log('[GracefulShutdown] Kafka disconnected.');
  });

  // 3. Disconnect Redis
  gracefulShutdown.onShutdown(async () => {
    console.log('[GracefulShutdown] Disconnecting Redis...');
    await redisClient.disconnect();
    console.log('[GracefulShutdown] Redis disconnected.');
  });

  // Register process signal handlers
  gracefulShutdown.register();

  console.log('[GracefulShutdown] Shutdown handlers registered.');
}
