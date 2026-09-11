import type {
  MockInterviewSession,
  CandidateSetupConfig,
  InterviewAnswer,
  MockQuestion,
} from '../types/mock.types';
import { blueprintService } from './blueprintService';
import { getMockQuestionById } from '../data/questionBankRegistry';
import { mockPersistenceService, newUuid, type PersistResult } from './mockPersistenceService';

const LOCAL_SESSION_PREFIX = 'ai_video_mock_session_';
const LOCAL_ACTIVE_SESSION_ID = 'ai_video_mock_active_id';

export const mockSessionService = {
  createSession(userId: string, config: CandidateSetupConfig): MockInterviewSession {
    // UUID session ids: required by mock_interview_sessions.id (UUID PK).
    const sessionId = newUuid();
    const blueprint = blueprintService.generateBlueprint(sessionId, config);

    // Prepare answer placeholders for all reserved questions
    const answers: InterviewAnswer[] = blueprint.reservedQuestionIds.map((qId, index) => {
      const q = getMockQuestionById(qId)!;
      return {
        id: newUuid(),
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
      id: newUuid(),
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

  async syncSessionRemote(session: MockInterviewSession): Promise<PersistResult> {
    // Supabase-first; structured result (never silently swallowed by callers that check it).
    // Local copy is always written separately via saveSessionLocally.
    return mockPersistenceService.saveSession(session);
  },

  /** Local-first read with Supabase fallback (refresh-proof). Caches remote locally. */
  async getSessionWithRemote(sessionId: string): Promise<MockInterviewSession | null> {
    const local = this.getSession(sessionId);
    if (local) return local;
    const remote = await mockPersistenceService.fetchSessionFull(sessionId);
    if (remote) this.saveSessionLocally(remote);
    return remote;
  },

  /** History: cloud sessions merged over local ones (dedupe by id, cloud wins ties). */
  async listSessionsMerged(userId: string): Promise<MockInterviewSession[]> {
    const local = this.getAllLocalSessions();
    let remote: MockInterviewSession[] = [];
    try {
      const partials = await mockPersistenceService.listUserSessions(userId);
      const full = await Promise.all(
        partials.map(async p => {
          if (p.answers && p.answers.length > 0 && (p as MockInterviewSession).config) {
            return p as MockInterviewSession;
          }
          return (await mockPersistenceService.fetchSessionFull(p.id)) || (p as MockInterviewSession);
        })
      );
      remote = full;
    } catch {}
    const merged = new Map<string, MockInterviewSession>();
    for (const s of local) merged.set(s.id, s);
    for (const s of remote) {
      const prev = merged.get(s.id);
      if (!prev || String(s.updatedAt || '') >= String(prev.updatedAt || '')) {
        merged.set(s.id, s);
        try {
          this.saveSessionLocally(s);
        } catch {}
      }
    }
    return [...merged.values()].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
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

