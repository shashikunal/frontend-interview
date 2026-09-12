// scripts/test-core-prog-flow.cjs
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFlow() {
  console.log('=== TESTING CORE PROGRAMMING SUBMISSION FLOW ===');

  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999',
  });
  const userId = authData.user?.id;
  console.log('Signed in as Admin / User:', userId);

  // 1. Insert a test Core Programming submission into canonical submissions
  const subData = {
    user_id: userId,
    question_id: 'JS-P003',
    code: 'function fizzBuzz(n) { return n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : n; }',
    language: 'javascript',
    status: 'accepted',
    score: 100,
    execution_time: 14,
    memory_used: 12.5,
  };

  const insertRes = await supabase.from('submissions').insert(subData).select('id');
  console.log('Insert result:', insertRes.error ? insertRes.error.message : 'Inserted ID: ' + insertRes.data?.[0]?.id);

  // 2. Query canonical submissions for this user filtering by JS-P%
  const { data: cpSubmissions, error: fetchErr } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', userId)
    .ilike('question_id', 'JS-P%');

  if (fetchErr) {
    console.error('Fetch error:', fetchErr.message);
  } else {
    console.log(`Successfully fetched ${cpSubmissions.length} Core Programming submissions for user ${userId}!`);
    cpSubmissions.forEach(s => {
      console.log(`  - ID: ${s.id}, QID: ${s.question_id}, Status: ${s.status}, Score: ${s.score}, Date: ${s.created_at}`);
    });
  }
}

testFlow().catch(console.error);
