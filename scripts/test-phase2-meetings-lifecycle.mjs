import assert from 'assert';
import { meetingService } from '../server/meetings/meetingService.ts';
import { tokenService } from '../server/auth/tokenService.ts';

async function runPhase2MeetingsLifecycleTests() {
  console.log('🧪 Starting Phase 2: Meeting Creation, Scheduling & Lifecycle State Machine Tests...\n');
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
    id: 'usr_admin_master',
    email: 'admin@interviewprep.com',
    name: 'Admin Master',
    role: 'admin',
    permissions: ['admin:all'],
  };

  const candidateUser = {
    id: 'usr_cand_regular',
    email: 'candidate@example.com',
    name: 'Regular Candidate',
    role: 'candidate',
    permissions: [],
  };

  // ─── 1. REQ-MEET-001: CREATION & RBAC ────────────────────────────────────
  test('REQ-MEET-001: Non-admin candidate cannot create a meeting (403 Forbidden)', () => {
    const result = meetingService.createMeeting(candidateUser, {
      title: 'Hacker Attempt Meeting',
    });

    assert.strictEqual(result.success, false, 'Candidate creation must fail');
    assert.strictEqual(result.code, 'FORBIDDEN');
    assert(result.error.includes('Only Platform Administrators'));
  });

  test('REQ-MEET-001: Empty or blank title is rejected with 400 INVALID_TITLE', () => {
    const result = meetingService.createMeeting(adminUser, {
      title: '   ',
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.code, 'INVALID_TITLE');
  });

  test('REQ-MEET-001: Admin successfully creates and schedules meeting with custom settings', () => {
    const startTime = new Date(Date.now() + 86400 * 1000).toISOString();
    const result = meetingService.createMeeting(adminUser, {
      title: 'Google L6 System Architecture Deep Dive',
      description: 'Distributed Cache & Real-Time Sync',
      meetingType: 'INTERVIEW',
      scheduledStartTime: startTime,
      settings: {
        maxParticipants: 10,
        waitingRoom: true,
        allowScreenShare: true,
      },
    });

    assert.strictEqual(result.success, true, 'Admin creation must succeed');
    assert(result.meeting, 'Meeting object must be returned');
    assert(result.meeting.id.startsWith('meet_'));
    assert.strictEqual(result.meeting.status, 'SCHEDULED');
    assert.strictEqual(result.meeting.settings.maxParticipants, 10);
    assert.strictEqual(result.meeting.hostId, adminUser.id);
  });

  // ─── 2. REQ-MEET-002: STATE MACHINE VALID TRANSITIONS ─────────────────────
  test('REQ-MEET-002: State Machine enforces SCHEDULED -> STARTED -> ACTIVE -> ENDED -> ARCHIVED', () => {
    // Create new meeting
    const { meeting } = meetingService.createMeeting(adminUser, {
      title: 'Lifecycle Trajectory Test Meeting',
    });
    const id = meeting.id;

    // 1. SCHEDULED -> STARTED
    const r1 = meetingService.transitionStatus(adminUser, id, 'STARTED');
    assert.strictEqual(r1.success, true);
    assert.strictEqual(r1.meeting?.status, 'STARTED');
    assert(r1.meeting?.actualStartTime, 'Must record actualStartTime on STARTED');

    // 2. STARTED -> ACTIVE
    const r2 = meetingService.transitionStatus(adminUser, id, 'ACTIVE');
    assert.strictEqual(r2.success, true);
    assert.strictEqual(r2.meeting?.status, 'ACTIVE');

    // 3. ACTIVE -> ENDED
    const r3 = meetingService.transitionStatus(adminUser, id, 'ENDED');
    assert.strictEqual(r3.success, true);
    assert.strictEqual(r3.meeting?.status, 'ENDED');
    assert(r3.meeting?.actualEndTime, 'Must record actualEndTime on ENDED');

    // 4. ENDED -> ARCHIVED
    const r4 = meetingService.transitionStatus(adminUser, id, 'ARCHIVED');
    assert.strictEqual(r4.success, true);
    assert.strictEqual(r4.meeting?.status, 'ARCHIVED');
  });

  // ─── 3. REQ-MEET-002: INVALID TRANSITIONS REJECTION ──────────────────────
  test('REQ-MEET-002: Rejects invalid jump from SCHEDULED directly to ENDED', () => {
    const { meeting } = meetingService.createMeeting(adminUser, {
      title: 'Invalid Jump Test Meeting',
    });

    const result = meetingService.transitionStatus(adminUser, meeting.id, 'ENDED');
    assert.strictEqual(result.success, false, 'Jump must be rejected');
    assert.strictEqual(result.code, 'INVALID_TRANSITION');
    assert(result.error.includes("Cannot transition meeting from 'SCHEDULED' to 'ENDED'"));
  });

  test('REQ-MEET-002: Rejects resurrection from ARCHIVED terminal state back to STARTED', () => {
    const { meeting } = meetingService.createMeeting(adminUser, { title: 'Terminal State Test' });
    meetingService.transitionStatus(adminUser, meeting.id, 'STARTED');
    meetingService.transitionStatus(adminUser, meeting.id, 'ACTIVE');
    meetingService.transitionStatus(adminUser, meeting.id, 'ENDED');
    meetingService.transitionStatus(adminUser, meeting.id, 'ARCHIVED');

    const result = meetingService.transitionStatus(adminUser, meeting.id, 'STARTED');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.code, 'INVALID_TRANSITION');
  });

  // ─── 4. REQ-MEET-003: CANCELLATION LIFECYCLE ──────────────────────────────
  test('REQ-MEET-003: SCHEDULED meeting can be CANCELLED by Admin', () => {
    const { meeting } = meetingService.createMeeting(adminUser, {
      title: 'Meeting To Cancel',
    });

    const result = meetingService.transitionStatus(adminUser, meeting.id, 'CANCELLED', 'Candidate rescheduled');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.meeting?.status, 'CANCELLED');

    // Trying to transition a CANCELLED meeting to ACTIVE must fail
    const resumeAttempt = meetingService.transitionStatus(adminUser, meeting.id, 'ACTIVE');
    assert.strictEqual(resumeAttempt.success, false);
    assert.strictEqual(resumeAttempt.code, 'INVALID_TRANSITION');
  });

  test('REQ-MEET-003: Non-admin candidate cannot cancel a meeting (403 Forbidden)', () => {
    const { meeting } = meetingService.createMeeting(adminUser, { title: 'Protected Meeting' });

    const result = meetingService.transitionStatus(candidateUser, meeting.id, 'CANCELLED');
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.code, 'FORBIDDEN');
  });

  // ─── 5. OUTBOX EVENT RECORDING ────────────────────────────────────────────
  test('REQ-KAFKA-001 (Prep): Outbox records all meeting lifecycle transitions with typed payloads', () => {
    const outbox = meetingService.getOutboxEvents();
    assert(outbox.length > 0, 'Outbox must contain recorded events');

    const eventTypes = outbox.map(e => e.eventType);
    assert(eventTypes.includes('MeetingCreated'), 'Must have MeetingCreated events');
    assert(eventTypes.includes('MeetingStarted'), 'Must have MeetingStarted events');
    assert(eventTypes.includes('MeetingEnded'), 'Must have MeetingEnded events');
    assert(eventTypes.includes('MeetingCancelled'), 'Must have MeetingCancelled events');

    const sample = outbox[0];
    assert(sample.id.startsWith('evt_'));
    assert.strictEqual(sample.status, 'PENDING');
    assert(sample.createdAt);
  });

  // ─── 6. REST API HANDLERS E2E ─────────────────────────────────────────────
  await asyncTest('REQ-MEET-001: POST /api/v1/meetings enforces admin token and returns 201 Created', async () => {
    const { default: handler } = await import('../api/v1/meetings/index.js');

    // 1. Generate Admin Bearer Token
    const adminToken = tokenService.generateMeetingToken({
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.name,
      userRole: 'admin',
      meetingId: 'global',
      meetingRole: 'HOST',
      permissions: ['admin:all'],
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${adminToken}` },
      body: {
        title: 'REST API Verified Meeting',
        meetingType: 'COLLABORATIVE',
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
    assert.strictEqual(jsonBody.meeting.title, 'REST API Verified Meeting');
  });

  await asyncTest('REQ-MEET-001: POST /api/v1/meetings with candidate token returns 403 Forbidden', async () => {
    const { default: handler } = await import('../api/v1/meetings/index.js');

    // Generate Candidate Bearer Token
    const candToken = tokenService.generateMeetingToken({
      userId: candidateUser.id,
      userEmail: candidateUser.email,
      userName: candidateUser.name,
      userRole: 'candidate',
      meetingId: 'global',
      meetingRole: 'PARTICIPANT',
      permissions: [],
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${candToken}` },
      body: { title: 'Unauthorized Meeting' },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(jsonBody.code, 'FORBIDDEN');
  });

  await asyncTest('REQ-MEET-002: POST /api/v1/meetings/lifecycle handles transitions via HTTP', async () => {
    const { default: handler } = await import('../api/v1/meetings/lifecycle.js');

    // Create a meeting first
    const { meeting } = meetingService.createMeeting(adminUser, { title: 'HTTP Lifecycle Meeting' });

    const adminToken = tokenService.generateMeetingToken({
      userId: adminUser.id,
      userEmail: adminUser.email,
      userName: adminUser.name,
      userRole: 'admin',
      meetingId: meeting.id,
      meetingRole: 'HOST',
      permissions: ['admin:all'],
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${adminToken}` },
      body: { meetingId: meeting.id, targetStatus: 'STARTED' },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonBody.meeting.status, 'STARTED');
  });

  console.log(`\n🎉 Phase 2 Test Results: All ${passed}/${total} tests PASSED with zero failures!`);
}

runPhase2MeetingsLifecycleTests().catch(err => {
  console.error('Phase 2 Test Suite Failed:', err);
  process.exit(1);
});
