import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase/client';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import { resolveDisplayName } from '../../../lib/leaderboardService';
import { VirtualStudentMonitor, type LiveStudentTelemetry } from './VirtualStudentMonitor';
import './AdminLiveSessionsTab.css';

/* ─── Presence thresholds (honest recency bands) ─────────────────────────── */
const STALE_AFTER_MS = 60 * 1000; // quiet 60s -> Idle
const GONE_AFTER_MS = 15 * 60 * 1000; // quiet 15m -> Disconnected

/* ─── Track badge derived strictly from real question_id prefix ─────────── */
function trackOf(questionId?: string | null): { label: string; kind: string } {
  const u = String(questionId || '').toUpperCase();
  if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return { label: 'Core Programming', kind: 'cp' };
  if (u.startsWith('DSA')) return { label: 'DSA Masterclass', kind: 'dsa' };
  if (u.startsWith('FJP')) return { label: 'Frontend JS', kind: 'fjs' };
  if (u.startsWith('Q') || u.startsWith('MC')) return { label: 'Machine Coding', kind: 'mc' };
  if (/^\d+$/.test(u)) return { label: 'Quiz Bank', kind: 'quiz' };
  return { label: 'Studio', kind: 'other' };
}

interface ActivityEvent {
  id: string;
  type: string;
  message: string;
  timestamp: number;
}

const MAX_ACTIVITY = 15;

function relTime(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 4) return 'just now';
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function monitorPath(session: InterviewSession): string {
  const qid = String(session.question_id || '');
  const u = qid.toUpperCase();
  const suffix = `?session=${session.id}&role=admin`;
  if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return `/core-programming/question/${qid}${suffix}`;
  if (u.startsWith('DSA')) return `/dsa/question/${qid}${suffix}`;
  if (u.startsWith('FJP')) return `/frontend-javascript/question/${qid}${suffix}`;
  return `/machine-coding?id=${qid}&session=${session.id}&role=admin`;
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function AdminLiveSessionsTab() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [viewMode, setViewMode] = useState<'vsm' | 'compact' | 'all'>('vsm');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Per-session live telemetry
  const [telemetryMap, setTelemetryMap] = useState<Record<string, LiveStudentTelemetry>>({});
  
  // Inspection Modal state
  const [inspectSession, setInspectSession] = useState<InterviewSession | null>(null);

  // Roster state
  const [roster, setRoster] = useState<Array<{
    id: string;
    name: string;
    email: string;
    lastSeen: string | null;
    lastQuestionId: string | null;
    submissions: number;
  }>>([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [rosterError, setRosterError] = useState<string | null>(null);
  const rosterAttemptedRef = useRef(false);

  const [, setTick] = useState(0); // clock tick for relTime and idle checks

  // References for channels & timers
  const channelsRef = useRef<Map<string, { interviewCh: any; legacyCh?: any }>>(new Map());
  const typingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /* ── Push activity helper ─────────────────────────────────────────────── */
  const pushActivity = useCallback((sessionId: string, event: Omit<ActivityEvent, 'id'>) => {
    setTelemetryMap(prev => {
      const cur = prev[sessionId];
      const existing = cur?.activityHistory || [];
      const updatedHistory = [{ ...event, id: uid() }, ...existing].slice(0, MAX_ACTIVITY);
      return {
        ...prev,
        [sessionId]: {
          ...(cur || {
            isTyping: false,
            activeFile: 'solution.js',
            code: '',
            lineCount: 1,
            cursor: null,
            focused: true,
            presence: 'online',
            lastSeenAt: Date.now(),
            lastExecution: null,
            activityHistory: [],
          }),
          activityHistory: updatedHistory,
        },
      };
    });
  }, []);

  /* ── Subscribe to session real-time channel (interview:${sessionId}) ─── */
  const subscribeToSession = useCallback((session: InterviewSession) => {
    const sessionId = session.id;
    if (channelsRef.current.has(sessionId)) return;

    // Default initial telemetry from persistent session record
    const initialCode = session.current_code_snapshot ||
      (session.files_snapshot ? (session.files_snapshot[session.active_file || ''] || Object.values(session.files_snapshot)[0] || '') : '');

    setTelemetryMap(prev => {
      if (prev[sessionId]) return prev;
      return {
        ...prev,
        [sessionId]: {
          isTyping: false,
          activeFile: session.active_file || 'solution.js',
          code: initialCode,
          lineCount: initialCode ? initialCode.split('\n').length : 1,
          cursor: null,
          focused: true,
          presence: 'online',
          lastSeenAt: new Date(session.last_activity_at || session.created_at).getTime(),
          lastExecution: null,
          activityHistory: [
            {
              id: uid(),
              type: 'joined',
              message: `Session ready — ${session.question_title}`,
              timestamp: new Date(session.started_at || session.created_at).getTime(),
            },
          ],
        },
      };
    });

    // 1. Primary Modern Channel: interview:${sessionId}
    const interviewCh = supabase.channel(`interview:${sessionId}`, {
      config: { broadcast: { ack: false, self: false }, presence: { key: `admin_${sessionId}` } },
    });

    // Handle Presence
    interviewCh.on('presence', { event: 'sync' }, () => {
      const state = interviewCh.presenceState();
      const hasCandidate = Object.values(state).some((presences: any) =>
        presences.some((p: any) => p.role === 'candidate' || p.status === 'online')
      );
      if (hasCandidate) {
        setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], presence: 'online', lastSeenAt: Date.now() } } : prev);
      }
    });

    interviewCh.on('presence', { event: 'join' }, ({ newPresences }) => {
      const isCandidate = newPresences.some((p: any) => p.role === 'candidate' || p.status === 'online');
      if (isCandidate) {
        setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], presence: 'online', lastSeenAt: Date.now() } } : prev);
        pushActivity(sessionId, { type: 'joined', message: 'Candidate connected', timestamp: Date.now() });
      }
    });

    interviewCh.on('presence', { event: 'leave' }, ({ leftPresences }) => {
      const wasCandidate = leftPresences.some((p: any) => p.role === 'candidate');
      if (wasCandidate) {
        setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], presence: 'disconnected' } } : prev);
        pushActivity(sessionId, { type: 'left', message: 'Candidate disconnected', timestamp: Date.now() });
      }
    });

    // Broadcast: CODE_CHANGED
    interviewCh.on('broadcast', { event: 'CODE_CHANGED' }, ({ payload }: { payload: any }) => {
      setTelemetryMap(prev => {
        const cur = prev[sessionId];
        return {
          ...prev,
          [sessionId]: {
            ...(cur || {
              activeFile: payload?.activeFile || 'solution.js',
              lineCount: 1,
              focused: true,
              lastExecution: null,
              activityHistory: [],
            }),
            code: payload?.code ?? cur?.code ?? '',
            lineCount: payload?.lineCount ?? (payload?.code ? payload.code.split('\n').length : cur?.lineCount || 1),
            activeFile: payload?.activeFile || cur?.activeFile || 'solution.js',
            cursor: payload?.cursor || cur?.cursor || null,
            presence: 'online',
            lastSeenAt: Date.now(),
            isTyping: true,
          },
        };
      });

      // Clear typing indicator after 2s silence
      const timer = typingTimersRef.current.get(sessionId);
      if (timer) clearTimeout(timer);
      typingTimersRef.current.set(
        sessionId,
        setTimeout(() => {
          setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], isTyping: false } } : prev);
        }, 2000)
      );
    });

    // Broadcast: TYPING_STARTED
    interviewCh.on('broadcast', { event: 'TYPING_STARTED' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], isTyping: true, presence: 'online', lastSeenAt: Date.now() } } : prev);
    });

    // Broadcast: TYPING_STOPPED
    interviewCh.on('broadcast', { event: 'TYPING_STOPPED' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], isTyping: false } } : prev);
    });

    // Broadcast: CURSOR_MOVED
    interviewCh.on('broadcast', { event: 'CURSOR_MOVED' }, ({ payload }: { payload: any }) => {
      const line = Number(payload?.line);
      const column = Number(payload?.column);
      if (Number.isFinite(line) && Number.isFinite(column)) {
        setTelemetryMap(prev => prev[sessionId] ? {
          ...prev,
          [sessionId]: {
            ...prev[sessionId],
            cursor: { line, column, at: Date.now() },
            presence: 'online',
            lastSeenAt: Date.now(),
          },
        } : prev);
      }
    });

    // Broadcast: EDITOR_FOCUSED / BLURRED
    interviewCh.on('broadcast', { event: 'EDITOR_FOCUSED' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], focused: true, presence: 'online', lastSeenAt: Date.now() } } : prev);
    });
    interviewCh.on('broadcast', { event: 'EDITOR_BLURRED' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], focused: false } } : prev);
    });

    // Broadcast: TEST_STARTED
    interviewCh.on('broadcast', { event: 'TEST_STARTED' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? {
        ...prev,
        [sessionId]: {
          ...prev[sessionId],
          lastExecution: { status: 'running', timestamp: Date.now() },
          presence: 'online',
          lastSeenAt: Date.now(),
        },
      } : prev);
      pushActivity(sessionId, { type: 'execution', message: 'Running test cases…', timestamp: Date.now() });
    });

    // Broadcast: TEST_COMPLETED
    interviewCh.on('broadcast', { event: 'TEST_COMPLETED' }, ({ payload }: { payload: any }) => {
      const exec = {
        status: (payload?.status === 'success' ? 'success' : 'failed') as 'success' | 'failed',
        passed: payload?.passed ?? 0,
        total: payload?.total ?? 0,
        runtimeMs: payload?.runtimeMs ?? 0,
        error: payload?.error,
        timestamp: Date.now(),
      };
      setTelemetryMap(prev => prev[sessionId] ? {
        ...prev,
        [sessionId]: {
          ...prev[sessionId],
          lastExecution: exec,
          presence: 'online',
          lastSeenAt: Date.now(),
        },
      } : prev);
      pushActivity(sessionId, {
        type: 'execution',
        message: exec.status === 'success'
          ? `Passed all ${exec.total} tests (${exec.runtimeMs}ms)`
          : `Failed: ${exec.passed}/${exec.total} passed`,
        timestamp: Date.now(),
      });
    });

    // Broadcast: FILE_OPENED
    interviewCh.on('broadcast', { event: 'FILE_OPENED' }, ({ payload }: { payload: any }) => {
      const file = payload?.activeFile || 'solution.js';
      setTelemetryMap(prev => prev[sessionId] ? {
        ...prev,
        [sessionId]: { ...prev[sessionId], activeFile: file, presence: 'online', lastSeenAt: Date.now() },
      } : prev);
      pushActivity(sessionId, { type: 'file_switch', message: `Switched to ${file}`, timestamp: Date.now() });
    });

    // Broadcast: QUESTION_OPENED
    interviewCh.on('broadcast', { event: 'QUESTION_OPENED' }, ({ payload }: { payload: any }) => {
      pushActivity(sessionId, {
        type: 'question',
        message: `Opened ${payload?.questionTitle || payload?.questionId}`,
        timestamp: Date.now(),
      });
    });

    // Broadcast: ACTIVITY
    interviewCh.on('broadcast', { event: 'ACTIVITY' }, ({ payload }: { payload: any }) => {
      if (payload?.message) {
        pushActivity(sessionId, { type: payload.type || 'activity', message: payload.message, timestamp: Date.now() });
      }
    });

    // Broadcast: SESSION_ENDED
    interviewCh.on('broadcast', { event: 'SESSION_ENDED' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], presence: 'disconnected' } } : prev);
      pushActivity(sessionId, { type: 'ended', message: 'Session completed/ended', timestamp: Date.now() });
    });

    interviewCh.subscribe();

    // 2. Legacy fallback channel (for older studio sessions): session_collab_${sessionId}
    const legacyCh = supabase.channel(`session_collab_${sessionId}`, {
      config: { broadcast: { ack: false, self: false } },
    });

    legacyCh.on('broadcast', { event: 'yjs-update' }, () => {
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], isTyping: true, presence: 'online', lastSeenAt: Date.now() } } : prev);
    });

    legacyCh.on('broadcast', { event: 'execution-event' }, ({ payload }: { payload: any }) => {
      const exec = {
        status: (payload?.status === 'success' ? 'success' : 'failed') as 'success' | 'failed',
        passed: payload?.testsPassed || 0,
        total: payload?.testsTotal || 0,
        timestamp: Date.now(),
      };
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], lastExecution: exec, presence: 'online', lastSeenAt: Date.now() } } : prev);
      pushActivity(sessionId, {
        type: 'execution',
        message: exec.status === 'success' ? `All ${exec.total} tests passed` : `${exec.passed}/${exec.total} tests passed`,
        timestamp: Date.now(),
      });
    });

    legacyCh.on('broadcast', { event: 'file-switch-event' }, ({ payload }: { payload: any }) => {
      const file = payload?.fileName || 'solution.js';
      setTelemetryMap(prev => prev[sessionId] ? { ...prev, [sessionId]: { ...prev[sessionId], activeFile: file, presence: 'online', lastSeenAt: Date.now() } } : prev);
      pushActivity(sessionId, { type: 'file_switch', message: `Switched to ${file}`, timestamp: Date.now() });
    });

    legacyCh.on('broadcast', { event: 'cursor-update' }, ({ payload }: { payload: any }) => {
      const line = Number(payload?.range?.startLineNumber);
      const column = Number(payload?.range?.startColumn);
      if (Number.isFinite(line) && Number.isFinite(column)) {
        setTelemetryMap(prev => prev[sessionId] ? {
          ...prev,
          [sessionId]: { ...prev[sessionId], cursor: { line, column, at: Date.now() }, isTyping: true, presence: 'online', lastSeenAt: Date.now() },
        } : prev);
      }
    });

    legacyCh.subscribe();

    channelsRef.current.set(sessionId, { interviewCh, legacyCh });
  }, [pushActivity]);

  const unsubscribeFromSession = useCallback((sessionId: string) => {
    const entry = channelsRef.current.get(sessionId);
    if (entry) {
      try {
        if (entry.interviewCh) supabase.removeChannel(entry.interviewCh);
        if (entry.legacyCh) supabase.removeChannel(entry.legacyCh);
      } catch (_) {}
      channelsRef.current.delete(sessionId);
    }
    const t = typingTimersRef.current.get(sessionId);
    if (t) {
      clearTimeout(t);
      typingTimersRef.current.delete(sessionId);
    }
  }, []);

  /* ── Initial Load Sessions ─────────────────────────────────────────────── */
  const loadSessions = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    interviewSessionService
      .listAllSessions(100)
      .then(list => {
        setSessions(list);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        setLoadError(err instanceof Error ? err.message : 'Live monitoring unavailable');
      });
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  /* ── Supabase Realtime: Postgres changes on interview_sessions ─────────── */
  useEffect(() => {
    const unsub = interviewSessionService.subscribeToSessions({
      onInsert: session => {
        setSessions(prev => {
          if (prev.find(s => s.id === session.id)) return prev;
          return [session, ...prev];
        });
        subscribeToSession(session);
      },
      onUpdate: session => {
        setSessions(prev => prev.map(s => (s.id === session.id ? session : s)));
        // Update persistent code snapshot in telemetry if candidate did autosave
        if (session.current_code_snapshot) {
          setTelemetryMap(prev => {
            const cur = prev[session.id];
            if (!cur) return prev;
            return {
              ...prev,
              [session.id]: {
                ...cur,
                code: cur.code || session.current_code_snapshot || '',
                activeFile: session.active_file || cur.activeFile,
              },
            };
          });
        }
      },
      onDelete: id => {
        if (!id) return;
        setSessions(prev => prev.filter(s => s.id !== id));
        unsubscribeFromSession(id);
      },
      onConnectionChange: setIsRealtimeConnected,
    });
    return unsub;
  }, [subscribeToSession, unsubscribeFromSession]);

  /* ── Subscribe to all active sessions ─────────────────────────────────── */
  useEffect(() => {
    const activeSessions = sessions.filter(s => s.status === 'active' || s.status === 'in_progress');
    const activeIds = new Set(activeSessions.map(s => s.id));
    activeSessions.forEach(s => subscribeToSession(s));

    // Cleanup channels for completed or removed sessions
    channelsRef.current.forEach((_, id) => {
      if (!activeIds.has(id)) unsubscribeFromSession(id);
    });
  }, [sessions, subscribeToSession, unsubscribeFromSession]);

  /* ── Heartbeat & Idle Checker (every 10s) ──────────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(n => n + 1);

      // Check quiet times across telemetries
      const now = Date.now();
      setTelemetryMap(prev => {
        let changed = false;
        const next = { ...prev };
        Object.entries(next).forEach(([sid, tel]) => {
          if (tel.presence === 'online' && now - tel.lastSeenAt > STALE_AFTER_MS) {
            next[sid] = { ...tel, presence: 'idle' };
            changed = true;
          } else if (tel.presence === 'idle' && now - tel.lastSeenAt > GONE_AFTER_MS) {
            next[sid] = { ...tel, presence: 'disconnected' };
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ── Full Cleanup on Unmount ───────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      channelsRef.current.forEach((_, id) => unsubscribeFromSession(id));
      typingTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, [unsubscribeFromSession]);

  /* ── Roster Loader ─────────────────────────────────────────────────────── */
  const loadRoster = useCallback(async () => {
    setRosterLoading(true);
    setRosterError(null);
    try {
      const [{ data: profs, error: profErr }, subsRes, attRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email').limit(500),
        supabase
          .from('submissions')
          .select('user_id, question_id, created_at')
          .order('created_at', { ascending: false })
          .limit(2000)
          .then(r => r, () => ({ data: [] as any[] })),
        supabase
          .from('question_attempts')
          .select('user_id, question_id, last_activity_at')
          .limit(2000)
          .then(r => r, () => ({ data: [] as any[] })),
      ]);
      if (profErr) throw new Error(profErr.message);
      const agg = new Map<string, { lastSeen: string | null; lastQuestionId: string | null; submissions: number }>();
      for (const s of (subsRes as any).data || []) {
        const uid = String(s.user_id || '');
        if (!uid) continue;
        const cur = agg.get(uid) || { lastSeen: null, lastQuestionId: null, submissions: 0 };
        cur.submissions += 1;
        if (!cur.lastSeen || String(s.created_at) > cur.lastSeen) {
          cur.lastSeen = String(s.created_at);
          cur.lastQuestionId = String(s.question_id || '');
        }
        agg.set(uid, cur);
      }
      for (const a of (attRes as any).data || []) {
        const uid = String(a.user_id || '');
        if (!uid) continue;
        const cur = agg.get(uid) || { lastSeen: null, lastQuestionId: null, submissions: 0 };
        const at = String(a.last_activity_at || '');
        if (at && (!cur.lastSeen || at > cur.lastSeen)) {
          cur.lastSeen = at;
          if (!cur.lastQuestionId) cur.lastQuestionId = String(a.question_id || '');
        }
        agg.set(uid, cur);
      }
      setRoster(
        (profs || []).map((p: any) => {
          const a = agg.get(String(p.id));
          return {
            id: String(p.id),
            name: resolveDisplayName(p.full_name, p.email, String(p.id)),
            email: String(p.email || ''),
            lastSeen: a?.lastSeen || null,
            lastQuestionId: a?.lastQuestionId || null,
            submissions: a?.submissions || 0,
          };
        })
      );
    } catch (err) {
      setRosterError(err instanceof Error ? err.message : 'Roster unavailable');
    } finally {
      setRosterLoading(false);
    }
  }, []);

  const retryRoster = useCallback(() => {
    rosterAttemptedRef.current = true;
    loadRoster();
  }, [loadRoster]);

  useEffect(() => {
    if (viewMode === 'all' && !rosterAttemptedRef.current && !rosterLoading) {
      rosterAttemptedRef.current = true;
      loadRoster();
    }
  }, [viewMode, rosterLoading, loadRoster]);

  /* ── Filtered Sessions Computation ─────────────────────────────────────── */
  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const tel = telemetryMap[s.id];
      const presence = tel?.presence || (s.status === 'active' || s.status === 'in_progress' ? 'online' : 'disconnected');
      const track = trackOf(s.question_id);

      // Track filter
      if (filterTrack !== 'all' && track.kind !== filterTrack) return false;

      // Status filter
      if (filterStatus === 'active') {
        if (s.status !== 'active' && s.status !== 'in_progress') return false;
      } else if (filterStatus === 'live') {
        if (presence !== 'online') return false;
      } else if (filterStatus === 'idle') {
        if (presence !== 'idle') return false;
      } else if (filterStatus === 'disconnected') {
        if (presence !== 'disconnected') return false;
      } else if (filterStatus === 'submitted') {
        if (s.status !== 'submitted' && s.status !== 'completed') return false;
      }

      // Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          s.candidate_name?.toLowerCase().includes(q) ||
          s.candidate_email?.toLowerCase().includes(q) ||
          s.question_title?.toLowerCase().includes(q) ||
          s.question_id?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sessions, telemetryMap, filterStatus, filterTrack, searchQuery]);

  /* ── KPI metrics ───────────────────────────────────────────────────────── */
  const onlineCount = sessions.filter(s => telemetryMap[s.id]?.presence === 'online').length;
  const typingCount = sessions.filter(s => telemetryMap[s.id]?.isTyping).length;
  const idleCount = sessions.filter(s => telemetryMap[s.id]?.presence === 'idle').length;
  const activeCount = sessions.filter(s => s.status === 'active' || s.status === 'in_progress').length;
  const submittedCount = sessions.filter(s => s.status === 'submitted' || s.status === 'completed').length;
  const disconnectedCount = sessions.filter(s => telemetryMap[s.id]?.presence === 'disconnected').length;

  return (
    <div className="admin-live-sessions-tab page-enter">
      {/* 1. Header with Realtime Indicator */}
      <div className="live-sessions-header">
        <div>
          <h2 className="live-sessions-title">
            <span className="live-header-pulse" />
            Live Multi-Student Monitor
          </h2>
          <p className="live-sessions-sub">
            Realtime Virtual Student Monitors stream live code, typing indicators, line numbers, and activity events simultaneously across all tracks.
          </p>
        </div>
        <div className="rt-header-controls">
          <span className={`rt-connected-badge ${isRealtimeConnected ? 'connected' : 'disconnected'}`}>
            {isRealtimeConnected ? '🟢 Supabase Realtime Active' : '🔴 Reconnecting Stream…'}
          </span>
        </div>
      </div>

      {/* 2. KPI Status Strip */}
      <div className="live-kpi-grid">
        <div className="live-kpi-card">
          <span className="live-kpi-label">🟢 Live Now</span>
          <span className="live-kpi-val green">{onlineCount}</span>
          <span className="live-kpi-note">Active on Supabase Realtime</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">⌨️ Typing</span>
          <span className="live-kpi-val orange">{typingCount}</span>
          <span className="live-kpi-note">Live keystrokes streaming</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">🟡 Idle</span>
          <span className="live-kpi-val orange">{idleCount}</span>
          <span className="live-kpi-note">Quiet &gt; 60 seconds</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">▶ In Progress</span>
          <span className="live-kpi-val blue">{activeCount}</span>
          <span className="live-kpi-note">Open interview sessions</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">📤 Submitted</span>
          <span className="live-kpi-val purple">{submittedCount}</span>
          <span className="live-kpi-note">Ready for grading</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">🔴 Disconnected</span>
          <span className="live-kpi-val">{disconnectedCount}</span>
          <span className="live-kpi-note">Presence closed / offline</span>
        </div>
      </div>

      {/* 3. Filter Bar & View Mode Selector */}
      <div className="live-filter-bar">
        <div className="live-search-wrap">
          <input
            type="text"
            placeholder="Search candidate name, email, question, or ID…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="live-search-input"
          />
        </div>

        {/* View Mode */}
        <div className="live-status-pills">
          <button
            type="button"
            className={`live-status-pill ${viewMode === 'vsm' ? 'active' : ''}`}
            onClick={() => setViewMode('vsm')}
            title="Multi-Student Virtual Live Monitors"
          >
            🖥️ Virtual Monitors
          </button>
          <button
            type="button"
            className={`live-status-pill ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => setViewMode('compact')}
            title="Dense List Grid"
          >
            📋 Compact Grid
          </button>
          <button
            type="button"
            className={`live-status-pill ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
            title="All Registered Candidates"
          >
            👥 Candidate Roster{roster.length > 0 ? ` (${roster.length})` : ''}
          </button>
        </div>

        {/* Status Filters */}
        <div className="live-status-pills">
          {[
            { key: 'active', label: 'All Active' },
            { key: 'live', label: '🟢 Live' },
            { key: 'idle', label: '🟡 Idle' },
            { key: 'disconnected', label: '🔴 Offline' },
            { key: 'submitted', label: '✅ Submitted' },
            { key: 'all', label: 'Show All' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`live-status-pill ${filterStatus === key ? 'active' : ''}`}
              onClick={() => setFilterStatus(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Track Filter */}
        <div className="live-status-pills">
          {[
            { key: 'all', label: 'All Tracks' },
            { key: 'cp', label: 'Core Programming' },
            { key: 'dsa', label: 'DSA' },
            { key: 'fjs', label: 'Frontend JS' },
            { key: 'mc', label: 'Machine Coding' },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`live-status-pill ${filterTrack === key ? 'active' : ''}`}
              onClick={() => setFilterTrack(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Body Content */}

      {/* MODE 1: All Candidate Roster */}
      {viewMode === 'all' && (
        rosterLoading ? (
          <div className="live-loading-state">
            <div className="app-route-spinner" />
            <p>Loading candidate roster…</p>
          </div>
        ) : rosterError ? (
          <div className="live-empty-state">
            <span className="empty-state-icon">🔴</span>
            <h3>Roster unavailable</h3>
            <p>{rosterError}</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={retryRoster}>
              Retry →
            </button>
          </div>
        ) : (
          <div>
            <div className="live-roster-toolbar">
              <span className="live-field-val">{roster.length} registered candidates · status merged from active sessions</span>
              <button type="button" className="btn btn-sm btn-secondary" onClick={retryRoster} disabled={rosterLoading}>
                {rosterLoading ? '⏳ Refreshing…' : '🔄 Refresh Roster'}
              </button>
            </div>
            <div className="live-cards-grid">
              {roster
                .filter(u => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
                })
                .map(u => {
                  const liveSess = sessions.find(s => s.candidate_id === u.id && (s.status === 'active' || s.status === 'in_progress'));
                  const tel = liveSess ? telemetryMap[liveSess.id] : null;
                  const presence = tel?.presence || (liveSess ? 'online' : 'closed');
                  const qid = liveSess?.question_id || u.lastQuestionId;
                  const track = qid ? trackOf(qid) : null;
                  return (
                    <div key={u.id} className="live-card-slot">
                      <div className={`live-student-card presence-${presence}`}>
                        <span className="live-card-top">
                          <span className="cand-cell">
                            <span className="cand-avatar">{u.name.charAt(0).toUpperCase()}</span>
                            <span>
                              <strong className="cand-name">{u.name}</strong>
                              <span className="cand-email">{u.email || '—'}</span>
                            </span>
                          </span>
                          <span className="live-presence-dot" title={presence}>
                            {presence === 'online' ? '🟢' : presence === 'idle' ? '🟡' : presence === 'disconnected' ? '🔴' : '⚪'}
                          </span>
                        </span>
                        <span className="live-card-mid">
                          {track ? (
                            <>
                              <span className={`live-track-badge track-${track.kind}`}>{track.label}</span>
                              <span className="q-title">{liveSess ? liveSess.question_title || qid : qid}</span>
                              <span className="q-id-pill">{qid}</span>
                            </>
                          ) : (
                            <span className="live-field-val">No activity recorded</span>
                          )}
                        </span>
                        <span className="live-card-foot">
                          <span className="live-field-val">
                            {liveSess ? `Live now · ${presence}` : u.lastSeen ? `Last seen ${relTime(new Date(u.lastSeen).getTime())}` : 'Never active'}
                          </span>
                          <span className="live-field-val">{u.submissions} submits</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )
      )}

      {/* MODE 2 & 3: Sessions Views (Virtual Student Monitors & Compact Grid) */}
      {viewMode !== 'all' && (
        loading ? (
          <div className="live-loading-state">
            <div className="app-route-spinner" />
            <p>Connecting to Supabase Realtime live sessions…</p>
          </div>
        ) : loadError ? (
          <div className="live-empty-state">
            <span className="empty-state-icon">🔴</span>
            <h3>Live monitoring unavailable</h3>
            <p>Error: {loadError}</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={loadSessions}>
              Retry Connection →
            </button>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="live-empty-state">
            <span className="empty-state-icon">📡</span>
            <h3>No Active Students Found</h3>
            <p>
              Students appear here in real time the moment they open any studio question — Core Programming, DSA, Frontend JS, or Machine Coding.
            </p>
          </div>
        ) : viewMode === 'vsm' ? (
          /* ─── VIRTUAL STUDENT MONITORS GRID ─── */
          <div className="vsm-grid-container">
            {filteredSessions.map(session => (
              <VirtualStudentMonitor
                key={session.id}
                session={session}
                telemetry={telemetryMap[session.id]}
                onExpand={s => setInspectSession(s)}
              />
            ))}
          </div>
        ) : (
          /* ─── COMPACT GRID VIEW ─── */
          <div className="live-cards-grid">
            {filteredSessions.map(session => {
              const tel = telemetryMap[session.id];
              const presence = tel?.presence || (session.status === 'active' || session.status === 'in_progress' ? 'online' : 'disconnected');
              const track = trackOf(session.question_id);
              const displayName = resolveDisplayName(session.candidate_name, session.candidate_email, session.id);
              const isTyping = Boolean(tel?.isTyping);
              const acts = tel?.activityHistory || [];

              return (
                <div key={session.id} className="live-card-slot">
                  <div
                    className={`live-student-card presence-${presence}`}
                    onClick={() => setInspectSession(session)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="live-card-top">
                      <span className="cand-cell">
                        <span className={`cand-avatar ${isTyping ? 'cand-avatar-typing' : ''}`}>
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                        <span>
                          <strong className="cand-name">{displayName}</strong>
                          <span className="cand-email">{session.candidate_email || 'guest-candidate'}</span>
                        </span>
                        {isTyping && (
                          <span className="rt-typing-indicator" title="Actively typing">
                            <span /><span /><span />
                          </span>
                        )}
                      </span>
                      <span className={`live-presence-dot ${presence}`} title={presence}>
                        {presence === 'online' ? '🟢' : presence === 'idle' ? '🟡' : '🔴'}
                      </span>
                    </span>

                    <span className="live-card-mid">
                      <span className={`live-track-badge track-${track.kind}`}>{track.label}</span>
                      <span className="q-title">{session.question_title || session.question_id}</span>
                      <span className="q-id-pill">{session.question_id}</span>
                    </span>

                    <span className="live-card-grid">
                      <span className="live-card-field">
                        <span className="live-field-label">File</span>
                        <code className="file-code-tag">{tel?.activeFile || session.active_file || 'solution.js'}</code>
                      </span>
                      <span className="live-card-field">
                        <span className="live-field-label">Cursor</span>
                        <span className="live-field-val">
                          {tel?.cursor ? `Ln ${tel.cursor.line}, Col ${tel.cursor.column}` : 'Active'}
                        </span>
                      </span>
                      <span className="live-card-field">
                        <span className="live-field-label">Tests</span>
                        {tel?.lastExecution ? (
                          <span className={`rt-exec-badge ${tel.lastExecution.status}`}>
                            {tel.lastExecution.status === 'success'
                              ? `✅ ${tel.lastExecution.passed}/${tel.lastExecution.total}`
                              : `❌ ${tel.lastExecution.passed}/${tel.lastExecution.total}`}
                          </span>
                        ) : (
                          <span className="live-field-val">—</span>
                        )}
                      </span>
                      <span className="live-card-field">
                        <span className="live-field-label">Activity</span>
                        <span className="live-field-val">{relTime(tel?.lastSeenAt || Date.now())}</span>
                      </span>
                    </span>

                    <span className="live-card-foot">
                      <span className="rt-act-summary">
                        {acts.slice(0, 2).map(ev => (
                          <span key={ev.id} className="rt-act-chip">
                            {ev.message.slice(0, 30)}
                          </span>
                        ))}
                        {acts.length === 0 && <span className="rt-no-activity">Waiting…</span>}
                      </span>
                      <span className="rt-expand-hint">Inspect ⤡</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 5. INLINE FULL INSPECTION MODAL (WITHOUT LEAVING LIVE SESSIONS) */}
      {inspectSession && (
        <div className="vsm-modal-backdrop" onClick={() => setInspectSession(null)}>
          <div className="vsm-modal-dialog" onClick={e => e.stopPropagation()}>
            <div className="vsm-modal-header">
              <div className="vsm-modal-title-group">
                <span className="vsm-presence-pill online">
                  <span className="vsm-pulse-dot" />
                  {telemetryMap[inspectSession.id]?.presence?.toUpperCase() || 'ONLINE'}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>
                    {inspectSession.candidate_name} — {inspectSession.question_title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Session: <code>{inspectSession.id}</code> · {trackOf(inspectSession.question_id).label}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to={monitorPath(inspectSession)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  👁️ Open Full Studio Monitor
                </Link>
                <button
                  type="button"
                  className="vsm-modal-close-btn"
                  onClick={() => setInspectSession(null)}
                  title="Close Inspector"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="vsm-modal-body">
              {/* Virtual Code Viewer in Modal */}
              <div className="vsm-modal-code-window">
                <div className="vsm-code-window-header">
                  <div className="vsm-window-dots">
                    <span className="vsm-wdot red" />
                    <span className="vsm-wdot yellow" />
                    <span className="vsm-wdot green" />
                  </div>
                  <span className="vsm-editor-title">
                    📄 {telemetryMap[inspectSession.id]?.activeFile || inspectSession.active_file || 'solution.js'} (Live Buffer)
                  </span>
                  <div className="vsm-window-status">
                    {telemetryMap[inspectSession.id]?.cursor && (
                      <span className="vsm-cursor-pos">
                        Ln {telemetryMap[inspectSession.id]?.cursor?.line}, Col {telemetryMap[inspectSession.id]?.cursor?.column}
                      </span>
                    )}
                    <span>{telemetryMap[inspectSession.id]?.code?.split('\n').length || 0} lines</span>
                  </div>
                </div>
                <pre className="vsm-modal-code-body">
                  <code>{telemetryMap[inspectSession.id]?.code || inspectSession.current_code_snapshot || '// Waiting for candidate code stream…'}</code>
                </pre>
              </div>

              {/* Activity Timeline in Modal */}
              <div className="vsm-activity-container" style={{ borderRadius: '10px' }}>
                <div className="vsm-activity-title">⚡ Realtime Activity Stream</div>
                <ul className="vsm-activity-list">
                  {(telemetryMap[inspectSession.id]?.activityHistory || []).map(ev => (
                    <li key={ev.id} className="vsm-act-item">
                      <span className="vsm-act-msg">{ev.message}</span>
                      <span className="vsm-act-time">{relTime(ev.timestamp)}</span>
                    </li>
                  ))}
                  {(telemetryMap[inspectSession.id]?.activityHistory || []).length === 0 && (
                    <li className="vsm-act-empty">No activity events recorded yet</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
