import { supabase } from '../../../lib/supabase/client'
import {
  PLACEMENT_DAY_DEFINITIONS,
  PLACEMENT_PROGRAM,
  PLACEMENT_TOPICS,
} from '../data/curriculum'
import type {
  PlacementAttempt,
  PlacementCategory,
  PlacementDailyPriorityItem,
  PlacementDayTask,
  PlacementProgress,
} from '../types/placement.types'
import {
  generateLocalId,
  nowIso,
  readLocal,
  writeLocal,
} from './placementStorage'

const ATTEMPTS_LIMIT = 500

interface AttemptRow {
  id: string
  user_id: string
  question_id: string | null
  day_id: string | null
  category: string
  subcategory: string
  mode: string
  selected_answer: string | null
  is_correct: boolean
  score: number
  max_score: number
  time_spent_seconds: number
  result_status: string
  created_at: string
}

function rowToAttempt(row: AttemptRow): PlacementAttempt {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    dayId: row.day_id,
    category: row.category as PlacementCategory,
    subcategory: row.subcategory ?? '',
    mode: row.mode as PlacementAttempt['mode'],
    selectedAnswer: row.selected_answer,
    isCorrect: row.is_correct,
    score: Number(row.score ?? 0),
    maxScore: Number(row.max_score ?? 1),
    timeSpentSeconds: Number(row.time_spent_seconds ?? 0),
    attemptsCount: 1,
    hintsUsed: 0,
    resultStatus: row.result_status as PlacementAttempt['resultStatus'],
    createdAt: row.created_at,
  }
}

export interface WeakTopicStat {
  subcategory: string
  category: PlacementCategory
  attempts: number
  correct: number
  accuracy: number
}

export interface CategoryStat {
  category: PlacementCategory
  attempts: number
  correct: number
  accuracy: number
  totalTimeSeconds: number
}

class PlacementService {
  // ---- Progress ------------------------------------------------------------

  async getProgress(userId: string): Promise<PlacementProgress> {
    const fallback: PlacementProgress = {
      id: 'local-progress',
      userId,
      programId: PLACEMENT_PROGRAM.id,
      enrollmentStatus: 'active',
      currentDay: 1,
      daysCompleted: [],
      streakDays: 0,
      totalQuestionsAttempted: 0,
      totalQuestionsCorrect: 0,
      totalTimeSpentSeconds: 0,
      weakTopics: [],
    }

    try {
      const { data, error } = await supabase
        .from('placement_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('program_id', PLACEMENT_PROGRAM.id)
        .maybeSingle()
      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          programId: data.program_id,
          enrollmentStatus: data.enrollment_status,
          currentDay: Number(data.current_day ?? 1),
          daysCompleted: data.days_completed ?? [],
          streakDays: Number(data.streak_days ?? 0),
          lastActivityAt: data.last_activity_at ?? null,
          totalQuestionsAttempted: Number(data.total_questions_attempted ?? 0),
          totalQuestionsCorrect: Number(data.total_questions_correct ?? 0),
          totalTimeSpentSeconds: Number(data.total_time_spent_seconds ?? 0),
          weakTopics: data.weak_topics ?? [],
        }
      }
    } catch {
      /* migrations may not be applied yet */
    }

    return readLocal('progress', userId, fallback)
  }

  async saveProgress(userId: string, progress: PlacementProgress): Promise<void> {
    writeLocal('progress', userId, progress)
    try {
      await supabase.from('placement_progress').upsert(
        {
          user_id: userId,
          program_id: progress.programId,
          enrollment_status: progress.enrollmentStatus,
          current_day: progress.currentDay,
          days_completed: progress.daysCompleted,
          streak_days: progress.streakDays,
          last_activity_at: nowIso(),
          total_questions_attempted: progress.totalQuestionsAttempted,
          total_questions_correct: progress.totalQuestionsCorrect,
          total_time_spent_seconds: progress.totalTimeSpentSeconds,
          weak_topics: progress.weakTopics,
          updated_at: nowIso(),
        },
        { onConflict: 'user_id,program_id' },
      )
    } catch {
      /* offline fallback already written */
    }
  }

  async enroll(userId: string): Promise<PlacementProgress> {
    const existing = await this.getProgress(userId)
    if (existing.id !== 'local-progress') return existing
    const progress: PlacementProgress = {
      ...existing,
      enrollmentStatus: 'active',
      currentDay: 1,
    }
    await this.saveProgress(userId, progress)
    return progress
  }

  async markDayComplete(userId: string, dayNumber: number): Promise<PlacementProgress> {
    const progress = await this.getProgress(userId)
    const daysCompleted = progress.daysCompleted.includes(dayNumber)
      ? progress.daysCompleted
      : [...progress.daysCompleted, dayNumber].sort((a, b) => a - b)

    const isFinal = dayNumber >= PLACEMENT_PROGRAM.durationDays
    const next: PlacementProgress = {
      ...progress,
      daysCompleted,
      currentDay: isFinal ? PLACEMENT_PROGRAM.durationDays : Math.min(dayNumber + 1, PLACEMENT_PROGRAM.durationDays),
      enrollmentStatus: isFinal ? 'placement_mode' : progress.enrollmentStatus,
      lastActivityAt: nowIso(),
    }
    await this.saveProgress(userId, next)
    return next
  }

  async setEnrollmentStatus(
    userId: string,
    status: PlacementProgress['enrollmentStatus'],
  ): Promise<PlacementProgress> {
    const progress = await this.getProgress(userId)
    const next = { ...progress, enrollmentStatus: status, lastActivityAt: nowIso() }
    await this.saveProgress(userId, next)
    return next
  }

  // ---- Daily tasks ---------------------------------------------------------

  async getDailyTasks(userId: string, dayNumber: number): Promise<PlacementDayTask[]> {
    const fallback = readLocal<PlacementDayTask[]>(`daily_tasks:${dayNumber}`, userId, [])
    if (fallback.length) return fallback

    try {
      const { data, error } = await supabase
        .from('placement_daily_tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('day_number', dayNumber)
        .order('task_key')
      if (!error && data) {
        return data.map((row) => ({
          id: row.id,
          taskKey: row.task_key,
          taskLabel: row.task_label,
          category: row.category as PlacementCategory,
          targetCount: Number(row.target_count ?? 1),
          completedCount: Number(row.completed_count ?? 0),
          isCompleted: Boolean(row.is_completed),
          completedAt: row.completed_at ?? null,
        }))
      }
    } catch {
      /* ignore */
    }
    return fallback
  }

  async upsertDailyTask(
    userId: string,
    dayNumber: number,
    task: PlacementDayTask,
  ): Promise<PlacementDayTask> {
    const current = await this.getDailyTasks(userId, dayNumber)
    const next = current.some((t) => t.taskKey === task.taskKey)
      ? current.map((t) => (t.taskKey === task.taskKey ? task : t))
      : [...current, task]
    writeLocal(`daily_tasks:${dayNumber}`, userId, next)

    try {
      await supabase.from('placement_daily_tasks').upsert(
        {
          user_id: userId,
          program_id: PLACEMENT_PROGRAM.id,
          day_id: `day-${dayNumber}`,
          day_number: dayNumber,
          task_key: task.taskKey,
          task_label: task.taskLabel,
          category: task.category,
          target_count: task.targetCount,
          completed_count: task.completedCount,
          is_completed: task.isCompleted,
          completed_at: task.completedAt ?? null,
          updated_at: nowIso(),
        },
        { onConflict: 'user_id,program_id,day_number,task_key' },
      )
    } catch {
      /* ignore */
    }
    return task
  }

  // ---- Attempts ------------------------------------------------------------

  async getAttempts(userId: string): Promise<PlacementAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('placement_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(ATTEMPTS_LIMIT)
      if (!error && data) return (data as AttemptRow[]).map(rowToAttempt)
    } catch {
      /* ignore */
    }
    return readLocal<PlacementAttempt[]>('attempts', userId, [])
  }

  async recordAttempt(
    userId: string,
    attempt: Omit<PlacementAttempt, 'id' | 'userId' | 'createdAt'>,
  ): Promise<PlacementAttempt> {
    const local: PlacementAttempt = {
      ...attempt,
      id: generateLocalId('pa'),
      userId,
      createdAt: nowIso(),
    }

    const all = await this.getAttempts(userId)
    const next = [local, ...all].slice(0, ATTEMPTS_LIMIT)
    writeLocal('attempts', userId, next)

    try {
      const { data, error } = await supabase
        .from('placement_attempts')
        .insert({
          user_id: userId,
          program_id: PLACEMENT_PROGRAM.id,
          question_id: attempt.questionId ?? null,
          day_id: attempt.dayId ?? null,
          category: attempt.category,
          subcategory: attempt.subcategory,
          mode: attempt.mode,
          selected_answer: attempt.selectedAnswer ?? null,
          submitted_code: attempt.submittedCode ?? null,
          language: attempt.language ?? '',
          is_correct: attempt.isCorrect,
          score: attempt.score,
          max_score: attempt.maxScore,
          time_spent_seconds: attempt.timeSpentSeconds,
          attempts_count: attempt.attemptsCount ?? 1,
          hints_used: attempt.hintsUsed ?? 0,
          result_status: attempt.resultStatus,
        })
        .select('*')
        .single()
      if (!error && data) return rowToAttempt(data as AttemptRow)
    } catch {
      /* ignore */
    }
    return local
  }

  // ---- Derived statistics (from real attempts only) ------------------------

  async getCategoryStats(userId: string): Promise<CategoryStat[]> {
    const attempts = await this.getAttempts(userId)
    const map = new Map<string, CategoryStat>()
    for (const attempt of attempts) {
      const key = attempt.category
      const entry =
        map.get(key) ??
        ({ category: attempt.category, attempts: 0, correct: 0, accuracy: 0, totalTimeSeconds: 0 } as CategoryStat)
      entry.attempts += 1
      if (attempt.isCorrect) entry.correct += 1
      entry.totalTimeSeconds += attempt.timeSpentSeconds
      map.set(key, entry)
    }
    return [...map.values()].map((entry) => ({
      ...entry,
      accuracy: entry.attempts ? Math.round((entry.correct / entry.attempts) * 100) : 0,
    }))
  }

  /** Weak areas are derived from recorded attempts only — never invented. */
  async getWeakSubcategories(userId: string, minAttempts = 3): Promise<WeakTopicStat[]> {
    const attempts = await this.getAttempts(userId)
    const map = new Map<string, WeakTopicStat>()
    for (const attempt of attempts) {
      if (!attempt.subcategory) continue
      const entry =
        map.get(attempt.subcategory) ??
        ({
          subcategory: attempt.subcategory,
          category: attempt.category,
          attempts: 0,
          correct: 0,
          accuracy: 0,
        } as WeakTopicStat)
      entry.attempts += 1
      if (attempt.isCorrect) entry.correct += 1
      map.set(attempt.subcategory, entry)
    }
    return [...map.values()]
      .map((entry) => ({ ...entry, accuracy: entry.attempts ? Math.round((entry.correct / entry.attempts) * 100) : 0 }))
      .filter((entry) => entry.attempts >= minAttempts && entry.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
  }

  async getFailedQuestionIds(userId: string): Promise<string[]> {
    const attempts = await this.getAttempts(userId)
    const failed = new Set<string>()
    const laterCorrect = new Set<string>()
    // attempts are newest first; walk oldest first to keep the latest outcome
    const chronological = [...attempts].reverse()
    for (const attempt of chronological) {
      if (!attempt.questionId) continue
      if (attempt.isCorrect) laterCorrect.add(attempt.questionId)
      else failed.add(attempt.questionId)
    }
    for (const id of laterCorrect) failed.delete(id)
    return [...failed]
  }

  /** Builds the "Today's priority" list from workload targets and real progress. */
  async buildDailyPriority(userId: string, dayNumber: number): Promise<PlacementDailyPriorityItem[]> {
    const dayDef = PLACEMENT_DAY_DEFINITIONS.find((d) => d.dayNumber === dayNumber)
    const tasks = await this.getDailyTasks(userId, dayNumber)
    const byKey = new Map(tasks.map((t) => [t.taskKey, t]))

    const defaults: PlacementDailyPriorityItem[] = [
      { key: 'aptitude', label: 'Solve 10 aptitude questions', category: 'aptitude', target: 10, completed: 0, route: '/placement?view=practice' },
      { key: 'reasoning', label: 'Solve 10 reasoning questions', category: 'reasoning', target: 10, completed: 0, route: '/placement?view=practice' },
      { key: 'technical_mcq', label: 'Complete 10 technical MCQs', category: 'technical_mcq', target: 10, completed: 0, route: '/placement?view=practice' },
      { key: 'dsa', label: 'Solve 5 DSA problems', category: 'dsa', target: 5, completed: 0, route: '/dsa/questions' },
      { key: 'programming', label: 'Complete 5 programming problems', category: 'programming', target: 5, completed: 0, route: '/core-programming' },
    ]

    const dayTasks: PlacementDailyPriorityItem[] = (dayDef?.topics ?? []).slice(0, 3).map((topic, index) => ({
      key: `day-topic-${index}`,
      label: topic.name,
      category: topic.category,
      target: 1,
      completed: 0,
      route: topic.resourceRoute,
    }))

    return [...defaults, ...dayTasks].map((item) => {
      const stored = byKey.get(item.key)
      return stored
        ? { ...item, completed: stored.completedCount, label: stored.taskLabel }
        : item
    })
  }

  getTopicsForDay(dayNumber: number) {
    return PLACEMENT_TOPICS.filter((t) => t.dayId === `day-${dayNumber}`).sort(
      (a, b) => a.orderIndex - b.orderIndex,
    )
  }
}

export const placementService = new PlacementService()
