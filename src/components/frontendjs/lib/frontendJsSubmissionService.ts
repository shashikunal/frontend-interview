// src/components/frontendjs/lib/frontendJsSubmissionService.ts
import { supabase } from '../../../lib/supabase/client'
import type { FrontendJsSubmission, FrontendJsAttempt } from '../data/frontendJsTypes'
import { frontendJsProgressService } from './frontendJsProgressService'
import { trackingService } from '../../../lib/trackingService'

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

      // 2. Sync to Tracking Service for candidate telemetry, streaks & canonical submissions
      try {
        await trackingService.recordSubmission({
          id: submission.id,
          questionId: submission.questionId,
          category: 'FRONTEND_JS',
          userId: user?.id,
          code: submission.code,
          language: 'javascript',
          status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
          score: submission.score,
          passedTests: submission.testsPassed,
          totalTests: submission.testsTotal,
          executionTime: submission.runtimeMs,
          idempotencyKey,
        })
      } catch (trackErr) {
        console.debug('Frontend JS tracking sync notice:', trackErr)
      }

      // 3. Mirror to dedicated frontend_js_submissions & question_attempts when authenticated with valid UUID
      const userId = user?.id
      const isValidUuid = (val?: string | null): boolean =>
        Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val))
      if (isValidUuid(userId) && supabase) {
        try {
          // 3b. Best-effort mirror into dedicated frontend_js_submissions.
          const { error: fjsErr } = await supabase.from('frontend_js_submissions').insert({
            user_id: userId,
            question_id: submission.questionId,
            question_version: submission.questionVersion || 1,
            code: submission.code,
            status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
            score: submission.score,
            tests_passed: submission.testsPassed,
            tests_total: submission.testsTotal,
            execution_time_ms: submission.runtimeMs || 0,
            hints_used: submission.hintsUsed || 0,
            solution_viewed: submission.solutionViewed || false,
            time_spent_seconds: submission.timeSpentSeconds || 0,
            idempotency_key: idempotencyKey,
            created_at: submission.timestamp,
          })
          if (fjsErr && !fjsErr.message.includes('duplicate') && !fjsErr.message.includes('schema cache')) {
            console.debug('Frontend JS dedicated table sync notice:', fjsErr.message)
          }
        } catch {
          // ignore — canonical insert above already succeeded
        }

        // 3c. Best-effort attempt ledger so Attempt sections + Tracks pick up
        try {
          const nowIso = new Date().toISOString()
          const accepted = submission.status === 'Accepted'
          const { data: existing } = await supabase
            .from('question_attempts')
            .select('id, attempt_count')
            .eq('user_id', userId)
            .eq('question_id', submission.questionId)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (existing?.id) {
            await supabase.from('question_attempts').update({
              status: accepted ? 'completed' : 'in_progress',
              attempt_count: Number(existing.attempt_count || 0) + 1,
              completed_at: accepted ? nowIso : null,
              last_activity_at: nowIso,
              updated_at: nowIso,
            }).eq('id', existing.id)
          } else {
            await supabase.from('question_attempts').insert({
              user_id: userId,
              question_id: submission.questionId,
              category: 'FRONTEND_JS',
              language: 'javascript',
              status: accepted ? 'completed' : 'in_progress',
              attempt_count: 1,
              started_at: nowIso,
              last_activity_at: nowIso,
              completed_at: accepted ? nowIso : null,
            })
          }
        } catch {
          // ignore — submissions above are the source of truth
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
    const isValidUuid = Boolean(userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId))
    if (isValidUuid && supabase) {
      try {
        const { error } = await supabase.from('frontend_js_attempts').insert({
          user_id: userId,
          question_id: attempt.questionId,
          code: attempt.code,
          status: attempt.status,
          tests_passed: attempt.testsPassed,
          tests_total: attempt.testsTotal,
          runtime_ms: attempt.runtimeMs,
          created_at: attempt.timestamp,
        })
        if (error && !error.message.includes('schema cache')) {
          console.debug('Frontend JS attempt sync notice:', error.message)
        }
      } catch {
        // ignore — local storage already recorded
      }
    }
  }

  async fetchUserSubmissions(userId?: string, questionId?: string): Promise<FrontendJsSubmission[]> {
    const local = frontendJsProgressService.getSubmissions(questionId)
    const isValidUuid = Boolean(userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId))
    if (!userId || !isValidUuid || !supabase) return local

    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (questionId) {
        query = query.eq('question_id', questionId)
      } else {
        query = query.like('question_id', 'FJP%')
      }

      const { data, error } = await query
      if (error || !data || data.length === 0) return local

      const remote: FrontendJsSubmission[] = data.map(row => ({
        id: String(row.id),
        candidateId: String(row.user_id),
        questionId: String(row.question_id),
        questionVersion: 1,
        code: row.code || '',
        status: (row.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as FrontendJsSubmission['status'],
        score: Number(row.score ?? (row.status === 'accepted' ? 100 : 0)),
        testsPassed: Number(row.passed_tests ?? (row.status === 'accepted' ? 4 : 0)),
        testsTotal: Number(row.total_tests ?? 4),
        runtimeMs: Number(row.execution_time ? row.execution_time * 1000 : 0),
        hintsUsed: 0,
        solutionViewed: false,
        timeSpentSeconds: Number(row.time_spent_seconds || 0),
        timestamp: String(row.created_at),
      }))

      const merged: FrontendJsSubmission[] = []
      for (const item of [...local, ...remote]) {
        const itemTime = new Date(item.timestamp).getTime()
        const duplicateIdx = merged.findIndex(existing => {
          if (existing.id === item.id) return true
          if (existing.questionId === item.questionId && existing.code === item.code) {
            const existingTime = new Date(existing.timestamp).getTime()
            if (!isNaN(itemTime) && !isNaN(existingTime) && Math.abs(itemTime - existingTime) < 15000) {
              return true
            }
          }
          return false
        })

        if (duplicateIdx === -1) {
          merged.push(item)
        } else {
          const existing = merged[duplicateIdx]
          const preferItem = (item.testsTotal || 0) > (existing.testsTotal || 0) || Boolean(item.runtimeMs && !existing.runtimeMs)
          merged[duplicateIdx] = {
            ...(preferItem ? item : existing),
            testsPassed: Math.max(existing.testsPassed ?? 0, item.testsPassed ?? 0),
            testsTotal: Math.max(existing.testsTotal ?? 0, item.testsTotal ?? 0),
            runtimeMs: existing.runtimeMs || item.runtimeMs,
            score: Math.max(existing.score ?? 0, item.score ?? 0),
          }
        }
      }
      return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } catch {
      return local
    }
  }
}

export const frontendJsSubmissionService = new FrontendJsSubmissionService()
