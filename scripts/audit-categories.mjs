import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function auditCategories() {
  await admin.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  console.log('=== TABLE SCHEMAS AND CATEGORY FIELDS ===\n')

  const tables = [
    'submissions',
    'core_programming_submissions',
    'frontend_js_submissions',
    'dsa_submissions',
    'question_attempts',
    'user_question_progress',
    'mock_question_bank',
    'mock_interview_sessions'
  ]

  for (const table of tables) {
    const { data, error } = await admin.from(table).select('*').limit(1)
    if (error) {
      console.log(`Table ${table}: ERROR ${error.message}`)
    } else if (data && data.length > 0) {
      const row = data[0]
      const keys = Object.keys(row)
      const catKeys = keys.filter(k => /cat|type|track|topic|tech|lang/i.test(k))
      console.log(`Table: ${table}`)
      console.log(`  All Columns (${keys.length}): ${keys.join(', ')}`)
      console.log(`  Category/Track/Type Columns: ${catKeys.join(', ')}`)
      for (const k of catKeys) {
        console.log(`    Sample value of ${k}: ${JSON.stringify(row[k])}`)
      }
    } else {
      console.log(`Table: ${table} is empty.`)
    }
    console.log('')
  }

  // Now inspect the question_id patterns in submissions vs core_programming_submissions
  console.log('=== QUESTION ID PATTERNS IN SUBMISSIONS ===')
  const { data: subs } = await admin.from('submissions').select('question_id, language, status, score')
  const patternCounts = {}
  subs.forEach(s => {
    const qid = String(s.question_id || '')
    let prefix = 'UNKNOWN'
    if (qid.startsWith('Q')) prefix = 'Q (Machine Coding)'
    else if (qid.startsWith('JS-P')) prefix = 'JS-P (Core Programming)'
    else if (qid.startsWith('DSA')) prefix = 'DSA (LeetCode / DSA)'
    else if (qid.startsWith('mc-')) prefix = 'mc- (Machine Coding)'
    else if (/^\d+$/.test(qid)) prefix = 'Numeric (DSA LeetCode)'
    patternCounts[prefix] = (patternCounts[prefix] || 0) + 1
  })
  console.log('Submissions distribution by question ID prefix:', patternCounts)

  console.log('\n=== QUESTION ID PATTERNS IN CORE_PROGRAMMING_SUBMISSIONS ===')
  const { data: cpSubs } = await admin.from('core_programming_submissions').select('question_id, status, score')
  const cpPatternCounts = {}
  cpSubs.forEach(c => {
    const qid = String(c.question_id || '')
    let prefix = 'UNKNOWN'
    if (qid.startsWith('JS-P')) prefix = 'JS-P (Core Programming)'
    else if (qid.startsWith('Q')) prefix = 'Q (Machine Coding)'
    else if (qid.startsWith('DSA')) prefix = 'DSA (LeetCode / DSA)'
    else if (/^\d+$/.test(qid)) prefix = 'Numeric'
    cpPatternCounts[prefix] = (cpPatternCounts[prefix] || 0) + 1
  })
  console.log('Core Programming submissions distribution:', cpPatternCounts)
}

auditCategories().catch(console.error)
