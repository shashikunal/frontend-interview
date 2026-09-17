import assert from 'assert';
import { tokenService } from '../server/auth/tokenService.ts';
import {
  requireAuthMiddleware,
  requireRoleMiddleware,
  requirePermissionMiddleware,
} from '../server/auth/rbacMiddleware.ts';

async function runPhase1AuthRBACTests() {
  console.log('🧪 Starting Phase 1: Authentication, Token Security & RBAC Test Suite...\n');
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

  // ─── 1. TOKEN GENERATION & SIGNATURE ──────────────────────────────────────
  test('REQ-AUTH-001: TokenService generates valid HMAC-SHA256 JWT with standard claims', () => {
    const payload = {
      userId: 'usr_cand_001',
      userEmail: 'alex@example.com',
      userName: 'Alex Rivera',
      userRole: 'candidate',
      meetingId: 'meet_test_123',
      meetingRole: 'PARTICIPANT',
      permissions: ['meetings:participate'],
    };

    const tokenData = tokenService.generateMeetingToken(payload, 300);
    assert(tokenData.token, 'Token must be generated');
    assert(tokenData.tokenId, 'Unique tokenId (jti) must exist');
    assert(tokenData.expiresAt > Math.floor(Date.now() / 1000), 'Expiration must be in future');

    const parts = tokenData.token.split('.');
    assert.strictEqual(parts.length, 3, 'JWT must have header.payload.signature');
  });

  test('REQ-AUTH-001: Valid token verifies successfully and returns typed claims', () => {
    const payload = {
      userId: 'usr_admin_007',
      userEmail: 'admin@interviewprep.com',
      userName: 'Admin User',
      userRole: 'admin',
      meetingId: 'meet_secure_888',
      meetingRole: 'HOST',
      permissions: ['admin:all', 'meetings:all'],
    };

    const { token } = tokenService.generateMeetingToken(payload, 300);
    const verification = tokenService.verifyMeetingToken(token);

    assert.strictEqual(verification.valid, true, 'Verification must succeed');
    assert.strictEqual(verification.claims?.userId, 'usr_admin_007');
    assert.strictEqual(verification.claims?.userRole, 'admin');
    assert.strictEqual(verification.claims?.meetingRole, 'HOST');
    assert.strictEqual(verification.claims?.meetingId, 'meet_secure_888');
  });

  test('REQ-AUTH-001: Tampered token payload fails with INVALID_SIGNATURE', () => {
    const payload = {
      userId: 'usr_cand_001',
      userEmail: 'alex@example.com',
      userName: 'Alex',
      userRole: 'candidate',
      meetingId: 'meet_123',
      meetingRole: 'PARTICIPANT',
      permissions: [],
    };

    const { token } = tokenService.generateMeetingToken(payload, 300);
    const parts = token.split('.');
    // Maliciously tamper with payload: alter role to 'admin'
    const tamperedPayload = Buffer.from(JSON.stringify({ ...payload, userRole: 'admin' })).toString('base64url');
    const tamperedToken = `${parts[0]}.${tamperedPayload}.${parts[2]}`;

    const verification = tokenService.verifyMeetingToken(tamperedToken);
    assert.strictEqual(verification.valid, false, 'Tampered token must be rejected');
    assert.strictEqual(verification.errorCode, 'INVALID_SIGNATURE');
  });

  test('REQ-AUTH-001: Token signed with unauthorized secret fails verification', () => {
    const payload = {
      userId: 'usr_cand_001',
      userEmail: 'alex@example.com',
      userName: 'Alex',
      userRole: 'candidate',
      meetingId: 'meet_123',
      meetingRole: 'PARTICIPANT',
      permissions: [],
    };

    const { token } = tokenService.generateMeetingToken(payload, 300, 'unauthorized_attacker_secret_key');
    const verification = tokenService.verifyMeetingToken(token); // verifies with official secret

    assert.strictEqual(verification.valid, false, 'Foreign signature must fail');
    assert.strictEqual(verification.errorCode, 'INVALID_SIGNATURE');
  });

  test('REQ-AUTH-001: Expired token fails with EXPIRED error code', () => {
    const payload = {
      userId: 'usr_cand_001',
      userEmail: 'alex@example.com',
      userName: 'Alex',
      userRole: 'candidate',
      meetingId: 'meet_123',
      meetingRole: 'PARTICIPANT',
      permissions: [],
    };

    // Issue token expired 10 seconds ago
    const { token } = tokenService.generateMeetingToken(payload, -10);
    const verification = tokenService.verifyMeetingToken(token);

    assert.strictEqual(verification.valid, false, 'Expired token must fail');
    assert.strictEqual(verification.errorCode, 'EXPIRED');
  });

  test('REQ-AUTH-001: Explicitly revoked token fails with REVOKED error code', () => {
    const payload = {
      userId: 'usr_cand_001',
      userEmail: 'alex@example.com',
      userName: 'Alex',
      userRole: 'candidate',
      meetingId: 'meet_123',
      meetingRole: 'PARTICIPANT',
      permissions: [],
    };

    const { token, tokenId, expiresAt } = tokenService.generateMeetingToken(payload, 300);
    // Before revocation: valid
    assert.strictEqual(tokenService.verifyMeetingToken(token).valid, true);

    // Revoke by jti
    tokenService.revokeToken(tokenId, expiresAt);

    // After revocation: rejected
    const verification = tokenService.verifyMeetingToken(token);
    assert.strictEqual(verification.valid, false, 'Revoked token must fail');
    assert.strictEqual(verification.errorCode, 'REVOKED');
  });

  test('REQ-AUTH-001: Refresh tokens support single-use rotation and invalidation', () => {
    const userId = 'usr_cand_001';
    const initialRefresh = tokenService.generateRefreshToken(userId);
    assert(initialRefresh, 'Initial refresh token must be issued');

    // First rotation: succeeds and returns new token
    const rotation1 = tokenService.rotateRefreshToken(initialRefresh);
    assert.strictEqual(rotation1.valid, true);
    assert.strictEqual(rotation1.userId, userId);
    assert(rotation1.newRefreshToken, 'Rotated token must exist');

    // Replay attack / reuse attempt on old token: rejected!
    const reuseAttempt = tokenService.rotateRefreshToken(initialRefresh);
    assert.strictEqual(reuseAttempt.valid, false, 'Replayed refresh token must be rejected');
  });

  // ─── 2. SERVER-SIDE RBAC MIDDLEWARE ───────────────────────────────────────
  await asyncTest('REQ-RBAC-002: requireAuthMiddleware blocks requests missing Authorization header (401)', async () => {
    let statusCode = 0;
    let jsonBody = null;

    const req = { headers: {} };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };
    let nextCalled = false;

    await requireAuthMiddleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody.code, 'MISSING_TOKEN');
    assert.strictEqual(nextCalled, false, 'next() must NOT be called on auth failure');
  });

  await asyncTest('REQ-RBAC-002: requireAuthMiddleware succeeds on valid Bearer token and attaches user context', async () => {
    const { token } = tokenService.generateMeetingToken({
      userId: 'usr_auth_ok',
      userEmail: 'valid@example.com',
      userName: 'Valid User',
      userRole: 'candidate',
      meetingId: 'meet_999',
      meetingRole: 'PARTICIPANT',
      permissions: ['read:data'],
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    let nextCalled = false;

    await requireAuthMiddleware(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true, 'next() must be called on valid token');
    assert.strictEqual(req.user.id, 'usr_auth_ok');
    assert.strictEqual(req.user.role, 'candidate');
  });

  test('REQ-RBAC-001 & REQ-RBAC-002: requireRoleMiddleware blocks non-admin user on admin-only route with 403 Forbidden', () => {
    let statusCode = 0;
    let jsonBody = null;

    const req = {
      user: {
        id: 'usr_candidate_attempt',
        email: 'user@example.com',
        role: 'candidate',
        permissions: [],
      },
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };
    let nextCalled = false;

    const adminGuard = requireRoleMiddleware(['admin']);
    adminGuard(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 403, 'Must return 403 Forbidden for non-admin');
    assert.strictEqual(jsonBody.code, 'FORBIDDEN');
    assert.strictEqual(nextCalled, false, 'next() must NOT be called for unauthorized role');
  });

  test('REQ-RBAC-001 & REQ-RBAC-002: requireRoleMiddleware allows verified admin user (200 / next)', () => {
    const req = {
      user: {
        id: 'usr_admin_authorized',
        email: 'admin@interviewprep.com',
        role: 'admin',
        permissions: ['admin:all'],
      },
    };
    const res = {};
    let nextCalled = false;

    const adminGuard = requireRoleMiddleware(['admin']);
    adminGuard(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true, 'Admin must be granted access');
  });

  test('REQ-RBAC-002: requirePermissionMiddleware strictly checks granular capabilities', () => {
    let statusCode = 0;
    let jsonBody = null;

    const req = {
      user: {
        id: 'usr_cand_noperm',
        role: 'candidate',
        permissions: ['questions:read'],
      },
    };
    const res = {
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };
    let nextCalled = false;

    const manageGuard = requirePermissionMiddleware('meetings:manage');
    manageGuard(req, res, () => { nextCalled = true; });

    assert.strictEqual(statusCode, 403);
    assert.strictEqual(jsonBody.code, 'INSUFFICIENT_PERMISSIONS');
    assert.strictEqual(nextCalled, false);

    // Now test with user having that permission
    req.user.permissions.push('meetings:manage');
    let allowed = false;
    manageGuard(req, res, () => { allowed = true; });
    assert.strictEqual(allowed, true);
  });

  // ─── 3. HTTP ENDPOINT INTEGRATION ─────────────────────────────────────────
  await asyncTest('REQ-AUTH-001: POST /api/v1/auth/token endpoint issues signed meeting token via API handler', async () => {
    const { default: handler } = await import('../api/v1/auth/token.js');

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      body: {
        meetingId: 'meet_e2e_live',
        userId: 'usr_e2e_cand',
        userName: 'E2E Candidate',
        userRole: 'candidate',
      },
      headers: {},
    };

    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return res; },
      json: (data) => { jsonBody = data; return res; },
    };

    await handler(req, res);

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonBody.success, true);
    assert(jsonBody.token, 'Must return JWT token');
    assert.strictEqual(jsonBody.meetingRole, 'PARTICIPANT');

    // Verify token with TokenService
    const verification = tokenService.verifyMeetingToken(jsonBody.token);
    assert.strictEqual(verification.valid, true);
    assert.strictEqual(verification.claims?.meetingId, 'meet_e2e_live');
  });

  console.log(`\n🎉 Phase 1 Test Results: All ${passed}/${total} tests PASSED with zero failures!`);
}

runPhase1AuthRBACTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
