// scripts/test-insert-submission.cjs
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { data: authData } = await supabase.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999',
  });
  const userId = authData.user?.id;
  console.log('Logged in user ID:', userId);

  // Test 1: Insert with category column
  console.log('\nTest 1: Insert into submissions with "category":');
  const res1 = await supabase.from('submissions').insert({
    user_id: userId,
    question_id: 'JS-P001',
    category: 'CORE_PROGRAMMING',
    code: 'function reverse(s) { return s.split("").reverse().join(""); }',
    language: 'javascript',
    status: 'accepted',
    score: 100,
  }).select('id');
  console.log('Result 1 (with category):', res1.error ? res1.error.message : 'SUCCESS! ID: ' + res1.data?.[0]?.id);

  // Test 2: Insert without category column
  console.log('\nTest 2: Insert into submissions without "category":');
  const res2 = await supabase.from('submissions').insert({
    user_id: userId,
    question_id: 'JS-P002',
    code: 'function isPalindrome(s) { return s === s.split("").reverse().join(""); }',
    language: 'javascript',
    status: 'accepted',
    score: 100,
  }).select('id');
  console.log('Result 2 (without category):', res2.error ? res2.error.message : 'SUCCESS! ID: ' + res2.data?.[0]?.id);
}

testInsert().catch(console.error);
