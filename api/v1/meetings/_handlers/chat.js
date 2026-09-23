import { tokenService } from '../../../../server/auth/tokenService.ts';
import { chatService } from '../../../../server/meetings/chatService.ts';
import { meetingService } from '../../../../server/meetings/meetingService.ts';
import { createErrorResponse } from '../../../../server/auth/rbacMiddleware.ts';
import { applySecurityHeaders } from '../../../../server/security/securityHeaders.ts';

export default async function handler(req, res) {
  if (!applySecurityHeaders(req, res)) {
    return;
  }

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

  // 2. Handle GET /api/v1/meetings/chat?meetingId=...&cursor=...&limit=...
  if (req.method === 'GET') {
    const meetingId = req.query?.meetingId || auth.claims.meetingId;
    if (!meetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId query parameter is required.', 'MISSING_MEETING_ID'));
    }

    if (caller.role !== 'admin') {
      if (auth.claims.meetingId && meetingId !== auth.claims.meetingId) {
        return res.status(403).json(createErrorResponse('Forbidden', 'Session token does not grant access to this meeting.', 'ACCESS_DENIED'));
      }
      const meeting = meetingService.getMeetingById(meetingId);
      if (!meeting) {
        return res.status(404).json(createErrorResponse('NotFound', 'Meeting not found.', 'NOT_FOUND'));
      }
      if (meeting.hostId !== caller.id && (!auth.claims.meetingId || auth.claims.meetingId !== meetingId)) {
        return res.status(403).json(createErrorResponse('Forbidden', 'You are not a participant in this meeting.', 'ACCESS_DENIED'));
      }
    }

    const cursor = req.query?.cursor;
    const limit = req.query?.limit ? parseInt(req.query.limit, 10) : 50;
    const direction = req.query?.direction === 'AFTER' ? 'AFTER' : 'BEFORE';

    const historyResult = chatService.getPaginatedHistory(caller.id, meetingId, {
      meetingId,
      cursor,
      limit,
      direction,
    });

    return res.status(200).json({
      success: true,
      meetingId,
      messages: historyResult.messages,
      nextCursor: historyResult.nextCursor,
      hasMore: historyResult.hasMore,
      totalCount: historyResult.totalCount,
    });
  }

  // 3. Handle DELETE /api/v1/meetings/chat?messageId=...
  if (req.method === 'DELETE') {
    const messageId = req.query?.messageId || req.body?.messageId;
    if (!messageId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'messageId is required for deletion.', 'MISSING_MESSAGE_ID'));
    }

    const deleteResult = chatService.deleteMessage(caller, messageId);
    if (!deleteResult.success) {
      const statusCode = deleteResult.code === 'FORBIDDEN' ? 403 : deleteResult.code === 'MESSAGE_NOT_FOUND' ? 404 : 400;
      return res.status(statusCode).json(createErrorResponse(
        statusCode === 403 ? 'Forbidden' : statusCode === 404 ? 'NotFound' : 'BadRequest',
        deleteResult.error || 'Failed to delete message.',
        deleteResult.code || 'DELETE_FAILED'
      ));
    }

    return res.status(200).json(deleteResult);
  }

  // 4. Handle POST /api/v1/meetings/chat
  if (req.method === 'POST') {
    const {
      action = 'SEND',
      meetingId,
      content,
      recipientId,
      messageType,
      codeLanguage,
      replyToMessageId,
      messageId,
      emoji,
      allowChat,
      correlationId,
    } = req.body || {};

    const targetMeetingId = meetingId || auth.claims.meetingId;
    if (!targetMeetingId) {
      return res.status(400).json(createErrorResponse('BadRequest', 'meetingId is required.', 'MISSING_MEETING_ID'));
    }

    if (auth.claims.meetingId && targetMeetingId !== auth.claims.meetingId && caller.role !== 'admin') {
      return res.status(403).json(createErrorResponse('Forbidden', 'Session token does not grant access to this meeting.', 'ACCESS_DENIED'));
    }

    // Action: EMOJI REACTION
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

    // Action: MESSAGE DELETION
    if (action === 'DELETE') {
      if (!messageId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'messageId is required.', 'MISSING_MESSAGE_ID'));
      }

      const deleteResult = chatService.deleteMessage(caller, messageId);
      if (!deleteResult.success) {
        const statusCode = deleteResult.code === 'FORBIDDEN' ? 403 : deleteResult.code === 'MESSAGE_NOT_FOUND' ? 404 : 400;
        return res.status(statusCode).json(createErrorResponse(
          statusCode === 403 ? 'Forbidden' : 'BadRequest',
          deleteResult.error || 'Failed to delete message.',
          deleteResult.code || 'DELETE_FAILED'
        ));
      }

      return res.status(200).json(deleteResult);
    }

    // Action: TOGGLE CHAT (Host enable/disable)
    if (action === 'TOGGLE_CHAT') {
      const toggleResult = chatService.toggleChat(caller, targetMeetingId, !!allowChat);
      if (!toggleResult.success) {
        return res.status(403).json(createErrorResponse('Forbidden', toggleResult.error || 'Cannot toggle chat.', toggleResult.code || 'FORBIDDEN'));
      }
      return res.status(200).json(toggleResult);
    }

    // Action: HOST ANNOUNCEMENT
    if (action === 'ANNOUNCEMENT') {
      const announcementResult = chatService.sendAnnouncement(caller, targetMeetingId, content, correlationId);
      if (!announcementResult.success) {
        const statusCode = announcementResult.code === 'FORBIDDEN' ? 403 : 400;
        return res.status(statusCode).json(createErrorResponse(
          statusCode === 403 ? 'Forbidden' : 'BadRequest',
          announcementResult.error || 'Failed to post announcement.',
          announcementResult.code || 'ANNOUNCEMENT_FAILED'
        ));
      }
      return res.status(201).json(announcementResult);
    }

    // Default action: SEND message
    const sendResult = chatService.sendMessage(caller, {
      meetingId: targetMeetingId,
      recipientId,
      content,
      messageType,
      codeLanguage,
      replyToMessageId,
      correlationId,
    });

    if (!sendResult.success) {
      let statusCode = 400;
      if (sendResult.code === 'CHAT_DISABLED') statusCode = 403;
      else if (sendResult.code === 'MEETING_NOT_FOUND') statusCode = 404;
      else if (sendResult.code === 'RATE_LIMITED') statusCode = 429;
      else if (sendResult.code?.startsWith('MEETING_')) statusCode = 410;

      return res.status(statusCode).json(createErrorResponse(
        statusCode === 403 ? 'Forbidden' : statusCode === 404 ? 'NotFound' : statusCode === 429 ? 'TooManyRequests' : 'BadRequest',
        sendResult.error || 'Failed to send message.',
        sendResult.code || 'SEND_FAILED'
      ));
    }

    return res.status(201).json(sendResult);
  }

  return res.status(405).json(createErrorResponse('MethodNotAllowed', 'Method Not Allowed', 'METHOD_NOT_ALLOWED'));
}
