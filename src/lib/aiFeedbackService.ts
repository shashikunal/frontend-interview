// Client-side service for AI Interview Feedback
// Calls /api/ai-feedback and returns a typed AIFeedbackReport.

export interface CodeSmell {
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
}

export interface AIFeedbackReport {
  overallGrade: string           // A+, A, B+, B, C+, C, D
  summary: string
  strengths: string[]
  improvements: string[]
  codeSmells: CodeSmell[]
  interviewerNote: string
  nextSteps: string[]
  isAiFeedback: boolean          // false = rule-based fallback
}

export interface QuestionPayload {
  question: {
    id: string
    title: string
    category: string
    difficulty: string
    requirements: string[]
  }
  code: string
  timeSpentSeconds: number
  testsPassed: number
  testsRun: number
  language: string
}

export interface FeedbackRequest {
  questions: QuestionPayload[]
  perQLimit: number
  totalScore: number
  sessionDurationSeconds: number
}

const GRADE_ORDER = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D']

export function gradeToColor(grade: string): string {
  const idx = GRADE_ORDER.indexOf(grade)
  if (idx <= 1) return '#10b981'   // A+, A — green
  if (idx <= 3) return '#6366f1'   // B+, B — indigo
  if (idx <= 4) return '#f59e0b'   // C+   — amber
  if (idx <= 5) return '#ef4444'   // C    — red
  return '#94a3b8'                  // D    — grey
}

export function gradeToPercent(grade: string): number {
  const map: Record<string, number> = {
    'A+': 97, 'A': 92, 'B+': 86, 'B': 80, 'C+': 73, 'C': 65, 'D': 45,
  }
  return map[grade] ?? 50
}

const aiFeedbackService = {
  async analyze(payload: FeedbackRequest): Promise<AIFeedbackReport> {
    // In development (localhost), call the Vercel dev server or fall back locally
    const baseUrl = window.location.origin
    const endpoint = `${baseUrl}/api/ai-feedback`

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`AI feedback failed (${res.status}): ${text}`)
    }

    const data = await res.json() as AIFeedbackReport

    // Validate shape
    if (!data.overallGrade || !data.summary) {
      throw new Error('Invalid response shape from AI feedback API')
    }

    return data
  },

  /**
   * Client-side rule-based fallback — runs entirely in the browser
   * when the API is unreachable (e.g. local dev without Vercel).
   */
  localFallback(payload: FeedbackRequest): AIFeedbackReport {
    const { questions, totalScore } = payload
    const avgPassPct = questions.reduce(
      (s, q) => s + (q.testsRun > 0 ? q.testsPassed / q.testsRun : 0), 0
    ) / Math.max(1, questions.length)

    const grade =
      totalScore >= 88 ? 'A' :
      totalScore >= 75 ? 'B+' :
      totalScore >= 60 ? 'B' :
      totalScore >= 45 ? 'C+' :
      totalScore >= 30 ? 'C' : 'D'

    const allCode = questions.map(q => q.code).join('\n')

    const strengths: string[] = []
    const improvements: string[] = []
    const codeSmells: CodeSmell[] = []

    if (avgPassPct >= 0.8) strengths.push(`Excellent test pass rate: ${Math.round(avgPassPct * 100)}% across all challenges`)
    else if (avgPassPct >= 0.5) strengths.push(`Decent coverage: ${Math.round(avgPassPct * 100)}% tests passing`)
    else improvements.push(`Test pass rate of ${Math.round(avgPassPct * 100)}% — review boundary conditions and edge cases`)

    if (allCode.includes('useCallback') || allCode.includes('useMemo'))
      strengths.push('Applied performance memoization hooks (useCallback / useMemo)')
    if (allCode.includes('TypeScript') || allCode.includes(': string') || allCode.includes(': number'))
      strengths.push('Type annotations present — shows awareness of type safety')
    if (allCode.includes('aria-') || allCode.includes('role='))
      strengths.push('Accessibility attributes included (ARIA) — senior-level awareness')

    if (allCode.includes('.innerHTML'))
      codeSmells.push({ title: 'Unsafe innerHTML', description: 'Avoid innerHTML — use React JSX or textContent for XSS safety.', severity: 'critical' })
    if (allCode.includes('console.log'))
      codeSmells.push({ title: 'Debug logs present', description: 'Remove console.log before production code review.', severity: 'info' })
    if (!allCode.includes('return () =>') && allCode.includes('useEffect'))
      improvements.push('Add cleanup functions inside useEffect to prevent memory leaks with timers and subscriptions')
    if (allCode.includes(': any'))
      codeSmells.push({ title: 'TypeScript any', description: 'Replace `any` with proper types or generics.', severity: 'warning' })

    if (strengths.length === 0) strengths.push('Attempted the challenge and produced a working starting structure')
    if (improvements.length === 0) improvements.push('Consider adding error boundary handling for robustness')

    return {
      overallGrade: grade,
      summary: `You completed ${questions.length} machine coding challenge${questions.length > 1 ? 's' : ''} with an overall score of ${totalScore}/100 and a ${Math.round(avgPassPct * 100)}% test pass rate. ${avgPassPct >= 0.65 ? 'A solid performance — you demonstrate core React fundamentals.' : 'Keep practicing to strengthen edge case handling and time efficiency.'}`,
      strengths,
      improvements,
      codeSmells,
      interviewerNote: avgPassPct >= 0.7
        ? 'Strong enough to advance to the system design round. I\'d like to see deeper discussion on state architecture at scale.'
        : 'Would recommend a follow-up session to focus on hook patterns and test-driven development before advancing.',
      nextSteps: [
        'Complete 3 machine coding challenges per week at increasing difficulty',
        'Read "React — The Complete Guide" chapters on hooks deep-dive and performance',
        `Review the solution code for "${questions[0]?.question?.title || 'your first challenge'}" and compare your approach`,
      ],
      isAiFeedback: false,
    }
  },
}

export default aiFeedbackService
