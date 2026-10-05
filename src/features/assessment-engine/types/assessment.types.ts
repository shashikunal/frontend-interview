export type AssessmentType = 'frontend' | 'machine-coding' | 'dsa' | 'core-programming'

export type AssessmentStatus = 'DRAFT' | 'READY' | 'PUBLISHED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'

export type AttemptStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'SUBMITTED'
  | 'AUTO_SUBMITTED'
  | 'EXPIRED'
  | 'TERMINATED'
  | 'EVALUATED'

export type ResultReleasePolicy = 'immediately' | 'after_submission' | 'after_manual_evaluation' | 'after_assessment_closes' | 'admin_only'

export type QuestionOrderMode = 'fixed' | 'random'

export interface Assessment {
  id: string
  title: string
  description: string
  assessment_type: AssessmentType
  instructions: string
  duration_minutes: number
  start_at: string | null
  end_at: string | null
  timezone: string
  passing_marks: number
  total_marks: number
  maximum_attempts: number
  proctoring_config_id: string | null
  status: AssessmentStatus
  question_order: QuestionOrderMode
  randomize_questions: boolean
  allow_late_start: boolean
  late_start_grace_minutes: number
  negative_marking_enabled: boolean
  negative_marks_per_wrong: number
  result_release_policy: ResultReleasePolicy
  show_score: boolean
  show_percentage: boolean
  show_pass_fail: boolean
  show_correct_answers: boolean
  show_explanations: boolean
  created_by: string | null
  updated_by: string | null
  published_by: string | null
  published_at: string | null
  archived_at: string | null
  created_at: string
  updated_at: string
}

export interface AssessmentQuestion {
  id: string
  assessment_id: string
  question_id: string
  question_version: number
  question_snapshot: Record<string, unknown>
  marks: number
  question_order: number
  assigned_by: string | null
  assigned_at: string
  created_at: string
}

export interface AssessmentCandidateAssignment {
  id: string
  assessment_id: string
  candidate_id: string
  assigned_by: string | null
  assigned_at: string
  status: string
  created_at: string
}

export interface AssessmentAttempt {
  id: string
  assessment_id: string
  candidate_id: string
  attempt_number: number
  status: AttemptStatus
  started_at: string | null
  submitted_at: string | null
  expires_at: string | null
  total_marks: number
  obtained_marks: number
  percentage: number
  result: string | null
  previous_expiry: string | null
  extension_minutes: number
  extension_reason: string | null
  extended_by: string | null
  extended_at: string | null
  created_at: string
  updated_at: string
}

export interface AttemptQuestion {
  id: string
  attempt_id: string
  assessment_question_id: string
  question_id: string
  question_order: number
  status: 'not_answered' | 'answered' | 'marked_for_review'
  marked_for_review: boolean
  first_viewed_at: string | null
  first_answered_at: string | null
  last_saved_at: string | null
  time_spent_seconds: number
  created_at: string
  updated_at: string
}

export interface AttemptAnswer {
  id: string
  attempt_id: string
  attempt_question_id: string
  answer_text: string | null
  selected_options: string[]
  code: string | null
  language: string
  test_status: string | null
  score: number
  is_correct: boolean | null
  created_at: string
  updated_at: string
}

export interface AssessmentResult {
  id: string
  attempt_id: string
  assessment_id: string
  candidate_id: string
  total_marks: number
  obtained_marks: number
  percentage: number
  result: string
  passed: boolean
  time_used_seconds: number
  evaluated_at: string | null
  released_at: string | null
  released_by: string | null
  created_at: string
}

export interface AssessmentAuditLog {
  id: string
  assessment_id: string | null
  attempt_id: string | null
  candidate_id: string | null
  actor_id: string | null
  action: string
  details: Record<string, unknown>
  created_at: string
}

export interface AssessmentQuestionAudit {
  id: string
  attempt_id: string
  attempt_question_id: string
  event_type: string
  event_data: Record<string, unknown>
  created_at: string
}

export interface CreateAssessmentInput {
  title: string
  description?: string
  assessment_type: AssessmentType
  instructions?: string
  duration_minutes: number
  start_at?: string | null
  end_at?: string | null
  timezone?: string
  passing_marks?: number
  maximum_attempts?: number
  proctoring_config_id?: string | null
  question_order?: QuestionOrderMode
  randomize_questions?: boolean
  allow_late_start?: boolean
  late_start_grace_minutes?: number
  negative_marking_enabled?: boolean
  negative_marks_per_wrong?: number
  result_release_policy?: ResultReleasePolicy
  show_score?: boolean
  show_percentage?: boolean
  show_pass_fail?: boolean
  show_correct_answers?: boolean
  show_explanations?: boolean
}

export interface UpdateAssessmentInput extends Partial<CreateAssessmentInput> {
  status?: AssessmentStatus
}

export interface AssignQuestionsInput {
  question_ids: string[]
  marks?: number
}

export interface AssignCandidatesInput {
  candidate_ids: string[]
}

export interface StartAttemptResult {
  attempt: AssessmentAttempt
  questions: AttemptQuestion[]
  answers: AttemptAnswer[]
  assessment: Assessment
}

export interface SaveAnswerInput {
  attempt_question_id: string
  answer_text?: string
  selected_options?: string[]
  code?: string
  language?: string
}

export interface SubmitAttemptResult {
  attempt: AssessmentAttempt
  result: AssessmentResult | null
}

export interface AssessmentFilters {
  status?: AssessmentStatus
  assessment_type?: AssessmentType
  search?: string
  page?: number
  limit?: number
}

export interface AssessmentListResponse {
  assessments: Assessment[]
  total: number
  page: number
  limit: number
}

export interface CandidateAssessmentView {
  assessment: Assessment
  assignment: AssessmentCandidateAssignment | null
  attempt: AssessmentAttempt | null
  result: AssessmentResult | null
  question_count: number
  answered_count: number
}

export interface AdminAssessmentStats {
  total_assessments: number
  active_assessments: number
  completed_assessments: number
  total_candidates: number
  started: number
  completed: number
  in_progress: number
  average_score: number
  pass_rate: number
  fail_rate: number
  average_completion_time_seconds: number
}

export interface QuestionAnalytics {
  question_id: string
  attempts: number
  correct: number
  wrong: number
  skipped: number
  average_score: number
  success_rate: number
  average_time_seconds: number
}

export interface TopicAnalytics {
  topic: string
  attempts: number
  average_score: number
  accuracy: number
}

export interface CandidatePerformance {
  candidate_id: string
  candidate_name: string
  assessments: number
  attempts: number
  average_score: number
  best_score: number
  completion_rate: number
}
