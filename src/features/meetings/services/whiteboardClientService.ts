/**
 * Client Whiteboard Service
 * Phase 6: In-Meeting Collaborative Vector Whiteboard
 */

import type {
  WhiteboardElement,
  WhiteboardSnapshot,
} from '../../../../server/meetings/whiteboardTypes.ts';

export class WhiteboardClientService {
  private broadcastChannels: Map<string, BroadcastChannel> = new Map();

  /**
   * Get or create native BroadcastChannel for cross-tab realtime sync
   */
  private getBroadcastChannel(meetingId: string): BroadcastChannel | null {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) {
      return null;
    }

    if (!this.broadcastChannels.has(meetingId)) {
      const channel = new BroadcastChannel(`meet_whiteboard_${meetingId}`);
      this.broadcastChannels.set(meetingId, channel);
    }

    return this.broadcastChannels.get(meetingId)!;
  }

  /**
   * Fetch whiteboard snapshot from server
   */
  public async getSnapshot(meetingId: string, meetingToken: string): Promise<WhiteboardSnapshot> {
    const res = await fetch(`/api/v1/meetings/whiteboard?meetingId=${encodeURIComponent(meetingId)}`, {
      headers: {
        Authorization: `Bearer ${meetingToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to fetch whiteboard snapshot (${res.status})`);
    }

    const data = await res.json();
    return data.snapshot;
  }

  /**
   * Upsert a whiteboard element
   */
  public async upsertElement(
    meetingId: string,
    meetingToken: string,
    element: Partial<WhiteboardElement> & { id: string; type: WhiteboardElement['type'] }
  ): Promise<WhiteboardElement> {
    const res = await fetch('/api/v1/meetings/whiteboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'UPSERT',
        element,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to save whiteboard element (${res.status})`);
    }

    const data = await res.json();
    const updatedElement: WhiteboardElement = data.element;

    // Distribute via BroadcastChannel for instant multi-tab sync
    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'ELEMENT_UPSERTED',
        element: updatedElement,
      });
    }

    return updatedElement;
  }

  /**
   * Delete a whiteboard element by ID
   */
  public async deleteElement(
    meetingId: string,
    meetingToken: string,
    elementId: string
  ): Promise<void> {
    const res = await fetch('/api/v1/meetings/whiteboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'DELETE',
        elementId,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to delete whiteboard element (${res.status})`);
    }

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'ELEMENT_DELETED',
        elementId,
      });
    }
  }

  /**
   * Clear all elements on the canvas
   */
  public async clearBoard(meetingId: string, meetingToken: string): Promise<void> {
    const res = await fetch('/api/v1/meetings/whiteboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({
        meetingId,
        action: 'CLEAR',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to clear whiteboard (${res.status})`);
    }

    const channel = this.getBroadcastChannel(meetingId);
    if (channel) {
      channel.postMessage({
        type: 'BOARD_CLEARED',
      });
    }
  }

  /**
   * Subscribe to incoming real-time whiteboard mutations
   */
  public subscribeToRealtime(
    meetingId: string,
    onUpsert: (elem: WhiteboardElement) => void,
    onDelete: (elementId: string) => void,
    onClear: () => void
  ): () => void {
    const channel = this.getBroadcastChannel(meetingId);
    if (!channel) return () => {};

    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (!data) return;

      if (data.type === 'ELEMENT_UPSERTED' && data.element) {
        onUpsert(data.element);
      } else if (data.type === 'ELEMENT_DELETED' && data.elementId) {
        onDelete(data.elementId);
      } else if (data.type === 'BOARD_CLEARED') {
        onClear();
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

export const whiteboardClientService = new WhiteboardClientService();
