// REST API: /api/v1/performance
// Phase 15: Performance Observability Endpoint
//
// Returns computed p50/p95/p99 latency breakdown per route,
// plus throughput summary and error rates from the Phase 11 metrics registry.
// All data comes from real in-process measurements — no invented numbers.

import { getAllRoutePercentiles } from '../../server/performance/apiLatencyMiddleware.ts';
import { metricsRegistry } from '../../server/observability/metrics.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../server/observability/correlation.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Per-route percentile breakdown
  const routePercentiles = getAllRoutePercentiles();

  // Aggregate throughput from Prometheus counters
  const summary = metricsRegistry.getSummary();
  const httpCounters = summary.counters['http_requests_total'] || [];

  let totalRequests = 0;
  let errorRequests = 0;
  for (const entry of httpCounters) {
    totalRequests += entry.value;
    const status = entry.labels?.status || '';
    if (status.startsWith('5') || status.startsWith('4')) {
      errorRequests += entry.value;
    }
  }

  // WebSocket connections
  const wsGauges = summary.gauges['active_websocket_connections'] || [];
  const wsConnections = wsGauges.reduce((sum, e) => sum + (e.value || 0), 0);

  // Active meetings
  const meetingGauges = summary.gauges['active_meetings_count'] || [];
  const activeMeetings = meetingGauges.reduce((sum, e) => sum + (e.value || 0), 0);

  // Kafka lag
  const kafkaLagGauges = summary.gauges['kafka_consumer_lag_count'] || [];
  const kafkaLag = kafkaLagGauges.reduce((sum, e) => sum + (e.value || 0), 0);

  // Redis latency
  const redisLatGauges = summary.gauges['redis_latency_ms'] || [];
  const redisLatencyMs = redisLatGauges.length > 0 ? redisLatGauges[0].value || 0 : null;

  // Outbox backlog
  const outboxGauges = summary.gauges['outbox_backlog_count'] || [];
  const outboxBacklog = outboxGauges.reduce((sum, e) => sum + (e.value || 0), 0);

  const errorRate = totalRequests > 0
    ? parseFloat(((errorRequests / totalRequests) * 100).toFixed(2))
    : 0;

  return res.status(200).json({
    timestamp: new Date().toISOString(),
    correlationId: correlation.correlationId,
    summary: {
      totalRequests,
      errorRequests,
      errorRatePercent: errorRate,
      activeWebSocketConnections: wsConnections,
      activeMeetings,
      kafkaConsumerLag: kafkaLag,
      redisLatencyMs,
      outboxBacklog,
    },
    // Per-route percentile breakdown (sorted by p95 descending — worst routes first)
    routePercentiles,
    // Performance targets (from docs/performance/performance-baseline.md)
    targets: {
      api_p50_ms: 50,
      api_p95_ms: 200,
      api_p99_ms: 500,
      redis_latency_ms: 5,
      websocket_message_ms: 50,
      meeting_join_ms: 1000,
    },
  });
}
