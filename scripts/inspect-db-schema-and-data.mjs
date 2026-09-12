import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function inspectEverything() {
  await admin.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  console.log('========================================================================')
  console.log('1. INSPECTING ALL SUBMISSIONS TABLES AND THEIR FIELDS')
  console.log('========================================================================')

  // Sample row from public.submissions
  const { data: subSamples } = await admin.from('submissions').select('*').limit(3)
  console.log('\n--- public.submissions sample columns & values ---')
  if (subSamples && subSamples.length > 0) {
    console.log(JSON.stringify(subSamples[0], null, 2))
  }

  // Sample row from public.core_programming_submissions
  const { data: cpSamples } = await admin.from('core_programming_submissions').select('*').limit(3)
  console.log('\n--- public.core_programming_submissions sample columns & values ---')
  if (cpSamples && cpSamples.length > 0) {
    console.log(JSON.stringify(cpSamples[0], null, 2))
  }

  // Sample row from public.question_attempts
  const { data: attSamples } = await admin.from('question_attempts').select('*').limit(3)
  console.log('\n--- public.question_attempts sample columns & values ---')
  if (attSamples && attSamples.length > 0) {
    console.log(JSON.stringify(attSamples[0], null, 2))
  }

  // Sample row from public.user_question_progress
  const { data: uqpSamples } = await admin.from('user_question_progress').select('*').limit(3)
  console.log('\n--- public.user_question_progress sample columns & values ---')
  if (uqpSamples && uqpSamples.length > 0) {
    console.log(JSON.stringify(uqpSamples[0], null, 2))
  }

  // Sample row from public.activity_logs
  const { data: actSamples } = await admin.from('activity_logs').select('*').limit(3)
  console.log('\n--- public.activity_logs sample columns & values ---')
  if (actSamples && actSamples.length > 0) {
    console.log(JSON.stringify(actSamples[0], null, 2))
  }

  // Sample row from mock_interview_sessions & scorecards
  const { data: misSamples } = await admin.from('mock_interview_sessions').select('*').limit(3)
  console.log('\n--- public.mock_interview_sessions sample columns & values ---')
  if (misSamples && misSamples.length > 0) {
    console.log(JSON.stringify(misSamples[0], null, 2))
  }

  const { data: mfsSamples } = await admin.from('mock_final_scorecards').select('*').limit(3)
  console.log('\n--- public.mock_final_scorecards sample columns & values ---')
  if (mfsSamples && mfsSamples.length > 0) {
    console.log(JSON.stringify(mfsSamples[0], null, 2))
  }

  console.log('\n========================================================================')
  console.log('2. DISTINCT QUESTION ID PATTERNS AND CATEGORY INFERENCE')
  console.log('========================================================================')

  const { data: allSubs } = await admin.from('submissions').select('question_id, status, score, language')
  const qIdSet = new Set()
  const statusSet = new Set()
  const langSet = new Set()
  allSubs?.forEach(s => {
    qIdSet.add(s.question_id)
    statusSet.add(s.status)
    langSet.add(s.language)
  })

  console.log(`Distinct Question IDs in public.submissions (${qIdSet.size}):`)
  const qList = [...qIdSet]
  console.log('Prefix Q:', qList.filter(q => q.startsWith('Q')).slice(0, 10))
  console.log('Prefix JS-P:', qList.filter(q => q.startsWith('JS-P')).slice(0, 10))
  console.log('Prefix DSA:', qList.filter(q => q.startsWith('DSA')).slice(0, 10))
  console.log('Prefix MC / mc-:', qList.filter(q => q.startsWith('mc') || q.startsWith('MC')).slice(0, 10))
  console.log('Numeric IDs:', qList.filter(q => /^\d+$/.test(q)).slice(0, 10))
  console.log('Other IDs:', qList.filter(q => !q.startsWith('Q') && !q.startsWith('JS-P') && !q.startsWith('DSA') && !q.startsWith('mc') && !q.startsWith('MC') && !/^\d+$/.test(q)))

  console.log('\nDistinct statuses in public.submissions:', [...statusSet])
  console.log('Distinct languages in public.submissions:', [...langSet])

  const { data: allCPSubs } = await admin.from('core_programming_submissions').select('question_id, status, score')
  const cpQIdSet = new Set()
  const cpStatusSet = new Set()
  allCPSubs?.forEach(c => {
    cpQIdSet.add(c.question_id)
    cpStatusSet.add(c.status)
  })
  console.log(`\nDistinct Question IDs in public.core_programming_submissions (${cpQIdSet.size}):`, [...cpQIdSet].slice(0, 20))
  console.log('Distinct statuses in public.core_programming_submissions:', [...cpStatusSet])
}

inspectEverything().catch(console.error)
