import { supabase } from './supabase/client'

export interface CustomMCQuestion {
  id: string
  title: string
  category: 'JavaScript' | 'TypeScript' | 'ReactJS' | 'React Redux Toolkit' | 'React Query' | 'DOM' | 'LeetCode'
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Senior'
  timeEstimate: string
  summary: string
  description: string
  requirements: string[]
  interviewTips: string[]
  commonMistakes: string[]
  starterCode: string
  solutionCode: string
  createdBy?: string
  createdAt?: string
  updatedAt?: string
  isCustom: true
}

export type CustomMCQuestionDraft = Omit<CustomMCQuestion, 'id' | 'isCustom' | 'createdAt' | 'updatedAt'>

// In-memory fallback for environments without the Supabase table
const LOCAL_STORE: CustomMCQuestion[] = []
let nextLocalId = 1

function genId(): string {
  return `CQ${String(nextLocalId++).padStart(3, '0')}`
}

function mapRow(row: Record<string, unknown>): CustomMCQuestion {
  const parse = (v: unknown): string[] => {
    if (Array.isArray(v)) return v as string[]
    if (typeof v === 'string') {
      try { return JSON.parse(v) } catch { return [v] }
    }
    return []
  }
  return {
    id: String(row.id ?? ''),
    title: String(row.title ?? ''),
    category: (row.category as CustomMCQuestion['category']) ?? 'ReactJS',
    difficulty: (row.difficulty as CustomMCQuestion['difficulty']) ?? 'Medium',
    timeEstimate: String(row.time_estimate ?? '20 mins'),
    summary: String(row.summary ?? ''),
    description: String(row.description ?? ''),
    requirements: parse(row.requirements),
    interviewTips: parse(row.interview_tips),
    commonMistakes: parse(row.common_mistakes),
    starterCode: String(row.starter_code ?? ''),
    solutionCode: String(row.solution_code ?? ''),
    createdBy: row.created_by ? String(row.created_by) : undefined,
    createdAt: row.created_at ? String(row.created_at) : undefined,
    updatedAt: row.updated_at ? String(row.updated_at) : undefined,
    isCustom: true,
  }
}

export const questionManagementService = {
  /**
   * Fetch all custom (admin-created) questions from Supabase.
   * Falls back to in-memory store on table-not-found errors.
   */
  list: async (): Promise<CustomMCQuestion[]> => {
    try {
      const { data, error } = await supabase
        .from('custom_mc_questions')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })

      if (error) {
        // Table may not exist yet — return in-memory store
        console.warn('[QuestionMgmt] Supabase fallback:', error.message)
        return [...LOCAL_STORE]
      }
      return (data ?? []).map(mapRow)
    } catch {
      return [...LOCAL_STORE]
    }
  },

  /**
   * Create a new custom question.
   */
  create: async (draft: CustomMCQuestionDraft): Promise<CustomMCQuestion> => {
    const payload = {
      title: draft.title,
      category: draft.category,
      difficulty: draft.difficulty,
      time_estimate: draft.timeEstimate,
      summary: draft.summary,
      description: draft.description,
      requirements: JSON.stringify(draft.requirements),
      interview_tips: JSON.stringify(draft.interviewTips),
      common_mistakes: JSON.stringify(draft.commonMistakes),
      starter_code: draft.starterCode,
      solution_code: draft.solutionCode,
      is_deleted: false,
    }

    try {
      // maybeSingle: an RLS-hidden row is a normal outcome, not an exception.
      const { data, error } = await supabase
        .from('custom_mc_questions')
        .insert([payload])
        .select()
        .maybeSingle()

      if (error || !data) throw error || new Error('no row returned')
      return mapRow(data as Record<string, unknown>)
    } catch {
      // Fallback: store in memory
      const q: CustomMCQuestion = {
        ...draft,
        id: genId(),
        isCustom: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      LOCAL_STORE.unshift(q)
      return q
    }
  },

  /**
   * Update an existing custom question.
   */
  update: async (id: string, draft: Partial<CustomMCQuestionDraft>): Promise<CustomMCQuestion | null> => {
    const payload: Record<string, unknown> = {}
    if (draft.title !== undefined) payload.title = draft.title
    if (draft.category !== undefined) payload.category = draft.category
    if (draft.difficulty !== undefined) payload.difficulty = draft.difficulty
    if (draft.timeEstimate !== undefined) payload.time_estimate = draft.timeEstimate
    if (draft.summary !== undefined) payload.summary = draft.summary
    if (draft.description !== undefined) payload.description = draft.description
    if (draft.requirements !== undefined) payload.requirements = JSON.stringify(draft.requirements)
    if (draft.interviewTips !== undefined) payload.interview_tips = JSON.stringify(draft.interviewTips)
    if (draft.commonMistakes !== undefined) payload.common_mistakes = JSON.stringify(draft.commonMistakes)
    if (draft.starterCode !== undefined) payload.starter_code = draft.starterCode
    if (draft.solutionCode !== undefined) payload.solution_code = draft.solutionCode
    payload.updated_at = new Date().toISOString()

    try {
      // maybeSingle: missing/soft-deleted/other-owner rows are normal, not 406.
      const { data, error } = await supabase
        .from('custom_mc_questions')
        .update(payload)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error || !data) throw error || new Error('no row returned')
      return mapRow(data as Record<string, unknown>)
    } catch {
      const idx = LOCAL_STORE.findIndex(q => q.id === id)
      if (idx !== -1) {
        LOCAL_STORE[idx] = {
          ...LOCAL_STORE[idx],
          ...draft,
          updatedAt: new Date().toISOString(),
        }
        return LOCAL_STORE[idx]
      }
      return null
    }
  },

  /**
   * Soft-delete a custom question.
   */
  delete: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('custom_mc_questions')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      return true
    } catch {
      const idx = LOCAL_STORE.findIndex(q => q.id === id)
      if (idx !== -1) {
        LOCAL_STORE.splice(idx, 1)
        return true
      }
      return false
    }
  },
}

export default questionManagementService
