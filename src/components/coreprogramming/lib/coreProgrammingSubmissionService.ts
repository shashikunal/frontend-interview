// src/components/coreprogramming/lib/coreProgrammingSubmissionService.ts
// Handles persisting Core Programming submissions to Supabase + local storage
// and syncing progress summary for dashboard / leaderboard consumption.

import { supabase } from '../../../lib/supabase/client'
import type { CoreProgrammingSubmission } from '../data/coreProgrammingTypes'
import { coreProgrammingProgressService } from './coreProgrammingProgressService'

export const LOCAL_CP_SUBMISSIONS_KEY = 'cp_candidate_submissions_v1'

export class CoreProgrammingSubmissionService {
  private inFlight = new Set<string>()

  async submit(
    submission: CoreProgrammingSubmission,
    user?: { id?: string; name?: string; email?: string } | null
  ): Promise<boolean> {
    // Idempotency: prevent double-submits within a 3-second window
    const key = `${submission.questionId}_${submission.code.length}_${Math.floor(Date.now() / 3000)}`
    if (this.inFlight.has(key)) {
      console.warn('[CP] Duplicate submission prevented')
      return false
    }
    this.inFlight.add(key)

    try {
      // 1. Always persist locally first (offline-safe)
      coreProgrammingProgressService.addSubmission(submission)

      // Mirror in the shared localStorage key so the leaderboard can pick it up
      try {
        const raw = localStorage.getItem(LOCAL_CP_SUBMISSIONS_KEY)
        const list: CoreProgrammingSubmission[] = raw ? JSON.parse(raw) : []
        // Avoid duplicates
        if (!list.some(s => s.id === submission.id)) {
          list.unshift({ ...submission, candidateId: user?.id || 'anon' })
          localStorage.setItem(LOCAL_CP_SUBMISSIONS_KEY, JSON.stringify(list.slice(0, 1000)))
        }
      } catch (e) {
        console.warn('[CP] Local mirror save failed:', e)
      }

      // 2. Sync to Supabase when authenticated
      const userId = user?.id
      if (userId && supabase) {
        try {
          const { error } = await supabase.from('core_programming_submissions').insert({
            id: submission.id,
            user_id: userId,
            question_id: submission.questionId,
            code: submission.code,
            status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
            score: submission.score,
            tests_passed: submission.testsPassed,
            tests_total: submission.testsTotal,
            execution_time_ms: submission.runtimeMs,
            time_spent_seconds: submission.timeSpentSeconds || 0,
            created_at: submission.timestamp,
          })

          if (error) {
            console.debug('[CP] Supabase sync notice:', error.message)
          }

          // Sync summary for leaderboard aggregation
          const solvedList = Array.from(coreProgrammingProgressService.getSolvedIds())
          const attemptedList = Array.from(coreProgrammingProgressService.getAttemptedIds())
          await supabase.from('core_programming_progress').upsert(
            {
              user_id: userId,
              solved_question_ids: solvedList,
              attempted_question_ids: attemptedList,
              total_score: solvedList.length * 100,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          )
        } catch (dbErr) {
          console.debug('[CP] Supabase sync skipped (offline or unprovisioned):', dbErr)
        }
      }

      return true
    } finally {
      setTimeout(() => this.inFlight.delete(key), 3000)
    }
  }

  async fetchUserSubmissions(
    userId?: string,
    questionId?: string
  ): Promise<CoreProgrammingSubmission[]> {
    const local = coreProgrammingProgressService.getSubmissions(questionId)
    if (!userId || !supabase) return local

    try {
      let query = supabase
        .from('core_programming_submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (questionId) {
        query = query.eq('question_id', questionId)
      }

      const { data, error } = await query
      if (error || !data || data.length === 0) return local

      const remote: CoreProgrammingSubmission[] = data.map(row => ({
        id: row.id,
        candidateId: row.user_id,
        questionId: row.question_id,
        code: row.code,
        status: (row.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as CoreProgrammingSubmission['status'],
        score: row.score,
        testsPassed: row.tests_passed,
        testsTotal: row.tests_total,
        runtimeMs: Number(row.execution_time_ms) || 0,
        timeSpentSeconds: row.time_spent_seconds || 0,
        timestamp: row.created_at,
      }))

      // Merge: local wins on duplicate IDs
      const seen = new Set<string>()
      const merged: CoreProgrammingSubmission[] = []
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

export const coreProgrammingSubmissionService = new CoreProgrammingSubmissionService()
