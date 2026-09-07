import { supabase } from './supabase/client'

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'question_viewed'
  | 'question_started'
  | 'code_run'
  | 'answer_submitted'
  | 'submission_accepted'
  | 'submission_failed'
  | 'question_completed'
  | 'question_bookmarked'
  | 'question_unbookmarked'
  | 'note_created'
  | 'mock_interview_started'
  | 'mock_interview_completed'
  | 'profile_updated'

export type SubmissionStatus =
  | 'pending'
  | 'running'
  | 'accepted'
  | 'wrong_answer'
  | 'runtime_error'
  | 'compile_error'
  | 'time_limit'
  | 'failed'

export interface QuestionAttempt {
  id: string
  userId: string
  questionId: string
  startedAt: string
  completedAt?: string | null
  status: 'started' | 'in_progress' | 'completed' | 'abandoned'
  attemptCount: number
  timeSpent: number // in seconds
  createdAt: string
  updatedAt: string
}

export interface SubmissionRecord {
  id: string
  userId: string
  questionId: string
  attemptId?: string | null
  answer?: string
  code?: string
  language: string
  status: SubmissionStatus
  score: number
  executionTime: number // ms
  memoryUsed: number
  createdAt: string
}

export interface UserQuestionProgress {
  id?: string
  userId: string
  questionId: string
  status: 'not_started' | 'in_progress' | 'completed'
  bestScore: number
  attemptCount: number
  timeSpent: number
  firstAttemptAt: string
  completedAt?: string | null
  updatedAt: string
}

export interface ActivityLogEntry {
  id: string
  userId: string | null
  action: ActivityAction
  entityType: 'question' | 'submission' | 'mock' | 'user' | 'system'
  entityId?: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// Local Storage Keys for Offline / Resilient Mirroring
const LOCAL_ATTEMPTS_KEY = 'faang_tracking_attempts_v1'
const LOCAL_SUBMISSIONS_KEY = 'faang_tracking_submissions_v1'
const LOCAL_PROGRESS_KEY = 'faang_tracking_user_progress_v1'
const LOCAL_ACTIVITIES_KEY = 'faang_tracking_activity_logs_v1'

// Debounce map for question_viewed to avoid redundant spam on fast clicks
const viewedQuestionsCache = new Map<string, number>()
const VIEW_DEBOUNCE_MS = 60 * 1000 // 1 minute per question

function getLocalStore<T>(key: string): T[] {
  try {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalStore<T>(key: string, items: T[], limit = 200): void {
  try {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, JSON.stringify(items.slice(0, limit)))
  } catch {
    // ignore quota
  }
}

/**
 * Get current authenticated user ID from Supabase session directly
 */
export async function getAuthUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession()
    return data.session?.user?.id || null
  } catch {
    return null
  }
}

export const trackingService = {
  /**
   * Log an activity event to activity_logs with offline mirror and debouncing
   */
  trackActivity: async (
    action: ActivityAction,
    entityType: 'question' | 'submission' | 'mock' | 'user' | 'system',
    entityId?: string | number,
    metadata: Record<string, unknown> = {}
  ): Promise<ActivityLogEntry | null> => {
    const strEntityId = entityId !== undefined ? String(entityId) : undefined

    // Idempotency check for question_viewed
    if (action === 'question_viewed' && strEntityId) {
      const lastViewed = viewedQuestionsCache.get(strEntityId) || 0
      if (Date.now() - lastViewed < VIEW_DEBOUNCE_MS) {
        return null // Skip duplicate view within debounce window
      }
      viewedQuestionsCache.set(strEntityId, Date.now())
    }

    const userId = await getAuthUserId()
    const now = new Date().toISOString()
    const entry: ActivityLogEntry = {
      id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId,
      action,
      entityType,
      entityId: strEntityId,
      metadata,
      createdAt: now,
    }

    // 1. Mirror locally
    const current = getLocalStore<ActivityLogEntry>(LOCAL_ACTIVITIES_KEY)
    current.unshift(entry)
    saveLocalStore(LOCAL_ACTIVITIES_KEY, current, 300)

    // 2. Dispatch in-process event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('platform_activity_logged', { detail: entry }))
    }

    // 3. Write to Supabase activity_logs table
    if (userId) {
      try {
        await supabase.from('activity_logs').insert({
          user_id: userId,
          action,
          entity_type: entityType,
          entity_id: strEntityId,
          metadata,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed writing activity_logs to Supabase:', err)
      }
    }

    return entry
  },

  /**
   * Starts a question attempt or retrieves active attempt
   */
  startQuestionAttempt: async (questionId: string | number): Promise<string> => {
    const strQId = String(questionId)
    const userId = await getAuthUserId()
    const now = new Date().toISOString()

    const sessionKey = `active_attempt_${strQId}`
    const existingAttemptId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(sessionKey) : null
    if (existingAttemptId) {
      return existingAttemptId
    }

    const attemptId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(sessionKey, attemptId)
      sessionStorage.setItem(`attempt_start_${attemptId}`, String(Date.now()))
    }

    const newAttempt: QuestionAttempt = {
      id: attemptId,
      userId: userId || 'guest',
      questionId: strQId,
      startedAt: now,
      status: 'started',
      attemptCount: 1,
      timeSpent: 0,
      createdAt: now,
      updatedAt: now,
    }

    // Local mirror
    const local = getLocalStore<QuestionAttempt>(LOCAL_ATTEMPTS_KEY)
    local.unshift(newAttempt)
    saveLocalStore(LOCAL_ATTEMPTS_KEY, local)

    // Log activity
    await trackingService.trackActivity('question_started', 'question', strQId, {
      attemptId,
      startedAt: now,
    })

    // Upsert into Supabase
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('question_attempts')
          .insert({
            user_id: userId,
            question_id: strQId,
            status: 'started',
            started_at: now,
          })
          .select('id')
          .single()

        if (!error && data?.id) {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(sessionKey, data.id)
          }
          return data.id
        }
      } catch (err) {
        console.warn('[TrackingService] Failed writing question_attempts to Supabase:', err)
      }
    }

    return attemptId
  },

  /**
   * Update active question attempt (e.g. status, time spent)
   */
  updateQuestionAttempt: async (
    attemptId: string,
    updates: Partial<{
      status: 'started' | 'in_progress' | 'completed' | 'abandoned'
      timeSpent: number
      completedAt: string
    }>
  ): Promise<void> => {
    const now = new Date().toISOString()
    const local = getLocalStore<QuestionAttempt>(LOCAL_ATTEMPTS_KEY)
    const idx = local.findIndex(a => a.id === attemptId)
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...updates,
        updatedAt: now,
      }
      saveLocalStore(LOCAL_ATTEMPTS_KEY, local)
    }

    const userId = await getAuthUserId()
    if (userId && !attemptId.startsWith('att_')) {
      try {
        await supabase
          .from('question_attempts')
          .update({
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.timeSpent !== undefined ? { time_spent: updates.timeSpent } : {}),
            ...(updates.completedAt ? { completed_at: updates.completedAt } : {}),
            updated_at: now,
          })
          .eq('id', attemptId)
      } catch (err) {
        console.warn('[TrackingService] Failed updating question_attempts in Supabase:', err)
      }
    }
  },

  /**
   * Record a submission with status, code, execution time, and update user progress
   */
  recordSubmission: async (params: {
    questionId: string | number
    attemptId?: string | null
    code?: string
    answer?: string
    language?: string
    status: SubmissionStatus
    score?: number
    executionTime?: number
    memoryUsed?: number
  }): Promise<SubmissionRecord> => {
    const strQId = String(params.questionId)
    const userId = await getAuthUserId()
    const now = new Date().toISOString()
    const score = params.score ?? (params.status === 'accepted' ? 100 : 0)

    const subId = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const submission: SubmissionRecord = {
      id: subId,
      userId: userId || 'guest',
      questionId: strQId,
      attemptId: params.attemptId || null,
      answer: params.answer || '',
      code: params.code || '',
      language: params.language || 'javascript',
      status: params.status,
      score,
      executionTime: params.executionTime || 0,
      memoryUsed: params.memoryUsed || 0,
      createdAt: now,
    }

    // 1. Mirror locally
    const localSubs = getLocalStore<SubmissionRecord>(LOCAL_SUBMISSIONS_KEY)
    localSubs.unshift(submission)
    saveLocalStore(LOCAL_SUBMISSIONS_KEY, localSubs, 300)

    // 2. Track activity
    await trackingService.trackActivity('answer_submitted', 'submission', subId, {
      questionId: strQId,
      language: params.language,
      status: params.status,
      score,
      executionTime: params.executionTime,
    })

    if (params.status === 'accepted') {
      await trackingService.trackActivity('submission_accepted', 'submission', subId, {
        questionId: strQId,
        score,
      })
    } else if (['wrong_answer', 'runtime_error', 'compile_error', 'failed'].includes(params.status)) {
      await trackingService.trackActivity('submission_failed', 'submission', subId, {
        questionId: strQId,
        status: params.status,
      })
    }

    // 3. Write to Supabase submissions table
    if (userId) {
      try {
        await supabase.from('submissions').insert({
          user_id: userId,
          question_id: strQId,
          attempt_id: params.attemptId && !params.attemptId.startsWith('att_') ? params.attemptId : null,
          code: params.code,
          answer: params.answer,
          language: params.language || 'javascript',
          status: params.status,
          score,
          execution_time: params.executionTime || 0,
          memory_used: params.memoryUsed || 0,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed writing submission to Supabase:', err)
      }

      // 4. Update user_question_progress
      try {
        const { data: existingProgress } = await supabase
          .from('user_question_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', strQId)
          .single()

        const currentAttempts = (existingProgress?.attempt_count || 0) + 1
        const bestScore = Math.max(existingProgress?.best_score || 0, score)
        const progressStatus = params.status === 'accepted' ? 'completed' : 'in_progress'

        await supabase.from('user_question_progress').upsert({
          user_id: userId,
          question_id: strQId,
          status: existingProgress?.status === 'completed' ? 'completed' : progressStatus,
          best_score: bestScore,
          attempt_count: currentAttempts,
          completed_at: params.status === 'accepted' ? now : existingProgress?.completed_at,
          updated_at: now,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed updating user_question_progress in Supabase:', err)
      }
    }

    return submission
  },

  /**
   * Mark a question attempt as completed
   */
  completeQuestionAttempt: async (
    questionId: string | number,
    score = 100,
    timeSpentSeconds?: number
  ): Promise<void> => {
    const strQId = String(questionId)
    const userId = await getAuthUserId()
    const now = new Date().toISOString()

    const sessionKey = `active_attempt_${strQId}`
    const attemptId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(sessionKey) : null
    let computedTimeSpent = timeSpentSeconds || 0

    if (!computedTimeSpent && attemptId && typeof sessionStorage !== 'undefined') {
      const startMs = Number(sessionStorage.getItem(`attempt_start_${attemptId}`))
      if (startMs) {
        computedTimeSpent = Math.max(1, Math.round((Date.now() - startMs) / 1000))
      }
    }

    // Update attempt if present
    if (attemptId) {
      await trackingService.updateQuestionAttempt(attemptId, {
        status: 'completed',
        timeSpent: computedTimeSpent,
        completedAt: now,
      })
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(sessionKey)
      }
    }

    // Log question_completed activity
    await trackingService.trackActivity('question_completed', 'question', strQId, {
      score,
      timeSpent: computedTimeSpent,
      attemptId,
    })

    // Upsert to user_question_progress
    if (userId) {
      try {
        await supabase.from('user_question_progress').upsert({
          user_id: userId,
          question_id: strQId,
          status: 'completed',
          best_score: score,
          completed_at: now,
          updated_at: now,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed marking progress completed in Supabase:', err)
        const localList = getLocalStore<Record<string, unknown>>(LOCAL_PROGRESS_KEY)
        localList.push({ questionId: strQId, status: 'completed', bestScore: score, completedAt: now })
        saveLocalStore(LOCAL_PROGRESS_KEY, localList)
      }
    } else {
      const localList = getLocalStore<Record<string, unknown>>(LOCAL_PROGRESS_KEY)
      localList.push({ questionId: strQId, status: 'completed', bestScore: score, completedAt: now })
      saveLocalStore(LOCAL_PROGRESS_KEY, localList)
    }
  },

  /**
   * Get all submissions locally or from Supabase for a question
   */
  getQuestionSubmissions: async (questionId: string | number): Promise<SubmissionRecord[]> => {
    const strQId = String(questionId)
    const userId = await getAuthUserId()

    if (userId) {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', strQId)
          .order('created_at', { ascending: false })

        if (!error && Array.isArray(data) && data.length > 0) {
          return data.map(d => ({
            id: String(d.id),
            userId: String(d.user_id),
            questionId: String(d.question_id),
            attemptId: d.attempt_id ? String(d.attempt_id) : null,
            answer: d.answer,
            code: d.code,
            language: d.language || 'javascript',
            status: d.status as SubmissionStatus,
            score: Number(d.score || 0),
            executionTime: Number(d.execution_time || 0),
            memoryUsed: Number(d.memory_used || 0),
            createdAt: String(d.created_at),
          }))
        }
      } catch {
        // fallback
      }
    }

    const local = getLocalStore<SubmissionRecord>(LOCAL_SUBMISSIONS_KEY)
    return local.filter(s => s.questionId === strQId)
  },
}
