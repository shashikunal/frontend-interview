/**
 * In-Meeting Real-Time Chat & Persistence Service
 * Phase 6: Production-Grade Meeting Chat
 * Features:
 * - Realtime room broadcast & history
 * - Durable PostgreSQL persistence (via Supabase) with in-memory caching
 * - Cursor-based pagination for history loading
 * - Permission-based deletion (author can delete own, host/admin can delete any)
 * - Soft-deletion sanitization (deleted content replaced with tombstone)
 * - Host chat controls (enable / disable chat)
 * - Host announcements (privileged broadcast)
 * - System lifecycle events (joined, left, chat toggled)
 * - Emoji reactions (toggle support)
 * - Rate limiting integration point
 * - Input validation & XSS protection
 */

import crypto from 'node:crypto';
import type { AuthContextUser, MeetingRole } from '../auth/tokenTypes.ts';
import { meetingService } from './meetingService.ts';
import type {
  ChatMessageRecord,
  SendChatMessageRequest,
  AddReactionRequest,
  ChatHistoryQuery,
  ChatHistoryResult,
  ChatMessageType,
} from './chatTypes.ts';
import { supabase } from '../../src/lib/supabase/client.ts';

// Basic HTML/script sanitization to prevent stored XSS
function sanitizeContent(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onerror\s*=/gi, '')
    .replace(/onload\s*=/gi, '');
}

export class ChatService {
  private messages: Map<string, ChatMessageRecord> = new Map();
  // Sliding-window rate limit tracker: userId -> array of epoch timestamps (ms)
  private rateLimitWindow: Map<string, number[]> = new Map();
  private readonly MAX_MESSAGES_PER_WINDOW = 10;
  private readonly WINDOW_SIZE_MS = 2000;
  private lastTimestampMs = 0;

  /**
   * Generates strictly monotonic ISO timestamps so cursor pagination is 100% deterministic
   */
  private getNextMonotonicTimestamp(): string {
    let nowMs = Date.now();
    if (nowMs <= this.lastTimestampMs) {
      nowMs = this.lastTimestampMs + 1;
    }
    this.lastTimestampMs = nowMs;
    return new Date(nowMs).toISOString();
  }

  /**
   * Check rate limit for sender
   */
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const timestamps = this.rateLimitWindow.get(userId) || [];
    const validTimestamps = timestamps.filter(t => now - t < this.WINDOW_SIZE_MS);

    if (validTimestamps.length >= this.MAX_MESSAGES_PER_WINDOW) {
      return false;
    }

    validTimestamps.push(now);
    this.rateLimitWindow.set(userId, validTimestamps);
    return true;
  }

  /**
   * Persist a message to PostgreSQL asynchronously
   */
  private async persistToDatabase(msg: ChatMessageRecord): Promise<void> {
    try {
      if (!supabase) return;
      await supabase.from('meeting_messages').insert({
        id: msg.id,
        meeting_id: msg.meetingId,
        sender_id: msg.senderId,
        sender_name: msg.senderName,
        sender_role: msg.senderRole,
        recipient_id: msg.recipientId,
        recipient_name: msg.recipientName || null,
        message_type: msg.messageType,
        content: msg.content,
        code_language: msg.codeLanguage || null,
        reply_to_message_id: msg.replyToMessageId || null,
        reply_to_snippet: msg.replyToSnippet || null,
        reactions: msg.reactions || {},
        is_deleted: msg.isDeleted || false,
        deleted_at: msg.deletedAt || null,
        deleted_by: msg.deletedBy || null,
        metadata: msg.metadata || {},
        created_at: msg.createdAt,
        updated_at: msg.updatedAt || msg.createdAt,
      });
    } catch (err) {
      // Non-blocking: memory cache ensures immediate local responsiveness
      console.warn('[ChatService Database Persistence Warning]', err);
    }
  }

  /**
   * Update message in PostgreSQL asynchronously
   */
  private async updateInDatabase(msg: ChatMessageRecord): Promise<void> {
    try {
      if (!supabase) return;
      await supabase
        .from('meeting_messages')
        .update({
          reactions: msg.reactions,
          is_deleted: msg.isDeleted,
          deleted_at: msg.deletedAt || null,
          deleted_by: msg.deletedBy || null,
          updated_at: msg.updatedAt,
        })
        .eq('id', msg.id);
    } catch (err) {
      console.warn('[ChatService Database Update Warning]', err);
    }
  }

  /**
   * Send a chat message
   */
  public sendMessage(
    caller: AuthContextUser & { meetingRole?: MeetingRole },
    request: SendChatMessageRequest
  ): { success: boolean; message?: ChatMessageRecord; error?: string; code?: string } {
    // 1. Validate Caller Authentication
    if (!caller || !caller.id) {
      return {
        success: false,
        error: 'Unauthorized: Authentication required to send messages.',
        code: 'UNAUTHORIZED',
      };
    }

    // 2. Validate Meeting State
    const meeting = meetingService.getMeetingById(request.meetingId);
    if (!meeting) {
      return {
        success: false,
        error: 'Meeting not found.',
        code: 'MEETING_NOT_FOUND',
      };
    }

    if (meeting.status === 'ENDED' || meeting.status === 'CANCELLED' || meeting.status === 'ARCHIVED') {
      return {
        success: false,
        error: `Meeting has concluded (${meeting.status}).`,
        code: `MEETING_${meeting.status}`,
      };
    }

    // 3. Enforce Meeting Chat Settings (Host/Admin can bypass if sending announcements)
    const isHost = caller.meetingRole === 'HOST' || caller.role === 'admin';
    if (meeting.settings && meeting.settings.allowChat === false && !isHost) {
      return {
        success: false,
        error: 'In-meeting chat is disabled by the host.',
        code: 'CHAT_DISABLED',
      };
    }

    // 4. Validate Message Content
    if (!request.content || !request.content.trim()) {
      return {
        success: false,
        error: 'Message content cannot be blank.',
        code: 'EMPTY_CONTENT',
      };
    }

    if (request.content.length > 4000) {
      return {
        success: false,
        error: 'Message content exceeds maximum allowed limit of 4,000 characters.',
        code: 'CONTENT_TOO_LONG',
      };
    }

    // 5. Rate Limiting Check
    if (!this.checkRateLimit(caller.id)) {
      return {
        success: false,
        error: 'Rate limit exceeded: You are sending messages too quickly. Please slow down.',
        code: 'RATE_LIMITED',
      };
    }

    // 6. Reply Threading Resolution
    let replyToSnippet: string | undefined;
    if (request.replyToMessageId) {
      const parent = this.messages.get(request.replyToMessageId);
      if (parent) {
        replyToSnippet = parent.isDeleted ? '[Deleted message]' : parent.content.slice(0, 60);
      }
    }

    const now = this.getNextMonotonicTimestamp();
    const id = `msg_${crypto.randomUUID()}`;
    const cleanContent = sanitizeContent(request.content.trim());
    const messageType: ChatMessageType = request.messageType || 'USER_MESSAGE';

    const messageRecord: ChatMessageRecord = {
      id,
      meetingId: request.meetingId,
      senderId: caller.id,
      senderName: caller.name,
      senderRole: caller.meetingRole || 'PARTICIPANT',
      recipientId: request.recipientId && request.recipientId.trim() ? request.recipientId : 'ALL',
      content: cleanContent,
      messageType,
      codeLanguage: request.codeLanguage,
      replyToMessageId: request.replyToMessageId,
      replyToSnippet,
      reactions: {},
      isDeleted: false,
      metadata: request.correlationId ? { correlationId: request.correlationId } : {},
      createdAt: now,
      updatedAt: now,
    };

    // Store in-memory and write to PostgreSQL
    this.messages.set(id, messageRecord);
    this.persistToDatabase(messageRecord);

    return {
      success: true,
      message: messageRecord,
    };
  }

  /**
   * Host / Admin Broadcast Announcement
   */
  public sendAnnouncement(
    caller: AuthContextUser & { meetingRole?: MeetingRole },
    meetingId: string,
    content: string,
    correlationId?: string
  ): { success: boolean; message?: ChatMessageRecord; error?: string; code?: string } {
    const isHost = caller.meetingRole === 'HOST' || caller.role === 'admin';
    if (!isHost) {
      return {
        success: false,
        error: 'Forbidden: Only the meeting Host or an Administrator may make announcements.',
        code: 'FORBIDDEN',
      };
    }

    if (!content || !content.trim()) {
      return {
        success: false,
        error: 'Announcement content cannot be blank.',
        code: 'EMPTY_CONTENT',
      };
    }

    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) {
      return {
        success: false,
        error: 'Meeting not found.',
        code: 'MEETING_NOT_FOUND',
      };
    }

    const now = this.getNextMonotonicTimestamp();
    const id = `msg_ann_${crypto.randomUUID()}`;
    const announcementRecord: ChatMessageRecord = {
      id,
      meetingId,
      senderId: caller.id,
      senderName: `${caller.name} (Host Announcement)`,
      senderRole: 'HOST',
      recipientId: 'ALL',
      content: sanitizeContent(content.trim()),
      messageType: 'HOST_ANNOUNCEMENT',
      reactions: {},
      isDeleted: false,
      metadata: correlationId ? { correlationId, isPinned: true } : { isPinned: true },
      createdAt: now,
      updatedAt: now,
    };

    this.messages.set(id, announcementRecord);
    this.persistToDatabase(announcementRecord);

    return {
      success: true,
      message: announcementRecord,
    };
  }

  /**
   * System Notification Message (e.g. participant joined, left, chat toggled)
   */
  public sendSystemMessage(
    meetingId: string,
    content: string,
    metadata?: Record<string, any>
  ): ChatMessageRecord {
    const now = this.getNextMonotonicTimestamp();
    const id = `msg_sys_${crypto.randomUUID()}`;

    const systemRecord: ChatMessageRecord = {
      id,
      meetingId,
      senderId: 'SYSTEM',
      senderName: 'System',
      senderRole: 'SYSTEM' as any,
      recipientId: 'ALL',
      content,
      messageType: 'SYSTEM_MESSAGE',
      reactions: {},
      isDeleted: false,
      metadata: metadata || {},
      createdAt: now,
      updatedAt: now,
    };

    this.messages.set(id, systemRecord);
    this.persistToDatabase(systemRecord);

    return systemRecord;
  }

  /**
   * Host / Admin Toggle In-Meeting Chat
   */
  public toggleChat(
    caller: AuthContextUser & { meetingRole?: MeetingRole },
    meetingId: string,
    allowChat: boolean
  ): { success: boolean; allowChat?: boolean; systemMessage?: ChatMessageRecord; error?: string; code?: string } {
    const isHost = caller.meetingRole === 'HOST' || caller.role === 'admin';
    if (!isHost) {
      return {
        success: false,
        error: 'Forbidden: Only the meeting Host or an Administrator may toggle chat.',
        code: 'FORBIDDEN',
      };
    }

    const meeting = meetingService.getMeetingById(meetingId);
    if (!meeting) {
      return {
        success: false,
        error: 'Meeting not found.',
        code: 'MEETING_NOT_FOUND',
      };
    }

    // Persist setting on meeting
    meeting.settings = {
      ...meeting.settings,
      allowChat,
    };

    // Inject system message into the chat stream
    const actionText = allowChat ? 'enabled' : 'disabled';
    const sysMsg = this.sendSystemMessage(
      meetingId,
      `In-meeting chat has been ${actionText} by ${caller.name}.`,
      { type: 'CHAT_TOGGLED', allowChat, updatedBy: caller.id }
    );

    return {
      success: true,
      allowChat,
      systemMessage: sysMsg,
    };
  }

  /**
   * Delete a chat message (author or Host/Admin only)
   */
  public deleteMessage(
    caller: AuthContextUser & { meetingRole?: MeetingRole },
    messageId: string
  ): { success: boolean; messageId?: string; deletedBy?: string; message?: ChatMessageRecord; error?: string; code?: string } {
    const msg = this.messages.get(messageId);
    if (!msg) {
      return {
        success: false,
        error: 'Message not found.',
        code: 'MESSAGE_NOT_FOUND',
      };
    }

    const isAuthor = msg.senderId === caller.id;
    const isHost = caller.meetingRole === 'HOST' || caller.role === 'admin';

    if (!isAuthor && !isHost) {
      return {
        success: false,
        error: 'Forbidden: You do not have permission to delete this message.',
        code: 'FORBIDDEN',
      };
    }

    msg.isDeleted = true;
    msg.deletedAt = new Date().toISOString();
    msg.deletedBy = caller.id;
    msg.updatedAt = msg.deletedAt;

    this.updateInDatabase(msg);

    return {
      success: true,
      messageId: msg.id,
      deletedBy: caller.id,
      message: msg,
    };
  }

  /**
   * Add or toggle emoji reaction
   */
  public addReaction(
    callerUserId: string,
    request: AddReactionRequest
  ): { success: boolean; reactions?: Record<string, string[]>; error?: string; code?: string } {
    const msg = this.messages.get(request.messageId);
    if (!msg || msg.meetingId !== request.meetingId) {
      return {
        success: false,
        error: 'Message not found.',
        code: 'MESSAGE_NOT_FOUND',
      };
    }

    if (msg.isDeleted) {
      return {
        success: false,
        error: 'Cannot react to a deleted message.',
        code: 'MESSAGE_DELETED',
      };
    }

    if (!request.emoji || !request.emoji.trim()) {
      return {
        success: false,
        error: 'Emoji is required.',
        code: 'INVALID_EMOJI',
      };
    }

    const emoji = request.emoji.trim();
    if (!msg.reactions[emoji]) {
      msg.reactions[emoji] = [];
    }

    const existingIndex = msg.reactions[emoji].indexOf(callerUserId);
    if (existingIndex >= 0) {
      // Toggle off if already present
      msg.reactions[emoji].splice(existingIndex, 1);
      if (msg.reactions[emoji].length === 0) {
        delete msg.reactions[emoji];
      }
    } else {
      msg.reactions[emoji].push(callerUserId);
    }

    msg.updatedAt = new Date().toISOString();
    this.updateInDatabase(msg);

    return {
      success: true,
      reactions: msg.reactions,
    };
  }

  /**
   * System Notification Message alias
   */
  public createSystemMessage(
    meetingId: string,
    content: string,
    metadata?: Record<string, any>
  ): ChatMessageRecord {
    return this.sendSystemMessage(meetingId, content, metadata);
  }

  /**
   * Get paginated message history for meeting with tombstone sanitization
   * Supports both (callerUserId, meetingId, query) and (meetingId, query)
   */
  public getPaginatedHistory(
    callerUserIdOrMeetingId: string,
    meetingIdOrQuery?: string | ChatHistoryQuery,
    maybeQuery?: ChatHistoryQuery
  ): ChatHistoryResult {
    let callerUserId = callerUserIdOrMeetingId;
    let meetingId = '';
    let query: ChatHistoryQuery;

    if (typeof meetingIdOrQuery === 'string') {
      meetingId = meetingIdOrQuery;
      query = maybeQuery || { meetingId };
    } else {
      meetingId = callerUserIdOrMeetingId;
      callerUserId = 'SYSTEM';
      query = (meetingIdOrQuery as ChatHistoryQuery) || { meetingId };
    }

    const limit = Math.min(Math.max(query.limit || 50, 1), 100);
    const meetingMessages: ChatMessageRecord[] = [];

    for (const msg of this.messages.values()) {
      if (msg.meetingId !== meetingId) continue;

      // Filter: Public broadcast or direct involvement or caller is SYSTEM
      if (
        callerUserId === 'SYSTEM' ||
        msg.recipientId === 'ALL' ||
        msg.recipientId === callerUserId ||
        msg.senderId === callerUserId
      ) {
        // Tombstone sanitization for deleted messages: never leak deleted content
        if (msg.isDeleted) {
          meetingMessages.push({
            ...msg,
            content: '[This message was deleted]',
            replyToSnippet: undefined,
            codeLanguage: undefined,
            reactions: {},
          });
        } else {
          meetingMessages.push(msg);
        }
      }
    }

    // Sort chronologically
    meetingMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Apply cursor filtering (cursor is ISO 8601 timestamp of oldest message in current client view)
    let filtered = meetingMessages;
    if (query.cursor) {
      const cursorTime = new Date(query.cursor).getTime();
      if (query.direction === 'AFTER') {
        filtered = meetingMessages.filter(m => new Date(m.createdAt).getTime() > cursorTime);
      } else {
        // Default BEFORE: messages older than cursor
        filtered = meetingMessages.filter(m => new Date(m.createdAt).getTime() < cursorTime);
      }
    }

    const totalCount = filtered.length;
    // Return last 'limit' items if reading backwards
    const sliced = filtered.slice(Math.max(0, filtered.length - limit));
    const nextCursor = sliced.length > 0 && filtered.length > limit ? sliced[0].createdAt : undefined;

    return {
      messages: sliced,
      nextCursor,
      hasMore: filtered.length > limit,
      totalCount,
    };
  }

  /**
   * Get messages for user (backward compatibility helper)
   */
  public getMessagesForUser(callerUserId: string, meetingId: string): ChatMessageRecord[] {
    return this.getPaginatedHistory(callerUserId, meetingId, { meetingId, limit: 100 }).messages;
  }

  /**
   * Reconnect synchronization: retrieve messages created after a given timestamp
   */
  public getMessagesSince(
    callerUserIdOrMeetingId: string,
    meetingIdOrSince: string,
    sinceTimestamp?: string
  ): ChatMessageRecord[] {
    let callerUserId = callerUserIdOrMeetingId;
    let meetingId = '';
    let since = '';

    if (sinceTimestamp !== undefined) {
      callerUserId = callerUserIdOrMeetingId;
      meetingId = meetingIdOrSince;
      since = sinceTimestamp;
    } else {
      callerUserId = 'SYSTEM';
      meetingId = callerUserIdOrMeetingId;
      since = meetingIdOrSince;
    }

    return this.getPaginatedHistory(callerUserId, meetingId, {
      meetingId,
      cursor: since,
      direction: 'AFTER',
      limit: 100,
    }).messages;
  }

  /**
   * Reset rate limit window tracker
   */
  public clearRateLimits(): void {
    this.rateLimitWindow.clear();
  }

  /**
   * Reset store (useful for clean test states)
   */
  public clearStore(): void {
    this.messages.clear();
    this.rateLimitWindow.clear();
  }
}

export const chatService = new ChatService();
