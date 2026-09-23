// REST API: /api/v1/admin/meetings
// Meeting Management: Server-side listing, participant details, and lifecycle control
// Strictly enforces ADMIN role verification via JWT Bearer token

import { adminService } from '../../server/admin/adminService.ts';
import { meetingService } from '../../server/meetings/meetingService.ts';
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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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
      resourceType: 'admin_meetings',
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

  // GET: Meeting List OR Meeting Details
  if (req.method === 'GET') {
    const meetingId = urlObj.searchParams.get('meetingId') || urlObj.searchParams.get('id');

    // Single Meeting Details with Roster
    if (meetingId) {
      const details = adminService.getMeetingDetails(meetingId);
      if (!details) {
        return res.status(404).json(
          createErrorResponse('NotFound', `Meeting '${meetingId}' not found.`, 'MEETING_NOT_FOUND', correlation.correlationId)
        );
      }
      return res.status(200).json({
        success: true,
        data: details,
        correlationId: correlation.correlationId,
      });
    }

    // Paginated Meeting List
    const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
    const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);
    const status = urlObj.searchParams.get('status') || undefined;
    const hostId = urlObj.searchParams.get('hostId') || undefined;
    const search = urlObj.searchParams.get('search') || undefined;

    try {
      const result = adminService.getMeetings({
        page,
        limit,
        status,
        hostId,
        search,
      });

      return res.status(200).json({
        success: true,
        ...result,
        correlationId: correlation.correlationId,
      });
    } catch (err) {
      logger.error('Failed to retrieve meetings list', { error: err.message });
      return res.status(500).json(
        createErrorResponse('InternalServerError', 'Failed to retrieve meeting records.', 'INTERNAL_ERROR', correlation.correlationId)
      );
    }
  }

  // POST: Admin Lifecycle Transition (Cancel / End meeting)
  if (req.method === 'POST') {
    const { meetingId, targetStatus, reason } = req.body || {};

    if (!meetingId || !targetStatus) {
      return res.status(400).json(
        createErrorResponse('BadRequest', 'meetingId and targetStatus are required.', 'INVALID_PARAMETERS', correlation.correlationId)
      );
    }

    const caller = {
      id: auth.claims.userId,
      email: auth.claims.userEmail,
      name: auth.claims.userName,
      role: auth.claims.userRole,
      permissions: auth.claims.permissions || [],
    };

    const result = meetingService.transitionStatus(caller, meetingId, targetStatus, reason);

    if (!result.success) {
      const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'MEETING_NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(
        createErrorResponse('BadRequest', result.error || 'Transition failed', result.code || 'TRANSITION_ERROR', correlation.correlationId)
      );
    }

    return res.status(200).json({
      success: true,
      meeting: result.meeting,
      correlationId: correlation.correlationId,
    });
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED', correlation.correlationId));
}
