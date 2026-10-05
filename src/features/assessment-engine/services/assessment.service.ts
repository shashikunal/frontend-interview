import { supabase } from '../../../lib/supabase/client'
import type {
  Assessment,
  AssessmentQuestion,
  AssessmentCandidateAssignment,
  AssessmentAttempt,
  AttemptQuestion,
  AttemptAnswer,
  AssessmentResult,
  AssessmentAuditLog,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  AssignQuestionsInput,
  AssignCandidatesInput,
  StartAttemptResult,
  SaveAnswerInput,
  SubmitAttemptResult,
  AssessmentFilters,
  AssessmentListResponse,
  CandidateAssessmentView,
  AdminAssessmentStats,
  AttemptStatus,
  AssessmentStatus,
} from '../types/assessment.types'

function nowUtc(): string {
  return new Date().toISOString()
}

function generateId(): string {
  return crypto.randomUUID()
}

export const assessmentService = {
  async list(filters: AssessmentFilters = {}): Promise<AssessmentListResponse> {
    const { status, assessment_type, search, page = 1, limit = 20 } = filters
    let query = supabase.from('assessments').select('*', { count: 'exact' })

    if (status) query = query.eq('status', status)
    if (assessment_type) query = query.eq('assessment_type', assessment_type)
    if (search) query = query.ilike('title', `%${search}%`)

    const from = (page - 1) * limit
    query = query.order('created_at', { ascending: false }).range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) throw error

    return {
      assessments: (data as Assessment[]) || [],
      total: count || 0,
      page,
      limit,
    }
  },

  async getById(id: string): Promise<Assessment | null> {
    const { data, error } = await supabase.from('assessments').select('*').eq('id', id).single()
    if (error) throw error
    return data as Assessment | null
  },

  async create(input: CreateAssessmentInput): Promise<Assessment> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const id = generateId()
    const record = {
      id,
      title: input.title,
      description: input.description || '',
      assessment_type: input.assessment_type,
      instructions: input.instructions || '',
      duration_minutes: input.duration_minutes,
      start_at: input.start_at || null,
      end_at: input.end_at || null,
      timezone: input.timezone || 'UTC',
      passing_marks: input.passing_marks || 0,
      total_marks: 0,
      maximum_attempts: input.maximum_attempts || 1,
      proctoring_config_id: input.proctoring_config_id || null,
      status: 'DRAFT' as AssessmentStatus,
      question_order: input.question_order || 'fixed',
      randomize_questions: input.randomize_questions || false,
      allow_late_start: input.allow_late_start || false,
      late_start_grace_minutes: input.late_start_grace_minutes || 0,
      negative_marking_enabled: input.negative_marking_enabled || false,
      negative_marks_per_wrong: input.negative_marks_per_wrong || 0,
      result_release_policy: input.result_release_policy || 'after_submission',
      show_score: input.show_score ?? true,
      show_percentage: input.show_percentage ?? true,
      show_pass_fail: input.show_pass_fail ?? true,
      show_correct_answers: input.show_correct_answers || false,
      show_explanations: input.show_explanations || false,
      created_by: user.id,
      updated_by: user.id,
    }

    const { data, error } = await supabase.from('assessments').insert(record).select().single()
    if (error) throw error

    await this.logAudit(id, null, null, 'CREATE', { title: input.title, type: input.assessment_type })

    return data as Assessment
  },

  async update(id: string, input: UpdateAssessmentInput): Promise<Assessment> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const updates: Record<string, unknown> = { ...input, updated_by: user.id, updated_at: nowUtc() }
    delete updates.id
    delete updates.created_by
    delete updates.created_at

    const { data, error } = await supabase.from('assessments').update(updates).eq('id', id).select().single()
    if (error) throw error

    await this.logAudit(id, null, null, 'UPDATE', { fields: Object.keys(input) })

    return data as Assessment
  },

  async publish(id: string): Promise<Assessment> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const assessment = await this.getById(id)
    if (!assessment) throw new Error('Assessment not found')
    if (assessment.status !== 'DRAFT' && assessment.status !== 'READY') {
      throw new Error(`Cannot publish assessment in status ${assessment.status}`)
    }

    const { data, error } = await supabase
      .from('assessments')
      .update({ status: 'PUBLISHED', published_by: user.id, published_at: nowUtc(), updated_by: user.id, updated_at: nowUtc() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(id, null, null, 'PUBLISH', {})

    return data as Assessment
  },

  async unpublish(id: string): Promise<Assessment> {
    const assessment = await this.getById(id)
    if (!assessment) throw new Error('Assessment not found')
    if (assessment.status !== 'PUBLISHED' && assessment.status !== 'ACTIVE') {
      throw new Error(`Cannot unpublish assessment in status ${assessment.status}`)
    }

    const { data, error } = await supabase
      .from('assessments')
      .update({ status: 'READY', updated_by: assessment.updated_by, updated_at: nowUtc() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(id, null, null, 'UNPUBLISH', {})

    return data as Assessment
  },

  async archive(id: string): Promise<Assessment> {
    const { data, error } = await supabase
      .from('assessments')
      .update({ status: 'ARCHIVED', archived_at: nowUtc(), updated_at: nowUtc() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(id, null, null, 'ARCHIVE', {})

    return data as Assessment
  },

  async duplicate(id: string): Promise<Assessment> {
    const source = await this.getById(id)
    if (!source) throw new Error('Assessment not found')

    const newId = generateId()
    const duplicate = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      status: 'DRAFT' as AssessmentStatus,
      published_by: null,
      published_at: null,
      archived_at: null,
      created_at: nowUtc(),
      updated_at: nowUtc(),
    }
    delete (duplicate as Record<string, unknown>).created_by
    delete (duplicate as Record<string, unknown>).updated_by

    const { data: { user } } = await supabase.auth.getUser()
    duplicate.created_by = user?.id || null
    duplicate.updated_by = user?.id || null

    const { data, error } = await supabase.from('assessments').insert(duplicate).select().single()
    if (error) throw error

    const questions = await this.getQuestions(id)
    if (questions.length > 0) {
      const newQuestions = questions.map((q) => ({
        id: generateId(),
        assessment_id: newId,
        question_id: q.question_id,
        question_version: q.question_version,
        question_snapshot: q.question_snapshot,
        marks: q.marks,
        question_order: q.question_order,
        assigned_by: user?.id || null,
        assigned_at: nowUtc(),
      }))
      await supabase.from('assessment_questions').insert(newQuestions)
    }

    await this.logAudit(newId, null, null, 'DUPLICATE', { source_assessment_id: id })

    return data as Assessment
  },

  async delete(id: string): Promise<void> {
    const attempts = await this.getAttempts(id)
    const activeAttempts = attempts.filter((a) => a.status === 'IN_PROGRESS' || a.status === 'PAUSED')
    if (activeAttempts.length > 0) {
      throw new Error('Cannot delete assessment with active attempts')
    }

    const { error } = await supabase.from('assessments').delete().eq('id', id)
    if (error) throw error

    await this.logAudit(id, null, null, 'DELETE', {})
  },

  async getQuestions(assessmentId: string): Promise<AssessmentQuestion[]> {
    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('question_order', { ascending: true })
    if (error) throw error
    return (data as AssessmentQuestion[]) || []
  },

  async assignQuestions(assessmentId: string, input: AssignQuestionsInput): Promise<AssessmentQuestion[]> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const existing = await this.getQuestions(assessmentId)
    const existingIds = new Set(existing.map((q) => q.question_id))

    const newQuestions: AssessmentQuestion[] = []
    for (const qid of input.question_ids) {
      if (existingIds.has(qid)) continue

      const { data: questionData, error: qError } = await supabase
        .from('frontend_js_questions')
        .select('*')
        .eq('id', qid)
        .single()

      if (qError || !questionData) continue

      const order = existing.length + newQuestions.length
      newQuestions.push({
        id: generateId(),
        assessment_id: assessmentId,
        question_id: qid,
        question_version: 1,
        question_snapshot: questionData as unknown as Record<string, unknown>,
        marks: input.marks || 1,
        question_order: order,
        assigned_by: user.id,
        assigned_at: nowUtc(),
        created_at: nowUtc(),
      })
    }

    if (newQuestions.length > 0) {
      const { error } = await supabase.from('assessment_questions').insert(newQuestions)
      if (error) throw error
    }

    await this.recalculateTotalMarks(assessmentId)
    await this.logAudit(assessmentId, null, null, 'ASSIGN_QUESTIONS', { count: newQuestions.length, question_ids: input.question_ids })

    return this.getQuestions(assessmentId)
  },

  async removeQuestion(assessmentId: string, questionId: string): Promise<void> {
    const { error } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('assessment_id', assessmentId)
      .eq('question_id', questionId)
    if (error) throw error

    await this.recalculateTotalMarks(assessmentId)
    await this.logAudit(assessmentId, null, null, 'REMOVE_QUESTION', { question_id: questionId })
  },

  async updateQuestionMarks(assessmentId: string, questionId: string, marks: number): Promise<void> {
    const { error } = await supabase
      .from('assessment_questions')
      .update({ marks })
      .eq('assessment_id', assessmentId)
      .eq('question_id', questionId)
    if (error) throw error

    await this.recalculateTotalMarks(assessmentId)
    await this.logAudit(assessmentId, null, null, 'UPDATE_QUESTION_MARKS', { question_id: questionId, marks })
  },

  async reorderQuestions(assessmentId: string, questionIds: string[]): Promise<void> {
    for (let i = 0; i < questionIds.length; i++) {
      await supabase
        .from('assessment_questions')
        .update({ question_order: i })
        .eq('assessment_id', assessmentId)
        .eq('question_id', questionIds[i])
    }

    await this.logAudit(assessmentId, null, null, 'REORDER_QUESTIONS', { order: questionIds })
  },

  async recalculateTotalMarks(assessmentId: string): Promise<void> {
    const questions = await this.getQuestions(assessmentId)
    const total = questions.reduce((sum, q) => sum + (q.marks || 0), 0)

    await supabase
      .from('assessments')
      .update({ total_marks: total, updated_at: nowUtc() })
      .eq('id', assessmentId)
  },

  async getCandidateAssignments(assessmentId: string): Promise<AssessmentCandidateAssignment[]> {
    const { data, error } = await supabase
      .from('assessment_candidate_assignments')
      .select('*')
      .eq('assessment_id', assessmentId)
    if (error) throw error
    return (data as AssessmentCandidateAssignment[]) || []
  },

  async assignCandidates(assessmentId: string, input: AssignCandidatesInput): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const existing = await this.getCandidateAssignments(assessmentId)
    const existingIds = new Set(existing.map((a) => a.candidate_id))

    const newAssignments = input.candidate_ids
      .filter((cid) => !existingIds.has(cid))
      .map((cid) => ({
        id: generateId(),
        assessment_id: assessmentId,
        candidate_id: cid,
        assigned_by: user.id,
        assigned_at: nowUtc(),
        status: 'assigned',
      }))

    if (newAssignments.length > 0) {
      const { error } = await supabase.from('assessment_candidate_assignments').insert(newAssignments)
      if (error) throw error
    }

    await this.logAudit(assessmentId, null, null, 'ASSIGN_CANDIDATES', { count: newAssignments.length, candidate_ids: input.candidate_ids })
  },

  async removeCandidateAssignment(assessmentId: string, candidateId: string): Promise<void> {
    const { error } = await supabase
      .from('assessment_candidate_assignments')
      .delete()
      .eq('assessment_id', assessmentId)
      .eq('candidate_id', candidateId)
    if (error) throw error

    await this.logAudit(assessmentId, null, candidateId, 'REMOVE_CANDIDATE', {})
  },

  async getAttempts(assessmentId: string): Promise<AssessmentAttempt[]> {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('attempt_number', { ascending: true })
    if (error) throw error
    return (data as AssessmentAttempt[]) || []
  },

  async getCandidateAttempts(assessmentId: string, candidateId: string): Promise<AssessmentAttempt[]> {
    const { data, error } = await supabase
      .from('assessment_attempts')
      .select('*')
      .eq('assessment_id', assessmentId)
      .eq('candidate_id', candidateId)
      .order('attempt_number', { ascending: true })
    if (error) throw error
    return (data as AssessmentAttempt[]) || []
  },

  async getAttemptById(attemptId: string): Promise<AssessmentAttempt | null> {
    const { data, error } = await supabase.from('assessment_attempts').select('*').eq('id', attemptId).single()
    if (error) throw error
    return data as AssessmentAttempt | null
  },

  async startAttempt(assessmentId: string): Promise<StartAttemptResult> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const assessment = await this.getById(assessmentId)
    if (!assessment) throw new Error('Assessment not found')
    if (assessment.status !== 'PUBLISHED' && assessment.status !== 'ACTIVE') {
      throw new Error(`Assessment is not available (status: ${assessment.status})`)
    }

    const assignment = await supabase
      .from('assessment_candidate_assignments')
      .select('*')
      .eq('assessment_id', assessmentId)
      .eq('candidate_id', user.id)
      .single()

    if (assignment.error && assignment.error.code !== 'PGRST116') {
      throw assignment.error
    }

    const serverNow = new Date()
    if (assessment.start_at) {
      const startDate = new Date(assessment.start_at)
      if (serverNow < startDate) throw new Error('Assessment has not started yet')
    }
    if (assessment.end_at) {
      const endDate = new Date(assessment.end_at)
      if (serverNow > endDate) {
        if (!assessment.allow_late_start) throw new Error('Assessment has expired')
        const graceEnd = new Date(endDate.getTime() + assessment.late_start_grace_minutes * 60000)
        if (serverNow > graceEnd) throw new Error('Assessment has expired')
      }
    }

    const existingAttempts = await this.getCandidateAttempts(assessmentId, user.id)
    const activeAttempt = existingAttempts.find((a) => a.status === 'IN_PROGRESS' || a.status === 'PAUSED')
    if (activeAttempt) {
      const attemptQuestions = await this.getAttemptQuestions(activeAttempt.id)
      const answers = await this.getAttemptAnswers(activeAttempt.id)
      return { attempt: activeAttempt, questions: attemptQuestions, answers, assessment }
    }

    const completedAttempts = existingAttempts.filter((a) =>
      a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED' || a.status === 'EVALUATED'
    )
    if (completedAttempts.length >= assessment.maximum_attempts) {
      throw new Error(`Maximum attempts (${assessment.maximum_attempts}) reached`)
    }

    const attemptNumber = existingAttempts.length + 1
    const startedAt = nowUtc()
    const expiresAt = new Date(Date.now() + assessment.duration_minutes * 60000).toISOString()

    const attemptId = generateId()
    const attemptRecord = {
      id: attemptId,
      assessment_id: assessmentId,
      candidate_id: user.id,
      attempt_number: attemptNumber,
      status: 'IN_PROGRESS' as AttemptStatus,
      started_at: startedAt,
      expires_at: expiresAt,
      total_marks: assessment.total_marks,
      obtained_marks: 0,
      percentage: 0,
      result: null,
    }

    const { error: insertError } = await supabase.from('assessment_attempts').insert(attemptRecord)
    if (insertError) {
      if (insertError.code === '23505') {
        const existing = await this.getCandidateAttempts(assessmentId, user.id)
        const active = existing.find((a) => a.status === 'IN_PROGRESS' || a.status === 'PAUSED')
        if (active) {
          const aq = await this.getAttemptQuestions(active.id)
          const aa = await this.getAttemptAnswers(active.id)
          return { attempt: active, questions: aq, answers: aa, assessment }
        }
      }
      throw insertError
    }

    const assessmentQuestions = await this.getQuestions(assessmentId)
    const shuffled = assessment.randomize_questions
      ? [...assessmentQuestions].sort(() => Math.random() - 0.5)
      : assessmentQuestions

    const attemptQuestions: AttemptQuestion[] = shuffled.map((aq, idx) => ({
      id: generateId(),
      attempt_id: attemptId,
      assessment_question_id: aq.id,
      question_id: aq.question_id,
      question_order: idx,
      status: 'not_answered' as const,
      marked_for_review: false,
      first_viewed_at: null,
      first_answered_at: null,
      last_saved_at: null,
      time_spent_seconds: 0,
      created_at: nowUtc(),
      updated_at: nowUtc(),
    }))

    if (attemptQuestions.length > 0) {
      const { error: aqError } = await supabase.from('attempt_questions').insert(attemptQuestions)
      if (aqError) throw aqError
    }

    await this.logAudit(assessmentId, attemptId, user.id, 'START_ATTEMPT', { attempt_number: attemptNumber })

    const attempt = { ...attemptRecord, created_at: nowUtc(), updated_at: nowUtc() } as AssessmentAttempt
    return { attempt, questions: attemptQuestions, answers: [], assessment }
  },

  async getAttemptQuestions(attemptId: string): Promise<AttemptQuestion[]> {
    const { data, error } = await supabase
      .from('attempt_questions')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('question_order', { ascending: true })
    if (error) throw error
    return (data as AttemptQuestion[]) || []
  },

  async getAttemptAnswers(attemptId: string): Promise<AttemptAnswer[]> {
    const { data, error } = await supabase
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', attemptId)
    if (error) throw error
    return (data as AttemptAnswer[]) || []
  },

  async saveAnswer(attemptId: string, input: SaveAnswerInput): Promise<AttemptAnswer> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')
    if (attempt.candidate_id !== user.id) throw new Error('Unauthorized')
    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      throw new Error(`Cannot save answer in status ${attempt.status}`)
    }

    const { data: attemptQuestion, error: aqError } = await supabase
      .from('attempt_questions')
      .select('*')
      .eq('id', input.attempt_question_id)
      .eq('attempt_id', attemptId)
      .single()
    if (aqError || !attemptQuestion) throw new Error('Attempt question not found')

    const now = nowUtc()
    const updates: Record<string, unknown> = {
      last_saved_at: now,
      updated_at: now,
    }

    if (!attemptQuestion.first_answered_at) {
      updates.first_answered_at = now
    }
    if (attemptQuestion.status === 'not_answered') {
      updates.status = 'answered'
    }

    await supabase.from('attempt_questions').update(updates).eq('id', input.attempt_question_id)

    const existingAnswer = await supabase
      .from('attempt_answers')
      .select('*')
      .eq('attempt_id', attemptId)
      .eq('attempt_question_id', input.attempt_question_id)
      .single()

    let answer: AttemptAnswer
    if (existingAnswer.data) {
      const { data, error } = await supabase
        .from('attempt_answers')
        .update({
          answer_text: input.answer_text ?? existingAnswer.data.answer_text,
          selected_options: input.selected_options ?? existingAnswer.data.selected_options,
          code: input.code ?? existingAnswer.data.code,
          language: input.language ?? existingAnswer.data.language,
          updated_at: now,
        })
        .eq('id', existingAnswer.data.id)
        .select()
        .single()
      if (error) throw error
      answer = data as AttemptAnswer
    } else {
      const id = generateId()
      const { data, error } = await supabase
        .from('attempt_answers')
        .insert({
          id,
          attempt_id: attemptId,
          attempt_question_id: input.attempt_question_id,
          answer_text: input.answer_text || null,
          selected_options: input.selected_options || [],
          code: input.code || null,
          language: input.language || 'javascript',
          created_at: now,
          updated_at: now,
        })
        .select()
        .single()
      if (error) throw error
      answer = data as AttemptAnswer
    }

    await this.logQuestionEvent(attemptId, input.attempt_question_id, 'ANSWER_SAVED', {})

    return answer
  },

  async markForReview(attemptId: string, attemptQuestionId: string, marked: boolean): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    await supabase
      .from('attempt_questions')
      .update({ marked_for_review: marked, updated_at: nowUtc() })
      .eq('id', attemptQuestionId)
      .eq('attempt_id', attemptId)

    await this.logQuestionEvent(attemptId, attemptQuestionId, marked ? 'MARK_REVIEW' : 'UNMARK_REVIEW', {})
  },

  async recordQuestionView(attemptId: string, attemptQuestionId: string): Promise<void> {
    const { data: existing } = await supabase
      .from('attempt_questions')
      .select('first_viewed_at')
      .eq('id', attemptQuestionId)
      .single()

    if (existing && !existing.first_viewed_at) {
      await supabase
        .from('attempt_questions')
        .update({ first_viewed_at: nowUtc() })
        .eq('id', attemptQuestionId)
    }

    await this.logQuestionEvent(attemptId, attemptQuestionId, 'QUESTION_VIEWED', {})
  },

  async submitAttempt(attemptId: string): Promise<SubmitAttemptResult> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')
    if (attempt.candidate_id !== user.id) throw new Error('Unauthorized')
    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      throw new Error(`Cannot submit attempt in status ${attempt.status}`)
    }

    const now = nowUtc()
    const { data: updatedAttempt, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'SUBMITTED', submitted_at: now, updated_at: now })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, user.id, 'SUBMIT_ATTEMPT', {})

    const result = await this.evaluateAttempt(attemptId)

    return { attempt: updatedAttempt as AssessmentAttempt, result }
  },

  async autoSubmitAttempt(attemptId: string): Promise<SubmitAttemptResult> {
    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')
    if (attempt.status !== 'IN_PROGRESS' && attempt.status !== 'PAUSED') {
      return { attempt, result: null }
    }

    const now = nowUtc()
    const { data: updatedAttempt, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'AUTO_SUBMITTED', submitted_at: now, updated_at: now })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, attempt.candidate_id, 'AUTO_SUBMIT', {})

    const result = await this.evaluateAttempt(attemptId)

    return { attempt: updatedAttempt as AssessmentAttempt, result }
  },

  async evaluateAttempt(attemptId: string): Promise<AssessmentResult | null> {
    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) return null

    const assessment = await this.getById(attempt.assessment_id)
    if (!assessment) return null

    const answers = await this.getAttemptAnswers(attemptId)
    const attemptQuestions = await this.getAttemptQuestions(attemptId)
    const assessmentQuestions = await this.getQuestions(assessment.id)

    let totalObtained = 0
    let totalPossible = 0

    for (const aq of assessmentQuestions) {
      totalPossible += aq.marks || 0
      const attemptQ = attemptQuestions.find((tq) => tq.assessment_question_id === aq.id)
      const answer = answers.find((a) => a.attempt_question_id === attemptQ?.id)

      if (answer && answer.score) {
        totalObtained += answer.score
      }
    }

    if (assessment.negative_marking_enabled && assessment.negative_marks_per_wrong > 0) {
      const wrongAnswers = answers.filter((a) => a.is_correct === false)
      totalObtained -= wrongAnswers.length * assessment.negative_marks_per_wrong
      totalObtained = Math.max(0, totalObtained)
    }

    const percentage = totalPossible > 0 ? Math.round((totalObtained / totalPossible) * 10000) / 100 : 0
    const passed = totalObtained >= assessment.passing_marks
    const result = passed ? 'PASS' : 'FAIL'

    const timeUsed = attempt.started_at
      ? Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)
      : 0

    const existingResult = await supabase
      .from('assessment_results')
      .select('*')
      .eq('attempt_id', attemptId)
      .single()

    let assessmentResult: AssessmentResult
    if (existingResult.data) {
      const { data, error } = await supabase
        .from('assessment_results')
        .update({
          total_marks: totalPossible,
          obtained_marks: totalObtained,
          percentage,
          result,
          passed,
          time_used_seconds: timeUsed,
          evaluated_at: nowUtc(),
        })
        .eq('attempt_id', attemptId)
        .select()
        .single()
      if (error) throw error
      assessmentResult = data as AssessmentResult
    } else {
      const id = generateId()
      const { data, error } = await supabase
        .from('assessment_results')
        .insert({
          id,
          attempt_id: attemptId,
          assessment_id: assessment.id,
          candidate_id: attempt.candidate_id,
          total_marks: totalPossible,
          obtained_marks: totalObtained,
          percentage,
          result,
          passed,
          time_used_seconds: timeUsed,
          evaluated_at: nowUtc(),
          released_at: assessment.result_release_policy === 'immediately' ? nowUtc() : null,
        })
        .select()
        .single()
      if (error) throw error
      assessmentResult = data as AssessmentResult
    }

    await supabase
      .from('assessment_attempts')
      .update({ obtained_marks: totalObtained, percentage, result, status: 'EVALUATED', updated_at: nowUtc() })
      .eq('id', attemptId)

    await this.logAudit(assessment.id, attemptId, attempt.candidate_id, 'EVALUATE', { score: totalObtained, result })

    return assessmentResult
  },

  async getResult(attemptId: string): Promise<AssessmentResult | null> {
    const { data, error } = await supabase
      .from('assessment_results')
      .select('*')
      .eq('attempt_id', attemptId)
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data as AssessmentResult | null
  },

  async getCandidateAssessments(candidateId: string): Promise<CandidateAssessmentView[]> {
    const { data: assignments, error } = await supabase
      .from('assessment_candidate_assignments')
      .select('*, assessments(*)')
      .eq('candidate_id', candidateId)
    if (error) throw error

    const views: CandidateAssessmentView[] = []
    for (const row of assignments as Array<AssessmentCandidateAssignment & { assessments: Assessment }>) {
      const assessment = row.assessments
      if (!assessment) continue

      const attempts = await this.getCandidateAttempts(assessment.id, candidateId)
      const latestAttempt = attempts.length > 0 ? attempts[attempts.length - 1] : null
      const result = latestAttempt ? await this.getResult(latestAttempt.id) : null
      const questions = await this.getQuestions(assessment.id)

      let answeredCount = 0
      if (latestAttempt) {
        const attemptQuestions = await this.getAttemptQuestions(latestAttempt.id)
        answeredCount = attemptQuestions.filter((q) => q.status === 'answered').length
      }

      views.push({
        assessment,
        assignment: row,
        attempt: latestAttempt,
        result,
        question_count: questions.length,
        answered_count: answeredCount,
      })
    }

    return views
  },

  async getAdminStats(): Promise<AdminAssessmentStats> {
    const { data: assessments, error } = await supabase.from('assessments').select('*')
    if (error) throw error

    const allAssessments = assessments as Assessment[]

    const { data: attempts, error: attError } = await supabase.from('assessment_attempts').select('*')
    if (attError) throw attError

    const allAttempts = attempts as AssessmentAttempt[]

    const { data: results, error: resError } = await supabase.from('assessment_results').select('*')
    if (resError) throw resError

    const allResults = results as AssessmentResult[]

    const started = allAttempts.filter((a) => a.status !== 'NOT_STARTED').length
    const completed = allAttempts.filter((a) =>
      a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED' || a.status === 'EVALUATED'
    ).length
    const inProgress = allAttempts.filter((a) => a.status === 'IN_PROGRESS' || a.status === 'PAUSED').length

    const evaluatedResults = allResults.filter((r) => r.evaluated_at)
    const averageScore = evaluatedResults.length > 0
      ? Math.round(evaluatedResults.reduce((sum, r) => sum + r.percentage, 0) / evaluatedResults.length * 100) / 100
      : 0

    const passed = evaluatedResults.filter((r) => r.passed).length
    const passRate = evaluatedResults.length > 0 ? Math.round((passed / evaluatedResults.length) * 10000) / 100 : 0
    const failRate = 100 - passRate

    const completionTimes = evaluatedResults
      .filter((r) => r.time_used_seconds > 0)
      .map((r) => r.time_used_seconds)
    const avgCompletionTime = completionTimes.length > 0
      ? Math.round(completionTimes.reduce((sum, t) => sum + t, 0) / completionTimes.length)
      : 0

    return {
      total_assessments: allAssessments.length,
      active_assessments: allAssessments.filter((a) => a.status === 'PUBLISHED' || a.status === 'ACTIVE').length,
      completed_assessments: allAssessments.filter((a) => a.status === 'COMPLETED').length,
      total_candidates: new Set(allAttempts.map((a) => a.candidate_id)).size,
      started,
      completed,
      in_progress: inProgress,
      average_score: averageScore,
      pass_rate: passRate,
      fail_rate: failRate,
      average_completion_time_seconds: avgCompletionTime,
    }
  },

  async extendAttemptTime(attemptId: string, minutes: number, reason: string): Promise<AssessmentAttempt> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')

    const previousExpiry = attempt.expires_at
    const baseTime = previousExpiry && new Date(previousExpiry) > new Date()
      ? new Date(previousExpiry)
      : new Date()
    const newExpiry = new Date(baseTime.getTime() + minutes * 60000).toISOString()

    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({
        expires_at: newExpiry,
        previous_expiry: previousExpiry,
        extension_minutes: (attempt.extension_minutes || 0) + minutes,
        extension_reason: reason,
        extended_by: user.id,
        extended_at: nowUtc(),
        updated_at: nowUtc(),
      })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, attempt.candidate_id, 'EXTEND_TIME', {
      minutes,
      reason,
      previous_expiry: previousExpiry,
      new_expiry: newExpiry,
    })

    return data as AssessmentAttempt
  },

  async pauseAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')
    if (attempt.candidate_id !== user.id) throw new Error('Unauthorized')
    if (attempt.status !== 'IN_PROGRESS') throw new Error('Can only pause an in-progress attempt')

    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'PAUSED', updated_at: nowUtc() })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, user.id, 'PAUSE_ATTEMPT', {})

    return data as AssessmentAttempt
  },

  async resumeAttempt(attemptId: string): Promise<AssessmentAttempt> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')
    if (attempt.candidate_id !== user.id) throw new Error('Unauthorized')
    if (attempt.status !== 'PAUSED') throw new Error('Can only resume a paused attempt')

    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'IN_PROGRESS', updated_at: nowUtc() })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, user.id, 'RESUME_ATTEMPT', {})

    return data as AssessmentAttempt
  },

  async terminateAttempt(attemptId: string, reason: string): Promise<AssessmentAttempt> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')

    const { data, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'TERMINATED', submitted_at: nowUtc(), updated_at: nowUtc() })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, attempt.candidate_id, 'TERMINATE_ATTEMPT', { reason })

    return data as AssessmentAttempt
  },

  async forceSubmit(attemptId: string): Promise<SubmitAttemptResult> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const attempt = await this.getAttemptById(attemptId)
    if (!attempt) throw new Error('Attempt not found')

    const now = nowUtc()
    const { data: updatedAttempt, error } = await supabase
      .from('assessment_attempts')
      .update({ status: 'SUBMITTED', submitted_at: now, updated_at: now })
      .eq('id', attemptId)
      .select()
      .single()
    if (error) throw error

    await this.logAudit(attempt.assessment_id, attemptId, attempt.candidate_id, 'FORCE_SUBMIT', {})

    const result = await this.evaluateAttempt(attemptId)

    return { attempt: updatedAttempt as AssessmentAttempt, result }
  },

  async releaseResult(attemptId: string): Promise<AssessmentResult | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Authentication required')

    const { data, error } = await supabase
      .from('assessment_results')
      .update({ released_at: nowUtc(), released_by: user.id })
      .eq('attempt_id', attemptId)
      .select()
      .single()
    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as AssessmentResult
  },

  async getAuditLogs(assessmentId: string): Promise<AssessmentAuditLog[]> {
    const { data, error } = await supabase
      .from('assessment_audit_logs')
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as AssessmentAuditLog[]) || []
  },

  async getQuestionAudit(attemptId: string): Promise<Record<string, unknown>[]> {
    const { data, error } = await supabase
      .from('assessment_question_audit')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data || []
  },

  async logAudit(
    assessmentId: string,
    attemptId: string | null,
    candidateId: string | null,
    action: string,
    details: Record<string, unknown>,
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('assessment_audit_logs').insert({
      id: generateId(),
      assessment_id: assessmentId,
      attempt_id: attemptId,
      candidate_id: candidateId,
      actor_id: user?.id || null,
      action,
      details,
      created_at: nowUtc(),
    })
  },

  async logQuestionEvent(
    attemptId: string,
    attemptQuestionId: string,
    eventType: string,
    eventData: Record<string, unknown>,
  ): Promise<void> {
    await supabase.from('assessment_question_audit').insert({
      id: generateId(),
      attempt_id: attemptId,
      attempt_question_id: attemptQuestionId,
      event_type: eventType,
      event_data: eventData,
      created_at: nowUtc(),
    })
  },
}
