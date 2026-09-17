/**
 * Client-Side In-Meeting Chat Service
 * Phase 5: Real-Time Chat, Threading, and Direct Messaging
 */

import type {
  ChatMessageRecord,
  SendChatMessageRequest,
  AddReactionRequest,
} from '../../../../server/meetings/chatTypes.ts';

export class ChatClientService {
  private broadcastChannels: Map<string, BroadcastChannel> = new Map();

  /**
   * Get or create native BroadcastChannel for cross-tab realtime sync
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
   * Fetch in-meeting messages for the current user
   */
  public async getMessages(meetingId: string, meetingToken: string): Promise<ChatMessageRecord[]> {
    const res = await fetch(`/api/v1/meetings/chat?meetingId=${encodeURIComponent(meetingId)}`, {
      headers: {
        Authorization: `Bearer ${meetingToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch messages (${res.status})`);
    }

    const data = await res.json();
    return data.messages || [];
  }

  /**
   * Send a chat message
   */
  public async sendMessage(
    meetingToken: string,
    request: SendChatMessageRequest
  ): Promise<ChatMessageRecord> {
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

    // Distribute via BroadcastChannel for instant multi-tab sync
    const channel = this.getBroadcastChannel(request.meetingId);
    if (channel) {
      channel.postMessage({
        type: 'NEW_MESSAGE',
        message: sentMessage,
      });
    }

    return sentMessage;
  }

  /**
   * Add or toggle emoji reaction to a message
   */
  public async addReaction(
    meetingToken: string,
    request: AddReactionRequest
  ): Promise<Record<string, string[]>> {
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

    const channel = this.getBroadcastChannel(request.meetingId);
    if (channel) {
      channel.postMessage({
        type: 'REACTION_UPDATED',
        messageId: request.messageId,
        reactions: data.reactions,
      });
    }

    return data.reactions;
  }

  /**
   * Subscribe to real-time incoming messages & reactions
   */
  public subscribeToRealtime(
    meetingId: string,
    onMessage: (msg: ChatMessageRecord) => void,
    onReaction: (messageId: string, reactions: Record<string, string[]>) => void
  ): () => void {
    const channel = this.getBroadcastChannel(meetingId);
    if (!channel) return () => {};

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'NEW_MESSAGE' && data.message) {
        onMessage(data.message);
      } else if (data.type === 'REACTION_UPDATED') {
        onReaction(data.messageId, data.reactions);
      }
    };

    channel.addEventListener('message', handler);

    return () => {
      channel.removeEventListener('message', handler);
    };
  }

  /**
   * Cleanup broadcast channels
   */
  public cleanup(meetingId: string): void {
    const channel = this.broadcastChannels.get(meetingId);
    if (channel) {
      channel.close();
      this.broadcastChannels.delete(meetingId);
    }
  }
}

export const chatClientService = new ChatClientService();
