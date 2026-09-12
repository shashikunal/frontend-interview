import * as Y from 'yjs';
import { supabase } from '../../src/lib/supabase/client.js';
import type { SessionStatePayload, StudentCodeChangeEvent } from './types.js';

// In-memory ephemeral state cache (for fast sub-millisecond keystroke relays)
const sessionStateCache = new Map<string, SessionStatePayload>();

// In-memory Yjs Documents per session room
const sessionYDocs = new Map<string, Y.Doc>();

// Debounced database snapshot timers
const dbCheckpointTimers = new Map<string, ReturnType<typeof setTimeout>>();
const CHECKPOINT_DELAY_MS = 10 * 1000; // 10s debounced DB save

function toUint8Array(data: any): Uint8Array {
  if (data instanceof Uint8Array) return data;
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (data?.buffer instanceof ArrayBuffer) {
    return new Uint8Array(data.buffer, data.byteOffset || 0, data.byteLength || data.buffer.byteLength);
  }
  if (Array.isArray(data)) return new Uint8Array(data);
  if (typeof data === 'string') {
    try {
      const bin = Buffer.from(data, 'base64');
      return new Uint8Array(bin.buffer, bin.byteOffset, bin.byteLength);
    } catch (_) {}
  }
  return new Uint8Array(data || []);
}

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

  /**
   * Retrieves or initializes the Y.Doc for a given session room
   */
  getOrCreateYDoc(sessionId: string, initialCode?: string, activeFile: string = 'solution.js'): Y.Doc {
    let ydoc = sessionYDocs.get(sessionId);
    if (!ydoc) {
      ydoc = new Y.Doc();
      sessionYDocs.set(sessionId, ydoc);
    }

    if (initialCode && initialCode.trim().length > 0) {
      const ytext = ydoc.getText(activeFile);
      if (ytext.length === 0) {
        ytext.insert(0, initialCode);
      }
    }

    return ydoc;
  },

  /**
   * Applies an incremental Yjs binary update received from a client to the server Y.Doc
   */
  applyYjsUpdate(sessionId: string, update: Uint8Array | number[], fileId: string = 'solution.js'): { code: string; length: number } {
    const ydoc = this.getOrCreateYDoc(sessionId);
    const uint8 = toUint8Array(update);
    try {
      Y.applyUpdate(ydoc, uint8, 'remote');
    } catch (err) {
      console.warn(`[Yjs Server] Error applying update on session ${sessionId}:`, err);
    }

    const currentCode = ydoc.getText(fileId).toString();
    const current = sessionStateCache.get(sessionId);
    if (current) {
      current.code = currentCode;
      current.activeFile = fileId;
      current.isTyping = true;
      current.lastActivityAt = Date.now();
      current.codeVersion = (current.codeVersion || 0) + 1;
      this.scheduleCheckpoint(sessionId, current);
    }

    return { code: currentCode, length: currentCode.length };
  },

  /**
   * Encodes the current Y.Doc state (or state vector diff) as a single update for synchronization
   */
  getYDocState(sessionId: string, initialCode?: string, activeFile: string = 'solution.js', stateVector?: Uint8Array | number[]): Uint8Array {
    const ydoc = this.getOrCreateYDoc(sessionId, initialCode, activeFile);
    const sv = stateVector ? toUint8Array(stateVector) : undefined;
    return Y.encodeStateAsUpdate(ydoc, sv);
  },

  /**
   * Reads the current string content of a file from the session's Y.Doc
   */
  getYDocText(sessionId: string, fileId: string = 'solution.js'): string {
    const ydoc = sessionYDocs.get(sessionId);
    if (!ydoc) return '';
    return ydoc.getText(fileId).toString();
  },
};
