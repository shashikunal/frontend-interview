/**
 * Consumer Groups, Idempotency Tracker & Dead-Letter Queue (DLQ)
 * Phase 9: Kafka + Event Architecture + Transactional Outbox
 *
 * Implements:
 * - Domain consumer groups: notification-service-group, audit-service-group, analytics-service-group
 * - Consumer Idempotency: Deduplicates redelivered events by eventId
 * - Retry with Exponential Backoff (3 attempts)
 * - Dead-Letter Queue (DLQ): Poison messages and exhausted retries route to dead-letter.events
 * - Group Isolation: A failure in notification does not block audit or analytics consumers
 */

import { kafkaClient } from './kafkaClient.ts';
import { KAFKA_TOPICS } from './topicStrategy.ts';
import type { EventEnvelope, DeadLetterPayload } from './eventContracts.ts';

export interface ConsumerMetrics {
  processedCount: number;
  duplicateCount: number;
  retryCount: number;
  dlqCount: number;
}

export class KafkaConsumerService {
  // Idempotency tracking: groupId -> Set of processed eventIds
  private processedEvents: Map<string, Set<string>> = new Map();
  // DLQ records: originalEventId -> DeadLetterPayload
  private dlqRecords: Map<string, DeadLetterPayload> = new Map();

  // Downstream consumer handlers: groupId -> list of handlers
  private handlers: Map<string, Array<(envelope: EventEnvelope) => Promise<void>>> = new Map();

  private processedCount = 0;
  private duplicateCount = 0;
  private retryCount = 0;
  private dlqCount = 0;

  private readonly MAX_CONSUMER_RETRIES = 3;

  constructor() {
    this.initDefaultConsumers();
  }

  /**
   * Initializes standard consumer groups
   */
  private initDefaultConsumers(): void {
    // 1. Notification Consumer Group
    this.registerGroup('notification-service-group', [
      KAFKA_TOPICS.MEETING_EVENTS,
      KAFKA_TOPICS.CHAT_EVENTS,
      KAFKA_TOPICS.NOTIFICATION_EVENTS,
    ], async (_envelope) => {
      // Processes notification triggers (e.g. ParticipantInvited, NotificationRequested)
    });

    // 2. Audit Consumer Group
    this.registerGroup('audit-service-group', [
      KAFKA_TOPICS.MEETING_EVENTS,
      KAFKA_TOPICS.CHAT_EVENTS,
      KAFKA_TOPICS.USER_EVENTS,
      KAFKA_TOPICS.AUDIT_EVENTS,
    ], async (_envelope) => {
      // Processes audit records and compliance logs
    });

    // 3. Analytics Consumer Group
    this.registerGroup('analytics-service-group', [
      KAFKA_TOPICS.MEETING_EVENTS,
      KAFKA_TOPICS.CHAT_EVENTS,
      KAFKA_TOPICS.ANALYTICS_EVENTS,
    ], async (_envelope) => {
      // Aggregates duration, message volume, and engagement metrics
    });
  }

  /**
   * Register a custom handler for a consumer group
   */
  public registerGroup(
    groupId: string,
    topics: string[],
    handler: (envelope: EventEnvelope) => Promise<void>
  ): void {
    let groupHandlers = this.handlers.get(groupId);
    if (!groupHandlers) {
      groupHandlers = [];
      this.handlers.set(groupId, groupHandlers);
    }
    groupHandlers.push(handler);

    kafkaClient.registerConsumer(groupId, topics, async (envelope, topic) => {
      await this.processEventWithIdempotencyAndRetry(groupId, envelope, topic, handler);
    });
  }

  /**
   * Process event with idempotency check, retry backoff, and DLQ routing
   */
  public async processEventWithIdempotencyAndRetry(
    groupId: string,
    envelope: EventEnvelope,
    topic: string,
    handler: (envelope: EventEnvelope) => Promise<void>
  ): Promise<{ success: boolean; isDuplicate: boolean; sentToDlq: boolean }> {
    // 1. Poison message validation: verify minimal valid envelope structure
    if (!envelope || !envelope.eventId || !envelope.eventType) {
      await this.routeToDlq(
        envelope?.eventId || 'unknown_poison',
        topic,
        envelope?.eventType || 'UNKNOWN_POISON',
        'Malformed event: Missing eventId or eventType',
        0,
        envelope
      );
      return { success: false, isDuplicate: false, sentToDlq: true };
    }

    // 2. Idempotency Check
    let groupSet = this.processedEvents.get(groupId);
    if (!groupSet) {
      groupSet = new Set();
      this.processedEvents.set(groupId, groupSet);
    }

    if (groupSet.has(envelope.eventId)) {
      this.duplicateCount++;
      return { success: true, isDuplicate: true, sentToDlq: false };
    }

    // 3. Execution with Retry Loop
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt <= this.MAX_CONSUMER_RETRIES) {
      try {
        await handler(envelope);
        groupSet.add(envelope.eventId);
        this.processedCount++;
        return { success: true, isDuplicate: false, sentToDlq: false };
      } catch (err: any) {
        attempt++;
        this.retryCount++;
        lastError = err;

        if (attempt <= this.MAX_CONSUMER_RETRIES) {
          // Exponential backoff: 50ms, 100ms, 200ms
          const backoffMs = Math.pow(2, attempt) * 25;
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
        }
      }
    }

    // 4. Retries exhausted: Route to Dead-Letter Queue
    await this.routeToDlq(
      envelope.eventId,
      topic,
      envelope.eventType,
      lastError?.message || 'Exhausted retry attempts',
      attempt,
      envelope
    );

    return { success: false, isDuplicate: false, sentToDlq: true };
  }

  /**
   * Route failed or unprocessable event to DLQ
   */
  public async routeToDlq(
    originalEventId: string,
    originalTopic: string,
    originalEventType: string,
    error: string,
    retryCount: number,
    rawPayload: any
  ): Promise<void> {
    this.dlqCount++;
    const dlqRecord: DeadLetterPayload = {
      originalEventId,
      originalTopic,
      originalEventType,
      error,
      retryCount,
      failedAt: new Date().toISOString(),
      rawPayload,
    };

    this.dlqRecords.set(originalEventId, dlqRecord);

    const dlqEnvelope: EventEnvelope<DeadLetterPayload> = {
      eventId: `dlq_${originalEventId}`,
      eventType: 'DeadLetterEvent.v1',
      eventVersion: '1.0',
      aggregateType: 'AUDIT',
      aggregateId: originalEventId,
      occurredAt: dlqRecord.failedAt,
      producer: 'consumer-service-dlq-router',
      correlationId: rawPayload?.correlationId || `corr_dlq_${originalEventId}`,
      partitionKey: originalEventId,
      payload: dlqRecord,
    };

    await kafkaClient.publish(KAFKA_TOPICS.DEAD_LETTER_EVENTS, dlqEnvelope);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DIAGNOSTICS & METRICS
  // ──────────────────────────────────────────────────────────────────────────

  public getDlqRecords(): DeadLetterPayload[] {
    return Array.from(this.dlqRecords.values());
  }

  public getMetrics(): ConsumerMetrics {
    return {
      processedCount: this.processedCount,
      duplicateCount: this.duplicateCount,
      retryCount: this.retryCount,
      dlqCount: this.dlqCount,
    };
  }

  public reset(): void {
    this.processedEvents.clear();
    this.dlqRecords.clear();
    this.processedCount = 0;
    this.duplicateCount = 0;
    this.retryCount = 0;
    this.dlqCount = 0;
  }
}

export const kafkaConsumerService = new KafkaConsumerService();
