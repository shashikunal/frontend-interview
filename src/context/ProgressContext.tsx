import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react'
import { dbActivityService } from '../lib/supabase'

const PROGRESS_STORAGE_KEY = 'interview-prep-progress'


export interface QuizSession {
  date: string
  score: number
  total: number
  category?: string
}

export interface FAANGPillars {
  problemSolving: number // 1 - 5
  codeCraft: number // 1 - 5
  architecture: number // 1 - 5
  communication: number // 1 - 5
}

export interface MockInterviewResult {
  id: string
  date: string
  track: string
  level: string
  calibratedLevel?: 'L3 (Associate)' | 'L4 (Mid-Level)' | 'L5 (Senior)' | 'L6 (Staff/Principal)'
  durationMinutes: number
  timeSpentSeconds: number
  totalQuestions: number
  averageScore: number // out of 5
  verdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Practice'
  pillars?: FAANGPillars
  hintsUsedCount?: number
  testCasesPassed?: number
  totalTestCases?: number
  questionIds: number[]
}


interface SavedProgress {
  solvedIds: number[]
  studyDates: string[]
  quizSessions?: QuizSession[]
  mockInterviews?: MockInterviewResult[]
  lastActiveDate?: string
}

interface ProgressContextType {
  solvedIds: Set<number>
  totalSolved: number
  studyDates: Set<string>
  streak: number
  quizSessions: QuizSession[]
  mockInterviews: MockInterviewResult[]
  isSolved: (id: number) => boolean
  toggleSolved: (id: number) => void
  markSolved: (id: number) => void
  unmarkSolved: (id: number) => void
  recordActivity: () => void
  recordQuizSession: (score: number, total: number, category?: string) => void
  recordMockInterview: (result: MockInterviewResult) => void
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

function getTodayString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function calculateStreak(datesSet: Set<string>): number {
  if (datesSet.size === 0) return 0
  const today = new Date()

  // Check if today or yesterday was active
  const checkDate = new Date(today)

  let dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`

  let currentStreak = 0

  if (!datesSet.has(dateStr)) {
    // Check yesterday
    checkDate.setDate(checkDate.getDate() - 1)
    dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
    if (!datesSet.has(dateStr)) {
      return 0
    }
  }

  // Count backwards day by day
  while (datesSet.has(dateStr)) {
    currentStreak++
    checkDate.setDate(checkDate.getDate() - 1)
    dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
  }

  return currentStreak
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [solvedIds, setSolvedIds] = useState<Set<number>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as SavedProgress
          if (Array.isArray(parsed.solvedIds)) {
            return new Set<number>(parsed.solvedIds)
          }
        }
      } catch {
        // Ignore parse error
      }
    }
    return new Set<number>()
  })

  const [studyDates, setStudyDates] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as SavedProgress
          if (Array.isArray(parsed.studyDates)) {
            return new Set<string>(parsed.studyDates)
          }
        }
      } catch {
        // Ignore parse error
      }
    }
    return new Set<string>([getTodayString()])
  })

  const [quizSessions, setQuizSessions] = useState<QuizSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as SavedProgress
          if (Array.isArray(parsed.quizSessions)) {
            return parsed.quizSessions
          }
        }
      } catch {
        // Ignore parse error
      }
    }
    return []
  })

  const [mockInterviews, setMockInterviews] = useState<MockInterviewResult[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PROGRESS_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved) as SavedProgress
          if (Array.isArray(parsed.mockInterviews)) {
            return parsed.mockInterviews
          }
        }
      } catch {
        // Ignore parse error
      }
    }
    return []
  })

  // Automatically record today's visit on mount
  useEffect(() => {
    const today = getTodayString()
    setStudyDates(prev => {
      if (prev.has(today)) return prev
      const next = new Set(prev)
      next.add(today)
      return next
    })
  }, [])

  // Sync state to localStorage
  useEffect(() => {
    try {
      const payload: SavedProgress = {
        solvedIds: Array.from(solvedIds),
        studyDates: Array.from(studyDates),
        quizSessions: quizSessions.slice(-50), // keep last 50 sessions
        mockInterviews: mockInterviews.slice(-30), // keep last 30 mock interview results
        lastActiveDate: getTodayString(),
      }
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore quota errors
    }
  }, [solvedIds, studyDates, quizSessions, mockInterviews])

  const streak = useMemo(() => calculateStreak(studyDates), [studyDates])

  const isSolved = useCallback((id: number): boolean => {
    return solvedIds.has(id)
  }, [solvedIds])

  const recordActivity = useCallback(() => {
    const today = getTodayString()
    setStudyDates(prev => {
      if (prev.has(today)) return prev
      const next = new Set(prev)
      next.add(today)
      return next
    })
  }, [])

  const toggleSolved = useCallback((id: number) => {
    recordActivity()
    setSolvedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
        dbActivityService.logActivity({
          userId: 'current-user',
          type: 'QUESTION_SOLVED',
          title: `Solved Question #${id}`,
          details: `Completed review and verification of Question #${id}`,
        })
      }
      return next
    })
  }, [recordActivity])

  const markSolved = useCallback((id: number) => {
    recordActivity()
    setSolvedIds(prev => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      dbActivityService.logActivity({
        userId: 'current-user',
        type: 'QUESTION_SOLVED',
        title: `Solved Question #${id}`,
        details: `Successfully completed Question #${id}`,
      })
      return next
    })
  }, [recordActivity])

  const unmarkSolved = useCallback((id: number) => {
    setSolvedIds(prev => {
      if (!prev.has(id)) return prev
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }, [])

  const recordQuizSession = useCallback((score: number, total: number, category?: string) => {
    recordActivity()
    const session: QuizSession = {
      date: new Date().toISOString(),
      score,
      total,
      category,
    }
    setQuizSessions(prev => [...prev, session])
    dbActivityService.logActivity({
      userId: 'current-user',
      type: 'QUIZ_SCORED',
      title: `Completed ${category || 'Frontend'} Practice Quiz`,
      details: `Scored ${score}/${total} (${Math.round((score / total) * 100)}%)`,
    })
  }, [recordActivity])

  const recordMockInterview = useCallback((result: MockInterviewResult) => {
    recordActivity()
    setMockInterviews(prev => [result, ...prev])
    dbActivityService.logActivity({
      userId: 'current-user',
      type: 'MOCK_COMPLETED',
      title: `Completed ${result.track} (${result.level}) Mock Interview`,
      details: `Verdict: ${result.verdict} with average score of ${result.averageScore}/5.0`,
    })
    // Auto-mark questions as studied/solved if scored high
    if (result.averageScore >= 3.5) {
      setSolvedIds(prev => {
        const next = new Set(prev)
        result.questionIds.forEach(id => next.add(id))
        return next
      })
    }
  }, [recordActivity])


  const resetProgress = useCallback(() => {
    setSolvedIds(new Set())
    setQuizSessions([])
    setMockInterviews([])
    setStudyDates(new Set([getTodayString()]))
  }, [])

  return (
    <ProgressContext.Provider
      value={{
        solvedIds,
        totalSolved: solvedIds.size,
        studyDates,
        streak,
        quizSessions,
        mockInterviews,
        isSolved,
        toggleSolved,
        markSolved,
        unmarkSolved,
        recordActivity,
        recordQuizSession,
        recordMockInterview,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
