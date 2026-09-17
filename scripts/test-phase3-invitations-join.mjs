import assert from 'assert';
import { meetingService } from '../server/meetings/meetingService.ts';
import { invitationService } from '../server/meetings/invitationService.ts';
import { tokenService } from '../server/auth/tokenService.ts';

async function runPhase3InvitationsJoinTests() {
  console.log('🧪 Starting Phase 3: Meeting Invitations & Secure Join Pipeline Tests...\n');
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
    id: 'usr_admin_p3',
    email: 'admin@interviewprep.com',
    name: 'Platform Admin',
    role: 'admin',
    permissions: ['admin:all'],
  };

  const candidateInvited = {
    id: 'usr_cand_invited',
    email: 'sarah.connor@example.com',
    name: 'Sarah Connor',
    role: 'candidate',
    permissions: [],
  };

  const candidateUninvited = {
    id: 'usr_cand_stranger',
    email: 'stranger@example.com',
    name: 'Unknown User',
    role: 'candidate',
    permissions: [],
  };

  // Setup: Create an active test meeting
  const { meeting } = meetingService.createMeeting(adminUser, {
    title: 'Distributed Consensus & Raft Meeting',
    meetingType: 'INTERVIEW',
  });
  const meetingId = meeting.id;

  // ─── 1. REQ-INV-001: INVITATION CREATION & RBAC ──────────────────────────
  test('REQ-INV-001: Admin creates invitation with hashed token and expiration', () => {
    const res = invitationService.createInvitation(adminUser, {
      meetingId,
      inviteeEmail: candidateInvited.email,
      inviteeName: candidateInvited.name,
      assignedRole: 'PARTICIPANT',
      expiresInHours: 24,
    });

    assert.strictEqual(res.success, true);
    assert(res.invitation, 'Invitation record must exist');
    assert(res.rawInviteToken, 'Raw high-entropy token must be generated');
    assert(res.invitation.inviteTokenHash, 'Hash must be stored, not raw token');
    assert.strictEqual(res.invitation.status, 'PENDING');
    assert.strictEqual(res.invitation.inviteeEmail, candidateInvited.email);
  });

  test('REQ-INV-001: Non-admin candidate cannot create invitations (403 Forbidden)', () => {
    const res = invitationService.createInvitation(candidateUninvited, {
      meetingId,
      inviteeEmail: 'friend@example.com',
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'FORBIDDEN');
  });

  test('REQ-INV-001: Invalid email is rejected with 400 INVALID_EMAIL', () => {
    const res = invitationService.createInvitation(adminUser, {
      meetingId,
      inviteeEmail: 'invalid-email-format',
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'INVALID_EMAIL');
  });

  // ─── 2. REQ-INV-002: SECURE JOIN VALIDATION PIPELINE ─────────────────────
  test('REQ-INV-002: Host/Admin can join meeting automatically without token', () => {
    const joinRes = invitationService.validateJoin(adminUser, meetingId);

    assert.strictEqual(joinRes.success, true);
    assert.strictEqual(joinRes.meetingRole, 'HOST');
    assert(joinRes.meetingToken, 'Must receive signed meeting token');

    // Verify token validity
    const verify = tokenService.verifyMeetingToken(joinRes.meetingToken);
    assert.strictEqual(verify.valid, true);
    assert.strictEqual(verify.claims?.meetingRole, 'HOST');
  });

  test('REQ-INV-002: Candidate joins successfully with valid raw invite token', () => {
    const inviteRes = invitationService.createInvitation(adminUser, {
      meetingId,
      inviteeEmail: 'token.joiner@example.com',
      assignedRole: 'PARTICIPANT',
    });

    const candidateUser = {
      id: 'usr_cand_token_joiner',
      email: 'token.joiner@example.com',
      name: 'Token Joiner',
      role: 'candidate',
      permissions: [],
    };

    const joinRes = invitationService.validateJoin(candidateUser, meetingId, inviteRes.rawInviteToken);

    assert.strictEqual(joinRes.success, true);
    assert.strictEqual(joinRes.meetingRole, 'PARTICIPANT');
    assert(joinRes.meetingToken);
    assert(joinRes.expiresAt > Math.floor(Date.now() / 1000));
  });

  test('REQ-INV-002: Uninvited candidate without token is rejected with 403 UNAUTHORIZED_MEETING_ACCESS', () => {
    const joinRes = invitationService.validateJoin(candidateUninvited, meetingId);

    assert.strictEqual(joinRes.success, false);
    assert.strictEqual(joinRes.code, 'UNAUTHORIZED_MEETING_ACCESS');
    assert(joinRes.error.includes('permission to join this private meeting'));
  });

  test('REQ-INV-002: Joining non-existent meeting returns 404 MEETING_NOT_FOUND', () => {
    const joinRes = invitationService.validateJoin(adminUser, 'meet_does_not_exist_404');

    assert.strictEqual(joinRes.success, false);
    assert.strictEqual(joinRes.code, 'MEETING_NOT_FOUND');
  });

  test('REQ-INV-002: Joining a CANCELLED meeting is rejected with 410 MEETING_CANCELLED', () => {
    // Create and cancel a meeting
    const { meeting: cancelMeet } = meetingService.createMeeting(adminUser, { title: 'Cancelled Session' });
    meetingService.transitionStatus(adminUser, cancelMeet.id, 'CANCELLED');

    const joinRes = invitationService.validateJoin(adminUser, cancelMeet.id);

    assert.strictEqual(joinRes.success, false);
    assert.strictEqual(joinRes.code, 'MEETING_CANCELLED');
  });

  test('REQ-INV-002: Joining an ENDED meeting is rejected with 410 MEETING_ENDED', () => {
    // Create, start, and end meeting
    const { meeting: endedMeet } = meetingService.createMeeting(adminUser, { title: 'Ended Session' });
    meetingService.transitionStatus(adminUser, endedMeet.id, 'STARTED');
    meetingService.transitionStatus(adminUser, endedMeet.id, 'ACTIVE');
    meetingService.transitionStatus(adminUser, endedMeet.id, 'ENDED');

    const joinRes = invitationService.validateJoin(adminUser, endedMeet.id);

    assert.strictEqual(joinRes.success, false);
    assert.strictEqual(joinRes.code, 'MEETING_ENDED');
  });

  test('REQ-INV-002: Joining with an expired invitation is rejected with 403 INVITATION_EXPIRED', () => {
    // Create an invitation expired 2 hours ago
    const inviteRes = invitationService.createInvitation(adminUser, {
      meetingId,
      inviteeEmail: 'expired@example.com',
      expiresInHours: -2, // expired in past
    });

    const user = {
      id: 'usr_cand_expired',
      email: 'expired@example.com',
      name: 'Expired User',
      role: 'candidate',
      permissions: [],
    };

    const joinRes = invitationService.validateJoin(user, meetingId, inviteRes.rawInviteToken);

    assert.strictEqual(joinRes.success, false);
    assert.strictEqual(joinRes.code, 'INVITATION_EXPIRED');
  });

  test('REQ-INV-002: Rate limiter triggers 429 RATE_LIMITED upon excessive join attempts (> 15)', () => {
    const spammedUser = {
      id: 'usr_spammer_bot',
      email: 'bot@example.com',
      name: 'Bot User',
      role: 'candidate',
      permissions: [],
    };

    let lastResult;
    for (let i = 0; i < 17; i++) {
      lastResult = invitationService.validateJoin(spammedUser, meetingId);
    }

    assert.strictEqual(lastResult.success, false);
    assert.strictEqual(lastResult.code, 'RATE_LIMITED');
    assert(lastResult.error.includes('Excessive join attempts'));
  });

  // ─── 3. HTTP ENDPOINT HANDLERS ────────────────────────────────────────────
  await asyncTest('REQ-INV-001: POST /api/v1/meetings/invite issues invitation via REST API', async () => {
    const { default: handler } = await import('../api/v1/meetings/invite.js');

    const adminToken = tokenService.generateMeetingToken({
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.name,
      userRole: 'admin',
      meetingId,
      meetingRole: 'HOST',
      permissions: ['admin:all'],
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${adminToken}` },
      body: {
        meetingId,
        inviteeEmail: 'http.invited@example.com',
        assignedRole: 'PARTICIPANT',
      },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(jsonBody.success, true);
    assert(jsonBody.rawInviteToken);
    assert(jsonBody.joinUrl.includes('/meet/'));
  });

  await asyncTest('REQ-INV-002: POST /api/v1/meetings/join validates and returns token via REST API', async () => {
    const { default: handler } = await import('../api/v1/meetings/join.js');

    const candToken = tokenService.generateMeetingToken({
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.name,
      userRole: 'admin',
      meetingId,
      meetingRole: 'HOST',
      permissions: ['admin:all'],
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${candToken}` },
      body: { meetingId },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonBody.success, true);
    assert(jsonBody.meetingToken);
    assert.strictEqual(jsonBody.meetingRole, 'HOST');
  });

  console.log(`\n🎉 Phase 3 Test Results: All ${passed}/${total} tests PASSED with zero failures!`);
}

runPhase3InvitationsJoinTests().catch(err => {
  console.error('Phase 3 Test Suite Failed:', err);
  process.exit(1);
});
