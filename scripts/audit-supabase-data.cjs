// scripts/audit-supabase-data.cjs
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runAudit() {
  await supabase.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999',
  });

  const { data, count, error } = await supabase
    .from('submissions')
    .select('id, user_id, question_id, status, score, created_at', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`=== TOTAL SUBMISSIONS IN SUPABASE: ${count} ===`);

  const breakdown = {};
  const perUser = {};

  data.forEach(r => {
    const q = String(r.question_id || '');
    let cat = 'Machine Coding (Q*)';
    if (q.toUpperCase().startsWith('JS-P') || q.toUpperCase().startsWith('JSP')) cat = 'Core Programming (JS-P*)';
    else if (q.toUpperCase().startsWith('DSA')) cat = 'DSA (DSA*)';
    else if (q.toUpperCase().startsWith('FJP')) cat = 'Frontend JS (FJP*)';
    breakdown[cat] = (breakdown[cat] || 0) + 1;

    perUser[r.user_id] = perUser[r.user_id] || { total: 0, mc: 0, cp: 0, dsa: 0, fjs: 0 };
    perUser[r.user_id].total++;
    if (cat.startsWith('Core')) perUser[r.user_id].cp++;
    else if (cat.startsWith('DSA')) perUser[r.user_id].dsa++;
    else if (cat.startsWith('Frontend')) perUser[r.user_id].fjs++;
    else perUser[r.user_id].mc++;
  });

  console.log('Breakdown by track across ALL submissions:', breakdown);

  console.log('\nPer-user breakdown (top users with submissions):');
  Object.entries(perUser).forEach(([userId, stats]) => {
    console.log(`User ${userId}: total=${stats.total}, CP=${stats.cp}, DSA=${stats.dsa}, MC=${stats.mc}`);
  });

  console.log('\nAll Core Programming rows found in "submissions":');
  const cpRows = data.filter(r => String(r.question_id).toUpperCase().startsWith('JS-P') || String(r.question_id).toUpperCase().startsWith('JSP'));
  console.log(`Count of Core Programming rows: ${cpRows.length}`);
  cpRows.forEach(r => console.log(r));
}

runAudit().catch(console.error);
