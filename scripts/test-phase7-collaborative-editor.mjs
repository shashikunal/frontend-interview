/**
 * Test Suite: Phase 7 In-Meeting Collaborative Monaco Code Editor & Execution Sandbox
 * Validates Document State, Monotonic Versioning, Multi-Party Synchronization,
 * Language Switching, Interviewer RBAC Lock, VM Sandbox Execution, and REST Endpoints.
 */

import assert from 'assert';
import { editorService, BUILTIN_PROBLEM_TEMPLATES, DEFAULT_LANGUAGE_STARTERS } from '../server/meetings/editorService.ts';
import { tokenService } from '../server/auth/tokenService.ts';
import editorApiHandler from '../api/v1/meetings/editor.js';

async function runPhase7EditorTests() {
  console.log('🧪 Starting Phase 7: Collaborative Code Editor & Sandbox Tests...\n');
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

  const meetingId = 'meet_phase7_test_room';

  const hostUser = {
    id: 'usr_interviewer_p7',
    email: 'interviewer@interviewprep.com',
    name: 'Lead Interviewer',
    role: 'admin',
    meetingRole: 'HOST',
    permissions: ['admin:all'],
  };

  const candidateUser = {
    id: 'usr_candidate_p7',
    email: 'candidate@example.com',
    name: 'Fullstack Candidate',
    role: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };

  // 1. Document Initialization
  test('1. Document Initialization: initializes default Two Sum problem with v1', () => {
    editorService.clearAll();
    const doc = editorService.getOrCreateDocument(meetingId);
    assert.strictEqual(doc.meetingId, meetingId);
    assert.strictEqual(doc.version, 1);
    assert.strictEqual(doc.readOnly, false);
    assert.strictEqual(doc.language, 'javascript');
    assert.strictEqual(doc.problemTemplateId, 'two-sum');
    assert.ok(doc.code.includes('function twoSum'));
    assert.strictEqual(doc.activeUsers.length, 0);
  });

  // 2. Code Synchronization
  test('2. Code Synchronization: updates code buffer and increments monotonic version', () => {
    const updatedCode = `function twoSum(nums, target) {
  // Candidate implementation
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`;
    const doc = editorService.syncCode(meetingId, updatedCode, candidateUser.id, candidateUser.name);
    assert.strictEqual(doc.version, 2);
    assert.strictEqual(doc.code, updatedCode);
    assert.strictEqual(doc.lastModifiedBy, candidateUser.id);
    assert.strictEqual(doc.lastModifiedByName, candidateUser.name);
  });

  // 3. Language Switching
  test('3. Language Switching: changes language and loads language starter', () => {
    const doc = editorService.setLanguage(meetingId, 'python', candidateUser.id, candidateUser.name, true);
    assert.strictEqual(doc.language, 'python');
    assert.strictEqual(doc.version, 3);
    assert.ok(doc.code.includes('def solution():'));
  });

  // 4. Host Lock Permissions (RBAC)
  test('4. Host Lock Permissions: non-host cannot lock; candidate blocked when locked', () => {
    // Non-host attempts to lock
    assert.throws(
      () => {
        editorService.toggleLock(meetingId, true, candidateUser.id, candidateUser.name, candidateUser.meetingRole);
      },
      /Only the Meeting Host or Co-Host can toggle the editor lock/
    );

    // Host locks the editor
    const lockedDoc = editorService.toggleLock(meetingId, true, hostUser.id, hostUser.name, hostUser.meetingRole);
    assert.strictEqual(lockedDoc.readOnly, true);
    assert.strictEqual(lockedDoc.version, 4);

    // Candidate attempts to sync code while locked -> throws
    assert.throws(
      () => {
        editorService.syncCode(meetingId, '// should fail', candidateUser.id, candidateUser.name);
      },
      /Editor is currently locked by the host/
    );

    // Candidate attempts to change language while locked -> throws
    assert.throws(
      () => {
        editorService.setLanguage(meetingId, 'go', candidateUser.id, candidateUser.name);
      },
      /Editor is locked/
    );

    // Host unlocks
    const unlockedDoc = editorService.toggleLock(meetingId, false, hostUser.id, hostUser.name, hostUser.meetingRole);
    assert.strictEqual(unlockedDoc.readOnly, false);
    assert.strictEqual(unlockedDoc.version, 5);
  });

  // 5. Problem Template Switching
  test('5. Problem Template Switching: loads problem template and updates starter code', () => {
    const { document: doc, template } = editorService.loadTemplate(meetingId, 'debounce', hostUser.id, hostUser.name);
    assert.strictEqual(doc.problemTemplateId, 'debounce');
    assert.strictEqual(template.title, 'Debounce Function');
    assert.ok(doc.code.includes('function debounce'));
    assert.strictEqual(doc.version, 6);
  });

  // 6. Reset Code
  test('6. Reset Code: resets code back to initial template starter', () => {
    // Make a dirty edit
    editorService.syncCode(meetingId, '// some scratch code', candidateUser.id, candidateUser.name);
    // Reset code
    const resetDoc = editorService.resetCode(meetingId, candidateUser.id, candidateUser.name);
    assert.ok(resetDoc.code.includes('function debounce'));
    assert.strictEqual(resetDoc.version, 8);
  });

  // 7. Presence Tracking
  test('7. Presence Tracking: updates cursor line and column for active users', () => {
    const doc = editorService.updatePresence(meetingId, candidateUser.id, candidateUser.name, 12, 4);
    assert.strictEqual(doc.activeUsers.length, 1);
    assert.strictEqual(doc.activeUsers[0].userId, candidateUser.id);
    assert.strictEqual(doc.activeUsers[0].cursorLine, 12);
    assert.strictEqual(doc.activeUsers[0].cursorColumn, 4);
  });

  // 8. Sandbox Execution (Console Capture & Return Value)
  test('8. Sandbox Execution: executes JavaScript and captures stdout and return value', () => {
    const testCode = `
console.log("Processing batch inputs...");
console.log("Candidate algorithm initialized");
const res = [1, 2, 3].map(x => x * 10);
res;
`;
    const result = editorService.executeCode(meetingId, candidateUser.id, candidateUser.name, testCode);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.output.length, 2);
    assert.strictEqual(result.output[0], 'Processing batch inputs...');
    assert.strictEqual(result.returnValue, '[10,20,30]');
    assert.ok(typeof result.durationMs === 'number');
  });

  // 9. Interactive Test Case Runner
  test('9. Interactive Test Case Runner: evaluates Two Sum against test cases', () => {
    editorService.loadTemplate(meetingId, 'two-sum', hostUser.id, hostUser.name);
    const solutionCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
  return [];
}
`;
    const result = editorService.executeCode(meetingId, candidateUser.id, candidateUser.name, solutionCode);
    assert.strictEqual(result.success, true);
    assert.ok(result.testCases && result.testCases.length > 0);
    assert.strictEqual(result.allPassed, true);
    assert.strictEqual(result.testCases.every(tc => tc.passed === true), true);
  });

  // 10. Runtime Error Handling
  test('10. Runtime Error Handling: safely captures runtime exception without crash', () => {
    const failingCode = `
const obj = null;
obj.someMethod();
`;
    const result = editorService.executeCode(meetingId, candidateUser.id, candidateUser.name, failingCode);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.allPassed, false);
    assert.ok(result.error.includes('Cannot read properties of null') || result.error.includes('null is not an object'));
  });

  // 11. REST API GET Endpoint
  await asyncTest('11. REST API GET: returns editor snapshot with valid meeting token', async () => {
    const meetingToken = tokenService.generateMeetingToken({
      userId: candidateUser.id,
      userEmail: candidateUser.email,
      userName: candidateUser.name,
      userRole: candidateUser.role,
      meetingId,
      meetingRole: candidateUser.meetingRole,
    }).token;

    const mockReq = {
      method: 'GET',
      headers: { authorization: `Bearer ${meetingToken}` },
      query: { meetingId },
    };

    let statusCode = 0;
    let jsonResult = null;
    const mockRes = {
      setHeader: () => {},
      status: (code) => {
        statusCode = code;
        return mockRes;
      },
      json: (data) => {
        jsonResult = data;
        return mockRes;
      },
    };

    await editorApiHandler(mockReq, mockRes);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(jsonResult.success, true);
    assert.strictEqual(jsonResult.document.meetingId, meetingId);
    assert.ok(Array.isArray(jsonResult.templates));
  });

  // 12. REST API POST Actions & RBAC
  await asyncTest('12. REST API POST: handles SYNC_CODE, TOGGLE_LOCK RBAC, and RUN_CODE', async () => {
    const candidateToken = tokenService.generateMeetingToken({
      userId: candidateUser.id,
      userEmail: candidateUser.email,
      userName: candidateUser.name,
      userRole: candidateUser.role,
      meetingId,
      meetingRole: candidateUser.meetingRole,
    }).token;

    const hostToken = tokenService.generateMeetingToken({
      userId: hostUser.id,
      userEmail: hostUser.email,
      userName: hostUser.name,
      userRole: hostUser.role,
      meetingId,
      meetingRole: hostUser.meetingRole,
    }).token;

    // Helper for calling API
    async function callApi(method, body, token) {
      let code = 0;
      let data = null;
      const req = {
        method,
        headers: { authorization: `Bearer ${token}` },
        body,
      };
      const res = {
        setHeader: () => {},
        status: (c) => {
          code = c;
          return res;
        },
        json: (d) => {
          data = d;
          return res;
        },
      };
      await editorApiHandler(req, res);
      return { code, data };
    }

    // 1. SYNC_CODE by candidate
    const syncRes = await callApi('POST', {
      action: 'SYNC_CODE',
      meetingId,
      code: 'function add(a, b) { return a + b; }',
    }, candidateToken);
    assert.strictEqual(syncRes.code, 200);
    assert.strictEqual(syncRes.data.success, true);
    assert.strictEqual(syncRes.data.document.code, 'function add(a, b) { return a + b; }');

    // 2. TOGGLE_LOCK by candidate -> rejected with 400
    const failLockRes = await callApi('POST', {
      action: 'TOGGLE_LOCK',
      meetingId,
      readOnly: true,
    }, candidateToken);
    assert.strictEqual(failLockRes.code, 400);

    // 3. TOGGLE_LOCK by Host -> accepted with 200
    const hostLockRes = await callApi('POST', {
      action: 'TOGGLE_LOCK',
      meetingId,
      readOnly: true,
    }, hostToken);
    assert.strictEqual(hostLockRes.code, 200);
    assert.strictEqual(hostLockRes.data.document.readOnly, true);

    // 4. RUN_CODE via REST API
    const runRes = await callApi('POST', {
      action: 'RUN_CODE',
      meetingId,
      code: 'console.log("REST API Runner active"); 42 * 2;',
    }, candidateToken);
    assert.strictEqual(runRes.code, 200);
    assert.strictEqual(runRes.data.result.success, true);
    assert.strictEqual(runRes.data.result.returnValue, '84');
  });

  console.log(`\n🎉 Phase 7 Editor Suite Complete: ${passed}/${total} tests passed.\n`);
}

runPhase7EditorTests().catch(err => {
  console.error('Fatal error running Phase 7 tests:', err);
  process.exit(1);
});
