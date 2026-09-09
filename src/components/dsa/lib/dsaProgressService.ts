import type { DSASubmission } from '../data/dsaTypes'

const STORAGE_KEYS = {
  SOLVED: 'dsa_solved_v1',
  ATTEMPTED: 'dsa_attempted_v1',
  BOOKMARKS: 'dsa_bookmarks_v1',
  REVISIT: 'dsa_revisit_v1',
  NOTES: 'dsa_notes_v1',
  CODE: 'dsa_code_v1',
  SUBMISSIONS: 'dsa_submissions_v1',
  STREAK: 'dsa_streak_v1',
} as const

export type DSAQuestionStatus = 'Not Started' | 'Attempted' | 'Solved' | 'Revisit'

type Listener = () => void

class DSAProgressService {
  private listeners: Set<Listener> = new Set()

  private safeParse<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : fallback
    } catch {
      return fallback
    }
  }

  private safeSave(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      this.notify()
    } catch (err) {
      console.warn(`Failed to save DSA key ${key}:`, err)
    }
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach(fn => {
      try {
        fn()
      } catch (e) {
        console.error(e)
      }
    })
  }

  // Solved Questions
  getSolvedIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.SOLVED, [])
    return new Set(list)
  }

  markSolved(questionId: string): void {
    const set = this.getSolvedIds()
    if (!set.has(questionId)) {
      set.add(questionId)
      this.safeSave(STORAGE_KEYS.SOLVED, Array.from(set))
      this.updateStreak()
    }
  }

  // Attempted Questions
  getAttemptedIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.ATTEMPTED, [])
    return new Set(list)
  }

  markAttempted(questionId: string): void {
    const set = this.getAttemptedIds()
    if (!set.has(questionId)) {
      set.add(questionId)
      this.safeSave(STORAGE_KEYS.ATTEMPTED, Array.from(set))
    }
  }

  // Bookmarks
  getBookmarkedIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.BOOKMARKS, [])
    return new Set(list)
  }

  isBookmarked(questionId: string): boolean {
    return this.getBookmarkedIds().has(questionId)
  }

  toggleBookmark(questionId: string): boolean {
    const set = this.getBookmarkedIds()
    const willBookmark = !set.has(questionId)
    if (willBookmark) {
      set.add(questionId)
    } else {
      set.delete(questionId)
    }
    this.safeSave(STORAGE_KEYS.BOOKMARKS, Array.from(set))
    return willBookmark
  }

  // Revisit
  getRevisitIds(): Set<string> {
    const list = this.safeParse<string[]>(STORAGE_KEYS.REVISIT, [])
    return new Set(list)
  }

  isRevisit(questionId: string): boolean {
    return this.getRevisitIds().has(questionId)
  }

  toggleRevisit(questionId: string): boolean {
    const set = this.getRevisitIds()
    const willRevisit = !set.has(questionId)
    if (willRevisit) {
      set.add(questionId)
    } else {
      set.delete(questionId)
    }
    this.safeSave(STORAGE_KEYS.REVISIT, Array.from(set))
    return willRevisit
  }

  getQuestionStatus(questionId: string): DSAQuestionStatus {
    if (this.isRevisit(questionId)) return 'Revisit'
    if (this.getSolvedIds().has(questionId)) return 'Solved'
    if (this.getAttemptedIds().has(questionId)) return 'Attempted'
    return 'Not Started'
  }

  // Notes
  getNotes(): Record<string, string> {
    return this.safeParse<Record<string, string>>(STORAGE_KEYS.NOTES, {})
  }

  getNote(questionId: string): string {
    const notes = this.getNotes()
    return notes[questionId] || ''
  }

  saveNote(questionId: string, content: string): void {
    const notes = this.getNotes()
    notes[questionId] = content
    this.safeSave(STORAGE_KEYS.NOTES, notes)
  }

  // Code persistence per question and language
  getCode(questionId: string, lang: 'javascript' | 'typescript'): string | null {
    const allCode = this.safeParse<Record<string, { javascript?: string; typescript?: string }>>(
      STORAGE_KEYS.CODE,
      {}
    )
    return allCode[questionId]?.[lang] ?? null
  }

  saveCode(questionId: string, lang: 'javascript' | 'typescript', code: string): void {
    const allCode = this.safeParse<Record<string, { javascript?: string; typescript?: string }>>(
      STORAGE_KEYS.CODE,
      {}
    )
    if (!allCode[questionId]) {
      allCode[questionId] = {}
    }
    allCode[questionId][lang] = code
    this.safeSave(STORAGE_KEYS.CODE, allCode)
  }

  // Submissions
  getSubmissions(questionId?: string): DSASubmission[] {
    const all = this.safeParse<DSASubmission[]>(STORAGE_KEYS.SUBMISSIONS, [])
    if (questionId) {
      return all.filter(s => s.questionId === questionId)
    }
    return all
  }

  addSubmission(submission: DSASubmission): void {
    const all = this.getSubmissions()
    all.unshift(submission)
    // Keep max 200 submissions in local storage
    if (all.length > 200) {
      all.length = 200
    }
    this.safeSave(STORAGE_KEYS.SUBMISSIONS, all)

    if (submission.status === 'Accepted') {
      this.markSolved(submission.questionId)
    } else {
      this.markAttempted(submission.questionId)
    }
  }

  // Streaks
  getStreak(): { currentStreak: number; lastSolvedDate: string | null } {
    return this.safeParse(STORAGE_KEYS.STREAK, { currentStreak: 0, lastSolvedDate: null })
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split('T')[0]
    const current = this.getStreak()

    if (current.lastSolvedDate === today) {
      return // already recorded today
    }

    if (!current.lastSolvedDate) {
      this.safeSave(STORAGE_KEYS.STREAK, { currentStreak: 1, lastSolvedDate: today })
      return
    }

    const lastDate = new Date(current.lastSolvedDate)
    const nowDate = new Date(today)
    const diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24))

    if (diffDays === 1) {
      this.safeSave(STORAGE_KEYS.STREAK, { currentStreak: current.currentStreak + 1, lastSolvedDate: today })
    } else if (diffDays > 1) {
      this.safeSave(STORAGE_KEYS.STREAK, { currentStreak: 1, lastSolvedDate: today })
    }
  }
}

export const dsaProgressService = new DSAProgressService()
