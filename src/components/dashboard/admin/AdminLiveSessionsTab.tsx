import { useState, useEffect, useCallback, useMemo } from 'react';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import { CandidateMonitorPanel } from './CandidateMonitorPanel';
import { useAuth } from '../../../context/AuthContext';
import { useAdminMonitorSocket, type LiveTelemetryItem } from '../../../hooks/useAdminMonitorSocket';
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

/* ─── Main Component ──────────────────────────────────────────────────────── */

export default function AdminLiveSessionsTab() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('active');
  const [filterTrack, setFilterTrack] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [, setTick] = useState(0); // clock tick for relTime and idle checks

  // ── Canonical Candidate Store: Exactly ONE session panel per candidate ──────────
  // Deduplicates multiple historical active sessions for the same student
  const canonicalCandidates = useMemo(() => {
    const candidateMap = new Map<string, InterviewSession>();

    for (const session of sessions) {
      const candidateKey = session.candidate_id || session.candidate_email || session.id;
      const existing = candidateMap.get(candidateKey);
      if (!existing) {
        candidateMap.set(candidateKey, session);
        continue;
      }

      // 1. Prefer active session over submitted/completed
      const isCurActive = session.status === 'active' || session.status === 'in_progress';
      const isExistingActive = existing.status === 'active' || existing.status === 'in_progress';
      if (isCurActive && !isExistingActive) {
        candidateMap.set(candidateKey, session);
        continue;
      }
      if (!isCurActive && isExistingActive) {
        continue;
      }

      // 2. Prefer most recent activity
      const curTime = new Date(session.last_activity_at || session.started_at || session.created_at).getTime();
      const existingTime = new Date(existing.last_activity_at || existing.started_at || existing.created_at).getTime();
      if (curTime > existingTime) {
        candidateMap.set(candidateKey, session);
      }
    }

    return Array.from(candidateMap.values());
  }, [sessions]);

  // Extract canonical active session IDs for Socket.IO room subscription
  const activeSessionIds = useMemo(() => {
    return canonicalCandidates
      .filter(s => s.status === 'active' || s.status === 'in_progress')
      .map(s => s.id);
  }, [canonicalCandidates]);

  // Two-way Realtime Socket.IO connection for admin live monitoring
  const { isConnected: isRealtimeConnected, telemetryMap: socketTelemetryMap, getYDoc } = useAdminMonitorSocket(activeSessionIds, user);

  // Merge persistent Supabase session data with live Socket.IO telemetry stream
  const telemetryMap = useMemo<Record<string, LiveTelemetryItem>>(() => {
    const map: Record<string, LiveTelemetryItem> = {};
    for (const s of canonicalCandidates) {
      const initCode = s.current_code_snapshot ||
        (s.files_snapshot ? (s.files_snapshot[s.active_file || ''] || Object.values(s.files_snapshot)[0] || '') : '');
      map[s.id] = {
        sessionId: s.id,
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
  }, [canonicalCandidates, socketTelemetryMap]);

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

  /* ── Filtered Sessions Computation (from Canonical Candidates) ────────── */
  const filteredSessions = useMemo(() => {
    return canonicalCandidates.filter(s => {
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
  }, [canonicalCandidates, telemetryMap, filterStatus, filterTrack, searchQuery]);

  /* ── KPI metrics ───────────────────────────────────────────────────────── */
  const onlineCount = canonicalCandidates.filter(s => telemetryMap[s.id]?.presence === 'online').length;
  const typingCount = canonicalCandidates.filter(s => telemetryMap[s.id]?.isTyping).length;
  const idleCount = canonicalCandidates.filter(s => telemetryMap[s.id]?.presence === 'idle').length;
  const activeCount = canonicalCandidates.filter(s => s.status === 'active' || s.status === 'in_progress').length;
  const submittedCount = canonicalCandidates.filter(s => s.status === 'submitted' || s.status === 'completed').length;
  const disconnectedCount = canonicalCandidates.filter(s => telemetryMap[s.id]?.presence === 'disconnected').length;

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

      {/* 4. Realtime Live Student Monitors Grid (1 Candidate = 1 Compact Tabbed Panel) */}
      {loading ? (
        <div className="live-loading-state">
          <div className="app-route-spinner" />
          <p>Connecting to live candidate sessions…</p>
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
      ) : (
        <div className="candidate-monitors-grid">
          {filteredSessions.map(session => (
            <CandidateMonitorPanel
              key={session.id}
              session={session}
              telemetry={telemetryMap[session.id]}
              getYDoc={getYDoc}
            />
          ))}
        </div>
      )}
    </div>
  );
}
