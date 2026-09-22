// Health Check API: /api/v1/health/kafka
// Phase 9: Kafka + Event Architecture + Transactional Outbox Observability

import { getKafkaTelemetry } from '../../../server/kafka/observability.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const telemetry = await getKafkaTelemetry();
    // Return 200 OK because the resilient dual-layer fallback guarantees full application availability
    return res.status(200).json(telemetry);
  } catch (err) {
    return res.status(500).json({
      timestamp: new Date().toISOString(),
      service: 'kafka',
      status: 'DOWN',
      error: err?.message || 'Failed to inspect Kafka telemetry',
    });
  }
}
