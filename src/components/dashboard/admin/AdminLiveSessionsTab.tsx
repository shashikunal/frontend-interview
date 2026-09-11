import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase/client';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import { resolveDisplayName } from '../../../lib/leaderboardService';
import './AdminLiveSessionsTab.css';

/* ─── Presence thresholds (honest recency bands, not fake data) ──────────── */
// last_activity_at is heartbeated every 30s by open studios.
const STALE_AFTER_MS = 5 * 60 * 1000; // active but quiet this long → Idle
const GONE_AFTER_MS = 30 * 60 * 1000; // active but quiet this long → Disconnected

/* ─── Types ───────────────────────────────────────────────────────────────── */

interface LiveState {
  isTyping: boolean;
  lastExecution: {
    status: 'success' | 'failed';
    passed: number;
    total: number;
    timestamp: number;
  } | null;
  activeFile: string;
  cursor: { line: number; column: number; at: number } | null;
}

/* ─── Track badge derived strictly from real question_id prefix ─────────── */
function trackOf(questionId?: string | null): { label: string; kind: string } {
  const u = String(questionId || '').toUpperCase();
  if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return { label: 'Core Programming', kind: 'cp' };
  if (u.startsWith('DSA')) return { label: 'DSA', kind: 'dsa' };
  if (u.startsWith('FJP')) return { label: 'Frontend JS', kind: 'fjs' };
  if (u.startsWith('Q') || u.startsWith('MC')) return { label: 'Machine Coding', kind: 'mc' };
  if (/^\d+$/.test(u)) return { label: 'Quiz Bank', kind: 'quiz' };
  return { label: 'Studio', kind: 'other' };
}

interface ActivityEvent {
  id: string;
  type: 'joined' | 'typing' | 'execution' | 'file_switch';
  message: string;
  timestamp: number;
}

const MAX_ACTIVITY = 8;
const DEFAULT_LIVE: LiveState = { isTyping: false, lastExecution: null, activeFile: 'App.tsx', cursor: null };

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function relTime(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 5) return 'just now';
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

function actIcon(type: ActivityEvent['type']) {
  switch (type) {
    case 'joined': return '🟢';
    case 'typing': return '⌨️';
    case 'execution': return '🧪';
    case 'file_switch': return '📂';
  }
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/* ─── Track-aware monitor link (platform-wide sessions) ─────────────────── */
function monitorPath(session: InterviewSession): string {
  const qid = String(session.question_id || '');
  const u = qid.toUpperCase();
  const suffix = `?session=${session.id}&role=admin`;
  if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return `/core-programming/question/${qid}${suffix}`;
  if (u.startsWith('DSA')) return `/dsa/question/${qid}${suffix}`;
  if (u.startsWith('FJP')) return `/frontend-javascript/question/${qid}${suffix}`;
  return `/machine-coding?id=${qid}&session=${session.id}&role=admin`;
}

/* ─── Code Preview Panel ──────────────────────────────────────────────────── */

function CodePreviewPanel({ session, activity }: { session: InterviewSession; activity: ActivityEvent[] }) {
  const snap = session.files_snapshot || {};
  const fileNames = Object.keys(snap);
  const [activeFile, setActiveFile] = useState(session.active_file || fileNames[0] || 'App.tsx');

  const code = snap[activeFile] || snap[fileNames[0]] || '// No code snapshot available yet.\n// The candidate\'s code will appear here after the first auto-save (every 30s).';

  return (
    <div className="rt-expand-panel">
      {/* Panel meta */}
      <div className="rt-panel-meta">
        <span className="rt-panel-meta-item">
          <span className="rt-meta-label">Session</span>
          <code className="rt-meta-val">{session.id.slice(0, 12)}…</code>
        </span>
        <span className="rt-panel-meta-item">
          <span className="rt-meta-label">Started</span>
          <span className="rt-meta-val">{new Date(session.started_at || session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </span>
        <span className="rt-panel-meta-item">
          <span className="rt-meta-label">Language</span>
          <code className="rt-meta-val">{session.language || 'react'}</code>
        </span>
        <Link
          to={monitorPath(session)}
          className="btn btn-primary btn-sm rt-join-btn"
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
        >
          👁️ Open Full Monitor
        </Link>
      </div>

      <div className="rt-panel-body">
        {/* Code Snapshot */}
        <div className="rt-code-section">
          <div className="rt-code-header">
            <span className="rt-code-label">📄 Code Snapshot</span>
            {fileNames.length > 1 && (
              <div className="rt-file-tabs">
                {fileNames.map(f => (
                  <button
                    key={f}
                    type="button"
                    className={`rt-file-tab ${activeFile === f ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); setActiveFile(f); }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            <span className="rt-snapshot-note">Auto-saved · updates every 30s</span>
          </div>
          <pre className="rt-code-preview"><code>{code}</code></pre>
        </div>

        {/* Activity Log */}
        <div className="rt-activity-section">
          <div className="rt-activity-header">
            <span className="rt-activity-label">⚡ Live Activity</span>
          </div>
          {activity.length === 0 ? (
            <div className="rt-activity-empty">Waiting for live events…</div>
          ) : (
            <ul className="rt-activity-log">
              {activity.map(ev => (
                <li key={ev.id} className={`rt-activity-item rt-act-${ev.type}`}>
                  <span className="rt-act-icon">{actIcon(ev.type)}</span>
                  <span className="rt-act-message">{ev.message}</span>
                  <span className="rt-act-time">{relTime(ev.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function AdminLiveSessionsTab() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveState, setLiveState] = useState<Record<string, LiveState>>({});
  const [activity, setActivity] = useState<Record<string, ActivityEvent[]>>({});
  const [monitorView, setMonitorView] = useState<'live' | 'all'>('live');
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
  const [, setTick] = useState(0); // force re-render for relTime

  const sessionChannelsRef = useRef<Map<string, any>>(new Map());
  const typingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /* ── Activity helper ─────────────────────────────────────────────────── */
  const pushActivity = useCallback((sessionId: string, event: Omit<ActivityEvent, 'id'>) => {
    setActivity(prev => {
      const existing = prev[sessionId] || [];
      return {
        ...prev,
        [sessionId]: [{ ...event, id: uid() }, ...existing].slice(0, MAX_ACTIVITY),
      };
    });
  }, []);

  /* ── Per-session broadcast listener (silent observer) ────────────────── */
  const subscribeToSession = useCallback((sessionId: string) => {
    if (sessionChannelsRef.current.has(sessionId)) return;

    // Join the same Supabase channel the candidate is on — without .track()
    // so the admin is completely invisible in the candidate's presence state
    const ch = supabase.channel(`session_collab_${sessionId}`, {
      config: { broadcast: { ack: false, self: false } },
    });

    // 1. Typing: Yjs doc updates = candidate is typing
    ch.on('broadcast', { event: 'yjs-update' }, () => {
      setLiveState(prev => ({
        ...prev,
        [sessionId]: { ...(prev[sessionId] || DEFAULT_LIVE), isTyping: true },
      }));
      const existing = typingTimersRef.current.get(sessionId);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        setLiveState(prev => ({
          ...prev,
          [sessionId]: { ...(prev[sessionId] || DEFAULT_LIVE), isTyping: false },
        }));
      }, 3000);
      typingTimersRef.current.set(sessionId, t);
    });

    // 2. Test execution results
    ch.on('broadcast', { event: 'execution-event' }, ({ payload }: { payload: any }) => {
      const exec = {
        status: (payload.status === 'success' ? 'success' : 'failed') as 'success' | 'failed',
        passed: payload.testsPassed || 0,
        total: payload.testsTotal || 0,
        timestamp: Date.now(),
      };
      setLiveState(prev => ({
        ...prev,
        [sessionId]: { ...(prev[sessionId] || DEFAULT_LIVE), lastExecution: exec },
      }));
      pushActivity(sessionId, {
        type: 'execution',
        message: exec.status === 'success'
          ? `All ${exec.total} tests passed`
          : `${exec.passed}/${exec.total} tests passed`,
        timestamp: Date.now(),
      });
    });

    // 3. File switch
    ch.on('broadcast', { event: 'file-switch-event' }, ({ payload }: { payload: any }) => {
      const file = payload.fileName || 'unknown';
      setLiveState(prev => ({
        ...prev,
        [sessionId]: { ...(prev[sessionId] || DEFAULT_LIVE), activeFile: file },
      }));
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, active_file: file } : s));
      pushActivity(sessionId, {
        type: 'file_switch',
        message: `Switched to ${file}`,
        timestamp: Date.now(),
      });
    });

    // 4. Cursor movement — mark as active + store real position (line/col or unavailable)
    ch.on('broadcast', { event: 'cursor-update' }, ({ payload }: { payload: any }) => {
      const line = Number(payload?.range?.startLineNumber);
      const column = Number(payload?.range?.startColumn);
      setLiveState(prev => {
        if (prev[sessionId]?.isTyping) return prev;
        const next = { ...(prev[sessionId] || DEFAULT_LIVE), isTyping: true };
        if (Number.isFinite(line) && Number.isFinite(column)) {
          next.cursor = { line, column, at: Date.now() };
        }
        return { ...prev, [sessionId]: next };
      });
      const existing = typingTimersRef.current.get(`cur_${sessionId}`);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        setLiveState(prev => ({
          ...prev,
          [sessionId]: { ...(prev[sessionId] || DEFAULT_LIVE), isTyping: false },
        }));
      }, 5000);
      typingTimersRef.current.set(`cur_${sessionId}`, t);
    });

    ch.subscribe();
    sessionChannelsRef.current.set(sessionId, ch);
  }, [pushActivity]);

  const unsubscribeFromSession = useCallback((sessionId: string) => {
    const ch = sessionChannelsRef.current.get(sessionId);
    if (ch) {
      try { supabase.removeChannel(ch); } catch (_) {}
      sessionChannelsRef.current.delete(sessionId);
    }
    ['', 'cur_'].forEach(prefix => {
      const t = typingTimersRef.current.get(`${prefix}${sessionId}`);
      if (t) { clearTimeout(t); typingTimersRef.current.delete(`${prefix}${sessionId}`); }
    });
  }, []);

  /* ── Initial fetch (honest failure state, never silent empty) ─────────── */
  const loadSessions = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    interviewSessionService.listAllSessions(100).then(list => {
      setSessions(list);
      setLoading(false);
    }).catch((err) => {
      setLoading(false);
      setLoadError(err instanceof Error ? err.message : 'Live monitoring unavailable');
    });
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  /* ── Roster: every registered user + honest last-activity (real rows only) */
  const loadRoster = useCallback(async () => {
    setRosterLoading(true);
    setRosterError(null);
    try {
      const [{ data: profs, error: profErr }, subsRes, attRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, email').limit(500),
        supabase.from('submissions').select('user_id, question_id, created_at').order('created_at', { ascending: false }).limit(2000).then(r => r, () => ({ data: [] as any[] })),
        supabase.from('question_attempts').select('user_id, question_id, last_activity_at').limit(2000).then(r => r, () => ({ data: [] as any[] })),
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
      // roster stays as-is; surfaced honestly with manual retry (never auto-loops)
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
    // Fetch once on first entry to the roster view; manual Retry/Refresh after that.
    if (monitorView === 'all' && !rosterAttemptedRef.current && !rosterLoading) {
      rosterAttemptedRef.current = true;
      loadRoster();
    }
  }, [monitorView, rosterLoading, loadRoster]);

  /* ── Supabase Realtime: postgres_changes on interview_sessions ───────── */
  useEffect(() => {
    const unsub = interviewSessionService.subscribeToSessions({
      onInsert: (session) => {
        setSessions(prev => {
          if (prev.find(s => s.id === session.id)) return prev;
          return [session, ...prev];
        });
        pushActivity(session.id, {
          type: 'joined',
          message: `Session started — ${session.question_title}`,
          timestamp: Date.now(),
        });
      },
      onUpdate: (session) => {
        setSessions(prev => prev.map(s => s.id === session.id ? session : s));
      },
      onDelete: (id) => {
        if (!id) return;
        setSessions(prev => prev.filter(s => s.id !== id));
        unsubscribeFromSession(id);
      },
      onConnectionChange: setIsRealtimeConnected,
    });
    return unsub;
  }, [pushActivity, unsubscribeFromSession]);

  /* ── Manage per-session broadcast subscriptions ──────────────────────── */
  useEffect(() => {
    const activeSessions = sessions.filter(s => s.status === 'active' || s.status === 'in_progress');
    const activeIds = new Set(activeSessions.map(s => s.id));
    activeSessions.forEach(s => subscribeToSession(s.id));
    sessionChannelsRef.current.forEach((_, id) => {
      if (!activeIds.has(id)) unsubscribeFromSession(id);
    });
  }, [sessions, subscribeToSession, unsubscribeFromSession]);

  /* ── relTime ticker ──────────────────────────────────────────────────── */
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 10000);
    return () => clearInterval(t);
  }, []);

  /* ── Full cleanup on unmount ─────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      sessionChannelsRef.current.forEach((_, id) => unsubscribeFromSession(id));
      typingTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, [unsubscribeFromSession]);

  /* ── Derived state ───────────────────────────────────────────────────── */
  const filteredSessions = sessions.filter(s => {
    const isActive = s.status === 'active' || s.status === 'in_progress';
    if (filterStatus === 'active' && !isActive) return false;
    if (filterStatus !== 'all' && filterStatus !== 'active' && s.status !== filterStatus) return false;
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

  /* ── Derived state: 100% computed from real sessions + live events ───── */
  const presenceOf = (s: InterviewSession): 'online' | 'idle' | 'disconnected' | 'closed' => {
    const live = s.status === 'active' || s.status === 'in_progress';
    if (!live) return 'closed';
    const age = Date.now() - new Date(s.last_activity_at || s.created_at).getTime();
    if (Number.isNaN(age)) return 'idle';
    if (age <= STALE_AFTER_MS) return 'online';
    if (age <= GONE_AFTER_MS) return 'idle';
    return 'disconnected';
  };

  const presenceList = sessions.map(s => presenceOf(s));
  const onlineCount = presenceList.filter(p => p === 'online').length;
  const idleCount = presenceList.filter(p => p === 'idle').length;
  const disconnectedCount = presenceList.filter(p => p === 'disconnected').length;
  const runningCount = sessions.filter(s => s.status === 'in_progress').length;
  const submittedCount = sessions.filter(s => s.status === 'submitted' || s.status === 'completed').length;
  const typingCount = Object.values(liveState).filter(ls => ls.isTyping).length;

  /* ── Render ──────────────────────────────────────────────────────────── */
  return (
    <div className="admin-live-sessions-tab page-enter">

      {/* Header */}
      <div className="live-sessions-header">
        <div>
          <h2 className="live-sessions-title">
            <span className="live-header-pulse" />
            Live Control Room
          </h2>
          <p className="live-sessions-sub">
            Every open studio across all tracks streams here — Machine Coding, Core Programming, DSA, Frontend JS. Select a card for live code, cursor, execution and activity.
          </p>
        </div>
        <div className="rt-header-controls">
          <span className={`rt-connected-badge ${isRealtimeConnected ? 'connected' : 'disconnected'}`}>
            {isRealtimeConnected ? '🟢 Realtime Connected' : '🔴 Reconnecting…'}
          </span>
        </div>
      </div>

      {/* Status strip: every number computed live from sessions + events */}
      <div className="live-kpi-grid">
        <div className="live-kpi-card">
          <span className="live-kpi-label">🟢 Online</span>
          <span className="live-kpi-val green">{onlineCount}</span>
          <span className="live-kpi-note">Heartbeated within 5 min</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">✏️ Typing</span>
          <span className="live-kpi-val orange">{typingCount}</span>
          <span className="live-kpi-note">Live keystrokes observed</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">🟡 Idle</span>
          <span className="live-kpi-val orange">{idleCount}</span>
          <span className="live-kpi-note">Quiet 5–30 min</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">▶ Running</span>
          <span className="live-kpi-val blue">{runningCount}</span>
          <span className="live-kpi-note">Status in_progress</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">📤 Submitted</span>
          <span className="live-kpi-val purple">{submittedCount}</span>
          <span className="live-kpi-note">Ready for review</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">🔴 Disconnected</span>
          <span className="live-kpi-val">{disconnectedCount}</span>
          <span className="live-kpi-note">Quiet over 30 min</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">Total Students</span>
          <span className="live-kpi-val blue">{sessions.length}</span>
          <span className="live-kpi-note">Sessions recorded</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="live-filter-bar">
        <div className="live-search-wrap">
          <input
            type="text"
            placeholder="Search candidate, email, or question…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="live-search-input"
          />
        </div>
        <div className="live-status-pills">
          <button
            type="button"
            className={`live-status-pill ${monitorView === 'live' ? 'active' : ''}`}
            onClick={() => setMonitorView('live')}
          >
            📡 Live Sessions
          </button>
          <button
            type="button"
            className={`live-status-pill ${monitorView === 'all' ? 'active' : ''}`}
            onClick={() => setMonitorView('all')}
          >
            👥 All Students{roster.length > 0 ? ` (${roster.length})` : ''}
          </button>
        </div>
        <div className="live-status-pills">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: '🟢 Active' },
            { key: 'submitted', label: '✅ Submitted' },
            { key: 'completed', label: 'Completed' },
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
      </div>

      {/* All-students roster: every registered user, honest presence */}
      {monitorView === 'all' && (
        rosterLoading ? (
          <div className="live-loading-state">
            <div className="app-route-spinner" />
            <p>Loading student roster…</p>
          </div>
        ) : rosterError ? (
          <div className="live-empty-state">
            <span className="empty-state-icon">🔴</span>
            <h3>Roster unavailable</h3>
            <p>Reconnecting… ({rosterError})</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={retryRoster}>
              Retry →
            </button>
          </div>
        ) : roster.length === 0 ? (
          <div className="live-empty-state">
            <span className="empty-state-icon">👥</span>
            <h3>No students found</h3>
            <p>No registered profiles returned by the database.</p>
            <button type="button" className="btn btn-primary btn-sm" onClick={retryRoster}>
              Retry →
            </button>
          </div>
        ) : (
          <div className="live-roster-toolbar">
            <span className="live-field-val">{roster.length} students · live status merged from open sessions</span>
            <button type="button" className="btn btn-sm btn-secondary" onClick={retryRoster} disabled={rosterLoading}>
              {rosterLoading ? '⏳ Refreshing…' : '🔄 Refresh Roster'}
            </button>
          </div>
        )
      )}
      {monitorView === 'all' && !rosterLoading && !rosterError && roster.length > 0 && (
          <div className="live-cards-grid">
            {roster
              .filter(u => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
              })
              .map(u => {
                const liveSess = sessions.find(s => s.candidate_id === u.id && (s.status === 'active' || s.status === 'in_progress'));
                const presence = liveSess ? presenceOf(liveSess) : 'closed';
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
                            <span className="q-title">{liveSess ? (liveSess.question_title || qid) : qid}</span>
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
        )}

      {/* Sessions: honest states only — never fake data */}
      {monitorView !== 'all' && (loading ? (
        <div className="live-loading-state">
          <div className="app-route-spinner" />
          <p>Connecting to live monitoring…</p>
        </div>
      ) : loadError ? (
        <div className="live-empty-state">
          <span className="empty-state-icon">🔴</span>
          <h3>Live monitoring unavailable</h3>
          <p>Reconnecting… ({loadError})</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={loadSessions}>
            Retry Connection →
          </button>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="live-empty-state">
          <span className="empty-state-icon">⚡</span>
          <h3>No active students</h3>
          <p>
            Sessions appear here the moment a student opens any studio question — Machine Coding, Core Programming, DSA or Frontend JS.
          </p>
        </div>
      ) : (
        <div className="live-cards-grid">
          {filteredSessions.map(sess => {
            const isActive = sess.status === 'active' || sess.status === 'in_progress';
            const live = liveState[sess.id] || DEFAULT_LIVE;
            const acts = activity[sess.id] || [];
            const isExpanded = expandedId === sess.id;
            const presence = presenceOf(sess);
            const track = trackOf(sess.question_id);
            const displayName = resolveDisplayName(sess.candidate_name, sess.candidate_email, sess.id);
            const cursor = live.cursor;

            return (
              <div key={sess.id} className="live-card-slot">
                <button
                  type="button"
                  className={`live-student-card presence-${presence} ${isExpanded ? 'selected' : ''}`}
                  onClick={() => setExpandedId(isExpanded ? null : sess.id)}
                  title="Select to open live detail viewer"
                >
                  <span className="live-card-top">
                    <span className="cand-cell">
                      <span className={`cand-avatar ${live.isTyping ? 'cand-avatar-typing' : ''}`}>
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <strong className="cand-name">{displayName}</strong>
                        <span className="cand-email">{sess.candidate_email || '—'}</span>
                      </span>
                      {live.isTyping && (
                        <span className="rt-typing-indicator" title="Actively typing">
                          <span /><span /><span />
                        </span>
                      )}
                    </span>
                    <span className={`live-presence-dot ${presence}`} title={presence}>
                      {presence === 'online' ? '🟢' : presence === 'idle' ? '🟡' : presence === 'disconnected' ? '🔴' : '⚪'}
                    </span>
                  </span>
                  <span className="live-card-mid">
                    <span className={`live-track-badge track-${track.kind}`}>{track.label}</span>
                    <span className="q-title">{sess.question_title || sess.question_id}</span>
                    <span className="q-id-pill">{sess.question_id}</span>
                  </span>
                  <span className="live-card-grid">
                    <span className="live-card-field">
                      <span className="live-field-label">Status</span>
                      <span className={`live-badge ${sess.status}`}>
                        {isActive && <span className="live-mini-dot" />}
                        {sess.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </span>
                    <span className="live-card-field">
                      <span className="live-field-label">File</span>
                      <code className="file-code-tag">
                        {live.activeFile !== 'App.tsx' ? live.activeFile : (sess.active_file || '—')}
                      </code>
                    </span>
                    <span className="live-card-field">
                      <span className="live-field-label">Cursor</span>
                      <span className="live-field-val">
                        {cursor ? `Ln ${cursor.line}, Col ${cursor.column}` : 'Cursor unavailable'}
                      </span>
                    </span>
                    <span className="live-card-field">
                      <span className="live-field-label">Last run</span>
                      {live.lastExecution ? (
                        <span className={`rt-exec-badge ${live.lastExecution.status}`}>
                          {live.lastExecution.status === 'success'
                            ? `✅ ${live.lastExecution.total}/${live.lastExecution.total}`
                            : `❌ ${live.lastExecution.passed}/${live.lastExecution.total}`}
                        </span>
                      ) : (
                        <span className="live-field-val">No execution data</span>
                      )}
                    </span>
                  </span>
                  <span className="live-card-foot">
                    <span className="rt-act-summary">
                      {acts.slice(0, 2).map(ev => (
                        <span key={ev.id} className={`rt-act-chip rt-act-${ev.type}`}>
                          {actIcon(ev.type)} {ev.message.slice(0, 30)}
                        </span>
                      ))}
                      {acts.length === 0 && <span className="rt-no-activity">Waiting…</span>}
                    </span>
                    <span className="rt-expand-hint">{isExpanded ? '▲ Detail' : '▼ Detail'}</span>
                  </span>
                </button>

                {/* Single selective detail viewer */}
                {isExpanded && (
                  <div className="live-detail-row">
                    <CodePreviewPanel session={sess} activity={acts} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
