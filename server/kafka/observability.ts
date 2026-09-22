/**
 * Kafka & Outbox Observability & Telemetry Metrics
 * Phase 9: Kafka + Event Architecture + Transactional Outbox
 */

import { kafkaClient } from './kafkaClient.ts';
import { outboxService } from './outboxService.ts';
import { kafkaConsumerService } from './consumerService.ts';

export interface KafkaTelemetry {
  timestamp: string;
  service: 'kafka';
  status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  mode: 'KAFKA_BROKER' | 'RESILIENT_FALLBACK';
  brokers: string[];
  latencyMs: number;
  uptimeSeconds: number;
  outbox: {
    pending: number;
    publishing: number;
    published: number;
    failed: number;
  };
  consumer: {
    processedCount: number;
    duplicateCount: number;
    retryCount: number;
    dlqCount: number;
  };
  brokerStats: {
    publishedCount: number;
    consumedCount: number;
    errorCount: number;
  };
}

export async function getKafkaTelemetry(): Promise<KafkaTelemetry> {
  const health = await kafkaClient.checkHealth();
  const outboxBacklog = outboxService.getBacklogCount();
  const consumerMetrics = kafkaConsumerService.getMetrics();

  return {
    timestamp: new Date().toISOString(),
    service: 'kafka',
    status: health.status,
    mode: health.mode,
    brokers: health.brokers,
    latencyMs: health.latencyMs,
    uptimeSeconds: health.uptimeSeconds,
    outbox: outboxBacklog,
    consumer: consumerMetrics,
    brokerStats: {
      publishedCount: health.publishedCount,
      consumedCount: health.consumedCount,
      errorCount: health.errorCount,
    },
  };
}
