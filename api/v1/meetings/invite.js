// REST API: /api/v1/meetings/invite
// Control Plane: Create and issue secure meeting invitations (Admin / Host only)

import { invitationService } from '../../../server/meetings/invitationService.ts';
import { tokenService } from '../../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
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

  // GET: List invitations for a meeting
  if (req.method === 'GET') {
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const meetingId = urlObj.searchParams.get('meetingId');
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required', 'MISSING_PARAM'));
    }

    const invitations = invitationService.listInvitationsForMeeting(meetingId);
    return res.status(200).json({ success: true, count: invitations.length, invitations });
  }

  // POST: Create Invitation
  if (req.method !== 'POST') {
    return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
  }

  const { meetingId, inviteeEmail, inviteeName, assignedRole, expiresInHours } = req.body || {};

  const result = invitationService.createInvitation(user, {
    meetingId,
    inviteeEmail,
    inviteeName,
    assignedRole,
    expiresInHours,
  });

  if (!result.success) {
    const statusCode = result.code === 'FORBIDDEN' ? 403 : result.code === 'MEETING_NOT_FOUND' ? 404 : 400;
    return res.status(statusCode).json(createErrorResponse('BadRequest', result.error || 'Invitation failed', result.code || 'ERROR'));
  }

  return res.status(201).json({
    success: true,
    invitation: result.invitation,
    rawInviteToken: result.rawInviteToken,
    joinUrl: `/meet/${result.invitation.meetingId}?token=${result.rawInviteToken}`,
  });
}
