// src/features/interview-questions/services/interviewQuestionsProgressService.ts
import type {
  MasterSubjectId,
  MasterQuestion,
  SubjectProgressStat,
  UserInterviewQuestionsProgress,
  MasterBankCatalog,
} from '../types/interviewQuestions.types'
import { trackingService } from '../../../lib/trackingService'

const LOCAL_STORAGE_KEY = 'interview_master_bank_progress_v1'

function getInitialState(): UserInterviewQuestionsProgress {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        completedQuestionIds: Array.isArray(parsed.completedQuestionIds) ? parsed.completedQuestionIds : [],
        bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
        needsReviewQuestionIds: Array.isArray(parsed.needsReviewQuestionIds) ? parsed.needsReviewQuestionIds : [],
        masteredQuestionIds: Array.isArray(parsed.masteredQuestionIds) ? parsed.masteredQuestionIds : [],
        questionNotes: typeof parsed.questionNotes === 'object' && parsed.questionNotes !== null ? parsed.questionNotes : {},
        lastVisited: parsed.lastVisited,
        practiceSessionsCount: parsed.practiceSessionsCount || 0,
        testScores: Array.isArray(parsed.testScores) ? parsed.testScores : [],
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      }
    }
  } catch (err) {
    console.warn('Failed to parse master bank progress from storage:', err)
  }

  return {
    completedQuestionIds: [],
    bookmarkedQuestionIds: [],
    needsReviewQuestionIds: [],
    masteredQuestionIds: [],
    questionNotes: {},
    practiceSessionsCount: 0,
    testScores: [],
    updatedAt: new Date().toISOString(),
  }
}

class InterviewQuestionsProgressService {
  private state: UserInterviewQuestionsProgress = getInitialState()

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === LOCAL_STORAGE_KEY) {
          this.state = getInitialState()
          this.notify()
        }
      })
    }
  }

  private save(): void {
    this.state.updatedAt = new Date().toISOString()
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state))
    } catch (err) {
      console.error('Failed to save master bank progress to localStorage:', err)
    }
    this.notify()
  }

  private notify(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('master_bank_progress_updated', { detail: this.state }))
    }
  }

  getState(): UserInterviewQuestionsProgress {
    return { ...this.state }
  }

  isCompleted(questionId: string): boolean {
    return this.state.completedQuestionIds.includes(questionId)
  }

  toggleCompleted(questionId: string, subjectId?: MasterSubjectId): boolean {
    const exists = this.isCompleted(questionId)
    if (exists) {
      this.state.completedQuestionIds = this.state.completedQuestionIds.filter(id => id !== questionId)
    } else {
      this.state.completedQuestionIds.push(questionId)
      // Track activity in trackingService
      trackingService.trackActivity(
        'question_completed',
        'question',
        questionId,
        { subjectId, track: 'master_interview_bank' }
      ).catch(() => {})
    }
    this.save()
    return !exists
  }

  isBookmarked(questionId: string): boolean {
    return this.state.bookmarkedQuestionIds.includes(questionId)
  }

  toggleBookmark(questionId: string, subjectId?: MasterSubjectId): boolean {
    const exists = this.isBookmarked(questionId)
    if (exists) {
      this.state.bookmarkedQuestionIds = this.state.bookmarkedQuestionIds.filter(id => id !== questionId)
      trackingService.trackActivity(
        'question_unbookmarked',
        'question',
        questionId,
        { subjectId, track: 'master_interview_bank' }
      ).catch(() => {})
    } else {
      this.state.bookmarkedQuestionIds.push(questionId)
      trackingService.trackActivity(
        'question_bookmarked',
        'question',
        questionId,
        { subjectId, track: 'master_interview_bank' }
      ).catch(() => {})
    }
    this.save()
    return !exists
  }

  isNeedsReview(questionId: string): boolean {
    return this.state.needsReviewQuestionIds.includes(questionId)
  }

  toggleNeedsReview(questionId: string): boolean {
    const exists = this.isNeedsReview(questionId)
    if (exists) {
      this.state.needsReviewQuestionIds = this.state.needsReviewQuestionIds.filter(id => id !== questionId)
    } else {
      this.state.needsReviewQuestionIds.push(questionId)
    }
    this.save()
    return !exists
  }

  getNote(questionId: string): string {
    return this.state.questionNotes[questionId] || ''
  }

  saveNote(questionId: string, note: string): void {
    if (!note.trim()) {
      delete this.state.questionNotes[questionId]
    } else {
      this.state.questionNotes[questionId] = note
    }
    this.save()
  }

  setLastVisited(subjectId: MasterSubjectId, questionId: string): void {
    this.state.lastVisited = {
      subjectId,
      questionId,
      timestamp: Date.now(),
    }
    this.save()
  }

  recordTestScore(params: {
    subjectId: MasterSubjectId | 'all'
    score: number
    totalQuestions: number
    percentage: number
    durationSeconds: number
  }): void {
    this.state.testScores.unshift({
      id: `test_${Date.now()}`,
      ...params,
      timestamp: new Date().toISOString(),
    })
    this.state.practiceSessionsCount++
    this.save()
  }

  getSubjectStats(subjectId: MasterSubjectId, questions?: MasterQuestion[]): SubjectProgressStat {
    const total = 1000
    const prefix = `iq-${subjectId}-`

    const completedInSubject = this.state.completedQuestionIds.filter(id => id.startsWith(prefix)).length
    const bookmarkedInSubject = this.state.bookmarkedQuestionIds.filter(id => id.startsWith(prefix)).length
    const needsReviewInSubject = this.state.needsReviewQuestionIds.filter(id => id.startsWith(prefix)).length

    // If questions are provided, calculate exact breakdown by difficulty
    let easyCount = 400
    let intermediateCount = 400
    let difficultCount = 200
    let easyCompleted = 0
    let intermediateCompleted = 0
    let difficultCompleted = 0

    if (questions && questions.length > 0) {
      easyCount = questions.filter(q => q.difficulty === 'EASY').length
      intermediateCount = questions.filter(q => q.difficulty === 'INTERMEDIATE').length
      difficultCount = questions.filter(q => q.difficulty === 'DIFFICULT').length

      const completedSet = new Set(this.state.completedQuestionIds)
      for (const q of questions) {
        if (completedSet.has(q.id)) {
          if (q.difficulty === 'EASY') easyCompleted++
          else if (q.difficulty === 'INTERMEDIATE') intermediateCompleted++
          else if (q.difficulty === 'DIFFICULT') difficultCompleted++
        }
      }
    } else {
      // Approximation for landing page before subject JSON is loaded
      const ratio = completedInSubject / total
      easyCompleted = Math.round(easyCount * ratio)
      intermediateCompleted = Math.round(intermediateCount * ratio)
      difficultCompleted = completedInSubject - easyCompleted - intermediateCompleted
      if (difficultCompleted < 0) difficultCompleted = 0
    }

    const completionPct = Math.round((completedInSubject / total) * 100)

    return {
      subjectId,
      totalQuestions: total,
      completed: completedInSubject,
      remaining: total - completedInSubject,
      completionPct,
      easyCount,
      easyCompleted,
      intermediateCount,
      intermediateCompleted,
      difficultCount,
      difficultCompleted,
      bookmarkedCount: bookmarkedInSubject,
      needsReviewCount: needsReviewInSubject,
    }
  }

  getOverallStats(_catalog?: MasterBankCatalog | null): {
    totalQuestions: number
    totalCompleted: number
    overallPct: number
    totalBookmarked: number
    totalNeedsReview: number
    totalTestsTaken: number
  } {
    const totalQuestions = 12000
    const totalCompleted = this.state.completedQuestionIds.length
    const overallPct = Math.round((totalCompleted / totalQuestions) * 100)

    return {
      totalQuestions,
      totalCompleted,
      overallPct,
      totalBookmarked: this.state.bookmarkedQuestionIds.length,
      totalNeedsReview: this.state.needsReviewQuestionIds.length,
      totalTestsTaken: this.state.testScores.length,
    }
  }
}

export const interviewQuestionsProgressService = new InterviewQuestionsProgressService()
