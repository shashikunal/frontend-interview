// Vercel Serverless & Local Middleware: /api/v1/auth/token
// Generates and cryptographically signs meeting access tokens

import { tokenService } from '../../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // GET: Health / Verify Token
  if (req.method === 'GET') {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(createErrorResponse('Unauthorized', 'Missing token', 'MISSING_TOKEN'));
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const result = tokenService.verifyMeetingToken(token);

    if (!result.valid) {
      return res.status(401).json(createErrorResponse('Unauthorized', result.error || 'Invalid token', result.errorCode || 'INVALID'));
    }

    return res.status(200).json({ success: true, claims: result.claims });
  }

  // POST: Issue Meeting Token
  if (req.method !== 'POST') {
    return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
  }

  const { meetingId, userId, userEmail, userName, userRole } = req.body || {};

  if (!meetingId || !userId) {
    return res.status(400).json(
      createErrorResponse('BadRequest', 'meetingId and userId are required parameters.', 'MISSING_PARAMS')
    );
  }

  // Server-side role normalization: Ensure role is valid
  const effectiveRole = userRole || 'candidate';
  const meetingRole = effectiveRole === 'admin' ? 'HOST' : 'PARTICIPANT';

  const tokenData = tokenService.generateMeetingToken({
    userId,
    userEmail: userEmail || `${userId}@example.com`,
    userName: userName || 'Participant',
    userRole: effectiveRole,
    meetingId,
    meetingRole,
    permissions: effectiveRole === 'admin' ? ['admin:all', 'meetings:all'] : ['meetings:participate'],
  });

  return res.status(200).json({
    success: true,
    token: tokenData.token,
    tokenId: tokenData.tokenId,
    expiresAt: tokenData.expiresAt,
    meetingRole,
  });
}
