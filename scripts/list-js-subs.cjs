const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function listJsQuestions() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  const content = fs.readFileSync('src/components/machinecoding/data/machineCodingCatalog.ts', 'utf8');
  const idRegex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
  const qMap = {};
  for (const m of content.matchAll(idRegex)) {
    qMap[m[1]] = { title: m[2], category: m[3] };
  }

  const { data: subs } = await client.from('submissions').select('*');
  const jsSubs = subs.filter(s => qMap[s.question_id]?.category === 'JavaScript');
  console.log('Total submissions with question category JavaScript:', jsSubs.length);

  const qCounts = {};
  for (const s of jsSubs) {
    const qid = s.question_id;
    if (!qCounts[qid]) qCounts[qid] = { title: qMap[qid].title, count: 0, lang: s.language };
    qCounts[qid].count++;
  }
  console.log('JavaScript questions in submissions:');
  console.log(qCounts);
}
listJsQuestions();
