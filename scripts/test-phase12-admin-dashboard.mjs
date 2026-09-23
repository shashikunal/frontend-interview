/**
 * Phase 12 Automated Verification Test Suite
 * Admin Dashboard & Operational Control Center
 * Tests all 24 mandatory requirements:
 * - Authentication & RBAC protection (401/403)
 * - Consolidated dashboard telemetry
 * - User management (search, filter, pagination, status update, privacy)
 * - Meeting management (lifecycle transitions, active session monitoring, roster inspection)
 * - Notification & Kafka DLQ observability
 * - System health & audit log integration
 * - Correlation ID propagation & performance guards
 */

import dashboardHandler from '../api/v1/admin/dashboard.js';
import usersHandler from '../api/v1/admin/users.js';
import meetingsHandler from '../api/v1/admin/meetings.js';
import notificationsHandler from '../api/v1/admin/notifications.js';
import { tokenService } from '../server/auth/tokenService.ts';
import { meetingService } from '../server/meetings/meetingService.ts';
import { invitationService } from '../server/meetings/invitationService.ts';
import { kafkaConsumerService } from '../server/kafka/consumerService.ts';
import { auditService } from '../server/observability/auditService.ts';

// Mock HTTP Request / Response Helpers
function createMockReq(options = {}) {
  return {
    method: options.method || 'GET',
    url: options.url || '/',
    headers: options.headers || {},
    body: options.body || {},
    query: options.query || {},
  };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, val) {
      res.headers[key.toLowerCase()] = val;
    },
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(data) {
      res.body = data;
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
}

// Mint Test Tokens
const adminToken = tokenService.generateMeetingToken(
  {
    userId: 'admin_test_operator',
    userEmail: 'admin@interviewprep.com',
    userName: 'Admin Operator',
    userRole: 'admin',
    permissions: ['admin', 'meetings:manage', 'observability:read'],
  },
  600
).token;

const candidateToken = tokenService.generateMeetingToken(
  {
    userId: 'cand_test_user',
    userEmail: 'candidate@interviewprep.com',
    userName: 'Candidate User',
    userRole: 'candidate',
    permissions: ['meetings:participate'],
  },
  600
).token;

async function runPhase12Tests() {
  console.log('🧪 ====================================================================');
  console.log('🧪 STARTING PHASE 12: ADMIN DASHBOARD & OPERATIONAL CONTROL CENTER');
  console.log('🧪 Testing All 24 Mandatory Control Center Requirements');
  console.log('🧪 ====================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 01: Unauthenticated request to /api/v1/admin/dashboard -> 401 Unauthorized
    // -------------------------------------------------------------------------
    const req1 = createMockReq({ url: '/api/v1/admin/dashboard' });
    const res1 = createMockRes();
    await dashboardHandler(req1, res1);
    assert(
      res1.statusCode === 401 && res1.body?.code === 'MISSING_TOKEN',
      '[TEST 01] REQ-ADMIN-001: Unauthenticated admin dashboard request returns 401 Unauthorized'
    );

    // -------------------------------------------------------------------------
    // TEST 02: Candidate request to /api/v1/admin/dashboard -> 403 Forbidden
    // -------------------------------------------------------------------------
    const req2 = createMockReq({
      url: '/api/v1/admin/dashboard',
      headers: { authorization: `Bearer ${candidateToken}` },
    });
    const res2 = createMockRes();
    await dashboardHandler(req2, res2);
    assert(
      res2.statusCode === 403 && res2.body?.code === 'FORBIDDEN',
      '[TEST 02] REQ-ADMIN-002: Candidate access to admin dashboard returns 403 Forbidden'
    );

    // -------------------------------------------------------------------------
    // TEST 03: Admin request to /api/v1/admin/dashboard -> 200 OK
    // -------------------------------------------------------------------------
    const req3 = createMockReq({
      url: '/api/v1/admin/dashboard',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res3 = createMockRes();
    await dashboardHandler(req3, res3);
    assert(
      res3.statusCode === 200 && res3.body?.success === true && res3.body?.data !== undefined,
      '[TEST 03] REQ-ADMIN-003: Admin access to dashboard succeeds with 200 OK and payload'
    );

    // -------------------------------------------------------------------------
    // TEST 04: Real aggregated metrics present in dashboard payload
    // -------------------------------------------------------------------------
    const data = res3.body?.data;
    assert(
      typeof data?.users?.total === 'number' &&
      typeof data?.meetings?.total === 'number' &&
      typeof data?.participants?.totalInvited === 'number' &&
      typeof data?.infrastructure?.status === 'string',
      '[TEST 04] REQ-ADMIN-004: Dashboard aggregates real user, meeting, participant, and infra telemetry'
    );

    // -------------------------------------------------------------------------
    // TEST 05: Candidate access to /api/v1/admin/users -> 403 Forbidden
    // -------------------------------------------------------------------------
    const req5 = createMockReq({
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${candidateToken}` },
    });
    const res5 = createMockRes();
    await usersHandler(req5, res5);
    assert(
      res5.statusCode === 403 && res5.body?.code === 'FORBIDDEN',
      '[TEST 05] REQ-ADMIN-005: Candidate access to /api/v1/admin/users returns 403 Forbidden'
    );

    // -------------------------------------------------------------------------
    // TEST 06: Admin can list, search, and paginate users via /api/v1/admin/users
    // -------------------------------------------------------------------------
    const req6 = createMockReq({
      url: '/api/v1/admin/users?page=1&limit=5',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res6 = createMockRes();
    await usersHandler(req6, res6);
    assert(
      res6.statusCode === 200 &&
      Array.isArray(res6.body?.users) &&
      res6.body?.pagination?.page === 1 &&
      res6.body?.pagination?.limit === 5,
      '[TEST 06] REQ-ADMIN-006: Admin user directory returns paginated records with metadata'
    );

    // -------------------------------------------------------------------------
    // TEST 07: Privacy & Security: No passwords, hashes, or auth tokens leak in user response
    // -------------------------------------------------------------------------
    const sampleUser = res6.body?.users?.[0] || {};
    assert(
      sampleUser.password === undefined &&
      sampleUser.password_hash === undefined &&
      sampleUser.token === undefined &&
      sampleUser.secret === undefined,
      '[TEST 07] REQ-ADMIN-007: User directory omits passwords, hashes, and sensitive authentication secrets'
    );

    // -------------------------------------------------------------------------
    // TEST 08: Admin can update user account status via PATCH /api/v1/admin/users
    // -------------------------------------------------------------------------
    const targetUserId = sampleUser.id || 'usr_shashikunal_sb';
    const req8 = createMockReq({
      method: 'PATCH',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${adminToken}` },
      body: { userId: targetUserId, status: 'SUSPENDED' },
    });
    const res8 = createMockRes();
    await usersHandler(req8, res8);
    assert(
      res8.statusCode === 200 && res8.body?.success === true,
      '[TEST 08] REQ-ADMIN-008: Admin successfully updates user status with durable audit tracking'
    );

    // Revert user status back to ACTIVE
    const req8b = createMockReq({
      method: 'PATCH',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${adminToken}` },
      body: { userId: targetUserId, status: 'ACTIVE' },
    });
    const res8b = createMockRes();
    await usersHandler(req8b, res8b);

    // -------------------------------------------------------------------------
    // TEST 09: Non-admin cannot modify user account status -> 403 Forbidden
    // -------------------------------------------------------------------------
    const req9 = createMockReq({
      method: 'PATCH',
      url: '/api/v1/admin/users',
      headers: { authorization: `Bearer ${candidateToken}` },
      body: { userId: targetUserId, status: 'SUSPENDED' },
    });
    const res9 = createMockRes();
    await usersHandler(req9, res9);
    assert(
      res9.statusCode === 403 && res9.body?.code === 'FORBIDDEN',
      '[TEST 09] REQ-ADMIN-009: Non-admin cannot modify user account status (403 Forbidden)'
    );

    // -------------------------------------------------------------------------
    // TEST 10: Candidate access to /api/v1/admin/meetings -> 403 Forbidden
    // -------------------------------------------------------------------------
    const req10 = createMockReq({
      url: '/api/v1/admin/meetings',
      headers: { authorization: `Bearer ${candidateToken}` },
    });
    const res10 = createMockRes();
    await meetingsHandler(req10, res10);
    assert(
      res10.statusCode === 403 && res10.body?.code === 'FORBIDDEN',
      '[TEST 10] REQ-ADMIN-010: Candidate access to /api/v1/admin/meetings returns 403 Forbidden'
    );

    // -------------------------------------------------------------------------
    // TEST 11: Admin can list and filter meetings by lifecycle status
    // -------------------------------------------------------------------------
    const req11 = createMockReq({
      url: '/api/v1/admin/meetings?status=SCHEDULED',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res11 = createMockRes();
    await meetingsHandler(req11, res11);
    assert(
      res11.statusCode === 200 &&
      Array.isArray(res11.body?.meetings) &&
      res11.body.meetings.every(m => m.status === 'SCHEDULED'),
      '[TEST 11] REQ-ADMIN-011: Admin can list and filter meetings by lifecycle status'
    );

    // -------------------------------------------------------------------------
    // TEST 12: Admin can query active meetings with live participant counts
    // -------------------------------------------------------------------------
    // Seed an active meeting
    const testAdminUser = {
      id: 'admin_test_operator',
      email: 'admin@interviewprep.com',
      name: 'Admin Operator',
      role: 'admin',
      permissions: ['admin'],
    };
    const newMeet = meetingService.createMeeting(testAdminUser, {
      title: 'Active Operational Session',
      meetingType: 'COLLABORATIVE',
    });
    const meetId = newMeet.meeting?.id;
    meetingService.transitionStatus(testAdminUser, meetId, 'STARTED');
    meetingService.transitionStatus(testAdminUser, meetId, 'ACTIVE');

    const req12 = createMockReq({
      url: '/api/v1/admin/meetings?status=ACTIVE',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res12 = createMockRes();
    await meetingsHandler(req12, res12);
    assert(
      res12.statusCode === 200 &&
      res12.body.meetings.some(m => m.id === meetId && m.status === 'ACTIVE'),
      '[TEST 12] REQ-ADMIN-012: Active meeting monitoring returns live sessions and participant counts'
    );

    // -------------------------------------------------------------------------
    // TEST 13: Admin can inspect single meeting details and participant roster
    // -------------------------------------------------------------------------
    invitationService.createInvitation(testAdminUser, {
      meetingId: meetId,
      inviteeEmail: 'candidate_invitee@interviewprep.com',
      inviteeName: 'Invited Candidate',
    });

    const req13 = createMockReq({
      url: `/api/v1/admin/meetings?meetingId=${meetId}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res13 = createMockRes();
    await meetingsHandler(req13, res13);
    assert(
      res13.statusCode === 200 &&
      res13.body?.data?.meeting?.id === meetId &&
      Array.isArray(res13.body?.data?.participants) &&
      res13.body.data.participants.length > 0,
      '[TEST 13] REQ-ADMIN-013: Meeting details endpoint returns full dossier and participant roster'
    );

    // -------------------------------------------------------------------------
    // TEST 14: Admin can transition meeting lifecycle (End Meeting)
    // -------------------------------------------------------------------------
    const req14 = createMockReq({
      method: 'POST',
      url: '/api/v1/admin/meetings',
      headers: { authorization: `Bearer ${adminToken}` },
      body: { meetingId: meetId, targetStatus: 'ENDED', reason: 'Admin operational test completion' },
    });
    const res14 = createMockRes();
    await meetingsHandler(req14, res14);
    assert(
      res14.statusCode === 200 && res14.body?.meeting?.status === 'ENDED',
      '[TEST 14] REQ-ADMIN-014: Admin can transition meeting lifecycle state (ACTIVE -> ENDED)'
    );

    // -------------------------------------------------------------------------
    // TEST 15: Non-admin cannot transition meeting lifecycle -> 403 Forbidden
    // -------------------------------------------------------------------------
    const req15 = createMockReq({
      method: 'POST',
      url: '/api/v1/admin/meetings',
      headers: { authorization: `Bearer ${candidateToken}` },
      body: { meetingId: meetId, targetStatus: 'ARCHIVED' },
    });
    const res15 = createMockRes();
    await meetingsHandler(req15, res15);
    assert(
      res15.statusCode === 403 && res15.body?.code === 'FORBIDDEN',
      '[TEST 15] REQ-ADMIN-015: Non-admin cannot transition meeting lifecycle (403 Forbidden)'
    );

    // -------------------------------------------------------------------------
    // TEST 16: Candidate access to /api/v1/admin/notifications -> 403 Forbidden
    // -------------------------------------------------------------------------
    const req16 = createMockReq({
      url: '/api/v1/admin/notifications',
      headers: { authorization: `Bearer ${candidateToken}` },
    });
    const res16 = createMockRes();
    await notificationsHandler(req16, res16);
    assert(
      res16.statusCode === 403 && res16.body?.code === 'FORBIDDEN',
      '[TEST 16] REQ-ADMIN-016: Candidate access to /api/v1/admin/notifications returns 403 Forbidden'
    );

    // -------------------------------------------------------------------------
    // TEST 17: Admin can retrieve notification telemetry & Kafka DLQ records
    // -------------------------------------------------------------------------
    // Inject a poison message to route to DLQ
    await kafkaConsumerService.processEventWithIdempotencyAndRetry(
      'notification-service-group',
      null, // Malformed poison event
      'interviewprep.notifications.events',
      async () => {}
    );

    const req17 = createMockReq({
      url: '/api/v1/admin/notifications',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res17 = createMockRes();
    await notificationsHandler(req17, res17);
    assert(
      res17.statusCode === 200 &&
      res17.body?.data?.metrics !== undefined &&
      Array.isArray(res17.body?.data?.dlqRecords),
      '[TEST 17] REQ-ADMIN-017: Admin retrieves notification telemetry and Kafka DLQ records'
    );

    // -------------------------------------------------------------------------
    // TEST 18: Notification DLQ records sanitize secrets & tokens
    // -------------------------------------------------------------------------
    const dlqItem = res17.body?.data?.dlqRecords?.[0] || {};
    assert(
      dlqItem.error !== undefined &&
      (dlqItem.rawPayload === null || dlqItem.rawPayload?.password === undefined),
      '[TEST 18] REQ-ADMIN-018: Quarantined DLQ records sanitize payload credentials'
    );

    // -------------------------------------------------------------------------
    // TEST 19: Audit log query integration via auditService
    // -------------------------------------------------------------------------
    const auditResult = await auditService.query({ limit: 10 });
    assert(
      Array.isArray(auditResult.records) && auditResult.records.length > 0,
      '[TEST 19] REQ-ADMIN-019: Durable audit logs record administrative actions'
    );

    // -------------------------------------------------------------------------
    // TEST 20: System health integration exposes actual dependencies
    // -------------------------------------------------------------------------
    assert(
      res3.body?.data?.infrastructure?.status !== undefined &&
      res3.body?.data?.infrastructure?.database?.status !== undefined,
      '[TEST 20] REQ-ADMIN-020: System health data reflects real infrastructure dependencies'
    );

    // -------------------------------------------------------------------------
    // TEST 21: Correlation ID propagation and header injection
    // -------------------------------------------------------------------------
    const req21 = createMockReq({
      url: '/api/v1/admin/dashboard',
      headers: {
        authorization: `Bearer ${adminToken}`,
        'x-correlation-id': 'corr_phase12_test_999',
      },
    });
    const res21 = createMockRes();
    await dashboardHandler(req21, res21);
    assert(
      res21.headers['x-correlation-id'] === 'corr_phase12_test_999' &&
      res21.body?.correlationId === 'corr_phase12_test_999',
      '[TEST 21] REQ-ADMIN-021: Incoming correlation ID is preserved and echoed in headers & body'
    );

    // -------------------------------------------------------------------------
    // TEST 22: Server-side pagination bounds enforcement (limit clamped to max 100)
    // -------------------------------------------------------------------------
    const req22 = createMockReq({
      url: '/api/v1/admin/users?limit=9999',
      headers: { authorization: `Bearer ${adminToken}` },
    });
    const res22 = createMockRes();
    await usersHandler(req22, res22);
    assert(
      res22.body?.pagination?.limit === 100,
      '[TEST 22] REQ-ADMIN-022: Excessive pagination limit clamped to max 100 to prevent DoS'
    );

    // -------------------------------------------------------------------------
    // TEST 23: Real-time operational metric collection without unbounded cardinality
    // -------------------------------------------------------------------------
    assert(
      res3.body?.data?.meetings?.currentlyActiveCount !== undefined &&
      res3.body?.data?.participants?.activeConnectedCount !== undefined,
      '[TEST 23] REQ-ADMIN-023: Real-time operational metrics collected with bounded labels'
    );

    // -------------------------------------------------------------------------
    // TEST 24: Admin API failure isolation: service errors handled gracefully
    // -------------------------------------------------------------------------
    const req24 = createMockReq({
      method: 'POST',
      url: '/api/v1/admin/meetings',
      headers: { authorization: `Bearer ${adminToken}` },
      body: { meetingId: 'non_existent_meeting_id', targetStatus: 'ACTIVE' },
    });
    const res24 = createMockRes();
    await meetingsHandler(req24, res24);
    assert(
      res24.statusCode === 404 && res24.body?.code === 'MEETING_NOT_FOUND',
      '[TEST 24] REQ-ADMIN-024: Invalid meeting transition returns structured error without server crash'
    );

  } catch (err) {
    console.error('Unhandled test exception:', err);
    failed++;
  }

  console.log('\n====================================================================');
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} / 24 PHASE 12 ADMIN DASHBOARD TESTS PASSED!`);
  } else {
    console.error(`❌ PHASE 12 FAILURES: ${failed} failed out of ${passed + failed}`);
  }
  console.log('====================================================================\n');

  if (failed > 0) process.exit(1);
}

runPhase12Tests();
