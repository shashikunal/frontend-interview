// REST API: /api/v1/meetings
// Control Plane: Meeting List & Admin-Only Meeting Creation + Sub-route Router

import { meetingService } from '../../server/meetings/meetingService.ts';
import { tokenService } from '../../server/auth/tokenService.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';

import chatHandler from './meetings/chat.js';
import editorHandler from './meetings/editor.js';
import inviteHandler from './meetings/invite.js';
import joinHandler from './meetings/join.js';
import lifecycleHandler from './meetings/lifecycle.js';
import mediaTokenHandler from './meetings/media-token.js';
import whiteboardHandler from './meetings/whiteboard.js';
import recordingHandler from './meetings/recording.js';
import { applySecurityHeaders } from '../../server/security/securityHeaders.ts';

export default async function handler(req, res) {
  const urlObj = new URL(req.url || '/', 'http://localhost');
  const pathname = urlObj.pathname;
  const subpath = (req.query?._subpath || urlObj.searchParams.get('_subpath') || '').toLowerCase();

  // Dispatch to sub-handlers when invoked via Vercel rewrite or direct routing
  if (pathname.endsWith('/recording') || pathname.includes('/recording') || subpath === 'recording') {
    return recordingHandler(req, res);
  }
  if (pathname.endsWith('/chat') || pathname.includes('/chat') || subpath === 'chat') {
    return chatHandler(req, res);
  }
  if (pathname.endsWith('/editor') || pathname.includes('/editor') || subpath === 'editor') {
    return editorHandler(req, res);
  }
  if (pathname.endsWith('/invite') || pathname.includes('/invite') || subpath === 'invite') {
    return inviteHandler(req, res);
  }
  if (pathname.endsWith('/join') || pathname.includes('/join') || subpath === 'join') {
    return joinHandler(req, res);
  }
  if (pathname.endsWith('/lifecycle') || pathname.includes('/lifecycle') || subpath === 'lifecycle') {
    return lifecycleHandler(req, res);
  }
  if (pathname.endsWith('/media-token') || pathname.includes('/media-token') || subpath === 'media-token') {
    return mediaTokenHandler(req, res);
  }
  if (pathname.endsWith('/whiteboard') || pathname.includes('/whiteboard') || subpath === 'whiteboard') {
    return whiteboardHandler(req, res);
  }

  // Base /api/v1/meetings handler
  if (!applySecurityHeaders(req, res)) {
    return;
  }

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

  // GET: List Meetings (RBAC Enforced: Non-admins can ONLY view their own meetings)
  if (req.method === 'GET') {
    const status = urlObj.searchParams.get('status') || undefined;
    const requestedHostId = urlObj.searchParams.get('hostId') || undefined;

    // RBAC: Non-admins cannot enumerate all meetings across the platform
    const effectiveHostId = user.role === 'admin' ? (requestedHostId || undefined) : user.id;

    const meetings = meetingService.listMeetings({ status, hostId: effectiveHostId });
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
