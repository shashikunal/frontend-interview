// src/components/coreprogramming/lib/coreProgrammingSubmissionService.ts
// Handles persisting Core Programming submissions to Supabase + local storage
// and syncing progress summary for dashboard / leaderboard consumption.

import { supabase } from '../../../lib/supabase/client'
import type { CoreProgrammingSubmission } from '../data/coreProgrammingTypes'
import { coreProgrammingProgressService } from './coreProgrammingProgressService'
import { trackingService } from '../../../lib/trackingService'

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

      // Mirror in the shared localStorage key so the leaderboard and dashboards can pick it up
      try {
        const raw = localStorage.getItem(LOCAL_CP_SUBMISSIONS_KEY)
        const list: CoreProgrammingSubmission[] = raw ? JSON.parse(raw) : []
        if (!list.some(s => s.id === submission.id)) {
          list.unshift({ ...submission, candidateId: user?.id || 'anon' })
          localStorage.setItem(LOCAL_CP_SUBMISSIONS_KEY, JSON.stringify(list.slice(0, 1000)))
        }
      } catch (e) {
        console.warn('[CP] Local mirror save failed:', e)
      }

      // 2. Sync to Tracking Service for Candidate Dashboard Telemetry, Streaks & Canonical Submissions Table
      try {
        await trackingService.recordSubmission({
          questionId: submission.questionId,
          category: 'CORE_PROGRAMMING',
          userId: user?.id,
          code: submission.code,
          language: 'javascript',
          status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
          score: submission.score,
          passedTests: submission.testsPassed,
          totalTests: submission.testsTotal,
          executionTime: submission.runtimeMs,
          idempotencyKey: key,
        })
      } catch (trackErr) {
        console.debug('[CP] Tracking service sync notice:', trackErr)
      }

      // 3. Sync directly to canonical `submissions` table when authenticated
      const userId = user?.id
      if (userId && supabase) {
        try {
          // Insert directly into the live canonical Supabase submissions table
          const { error } = await supabase.from('submissions').insert({
            user_id: userId,
            question_id: submission.questionId,
            code: submission.code,
            language: 'javascript',
            status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
            score: submission.score,
            execution_time: submission.runtimeMs ? Math.max(1, Math.round(submission.runtimeMs / 1000)) : 1,
            created_at: submission.timestamp,
          })

          if (error && !error.message.includes('duplicate')) {
            console.debug('[CP] Supabase canonical submissions sync notice:', error.message)
          }

          // 3b. Best-effort mirror into dedicated core_programming_submissions.
          // Canonical `submissions` stays source of truth; ignore schema-cache
          // errors so this never breaks when the table is not yet deployed.
          try {
            const { error: cpErr } = await supabase.from('core_programming_submissions').insert({
              id: submission.id,
              user_id: userId,
              question_id: submission.questionId,
              code: submission.code,
              status: submission.status === 'Accepted' ? 'accepted' : 'wrong_answer',
              score: submission.score,
              tests_passed: submission.testsPassed,
              tests_total: submission.testsTotal,
              execution_time_ms: submission.runtimeMs || 0,
              time_spent_seconds: submission.timeSpentSeconds || 0,
              created_at: submission.timestamp,
            })
            if (cpErr && !cpErr.message.includes('duplicate') && !cpErr.message.includes('schema cache')) {
              console.debug('[CP] Dedicated table sync notice:', cpErr.message)
            }
          } catch {
            // ignore — canonical insert above already succeeded
          }

          // 3c. Best-effort attempt ledger so Attempt sections + Tracks pick up
          // Core Programming (submits otherwise bypass question_attempts entirely).
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
        } catch (dbErr) {
          console.debug('[CP] Supabase sync skipped:', dbErr)
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
    // 1. Collect all local submissions across all known local storage storage keys
    const localItems: CoreProgrammingSubmission[] = []
    
    // a) core_prog_submissions_v1
    try {
      const fromProg = coreProgrammingProgressService.getSubmissions(questionId)
      localItems.push(...fromProg)
    } catch (_) {}

    // b) cp_candidate_submissions_v1
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_CP_SUBMISSIONS_KEY)
        if (raw) {
          const parsed: CoreProgrammingSubmission[] = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (!questionId || item.questionId === questionId) {
                localItems.push(item)
              }
            })
          }
        }
      }
    } catch (_) {}

    // c) faang_tracking_submissions_v1 (matching core programming)
    try {
      if (typeof localStorage !== 'undefined') {
        const rawTrack = localStorage.getItem('faang_tracking_submissions_v1')
        if (rawTrack) {
          const parsedTrack: any[] = JSON.parse(rawTrack)
          if (Array.isArray(parsedTrack)) {
            parsedTrack.forEach(item => {
              const qid = String(item.questionId || '')
              const qUpper = qid.toUpperCase()
              const isCP = item.category === 'CORE_PROGRAMMING' || qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP')
              if (isCP && (!questionId || qid === questionId)) {
                localItems.push({
                  id: String(item.id),
                  candidateId: item.userId || userId || 'anon',
                  questionId: qid,
                  code: item.code || '',
                  status: (item.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as CoreProgrammingSubmission['status'],
                  score: Number(item.score || 0),
                  testsPassed: Number(item.passedTests || item.testsPassed || (item.status === 'accepted' ? 4 : 0)),
                  testsTotal: Number(item.totalTests || item.testsTotal || 4),
                  runtimeMs: Number(item.executionTime || item.runtimeMs || 0),
                  timeSpentSeconds: Number(item.timeSpent || item.timeSpentSeconds || 0),
                  timestamp: item.createdAt || new Date().toISOString(),
                })
              }
            })
          }
        }
      }
    } catch (_) {}

    let effectiveUserId = userId
    if (!effectiveUserId && supabase) {
      try {
        const { data } = await supabase.auth.getSession()
        effectiveUserId = data.session?.user?.id
      } catch {}
    }

    if (!effectiveUserId || !supabase) {
      return this.deduplicateAndSort(localItems)
    }

    // 2. Fetch from Supabase: both dedicated core_programming_submissions AND canonical submissions table
    const remoteItems: CoreProgrammingSubmission[] = []

    try {
      const [cpRes, generalRes] = await Promise.allSettled([
        // Query dedicated table
        (async () => {
          let q = supabase
            .from('core_programming_submissions')
            .select('*')
            .eq('user_id', effectiveUserId)
            .order('created_at', { ascending: false })
            .limit(1000)
          if (questionId) q = q.eq('question_id', questionId)
          return await q
        })(),
        // Query canonical submissions table
        (async () => {
          let q = supabase
            .from('submissions')
            .select('*')
            .eq('user_id', effectiveUserId)
            .order('created_at', { ascending: false })
            .limit(1000)
          if (questionId) q = q.eq('question_id', questionId)
          return await q
        })(),
      ])

      // Parse dedicated core_programming_submissions
      if (cpRes.status === 'fulfilled' && Array.isArray(cpRes.value.data)) {
        cpRes.value.data.forEach(row => {
          remoteItems.push({
            id: String(row.id),
            candidateId: String(row.user_id),
            questionId: String(row.question_id),
            code: row.code || '',
            status: (row.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as CoreProgrammingSubmission['status'],
            score: Number(row.score ?? (row.status === 'accepted' ? 100 : 0)),
            testsPassed: Number(row.tests_passed ?? (row.status === 'accepted' ? 4 : 0)),
            testsTotal: Number(row.tests_total ?? 4),
            runtimeMs: Number(row.execution_time_ms) || 0,
            timeSpentSeconds: Number(row.time_spent_seconds) || 0,
            timestamp: String(row.created_at),
          })
        })
      }

      // Parse canonical submissions table (filtered for Core Programming)
      if (generalRes.status === 'fulfilled' && Array.isArray(generalRes.value.data)) {
        generalRes.value.data.forEach(row => {
          const qid = String(row.question_id || '')
          const qUpper = qid.toUpperCase()
          const isCP = row.category === 'CORE_PROGRAMMING' || qUpper.startsWith('JS-P') || qUpper.startsWith('JSP') || qUpper.startsWith('CP')
          if (isCP) {
            remoteItems.push({
              id: String(row.id),
              candidateId: String(row.user_id),
              questionId: qid,
              code: row.code || '',
              status: (row.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as CoreProgrammingSubmission['status'],
              score: Number(row.score ?? (row.status === 'accepted' ? 100 : 0)),
              testsPassed: Number(row.passed_tests ?? (row.status === 'accepted' ? 4 : 0)),
              testsTotal: Number(row.total_tests ?? 4),
              runtimeMs: Number(row.execution_time) || 0,
              timeSpentSeconds: Number(row.time_spent_seconds) || 0,
              timestamp: String(row.created_at),
            })
          }
        })
      }
    } catch (err) {
      console.warn('[CP] Error querying Supabase submissions:', err)
    }

    return this.deduplicateAndSort([...localItems, ...remoteItems])
  }

  private deduplicateAndSort(items: CoreProgrammingSubmission[]): CoreProgrammingSubmission[] {
    const seen = new Set<string>()
    const result: CoreProgrammingSubmission[] = []

    for (const item of items) {
      if (!item || !item.id) continue
      if (seen.has(item.id)) continue
      seen.add(item.id)
      result.push(item)
    }

    // Sort descending by timestamp
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
}

export const coreProgrammingSubmissionService = new CoreProgrammingSubmissionService()
