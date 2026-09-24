/**
 * Client-Side In-Meeting Chat Service
 * Phase 6: Production-Grade Real-Time Chat, Deduplication, Reconnect, and Persistence
 */

import { io, type Socket } from 'socket.io-client';
import type {
  ChatMessageRecord,
  SendChatMessageRequest,
  AddReactionRequest,
  ChatHistoryResult,
} from '../../../../server/meetings/chatTypes.ts';

export type ChatRealtimeHandlers = {
  onMessage: (msg: ChatMessageRecord) => void;
  onReaction: (messageId: string, reactions: Record<string, string[]>) => void;
  onDeleted?: (messageId: string, deletedBy: string) => void;
  onStatus?: (allowChat: boolean, updatedBy: string) => void;
  onSystem?: (msg: ChatMessageRecord) => void;
  onAnnouncement?: (msg: ChatMessageRecord) => void;
  onReconnect?: () => void;
};

/**
 * Returns true when running on a serverless host (Vercel/Netlify etc.)
 * where Socket.IO WebSocket connections will always fail.
 */
function isServerlessHost(): boolean {
  if (typeof window === 'undefined') return true;
  const h = window.location.hostname;
  return (
    h.endsWith('.vercel.app') ||
    h.endsWith('.now.sh') ||
    h.endsWith('.netlify.app') ||
    (!h.includes('localhost') && !h.includes('127.0.0.1') && !h.includes('192.168.'))
  );
}

export class ChatClientService {
  private socket: Socket | null = null;
  private currentMeetingId: string | null = null;
  private currentMeetingToken: string | null = null;
  private knownMessageIds: Set<string> = new Set();
  private broadcastChannels: Map<string, BroadcastChannel> = new Map();
  private latestMessageTimestamp: string | null = null;
  private listeners: Map<string, Set<ChatRealtimeHandlers>> = new Map();
  /** True when running on Vercel/serverless — WebSockets unavailable */
  private readonly serverlessMode: boolean = isServerlessHost();

  /**
   * Get or create native BroadcastChannel for local cross-tab fallback
   */
  private getBroadcastChannel(meetingId: string): BroadcastChannel | null {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return null;
    }

    if (!this.broadcastChannels.has(meetingId)) {
      const channel = new BroadcastChannel(`meet_chat_${meetingId}`);
      this.broadcastChannels.set(meetingId, channel);
    }

    return this.broadcastChannels.get(meetingId)!;
  }

  /**
   * Initialize Socket.IO connection for meeting chat
   */
  /**
   * Initialize Socket.IO connection for meeting chat.
   * On serverless hosts (Vercel) returns null — REST polling is the sole transport.
   */
  public initSocket(meetingId: string, meetingToken: string): Socket | null {
    // ── Serverless guard: skip WebSocket on Vercel ─────────────────────────────
    if (this.serverlessMode) {
      this.currentMeetingId = meetingId;
      this.currentMeetingToken = meetingToken;
      return null;
    }

    if (this.socket && this.socket.connected && this.currentMeetingId === meetingId) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.disconnect();
    }

    this.currentMeetingId = meetingId;
    this.currentMeetingToken = meetingToken;

    const socketUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    this.socket = io(socketUrl, {
      path: '/api/socket',
      transports: ['websocket', 'polling'],
      auth: {
        token: meetingToken,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    this.socket.on('connect', () => {
      this.socket?.emit('meeting:join', { meetingId, meetingToken }, (ack: any) => {
        if (ack?.success && ack.allowChat !== undefined) {
          this.notifyStatus(meetingId, ack.allowChat, 'SYSTEM');
        }
      });

      // If reconnecting, sync missed messages
      if (this.latestMessageTimestamp) {
        this.socket?.emit('meeting:chat:sync', {
          meetingId,
          sinceTimestamp: this.latestMessageTimestamp,
        }, (res: any) => {
          if (res?.success && Array.isArray(res.messages)) {
            res.messages.forEach((msg: ChatMessageRecord) => {
              this.handleIncomingMessage(meetingId, msg);
            });
          }
        });
      }

      this.notifyReconnect(meetingId);
    });

    // Real-time Broadcast Listeners
    this.socket.on('meeting:chat:message', (msg: ChatMessageRecord) => {
      this.handleIncomingMessage(meetingId, msg);
    });

    this.socket.on('meeting:chat:system', (msg: ChatMessageRecord) => {
      this.handleIncomingMessage(meetingId, msg);
      this.notifySystem(meetingId, msg);
    });

    this.socket.on('meeting:chat:announcement', (msg: ChatMessageRecord) => {
      this.handleIncomingMessage(meetingId, msg);
      this.notifyAnnouncement(meetingId, msg);
    });

    this.socket.on('meeting:chat:deleted', (data: { meetingId: string; messageId: string; deletedBy: string }) => {
      this.notifyDeleted(meetingId, data.messageId, data.deletedBy);
    });

    this.socket.on('meeting:chat:reaction', (data: { meetingId: string; messageId: string; reactions: Record<string, string[]> }) => {
      this.notifyReaction(meetingId, data.messageId, data.reactions);
    });

    this.socket.on('meeting:chat:status', (data: { meetingId: string; allowChat: boolean; updatedBy: string }) => {
      this.notifyStatus(meetingId, data.allowChat, data.updatedBy);
    });

    return this.socket;
  }

  private handleIncomingMessage(meetingId: string, msg: ChatMessageRecord, broadcastLocally = true) {
    if (!msg || !msg.id) return;

    // Deduplication check: prevent visible duplicate messages
    if (this.knownMessageIds.has(msg.id)) {
      return;
    }
    this.knownMessageIds.add(msg.id);

    if (msg.createdAt) {
      this.latestMessageTimestamp = msg.createdAt;
    }

    // Forward to subscribers
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onMessage(msg));
    }

    // Cross-tab broadcast fallback
    if (broadcastLocally) {
      const channel = this.getBroadcastChannel(meetingId);
      if (channel) {
        channel.postMessage({ type: 'NEW_MESSAGE', message: msg });
      }
    }
  }

  private notifyReaction(meetingId: string, messageId: string, reactions: Record<string, string[]>) {
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onReaction(messageId, reactions));
    }
    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({ type: 'REACTION_UPDATED', messageId, reactions });
    }
  }

  private notifyDeleted(meetingId: string, messageId: string, deletedBy: string) {
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onDeleted?.(messageId, deletedBy));
    }
    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({ type: 'MESSAGE_DELETED', messageId, deletedBy });
    }
  }

  private notifyStatus(meetingId: string, allowChat: boolean, updatedBy: string) {
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onStatus?.(allowChat, updatedBy));
    }
  }

  private notifySystem(meetingId: string, msg: ChatMessageRecord) {
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onSystem?.(msg));
    }
  }

  private notifyAnnouncement(meetingId: string, msg: ChatMessageRecord) {
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onAnnouncement?.(msg));
    }
  }

  private notifyReconnect(meetingId: string) {
    const handlers = this.listeners.get(meetingId);
    if (handlers) {
      handlers.forEach(h => h.onReconnect?.());
    }
  }

  /**
   * Fetch in-meeting messages with optional cursor pagination
   */
  public async getMessages(
    meetingId: string,
    meetingToken: string,
    cursor?: string,
    limit = 50
  ): Promise<ChatHistoryResult> {
    const url = new URL('/api/v1/meetings/chat', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
    url.searchParams.set('meetingId', meetingId);
    if (cursor) url.searchParams.set('cursor', cursor);
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${meetingToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch messages (${res.status})`);
    }

    const data = await res.json();
    const messages: ChatMessageRecord[] = data.messages || [];

    // Register known IDs for deduplication
    messages.forEach(m => {
      this.knownMessageIds.add(m.id);
      if (!this.latestMessageTimestamp || new Date(m.createdAt) > new Date(this.latestMessageTimestamp)) {
        this.latestMessageTimestamp = m.createdAt;
      }
    });

    return {
      messages,
      nextCursor: data.nextCursor,
      hasMore: !!data.hasMore,
      totalCount: data.totalCount,
    };
  }

  /**
   * Send a chat message (via WebSocket with REST fallback)
   */
  public async sendMessage(
    meetingToken: string,
    request: SendChatMessageRequest
  ): Promise<ChatMessageRecord> {
    // Attempt real-time socket emit if connected
    if (this.socket && this.socket.connected) {
      return new Promise<ChatMessageRecord>((resolve, reject) => {
        this.socket?.emit('meeting:chat:send', request, (res: any) => {
          if (res?.success && res.message) {
            this.handleIncomingMessage(request.meetingId, res.message);
            resolve(res.message);
          } else {
            reject(new Error(res?.error || 'Failed to send message over socket'));
          }
        });
      });
    }

    // Fallback to REST endpoint
    const res = await fetch('/api/v1/meetings/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        action: 'SEND',
        ...request,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to send message (${res.status})`);
    }

    const data = await res.json();
    const sentMessage: ChatMessageRecord = data.message;
    this.handleIncomingMessage(request.meetingId, sentMessage);
    return sentMessage;
  }

  /**
   * Delete a message (via WebSocket with REST fallback)
   */
  public async deleteMessage(
    meetingToken: string,
    meetingId: string,
    messageId: string
  ): Promise<void> {
    if (this.socket && this.socket.connected) {
      return new Promise<void>((resolve, reject) => {
        this.socket?.emit('meeting:chat:delete', { meetingId, messageId }, (res: any) => {
          if (res?.success) {
            this.notifyDeleted(meetingId, messageId, 'current_user');
            resolve();
          } else {
            reject(new Error(res?.error || 'Failed to delete message'));
          }
        });
      });
    }

    const res = await fetch('/api/v1/meetings/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        action: 'DELETE',
        meetingId,
        messageId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete message (${res.status})`);
    }

    this.notifyDeleted(meetingId, messageId, 'current_user');
  }

  /**
   * Add or toggle emoji reaction
   */
  public async addReaction(
    meetingToken: string,
    request: AddReactionRequest
  ): Promise<Record<string, string[]>> {
    if (this.socket && this.socket.connected) {
      return new Promise<Record<string, string[]>>((resolve, reject) => {
        this.socket?.emit('meeting:chat:reaction', request, (res: any) => {
          if (res?.success && res.reactions) {
            this.notifyReaction(request.meetingId, request.messageId, res.reactions);
            resolve(res.reactions);
          } else {
            reject(new Error(res?.error || 'Failed to add reaction'));
          }
        });
      });
    }

    const res = await fetch('/api/v1/meetings/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        action: 'REACTION',
        ...request,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to add reaction (${res.status})`);
    }

    const data = await res.json();
    this.notifyReaction(request.meetingId, request.messageId, data.reactions);
    return data.reactions;
  }

  /**
   * Host / Admin Toggle Chat
   */
  public async toggleChat(
    meetingToken: string,
    meetingId: string,
    allowChat: boolean
  ): Promise<boolean> {
    if (this.socket && this.socket.connected) {
      return new Promise<boolean>((resolve, reject) => {
        this.socket?.emit('meeting:chat:toggle', { meetingId, allowChat }, (res: any) => {
          if (res?.success) {
            resolve(res.allowChat);
          } else {
            reject(new Error(res?.error || 'Failed to toggle chat'));
          }
        });
      });
    }

    const res = await fetch('/api/v1/meetings/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        action: 'TOGGLE_CHAT',
        meetingId,
        allowChat,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to toggle chat (${res.status})`);
    }

    const data = await res.json();
    return data.allowChat;
  }

  /**
   * Host / Admin Announcement
   */
  public async sendAnnouncement(
    meetingToken: string,
    meetingId: string,
    content: string
  ): Promise<ChatMessageRecord> {
    if (this.socket && this.socket.connected) {
      return new Promise<ChatMessageRecord>((resolve, reject) => {
        this.socket?.emit('meeting:chat:announce', { meetingId, content }, (res: any) => {
          if (res?.success && res.message) {
            this.handleIncomingMessage(meetingId, res.message);
            resolve(res.message);
          } else {
            reject(new Error(res?.error || 'Failed to send announcement'));
          }
        });
      });
    }

    const res = await fetch('/api/v1/meetings/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        action: 'ANNOUNCEMENT',
        meetingId,
        content,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to send announcement (${res.status})`);
    }

    const data = await res.json();
    this.handleIncomingMessage(meetingId, data.message);
    return data.message;
  }

  /**
   * Subscribe to real-time events
   */
  public subscribeToRealtime(
    meetingId: string,
    handlers: ChatRealtimeHandlers
  ): () => void {
    if (!this.listeners.has(meetingId)) {
      this.listeners.set(meetingId, new Set());
    }
    this.listeners.get(meetingId)!.add(handlers);

    // Cross-tab broadcast listener
    const channel = this.getBroadcastChannel(meetingId);
    let channelHandler: ((event: MessageEvent) => void) | null = null;
    if (channel) {
      channelHandler = (event: MessageEvent) => {
        const data = event.data;
        if (!data) return;

        if (data.type === 'NEW_MESSAGE' && data.message) {
          this.handleIncomingMessage(meetingId, data.message, false);
        } else if (data.type === 'REACTION_UPDATED') {
          handlers.onReaction(data.messageId, data.reactions);
        } else if (data.type === 'MESSAGE_DELETED') {
          handlers.onDeleted?.(data.messageId, data.deletedBy);
        }
      };
      channel.addEventListener('message', channelHandler);
    }

    // Serverless & cross-client resilient polling fallback (every 1.2s)
    let pollInterval: any = null;
    pollInterval = setInterval(async () => {
      const token = this.currentMeetingToken;
      if (!token) return;
      try {
        const res = await this.getMessages(meetingId, token, undefined, 50);
        if (res.messages && res.messages.length > 0) {
          res.messages.forEach(msg => {
            this.handleIncomingMessage(meetingId, msg, false);
          });
        }
      } catch (_) {}
    }, 1200);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      const set = this.listeners.get(meetingId);
      if (set) {
        set.delete(handlers);
        if (set.size === 0) {
          this.listeners.delete(meetingId);
        }
      }
      if (channel && channelHandler) {
        channel.removeEventListener('message', channelHandler);
      }
    };
  }

  /**
   * Cleanup when leaving meeting
   */
  public cleanup(meetingId: string): void {
    if (this.socket) {
      this.socket.emit('meeting:leave', { meetingId });
      this.socket.disconnect();
      this.socket = null;
    }

    const channel = this.broadcastChannels.get(meetingId);
    if (channel) {
      channel.close();
      this.broadcastChannels.delete(meetingId);
    }

    this.listeners.delete(meetingId);
    this.currentMeetingId = null;
    this.currentMeetingToken = null;
    this.latestMessageTimestamp = null;
  }

  public getCurrentToken(): string | null {
    return this.currentMeetingToken;
  }
}

export const chatClientService = new ChatClientService();
