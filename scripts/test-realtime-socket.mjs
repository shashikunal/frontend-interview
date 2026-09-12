// scripts/test-realtime-socket.mjs
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5173';
const SOCKET_PATH = '/api/socket';

console.log('🧪 =========================================================');
console.log('🧪 STARTING E2E AUTOMATED SOCKET.IO ACCEPTANCE TEST SUITE');
console.log('🧪 Target:', `${SOCKET_URL}${SOCKET_PATH}`);
console.log('🧪 =========================================================\n');

function createClient(name, role, customUser) {
  return io(SOCKET_URL, {
    path: SOCKET_PATH,
    transports: ['websocket'],
    auth: {
      devUser: customUser || {
        id: `user_${role}_${name.toLowerCase()}`,
        name,
        role,
        email: `${name.toLowerCase()}@test.local`,
      },
    },
    reconnection: false,
    timeout: 5000,
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runTests() {
  let passedCount = 0;
  const totalTests = 7;

  // ──────────────────────────────────────────────────────────────────────────
  // SETUP CLIENTS
  // ──────────────────────────────────────────────────────────────────────────
  const studentA = createClient('StudentA', 'candidate', {
    id: 'cand_student_a',
    name: 'Alice Student',
    role: 'candidate',
    email: 'alice@test.local',
  });

  const studentB = createClient('StudentB', 'candidate', {
    id: 'cand_student_b',
    name: 'Bob Student',
    role: 'candidate',
    email: 'bob@test.local',
  });

  const adminMonitor = createClient('AdminAuditor', 'admin', {
    id: 'admin_auditor',
    name: 'Platform Admin',
    role: 'admin',
    email: 'admin@test.local',
  });

  await Promise.all([
    new Promise((resolve) => studentA.on('connect', resolve)),
    new Promise((resolve) => studentB.on('connect', resolve)),
    new Promise((resolve) => adminMonitor.on('connect', resolve)),
  ]);

  console.log('✅ Sockets connected & authenticated: StudentA, StudentB, AdminMonitor\n');

  const sessionA = 'sess_test_a_' + Date.now();
  const sessionB = 'sess_test_b_' + Date.now();

  // Student A joins session A
  await new Promise((resolve) => {
    studentA.emit(
      'session:join',
      {
        sessionId: sessionA,
        questionId: 'JS-P001',
        questionTitle: 'Two Sum Variant',
        language: 'javascript',
        initialCode: '// Starter code',
      },
      () => resolve()
    );
  });

  // Student B joins session B
  await new Promise((resolve) => {
    studentB.emit(
      'session:join',
      {
        sessionId: sessionB,
        questionId: 'DSA-001',
        questionTitle: 'Reverse Linked List',
        language: 'javascript',
        initialCode: '// Starter B',
      },
      () => resolve()
    );
  });

  // Admin subscribes to session A
  await new Promise((resolve) => {
    adminMonitor.emit('monitor:subscribe', { sessionId: sessionA }, () => resolve());
  });

  await sleep(100);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1 — LIVE TYPING
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 1] Live Typing Verification...');
  const test1Promise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TEST 1 Timeout: No code-change event received')), 3000);
    adminMonitor.on('student:code-change', (data) => {
      if (data.sessionId === sessionA && data.code === 'const hello = "world";') {
        clearTimeout(timer);
        resolve(data);
      }
    });
  });

  studentA.emit('student:code-change', {
    sessionId: sessionA,
    fileId: 'solution.js',
    language: 'javascript',
    code: 'const hello = "world";',
    cursor: { line: 1, column: 24 },
    version: 1,
    timestamp: Date.now(),
  });

  const test1Result = await test1Promise;
  console.log('  ✔ Received code change in real time:', test1Result.code);
  passedCount++;

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2 — QUESTION CHANGE
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 2] Question Change Verification...');
  const test2Promise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TEST 2 Timeout: No question-change event received')), 3000);
    adminMonitor.on('student:question-change', (data) => {
      if (data.sessionId === sessionA && data.questionId === 'JS-P002') {
        clearTimeout(timer);
        resolve(data);
      }
    });
  });

  studentA.emit('student:question-change', {
    sessionId: sessionA,
    questionId: 'JS-P002',
    questionTitle: 'Memoize Function',
    track: 'core-programming',
    timestamp: Date.now(),
  });

  const test2Result = await test2Promise;
  console.log('  ✔ Received question change in real time:', test2Result.questionId, test2Result.questionTitle);
  passedCount++;

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3 — CODE EXECUTION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 3] Code Execution Events Verification...');
  let runStartSeen = false;

  const test3Promise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TEST 3 Timeout: Execution events not received')), 3000);

    adminMonitor.on('student:run-start', (data) => {
      if (data.sessionId === sessionA) runStartSeen = true;
    });

    adminMonitor.on('student:run-result', (data) => {
      if (data.sessionId === sessionA && data.status === 'success' && data.passed === 5 && data.total === 5) {
        if (runStartSeen) {
          clearTimeout(timer);
          resolve(data);
        }
      }
    });
  });

  studentA.emit('student:run-start', {
    sessionId: sessionA,
    questionId: 'JS-P002',
    language: 'javascript',
    timestamp: Date.now(),
  });

  await sleep(50);

  studentA.emit('student:run-result', {
    sessionId: sessionA,
    questionId: 'JS-P002',
    status: 'success',
    passed: 5,
    total: 5,
    runtimeMs: 42,
    output: 'All tests passed cleanly',
    timestamp: Date.now(),
  });

  const test3Result = await test3Promise;
  console.log('  ✔ Received RUN_START followed by RUN_RESULT:', test3Result.status, `${test3Result.passed}/${test3Result.total} passed in ${test3Result.runtimeMs}ms`);
  passedCount++;

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4 — DISCONNECT & RECONNECT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 4] Student Disconnect & Reconnect Verification...');
  const test4DisconnectPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TEST 4 Timeout: Disconnect status not received')), 3000);
    adminMonitor.on('student:status', (data) => {
      if (data.sessionId === sessionA && data.presence === 'disconnected') {
        clearTimeout(timer);
        resolve(data);
      }
    });
  });

  studentA.disconnect();
  await test4DisconnectPromise;
  console.log('  ✔ Admin received student status: DISCONNECTED');

  // Reconnect student A
  const studentAReconnected = createClient('StudentA', 'candidate', {
    id: 'cand_student_a',
    name: 'Alice Student',
    role: 'candidate',
    email: 'alice@test.local',
  });

  await new Promise((resolve) => studentAReconnected.on('connect', resolve));

  const test4ReconnectPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TEST 4 Timeout: Reconnect status not received')), 3000);
    adminMonitor.on('student:status', (data) => {
      if (data.sessionId === sessionA && data.presence === 'online') {
        clearTimeout(timer);
        resolve(data);
      }
    });
  });

  studentAReconnected.emit('session:join', {
    sessionId: sessionA,
    questionId: 'JS-P002',
    questionTitle: 'Memoize Function',
    language: 'javascript',
  });

  await test4ReconnectPromise;
  console.log('  ✔ Admin received student status: LIVE (reconnected)');
  passedCount++;

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5 — ADMIN RECONNECT & STATE RESYNCHRONIZATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 5] Admin Monitor Reconnect & State Resynchronization...');
  adminMonitor.disconnect();

  const newAdminMonitor = createClient('NewAdmin', 'admin', {
    id: 'admin_reconnected',
    name: 'Reconnected Admin',
    role: 'admin',
    email: 'admin_reconnect@test.local',
  });

  await new Promise((resolve) => newAdminMonitor.on('connect', resolve));

  const test5Promise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('TEST 5 Timeout: State resynchronization failed')), 3000);
    newAdminMonitor.on('session:state', (state) => {
      if (state.sessionId === sessionA && state.code === 'const hello = "world";') {
        clearTimeout(timer);
        resolve(state);
      }
    });
  });

  newAdminMonitor.emit('monitor:subscribe', { sessionId: sessionA }, (ack) => {
    if (ack?.state?.code === 'const hello = "world";') {
      // Immediate ack state received
    }
  });

  const test5State = await test5Promise;
  console.log('  ✔ Admin reconnected and received latest restored state:', {
    sessionId: test5State.sessionId,
    code: test5State.code,
    lastExecution: test5State.lastExecution?.status,
  });
  passedCount++;

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6 — MULTI-STUDENT ISOLATION
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 6] Multi-Student Room Isolation Test...');
  let leakedData = false;

  newAdminMonitor.on('student:code-change', (data) => {
    if (data.sessionId === sessionB) {
      leakedData = true;
    }
  });

  // Student B emits code change into session B
  studentB.emit('student:code-change', {
    sessionId: sessionB,
    fileId: 'solution.js',
    language: 'javascript',
    code: 'console.log("SECRET_STUDENT_B_CODE");',
    version: 1,
    timestamp: Date.now(),
  });

  await sleep(400);

  if (leakedData) {
    throw new Error('SECURITY VIOLATION: Student B data leaked into Student A admin monitor!');
  } else {
    console.log('  ✔ Complete Room Isolation Verified: Admin subscribed to session A received zero packets from session B');
    passedCount++;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 7 — SECURITY / AUTHORIZATION ENFORCEMENT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST 7] Security Authorization Enforcement...');
  // Candidate attempts unauthorized admin monitor subscription
  const unauthorizedAttacker = createClient('Attacker', 'candidate', {
    id: 'malicious_user',
    name: 'Attacker Candidate',
    role: 'candidate',
    email: 'attacker@test.local',
  });

  await new Promise((resolve) => unauthorizedAttacker.on('connect', resolve));

  const test7Promise = new Promise((resolve) => {
    unauthorizedAttacker.emit('monitor:subscribe', { sessionId: sessionA }, (ack) => {
      resolve(ack);
    });
  });

  const test7Ack = await test7Promise;
  if (!test7Ack.success && test7Ack.error?.includes('Forbidden')) {
    console.log('  ✔ Server strictly rejected candidate from monitor:subscribe:', test7Ack.error);
    passedCount++;
  } else {
    throw new Error(`Security failed: unauthorized candidate was not rejected! Ack: ${JSON.stringify(test7Ack)}`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CLEANUP & SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  studentAReconnected.disconnect();
  studentB.disconnect();
  newAdminMonitor.disconnect();
  unauthorizedAttacker.disconnect();

  console.log('\n=========================================================');
  console.log(`🏆 ALL ACCEPTANCE TESTS PASSED: ${passedCount}/${totalTests}`);
  console.log('=========================================================\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
