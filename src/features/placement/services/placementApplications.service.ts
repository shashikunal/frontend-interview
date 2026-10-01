import { supabase } from '../../../lib/supabase/client'
import type {
  PlacementInterviewFeedback,
  PlacementJobApplication,
  PlacementMockInterview,
  PlacementMockResult,
  PlacementProject,
  PlacementProjectReview,
} from '../types/placement.types'
import { generateLocalId, nowIso, readLocal, snakeToCamelRow, writeLocal } from './placementStorage'

function mapApplication(row: Record<string, unknown>): PlacementJobApplication {
  const c = snakeToCamelRow<Record<string, unknown>>(row)
  return {
    id: String(c.id),
    userId: String(c.userId),
    company: String(c.company ?? ''),
    role: String(c.role ?? ''),
    location: String(c.location ?? ''),
    jobUrl: String(c.jobUrl ?? ''),
    source: String(c.source ?? ''),
    appliedAt: (c.appliedAt as string | null) ?? null,
    status: c.status as PlacementJobApplication['status'],
    interviewDate: (c.interviewDate as string | null) ?? null,
    currentRound: String(c.currentRound ?? ''),
    salaryRange: String(c.salaryRange ?? ''),
    notes: String(c.notes ?? ''),
    createdAt: String(c.createdAt ?? nowIso()),
    updatedAt: String(c.updatedAt ?? nowIso()),
  }
}

function mapFeedback(row: Record<string, unknown>): PlacementInterviewFeedback {
  const c = snakeToCamelRow<Record<string, unknown>>(row)
  return {
    id: String(c.id),
    userId: String(c.userId),
    applicationId: (c.applicationId as string | null) ?? null,
    mockId: (c.mockId as string | null) ?? null,
    company: String(c.company ?? ''),
    role: String(c.role ?? ''),
    round: String(c.round ?? ''),
    interviewDate: (c.interviewDate as string | null) ?? null,
    questionsAsked: (c.questionsAsked as string[]) ?? [],
    questionsFailed: (c.questionsFailed as string[]) ?? [],
    questionsPassed: (c.questionsPassed as string[]) ?? [],
    areaResults: (c.areaResults as Record<string, 'pass' | 'fail' | 'partial'>) ?? {},
    result: c.result as PlacementInterviewFeedback['result'],
    feedback: String(c.feedback ?? ''),
    createdAt: String(c.createdAt ?? nowIso()),
  }
}

function mapProject(row: Record<string, unknown>): PlacementProject {
  const c = snakeToCamelRow<Record<string, unknown>>(row)
  return {
    id: String(c.id),
    userId: String(c.userId),
    title: String(c.title ?? ''),
    description: String(c.description ?? ''),
    techStack: (c.techStack as string[]) ?? [],
    repoUrl: String(c.repoUrl ?? ''),
    liveUrl: String(c.liveUrl ?? ''),
    readmeUrl: String(c.readmeUrl ?? ''),
    hasReadme: Boolean(c.hasReadme),
    hasScreenshots: Boolean(c.hasScreenshots),
    hasAuth: Boolean(c.hasAuth),
    hasErrorHandling: Boolean(c.hasErrorHandling),
    hasDeployment: Boolean(c.hasDeployment),
    architectureNotes: String(c.architectureNotes ?? ''),
    apiNotes: String(c.apiNotes ?? ''),
    databaseNotes: String(c.databaseNotes ?? ''),
    deploymentNotes: String(c.deploymentNotes ?? ''),
    status: c.status as PlacementProject['status'],
  }
}

class PlacementApplicationsService {
  // ---- Job applications ----------------------------------------------------

  async getApplications(userId: string): Promise<PlacementJobApplication[]> {
    try {
      const { data, error } = await supabase
        .from('placement_job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data) return data.map(mapApplication)
    } catch {
      /* ignore */
    }
    return readLocal<PlacementJobApplication[]>('applications', userId, [])
  }

  async saveApplication(
    userId: string,
    application: Omit<PlacementJobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'> & { id?: string },
  ): Promise<PlacementJobApplication> {
    const existing = await this.getApplications(userId)
    const isUpdate = Boolean(application.id && existing.some((a) => a.id === application.id))
    const record: PlacementJobApplication = {
      ...application,
      id: application.id ?? generateLocalId('pja'),
      userId,
      createdAt: isUpdate
        ? existing.find((a) => a.id === application.id)?.createdAt ?? nowIso()
        : nowIso(),
      updatedAt: nowIso(),
    }

    const next = isUpdate
      ? existing.map((a) => (a.id === record.id ? record : a))
      : [record, ...existing]
    writeLocal('applications', userId, next)

    try {
      const payload = {
        id: record.id,
        user_id: userId,
        company: record.company,
        role: record.role,
        location: record.location,
        job_url: record.jobUrl,
        source: record.source,
        applied_at: record.appliedAt,
        status: record.status,
        interview_date: record.interviewDate,
        current_round: record.currentRound,
        salary_range: record.salaryRange,
        notes: record.notes,
        updated_at: nowIso(),
      }
      const { error } = isUpdate
        ? await supabase.from('placement_job_applications').update(payload).eq('id', record.id)
        : await supabase.from('placement_job_applications').insert(payload)
      if (error) {
        await supabase.from('placement_job_applications').upsert(payload, { onConflict: 'id' })
      }
    } catch {
      /* ignore */
    }
    return record
  }

  async deleteApplication(userId: string, id: string): Promise<void> {
    const existing = await this.getApplications(userId)
    writeLocal(
      'applications',
      userId,
      existing.filter((a) => a.id !== id),
    )
    try {
      await supabase.from('placement_job_applications').delete().eq('id', id)
    } catch {
      /* ignore */
    }
  }

  // ---- Interview feedback --------------------------------------------------

  async getInterviewFeedback(userId: string): Promise<PlacementInterviewFeedback[]> {
    try {
      const { data, error } = await supabase
        .from('placement_interview_feedback')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data) return data.map(mapFeedback)
    } catch {
      /* ignore */
    }
    return readLocal<PlacementInterviewFeedback[]>('interview_feedback', userId, [])
  }

  async saveInterviewFeedback(
    userId: string,
    feedback: Omit<PlacementInterviewFeedback, 'id' | 'userId' | 'createdAt'> & { id?: string },
  ): Promise<PlacementInterviewFeedback> {
    const existing = await this.getInterviewFeedback(userId)
    const isUpdate = Boolean(feedback.id && existing.some((f) => f.id === feedback.id))
    const record: PlacementInterviewFeedback = {
      ...feedback,
      id: feedback.id ?? generateLocalId('pif'),
      userId,
      createdAt: isUpdate
        ? existing.find((f) => f.id === feedback.id)?.createdAt ?? nowIso()
        : nowIso(),
    }
    const next = isUpdate
      ? existing.map((f) => (f.id === record.id ? record : f))
      : [record, ...existing]
    writeLocal('interview_feedback', userId, next)

    try {
      const payload = {
        id: record.id,
        user_id: userId,
        application_id: record.applicationId ?? null,
        mock_id: record.mockId ?? null,
        company: record.company,
        role: record.role,
        round: record.round,
        interview_date: record.interviewDate,
        questions_asked: record.questionsAsked,
        questions_failed: record.questionsFailed,
        questions_passed: record.questionsPassed,
        area_results: record.areaResults,
        result: record.result,
        feedback: record.feedback,
        updated_at: nowIso(),
      }
      const { error } = isUpdate
        ? await supabase.from('placement_interview_feedback').update(payload).eq('id', record.id)
        : await supabase.from('placement_interview_feedback').insert(payload)
      if (error) {
        await supabase.from('placement_interview_feedback').upsert(payload, { onConflict: 'id' })
      }
    } catch {
      /* ignore */
    }
    return record
  }

  // ---- Mock interviews -----------------------------------------------------

  async getMockInterviews(userId: string): Promise<PlacementMockInterview[]> {
    try {
      const { data, error } = await supabase
        .from('placement_mock_interviews')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_at', { ascending: false, nullsFirst: false })
      if (!error && data) {
        return data.map((row) => {
          const c = snakeToCamelRow<Record<string, unknown>>(row)
          return {
            id: String(c.id),
            userId: String(c.userId),
            title: String(c.title ?? ''),
            mockType: c.mockType as PlacementMockInterview['mockType'],
            scheduledAt: (c.scheduledAt as string | null) ?? null,
            conductedAt: (c.conductedAt as string | null) ?? null,
            durationMinutes: Number(c.durationMinutes ?? 60),
            interviewerName: String(c.interviewerName ?? ''),
            status: c.status as PlacementMockInterview['status'],
            notes: String(c.notes ?? ''),
          }
        })
      }
    } catch {
      /* ignore */
    }
    return readLocal<PlacementMockInterview[]>('mock_interviews', userId, [])
  }

  async saveMockInterview(
    userId: string,
    mock: Omit<PlacementMockInterview, 'id' | 'userId'> & { id?: string },
  ): Promise<PlacementMockInterview> {
    const existing = await this.getMockInterviews(userId)
    const isUpdate = Boolean(mock.id && existing.some((m) => m.id === mock.id))
    const record: PlacementMockInterview = {
      ...mock,
      id: mock.id ?? generateLocalId('pmi'),
      userId,
    }
    const next = isUpdate
      ? existing.map((m) => (m.id === record.id ? record : m))
      : [record, ...existing]
    writeLocal('mock_interviews', userId, next)

    try {
      const payload = {
        id: record.id,
        user_id: userId,
        program_id: 'placement-30-day',
        title: record.title,
        mock_type: record.mockType,
        scheduled_at: record.scheduledAt,
        conducted_at: record.conductedAt,
        duration_minutes: record.durationMinutes,
        interviewer_name: record.interviewerName,
        status: record.status,
        notes: record.notes,
        updated_at: nowIso(),
      }
      const { error } = isUpdate
        ? await supabase.from('placement_mock_interviews').update(payload).eq('id', record.id)
        : await supabase.from('placement_mock_interviews').insert(payload)
      if (error) {
        await supabase.from('placement_mock_interviews').upsert(payload, { onConflict: 'id' })
      }
    } catch {
      /* ignore */
    }
    return record
  }

  async getMockResults(userId: string): Promise<PlacementMockResult[]> {
    try {
      const { data, error } = await supabase
        .from('placement_mock_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data) {
        return data.map((row) => {
          const c = snakeToCamelRow<Record<string, unknown>>(row)
          return {
            id: String(c.id),
            mockId: String(c.mockId),
            userId: String(c.userId),
            result: c.result as PlacementMockResult['result'],
            overallScore: Number(c.overallScore ?? 0),
            areaScores: (c.areaScores as Record<string, number>) ?? {},
            strengths: (c.strengths as string[]) ?? [],
            improvements: (c.improvements as string[]) ?? [],
            questionsFailed: (c.questionsFailed as string[]) ?? [],
            questionsPassed: (c.questionsPassed as string[]) ?? [],
            feedback: String(c.feedback ?? ''),
            createdAt: String(c.createdAt ?? nowIso()),
          }
        })
      }
    } catch {
      /* ignore */
    }
    return readLocal<PlacementMockResult[]>('mock_results', userId, [])
  }

  async saveMockResult(
    userId: string,
    result: Omit<PlacementMockResult, 'id' | 'userId' | 'createdAt'>,
  ): Promise<PlacementMockResult> {
    const record: PlacementMockResult = {
      ...result,
      id: generateLocalId('pmr'),
      userId,
      createdAt: nowIso(),
    }
    const existing = await this.getMockResults(userId)
    writeLocal('mock_results', userId, [record, ...existing])

    try {
      await supabase.from('placement_mock_results').insert({
        id: record.id,
        mock_id: record.mockId,
        user_id: userId,
        result: record.result,
        overall_score: record.overallScore,
        area_scores: record.areaScores,
        strengths: record.strengths,
        improvements: record.improvements,
        questions_failed: record.questionsFailed,
        questions_passed: record.questionsPassed,
        feedback: record.feedback,
      })
    } catch {
      /* ignore */
    }
    return record
  }

  // ---- Projects ------------------------------------------------------------

  async getProjects(userId: string): Promise<PlacementProject[]> {
    try {
      const { data, error } = await supabase
        .from('placement_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
      if (!error && data) return data.map(mapProject)
    } catch {
      /* ignore */
    }
    return readLocal<PlacementProject[]>('projects', userId, [])
  }

  async saveProject(
    userId: string,
    project: Omit<PlacementProject, 'id' | 'userId'> & { id?: string },
  ): Promise<PlacementProject> {
    const existing = await this.getProjects(userId)
    const isUpdate = Boolean(project.id && existing.some((p) => p.id === project.id))
    const record: PlacementProject = {
      ...project,
      id: project.id ?? generateLocalId('ppj'),
      userId,
    }
    const next = isUpdate
      ? existing.map((p) => (p.id === record.id ? record : p))
      : [record, ...existing]
    writeLocal('projects', userId, next)

    try {
      const payload = {
        id: record.id,
        user_id: userId,
        program_id: 'placement-30-day',
        title: record.title,
        description: record.description,
        tech_stack: record.techStack,
        repo_url: record.repoUrl,
        live_url: record.liveUrl,
        readme_url: record.readmeUrl,
        has_readme: record.hasReadme,
        has_screenshots: record.hasScreenshots,
        has_auth: record.hasAuth,
        has_error_handling: record.hasErrorHandling,
        has_deployment: record.hasDeployment,
        architecture_notes: record.architectureNotes,
        api_notes: record.apiNotes,
        database_notes: record.databaseNotes,
        deployment_notes: record.deploymentNotes,
        status: record.status,
        updated_at: nowIso(),
      }
      const { error } = isUpdate
        ? await supabase.from('placement_projects').update(payload).eq('id', record.id)
        : await supabase.from('placement_projects').insert(payload)
      if (error) {
        await supabase.from('placement_projects').upsert(payload, { onConflict: 'id' })
      }
    } catch {
      /* ignore */
    }
    return record
  }

  async getProjectReviews(userId: string): Promise<PlacementProjectReview[]> {
    try {
      const { data, error } = await supabase
        .from('placement_project_reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data) {
        return data.map((row) => {
          const c = snakeToCamelRow<Record<string, unknown>>(row)
          return {
            id: String(c.id),
            projectId: String(c.projectId),
            userId: String(c.userId),
            reviewType: c.reviewType as PlacementProjectReview['reviewType'],
            score: Number(c.score ?? 0),
            maxScore: Number(c.maxScore ?? 100),
            clarityScore: Number(c.clarityScore ?? 0),
            technicalScore: Number(c.technicalScore ?? 0),
            architectureScore: Number(c.architectureScore ?? 0),
            deploymentScore: Number(c.deploymentScore ?? 0),
            communicationScore: Number(c.communicationScore ?? 0),
            questionsAsked: (c.questionsAsked as PlacementProjectReview['questionsAsked']) ?? [],
            strengths: String(c.strengths ?? ''),
            improvements: String(c.improvements ?? ''),
            verdict: c.verdict as PlacementProjectReview['verdict'],
            createdAt: String(c.createdAt ?? nowIso()),
          }
        })
      }
    } catch {
      /* ignore */
    }
    return readLocal<PlacementProjectReview[]>('project_reviews', userId, [])
  }

  async saveProjectReview(
    userId: string,
    review: Omit<PlacementProjectReview, 'id' | 'userId' | 'createdAt'>,
  ): Promise<PlacementProjectReview> {
    const record: PlacementProjectReview = {
      ...review,
      id: generateLocalId('ppr'),
      userId,
      createdAt: nowIso(),
    }
    const existing = await this.getProjectReviews(userId)
    writeLocal('project_reviews', userId, [record, ...existing])
    try {
      await supabase.from('placement_project_reviews').insert({
        id: record.id,
        project_id: record.projectId,
        user_id: userId,
        review_type: record.reviewType,
        score: record.score,
        max_score: record.maxScore,
        clarity_score: record.clarityScore,
        technical_score: record.technicalScore,
        architecture_score: record.architectureScore,
        deployment_score: record.deploymentScore,
        communication_score: record.communicationScore,
        questions_asked: record.questionsAsked,
        strengths: record.strengths,
        improvements: record.improvements,
        verdict: record.verdict,
      })
    } catch {
      /* ignore */
    }
    return record
  }
}

export const placementApplicationsService = new PlacementApplicationsService()
