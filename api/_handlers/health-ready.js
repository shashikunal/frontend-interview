// REST API: /api/v1/health/ready
// Phase 11: Production Readiness Probe
// Evaluates critical dependencies to determine if application can safely accept traffic

import { healthService } from '../../server/observability/healthService.ts';
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
    const readiness = await healthService.checkReadiness();
    const statusCode = readiness.ready ? 200 : 503;

    httpRequestsTotal.inc({
      method: req.method || 'GET',
      route: '/api/v1/health/ready',
      status: String(statusCode),
    });

    return res.status(statusCode).json({
      ...readiness,
      correlationId: correlation.correlationId,
      requestId: correlation.requestId,
    });
  } catch (err) {
    httpRequestsTotal.inc({
      method: req.method || 'GET',
      route: '/api/v1/health/ready',
      status: '503',
    });

    return res.status(503).json({
      ready: false,
      status: 'DOWN',
      error: err?.message || 'Readiness evaluation failed',
      correlationId: correlation.correlationId,
      requestId: correlation.requestId,
      timestamp: new Date().toISOString(),
    });
  }
}
