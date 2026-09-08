import { ensureReaderAuth } from './leaderboardService'

export interface EvaluatorReview {
  id?: string
  submissionId: string
  candidateId: string
  candidateName?: string
  candidateEmail?: string
  questionId: string
  questionTitle?: string
  score: number // adjusted marks 0-100
  notes: string // feedback remarks
  cleanCodeRating: number // 1 to 10
  architectureRating: number // 1 to 10
  edgeCasesRating: number // 1 to 10
  decision: 'approved' | 'needs_work' | 'rejected'
  evaluatorName: string
  evaluatorEmail?: string
  evaluatedAt: string
}

const LOCAL_REVIEWS_KEY = 'mc_evaluator_reviews_v1'

export const gradingService = {
  /**
   * Save an evaluator review for a candidate submission.
   * Persists to Supabase activity_logs and local storage.
   */
  saveEvaluatorReview: async (review: EvaluatorReview): Promise<boolean> => {
    const now = new Date().toISOString()
    const fullReview: EvaluatorReview = {
      ...review,
      id: review.id || `eval_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      evaluatedAt: review.evaluatedAt || now,
    }

    // 1. Save to local storage for instant offline availability
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_REVIEWS_KEY)
        const map: Record<string, EvaluatorReview> = raw ? JSON.parse(raw) : {}
        map[fullReview.submissionId] = fullReview
        localStorage.setItem(LOCAL_REVIEWS_KEY, JSON.stringify(map))
      }
    } catch (err) {
      console.warn('[GradingService] LocalStorage save warning:', err)
    }

    // 2. Persist to Supabase activity_logs
    try {
      const client = await ensureReaderAuth()
      const { data: authData } = await client.auth.getSession()
      const evaluatorId = authData.session?.user?.id || 'admin_evaluator'

      const { error } = await client.from('activity_logs').insert({
        user_id: evaluatorId,
        action: 'grade_submission',
        entity_type: 'submission',
        entity_id: fullReview.submissionId,
        metadata: {
          ...fullReview,
          entityId: fullReview.submissionId,
        },
      })

      if (error) {
        console.warn('[GradingService] Supabase activity_logs insert warning:', error)
      }

      return true
    } catch (err) {
      console.warn('[GradingService] saveEvaluatorReview error:', err)
      return true // Still succeeded locally
    }
  },

  /**
   * Fetch all evaluator reviews from Supabase and local storage.
   */
  getAllEvaluatorReviews: async (): Promise<Record<string, EvaluatorReview>> => {
    const result: Record<string, EvaluatorReview> = {}

    // 1. Read from local storage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_REVIEWS_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          Object.assign(result, parsed)
        }
      }
    } catch (_) {}

    // 2. Fetch from Supabase activity_logs
    try {
      const client = await ensureReaderAuth()
      const { data, error } = await client
        .from('activity_logs')
        .select('*')
        .eq('action', 'grade_submission')
        .order('created_at', { ascending: false })
        .limit(500)

      if (!error && Array.isArray(data)) {
        for (const item of data) {
          const subId = item.entity_id || (item.metadata as any)?.submissionId
          if (subId && item.metadata) {
            const meta = item.metadata as any
            if (!result[subId]) {
              result[subId] = {
                id: item.id,
                submissionId: subId,
                candidateId: meta.candidateId || '',
                candidateName: meta.candidateName,
                candidateEmail: meta.candidateEmail,
                questionId: meta.questionId || '',
                questionTitle: meta.questionTitle,
                score: Number(meta.score ?? 100),
                notes: String(meta.notes || ''),
                cleanCodeRating: Number(meta.cleanCodeRating ?? 9),
                architectureRating: Number(meta.architectureRating ?? 9),
                edgeCasesRating: Number(meta.edgeCasesRating ?? 8),
                decision: (meta.decision as any) || 'approved',
                evaluatorName: meta.evaluatorName || 'Platform Interviewer',
                evaluatorEmail: meta.evaluatorEmail,
                evaluatedAt: item.created_at,
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn('[GradingService] Supabase fetch reviews error:', err)
    }

    return result
  },

  /**
   * Get evaluator review for a specific submission.
   */
  getReviewForSubmission: async (submissionId: string): Promise<EvaluatorReview | null> => {
    if (!submissionId) return null
    const all = await gradingService.getAllEvaluatorReviews()
    return all[submissionId] || null
  },

  /**
   * Get all reviews for a specific candidate.
   */
  getCandidateReviews: async (candidateId: string): Promise<EvaluatorReview[]> => {
    if (!candidateId) return []
    const all = await gradingService.getAllEvaluatorReviews()
    return Object.values(all).filter(r => r.candidateId === candidateId)
  },
}

export default gradingService
