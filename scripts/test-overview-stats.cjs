const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function test() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  const { data: subsData } = await client.from('submissions').select('id, question_id, status, score');
  let cpSubs = 0;
  let cpPassed = 0;
  let cpFailed = 0;

  for (const s of subsData) {
    const qid = String(s.question_id || '').toUpperCase();
    if (qid.startsWith('JS-P') || qid.startsWith('JSP') || qid.startsWith('CP')) {
      cpSubs++;
      if (s.status === 'accepted' || s.status === 'Accepted') cpPassed++;
      else cpFailed++;
    }
  }

  console.log('Direct Supabase Submissions Stats for Core Programming:');
  console.log('  Total CP Submissions:', cpSubs);
  console.log('  Passed CP Submissions:', cpPassed);
  console.log('  Failed CP Submissions:', cpFailed);
}
test();
