import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const adminClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function traceCandidate() {
  await adminClient.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  // Candidates
  const { data: profiles } = await adminClient.from('profiles').select('*')
  console.log(`Loaded ${profiles.length} profiles from database.`)

  for (const prof of profiles) {
    // 1. Check submissions
    const { data: subs } = await adminClient.from('submissions').select('*').eq('user_id', prof.id)
    // 2. Check core programming submissions
    const { data: cpSubs } = await adminClient.from('core_programming_submissions').select('*').eq('user_id', prof.id)
    // 3. Check dsa submissions
    const { data: dsaSubs } = await adminClient.from('dsa_submissions').select('*').eq('user_id', prof.id)
    // 4. Check frontend js submissions
    const { data: fjsSubs } = await adminClient.from('frontend_js_submissions').select('*').eq('user_id', prof.id)
    // 5. Check mock sessions
    const { data: mockSessions } = await adminClient.from('mock_interview_sessions').select('*').eq('user_id', prof.id)

    const totalSubs = (subs?.length || 0) + (cpSubs?.length || 0) + (dsaSubs?.length || 0) + (fjsSubs?.length || 0)
    if (totalSubs > 0 || (mockSessions && mockSessions.length > 0)) {
      console.log(`\n======================================================`)
      console.log(`Candidate: ${prof.full_name} (${prof.email}) [ID: ${prof.id}]`)
      console.log(`Role: ${prof.role} | Target: ${prof.target_company}`)
      console.log(`- submissions: ${subs?.length || 0}`)
      if (subs && subs.length > 0) {
        console.log(`  Sample question IDs: ${[...new Set(subs.map(s => s.question_id))].slice(0, 5).join(', ')}`)
      }
      console.log(`- core_programming_submissions: ${cpSubs?.length || 0}`)
      if (cpSubs && cpSubs.length > 0) {
        const accepted = cpSubs.filter(c => c.status === 'accepted').length
        console.log(`  Accepted: ${accepted}/${cpSubs.length}`)
        console.log(`  Sample question IDs: ${[...new Set(cpSubs.map(s => s.question_id))].slice(0, 5).join(', ')}`)
      }
      console.log(`- dsa_submissions: ${dsaSubs?.length || 0}`)
      console.log(`- frontend_js_submissions: ${fjsSubs?.length || 0}`)
      console.log(`- mock_interview_sessions: ${mockSessions?.length || 0}`)
    }
  }
}

traceCandidate().catch(console.error)
