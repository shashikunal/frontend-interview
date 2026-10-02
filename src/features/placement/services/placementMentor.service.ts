import { supabase } from '../../../lib/supabase/client'
import type {
  MentorIntervention,
  MentorStudentRow,
  MentorStatusLabel,
} from '../types/placement.types'
import { placementApplicationsService } from './placementApplications.service'
import { placementReadinessService } from './placementReadiness.service'
import { placementService } from './placement.service'
import { generateLocalId, nowIso, readLocal, writeLocal } from './placementStorage'

/**
 * Mentor intervention triggers.
 *
 * Every trigger is derived from recorded student activity — never from
 * fabricated metrics. When no data exists the row says so explicitly.
 */
export interface InterventionTrigger {
  triggerKey: string
  problem: string
  evidence: string
  recommendedAction: string
  priority: MentorIntervention['priority']
  statusLabel: MentorStatusLabel
}

class PlacementMentorService {
  async getStudents(limit = 100): Promise<MentorStudentRow[]> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error || !profiles) return []

      const rows: MentorStudentRow[] = []
      for (const profile of profiles) {
        const readiness = await placementReadinessService.computeReadiness(profile.id)
        const applications = await placementApplicationsService.getApplications(profile.id)
        const feedback = await placementApplicationsService.getInterviewFeedback(profile.id)
        const mocks = await placementApplicationsService.getMockInterviews(profile.id)
        const completedMocks = mocks.filter((m) => m.status === 'completed')

        rows.push({
          userId: profile.id,
          name: profile.name || profile.email || 'Unknown',
          email: profile.email ?? '',
          readiness: readiness.overallScore,
          dsa: readiness.categoryScores.find((c) => c.category === 'dsa')?.score ?? 0,
          frontend: readiness.categoryScores.find((c) => c.category === 'frontend')?.score ?? 0,
          programming: readiness.categoryScores.find((c) => c.category === 'programming')?.score ?? 0,
          aptitude: readiness.categoryScores.find((c) => c.category === 'aptitude')?.score ?? 0,
          machineCoding: readiness.categoryScores.find((c) => c.category === 'machine_coding')?.score ?? 0,
          project: readiness.categoryScores.find((c) => c.category === 'project')?.score ?? 0,
          applications: applications.length,
          interviews: feedback.length + completedMocks.length,
          selections: applications.filter((a) => a.status === 'selected').length,
          statusLabel: this.deriveStatusLabel(readiness, applications.length, feedback.length),
          lastActivityAt: null,
        })
      }
      return rows
    } catch {
      return []
    }
  }

  deriveStatusLabel(
    readiness: { overallScore: number; isJobReady: boolean },
    applicationCount: number,
    interviewCount: number,
  ): MentorStatusLabel {
    if (readiness.isJobReady) return 'Job Ready'
    if (readiness.overallScore >= 75) return 'Almost Ready'
    if (readiness.overallScore >= 55 && (applicationCount > 0 || interviewCount > 0)) return 'Improving'
    if (readiness.overallScore < 40) return 'At Risk'
    return 'Needs Intervention'
  }

  /**
   * Builds the intervention list for one student from their real data.
   * Returns an empty list when there is no evidence to act on.
   */
  async generateTriggers(userId: string): Promise<InterventionTrigger[]> {
    const triggers: InterventionTrigger[] = []

    const readiness = await placementReadinessService.computeReadiness(userId)
    const attempts = await placementService.getAttempts(userId)
    const feedback = await placementApplicationsService.getInterviewFeedback(userId)
    const applications = await placementApplicationsService.getApplications(userId)
    const projects = await placementApplicationsService.getProjects(userId)
    const mocks = await placementApplicationsService.getMockInterviews(userId)

    // 1. Repeated DSA failure in interviews
    const dsaFailed = feedback.filter((f) => f.areaResults?.dsa === 'fail').length
    if (dsaFailed >= 2) {
      triggers.push({
        triggerKey: 'repeated_dsa_failure',
        problem: `Failed the DSA round in ${dsaFailed} interviews`,
        evidence: `${dsaFailed} of ${feedback.length} recorded interview feedback entries mark DSA as failed`,
        recommendedAction: 'Run a 3-day intervention on the weakest DSA patterns (HashMap, Sliding Window, Binary Search) with timed practice',
        priority: 'critical',
        statusLabel: 'At Risk',
      })
    }

    // 2. Low assessment scores
    const weakCategories = readiness.categoryScores.filter(
      (c) => c.sampleSize > 0 && c.score < c.threshold - 15,
    )
    if (weakCategories.length) {
      triggers.push({
        triggerKey: 'low_category_scores',
        problem: `${weakCategories.length} categories are well below their required threshold`,
        evidence: weakCategories
          .map((c) => `${c.category}: ${c.score}% (needs ${c.threshold}%)`)
          .join(', '),
        recommendedAction: `Assign focused practice on ${weakCategories.map((c) => c.category).join(', ')} and re-assess in 3 days`,
        priority: 'high',
        statusLabel: 'Needs Intervention',
      })
    }

    // 3. No activity
    if (!attempts.length) {
      triggers.push({
        triggerKey: 'no_activity',
        problem: 'No placement practice has been recorded',
        evidence: 'The attempt history for this student is empty',
        recommendedAction: 'Contact the student, confirm the schedule and have them complete Day 1',
        priority: 'high',
        statusLabel: 'At Risk',
      })
    }

    // 4. No project / no deployment
    const project = projects[0]
    if (!project) {
      triggers.push({
        triggerKey: 'no_project',
        problem: 'No project has been registered',
        evidence: 'No placement project record exists for this student',
        recommendedAction: 'Assign a project brief and set a repository deadline within the week',
        priority: 'high',
        statusLabel: 'Needs Intervention',
      })
    } else if (!project.liveUrl || !project.hasDeployment) {
      triggers.push({
        triggerKey: 'no_deployment',
        problem: 'The project is not deployed',
        evidence: `Project "${project.title}" has no live URL recorded`,
        recommendedAction: 'Walk the student through deployment and verify the live URL together',
        priority: 'medium',
        statusLabel: 'Needs Intervention',
      })
    }

    // 5. No applications despite being close to ready
    if (!applications.length && readiness.overallScore >= 60) {
      triggers.push({
        triggerKey: 'no_applications',
        problem: 'Readiness is improving but no applications have been submitted',
        evidence: `Overall readiness is ${readiness.overallScore}% with 0 applications recorded`,
        recommendedAction: 'Start the placement mode loop: apply to 5 targeted roles this week and track each one',
        priority: 'medium',
        statusLabel: 'Improving',
      })
    }

    // 6. Repeated interview rejection
    const rejected = feedback.filter((f) => f.result === 'rejected').length
    if (rejected >= 2) {
      triggers.push({
        triggerKey: 'repeated_rejection',
        problem: `Rejected in ${rejected} interviews`,
        evidence: `${rejected} of ${feedback.length} recorded interviews ended in rejection`,
        recommendedAction: 'Run the rejection analysis together, isolate the failing area and rehearse the failed questions',
        priority: 'critical',
        statusLabel: 'At Risk',
      })
    }

    // 7. Poor communication scores
    const communication = readiness.categoryScores.find((c) => c.category === 'communication')
    if (communication && communication.sampleSize > 0 && communication.score < communication.threshold) {
      triggers.push({
        triggerKey: 'poor_communication',
        problem: 'Communication scores are below the required threshold',
        evidence: `${communication.evidence} — scored ${communication.score}% against a ${communication.threshold}% requirement`,
        recommendedAction: 'Schedule two spoken-answer sessions per week using the interview preparation module',
        priority: 'medium',
        statusLabel: 'Needs Intervention',
      })
    }

    // 8. Mock interviews not started
    const completedMocks = mocks.filter((m) => m.status === 'completed').length
    if (completedMocks < 3 && readiness.overallScore >= 50) {
      triggers.push({
        triggerKey: 'insufficient_mocks',
        problem: `Only ${completedMocks} mock interview(s) completed`,
        evidence: 'The job-ready gate requires at least 3 completed mock interviews',
        recommendedAction: 'Schedule the remaining mock interviews before the final assessment',
        priority: 'low',
        statusLabel: 'Needs Intervention',
      })
    }

    return triggers
  }

  async getInterventions(studentId: string): Promise<MentorIntervention[]> {
    try {
      const { data, error } = await supabase
        .from('placement_mentor_interventions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          studentId: row.student_id,
          mentorId: row.mentor_id ?? null,
          statusLabel: row.status_label as MentorStatusLabel,
          problem: row.problem,
          evidence: row.evidence ?? '',
          recommendedAction: row.recommended_action ?? '',
          priority: row.priority as MentorIntervention['priority'],
          triggerKey: row.trigger_key ?? '',
          resolved: Boolean(row.resolved),
          createdAt: row.created_at,
        }))
      }
    } catch {
      /* ignore */
    }
    return readLocal<MentorIntervention[]>('interventions', studentId, [])
  }

  async saveIntervention(
    studentId: string,
    trigger: InterventionTrigger,
    mentorId?: string,
  ): Promise<MentorIntervention> {
    const record: MentorIntervention = {
      id: generateLocalId('pmi_int'),
      studentId,
      mentorId: mentorId ?? null,
      statusLabel: trigger.statusLabel,
      problem: trigger.problem,
      evidence: trigger.evidence,
      recommendedAction: trigger.recommendedAction,
      priority: trigger.priority,
      triggerKey: trigger.triggerKey,
      resolved: false,
      createdAt: nowIso(),
    }
    const existing = await this.getInterventions(studentId)
    const alreadyRecorded = existing.some(
      (i) => i.triggerKey === trigger.triggerKey && !i.resolved,
    )
    if (alreadyRecorded) return record

    writeLocal('interventions', studentId, [record, ...existing])
    try {
      await supabase.from('placement_mentor_interventions').insert({
        id: record.id,
        student_id: studentId,
        mentor_id: mentorId ?? null,
        status_label: record.statusLabel,
        problem: record.problem,
        evidence: record.evidence,
        recommended_action: record.recommendedAction,
        priority: record.priority,
        trigger_key: record.triggerKey,
      })
    } catch {
      /* ignore */
    }
    return record
  }

  async resolveIntervention(studentId: string, id: string, notes: string): Promise<void> {
    const existing = await this.getInterventions(studentId)
    const next = existing.map((i) =>
      i.id === id ? { ...i, resolved: true } : i,
    )
    writeLocal('interventions', studentId, next)
    try {
      await supabase
        .from('placement_mentor_interventions')
        .update({ resolved: true, resolved_at: nowIso(), resolution_notes: notes })
        .eq('id', id)
    } catch {
      /* ignore */
    }
  }
}

export const placementMentorService = new PlacementMentorService()
