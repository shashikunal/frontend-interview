/**
 * Test Suite: Phase 6 In-Meeting Collaborative Vector Whiteboard
 * Validates Vector Elements (Rect, Circle, Arrow, Freehand Pen, Text),
 * Versioning, Element Deletion, Canvas Clearing, and REST Whiteboard Endpoints.
 */

import assert from 'assert';
import { whiteboardService } from '../server/meetings/whiteboardService.ts';
import { meetingService } from '../server/meetings/meetingService.ts';
import { tokenService } from '../server/auth/tokenService.ts';

async function runPhase6WhiteboardTests() {
  console.log('🧪 Starting Phase 6: Collaborative Whiteboard Tests...\n');
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

  const hostUser = {
    id: 'usr_host_p6',
    email: 'architect@interviewprep.com',
    name: 'Principal Architect',
    role: 'admin',
    meetingRole: 'HOST',
    permissions: ['admin:all'],
  };

  const candUser = {
    id: 'usr_cand_p6',
    email: 'candidate.arch@example.com',
    name: 'Senior Candidate',
    role: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };

  // Setup: Active meeting
  const { meeting: activeMeeting } = meetingService.createMeeting(hostUser, {
    title: 'High-Scale Event Bus & Kafka Topology Design',
    meetingType: 'COLLABORATIVE',
  });

  // Setup: Ended meeting
  const { meeting: endedMeeting } = meetingService.createMeeting(hostUser, {
    title: 'Concluded Architecture Loop',
    meetingType: 'INTERVIEW',
  });
  meetingService.transitionStatus(hostUser, endedMeeting.id, 'STARTED');
  meetingService.transitionStatus(hostUser, endedMeeting.id, 'ACTIVE');
  meetingService.transitionStatus(hostUser, endedMeeting.id, 'ENDED');

  whiteboardService.clearStore();

  // ─── 1. SNAPSHOT RETRIEVAL ────────────────────────────────────────────────
  test('REQ-WB-001: Initial whiteboard snapshot returns clean state with version 1', () => {
    const snapshot = whiteboardService.getSnapshot(activeMeeting.id);
    assert.strictEqual(snapshot.meetingId, activeMeeting.id);
    assert.strictEqual(snapshot.elements.length, 0);
    assert.strictEqual(snapshot.version, 1);
  });

  // ─── 2. VECTOR SHAPE UPSERT & PERSISTENCE ─────────────────────────────────
  let rectId = 'shape_rect_1';
  test('REQ-WB-002: Host creates RECTANGLE architecture node', () => {
    const res = whiteboardService.upsertElement(hostUser, activeMeeting.id, {
      id: rectId,
      type: 'RECTANGLE',
      x: 100,
      y: 150,
      width: 220,
      height: 120,
      strokeColor: '#4318ff',
      strokeWidth: 3,
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.element.id, rectId);
    assert.strictEqual(res.element.type, 'RECTANGLE');
    assert.strictEqual(res.element.createdBy, hostUser.id);
    assert.strictEqual(res.version, 2);

    const snap = whiteboardService.getSnapshot(activeMeeting.id);
    assert.strictEqual(snap.elements.length, 1);
    assert.strictEqual(snap.elements[0].id, rectId);
  });

  let circleId = 'shape_circle_1';
  test('REQ-WB-003: Candidate creates CIRCLE database node', () => {
    const res = whiteboardService.upsertElement(candUser, activeMeeting.id, {
      id: circleId,
      type: 'CIRCLE',
      x: 450,
      y: 150,
      width: 140,
      height: 140,
      strokeColor: '#01b574',
      strokeWidth: 3,
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.element.type, 'CIRCLE');
    assert.strictEqual(res.element.createdBy, candUser.id);

    const snap = whiteboardService.getSnapshot(activeMeeting.id);
    assert.strictEqual(snap.elements.length, 2);
  });

  let arrowId = 'shape_arrow_1';
  test('REQ-WB-004: Host creates connecting ARROW between nodes', () => {
    const res = whiteboardService.upsertElement(hostUser, activeMeeting.id, {
      id: arrowId,
      type: 'ARROW',
      x: 320,
      y: 210,
      width: 130,
      height: 0,
      strokeColor: '#00d2d3',
      strokeWidth: 2,
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.element.type, 'ARROW');
  });

  test('REQ-WB-005: Candidate draws freehand DRAW pen strokes', () => {
    const penPoints = [
      { x: 50, y: 50 },
      { x: 55, y: 58 },
      { x: 62, y: 70 },
      { x: 80, y: 90 },
    ];

    const res = whiteboardService.upsertElement(candUser, activeMeeting.id, {
      id: 'pen_draw_1',
      type: 'DRAW',
      x: 50,
      y: 50,
      width: 30,
      height: 40,
      points: penPoints,
      strokeColor: '#ffb547',
      strokeWidth: 4,
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.element.type, 'DRAW');
    assert.strictEqual(res.element.points.length, 4);
  });

  // ─── 3. SHAPE VERSIONING & DRAG/MOVE UPDATES ──────────────────────────────
  test('REQ-WB-006: Dragging/moving an element updates position and increments version', () => {
    const snapBefore = whiteboardService.getSnapshot(activeMeeting.id);
    const initialVersion = snapBefore.version;

    const res = whiteboardService.upsertElement(candUser, activeMeeting.id, {
      id: rectId,
      type: 'RECTANGLE',
      x: 180, // Moved from 100 to 180
      y: 220, // Moved from 150 to 220
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.element.x, 180);
    assert.strictEqual(res.element.y, 220);
    assert(res.version > initialVersion);
    // Preserves original creator
    assert.strictEqual(res.element.createdBy, hostUser.id);
  });

  // ─── 4. ELEMENT DELETION & BOARD CLEARING ─────────────────────────────────
  test('REQ-WB-007: Deleting an element removes it from snapshot', () => {
    const delRes = whiteboardService.deleteElement(hostUser, activeMeeting.id, arrowId);
    assert.strictEqual(delRes.success, true);

    const snap = whiteboardService.getSnapshot(activeMeeting.id);
    assert(!snap.elements.some(el => el.id === arrowId));
  });

  test('REQ-WB-008: Clear board empties canvas completely', () => {
    const clearRes = whiteboardService.clearBoard(hostUser, activeMeeting.id);
    assert.strictEqual(clearRes.success, true);

    const snap = whiteboardService.getSnapshot(activeMeeting.id);
    assert.strictEqual(snap.elements.length, 0);
  });

  // ─── 5. CONSTRAINTS & SECURITY ────────────────────────────────────────────
  test('REQ-WB-009: Operations on concluded/ended meetings are rejected (410 GONE)', () => {
    const res = whiteboardService.upsertElement(hostUser, endedMeeting.id, {
      id: 'forbidden_shape',
      type: 'RECTANGLE',
      x: 0,
      y: 0,
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'MEETING_ENDED');
  });

  test('REQ-WB-010: Operations on non-existent meeting are rejected (404 NOT_FOUND)', () => {
    const res = whiteboardService.upsertElement(hostUser, 'fake_meeting_id', {
      id: 'fake_shape',
      type: 'CIRCLE',
      x: 0,
      y: 0,
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'MEETING_NOT_FOUND');
  });

  // ─── 6. REST API: GET & POST /api/v1/meetings/whiteboard ──────────────────
  await asyncTest('REQ-WB-011: POST /api/v1/meetings/whiteboard UPSERT saves element via REST API (200 OK)', async () => {
    const { default: handler } = await import('../api/v1/meetings/whiteboard.js');

    const token = tokenService.generateMeetingToken({
      userId: hostUser.id,
      userEmail: hostUser.email,
      userName: hostUser.name,
      userRole: 'admin',
      meetingId: activeMeeting.id,
      meetingRole: 'HOST',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        action: 'UPSERT',
        meetingId: activeMeeting.id,
        element: {
          id: 'rest_shape_1',
          type: 'RECTANGLE',
          x: 200,
          y: 200,
          width: 160,
          height: 90,
          strokeColor: '#7551ff',
        },
      },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonBody.success, true);
    assert.strictEqual(jsonBody.element.id, 'rest_shape_1');
  });

  await asyncTest('REQ-WB-012: GET /api/v1/meetings/whiteboard returns snapshot via REST API (200 OK)', async () => {
    const { default: handler } = await import('../api/v1/meetings/whiteboard.js');

    const token = tokenService.generateMeetingToken({
      userId: candUser.id,
      userEmail: candUser.email,
      userName: candUser.name,
      userRole: 'candidate',
      meetingId: activeMeeting.id,
      meetingRole: 'PARTICIPANT',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'GET',
      headers: { authorization: `Bearer ${token}` },
      query: { meetingId: activeMeeting.id },
    };
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonBody.success, true);
    assert(Array.isArray(jsonBody.snapshot.elements));
    assert(jsonBody.snapshot.elements.some(el => el.id === 'rest_shape_1'));
  });

  console.log(`\n🎉 Phase 6 Test Results: All ${passed}/${total} tests PASSED with zero failures!`);
}

runPhase6WhiteboardTests().catch(err => {
  console.error('Phase 6 Test Suite Failed:', err);
  process.exit(1);
});
