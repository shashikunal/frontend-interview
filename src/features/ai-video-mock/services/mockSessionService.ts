import type {
  MockInterviewSession,
  CandidateSetupConfig,
  InterviewAnswer,
  MockQuestion,
} from '../types/mock.types';
import { blueprintService } from './blueprintService';
import { getMockQuestionById } from '../data/questionBankRegistry';
import { supabase } from '../../../lib/supabase/client';

const LOCAL_SESSION_PREFIX = 'ai_video_mock_session_';
const LOCAL_ACTIVE_SESSION_ID = 'ai_video_mock_active_id';

export const mockSessionService = {
  createSession(userId: string, config: CandidateSetupConfig): MockInterviewSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const blueprint = blueprintService.generateBlueprint(sessionId, config);

    // Prepare answer placeholders for all reserved questions
    const answers: InterviewAnswer[] = blueprint.reservedQuestionIds.map((qId, index) => {
      const q = getMockQuestionById(qId)!;
      return {
        id: `ans_${sessionId}_q${index + 1}`,
        sessionId,
        questionId: qId,
        questionNumber: index + 1,
        question: q,
        mode: (q.questionType === 'Programming' || q.questionType === 'Machine Coding') ? 'code' : 'speech',
        status: 'UNANSWERED',
        timeSpentSeconds: 0,
        startedAt: new Date().toISOString(),
      };
    });

    const session: MockInterviewSession = {
      id: sessionId,
      userId: userId || 'anonymous_candidate',
      state: 'READY',
      config,
      blueprint,
      currentQuestionIndex: 0,
      totalQuestions: blueprint.questionCount,
      answers,
      integritySignals: [],
      startedAt: new Date().toISOString(),
      totalPausedSeconds: 0,
      updatedAt: new Date().toISOString(),
    };

    this.saveSessionLocally(session);
    this.syncSessionRemote(session);
    return session;
  },

  getSession(sessionId: string): MockInterviewSession | null {
    try {
      const raw = localStorage.getItem(`${LOCAL_SESSION_PREFIX}${sessionId}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  },

  getActiveSessionId(): string | null {
    try {
      return localStorage.getItem(LOCAL_ACTIVE_SESSION_ID);
    } catch {
      return null;
    }
  },

  setActiveSessionId(sessionId: string) {
    try {
      localStorage.setItem(LOCAL_ACTIVE_SESSION_ID, sessionId);
    } catch {}
  },

  saveSessionLocally(session: MockInterviewSession) {
    try {
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(`${LOCAL_SESSION_PREFIX}${session.id}`, JSON.stringify(session));
      localStorage.setItem(LOCAL_ACTIVE_SESSION_ID, session.id);
    } catch {}
  },

  updateSessionState(sessionId: string, nextState: MockInterviewSession['state']): MockInterviewSession | null {
    const s = this.getSession(sessionId);
    if (!s) return null;

    s.state = nextState;
    if (nextState === 'PAUSED') {
      s.pausedAt = new Date().toISOString();
    } else if (nextState === 'IN_PROGRESS' && s.pausedAt) {
      const pauseDuration = Math.round((Date.now() - new Date(s.pausedAt).getTime()) / 1000);
      s.totalPausedSeconds += pauseDuration;
      s.pausedAt = undefined;
    } else if (nextState === 'COMPLETED') {
      s.completedAt = new Date().toISOString();
    }

    this.saveSessionLocally(s);
    this.syncSessionRemote(s);
    return s;
  },

  saveAnswer(sessionId: string, answer: InterviewAnswer): MockInterviewSession | null {
    const s = this.getSession(sessionId);
    if (!s) return null;

    const idx = s.answers.findIndex(a => a.id === answer.id || a.questionNumber === answer.questionNumber);
    if (idx !== -1) {
      s.answers[idx] = answer;
    } else {
      s.answers.push(answer);
    }

    this.saveSessionLocally(s);
    this.syncSessionRemote(s);
    return s;
  },

  appendAdaptiveNextQuestion(sessionId: string, nextQuestion: MockQuestion): MockInterviewSession | null {
    const s = this.getSession(sessionId);
    if (!s) return null;

    const nextIndex = s.answers.length;
    const nextAns: InterviewAnswer = {
      id: `ans_${sessionId}_q${nextIndex + 1}`,
      sessionId,
      questionId: nextQuestion.id,
      questionNumber: nextIndex + 1,
      question: nextQuestion,
      mode: (nextQuestion.questionType === 'Programming' || nextQuestion.questionType === 'Machine Coding') ? 'code' : 'speech',
      status: 'UNANSWERED',
      timeSpentSeconds: 0,
      startedAt: new Date().toISOString(),
    };

    s.answers.push(nextAns);
    s.currentQuestionIndex = nextIndex;
    this.saveSessionLocally(s);
    this.syncSessionRemote(s);
    return s;
  },

  recordIntegritySignal(sessionId: string, type: MockInterviewSession['integritySignals'][0]['type'], details?: string) {
    const s = this.getSession(sessionId);
    if (!s) return;

    s.integritySignals.push({
      type,
      timestamp: new Date().toISOString(),
      details,
    });
    this.saveSessionLocally(s);
  },

  async syncSessionRemote(session: MockInterviewSession) {
    try {
      if (!supabase) return;
      await supabase.from('mock_interview_sessions').upsert({
        id: session.id,
        user_id: session.userId !== 'anonymous_candidate' ? session.userId : null,
        state: session.state,
        config: session.config,
        blueprint: session.blueprint,
        current_question_index: session.currentQuestionIndex,
        total_questions: session.totalQuestions,
        integrity_signals: session.integritySignals,
        total_paused_seconds: session.totalPausedSeconds,
        started_at: session.startedAt,
        paused_at: session.pausedAt,
        completed_at: session.completedAt,
        updated_at: session.updatedAt,
      });
    } catch {
      // Graceful offline fallback
    }
  },

  getAllLocalSessions(): MockInterviewSession[] {
    const list: MockInterviewSession[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LOCAL_SESSION_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            try {
              list.push(JSON.parse(raw));
            } catch {}
          }
        }
      }
    } catch {}
    return list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  },
};

