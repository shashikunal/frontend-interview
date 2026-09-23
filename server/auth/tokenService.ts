/**
 * Cryptographic Token Service (HMAC-SHA256 JWT)
 * Phase 1: Authentication & Token Security
 * Zero external dependencies: Uses Node.js native crypto module
 */

import crypto from 'crypto';
import type {
  MeetingTokenPayload,
  DecodedMeetingToken,
  TokenVerificationResult,
} from './tokenTypes.ts';

// Default master secret from environment or cryptographically stable fallback
const JWT_SECRET =
  process.env.JWT_SIGNING_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'interviewprep_production_realtime_collaboration_jwt_secret_2026_super_secure';

const JWT_ISSUER = 'interviewprep-control-plane';
const JWT_AUDIENCE = 'interviewprep-meet-realtime';

// Base64URL encoding / decoding helpers
function base64UrlEncode(data: string | Buffer): string {
  const buf = typeof data === 'string' ? Buffer.from(data, 'utf8') : data;
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf8');
}

export class TokenService {
  private secret: string;
  private revokedTokens: Map<string, number> = new Map(); // jti -> expiry epoch seconds
  private refreshTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor(secret = JWT_SECRET) {
    this.secret = secret;
    if (typeof setInterval !== 'undefined') {
      const timer: any = setInterval(() => this.cleanupRevocationList(), 5 * 60 * 1000);
      if (typeof timer?.unref === 'function') {
        timer.unref();
      }
    }
  }

  /**
   * Generates a signed, short-lived JWT for accessing meetings and WebSockets
   * Default validity: 300 seconds (5 minutes)
   */
  public generateMeetingToken(
    payload: MeetingTokenPayload,
    expiresInSeconds = 300,
    customSecret?: string
  ): { token: string; tokenId: string; expiresAt: number } {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expiresInSeconds;
    const jti = crypto.randomUUID();

    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    const claims: DecodedMeetingToken = {
      ...payload,
      jti,
      iat: now,
      exp,
      iss: JWT_ISSUER,
      aud: JWT_AUDIENCE,
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(claims));
    const signingInput = `${encodedHeader}.${encodedPayload}`;

    const signature = crypto
      .createHmac('sha256', customSecret || this.secret)
      .update(signingInput)
      .digest();

    const encodedSignature = base64UrlEncode(signature);
    const token = `${signingInput}.${encodedSignature}`;

    return { token, tokenId: jti, expiresAt: exp };
  }

  private userRevocations: Map<string, number> = new Map(); // userId -> revoked before epoch seconds

  /**
   * Verifies an incoming JWT with constant-time signature validation and revocation checks
   */
  public verifyMeetingToken(
    token: string,
    customSecret?: string
  ): TokenVerificationResult {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Token is missing or not a string', errorCode: 'MALFORMED' };
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Malformed token structure', errorCode: 'MALFORMED' };
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    try {
      // 1. Strictly Validate Header (Prevent alg: "none" attacks)
      const headerJson = base64UrlDecode(encodedHeader);
      let header: any;
      try {
        header = JSON.parse(headerJson);
      } catch {
        return { valid: false, error: 'Invalid token header format', errorCode: 'MALFORMED' };
      }

      if (!header || typeof header !== 'object') {
        return { valid: false, error: 'Malformed token header', errorCode: 'MALFORMED' };
      }

      if (header.alg !== 'HS256') {
        return {
          valid: false,
          error: `Unsupported signing algorithm '${header.alg}'. Only HS256 is permitted.`,
          errorCode: 'UNSUPPORTED_ALGORITHM',
        };
      }

      if (header.typ && header.typ !== 'JWT') {
        return { valid: false, error: 'Invalid token type', errorCode: 'INVALID_TOKEN_TYPE' };
      }

      const signingInput = `${encodedHeader}.${encodedPayload}`;
      const expectedSignature = crypto
        .createHmac('sha256', customSecret || this.secret)
        .update(signingInput)
        .digest();

      let incomingSignature: Buffer;
      try {
        let b64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        incomingSignature = Buffer.from(b64, 'base64');
      } catch {
        return { valid: false, error: 'Invalid signature encoding', errorCode: 'INVALID_SIGNATURE' };
      }

      // Constant-time signature comparison to prevent timing side-channel attacks
      if (
        incomingSignature.length !== expectedSignature.length ||
        !crypto.timingSafeEqual(incomingSignature, expectedSignature)
      ) {
        return { valid: false, error: 'Invalid token signature', errorCode: 'INVALID_SIGNATURE' };
      }

      // Parse payload claims
      const claimsJson = base64UrlDecode(encodedPayload);
      const claims: DecodedMeetingToken = JSON.parse(claimsJson);

      const now = Math.floor(Date.now() / 1000);

      // Check Expiration
      if (claims.exp && claims.exp < now) {
        return { valid: false, error: 'Token has expired', errorCode: 'EXPIRED', claims };
      }

      // Check Revocation Blacklist (Token-level)
      if (this.revokedTokens.has(claims.jti)) {
        return { valid: false, error: 'Token has been revoked', errorCode: 'REVOKED' };
      }

      // Check User-level Revocation (Logout-all / Suspension)
      if (claims.userId && this.userRevocations.has(claims.userId)) {
        const revokedBefore = this.userRevocations.get(claims.userId)!;
        if (claims.iat <= revokedBefore) {
          return { valid: false, error: 'Session revoked due to user logout or suspension', errorCode: 'REVOKED' };
        }
      }

      // Check Audience and Issuer
      if (claims.iss !== JWT_ISSUER || claims.aud !== JWT_AUDIENCE) {
        return { valid: false, error: 'Invalid token issuer or audience', errorCode: 'UNAUTHORIZED' };
      }

      return { valid: true, claims };
    } catch (err: any) {
      return { valid: false, error: err?.message || 'Token verification error', errorCode: 'MALFORMED' };
    }
  }

  /**
   * Explicitly revokes a token by its unique jti
   */
  public revokeToken(jti: string, expiresAt: number): void {
    if (!jti) return;
    this.revokedTokens.set(jti, expiresAt);
  }

  /**
   * Revokes all active sessions for a user (e.g., password reset, suspension, logout-all)
   */
  public revokeAllUserTokens(userId: string): void {
    if (!userId) return;
    this.userRevocations.set(userId, Math.floor(Date.now() / 1000));
  }

  /**
   * Issue a high-entropy cryptographically secure refresh token
   */
  public generateRefreshToken(userId: string, expiresInSeconds = 7 * 24 * 3600): string {
    const rawBytes = crypto.randomBytes(48).toString('hex');
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    this.refreshTokens.set(rawBytes, { userId, expiresAt });
    return rawBytes;
  }

  /**
   * Rotate a single-use refresh token (detects reuse & prevents replay attacks)
   */
  public rotateRefreshToken(
    oldToken: string,
    expiresInSeconds = 7 * 24 * 3600
  ): { valid: boolean; userId?: string; newRefreshToken?: string; error?: string } {
    const record = this.refreshTokens.get(oldToken);
    if (!record) {
      return { valid: false, error: 'Invalid or already used refresh token' };
    }

    const now = Math.floor(Date.now() / 1000);
    // Invalidate old token immediately (single-use guarantee)
    this.refreshTokens.delete(oldToken);

    if (record.expiresAt < now) {
      return { valid: false, error: 'Refresh token has expired' };
    }

    // Issue newly rotated token
    const newRefreshToken = this.generateRefreshToken(record.userId, expiresInSeconds);
    return { valid: true, userId: record.userId, newRefreshToken };
  }

  private cleanupRevocationList(): void {
    const now = Math.floor(Date.now() / 1000);
    for (const [jti, exp] of this.revokedTokens.entries()) {
      if (exp < now) {
        this.revokedTokens.delete(jti);
      }
    }
    for (const [token, data] of this.refreshTokens.entries()) {
      if (data.expiresAt < now) {
        this.refreshTokens.delete(token);
      }
    }
  }
}

export const tokenService = new TokenService();
