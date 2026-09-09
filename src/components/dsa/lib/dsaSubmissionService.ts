import { supabase } from '../../../lib/supabase/client'
import type { DSASubmission } from '../data/dsaTypes'
import { dsaProgressService } from './dsaProgressService'
import { leaderboardService } from '../../../lib/leaderboardService'
import { trackingService } from '../../../lib/trackingService'

export class DSASubmissionService {
  async submit(
    submission: DSASubmission,
    user?: { id?: string; name?: string; email?: string } | null
  ): Promise<void> {
    const userId = user?.id
    const userName = user?.name || 'Candidate'
    const userEmail = user?.email || (userId ? `candidate-${userId.slice(0, 6)}@faang.io` : 'guest@faang.io')

    // 1. Always record in localStorage first
    dsaProgressService.addSubmission(submission)

    // 2. Calculate score: 100 for Accepted, proportional for partial tests
    const score = submission.status === 'Accepted'
      ? 100
      : Math.round(((submission.testsPassed || 0) / Math.max(1, submission.testsTotal || 1)) * 80)

    // 3. Sync to Global Leaderboard Service
    try {
      await leaderboardService.saveMachineCodingSubmission({
        candidateId: userId || `guest_${submission.id}`,
        candidateName: userName,
        candidateEmail: userEmail,
        questionId: submission.questionId,
        score,
        testsPassed: submission.testsPassed,
        testsTotal: submission.testsTotal,
        timeSpentSeconds: Math.max(5, Math.round(submission.runtimeMs / 1000)),
        code: submission.code,
        language: submission.language,
      })
    } catch (lbErr) {
      console.debug('Leaderboard sync notice:', lbErr)
    }

    // 4. Sync to Tracking Service for Candidate Dashboard Telemetry & Streaks
    try {
      const trackingStatus = submission.status === 'Accepted' ? 'accepted' : 'failed'
      await trackingService.recordSubmission({
        questionId: submission.questionId,
        code: submission.code,
        language: submission.language,
        status: trackingStatus,
        score,
        executionTime: submission.runtimeMs,
      })
    } catch (trackErr) {
      console.debug('Tracking service sync notice:', trackErr)
    }

    // 5. If authenticated and supabase is configured, try recording in Supabase dsa_submissions
    if (userId && supabase) {
      try {
        const { error } = await supabase.from('dsa_submissions').insert({
          id: submission.id,
          user_id: userId,
          question_id: submission.questionId,
          language: submission.language,
          code: submission.code,
          status: submission.status.toLowerCase().replace(/\s+/g, '_'),
          tests_passed: submission.testsPassed,
          tests_total: submission.testsTotal,
          runtime_ms: submission.runtimeMs,
          created_at: submission.timestamp,
        })

        if (error) {
          console.debug('DSA submission Supabase notice:', error.message)
        }
      } catch (err) {
        console.debug('DSA submission sync skipped:', err)
      }
    }
  }

  async fetchUserSubmissions(userId?: string, questionId?: string): Promise<DSASubmission[]> {
    const local = dsaProgressService.getSubmissions(questionId)
    if (!userId || !supabase) return local

    try {
      let query = supabase
        .from('dsa_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (questionId) {
        query = query.eq('question_id', questionId)
      }

      const { data, error } = await query
      if (error || !data || data.length === 0) return local

      const remote: DSASubmission[] = data.map(row => ({
        id: row.id,
        questionId: row.question_id,
        language: row.language as 'javascript' | 'typescript',
        code: row.code,
        status: (row.status === 'accepted'
          ? 'Accepted'
          : row.status === 'wrong_answer'
          ? 'Wrong Answer'
          : row.status === 'runtime_error'
          ? 'Runtime Error'
          : row.status === 'time_limit_exceeded'
          ? 'Time Limit Exceeded'
          : 'Compile Error') as DSASubmission['status'],
        testsPassed: row.tests_passed,
        testsTotal: row.tests_total,
        runtimeMs: row.runtime_ms,
        timestamp: row.created_at,
      }))

      // Merge local and remote
      const seen = new Set<string>()
      const merged: DSASubmission[] = []
      for (const item of [...local, ...remote]) {
        if (!seen.has(item.id)) {
          seen.add(item.id)
          merged.push(item)
        }
      }
      return merged
    } catch {
      return local
    }
  }
}

export const dsaSubmissionService = new DSASubmissionService()
