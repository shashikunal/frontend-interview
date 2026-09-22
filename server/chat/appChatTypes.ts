/**
 * Phase 7: Application Chat Domain Types
 * Direct Messages + Group Chat + Presence + Typing + Read Receipts
 */

export type ConversationType = 'DIRECT' | 'GROUP';
export type ParticipantRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export type AppMessageType = 'USER_MESSAGE' | 'SYSTEM_MESSAGE';
export type PresenceStatus = 'ONLINE' | 'OFFLINE';

export interface AppParticipant {
  conversationId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  role: ParticipantRole;
  joinedAt: string;
  leftAt?: string | null;
  lastReadMessageId?: string | null;
  lastReadAt?: string | null;
}

export interface AppConversation {
  id: string;
  type: ConversationType;
  name?: string | null;
  avatarUrl?: string | null;
  createdBy: string;
  lastMessageId?: string | null;
  lastMessagePreview?: string | null;
  lastMessageSenderId?: string | null;
  lastMessageSenderName?: string | null;
  lastMessageAt?: string | null;
  createdAt: string;
  updatedAt: string;
  participants?: AppParticipant[];
  unreadCount?: number;
}

export interface AppMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  messageType: AppMessageType;
  content: string;
  metadata: Record<string, any>;
  clientMessageId?: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationRequest {
  type: ConversationType;
  name?: string;
  avatarUrl?: string;
  participantIds: string[]; // List of user IDs to include
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  clientMessageId?: string;
  metadata?: Record<string, any>;
}

export interface HistoryQuery {
  conversationId: string;
  cursor?: string; // Message ID or timestamp
  limit?: number;  // Default 50, max 100
  direction?: 'BEFORE' | 'AFTER';
}

export interface HistoryResult {
  messages: AppMessage[];
  nextCursor?: string | null;
  hasMore: boolean;
  totalCount: number;
}

export interface UserPresence {
  userId: string;
  status: PresenceStatus;
  lastSeen?: string;
}

export interface TypingState {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  timestamp: number;
}
