// src/components/frontendjs/lib/frontendJsSubmissionService.ts
import { supabase } from '../../../lib/supabase/client'
import type { FrontendJsSubmission, FrontendJsAttempt } from '../data/frontendJsTypes'
import { frontendJsProgressService } from './frontendJsProgressService'

export class FrontendJsSubmissionService {
  private inFlightSubmissions = new Set<string>()

  async submit(
    submission: FrontendJsSubmission,
    user?: { id?: string; name?: string; email?: string } | null
  ): Promise<boolean> {
    const idempotencyKey = `${submission.questionId}_${submission.code.length}_${Math.floor(Date.now() / 3000)}`
    if (this.inFlightSubmissions.has(idempotencyKey)) {
      console.warn('Duplicate submission prevented by idempotency lock')
      return false
    }

    this.inFlightSubmissions.add(idempotencyKey)

    try {
      // 1. Persist to local storage ledger immediately
      frontendJsProgressService.addSubmission(submission)

      // 2. Sync to Supabase if authenticated
      const userId = user?.id
      if (userId && supabase) {
        try {
          const { error } = await supabase.from('frontend_js_submissions').insert({
            id: submission.id,
            user_id: userId,
            question_id: submission.questionId,
            question_version: submission.questionVersion || 1,
            code: submission.code,
            status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
            score: submission.score,
            tests_passed: submission.testsPassed,
            tests_total: submission.testsTotal,
            execution_time_ms: submission.runtimeMs,
            hints_used: submission.hintsUsed || 0,
            solution_viewed: !!submission.solutionViewed,
            time_spent_seconds: submission.timeSpentSeconds || 0,
            idempotency_key: idempotencyKey,
            created_at: submission.timestamp,
          })

          if (error) {
            console.debug('Frontend JS Supabase submission sync notice:', error.message)
          }

          // Sync progress summary
          const solvedList = Array.from(frontendJsProgressService.getSolvedIds())
          const attemptedList = Array.from(frontendJsProgressService.getAttemptedIds())
          await supabase.from('frontend_js_progress').upsert({
            user_id: userId,
            solved_question_ids: solvedList,
            attempted_question_ids: attemptedList,
            total_score: solvedList.length * 100,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' })
        } catch (dbErr) {
          console.debug('Frontend JS Supabase submission sync skipped (offline or unprovisioned):', dbErr)
        }
      }

      return true
    } finally {
      setTimeout(() => {
        this.inFlightSubmissions.delete(idempotencyKey)
      }, 3000)
    }
  }

  async recordAttempt(attempt: FrontendJsAttempt, user?: { id?: string } | null): Promise<void> {
    const userId = user?.id
    if (userId && supabase) {
      try {
        await supabase.from('frontend_js_attempts').insert({
          id: attempt.id,
          user_id: userId,
          question_id: attempt.questionId,
          code: attempt.code,
          status: attempt.status,
          tests_passed: attempt.testsPassed,
          tests_total: attempt.testsTotal,
          runtime_ms: attempt.runtimeMs,
          created_at: attempt.timestamp,
        })
      } catch (err) {
        console.debug('Frontend JS attempt sync skipped:', err)
      }
    }
  }

  async fetchUserSubmissions(userId?: string, questionId?: string): Promise<FrontendJsSubmission[]> {
    const local = frontendJsProgressService.getSubmissions(questionId)
    if (!userId || !supabase) return local

    try {
      let query = supabase
        .from('frontend_js_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (questionId) {
        query = query.eq('question_id', questionId)
      }

      const { data, error } = await query
      if (error || !data || data.length === 0) return local

      const remote: FrontendJsSubmission[] = data.map(row => ({
        id: row.id,
        candidateId: row.user_id,
        questionId: row.question_id,
        questionVersion: row.question_version,
        code: row.code,
        status: (row.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as FrontendJsSubmission['status'],
        score: row.score,
        testsPassed: row.tests_passed,
        testsTotal: row.tests_total,
        runtimeMs: Number(row.execution_time_ms) || 0,
        hintsUsed: row.hints_used || 0,
        solutionViewed: !!row.solution_viewed,
        timeSpentSeconds: row.time_spent_seconds || 0,
        timestamp: row.created_at,
      }))

      const seen = new Set<string>()
      const merged: FrontendJsSubmission[] = []
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

export const frontendJsSubmissionService = new FrontendJsSubmissionService()
