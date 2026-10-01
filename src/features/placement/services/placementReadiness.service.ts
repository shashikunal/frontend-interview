import { supabase } from '../../../lib/supabase/client'
import type {
  PlacementCategory,
  PlacementInterviewFeedback,
  PlacementReadiness,
  ReadinessCategory,
  ReadinessCategoryScore,
  ReadinessConfig,
  ReadinessGateChecklist,
  ReadinessThresholds,
  ReadinessWeights,
  RejectionAnalysis,
} from '../types/placement.types'
import { placementService } from './placement.service'
import { generateLocalId, nowIso, readLocal, writeLocal } from './placementStorage'

/**
 * Default weights and thresholds.
 *
 * These are only the initial values — administrators edit them at runtime via
 * `placement_readiness_config`. The UI never hardcodes the formula.
 */
export const DEFAULT_READINESS_CONFIG: ReadinessConfig = {
  id: 'default',
  weights: {
    dsa: 25,
    frontend: 20,
    programming: 15,
    aptitude: 10,
    technical_mcq: 10,
    machine_coding: 10,
    sql_cs: 5,
    project: 3,
    communication: 2,
  },
  thresholds: {
    dsa: 70,
    frontend: 75,
    programming: 65,
    aptitude: 70,
    technical_mcq: 70,
    machine_coding: 70,
    sql_cs: 65,
    project: 75,
    communication: 65,
  },
  gateChecklist: {
    resume: true,
    github: true,
    portfolio: true,
    live_project: true,
    readme: true,
    min_mock_interviews: 3,
    final_assessment_passed: true,
  },
}

const CATEGORY_LABELS: Record<ReadinessCategory, string> = {
  dsa: 'DSA',
  frontend: 'Frontend',
  programming: 'Programming',
  aptitude: 'Aptitude',
  technical_mcq: 'Technical MCQ',
  machine_coding: 'Machine Coding',
  sql_cs: 'SQL / CS',
  project: 'Project',
  communication: 'Communication',
}

/** Maps a placement question category onto a readiness category. */
function readinessCategoryFor(category: PlacementCategory): ReadinessCategory | null {
  switch (category) {
    case 'dsa':
      return 'dsa'
    case 'frontend':
    case 'machine_coding':
      return category
    case 'programming':
      return 'programming'
    case 'aptitude':
      return 'aptitude'
    case 'technical_mcq':
    case 'reasoning':
    case 'verbal':
      return 'technical_mcq'
    case 'sql':
    case 'cs_fundamentals':
      return 'sql_cs'
    case 'project':
      return 'project'
    case 'communication':
      return 'communication'
    default:
      return null
  }
}

interface TrackSignal {
  score: number
  sampleSize: number
  evidence: string
}

class PlacementReadinessService {
  // ---- Configuration -------------------------------------------------------

  async getConfig(): Promise<ReadinessConfig> {
    try {
      const { data, error } = await supabase
        .from('placement_readiness_config')
        .select('*')
        .eq('id', 'default')
        .maybeSingle()
      if (!error && data) {
        return {
          id: data.id,
          weights: { ...DEFAULT_READINESS_CONFIG.weights, ...(data.weights ?? {}) },
          thresholds: { ...DEFAULT_READINESS_CONFIG.thresholds, ...(data.thresholds ?? {}) },
          gateChecklist: { ...DEFAULT_READINESS_CONFIG.gateChecklist, ...(data.gate_checklist ?? {}) },
          updatedAt: data.updated_at,
        }
      }
    } catch {
      /* ignore */
    }
    return readLocal('readiness_config', 'global', DEFAULT_READINESS_CONFIG)
  }

  async saveConfig(
    config: Pick<ReadinessConfig, 'weights' | 'thresholds' | 'gateChecklist'>,
    updatedBy?: string,
  ): Promise<ReadinessConfig> {
    const next: ReadinessConfig = { id: 'default', ...config, updatedAt: nowIso() }
    writeLocal('readiness_config', 'global', next)
    try {
      await supabase.from('placement_readiness_config').upsert(
        {
          id: 'default',
          weights: config.weights,
          thresholds: config.thresholds,
          gate_checklist: config.gateChecklist,
          updated_by: updatedBy ?? null,
          updated_at: nowIso(),
        },
        { onConflict: 'id' },
      )
    } catch {
      /* ignore */
    }
    return next
  }

  // ---- Signals from real activity -----------------------------------------

  /**
   * Pulls real submission data from the existing DSA / Core Programming /
   * Frontend JS studios so readiness reflects actual coding activity rather
   * than only placement-module quizzes.
   */
  private async getTrackSignal(userId: string, table: string, statusColumn = 'status'): Promise<TrackSignal> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(`${statusColumn}, created_at`)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100)
      if (error || !data || !data.length) return { score: 0, sampleSize: 0, evidence: 'No recorded submissions' }
      const passed = data.filter(
        (row) => String(row[statusColumn] ?? '').toLowerCase() === 'accepted',
      ).length
      return {
        score: Math.round((passed / data.length) * 100),
        sampleSize: data.length,
        evidence: `${passed}/${data.length} submissions accepted in ${table}`,
      }
    } catch {
      return { score: 0, sampleSize: 0, evidence: 'Submission history unavailable' }
    }
  }

  private async getPlacementSignal(
    userId: string,
    categories: PlacementCategory[],
  ): Promise<TrackSignal> {
    const stats = await placementService.getCategoryStats(userId)
    const relevant = stats.filter((s) => categories.includes(s.category))
    const attempts = relevant.reduce((sum, s) => sum + s.attempts, 0)
    const correct = relevant.reduce((sum, s) => sum + s.correct, 0)
    if (!attempts) return { score: 0, sampleSize: 0, evidence: 'No placement attempts recorded' }
    return {
      score: Math.round((correct / attempts) * 100),
      sampleSize: attempts,
      evidence: `${correct}/${attempts} placement questions correct`,
    }
  }

  private async getProjectSignal(userId: string): Promise<TrackSignal> {
    try {
      const { data, error } = await supabase
        .from('placement_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error || !data) return { score: 0, sampleSize: 0, evidence: 'No project recorded' }
      const checks = [
        data.repo_url,
        data.live_url,
        data.has_readme,
        data.has_screenshots,
        data.has_auth,
        data.has_error_handling,
        data.has_deployment,
        data.architecture_notes,
        data.api_notes,
      ]
      const complete = checks.filter(Boolean).length
      return {
        score: Math.round((complete / checks.length) * 100),
        sampleSize: 1,
        evidence: `Project "${data.title}" — ${complete}/${checks.length} required items complete`,
      }
    } catch {
      return { score: 0, sampleSize: 0, evidence: 'Project record unavailable' }
    }
  }

  private async getMockSignal(userId: string): Promise<TrackSignal> {
    try {
      const { data, error } = await supabase
        .from('placement_mock_results')
        .select('overall_score, result, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)
      if (error || !data || !data.length) {
        return { score: 0, sampleSize: 0, evidence: 'No mock interview results recorded' }
      }
      const avg = data.reduce((sum, row) => sum + Number(row.overall_score ?? 0), 0) / data.length
      return {
        score: Math.round(avg),
        sampleSize: data.length,
        evidence: `${data.length} mock interview(s), average ${Math.round(avg)}%`,
      }
    } catch {
      return { score: 0, sampleSize: 0, evidence: 'Mock interview data unavailable' }
    }
  }

  private async getCommunicationSignal(userId: string): Promise<TrackSignal> {
    const placement = await this.getPlacementSignal(userId, ['communication'])
    if (placement.sampleSize) return placement
    return this.getMockSignal(userId)
  }

  // ---- Readiness computation ----------------------------------------------

  async computeReadiness(userId: string, checklistInput?: Partial<Record<string, boolean | number>>): Promise<PlacementReadiness> {
    const config = await this.getConfig()
    const computedAt = nowIso()

    const dsaTrack = await this.getTrackSignal(userId, 'dsa_submissions')
    const dsaPlacement = await this.getPlacementSignal(userId, ['dsa'])
    const frontendSignal = await this.getPlacementSignal(userId, ['frontend'])
    const programmingTrack = await this.getTrackSignal(userId, 'core_programming_submissions')
    const programmingPlacement = await this.getPlacementSignal(userId, ['programming'])
    const aptitudeSignal = await this.getPlacementSignal(userId, ['aptitude', 'reasoning', 'verbal'])
    const mcqSignal = await this.getPlacementSignal(userId, ['technical_mcq'])
    const machineCodingSignal = await this.getPlacementSignal(userId, ['machine_coding'])
    const sqlCsSignal = await this.getPlacementSignal(userId, ['sql', 'cs_fundamentals'])
    const projectSignal = await this.getProjectSignal(userId)
    const communicationSignal = await this.getCommunicationSignal(userId)

    const blend = (a: TrackSignal, b: TrackSignal): TrackSignal => {
      const total = a.sampleSize + b.sampleSize
      if (!total) return { score: 0, sampleSize: 0, evidence: a.evidence }
      return {
        score: Math.round((a.score * a.sampleSize + b.score * b.sampleSize) / total),
        sampleSize: total,
        evidence: [a, b].filter((s) => s.sampleSize).map((s) => s.evidence).join(' · '),
      }
    }

    const signals: Record<ReadinessCategory, TrackSignal> = {
      dsa: blend(dsaTrack, dsaPlacement),
      frontend: frontendSignal,
      programming: blend(programmingTrack, programmingPlacement),
      aptitude: aptitudeSignal,
      technical_mcq: mcqSignal,
      machine_coding: machineCodingSignal,
      sql_cs: sqlCsSignal,
      project: projectSignal,
      communication: communicationSignal,
    }

    const categoryScores: ReadinessCategoryScore[] = (Object.keys(config.weights) as ReadinessCategory[]).map(
      (category) => {
        const signal = signals[category]
        return {
          category,
          score: signal.score,
          threshold: config.thresholds[category],
          weight: config.weights[category],
          meetsThreshold: signal.score >= config.thresholds[category],
          evidence: signal.evidence,
          sampleSize: signal.sampleSize,
        }
      },
    )

    const weightTotal = categoryScores.reduce((sum, c) => sum + c.weight, 0) || 1
    const overallScore = Math.round(
      categoryScores.reduce((sum, c) => sum + c.score * c.weight, 0) / weightTotal,
    )

    const checklist = await this.buildChecklist(userId, checklistInput)
    const blockingReasons: string[] = []

    for (const entry of categoryScores) {
      if (!entry.meetsThreshold) {
        blockingReasons.push(
          `${CATEGORY_LABELS[entry.category]} is ${entry.score}% but the required minimum is ${entry.threshold}%`,
        )
      }
    }

    for (const [key, value] of Object.entries(checklist)) {
      const required = config.gateChecklist[key as keyof ReadinessGateChecklist]
      if (typeof required === 'number') {
        const actual = typeof value === 'number' ? value : 0
        if (actual < required) {
          blockingReasons.push(
            `${this.checklistLabel(key)}: ${actual} of ${required} required`,
          )
        }
      } else if (required === true && value !== true) {
        blockingReasons.push(`${this.checklistLabel(key)} is not complete`)
      }
    }

    return {
      overallScore,
      categoryScores,
      weightsUsed: config.weights,
      thresholdsUsed: config.thresholds,
      isJobReady: blockingReasons.length === 0,
      blockingReasons,
      checklistState: checklist,
      computedAt,
    }
  }

  private checklistLabel(key: string): string {
    const labels: Record<string, string> = {
      resume: 'Resume',
      github: 'GitHub profile',
      portfolio: 'Portfolio',
      live_project: 'Live project',
      readme: 'Project README',
      min_mock_interviews: 'Mock interviews',
      final_assessment_passed: 'Final assessment',
    }
    return labels[key] ?? key
  }

  private async buildChecklist(
    userId: string,
    input?: Partial<Record<string, boolean | number>>,
  ): Promise<Record<string, boolean | number>> {
    let project: Record<string, boolean> = {}
    let mockCount = 0
    try {
      const { data } = await supabase
        .from('placement_projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data) {
        project = {
          github: Boolean(data.repo_url),
          live_project: Boolean(data.live_url),
          readme: Boolean(data.has_readme),
          screenshots: Boolean(data.has_screenshots),
        }
      }
    } catch {
      /* ignore */
    }
    try {
      const { count } = await supabase
        .from('placement_mock_interviews')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed')
      mockCount = count ?? 0
    } catch {
      /* ignore */
    }

    const stored = readLocal<Record<string, boolean | number>>(`checklist:${userId}`, userId, {})
    return {
      resume: Boolean(input?.resume ?? stored.resume ?? false),
      github: Boolean(input?.github ?? stored.github ?? project.github ?? false),
      portfolio: Boolean(input?.portfolio ?? stored.portfolio ?? false),
      live_project: Boolean(input?.live_project ?? stored.live_project ?? project.live_project ?? false),
      readme: Boolean(input?.readme ?? stored.readme ?? project.readme ?? false),
      min_mock_interviews: Number(input?.min_mock_interviews ?? mockCount ?? 0),
      final_assessment_passed: Boolean(
        input?.final_assessment_passed ?? stored.final_assessment_passed ?? false,
      ),
    }
  }

  async saveChecklist(userId: string, state: Record<string, boolean | number>): Promise<void> {
    writeLocal(`checklist:${userId}`, userId, state)
  }

  async persistReadiness(userId: string, readiness: PlacementReadiness): Promise<void> {
    writeLocal(`readiness:${userId}`, userId, readiness)
    try {
      await supabase.from('placement_readiness').insert({
        user_id: userId,
        program_id: 'placement-30-day',
        overall_score: readiness.overallScore,
        category_scores: readiness.categoryScores,
        weights_used: readiness.weightsUsed,
        thresholds_used: readiness.thresholdsUsed,
        is_job_ready: readiness.isJobReady,
        blocking_reasons: readiness.blockingReasons,
        checklist_state: readiness.checklistState,
        computed_at: readiness.computedAt,
      })
    } catch {
      /* ignore */
    }
  }

  async getLastReadiness(userId: string): Promise<PlacementReadiness | null> {
    return readLocal<PlacementReadiness | null>(`readiness:${userId}`, userId, null)
  }

  // ---- Rejection analysis --------------------------------------------------

  /**
   * Analyses the student's most recent interview feedback records. All numbers
   * come from actual recorded interviews — nothing is estimated.
   */
  analyseRejections(feedback: PlacementInterviewFeedback[], windowSize = 5): RejectionAnalysis {
    const recent = [...feedback]
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, windowSize)

    const areaFailureCounts: Record<string, number> = {}
    const areaPassCounts: Record<string, number> = {}
    const failedQuestions: Record<string, number> = {}

    for (const record of recent) {
      for (const [area, result] of Object.entries(record.areaResults ?? {})) {
        if (result === 'fail') areaFailureCounts[area] = (areaFailureCounts[area] ?? 0) + 1
        else if (result === 'pass') areaPassCounts[area] = (areaPassCounts[area] ?? 0) + 1
      }
      for (const question of record.questionsFailed ?? []) {
        failedQuestions[question] = (failedQuestions[question] ?? 0) + 1
      }
    }

    const weakTopics = Object.entries(failedQuestions)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)

    const weakAreas = Object.entries(areaFailureCounts)
      .filter(([area]) => (areaPassCounts[area] ?? 0) < areaFailureCounts[area])
      .sort((a, b) => b[1] - a[1])

    const recommendations: string[] = []
    for (const [area, count] of weakAreas) {
      recommendations.push(`${area} failed in ${count} of the last ${recent.length} interviews — prioritise this area`)
    }
    for (const topic of weakTopics.slice(0, 5)) {
      recommendations.push(`Re-practice: ${topic}`)
    }
    if (!recent.length) {
      recommendations.push('No interview feedback recorded yet. Record interview results to generate a targeted plan.')
    }

    return {
      windowSize,
      totalInterviews: recent.length,
      areaFailureCounts,
      areaPassCounts,
      weakTopics,
      recommendations,
      computedAt: nowIso(),
    }
  }

  async saveRejectionAnalysis(userId: string, analysis: RejectionAnalysis): Promise<void> {
    writeLocal(`rejection:${userId}`, userId, analysis)
    try {
      await supabase.from('placement_rejection_analysis').insert({
        id: generateLocalId('pra'),
        user_id: userId,
        window_size: analysis.windowSize,
        analysis: {
          totalInterviews: analysis.totalInterviews,
          areaFailureCounts: analysis.areaFailureCounts,
          areaPassCounts: analysis.areaPassCounts,
        },
        weak_topics: analysis.weakTopics,
        recommendations: analysis.recommendations,
        computed_at: analysis.computedAt,
      })
    } catch {
      /* ignore */
    }
  }
}

export const placementReadinessService = new PlacementReadinessService()
