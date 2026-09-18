// REST API: /api/v1/meetings/join
// Control Plane: Secure Join Validation Pipeline
// Validates meeting status, access tokens, invitations, rate limits, and issues short-lived session tokens

import { invitationService } from '../../../../server/meetings/invitationService.ts';
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

  // 1. Authenticate Request
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to join meeting.', 'MISSING_TOKEN'));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(createErrorResponse('Unauthorized', auth.error || 'Invalid session token.', auth.errorCode || 'UNAUTHORIZED'));
  }

  const user = {
    id: auth.claims.userId,
    email: auth.claims.userEmail,
    name: auth.claims.userName,
    role: auth.claims.userRole,
    permissions: auth.claims.permissions || [],
  };

  const { meetingId, inviteToken } = req.body || {};

  if (!meetingId) {
    return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'MISSING_MEETING_ID'));
  }

  // 2. Execute Secure Join Validation Pipeline
  const result = invitationService.validateJoin(user, meetingId, inviteToken);

  if (!result.success) {
    let statusCode = 400;
    if (result.code === 'RATE_LIMITED') statusCode = 429;
    else if (result.code === 'MEETING_NOT_FOUND') statusCode = 404;
    else if (result.code === 'UNAUTHORIZED_MEETING_ACCESS' || result.code === 'INVITATION_EXPIRED' || result.code === 'INVITATION_REVOKED') statusCode = 403;
    else if (result.code === 'MEETING_CANCELLED' || result.code === 'MEETING_ENDED') statusCode = 410; // Gone

    return res.status(statusCode).json(createErrorResponse(
      result.code === 'RATE_LIMITED' ? 'TooManyRequests' : result.code === 'MEETING_NOT_FOUND' ? 'NotFound' : 'Forbidden',
      result.error || 'Join validation failed.',
      result.code || 'JOIN_REJECTED'
    ));
  }

  return res.status(200).json({
    success: true,
    meeting: result.meeting,
    meetingRole: result.meetingRole,
    meetingToken: result.meetingToken,
    tokenId: result.tokenId,
    expiresAt: result.expiresAt,
  });
}
