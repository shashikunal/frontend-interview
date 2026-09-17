/**
 * Meeting Chat Domain Types & Models
 * Phase 5: Real-Time In-Meeting Chat & Direct Messaging
 */

import type { MeetingRole } from '../auth/tokenTypes.ts';

export type ChatMessageType = 'TEXT' | 'CODE' | 'SYSTEM';

export interface ChatReactionRecord {
  emoji: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface ChatMessageRecord {
  id: string;
  meetingId: string;
  senderId: string;
  senderName: string;
  senderRole: MeetingRole;
  recipientId: 'ALL' | string; // 'ALL' for public broadcast, or userId for direct 1:1 message
  recipientName?: string;
  content: string;
  messageType: ChatMessageType;
  codeLanguage?: string;
  replyToMessageId?: string;
  replyToSnippet?: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  isDeleted: boolean;
  createdAt: string; // ISO 8601
  updatedAt?: string; // ISO 8601
}

export interface SendChatMessageRequest {
  meetingId: string;
  recipientId?: 'ALL' | string;
  content: string;
  messageType?: ChatMessageType;
  codeLanguage?: string;
  replyToMessageId?: string;
}

export interface AddReactionRequest {
  meetingId: string;
  messageId: string;
  emoji: string;
}
