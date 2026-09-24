/**
 * Meeting Collaboration Client Service
 * Phase 16: Advanced Meeting Collaboration & Media Experience
 * Realtime WebSocket control-plane client for participants, hand raises, ephemeral reactions,
 * host moderation actions, and reconnect reconciliation.
 *
 * Serverless Strategy:
 * - On Vercel (production serverless): WebSockets are not supported.
 *   All collaboration state is synced exclusively via REST polling against /api/v1/meetings/signaling.
 * - On localhost (dev): Socket.IO connects normally for full real-time support.
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

/**
 * Detect if we are running on a serverless/Vercel host where WebSockets are not supported.
 * On these hosts we skip Socket.IO entirely and rely on REST polling.
 */
function isServerlessHost(): boolean {
  if (typeof window === 'undefined') return true;
  const host = window.location.hostname;
  return (
    host.endsWith('.vercel.app') ||
    host.endsWith('.now.sh') ||
    host.endsWith('.netlify.app') ||
    // Any non-localhost production host that is not running a local socket server
    (!host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('192.168.'))
  );
}

export class MeetingCollaborationService {
  private socket: Socket | null = null;
  private currentMeetingId: string | null = null;
  private currentMeetingToken: string | null = null;
  private handlers: Set<CollaborationEventHandlers> = new Set();
  /** True when running on Vercel/serverless — WebSockets unavailable */
  private readonly serverlessMode: boolean = isServerlessHost();

  /**
   * Connect or retrieve existing Socket.IO connection.
   * On serverless hosts this is a no-op — REST polling is the sole transport.
   */
  public initSocket(meetingId: string, meetingToken: string): Socket | null {
    // ── Serverless guard ──────────────────────────────────────────────────────
    // Vercel and similar platforms do not support WebSocket connections.
    // Attempting to connect generates console errors on every reconnect cycle.
    // We skip Socket.IO entirely and rely on the REST signaling relay instead.
    if (this.serverlessMode) {
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
      // On localhost we allow both transports; never expose websocket on prod
      transports: ['websocket', 'polling'],
      auth: { token: meetingToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      timeout: 8000,
    });

    this.setupListeners();
    return this.socket;
  }

  public getMeetingToken(): string | null {
    return this.currentMeetingToken;
  }

  public getSocket(): Socket | null {
    return this.socket;
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
      socketId: sp.socketId,
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

  private pollInterval: any = null;

  public startPresencePolling(meetingId: string, meetingToken: string): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/v1/meetings/signaling?meetingId=${encodeURIComponent(meetingId)}`, {
          headers: { Authorization: `Bearer ${meetingToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.participants)) {
            const mapped: RemoteParticipant[] = data.participants.map((p: any) => ({
              id: p.id,
              name: p.name,
              role: p.role,
              isHost: p.isHost,
              audioEnabled: p.audioEnabled,
              videoEnabled: p.videoEnabled,
              screenShareEnabled: p.screenShareEnabled,
              audioLevel: 0,
              isSpeaking: false,
              connectionQuality: 'EXCELLENT',
              presence: 'connected',
            }));
            this.handlers.forEach(h => h.onStateSynced?.(mapped));
          }
        }
      } catch (_) {}
    }, 1500);
  }

  public async joinRoom(
    meetingId: string,
    meetingToken: string
  ): Promise<{ success: boolean; participants: RemoteParticipant[]; error?: string }> {
    this.currentMeetingId = meetingId;
    this.currentMeetingToken = meetingToken;

    // 1. Register presence with REST signaling relay (works on all environments)
    let restParticipants: RemoteParticipant[] = [];
    try {
      await fetch('/api/v1/meetings/signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${meetingToken}`,
        },
        body: JSON.stringify({ action: 'JOIN', meetingId }),
      });

      const getRes = await fetch(`/api/v1/meetings/signaling?meetingId=${encodeURIComponent(meetingId)}`, {
        headers: { Authorization: `Bearer ${meetingToken}` },
      });
      if (getRes.ok) {
        const getData = await getRes.json();
        if (Array.isArray(getData.participants)) {
          restParticipants = getData.participants.map((p: any) => ({
            id: p.id,
            name: p.name,
            role: p.role,
            isHost: p.isHost,
            audioEnabled: p.audioEnabled,
            videoEnabled: p.videoEnabled,
            screenShareEnabled: p.screenShareEnabled,
            audioLevel: 0,
            isSpeaking: false,
            connectionQuality: 'EXCELLENT',
            presence: 'connected',
          }));
        }
      }
    } catch (_) {}

    this.startPresencePolling(meetingId, meetingToken);

    // 2. On serverless hosts (Vercel) skip Socket.IO entirely — REST is the only transport.
    //    This prevents the WebSocket error spam in the browser console.
    if (this.serverlessMode) {
      return { success: true, participants: restParticipants };
    }

    // 3. On localhost: attempt Socket.IO with a 1.5s timeout fallback to REST participants
    return new Promise(resolve => {
      let resolved = false;
      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve({ success: true, participants: restParticipants });
        }
      }, 1500);

      try {
        const socket = this.initSocket(meetingId, meetingToken);
        if (!socket) {
          // initSocket returned null (serverless guard triggered)
          clearTimeout(timeout);
          resolved = true;
          resolve({ success: true, participants: restParticipants });
          return;
        }
        socket.emit('meeting:join', { meetingId, meetingToken }, (ack: any) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            if (!ack?.success) {
              resolve({ success: true, participants: restParticipants });
              return;
            }
            const participants = (ack.participants || []).map((p: any) => this.mapServerParticipant(p));
            resolve({ success: true, participants: participants.length > 0 ? participants : restParticipants });
          }
        });
      } catch {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve({ success: true, participants: restParticipants });
        }
      }
    });
  }

  public leaveRoom(meetingId: string): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.socket?.emit('meeting:leave', { meetingId });
    if (this.currentMeetingToken) {
      fetch('/api/v1/meetings/signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.currentMeetingToken}`,
        },
        body: JSON.stringify({ action: 'LEAVE', meetingId }),
      }).catch(() => {});
    }
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
    if (this.currentMeetingToken) {
      fetch('/api/v1/meetings/signaling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.currentMeetingToken}`,
        },
        body: JSON.stringify({
          action: 'UPDATE_MEDIA',
          meetingId,
          ...updates,
        }),
      }).catch(() => {});
    }
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
