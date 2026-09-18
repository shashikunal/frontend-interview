/**
 * Media Token & Credentials Service
 * Phase 4: WebRTC + SFU Media Plane
 */

import crypto from 'node:crypto';
import type { MeetingRole } from '../auth/tokenTypes.ts';
import type { MeetingSettings } from './meetingTypes.ts';
import type {
  MediaPermissions,
  MediaTokenPayload,
  DecodedMediaToken,
  RtcConfiguration,
  MediaCredentialsResponse,
} from './mediaTypes.ts';

const MEDIA_SECRET = process.env.MEDIA_JWT_SECRET || 'phase4-webrtc-sfu-super-secret-key-32b';
const DEFAULT_EXPIRATION_SECONDS = 1800; // 30 minutes

const DEFAULT_ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export class MediaTokenService {
  private secret: string;

  constructor(secret: string = MEDIA_SECRET) {
    this.secret = secret;
  }

  /**
   * Derive granular media publishing permissions based on meeting role and meeting settings
   */
  public getPermissions(role: MeetingRole, settings?: Partial<MeetingSettings>): MediaPermissions {
    const allowScreenShare = settings?.allowScreenShare !== false;

    switch (role) {
      case 'HOST':
      case 'CO_HOST':
        return {
          canPublishAudio: true,
          canPublishVideo: true,
          canPublishScreen: true,
          canSubscribe: true,
          canModerate: true,
        };
      case 'PARTICIPANT':
        return {
          canPublishAudio: true,
          canPublishVideo: true,
          canPublishScreen: allowScreenShare,
          canSubscribe: true,
          canModerate: false,
        };
      case 'OBSERVER':
      default:
        return {
          canPublishAudio: false,
          canPublishVideo: false,
          canPublishScreen: false,
          canSubscribe: true,
          canModerate: false,
        };
    }
  }

  /**
   * Generates a signed WebRTC Media Token
   */
  public generateMediaToken(params: {
    meetingId: string;
    participantId: string;
    participantName: string;
    meetingRole: MeetingRole;
    settings?: Partial<MeetingSettings>;
    expiresInSeconds?: number;
  }): { token: string; payload: MediaTokenPayload; expiresAt: number } {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + (params.expiresInSeconds || DEFAULT_EXPIRATION_SECONDS);
    const permissions = this.getPermissions(params.meetingRole, params.settings);

    const payload: MediaTokenPayload = {
      meetingId: params.meetingId,
      participantId: params.participantId,
      participantName: params.participantName,
      meetingRole: params.meetingRole,
      permissions,
      roomName: `meet-room-${params.meetingId}`,
      iat: now,
      exp,
    };

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', this.secret)
      .update(signatureInput)
      .digest('base64url');

    const token = `${signatureInput}.${signature}`;

    return {
      token,
      payload,
      expiresAt: exp * 1000,
    };
  }

  /**
   * Verifies and decodes a signed WebRTC Media Token
   */
  public verifyMediaToken(token: string): { valid: boolean; decoded?: DecodedMediaToken; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Malformed media token format' };
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      const signatureInput = `${encodedHeader}.${encodedPayload}`;

      const expectedSignature = crypto
        .createHmac('sha256', this.secret)
        .update(signatureInput)
        .digest('base64url');

      const expectedBuf = Buffer.from(expectedSignature, 'utf-8');
      const actualBuf = Buffer.from(signature, 'utf-8');

      if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        return { valid: false, error: 'Invalid media token signature' };
      }

      const header = JSON.parse(Buffer.from(encodedHeader, 'base64url').toString('utf-8'));
      const payload: MediaTokenPayload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));

      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        return { valid: false, error: 'Media token expired' };
      }

      return {
        valid: true,
        decoded: {
          header,
          payload,
          signature,
        },
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Media token verification failed' };
    }
  }

  /**
   * Generates standard WebRTC STUN/TURN ICE configuration
   */
  public getRtcConfiguration(): RtcConfiguration {
    return {
      iceServers: DEFAULT_ICE_SERVERS,
      iceTransportPolicy: 'all',
    };
  }

  /**
   * Creates complete media credentials response for client room join
   */
  public createMediaCredentials(params: {
    meetingId: string;
    participantId: string;
    participantName: string;
    meetingRole: MeetingRole;
    settings?: Partial<MeetingSettings>;
  }): MediaCredentialsResponse {
    const { token, payload, expiresAt } = this.generateMediaToken(params);
    const rtcConfig = this.getRtcConfiguration();

    return {
      success: true,
      mediaToken: token,
      roomName: payload.roomName,
      participantId: payload.participantId,
      permissions: payload.permissions,
      rtcConfig,
      expiresAt,
    };
  }
}

export const mediaTokenService = new MediaTokenService();
