// src/features/interview-questions/services/interviewQuestionsDataService.ts
import type {
  MasterSubjectId,
  MasterQuestion,
  MasterBankCatalog,
  SubjectMeta,
} from '../types/interviewQuestions.types'

class InterviewQuestionsDataService {
  private catalogCache: MasterBankCatalog | null = null
  private questionsCache = new Map<MasterSubjectId, MasterQuestion[]>()
  private loadingPromises = new Map<string, Promise<any>>()

  private getBaseUrl(): string {
    return (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? '/'
  }

  async getCatalog(): Promise<MasterBankCatalog> {
    if (this.catalogCache) return this.catalogCache

    const cacheKey = 'catalog'
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)
    }

    const promise = (async () => {
      try {
        const url = `${this.getBaseUrl()}data/interview-questions/catalog.json?t=${Date.now()}`
        const res = await fetch(url, { cache: 'no-cache' })
        if (!res.ok) {
          throw new Error(`Failed to load master bank catalog (HTTP ${res.status})`)
        }
        const data: MasterBankCatalog = await res.json()
        this.catalogCache = data
        return data
      } catch (err) {
        console.error('Failed to fetch catalog.json:', err)
        throw err
      } finally {
        this.loadingPromises.delete(cacheKey)
      }
    })()

    this.loadingPromises.set(cacheKey, promise)
    return promise
  }

  async getSubjectQuestions(subjectId: MasterSubjectId): Promise<MasterQuestion[]> {
    if (this.questionsCache.has(subjectId)) {
      return this.questionsCache.get(subjectId)!
    }

    const cacheKey = `subject_${subjectId}`
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey)
    }

    const promise = (async () => {
      try {
        const url = `${this.getBaseUrl()}data/interview-questions/${subjectId}.json?t=${Date.now()}`
        const res = await fetch(url, { cache: 'no-cache' })
        if (!res.ok) {
          throw new Error(`Failed to load ${subjectId} questions (HTTP ${res.status})`)
        }
        const rawData: any[] = await res.json()
        const normalizedData: MasterQuestion[] = rawData.map((q, idx) => {
          const qNum = q.questionNumber ?? (idx + 1)
          const rawSub = (q.subject || subjectId).toString().toLowerCase()
          const id = q.id || `iq-${rawSub}-${String(qNum).padStart(4, '0')}`
          const diffStr = (q.difficulty || 'EASY').toString().toUpperCase()
          const difficulty = ['EASY', 'INTERMEDIATE', 'DIFFICULT'].includes(diffStr) ? diffStr : 'EASY'
          const topic = q.category || q.topic || `${subjectId.toUpperCase()} Fundamentals`
          const subtopic = q.subtopic || topic
          const concept = q.concept || q.question
          const detailedExplanation = q.simpleExplanation || q.detailedAnswer || q.detailedExplanation || ''
          const example = q.codeExample || q.example || q.codeSnippet || ''
          const followUps = q.followUpQuestions || q.followUps || []
          const interviewTip = q.interviewTip || (Array.isArray(q.interviewTips) && q.interviewTips.length > 0 ? q.interviewTips[0] : '')

          return {
            ...q,
            id,
            subject: rawSub as MasterSubjectId,
            questionNumber: qNum,
            category: q.category || topic,
            topic,
            subtopic,
            concept,
            difficulty,
            questionType: q.questionType || 'CONCEPTUAL',
            experienceLevel: q.experienceLevel || 'FRESHER',
            tags: Array.isArray(q.tags) ? q.tags : [rawSub, 'interview-prep'],
            question: q.question,
            shortAnswer: q.shortAnswer || '',
            simpleExplanation: q.simpleExplanation || detailedExplanation,
            detailedAnswer: q.detailedAnswer || detailedExplanation,
            detailedExplanation,
            codeExample: q.codeExample || example,
            example,
            codeSnippet: q.codeSnippet || example,
            codeExplanationSpeech: q.codeExplanationSpeech || '',
            howItWorks: q.howItWorks || '',
            interviewTip,
            interviewTips: Array.isArray(q.interviewTips) ? q.interviewTips : (interviewTip ? [interviewTip] : []),
            lineByLineExplanation: Array.isArray(q.lineByLineExplanation) ? q.lineByLineExplanation : [],
            expectedOutput: q.expectedOutput || '',
            realWorldExample: q.realWorldExample || '',
            commonMistakes: Array.isArray(q.commonMistakes) ? q.commonMistakes : [],
            followUpQuestions: q.followUpQuestions || followUps,
            followUps,
            followUpAnswers: Array.isArray(q.followUpAnswers) ? q.followUpAnswers : []
          }
        })
        this.questionsCache.set(subjectId, normalizedData)
        return normalizedData
      } catch (err) {
        console.error(`Failed to fetch ${subjectId}.json:`, err)
        throw err
      } finally {
        this.loadingPromises.delete(cacheKey)
      }
    })()

    this.loadingPromises.set(cacheKey, promise)
    return promise
  }

  async getQuestionById(subjectId: MasterSubjectId, questionId: string): Promise<MasterQuestion | null> {
    const questions = await this.getSubjectQuestions(subjectId)
    const target = (questionId || '').toLowerCase()
    return questions.find(q =>
      q.id.toLowerCase() === target ||
      String(q.questionNumber) === target ||
      `q${q.questionNumber}` === target ||
      `iq-${subjectId}-${String(q.questionNumber).padStart(4, '0')}`.toLowerCase() === target
    ) || null
  }

  async getSubjectMeta(subjectId: MasterSubjectId): Promise<SubjectMeta | null> {
    const catalog = await this.getCatalog()
    return catalog.subjects.find(s => s.id === subjectId) || null
  }

  async getRandomPracticeSet(
    subjectId: MasterSubjectId | 'all',
    count: number = 10,
    options?: string | { difficulty?: string; companyTag?: string; highFreqOnly?: boolean; questionType?: string; topic?: string }
  ): Promise<MasterQuestion[]> {
    let pool: MasterQuestion[] = []

    const diffFilter = typeof options === 'string' ? options : options?.difficulty
    const companyFilter = typeof options === 'object' ? options?.companyTag : undefined
    const highFreqFilter = typeof options === 'object' ? options?.highFreqOnly : undefined
    const typeFilter = typeof options === 'object' ? options?.questionType : undefined
    const topicFilter = typeof options === 'object' ? options?.topic : undefined

    if (subjectId === 'all') {
      const catalog = await this.getCatalog()
      for (const s of catalog.subjects) {
        try {
          const qList = await this.getSubjectQuestions(s.id)
          pool.push(...qList.slice(0, 50))
        } catch {
          // ignore
        }
      }
    } else {
      pool = await this.getSubjectQuestions(subjectId)
    }

    if (diffFilter && diffFilter !== 'ALL') {
      pool = pool.filter(q => q.difficulty.toUpperCase() === diffFilter.toUpperCase())
    }

    if (typeFilter && typeFilter !== 'ALL') {
      pool = pool.filter(q => {
        const isMCQ = (Array.isArray(q.options) && q.options.length > 0) || q.questionType?.toUpperCase() === 'MCQ' || q.question_type?.toLowerCase() === 'mcq'
        if (typeFilter === 'MCQ') return isMCQ
        if (typeFilter === 'CONCEPTUAL') return !isMCQ
        return true
      })
    }

    if (topicFilter && topicFilter !== 'ALL') {
      pool = pool.filter(q => (q.category || q.topic) === topicFilter)
    }

    if (companyFilter && companyFilter !== 'ALL') {
      pool = pool.filter(q => q.companyTags && q.companyTags.includes(companyFilter))
    }

    if (highFreqFilter) {
      pool = pool.filter(q => q.isHighFrequency)
    }

    // Deduplicate pool and shuffle
    const seenIds = new Set<string>()
    const uniquePool = pool.filter(q => {
      if (seenIds.has(q.id)) return false
      seenIds.add(q.id)
      return true
    })

    const shuffled = [...uniquePool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }
}

export const interviewQuestionsDataService = new InterviewQuestionsDataService()
