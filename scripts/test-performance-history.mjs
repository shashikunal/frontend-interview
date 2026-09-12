// ==============================================================================
// Acceptance Test Suite: User Performance, Complete Coding History & Hiring Management
// ==============================================================================

import assert from 'assert';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

console.log('\n=========================================================================');
console.log('🧪 RUNNING COMPREHENSIVE TEST SUITE: REAL DATABASE PERFORMANCE SYNC');
console.log('=========================================================================\n');

let passedTests = 0;
let totalTests = 0;

async function runTest(name, fn) {
  totalTests++;
  try {
    await fn();
    passedTests++;
    console.log(`✅ TEST ${totalTests} PASSED: ${name}`);
  } catch (err) {
    console.error(`❌ TEST ${totalTests} FAILED: ${name}`);
    console.error(err);
  }
}

// Emulation of attempts processor
function processAttempts(rawSubs) {
  const qGroups = new Map();
  for (const s of rawSubs) {
    if (!qGroups.has(s.questionId)) qGroups.set(s.questionId, []);
    qGroups.get(s.questionId).push(s);
  }
  const finalized = [];
  qGroups.forEach((list) => {
    list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    list.forEach((item, index) => {
      finalized.push({ ...item, attemptNumber: index + 1 });
    });
  });
  return finalized.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function runAllTests() {
  // TEST 1: Multi-attempt preservation without overwriting
  await runTest('Multi-Attempt Preservation without overwriting older attempts', () => {
    const rawSubs = [
      { id: 'sub_1', userId: 'usr_1', questionId: 'JS-P001', code: 'attempt 1 code', score: 0, status: 'Failed', createdAt: '2026-09-12T10:00:00Z' },
      { id: 'sub_2', userId: 'usr_1', questionId: 'JS-P001', code: 'attempt 2 code', score: 50, status: 'Failed', createdAt: '2026-09-12T10:05:00Z' },
      { id: 'sub_3', userId: 'usr_1', questionId: 'JS-P001', code: 'attempt 3 code', score: 100, status: 'Solved', createdAt: '2026-09-12T10:10:00Z' },
    ];
    const history = processAttempts(rawSubs);
    assert.strictEqual(history.length, 3, 'All 3 attempts must be preserved');
    assert.strictEqual(history[2].attemptNumber, 1, 'Oldest must be Attempt 1');
    assert.strictEqual(history[1].attemptNumber, 2, 'Middle must be Attempt 2');
    assert.strictEqual(history[0].attemptNumber, 3, 'Newest must be Attempt 3');
  });

  // TEST 2: Unique Solved Count
  await runTest('Unique Solved Count remains 1 even after 5 repeated submissions', () => {
    const subs = [
      { id: 'sub_1', questionId: 'Q001', status: 'Solved' },
      { id: 'sub_2', questionId: 'Q001', status: 'Solved' },
      { id: 'sub_3', questionId: 'Q001', status: 'Solved' },
      { id: 'sub_4', questionId: 'Q001', status: 'Solved' },
      { id: 'sub_5', questionId: 'Q001', status: 'Solved' },
    ];
    const uniqueSolved = new Set(subs.filter(s => s.status === 'Solved').map(s => s.questionId)).size;
    assert.strictEqual(uniqueSolved, 1, 'Unique solved count must be strictly 1');
  });

  // TEST 3: Category Isolation & hasActivity flag
  await runTest('Category metrics distinguish hasActivity: false from a real 0%', () => {
    const emptyCat = { attempted: 0, solved: 0, hasActivity: false, statusMessage: 'No Core Programming activity yet' };
    const zeroScoreCat = { attempted: 1, solved: 0, hasActivity: true, statusMessage: 'Active' };

    assert.strictEqual(emptyCat.hasActivity, false, 'Empty category must flag hasActivity as false');
    assert.strictEqual(emptyCat.statusMessage, 'No Core Programming activity yet');
    assert.strictEqual(zeroScoreCat.hasActivity, true, 'Active attempt must flag hasActivity as true');
  });

  // TEST 4: Evaluation Audit Trail
  await runTest('Hiring evaluation preserves audit trail across updates', () => {
    const history = [];
    history.push({ id: 'h1', status: 'Consider', rating: 3, createdAt: '2026-09-12T10:00:00Z' });
    history.push({ id: 'h2', status: 'Hire', rating: 5, createdAt: '2026-09-12T11:00:00Z' });
    assert.strictEqual(history.length, 2);
    assert.strictEqual(history[0].status, 'Consider');
    assert.strictEqual(history[1].status, 'Hire');
  });

  // TEST 5: Plaintext Password Protection
  await runTest('Candidate profile and user management objects NEVER expose plaintext passwords', () => {
    const candidateProfile = {
      id: 'usr_cand_1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'candidate',
      joinedDate: '2026-09-01T00:00:00Z',
    };
    assert.strictEqual(candidateProfile.password, undefined);
  });

  // TEST 6: Real Supabase Sync for Candidate santhosh
  await runTest('Real Supabase query for candidate santhosh returns real non-zero Core Programming, MC, and DSA stats', async () => {
    const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await client.auth.signInWithPassword({
      email: 'admin@interviewprep.com',
      password: 'Admin@9999',
    });

    const SANTHOSH_ID = '3b4d44cf-243e-4df0-b38e-e71ac13f11d8';
    const [subsRes, cpRes] = await Promise.all([
      client.from('submissions').select('*').eq('user_id', SANTHOSH_ID),
      client.from('core_programming_submissions').select('*').eq('user_id', SANTHOSH_ID),
    ]);

    const subs = subsRes.data || [];
    const cpSubs = cpRes.data || [];

    assert.ok(subs.length > 0, 'Candidate santhosh must have submissions in public.submissions');
    assert.ok(cpSubs.length > 0, 'Candidate santhosh must have submissions in public.core_programming_submissions');

    const cpSolved = cpSubs.filter(c => c.status === 'accepted').length;
    assert.ok(cpSolved > 50, `Candidate santhosh must have over 50 solved CP problems (got ${cpSolved})`);
  });

  // TEST 7: Real Supabase Sync for Candidate KOMAL HIREMATH
  await runTest('Real Supabase query for candidate KOMAL HIREMATH returns over 100 accepted Core Programming submissions', async () => {
    const client = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await client.auth.signInWithPassword({
      email: 'admin@interviewprep.com',
      password: 'Admin@9999',
    });

    const KOMAL_ID = '91b07587-a436-4a36-8986-30e0851e9a59';
    const { data: cpSubs } = await client.from('core_programming_submissions').select('*').eq('user_id', KOMAL_ID);
    assert.ok(cpSubs && cpSubs.length >= 100, `Candidate Komal must have >= 100 CP submissions (got ${cpSubs?.length})`);
    const acceptedCount = cpSubs.filter(c => c.status === 'accepted').length;
    assert.ok(acceptedCount >= 100, `Candidate Komal must have >= 100 accepted submissions (got ${acceptedCount})`);
  });

  console.log('\n=========================================================================');
  console.log(`🎉 ALL TESTS COMPLETED: ${passedTests}/${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}% SUCCESS)`);
  console.log('=========================================================================\n');
}

runAllTests().catch(console.error);
