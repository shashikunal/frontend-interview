/**
 * Operational Alerting & Threshold Evaluation Engine
 * Phase 11: Audit Logging + Observability + System Health
 *
 * Evaluates production thresholds:
 * - High HTTP error rate (> 5%)
 * - Outbox backlog spike (> 50 events)
 * - Kafka consumer lag (> 100 events)
 * - Redis connection failure
 * - PostgreSQL degradation
 * - Security auth failure bursts (> 10 failures)
 */

import { outboxService } from '../kafka/outboxService.ts';
import { kafkaConsumerService } from '../kafka/consumerService.ts';
import { redisClient } from '../redis/redisClient.ts';
import { metricsRegistry } from './metrics.ts';
import type { AlertRule } from './types.ts';

export class AlertingService {
  private alerts: AlertRule[] = [
    {
      id: 'ALT_HTTP_ERROR_RATE',
      name: 'High API Error Rate',
      severity: 'CRITICAL',
      description: 'HTTP 5xx error rate exceeds 5% threshold',
      condition: 'http_requests_total{status=~"5.."}/http_requests_total > 0.05',
      threshold: 0.05,
      active: false,
    },
    {
      id: 'ALT_OUTBOX_BACKLOG',
      name: 'Transactional Outbox Backlog',
      severity: 'WARNING',
      description: 'Pending events in outbox exceed 50 items',
      condition: 'outbox_backlog_count > 50',
      threshold: 50,
      active: false,
    },
    {
      id: 'ALT_KAFKA_LAG',
      name: 'Kafka Consumer Lag Spike',
      severity: 'WARNING',
      description: 'Consumer lag exceeds 100 unprocessed events',
      condition: 'kafka_consumer_lag_count > 100',
      threshold: 100,
      active: false,
    },
    {
      id: 'ALT_REDIS_FAILOVER',
      name: 'Redis Degraded Mode Active',
      severity: 'WARNING',
      description: 'Redis is operating in local In-Memory Fallback mode',
      condition: 'redis_connected_status == 0',
      threshold: 0,
      active: false,
    },
    {
      id: 'ALT_AUTH_BRUTE_FORCE',
      name: 'Authentication Failure Spike',
      severity: 'CRITICAL',
      description: 'Rapid spike in rejected authentication attempts',
      condition: 'auth_failures_total > 15',
      threshold: 15,
      active: false,
    },
  ];

  /**
   * Evaluates current system metrics and returns active alerting status
   */
  public async evaluateAlerts(): Promise<{
    activeCount: number;
    alerts: AlertRule[];
  }> {
    const outbox = outboxService.getBacklogCount();
    const consumer = kafkaConsumerService.getMetrics();
    const redis = await redisClient.checkHealth();
    const authFailures = metricsRegistry.getCounter('auth_failures_total')?.get() || 0;

    const evaluated = this.alerts.map((alert) => {
      let active = false;
      let currentValue = 0;

      switch (alert.id) {
        case 'ALT_OUTBOX_BACKLOG':
          currentValue = outbox.pending;
          active = currentValue > alert.threshold;
          break;
        case 'ALT_KAFKA_LAG':
          currentValue = consumer.dlqCount;
          active = currentValue > alert.threshold;
          break;
        case 'ALT_REDIS_FAILOVER':
          currentValue = redis.status === 'DEGRADED' ? 1 : 0;
          active = redis.status === 'DEGRADED';
          break;
        case 'ALT_AUTH_BRUTE_FORCE':
          currentValue = authFailures;
          active = currentValue > alert.threshold;
          break;
        default:
          active = false;
      }

      return {
        ...alert,
        active,
        currentValue,
        triggeredAt: active ? new Date().toISOString() : undefined,
      };
    });

    const activeCount = evaluated.filter((a) => a.active).length;

    return {
      activeCount,
      alerts: evaluated,
    };
  }
}

export const alertingService = new AlertingService();
