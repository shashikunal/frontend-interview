import { describe, it, expect } from 'vitest';
import { TokenService } from '../../server/auth/tokenService';

describe('TokenService Unit Tests', () => {
  const secret = 'vitest-auth-token-secret-32chars!';
  const tokenService = new TokenService(secret);

  it('should generate meeting token and decode valid claims', () => {
    const payload = {
      meetingId: 'meet-auth-100',
      userId: 'user-cand-1',
      role: 'candidate' as const,
      name: 'Candidate One',
    };

    const result = tokenService.generateMeetingToken(payload, 300);
    expect(result.token).toBeDefined();
    expect(result.tokenId).toBeDefined();
    expect(result.expiresAt).toBeGreaterThan(Math.floor(Date.now() / 1000));

    const verify = tokenService.verifyMeetingToken(result.token);
    expect(verify.valid).toBe(true);
    expect(verify.claims?.meetingId).toBe('meet-auth-100');
    expect(verify.claims?.userId).toBe('user-cand-1');
  });

  it('should support token revocation', () => {
    const payload = {
      meetingId: 'meet-auth-200',
      userId: 'user-cand-2',
      role: 'candidate' as const,
      name: 'Candidate Two',
    };

    const { token, tokenId, expiresAt } = tokenService.generateMeetingToken(payload, 300);
    expect(tokenService.verifyMeetingToken(token).valid).toBe(true);

    tokenService.revokeToken(tokenId, expiresAt);
    const verifyRevoked = tokenService.verifyMeetingToken(token);
    expect(verifyRevoked.valid).toBe(false);
    expect(verifyRevoked.error).toContain('revoked');
  });
});
