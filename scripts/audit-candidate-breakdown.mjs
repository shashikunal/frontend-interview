import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjkxfxaiuemjsiflwlv.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6amt4ZnhhaXVlbWpzaWZsd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MDI2ODgsImV4cCI6MjEwMzk3ODY4OH0.PnHnvW9-V8SMLilGdhf3Em9wGIGCYxL0rCRUFpvhdn8'

const admin = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false }
})

async function auditCandidates() {
  await admin.auth.signInWithPassword({
    email: 'admin@interviewprep.com',
    password: 'Admin@9999'
  })

  const { data: profiles } = await admin.from('profiles').select('*')
  const { data: allSubs } = await admin.from('submissions').select('*')
  const { data: allCPSubs } = await admin.from('core_programming_submissions').select('*')

  console.log(`Total Profiles: ${profiles.length}`)
  console.log(`Total Submissions: ${allSubs.length}`)
  console.log(`Total CP Submissions: ${allCPSubs.length}`)

  // Function to categorize a questionId
  function getCategory(questionId) {
    const q = String(questionId || '').trim().toUpperCase()
    if (q.startsWith('Q') || q.startsWith('MC-')) return 'MACHINE_CODING'
    if (q.startsWith('DSA') || /^\d+$/.test(q)) return 'DSA'
    if (q.startsWith('JS-P') || q.startsWith('JSP') || q.startsWith('CP')) return 'CORE_PROGRAMMING'
    return 'CORE_PROGRAMMING'
  }

  const candidateStats = []

  for (const prof of profiles) {
    const userSubs = allSubs.filter(s => s.user_id === prof.id)
    const userCPSubs = allCPSubs.filter(s => s.user_id === prof.id)

    // Deduplicate across submissions and CP submissions
    const attempts = []
    const seen = new Set()

    userCPSubs.forEach(c => {
      const id = c.id
      seen.add(id)
      seen.add(`${c.question_id}_${c.created_at}`)
      attempts.push({
        id: c.id,
        questionId: c.question_id,
        category: 'CORE_PROGRAMMING',
        status: c.status === 'accepted' || (c.score && c.score >= 70) ? 'Solved' : 'Failed',
        score: c.score || 0,
        createdAt: c.created_at,
        timeSpent: c.time_spent_seconds || 0
      })
    })

    userSubs.forEach(s => {
      if (seen.has(s.id) || seen.has(`${s.question_id}_${s.created_at}`)) return
      seen.add(s.id)
      const cat = getCategory(s.question_id)
      attempts.push({
        id: s.id,
        questionId: s.question_id,
        category: cat,
        status: s.status === 'accepted' || (s.score && s.score >= 70) ? 'Solved' : 'Failed',
        score: s.score || 0,
        createdAt: s.created_at,
        timeSpent: s.execution_time || 0
      })
    })

    if (attempts.length > 0) {
      const mcAttempts = attempts.filter(a => a.category === 'MACHINE_CODING')
      const dsaAttempts = attempts.filter(a => a.category === 'DSA')
      const cpAttempts = attempts.filter(a => a.category === 'CORE_PROGRAMMING')

      const mcSolved = new Set(mcAttempts.filter(a => a.status === 'Solved').map(a => a.questionId)).size
      const mcAttempted = new Set(mcAttempts.map(a => a.questionId)).size

      const dsaSolved = new Set(dsaAttempts.filter(a => a.status === 'Solved').map(a => a.questionId)).size
      const dsaAttempted = new Set(dsaAttempts.map(a => a.questionId)).size

      const cpSolved = new Set(cpAttempts.filter(a => a.status === 'Solved').map(a => a.questionId)).size
      const cpAttempted = new Set(cpAttempts.map(a => a.questionId)).size

      candidateStats.push({
        name: prof.full_name,
        email: prof.email,
        id: prof.id,
        role: prof.role,
        totalAttempts: attempts.length,
        mc: { totalAttempts: mcAttempts.length, attempted: mcAttempted, solved: mcSolved, successPct: mcAttempted > 0 ? Math.round((mcSolved / mcAttempted) * 100) : 0 },
        dsa: { totalAttempts: dsaAttempts.length, attempted: dsaAttempted, solved: dsaSolved, successPct: dsaAttempted > 0 ? Math.round((dsaSolved / dsaAttempted) * 100) : 0 },
        cp: { totalAttempts: cpAttempts.length, attempted: cpAttempted, solved: cpSolved, successPct: cpAttempted > 0 ? Math.round((cpSolved / cpAttempted) * 100) : 0 },
      })
    }
  }

  console.log('\n=== CANDIDATES WITH REAL ACTIVITY IN DATABASE ===')
  candidateStats.sort((a, b) => b.totalAttempts - a.totalAttempts)
  candidateStats.forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.name} (${c.email}) [Role: ${c.role}]`)
    console.log(`   Total Attempts: ${c.totalAttempts}`)
    console.log(`   Machine Coding: ${c.mc.totalAttempts} attempts | ${c.mc.solved}/${c.mc.attempted} solved (${c.mc.successPct}%)`)
    console.log(`   LeetCode / DSA: ${c.dsa.totalAttempts} attempts | ${c.dsa.solved}/${c.dsa.attempted} solved (${c.dsa.successPct}%)`)
    console.log(`   Core Programming: ${c.cp.totalAttempts} attempts | ${c.cp.solved}/${c.cp.attempted} solved (${c.cp.successPct}%)`)
  })
}

auditCandidates().catch(console.error)
