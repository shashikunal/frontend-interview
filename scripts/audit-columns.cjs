const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function run() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  // 4. Check all distinct question_id patterns in submissions table
  const { data: allSubs, error: subErr } = await client.from('submissions').select('id, question_id, user_id, status, score, language, attempt_id, created_at');
  if (subErr) {
    console.error('subErr:', subErr.message);
    return;
  }
  console.log('Total submissions fetched:', allSubs.length);

  // 5. Look for any Core Programming rows where question_id starts with JS-P or JSP or CP
  const cpSubs = allSubs.filter(s => {
    const q = String(s.question_id || '').toUpperCase();
    return q.startsWith('JS-P') || q.startsWith('JSP') || q.startsWith('CP');
  });
  console.log('Core Programming rows found in submissions:', cpSubs.length);
  console.log('Their details:');
  for (const s of cpSubs) {
    console.log(`  id: ${s.id}, qid: ${s.question_id}, attempt_id: ${s.attempt_id}, status: ${s.status}, score: ${s.score}, lang: ${s.language}, user: ${s.user_id}, created: ${s.created_at}`);
  }

  // 6. Check question_attempts for any question_id starting with JS-P or JSP or CP
  const { data: allAttempts, error: attErr } = await client.from('question_attempts').select('id, question_id, user_id, status, started_at, completed_at, attempt_count');
  if (attErr) {
    console.error('attErr:', attErr.message);
    return;
  }
  const cpAttempts = allAttempts.filter(a => {
    const q = String(a.question_id || '').toUpperCase();
    return q.startsWith('JS-P') || q.startsWith('JSP') || q.startsWith('CP');
  });
  console.log('\nCore Programming rows in question_attempts:', cpAttempts.length);
  for (const a of cpAttempts) {
    console.log(`  id: ${a.id}, qid: ${a.question_id}, user: ${a.user_id}, status: ${a.status}`);
  }

  // 7. Check user_question_progress
  const { data: allProg } = await client.from('user_question_progress').select('*');
  const cpProg = (allProg || []).filter(p => {
    const q = String(p.question_id || '').toUpperCase();
    return q.startsWith('JS-P') || q.startsWith('JSP') || q.startsWith('CP');
  });
  console.log('\nCore Programming rows in user_question_progress:', cpProg.length);
  for (const p of cpProg) {
    console.log(`  id: ${p.id}, qid: ${p.question_id}, user: ${p.user_id}, status: ${p.status}, best_score: ${p.best_score}, attempt_count: ${p.attempt_count}`);
  }
}
run();
