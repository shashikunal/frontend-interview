/**
 * Meeting Chat Domain Types & Models
 * Phase 6: Production-Grade In-Meeting Realtime Chat
 */

import type { MeetingRole } from '../auth/tokenTypes.ts';

export type ChatMessageType =
  | 'USER_MESSAGE'
  | 'SYSTEM_MESSAGE'
  | 'HOST_ANNOUNCEMENT'
  | 'TEXT'
  | 'CODE'
  | 'SYSTEM';

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
  recipientId: 'ALL' | string; // 'ALL' for public meeting broadcast
  recipientName?: string;
  content: string;
  messageType: ChatMessageType;
  codeLanguage?: string;
  replyToMessageId?: string;
  replyToSnippet?: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  isDeleted: boolean;
  deletedAt?: string; // ISO 8601
  deletedBy?: string; // userId who executed deletion
  metadata?: Record<string, any>;
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
  correlationId?: string;
}

export interface AddReactionRequest {
  meetingId: string;
  messageId: string;
  emoji: string;
}

export interface ToggleChatRequest {
  meetingId: string;
  allowChat: boolean;
}

export interface HostAnnouncementRequest {
  meetingId: string;
  content: string;
  correlationId?: string;
}

export interface ChatHistoryQuery {
  meetingId: string;
  cursor?: string; // ISO 8601 timestamp or message ID for pagination
  limit?: number; // Default 50
  direction?: 'BEFORE' | 'AFTER';
}

export interface ChatHistoryResult {
  messages: ChatMessageRecord[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount?: number;
}

export interface MeetingChatEventEnvelope<T = any> {
  eventId: string;
  type: string;
  meetingId: string;
  timestamp: string;
  correlationId?: string;
  payload: T;
}
