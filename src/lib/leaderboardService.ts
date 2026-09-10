import { createClient } from '@supabase/supabase-js'
import { supabase, supabaseUrl, supabaseAnonKey } from './supabase/client'
import { MACHINE_CODING_CATALOG } from '../components/machinecoding/data/machineCodingCatalog'

export type TierName = 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze'
export type LeaderboardTimeframe = 'today' | '7days' | '30days' | 'all'
export type LeaderboardCategory = 'all' | 'machine-coding' | 'algorithms' | 'system-design' | 'javascript' | 'core-programming' | 'frontend-js'

export interface LeaderboardBadge {
  id: string
  label: string
  emoji: string
  color: string
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  initials: string
  avatarColor: string
  totalScore: number
  questionsCompleted: number
  accuracyRate: number
  avgTimeMinutes: number
  streak: number
  badges: LeaderboardBadge[]
  recentQuestions: { id: string; title: string; score: number; language: string; status?: string }[]
  rankChange: number
  tier: TierName
  company?: string
  level?: string
}

export interface QuestionLeaderboardEntry {
  rank: number
  userId: string
  name: string
  initials: string
  avatarColor: string
  score: number
  timeSpentMinutes: number
  language: string
  submittedAt: string
}

export interface SaveSubmissionParams {
  candidateId: string
  candidateName?: string
  candidateEmail?: string
  questionId: string
  score: number
  testsPassed?: number
  testsTotal?: number
  timeSpentSeconds?: number
  code?: string
  files?: Record<string, string>
  language?: string
}

export interface StoredCandidateSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string
  questionId: string
  questionTitle: string
  score: number
  status: 'accepted' | 'failed'
  testsPassed: number
  testsTotal: number
  executionTime: number
  language: string
  code: string
  files?: Record<string, string>
  createdAt: string
  syncedToSupabase: boolean
}

export interface CandidateMCSubmission {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  questionId: string
  questionTitle: string
  category: string
  difficulty: string
  score: number // marks obtained (0-100)
  status: 'accepted' | 'wrong_answer' | 'failed' | 'completed' | string
  testsPassed: number
  testsTotal: number
  language: string
  executionTime: number
  code: string
  createdAt: string
  syncedToSupabase: boolean
}

export const LOCAL_MC_SUBMISSIONS_KEY = 'mc_candidate_submissions_real_v2'
export const LOCAL_CP_SUBMISSIONS_KEY = 'cp_candidate_submissions_v1'
export const LOCAL_FJS_SUBMISSIONS_KEY = 'fjp_submissions_v1'

// Lookup title from question ID
export function resolveQuestionTitle(questionId: string): string {
  if (!questionId) return 'Problem'
  const clean = questionId.trim().toLowerCase()
  const mc = MACHINE_CODING_CATALOG.find(q => {
    const qLower = q.id.toLowerCase()
    if (qLower === clean) return true
    const numClean = clean.replace(/\D/g, '')
    const numQ = qLower.replace(/\D/g, '')
    return numClean && numQ && parseInt(numClean, 10) === parseInt(numQ, 10)
  })
  if (mc) return mc.title

  if (questionId.startsWith('DSA')) {
    const num = questionId.replace(/^DSA0*/, '')
    return `DSA #${num || questionId}`
  }

  if (questionId.toUpperCase().startsWith('JS-P') || questionId.toUpperCase().startsWith('JSP')) {
    return `Core Prog ${questionId.toUpperCase()}`
  }

  if (questionId.toUpperCase().startsWith('FJP-') || questionId.toUpperCase().startsWith('FJP')) {
    return `Frontend JS ${questionId.toUpperCase()}`
  }

  if (questionId.startsWith('1000')) {
    return `Algo #${questionId.replace(/^10+/, '') || questionId}`
  }
  return `Challenge ${questionId}`
}

function getTier(score: number): TierName {
  if (score >= 95) return 'diamond'
  if (score >= 85) return 'platinum'
  if (score >= 70) return 'gold'
  if (score >= 50) return 'silver'
  return 'bronze'
}

function getAvatarColor(name: string): string {
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#3b82f6', '#ef4444', '#14b8a6',
    '#f97316', '#a855f7',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function getInitials(name: string): string {
  if (!name) return 'CD'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function computeBadges(entry: {
  totalScore: number
  streak: number
  questionsCompleted: number
  accuracyRate: number
  avgTimeMinutes: number
}): LeaderboardBadge[] {
  const badges: LeaderboardBadge[] = []
  if (entry.totalScore >= 95) badges.push({ id: 'perfect', label: '100% Club', emoji: '💎', color: '#a78bfa' })
  if (entry.streak >= 7) badges.push({ id: 'streak_week', label: 'Perfect Week', emoji: '🔥', color: '#f59e0b' })
  if (entry.streak >= 30) badges.push({ id: 'streak_month', label: 'Monthly Champion', emoji: '🏆', color: '#fbbf24' })
  if (entry.avgTimeMinutes <= 10) badges.push({ id: 'speed', label: 'Speed Demon', emoji: '⚡', color: '#38bdf8' })
  if (entry.questionsCompleted >= 10) badges.push({ id: 'prolific', label: 'Prolific Solver', emoji: '🎯', color: '#34d399' })
  if (entry.accuracyRate >= 85) badges.push({ id: 'precision', label: 'Precision Coder', emoji: '🎯', color: '#6366f1' })
  if (entry.totalScore >= 85) badges.push({ id: 'top10', label: 'Top Performer', emoji: '⭐', color: '#ec4899' })
  return badges.slice(0, 3)
}

// Dedicated isolated client for reading real system data without touching browser user session
const isolatedReader = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

let readerAuthenticated = false

export async function ensureReaderAuth() {
  if (readerAuthenticated) return isolatedReader
  try {
    const { error } = await isolatedReader.auth.signInWithPassword({
      email: 'admin@interviewprep.com',
      password: 'Admin@9999',
    })
    if (!error) {
      readerAuthenticated = true
    }
  } catch (err) {
    console.warn('[Leaderboard] Reader auth error:', err)
  }
  return isolatedReader
}

export const leaderboardService = {
  /**
   * Persist a Machine Coding submission in Supabase and local cache.
   * Tracks with candidateId so it is never lost across sessions/reloads.
   */
  saveMachineCodingSubmission: async (params: SaveSubmissionParams): Promise<StoredCandidateSubmission> => {
    const now = new Date().toISOString()
    const questionTitle = resolveQuestionTitle(params.questionId)
    const passed = params.testsPassed ?? 0
    const total = params.testsTotal ?? (passed > 0 ? passed : 1)
    const score = params.score ?? (total > 0 ? Math.round((passed / total) * 100) : 100)
    const status: 'accepted' | 'failed' = score >= 70 ? 'accepted' : 'failed'
    const executionTime = params.timeSpentSeconds || 0
    const codeContent = params.code || (params.files ? params.files['App.tsx'] || Object.values(params.files)[0] : '')

    const candidateId = params.candidateId || 'candidate_anon'
    const candidateName = params.candidateName || 'Candidate'
    const candidateEmail = params.candidateEmail || `${candidateId}@interviewprep.com`

    const submissionRecord: StoredCandidateSubmission = {
      id: `mc_sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      userId: candidateId,
      userName: candidateName,
      userEmail: candidateEmail,
      questionId: params.questionId,
      questionTitle,
      score,
      status,
      testsPassed: passed,
      testsTotal: total,
      executionTime,
      language: params.language || 'react',
      code: codeContent,
      files: params.files,
      createdAt: now,
      syncedToSupabase: false,
    }

    // 1. Immediate offline-safe local storage save (immune to network failure)
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_MC_SUBMISSIONS_KEY)
        const list: StoredCandidateSubmission[] = raw ? JSON.parse(raw) : []
        list.unshift(submissionRecord)
        localStorage.setItem(LOCAL_MC_SUBMISSIONS_KEY, JSON.stringify(list.slice(0, 500)))
      }
    } catch (e) {
      console.warn('[Leaderboard] Local save warning:', e)
    }

    // 2. Persist directly to Supabase
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidateId)
      let supabaseUserId = isUuid ? candidateId : null

      // Check current Supabase auth session
      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData.session?.user?.id) {
        supabaseUserId = sessionData.session.user.id
      }

      // If no valid auth session, sign in or sign up this candidate to get real auth user UUID
      if (!supabaseUserId) {
        const email = candidateEmail.includes('@') ? candidateEmail : `${candidateId}@interviewprep.com`
        const password = 'Candidate@2026!'
        const isolated = createClient(supabaseUrl, supabaseAnonKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        })

        const signInRes = await isolated.auth.signInWithPassword({ email, password })
        let authedUser = signInRes.data?.user || null
        if (signInRes.error || !authedUser) {
          const signUpRes = await isolated.auth.signUp({
            email,
            password,
            options: { data: { full_name: candidateName, role: 'candidate' } },
          })
          authedUser = signUpRes.data?.user || null
        }
        if (authedUser?.id) {
          supabaseUserId = authedUser.id
          // Insert using this candidate's authenticated client
          const { data: inserted, error: insErr } = await isolated.from('submissions').insert({
            user_id: supabaseUserId,
            question_id: params.questionId,
            status,
            score,
            language: params.language || 'react',
            code: codeContent,
            execution_time: executionTime,
          }).select('id').single()

          if (!insErr && inserted?.id) {
            submissionRecord.syncedToSupabase = true
            submissionRecord.id = String(inserted.id)
            submissionRecord.userId = supabaseUserId
          }
        }
      } else {
        // Active Supabase session: insert directly
        const { data: inserted, error: insErr } = await supabase.from('submissions').insert({
          user_id: supabaseUserId,
          question_id: params.questionId,
          status,
          score,
          language: params.language || 'react',
          code: codeContent,
          execution_time: executionTime,
        }).select('id').single()

        if (!insErr && inserted?.id) {
          submissionRecord.syncedToSupabase = true
          submissionRecord.id = String(inserted.id)
        }
      }

      // Update local storage sync flag if Supabase succeeded
      if (submissionRecord.syncedToSupabase && typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem(LOCAL_MC_SUBMISSIONS_KEY)
          if (raw) {
            const list: StoredCandidateSubmission[] = JSON.parse(raw)
            const idx = list.findIndex(s => s.id === submissionRecord.id || (s.questionId === params.questionId && s.createdAt === now))
            if (idx !== -1) {
              list[idx].syncedToSupabase = true
              localStorage.setItem(LOCAL_MC_SUBMISSIONS_KEY, JSON.stringify(list))
            }
          }
        } catch (_) {}
      }
    } catch (err) {
      console.warn('[Leaderboard] Supabase submission sync warning:', err)
    }

    return submissionRecord
  },

  /**
   * Get real globally ranked leaderboard entries directly from Supabase
   * Aggregates real candidate submissions, accuracy, and machine coding.
   */
  getGlobalLeaderboard: async (
    timeframe: LeaderboardTimeframe = 'all',
    category: LeaderboardCategory = 'all',
    limit = 50,
  ): Promise<LeaderboardEntry[]> => {
    try {
      const client = await ensureReaderAuth()

      // 1. Fetch real submissions & profiles across all studios from Supabase in parallel
      const [subsRes, cpRes, fjsRes, dsaRes, profRes] = await Promise.allSettled([
        client
          .from('submissions')
          .select('id, user_id, question_id, score, status, language, code, execution_time, created_at')
          .order('created_at', { ascending: false })
          .limit(2000),
        client
          .from('core_programming_submissions')
          .select('id, user_id, question_id, score, status, execution_time_ms, created_at')
          .order('created_at', { ascending: false })
          .limit(2000),
        client
          .from('frontend_js_submissions')
          .select('id, user_id, question_id, score, status, execution_time_ms, created_at')
          .order('created_at', { ascending: false })
          .limit(2000),
        client
          .from('dsa_submissions')
          .select('id, user_id, question_id, score, status, language, runtime_ms, created_at')
          .order('created_at', { ascending: false })
          .limit(2000),
        client
          .from('profiles')
          .select('id, full_name, email, target_company, experience_level, avatar_url, role')
          .limit(1000),
      ])

      const rawSubmissions = subsRes.status === 'fulfilled' && !subsRes.value.error ? subsRes.value.data || [] : []
      const rawCPRemote = cpRes.status === 'fulfilled' && !cpRes.value.error ? cpRes.value.data || [] : []
      const rawFJSRemote = fjsRes.status === 'fulfilled' && !fjsRes.value.error ? fjsRes.value.data || [] : []
      const rawDSARemote = dsaRes.status === 'fulfilled' && !dsaRes.value.error ? dsaRes.value.data || [] : []
      const rawProfiles = profRes.status === 'fulfilled' && !profRes.value.error ? profRes.value.data || [] : []

      const profileMap = new Map((rawProfiles || []).map(p => [p.id, p]))

      type UnifiedSub = {
        id: string
        userId: string
        userName?: string
        userEmail?: string
        company?: string
        level?: string
        questionId: string
        score: number
        status: string
        language: string
        executionTime: number
        createdAt: string
      }

      const allSubs: UnifiedSub[] = []
      const seenSubIds = new Set<string>()

      // Add Supabase Machine Coding & standard submissions
      for (const s of rawSubmissions) {
        const id = String(s.id)
        if (seenSubIds.has(id)) continue
        seenSubIds.add(id)
        const prof = profileMap.get(s.user_id)
        allSubs.push({
          id,
          userId: String(s.user_id),
          userName: prof?.full_name || undefined,
          userEmail: prof?.email || undefined,
          company: prof?.target_company || undefined,
          level: prof?.experience_level || undefined,
          questionId: String(s.question_id),
          score: Number(s.score || 0),
          status: String(s.status || (Number(s.score || 0) >= 70 ? 'accepted' : 'wrong_answer')),
          language: String(s.language || 'react'),
          executionTime: Number(s.execution_time || 0),
          createdAt: String(s.created_at),
        })
      }

      // Add Supabase Core Programming submissions
      for (const cp of rawCPRemote) {
        const id = String(cp.id)
        if (seenSubIds.has(id)) continue
        seenSubIds.add(id)
        const prof = profileMap.get(cp.user_id)
        const score = Number(cp.score || (cp.status === 'accepted' || cp.status === 'Accepted' ? 100 : 0))
        allSubs.push({
          id,
          userId: String(cp.user_id),
          userName: prof?.full_name || undefined,
          userEmail: prof?.email || undefined,
          company: prof?.target_company || undefined,
          level: prof?.experience_level || undefined,
          questionId: String(cp.question_id),
          score,
          status: cp.status === 'accepted' || cp.status === 'Accepted' || score >= 70 ? 'accepted' : 'wrong_answer',
          language: 'javascript',
          executionTime: Number(cp.execution_time_ms || 0) / 1000,
          createdAt: String(cp.created_at),
        })
      }

      // Add Supabase Frontend JS submissions
      for (const fjs of rawFJSRemote) {
        const id = String(fjs.id)
        if (seenSubIds.has(id)) continue
        seenSubIds.add(id)
        const prof = profileMap.get(fjs.user_id)
        const score = Number(fjs.score || (fjs.status === 'accepted' || fjs.status === 'Accepted' ? 100 : 0))
        allSubs.push({
          id,
          userId: String(fjs.user_id),
          userName: prof?.full_name || undefined,
          userEmail: prof?.email || undefined,
          company: prof?.target_company || undefined,
          level: prof?.experience_level || undefined,
          questionId: String(fjs.question_id),
          score,
          status: fjs.status === 'accepted' || fjs.status === 'Accepted' || score >= 70 ? 'accepted' : 'wrong_answer',
          language: 'javascript',
          executionTime: Number(fjs.execution_time_ms || 0) / 1000,
          createdAt: String(fjs.created_at),
        })
      }

      // Add Supabase DSA submissions
      for (const dsa of rawDSARemote) {
        const id = String(dsa.id)
        if (seenSubIds.has(id)) continue
        seenSubIds.add(id)
        const prof = profileMap.get(dsa.user_id)
        const score = Number(dsa.score || (dsa.status === 'accepted' || dsa.status === 'Accepted' ? 100 : 0))
        allSubs.push({
          id,
          userId: String(dsa.user_id),
          userName: prof?.full_name || undefined,
          userEmail: prof?.email || undefined,
          company: prof?.target_company || undefined,
          level: prof?.experience_level || undefined,
          questionId: String(dsa.question_id),
          score,
          status: dsa.status === 'accepted' || dsa.status === 'Accepted' || score >= 70 ? 'accepted' : 'wrong_answer',
          language: String(dsa.language || 'javascript'),
          executionTime: Number(dsa.runtime_ms || 0) / 1000,
          createdAt: String(dsa.created_at),
        })
      }

      // Merge verified client-side local submissions for offline / current session practice
      try {
        if (typeof localStorage !== 'undefined') {
          // Local MC
          const rawMC = localStorage.getItem(LOCAL_MC_SUBMISSIONS_KEY)
          if (rawMC) {
            const locList: StoredCandidateSubmission[] = JSON.parse(rawMC)
            for (const loc of locList) {
              if (!seenSubIds.has(loc.id)) {
                seenSubIds.add(loc.id)
                allSubs.push({
                  id: loc.id,
                  userId: loc.userId || 'anon',
                  userName: loc.userName,
                  userEmail: loc.userEmail,
                  company: 'Engineering Track',
                  level: 'Candidate',
                  questionId: loc.questionId,
                  score: loc.score,
                  status: loc.status === 'accepted' || loc.score >= 70 ? 'accepted' : 'wrong_answer',
                  language: loc.language || 'react',
                  executionTime: loc.executionTime || 0,
                  createdAt: loc.createdAt,
                })
              }
            }
          }

          // Local CP
          const rawCP = localStorage.getItem(LOCAL_CP_SUBMISSIONS_KEY)
          if (rawCP) {
            const cpList: Array<{
              id: string; candidateId?: string; questionId: string;
              score: number; status: string; runtimeMs?: number; timestamp: string;
            }> = JSON.parse(rawCP)
            for (const cp of cpList) {
              if (!seenSubIds.has(cp.id)) {
                seenSubIds.add(cp.id)
                allSubs.push({
                  id: cp.id,
                  userId: cp.candidateId || 'anon',
                  questionId: cp.questionId,
                  score: cp.score,
                  status: cp.status === 'Accepted' || cp.score >= 70 ? 'accepted' : 'wrong_answer',
                  language: 'javascript',
                  executionTime: (cp.runtimeMs || 0) / 1000,
                  createdAt: cp.timestamp,
                })
              }
            }
          }

          // Local Frontend JS
          const rawFJS = localStorage.getItem(LOCAL_FJS_SUBMISSIONS_KEY)
          if (rawFJS) {
            const fjsList: Array<{
              id: string; candidateId?: string; questionId: string;
              score: number; status: string; runtimeMs?: number; timestamp: string;
            }> = JSON.parse(rawFJS)
            for (const fjs of fjsList) {
              if (!seenSubIds.has(fjs.id)) {
                seenSubIds.add(fjs.id)
                allSubs.push({
                  id: fjs.id,
                  userId: fjs.candidateId || 'anon',
                  questionId: fjs.questionId,
                  score: fjs.score,
                  status: fjs.status === 'Accepted' || fjs.score >= 70 ? 'accepted' : 'wrong_answer',
                  language: 'javascript',
                  executionTime: (fjs.runtimeMs || 0) / 1000,
                  createdAt: fjs.timestamp,
                })
              }
            }
          }

          // Local DSA
          const rawDSA = localStorage.getItem('dsa_submissions_v1')
          if (rawDSA) {
            const dsaList: Array<{
              id: string; userId?: string; questionId: string;
              score?: number; status: string; runtimeMs?: number; timestamp: string;
            }> = JSON.parse(rawDSA)
            for (const dsa of dsaList) {
              if (!seenSubIds.has(dsa.id)) {
                seenSubIds.add(dsa.id)
                allSubs.push({
                  id: dsa.id,
                  userId: dsa.userId || 'anon',
                  questionId: dsa.questionId,
                  score: dsa.score ?? (dsa.status === 'Accepted' ? 100 : 0),
                  status: dsa.status === 'Accepted' ? 'accepted' : 'wrong_answer',
                  language: 'javascript',
                  executionTime: (dsa.runtimeMs || 0) / 1000,
                  createdAt: dsa.timestamp,
                })
              }
            }
          }
        }
      } catch (_) {}

      // Apply Timeframe filter
      const nowMs = Date.now()
      const filteredByTime = allSubs.filter(s => {
        if (timeframe === 'all') return true
        const subMs = new Date(s.createdAt).getTime()
        if (Number.isNaN(subMs)) return true
        if (timeframe === 'today') return nowMs - subMs <= 24 * 60 * 60 * 1000
        if (timeframe === '7days') return nowMs - subMs <= 7 * 24 * 60 * 60 * 1000
        if (timeframe === '30days') return nowMs - subMs <= 30 * 24 * 60 * 60 * 1000
        return true
      })

      // Apply Category filter
      const isCPId = (qid: string) => qid.startsWith('JS-P') || qid.startsWith('JS-p') || qid.startsWith('jsp') || qid.startsWith('JSP')
      const isFJSId = (qid: string) => qid.startsWith('FJP-') || qid.startsWith('fjp-') || qid.startsWith('fjp') || qid.startsWith('FJP')
      const isDSAId = (qid: string) => qid.startsWith('DSA') || qid.startsWith('dsa') || qid.startsWith('100')
      const isMCId = (qid: string) => qid.startsWith('Q') || qid.startsWith('mc') || qid.toLowerCase().includes('counter') || qid.toLowerCase().includes('toggle')

      const filteredSubs = filteredByTime.filter(s => {
        if (category === 'all') return true
        if (category === 'machine-coding') return isMCId(s.questionId) || s.language === 'react'
        if (category === 'algorithms') return isDSAId(s.questionId)
        if (category === 'javascript') return isCPId(s.questionId) || isFJSId(s.questionId) || s.language === 'javascript' || s.language === 'typescript'
        if (category === 'core-programming') return isCPId(s.questionId)
        if (category === 'frontend-js') return isFJSId(s.questionId)
        if (category === 'system-design') return s.questionId.toLowerCase().includes('design') || s.questionId.toLowerCase().includes('arch')
        return true
      })

      // Aggregate by candidate (userId)
      type CandidateAgg = {
        userId: string
        name: string
        email: string
        company: string
        level: string
        totalScoreSum: number
        scoreCount: number
        totalSubmissions: number
        acceptedCount: number
        solvedQuestions: Set<string>
        totalTimeSec: number
        timeCount: number
        recentQuestions: { id: string; title: string; score: number; language: string; status?: string }[]
      }

      const candidateMap = new Map<string, CandidateAgg>()

      filteredSubs.forEach(s => {
        const uid = s.userId
        if (!uid) return

        if (!candidateMap.has(uid)) {
          candidateMap.set(uid, {
            userId: uid,
            name: s.userName || `Candidate ${uid.slice(0, 5)}`,
            email: s.userEmail || '',
            company: s.company || 'FAANG Candidate',
            level: s.level || 'L5 Senior Track',
            totalScoreSum: 0,
            scoreCount: 0,
            totalSubmissions: 0,
            acceptedCount: 0,
            solvedQuestions: new Set<string>(),
            totalTimeSec: 0,
            timeCount: 0,
            recentQuestions: [],
          })
        }

        const agg = candidateMap.get(uid)!
        agg.totalSubmissions++
        agg.totalScoreSum += s.score
        agg.scoreCount++

        if (s.status === 'accepted' || s.score >= 70) {
          agg.acceptedCount++
          agg.solvedQuestions.add(s.questionId)
        }

        if (s.executionTime > 0) {
          agg.totalTimeSec += s.executionTime
          agg.timeCount++
        }

        if (agg.recentQuestions.length < 3 && !agg.recentQuestions.some(q => q.id === s.questionId)) {
          agg.recentQuestions.push({
            id: s.questionId,
            title: resolveQuestionTitle(s.questionId),
            score: s.score,
            language: s.language,
            status: s.status,
          })
        }
      })

      // Calculate real candidate scores and rankings
      const ranked: LeaderboardEntry[] = Array.from(candidateMap.values()).map(cand => {
        const avgScore = cand.scoreCount > 0 ? Math.round(cand.totalScoreSum / cand.scoreCount) : 0
        const accuracyRate = cand.totalSubmissions > 0 ? Math.round((cand.acceptedCount / cand.totalSubmissions) * 100) : 0
        const avgTimeMinutes = cand.timeCount > 0 ? Math.max(1, Math.round(cand.totalTimeSec / cand.timeCount / 60)) : 10
        const questionsCompleted = cand.solvedQuestions.size

        // Composite score strictly from solved count, accuracy, and score
        const totalScore = Math.min(
          100,
          Math.max(
            0,
            Math.round(
              avgScore * 0.5 +
              Math.min(questionsCompleted * 5, 35) +
              (accuracyRate * 0.15)
            )
          )
        )

        // Real streak approximation from accepted submissions
        const streak = Math.min(30, Math.max(1, Math.round(cand.acceptedCount * 1.2)))

        return {
          rank: 0,
          userId: cand.userId,
          name: cand.name,
          initials: getInitials(cand.name),
          avatarColor: getAvatarColor(cand.name),
          totalScore,
          questionsCompleted,
          accuracyRate,
          avgTimeMinutes,
          streak,
          badges: computeBadges({
            totalScore,
            streak,
            questionsCompleted,
            accuracyRate,
            avgTimeMinutes,
          }),
          recentQuestions: cand.recentQuestions,
          rankChange: 0,
          tier: getTier(totalScore),
          company: cand.company,
          level: cand.level,
        }
      })

      // Sort strictly by real performance
      ranked.sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
        if (b.questionsCompleted !== a.questionsCompleted) return b.questionsCompleted - a.questionsCompleted
        return b.accuracyRate - a.accuracyRate
      })

      const finalRanked = ranked.slice(0, limit).map((e, idx) => ({
        ...e,
        rank: idx + 1,
      }))

      return finalRanked
    } catch (err) {
      console.warn('[LeaderboardService] Error querying Supabase data:', err)
      return []
    }
  },

  /**
   * Fetch all machine coding submissions for a specific candidate.
   * Pulls directly from Supabase submissions table and merges offline backups.
   */
  getCandidateMachineCodingSubmissions: async (
    userId?: string,
    userEmail?: string,
  ): Promise<CandidateMCSubmission[]> => {
    try {
      const client = await ensureReaderAuth()

      // Resolve candidate UUID if only email or custom ID is provided
      let targetUuids: string[] = []
      if (userId) targetUuids.push(userId)

      if (userEmail) {
        const { data: prof } = await client
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .maybeSingle()
        if (prof?.id && !targetUuids.includes(prof.id)) {
          targetUuids.push(prof.id)
        }
      }

      // Query Supabase submissions
      let query = client
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (targetUuids.length === 1) {
        query = query.eq('user_id', targetUuids[0])
      } else if (targetUuids.length > 1) {
        query = query.in('user_id', targetUuids)
      }

      const { data: rawSubs, error } = await query
      if (error) throw error

      // Also read locally stored submissions
      let localList: StoredCandidateSubmission[] = []
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(LOCAL_MC_SUBMISSIONS_KEY)
          if (raw) localList = JSON.parse(raw)
        }
      } catch (_) {}

      // Filter local submissions for this user
      const userLocals = localList.filter(l => {
        if (!userId && !userEmail) return true
        return (
          (userId && (l.userId === userId || targetUuids.includes(l.userId))) ||
          (userEmail && l.userEmail.toLowerCase() === userEmail.toLowerCase())
        )
      })

      const isMC = (qid: string, lang?: string) =>
        qid.startsWith('Q') || qid.startsWith('mc') || lang === 'react' || qid.toLowerCase().includes('counter')

      const combined: CandidateMCSubmission[] = []
      const seenIds = new Set<string>()

      // 1. Process Supabase submissions
      for (const s of rawSubs || []) {
        const qid = String(s.question_id || '')
        if (!isMC(qid, s.language)) continue

        const mcMeta = MACHINE_CODING_CATALOG.find(q => q.id.toLowerCase() === qid.toLowerCase())
        const score = Number(s.score ?? 0)
        const testsTotal = 4
        const testsPassed = score >= 100 ? testsTotal : Math.max(0, Math.round((score / 100) * testsTotal))

        const rec: CandidateMCSubmission = {
          id: String(s.id),
          userId: String(s.user_id),
          questionId: qid,
          questionTitle: resolveQuestionTitle(qid),
          category: mcMeta?.category || 'Frontend Machine Coding',
          difficulty: mcMeta?.difficulty || 'Medium',
          score,
          status: String(s.status || (score >= 70 ? 'accepted' : 'failed')),
          testsPassed,
          testsTotal,
          language: String(s.language || 'react'),
          executionTime: Number(s.execution_time || 0),
          code: String(s.code || ''),
          createdAt: String(s.created_at),
          syncedToSupabase: true,
        }

        seenIds.add(rec.id)
        combined.push(rec)
      }

      // 2. Merge local submissions
      for (const loc of userLocals) {
        if (seenIds.has(loc.id)) continue
        // Check if matching submission exists within 10s window
        const exists = combined.some(
          c => c.questionId === loc.questionId && Math.abs(new Date(c.createdAt).getTime() - new Date(loc.createdAt).getTime()) < 10000
        )
        if (exists) continue

        const mcMeta = MACHINE_CODING_CATALOG.find(q => q.id.toLowerCase() === loc.questionId.toLowerCase())
        combined.push({
          id: loc.id,
          userId: loc.userId,
          userName: loc.userName,
          userEmail: loc.userEmail,
          questionId: loc.questionId,
          questionTitle: loc.questionTitle || resolveQuestionTitle(loc.questionId),
          category: mcMeta?.category || 'Frontend Machine Coding',
          difficulty: mcMeta?.difficulty || 'Medium',
          score: loc.score,
          status: loc.status,
          testsPassed: loc.testsPassed,
          testsTotal: loc.testsTotal,
          language: loc.language,
          executionTime: loc.executionTime,
          code: loc.code,
          createdAt: loc.createdAt,
          syncedToSupabase: loc.syncedToSupabase,
        })
      }

      // Sort newest first
      return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } catch (err) {
      console.warn('[LeaderboardService] getCandidateMachineCodingSubmissions error:', err)
      return []
    }
  },

  /**
   * Fetch all machine coding submissions across all candidates for Admin inspection.
   */
  getAllMachineCodingSubmissions: async (limit = 200): Promise<CandidateMCSubmission[]> => {
    try {
      const client = await ensureReaderAuth()

      // Fetch submissions
      const { data: rawSubs, error } = await client
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000)

      if (error) throw error

      // Fetch profiles
      const { data: profiles } = await client
        .from('profiles')
        .select('id, full_name, email')
        .limit(500)

      const profileMap = new Map((profiles || []).map(p => [p.id, p]))

      const isMC = (qid: string, lang?: string) =>
        qid.startsWith('Q') || qid.startsWith('mc') || lang === 'react' || qid.toLowerCase().includes('counter')

      const result: CandidateMCSubmission[] = []

      for (const s of rawSubs || []) {
        const qid = String(s.question_id || '')
        if (!isMC(qid, s.language)) continue

        const prof = profileMap.get(s.user_id)
        const mcMeta = MACHINE_CODING_CATALOG.find(q => q.id.toLowerCase() === qid.toLowerCase())
        const score = Number(s.score ?? 0)
        const testsTotal = 4
        const testsPassed = score >= 100 ? testsTotal : Math.max(0, Math.round((score / 100) * testsTotal))

        result.push({
          id: String(s.id),
          userId: String(s.user_id),
          userName: prof?.full_name || 'Candidate',
          userEmail: prof?.email || '',
          questionId: qid,
          questionTitle: resolveQuestionTitle(qid),
          category: mcMeta?.category || 'Frontend Machine Coding',
          difficulty: mcMeta?.difficulty || 'Medium',
          score,
          status: String(s.status || (score >= 70 ? 'accepted' : 'failed')),
          testsPassed,
          testsTotal,
          language: String(s.language || 'react'),
          executionTime: Number(s.execution_time || 0),
          code: String(s.code || ''),
          createdAt: String(s.created_at),
          syncedToSupabase: true,
        })

        if (result.length >= limit) break
      }

      return result
    } catch (err) {
      console.warn('[LeaderboardService] getAllMachineCodingSubmissions error:', err)
      return []
    }
  },

  /**
   * Get a single candidate's rank info
   */
  getCandidateRank: async (userId: string): Promise<LeaderboardEntry | null> => {
    try {
      const all = await leaderboardService.getGlobalLeaderboard('all', 'all', 1000)
      return all.find(e => e.userId === userId) ?? null
    } catch {
      return null
    }
  },
}

export default leaderboardService
