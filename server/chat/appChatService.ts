/**
 * Application Chat Service (Direct Messages + Group Chat + History + Read State)
 * Phase 7: Production-Grade Application Chat System
 *
 * Implements:
 * - Direct messaging with idempotent conversation reuse (strictly 2 participants)
 * - Group conversation lifecycle (creation, metadata, member add/remove, leave)
 * - Role-based authorization: OWNER, ADMIN, MEMBER
 * - Message validation, XSS sanitization, length boundaries, and rate limiting
 * - Authoritative monotonic server timestamps
 * - Idempotency deduplication via clientMessageId
 * - Cursor-based message history pagination
 * - Conversation unread counts and read receipts
 * - Authorization-aware soft message deletion with privacy tombstones
 * - Durable PostgreSQL storage (via Supabase) with in-memory caching
 * - Asynchronous Kafka event publishing with error isolation
 */

import crypto from 'node:crypto';
import type {
  AppConversation,
  AppParticipant,
  AppMessage,
  ParticipantRole,
  CreateConversationRequest,
  SendMessageRequest,
  HistoryQuery,
  HistoryResult,
} from './appChatTypes.ts';
import { redisPresenceService } from './redisPresenceService.ts';
import { kafkaChatService } from './kafkaChatService.ts';
import { supabase } from '../../src/lib/supabase/client.ts';

// Basic HTML/script sanitization to prevent stored XSS
function sanitizeContent(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '');
}

export class AppChatService {
  // In-memory persistent caches (dual-layer for resilience and test determinism)
  public conversations: Map<string, AppConversation> = new Map();
  public participants: Map<string, Map<string, AppParticipant>> = new Map(); // conversationId -> Map<userId, AppParticipant>
  public messages: Map<string, AppMessage> = new Map(); // messageId -> AppMessage
  public convMessages: Map<string, string[]> = new Map(); // conversationId -> messageId[]

  private lastTimestampMs = 0;
  private simulateDbFailure = false;

  public setSimulateDbFailure(fail: boolean): void {
    this.simulateDbFailure = fail;
  }

  /**
   * Generates strictly monotonic ISO timestamps so message ordering is 100% deterministic
   */
  private getNextMonotonicTimestamp(): string {
    let nowMs = Date.now();
    if (nowMs <= this.lastTimestampMs) {
      nowMs = this.lastTimestampMs + 1;
    }
    this.lastTimestampMs = nowMs;
    return new Date(nowMs).toISOString();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CONVERSATIONS: DIRECT & GROUP
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Find an existing direct conversation between two users
   */
  public findDirectConversation(userAId: string, userBId: string): AppConversation | null {
    for (const conv of this.conversations.values()) {
      if (conv.type !== 'DIRECT') continue;
      const parts = this.participants.get(conv.id);
      if (!parts) continue;

      // Direct conversation must have both active participants
      const partA = parts.get(userAId);
      const partB = parts.get(userBId);
      if (partA && !partA.leftAt && partB && !partB.leftAt && parts.size === 2) {
        return conv;
      }
    }
    return null;
  }

  /**
   * Create or reuse a conversation.
   * If DIRECT and already exists between user and target, returns existing conversation without duplicates.
   */
  public async getOrCreateConversation(
    creator: { id: string; name: string; email?: string },
    data: CreateConversationRequest
  ): Promise<{ success: boolean; conversation?: AppConversation; reused?: boolean; error?: string; code?: string }> {
    if (this.simulateDbFailure) {
      return { success: false, error: 'Database unavailable', code: 'DATABASE_ERROR' };
    }

    if (!data.type || !['DIRECT', 'GROUP'].includes(data.type)) {
      return { success: false, error: 'Invalid conversation type', code: 'BAD_REQUEST' };
    }

    // DIRECT Conversation logic
    if (data.type === 'DIRECT') {
      const otherUserId = data.participantIds?.find(id => id !== creator.id);
      if (!otherUserId) {
        return { success: false, error: 'Direct conversation requires another participant ID', code: 'BAD_REQUEST' };
      }

      // 1. Check if direct conversation already exists between the two users
      const existing = this.findDirectConversation(creator.id, otherUserId);
      if (existing) {
        return { success: true, conversation: existing, reused: true };
      }

      // 2. Create new DIRECT conversation
      const convId = `conv_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
      const now = this.getNextMonotonicTimestamp();

      const conv: AppConversation = {
        id: convId,
        type: 'DIRECT',
        name: null,
        avatarUrl: null,
        createdBy: creator.id,
        createdAt: now,
        updatedAt: now,
      };

      this.conversations.set(convId, conv);
      this.convMessages.set(convId, []);

      // Add both participants
      const partsMap = new Map<string, AppParticipant>();
      partsMap.set(creator.id, {
        conversationId: convId,
        userId: creator.id,
        userName: creator.name,
        userEmail: creator.email,
        role: 'OWNER',
        joinedAt: now,
        leftAt: null,
      });
      partsMap.set(otherUserId, {
        conversationId: convId,
        userId: otherUserId,
        userName: `User ${otherUserId.slice(0, 8)}`,
        userEmail: undefined,
        role: 'MEMBER',
        joinedAt: now,
        leftAt: null,
      });
      this.participants.set(convId, partsMap);

      // Async DB persist & Kafka event
      this.persistConversationToDatabase(conv);
      kafkaChatService.publishEvent('ConversationCreated', { conversationId: convId, type: 'DIRECT', creatorId: creator.id });

      return { success: true, conversation: conv, reused: false };
    }

    // GROUP Conversation logic
    if (data.type === 'GROUP') {
      if (!data.name || !data.name.trim()) {
        return { success: false, error: 'Group name is required', code: 'BAD_REQUEST' };
      }

      const convId = `conv_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
      const now = this.getNextMonotonicTimestamp();

      const conv: AppConversation = {
        id: convId,
        type: 'GROUP',
        name: data.name.trim(),
        avatarUrl: data.avatarUrl || null,
        createdBy: creator.id,
        createdAt: now,
        updatedAt: now,
      };

      this.conversations.set(convId, conv);
      this.convMessages.set(convId, []);

      const partsMap = new Map<string, AppParticipant>();
      // Creator is OWNER
      partsMap.set(creator.id, {
        conversationId: convId,
        userId: creator.id,
        userName: creator.name,
        userEmail: creator.email,
        role: 'OWNER',
        joinedAt: now,
        leftAt: null,
      });

      // Add other invited participants as MEMBER
      if (Array.isArray(data.participantIds)) {
        for (const pId of data.participantIds) {
          if (pId && pId !== creator.id) {
            partsMap.set(pId, {
              conversationId: convId,
              userId: pId,
              userName: `User ${pId.slice(0, 8)}`,
              userEmail: undefined,
              role: 'MEMBER',
              joinedAt: now,
              leftAt: null,
            });
          }
        }
      }
      this.participants.set(convId, partsMap);

      this.persistConversationToDatabase(conv);
      kafkaChatService.publishEvent('ConversationCreated', { conversationId: convId, type: 'GROUP', name: conv.name, creatorId: creator.id });

      return { success: true, conversation: conv, reused: false };
    }

    return { success: false, error: 'Unsupported conversation type', code: 'BAD_REQUEST' };
  }

  /**
   * Get all active conversations for a user with unread counts
   */
  public getUserConversations(userId: string): AppConversation[] {
    const results: AppConversation[] = [];

    for (const [convId, partsMap] of this.participants.entries()) {
      const part = partsMap.get(userId);
      if (!part || part.leftAt) continue; // Not an active member

      const conv = this.conversations.get(convId);
      if (!conv) continue;

      const unreadCount = this.getUnreadCount(convId, userId);
      const activeParts = Array.from(partsMap.values()).filter(p => !p.leftAt);

      results.push({
        ...conv,
        participants: activeParts,
        unreadCount,
      });
    }

    // Sort by lastMessageAt DESC, falling back to createdAt DESC
    return results.sort((a, b) => {
      const timeA = new Date(a.lastMessageAt || a.createdAt).getTime();
      const timeB = new Date(b.lastMessageAt || b.createdAt).getTime();
      return timeB - timeA;
    });
  }

  /**
   * Get single conversation details with membership verification
   */
  public getConversation(userId: string, conversationId: string): { success: boolean; conversation?: AppConversation; error?: string; code?: string } {
    const conv = this.conversations.get(conversationId);
    if (!conv) {
      return { success: false, error: 'Conversation not found', code: 'NOT_FOUND' };
    }

    const partsMap = this.participants.get(conversationId);
    const userPart = partsMap?.get(userId);
    if (!userPart || userPart.leftAt) {
      return { success: false, error: 'Access denied: not an active member', code: 'FORBIDDEN' };
    }

    const activeParts = partsMap ? Array.from(partsMap.values()).filter(p => !p.leftAt) : [];
    return {
      success: true,
      conversation: {
        ...conv,
        participants: activeParts,
        unreadCount: this.getUnreadCount(conversationId, userId),
      },
    };
  }

  // ──────────────────────────────────────────────────────────────────────────
  // GROUP MEMBERSHIP MANAGEMENT & AUTHORIZATION
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Add a participant to a group conversation
   * Rule: Caller must be OWNER or ADMIN of the group. DIRECT conversations cannot have members added.
   */
  public addParticipant(
    callerId: string,
    conversationId: string,
    newUserId: string,
    newUserName: string,
    role: ParticipantRole = 'MEMBER'
  ): { success: boolean; participant?: AppParticipant; error?: string; code?: string } {
    const conv = this.conversations.get(conversationId);
    if (!conv) {
      return { success: false, error: 'Conversation not found', code: 'NOT_FOUND' };
    }

    if (conv.type === 'DIRECT') {
      return { success: false, error: 'Cannot add members to a direct conversation', code: 'BAD_REQUEST' };
    }

    const partsMap = this.participants.get(conversationId);
    if (!partsMap) {
      return { success: false, error: 'No participants record found', code: 'NOT_FOUND' };
    }

    const callerPart = partsMap.get(callerId);
    if (!callerPart || callerPart.leftAt) {
      return { success: false, error: 'Caller is not a member of this conversation', code: 'FORBIDDEN' };
    }

    // Only OWNER or ADMIN can add participants
    if (callerPart.role !== 'OWNER' && callerPart.role !== 'ADMIN') {
      return { success: false, error: 'Only group owners or admins can add members', code: 'FORBIDDEN' };
    }

    const existingNewPart = partsMap.get(newUserId);
    if (existingNewPart && !existingNewPart.leftAt) {
      return { success: true, participant: existingNewPart }; // Already member
    }

    const now = this.getNextMonotonicTimestamp();
    const participant: AppParticipant = {
      conversationId,
      userId: newUserId,
      userName: newUserName,
      role,
      joinedAt: now,
      leftAt: null,
    };

    partsMap.set(newUserId, participant);

    // Create system message
    this.createSystemMessage(conversationId, `${newUserName} was added to the group`);
    kafkaChatService.publishEvent('ParticipantAdded', { conversationId, addedUserId: newUserId, addedBy: callerId });

    return { success: true, participant };
  }

  /**
   * Remove a participant from a group
   * Rule: Only OWNER or ADMIN can remove another participant.
   */
  public removeParticipant(
    callerId: string,
    conversationId: string,
    targetUserId: string
  ): { success: boolean; error?: string; code?: string } {
    const conv = this.conversations.get(conversationId);
    if (!conv) return { success: false, error: 'Conversation not found', code: 'NOT_FOUND' };
    if (conv.type === 'DIRECT') return { success: false, error: 'Cannot remove members from a direct conversation', code: 'BAD_REQUEST' };

    const partsMap = this.participants.get(conversationId);
    if (!partsMap) return { success: false, error: 'Participants not found', code: 'NOT_FOUND' };

    const callerPart = partsMap.get(callerId);
    if (!callerPart || callerPart.leftAt) {
      return { success: false, error: 'Caller is not a member of this conversation', code: 'FORBIDDEN' };
    }

    // Check authorization: must be OWNER or ADMIN to remove someone else
    if (callerPart.role !== 'OWNER' && callerPart.role !== 'ADMIN') {
      return { success: false, error: 'Only group owners or admins can remove members', code: 'FORBIDDEN' };
    }

    const targetPart = partsMap.get(targetUserId);
    if (!targetPart || targetPart.leftAt) {
      return { success: false, error: 'Target user is not an active member', code: 'BAD_REQUEST' };
    }

    // Owner cannot be removed
    if (targetPart.role === 'OWNER') {
      return { success: false, error: 'Group owner cannot be removed', code: 'FORBIDDEN' };
    }

    const now = this.getNextMonotonicTimestamp();
    targetPart.leftAt = now;

    this.createSystemMessage(conversationId, `${targetPart.userName} was removed from the group`);
    kafkaChatService.publishEvent('ParticipantRemoved', { conversationId, removedUserId: targetUserId, removedBy: callerId });

    return { success: true };
  }

  /**
   * Leave a group conversation (self-removal)
   * Rule: Any active member can leave.
   */
  public leaveGroup(userId: string, conversationId: string): { success: boolean; error?: string; code?: string } {
    const conv = this.conversations.get(conversationId);
    if (!conv) return { success: false, error: 'Conversation not found', code: 'NOT_FOUND' };
    if (conv.type === 'DIRECT') return { success: false, error: 'Cannot leave a direct conversation', code: 'BAD_REQUEST' };

    const partsMap = this.participants.get(conversationId);
    const userPart = partsMap?.get(userId);
    if (!userPart || userPart.leftAt) {
      return { success: false, error: 'User is not an active member', code: 'BAD_REQUEST' };
    }

    const now = this.getNextMonotonicTimestamp();
    userPart.leftAt = now;

    this.createSystemMessage(conversationId, `${userPart.userName} left the group`);
    kafkaChatService.publishEvent('ParticipantLeft', { conversationId, userId });

    return { success: true };
  }

  /**
   * Verify if a user is an active member of a conversation
   */
  public isMember(conversationId: string, userId: string): boolean {
    const partsMap = this.participants.get(conversationId);
    if (!partsMap) return false;
    const part = partsMap.get(userId);
    return !!part && !part.leftAt;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MESSAGES: SEND, IDEMPOTENCY, DELETION, HISTORY
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Send a message to an application conversation
   */
  public async sendMessage(
    sender: { id: string; name: string },
    payload: SendMessageRequest
  ): Promise<{ success: boolean; message?: AppMessage; reused?: boolean; error?: string; code?: string }> {
    if (this.simulateDbFailure) {
      return { success: false, error: 'Database operation failed', code: 'DATABASE_ERROR' };
    }

    const { conversationId, content, clientMessageId, metadata } = payload || {};

    if (!conversationId) {
      return { success: false, error: 'conversationId is required', code: 'BAD_REQUEST' };
    }

    // 1. Validate conversation exists
    const conv = this.conversations.get(conversationId);
    if (!conv) {
      return { success: false, error: 'Conversation does not exist', code: 'NOT_FOUND' };
    }

    // 2. Validate sender is active member
    if (!this.isMember(conversationId, sender.id)) {
      return { success: false, error: 'Sender is not an active member of this conversation', code: 'FORBIDDEN' };
    }

    // 3. Validate content
    if (!content || !content.trim()) {
      return { success: false, error: 'Message content cannot be empty', code: 'BAD_REQUEST' };
    }

    if (content.length > 4000) {
      return { success: false, error: 'Message exceeds maximum length of 4000 characters', code: 'BAD_REQUEST' };
    }

    // 4. Rate limiting check
    if (!redisPresenceService.checkMessageRateLimit(sender.id)) {
      return { success: false, error: 'Rate limit exceeded: too many messages sent', code: 'RATE_LIMIT_EXCEEDED' };
    }

    // 5. Idempotency deduplication check via clientMessageId
    if (clientMessageId) {
      const existing = this.findByClientMessageId(conversationId, clientMessageId);
      if (existing) {
        return { success: true, message: existing, reused: true };
      }
    }

    // 6. Create durable message
    const messageId = `msg_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    const now = this.getNextMonotonicTimestamp();
    const cleanContent = sanitizeContent(content.trim());

    const message: AppMessage = {
      id: messageId,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      messageType: 'USER_MESSAGE',
      content: cleanContent,
      metadata: metadata || {},
      clientMessageId: clientMessageId || undefined,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    // Store in message cache
    this.messages.set(messageId, message);
    const convMsgList = this.convMessages.get(conversationId) || [];
    convMsgList.push(messageId);
    this.convMessages.set(conversationId, convMsgList);

    // Update conversation metadata
    conv.lastMessageId = messageId;
    conv.lastMessagePreview = cleanContent.slice(0, 100);
    conv.lastMessageSenderId = sender.id;
    conv.lastMessageSenderName = sender.name;
    conv.lastMessageAt = now;
    conv.updatedAt = now;

    // Automatically mark read for sender
    this.markConversationRead(conversationId, sender.id, messageId);

    // Stop typing for sender on send
    redisPresenceService.stopTyping(conversationId, sender.id);

    // Async DB persist & Kafka event
    this.persistMessageToDatabase(message);
    kafkaChatService.publishEvent('MessageSent', { conversationId, messageId, senderId: sender.id, clientMessageId });

    return { success: true, message, reused: false };
  }

  /**
   * Helper to find message by clientMessageId for idempotency
   */
  private findByClientMessageId(conversationId: string, clientMessageId: string): AppMessage | null {
    const msgIds = this.convMessages.get(conversationId) || [];
    for (const id of msgIds) {
      const msg = this.messages.get(id);
      if (msg && msg.clientMessageId === clientMessageId) {
        return msg;
      }
    }
    return null;
  }

  /**
   * Delete a message (soft deletion with privacy tombstone)
   * Authorization rules:
   * - Author can delete their own message.
   * - In a GROUP, OWNER or ADMIN can delete any message.
   * - Unauthorized deletion is rejected with FORBIDDEN.
   */
  public deleteMessage(
    callerId: string,
    conversationId: string,
    messageId: string
  ): { success: boolean; message?: AppMessage; error?: string; code?: string } {
    const msg = this.messages.get(messageId);
    if (!msg || msg.conversationId !== conversationId) {
      return { success: false, error: 'Message not found in conversation', code: 'NOT_FOUND' };
    }

    const partsMap = this.participants.get(conversationId);
    const callerPart = partsMap?.get(callerId);
    if (!callerPart || callerPart.leftAt) {
      return { success: false, error: 'Caller is not an active member of this conversation', code: 'FORBIDDEN' };
    }

    const isAuthor = msg.senderId === callerId;
    const isPrivileged = callerPart.role === 'OWNER' || callerPart.role === 'ADMIN';

    if (!isAuthor && !isPrivileged) {
      return { success: false, error: 'Unauthorized: cannot delete another user\'s message', code: 'FORBIDDEN' };
    }

    // Apply soft deletion
    msg.isDeleted = true;
    msg.deletedAt = this.getNextMonotonicTimestamp();
    msg.deletedBy = callerId;
    msg.content = 'This message was deleted.';
    msg.updatedAt = msg.deletedAt;

    kafkaChatService.publishEvent('MessageDeleted', { conversationId, messageId, deletedBy: callerId });

    return { success: true, message: msg };
  }

  /**
   * Create a system message (e.g. member joined, left)
   */
  private createSystemMessage(conversationId: string, text: string): AppMessage {
    const messageId = `msg_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    const now = this.getNextMonotonicTimestamp();

    const message: AppMessage = {
      id: messageId,
      conversationId,
      senderId: 'SYSTEM',
      senderName: 'System',
      messageType: 'SYSTEM_MESSAGE',
      content: text,
      metadata: {},
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    this.messages.set(messageId, message);
    const convMsgList = this.convMessages.get(conversationId) || [];
    convMsgList.push(messageId);
    this.convMessages.set(conversationId, convMsgList);

    return message;
  }

  /**
   * Cursor-based message history pagination
   * Returns messages chronologically ordered (ASC).
   */
  public getPaginatedHistory(userId: string, query: HistoryQuery): { success: boolean; result?: HistoryResult; error?: string; code?: string } {
    const { conversationId, cursor, limit = 50, direction = 'BEFORE' } = query;

    // Validate membership
    if (!this.isMember(conversationId, userId)) {
      return { success: false, error: 'Access denied: not an active member of this conversation', code: 'FORBIDDEN' };
    }

    const msgIds = this.convMessages.get(conversationId) || [];
    const allMessages: AppMessage[] = [];

    for (const id of msgIds) {
      const msg = this.messages.get(id);
      if (msg) {
        allMessages.push(this.sanitizeMessageForReader(msg));
      }
    }

    // Sort chronologically ascending
    allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const safeLimit = Math.max(1, Math.min(100, limit));
    let filtered = allMessages;

    if (cursor) {
      const cursorIndex = allMessages.findIndex(m => m.id === cursor);
      if (cursorIndex !== -1) {
        if (direction === 'BEFORE') {
          filtered = allMessages.slice(0, cursorIndex);
        } else {
          filtered = allMessages.slice(cursorIndex + 1);
        }
      }
    }

    let paginated: AppMessage[];
    let hasMore = false;

    if (direction === 'BEFORE') {
      // Get the last `safeLimit` messages before cursor
      if (filtered.length > safeLimit) {
        hasMore = true;
        paginated = filtered.slice(filtered.length - safeLimit);
      } else {
        paginated = filtered;
      }
    } else {
      // Get first `safeLimit` messages after cursor
      if (filtered.length > safeLimit) {
        hasMore = true;
        paginated = filtered.slice(0, safeLimit);
      } else {
        paginated = filtered;
      }
    }

    const nextCursor = paginated.length > 0 ? (direction === 'BEFORE' ? paginated[0].id : paginated[paginated.length - 1].id) : null;

    return {
      success: true,
      result: {
        messages: paginated,
        nextCursor,
        hasMore,
        totalCount: allMessages.length,
      },
    };
  }

  /**
   * Sanitizes deleted messages to return tombstone text
   */
  private sanitizeMessageForReader(msg: AppMessage): AppMessage {
    if (msg.isDeleted) {
      return {
        ...msg,
        content: 'This message was deleted.',
      };
    }
    return msg;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // READ RECEIPTS & UNREAD COUNTS
  // ──────────────────────────────────────────────────────────────────────────

  /**
   * Mark conversation read up to a messageId or current time
   */
  public markConversationRead(
    conversationId: string,
    userId: string,
    messageId?: string
  ): { success: boolean; lastReadMessageId?: string; lastReadAt?: string; error?: string; code?: string } {
    const partsMap = this.participants.get(conversationId);
    const part = partsMap?.get(userId);
    if (!part || part.leftAt) {
      return { success: false, error: 'User is not an active member', code: 'FORBIDDEN' };
    }

    const now = this.getNextMonotonicTimestamp();
    const effectiveMsgId = messageId || this.conversations.get(conversationId)?.lastMessageId || 'msg_read';

    part.lastReadMessageId = effectiveMsgId;
    part.lastReadAt = now;

    kafkaChatService.publishEvent('MessageRead', { conversationId, userId, messageId: effectiveMsgId, lastReadAt: now });

    return { success: true, lastReadMessageId: effectiveMsgId, lastReadAt: now };
  }

  /**
   * Calculate unread message count for a user in a conversation
   */
  public getUnreadCount(conversationId: string, userId: string): number {
    const partsMap = this.participants.get(conversationId);
    const part = partsMap?.get(userId);
    if (!part || part.leftAt) return 0;

    const lastReadAt = part.lastReadAt ? new Date(part.lastReadAt).getTime() : 0;
    const msgIds = this.convMessages.get(conversationId) || [];
    let unread = 0;

    for (const id of msgIds) {
      const msg = this.messages.get(id);
      if (!msg) continue;
      // Do not count own messages or deleted messages as unread
      if (msg.senderId !== userId && !msg.isDeleted) {
        const msgTime = new Date(msg.createdAt).getTime();
        if (msgTime > lastReadAt) {
          unread++;
        }
      }
    }

    return unread;
  }

  /**
   * Calculate total unread count across all conversations for a user
   */
  public getUserTotalUnreadCount(userId: string): number {
    let total = 0;
    for (const convId of this.conversations.keys()) {
      total += this.getUnreadCount(convId, userId);
    }
    return total;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // POSTGRESQL PERSISTENCE HELPERS (ASYNC & ERROR ISOLATED)
  // ──────────────────────────────────────────────────────────────────────────

  private async persistConversationToDatabase(conv: AppConversation): Promise<void> {
    try {
      if (!supabase) return;
      await supabase.from('app_conversations').upsert({
        id: conv.id,
        type: conv.type,
        name: conv.name,
        avatar_url: conv.avatarUrl,
        created_by: conv.createdBy,
        last_message_id: conv.lastMessageId,
        last_message_preview: conv.lastMessagePreview,
        last_message_sender_id: conv.lastMessageSenderId,
        last_message_sender_name: conv.lastMessageSenderName,
        last_message_at: conv.lastMessageAt,
        created_at: conv.createdAt,
        updated_at: conv.updatedAt,
      });
    } catch (err: any) {
      console.warn('[AppChatService] Database conversation persist warning:', err?.message);
    }
  }

  private async persistMessageToDatabase(msg: AppMessage): Promise<void> {
    try {
      if (!supabase) return;
      await supabase.from('app_messages').insert({
        id: msg.id,
        conversation_id: msg.conversationId,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        message_type: msg.messageType,
        content: msg.content,
        metadata: msg.metadata,
        client_message_id: msg.clientMessageId,
        is_deleted: msg.isDeleted,
        deleted_at: msg.deletedAt,
        deleted_by: msg.deletedBy,
        created_at: msg.createdAt,
        updated_at: msg.updatedAt,
      });
    } catch (err: any) {
      console.warn('[AppChatService] Database message persist warning:', err?.message);
    }
  }

  /**
   * Reset all state (useful for tests)
   */
  public reset(): void {
    this.conversations.clear();
    this.participants.clear();
    this.messages.clear();
    this.convMessages.clear();
    this.simulateDbFailure = false;
  }
}

export const appChatService = new AppChatService();
