import { supabase } from './supabase/client'
import type {
  QuestionDifficulty,
  ExperienceTier,
  QuestionType,
  QuestionStatus,
} from '../features/ai-video-mock/types/questionBank.types'

export type { QuestionDifficulty, ExperienceTier, QuestionType, QuestionStatus }

export const MOCK_DIFFICULTIES: QuestionDifficulty[] = ['Basic', 'Intermediate', 'Advanced', 'Expert']

export const EXPERIENCE_TIERS: ExperienceTier[] = ['0-1', '1-2', '2-4', '4-6', '6-8', '8-12', '12+']

export const EXPERIENCE_TIER_LABELS: Record<ExperienceTier, string> = {
  '0-1': 'Fresher (0-1 yrs)',
  '1-2': 'Junior (1-2 yrs)',
  '2-4': 'Mid (2-4 yrs)',
  '4-6': 'Senior (4-6 yrs)',
  '6-8': 'Staff (6-8 yrs)',
  '8-12': 'Principal (8-12 yrs)',
  '12+': 'Distinguished (12+ yrs)',
}

/** Technology track ids, matching mock_question_bank.technology. */
export const MOCK_TECHNOLOGIES = [
  'javascript',
  'typescript',
  'html',
  'css',
  'react',
  'nextjs',
  'angular',
  'vue',
  'redux-state',
  'web-performance',
  'browser-web-apis',
  'frontend-security',
  'accessibility',
  'testing',
  'frontend-architecture',
  'communication',
] as const

export type MockBankTechnology = (typeof MOCK_TECHNOLOGIES)[number]

export interface MockBankQuestion {
  id: string
  technology: string
  topic: string
  subtopic: string
  difficulty: QuestionDifficulty
  question: string
  questionType: QuestionType
  experienceLevels: ExperienceTier[]
  expectedConcepts: string[]
  idealAnswerPoints: string[]
  commonMistakes: string[]
  followUpTopics: string[]
  estimatedTimeMinutes: number
  tags: string[]
  status: QuestionStatus
  createdAt: string
  updatedAt: string
}

export type MockBankQuestionDraft = Omit<
  MockBankQuestion,
  'id' | 'createdAt' | 'updatedAt'
>

export interface MockBankFilter {
  /** Only PUBLISHED/APPROVED rows are student-visible unless `anyStatus` is set. */
  anyStatus?: boolean
  difficulty?: QuestionDifficulty
  experienceLevel?: ExperienceTier
  technology?: string
  limit?: number
}

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (typeof v === 'string') {
    // Postgres text[] comes back as a real array, but tolerate a JSON/CSV string.
    const t = v.trim()
    if (t.startsWith('[')) {
      try {
        const parsed = JSON.parse(t)
        return Array.isArray(parsed) ? parsed.map(String) : []
      } catch {
        return []
      }
    }
    return t.length ? t.split(',').map(s => s.trim()).filter(Boolean) : []
  }
  return []
}

function mapRow(row: Record<string, unknown>): MockBankQuestion {
  return {
    id: String(row.id ?? ''),
    technology: String(row.technology ?? 'javascript'),
    topic: String(row.topic ?? ''),
    subtopic: String(row.subtopic ?? ''),
    difficulty: (row.difficulty as QuestionDifficulty) ?? 'Basic',
    question: String(row.question ?? ''),
    questionType: (row.question_type as QuestionType) ?? 'Theory',
    experienceLevels: toArray(row.experience_levels) as ExperienceTier[],
    expectedConcepts: toArray(row.expected_concepts),
    idealAnswerPoints: toArray(row.ideal_answer_points),
    commonMistakes: toArray(row.common_mistakes),
    followUpTopics: toArray(row.follow_up_topics),
    estimatedTimeMinutes: Number(row.estimated_time_minutes ?? 5),
    tags: toArray(row.tags),
    status: (row.status as QuestionStatus) ?? 'DRAFT',
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  }
}

/** Rows a student is allowed to be served. */
const STUDENT_STATUSES: QuestionStatus[] = ['APPROVED', 'PUBLISHED']

function buildQuery(filter: MockBankFilter) {
  let q = supabase.from('mock_question_bank').select('*')

  if (!filter.anyStatus) {
    q = q.in('status', STUDENT_STATUSES)
  }
  if (filter.difficulty) {
    q = q.eq('difficulty', filter.difficulty)
  }
  if (filter.technology) {
    q = q.eq('technology', filter.technology)
  }
  if (filter.experienceLevel) {
    // text[] overlap operator
    q = q.contains('experience_levels', [filter.experienceLevel])
  }
  if (filter.limit) {
    q = q.limit(filter.limit)
  }

  return q.order('created_at', { ascending: false })
}

export const mockQuestionBankService = {
  /**
   * Fetch admin-fed questions. Throws on error so callers can show a real
   * failure state rather than silently rendering an empty interview.
   */
  list: async (filter: MockBankFilter = {}): Promise<MockBankQuestion[]> => {
    const { data, error } = await buildQuery(filter)
    if (error) throw new Error(error.message)
    return ((data ?? []) as Record<string, unknown>[]).map(mapRow)
  },

  getById: async (id: string): Promise<MockBankQuestion | null> => {
    const { data, error } = await supabase
      .from('mock_question_bank')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(error.message)
    return data ? mapRow(data as Record<string, unknown>) : null
  },

  create: async (draft: MockBankQuestionDraft): Promise<MockBankQuestion> => {
    // mock_question_bank.id is a plain TEXT PK with no server-side default,
    // so the id must be generated here.
    const id = `MQB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

    const payload = {
      id,
      technology: draft.technology,
      topic: draft.topic,
      subtopic: draft.subtopic,
      difficulty: draft.difficulty,
      question: draft.question,
      question_type: draft.questionType,
      experience_levels: draft.experienceLevels,
      expected_concepts: draft.expectedConcepts,
      ideal_answer_points: draft.idealAnswerPoints,
      common_mistakes: draft.commonMistakes,
      follow_up_topics: draft.followUpTopics,
      estimated_time_minutes: draft.estimatedTimeMinutes,
      tags: draft.tags,
      status: draft.status,
    }

    const { data, error } = await supabase
      .from('mock_question_bank')
      .insert([payload])
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    if (!data) throw new Error('Insert returned no row — check admin permissions.')
    return mapRow(data as Record<string, unknown>)
  },

  update: async (id: string, draft: Partial<MockBankQuestionDraft>): Promise<MockBankQuestion | null> => {
    const payload: Record<string, unknown> = {}
    if (draft.technology !== undefined) payload.technology = draft.technology
    if (draft.topic !== undefined) payload.topic = draft.topic
    if (draft.subtopic !== undefined) payload.subtopic = draft.subtopic
    if (draft.difficulty !== undefined) payload.difficulty = draft.difficulty
    if (draft.question !== undefined) payload.question = draft.question
    if (draft.questionType !== undefined) payload.question_type = draft.questionType
    if (draft.experienceLevels !== undefined) payload.experience_levels = draft.experienceLevels
    if (draft.expectedConcepts !== undefined) payload.expected_concepts = draft.expectedConcepts
    if (draft.idealAnswerPoints !== undefined) payload.ideal_answer_points = draft.idealAnswerPoints
    if (draft.commonMistakes !== undefined) payload.common_mistakes = draft.commonMistakes
    if (draft.followUpTopics !== undefined) payload.follow_up_topics = draft.followUpTopics
    if (draft.estimatedTimeMinutes !== undefined) payload.estimated_time_minutes = draft.estimatedTimeMinutes
    if (draft.tags !== undefined) payload.tags = draft.tags
    if (draft.status !== undefined) payload.status = draft.status
    payload.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('mock_question_bank')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle()

    if (error) throw new Error(error.message)
    return data ? mapRow(data as Record<string, unknown>) : null
  },

  /** Hard delete. RLS restricts this to platform admins. */
  remove: async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('mock_question_bank').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return true
  },
}

export default mockQuestionBankService

/**
 * Stable non-negative 32-bit hash of a string. Used to give DB rows a numeric
 * id so existing numeric-keyed helpers (bookmarks, progress, Record indexes)
 * keep working unchanged.
 */
function hashToNumber(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % 100000
}

const DIFFICULTY_TO_EASY_MEDIUM_HARD: Record<QuestionDifficulty, 'Easy' | 'Medium' | 'Hard'> = {
  Basic: 'Easy',
  Intermediate: 'Medium',
  Advanced: 'Hard',
  Expert: 'Hard',
}

export interface VideoMockPick {
  id: number
  sourceId: string
  category: string
  difficulty: QuestionDifficulty
  question: string
  answer: string
  example: string
  code?: string
  source: string
  experienceLevels: ExperienceTier[]
  idealAnswerPoints: string[]
  commonMistakes: string[]
  followUpTopics: string[]
}

/** Adapt a DB row into the flat shape the video-mock UI renders. */
export function toVideoMockPick(row: MockBankQuestion): VideoMockPick {
  return {
    id: hashToNumber(row.id),
    sourceId: row.id,
    category: row.technology,
    difficulty: row.difficulty,
    question: row.question,
    answer: row.idealAnswerPoints.join(' '),
    example: row.subtopic,
    source: 'Mock Bank',
    experienceLevels: row.experienceLevels,
    idealAnswerPoints: row.idealAnswerPoints,
    commonMistakes: row.commonMistakes,
    followUpTopics: row.followUpTopics,
  }
}

export { DIFFICULTY_TO_EASY_MEDIUM_HARD }
