import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function runAuditSummary() {
  await supabase.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  console.log('--- TABLE ROW COUNTS ---')
  const tables = [
    'profiles',
    'submissions',
    'question_attempts',
    'user_question_progress',
    'core_programming_submissions',
    'frontend_js_submissions',
    'frontend_js_attempts',
    'dsa_submissions',
    'activity_logs',
    'mock_question_bank',
    'mock_interview_sessions',
    'mock_interview_answers',
    'mock_answer_evaluations',
    'mock_final_scorecards',
    'mock_candidate_weaknesses'
  ]

  for (const t of tables) {
    const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
    console.log(`${t}: ${count} rows`)
  }

  console.log('\n--- PROFILES ---')
  const { data: profiles } = await supabase.from('profiles').select('*')
  profiles.forEach(p => {
    console.log(`User: ${p.id} | Email: ${p.email} | Name: ${p.full_name} | Role: ${p.role}`)
  })

  console.log('\n--- SUBMISSIONS PER USER IN public.submissions ---')
  const { data: subs } = await supabase.from('submissions').select('user_id, question_id, status, score, created_at')
  const userSubMap = {}
  subs.forEach(s => {
    userSubMap[s.user_id] = userSubMap[s.user_id] || []
    userSubMap[s.user_id].push(s)
  })
  for (const [uid, list] of Object.entries(userSubMap)) {
    const profile = profiles.find(p => p.id === uid)
    console.log(`User: ${profile ? profile.full_name : uid} (${uid})`)
    console.log(`  Total submissions: ${list.length}`)
    const qids = [...new Set(list.map(x => x.question_id))]
    console.log(`  Distinct question_ids (${qids.length}): ${qids.slice(0, 15).join(', ')}`)
  }

  console.log('\n--- SUBMISSIONS IN public.core_programming_submissions ---')
  const { data: cpSubs } = await supabase.from('core_programming_submissions').select('user_id, question_id, status, score, created_at')
  const cpUserMap = {}
  cpSubs.forEach(s => {
    cpUserMap[s.user_id] = cpUserMap[s.user_id] || []
    cpUserMap[s.user_id].push(s)
  })
  for (const [uid, list] of Object.entries(cpUserMap)) {
    const profile = profiles.find(p => p.id === uid)
    console.log(`User: ${profile ? profile.full_name : uid} (${uid})`)
    console.log(`  Total CP submissions: ${list.length}`)
    const qids = [...new Set(list.map(x => x.question_id))]
    console.log(`  Distinct CP question_ids (${qids.length}): ${qids.join(', ')}`)
  }
}

runAuditSummary().catch(console.error)
