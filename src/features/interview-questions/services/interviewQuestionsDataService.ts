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
        const url = `${this.getBaseUrl()}data/interview-questions/catalog.json`
        const res = await fetch(url)
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
        const url = `${this.getBaseUrl()}data/interview-questions/${subjectId}.json`
        const res = await fetch(url)
        if (!res.ok) {
          throw new Error(`Failed to load ${subjectId} questions (HTTP ${res.status})`)
        }
        const data: MasterQuestion[] = await res.json()
        this.questionsCache.set(subjectId, data)
        return data
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
    return questions.find(q => q.id === questionId) || null
  }

  async getSubjectMeta(subjectId: MasterSubjectId): Promise<SubjectMeta | null> {
    const catalog = await this.getCatalog()
    return catalog.subjects.find(s => s.id === subjectId) || null
  }

  async getRandomPracticeSet(
    subjectId: MasterSubjectId | 'all',
    count: number = 10,
    difficulty?: string
  ): Promise<MasterQuestion[]> {
    let pool: MasterQuestion[] = []

    if (subjectId === 'all') {
      const catalog = await this.getCatalog()
      const sampleSubjects = catalog.subjects.slice(0, 4)
      for (const s of sampleSubjects) {
        const qList = await this.getSubjectQuestions(s.id)
        pool.push(...qList.slice(0, 100))
      }
    } else {
      pool = await this.getSubjectQuestions(subjectId)
    }

    if (difficulty && difficulty !== 'ALL') {
      pool = pool.filter(q => q.difficulty === difficulty)
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(count, shuffled.length))
  }
}

export const interviewQuestionsDataService = new InterviewQuestionsDataService()
