const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function listAllTables() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  const possibleTables = [
    'core_programming_submissions', 'core_programming_attempts', 'core_submissions',
    'js_submissions', 'javascript_submissions', 'problem_submissions', 'candidate_submissions',
    'programming_attempts', 'code_submissions', 'mock_submissions', 'user_submissions',
    'test_submissions', 'evaluations', 'solutions', 'history'
  ];

  for (const t of possibleTables) {
    const res = await client.from(t).select('*').limit(1);
    if (!res.error) {
      console.log('Table ' + t + ' REALLY EXISTS!');
    }
  }
  console.log('Probe complete.');
}
listAllTables();
