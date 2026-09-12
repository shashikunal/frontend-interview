const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function test() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  // Test fetch for user 8a231dd5...
  const { data: subs1 } = await client.from('submissions').select('*').eq('user_id', '8a231dd5-d2e7-4f02-9b5a-4b0de7de5914');
  const cp1 = subs1.filter(s => (s.question_id || '').toUpperCase().startsWith('JS-P'));
  console.log('User 8a231dd5... CP subs:', cp1.length);

  // Test fetch for user b636e88f...
  const { data: subs2 } = await client.from('submissions').select('*').eq('user_id', 'b636e88f-bdb5-4bda-9116-67114cb16bf3');
  const cp2 = subs2.filter(s => (s.question_id || '').toUpperCase().startsWith('JS-P'));
  console.log('User b636e88f... CP subs:', cp2.length);

  // What about any other user?
  const { data: allSubs } = await client.from('submissions').select('*');
  const allCP = allSubs.filter(s => (s.question_id || '').toUpperCase().startsWith('JS-P'));
  console.log('Total CP subs across all users in DB:', allCP.length);
}
test();
