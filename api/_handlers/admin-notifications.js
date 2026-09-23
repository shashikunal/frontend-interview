// REST API: GET /api/v1/admin/notifications
// Notification Monitoring & Dead-Letter Queue (DLQ) Inspector
// Strictly enforces ADMIN role verification via JWT Bearer token

import { adminService } from '../../server/admin/adminService.ts';
import { tokenService } from '../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../server/observability/correlation.ts';
import { logger } from '../../server/observability/logger.ts';
import { authFailuresTotal } from '../../server/observability/metrics.ts';
import { auditService } from '../../server/observability/auditService.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED', correlation.correlationId));
  }

  // 1. Verify Bearer Token
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    authFailuresTotal.inc({ reason: 'MISSING_TOKEN' });
    return res.status(401).json(
      createErrorResponse('Unauthorized', 'Authentication required. Bearer token missing.', 'MISSING_TOKEN', correlation.correlationId)
    );
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    authFailuresTotal.inc({ reason: auth.errorCode || 'INVALID_TOKEN' });
    return res.status(401).json(
      createErrorResponse('Unauthorized', auth.error || 'Invalid or expired token.', auth.errorCode || 'UNAUTHORIZED', correlation.correlationId)
    );
  }

  // 2. Strict Role Enforcement (ADMIN ONLY)
  if (auth.claims.userRole !== 'admin') {
    authFailuresTotal.inc({ reason: 'NON_ADMIN_ACCESS_FORBIDDEN' });
    auditService.log({
      action: 'SECURITY_AUTHORIZATION_FAILED',
      resourceType: 'admin_notifications',
      resourceId: req.url,
      actorUserId: auth.claims.userId,
      actorEmail: auth.claims.userEmail,
      result: 'DENIED',
      metadata: { attemptedRole: auth.claims.userRole },
    });
    return res.status(403).json(
      createErrorResponse('Forbidden', 'Access denied. Administrator privileges required.', 'FORBIDDEN', correlation.correlationId)
    );
  }

  try {
    const telemetry = adminService.getNotificationTelemetry();

    logger.info('Notification telemetry and DLQ records fetched', {
      actorId: auth.claims.userId,
      dlqCount: telemetry.dlqRecords.length,
    });

    return res.status(200).json({
      success: true,
      data: telemetry,
      correlationId: correlation.correlationId,
    });
  } catch (err) {
    logger.error('Failed to retrieve notification telemetry', { error: err.message });
    return res.status(500).json(
      createErrorResponse('InternalServerError', 'Failed to retrieve notification telemetry.', 'INTERNAL_ERROR', correlation.correlationId)
    );
  }
}
