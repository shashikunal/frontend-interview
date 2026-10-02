import { supabase } from '../../../lib/supabase/client'
import { generateLocalId, nowIso, readLocal, writeLocal } from './placementStorage'

export interface ActivityEvent {
  id: string
  userId: string
  eventType:
    | 'concept_viewed'
    | 'concept_completed'
    | 'question_attempted'
    | 'question_correct'
    | 'question_incorrect'
    | 'coding_started'
    | 'coding_submitted'
    | 'coding_passed'
    | 'interview_started'
    | 'interview_completed'
    | 'assessment_started'
    | 'assessment_completed'
    | 'project_started'
    | 'project_completed'
    | 'deployment_completed'
  metadata: Record<string, unknown>
  createdAt: string
}

class ActivityTrackerService {
  async trackEvent(
    userId: string,
    eventType: ActivityEvent['eventType'],
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const event: ActivityEvent = {
      id: generateLocalId('act'),
      userId,
      eventType,
      metadata,
      createdAt: nowIso(),
    }

    writeLocal(`activity:${userId}`, userId, [
      ...(readLocal<ActivityEvent[]>(`activity:${userId}`, userId, []) || []),
      event,
    ])

    try {
      await supabase.from('activity_events').insert({
        id: event.id,
        user_id: userId,
        event_type: eventType,
        metadata,
        created_at: event.createdAt,
      })
    } catch {
      // Local storage is already written
    }
  }

  async getActivityEvents(
    userId: string,
    options: { limit?: number; eventType?: string } = {},
  ): Promise<ActivityEvent[]> {
    const { limit = 100, eventType } = options

    try {
      let query = supabase
        .from('activity_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (eventType) {
        query = query.eq('event_type', eventType)
      }

      const { data, error } = await query
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          userId: row.user_id,
          eventType: row.event_type as ActivityEvent['eventType'],
          metadata: row.metadata as Record<string, unknown>,
          createdAt: row.created_at,
        }))
      }
    } catch {
      // Fall through to local storage
    }

    const local = readLocal<ActivityEvent[]>(`activity:${userId}`, userId, []) || []
    return local
      .filter((e) => !eventType || e.eventType === eventType)
      .slice(0, limit)
  }

  async getActivityStats(userId: string): Promise<{
    totalEvents: number
    conceptsViewed: number
    conceptsCompleted: number
    questionsAttempted: number
    questionsCorrect: number
    codingStarted: number
    codingPassed: number
    interviewsCompleted: number
    assessmentsCompleted: number
    projectsCompleted: number
    deploymentsCompleted: number
  }> {
    const events = await this.getActivityEvents(userId, { limit: 1000 })

    return {
      totalEvents: events.length,
      conceptsViewed: events.filter((e) => e.eventType === 'concept_viewed').length,
      conceptsCompleted: events.filter((e) => e.eventType === 'concept_completed').length,
      questionsAttempted: events.filter((e) => e.eventType === 'question_attempted').length,
      questionsCorrect: events.filter((e) => e.eventType === 'question_correct').length,
      codingStarted: events.filter((e) => e.eventType === 'coding_started').length,
      codingPassed: events.filter((e) => e.eventType === 'coding_passed').length,
      interviewsCompleted: events.filter((e) => e.eventType === 'interview_completed').length,
      assessmentsCompleted: events.filter((e) => e.eventType === 'assessment_completed').length,
      projectsCompleted: events.filter((e) => e.eventType === 'project_completed').length,
      deploymentsCompleted: events.filter((e) => e.eventType === 'deployment_completed').length,
    }
  }
}

export const activityTrackerService = new ActivityTrackerService()
