// REST API: /api/v1/health
// Phase 11: Production Liveness Probe
// Indicates if the process is up, healthy, and responsive

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

  httpRequestsTotal.inc({ method: req.method || 'GET', route: '/api/v1/health', status: '200' });

  const liveness = healthService.checkLiveness();
  return res.status(200).json({
    ...liveness,
    correlationId: correlation.correlationId,
    requestId: correlation.requestId,
  });
}
