import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase/client';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import './AdminLiveSessionsTab.css';

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
}

interface ActivityEvent {
  id: string;
  type: 'joined' | 'typing' | 'execution' | 'file_switch';
  message: string;
  timestamp: number;
}

const MAX_ACTIVITY = 8;
const DEFAULT_LIVE: LiveState = { isTyping: false, lastExecution: null, activeFile: 'App.tsx' };

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
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [liveState, setLiveState] = useState<Record<string, LiveState>>({});
  const [activity, setActivity] = useState<Record<string, ActivityEvent[]>>({});
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

    // 4. Cursor movement — mark as active
    ch.on('broadcast', { event: 'cursor-update' }, () => {
      setLiveState(prev => {
        if (prev[sessionId]?.isTyping) return prev;
        return { ...prev, [sessionId]: { ...(prev[sessionId] || DEFAULT_LIVE), isTyping: true } };
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

  /* ── Initial fetch ───────────────────────────────────────────────────── */
  useEffect(() => {
    interviewSessionService.listAllSessions(100).then(list => {
      setSessions(list);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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

  const activeCount = sessions.filter(s => s.status === 'active' || s.status === 'in_progress').length;
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
            Real-Time Candidate Monitor
          </h2>
          <p className="live-sessions-sub">
            All candidate activity streams here silently — typing, test runs, file switches. No candidate action required.
          </p>
        </div>
        <div className="rt-header-controls">
          <span className={`rt-connected-badge ${isRealtimeConnected ? 'connected' : 'disconnected'}`}>
            {isRealtimeConnected ? '🟢 Realtime Connected' : '🔴 Reconnecting…'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="live-kpi-grid">
        <div className="live-kpi-card">
          <span className="live-kpi-label">Active Sessions</span>
          <span className="live-kpi-val green">{activeCount}</span>
          <span className="live-kpi-note">Candidates in studio right now</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">Currently Typing</span>
          <span className="live-kpi-val orange">{typingCount}</span>
          <span className="live-kpi-note">Live keystrokes detected</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">Submissions</span>
          <span className="live-kpi-val purple">{submittedCount}</span>
          <span className="live-kpi-note">Ready for review</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">Total Sessions</span>
          <span className="live-kpi-val blue">{sessions.length}</span>
          <span className="live-kpi-note">Recorded in Supabase</span>
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

      {/* Sessions Table */}
      {loading ? (
        <div className="live-loading-state">
          <div className="app-route-spinner" />
          <p>Connecting to Supabase Realtime…</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="live-empty-state">
          <span className="empty-state-icon">⚡</span>
          <h3>No {filterStatus !== 'all' ? filterStatus : ''} Sessions Found</h3>
          <p>
            When a candidate opens a question at <code>/machine-coding?id=…</code>, their session appears here instantly.
          </p>
          <Link to="/machine-coding?id=Q001" className="btn btn-primary btn-sm" target="_blank">
            Open Studio as Demo Candidate →
          </Link>
        </div>
      ) : (
        <div className="live-table-wrap">
          <table className="live-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Challenge</th>
                <th>Status</th>
                <th>Active File</th>
                <th>Last Test Run</th>
                <th>Live Activity</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(sess => {
                const isActive = sess.status === 'active' || sess.status === 'in_progress';
                const live = liveState[sess.id] || DEFAULT_LIVE;
                const acts = activity[sess.id] || [];
                const isExpanded = expandedId === sess.id;

                return (
                  <>
                    <tr
                      key={sess.id}
                      className={`rt-session-row ${isActive ? 'session-row-active' : ''} ${isExpanded ? 'rt-row-expanded' : ''}`}
                      onClick={() => setExpandedId(isExpanded ? null : sess.id)}
                      title="Click to expand code snapshot &amp; activity"
                    >
                      {/* Candidate */}
                      <td>
                        <div className="cand-cell">
                          <div className={`cand-avatar ${live.isTyping ? 'cand-avatar-typing' : ''}`}>
                            {sess.candidate_name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <strong className="cand-name">{sess.candidate_name}</strong>
                            <span className="cand-email">{sess.candidate_email || '—'}</span>
                          </div>
                          {live.isTyping && (
                            <span className="rt-typing-indicator" title="Actively typing">
                              <span /><span /><span />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Challenge */}
                      <td>
                        <div className="q-cell">
                          <span className="q-title">{sess.question_title}</span>
                          <span className="q-id-pill">{sess.question_id}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`live-badge ${sess.status}`}>
                          {isActive && <span className="live-mini-dot" />}
                          {sess.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>

                      {/* Active file */}
                      <td>
                        <code className="file-code-tag">
                          {live.activeFile !== 'App.tsx' ? live.activeFile : (sess.active_file || 'App.tsx')}
                        </code>
                      </td>

                      {/* Last test run */}
                      <td>
                        {live.lastExecution ? (
                          <span className={`rt-exec-badge ${live.lastExecution.status}`}>
                            {live.lastExecution.status === 'success'
                              ? `✅ ${live.lastExecution.total}/${live.lastExecution.total}`
                              : `❌ ${live.lastExecution.passed}/${live.lastExecution.total}`}
                            <span className="rt-exec-time">{relTime(live.lastExecution.timestamp)}</span>
                          </span>
                        ) : (
                          <span className="time-cell">
                            {new Date(sess.last_activity_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        )}
                      </td>

                      {/* Activity summary */}
                      <td>
                        <div className="rt-act-summary">
                          {acts.slice(0, 2).map(ev => (
                            <span key={ev.id} className={`rt-act-chip rt-act-${ev.type}`}>
                              {actIcon(ev.type)} {ev.message.slice(0, 30)}
                            </span>
                          ))}
                          {acts.length === 0 && <span className="rt-no-activity">Waiting…</span>}
                          <span className="rt-expand-hint">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded inline panel */}
                    {isExpanded && (
                      <tr key={`${sess.id}-panel`} className="rt-panel-row">
                        <td colSpan={6} className="rt-panel-cell">
                          <CodePreviewPanel session={sess} activity={acts} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
