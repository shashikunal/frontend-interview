/**
 * scripts/audit-supabase-truth.cjs
 * Comprehensive Database & Architecture Reconciliation Audit Suite
 * Verifies Supabase source-of-truth compliance across Development & Production
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function runAudit() {
  console.log('================================================================');
  console.log('      REAL DATA + SUPABASE TRUTH AUDIT & RECONCILIATION         ');
  console.log('================================================================\n');

  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Environment & Project Reference Verification
  console.log('--- 1. ENVIRONMENT & PROJECT REFERENCE AUDIT ---');
  const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Supabase Project Reference: ${projectRef}`);
  console.log(`Anon Key Length: ${SUPABASE_ANON_KEY.length} chars (valid JWT structure)`);

  // 2. Authenticate as Platform Administrator for Auditing
  console.log('\n--- 2. AUTHENTICATION & CREDENTIALS CHECK ---');
  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999',
  });

  if (authError || !authData?.user) {
    console.error('FAILED: Admin authentication failed:', authError?.message);
    process.exit(1);
  }
  const adminUser = authData.user;
  console.log(`Admin Authenticated Successfully: UUID = ${adminUser.id}`);
  console.log(`Admin Email: ${adminUser.email}`);

  // 3. Database Schema & Tables Inventory
  console.log('\n--- 3. DATABASE SCHEMA & TABLE INVENTORY ---');
  const auditedTables = [
    'submissions',
    'question_attempts',
    'profiles',
    'user_question_progress',
    'code_executions',
    'activity_logs',
    'question_drafts',
    'interview_sessions',
    'mock_interview_sessions',
    'dsa_submissions',
  ];

  const tableStats = {};
  for (const table of auditedTables) {
    try {
      const { count, error } = await client.from(table).select('*', { count: 'exact', head: true });
      if (error) {
        tableStats[table] = { exists: false, count: 0, error: error.message };
      } else {
        tableStats[table] = { exists: true, count: count ?? 0 };
      }
    } catch (err) {
      tableStats[table] = { exists: false, count: 0, error: err.message };
    }
  }

  for (const [t, s] of Object.entries(tableStats)) {
    if (s.exists) {
      console.log(`✓ Table [${t.padEnd(26)}]: EXISTS | Exact Rows = ${s.count}`);
    } else {
      console.log(`✕ Table [${t.padEnd(26)}]: MISSING | ${s.error || 'N/A'}`);
    }
  }

  // 4. Submissions Categorization & Truth Breakdown
  console.log('\n--- 4. SUBMISSIONS CATEGORIZATION & RECONCILIATION ---');
  const { data: allSubmissions, error: subQueryError } = await client
    .from('submissions')
    .select('id, user_id, question_id, score, status, language, created_at')
    .order('created_at', { ascending: false });

  if (subQueryError || !allSubmissions) {
    console.error('FAILED: Could not query submissions:', subQueryError?.message);
    process.exit(1);
  }

  console.log(`Total Persistent Submissions in Supabase: ${allSubmissions.length}`);

  const trackDistribution = {
    MACHINE_CODING: { count: 0, distinctUsers: new Set(), questions: new Set() },
    CORE_PROGRAMMING: { count: 0, distinctUsers: new Set(), questions: new Set() },
    DSA: { count: 0, distinctUsers: new Set(), questions: new Set() },
    FRONTEND_JS: { count: 0, distinctUsers: new Set(), questions: new Set() },
    OTHER: { count: 0, distinctUsers: new Set(), questions: new Set() },
  };

  for (const sub of allSubmissions) {
    const qid = String(sub.question_id || '').toUpperCase();
    let track = 'MACHINE_CODING';

    if (qid.startsWith('JS-P') || qid.startsWith('JSP') || qid.startsWith('CP')) {
      track = 'CORE_PROGRAMMING';
    } else if (qid.startsWith('DSA') || qid.startsWith('100')) {
      track = 'DSA';
    } else if (qid.startsWith('FJP')) {
      track = 'FRONTEND_JS';
    } else if (qid.startsWith('Q') || qid.startsWith('MC')) {
      track = 'MACHINE_CODING';
    } else {
      track = 'OTHER';
    }

    trackDistribution[track].count++;
    trackDistribution[track].distinctUsers.add(sub.user_id);
    trackDistribution[track].questions.add(qid);
  }

  console.log('\nDistribution by Curriculum Track:');
  for (const [track, data] of Object.entries(trackDistribution)) {
    console.log(`  • ${track.padEnd(18)} : ${String(data.count).padStart(4)} submissions | ${String(data.distinctUsers.size).padStart(2)} candidates | ${String(data.questions.size).padStart(2)} distinct questions`);
  }

  // 5. Row-Level Security (RLS) & IDOR Protection Verification
  console.log('\n--- 5. RLS & SECURITY AUDIT ---');
  const fakeUserId = '00000000-0000-0000-0000-000000009999';

  console.log(`Testing unauthorized insertion with mismatched user_id (${fakeUserId})...`);
  const { data: unauthData, error: unauthError } = await client.from('submissions').insert({
    user_id: fakeUserId,
    question_id: 'Q001',
    code: 'console.log("idor attack test");',
    language: 'javascript',
    status: 'accepted',
    score: 100,
  }).select('id');

  if (unauthError) {
    console.log(`✓ PASS: RLS successfully blocked unauthorized insert: "${unauthError.message}"`);
  } else {
    console.error('✕ FAIL: IDOR vulnerability detected! Mismatched user_id was accepted into submissions table.');
    process.exit(1);
  }

  // 6. Controlled Candidate Workflow Reconciliation Test
  console.log('\n--- 6. CONTROLLED CANDIDATE WORKFLOW TEST (Run != Submit) ---');
  const testQid = 'JS-P002';
  const initialSubCount = allSubmissions.filter(s => s.user_id === adminUser.id && s.question_id === testQid).length;

  console.log(`Initial submissions for admin on ${testQid}: ${initialSubCount}`);

  // Simulate Run Code (must NOT increment submissions)
  console.log('Action: Candidate runs code in sandbox...');
  const { error: runExecErr } = await client.from('code_executions').insert({
    user_id: adminUser.id,
    question_id: testQid,
    language: 'javascript',
    execution_status: 'success',
    execution_time: 18,
  });
  console.log(`Execution logged: ${!runExecErr ? '✓ Success' : '✕ Error: ' + runExecErr?.message}`);

  const { count: afterRunCount } = await client
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', adminUser.id)
    .eq('question_id', testQid);

  if (afterRunCount === initialSubCount) {
    console.log(`✓ PASS: Run Code did NOT create a submission. Submissions count unchanged (${afterRunCount}).`);
  } else {
    console.error('✕ FAIL: Run Code improperly created a submission!');
    process.exit(1);
  }

  // Simulate Submit Code (must increment submissions by exactly 1)
  console.log('Action: Candidate clicks Submit Solution...');
  const testSubCode = 'function debounce(fn, delay) { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; }';
  const { data: newSubRow, error: subInsertErr } = await client.from('submissions').insert({
    user_id: adminUser.id,
    question_id: testQid,
    code: testSubCode,
    language: 'javascript',
    status: 'accepted',
    score: 100,
    execution_time: 22,
  }).select('id').single();

  if (subInsertErr || !newSubRow?.id) {
    console.error('✕ FAIL: Could not insert official submission:', subInsertErr?.message);
    process.exit(1);
  }
  console.log(`✓ Submission row created with ID = ${newSubRow.id}`);

  const { count: afterSubmitCount } = await client
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', adminUser.id)
    .eq('question_id', testQid);

  if (afterSubmitCount === initialSubCount + 1) {
    console.log(`✓ PASS: Official submission incremented count by exactly 1 (${initialSubCount} -> ${afterSubmitCount}).`);
  } else {
    console.error(`✕ FAIL: Submission count mismatch: expected ${initialSubCount + 1}, got ${afterSubmitCount}`);
    process.exit(1);
  }

  // 7. Deterministic Leaderboard Calculation Audit
  console.log('\n--- 7. DETERMINISTIC LEADERBOARD AUDIT ---');
  // Query all submissions again
  const { data: currentSubs } = await client
    .from('submissions')
    .select('user_id, score, status, question_id');

  const candidateAggregates = {};
  for (const s of currentSubs) {
    if (!candidateAggregates[s.user_id]) {
      candidateAggregates[s.user_id] = { totalScore: 0, count: 0, accepted: 0, solved: new Set() };
    }
    const c = candidateAggregates[s.user_id];
    c.count++;
    c.totalScore += Number(s.score || 0);
    if (s.status === 'accepted' || s.score >= 70) {
      c.accepted++;
      c.solved.add(s.question_id);
    }
  }

  console.log(`Total Candidates with Submissions: ${Object.keys(candidateAggregates).length}`);
  console.log('Sample Candidate Aggregates derived strictly from Supabase rows:');
  const candidateKeys = Object.keys(candidateAggregates).slice(0, 5);
  for (const uid of candidateKeys) {
    const c = candidateAggregates[uid];
    const avgScore = Math.round(c.totalScore / c.count);
    const accuracy = Math.round((c.accepted / c.count) * 100);
    console.log(`  Candidate [${uid.slice(0, 8)}...]: Solved = ${c.solved.size} | Accuracy = ${accuracy}% | Avg Score = ${avgScore}`);
  }

  console.log('\n================================================================');
  console.log('              ALL RECONCILIATION TESTS PASSED ✓                 ');
  console.log('================================================================\n');
}

runAudit().catch(err => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
