// REST API: /api/v1/meetings/chat
// Media & Realtime Plane: In-Meeting Multi-Party Chat & Direct Messaging
// Handles message dispatch, direct message privacy isolation, threading, and reactions

import { tokenService } from '../../../server/auth/tokenService.ts';
import { chatService } from '../../../server/meetings/chatService.ts';
import { createErrorResponse } from '../../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Authenticate Request
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to access chat.', 'MISSING_TOKEN'));
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

  // 2. Handle GET /api/v1/meetings/chat?meetingId=...
  if (req.method === 'GET') {
    const meetingId = req.query?.meetingId || auth.claims.meetingId;
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId query parameter is required.', 'MISSING_MEETING_ID'));
    }

    const messages = chatService.getMessagesForUser(caller.id, meetingId);
    return res.status(200).json({
      success: true,
      meetingId,
      messages,
    });
  }

  // 3. Handle POST /api/v1/meetings/chat
  if (req.method === 'POST') {
    const { action = 'SEND', meetingId, content, recipientId, messageType, codeLanguage, replyToMessageId, messageId, emoji } = req.body || {};
    const targetMeetingId = meetingId || auth.claims.meetingId;

    if (!targetMeetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'MISSING_MEETING_ID'));
    }

    if (action === 'REACTION') {
      if (!messageId || !emoji) {
        return res.status(400).json(createErrorResponse('BadRequest', 'messageId and emoji are required.', 'MISSING_REACTION_FIELDS'));
      }

      const reactionResult = chatService.addReaction(caller.id, {
        meetingId: targetMeetingId,
        messageId,
        emoji,
      });

      if (!reactionResult.success) {
        const statusCode = reactionResult.code === 'MESSAGE_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(createErrorResponse('BadRequest', reactionResult.error || 'Failed to add reaction.', reactionResult.code || 'REACTION_FAILED'));
      }

      return res.status(200).json(reactionResult);
    }

    // Default action: SEND message
    const sendResult = chatService.sendMessage(caller, {
      meetingId: targetMeetingId,
      recipientId,
      content,
      messageType,
      codeLanguage,
      replyToMessageId,
    });

    if (!sendResult.success) {
      let statusCode = 400;
      if (sendResult.code === 'CHAT_DISABLED') statusCode = 403;
      else if (sendResult.code === 'MEETING_NOT_FOUND') statusCode = 404;
      else if (sendResult.code?.startsWith('MEETING_')) statusCode = 410;

      return res.status(statusCode).json(createErrorResponse(
        statusCode === 403 ? 'Forbidden' : statusCode === 404 ? 'NotFound' : 'BadRequest',
        sendResult.error || 'Failed to send message.',
        sendResult.code || 'SEND_FAILED'
      ));
    }

    return res.status(201).json(sendResult);
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
}
