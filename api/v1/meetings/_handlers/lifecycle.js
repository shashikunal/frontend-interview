// REST API: /api/v1/meetings/lifecycle
// Control Plane: Explicit Server-Side Lifecycle State Transitions

import { meetingService } from '../../../../server/meetings/meetingService.ts';
import { tokenService } from '../../../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
  }

  // Verify Bearer Token
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required', 'MISSING_TOKEN'));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(createErrorResponse('Unauthorized', auth.error || 'Invalid token', auth.errorCode || 'UNAUTHORIZED'));
  }

  const user = {
    id: auth.claims.userId,
    email: auth.claims.userEmail,
    name: auth.claims.userName,
    role: auth.claims.userRole,
    permissions: auth.claims.permissions || [],
  };

  // RBAC: Only Admin can transition lifecycle states
  if (user.role !== 'admin') {
    return res.status(403).json(
      createErrorResponse('Forbidden', 'Only platform administrators may alter meeting lifecycle states.', 'FORBIDDEN')
    );
  }

  const { meetingId, targetStatus, reason } = req.body || {};

  if (!meetingId || !targetStatus) {
    return res.status(400).json(
      createErrorResponse('BadRequest', 'meetingId and targetStatus are required.', 'MISSING_PARAMS')
    );
  }

  const result = meetingService.transitionStatus(user, meetingId, targetStatus, reason);

  if (!result.success) {
    const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'MEETING_NOT_FOUND' ? 404 : 400;
    return res.status(statusCode).json(
      createErrorResponse('BadRequest', result.error || 'Transition rejected', result.code || 'INVALID_TRANSITION')
    );
  }

  return res.status(200).json({ success: true, meeting: result.meeting });
}
