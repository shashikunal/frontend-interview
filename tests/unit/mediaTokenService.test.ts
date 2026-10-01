import { describe, it, expect } from 'vitest';
import { MediaTokenService } from '../../server/meetings/mediaTokenService';

describe('MediaTokenService Unit Tests', () => {
  const secret = 'vitest-test-signing-secret-32b-key!';
  const service = new MediaTokenService(secret);

  it('should derive granular permissions according to meeting role', () => {
    const hostPerms = service.getPermissions('HOST');
    expect(hostPerms.canPublishAudio).toBe(true);
    expect(hostPerms.canPublishVideo).toBe(true);
    expect(hostPerms.canPublishScreen).toBe(true);
    expect(hostPerms.canModerate).toBe(true);

    const partPerms = service.getPermissions('PARTICIPANT', { allowScreenShare: false });
    expect(partPerms.canPublishAudio).toBe(true);
    expect(partPerms.canPublishVideo).toBe(true);
    expect(partPerms.canPublishScreen).toBe(false);
    expect(partPerms.canModerate).toBe(false);

    const obsPerms = service.getPermissions('OBSERVER');
    expect(obsPerms.canPublishAudio).toBe(false);
    expect(obsPerms.canPublishVideo).toBe(false);
    expect(obsPerms.canPublishScreen).toBe(false);
    expect(obsPerms.canSubscribe).toBe(true);
    expect(obsPerms.canModerate).toBe(false);
  });

  it('should generate signed WebRTC token and verify valid signature', () => {
    const generated = service.generateMediaToken({
      meetingId: 'meet-999',
      participantId: 'usr-alice',
      participantName: 'Alice Johnson',
      meetingRole: 'HOST',
      expiresInSeconds: 300,
    });

    expect(generated.token).toBeDefined();
    expect(generated.payload.meetingId).toBe('meet-999');
    expect(generated.payload.roomName).toBe('meet-room-meet-999');

    const verified = service.verifyMediaToken(generated.token);
    expect(verified.valid).toBe(true);
    expect(verified.decoded?.payload.participantId).toBe('usr-alice');
    expect(verified.decoded?.payload.permissions.canModerate).toBe(true);
  });

  it('should reject tampered or malformed tokens', () => {
    const malformed = 'not.a.valid.jwt.token';
    expect(service.verifyMediaToken(malformed).valid).toBe(false);

    const generated = service.generateMediaToken({
      meetingId: 'meet-999',
      participantId: 'usr-bob',
      participantName: 'Bob Smith',
      meetingRole: 'PARTICIPANT',
    });

    const tampered = generated.token.slice(0, -5) + 'XXXXX';
    const verified = service.verifyMediaToken(tampered);
    expect(verified.valid).toBe(false);
    expect(verified.error).toContain('Invalid media token signature');
  });

  it('should reject expired tokens', () => {
    const generated = service.generateMediaToken({
      meetingId: 'meet-expired',
      participantId: 'usr-charlie',
      participantName: 'Charlie',
      meetingRole: 'PARTICIPANT',
      expiresInSeconds: -10, // already expired
    });

    const verified = service.verifyMediaToken(generated.token);
    expect(verified.valid).toBe(false);
    expect(verified.error).toContain('expired');
  });
});
