const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function auditCoreProgramming() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  console.log('=== CORE PROGRAMMING READ-ONLY AUDIT ===\n');

  // 1. Inspect all distinct question_ids in submissions table
  const { data: subs, error: subErr } = await client.from('submissions').select('*');
  if (subErr) {
    console.error('Error fetching submissions:', subErr.message);
    return;
  }
  console.log('Total Submissions in DB:', subs.length);

  // Group by question_id prefix/pattern
  const cpSubs = [];
  const mcSubs = [];
  const dsaSubs = [];
  const otherSubs = [];

  for (const s of subs) {
    const qid = String(s.question_id || '');
    const qUpper = qid.toUpperCase();
    if (qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP') || (s.language === 'javascript' && qUpper.startsWith('JS'))) {
      cpSubs.push(s);
    } else if (qUpper.startsWith('DSA') || (!qUpper.startsWith('Q') && !qUpper.startsWith('FJP') && /^\d+$/.test(qid))) {
      dsaSubs.push(s);
    } else if (qUpper.startsWith('Q') || qUpper.startsWith('MC')) {
      mcSubs.push(s);
    } else {
      otherSubs.push(s);
    }
  }

  console.log('\nSubmissions by Category:');
  console.log('  Core Programming (JS-P / JSP / CP):', cpSubs.length);
  console.log('  Machine Coding (Q... / MC...):', mcSubs.length);
  console.log('  DSA / LeetCode (DSA... / numeric):', dsaSubs.length);
  console.log('  Other:', otherSubs.length);

  console.log('\n--- Detail of ALL Core Programming Submissions in DB ---');
  cpSubs.forEach((s, idx) => {
    console.log(`[${idx+1}] ID: ${s.id} | User: ${s.user_id} | QID: ${s.question_id} | Status: ${s.status} | Score: ${s.score} | Lang: ${s.language} | Created: ${s.created_at}`);
  });

  // 2. Inspect question_attempts table for Core Programming
  const { data: attempts, error: attErr } = await client.from('question_attempts').select('*');
  if (attErr) {
    console.error('Error fetching question_attempts:', attErr.message);
    return;
  }
  console.log('\nTotal question_attempts in DB:', attempts.length);

  const cpAttempts = attempts.filter(a => {
    const qUpper = String(a.question_id || '').toUpperCase();
    return qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP');
  });

  console.log('Core Programming Attempts in DB:', cpAttempts.length);
  cpAttempts.forEach((a, idx) => {
    console.log(`[${idx+1}] ID: ${a.id} | User: ${a.user_id} | QID: ${a.question_id} | Status: ${a.status} | Count: ${a.attempt_count} | Created: ${a.created_at}`);
  });

  // 3. Inspect user_question_progress table for Core Programming
  const { data: prog, error: progErr } = await client.from('user_question_progress').select('*');
  if (!progErr && prog) {
    const cpProg = prog.filter(p => {
      const qUpper = String(p.question_id || '').toUpperCase();
      return qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP');
    });
    console.log('\nCore Programming user_question_progress in DB:', cpProg.length);
    cpProg.forEach((p, idx) => {
      console.log(`[${idx+1}] ID: ${p.id} | User: ${p.user_id} | QID: ${p.question_id} | Status: ${p.status} | BestScore: ${p.best_score}`);
    });
  }

  // 4. Candidate activity breakdown for Core Programming
  const cpUsers = new Set(cpSubs.map(s => s.user_id));
  console.log('\nDistinct Candidates with Core Programming Submissions in DB:', cpUsers.size);
  for (const u of cpUsers) {
    const userSubs = cpSubs.filter(s => s.user_id === u);
    console.log(`  Candidate ${u}: ${userSubs.length} submissions across questions:`, userSubs.map(s => s.question_id));
  }
}
auditCoreProgramming();
