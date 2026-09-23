// REST API: /api/v1/admin/users
// User Management: Server-side search, filtering, pagination, and status updates
// Strictly enforces ADMIN role verification via JWT Bearer token

import { adminService } from '../../../server/admin/adminService.ts';
import { tokenService } from '../../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';
import { extractCorrelationContext, injectCorrelationHeaders } from '../../../server/observability/correlation.ts';
import { logger } from '../../../server/observability/logger.ts';
import { authFailuresTotal } from '../../../server/observability/metrics.ts';
import { auditService } from '../../../server/observability/auditService.ts';

export default async function handler(req, res) {
  const correlation = extractCorrelationContext(req);
  injectCorrelationHeaders(res, correlation);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-Id, X-Correlation-Id');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
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
      resourceType: 'admin_users',
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

  const urlObj = new URL(req.url || '/', 'http://localhost');

  // GET: Paginated & Filtered Users
  if (req.method === 'GET') {
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);
    const search = urlObj.searchParams.get('search') || undefined;
    const role = urlObj.searchParams.get('role') || undefined;
    const status = urlObj.searchParams.get('status') || undefined;
    const sortBy = urlObj.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (urlObj.searchParams.get('sortOrder') || 'desc') === 'asc' ? 'asc' : 'desc';

    try {
      const result = await adminService.getUsers({
        page,
        limit,
        search,
        role,
        status,
        sortBy,
        sortOrder,
      });

      logger.info('Admin users list retrieved', {
        actorId: auth.claims.userId,
        total: result.pagination.total,
        page: result.pagination.page,
      });

      return res.status(200).json({
        success: true,
        ...result,
        correlationId: correlation.correlationId,
      });
    } catch (err) {
      logger.error('Failed to retrieve user list', { error: err.message });
      return res.status(500).json(
        createErrorResponse('InternalServerError', 'Failed to retrieve user directory.', 'INTERNAL_ERROR', correlation.correlationId)
      );
    }
  }

  // PATCH: Update User Account Status
  if (req.method === 'PATCH') {
    const { userId, status } = req.body || {};

    if (!userId || !status) {
      return res.status(400).json(
        createErrorResponse('BadRequest', 'userId and status (ACTIVE | SUSPENDED) are required.', 'INVALID_PARAMETERS', correlation.correlationId)
      );
    }

    if (status !== 'ACTIVE' && status !== 'SUSPENDED') {
      return res.status(400).json(
        createErrorResponse('BadRequest', 'status must be either ACTIVE or SUSPENDED.', 'INVALID_STATUS', correlation.correlationId)
      );
    }

    const caller = {
      id: auth.claims.userId,
      email: auth.claims.userEmail,
      name: auth.claims.userName,
      role: auth.claims.userRole,
      permissions: auth.claims.permissions || [],
    };

    const result = await adminService.updateUserStatus(caller, userId, status);

    if (!result.success) {
      return res.status(400).json(
        createErrorResponse('BadRequest', result.message, 'UPDATE_FAILED', correlation.correlationId)
      );
    }

    return res.status(200).json({
      success: true,
      message: result.message,
      correlationId: correlation.correlationId,
    });
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED', correlation.correlationId));
}
