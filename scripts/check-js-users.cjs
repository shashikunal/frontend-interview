const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function checkJsUsers() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  const content = fs.readFileSync('src/components/machinecoding/data/machineCodingCatalog.ts', 'utf8');
  const idRegex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
  const qMap = {};
  for (const m of content.matchAll(idRegex)) {
    qMap[m[1]] = { title: m[2], category: m[3] };
  }

  const { data: subs } = await client.from('submissions').select('*');
  const jsSubs = subs.filter(s => {
    const qid = String(s.question_id || '');
    return qMap[qid]?.category === 'JavaScript' || qid.toUpperCase().startsWith('JS-P') || qid.toUpperCase().startsWith('JSP') || qid.toUpperCase().startsWith('CP');
  });

  console.log('Total Core Programming / JavaScript submissions:', jsSubs.length);

  const userMap = {};
  for (const s of jsSubs) {
    userMap[s.user_id] = (userMap[s.user_id] || 0) + 1;
  }
  console.log('Distinct users with JavaScript / Core Programming submissions:');
  console.log(userMap);

  // Fetch profiles for these users
  const { data: profiles } = await client.from('profiles').select('id, full_name, email').in('id', Object.keys(userMap));
  const profMap = new Map((profiles || []).map(p => [p.id, p]));

  for (const [uid, count] of Object.entries(userMap)) {
    const p = profMap.get(uid);
    console.log(`  User ${uid}: ${p ? p.full_name + ' (' + p.email + ')' : 'No Profile'} -> ${count} submissions`);
  }
}
checkJsUsers();
