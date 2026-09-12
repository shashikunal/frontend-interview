import { supabase } from '../../src/lib/supabase/client.js';
import type { SessionStatePayload, StudentCodeChangeEvent } from './types.js';

// In-memory ephemeral state cache (for fast sub-millisecond keystroke relays)
const sessionStateCache = new Map<string, SessionStatePayload>();

// Debounced database snapshot timers
const dbCheckpointTimers = new Map<string, ReturnType<typeof setTimeout>>();
const CHECKPOINT_DELAY_MS = 10 * 1000; // 10s debounced DB save

export const sessionStateManager = {
  /**
   * Retrieves current session state.
   * If not found in memory (e.g. new instance), hydrates from Supabase.
   */
  async getState(sessionId: string): Promise<SessionStatePayload | null> {
    const cached = sessionStateCache.get(sessionId);
    if (cached) return cached;

    // Hydrate from Supabase
    try {
      const { data: sess, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (!error && sess) {
        const file = sess.active_file || 'solution.js';
        const fileCode = sess.files_snapshot?.[file] || sess.current_code_snapshot || '';

        const hydrated: SessionStatePayload = {
          sessionId: sess.id,
          candidateId: sess.candidate_id || '',
          candidateName: sess.candidate_name || 'Candidate',
          questionId: sess.question_id || '',
          questionTitle: sess.question_title || '',
          activeFile: file,
          language: sess.language || 'javascript',
          code: fileCode,
          cursor: null,
          isTyping: false,
          presence: sess.status === 'active' || sess.status === 'in_progress' ? 'online' : 'disconnected',
          lastExecution: null,
          activityHistory: [],
          codeVersion: 1,
          startedAt: sess.started_at || sess.created_at,
          lastActivityAt: new Date(sess.last_activity_at || sess.created_at).getTime(),
        };

        sessionStateCache.set(sessionId, hydrated);
        return hydrated;
      }
    } catch (_) {}

    return null;
  },

  /**
   * Initializes or updates session state when candidate joins
   */
  initOrUpdate(state: Partial<SessionStatePayload> & { sessionId: string }): SessionStatePayload {
    const current = sessionStateCache.get(state.sessionId);
    const updated: SessionStatePayload = {
      sessionId: state.sessionId,
      candidateId: state.candidateId ?? current?.candidateId ?? '',
      candidateName: state.candidateName ?? current?.candidateName ?? 'Candidate',
      questionId: state.questionId ?? current?.questionId ?? '',
      questionTitle: state.questionTitle ?? current?.questionTitle ?? '',
      activeFile: state.activeFile ?? current?.activeFile ?? 'solution.js',
      language: state.language ?? current?.language ?? 'javascript',
      code: state.code ?? current?.code ?? '',
      cursor: state.cursor !== undefined ? state.cursor : (current?.cursor ?? null),
      isTyping: state.isTyping ?? current?.isTyping ?? false,
      presence: state.presence ?? current?.presence ?? 'online',
      lastExecution: state.lastExecution !== undefined ? state.lastExecution : (current?.lastExecution ?? null),
      activityHistory: state.activityHistory ?? current?.activityHistory ?? [],
      codeVersion: (current?.codeVersion ?? 0) + 1,
      startedAt: state.startedAt ?? current?.startedAt ?? new Date().toISOString(),
      lastActivityAt: state.lastActivityAt ?? Date.now(),
    };

    sessionStateCache.set(state.sessionId, updated);
    return updated;
  },

  /**
   * Updates code from candidate keystrokes and schedules a debounced DB checkpoint
   */
  updateCode(event: StudentCodeChangeEvent): SessionStatePayload {
    const current = sessionStateCache.get(event.sessionId);
    const updated: SessionStatePayload = {
      ...(current || {
        sessionId: event.sessionId,
        candidateId: '',
        candidateName: 'Candidate',
        questionId: '',
        startedAt: new Date().toISOString(),
        activityHistory: [],
      }),
      activeFile: event.fileId || current?.activeFile || 'solution.js',
      language: event.language || current?.language || 'javascript',
      code: event.code,
      cursor: event.cursor || current?.cursor || null,
      isTyping: true,
      presence: 'online',
      codeVersion: event.version || (current?.codeVersion || 0) + 1,
      lastActivityAt: event.timestamp || Date.now(),
    };

    sessionStateCache.set(event.sessionId, updated);

    // Schedule debounced checkpoint to Postgres
    this.scheduleCheckpoint(event.sessionId, updated);
    return updated;
  },

  /**
   * Debounced durable checkpoint save to Supabase
   */
  scheduleCheckpoint(sessionId: string, state: SessionStatePayload) {
    if (dbCheckpointTimers.has(sessionId)) {
      clearTimeout(dbCheckpointTimers.get(sessionId)!);
    }

    const timer = setTimeout(async () => {
      dbCheckpointTimers.delete(sessionId);
      try {
        await supabase
          .from('interview_sessions')
          .update({
            current_code_snapshot: state.code,
            active_file: state.activeFile,
            last_activity_at: new Date(state.lastActivityAt).toISOString(),
            files_snapshot: { [state.activeFile]: state.code },
          })
          .eq('id', sessionId);
      } catch (err) {
        console.warn(`[Socket.IO Checkpoint] Error saving snapshot for ${sessionId}:`, err);
      }
    }, CHECKPOINT_DELAY_MS);

    dbCheckpointTimers.set(sessionId, timer);
  },

  /**
   * Records an activity item in the session state history
   */
  recordActivity(sessionId: string, type: string, message: string, timestamp: number = Date.now()) {
    const current = sessionStateCache.get(sessionId);
    if (!current) return;

    const newItem = {
      id: `act_${timestamp}_${Math.random().toString(36).slice(2, 6)}`,
      type,
      message,
      timestamp,
    };

    current.activityHistory = [newItem, ...current.activityHistory.slice(0, 49)];
    current.lastActivityAt = timestamp;
  },

  /**
   * Sets presence status (online, idle, disconnected)
   */
  setPresence(sessionId: string, presence: SessionStatePayload['presence']) {
    const current = sessionStateCache.get(sessionId);
    if (current) {
      current.presence = presence;
      current.lastActivityAt = Date.now();
    }
  },
};
