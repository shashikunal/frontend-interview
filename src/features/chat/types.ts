/**
 * Frontend Types for Application Chat
 * Phase 7: Application Chat
 */

export type ConversationType = 'DIRECT' | 'GROUP';
export type ParticipantRole = 'OWNER' | 'ADMIN' | 'MEMBER';
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
  messageType: 'USER_MESSAGE' | 'SYSTEM_MESSAGE';
  content: string;
  metadata?: Record<string, any>;
  clientMessageId?: string;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPresence {
  userId: string;
  status: PresenceStatus;
  lastSeen?: string;
}
