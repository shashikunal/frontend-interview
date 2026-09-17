// REST API: /api/v1/meetings
// Control Plane: Meeting List & Admin-Only Meeting Creation

import { meetingService } from '../../../server/meetings/meetingService.ts';
import { tokenService } from '../../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Extract and verify Bearer token
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

  // GET: List Meetings
  if (req.method === 'GET') {
    const urlObj = new URL(req.url || '/', 'http://localhost');
    const status = urlObj.searchParams.get('status') || undefined;
    const hostId = urlObj.searchParams.get('hostId') || undefined;

    const meetings = meetingService.listMeetings({ status, hostId });
    return res.status(200).json({ success: true, count: meetings.length, meetings });
  }

  // POST: Admin-Only Create Meeting
  if (req.method === 'POST') {
    if (user.role !== 'admin') {
      return res.status(403).json(
        createErrorResponse('Forbidden', 'Only platform administrators are permitted to create meetings.', 'FORBIDDEN')
      );
    }

    const { title, description, meetingType, scheduledStartTime, scheduledEndTime, settings } = req.body || {};

    const result = meetingService.createMeeting(user, {
      title,
      description,
      meetingType,
      scheduledStartTime,
      scheduledEndTime,
      settings,
    });

    if (!result.success) {
      const statusCode = result.code === 'FORBIDDEN' ? 403 : 400;
      return res.status(statusCode).json(createErrorResponse('BadRequest', result.error || 'Failed to create meeting', result.code || 'ERROR'));
    }

    return res.status(201).json({ success: true, meeting: result.meeting });
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
}
