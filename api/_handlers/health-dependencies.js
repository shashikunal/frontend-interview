// REST API: /api/v1/health/dependencies
// Phase 11: Comprehensive Dependency Observability & Alert Evaluation
// Inspects PostgreSQL, Redis, Kafka, Socket.IO, Notifications, and SFU

import { healthService } from '../../server/observability/healthService.ts';
import { alertingService } from '../../server/observability/alerting.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../server/observability/correlation.ts';
import { httpRequestsTotal } from '../../server/observability/metrics.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const [dependencies, alertSummary] = await Promise.all([
      healthService.checkAllDependencies(),
      alertingService.evaluateAlerts(),
    ]);

    httpRequestsTotal.inc({
      method: req.method || 'GET',
      route: '/api/v1/health/dependencies',
      status: '200',
    });

    return res.status(200).json({
      ...dependencies,
      alerts: alertSummary,
      correlationId: correlation.correlationId,
      requestId: correlation.requestId,
    });
  } catch (err) {
    httpRequestsTotal.inc({
      method: req.method || 'GET',
      route: '/api/v1/health/dependencies',
      status: '500',
    });

    return res.status(500).json({
      timestamp: new Date().toISOString(),
      status: 'DOWN',
      error: err?.message || 'Dependency inspection failed',
      correlationId: correlation.correlationId,
      requestId: correlation.requestId,
    });
  }
}
