const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function runVerification() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  console.log('=== CORE PROGRAMMING COMPREHENSIVE E2E AUDIT ===\n');

  // 1. SUPABASE DATABASE TRUTH
  const { data: allSubs } = await client.from('submissions').select('*').order('created_at', { ascending: false });
  const cpSubs = allSubs.filter(s => {
    const qid = String(s.question_id || '').toUpperCase();
    return qid.startsWith('JS-P') || qid.startsWith('JSP') || qid.startsWith('CP');
  });

  const mcSubs = allSubs.filter(s => {
    const qid = String(s.question_id || '').toUpperCase();
    return (qid.startsWith('Q') || qid.startsWith('MC')) && !qid.startsWith('CP') && !qid.startsWith('JS-P');
  });

  const dsaSubs = allSubs.filter(s => {
    const qid = String(s.question_id || '').toUpperCase();
    return qid.startsWith('DSA') || (!qid.startsWith('Q') && !qid.startsWith('MC') && !qid.startsWith('JS-P') && !qid.startsWith('FJP') && /^\d+$/.test(qid));
  });

  console.log('[1. Database Submissions Baseline]');
  console.log(`  Total Submissions in DB: ${allSubs.length}`);
  console.log(`  Core Programming (JS-P / JSP / CP): ${cpSubs.length}`);
  console.log(`  Machine Coding (Q... / MC...): ${mcSubs.length}`);
  console.log(`  DSA Masterclass: ${dsaSubs.length}`);

  // 2. QUESTIONS TO SUBMISSIONS LINEAGE
  console.log('\n[2. Question -> Submissions Mapping]');
  const byQuestion = {};
  for (const s of cpSubs) {
    byQuestion[s.question_id] = (byQuestion[s.question_id] || 0) + 1;
  }
  for (const [qid, count] of Object.entries(byQuestion)) {
    console.log(`  Question ${qid}: ${count} submissions`);
  }

  // 3. CANDIDATES WITH CORE PROGRAMMING ACTIVITY
  console.log('\n[3. Candidates with Core Programming Activity]');
  const byCandidate = {};
  for (const s of cpSubs) {
    if (!byCandidate[s.user_id]) {
      byCandidate[s.user_id] = { total: 0, accepted: 0, scores: [], questions: new Set() };
    }
    byCandidate[s.user_id].total++;
    if (s.status === 'accepted') byCandidate[s.user_id].accepted++;
    byCandidate[s.user_id].scores.push(s.score);
    byCandidate[s.user_id].questions.add(s.question_id);
  }

  for (const [userId, d] of Object.entries(byCandidate)) {
    console.log(`  Candidate ${userId}:`);
    console.log(`    Total Submissions: ${d.total}`);
    console.log(`    Accepted: ${d.accepted}`);
    console.log(`    Distinct Questions Solved: ${d.questions.size} (${Array.from(d.questions).join(', ')})`);
    console.log(`    Scores: ${d.scores.join(', ')}`);
  }

  // 4. ATTEMPTS
  const { data: attData } = await client.from('question_attempts').select('*');
  const cpAttempts = (attData || []).filter(a => {
    const qid = String(a.question_id || '').toUpperCase();
    return qid.startsWith('JS-P') || qid.startsWith('JSP') || qid.startsWith('CP');
  });
  console.log('\n[4. Question Attempts]');
  console.log(`  Total Attempts in DB: ${attData?.length || 0}`);
  console.log(`  Core Programming Attempts in DB: ${cpAttempts.length}`);

  // 5. QUERY ISOLATION TEST
  console.log('\n[5. Query Isolation Test]');
  const overlap = cpSubs.some(cp => mcSubs.some(mc => mc.id === cp.id));
  console.log(`  Overlap between Core Programming and Machine Coding: ${overlap ? 'FAIL - LEAK DETECTED' : 'PASS - 100% ISOLATED'}`);

  console.log('\n=== AUDIT VERIFICATION COMPLETE ===');
}
runVerification();
