/**
 * WebRTC Peer-to-Peer Mesh Service
 * Supports Direct Peer-to-Peer Audio, Video, and Screen Sharing between Host and Students/Clients
 */

import type { Socket } from 'socket.io-client';

export type StreamKind = 'camera' | 'screen';

export interface WebRTCStateMetrics {
  peerUserId: string;
  signalingState: RTCSignalingState;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  iceGatheringState: RTCIceGatheringState;
  localTracks: { kind: string; id: string; label: string; enabled: boolean }[];
  remoteTracks: { kind: string; id: string; label: string }[];
  queuedIceCandidates: number;
}

export interface WebRTCPeerCallbacks {
  onRemoteStream: (peerUserId: string, stream: MediaStream, streamType: StreamKind) => void;
  onRemoteStreamRemoved?: (peerUserId: string, streamType: StreamKind) => void;
  onPeerConnectionStateChange?: (peerUserId: string, state: RTCPeerConnectionState) => void;
  onPeerDisconnected?: (peerUserId: string) => void;
  onStateTransition?: (metrics: WebRTCStateMetrics) => void;
}

interface PeerConnectionEntry {
  pc: RTCPeerConnection;
  peerUserId: string;
  peerSocketId?: string;
  cameraStream: MediaStream;
  screenStream: MediaStream;
  iceCandidateQueue: RTCIceCandidateInit[];
  isNegotiating: boolean;
  signalingState: RTCSignalingState;
  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  iceGatheringState: RTCIceGatheringState;
}

/**
 * Audit and configure STUN + TURN ICE servers (Requirement 30)
 * Uses environment variables VITE_STUN_SERVER, VITE_TURN_SERVER, VITE_TURN_USERNAME, VITE_TURN_CREDENTIAL
 */
export function getIceConfiguration(): RTCConfiguration {
  const iceServers: RTCIceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ];

  try {
    const metaEnv = (import.meta as any).env || {};
    const stunServer = metaEnv.VITE_STUN_SERVER;
    if (stunServer) {
      iceServers.unshift({ urls: stunServer });
    }

    const turnServer = metaEnv.VITE_TURN_SERVER || metaEnv.TURN_SERVER;
    const turnUsername = metaEnv.VITE_TURN_USERNAME || metaEnv.TURN_USERNAME;
    const turnCredential = metaEnv.VITE_TURN_CREDENTIAL || metaEnv.TURN_CREDENTIAL;

    if (turnServer && turnUsername && turnCredential) {
      iceServers.push({
        urls: turnServer,
        username: turnUsername,
        credential: turnCredential,
      });
    }
  } catch (_) {}

  return {
    iceServers,
    iceCandidatePoolSize: 10,
  };
}

export class WebRTCPeerService {
  private socket: Socket | null = null;
  private myUserId: string = '';
  private meetingId: string = '';
  private tabSessionId: string = '';
  private localStream: MediaStream | null = null;
  private localScreenStream: MediaStream | null = null;
  private peers: Map<string, PeerConnectionEntry> = new Map(); // key: peerUserId
  private callbacks: WebRTCPeerCallbacks = {
    onRemoteStream: () => {},
  };
  private isDestroyed = false;
  private lastSignalingEvent: { type: string; timestamp: string; details?: any } | null = null;

  /**
   * Initialize WebRTC Peer service with meeting context & socket
   */
  public init(
    socket: Socket,
    myUserId: string,
    meetingId: string,
    callbacks: WebRTCPeerCallbacks,
    tabSessionId?: string
  ): void {
    this.isDestroyed = false;
    this.socket = socket;
    this.myUserId = myUserId;
    this.meetingId = meetingId;
    this.callbacks = callbacks;
    this.tabSessionId = tabSessionId || (typeof sessionStorage !== 'undefined' ? (sessionStorage.getItem('webrtc_tab_id') || `tab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`) : 'tab_main');
    if (typeof sessionStorage !== 'undefined') {
      try { sessionStorage.setItem('webrtc_tab_id', this.tabSessionId); } catch (_) {}
    }

    this.setupSocketListeners();
  }

  /**
   * Get diagnostics metrics for a specific peer
   */
  public getMetricsForPeer(entry: PeerConnectionEntry): WebRTCStateMetrics {
    const localTracks = (this.localStream?.getTracks() || []).map((t) => ({
      kind: t.kind,
      id: t.id,
      label: t.label,
      enabled: t.enabled,
    }));

    const remoteTracks = [
      ...entry.cameraStream.getTracks(),
      ...entry.screenStream.getTracks(),
    ].map((t) => ({
      kind: t.kind,
      id: t.id,
      label: t.label,
    }));

    return {
      peerUserId: entry.peerUserId,
      signalingState: entry.pc.signalingState,
      connectionState: entry.pc.connectionState,
      iceConnectionState: entry.pc.iceConnectionState,
      iceGatheringState: entry.pc.iceGatheringState,
      localTracks,
      remoteTracks,
      queuedIceCandidates: entry.iceCandidateQueue.length,
    };
  }

  /**
   * Public diagnostic inspector for Requirement 42 (Observability)
   */
  public getPeerDiagnostics() {
    return {
      meetingId: this.meetingId,
      myUserId: this.myUserId,
      tabSessionId: this.tabSessionId,
      socketConnected: Boolean(this.socket?.connected),
      socketId: this.socket?.id || null,
      peerCount: this.peers.size,
      peers: Array.from(this.peers.values()).map((p) => this.getMetricsForPeer(p)),
      lastSignalingEvent: this.lastSignalingEvent,
      localStreamActive: Boolean(this.localStream && this.localStream.active),
      localScreenStreamActive: Boolean(this.localScreenStream && this.localScreenStream.active),
    };
  }

  /**
   * Set or update local audio/video camera stream
   */
  public setLocalStream(stream: MediaStream | null): void {
    this.localStream = stream;
    if (!stream) return;

    // Update existing peer connections with new tracks and renegotiate
    this.peers.forEach((peer) => {
      this.syncTracksToPeer(peer);
      if (peer.pc.signalingState === 'stable') {
        this.renegotiateWithPeer(peer, 'camera');
      }
    });
  }

  /**
   * Set or update local screen sharing stream
   */
  public setLocalScreenStream(screenStream: MediaStream | null): void {
    const wasSharing = !!this.localScreenStream;
    this.localScreenStream = screenStream;

    this.peers.forEach((peer) => {
      if (screenStream) {
        // Add screen tracks
        screenStream.getTracks().forEach((track) => {
          const senders = peer.pc.getSenders();
          const exists = senders.some((s) => s.track?.id === track.id);
          if (!exists) {
            peer.pc.addTrack(track, screenStream);
          }
        });
        // Renegotiate
        this.renegotiateWithPeer(peer, 'screen');
      } else if (wasSharing) {
        // Remove screen track senders
        const senders = peer.pc.getSenders();
        senders.forEach((sender) => {
          if (sender.track && sender.track.kind === 'video' && sender.track.label.toLowerCase().includes('screen')) {
            try {
              peer.pc.removeTrack(sender);
            } catch (_) {}
          }
        });
        this.renegotiateWithPeer(peer, 'media');
      }
    });

    if (this.socket && this.socket.connected) {
      this.socket.emit('meeting:webrtc:renegotiate', {
        meetingId: this.meetingId,
        streamType: screenStream ? 'screen' : 'media',
      });
    }
  }

  /**
   * Connect to a specific peer (initiates WebRTC offer)
   */
  public async connectToPeer(targetUserId: string, targetSocketId?: string): Promise<void> {
    if (targetUserId === this.myUserId || this.isDestroyed) return;

    let peer = this.peers.get(targetUserId);
    if (!peer) {
      peer = this.createPeerConnection(targetUserId, targetSocketId);
      this.peers.set(targetUserId, peer);
    } else if (targetSocketId) {
      peer.peerSocketId = targetSocketId;
    }

    this.syncTracksToPeer(peer);

    try {
      if (peer.pc.signalingState !== 'stable') return;
      peer.isNegotiating = true;
      const offer = await peer.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await peer.pc.setLocalDescription(offer);

      this.socket?.emit('meeting:webrtc:offer', {
        meetingId: this.meetingId,
        targetUserId,
        targetSocketId: peer.peerSocketId,
        offer,
        streamType: this.localScreenStream ? 'screen' : 'camera',
      });
    } catch (err) {
      console.warn('[WebRTC] Failed to create offer for peer:', targetUserId, err);
      peer.isNegotiating = false;
    }
  }

  /**
   * Create RTCPeerConnection for a remote peer with 3-tier state machine (Requirements 27 & 30)
   */
  private createPeerConnection(peerUserId: string, peerSocketId?: string): PeerConnectionEntry {
    const pc = new RTCPeerConnection(getIceConfiguration());
    const cameraStream = new MediaStream();
    const screenStream = new MediaStream();

    const entry: PeerConnectionEntry = {
      pc,
      peerUserId,
      peerSocketId,
      cameraStream,
      screenStream,
      iceCandidateQueue: [],
      isNegotiating: false,
      signalingState: pc.signalingState,
      connectionState: pc.connectionState,
      iceConnectionState: pc.iceConnectionState,
      iceGatheringState: pc.iceGatheringState,
    };

    const notifyTransition = () => {
      entry.signalingState = pc.signalingState;
      entry.connectionState = pc.connectionState;
      entry.iceConnectionState = pc.iceConnectionState;
      entry.iceGatheringState = pc.iceGatheringState;
      this.callbacks.onStateTransition?.(this.getMetricsForPeer(entry));
    };

    // Explicit State Machine Listeners (Requirement 27)
    pc.onsignalingstatechange = () => {
      notifyTransition();
    };

    pc.onconnectionstatechange = () => {
      this.callbacks.onPeerConnectionStateChange?.(peerUserId, pc.connectionState);
      notifyTransition();
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.info(`[WebRTC] Peer ${peerUserId} connection: ${pc.connectionState}`);
      }
    };

    pc.oniceconnectionstatechange = () => {
      notifyTransition();
    };

    pc.onicegatheringstatechange = () => {
      notifyTransition();
    };

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate && this.socket?.connected) {
        this.socket.emit('meeting:webrtc:ice-candidate', {
          meetingId: this.meetingId,
          targetUserId: peerUserId,
          targetSocketId: entry.peerSocketId,
          candidate: event.candidate.toJSON(),
        });
      }
    };

    // Incoming Media Track handler
    pc.ontrack = (event) => {
      const track = event.track;
      const streams = event.streams;
      const stream = streams[0];

      // Check if track is screen share based on stream ID, track label, or if second video track
      const isScreenTrack =
        (stream && (stream.id.toLowerCase().includes('screen') || stream.id.toLowerCase().includes('display'))) ||
        track.label.toLowerCase().includes('screen') ||
        track.label.toLowerCase().includes('display') ||
        track.label.toLowerCase().includes('window');

      if (isScreenTrack) {
        if (!entry.screenStream.getTracks().some((t) => t.id === track.id)) {
          entry.screenStream.addTrack(track);
        }
        track.onended = () => {
          try {
            entry.screenStream.removeTrack(track);
            this.callbacks.onRemoteStreamRemoved?.(peerUserId, 'screen');
          } catch (_) {}
          notifyTransition();
        };
        this.callbacks.onRemoteStream(peerUserId, entry.screenStream, 'screen');
      } else {
        if (!entry.cameraStream.getTracks().some((t) => t.id === track.id)) {
          entry.cameraStream.addTrack(track);
        }
        track.onended = () => {
          try {
            entry.cameraStream.removeTrack(track);
          } catch (_) {}
          notifyTransition();
        };
        this.callbacks.onRemoteStream(peerUserId, entry.cameraStream, 'camera');
      }
      notifyTransition();
    };

    return entry;
  }

  /**
   * Sync active local tracks to a peer connection
   */
  private syncTracksToPeer(peer: PeerConnectionEntry): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        const senders = peer.pc.getSenders();
        const existingSender = senders.find((s) => s.track?.kind === track.kind);

        if (existingSender) {
          if (existingSender.track !== track) {
            existingSender.replaceTrack(track).catch(() => {});
          }
        } else {
          try {
            peer.pc.addTrack(track, this.localStream!);
          } catch (_) {}
        }
      });
    }

    if (this.localScreenStream) {
      this.localScreenStream.getTracks().forEach((track) => {
        const senders = peer.pc.getSenders();
        const exists = senders.some((s) => s.track?.id === track.id);
        if (!exists) {
          try {
            peer.pc.addTrack(track, this.localScreenStream!);
          } catch (_) {}
        }
      });
    }
  }

  /**
   * Renegotiate with a peer connection
   */
  private async renegotiateWithPeer(peer: PeerConnectionEntry, streamType: StreamKind | 'media'): Promise<void> {
    try {
      if (peer.pc.signalingState !== 'stable') return;
      peer.isNegotiating = true;
      const offer = await peer.pc.createOffer();
      await peer.pc.setLocalDescription(offer);

      this.socket?.emit('meeting:webrtc:offer', {
        meetingId: this.meetingId,
        targetUserId: peer.peerUserId,
        targetSocketId: peer.peerSocketId,
        offer,
        streamType,
      });
    } catch (err) {
      console.warn('[WebRTC] Renegotiation error with peer:', peer.peerUserId, err);
    } finally {
      peer.isNegotiating = false;
    }
  }

  /**
   * Handle incoming remote offer
   */
  private async handleRemoteOffer(data: {
    senderSocketId: string;
    senderUserId: string;
    senderName?: string;
    offer: RTCSessionDescriptionInit;
    streamType?: string;
  }): Promise<void> {
    const { senderUserId, senderSocketId, offer } = data;
    if (senderUserId === this.myUserId || this.isDestroyed) return;

    let peer = this.peers.get(senderUserId);
    if (!peer) {
      peer = this.createPeerConnection(senderUserId, senderSocketId);
      this.peers.set(senderUserId, peer);
    } else {
      peer.peerSocketId = senderSocketId;
    }

    this.syncTracksToPeer(peer);

    const isOfferCollision = peer.isNegotiating || peer.pc.signalingState !== 'stable';
    const isPolite = this.myUserId < senderUserId;

    if (isOfferCollision) {
      if (!isPolite) {
        return; // Impolite peer ignores offer collision
      }
      try {
        await peer.pc.setLocalDescription({ type: 'rollback' });
      } catch (_) {}
    }

    this.lastSignalingEvent = {
      type: 'INCOMING_OFFER',
      timestamp: new Date().toISOString(),
      details: { senderUserId, streamType: data.streamType },
    };

    try {
      await peer.pc.setRemoteDescription(new RTCSessionDescription(offer));

      // Drain queued ICE candidates
      while (peer.iceCandidateQueue.length > 0) {
        const candidate = peer.iceCandidateQueue.shift();
        if (candidate) {
          await peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
        }
      }

      const answer = await peer.pc.createAnswer();
      await peer.pc.setLocalDescription(answer);

      this.socket?.emit('meeting:webrtc:answer', {
        meetingId: this.meetingId,
        targetUserId: senderUserId,
        targetSocketId: senderSocketId,
        answer,
      });

      this.lastSignalingEvent = {
        type: 'OUTGOING_ANSWER',
        timestamp: new Date().toISOString(),
        details: { targetUserId: senderUserId },
      };
    } catch (err) {
      console.warn('[WebRTC] Error handling offer from peer:', senderUserId, err);
    }
  }

  /**
   * Handle incoming remote answer
   */
  private async handleRemoteAnswer(data: {
    senderSocketId: string;
    senderUserId: string;
    answer: RTCSessionDescriptionInit;
  }): Promise<void> {
    const { senderUserId, answer } = data;
    const peer = this.peers.get(senderUserId);
    if (!peer) return;

    this.lastSignalingEvent = {
      type: 'INCOMING_ANSWER',
      timestamp: new Date().toISOString(),
      details: { senderUserId },
    };

    try {
      if (peer.pc.signalingState !== 'stable') {
        await peer.pc.setRemoteDescription(new RTCSessionDescription(answer));

        // Drain queued ICE candidates
        while (peer.iceCandidateQueue.length > 0) {
          const candidate = peer.iceCandidateQueue.shift();
          if (candidate) {
            await peer.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn('[WebRTC] Error handling answer from peer:', senderUserId, err);
    } finally {
      peer.isNegotiating = false;
    }
  }

  /**
   * Handle incoming remote ICE Candidate
   */
  private async handleRemoteCandidate(data: {
    senderUserId: string;
    candidate: RTCIceCandidateInit;
  }): Promise<void> {
    const { senderUserId, candidate } = data;
    const peer = this.peers.get(senderUserId);
    if (!peer) return;

    this.lastSignalingEvent = {
      type: 'INCOMING_ICE_CANDIDATE',
      timestamp: new Date().toISOString(),
      details: { senderUserId, sdpMid: candidate.sdpMid },
    };

    if (peer.pc.remoteDescription && peer.pc.remoteDescription.type) {
      try {
        await peer.pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.warn('[WebRTC] Failed to add ICE candidate:', err);
      }
    } else {
      peer.iceCandidateQueue.push(candidate);
    }
  }

  /**
   * Setup socket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('meeting:webrtc:offer', (data: any) => {
      this.handleRemoteOffer(data);
    });

    this.socket.on('meeting:webrtc:answer', (data: any) => {
      this.handleRemoteAnswer(data);
    });

    this.socket.on('meeting:webrtc:ice-candidate', (data: any) => {
      this.handleRemoteCandidate(data);
    });

    this.socket.on('meeting:webrtc:renegotiate', (data: any) => {
      if (data.senderUserId !== this.myUserId) {
        const peer = this.peers.get(data.senderUserId);
        if (peer) {
          this.renegotiateWithPeer(peer, data.streamType || 'media');
        }
      }
    });

    this.socket.on('meeting:participant:left', (data: any) => {
      this.closePeer(data.userId);
    });

    this.socket.on('meeting:participant:removed', (data: any) => {
      this.closePeer(data.targetUserId);
    });
  }

  /**
   * Close a specific peer connection
   */
  public closePeer(peerUserId: string): void {
    const peer = this.peers.get(peerUserId);
    if (peer) {
      peer.cameraStream.getTracks().forEach((t) => t.stop());
      peer.screenStream.getTracks().forEach((t) => t.stop());
      try {
        peer.pc.close();
      } catch (_) {}
      this.peers.delete(peerUserId);
      this.callbacks.onPeerDisconnected?.(peerUserId);
    }
  }

  /**
   * Destroy and clean up all WebRTC peer connections and socket listeners
   */
  public destroy(): void {
    this.isDestroyed = true;
    if (this.socket) {
      this.socket.off('meeting:webrtc:offer');
      this.socket.off('meeting:webrtc:answer');
      this.socket.off('meeting:webrtc:ice-candidate');
      this.socket.off('meeting:webrtc:renegotiate');
      this.socket.off('meeting:participant:left');
      this.socket.off('meeting:participant:removed');
    }
    this.peers.forEach((peer) => {
      peer.cameraStream.getTracks().forEach((t) => t.stop());
      peer.screenStream.getTracks().forEach((t) => t.stop());
      try {
        peer.pc.close();
      } catch (_) {}
    });
    this.peers.clear();
    this.localStream = null;
    this.localScreenStream = null;
    this.socket = null;
  }
}

export const webrtcPeerService = new WebRTCPeerService();
