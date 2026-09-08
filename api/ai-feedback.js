// Vercel Serverless Function: /api/ai-feedback
// Analyzes candidate code from a machine coding session using GPT-4o.
// Falls back to a static rule-based report if OPENAI_API_KEY is absent.

export const config = { maxDuration: 30 }

// ─── Rule-based fallback ────────────────────────────────────────────
function ruleBasedAnalysis({ code, testsPassed, testsRun, timeSpentSeconds, perQLimit, question }) {
  const passPct = testsRun > 0 ? testsPassed / testsRun : 0
  const grade =
    passPct >= 0.9 ? 'A' :
    passPct >= 0.75 ? 'B+' :
    passPct >= 0.6 ? 'B' :
    passPct >= 0.45 ? 'C+' :
    passPct >= 0.3 ? 'C' : 'D'

  const timeEfficiency = perQLimit > 0 ? timeSpentSeconds / perQLimit : 1
  const strengths = []
  const improvements = []
  const codeSmells = []

  // Test performance
  if (passPct >= 0.8) strengths.push(`Strong test coverage: ${testsPassed}/${testsRun} cases passing`)
  else improvements.push(`Only ${testsPassed}/${testsRun} tests passing — review edge cases and boundary conditions`)

  // Time efficiency
  if (timeEfficiency < 0.7) strengths.push('Completed well within the allotted time, showing strong problem-solving fluency')
  else if (timeEfficiency > 1.0) improvements.push('Exceeded the time limit — practice breaking problems into smaller deliverable chunks')

  // Code pattern checks
  if (code.includes('useCallback') || code.includes('useMemo')) strengths.push('Good use of memoization hooks to avoid unnecessary re-renders')
  if (code.includes('useEffect') && !code.includes('return')) improvements.push('useEffect is missing a cleanup return — potential memory leaks with subscriptions or timers')
  if (code.includes('.innerHTML')) codeSmells.push({ title: 'Unsafe innerHTML usage', description: 'Setting innerHTML directly can introduce XSS vulnerabilities and bypasses React\'s virtual DOM.', severity: 'critical' })
  if (code.match(/setState\([a-z]+\s*\+/)) codeSmells.push({ title: 'Non-functional state update', description: 'Prefer functional updater form `setState(prev => prev + 1)` to avoid stale closure bugs.', severity: 'warning' })
  if (code.includes('console.log')) codeSmells.push({ title: 'Debug logs left in code', description: 'Remove console.log statements before production submission.', severity: 'info' })
  if (code.includes('any')) codeSmells.push({ title: 'TypeScript `any` detected', description: 'Avoid `any` — use proper interfaces or generic types for type safety.', severity: 'warning' })

  if (strengths.length === 0) strengths.push('Attempted the challenge and structured a working component skeleton')
  if (improvements.length === 0) improvements.push('Consider adding PropTypes or TypeScript interfaces for component props')

  return {
    overallGrade: grade,
    summary: `Candidate achieved ${testsPassed}/${testsRun} test cases on "${question?.title || 'the challenge'}" and spent ${Math.round(timeSpentSeconds / 60)} minutes. ${passPct >= 0.6 ? 'Solid performance overall.' : 'The implementation needs further refinement.'}`,
    strengths,
    improvements,
    codeSmells,
    interviewerNote: passPct >= 0.75
      ? 'The candidate demonstrated clear understanding of the problem and produced working code. I would be comfortable moving them to the next round with a deeper design discussion.'
      : 'The candidate shows potential but needs more practice with real-world constraints and edge cases. I recommend additional preparation before the next interview loop.',
    nextSteps: [
      'Review the official React docs on hooks and concurrent features',
      'Practice on LeetCode or HackerRank for algorithmic challenges',
      `Study the model solution for "${question?.title || 'this challenge'}" to compare approaches`,
    ],
  }
}

// ─── Main handler ───────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' })

  const {
    questions = [],      // Array of { question, code, timeSpentSeconds, testsPassed, testsRun, language }
    perQLimit = 900,     // per-question time limit in seconds
    totalScore = 0,
    sessionDurationSeconds = 0,
  } = req.body || {}

  if (!questions.length) return res.status(400).json({ error: 'No questions provided' })

  const apiKey = process.env.OPENAI_API_KEY

  // ── Fallback: no API key ──────────────────────────────────────────
  if (!apiKey) {
    const perQ = questions.map(q =>
      ruleBasedAnalysis({ ...q, perQLimit })
    )
    const allStrengths = [...new Set(perQ.flatMap(r => r.strengths))].slice(0, 4)
    const allImprovements = [...new Set(perQ.flatMap(r => r.improvements))].slice(0, 4)
    const allSmells = perQ.flatMap(r => r.codeSmells).slice(0, 6)
    const avgPassPct = questions.reduce((s, q) => s + (q.testsRun > 0 ? q.testsPassed / q.testsRun : 0), 0) / questions.length
    const grade = perQ[0]?.overallGrade || 'C'

    return res.status(200).json({
      overallGrade: grade,
      summary: `Session of ${questions.length} challenges completed in ${Math.round(sessionDurationSeconds / 60)} min with an overall test pass rate of ${Math.round(avgPassPct * 100)}%. ${avgPassPct >= 0.6 ? 'A commendable performance.' : 'Areas for improvement identified below.'}`,
      strengths: allStrengths,
      improvements: allImprovements,
      codeSmells: allSmells,
      interviewerNote: avgPassPct >= 0.7
        ? 'The candidate demonstrated consistent performance across all challenges and shows strong engineering fundamentals.'
        : 'The candidate would benefit from targeted practice on edge case handling and React lifecycle patterns.',
      nextSteps: [
        'Study the React official docs on hooks — particularly useEffect, useCallback, and useMemo',
        'Practice timed coding challenges (30-min sessions) to improve problem decomposition speed',
        'Review your submitted code against the model solutions to identify patterns you missed',
      ],
      isAiFeedback: false,
    })
  }

  // ── GPT-4o analysis ───────────────────────────────────────────────
  try {
    const codeBlocks = questions.map((q, i) =>
      `### Question ${i + 1}: ${q.question?.title || 'Unknown'}
Requirements: ${(q.question?.requirements || []).join(', ')}
Category: ${q.question?.category || 'Unknown'} | Difficulty: ${q.question?.difficulty || 'Medium'}
Time: ${q.timeSpentSeconds}s / ${perQLimit}s | Tests: ${q.testsPassed}/${q.testsRun} passing
Language: ${q.language || 'react'}

\`\`\`${q.language === 'javascript' ? 'javascript' : 'tsx'}
${(q.code || '').slice(0, 2500)}
\`\`\``
    ).join('\n\n---\n\n')

    const systemPrompt = `You are a senior FAANG frontend engineer conducting a machine coding interview evaluation. 
Analyze the candidate's code submissions and return ONLY a valid JSON object — no markdown, no explanation outside JSON.`

    const userPrompt = `Evaluate this machine coding interview session:

Overall score: ${totalScore}/100
Session duration: ${Math.round(sessionDurationSeconds / 60)} minutes
Challenges: ${questions.length}

${codeBlocks}

Return ONLY this exact JSON structure (no extra fields):
{
  "overallGrade": "A+|A|B+|B|C+|C|D",
  "summary": "2-3 sentences summarizing the candidate's overall performance",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "codeSmells": [
    { "title": "issue name", "description": "explanation", "severity": "critical|warning|info" }
  ],
  "interviewerNote": "1-2 sentences as a simulated interviewer comment on whether to advance the candidate",
  "nextSteps": ["specific action 1", "specific action 2", "specific action 3"]
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 1200,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenAI error ${response.status}: ${errText}`)
    }

    const data = await response.json()
    const raw = data.choices?.[0]?.message?.content || '{}'
    const report = JSON.parse(raw)
    report.isAiFeedback = true

    return res.status(200).json(report)
  } catch (err) {
    console.error('[ai-feedback] GPT error:', err)
    // Graceful fallback to rule-based
    const fallback = ruleBasedAnalysis({ ...questions[0], perQLimit })
    fallback.isAiFeedback = false
    fallback.summary = `(AI analysis temporarily unavailable — showing automated review) ${fallback.summary}`
    return res.status(200).json(fallback)
  }
}
