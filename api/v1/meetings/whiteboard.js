// REST API: /api/v1/meetings/whiteboard
// Media & Realtime Plane: In-Meeting Collaborative Vector Whiteboard
// Handles canvas state snapshot retrieval, shape upserts, deletions, and canvas clearing

import { tokenService } from '../../../server/auth/tokenService.ts';
import { whiteboardService } from '../../../server/meetings/whiteboardService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Authenticate Caller
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required for whiteboard.', 'MISSING_TOKEN'));
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const auth = tokenService.verifyMeetingToken(token);

  if (!auth.valid || !auth.claims) {
    return res.status(401).json(createErrorResponse('Unauthorized', auth.error || 'Invalid session token.', auth.errorCode || 'UNAUTHORIZED'));
  }

  const caller = {
    id: auth.claims.userId,
    email: auth.claims.userEmail,
    name: auth.claims.userName,
    role: auth.claims.userRole,
    meetingRole: auth.claims.meetingRole,
    permissions: auth.claims.permissions || [],
  };

  // 2. Handle GET: Get Whiteboard Snapshot
  if (req.method === 'GET') {
    const meetingId = req.query?.meetingId || auth.claims.meetingId;
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId query parameter is required.', 'MISSING_MEETING_ID'));
    }

    const snapshot = whiteboardService.getSnapshot(meetingId);
    return res.status(200).json({
      success: true,
      snapshot,
    });
  }

  // 3. Handle POST: Modify Whiteboard State
  if (req.method === 'POST') {
    const { meetingId, action = 'UPSERT', element, elementId } = req.body || {};
    const targetMeetingId = meetingId || auth.claims.meetingId;

    if (!targetMeetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'MISSING_MEETING_ID'));
    }

    if (action === 'UPSERT') {
      if (!element || !element.id || !element.type) {
        return res.status(400).json(createErrorResponse('BadRequest', 'Valid element id and type are required.', 'INVALID_ELEMENT'));
      }

      const result = whiteboardService.upsertElement(caller, targetMeetingId, element);
      if (!result.success) {
        const statusCode = result.code === 'MEETING_NOT_FOUND' ? 404 : result.code?.startsWith('MEETING_') ? 410 : 400;
        return res.status(statusCode).json(createErrorResponse('BadRequest', result.error || 'Failed to update whiteboard.', result.code || 'UPSERT_FAILED'));
      }

      return res.status(200).json(result);
    }

    if (action === 'DELETE') {
      if (!elementId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'elementId is required for DELETE action.', 'MISSING_ELEMENT_ID'));
      }

      const result = whiteboardService.deleteElement(caller, targetMeetingId, elementId);
      if (!result.success) {
        const statusCode = result.code === 'ELEMENT_NOT_FOUND' || result.code === 'MEETING_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(createErrorResponse('BadRequest', result.error || 'Failed to delete element.', result.code || 'DELETE_FAILED'));
      }

      return res.status(200).json(result);
    }

    if (action === 'CLEAR') {
      const result = whiteboardService.clearBoard(caller, targetMeetingId);
      if (!result.success) {
        return res.status(400).json(createErrorResponse('BadRequest', result.error || 'Failed to clear board.', result.code || 'CLEAR_FAILED'));
      }

      return res.status(200).json(result);
    }

    return res.status(400).json(createErrorResponse('BadRequest', `Unknown action: ${action}`, 'INVALID_ACTION'));
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
}
