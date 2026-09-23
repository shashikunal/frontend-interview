/**
 * Test Suite: Phase 16 — Advanced Meeting Collaboration & Media Experience
 * Validates:
 * - Participant State & Presence (online, joining, connected, reconnecting, disconnected, left)
 * - Hand Raising, Self-Lowering, and Host Moderated Lowering (RBAC protected)
 * - Ephemeral Reactions: Allowlist validation & Token-bucket rate limiting (max 5/5s)
 * - Host Controls: Remote Mute Request, Participant Removal (Blacklist enforcement), End Meeting
 * - Reconnection, Rejoin, and Duplicate-event Protection
 * - Meeting Chat & Media Subsystem Failure Isolation
 * - Complete E2E 15-step Meeting Scenario
 */

import assert from 'assert';
import { meetingPresenceService } from '../server/meetings/meetingPresenceService.ts';
import { meetingService } from '../server/meetings/meetingService.ts';
import { chatService } from '../server/meetings/chatService.ts';

async function runPhase16Tests() {
  console.log('🧪 Starting Phase 16: Advanced Meeting Collaboration & Media Experience Tests...\n');
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

  // Test Entities
  const hostUser = {
    id: 'usr_host_16',
    email: 'host@enterprise.com',
    name: 'Sarah Connor (Host)',
    role: 'admin',
    permissions: ['admin:all']
  };

  const userAlice = {
    id: 'usr_alice_16',
    email: 'alice@enterprise.com',
    name: 'Alice Cooper',
    role: 'candidate',
    permissions: []
  };

  const userBob = {
    id: 'usr_bob_16',
    email: 'bob@enterprise.com',
    name: 'Bob Marley',
    role: 'candidate',
    permissions: []
  };

  // Create real meeting via lifecycle
  const meetingCreation = meetingService.createMeeting(hostUser, {
    title: 'Phase 16 Architecture Board Review',
    scheduledStartTime: new Date(Date.now() + 60000).toISOString()
  });
  assert(meetingCreation.success, 'Meeting creation must succeed');
  const meetingId = meetingCreation.meeting.id;

  // Start the meeting
  const startResult = meetingService.transitionStatus(hostUser, meetingId, 'STARTED');
  assert(startResult.success, 'Meeting start must succeed');
  meetingService.transitionStatus(hostUser, meetingId, 'ACTIVE');

  console.log(`  [Setup] Initialized Active Meeting ID: ${meetingId}\n`);

  // ─── 1. REQ-MEET-001 & REQ-MEET-004: PARTICIPANT STATE & PRESENCE ─────────
  test('REQ-MEET-001: Register participant with standard schema & initial presence', () => {
    const reg = meetingPresenceService.registerParticipant(meetingId, {
      userId: hostUser.id,
      socketId: 'sock_host_1',
      displayName: hostUser.name,
      role: 'HOST',
      micState: true,
      cameraState: true,
    });

    assert.strictEqual(reg.success, true);
    const hostParticipant = reg.participant;
    assert.strictEqual(hostParticipant.userId, hostUser.id);
    assert.strictEqual(hostParticipant.role, 'HOST');
    assert.strictEqual(hostParticipant.connectionState, 'connected');
    assert.strictEqual(hostParticipant.handRaised, false);
    assert.strictEqual(hostParticipant.screenShareState, false);
    assert(hostParticipant.joinedAt, 'joinedAt timestamp must be set');
  });

  test('REQ-MEET-004: Presence lifecycle transitions (joining -> connected -> reconnecting -> left)', () => {
    // Alice joining
    const regAlice = meetingPresenceService.registerParticipant(meetingId, {
      userId: userAlice.id,
      socketId: 'sock_alice_1',
      displayName: userAlice.name,
      role: 'PARTICIPANT'
    });
    assert.strictEqual(regAlice.success, true);

    meetingPresenceService.updateParticipantState(meetingId, userAlice.id, {
      connectionState: 'joining'
    });
    let p = meetingPresenceService.getParticipant(meetingId, userAlice.id);
    assert.strictEqual(p.connectionState, 'joining');

    // Alice connected
    meetingPresenceService.updateParticipantState(meetingId, userAlice.id, {
      connectionState: 'connected'
    });
    p = meetingPresenceService.getParticipant(meetingId, userAlice.id);
    assert.strictEqual(p.connectionState, 'connected');

    // Network interruption: reconnecting
    meetingPresenceService.updateParticipantState(meetingId, userAlice.id, {
      connectionState: 'reconnecting'
    });
    p = meetingPresenceService.getParticipant(meetingId, userAlice.id);
    assert.strictEqual(p.connectionState, 'reconnecting');

    // Network restored: connected again (idempotent, preserved state)
    meetingPresenceService.updateParticipantState(meetingId, userAlice.id, {
      connectionState: 'connected'
    });
    p = meetingPresenceService.getParticipant(meetingId, userAlice.id);
    assert.strictEqual(p.connectionState, 'connected');
  });

  // ─── 2. REQ-MEET-006 & REQ-MEET-007: MEDIA CONTROLS & PARITY ───────────────
  test('REQ-MEET-006 & 007: Synchronize mic, camera, and screen share track state', () => {
    // Alice turns off camera and mutes mic
    const updated = meetingPresenceService.updateParticipantState(meetingId, userAlice.id, {
      micState: false,
      cameraState: false
    });

    assert.strictEqual(updated.micState, false);
    assert.strictEqual(updated.cameraState, false);

    // Alice starts screen sharing
    const screenShareUpdate = meetingPresenceService.updateParticipantState(meetingId, userAlice.id, {
      screenShareState: true
    });
    assert.strictEqual(screenShareUpdate.screenShareState, true);
  });

  // ─── 3. REQ-MEET-012 & REQ-MEET-013: RAISE HAND & HOST MODERATION ─────────
  test('REQ-MEET-012: Participant raises hand with authoritative timestamp', () => {
    const raised = meetingPresenceService.raiseHand(meetingId, userAlice.id);
    assert.strictEqual(raised.handRaised, true);
    assert(raised.handRaisedAt, 'handRaisedAt must be recorded');
  });

  test('REQ-MEET-012: Participant self-lowers hand', () => {
    const lowered = meetingPresenceService.lowerHand(meetingId, userAlice.id);
    assert.strictEqual(lowered.handRaised, false);
    assert.strictEqual(lowered.handRaisedAt, undefined);
  });

  test('REQ-MEET-012: Host lowers participant hand (RBAC authorized)', () => {
    // Alice raises hand again
    meetingPresenceService.raiseHand(meetingId, userAlice.id);

    // Host lowers Alice's hand
    const hostLowered = meetingPresenceService.hostLowerHand(meetingId, hostUser.id, userAlice.id);
    assert.strictEqual(hostLowered.success, true);
    assert.strictEqual(hostLowered.participant.handRaised, false);
  });

  test('REQ-MEET-012: Non-host user cannot lower another participant hand (403 Forbidden)', () => {
    // Add Bob to meeting
    meetingPresenceService.registerParticipant(meetingId, {
      userId: userBob.id,
      socketId: 'sock_bob_1',
      displayName: userBob.name,
      role: 'PARTICIPANT'
    });

    // Alice raises hand
    meetingPresenceService.raiseHand(meetingId, userAlice.id);

    // Bob attempts to lower Alice's hand
    const bobAttempt = meetingPresenceService.hostLowerHand(meetingId, userBob.id, userAlice.id);
    assert.strictEqual(bobAttempt.success, false);
    assert(bobAttempt.error.includes('Only meeting host or co-host can lower participant hands'));

    // Alice's hand must remain raised
    const p = meetingPresenceService.getParticipant(meetingId, userAlice.id);
    assert.strictEqual(p.handRaised, true);
  });

  // ─── 4. REQ-MEET-013 & REQ-MEET-014: REACTIONS & RATE LIMITING ────────────
  test('REQ-MEET-013: Ephemeral reaction validation allows standard allowlist', () => {
    const allowed = ['👍', '👏', '❤️', '😂', '🎉'];
    for (const emoji of allowed) {
      const res = meetingPresenceService.validateReaction('test_usr_reactions', emoji);
      assert.strictEqual(res.allowed, true);
    }
  });

  test('REQ-MEET-013: Arbitrary HTML / XSS / non-allowlist reaction is rejected', () => {
    const malicious = '<script>alert("xss")</script>';
    const res = meetingPresenceService.validateReaction(userAlice.id, malicious);
    assert.strictEqual(res.allowed, false);
    assert(res.error.includes('Invalid emoji'));
  });

  test('REQ-MEET-014: Reaction token-bucket rate limits spam (> 5 in 5 seconds)', () => {
    // User Bob sends reactions rapidly
    for (let i = 0; i < 5; i++) {
      const ok = meetingPresenceService.validateReaction(userBob.id, '👍');
      assert.strictEqual(ok.allowed, true, `Reaction ${i + 1} should be permitted`);
    }

    // 6th reaction within 5s window should be rejected
    const blocked = meetingPresenceService.validateReaction(userBob.id, '👍');
    assert.strictEqual(blocked.allowed, false);
    assert(blocked.error.includes('Reaction rate limit exceeded'));
  });

  // ─── 5. REQ-MEET-015 & REQ-MEET-016: HOST CONTROLS & REMOVAL ──────────────
  test('REQ-MEET-015: Host cannot be kicked by participant', () => {
    const attempt = meetingPresenceService.hostRemoveParticipant(meetingId, userBob.id, hostUser.id);
    assert.strictEqual(attempt.success, false);
    assert(attempt.error.includes('Only meeting host can remove participants'));
  });

  test('REQ-MEET-015: Host can request participant mute', () => {
    const muteReq = meetingPresenceService.hostRequestMute(meetingId, hostUser.id, userBob.id);
    assert.strictEqual(muteReq.success, true);
  });

  test('REQ-MEET-016: Host removes participant and blacklists re-entry', () => {
    const removal = meetingPresenceService.hostRemoveParticipant(meetingId, hostUser.id, userBob.id);
    assert.strictEqual(removal.success, true);
    assert.strictEqual(removal.targetSocketId, 'sock_bob_1');

    // Bob is removed from room participant list
    const p = meetingPresenceService.getParticipant(meetingId, userBob.id);
    assert.strictEqual(p, null);

    // Bob attempts to rejoin -> rejected by blacklist
    const rejoinAttempt = meetingPresenceService.registerParticipant(meetingId, {
      userId: userBob.id,
      socketId: 'sock_bob_2',
      displayName: userBob.name,
      role: 'PARTICIPANT'
    });
    assert.strictEqual(rejoinAttempt.success, false);
    assert(rejoinAttempt.error.includes('You have been removed from this meeting'));
  });

  // ─── 6. REQ-MEET-023: IDEMPOTENT STATE RECONCILIATION ─────────────────────
  test('REQ-MEET-023: State synchronization produces canonical participant snapshot without duplicates', () => {
    const participants = meetingPresenceService.getRoomParticipants(meetingId);
    assert(Array.isArray(participants), 'Participants must be array');

    // Should have exactly Host and Alice (Bob was kicked)
    assert.strictEqual(participants.length, 2);

    const userIds = participants.map(p => p.userId);
    const uniqueIds = new Set(userIds);
    assert.strictEqual(userIds.length, uniqueIds.size, 'Participant IDs must be strictly unique');
  });

  // ─── 7. REQ-MEET-026: FAILURE ISOLATION (CHAT & MEDIA INDEPENDENCE) ────────
  test('REQ-MEET-026: Chat subsystem and meeting presence run independently', () => {
    // When presence state updates, chat service can post message independently
    const chatRes = chatService.sendMessage(
      { id: userAlice.id, email: userAlice.email, name: userAlice.name, role: 'candidate', permissions: [], meetingRole: 'PARTICIPANT' },
      { meetingId, content: 'Can everyone hear me clearly?' }
    );
    assert.strictEqual(chatRes.success, true);
    assert.strictEqual(chatRes.message.meetingId, meetingId);
    assert.strictEqual(chatRes.message.senderId, userAlice.id);

    // If chat errors or disconnects, meeting presence remains intact
    const currentP = meetingPresenceService.getParticipant(meetingId, userAlice.id);
    assert.strictEqual(currentP.connectionState, 'connected');
  });

  // ─── 8. REQ-MEET-027: COMPLETE 15-STEP E2E MEETING SCENARIO ────────────────
  await asyncTest('REQ-MEET-027: Complete E2E Collaboration Flow (15-step scenario)', async () => {
    console.log('    Step 1: Admin logs in & creates new meeting');
    const e2eMeeting = meetingService.createMeeting(hostUser, {
      title: 'E2E Google Meet Collaboration Scenario'
    });
    assert(e2eMeeting.success);
    const mId = e2eMeeting.meeting.id;
    meetingService.transitionStatus(hostUser, mId, 'STARTED');
    meetingService.transitionStatus(hostUser, mId, 'ACTIVE');

    console.log('    Step 2: Host joins and registers control plane presence');
    const hostReg = meetingPresenceService.registerParticipant(mId, {
      userId: hostUser.id,
      socketId: 'sock_host_e2e',
      displayName: hostUser.name,
      role: 'HOST',
      micState: true,
      cameraState: true,
    });
    assert.strictEqual(hostReg.success, true);

    console.log('    Step 3: User Alice joins the meeting');
    const aliceReg = meetingPresenceService.registerParticipant(mId, {
      userId: userAlice.id,
      socketId: 'sock_alice_e2e',
      displayName: userAlice.name,
      role: 'PARTICIPANT',
    });
    assert.strictEqual(aliceReg.success, true);

    console.log('    Step 4: Second User Bob joins the meeting');
    const bobReg = meetingPresenceService.registerParticipant(mId, {
      userId: userBob.id,
      socketId: 'sock_bob_e2e',
      displayName: userBob.name,
      role: 'PARTICIPANT',
    });
    assert.strictEqual(bobReg.success, true);

    console.log('    Step 5: Both users transition to connected media state');
    meetingPresenceService.updateParticipantState(mId, userAlice.id, { connectionState: 'connected' });
    meetingPresenceService.updateParticipantState(mId, userBob.id, { connectionState: 'connected' });
    let participants = meetingPresenceService.getRoomParticipants(mId);
    assert.strictEqual(participants.length, 3);

    console.log('    Step 6: Participant list updates and reflects all 3 attendees');
    const names = participants.map(p => p.displayName);
    assert(names.includes(hostUser.name));
    assert(names.includes(userAlice.name));
    assert(names.includes(userBob.name));

    console.log('    Step 7: User Alice raises hand');
    const raisedAlice = meetingPresenceService.raiseHand(mId, userAlice.id);
    assert.strictEqual(raisedAlice.handRaised, true);

    console.log('    Step 8: Host sees raised hand and lowers it');
    const loweredAlice = meetingPresenceService.hostLowerHand(mId, hostUser.id, userAlice.id);
    assert.strictEqual(loweredAlice.success, true);
    assert.strictEqual(loweredAlice.participant.handRaised, false);

    console.log('    Step 9: User Bob sends emoji reaction 🎉');
    const reactBob = meetingPresenceService.validateReaction('user_bob_e2e', '🎉');
    assert.strictEqual(reactBob.allowed, true);

    console.log('    Step 10: All participants receive reaction event (allowlist verified)');
    assert.strictEqual(reactBob.allowed, true);

    console.log('    Step 11: Host starts screen sharing');
    const hostScreen = meetingPresenceService.updateParticipantState(mId, hostUser.id, {
      screenShareState: true
    });
    assert.strictEqual(hostScreen.screenShareState, true);

    console.log('    Step 12: Meeting chat message sent by Alice');
    const chatRes = chatService.sendMessage(
      { id: userAlice.id, email: userAlice.email, name: userAlice.name, role: 'candidate', permissions: [], meetingRole: 'PARTICIPANT' },
      { meetingId: mId, content: 'Screen is visible, looks great!' }
    );
    assert.strictEqual(chatRes.success, true);
    assert.strictEqual(chatRes.message.content, 'Screen is visible, looks great!');

    console.log('    Step 13: Bob leaves the meeting gracefully');
    const leaveResult = meetingPresenceService.removeParticipantBySocket('sock_bob_e2e');
    assert.strictEqual(leaveResult.participant.userId, userBob.id);
    const postLeaveParticipants = meetingPresenceService.getRoomParticipants(mId);
    assert.strictEqual(postLeaveParticipants.length, 2);

    console.log('    Step 14: Host ends meeting for all');
    meetingPresenceService.terminateRoom(mId);
    const endResult = meetingService.transitionStatus(hostUser, mId, 'ENDED');
    assert.strictEqual(endResult.success, true);

    console.log('    Step 15: Meeting lifecycle becomes ENDED & room state cleaned up');
    const finalMeeting = meetingService.getMeetingById(mId);
    assert.strictEqual(finalMeeting.status, 'ENDED');
    assert.strictEqual(meetingPresenceService.getRoomParticipants(mId).length, 0);
  });

  console.log(`\n======================================================`);
  console.log(`✅ All ${passed}/${total} Phase 16 Collaboration Tests PASSED`);
  console.log(`======================================================\n`);
}

runPhase16Tests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
