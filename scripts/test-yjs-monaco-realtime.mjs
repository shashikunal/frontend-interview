// scripts/test-yjs-monaco-realtime.mjs
import { io } from 'socket.io-client';
import * as Y from 'yjs';

const SOCKET_URL = 'http://localhost:5173';
const SOCKET_PATH = '/api/socket';

console.log('🧪 =========================================================================');
console.log('🧪 STARTING E2E AUTOMATED YJS + MONACO REALTIME ACCEPTANCE TEST SUITE');
console.log('🧪 Target:', `${SOCKET_URL}${SOCKET_PATH}`);
console.log('🧪 =========================================================================\n');

function toUint8Array(data) {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (data?.buffer instanceof ArrayBuffer) {
    return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength || data.buffer.byteLength);
  }
  if (Array.isArray(data)) return new Uint8Array(data);
  if (typeof data === 'string') {
    try {
      const bin = Buffer.from(data, 'base64');
      return new Uint8Array(bin.buffer, bin.byteOffset, bin.byteLength);
    } catch (_) {}
  }
  return new Uint8Array(data || []);
}

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

  const sessionA = `sess_yjs_a_${Date.now()}`;
  const sessionB = `sess_yjs_b_${Date.now()}`;

  const studentA = createClient('StudentA', 'candidate');
  const studentB = createClient('StudentB', 'candidate');
  const admin = createClient('AdminMonitor', 'admin');

  // Wait for all sockets to connect
  await Promise.all([
    new Promise((resolve) => studentA.on('connect', resolve)),
    new Promise((resolve) => studentB.on('connect', resolve)),
    new Promise((resolve) => admin.on('connect', resolve)),
  ]);

  console.log('✅ Sockets connected & authenticated: StudentA, StudentB, AdminMonitor\n');

  // --------------------------------------------------------------------------
  // TEST 1: Student joins session and Admin subscribes with initial Yjs sync
  // --------------------------------------------------------------------------
  console.log('▶ [TEST 1] Initial Session Join & Yjs Document State Hydration...');
  try {
    const studentYDoc = new Y.Doc();
    const studentText = studentYDoc.getText('solution.js');
    studentText.insert(0, '// Initial Code Starter\n');

    await new Promise((resolve, reject) => {
      studentA.emit('session:join', {
        sessionId: sessionA,
        questionId: 'JS-P001',
        questionTitle: 'Two Sum Problem',
        language: 'javascript',
        initialCode: studentText.toString(),
      }, (ack) => {
        if (ack?.success) resolve();
        else reject(new Error(ack?.error || 'Join failed'));
      });
    });

    const adminYDoc = new Y.Doc();

    const subResult = await new Promise((resolve, reject) => {
      admin.emit('monitor:subscribe', { sessionId: sessionA }, (ack) => {
        if (ack?.success) resolve(ack);
        else reject(new Error(ack?.error || 'Subscribe failed'));
      });
    });

    if (!subResult.docState) {
      throw new Error('Server did not return docState upon monitor:subscribe');
    }

    Y.applyUpdate(adminYDoc, toUint8Array(subResult.docState), 'remote');
    const adminInitialText = adminYDoc.getText('solution.js').toString();

    if (!adminInitialText.includes('// Initial Code Starter')) {
      throw new Error(`Admin docState mismatch: expected "// Initial Code Starter", got "${adminInitialText}"`);
    }

    console.log('  ✔ Admin subscribed and hydrated initial Yjs state:');
    console.log('    ', JSON.stringify(adminInitialText.trim()));
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 1:', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 2: Character-by-character live typing propagation over Yjs
  // --------------------------------------------------------------------------
  console.log('\n▶ [TEST 2] Character-by-Character Live Typing (Yjs CRDT)...');
  try {
    const studentYDoc = new Y.Doc();
    const adminYDoc = new Y.Doc();

    // Hook student YDoc updates to emit yjs:update
    studentYDoc.on('update', (update, origin) => {
      if (origin !== 'remote') {
        studentA.emit('yjs:update', {
          sessionId: sessionA,
          update,
          fileId: 'solution.js',
        });
      }
    });

    // Hook admin to apply updates
    admin.on('yjs:update', (data) => {
      if (data.sessionId === sessionA) {
        Y.applyUpdate(adminYDoc, toUint8Array(data.update), 'remote');
      }
    });

    const studentText = studentYDoc.getText('solution.js');
    const keystrokes = ['f', 'u', 'n', 'c', 't', 'i', 'o', 'n', ' ', 's', 'o', 'l', 'v', 'e', '(', ')', ' ', '{', '}'];

    for (const char of keystrokes) {
      studentText.insert(studentText.length, char);
      await sleep(15); // simulate human typing speed
    }

    await sleep(200); // allow network relay

    const finalAdminText = adminYDoc.getText('solution.js').toString();
    if (finalAdminText !== 'function solve() {}') {
      throw new Error(`Expected "function solve() {}", received "${finalAdminText}"`);
    }

    console.log('  ✔ Character-by-character updates streamed and reconstructed in Admin Y.Doc:');
    console.log('    ', JSON.stringify(finalAdminText));
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 2:', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 3: Multi-File Yjs Document Synchronization
  // --------------------------------------------------------------------------
  console.log('\n▶ [TEST 3] Multi-File Synchronization on Single Session Y.Doc...');
  try {
    const studentYDoc = new Y.Doc();
    const adminYDoc = new Y.Doc();

    studentYDoc.on('update', (update, origin) => {
      if (origin !== 'remote') {
        studentA.emit('yjs:update', {
          sessionId: sessionA,
          update,
        });
      }
    });

    admin.on('yjs:update', (data) => {
      if (data.sessionId === sessionA) {
        Y.applyUpdate(adminYDoc, toUint8Array(data.update), 'remote');
      }
    });

    // Write to multiple files on the SAME Y.Doc
    studentYDoc.getText('index.js').insert(0, 'console.log("App starting");');
    studentYDoc.getText('utils.js').insert(0, 'export const add = (a, b) => a + b;');
    studentYDoc.getText('styles.css').insert(0, 'body { background: #000; }');

    await sleep(200);

    const adminIndex = adminYDoc.getText('index.js').toString();
    const adminUtils = adminYDoc.getText('utils.js').toString();
    const adminStyles = adminYDoc.getText('styles.css').toString();

    if (!adminIndex.includes('App starting') || !adminUtils.includes('export const add') || !adminStyles.includes('#000')) {
      throw new Error(`Multi-file mismatch. index: "${adminIndex}", utils: "${adminUtils}", styles: "${adminStyles}"`);
    }

    console.log('  ✔ Multi-file Y.Doc sync verified: index.js, utils.js, styles.css all present.');
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 3:', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 4: Admin Disconnect & State Recovery (yjs:sync-request)
  // --------------------------------------------------------------------------
  console.log('\n▶ [TEST 4] Admin Disconnect & Reconnect State Recovery...');
  try {
    // Disconnect admin socket
    admin.disconnect();
    await sleep(100);

    // Student makes offline edits while admin is disconnected
    const studentYDoc = new Y.Doc();
    studentYDoc.on('update', (update) => {
      studentA.emit('yjs:update', {
        sessionId: sessionA,
        update,
        fileId: 'solution.js',
      });
    });

    studentYDoc.getText('solution.js').insert(0, 'const RECOVERY_KEY = 9999;\n');
    await sleep(200);

    // Reconnect admin and re-subscribe to sessionA room
    admin.connect();
    await new Promise((resolve) => admin.on('connect', resolve));
    await new Promise((resolve) => admin.emit('monitor:subscribe', { sessionId: sessionA }, resolve));

    // Admin asks for full state sync
    const syncRes = await new Promise((resolve) => {
      admin.emit('yjs:sync-request', { sessionId: sessionA }, resolve);
    });

    const recoveredYDoc = new Y.Doc();
    Y.applyUpdate(recoveredYDoc, toUint8Array(syncRes.docState), 'remote');

    const recoveredCode = recoveredYDoc.getText('solution.js').toString();
    if (!recoveredCode.includes('RECOVERY_KEY = 9999')) {
      throw new Error(`Recovery failed. Content: "${recoveredCode}"`);
    }

    console.log('  ✔ Admin reconnected and recovered latest Yjs document state without loss:');
    console.log('    ', JSON.stringify(recoveredCode.slice(0, 40)));
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 4:', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 5: Question & Execution Telemetry Relay
  // --------------------------------------------------------------------------
  console.log('\n▶ [TEST 5] Realtime Question & Execution Status Relay...');
  try {
    let questionReceived = null;
    let runResultReceived = null;

    admin.on('student:question-change', (data) => {
      if (data.sessionId === sessionA) questionReceived = data;
    });

    admin.on('student:run-result', (data) => {
      if (data.sessionId === sessionA) runResultReceived = data;
    });

    studentA.emit('student:question-change', {
      sessionId: sessionA,
      questionId: 'JS-P002',
      questionTitle: 'Memoize Function',
      timestamp: Date.now(),
    });

    studentA.emit('student:run-result', {
      sessionId: sessionA,
      questionId: 'JS-P002',
      status: 'success',
      passed: 6,
      total: 6,
      runtimeMs: 38,
      timestamp: Date.now(),
    });

    await sleep(200);

    if (questionReceived?.questionId !== 'JS-P002' || runResultReceived?.passed !== 6) {
      throw new Error('Question or run result not relayed properly');
    }

    console.log('  ✔ Realtime telemetry events verified: Q2 Memoize & 6/6 passed in 38ms');
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 5:', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 6: Multi-Student Room Isolation (Session A vs Session B)
  // --------------------------------------------------------------------------
  console.log('\n▶ [TEST 6] Multi-Student Room Isolation (Session A vs Session B)...');
  try {
    let leakedToAdmin = false;

    // Student B joins session B
    await new Promise((resolve) => {
      studentB.emit('session:join', {
        sessionId: sessionB,
        questionId: 'DSA-001',
        questionTitle: 'Binary Search',
        initialCode: '// Secret Code of Student B',
      }, resolve);
    });

    // Admin is subscribed ONLY to session A
    const adminSessionBListener = (data) => {
      if (data.sessionId === sessionB) {
        leakedToAdmin = true;
      }
    };

    admin.on('yjs:update', adminSessionBListener);

    // Student B emits yjs:update in session B
    studentB.emit('yjs:update', {
      sessionId: sessionB,
      update: new Uint8Array([1, 2, 3, 4]),
      fileId: 'solution.js',
    });

    await sleep(300);
    admin.off('yjs:update', adminSessionBListener);

    if (leakedToAdmin) {
      throw new Error('CRITICAL SECURITY LEAK: Session B packet reached Session A subscriber!');
    }

    console.log('  ✔ Strict room isolation confirmed: 0 packets leaked between rooms.');
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 6:', err.message);
  }

  // --------------------------------------------------------------------------
  // TEST 7: Authorization Enforcement (Candidate cannot monitor)
  // --------------------------------------------------------------------------
  console.log('\n▶ [TEST 7] Security Authorization Enforcement...');
  try {
    let rejected = false;

    await new Promise((resolve) => {
      studentA.emit('monitor:subscribe', { sessionId: sessionB }, (ack) => {
        if (!ack?.success && ack?.error?.includes('Forbidden')) {
          rejected = true;
        }
        resolve();
      });
    });

    if (!rejected) {
      throw new Error('Security check failed: candidate was not rejected from monitor:subscribe');
    }

    console.log('  ✔ Security verified: Candidate blocked from subscribing to monitor rooms.');
    passedCount++;
  } catch (err) {
    console.error('  ❌ FAILED TEST 7:', err.message);
  }

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------
  studentA.disconnect();
  studentB.disconnect();
  admin.disconnect();

  console.log('\n=========================================================================');
  if (passedCount === totalTests) {
    console.log(`🏆 ALL ACCEPTANCE TESTS PASSED: ${passedCount}/${totalTests}`);
  } else {
    console.log(`⚠️ SUITE FINISHED WITH FAILURES: ${passedCount}/${totalTests} Passed`);
  }
  console.log('=========================================================================\n');

  process.exit(passedCount === totalTests ? 0 : 1);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
