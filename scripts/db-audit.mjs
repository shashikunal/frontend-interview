import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function runAudit() {
  console.log('========================================================================')
  console.log('🔑 AUTHENTICATING AS ADMIN')
  console.log('========================================================================')

  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  if (authErr) {
    console.error('Admin authentication failed:', authErr.message)
  } else {
    console.log(`✅ Admin authenticated successfully! Admin ID: ${authData.user.id}, Email: ${authData.user.email}`)
  }

  console.log('\n========================================================================')
  console.log('🔍 FULL SUPABASE DATABASE AUDIT (AUTHENTICATED AS ADMIN)')
  console.log('========================================================================')

  const tablesToCheck = [
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

  for (const table of tablesToCheck) {
    try {
      const { data, count, error } = await supabase.from(table).select('*', { count: 'exact' })
      if (error) {
        console.log(`❌ Table: ${table} -> ERROR: ${error.message} (code: ${error.code})`)
      } else {
        console.log(`✅ Table: ${table} -> Exact Count: ${count} | Rows fetched: ${data?.length || 0}`)
        if (data && data.length > 0) {
          console.log(`   Sample keys: ${Object.keys(data[0]).join(', ')}`)
          if (table === 'submissions') {
            const questionIds = [...new Set(data.map(d => d.question_id))]
            console.log(`   Sample question_ids (${questionIds.length}): ${questionIds.slice(0, 10).join(', ')}`)
            const statuses = [...new Set(data.map(d => d.status))]
            console.log(`   Sample statuses: ${statuses.join(', ')}`)
          }
        }
      }
    } catch (err) {
      console.log(`⚠️ Table: ${table} -> EXCEPTION: ${err.message}`)
    }
  }

  console.log('\n========================================================================')
  console.log('🔍 ALL PROFILES IN DATABASE')
  console.log('========================================================================')
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('*')
  if (pErr) {
    console.error('Error fetching profiles:', pErr)
  } else {
    console.log(`Found ${profiles.length} profiles:`)
    profiles.forEach(p => {
      console.log(`- ID: ${p.id} | Email: ${p.email} | Name: ${p.full_name} | Role: ${p.role}`)
    })
  }

  console.log('\n========================================================================')
  console.log('🔍 ALL SUBMISSIONS BY TABLE')
  console.log('========================================================================')

  // 1. submissions table
  const { data: subs, error: sErr } = await supabase.from('submissions').select('*').order('created_at', { ascending: false })
  if (subs) {
    console.log(`\n--- public.submissions (${subs.length} rows) ---`)
    const userMap = {}
    subs.forEach(s => {
      userMap[s.user_id] = userMap[s.user_id] || []
      userMap[s.user_id].push(s)
    })
    for (const [uid, list] of Object.entries(userMap)) {
      console.log(`User ${uid}: ${list.length} submissions. Question IDs: ${[...new Set(list.map(x => x.question_id))].join(', ')}`)
      console.log(`  Statuses: ${list.map(x => x.status).join(', ')}`)
      console.log(`  Scores: ${list.map(x => x.score).join(', ')}`)
    }
  }

  // 2. core_programming_submissions table
  const { data: cpSubs } = await supabase.from('core_programming_submissions').select('*').order('created_at', { ascending: false })
  if (cpSubs) {
    console.log(`\n--- public.core_programming_submissions (${cpSubs.length} rows) ---`)
    cpSubs.forEach(c => {
      console.log(`ID: ${c.id} | User: ${c.user_id} | Question: ${c.question_id} | Status: ${c.status} | Score: ${c.score} | Tests: ${c.tests_passed}/${c.tests_total}`)
    })
  }

  // 3. frontend_js_submissions table
  const { data: fjsSubs } = await supabase.from('frontend_js_submissions').select('*').order('created_at', { ascending: false })
  if (fjsSubs) {
    console.log(`\n--- public.frontend_js_submissions (${fjsSubs.length} rows) ---`)
    fjsSubs.forEach(f => {
      console.log(`ID: ${f.id} | User: ${f.user_id} | Question: ${f.question_id} | Status: ${f.status} | Score: ${f.score}`)
    })
  }

  // 4. dsa_submissions table
  const { data: dsaSubs } = await supabase.from('dsa_submissions').select('*').order('created_at', { ascending: false })
  if (dsaSubs) {
    console.log(`\n--- public.dsa_submissions (${dsaSubs.length} rows) ---`)
    dsaSubs.forEach(d => {
      console.log(`ID: ${d.id} | User: ${d.user_id} | Question: ${d.question_id} | Status: ${d.status} | Score: ${d.score}`)
    })
  }

  // 5. mock_final_scorecards table
  const { data: scorecards } = await supabase.from('mock_final_scorecards').select('*').order('created_at', { ascending: false })
  if (scorecards) {
    console.log(`\n--- public.mock_final_scorecards (${scorecards.length} rows) ---`)
    scorecards.forEach(sc => {
      console.log(`ID: ${sc.id} | User: ${sc.user_id} | Session: ${sc.session_id} | Score: ${sc.overall_score} | Grade: ${sc.letter_grade}`)
    })
  }

  // 6. mock_interview_sessions table
  const { data: mockSessions } = await supabase.from('mock_interview_sessions').select('*').order('created_at', { ascending: false })
  if (mockSessions) {
    console.log(`\n--- public.mock_interview_sessions (${mockSessions.length} rows) ---`)
    mockSessions.forEach(ms => {
      console.log(`ID: ${ms.id} | User: ${ms.user_id} | State: ${ms.state} | Questions: ${ms.total_questions}`)
    })
  }
}

runAudit().catch(console.error)
