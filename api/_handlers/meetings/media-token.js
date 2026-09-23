// REST API: /api/v1/meetings/media-token
// Media Plane: WebRTC / SFU Credentials & Media Token Generation
// Issues secure media token with role-based track publishing permissions

import { tokenService } from '../../../server/auth/tokenService.ts';
import { meetingService } from '../../../server/meetings/meetingService.ts';
import { mediaTokenService } from '../../../server/meetings/mediaTokenService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';

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

  // 1. Authenticate Caller
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to obtain media token.', 'MISSING_TOKEN'));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(createErrorResponse('Unauthorized', auth.error || 'Invalid session token.', auth.errorCode || 'UNAUTHORIZED'));
  }

  const { meetingId } = req.body || {};
  const claimMeetingId = auth.claims.meetingId || meetingId;

  if (!claimMeetingId) {
    return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'MISSING_MEETING_ID'));
  }

  // 2. Validate Meeting State
  const meeting = meetingService.getMeetingById(claimMeetingId);
  if (!meeting) {
    return res.status(404).json(createErrorResponse('NotFound', 'Meeting not found.', 'MEETING_NOT_FOUND'));
  }

  if (meeting.status === 'CANCELLED' || meeting.status === 'ENDED' || meeting.status === 'ARCHIVED') {
    return res.status(410).json(createErrorResponse('Gone', `Meeting has concluded (${meeting.status}).`, `MEETING_${meeting.status}`));
  }

  // 3. Issue Media Credentials
  const credentials = mediaTokenService.createMediaCredentials({
    meetingId: meeting.id,
    participantId: auth.claims.userId,
    participantName: auth.claims.userName,
    meetingRole: auth.claims.meetingRole,
    settings: meeting.settings,
  });

  return res.status(200).json(credentials);
}
