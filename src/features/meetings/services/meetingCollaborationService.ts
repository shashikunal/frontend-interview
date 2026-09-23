/**
 * Meeting Collaboration Client Service
 * Phase 16: Advanced Meeting Collaboration & Media Experience
 * Realtime WebSocket control-plane client for participants, hand raises, ephemeral reactions,
 * host moderation actions, and reconnect reconciliation.
 */

import { io, type Socket } from 'socket.io-client';
import type { RemoteParticipant, EphemeralReactionEvent } from '../types/mediaRoomTypes';

export interface CollaborationEventHandlers {
  onParticipantJoined?: (participant: RemoteParticipant) => void;
  onParticipantLeft?: (data: { meetingId: string; userId: string; socketId: string }) => void;
  onParticipantUpdated?: (data: Partial<RemoteParticipant> & { id: string }) => void;
  onHandRaised?: (data: { meetingId: string; userId: string; handRaisedAt: string }) => void;
  onHandLowered?: (data: { meetingId: string; userId: string }) => void;
  onReaction?: (reaction: EphemeralReactionEvent) => void;
  onMuteRequested?: (data: { meetingId: string; targetUserId: string; requestedBy: string }) => void;
  onParticipantRemoved?: (data: { meetingId: string; targetUserId: string; reason?: string }) => void;
  onMeetingEnded?: (data: { meetingId: string; reason?: string }) => void;
  onStateSynced?: (participants: RemoteParticipant[]) => void;
}

export class MeetingCollaborationService {
  private socket: Socket | null = null;
  private currentMeetingId: string | null = null;
  private currentMeetingToken: string | null = null;
  private handlers: Set<CollaborationEventHandlers> = new Set();

  /**
   * Connect or retrieve existing Socket.IO connection
   */
  public initSocket(meetingId: string, meetingToken: string): Socket {
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
      auth: { token: meetingToken },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.setupListeners();
    return this.socket;
  }

  public getMeetingToken(): string | null {
    return this.currentMeetingToken;
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('meeting:participant:joined', (serverParticipant: any) => {
      const p = this.mapServerParticipant(serverParticipant);
      this.handlers.forEach(h => h.onParticipantJoined?.(p));
    });

    this.socket.on('meeting:participant:left', (data: { meetingId: string; userId: string; socketId: string }) => {
      this.handlers.forEach(h => h.onParticipantLeft?.(data));
    });

    this.socket.on('meeting:participant:updated', (serverParticipant: any) => {
      const p = this.mapServerParticipant(serverParticipant);
      this.handlers.forEach(h => h.onParticipantUpdated?.(p));
    });

    this.socket.on('meeting:hand:raised', (data: { meetingId: string; userId: string; handRaisedAt: string }) => {
      this.handlers.forEach(h => h.onHandRaised?.(data));
    });

    this.socket.on('meeting:hand:lowered', (data: { meetingId: string; userId: string }) => {
      this.handlers.forEach(h => h.onHandLowered?.(data));
    });

    this.socket.on('meeting:reaction:broadcast', (reaction: EphemeralReactionEvent) => {
      this.handlers.forEach(h => h.onReaction?.(reaction));
    });

    this.socket.on('meeting:host:mute-requested', (data: { meetingId: string; targetUserId: string; requestedBy: string }) => {
      this.handlers.forEach(h => h.onMuteRequested?.(data));
    });

    this.socket.on('meeting:participant:removed', (data: { meetingId: string; targetUserId: string; reason?: string }) => {
      this.handlers.forEach(h => h.onParticipantRemoved?.(data));
    });

    this.socket.on('meeting:ended', (data: { meetingId: string; reason?: string }) => {
      this.handlers.forEach(h => h.onMeetingEnded?.(data));
    });

    this.socket.on('meeting:state:synced', (data: { meetingId: string; participants: any[] }) => {
      const mapped = (data.participants || []).map(p => this.mapServerParticipant(p));
      this.handlers.forEach(h => h.onStateSynced?.(mapped));
    });

    // Reconnection handling: resync participant presence & state
    this.socket.on('reconnect', () => {
      if (this.currentMeetingId) {
        this.syncState(this.currentMeetingId);
      }
    });
  }

  public mapServerParticipant(sp: any): RemoteParticipant {
    return {
      id: sp.userId,
      name: sp.displayName,
      role: sp.role,
      isHost: sp.role === 'HOST',
      audioEnabled: sp.micState !== false,
      videoEnabled: sp.cameraState !== false,
      screenShareEnabled: sp.screenShareState === true,
      audioLevel: 0,
      isSpeaking: false,
      connectionQuality: sp.connectionQuality || 'EXCELLENT',
      avatarUrl: sp.avatarUrl,
      handRaised: sp.handRaised === true,
      handRaisedAt: sp.handRaisedAt,
      presence: sp.connectionState || 'connected',
      joinedAt: sp.joinedAt,
    };
  }

  public subscribe(handlers: CollaborationEventHandlers): () => void {
    this.handlers.add(handlers);
    return () => {
      this.handlers.delete(handlers);
    };
  }

  public joinRoom(
    meetingId: string,
    meetingToken: string
  ): Promise<{ success: boolean; participants: RemoteParticipant[]; error?: string }> {
    return new Promise(resolve => {
      const socket = this.initSocket(meetingId, meetingToken);
      socket.emit('meeting:join', { meetingId, meetingToken }, (ack: any) => {
        if (!ack?.success) {
          resolve({ success: false, participants: [], error: ack?.error || 'Join room failed' });
          return;
        }

        const participants = (ack.participants || []).map((p: any) => this.mapServerParticipant(p));
        resolve({ success: true, participants });
      });
    });
  }

  public leaveRoom(meetingId: string): void {
    this.socket?.emit('meeting:leave', { meetingId });
  }

  public updateLocalMediaState(
    meetingId: string,
    updates: {
      micState?: boolean;
      cameraState?: boolean;
      screenShareState?: boolean;
      connectionQuality?: 'EXCELLENT' | 'GOOD' | 'POOR' | 'LOST';
    }
  ): void {
    this.socket?.emit('meeting:participant:state', { meetingId, ...updates });
  }

  public raiseHand(meetingId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:hand:raise', { meetingId }, (ack: any) => {
        resolve(!!ack?.success);
      });
    });
  }

  public lowerHand(meetingId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:hand:lower', { meetingId }, (ack: any) => {
        resolve(!!ack?.success);
      });
    });
  }

  public hostLowerHand(meetingId: string, targetUserId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:hand:host-lower', { meetingId, targetUserId }, (ack: any) => {
        resolve(!!ack?.success);
      });
    });
  }

  public sendReaction(meetingId: string, emoji: string): Promise<{ success: boolean; error?: string }> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:reaction', { meetingId, emoji }, (ack: any) => {
        resolve(ack || { success: false });
      });
    });
  }

  public hostRequestMute(meetingId: string, targetUserId: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:host:mute-participant', { meetingId, targetUserId }, (ack: any) => {
        resolve(!!ack?.success);
      });
    });
  }

  public hostRemoveParticipant(meetingId: string, targetUserId: string, reason?: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:host:remove-participant', { meetingId, targetUserId, reason }, (ack: any) => {
        resolve(!!ack?.success);
      });
    });
  }

  public hostEndMeeting(meetingId: string, reason?: string): Promise<boolean> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:host:end-meeting', { meetingId, reason }, (ack: any) => {
        resolve(!!ack?.success);
      });
    });
  }

  public syncState(meetingId: string): Promise<RemoteParticipant[]> {
    return new Promise(resolve => {
      this.socket?.emit('meeting:sync-state', { meetingId }, (ack: any) => {
        if (ack?.success && Array.isArray(ack.participants)) {
          const mapped = ack.participants.map((p: any) => this.mapServerParticipant(p));
          this.handlers.forEach(h => h.onStateSynced?.(mapped));
          resolve(mapped);
        } else {
          resolve([]);
        }
      });
    });
  }

  public cleanup(meetingId: string): void {
    if (this.currentMeetingId === meetingId) {
      this.socket?.disconnect();
      this.socket = null;
      this.currentMeetingId = null;
      this.currentMeetingToken = null;
      this.handlers.clear();
    }
  }
}

export const meetingCollaborationService = new MeetingCollaborationService();
