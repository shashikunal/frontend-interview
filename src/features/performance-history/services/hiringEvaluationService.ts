import { getAuthenticatedHistoryClient } from './historyReaderClient';
import type { HiringEvaluation, HiringEvaluationHistoryItem, HiringStatus } from '../types/history.types';

const LOCAL_EVALUATIONS_KEY = 'candidate_hiring_evaluations_v1';
const LOCAL_EVAL_HISTORY_KEY = 'candidate_hiring_history_v1';

class HiringEvaluationService {
  /**
   * Retrieves current hiring evaluation for a candidate
   */
  async getEvaluation(candidateId: string): Promise<HiringEvaluation | null> {
    if (!candidateId) return null;

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      const { data, error } = await db
        .from('hiring_evaluations')
        .select('*')
        .eq('candidate_id', candidateId)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          candidateId: data.candidate_id,
          status: data.status as HiringStatus,
          overallRating: Number(data.overall_rating || 3),
          rubricProblemSolving: data.rubric_problem_solving,
          rubricCodeQuality: data.rubric_code_quality,
          rubricCommunication: data.rubric_communication,
          rubricArchitecture: data.rubric_architecture,
          recommendation: data.recommendation || '',
          notes: data.notes || '',
          strengths: data.strengths || '',
          weaknesses: data.weaknesses || '',
          finalComments: data.final_comments || '',
          evaluatedBy: data.evaluated_by,
          evaluatedAt: data.evaluated_at,
          updatedAt: data.updated_at,
        };
      }
    } catch (_) {}

    // 2. Fallback to local storage store
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_EVALUATIONS_KEY);
        if (raw) {
          const map: Record<string, HiringEvaluation> = JSON.parse(raw);
          if (map[candidateId]) {
            return map[candidateId];
          }
        }
      }
    } catch (_) {}

    return null;
  }

  /**
   * Saves or updates a candidate's hiring evaluation, and appends to the audit history.
   * PRESERVES EVALUATION HISTORY WITHOUT OVERWRITING AUDIT LOGS.
   */
  async saveEvaluation(input: {
    candidateId: string;
    status: HiringStatus;
    overallRating: number;
    rubricProblemSolving?: number;
    rubricCodeQuality?: number;
    rubricCommunication?: number;
    rubricArchitecture?: number;
    recommendation?: string;
    notes?: string;
    strengths?: string;
    weaknesses?: string;
    finalComments?: string;
    evaluatedBy?: string;
    evaluatorName?: string;
  }): Promise<HiringEvaluation> {
    const now = new Date().toISOString();
    const evalId = `eval_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const record: HiringEvaluation = {
      id: evalId,
      candidateId: input.candidateId,
      status: input.status,
      overallRating: input.overallRating,
      rubricProblemSolving: input.rubricProblemSolving,
      rubricCodeQuality: input.rubricCodeQuality,
      rubricCommunication: input.rubricCommunication,
      rubricArchitecture: input.rubricArchitecture,
      recommendation: input.recommendation || '',
      notes: input.notes || '',
      strengths: input.strengths || '',
      weaknesses: input.weaknesses || '',
      finalComments: input.finalComments || '',
      evaluatedBy: input.evaluatedBy || 'admin',
      evaluatorName: input.evaluatorName || 'Platform Administrator',
      evaluatedAt: now,
      updatedAt: now,
    };

    const historyItem: HiringEvaluationHistoryItem = {
      id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      evaluationId: evalId,
      candidateId: input.candidateId,
      status: input.status,
      overallRating: input.overallRating,
      notes: input.notes,
      recommendation: input.recommendation,
      evaluatedBy: input.evaluatedBy || 'admin',
      evaluatorName: input.evaluatorName || 'Platform Administrator',
      createdAt: now,
    };

    // 1. Persist to local storage
    try {
      if (typeof localStorage !== 'undefined') {
        // Update evaluations map
        const rawMap = localStorage.getItem(LOCAL_EVALUATIONS_KEY) || '{}';
        const evalMap = JSON.parse(rawMap);
        evalMap[input.candidateId] = record;
        localStorage.setItem(LOCAL_EVALUATIONS_KEY, JSON.stringify(evalMap));

        // Append to history list
        const rawHist = localStorage.getItem(LOCAL_EVAL_HISTORY_KEY) || '[]';
        const histList: HiringEvaluationHistoryItem[] = JSON.parse(rawHist);
        histList.unshift(historyItem);
        localStorage.setItem(LOCAL_EVAL_HISTORY_KEY, JSON.stringify(histList.slice(0, 1000)));
      }
    } catch (_) {}

    // 2. Best-effort Supabase upsert
    try {
      const db = await getAuthenticatedHistoryClient();
      await db.from('hiring_evaluations').upsert({
        candidate_id: input.candidateId,
        status: input.status,
        overall_rating: input.overallRating,
        rubric_problem_solving: input.rubricProblemSolving,
        rubric_code_quality: input.rubricCodeQuality,
        rubric_communication: input.rubricCommunication,
        rubric_architecture: input.rubricArchitecture,
        recommendation: input.recommendation,
        notes: input.notes,
        strengths: input.strengths,
        weaknesses: input.weaknesses,
        final_comments: input.finalComments,
        evaluated_by: input.evaluatedBy,
        evaluated_at: now,
        updated_at: now,
      });

      await db.from('hiring_evaluation_history').insert({
        candidate_id: input.candidateId,
        status: input.status,
        overall_rating: input.overallRating,
        notes: input.notes,
        recommendation: input.recommendation,
        evaluated_by: input.evaluatedBy,
        created_at: now,
      });
    } catch (_) {}

    return record;
  }

  /**
   * Retrieves complete evaluation audit history for a candidate
   */
  async getEvaluationHistory(candidateId: string): Promise<HiringEvaluationHistoryItem[]> {
    if (!candidateId) return [];

    const results: HiringEvaluationHistoryItem[] = [];

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      const { data, error } = await db
        .from('hiring_evaluation_history')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        data.forEach(d => {
          results.push({
            id: d.id,
            evaluationId: d.evaluation_id,
            candidateId: d.candidate_id,
            status: d.status as HiringStatus,
            overallRating: Number(d.overall_rating || 3),
            notes: d.notes,
            recommendation: d.recommendation,
            evaluatedBy: d.evaluated_by,
            createdAt: d.created_at,
          });
        });
      }
    } catch (_) {}

    // 2. Local storage history
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_EVAL_HISTORY_KEY);
        if (raw) {
          const parsed: HiringEvaluationHistoryItem[] = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            parsed.forEach(item => {
              if (item.candidateId === candidateId && !results.some(r => r.id === item.id)) {
                results.push(item);
              }
            });
          }
        }
      }
    } catch (_) {}

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retrieves latest status for all candidates
   */
  async getAllHiringStatuses(): Promise<Record<string, { status: HiringStatus; overallRating: number }>> {
    const statusMap: Record<string, { status: HiringStatus; overallRating: number }> = {};

    // 1. Try Supabase
    try {
      const db = await getAuthenticatedHistoryClient();
      const { data } = await db
        .from('hiring_evaluations')
        .select('candidate_id, status, overall_rating');

      if (data) {
        data.forEach(d => {
          statusMap[d.candidate_id] = {
            status: d.status as HiringStatus,
            overallRating: Number(d.overall_rating || 3),
          };
        });
      }
    } catch (_) {}

    // 2. Merge local storage
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(LOCAL_EVALUATIONS_KEY);
        if (raw) {
          const map: Record<string, HiringEvaluation> = JSON.parse(raw);
          Object.keys(map).forEach(cid => {
            if (!statusMap[cid]) {
              statusMap[cid] = {
                status: map[cid].status,
                overallRating: map[cid].overallRating,
              };
            }
          });
        }
      }
    } catch (_) {}

    return statusMap;
  }
}

export const hiringEvaluationService = new HiringEvaluationService();
