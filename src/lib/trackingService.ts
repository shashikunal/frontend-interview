import { supabase } from './supabase/client'

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'question_viewed'
  | 'question_started'
  | 'draft_saved'
  | 'code_run'
  | 'answer_submitted'
  | 'submission_started'
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
  lastActivityAt?: string
  completedAt?: string | null
  status: 'started' | 'in_progress' | 'completed' | 'abandoned'
  attemptCount: number
  timeSpent: number // in seconds
  timeSpentSeconds?: number
  createdAt: string
  updatedAt: string
}

export interface QuestionDraft {
  id?: string
  userId: string
  questionId: string
  attemptId?: string | null
  language: string
  code: string
  updatedAt: string
}

export interface CodeExecutionRecord {
  id: string
  userId: string
  questionId: string
  attemptId?: string | null
  language: string
  executionStatus: 'success' | 'runtime_error' | 'compile_error' | 'time_limit'
  executionTime: number // ms
  memoryUsed: number
  errorMessage?: string
  createdAt: string
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
  timeSpent: number // in seconds
  timeSpentSeconds?: number
  firstAttemptAt: string
  lastAttemptAt?: string
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
const LOCAL_DRAFTS_PREFIX = 'faang_draft_'

// Debounce map for question_viewed to avoid redundant spam on fast clicks
const viewedQuestionsCache = new Map<string, number>()
const VIEW_DEBOUNCE_MS = 60 * 1000 // 1 minute per question

// Debounce timers for draft saving: Map of `questionId_language` -> timer
const draftSaveTimers = new Map<string, ReturnType<typeof setTimeout>>()
const DRAFT_DEBOUNCE_MS = 1500

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
   * Starts a question attempt or retrieves existing unfinished attempt
   * (Resumes attempt on page reload or re-open)
   */
  startOrResumeQuestionAttempt: async (questionId: string | number): Promise<string> => {
    const strQId = String(questionId)
    const userId = await getAuthUserId()
    const now = new Date().toISOString()
    const sessionKey = `active_attempt_${strQId}`

    // 1. Check current session storage first
    if (typeof sessionStorage !== 'undefined') {
      const existingSessionAttempt = sessionStorage.getItem(sessionKey)
      if (existingSessionAttempt) {
        // Update last activity timestamp
        void trackingService.updateQuestionAttempt(existingSessionAttempt, {
          lastActivityAt: now,
        })
        return existingSessionAttempt
      }
    }

    // 2. Query Supabase for unfinished attempt
    if (userId) {
      try {
        const { data: existingActive } = await supabase
          .from('question_attempts')
          .select('id, attempt_count, time_spent, time_spent_seconds')
          .eq('user_id', userId)
          .eq('question_id', strQId)
          .in('status', ['started', 'in_progress'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (existingActive?.id) {
          const attemptId = String(existingActive.id)
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(sessionKey, attemptId)
            sessionStorage.setItem(`attempt_start_${attemptId}`, String(Date.now()))
          }
          await trackingService.updateQuestionAttempt(attemptId, {
            lastActivityAt: now,
            status: 'in_progress',
          })
          return attemptId
        }
      } catch (err) {
        console.warn('[TrackingService] Failed querying active attempts from Supabase:', err)
      }
    }

    // 3. Determine attempt count
    let attemptNumber = 1
    if (userId) {
      try {
        const { count } = await supabase
          .from('question_attempts')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('question_id', strQId)
        attemptNumber = (count || 0) + 1
      } catch {
        attemptNumber = 1
      }
    }

    // 4. Create new attempt
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
      lastActivityAt: now,
      status: 'started',
      attemptCount: attemptNumber,
      timeSpent: 0,
      timeSpentSeconds: 0,
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
      attemptNumber,
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
            attempt_count: attemptNumber,
            started_at: now,
            last_activity_at: now,
          })
          .select('id')
          .single()

        if (!error && data?.id) {
          const actualId = String(data.id)
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(sessionKey, actualId)
          }
          return actualId
        }
      } catch (err) {
        console.warn('[TrackingService] Failed writing question_attempts to Supabase:', err)
      }
    }

    return attemptId
  },

  /**
   * Alias for backward compatibility
   */
  startQuestionAttempt: async (questionId: string | number): Promise<string> => {
    return trackingService.startOrResumeQuestionAttempt(questionId)
  },

  /**
   * Update active question attempt (status, time spent, completedAt, etc.)
   */
  updateQuestionAttempt: async (
    attemptId: string,
    updates: Partial<{
      status: 'started' | 'in_progress' | 'completed' | 'abandoned'
      timeSpent: number
      timeSpentSeconds: number
      completedAt: string | null
      lastActivityAt: string
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
        const dbUpdates: Record<string, unknown> = { updated_at: now }
        if (updates.status) dbUpdates.status = updates.status
        if (updates.timeSpent !== undefined) {
          dbUpdates.time_spent = updates.timeSpent
          dbUpdates.time_spent_seconds = updates.timeSpent
        }
        if (updates.timeSpentSeconds !== undefined) {
          dbUpdates.time_spent_seconds = updates.timeSpentSeconds
          dbUpdates.time_spent = updates.timeSpentSeconds
        }
        if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt
        if (updates.lastActivityAt) dbUpdates.last_activity_at = updates.lastActivityAt

        await supabase
          .from('question_attempts')
          .update(dbUpdates)
          .eq('id', attemptId)
      } catch (err) {
        console.warn('[TrackingService] Failed updating question_attempts in Supabase:', err)
      }
    }
  },

  /**
   * Save user's code draft with debouncing to prevent database spam
   */
  saveDraft: (
    questionId: string | number,
    code: string,
    language: string = 'javascript',
    attemptId?: string | null
  ): void => {
    const strQId = String(questionId)
    const timerKey = `${strQId}_${language}`

    // 1. Immediate local storage update (instant offline backup)
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`${LOCAL_DRAFTS_PREFIX}${timerKey}`, JSON.stringify({
          questionId: strQId,
          code,
          language,
          attemptId,
          updatedAt: new Date().toISOString(),
        }))
      }
    } catch {
      // ignore
    }

    // 2. Debounced save to Supabase
    const existingTimer = draftSaveTimers.get(timerKey)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    const newTimer = setTimeout(async () => {
      draftSaveTimers.delete(timerKey)
      const userId = await getAuthUserId()
      if (!userId) return

      const now = new Date().toISOString()
      try {
        await supabase.from('question_drafts').upsert(
          {
            user_id: userId,
            question_id: strQId,
            language,
            code,
            attempt_id: attemptId && !attemptId.startsWith('att_') ? attemptId : null,
            updated_at: now,
          },
          { onConflict: 'user_id,question_id,language' }
        )

        // Broadcast draft saved event for UI sync
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('platform_draft_saved', {
            detail: { questionId: strQId, language, savedAt: now },
          }))
        }
      } catch (err) {
        console.warn('[TrackingService] Failed saving draft to Supabase:', err)
      }
    }, DRAFT_DEBOUNCE_MS)

    draftSaveTimers.set(timerKey, newTimer)
  },

  /**
   * Restore user's draft code (checks Supabase, falls back to localStorage)
   */
  getDraft: async (
    questionId: string | number,
    language: string = 'javascript'
  ): Promise<QuestionDraft | null> => {
    const strQId = String(questionId)
    const userId = await getAuthUserId()
    const timerKey = `${strQId}_${language}`

    // 1. Try Supabase first if authenticated
    if (userId) {
      try {
        const { data, error } = await supabase
          .from('question_drafts')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', strQId)
          .eq('language', language)
          .maybeSingle()

        if (!error && data?.code) {
          return {
            id: String(data.id),
            userId: String(data.user_id),
            questionId: String(data.question_id),
            attemptId: data.attempt_id ? String(data.attempt_id) : null,
            language: data.language || language,
            code: data.code,
            updatedAt: String(data.updated_at),
          }
        }
      } catch (err) {
        console.warn('[TrackingService] Error retrieving draft from Supabase:', err)
      }
    }

    // 2. Fallback to localStorage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(`${LOCAL_DRAFTS_PREFIX}${timerKey}`)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed?.code) {
            return {
              userId: userId || 'guest',
              questionId: strQId,
              language: parsed.language || language,
              code: parsed.code,
              attemptId: parsed.attemptId || null,
              updatedAt: parsed.updatedAt || new Date().toISOString(),
            }
          }
        }
      }
    } catch {
      // ignore
    }

    return null
  },

  /**
   * Record a "Run Code" execution (separate from submissions)
   */
  recordCodeExecution: async (params: {
    questionId: string | number
    attemptId?: string | null
    language?: string
    executionStatus: 'success' | 'runtime_error' | 'compile_error' | 'time_limit'
    executionTime?: number
    memoryUsed?: number
    errorMessage?: string
  }): Promise<CodeExecutionRecord> => {
    const strQId = String(params.questionId)
    const userId = await getAuthUserId()
    const now = new Date().toISOString()
    const execId = `exec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const record: CodeExecutionRecord = {
      id: execId,
      userId: userId || 'guest',
      questionId: strQId,
      attemptId: params.attemptId || null,
      language: params.language || 'javascript',
      executionStatus: params.executionStatus,
      executionTime: params.executionTime || 0,
      memoryUsed: params.memoryUsed || 0,
      errorMessage: params.errorMessage,
      createdAt: now,
    }

    // Track activity
    await trackingService.trackActivity('code_run', 'question', strQId, {
      language: params.language,
      executionStatus: params.executionStatus,
      executionTime: params.executionTime,
      attemptId: params.attemptId,
    })

    // Write to Supabase code_executions
    if (userId) {
      try {
        await supabase.from('code_executions').insert({
          user_id: userId,
          question_id: strQId,
          attempt_id: params.attemptId && !params.attemptId.startsWith('att_') ? params.attemptId : null,
          language: params.language || 'javascript',
          execution_status: params.executionStatus,
          execution_time: params.executionTime || 0,
          memory_used: params.memoryUsed || 0,
          error_message: params.errorMessage,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed writing code_executions to Supabase:', err)
      }
    }

    return record
  },

  /**
   * Record an evaluated submission with status, score, runtime, and update progress
   * Preserves full history without overwriting past submissions
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
    } else {
      await trackingService.trackActivity('submission_failed', 'submission', subId, {
        questionId: strQId,
        status: params.status,
      })
    }

    // 3. Insert into Supabase submissions table
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
          .maybeSingle()

        const currentAttempts = (existingProgress?.attempt_count || 0) + 1
        const bestScore = Math.max(existingProgress?.best_score || 0, score)
        const isNowAccepted = params.status === 'accepted'
        const isPreviouslyCompleted = existingProgress?.status === 'completed'
        const progressStatus = isNowAccepted || isPreviouslyCompleted ? 'completed' : 'in_progress'

        await supabase.from('user_question_progress').upsert({
          user_id: userId,
          question_id: strQId,
          status: progressStatus,
          best_score: bestScore,
          attempt_count: currentAttempts,
          last_attempt_at: now,
          completed_at: isNowAccepted ? now : existingProgress?.completed_at,
          updated_at: now,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed updating user_question_progress in Supabase:', err)
      }

      // 5. Update question_attempts status
      if (params.attemptId && !params.attemptId.startsWith('att_')) {
        const isAccepted = params.status === 'accepted'
        await trackingService.updateQuestionAttempt(params.attemptId, {
          status: isAccepted ? 'completed' : 'in_progress',
          completedAt: isAccepted ? now : null,
          lastActivityAt: now,
        })

        if (isAccepted) {
          await trackingService.trackActivity('question_completed', 'question', strQId, {
            score,
            attemptId: params.attemptId,
          })
        }
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
        timeSpentSeconds: computedTimeSpent,
        completedAt: now,
        lastActivityAt: now,
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
        const { data: existingProgress } = await supabase
          .from('user_question_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', strQId)
          .maybeSingle()

        await supabase.from('user_question_progress').upsert({
          user_id: userId,
          question_id: strQId,
          status: 'completed',
          best_score: Math.max(existingProgress?.best_score || 0, score),
          attempt_count: (existingProgress?.attempt_count || 0) + 1,
          time_spent_seconds: (existingProgress?.time_spent_seconds || 0) + computedTimeSpent,
          time_spent: (existingProgress?.time_spent || 0) + computedTimeSpent,
          last_attempt_at: now,
          completed_at: now,
          updated_at: now,
        })
      } catch (err) {
        console.warn('[TrackingService] Failed marking progress completed in Supabase:', err)
      }
    } else {
      const localList = getLocalStore<Record<string, unknown>>(LOCAL_PROGRESS_KEY)
      localList.push({ questionId: strQId, status: 'completed', bestScore: score, completedAt: now })
      saveLocalStore(LOCAL_PROGRESS_KEY, localList)
    }
  },

  /**
   * Get single question progress for current user
   */
  getUserQuestionProgress: async (questionId: string | number): Promise<UserQuestionProgress | null> => {
    const strQId = String(questionId)
    const userId = await getAuthUserId()

    if (userId) {
      try {
        const { data, error } = await supabase
          .from('user_question_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('question_id', strQId)
          .maybeSingle()

        if (!error && data) {
          return {
            id: String(data.id),
            userId: String(data.user_id),
            questionId: String(data.question_id),
            status: data.status,
            bestScore: Number(data.best_score || 0),
            attemptCount: Number(data.attempt_count || 0),
            timeSpent: Number(data.time_spent_seconds || data.time_spent || 0),
            timeSpentSeconds: Number(data.time_spent_seconds || data.time_spent || 0),
            firstAttemptAt: String(data.first_attempt_at),
            lastAttemptAt: data.last_attempt_at ? String(data.last_attempt_at) : undefined,
            completedAt: data.completed_at ? String(data.completed_at) : null,
            updatedAt: String(data.updated_at),
          }
        }
      } catch (err) {
        console.warn('[TrackingService] Error in getUserQuestionProgress:', err)
      }
    }

    const localList = getLocalStore<any>(LOCAL_PROGRESS_KEY)
    const match = localList.find((p: any) => String(p.questionId) === strQId)
    if (match) {
      return {
        userId: 'guest',
        questionId: strQId,
        status: match.status || 'not_started',
        bestScore: match.bestScore || 0,
        attemptCount: match.attemptCount || 1,
        timeSpent: match.timeSpent || 0,
        firstAttemptAt: match.firstAttemptAt || new Date().toISOString(),
        updatedAt: match.updatedAt || new Date().toISOString(),
      }
    }

    return null
  },

  /**
   * Get all question progress records for current user (for QuestionList & Dashboard)
   */
  getAllUserQuestionProgress: async (): Promise<Map<string, UserQuestionProgress>> => {
    const map = new Map<string, UserQuestionProgress>()
    const userId = await getAuthUserId()

    if (userId) {
      try {
        const { data, error } = await supabase
          .from('user_question_progress')
          .select('*')
          .eq('user_id', userId)

        if (!error && Array.isArray(data)) {
          data.forEach(d => {
            map.set(String(d.question_id), {
              id: String(d.id),
              userId: String(d.user_id),
              questionId: String(d.question_id),
              status: d.status,
              bestScore: Number(d.best_score || 0),
              attemptCount: Number(d.attempt_count || 0),
              timeSpent: Number(d.time_spent_seconds || d.time_spent || 0),
              timeSpentSeconds: Number(d.time_spent_seconds || d.time_spent || 0),
              firstAttemptAt: String(d.first_attempt_at),
              lastAttemptAt: d.last_attempt_at ? String(d.last_attempt_at) : undefined,
              completedAt: d.completed_at ? String(d.completed_at) : null,
              updatedAt: String(d.updated_at),
            })
          })
          return map
        }
      } catch (err) {
        console.warn('[TrackingService] Error fetching all user question progress:', err)
      }
    }

    // Fallback to local progress
    const local = getLocalStore<any>(LOCAL_PROGRESS_KEY)
    local.forEach((p: any) => {
      const qId = String(p.questionId)
      if (!map.has(qId)) {
        map.set(qId, {
          userId: 'guest',
          questionId: qId,
          status: p.status || 'not_started',
          bestScore: p.bestScore || 0,
          attemptCount: p.attemptCount || 1,
          timeSpent: p.timeSpent || 0,
          firstAttemptAt: p.firstAttemptAt || new Date().toISOString(),
          updatedAt: p.updatedAt || new Date().toISOString(),
        })
      }
    })

    return map
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

  /**
   * Get complete question history (attempts + submissions) for candidate / admin inspection
   */
  getQuestionHistory: async (questionId: string | number, targetUserId?: string): Promise<{
    attempts: QuestionAttempt[]
    submissions: SubmissionRecord[]
    progress: UserQuestionProgress | null
  }> => {
    const strQId = String(questionId)
    const userId = targetUserId || (await getAuthUserId())

    let attempts: QuestionAttempt[] = []
    let submissions: SubmissionRecord[] = []
    let progress: UserQuestionProgress | null = null

    if (userId) {
      try {
        const [attRes, subRes, progRes] = await Promise.all([
          supabase
            .from('question_attempts')
            .select('*')
            .eq('user_id', userId)
            .eq('question_id', strQId)
            .order('created_at', { ascending: false }),
          supabase
            .from('submissions')
            .select('*')
            .eq('user_id', userId)
            .eq('question_id', strQId)
            .order('created_at', { ascending: false }),
          supabase
            .from('user_question_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('question_id', strQId)
            .maybeSingle(),
        ])

        if (Array.isArray(attRes.data)) {
          attempts = attRes.data.map(d => ({
            id: String(d.id),
            userId: String(d.user_id),
            questionId: String(d.question_id),
            startedAt: String(d.started_at),
            lastActivityAt: d.last_activity_at ? String(d.last_activity_at) : undefined,
            completedAt: d.completed_at ? String(d.completed_at) : null,
            status: d.status,
            attemptCount: Number(d.attempt_count || 1),
            timeSpent: Number(d.time_spent_seconds || d.time_spent || 0),
            timeSpentSeconds: Number(d.time_spent_seconds || d.time_spent || 0),
            createdAt: String(d.created_at),
            updatedAt: String(d.updated_at),
          }))
        }

        if (Array.isArray(subRes.data)) {
          submissions = subRes.data.map(d => ({
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

        if (progRes.data) {
          progress = {
            id: String(progRes.data.id),
            userId: String(progRes.data.user_id),
            questionId: String(progRes.data.question_id),
            status: progRes.data.status,
            bestScore: Number(progRes.data.best_score || 0),
            attemptCount: Number(progRes.data.attempt_count || 0),
            timeSpent: Number(progRes.data.time_spent_seconds || progRes.data.time_spent || 0),
            timeSpentSeconds: Number(progRes.data.time_spent_seconds || progRes.data.time_spent || 0),
            firstAttemptAt: String(progRes.data.first_attempt_at),
            lastAttemptAt: progRes.data.last_attempt_at ? String(progRes.data.last_attempt_at) : undefined,
            completedAt: progRes.data.completed_at ? String(progRes.data.completed_at) : null,
            updatedAt: String(progRes.data.updated_at),
          }
        }
      } catch (err) {
        console.warn('[TrackingService] Error in getQuestionHistory:', err)
      }
    }

    return { attempts, submissions, progress }
  },
}
