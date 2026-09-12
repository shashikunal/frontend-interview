import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function testUnifiedCalculations() {
  await admin.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  const candidatesToTest = [
    { name: 'santhosh', id: '3b4d44cf-243e-4df0-b38e-e71ac13f11d8' },
    { name: 'KOMAL HIREMATH', id: '91b07587-a436-4a36-8986-30e0851e9a59' },
    { name: 'Sonika G R', id: 'aed02644-279b-4f3a-aab4-18093e9a95e1' },
    { name: 'Priyanka G', id: '4258a6d0-e287-4f2d-8b03-cfb3b0e81da7' },
    { name: 'Devamma', id: 'e22fb59d-c89c-4501-ba8c-8c6ce7957b7d' }
  ]

  for (const cand of candidatesToTest) {
    // 1. Fetch all submissions for candidate
    const [subsRes, cpSubsRes] = await Promise.all([
      admin.from('submissions').select('*').eq('user_id', cand.id).order('created_at', { ascending: true }),
      admin.from('core_programming_submissions').select('*').eq('user_id', cand.id).order('created_at', { ascending: true })
    ])

    const subs = subsRes.data || []
    const cpSubs = cpSubsRes.data || []

    console.log(`\n======================================================`)
    console.log(`Candidate: ${cand.name} (${cand.id})`)
    console.log(`Raw rows: submissions=${subs.length} | cpSubs=${cpSubs.length}`)

    // Track attempts
    const attempts = []
    const seen = new Set()

    // Add CP subs
    cpSubs.forEach(c => {
      seen.add(c.id)
      seen.add(`${c.question_id}_${c.created_at}`)
      const isSolved = c.status === 'accepted' || (c.score && Number(c.score) >= 70)
      attempts.push({
        id: c.id,
        questionId: c.question_id,
        category: 'CORE_PROGRAMMING',
        status: isSolved ? 'Solved' : 'Failed',
        score: Number(c.score || 0),
        duration: Number(c.time_spent_seconds || 0),
        code: c.code || '',
        createdAt: c.created_at
      })
    })

    // Add general submissions
    subs.forEach(s => {
      if (seen.has(s.id) || seen.has(`${s.question_id}_${s.created_at}`)) return
      seen.add(s.id)
      const q = String(s.question_id || '').trim().toUpperCase()
      let category = 'CORE_PROGRAMMING'
      if (q.startsWith('Q') || q.startsWith('MC-')) category = 'MACHINE_CODING'
      else if (q.startsWith('DSA') || /^\d+$/.test(q)) category = 'DSA'
      else if (q.startsWith('JS-P') || q.startsWith('JSP') || q.startsWith('CP')) category = 'CORE_PROGRAMMING'

      const isSolved = s.status === 'accepted' || (s.score && Number(s.score) >= 70)
      attempts.push({
        id: s.id,
        questionId: s.question_id,
        category,
        status: isSolved ? 'Solved' : 'Failed',
        score: Number(s.score || 0),
        duration: Number(s.execution_time || 0),
        code: s.code || '',
        createdAt: s.created_at
      })
    })

    // Compute metrics
    const uniqueAttempted = new Set(attempts.map(a => a.questionId)).size
    const uniqueSolved = new Set(attempts.filter(a => a.status === 'Solved').map(a => a.questionId)).size
    const successRate = uniqueAttempted > 0 ? Math.round((uniqueSolved / uniqueAttempted) * 100) : 0

    const catStats = {}
    for (const cat of ['MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING']) {
      const catAttempts = attempts.filter(a => a.category === cat)
      const attempted = new Set(catAttempts.map(a => a.questionId)).size
      const solved = new Set(catAttempts.filter(a => a.status === 'Solved').map(a => a.questionId)).size
      const scores = catAttempts.map(a => a.score)
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
      const successPct = attempted > 0 ? Math.round((solved / attempted) * 100) : null
      catStats[cat] = {
        totalAttempts: catAttempts.length,
        attempted,
        solved,
        avgScore,
        successPct,
        hasActivity: catAttempts.length > 0
      }
    }

    console.log(`TOTAL ATTEMPTS: ${attempts.length}`)
    console.log(`UNIQUE ATTEMPTED: ${uniqueAttempted} | UNIQUE SOLVED: ${uniqueSolved} | OVERALL SUCCESS: ${successRate}%`)
    console.log(`Machine Coding: ${catStats.MACHINE_CODING.hasActivity ? `${catStats.MACHINE_CODING.solved}/${catStats.MACHINE_CODING.attempted} solved (${catStats.MACHINE_CODING.successPct}%) [Avg Score: ${catStats.MACHINE_CODING.avgScore}]` : 'No activity yet'}`)
    console.log(`LeetCode / DSA: ${catStats.DSA.hasActivity ? `${catStats.DSA.solved}/${catStats.DSA.attempted} solved (${catStats.DSA.successPct}%) [Avg Score: ${catStats.DSA.avgScore}]` : 'No activity yet'}`)
    console.log(`Core Programming: ${catStats.CORE_PROGRAMMING.hasActivity ? `${catStats.CORE_PROGRAMMING.solved}/${catStats.CORE_PROGRAMMING.attempted} solved (${catStats.CORE_PROGRAMMING.successPct}%) [Avg Score: ${catStats.CORE_PROGRAMMING.avgScore}]` : 'No activity yet'}`)
  }
}

testUnifiedCalculations().catch(console.error)
