import { supabase } from '../../../lib/supabase/client';
import type {
  MockInterviewSession,
  InterviewAnswer,
  AnswerEvaluation,
  FinalInterviewScorecard,
} from '../types/mock.types';

export type PersistProvider = 'cloud' | 'local';
export interface PersistResult {
  ok: boolean;
  provider: PersistProvider;
  /** Structured error — never swallowed. */
  error?: string;
  /** Server-generated row id (evaluations/scorecards), for FK follow-ups. */
  recordId?: string;
}

export type PersistenceStatus = 'idle' | 'saving' | 'cloud' | 'local' | 'error';

const PENDING_KEY = 'ai_mock_pending_sync_v1';
const MAX_QUEUE_ATTEMPTS = 5;

type PendingKind = 'session' | 'answer' | 'evaluation' | 'scorecard' | 'feedback' | 'challenge';
interface PendingItem {
  kind: PendingKind;
  payload: any;
  attempts: number;
  addedAt: string;
  lastError?: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function newUuid(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {}
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value);
}

/** auth.users FK columns accept only real UUIDs; guests persist as NULL. */
function userIdOrNull(userId: string | undefined | null): string | null {
  return isUuid(userId) ? (userId as string) : null;
}

function readQueue(): PendingItem[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeQueue(items: PendingItem[]): void {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(items));
  } catch {}
}

function enqueue(kind: PendingKind, payload: any, error?: string): void {
  const q = readQueue();
  q.push({ kind, payload, attempts: 0, addedAt: new Date().toISOString(), lastError: error });
  writeQueue(q.slice(-200));
}

function errText(err: unknown): string {
  if (!err) return 'unknown error';
  if (typeof err === 'string') return err;
  const anyErr = err as any;
  return anyErr.message || anyErr.error_description || JSON.stringify(anyErr).slice(0, 300);
}

function sessionRow(session: MockInterviewSession): Record<string, any> {
  return {
    id: session.id,
    user_id: userIdOrNull(session.userId),
    user_email: (session as any).userEmail || null,
    state: session.state,
    config: session.config,
    blueprint: session.blueprint,
    current_question_index: session.currentQuestionIndex,
    total_questions: session.totalQuestions,
    integrity_signals: session.integritySignals || [],
    total_paused_seconds: session.totalPausedSeconds || 0,
    started_at: session.startedAt || null,
    paused_at: session.pausedAt || null,
    completed_at: session.completedAt || null,
    updated_at: new Date().toISOString(),
  };
}

function answerRow(session: MockInterviewSession, answer: InterviewAnswer): Record<string, any> {
  const t = answer.transcript;
  const prevVersion = typeof (answer as any).transcriptVersion === 'number' ? (answer as any).transcriptVersion : (t?.version || 0);
  const version = prevVersion + 1;
  (answer as any).transcriptVersion = version;
  return {
    id: answer.id,
    session_id: session.id,
    user_id: userIdOrNull(session.userId),
    question_id: answer.questionId,
    question_number: answer.questionNumber,
    question_snapshot: answer.question,
    mode: answer.mode,
    status: answer.status,
    raw_transcript: t?.rawTranscript || (t as any)?.rawText || null,
    cleaned_transcript: t?.cleanedTranscript || (t as any)?.cleanedText || null,
    transcript_confidence: typeof t?.confidence === 'number' ? t.confidence : null,
    transcript_provider: t?.provider || null,
    submitted_code: answer.submittedCode || null,
    code_language: answer.codeLanguage || null,
    coding_test_results: answer.codingEvaluation || null,
    video_metadata: answer.videoMetadata || null,
    time_spent_seconds: answer.timeSpentSeconds || 0,
    dynamic_follow_up: answer.dynamicFollowUpQuestion || null,
    started_at: answer.startedAt || new Date().toISOString(),
    submitted_at: answer.submittedAt || null,
  };
}

function evaluationRow(
  sessionId: string,
  userId: string | undefined | null,
  answer: InterviewAnswer,
  evaluation: AnswerEvaluation
): Record<string, any> {
  return {
    answer_id: answer.id,
    session_id: sessionId,
    user_id: userIdOrNull(userId),
    question_id: answer.questionId,
    numeric_score: evaluation.numericScore,
    letter_grade: evaluation.letterGrade,
    confidence: evaluation.confidence,
    confidence_reason: evaluation.confidenceReason || null,
    correct_concepts: evaluation.comparison?.correctConcepts || [],
    missing_concepts: evaluation.comparison?.missingConcepts || [],
    incorrect_concepts: evaluation.comparison?.incorrectConcepts || [],
    why_marks_lost: evaluation.whyMarksLost || [],
    positive_highlights: evaluation.positiveHighlights || [],
    experience_aware_feedback: evaluation.experienceAwareFeedback || null,
    improved_answer: evaluation.improvedAnswer || null,
    rubric_scores: {
      ...(evaluation.evaluationRubricScores || {}),
      ...(evaluation.rubricBreakdown || {}),
    },
    self_correction_detected: !!evaluation.selfCorrectionDetected,
    honest_i_dont_know: !!evaluation.honestIDontKnow,
    model_info: evaluation.modelInfo || {},
  };
}

function scorecardRow(session: MockInterviewSession, scorecard: FinalInterviewScorecard): Record<string, any> {
  return {
    session_id: session.id,
    user_id: userIdOrNull(session.userId),
    overall_score: scorecard.overallScore,
    letter_grade: scorecard.letterGrade,
    confidence: scorecard.confidence,
    competency_pillars: scorecard.competencyPillars,
    seniority_assessment: scorecard.seniorityAssessment,
    strengths: scorecard.strengths || [],
    weaknesses: scorecard.weaknesses || [],
    recurring_weaknesses: scorecard.recurringWeaknesses || [],
    critical_gaps: scorecard.criticalGaps || [],
    communication_summary: scorecard.communicationSummary,
    learning_plan: scorecard.learningPlan || [],
    target_role_readiness: scorecard.targetRoleReadiness,
    evaluated_at: scorecard.evaluatedAt || new Date().toISOString(),
  };
}

export const mockPersistenceService = {
  /** Supabase reachable for mock tables (schema-cache probe). */
  async isCloudAvailable(): Promise<boolean> {
    try {
      if (!supabase) return false;
      const { error } = await supabase.from('mock_interview_sessions').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  },

  async saveSession(session: MockInterviewSession): Promise<PersistResult> {
    if (!isUuid(session.id)) {
      return { ok: false, provider: 'local', error: 'legacy non-UUID session id; local-only' };
    }
    if (!supabase) {
      enqueue('session', sessionRow(session), 'supabase client unavailable');
      return { ok: false, provider: 'local', error: 'supabase client unavailable' };
    }
    try {
      const { error } = await supabase.from('mock_interview_sessions').upsert(sessionRow(session), { onConflict: 'id' });
      if (error) {
        enqueue('session', sessionRow(session), errText(error));
        return { ok: false, provider: 'local', error: `sessions upsert: ${errText(error)}` };
      }
      return { ok: true, provider: 'cloud' };
    } catch (e) {
      const msg = errText(e);
      enqueue('session', sessionRow(session), msg);
      return { ok: false, provider: 'local', error: msg };
    }
  },

  async saveAnswer(session: MockInterviewSession, answer: InterviewAnswer): Promise<PersistResult> {
    if (!isUuid(session.id) || !isUuid(answer.id)) {
      return { ok: false, provider: 'local', error: 'legacy non-UUID id; local-only' };
    }
    if (!supabase) {
      enqueue('answer', answerRow(session, answer), 'supabase client unavailable');
      return { ok: false, provider: 'local', error: 'supabase client unavailable' };
    }
    try {
      const { error } = await supabase.from('mock_interview_answers').upsert(answerRow(session, answer), { onConflict: 'id' });
      if (error) {
        enqueue('answer', answerRow(session, answer), errText(error));
        return { ok: false, provider: 'local', error: `answers upsert: ${errText(error)}` };
      }
      return { ok: true, provider: 'cloud' };
    } catch (e) {
      const msg = errText(e);
      enqueue('answer', answerRow(session, answer), msg);
      return { ok: false, provider: 'local', error: msg };
    }
  },

  async saveEvaluation(
    sessionId: string,
    userId: string | undefined | null,
    answer: InterviewAnswer,
    evaluation: AnswerEvaluation
  ): Promise<PersistResult> {
    if (!isUuid(sessionId) || !isUuid(answer.id)) {
      return { ok: false, provider: 'local', error: 'legacy non-UUID id; local-only' };
    }
    if (!supabase) {
      enqueue('evaluation', evaluationRow(sessionId, userId, answer, evaluation), 'supabase client unavailable');
      return { ok: false, provider: 'local', error: 'supabase client unavailable' };
    }
    try {
      const { data, error } = await supabase
        .from('mock_answer_evaluations')
        .insert(evaluationRow(sessionId, userId, answer, evaluation))
        .select('id')
        .single();
      if (error) {
        enqueue('evaluation', evaluationRow(sessionId, userId, answer, evaluation), errText(error));
        return { ok: false, provider: 'local', error: `evaluations insert: ${errText(error)}` };
      }
      return { ok: true, provider: 'cloud', recordId: data?.id };
    } catch (e) {
      const msg = errText(e);
      enqueue('evaluation', evaluationRow(sessionId, userId, answer, evaluation), msg);
      return { ok: false, provider: 'local', error: msg };
    }
  },

  async saveScorecard(session: MockInterviewSession, scorecard: FinalInterviewScorecard): Promise<PersistResult> {
    if (!isUuid(session.id)) {
      return { ok: false, provider: 'local', error: 'legacy non-UUID session id; local-only' };
    }
    if (!supabase) {
      enqueue('scorecard', scorecardRow(session, scorecard), 'supabase client unavailable');
      return { ok: false, provider: 'local', error: 'supabase client unavailable' };
    }
    try {
      const { error } = await supabase
        .from('mock_final_scorecards')
        .upsert(scorecardRow(session, scorecard), { onConflict: 'session_id' });
      if (error) {
        enqueue('scorecard', scorecardRow(session, scorecard), errText(error));
        return { ok: false, provider: 'local', error: `scorecard upsert: ${errText(error)}` };
      }
      return { ok: true, provider: 'cloud' };
    } catch (e) {
      const msg = errText(e);
      enqueue('scorecard', scorecardRow(session, scorecard), msg);
      return { ok: false, provider: 'local', error: msg };
    }
  },

  async saveFeedback(input: { question_id: string; user_id?: string | null; rating: string; comment?: string }): Promise<PersistResult> {
    if (!supabase) return { ok: false, provider: 'local', error: 'supabase client unavailable' };
    try {
      const { error } = await supabase.from('mock_question_feedback').insert({
        question_id: input.question_id,
        user_id: userIdOrNull(input.user_id),
        rating: input.rating,
        comment: input.comment || null,
      });
      if (error) return { ok: false, provider: 'local', error: `feedback insert: ${errText(error)}` };
      return { ok: true, provider: 'cloud' };
    } catch (e) {
      return { ok: false, provider: 'local', error: errText(e) };
    }
  },

  async saveChallenge(input: {
    evaluation_id: string;
    session_id: string;
    user_id?: string | null;
    reason: string;
  }): Promise<PersistResult> {
    if (!supabase) return { ok: false, provider: 'local', error: 'supabase client unavailable' };
    try {
      const { error } = await supabase.from('mock_evaluation_challenges').insert({
        evaluation_id: input.evaluation_id,
        session_id: input.session_id,
        user_id: userIdOrNull(input.user_id),
        reason: input.reason,
      });
      if (error) return { ok: false, provider: 'local', error: `challenge insert: ${errText(error)}` };
      return { ok: true, provider: 'cloud' };
    } catch (e) {
      return { ok: false, provider: 'local', error: errText(e) };
    }
  },

  /** Retry queued writes (stable UUIDs / upserts ⇒ no duplicates). */
  async syncPending(): Promise<{ synced: number; failed: number; remaining: number }> {
    const q = readQueue();
    if (q.length === 0 || !supabase) return { synced: 0, failed: 0, remaining: q.length };
    let synced = 0;
    let failed = 0;
    const remaining: PendingItem[] = [];
    for (const item of q) {
      if (item.attempts >= MAX_QUEUE_ATTEMPTS) {
        failed += 1;
        continue;
      }
      try {
        let error: any = null;
        if (item.kind === 'session') {
          ({ error } = await supabase.from('mock_interview_sessions').upsert(item.payload, { onConflict: 'id' }));
        } else if (item.kind === 'answer') {
          ({ error } = await supabase.from('mock_interview_answers').upsert(item.payload, { onConflict: 'id' }));
        } else if (item.kind === 'evaluation') {
          ({ error } = await supabase.from('mock_answer_evaluations').insert(item.payload));
        } else if (item.kind === 'scorecard') {
          ({ error } = await supabase.from('mock_final_scorecards').upsert(item.payload, { onConflict: 'session_id' }));
        } else if (item.kind === 'feedback') {
          ({ error } = await supabase.from('mock_question_feedback').insert(item.payload));
        } else if (item.kind === 'challenge') {
          ({ error } = await supabase.from('mock_evaluation_challenges').insert(item.payload));
        }
        if (error) {
          failed += 1;
          remaining.push({ ...item, attempts: item.attempts + 1, lastError: errText(error) });
        } else {
          synced += 1;
        }
      } catch (e) {
        failed += 1;
        remaining.push({ ...item, attempts: item.attempts + 1, lastError: errText(e) });
      }
    }
    writeQueue(remaining);
    return { synced, failed, remaining: remaining.length };
  },

  pendingCount(): number {
    return readQueue().length;
  },

  /** Resolve the persisted evaluation row id for (session, question) — FK target for challenges. */
  async findEvaluationId(sessionId: string, questionId: string): Promise<string | null> {
    if (!supabase || !isUuid(sessionId)) return null;
    try {
      const { data, error } = await supabase
        .from('mock_answer_evaluations')
        .select('id')
        .eq('session_id', sessionId)
        .eq('question_id', questionId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error || !data) return null;
      return (data as any).id || null;
    } catch {
      return null;
    }
  },
  /** Rebuild a full session from Supabase (sessions + answers + evaluations + scorecard). */
  async fetchSessionFull(sessionId: string): Promise<MockInterviewSession | null> {
    if (!supabase || !isUuid(sessionId)) return null;
    try {
      const { data: sRow, error: sErr } = await supabase
        .from('mock_interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();
      if (sErr || !sRow) return null;

      const [{ data: aRows }, { data: eRows }, { data: scRow }] = await Promise.all([
        supabase.from('mock_interview_answers').select('*').eq('session_id', sessionId).order('question_number'),
        supabase.from('mock_answer_evaluations').select('*').eq('session_id', sessionId),
        supabase.from('mock_final_scorecards').select('*').eq('session_id', sessionId).maybeSingle(),
      ]);

      const evalByAnswer = new Map<string, any>();
      for (const e of eRows || []) {
        if (!evalByAnswer.has(e.answer_id)) evalByAnswer.set(e.answer_id, e);
      }

      const answers = (aRows || []).map((a: any) => {
        const ev = evalByAnswer.get(a.id);
        return {
          id: a.id,
          sessionId,
          questionId: a.question_id,
          questionNumber: a.question_number,
          question: a.question_snapshot,
          mode: a.mode,
          status: a.status,
          transcript: a.raw_transcript
            ? {
                id: `tr_${a.id}`,
                version: 1,
                rawTranscript: a.raw_transcript,
                cleanedTranscript: a.cleaned_transcript || a.raw_transcript,
                language: 'en',
                provider: 'cloud-whisper' as const,
                model: 'server-record',
                confidence: Number(a.transcript_confidence ?? 0),
                timestamp: a.submitted_at || a.created_at,
              }
            : undefined,
          submittedCode: a.submitted_code || undefined,
          codeLanguage: a.code_language || undefined,
          codingEvaluation: a.coding_test_results || undefined,
          videoMetadata: a.video_metadata || undefined,
          evaluation: ev
            ? {
                id: ev.id,
                answerId: a.id,
                questionId: a.question_id,
                numericScore: Number(ev.numeric_score),
                letterGrade: ev.letter_grade,
                confidence: ev.confidence,
                confidenceReason: ev.confidence_reason || undefined,
                comparison: {
                  correctConcepts: ev.correct_concepts || [],
                  missingConcepts: ev.missing_concepts || [],
                  incorrectConcepts: ev.incorrect_concepts || [],
                },
                whyMarksLost: ev.why_marks_lost || [],
                positiveHighlights: ev.positive_highlights || [],
                experienceAwareFeedback: ev.experience_aware_feedback || '',
                improvedAnswer: ev.improved_answer || '',
                evaluationRubricScores: ev.rubric_scores || {},
                selfCorrectionDetected: !!ev.self_correction_detected,
                honestIDontKnow: !!ev.honest_i_dont_know,
                modelInfo: ev.model_info || {},
              }
            : undefined,
          dynamicFollowUpQuestion: a.dynamic_follow_up || undefined,
          timeSpentSeconds: a.time_spent_seconds || 0,
          startedAt: a.started_at,
          submittedAt: a.submitted_at || undefined,
        };
      });

      return {
        id: sRow.id,
        userId: sRow.user_id || 'anonymous_candidate',
        state: sRow.state,
        config: sRow.config,
        blueprint: sRow.blueprint,
        currentQuestionIndex: sRow.current_question_index || 0,
        totalQuestions: sRow.total_questions || answers.length,
        answers,
        scorecard: scRow
          ? {
              sessionId,
              overallScore: Number(scRow.overall_score),
              letterGrade: scRow.letter_grade,
              confidence: scRow.confidence,
              competencyPillars: scRow.competency_pillars,
              seniorityAssessment: scRow.seniority_assessment,
              strengths: scRow.strengths || [],
              weaknesses: scRow.weaknesses || [],
              recurringWeaknesses: scRow.recurring_weaknesses || [],
              criticalGaps: scRow.critical_gaps || [],
              communicationSummary: scRow.communication_summary,
              learningPlan: scRow.learning_plan || [],
              targetRoleReadiness: scRow.target_role_readiness,
              evaluatedAt: scRow.evaluated_at,
            }
          : undefined,
        integritySignals: sRow.integrity_signals || [],
        startedAt: sRow.started_at,
        pausedAt: sRow.paused_at || undefined,
        totalPausedSeconds: sRow.total_paused_seconds || 0,
        completedAt: sRow.completed_at || undefined,
        updatedAt: sRow.updated_at,
      } as MockInterviewSession;
    } catch {
      return null;
    }
  },

  /** Cloud session list for history (newest first). */
  async listUserSessions(userId: string): Promise<Array<Partial<MockInterviewSession> & { id: string }>> {
    if (!supabase || !isUuid(userId)) return [];
    try {
      const { data, error } = await supabase
        .from('mock_interview_sessions')
        .select('id, state, config, total_questions, started_at, completed_at, updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(100);
      if (error || !data) return [];
      const ids = data.map((s: any) => s.id);
      let scoreBySession = new Map<string, any>();
      if (ids.length > 0) {
        const { data: sc } = await supabase
          .from('mock_final_scorecards')
          .select('session_id, overall_score, letter_grade')
          .in('session_id', ids);
        for (const row of sc || []) scoreBySession.set(row.session_id, row);
      }
      return data.map((s: any) => ({
        id: s.id,
        userId,
        state: s.state,
        config: s.config,
        totalQuestions: s.total_questions,
        answers: [],
        integritySignals: [],
        startedAt: s.started_at,
        totalPausedSeconds: 0,
        updatedAt: s.updated_at,
        completedAt: s.completed_at,
        ...(scoreBySession.get(s.id)
          ? {
              scorecard: {
                overallScore: Number(scoreBySession.get(s.id).overall_score),
                letterGrade: scoreBySession.get(s.id).letter_grade,
              },
            }
          : {}),
      })) as Array<Partial<MockInterviewSession> & { id: string }>;
    } catch {
      return [];
    }
  },
};
