import { supabase } from '../lib/supabase/client'
import type {
  Assessment,
  AssessmentQuestion,
  AssessmentAttempt,
  AttemptQuestion,
  AttemptAnswer,
  AssessmentResult,
  CandidateAssessmentView,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  AdminStats,
  SaveAnswerInput,
  StartAttemptResult,
  AssessmentStatus,
  AssessmentType,
} from '../types/assessment.types'

class AssessmentService {
  async getAssessments(filters?: {
    status?: AssessmentStatus
    assessment_type?: AssessmentType
    search?: string
    limit?: number
  }): Promise<{ assessments: Assessment[]; total: number }> {
    let query = supabase.from('assessments').select('*', { count: 'exact' })

    if (filters?.status) query = query.eq('status', filters.status)
    if (filters?.assessment_type) query = query.eq('assessment_type', filters.assessment_type)
    if (filters?.search) query = query.ilike('title', `%${filters.search}%`)
    if (filters?.limit) query = query.limit(filters.limit)

    const { data, error, count } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return { assessments: data || [], total: count || 0 }
  }

  async getAssessment(id: string): Promise<Assessment> {
    const { data, error } = await supabase.from('assessments').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }

  async createAssessment(input: CreateAssessmentInput): Promise<Assessment> {
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('assessments')
      .insert({ ...input, created_by: userData?.user?.id })
      .select()
      .single()
    if (error) throw error
    return data
  }

  async updateAssessment(id: string, input: UpdateAssessmentInput): Promise<Assessment> {
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('assessments')
      .update({ ...input, updated_by: userData?.user?.id })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async publishAssessment(id: string): Promise<Assessment> {
    const { data: userData } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('assessments')
      .update({
        status: 'PUBLISHED',
        published_by: userData?.user?.id,
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async unpublishAssessment(id: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .update({ status: 'DRAFT', published_by: null, published_at: null })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async archiveAssessment(id: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .update({ status: 'ARCHIVED', archived_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async duplicateAssessment(id: string): Promise<Assessment> {
    const original = await this.getAssessment(id)
    const { data: userData } = await supabase.auth.getUser()
    const { id: _id, created_at: _c, updated_at: _u, published_at: _p, archived_at: _a, ...rest } = original as any
    const { data, error } = await supabase
      .from('assessments')
      .insert({
        ...rest,
        title: `${rest.title} (Copy)`,
        status: 'DRAFT',
        created_by: userData?.user?.id,
      })
      .select()
      .single()
    if (error) throw error

    const { data: questions } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', id)
    if (questions && questions.length > 0) {
      await supabase.from('assessment_questions').insert(
        questions.map((q: any) => ({
          assessment_id: data.id,
          question_id: q.question_id,
          question_version: q.question_version,
          question_snapshot: q.question_snapshot,
          marks: q.marks,
          question_order: q.question_order,
          assigned_by: userData?.user?.id,
        }))
      )
    }

    return data
  }

  async deleteAssessment(id: string): Promise<void> {
    const { error } = await supabase.from('assessments').delete().eq('id', id)
    if (error) throw error
  }

  async getAdminStats(): Promise<AdminStats> {
    const { data: assessments } = await supabase.from('assessments').select('status')
    const { data: results } = await supabase
      .from('assessment_results')
      .select('percentage, passed')
    const { data: assignments } = await supabase
      .from('assessment_candidate_assignments')
      .select('candidate_id')

    const total = assessments?.length || 0
    const active = assessments?.filter((a) => a.status === 'PUBLISHED' || a.status === 'ACTIVE').length || 0
    const completed = assessments?.filter((a) => a.status === 'COMPLETED').length || 0
    const candidates = new Set(assignments?.map((a) => a.candidate_id)).size || 0
    const avgScore =
      results && results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + Number(r.percentage || 0), 0) / results.length)
        : 0
    const passRate =
      results && results.length > 0
        ? Math.round((results.filter((r) => r.passed).length / results.length) * 100)
        : 0

    return {
      total_assessments: total,
      active_assessments: active,
      completed_assessments: completed,
      total_candidates: candidates,
      average_score: avgScore,
      pass_rate: passRate,
    }
  }

  async getCandidateAssessments(candidateId: string): Promise<CandidateAssessmentView[]> {
    const { data: assignments, error: assignError } = await supabase
      .from('assessment_candidate_assignments')
      .select('assessment_id')
      .eq('candidate_id', candidateId)
    if (assignError) throw assignError

    const assessmentIds = assignments?.map((a) => a.assessment_id) || []
    if (assessmentIds.length === 0) return []

    const { data: assessments, error: assessError } = await supabase
      .from('assessments')
      .select('*')
      .in('id', assessmentIds)
    if (assessError) throw assessError

    const { data: attempts, error: attemptError } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('candidate_id', candidateId)
    if (attemptError) throw attemptError

    const { data: results, error: resultError } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('candidate_id', candidateId)
    if (resultError) throw resultError

    const { data: attemptQuestions, error: aqError } = await supabase
      .from('attempt_questions')
      .select('attempt_id, status')
    if (aqError) throw aqError

    const { data: assessmentQuestions, error: asqError } = await supabase
      .from('assessment_questions')
      .select('assessment_id')
    if (asqError) throw asqError

    const questionCountByAssessment: Record<string, number> = {}
    for (const aq of assessmentQuestions || []) {
      questionCountByAssessment[aq.assessment_id] = (questionCountByAssessment[aq.assessment_id] || 0) + 1
    }

    const answeredCountByAttempt: Record<string, number> = {}
    for (const tq of attemptQuestions || []) {
      if (tq.status === 'answered') {
        answeredCountByAttempt[tq.attempt_id] = (answeredCountByAttempt[tq.attempt_id] || 0) + 1
      }
    }

    return (assessments || []).map((assessment) => {
      const attempt = attempts?.find((a) => a.assessment_id === assessment.id) || null
      const result = results?.find((r) => r.assessment_id === assessment.id) || null
      return {
        assessment,
        attempt,
        result,
        question_count: questionCountByAssessment[assessment.id] || 0,
        answered_count: attempt ? answeredCountByAttempt[attempt.id] || 0 : 0,
      }
    })
  }

  async startAttempt(assessmentId: string): Promise<StartAttemptResult> {
    const { data: userData } = await supabase.auth.getUser()
    const candidateId = userData?.user?.id
    if (!candidateId) throw new Error('Not authenticated')

    const assessment = await this.getAssessment(assessmentId)

    const { data: existingAttempts, error: countError } = await supabase
      .from('assessment_attempts')
      .select('attempt_number')
      .eq('assessment_id', assessmentId)
      .eq('candidate_id', candidateId)
      .order('attempt_number', { ascending: false })
      .limit(1)
    if (countError) throw countError

    const nextAttemptNumber = (existingAttempts?.[0]?.attempt_number || 0) + 1
    if (nextAttemptNumber > assessment.maximum_attempts) {
      throw new Error('Maximum attempts reached')
    }

    const expiresAt = new Date(Date.now() + assessment.duration_minutes * 60 * 1000).toISOString()

    const { data: attempt, error: attemptError } = await supabase
      .from('assessment_attempts')
      .insert({
        assessment_id: assessmentId,
        candidate_id: candidateId,
        attempt_number: nextAttemptNumber,
        status: 'IN_PROGRESS',
        started_at: new Date().toISOString(),
        expires_at: expiresAt,
      })
      .select()
      .single()
    if (attemptError) throw attemptError

    const { data: assessmentQuestions, error: aqError } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_order', { ascending: true })
    if (aqError) throw aqError

    if (assessmentQuestions && assessmentQuestions.length > 0) {
      const attemptQuestions = assessmentQuestions.map((aq: any) => ({
        attempt_id: attempt.id,
        assessment_question_id: aq.id,
        question_id: aq.question_id,
        question_order: aq.question_order,
        status: 'not_answered',
      }))
      const { error: tqError } = await supabase.from('attempt_questions').insert(attemptQuestions)
      if (tqError) throw tqError
    }

    return { assessment, attempt }
  }

  async saveAnswer(attemptId: string, input: SaveAnswerInput): Promise<AttemptAnswer> {
    const { data: existing } = await supabase
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', attemptId)
      .eq('attempt_question_id', input.attempt_question_id)
      .single()

    if (existing) {
      const { data, error } = await supabase
        .from('attempt_answers')
        .update({
          answer_text: input.answer_text ?? existing.answer_text,
          selected_options: input.selected_options ?? existing.selected_options,
          code: input.code ?? existing.code,
          language: input.language ?? existing.language,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()
      if (error) throw error
      return data
    }

    const { data, error } = await supabase
      .from('attempt_answers')
      .insert({
        attempt_id: attemptId,
        attempt_question_id: input.attempt_question_id,
        answer_text: input.answer_text || null,
        selected_options: input.selected_options || [],
        code: input.code || null,
        language: input.language || 'javascript',
      })
      .select()
      .single()
    if (error) throw error
    return data
  }

  async submitAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async autoSubmitAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({
        status: 'AUTO_SUBMITTED',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async pauseAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'PAUSED' })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error
    return data
  }

  async resumeAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const { data: attempt } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('id', attemptId)
      .single()

    if (attempt?.expires_at) {
      const newExpiry = new Date(Date.now() + 30 * 60 * 1000).toISOString()
      const { data, error } = await supabase
        .from('assessment_attempts')
        .update({ status: 'IN_PROGRESS', expires_at: newExpiry })
        .eq('id', attemptId)
        .select()
        .single()
      if (error) throw error
      return data
    }

    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'IN_PROGRESS' })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

export const assessmentService = new AssessmentService()
