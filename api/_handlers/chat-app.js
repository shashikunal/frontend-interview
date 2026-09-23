// REST API: /api/v1/chat
// Phase 7: Application Chat API
// Handles: Conversations, Messages, History, Members, Read Receipts, Presence

import { tokenService } from '../../server/auth/tokenService.ts';
import { appChatService } from '../../server/chat/appChatService.ts';
import { redisPresenceService } from '../../server/chat/redisPresenceService.ts';
import { createErrorResponse } from '../../server/auth/rbacMiddleware.ts';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // 1. Authenticate Request
  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('Unauthorized', 'Authentication required to access application chat.', 'MISSING_TOKEN'));
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
  };

  const urlPath = req.url || '';
  const action = req.query?.action || (urlPath.includes('/conversations') ? 'conversations' : urlPath.includes('/messages') ? 'messages' : urlPath.includes('/members') ? 'members' : urlPath.includes('/read') ? 'read' : urlPath.includes('/presence') ? 'presence' : 'conversations');

  // ── 2. Conversations ──────────────────────────────────────────────────
  if (action === 'conversations') {
    if (req.method === 'GET') {
      const convId = req.query?.conversationId || req.query?.id;
      if (convId) {
        const result = appChatService.getConversation(caller.id, convId);
        if (!result.success) {
          const status = result.code === 'FORBIDDEN' ? 403 : result.code === 'NOT_FOUND' ? 404 : 400;
          return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
        }
        return res.status(200).json({ success: true, conversation: result.conversation });
      }

      const conversations = appChatService.getUserConversations(caller.id);
      const totalUnread = appChatService.getUserTotalUnreadCount(caller.id);
      return res.status(200).json({
        success: true,
        conversations,
        totalUnread,
      });
    }

    if (req.method === 'POST') {
      const { type, name, avatarUrl, participantIds } = req.body || {};
      const result = await appChatService.getOrCreateConversation(caller, {
        type: type || 'DIRECT',
        name,
        avatarUrl,
        participantIds: participantIds || [],
      });

      if (!result.success) {
        const status = result.code === 'BAD_REQUEST' ? 400 : 500;
        return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
      }

      return res.status(result.reused ? 200 : 201).json({
        success: true,
        conversation: result.conversation,
        reused: result.reused,
      });
    }
  }

  // ── 3. Messages & History ─────────────────────────────────────────────
  if (action === 'messages') {
    if (req.method === 'GET') {
      const conversationId = req.query?.conversationId;
      if (!conversationId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'conversationId is required', 'MISSING_CONVERSATION_ID'));
      }

      const cursor = req.query?.cursor;
      const limit = req.query?.limit ? parseInt(req.query.limit, 10) : 50;
      const direction = req.query?.direction === 'AFTER' ? 'AFTER' : 'BEFORE';

      const history = appChatService.getPaginatedHistory(caller.id, {
        conversationId,
        cursor,
        limit,
        direction,
      });

      if (!history.success) {
        const status = history.code === 'FORBIDDEN' ? 403 : 400;
        return res.status(status).json(createErrorResponse(history.code || 'Error', history.error || 'Error', history.code));
      }

      return res.status(200).json({
        success: true,
        conversationId,
        ...history.result,
      });
    }

    if (req.method === 'POST') {
      const { conversationId, content, clientMessageId, metadata } = req.body || {};
      const result = await appChatService.sendMessage(caller, {
        conversationId,
        content,
        clientMessageId,
        metadata,
      });

      if (!result.success) {
        const status = result.code === 'FORBIDDEN' ? 403 : result.code === 'RATE_LIMIT_EXCEEDED' ? 429 : result.code === 'NOT_FOUND' ? 404 : 400;
        return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
      }

      return res.status(result.reused ? 200 : 201).json({
        success: true,
        message: result.message,
        reused: result.reused,
      });
    }

    if (req.method === 'DELETE') {
      const conversationId = req.query?.conversationId || req.body?.conversationId;
      const messageId = req.query?.messageId || req.body?.messageId;

      if (!conversationId || !messageId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'conversationId and messageId are required', 'MISSING_PARAMS'));
      }

      const result = appChatService.deleteMessage(caller.id, conversationId, messageId);
      if (!result.success) {
        const status = result.code === 'FORBIDDEN' ? 403 : result.code === 'NOT_FOUND' ? 404 : 400;
        return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
      }

      return res.status(200).json({ success: true, message: result.message });
    }
  }

  // ── 4. Group Membership Controls ──────────────────────────────────────
  if (action === 'members') {
    if (req.method === 'POST') {
      const { conversationId, memberAction, targetUserId, targetUserName, role } = req.body || {};
      if (!conversationId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'conversationId is required', 'MISSING_CONVERSATION_ID'));
      }

      if (memberAction === 'ADD') {
        const result = appChatService.addParticipant(caller.id, conversationId, targetUserId, targetUserName || `User ${targetUserId?.slice(0, 8)}`, role || 'MEMBER');
        if (!result.success) {
          const status = result.code === 'FORBIDDEN' ? 403 : 400;
          return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
        }
        return res.status(200).json({ success: true, participant: result.participant });
      }

      if (memberAction === 'REMOVE') {
        const result = appChatService.removeParticipant(caller.id, conversationId, targetUserId);
        if (!result.success) {
          const status = result.code === 'FORBIDDEN' ? 403 : 400;
          return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
        }
        return res.status(200).json({ success: true });
      }

      if (memberAction === 'LEAVE') {
        const result = appChatService.leaveGroup(caller.id, conversationId);
        if (!result.success) {
          const status = result.code === 'FORBIDDEN' ? 403 : 400;
          return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
        }
        return res.status(200).json({ success: true });
      }

      return res.status(400).json(createErrorResponse('BadRequest', 'Invalid memberAction (ADD, REMOVE, LEAVE)', 'INVALID_ACTION'));
    }
  }

  // ── 5. Read Receipts ──────────────────────────────────────────────────
  if (action === 'read') {
    if (req.method === 'POST') {
      const { conversationId, messageId } = req.body || {};
      if (!conversationId) {
        return res.status(400).json(createErrorResponse('BadRequest', 'conversationId is required', 'MISSING_CONVERSATION_ID'));
      }

      const result = appChatService.markConversationRead(conversationId, caller.id, messageId);
      if (!result.success) {
        const status = result.code === 'FORBIDDEN' ? 403 : 400;
        return res.status(status).json(createErrorResponse(result.code || 'Error', result.error || 'Error', result.code));
      }

      return res.status(200).json({
        success: true,
        lastReadMessageId: result.lastReadMessageId,
        lastReadAt: result.lastReadAt,
      });
    }
  }

  // ── 6. Presence ───────────────────────────────────────────────────────
  if (action === 'presence') {
    if (req.method === 'GET') {
      const userIdsParam = req.query?.userIds || '';
      const userIds = userIdsParam ? userIdsParam.split(',').map(s => s.trim()) : [caller.id];
      const presences = redisPresenceService.getPresences(userIds);
      return res.status(200).json({ success: true, presences });
    }
  }

  return res.status(404).json(createErrorResponse('NotFound', 'Action not found', 'NOT_FOUND'));
}
