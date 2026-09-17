/**
 * Test Suite: Phase 5 Multi-Party In-Meeting Chat & Direct Messaging
 * Validates Public Messaging, 1:1 Direct Message Privacy Isolation,
 * Threaded Replies, Emoji Reactions, RBAC Chat Enforcement, and REST Chat Endpoints.
 */

import assert from 'assert';
import { chatService } from '../server/meetings/chatService.ts';
import { meetingService } from '../server/meetings/meetingService.ts';
import { tokenService } from '../server/auth/tokenService.ts';

async function runPhase5ChatMessagingTests() {
  console.log('🧪 Starting Phase 5: In-Meeting Chat & Direct Messaging Tests...\n');
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
    id: 'usr_host_p5',
    email: 'host@interviewprep.com',
    name: 'Lead Interviewer',
    role: 'admin',
    meetingRole: 'HOST',
    permissions: ['admin:all'],
  };

  const candA = {
    id: 'usr_cand_a',
    email: 'cand.a@example.com',
    name: 'Candidate Alice',
    role: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };

  const candB = {
    id: 'usr_cand_b',
    email: 'cand.b@example.com',
    name: 'Candidate Bob',
    role: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };

  const candC = {
    id: 'usr_cand_c',
    email: 'cand.c@example.com',
    name: 'Candidate Charlie',
    role: 'candidate',
    meetingRole: 'PARTICIPANT',
    permissions: [],
  };

  // Setup: Active meeting with chat enabled
  const { meeting: activeMeeting } = meetingService.createMeeting(hostUser, {
    title: 'Concurrent Go Channels & Mutex Review',
    meetingType: 'COLLABORATIVE',
    settings: { allowChat: true },
  });

  // Setup: Meeting with chat disabled
  const { meeting: noChatMeeting } = meetingService.createMeeting(hostUser, {
    title: 'Silent Assessment Exam',
    meetingType: 'INTERVIEW',
    settings: { allowChat: false },
  });

  chatService.clearStore();

  // ─── 1. PUBLIC MESSAGING ──────────────────────────────────────────────────
  let publicMsgId = '';
  test('REQ-CHAT-001: Participant sends public broadcast message to ALL', () => {
    const res = chatService.sendMessage(candA, {
      meetingId: activeMeeting.id,
      recipientId: 'ALL',
      content: 'Hello team, what is the expected time complexity for problem 2?',
      messageType: 'TEXT',
    });

    assert.strictEqual(res.success, true);
    assert(res.message);
    assert.strictEqual(res.message.senderId, candA.id);
    assert.strictEqual(res.message.recipientId, 'ALL');
    publicMsgId = res.message.id;

    // Both Bob and Charlie can see this public broadcast message
    const bobInbox = chatService.getMessagesForUser(candB.id, activeMeeting.id);
    assert(bobInbox.some(m => m.id === publicMsgId));

    const charlieInbox = chatService.getMessagesForUser(candC.id, activeMeeting.id);
    assert(charlieInbox.some(m => m.id === publicMsgId));
  });

  // ─── 2. DIRECT 1:1 MESSAGE PRIVACY ISOLATION ──────────────────────────────
  let directMsgId = '';
  test('REQ-CHAT-002: Direct 1:1 message is isolated: only sender and recipient can read it', () => {
    const res = chatService.sendMessage(candA, {
      meetingId: activeMeeting.id,
      recipientId: candB.id,
      content: 'Hey Bob, did you notice the race condition in line 42?',
      messageType: 'TEXT',
    });

    assert.strictEqual(res.success, true);
    assert(res.message);
    assert.strictEqual(res.message.recipientId, candB.id);
    directMsgId = res.message.id;

    // Sender (Alice) can see it
    const aliceInbox = chatService.getMessagesForUser(candA.id, activeMeeting.id);
    assert(aliceInbox.some(m => m.id === directMsgId));

    // Recipient (Bob) can see it
    const bobInbox = chatService.getMessagesForUser(candB.id, activeMeeting.id);
    assert(bobInbox.some(m => m.id === directMsgId));

    // Third-Party (Charlie) CANNOT see it
    const charlieInbox = chatService.getMessagesForUser(candC.id, activeMeeting.id);
    assert(!charlieInbox.some(m => m.id === directMsgId), 'Charlie must NOT see Alice-Bob direct message');
  });

  // ─── 3. CODE SNIPPET FORMATTING & THREADED REPLIES ────────────────────────
  test('REQ-CHAT-003: Threaded reply includes parent snippet and supports CODE formatting', () => {
    const res = chatService.sendMessage(candB, {
      meetingId: activeMeeting.id,
      recipientId: 'ALL',
      content: 'func solve(ch <-chan int) { for v := range ch { fmt.Println(v) } }',
      messageType: 'CODE',
      codeLanguage: 'go',
      replyToMessageId: publicMsgId,
    });

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.message?.messageType, 'CODE');
    assert.strictEqual(res.message?.replyToMessageId, publicMsgId);
    assert(res.message?.replyToSnippet?.includes('Hello team'));
  });

  // ─── 4. EMOJI REACTIONS ───────────────────────────────────────────────────
  test('REQ-CHAT-004: Emoji reactions are added, aggregated, and toggle off on repeat', () => {
    // 1. Bob reacts with thumbs up
    const addRes = chatService.addReaction(candB.id, {
      meetingId: activeMeeting.id,
      messageId: publicMsgId,
      emoji: '👍',
    });

    assert.strictEqual(addRes.success, true);
    assert(addRes.reactions?.['👍'].includes(candB.id));

    // 2. Charlie reacts with thumbs up as well
    const charlieReaction = chatService.addReaction(candC.id, {
      meetingId: activeMeeting.id,
      messageId: publicMsgId,
      emoji: '👍',
    });
    assert.strictEqual(charlieReaction.reactions?.['👍'].length, 2);

    // 3. Bob clicks thumbs up again (toggles off)
    const toggleRes = chatService.addReaction(candB.id, {
      meetingId: activeMeeting.id,
      messageId: publicMsgId,
      emoji: '👍',
    });
    assert.strictEqual(toggleRes.reactions?.['👍'].length, 1);
    assert(!toggleRes.reactions?.['👍'].includes(candB.id));
  });

  // ─── 5. RBAC & VALIDATION CONSTRAINTS ─────────────────────────────────────
  test('REQ-CHAT-005: Chat is rejected when disabled in meeting settings (403 CHAT_DISABLED)', () => {
    const res = chatService.sendMessage(candA, {
      meetingId: noChatMeeting.id,
      content: 'Trying to chat in silent meeting...',
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'CHAT_DISABLED');
  });

  test('REQ-CHAT-006: Blank or whitespace content is rejected with EMPTY_CONTENT', () => {
    const res = chatService.sendMessage(candA, {
      meetingId: activeMeeting.id,
      content: '     \n   ',
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'EMPTY_CONTENT');
  });

  test('REQ-CHAT-007: Content exceeding 4,000 characters is rejected with CONTENT_TOO_LONG', () => {
    const hugeMessage = 'A'.repeat(4001);
    const res = chatService.sendMessage(candA, {
      meetingId: activeMeeting.id,
      content: hugeMessage,
    });

    assert.strictEqual(res.success, false);
    assert.strictEqual(res.code, 'CONTENT_TOO_LONG');
  });

  // ─── 6. MESSAGE DELETION PERMISSIONS ──────────────────────────────────────
  test('REQ-CHAT-008: Sender can delete their own message; third-party cannot', () => {
    const sendRes = chatService.sendMessage(candA, {
      meetingId: activeMeeting.id,
      content: 'Typo message to delete',
    });
    const msgId = sendRes.message.id;

    // Bob tries to delete Alice's message -> Forbidden
    const bobDel = chatService.deleteMessage(candB, msgId);
    assert.strictEqual(bobDel.success, false);
    assert.strictEqual(bobDel.code, 'FORBIDDEN');

    // Alice deletes her own message -> Success
    const aliceDel = chatService.deleteMessage(candA, msgId);
    assert.strictEqual(aliceDel.success, true);
  });

  test('REQ-CHAT-009: Meeting Host can moderate and delete any participant message', () => {
    const sendRes = chatService.sendMessage(candC, {
      meetingId: activeMeeting.id,
      content: 'Disruptive comment',
    });
    const msgId = sendRes.message.id;

    // Host deletes Charlie's message -> Success
    const hostDel = chatService.deleteMessage(hostUser, msgId);
    assert.strictEqual(hostDel.success, true);
  });

  // ─── 7. REST API: GET & POST /api/v1/meetings/chat ────────────────────────
  await asyncTest('REQ-CHAT-010: POST /api/v1/meetings/chat sends message via REST API (201 Created)', async () => {
    const { default: handler } = await import('../api/v1/meetings/chat.js');

    const token = tokenService.generateMeetingToken({
      userId: candA.id,
      userEmail: candA.email,
      userName: candA.name,
      userRole: 'candidate',
      meetingId: activeMeeting.id,
      meetingRole: 'PARTICIPANT',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        action: 'SEND',
        meetingId: activeMeeting.id,
        content: 'Testing REST chat endpoint',
        recipientId: 'ALL',
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
    assert.strictEqual(jsonBody.message.content, 'Testing REST chat endpoint');
  });

  await asyncTest('REQ-CHAT-011: POST /api/v1/meetings/chat handles REACTION action via REST API (200 OK)', async () => {
    const { default: handler } = await import('../api/v1/meetings/chat.js');

    const token = tokenService.generateMeetingToken({
      userId: candB.id,
      userEmail: candB.email,
      userName: candB.name,
      userRole: 'candidate',
      meetingId: activeMeeting.id,
      meetingRole: 'PARTICIPANT',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: {
        action: 'REACTION',
        meetingId: activeMeeting.id,
        messageId: publicMsgId,
        emoji: '🚀',
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
    assert(jsonBody.reactions['🚀'].includes(candB.id));
  });

  await asyncTest('REQ-CHAT-012: GET /api/v1/meetings/chat fetches messages with direct message isolation', async () => {
    const { default: handler } = await import('../api/v1/meetings/chat.js');

    // Charlie fetches messages
    const charlieToken = tokenService.generateMeetingToken({
      userId: candC.id,
      userEmail: candC.email,
      userName: candC.name,
      userRole: 'candidate',
      meetingId: activeMeeting.id,
      meetingRole: 'PARTICIPANT',
    }).token;

    let statusCode = 0;
    let jsonBody = null;

    const req = {
      method: 'GET',
      headers: { authorization: `Bearer ${charlieToken}` },
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
    assert(Array.isArray(jsonBody.messages));
    // Charlie cannot see Alice-Bob direct message
    assert(!jsonBody.messages.some(m => m.id === directMsgId));
  });

  console.log(`\n🎉 Phase 5 Test Results: All ${passed}/${total} tests PASSED with zero failures!`);
}

runPhase5ChatMessagingTests().catch(err => {
  console.error('Phase 5 Test Suite Failed:', err);
  process.exit(1);
});
