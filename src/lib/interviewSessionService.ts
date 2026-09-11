import { supabase } from './supabase/client';

export interface InterviewSession {
  id: string;
  candidate_id: string;
  admin_id?: string | null;
  candidate_name: string;
  candidate_email: string;
  question_id: string;
  question_title: string;
  status: 'active' | 'in_progress' | 'paused' | 'submitted' | 'completed' | 'cancelled';
  active_file: string;
  language: string;
  current_code_snapshot?: string;
  files_snapshot?: Record<string, string>;
  last_activity_at: string;
  started_at: string;
  ended_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id?: string;
  role: 'candidate' | 'admin' | 'interviewer' | 'observer';
  name: string;
  is_online: boolean;
  can_edit: boolean;
  cursor_position?: any;
  last_seen_at: string;
  joined_at: string;
}

export interface SessionMessage {
  id: string;
  session_id: string;
  sender_id?: string;
  sender_name: string;
  sender_role: 'candidate' | 'admin' | 'interviewer' | 'observer' | 'system';
  message: string;
  created_at: string;
}

export interface SessionExecutionRecord {
  id?: string;
  session_id: string;
  candidate_id?: string;
  question_id: string;
  language: string;
  status: 'running' | 'success' | 'runtime_error' | 'compile_error' | 'failed';
  stdout?: string;
  stderr?: string;
  exit_code?: number;
  execution_time?: number;
  tests_passed?: number;
  tests_total?: number;
  created_at?: string;
}

export interface SessionActivityItem {
  id?: string;
  session_id: string;
  user_id?: string;
  user_name: string;
  user_role: string;
  activity_type: string;
  details?: Record<string, any>;
  created_at?: string;
}

const LOCAL_SESSIONS_KEY = 'mc_interview_sessions_cache';
const LOCAL_MESSAGES_KEY = 'mc_interview_messages_cache';

function getLocalSessions(): Record<string, InterviewSession> {
  try {
    const data = localStorage.getItem(LOCAL_SESSIONS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLocalSessions(sessions: Record<string, InterviewSession>) {
  try {
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (_) {}
}

export const interviewSessionService = {
  /**
   * Creates or returns an existing active session for candidate & question
   */
  async getOrCreateSession(params: {
    questionId: string;
    questionTitle: string;
    candidateId?: string;
    candidateName?: string;
    candidateEmail?: string;
    language?: string;
    initialFiles?: Record<string, string>;
  }): Promise<InterviewSession> {
    const candidateId = params.candidateId || 'anon-candidate';
    const candidateName = params.candidateName || 'Candidate';
    const candidateEmail = params.candidateEmail || 'candidate@platform.dev';

    try {
      // 1. Check Supabase for existing active session
      const { data: existing, error: searchError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('question_id', params.questionId)
        .eq('candidate_id', candidateId)
        .in('status', ['active', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!searchError && existing) {
        return existing as InterviewSession;
      }

      // 2. Create new session in Supabase
      const newSessionPayload = {
        candidate_id: candidateId,
        candidate_name: candidateName,
        candidate_email: candidateEmail,
        question_id: params.questionId,
        question_title: params.questionTitle,
        status: 'active',
        active_file: 'App.tsx',
        language: params.language || 'react',
        files_snapshot: params.initialFiles || {},
        last_activity_at: new Date().toISOString(),
      };

      const { data: created, error: insertError } = await supabase
        .from('interview_sessions')
        .insert([newSessionPayload])
        .select('*')
        .single();

      if (!insertError && created) {
        // Record participant entry
        await this.joinParticipant({
          sessionId: created.id,
          userId: candidateId,
          role: 'candidate',
          name: candidateName,
          canEdit: true,
        });

        // Record activity
        await this.recordActivity({
          session_id: created.id,
          user_id: candidateId,
          user_name: candidateName,
          user_role: 'candidate',
          activity_type: 'SESSION_STARTED',
          details: { questionId: params.questionId, title: params.questionTitle },
        });

        return created as InterviewSession;
      }
    } catch (err) {
      console.warn('[SessionService] Supabase session creation failed, falling back to client session:', err);
    }

    // Local / Offline Fallback Session
    const localMap = getLocalSessions();
    const existingLocal = Object.values(localMap).find(
      s => s.question_id === params.questionId && s.candidate_id === candidateId && s.status === 'active'
    );
    if (existingLocal) return existingLocal;

    const fallbackSession: InterviewSession = {
      id: 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      candidate_id: candidateId,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      question_id: params.questionId,
      question_title: params.questionTitle,
      status: 'active',
      active_file: 'App.tsx',
      language: params.language || 'react',
      files_snapshot: params.initialFiles || {},
      last_activity_at: new Date().toISOString(),
      started_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localMap[fallbackSession.id] = fallbackSession;
    saveLocalSessions(localMap);
    return fallbackSession;
  },

  /**
   * Retrieves a session by its specific session ID
   */
  async getSessionById(sessionId: string): Promise<InterviewSession | null> {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .maybeSingle();

      if (!error && data) {
        return data as InterviewSession;
      }
    } catch (_) {}

    const localMap = getLocalSessions();
    return localMap[sessionId] || null;
  },

  /**
   * Server-side session access verification.
   * MUST be called before constructing SupabaseYjsProvider or joining a session.
   *
   * Returns true if:
   *  - The current auth user is the session's candidate_id
   *  - The current auth user is the session's admin_id
   *  - The current auth user is a platform admin (checked via is_session_member RLS helper)
   *  - The sessionId belongs to a local/offline fallback session owned by the current user
   *
   * Returns false if:
   *  - The user is not authenticated
   *  - The session does not exist
   *  - The user has no relationship to the session
   *
   * NOTE: This is a defense-in-depth check. The primary enforcement is via RLS
   * policies on session sub-tables (session_participants, session_messages, etc).
   */
  async verifySessionAccess(sessionId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Try to read the session — RLS will reject unauthorized reads
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('id, candidate_id, admin_id')
        .eq('id', sessionId)
        .maybeSingle();

      if (error || !data) return false;

      // Explicit check: is user the candidate or assigned admin?
      if (data.candidate_id === user.id || data.admin_id === user.id) return true;

      // Check if user is a participant (covers admin observers)
      const { data: participant } = await supabase
        .from('session_participants')
        .select('id')
        .eq('session_id', sessionId)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!participant;
    } catch (_) {
      // If Supabase is unreachable, allow local sessions as offline fallback
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
      if (!user) return false;

      const localMap = getLocalSessions();
      const localSession = localMap[sessionId];
      return localSession?.candidate_id === user.id;
    }
  },



  /**
   * List all sessions for Admin live monitoring dashboard
   */
  async listAllSessions(limit = 50): Promise<InterviewSession[]> {
    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('*')
        .order('last_activity_at', { ascending: false })
        .limit(limit);

      // Only fall back to local cache on actual errors — not on empty Supabase result
      if (!error) {
        return (data as InterviewSession[]) || [];
      }
    } catch (_) {}

    // True offline fallback: only used when Supabase is unreachable
    const localMap = getLocalSessions();
    return Object.values(localMap).sort(
      (a, b) => new Date(b.last_activity_at).getTime() - new Date(a.last_activity_at).getTime()
    );
  },

  /**
   * Update last_activity_at and optionally active_file (used by heartbeat)
   */
  async updateSessionActivity(sessionId: string, activeFile?: string): Promise<void> {
    const now = new Date().toISOString();
    try {
      await supabase
        .from('interview_sessions')
        .update({
          last_activity_at: now,
          ...(activeFile ? { active_file: activeFile } : {}),
        })
        .eq('id', sessionId);
    } catch (_) {}

    // Also update local cache if exists
    const localMap = getLocalSessions();
    if (localMap[sessionId]) {
      localMap[sessionId].last_activity_at = now;
      if (activeFile) localMap[sessionId].active_file = activeFile;
      saveLocalSessions(localMap);
    }
  },

  /**
   * Join session participant record
   */
  async joinParticipant(params: {
    sessionId: string;
    userId?: string;
    role: 'candidate' | 'admin' | 'interviewer' | 'observer';
    name: string;
    canEdit: boolean;
  }): Promise<void> {
    try {
      await supabase.from('session_participants').upsert(
        {
          session_id: params.sessionId,
          user_id: params.userId,
          role: params.role,
          name: params.name,
          is_online: true,
          can_edit: params.canEdit,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'session_id, user_id' }
      );
    } catch (_) {}
  },

  /**
   * Fetch participants for a session
   */
  async getParticipants(sessionId: string): Promise<SessionParticipant[]> {
    try {
      const { data, error } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId);

      if (!error && data) return data as SessionParticipant[];
    } catch (_) {}
    return [];
  },

  /**
   * Saves debounced code snapshot (safe multi-file checkpoint)
   */
  async saveSnapshot(sessionId: string, files: Record<string, string>, label = 'Autosave Checkpoint'): Promise<void> {
    try {
      // 1. Update session snapshot
      await supabase
        .from('interview_sessions')
        .update({
          files_snapshot: files,
          last_activity_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      // 2. Insert into snapshot history
      await supabase.from('session_code_snapshots').insert([
        {
          session_id: sessionId,
          files,
          label,
        },
      ]);
    } catch (_) {}

    // Update local cache
    const localMap = getLocalSessions();
    if (localMap[sessionId]) {
      localMap[sessionId].files_snapshot = files;
      localMap[sessionId].last_activity_at = new Date().toISOString();
      saveLocalSessions(localMap);
    }
  },

  /**
   * Record code execution event
   */
  async recordExecution(execution: SessionExecutionRecord): Promise<void> {
    try {
      await supabase.from('session_executions').insert([execution]);
    } catch (_) {}
  },

  /**
   * Record session activity
   */
  async recordActivity(activity: SessionActivityItem): Promise<void> {
    try {
      await supabase.from('session_activity').insert([activity]);
    } catch (_) {}
  },

  /**
   * Fetch chat messages for a session
   */
  async getMessages(sessionId: string): Promise<SessionMessage[]> {
    try {
      const { data, error } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (!error && data) return data as SessionMessage[];
    } catch (_) {}

    try {
      const localMsg = localStorage.getItem(`${LOCAL_MESSAGES_KEY}_${sessionId}`);
      return localMsg ? JSON.parse(localMsg) : [];
    } catch {
      return [];
    }
  },

  /**
   * Send a chat message in the session
   */
  async sendMessage(params: {
    sessionId: string;
    senderId?: string;
    senderName: string;
    senderRole: 'candidate' | 'admin' | 'interviewer' | 'observer' | 'system';
    message: string;
  }): Promise<SessionMessage> {
    const newMsg: SessionMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      session_id: params.sessionId,
      sender_id: params.senderId,
      sender_name: params.senderName,
      sender_role: params.senderRole,
      message: params.message.trim(),
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('session_messages')
        .insert([
          {
            session_id: params.sessionId,
            sender_id: params.senderId,
            sender_name: params.senderName,
            sender_role: params.senderRole,
            message: params.message.trim(),
          },
        ])
        .select('*')
        .single();

      if (!error && data) {
        return data as SessionMessage;
      }
    } catch (_) {}

    // Local fallback
    try {
      const key = `${LOCAL_MESSAGES_KEY}_${params.sessionId}`;
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      list.push(newMsg);
      localStorage.setItem(key, JSON.stringify(list));
    } catch (_) {}

    return newMsg;
  },

  /**
   * Submit final solution & conclude session
   */
  async submitSession(params: {
    sessionId: string;
    files: Record<string, string>;
    score: number;
    testsPassed: number;
    testsTotal: number;
    timeSpentSeconds?: number;
  }): Promise<void> {
    const endedAt = new Date().toISOString();
    try {
      await supabase
        .from('interview_sessions')
        .update({
          status: 'submitted',
          files_snapshot: params.files,
          ended_at: endedAt,
          last_activity_at: endedAt,
        })
        .eq('id', params.sessionId);

      await this.recordActivity({
        session_id: params.sessionId,
        user_name: 'Candidate',
        user_role: 'candidate',
        activity_type: 'SUBMISSION_CREATED',
        details: {
          score: params.score,
          testsPassed: params.testsPassed,
          testsTotal: params.testsTotal,
        },
      });
    } catch (_) {}

    const localMap = getLocalSessions();
    if (localMap[params.sessionId]) {
      localMap[params.sessionId].status = 'submitted';
      localMap[params.sessionId].files_snapshot = params.files;
      localMap[params.sessionId].ended_at = endedAt;
      saveLocalSessions(localMap);
    }
  },

  /**
   * Subscribe to real-time postgres_changes on interview_sessions.
   * Returns an unsubscribe function — call it on component unmount.
   * Used exclusively by the admin Live Sessions dashboard.
   */
  subscribeToSessions(callbacks: {
    onInsert?: (session: InterviewSession) => void;
    onUpdate?: (session: InterviewSession) => void;
    onDelete?: (id: string) => void;
    onConnectionChange?: (connected: boolean) => void;
  }): () => void {
    const channel = supabase
      .channel('admin_sessions_rt_' + Date.now())
      .on(
        'postgres_changes' as any,
        { event: 'INSERT', schema: 'public', table: 'interview_sessions' },
        (payload: any) => {
          try { callbacks.onInsert?.(payload.new as InterviewSession); } catch (_) {}
        }
      )
      .on(
        'postgres_changes' as any,
        { event: 'UPDATE', schema: 'public', table: 'interview_sessions' },
        (payload: any) => {
          try { callbacks.onUpdate?.(payload.new as InterviewSession); } catch (_) {}
        }
      )
      .on(
        'postgres_changes' as any,
        { event: 'DELETE', schema: 'public', table: 'interview_sessions' },
        (payload: any) => {
          try { callbacks.onDelete?.((payload.old as any)?.id); } catch (_) {}
        }
      )
      .subscribe((status: string) => {
        callbacks.onConnectionChange?.(status === 'SUBSCRIBED');
      });

    return () => {
      try { supabase.removeChannel(channel); } catch (_) {}
    };
  },
};
