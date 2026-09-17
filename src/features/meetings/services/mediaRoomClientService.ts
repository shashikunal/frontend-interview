/**
 * WebRTC Client Media Room Service
 * Phase 4: WebRTC + SFU Media Plane
 */

import type {
  ConnectionQuality,
  MediaCredentialsResponse,
} from '../../../../server/meetings/mediaTypes.ts';
import type {
  MeetingDevice,
  RemoteParticipant,
} from '../types/mediaRoomTypes.ts';

export class MediaRoomClientService {
  private audioContext: AudioContext | null = null;
  private analyserNode: AnalyserNode | null = null;
  private microphoneSource: MediaStreamAudioSourceNode | null = null;
  private audioLevelCheckInterval: number | null = null;

  /**
   * Request media credentials and room access token from server
   */
  public async fetchMediaCredentials(
    meetingId: string,
    meetingToken: string
  ): Promise<MediaCredentialsResponse> {
    const res = await fetch('/api/v1/meetings/media-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${meetingToken}`,
      },
      body: JSON.stringify({ meetingId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `Failed to fetch media credentials (${res.status})`);
    }

    return await res.json();
  }

  /**
   * Enumerate available media devices (audio input/output, video input)
   */
  public async enumerateDevices(): Promise<MeetingDevice[]> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      return [];
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices
        .filter(d => d.kind === 'audioinput' || d.kind === 'audiooutput' || d.kind === 'videoinput')
        .map(d => ({
          deviceId: d.deviceId,
          label: d.label || `${d.kind} (${d.deviceId.slice(0, 5)}...)`,
          kind: d.kind as 'audioinput' | 'audiooutput' | 'videoinput',
        }));
    } catch {
      return [];
    }
  }

  /**
   * Acquire local audio and video media stream
   */
  public async acquireUserMedia(options: {
    audio?: boolean | { deviceId?: string };
    video?: boolean | { deviceId?: string; width?: number; height?: number };
  }): Promise<MediaStream | null> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return null;
    }

    const constraints: MediaStreamConstraints = {
      audio: options.audio ? (typeof options.audio === 'object' && options.audio.deviceId ? { deviceId: { exact: options.audio.deviceId } } : true) : false,
      video: options.video ? (typeof options.video === 'object' && options.video.deviceId ? { deviceId: { exact: options.video.deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } }) : false,
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * Acquire local screen share media stream
   */
  public async acquireDisplayMedia(): Promise<MediaStream | null> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
      return null;
    }

    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: 'monitor',
        frameRate: { ideal: 30, max: 60 },
      },
      audio: true,
    });
  }

  /**
   * Setup real-time audio volume analyzer for active speaker detection
   */
  public setupAudioAnalyzer(
    stream: MediaStream,
    onLevelChange: (level: number) => void
  ): () => void {
    if (typeof window === 'undefined' || !(window.AudioContext || (window as any).webkitAudioContext)) {
      return () => {};
    }

    try {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return () => {};

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.5;

      this.microphoneSource = this.audioContext.createMediaStreamSource(stream);
      this.microphoneSource.connect(this.analyserNode);

      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.audioLevelCheckInterval = window.setInterval(() => {
        if (!this.analyserNode) return;

        this.analyserNode.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }

        const average = sum / bufferLength;
        // Scale 0-128 to 0-100 percentage
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        onLevelChange(normalized);
      }, 100);

      return () => {
        this.stopAudioAnalyzer();
      };
    } catch {
      return () => {};
    }
  }

  /**
   * Stop audio volume analyzer
   */
  public stopAudioAnalyzer(): void {
    if (this.audioLevelCheckInterval) {
      clearInterval(this.audioLevelCheckInterval);
      this.audioLevelCheckInterval = null;
    }

    try {
      if (this.microphoneSource) {
        this.microphoneSource.disconnect();
        this.microphoneSource = null;
      }
      if (this.analyserNode) {
        this.analyserNode.disconnect();
        this.analyserNode = null;
      }
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
        this.audioContext = null;
      }
    } catch {
      // Ignored
    }
  }

  /**
   * Calculate connection quality based on round trip time (ms) and packet loss (%)
   */
  public calculateQuality(rttMs: number, packetLossPercent: number): ConnectionQuality {
    if (packetLossPercent >= 15 || rttMs > 800) {
      return 'LOST';
    }
    if (rttMs > 220 || packetLossPercent >= 4) {
      return 'POOR';
    }
    if (rttMs > 90 || packetLossPercent >= 1.5) {
      return 'GOOD';
    }
    return 'EXCELLENT';
  }

  /**
   * Determine the dominant speaker among participants
   */
  public getDominantSpeaker(
    local: { isSpeaking: boolean; audioLevel: number; id: string; name: string },
    remotes: RemoteParticipant[]
  ): { id: string; name: string } | null {
    let topId = '';
    let topName = '';
    let maxLevel = 15; // Noise gate threshold

    if (local.isSpeaking && local.audioLevel > maxLevel) {
      topId = local.id;
      topName = local.name;
      maxLevel = local.audioLevel;
    }

    for (const p of remotes) {
      if (p.isSpeaking && p.audioLevel > maxLevel) {
        topId = p.id;
        topName = p.name;
        maxLevel = p.audioLevel;
      }
    }

    return topId ? { id: topId, name: topName } : null;
  }

  /**
   * Stop and cleanup media streams
   */
  public cleanupStream(stream: MediaStream | null): void {
    if (!stream) return;
    try {
      stream.getTracks().forEach(track => {
        track.stop();
      });
    } catch {
      // Ignored
    }
  }
}

export const mediaRoomClientService = new MediaRoomClientService();
