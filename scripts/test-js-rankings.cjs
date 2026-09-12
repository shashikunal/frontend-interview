const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8';

async function testLeaderboard() {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  await client.auth.signInWithPassword({ email: 'admin@interviewprep.com', password: 'Admin@9999' });

  const content = fs.readFileSync('src/components/machinecoding/data/machineCodingCatalog.ts', 'utf8');
  const idRegex = /"id":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"category":\s*"([^"]+)"/g;
  const qMap = {};
  for (const m of content.matchAll(idRegex)) {
    qMap[m[1]] = { title: m[2], category: m[3] };
  }

  const { data: subs } = await client.from('submissions').select('*');
  const { data: profiles } = await client.from('profiles').select('*');
  const profMap = new Map(profiles.map(p => [p.id, p]));

  // Is Core Programming: JS-P questions OR JavaScript catalog category
  const isCP = (s) => {
    const qid = String(s.question_id || '');
    const u = qid.toUpperCase();
    if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return true;
    if (qMap[qid]?.category === 'JavaScript') return true;
    return false;
  };

  const cpSubs = subs.filter(isCP);
  console.log('Total CP / JavaScript Submissions:', cpSubs.length);

  // Group by candidate
  const candidateMap = new Map();
  for (const s of cpSubs) {
    const uid = s.user_id;
    if (!candidateMap.has(uid)) {
      const p = profMap.get(uid);
      candidateMap.set(uid, {
        userId: uid,
        name: p?.full_name || 'Candidate',
        email: p?.email || '',
        total: 0,
        accepted: 0,
        solvedQuestions: new Set(),
        scores: []
      });
    }
    const c = candidateMap.get(uid);
    c.total++;
    if (s.status === 'accepted') {
      c.accepted++;
      c.solvedQuestions.add(s.question_id);
    }
    c.scores.push(Number(s.score || 0));
  }

  const ranked = Array.from(candidateMap.values()).map(c => {
    const avgScore = Math.round(c.scores.reduce((a, b) => a + b, 0) / c.scores.length);
    const accuracy = Math.round((c.accepted / c.total) * 100);
    return {
      name: c.name,
      email: c.email,
      solved: c.solvedQuestions.size,
      totalSubmissions: c.total,
      accuracy,
      avgScore
    };
  }).sort((a, b) => b.solved - a.solved || b.avgScore - a.avgScore);

  console.log('\n--- RANKINGS (with all real JavaScript submissions included) ---');
  ranked.forEach((r, idx) => {
    console.log(`#${idx + 1}: ${r.name} (${r.email}) | Solved: ${r.solved} | Total Subs: ${r.totalSubmissions} | Accuracy: ${r.accuracy}% | Avg Score: ${r.avgScore}`);
  });
}
testLeaderboard();
