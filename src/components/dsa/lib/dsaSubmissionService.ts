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

    // Also mirror to shared local storage key for resilience
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('dsa_submissions_v1')
        const list: DSASubmission[] = raw ? JSON.parse(raw) : []
        if (!list.some(s => s.id === submission.id)) {
          list.unshift(submission)
          localStorage.setItem('dsa_submissions_v1', JSON.stringify(list.slice(0, 1000)))
        }
      }
    } catch (_) {}

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

    // 4. Sync to Tracking Service for Candidate Dashboard Telemetry, Streaks & Canonical Submissions Table
    try {
      const trackingStatus = submission.status === 'Accepted' ? 'accepted' : 'failed'
      await trackingService.recordSubmission({
        id: submission.id,
        questionId: submission.questionId,
        category: 'DSA',
        userId: userId,
        code: submission.code,
        language: submission.language,
        status: trackingStatus,
        score,
        passedTests: submission.testsPassed,
        totalTests: submission.testsTotal,
        executionTime: submission.runtimeMs,
      })
    } catch (trackErr) {
      console.debug('Tracking service sync notice:', trackErr)
    }
  }

  async fetchUserSubmissions(userId?: string, questionId?: string): Promise<DSASubmission[]> {
    const localItems: DSASubmission[] = []

    // 1. Collect from dsaProgressService
    try {
      const fromProg = dsaProgressService.getSubmissions(questionId)
      localItems.push(...fromProg)
    } catch (_) {}

    // 2. Collect from dsa_submissions_v1 local storage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem('dsa_submissions_v1')
        if (raw) {
          const parsed: DSASubmission[] = JSON.parse(raw)
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

    // 3. Collect from faang_tracking_submissions_v1 local storage — only as fallback if localItems is empty
    if (localItems.length === 0) {
      try {
        if (typeof localStorage !== 'undefined') {
          const rawTrack = localStorage.getItem('faang_tracking_submissions_v1')
          if (rawTrack) {
            const parsedTrack: any[] = JSON.parse(rawTrack)
            if (Array.isArray(parsedTrack)) {
              parsedTrack.forEach(item => {
                const qid = String(item.questionId || '')
                const qUpper = qid.toUpperCase()
                const isDSA = item.category === 'DSA' || qUpper.startsWith('DSA') || (/^\d+$/.test(qid) && !qUpper.startsWith('JS-P') && !qUpper.startsWith('FJP') && !qUpper.startsWith('Q'))
                if (isDSA && (!questionId || qid === questionId)) {
                  localItems.push({
                    id: String(item.id),
                    questionId: qid,
                    language: (item.language || 'javascript') as 'javascript' | 'typescript',
                    code: item.code || '',
                    status: (item.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as DSASubmission['status'],
                    testsPassed: Number(item.passedTests ?? item.testsPassed ?? (item.status === 'accepted' ? 4 : 0)),
                    testsTotal: Number(item.totalTests ?? item.testsTotal ?? 4),
                    runtimeMs: Number(item.executionTime || item.runtimeMs || 0),
                    timestamp: item.createdAt || new Date().toISOString(),
                  })
                }
              })
            }
          }
        }
      } catch (_) {}
    }

    const isValidUuid = Boolean(userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId))
    if (!userId || !isValidUuid || !supabase) {
      return this.deduplicateAndSort(localItems)
    }

    const remoteItems: DSASubmission[] = []

    try {
      const [dsaRes, generalRes] = await Promise.allSettled([
        (async () => {
          let q = supabase
            .from('dsa_submissions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
          if (questionId) q = q.eq('question_id', questionId)
          return await q
        })(),
        (async () => {
          let q = supabase
            .from('submissions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
          if (questionId) q = q.eq('question_id', questionId)
          return await q
        })(),
      ])

      // Parse dedicated dsa_submissions
      if (dsaRes.status === 'fulfilled' && Array.isArray(dsaRes.value.data)) {
        dsaRes.value.data.forEach(row => {
          remoteItems.push({
            id: String(row.id),
            questionId: String(row.question_id),
            language: (row.language || 'javascript') as 'javascript' | 'typescript',
            code: row.code || '',
            status: (row.status === 'accepted'
              ? 'Accepted'
              : row.status === 'wrong_answer'
              ? 'Wrong Answer'
              : row.status === 'runtime_error'
              ? 'Runtime Error'
              : row.status === 'time_limit_exceeded'
              ? 'Time Limit Exceeded'
              : 'Compile Error') as DSASubmission['status'],
            testsPassed: Number(row.tests_passed ?? (row.status === 'accepted' ? 4 : 0)),
            testsTotal: Number(row.tests_total ?? 4),
            runtimeMs: Number(row.runtime_ms) || 0,
            timestamp: String(row.created_at),
          })
        })
      }

      // Parse canonical submissions (filtered for DSA)
      if (generalRes.status === 'fulfilled' && Array.isArray(generalRes.value.data)) {
        generalRes.value.data.forEach(row => {
          const qid = String(row.question_id || '')
          const qUpper = qid.toUpperCase()
          const isDSA = row.category === 'DSA' || qUpper.startsWith('DSA') || (/^\d+$/.test(qid) && !qUpper.startsWith('JS-P') && !qUpper.startsWith('FJP') && !qUpper.startsWith('Q'))
          if (isDSA) {
            remoteItems.push({
              id: String(row.id),
              questionId: qid,
              language: (row.language || 'javascript') as 'javascript' | 'typescript',
              code: row.code || '',
              status: (row.status === 'accepted' ? 'Accepted' : 'Wrong Answer') as DSASubmission['status'],
              testsPassed: Number(row.passed_tests ?? (row.status === 'accepted' ? 4 : 0)),
              testsTotal: Number(row.total_tests ?? 4),
              runtimeMs: Number(row.execution_time) || 0,
              timestamp: String(row.created_at),
            })
          }
        })
      }
    } catch (err) {
      console.warn('[DSA] Error querying Supabase submissions:', err)
    }

    return this.deduplicateAndSort([...localItems, ...remoteItems])
  }

  private deduplicateAndSort(items: DSASubmission[]): DSASubmission[] {
    const result: DSASubmission[] = []

    for (const item of items) {
      if (!item || !item.id) continue
      const itemTime = new Date(item.timestamp).getTime()
      const duplicateIdx = result.findIndex(existing => {
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
        result.push(item)
      } else {
        const existing = result[duplicateIdx]
        const preferItem = (item.testsTotal || 0) > (existing.testsTotal || 0) || Boolean(item.runtimeMs && !existing.runtimeMs)
        result[duplicateIdx] = {
          ...(preferItem ? item : existing),
          testsPassed: Math.max(existing.testsPassed ?? 0, item.testsPassed ?? 0),
          testsTotal: Math.max(existing.testsTotal ?? 0, item.testsTotal ?? 0),
          runtimeMs: existing.runtimeMs || item.runtimeMs,
        }
      }
    }

    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }
}

export const dsaSubmissionService = new DSASubmissionService()
