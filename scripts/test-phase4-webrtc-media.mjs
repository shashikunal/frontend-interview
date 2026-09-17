/**
 * Test Suite: Phase 4 WebRTC + SFU Media Plane
 * Validates Media Tokens, RBAC Track Permissions, ICE Configuration,
 * Active Speaker Algorithm, Connection Quality Telemetry, and REST Media Token Endpoint.
 */

import assert from 'assert';
import { mediaTokenService } from '../server/meetings/mediaTokenService.ts';
import { meetingService } from '../server/meetings/meetingService.ts';
import { tokenService } from '../server/auth/tokenService.ts';
import { mediaRoomClientService } from '../src/features/meetings/services/mediaRoomClientService.ts';

async function runPhase4WebRtcMediaTests() {
  console.log('🧪 Starting Phase 4: WebRTC + SFU Media Plane Tests...\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ ${name}`);
      console.error(err);
      process.exit(1);
    }
  }

  async function asyncTest(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✕ ${name}`);
      console.error(err);
      process.exit(1);
    }
  }

  const adminUser = {
    id: 'usr_admin_p4',
    email: 'admin@interviewprep.com',
    name: 'Platform Admin',
    role: 'admin',
    permissions: ['admin:all'],
  };

  const candidateUser = {
    id: 'usr_cand_p4',
    email: 'marcus.wright@example.com',
    name: 'Marcus Wright',
    role: 'candidate',
    permissions: [],
  };

  // Setup: Create test meetings
  const { meeting: activeMeeting } = meetingService.createMeeting(adminUser, {
    title: 'Distributed Systems & Media Routing Masterclass',
    meetingType: 'COLLABORATIVE',
    settings: { allowScreenShare: true },
  });

  const { meeting: lockedMeeting } = meetingService.createMeeting(adminUser, {
    title: 'Restricted Keynote Presentation',
    meetingType: 'BROADCAST',
    settings: { allowScreenShare: false },
  });

  // ─── 1. MEDIA TOKEN GENERATION & PERMISSIONS ─────────────────────────────
  test('REQ-MEDIA-001: HOST is granted full audio, video, screen share, and moderation permissions', () => {
    const creds = mediaTokenService.createMediaCredentials({
      meetingId: activeMeeting.id,
      participantId: adminUser.id,
      participantName: adminUser.name,
      meetingRole: 'HOST',
      settings: activeMeeting.settings,
    });

    assert.strictEqual(creds.success, true);
    assert.strictEqual(creds.roomName, `meet-room-${activeMeeting.id}`);
    assert.strictEqual(creds.permissions.canPublishAudio, true);
    assert.strictEqual(creds.permissions.canPublishVideo, true);
    assert.strictEqual(creds.permissions.canPublishScreen, true);
    assert.strictEqual(creds.permissions.canSubscribe, true);
    assert.strictEqual(creds.permissions.canModerate, true);
    assert(creds.mediaToken);
    assert(creds.expiresAt > Date.now());
  });

  test('REQ-MEDIA-002: PARTICIPANT screen sharing obeys meeting settings', () => {
    // Meeting with screen sharing enabled
    const permAllowed = mediaTokenService.getPermissions('PARTICIPANT', { allowScreenShare: true });
    assert.strictEqual(permAllowed.canPublishAudio, true);
    assert.strictEqual(permAllowed.canPublishVideo, true);
    assert.strictEqual(permAllowed.canPublishScreen, true);
    assert.strictEqual(permAllowed.canModerate, false);

    // Meeting with screen sharing disabled
    const permDisabled = mediaTokenService.getPermissions('PARTICIPANT', { allowScreenShare: false });
    assert.strictEqual(permDisabled.canPublishAudio, true);
    assert.strictEqual(permDisabled.canPublishVideo, true);
    assert.strictEqual(permDisabled.canPublishScreen, false);
    assert.strictEqual(permDisabled.canModerate, false);
  });

  test('REQ-MEDIA-003: VIEWER is strictly forbidden from publishing any media tracks', () => {
    const creds = mediaTokenService.createMediaCredentials({
      meetingId: lockedMeeting.id,
      participantId: candidateUser.id,
      participantName: candidateUser.name,
      meetingRole: 'VIEWER',
      settings: lockedMeeting.settings,
    });

    assert.strictEqual(creds.permissions.canPublishAudio, false);
    assert.strictEqual(creds.permissions.canPublishVideo, false);
    assert.strictEqual(creds.permissions.canPublishScreen, false);
    assert.strictEqual(creds.permissions.canSubscribe, true);
    assert.strictEqual(creds.permissions.canModerate, false);
  });

  // ─── 2. TOKEN VERIFICATION & CRYPTOGRAPHIC INTEGRITY ─────────────────────
  test('REQ-MEDIA-004: Valid media token decodes with correct claims and signature', () => {
    const { token, payload } = mediaTokenService.generateMediaToken({
      meetingId: activeMeeting.id,
      participantId: candidateUser.id,
      participantName: candidateUser.name,
      meetingRole: 'PARTICIPANT',
      settings: activeMeeting.settings,
    });

    const verifyResult = mediaTokenService.verifyMediaToken(token);
    assert.strictEqual(verifyResult.valid, true);
    assert.strictEqual(verifyResult.decoded?.payload.participantId, candidateUser.id);
    assert.strictEqual(verifyResult.decoded?.payload.meetingId, activeMeeting.id);
    assert.strictEqual(verifyResult.decoded?.payload.meetingRole, 'PARTICIPANT');
  });

  test('REQ-MEDIA-005: Tampered media token signature is rejected', () => {
    const { token } = mediaTokenService.generateMediaToken({
      meetingId: activeMeeting.id,
      participantId: candidateUser.id,
      participantName: candidateUser.name,
      meetingRole: 'PARTICIPANT',
    });

    const tampered = token.slice(0, -4) + 'abcd';
    const verifyResult = mediaTokenService.verifyMediaToken(tampered);
    assert.strictEqual(verifyResult.valid, false);
    assert(verifyResult.error?.includes('signature') || verifyResult.error?.includes('failed'));
  });

  test('REQ-MEDIA-006: Expired media token is rejected', () => {
    const { token } = mediaTokenService.generateMediaToken({
      meetingId: activeMeeting.id,
      participantId: candidateUser.id,
      participantName: candidateUser.name,
      meetingRole: 'PARTICIPANT',
      expiresInSeconds: -10, // already expired
    });

    const verifyResult = mediaTokenService.verifyMediaToken(token);
    assert.strictEqual(verifyResult.valid, false);
    assert.strictEqual(verifyResult.error, 'Media token expired');
  });

  test('REQ-MEDIA-007: Generates standard WebRTC STUN/TURN ICE server configuration', () => {
    const rtcConfig = mediaTokenService.getRtcConfiguration();
    assert(Array.isArray(rtcConfig.iceServers));
    assert(rtcConfig.iceServers.length > 0);
    assert(rtcConfig.iceServers.some(s => typeof s.urls === 'string' && s.urls.includes('stun:')));
    assert.strictEqual(rtcConfig.iceTransportPolicy, 'all');
  });

  // ─── 3. ACTIVE SPEAKER & TELEMETRY ALGORITHMS ────────────────────────────
  test('REQ-MEDIA-008: Active speaker detection selects participant with highest audio energy above threshold', () => {
    const local = {
      id: 'local_user',
      name: 'Local Dev',
      isSpeaking: true,
      audioLevel: 35,
    };

    const remotes = [
      {
        id: 'peer_1',
        name: 'Peer One',
        role: 'PARTICIPANT',
        isHost: false,
        audioEnabled: true,
        videoEnabled: true,
        screenShareEnabled: false,
        audioLevel: 75,
        isSpeaking: true,
        connectionQuality: 'EXCELLENT',
      },
      {
        id: 'peer_2',
        name: 'Peer Two',
        role: 'PARTICIPANT',
        isHost: false,
        audioEnabled: true,
        videoEnabled: true,
        screenShareEnabled: false,
        audioLevel: 20,
        isSpeaking: true,
        connectionQuality: 'EXCELLENT',
      },
    ];

    const speaker = mediaRoomClientService.getDominantSpeaker(local, remotes);
    assert.strictEqual(speaker?.id, 'peer_1');
    assert.strictEqual(speaker?.name, 'Peer One');
  });

  test('REQ-MEDIA-009: Active speaker ignores participants below noise gate threshold (<= 15%)', () => {
    const local = {
      id: 'local_user',
      name: 'Local Dev',
      isSpeaking: false,
      audioLevel: 8, // Background noise
    };

    const remotes = [
      {
        id: 'peer_quiet',
        name: 'Quiet Peer',
        role: 'PARTICIPANT',
        isHost: false,
        audioEnabled: true,
        videoEnabled: true,
        screenShareEnabled: false,
        audioLevel: 12, // Below 15% threshold
        isSpeaking: false,
        connectionQuality: 'EXCELLENT',
      },
    ];

    const speaker = mediaRoomClientService.getDominantSpeaker(local, remotes);
    assert.strictEqual(speaker, null);
  });

  test('REQ-MEDIA-010: Connection quality maps RTT and packet loss into accurate quality grades', () => {
    // Excellent: RTT 45ms, 0.2% loss
    assert.strictEqual(mediaRoomClientService.calculateQuality(45, 0.2), 'EXCELLENT');

    // Good: RTT 120ms, 2% loss
    assert.strictEqual(mediaRoomClientService.calculateQuality(120, 2), 'GOOD');

    // Poor: RTT 300ms, 6% loss
    assert.strictEqual(mediaRoomClientService.calculateQuality(300, 6), 'POOR');

    // Lost: Packet loss 20%
    assert.strictEqual(mediaRoomClientService.calculateQuality(80, 20), 'LOST');

    // Lost: Extreme RTT 950ms
    assert.strictEqual(mediaRoomClientService.calculateQuality(950, 1), 'LOST');
  });

  // ─── 4. REST API: POST /api/v1/meetings/media-token ──────────────────────
  await asyncTest('REQ-MEDIA-011: POST /api/v1/meetings/media-token rejects unauthenticated requests (401)', async () => {
    const { default: handler } = await import('../api/v1/meetings/media-token.js');
    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: {},
      body: { meetingId: activeMeeting.id },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody.code, 'MISSING_TOKEN');
  });

  await asyncTest('REQ-MEDIA-012: POST /api/v1/meetings/media-token rejects non-existent meeting (404)', async () => {
    const { default: handler } = await import('../api/v1/meetings/media-token.js');

    const validMeetingToken = tokenService.generateMeetingToken({
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.name,
      userRole: 'admin',
      meetingId: 'non_existent_meeting_id',
      meetingRole: 'HOST',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${validMeetingToken}` },
      body: { meetingId: 'non_existent_meeting_id' },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 404);
    assert.strictEqual(jsonBody.code, 'MEETING_NOT_FOUND');
  });

  await asyncTest('REQ-MEDIA-013: POST /api/v1/meetings/media-token issues complete credentials for valid meeting session (200)', async () => {
    const { default: handler } = await import('../api/v1/meetings/media-token.js');

    const validMeetingToken = tokenService.generateMeetingToken({
      userId: candidateUser.id,
      userEmail: candidateUser.email,
      userName: candidateUser.name,
      userRole: 'candidate',
      meetingId: activeMeeting.id,
      meetingRole: 'PARTICIPANT',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${validMeetingToken}` },
      body: { meetingId: activeMeeting.id },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonBody.success, true);
    assert(jsonBody.mediaToken);
    assert.strictEqual(jsonBody.roomName, `meet-room-${activeMeeting.id}`);
    assert.strictEqual(jsonBody.participantId, candidateUser.id);
    assert.strictEqual(jsonBody.permissions.canPublishAudio, true);
    assert.strictEqual(jsonBody.permissions.canPublishVideo, true);
    assert.strictEqual(jsonBody.permissions.canPublishScreen, true);
    assert(Array.isArray(jsonBody.rtcConfig.iceServers));
  });

  console.log(`\n🎉 Phase 4 Test Results: All ${passed}/${total} tests PASSED with zero failures!`);
}

runPhase4WebRtcMediaTests().catch(err => {
  console.error('Phase 4 Test Suite Failed:', err);
  process.exit(1);
});
