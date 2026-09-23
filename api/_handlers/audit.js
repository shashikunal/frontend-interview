// REST API: /api/v1/audit
// Phase 11: Durable Audit Log Query Endpoint (Admin-Only, Append-Only)
// Strictly forbids updates and deletions. Only admins can query audit records.

import { tokenService } from '../../server/auth/tokenService.ts';
import { auditService } from '../../server/observability/auditService.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../server/observability/correlation.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Append-only constraint: Reject any attempt to modify or delete audit logs
  if (req.method !== 'GET') {
    return res.status(405).json(
      createErrorResponse(
        'Method Not Allowed',
        'Audit logs are append-only and cannot be modified or deleted.',
        'METHOD_NOT_ALLOWED',
        correlation.correlationId
      )
    );
  }

  // 1. Authenticate Request
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(
      createErrorResponse('Unauthorized', 'Authentication required to inspect audit logs.', 'MISSING_TOKEN', correlation.correlationId)
    );
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(
      createErrorResponse('Unauthorized', auth.error || 'Invalid session token.', auth.errorCode || 'UNAUTHORIZED', correlation.correlationId)
    );
  }

  // 2. Enforce Admin RBAC Authorization
  if (auth.claims.userRole !== 'admin') {
    // Record security audit event for unauthorized audit inspection attempt
    await auditService.log({
      action: 'SECURITY_AUTHORIZATION_FAILED',
      resourceType: 'audit_logs',
      actorUserId: auth.claims.userId,
      actorEmail: auth.claims.userEmail,
      result: 'DENIED',
      metadata: {
        reason: 'Non-admin attempted to inspect compliance audit logs',
        userRole: auth.claims.userRole,
      },
    });

    return res.status(403).json(
      createErrorResponse(
        'Forbidden',
        'Access denied. Only Platform Administrators may inspect audit logs.',
        'FORBIDDEN',
        correlation.correlationId
      )
    );
  }

  // 3. Query Audit Logs with Filters
  try {
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const limit = parseInt(urlObj.searchParams.get('limit') || req.query?.limit || '50', 10);
    const offset = parseInt(urlObj.searchParams.get('offset') || req.query?.offset || '0', 10);
    const action = urlObj.searchParams.get('action') || req.query?.action || undefined;
    const actorUserId = urlObj.searchParams.get('actorUserId') || req.query?.actorUserId || undefined;
    const resourceType = urlObj.searchParams.get('resourceType') || req.query?.resourceType || undefined;
    const correlationId = urlObj.searchParams.get('correlationId') || req.query?.correlationId || undefined;
    const startDate = urlObj.searchParams.get('startDate') || req.query?.startDate || undefined;
    const endDate = urlObj.searchParams.get('endDate') || req.query?.endDate || undefined;

    const result = await auditService.query({
      limit,
      offset,
      action,
      actorUserId,
      resourceType,
      correlationId,
      startDate,
      endDate,
    });

    return res.status(200).json({
      success: true,
      ...result,
      correlationId: correlation.correlationId,
    });
  } catch (err) {
    return res.status(500).json(
      createErrorResponse('Internal Error', err?.message || 'Failed to query audit logs', 'INTERNAL_ERROR', correlation.correlationId)
    );
  }
}
