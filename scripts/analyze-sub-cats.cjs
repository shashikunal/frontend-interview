const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function analyzeSubmissions() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  // Read MACHINE_CODING_CATALOG
  const content = fs.readFileSync('src/components/machinecoding/data/machineCodingCatalog.ts', 'utf8');
  const idRegex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
  const qMap = {};
  for (const m of content.matchAll(idRegex)) {
    qMap[m[1]] = { title: m[2], category: m[3] };
  }

  // Fetch all 612 submissions
  const { data: subs } = await client.from('submissions').select('*');
  console.log('Total submissions:', subs.length);

  const subCatBreakdown = {};
  for (const s of subs) {
    const qid = String(s.question_id);
    const cat = qMap[qid] ? qMap[qid].category : (qid.startsWith('JS-P') ? 'Core Programming' : (qid.startsWith('DSA') || /^\d+$/.test(qid) ? 'DSA' : 'Unknown'));
    subCatBreakdown[cat] = (subCatBreakdown[cat] || 0) + 1;
  }

  console.log('Submissions broken down by their question category in catalog:');
  console.log(subCatBreakdown);

  // Check language of submissions
  const langBreakdown = {};
  for (const s of subs) {
    langBreakdown[s.language] = (langBreakdown[s.language] || 0) + 1;
  }
  console.log('Submissions broken down by language column:', langBreakdown);
}
analyzeSubmissions();
