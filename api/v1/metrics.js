// REST API: /api/v1/metrics
// Phase 11: Prometheus Metrics Exposition Endpoint
// Formats metrics into standard Prometheus v0.0.4 text or JSON format

import { metricsRegistry } from '../../server/observability/metrics.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../server/observability/correlation.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const urlObj = new URL(req.url || '/', 'http://localhost');
  const format = urlObj.searchParams.get('format') || req.query?.format || 'text';

  if (format === 'json') {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(metricsRegistry.getSummary());
  }

  // Standard Prometheus text exposition format
  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  const prometheusBody = metricsRegistry.toPrometheusText();
  return res.status(200).send(prometheusBody);
}
