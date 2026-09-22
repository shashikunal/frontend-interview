/**
 * Application Chat Client Service
 * Phase 7: Realtime Messaging, Presence, Typing, Read Receipts, and Reconnect
 */

import { io, type Socket } from 'socket.io-client';
import type { AppConversation, AppMessage, UserPresence } from '../types.ts';

export interface AppChatRealtimeHandlers {
  onMessageCreated?: (message: AppMessage) => void;
  onMessageDeleted?: (data: { conversationId: string; messageId: string; deletedBy: string }) => void;
  onMessageRead?: (data: { conversationId: string; userId: string; lastReadMessageId: string; lastReadAt: string }) => void;
  onTypingUpdate?: (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => void;
  onPresenceUpdate?: (data: { userId: string; status: 'ONLINE' | 'OFFLINE'; lastSeen?: string }) => void;
  onConversationUpdated?: (conversation: AppConversation) => void;
}

export class AppChatClientService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private currentUser: { id: string; name: string; role?: string } | null = null;
  private handlers: Set<AppChatRealtimeHandlers> = new Set();
  private activeConversationId: string | null = null;
  private typingTimeouts: Map<string, any> = new Map();

  public getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Connect to Socket.IO server
   */
  public connect(token: string, user: { id: string; name: string; role?: string }): Socket {
    this.token = token;
    this.currentUser = user;

    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    const host = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    this.socket = io(host, {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      auth: {
        token,
        devUser: {
          id: user.id,
          name: user.name,
          role: user.role || 'candidate',
        },
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      if (this.activeConversationId) {
        this.socket?.emit('app:chat:join', { conversationId: this.activeConversationId });
      }
    });

    this.socket.on('app:chat:message:created', (message: AppMessage) => {
      this.handlers.forEach(h => h.onMessageCreated?.(message));
    });

    this.socket.on('app:chat:message:deleted', (data) => {
      this.handlers.forEach(h => h.onMessageDeleted?.(data));
    });

    this.socket.on('app:chat:message:read', (data) => {
      this.handlers.forEach(h => h.onMessageRead?.(data));
    });

    this.socket.on('app:chat:typing:update', (data) => {
      this.handlers.forEach(h => h.onTypingUpdate?.(data));
    });

    this.socket.on('app:chat:presence:update', (data) => {
      this.handlers.forEach(h => h.onPresenceUpdate?.(data));
    });

    this.socket.on('app:chat:conversation:updated', (data) => {
      this.handlers.forEach(h => h.onConversationUpdated?.(data));
    });

    return this.socket;
  }

  public registerHandlers(handlers: AppChatRealtimeHandlers): () => void {
    this.handlers.add(handlers);
    return () => {
      this.handlers.delete(handlers);
    };
  }

  public setActiveConversation(conversationId: string | null): void {
    if (this.activeConversationId && this.activeConversationId !== conversationId) {
      this.socket?.emit('app:chat:leave', { conversationId: this.activeConversationId });
    }
    this.activeConversationId = conversationId;
    if (conversationId && this.socket?.connected) {
      this.socket.emit('app:chat:join', { conversationId });
    }
  }

  /**
   * REST: Fetch conversations for current user
   */
  public async fetchConversations(): Promise<{ conversations: AppConversation[]; totalUnread: number }> {
    const res = await fetch('/api/v1/chat?action=conversations', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch conversations');
    const data = await res.json();
    return {
      conversations: data.conversations || [],
      totalUnread: data.totalUnread || 0,
    };
  }

  /**
   * REST: Create or reuse a conversation
   */
  public async createConversation(payload: {
    type: 'DIRECT' | 'GROUP';
    name?: string;
    avatarUrl?: string;
    participantIds: string[];
  }): Promise<{ conversation: AppConversation; reused: boolean }> {
    const res = await fetch('/api/v1/chat?action=conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create conversation');
    }
    const data = await res.json();
    return {
      conversation: data.conversation,
      reused: data.reused || false,
    };
  }

  /**
   * REST: Fetch paginated messages
   */
  public async fetchMessages(
    conversationId: string,
    cursor?: string,
    limit = 50,
    direction: 'BEFORE' | 'AFTER' = 'BEFORE'
  ): Promise<{ messages: AppMessage[]; nextCursor?: string | null; hasMore: boolean; totalCount: number }> {
    const params = new URLSearchParams({
      action: 'messages',
      conversationId,
      limit: String(limit),
      direction,
    });
    if (cursor) params.set('cursor', cursor);

    const res = await fetch(`/api/v1/chat?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  }

  /**
   * Send a message via Socket.IO with REST fallback
   */
  public async sendMessage(conversationId: string, content: string, clientMessageId?: string): Promise<AppMessage> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit(
          'app:chat:message:send',
          { conversationId, content, clientMessageId },
          (ack: any) => {
            if (ack?.success && ack?.message) {
              resolve(ack.message);
            } else {
              reject(new Error(ack?.error || 'Failed to send message via socket'));
            }
          }
        );
      } else {
        // Fallback to REST
        fetch('/api/v1/chat?action=messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ conversationId, content, clientMessageId }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.message) resolve(data.message);
            else reject(new Error(data.message || 'Failed to send message'));
          })
          .catch(reject);
      }
    });
  }

  /**
   * Delete a message
   */
  public async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('app:chat:message:delete', { conversationId, messageId }, (ack: any) => {
          if (ack?.success) resolve();
          else reject(new Error(ack?.error || 'Failed to delete message'));
        });
      } else {
        fetch(`/api/v1/chat?action=messages&conversationId=${conversationId}&messageId=${messageId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) resolve();
            else reject(new Error(data.message || 'Failed to delete message'));
          })
          .catch(reject);
      }
    });
  }

  /**
   * Mark conversation as read
   */
  public markAsRead(conversationId: string, messageId?: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('app:chat:message:read', { conversationId, messageId });
    } else {
      fetch('/api/v1/chat?action=read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({ conversationId, messageId }),
      }).catch(console.error);
    }
  }

  /**
   * Start / Stop typing indicators
   */
  public startTyping(conversationId: string): void {
    if (!this.socket || !this.socket.connected) return;
    this.socket.emit('app:chat:typing:start', { conversationId });

    // Reset auto-stop timeout
    if (this.typingTimeouts.has(conversationId)) {
      clearTimeout(this.typingTimeouts.get(conversationId));
    }
    const timer = setTimeout(() => {
      this.stopTyping(conversationId);
    }, 2500);
    this.typingTimeouts.set(conversationId, timer);
  }

  public stopTyping(conversationId: string): void {
    if (this.typingTimeouts.has(conversationId)) {
      clearTimeout(this.typingTimeouts.get(conversationId));
      this.typingTimeouts.delete(conversationId);
    }
    if (this.socket && this.socket.connected) {
      this.socket.emit('app:chat:typing:stop', { conversationId });
    }
  }

  /**
   * Query presences
   */
  public async getPresences(userIds: string[]): Promise<Record<string, UserPresence>> {
    return new Promise((resolve) => {
      if (this.socket && this.socket.connected) {
        this.socket.emit('app:chat:presence:subscribe', { userIds }, (ack: any) => {
          resolve(ack?.presences || {});
        });
      } else {
        fetch(`/api/v1/chat?action=presence&userIds=${userIds.join(',')}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
          .then(res => res.json())
          .then(data => resolve(data.presences || {}))
          .catch(() => resolve({}));
      }
    });
  }

  /**
   * Group membership controls
   */
  public async addMember(conversationId: string, targetUserId: string, targetUserName: string, role = 'MEMBER'): Promise<any> {
    const res = await fetch('/api/v1/chat?action=members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        conversationId,
        memberAction: 'ADD',
        targetUserId,
        targetUserName,
        role,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to add member');
    }
    return res.json();
  }

  public async removeMember(conversationId: string, targetUserId: string): Promise<any> {
    const res = await fetch('/api/v1/chat?action=members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        conversationId,
        memberAction: 'REMOVE',
        targetUserId,
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to remove member');
    }
    return res.json();
  }

  public async leaveGroup(conversationId: string): Promise<any> {
    const res = await fetch('/api/v1/chat?action=members', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        conversationId,
        memberAction: 'LEAVE',
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to leave group');
    }
    return res.json();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.handlers.clear();
    for (const timer of this.typingTimeouts.values()) {
      clearTimeout(timer);
    }
    this.typingTimeouts.clear();
  }
}

export const appChatClientService = new AppChatClientService();
