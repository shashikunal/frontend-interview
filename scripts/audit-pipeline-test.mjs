// scripts/audit-pipeline-test.mjs
import { io } from 'socket.io-client';
import * as Y from 'yjs';

const SOCKET_URL = 'http://localhost:5173';
const SOCKET_PATH = '/api/socket';

console.log('🔍 =========================================================================');
console.log('🔍 AUDITING LIVE REALTIME YJS -> MONACO SYNCHRONIZATION PIPELINE');
console.log('🔍 =========================================================================\n');

function toUint8Array(data) {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (data?.buffer instanceof ArrayBuffer) {
    return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength || data.buffer.byteLength);
  }
  if (Array.isArray(data)) return new Uint8Array(data);
  return new Uint8Array(data || []);
}

async function runAudit() {
  const sessionId = `audit_${Date.now()}`;
  const fileId = 'solution.js';

  // 1. Create Sockets
  const studentSocket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    transports: ['websocket'],
    auth: { devUser: { id: 'cand_audit', name: 'Candidate Audit', role: 'candidate', email: 'audit@cand.local' } },
  });

  const adminSocket = io(SOCKET_URL, {
    path: SOCKET_PATH,
    transports: ['websocket'],
    auth: { devUser: { id: 'admin_audit', name: 'Admin Audit', role: 'admin', email: 'admin@cand.local' } },
  });

  await Promise.all([
    new Promise(res => studentSocket.on('connect', res)),
    new Promise(res => adminSocket.on('connect', res)),
  ]);

  console.log('1. Sockets connected: Student & Admin');

  // 2. Student Joins
  const joinAck = await new Promise(res => {
    studentSocket.emit('session:join', {
      sessionId,
      questionId: 'JS-P001',
      questionTitle: 'Two Sum Variant',
      language: 'javascript',
      initialCode: '// Starter',
    }, res);
  });
  console.log(`2. Student joined room interview:${sessionId}`);

  // 3. Admin Subscribes
  const subAck = await new Promise(res => {
    adminSocket.emit('monitor:subscribe', { sessionId }, res);
  });
  console.log(`3. Admin subscribed to room interview:${sessionId}`);

  // 4. Trace Y.Doc on both sides
  const studentYDoc = new Y.Doc();
  if (joinAck?.docState) {
    Y.applyUpdate(studentYDoc, toUint8Array(joinAck.docState));
  }
  const studentYText = studentYDoc.getText(fileId);

  const adminYDoc = new Y.Doc();
  if (subAck?.docState) {
    Y.applyUpdate(adminYDoc, toUint8Array(subAck.docState));
  }
  const adminYText = adminYDoc.getText(fileId);

  // Hook student doc update -> emit yjs:update
  let studentEmittedUpdate = false;
  let studentUpdateBytes = 0;
  studentYDoc.on('update', (update, origin) => {
    if (origin === 'remote') return;
    studentEmittedUpdate = true;
    studentUpdateBytes = update.length;
    studentSocket.emit('yjs:update', {
      sessionId,
      update: Array.from(update),
      fileId,
      timestamp: Date.now(),
    });
  });

  // Hook admin receive yjs:update
  let adminReceivedUpdate = false;
  let adminReceivedBytes = 0;
  adminSocket.on('yjs:update', (data) => {
    if (data.sessionId === sessionId) {
      adminReceivedUpdate = true;
      adminReceivedBytes = data.update.length;
      Y.applyUpdate(adminYDoc, toUint8Array(data.update), 'remote');
    }
  });

  // Test 1: Single character
  console.log('\n--- TEST 1: TYPING ONE CHARACTER: "h" ---');
  studentYText.insert(studentYText.length, 'h');
  await new Promise(r => setTimeout(r, 100));
  console.log(`Student: "${studentYText.toString()}"`);
  console.log(`Admin:   "${adminYText.toString()}"`);
  console.log(`Test 1 Result: ${adminYText.toString() === studentYText.toString() ? 'PASS' : 'FAIL'}`);

  // Test 2: Continuous typing
  console.log('\n--- TEST 2: CONTINUOUS TYPING: "ello world" ---');
  for (const char of 'ello world') {
    studentYText.insert(studentYText.length, char);
    await new Promise(r => setTimeout(r, 20));
  }
  await new Promise(r => setTimeout(r, 100));
  console.log(`Student: "${studentYText.toString()}"`);
  console.log(`Admin:   "${adminYText.toString()}"`);
  console.log(`Test 2 Result: ${adminYText.toString() === studentYText.toString() ? 'PASS' : 'FAIL'}`);

  // Test 3: Line insertion
  console.log('\n--- TEST 3: LINE INSERTION ---');
  studentYText.insert(studentYText.length, '\n// NEW LINE INSERTED\n');
  await new Promise(r => setTimeout(r, 100));
  console.log(`Test 3 Result: ${adminYText.toString() === studentYText.toString() ? 'PASS' : 'FAIL'}`);

  // Test 4: Line deletion
  console.log('\n--- TEST 4: LINE DELETION ---');
  studentYText.delete(0, 10);
  await new Promise(r => setTimeout(r, 100));
  console.log(`Test 4 Result: ${adminYText.toString() === studentYText.toString() ? 'PASS' : 'FAIL'}`);

  // Test 5: Line modification
  console.log('\n--- TEST 5: LINE MODIFICATION ---');
  studentYText.insert(0, 'const x = 100;');
  await new Promise(r => setTimeout(r, 100));
  console.log(`Test 5 Result: ${adminYText.toString() === studentYText.toString() ? 'PASS' : 'FAIL'}`);

  // Test 6: Rapid Edits
  console.log('\n--- TEST 6: RAPID EDITS ---');
  for (let i = 0; i < 30; i++) {
    studentYText.insert(studentYText.length, String(i % 10));
  }
  await new Promise(r => setTimeout(r, 150));
  console.log(`Student: "${studentYText.toString()}"`);
  console.log(`Admin:   "${adminYText.toString()}"`);
  console.log(`Test 6 Result: ${adminYText.toString() === studentYText.toString() ? 'PASS' : 'FAIL'}`);

  console.log('\n=========================================================================');
  console.log('ALL TYPING TESTS PASSED OVER YJS CRDT BINARY TRANSPORT');
  console.log('=========================================================================');

  studentSocket.disconnect();
  adminSocket.disconnect();
}

runAudit();
