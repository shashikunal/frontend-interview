import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentService } from '../services/assessment.service'
import type {
  Assessment,
  AssessmentFilters,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  AssignQuestionsInput,
  AssignCandidatesInput,
  SaveAnswerInput,
  CandidateAssessmentView,
  AdminAssessmentStats,
  StartAttemptResult,
  SubmitAttemptResult,
} from '../types/assessment.types'

const ASSESSMENT_KEYS = {
  all: ['assessments'] as const,
  list: (filters: AssessmentFilters) => ['assessments', 'list', filters] as const,
  detail: (id: string) => ['assessments', 'detail', id] as const,
  questions: (id: string) => ['assessments', 'questions', id] as const,
  attempts: (id: string) => ['assessments', 'attempts', id] as const,
  candidateAttempts: (assessmentId: string, candidateId: string) => ['assessments', 'candidate-attempts', assessmentId, candidateId] as const,
  candidateAssessments: (candidateId: string) => ['assessments', 'candidate', candidateId] as const,
  adminStats: ['assessments', 'admin-stats'] as const,
  auditLogs: (id: string) => ['assessments', 'audit', id] as const,
}

export function useAssessments(filters: AssessmentFilters = {}) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.list(filters),
    queryFn: () => assessmentService.list(filters),
  })
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.detail(id),
    queryFn: () => assessmentService.getById(id),
    enabled: !!id,
  })
}

export function useCreateAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAssessmentInput) => assessmentService.create(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useUpdateAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAssessmentInput }) => assessmentService.update(id, input),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function usePublishAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.publish(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useUnpublishAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.unpublish(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useArchiveAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.archive(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.detail(id) })
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useDuplicateAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.duplicate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useDeleteAssessment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useAssessmentQuestions(assessmentId: string) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.questions(assessmentId),
    queryFn: () => assessmentService.getQuestions(assessmentId),
    enabled: !!assessmentId,
  })
}

export function useAssignQuestions() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ assessmentId, input }: { assessmentId: string; input: AssignQuestionsInput }) =>
      assessmentService.assignQuestions(assessmentId, input),
    onSuccess: (_, { assessmentId }) => {
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.questions(assessmentId) })
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.detail(assessmentId) })
    },
  })
}

export function useAssignCandidates() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ assessmentId, input }: { assessmentId: string; input: AssignCandidatesInput }) =>
      assessmentService.assignCandidates(assessmentId, input),
    onSuccess: (_, { assessmentId }) => {
      qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.detail(assessmentId) })
    },
  })
}

export function useStartAttempt() {
  return useMutation({
    mutationFn: (assessmentId: string) => assessmentService.startAttempt(assessmentId),
  })
}

export function useSaveAnswer() {
  return useMutation({
    mutationFn: ({ attemptId, input }: { attemptId: string; input: SaveAnswerInput }) =>
      assessmentService.saveAnswer(attemptId, input),
  })
}

export function useSubmitAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.submitAttempt(attemptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useAutoSubmitAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.autoSubmitAttempt(attemptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useCandidateAssessments(candidateId: string) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.candidateAssessments(candidateId),
    queryFn: () => assessmentService.getCandidateAssessments(candidateId),
    enabled: !!candidateId,
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.adminStats,
    queryFn: () => assessmentService.getAdminStats(),
  })
}

export function useExtendAttemptTime() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ attemptId, minutes, reason }: { attemptId: string; minutes: number; reason: string }) =>
      assessmentService.extendAttemptTime(attemptId, minutes, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function usePauseAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.pauseAttempt(attemptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useResumeAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.resumeAttempt(attemptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useTerminateAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ attemptId, reason }: { attemptId: string; reason: string }) =>
      assessmentService.terminateAttempt(attemptId, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useForceSubmit() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.forceSubmit(attemptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useReleaseResult() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.releaseResult(attemptId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all }),
  })
}

export function useAuditLogs(assessmentId: string) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.auditLogs(assessmentId),
    queryFn: () => assessmentService.getAuditLogs(assessmentId),
    enabled: !!assessmentId,
  })
}
