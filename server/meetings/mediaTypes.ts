/**
 * Media Plane Domain Types & WebRTC Models
 * Phase 4: WebRTC + SFU Media Plane
 */

import type { MeetingRole } from '../auth/tokenTypes.ts';

export type MediaTrackKind = 'audio' | 'video' | 'screenshare';

export type SimulcastLayer = 'high' | 'medium' | 'low';

export type ConnectionQuality = 'EXCELLENT' | 'GOOD' | 'POOR' | 'LOST';

export type RoomConnectionState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING';

export interface MediaPermissions {
  canPublishAudio: boolean;
  canPublishVideo: boolean;
  canPublishScreen: boolean;
  canSubscribe: boolean;
  canModerate: boolean;
}

export interface MediaTokenPayload {
  meetingId: string;
  participantId: string;
  participantName: string;
  meetingRole: MeetingRole;
  permissions: MediaPermissions;
  roomName: string;
  iat: number;
  exp: number;
}

export interface DecodedMediaToken {
  header: {
    alg: 'HS256';
    typ: 'JWT';
  };
  payload: MediaTokenPayload;
  signature: string;
}

export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface RtcConfiguration {
  iceServers: IceServerConfig[];
  iceTransportPolicy?: 'all' | 'relay';
}

export interface MediaCredentialsResponse {
  success: boolean;
  mediaToken: string;
  roomName: string;
  participantId: string;
  permissions: MediaPermissions;
  rtcConfig: RtcConfiguration;
  expiresAt: number;
}
