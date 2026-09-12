import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import { resolveDisplayName } from '../../../lib/leaderboardService';
import { VirtualStudentMonitor, type LiveStudentTelemetry } from './VirtualStudentMonitor';
import { StudentWorkspaceMonitor } from './StudentWorkspaceMonitor';
import { useAuth } from '../../../context/AuthContext';
import { useAdminMonitorSocket } from '../../../hooks/useAdminMonitorSocket';
import './AdminLiveSessionsTab.css';

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

function relTime(ts: number): string {
  const d = Math.floor((Date.now() - ts) / 1000);
  if (d < 4) return 'just now';
  if (d < 60) return `${d}s ago`;
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  return `${Math.floor(d / 3600)}h ago`;
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function AdminLiveSessionsTab() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'vsm' | 'compact' | 'all'>('vsm');
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Extract all active session IDs for Socket.IO multi-session room subscription
  const activeSessionIds = useMemo(() => {
    return sessions
      .filter(s => s.status === 'active' || s.status === 'in_progress')
      .map(s => s.id);
  }, [sessions]);

  // Two-way Realtime Socket.IO connection for admin live monitoring
  const { isConnected: isRealtimeConnected, telemetryMap: socketTelemetryMap } = useAdminMonitorSocket(activeSessionIds, user);

  // Merge persistent Supabase session data with live Socket.IO telemetry stream
  const telemetryMap = useMemo<Record<string, LiveStudentTelemetry>>(() => {
    const map: Record<string, LiveStudentTelemetry> = {};
    for (const s of sessions) {
      const initCode = s.current_code_snapshot ||
        (s.files_snapshot ? (s.files_snapshot[s.active_file || ''] || Object.values(s.files_snapshot)[0] || '') : '');
      map[s.id] = {
        isTyping: false,
        activeFile: s.active_file || 'solution.js',
        code: initCode,
        lineCount: initCode ? initCode.split('\n').length : 1,
        cursor: null,
        focused: true,
        presence: (s.status === 'active' || s.status === 'in_progress') ? 'online' : 'disconnected',
        lastSeenAt: new Date(s.last_activity_at || s.created_at).getTime(),
        lastExecution: null,
        activityHistory: [
          {
            id: `init_${s.id}`,
            type: 'joined',
            message: `Session ready — ${s.question_title}`,
            timestamp: new Date(s.started_at || s.created_at).getTime(),
          },
        ],
      };
    }
    for (const [id, tel] of Object.entries(socketTelemetryMap)) {
      if (map[id]) {
        map[id] = {
          ...map[id],
          ...tel,
          code: tel.code || map[id].code,
          activeFile: tel.activeFile || map[id].activeFile,
          presence: tel.presence || map[id].presence,
          activityHistory: tel.activityHistory?.length ? tel.activityHistory : map[id].activityHistory,
        };
      } else {
        map[id] = tel;
      }
    }
    return map;
  }, [sessions, socketTelemetryMap]);

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
      },
      onUpdate: session => {
        setSessions(prev => prev.map(s => (s.id === session.id ? session : s)));
      },
      onDelete: id => {
        if (!id) return;
        setSessions(prev => prev.filter(s => s.id !== id));
      },
    });
    return unsub;
  }, []);

  /* ── Heartbeat & Idle Checker (every 10s) ──────────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(n => n + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
            {isRealtimeConnected ? '🟢 Socket.IO Realtime Active' : '🔴 Connecting Socket…'}
          </span>
        </div>
      </div>

      {/* 2. KPI Status Strip */}
      <div className="live-kpi-grid">
        <div className="live-kpi-card">
          <span className="live-kpi-label">🟢 Live Now</span>
          <span className="live-kpi-val green">{onlineCount}</span>
          <span className="live-kpi-note">Active on Socket.IO</span>
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
                      <span className="rt-expand-hint" style={{ fontWeight: 700, color: '#38bdf8' }}>
                        VIEW MONITOR ⤡
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* 5. COMPLETE REALTIME VIRTUAL STUDENT WORKSPACE MONITOR (ADMIN ONLY) */}
      {/* 5. COMPLETE REALTIME VIRTUAL STUDENT WORKSPACE MONITOR (ADMIN ONLY) */}
      {inspectSession && (
        <StudentWorkspaceMonitor
          session={inspectSession}
          telemetry={telemetryMap[inspectSession.id]}
          onClose={() => setInspectSession(null)}
        />
      )}
    </div>
  );
}
