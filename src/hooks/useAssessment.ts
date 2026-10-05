import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { assessmentService } from '../services/assessment.service'
import type {
  Assessment,
  CandidateAssessmentView,
  CreateAssessmentInput,
  UpdateAssessmentInput,
  AdminStats,
  SaveAnswerInput,
  StartAttemptResult,
  AssessmentStatus,
  AssessmentType,
} from '../types/assessment.types'

const ASSESSMENT_KEYS = {
  all: ['assessments'] as const,
  lists: () => [...ASSESSMENT_KEYS.all, 'list'] as const,
  list: (filters: { status?: AssessmentStatus; assessment_type?: AssessmentType; search?: string }) =>
    [...ASSESSMENT_KEYS.lists(), filters] as const,
  details: () => [...ASSESSMENT_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...ASSESSMENT_KEYS.details(), id] as const,
  candidate: (candidateId: string) => [...ASSESSMENT_KEYS.all, 'candidate', candidateId] as const,
  adminStats: () => [...ASSESSMENT_KEYS.all, 'admin-stats'] as const,
}

export function useAssessments(filters?: {
  status?: AssessmentStatus
  assessment_type?: AssessmentType
  search?: string
  limit?: number
}) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.list(filters || {}),
    queryFn: () => assessmentService.getAssessments(filters),
  })
}

export function useAssessment(id: string) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.detail(id),
    queryFn: () => assessmentService.getAssessment(id),
    enabled: !!id,
  })
}

export function useCandidateAssessments(candidateId: string) {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.candidate(candidateId),
    queryFn: () => assessmentService.getCandidateAssessments(candidateId),
    enabled: !!candidateId,
  })
}

export function useAdminStats() {
  return useQuery({
    queryKey: ASSESSMENT_KEYS.adminStats(),
    queryFn: () => assessmentService.getAdminStats(),
  })
}

export function useCreateAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateAssessmentInput) => assessmentService.createAssessment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.lists() })
    },
  })
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAssessmentInput }) =>
      assessmentService.updateAssessment(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function usePublishAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.publishAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useUnpublishAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.unpublishAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useArchiveAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.archiveAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useDuplicateAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.duplicateAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.lists() })
    },
  })
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assessmentService.deleteAssessment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.submitAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useAutoSubmitAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.autoSubmitAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function usePauseAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.pauseAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}

export function useResumeAttempt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attemptId: string) => assessmentService.resumeAttempt(attemptId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSESSMENT_KEYS.all })
    },
  })
}
