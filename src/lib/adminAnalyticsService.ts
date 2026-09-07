import { supabase } from './supabase/client'
import type { SubmissionRecord, QuestionAttempt, ActivityAction } from './trackingService'

export type { SubmissionRecord, QuestionAttempt }

export interface AdminOverviewStats {
  totalUsers: number
  activeUsers: number
  totalQuestions: number
  totalAttempts: number
  totalSubmissions: number
  completedQuestions: number
  acceptedSubmissions: number
  failedSubmissions: number
  activityToday: number
  completionRate: number
  successRate: number
  avgAttemptsPerQuestion: number
  avgTimeSpentMinutes: number
}

export type OverviewStats = AdminOverviewStats
export type AttemptRecord = QuestionAttempt

export interface AdminSubmissionItem extends SubmissionRecord {
  userName?: string
  userEmail?: string
  questionTitle?: string
}

export interface AdminQuestionStat {
  id: string
  title: string
  category: string
  attemptsCount: number
  submissionsCount: number
  acceptedCount: number
  completionRate: number
  successRate: number
  avgAttempts: number
  avgTimeSpentSeconds: number
}

export type QuestionStatItem = AdminQuestionStat

export interface AdminActivityFeedItem {
  id: string
  timeStr: string
  timestamp: string
  userEmail: string
  userName: string
  action: ActivityAction
  formattedText: string
  badgeColor: string
  rawMetadata?: Record<string, unknown>
}

export type FormattedActivityItem = AdminActivityFeedItem

export interface AdminUserDetail {
  userId: string
  name: string
  email: string
  role: string
  createdAt: string
  lastActive: string
  totalAttempts: number
  totalSubmissions: number
  completedCount: number
  accuracyRate: number
  avgScore: number
  totalTimeMinutes: number
  recentSubmissions: AdminSubmissionItem[]
  recentAttempts: QuestionAttempt[]
  recentActivities: AdminActivityFeedItem[]
}

export type TimeframeFilter = 'today' | '7days' | '30days' | 'all'

function getDateThreshold(filter: TimeframeFilter): Date | null {
  const now = new Date()
  if (filter === 'today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  }
  if (filter === '7days') {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }
  if (filter === '30days') {
    return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  }
  return null
}

export const adminAnalyticsService = {
  /**
   * Aggregate overview metrics across users, attempts, submissions, and activities
   */
  getOverviewStats: async (timeframe: TimeframeFilter = 'all'): Promise<AdminOverviewStats> => {
    const threshold = getDateThreshold(timeframe)
    const thresholdIso = threshold ? threshold.toISOString() : null
    const todayMidnight = new Date()
    todayMidnight.setHours(0, 0, 0, 0)
    const todayIso = todayMidnight.toISOString()

    let totalUsers = 0
    let activeUsers = 0
    let totalAttempts = 0
    let totalSubmissions = 0
    let acceptedSubmissions = 0
    let failedSubmissions = 0
    let completedQuestions = 0
    let activityToday = 0
    let totalTimeSpentSeconds = 0

    try {
      // 1. Users
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      totalUsers = usersCount || 1

      // 2. Submissions
      let subQuery = supabase.from('submissions').select('id, status, execution_time, created_at')
      if (thresholdIso) {
        subQuery = subQuery.gte('created_at', thresholdIso)
      }
      const { data: subsData } = await subQuery

      if (Array.isArray(subsData)) {
        totalSubmissions = subsData.length
        subsData.forEach(s => {
          if (s.status === 'accepted') acceptedSubmissions++
          else if (['wrong_answer', 'runtime_error', 'compile_error', 'failed'].includes(s.status)) failedSubmissions++
        })
      }

      // 3. Question Attempts
      let attQuery = supabase.from('question_attempts').select('id, status, time_spent, user_id, created_at')
      if (thresholdIso) {
        attQuery = attQuery.gte('created_at', thresholdIso)
      }
      const { data: attData } = await attQuery

      if (Array.isArray(attData)) {
        totalAttempts = attData.length
        const activeUserIds = new Set<string>()
        attData.forEach(a => {
          if (a.status === 'completed') completedQuestions++
          totalTimeSpentSeconds += Number(a.time_spent || 0)
          if (a.user_id) activeUserIds.add(a.user_id)
        })
        activeUsers = Math.max(activeUserIds.size, 1)
      }

      // 4. Activity Today
      const { count: todayActCount } = await supabase
        .from('activity_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayIso)
      activityToday = todayActCount || 0

      // Also count completed from user_question_progress
      const { count: progCompletedCount } = await supabase
        .from('user_question_progress')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
      if (progCompletedCount && progCompletedCount > completedQuestions) {
        completedQuestions = progCompletedCount
      }
    } catch (err) {
      console.warn('[AdminAnalyticsService] Supabase stats query fallback:', err)
    }

    // Reasonable fallbacks if fresh database has few records
    totalUsers = Math.max(totalUsers, 1)
    activeUsers = Math.max(activeUsers, 1)
    const totalQuestionsCatalog = 22222
    const completionRate = totalAttempts > 0 ? Math.round((completedQuestions / totalAttempts) * 100) : 0
    const successRate = totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0
    const avgAttemptsPerQuestion = completedQuestions > 0 ? Number((totalAttempts / completedQuestions).toFixed(1)) : 1.2
    const avgTimeSpentMinutes = totalAttempts > 0 ? Math.round((totalTimeSpentSeconds / totalAttempts) / 60) : 18

    return {
      totalUsers,
      activeUsers,
      totalQuestions: totalQuestionsCatalog,
      totalAttempts,
      totalSubmissions,
      completedQuestions,
      acceptedSubmissions,
      failedSubmissions,
      activityToday,
      completionRate,
      successRate,
      avgAttemptsPerQuestion,
      avgTimeSpentMinutes: avgTimeSpentMinutes || 15,
    }
  },

  /**
   * Fetch submissions list with user profile information
   */
  getSubmissionsList: async (params: {
    limit?: number
    offset?: number
    status?: string
    language?: string
    search?: string
  }): Promise<AdminSubmissionItem[]> => {
    const limit = params.limit || 50
    const offset = params.offset || 0

    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (params.status && params.status !== 'ALL') {
        query = query.eq('status', params.status)
      }
      if (params.language && params.language !== 'ALL') {
        query = query.ilike('language', `%${params.language}%`)
      }
      if (params.search) {
        query = query.ilike('question_id', `%${params.search}%`)
      }

      const { data, error } = await query
      if (!error && Array.isArray(data) && data.length > 0) {
        // Fetch profiles to enrich
        const userIds = Array.from(new Set(data.map(d => d.user_id).filter(Boolean)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds)

        const profileMap = new Map((profiles || []).map(p => [p.id, p]))

        return data.map(d => {
          const prof = profileMap.get(d.user_id)
          return {
            id: String(d.id),
            userId: String(d.user_id),
            questionId: String(d.question_id),
            attemptId: d.attempt_id ? String(d.attempt_id) : null,
            answer: d.answer,
            code: d.code,
            language: d.language || 'javascript',
            status: d.status,
            score: Number(d.score || 0),
            executionTime: Number(d.execution_time || 0),
            memoryUsed: Number(d.memory_used || 0),
            createdAt: String(d.created_at),
            userName: prof?.full_name || 'Candidate',
            userEmail: prof?.email || 'candidate@faang.io',
          }
        })
      }
    } catch (err) {
      console.warn('[AdminAnalyticsService] getSubmissionsList fallback:', err)
    }

    return []
  },

  /**
   * Fetch Question Attempts list
   */
  getQuestionAttemptsList: async (params: {
    limit?: number
    offset?: number
    search?: string
  }): Promise<QuestionAttempt[]> => {
    const limit = params.limit || 50
    const offset = params.offset || 0

    try {
      let query = supabase
        .from('question_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (params.search) {
        query = query.ilike('question_id', `%${params.search}%`)
      }

      const { data, error } = await query
      if (!error && Array.isArray(data)) {
        return data.map(d => ({
          id: String(d.id),
          userId: String(d.user_id),
          questionId: String(d.question_id),
          startedAt: String(d.started_at),
          completedAt: d.completed_at ? String(d.completed_at) : null,
          status: d.status,
          attemptCount: Number(d.attempt_count || 1),
          timeSpent: Number(d.time_spent || 0),
          createdAt: String(d.created_at),
          updatedAt: String(d.updated_at),
        }))
      }
    } catch (err) {
      console.warn('[AdminAnalyticsService] getQuestionAttemptsList fallback:', err)
    }

    return []
  },

  /**
   * Chronological activity feed formatted for administrative readability:
   * e.g. "08:34 - Candidate opened 'Two Sum'"
   */
  getActivityFeed: async (params: {
    limit?: number
    action?: string
    search?: string
  }): Promise<AdminActivityFeedItem[]> => {
    const limit = params.limit || 50

    try {
      let query = supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (params.action && params.action !== 'ALL') {
        query = query.eq('action', params.action)
      }

      const { data, error } = await query
      if (!error && Array.isArray(data) && data.length > 0) {
        // Enrich with profiles
        const userIds = Array.from(new Set(data.map(d => d.user_id).filter(Boolean)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', userIds)

        const profileMap = new Map((profiles || []).map(p => [p.id, p]))

        return data.map(d => {
          const prof = profileMap.get(d.user_id)
          const userName = prof?.full_name || 'Candidate'
          const userEmail = prof?.email || ''
          const dDate = new Date(d.created_at)
          const timeStr = dDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

          let formattedText = `${userName} performed ${d.action}`
          let badgeColor = '#94a3b8'

          switch (d.action) {
            case 'question_viewed':
              formattedText = `${userName} opened Question #${d.entity_id || ''}`
              badgeColor = '#60a5fa'
              break
            case 'question_started':
              formattedText = `${userName} started Question #${d.entity_id || ''}`
              badgeColor = '#f59e0b'
              break
            case 'code_run':
              formattedText = `${userName} executed live code in Question #${d.entity_id || ''}`
              badgeColor = '#38bdf8'
              break
            case 'answer_submitted': {
              const lang = d.metadata?.language || 'JavaScript'
              formattedText = `${userName} submitted ${lang} answer for #${d.metadata?.questionId || d.entity_id || ''}`
              badgeColor = '#a855f7'
              break
            }
            case 'submission_accepted':
              formattedText = `Result: Accepted (100% Score) on #${d.metadata?.questionId || ''}`
              badgeColor = '#22c55e'
              break
            case 'submission_failed':
              formattedText = `Result: Wrong Answer / Runtime Error on #${d.metadata?.questionId || ''}`
              badgeColor = '#ef4444'
              break
            case 'question_completed': {
              const timeSec = d.metadata?.timeSpent ? ` in ${Math.round(Number(d.metadata.timeSpent) / 60)}m` : ''
              formattedText = `✓ ${userName} completed Question #${d.entity_id || ''}${timeSec}`
              badgeColor = '#10b981'
              break
            }
            case 'login':
              formattedText = `${userName} authenticated into platform`
              badgeColor = '#818cf8'
              break
            case 'logout':
              formattedText = `${userName} signed out`
              badgeColor = '#64748b'
              break
            case 'mock_interview_started':
              formattedText = `${userName} started AI Mock Interview`
              badgeColor = '#ec4899'
              break
            case 'mock_interview_completed':
              formattedText = `${userName} completed AI Mock Interview round`
              badgeColor = '#14b8a6'
              break
          }

          return {
            id: String(d.id),
            timeStr,
            timestamp: String(d.created_at),
            userEmail,
            userName,
            action: d.action as ActivityAction,
            formattedText,
            badgeColor,
            rawMetadata: d.metadata || {},
          }
        })
      }
    } catch (err) {
      console.warn('[AdminAnalyticsService] getActivityFeed fallback:', err)
    }

    return []
  },

  /**
   * Aggregate per-question statistics (attempt counts, success rates, etc.)
   */
  getQuestionStatsList: async (params: {
    search?: string
    limit?: number
  }): Promise<AdminQuestionStat[]> => {
    const limit = params.limit || 50

    try {
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('question_id, status, time_spent')
        .limit(1000)

      const { data: submissions } = await supabase
        .from('submissions')
        .select('question_id, status')
        .limit(1000)

      const statMap = new Map<string, {
        attempts: number
        completed: number
        timeSpentTotal: number
        submissions: number
        accepted: number
      }>()

      if (Array.isArray(attempts)) {
        attempts.forEach(a => {
          const qId = a.question_id
          const current = statMap.get(qId) || { attempts: 0, completed: 0, timeSpentTotal: 0, submissions: 0, accepted: 0 }
          current.attempts += 1
          if (a.status === 'completed') current.completed += 1
          current.timeSpentTotal += Number(a.time_spent || 0)
          statMap.set(qId, current)
        })
      }

      if (Array.isArray(submissions)) {
        submissions.forEach(s => {
          const qId = s.question_id
          const current = statMap.get(qId) || { attempts: 0, completed: 0, timeSpentTotal: 0, submissions: 0, accepted: 0 }
          current.submissions += 1
          if (s.status === 'accepted') current.accepted += 1
          statMap.set(qId, current)
        })
      }

      const list: AdminQuestionStat[] = Array.from(statMap.entries()).map(([qId, val]) => {
        const completionRate = val.attempts > 0 ? Math.round((val.completed / val.attempts) * 100) : 0
        const successRate = val.submissions > 0 ? Math.round((val.accepted / val.submissions) * 100) : 0
        const avgAttempts = val.completed > 0 ? Number((val.attempts / val.completed).toFixed(1)) : 1
        const avgTimeSpentSeconds = val.attempts > 0 ? Math.round(val.timeSpentTotal / val.attempts) : 0

        return {
          id: qId,
          title: `Question #${qId}`,
          category: qId.startsWith('Q') ? 'Machine Coding' : 'Frontend Core',
          attemptsCount: val.attempts,
          submissionsCount: val.submissions,
          acceptedCount: val.accepted,
          completionRate,
          successRate,
          avgAttempts,
          avgTimeSpentSeconds,
        }
      })

      if (params.search) {
        const s = params.search.toLowerCase()
        return list.filter(item => item.id.toLowerCase().includes(s) || item.title.toLowerCase().includes(s)).slice(0, limit)
      }

      return list.slice(0, limit)
    } catch (err) {
      console.warn('[AdminAnalyticsService] getQuestionStatsList fallback:', err)
      return []
    }
  },

  /**
   * Deep-dive candidate profile data with submissions, attempts, and history
   */
  getUserDetailAnalytics: async (userId: string): Promise<AdminUserDetail | null> => {
    if (!userId) return null

    try {
      // 1. Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!profile) return null

      // 2. Submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      // 3. Attempts
      const { data: attempts } = await supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      // 4. Activity
      const { data: activities } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)

      const totalAttempts = attempts?.length || 0
      const totalSubmissions = submissions?.length || 0
      let completedCount = 0
      let totalScore = 0
      let totalTimeSeconds = 0

      attempts?.forEach(a => {
        if (a.status === 'completed') completedCount++
        totalTimeSeconds += Number(a.time_spent || 0)
      })

      submissions?.forEach(s => {
        totalScore += Number(s.score || 0)
      })

      const avgScore = totalSubmissions > 0 ? Math.round(totalScore / totalSubmissions) : 0
      const acceptedCount = submissions?.filter(s => s.status === 'accepted').length || 0
      const accuracyRate = totalSubmissions > 0 ? Math.round((acceptedCount / totalSubmissions) * 100) : 0

      const mappedSubmissions: AdminSubmissionItem[] = (submissions || []).map(s => ({
        id: String(s.id),
        userId: String(s.user_id),
        questionId: String(s.question_id),
        attemptId: s.attempt_id ? String(s.attempt_id) : null,
        answer: s.answer,
        code: s.code,
        language: s.language || 'javascript',
        status: s.status,
        score: Number(s.score || 0),
        executionTime: Number(s.execution_time || 0),
        memoryUsed: Number(s.memory_used || 0),
        createdAt: String(s.created_at),
        userName: profile.full_name,
        userEmail: profile.email,
      }))

      const mappedAttempts: QuestionAttempt[] = (attempts || []).map(a => ({
        id: String(a.id),
        userId: String(a.user_id),
        questionId: String(a.question_id),
        startedAt: String(a.started_at),
        completedAt: a.completed_at ? String(a.completed_at) : null,
        status: a.status,
        attemptCount: Number(a.attempt_count || 1),
        timeSpent: Number(a.time_spent || 0),
        createdAt: String(a.created_at),
        updatedAt: String(a.updated_at),
      }))

      const mappedActivities: AdminActivityFeedItem[] = (activities || []).map(d => {
        const dDate = new Date(d.created_at)
        return {
          id: String(d.id),
          timeStr: dDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: String(d.created_at),
          userEmail: profile.email,
          userName: profile.full_name,
          action: d.action as ActivityAction,
          formattedText: `${d.action} on ${d.entity_type} #${d.entity_id || ''}`,
          badgeColor: '#a855f7',
          rawMetadata: d.metadata || {},
        }
      })

      return {
        userId: profile.id,
        name: profile.full_name || 'Candidate',
        email: profile.email,
        role: profile.role,
        createdAt: profile.created_at,
        lastActive: profile.updated_at || profile.created_at,
        totalAttempts,
        totalSubmissions,
        completedCount,
        accuracyRate,
        avgScore,
        totalTimeMinutes: Math.round(totalTimeSeconds / 60),
        recentSubmissions: mappedSubmissions,
        recentAttempts: mappedAttempts,
        recentActivities: mappedActivities,
      }
    } catch (err) {
      console.warn('[AdminAnalyticsService] getUserDetailAnalytics error:', err)
      return null
    }
  },
}
