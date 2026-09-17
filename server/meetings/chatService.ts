/**
 * In-Meeting Real-Time Chat & Direct Messaging Service
 * Phase 5: Real-Time Chat & Threaded Messaging
 */

import crypto from 'node:crypto';
import type { AuthContextUser, MeetingRole } from '../auth/tokenTypes.ts';
import { meetingService } from './meetingService.ts';
import type {
  ChatMessageRecord,
  SendChatMessageRequest,
  AddReactionRequest,
} from './chatTypes.ts';

export class ChatService {
  private messages: Map<string, ChatMessageRecord> = new Map();

  /**
   * Send a chat message (public broadcast or 1:1 direct message)
   */
  public sendMessage(
    caller: AuthContextUser & { meetingRole?: MeetingRole },
    request: SendChatMessageRequest
  ): { success: boolean; message?: ChatMessageRecord; error?: string; code?: string } {
    // 1. Validate Meeting State
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

    // 2. Enforce Meeting Settings
    if (meeting.settings && meeting.settings.allowChat === false) {
      return {
        success: false,
        error: 'In-meeting chat is disabled by the host.',
        code: 'CHAT_DISABLED',
      };
    }

    // 3. Validate Message Content
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

    // 4. Threading Reply Resolution
    let replyToSnippet: string | undefined;
    if (request.replyToMessageId) {
      const parent = this.messages.get(request.replyToMessageId);
      if (parent) {
        replyToSnippet = parent.content.slice(0, 60);
      }
    }

    const now = new Date().toISOString();
    const id = `msg_${crypto.randomUUID()}`;
    const recipientId = request.recipientId && request.recipientId.trim() ? request.recipientId : 'ALL';

    const messageRecord: ChatMessageRecord = {
      id,
      meetingId: request.meetingId,
      senderId: caller.id,
      senderName: caller.name,
      senderRole: caller.meetingRole || 'PARTICIPANT',
      recipientId,
      content: request.content.trim(),
      messageType: request.messageType || 'TEXT',
      codeLanguage: request.codeLanguage,
      replyToMessageId: request.replyToMessageId,
      replyToSnippet,
      reactions: {},
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };

    this.messages.set(id, messageRecord);

    return {
      success: true,
      message: messageRecord,
    };
  }

  /**
   * Get messages for an authenticated user with direct message privacy filtering
   */
  public getMessagesForUser(
    callerUserId: string,
    meetingId: string
  ): ChatMessageRecord[] {
    const meetingMessages: ChatMessageRecord[] = [];

    for (const msg of this.messages.values()) {
      if (msg.meetingId !== meetingId || msg.isDeleted) continue;

      // Privacy rule: User can see public messages OR direct messages where they are sender or recipient
      if (
        msg.recipientId === 'ALL' ||
        msg.recipientId === callerUserId ||
        msg.senderId === callerUserId
      ) {
        meetingMessages.push(msg);
      }
    }

    meetingMessages.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return meetingMessages;
  }

  /**
   * Add or toggle emoji reaction to a chat message
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
      // Toggle off if already reacted
      msg.reactions[emoji].splice(existingIndex, 1);
      if (msg.reactions[emoji].length === 0) {
        delete msg.reactions[emoji];
      }
    } else {
      // Add reaction
      msg.reactions[emoji].push(callerUserId);
    }

    msg.updatedAt = new Date().toISOString();

    return {
      success: true,
      reactions: msg.reactions,
    };
  }

  /**
   * Delete a chat message (sender can delete their own; HOST can delete any)
   */
  public deleteMessage(
    caller: AuthContextUser & { meetingRole?: MeetingRole },
    messageId: string
  ): { success: boolean; error?: string; code?: string } {
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
    msg.updatedAt = new Date().toISOString();

    return { success: true };
  }

  /**
   * Reset store (useful for clean test states)
   */
  public clearStore(): void {
    this.messages.clear();
  }
}

export const chatService = new ChatService();
