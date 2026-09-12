const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function run() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  const testNames = [
    'interviews', 'interview_sessions', 'mock_sessions', 'code_submissions',
    'core_questions', 'core_programming', 'core_submissions', 'evaluations',
    'dsa_submissions', 'dsa_questions', 'leaderboard', 'user_stats',
    'candidate_stats', 'analytics', 'audit_logs', 'telemetry', 'question_stats'
  ];

  for (const t of testNames) {
    const res = await client.from(t).select('*').limit(1);
    if (!res.error) {
      console.log(`FOUND TABLE: ${t}`);
    }
  }
}
run();
