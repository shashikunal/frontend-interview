// Client Service: candidateAiEvaluationService
// Manages automated AI hiring evaluation generation, synthesis caching, and persistence.

export type AiHiringRecommendation = 'STRONG_HIRE' | 'HIRE' | 'LEAN_HIRE' | 'LEAN_REJECT' | 'STRONG_REJECT'

export interface TailoredInterviewQuestion {
  question: string
  rationale: string
}

export interface CandidateAiEvaluationReport {
  recommendation: AiHiringRecommendation
  confidenceScore: number // e.g. 95
  seniorityLevel: string // e.g. "L5 (Senior Frontend Engineer)"
  seniorityRationale: string
  rubricSuggestions: {
    problemSolving: number // 1.0 - 5.0
    codeQuality: number
    architecture: number
    speedEfficiency: number
  }
  executiveSummary: string
  strengths: string[]
  areasToProbe: string[]
  tailoredInterviewQuestions: TailoredInterviewQuestion[]
  generatedAt: string
  isAiGenerated: boolean
  engine: string
}

export interface AiEvaluationPayload {
  candidateId: string
  candidateName: string
  candidateEmail?: string
  metrics: {
    uniqueSolved: number
    uniqueAttempted: number
    successRate: number
    totalAttempts: number
    totalTimeMinutes?: number
  }
  categoryBreakdown?: {
    machineCoding?: { uniqueSolved: number; avgScore: number }
    coreProgramming?: { uniqueSolved: number; avgScore: number }
    dsa?: { uniqueSolved: number; avgScore: number }
    frontendJs?: { uniqueSolved: number; avgScore: number }
  }
  topSubmissions?: Array<{
    questionId: string
    title?: string
    category?: string
    score?: number
    status?: string
    code?: string
    language?: string
    timeSpentSeconds?: number
  }>
}

const LOCAL_AI_SYNTHESIS_KEY = 'candidate_ai_synthesis_v1'

class CandidateAiEvaluationService {
  /**
   * Retrieves cached AI evaluation synthesis from local storage
   */
  getCachedEvaluation(candidateId: string): CandidateAiEvaluationReport | null {
    if (!candidateId || typeof localStorage === 'undefined') return null
    try {
      const raw = localStorage.getItem(LOCAL_AI_SYNTHESIS_KEY)
      if (!raw) return null
      const map: Record<string, CandidateAiEvaluationReport> = JSON.parse(raw)
      return map[candidateId] || null
    } catch {
      return null
    }
  }

  /**
   * Saves or updates an AI evaluation synthesis in local storage mirror
   */
  saveEvaluation(candidateId: string, report: CandidateAiEvaluationReport): void {
    if (!candidateId || typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(LOCAL_AI_SYNTHESIS_KEY)
      const map: Record<string, CandidateAiEvaluationReport> = raw ? JSON.parse(raw) : {}
      map[candidateId] = report
      localStorage.setItem(LOCAL_AI_SYNTHESIS_KEY, JSON.stringify(map))
    } catch (_) {}
  }

  /**
   * Clears cached evaluation for candidate
   */
  clearCachedEvaluation(candidateId: string): void {
    if (!candidateId || typeof localStorage === 'undefined') return
    try {
      const raw = localStorage.getItem(LOCAL_AI_SYNTHESIS_KEY)
      if (raw) {
        const map: Record<string, CandidateAiEvaluationReport> = JSON.parse(raw)
        delete map[candidateId]
        localStorage.setItem(LOCAL_AI_SYNTHESIS_KEY, JSON.stringify(map))
      }
    } catch (_) {}
  }

  /**
   * Calls the serverless /api/candidate-ai-evaluation gateway to synthesize evaluation
   */
  async generateEvaluation(payload: AiEvaluationPayload): Promise<CandidateAiEvaluationReport> {
    const res = await fetch('/api/candidate-ai-evaluation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Evaluation synthesis failed.' }))
      throw new Error(err.error || `Failed to synthesize AI evaluation (${res.status}).`)
    }

    const json = await res.json()
    if (!json.success || !json.report) {
      throw new Error('Invalid response structure from AI evaluation endpoint.')
    }

    const report: CandidateAiEvaluationReport = json.report
    this.saveEvaluation(payload.candidateId, report)
    return report
  }
}

export const candidateAiEvaluationService = new CandidateAiEvaluationService()
