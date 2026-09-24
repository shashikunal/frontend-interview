/**
 * WebRTC Peer-to-Peer Mesh Service
 * Supports Direct Peer-to-Peer Audio, Video, and Screen Sharing between Host and Students/Clients
 */

import type { Socket } from 'socket.io-client';

export type StreamKind = 'camera' | 'screen';

export interface WebRTCPeerCallbacks {
  onRemoteStream: (peerUserId: string, stream: MediaStream, streamType: StreamKind) => void;
  onRemoteStreamRemoved?: (peerUserId: string, streamType: StreamKind) => void;
  onPeerConnectionStateChange?: (peerUserId: string, state: RTCPeerConnectionState) => void;
  onPeerDisconnected?: (peerUserId: string) => void;
}

interface PeerConnectionEntry {
  pc: RTCPeerConnection;
  peerUserId: string;
  peerSocketId?: string;
  cameraStream: MediaStream;
  screenStream: MediaStream;
  iceCandidateQueue: RTCIceCandidateInit[];
  isNegotiating: boolean;
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export class WebRTCPeerService {
  private socket: Socket | null = null;
  private myUserId: string = '';
  private meetingId: string = '';
  private localStream: MediaStream | null = null;
  private localScreenStream: MediaStream | null = null;
  private peers: Map<string, PeerConnectionEntry> = new Map(); // key: peerUserId
  private callbacks: WebRTCPeerCallbacks = {
    onRemoteStream: () => {},
  };
  private isDestroyed = false;

  /**
   * Initialize WebRTC Peer service with meeting context & socket
   */
  public init(
    socket: Socket,
    myUserId: string,
    meetingId: string,
    callbacks: WebRTCPeerCallbacks
  ): void {
    this.isDestroyed = false;
    this.socket = socket;
    this.myUserId = myUserId;
    this.meetingId = meetingId;
    this.callbacks = callbacks;

    this.setupSocketListeners();
  }

  /**
   * Set or update local audio/video camera stream
   */
  public setLocalStream(stream: MediaStream | null): void {
    this.localStream = stream;
    if (!stream) return;

    // Update existing peer connections with new tracks
    this.peers.forEach((peer) => {
      this.syncTracksToPeer(peer);
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
   * Create RTCPeerConnection for a remote peer
   */
  private createPeerConnection(peerUserId: string, peerSocketId?: string): PeerConnectionEntry {
    const pc = new RTCPeerConnection(ICE_SERVERS);
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
        };
        this.callbacks.onRemoteStream(peerUserId, entry.cameraStream, 'camera');
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      this.callbacks.onPeerConnectionStateChange?.(peerUserId, pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.info(`[WebRTC] Peer ${peerUserId} connection: ${pc.connectionState}`);
      }
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
   * Destroy and clean up all WebRTC peer connections
   */
  public destroy(): void {
    this.isDestroyed = true;
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
  }
}

export const webrtcPeerService = new WebRTCPeerService();
