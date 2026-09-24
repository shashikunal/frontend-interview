/**
 * Client Media Room Domain Types & State Models
 * Phase 4: WebRTC + SFU Media Plane
 */

import type { ConnectionQuality, MediaPermissions, RoomConnectionState } from '../../../../server/meetings/mediaTypes.ts';
import type { MeetingRole } from '../../../../server/auth/tokenTypes.ts';

export type { ConnectionQuality, MediaPermissions, RoomConnectionState };

export type MeetingRoomLayoutMode = 'GRID' | 'SPEAKER_SPOTLIGHT' | 'SCREEN_SHARE_FOCUS';

export interface MeetingDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
}

export interface LocalMediaState {
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  audioInputDeviceId: string;
  videoInputDeviceId: string;
  audioOutputDeviceId: string;
  audioLevel: number; // 0 to 100
  stream: MediaStream | null;
  screenStream: MediaStream | null;
  connectionQuality: ConnectionQuality;
  connectionState: RoomConnectionState;
}

export interface RemoteParticipant {
  id: string;
  socketId?: string;
  name: string;
  role: MeetingRole;
  isHost: boolean;
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenShareEnabled: boolean;
  audioLevel: number; // 0 to 100
  isSpeaking: boolean;
  connectionQuality: ConnectionQuality;
  avatarUrl?: string;
  stream?: MediaStream | null;
  screenStream?: MediaStream | null;
  // Phase 16: Advanced Collaboration
  handRaised?: boolean;
  handRaisedAt?: string;
  recentReaction?: { emoji: string; reactionId: string; timestamp: number };
  presence?: 'online' | 'joining' | 'connected' | 'reconnecting' | 'disconnected' | 'left';
  joinedAt?: string;
}

export interface EphemeralReactionEvent {
  meetingId: string;
  reactionId: string;
  userId: string;
  userName: string;
  emoji: string;
  timestamp: number;
}

export interface MediaRoomSession {
  meetingId: string;
  roomName: string;
  participantId: string;
  participantName: string;
  meetingRole: MeetingRole;
  permissions: MediaPermissions;
  mediaToken: string;
  connectedAt: number;
}
