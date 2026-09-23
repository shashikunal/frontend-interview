/**
 * Prometheus & OpenTelemetry Metrics Engine with Cardinality Bounds
 * Phase 11: Audit Logging + Observability + System Health
 *
 * Enforces:
 * - Prometheus text format exposition (v0.0.4)
 * - Strict label cardinality protection (no unrestricted user IDs, message IDs, or tokens as labels)
 * - Domain metric categories: HTTP, Auth, Meetings, Chat, Kafka, Redis, PostgreSQL, WebRTC/SFU, Notifications
 */

import type { MetricDefinition } from './types.ts';

// Disallowed label names that cause metric cardinality explosion
const FORBIDDEN_LABEL_NAMES = new Set([
  'userid',
  'user_id',
  'messageid',
  'message_id',
  'requestid',
  'request_id',
  'token',
  'email',
  'conversationid',
  'conversation_id',
]);

function sanitizeLabelKey(key: string): string {
  return key.replace(/[^a-zA-Z0-9_]/g, '_');
}

function sanitizeLabelValue(val: string): string {
  const str = String(val).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  return str.length > 80 ? str.substring(0, 80) : str;
}

export class Counter {
  public definition: MetricDefinition;
  private values: Map<string, number> = new Map();

  constructor(definition: MetricDefinition) {
    this.definition = { ...definition, type: 'counter' };
  }

  public inc(labels: Record<string, string> = {}, value = 1): void {
    if (value < 0) return;
    const key = serializeLabels(labels);
    const curr = this.values.get(key) || 0;
    this.values.set(key, curr + value);
  }

  public get(labels: Record<string, string> = {}): number {
    return this.values.get(serializeLabels(labels)) || 0;
  }

  public getEntries(): Array<{ labels: Record<string, string>; value: number }> {
    const entries: Array<{ labels: Record<string, string>; value: number }> = [];
    for (const [serialized, value] of this.values.entries()) {
      entries.push({ labels: deserializeLabels(serialized), value });
    }
    return entries;
  }

  public reset(): void {
    this.values.clear();
  }
}

export class Gauge {
  public definition: MetricDefinition;
  private values: Map<string, number> = new Map();

  constructor(definition: MetricDefinition) {
    this.definition = { ...definition, type: 'gauge' };
  }

  public set(labels: Record<string, string> = {}, value: number): void {
    const key = serializeLabels(labels);
    this.values.set(key, value);
  }

  public inc(labels: Record<string, string> = {}, value = 1): void {
    const key = serializeLabels(labels);
    const curr = this.values.get(key) || 0;
    this.values.set(key, curr + value);
  }

  public dec(labels: Record<string, string> = {}, value = 1): void {
    const key = serializeLabels(labels);
    const curr = this.values.get(key) || 0;
    this.values.set(key, curr - value);
  }

  public get(labels: Record<string, string> = {}): number {
    return this.values.get(serializeLabels(labels)) || 0;
  }

  public getEntries(): Array<{ labels: Record<string, string>; value: number }> {
    const entries: Array<{ labels: Record<string, string>; value: number }> = [];
    for (const [serialized, value] of this.values.entries()) {
      entries.push({ labels: deserializeLabels(serialized), value });
    }
    return entries;
  }

  public reset(): void {
    this.values.clear();
  }
}

export class Histogram {
  public definition: MetricDefinition;
  private defaultBuckets: number[];
  private observations: Map<string, { sum: number; count: number; buckets: Map<number, number> }> = new Map();

  constructor(definition: MetricDefinition) {
    this.defaultBuckets = definition.buckets || [10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
    this.definition = { ...definition, type: 'histogram', buckets: this.defaultBuckets };
  }

  public observe(labels: Record<string, string> = {}, value: number): void {
    const key = serializeLabels(labels);
    let entry = this.observations.get(key);
    if (!entry) {
      entry = {
        sum: 0,
        count: 0,
        buckets: new Map(this.defaultBuckets.map((b) => [b, 0])),
      };
      this.observations.set(key, entry);
    }

    entry.sum += value;
    entry.count += 1;

    for (const b of this.defaultBuckets) {
      if (value <= b) {
        entry.buckets.set(b, (entry.buckets.get(b) || 0) + 1);
      }
    }
  }

  public getEntries(): Array<{
    labels: Record<string, string>;
    sum: number;
    count: number;
    buckets: Map<number, number>;
  }> {
    const entries: Array<any> = [];
    for (const [serialized, obs] of this.observations.entries()) {
      entries.push({
        labels: deserializeLabels(serialized),
        sum: obs.sum,
        count: obs.count,
        buckets: obs.buckets,
      });
    }
    return entries;
  }

  public reset(): void {
    this.observations.clear();
  }
}

function serializeLabels(labels: Record<string, string>): string {
  const sanitizedPairs: string[] = [];
  for (const [k, v] of Object.entries(labels)) {
    const lower = k.toLowerCase();
    if (FORBIDDEN_LABEL_NAMES.has(lower)) {
      // Discard forbidden high-cardinality labels
      continue;
    }
    sanitizedPairs.push(`${sanitizeLabelKey(k)}="${sanitizeLabelValue(v)}"`);
  }
  sanitizedPairs.sort();
  return sanitizedPairs.join(',');
}

function deserializeLabels(serialized: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!serialized) return result;
  const parts = serialized.split(',');
  for (const p of parts) {
    const match = p.match(/^([a-zA-Z0-9_]+)="([^"]*)"$/);
    if (match) {
      result[match[1]] = match[2];
    }
  }
  return result;
}

export class MetricRegistry {
  private counters: Map<string, Counter> = new Map();
  private gauges: Map<string, Gauge> = new Map();
  private histograms: Map<string, Histogram> = new Map();

  public registerCounter(name: string, help: string, labelNames: string[] = []): Counter {
    let counter = this.counters.get(name);
    if (!counter) {
      counter = new Counter({ name, help, type: 'counter', labelNames });
      this.counters.set(name, counter);
    }
    return counter;
  }

  public registerGauge(name: string, help: string, labelNames: string[] = []): Gauge {
    let gauge = this.gauges.get(name);
    if (!gauge) {
      gauge = new Gauge({ name, help, type: 'gauge', labelNames });
      this.gauges.set(name, gauge);
    }
    return gauge;
  }

  public registerHistogram(name: string, help: string, labelNames: string[] = [], buckets?: number[]): Histogram {
    let hist = this.histograms.get(name);
    if (!hist) {
      hist = new Histogram({ name, help, type: 'histogram', labelNames, buckets });
      this.histograms.set(name, hist);
    }
    return hist;
  }

  public getCounter(name: string): Counter | undefined {
    return this.counters.get(name);
  }

  public getGauge(name: string): Gauge | undefined {
    return this.gauges.get(name);
  }

  public getHistogram(name: string): Histogram | undefined {
    return this.histograms.get(name);
  }

  /**
   * Serializes all metrics into Prometheus standard text format (v0.0.4)
   */
  public toPrometheusText(): string {
    const lines: string[] = [];

    // 1. Counters
    for (const [name, counter] of this.counters.entries()) {
      lines.push(`# HELP ${name} ${counter.definition.help}`);
      lines.push(`# TYPE ${name} counter`);
      const entries = counter.getEntries();
      if (entries.length === 0) {
        lines.push(`${name} 0`);
      } else {
        for (const e of entries) {
          const lblStr = Object.keys(e.labels).length > 0 ? `{${serializeLabels(e.labels)}}` : '';
          lines.push(`${name}${lblStr} ${e.value}`);
        }
      }
    }

    // 2. Gauges
    for (const [name, gauge] of this.gauges.entries()) {
      lines.push(`# HELP ${name} ${gauge.definition.help}`);
      lines.push(`# TYPE ${name} gauge`);
      const entries = gauge.getEntries();
      if (entries.length === 0) {
        lines.push(`${name} 0`);
      } else {
        for (const e of entries) {
          const lblStr = Object.keys(e.labels).length > 0 ? `{${serializeLabels(e.labels)}}` : '';
          lines.push(`${name}${lblStr} ${e.value}`);
        }
      }
    }

    // 3. Histograms
    for (const [name, hist] of this.histograms.entries()) {
      lines.push(`# HELP ${name} ${hist.definition.help}`);
      lines.push(`# TYPE ${name} histogram`);
      const entries = hist.getEntries();
      if (entries.length === 0) {
        lines.push(`${name}_count 0`);
        lines.push(`${name}_sum 0`);
      } else {
        for (const e of entries) {
          const baseLbl = serializeLabels(e.labels);
          for (const [le, count] of e.buckets.entries()) {
            const bucketLbl = baseLbl ? `${baseLbl},le="${le}"` : `le="${le}"`;
            lines.push(`${name}_bucket{${bucketLbl}} ${count}`);
          }
          const infLbl = baseLbl ? `${baseLbl},le="+Inf"` : 'le="+Inf"';
          lines.push(`${name}_bucket{${infLbl}} ${e.count}`);
          const countLbl = baseLbl ? `{${baseLbl}}` : '';
          lines.push(`${name}_sum${countLbl} ${e.sum}`);
          lines.push(`${name}_count${countLbl} ${e.count}`);
        }
      }
    }

    return lines.join('\n') + '\n';
  }

  /**
   * JSON Summary snapshot for Admin Dashboard
   */
  public getSummary(): Record<string, any> {
    const summary: Record<string, any> = {
      counters: {},
      gauges: {},
      histograms: {},
    };

    for (const [name, c] of this.counters.entries()) {
      summary.counters[name] = c.getEntries();
    }
    for (const [name, g] of this.gauges.entries()) {
      summary.gauges[name] = g.getEntries();
    }
    for (const [name, h] of this.histograms.entries()) {
      summary.histograms[name] = h.getEntries().map((entry) => ({
        labels: entry.labels,
        count: entry.count,
        sum: entry.sum,
        avg: entry.count > 0 ? Math.round(entry.sum / entry.count) : 0,
      }));
    }

    return summary;
  }

  public resetAll(): void {
    for (const c of this.counters.values()) c.reset();
    for (const g of this.gauges.values()) g.reset();
    for (const h of this.histograms.values()) h.reset();
  }
}

export const metricsRegistry = new MetricRegistry();

// ──────────────────────────────────────────────────────────────────────────
// PRE-REGISTER CORE DOMAIN METRICS
// ──────────────────────────────────────────────────────────────────────────

// API Metrics
export const httpRequestsTotal = metricsRegistry.registerCounter(
  'http_requests_total',
  'Total HTTP requests processed',
  ['method', 'route', 'status']
);

export const httpRequestDurationMs = metricsRegistry.registerHistogram(
  'http_request_duration_ms',
  'HTTP request latency in milliseconds',
  ['method', 'route', 'status'],
  [10, 25, 50, 100, 250, 500, 1000, 2500, 5000]
);

// Auth Metrics
export const authLoginsTotal = metricsRegistry.registerCounter(
  'auth_logins_total',
  'Total user authentication attempts',
  ['status', 'role']
);

export const authFailuresTotal = metricsRegistry.registerCounter(
  'auth_failures_total',
  'Total authentication and token validation failures',
  ['reason']
);

// Meeting Metrics
export const meetingsCreatedTotal = metricsRegistry.registerCounter(
  'meetings_created_total',
  'Total meetings created',
  ['type']
);

export const activeMeetingsGauge = metricsRegistry.registerGauge(
  'active_meetings_count',
  'Current number of ongoing active meetings'
);

export const activeParticipantsGauge = metricsRegistry.registerGauge(
  'active_participants_count',
  'Current number of connected meeting participants'
);

// Chat Metrics
export const chatMessagesSentTotal = metricsRegistry.registerCounter(
  'chat_messages_sent_total',
  'Total chat messages successfully sent',
  ['type']
);

export const activeWebSocketConnectionsGauge = metricsRegistry.registerGauge(
  'active_websocket_connections',
  'Current number of connected Socket.IO clients'
);

// Kafka & Outbox Metrics
export const outboxBacklogGauge = metricsRegistry.registerGauge(
  'outbox_backlog_count',
  'Current pending events in the transactional outbox'
);

export const kafkaEventsPublishedTotal = metricsRegistry.registerCounter(
  'kafka_events_published_total',
  'Total domain events published to Kafka / Outbox',
  ['topic', 'status']
);

export const kafkaConsumerLagGauge = metricsRegistry.registerGauge(
  'kafka_consumer_lag_count',
  'Estimated consumer lag across consumer groups'
);

// Redis Metrics
export const redisLatencyGauge = metricsRegistry.registerGauge(
  'redis_latency_ms',
  'Redis ping roundtrip latency in milliseconds'
);

export const rateLimitExceededTotal = metricsRegistry.registerCounter(
  'rate_limit_exceeded_total',
  'Total requests rejected by distributed rate limiter',
  ['tier']
);

// Phase 17: Recording, Media Processing & Transcription Metrics
export const recordingSessionsTotal = metricsRegistry.registerCounter(
  'recording_sessions_total',
  'Total recording sessions created',
  ['status']
);

export const mediaProcessingFailuresTotal = metricsRegistry.registerCounter(
  'media_processing_failures_total',
  'Total media processing and transcription failures',
  ['reason']
);

export const mediaProcessingDurationGauge = metricsRegistry.registerGauge(
  'media_processing_duration_ms',
  'Processing duration for meeting media recordings'
);

