import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import { getUnifiedQuestionMetadata, type UnifiedQuestionMetadata } from '../../../lib/questionCatalogHelper';
import { useAuth } from '../../../context/AuthContext';
import { useAdminMonitorSocket } from '../../../hooks/useAdminMonitorSocket';
import './StudentWorkspaceMonitor.css';

export interface StudentWorkspaceMonitorProps {
  session: InterviewSession;
  onClose: () => void;
  telemetry?: any;
}

interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: number;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  lineNum: number;
}

function formatDuration(startedAtIso: string): string {
  const startMs = new Date(startedAtIso).getTime();
  if (isNaN(startMs)) return '00:00';
  const diffSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  const m = Math.floor(diffSec / 60);
  const s = diffSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatClockTime(ts: number): string {
  const d = new Date(ts);
  return d.toTimeString().split(' ')[0]; // "09:44:32"
}

function timeAgoSec(ts?: number): number {
  if (!ts) return 0;
  return Math.max(0, Math.floor((Date.now() - ts) / 1000));
}

function computeSimpleDiff(oldCode: string, newCode: string): DiffLine[] {
  const oldLines = oldCode.split('\n');
  const newLines = newCode.split('\n');
  const result: DiffLine[] = [];

  const maxLen = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLen; i++) {
    const o = oldLines[i];
    const n = newLines[i];
    if (o === undefined && n !== undefined) {
      result.push({ type: 'added', text: n, lineNum: i + 1 });
    } else if (n === undefined && o !== undefined) {
      result.push({ type: 'removed', text: o, lineNum: i + 1 });
    } else if (o !== n) {
      result.push({ type: 'removed', text: o, lineNum: i + 1 });
      result.push({ type: 'added', text: n, lineNum: i + 1 });
    } else {
      result.push({ type: 'unchanged', text: n, lineNum: i + 1 });
    }
  }
  return result;
}

export const StudentWorkspaceMonitor: React.FC<StudentWorkspaceMonitorProps> = ({
  session: initialSession,
  onClose,
  telemetry,
}) => {
  // ── Session State & Data Hydration ───────────────────────────────────────
  const [session, setSession] = useState<InterviewSession>(initialSession);
  const [candidateProfile, setCandidateProfile] = useState<{
    avatar_url?: string;
    target_company?: string;
    experience_level?: string;
    batch?: string;
  } | null>(null);

  // ── Live Telemetry Buffers ────────────────────────────────────────────────
  const [liveCode, setLiveCode] = useState<string>(
    telemetry?.code ||
      initialSession.current_code_snapshot ||
      (initialSession.files_snapshot ? Object.values(initialSession.files_snapshot)[0] || '' : '')
  );
  const [activeFile, setActiveFile] = useState<string>(
    telemetry?.activeFile || initialSession.active_file || 'solution.js'
  );
  const [cursor, setCursor] = useState<{ line: number; column: number; at: number } | null>(
    telemetry?.cursor || null
  );
  const [isTyping, setIsTyping] = useState<boolean>(Boolean(telemetry?.isTyping));
  const [presence, setPresence] = useState<'online' | 'idle' | 'disconnected'>(
    telemetry?.presence || 'online'
  );
  const [rtConnected, setRtConnected] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const [lastActivityAt, setLastActivityAt] = useState<number>(telemetry?.lastSeenAt || Date.now());
  const [lastEventAt, setLastEventAt] = useState<number>(telemetry?.lastSeenAt || Date.now());
  const [lastExecution, setLastExecution] = useState<{
    status: 'running' | 'success' | 'failed' | 'error';
    passed?: number;
    total?: number;
    runtimeMs?: number;
    error?: string;
    timestamp: number;
  } | null>(telemetry?.lastExecution || null);
  const [activityHistory, setActivityHistory] = useState<ActivityItem[]>(
    telemetry?.activityHistory?.length
      ? telemetry.activityHistory
      : [
          {
            id: 'init-01',
            type: 'SESSION_STARTED',
            message: `Session initialized — ${initialSession.question_title}`,
            timestamp: new Date(initialSession.started_at || initialSession.created_at).getTime(),
          },
        ]
  );

  // ── Completed Questions tracking ──────────────────────────────────────────
  const [completedQuestionIds, setCompletedQuestionIds] = useState<Set<string>>(new Set());

  // ── UI Controls ───────────────────────────────────────────────────────────
  const [isPaused, setIsPaused] = useState(false); // Pause visual stream (Section AA)
  const [showDiff, setShowDiff] = useState(false); // Code diff view (Section I)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activityFilter, setActivityFilter] = useState<'all' | 'code' | 'exec' | 'nav'>('all');
  const [elapsed, setElapsed] = useState<string>('00:00');
  const [, setTick] = useState<number>(0);

  // Initial code snapshot reference for diffing
  const initialCodeSnapshotRef = useRef<string>(liveCode);

  // Buffered updates when visually paused
  const pausedBufferRef = useRef<{
    code?: string;
    cursor?: any;
    execution?: any;
    file?: string;
  }>({});

  // Question metadata
  const questionMeta: UnifiedQuestionMetadata = useMemo(() => {
    return getUnifiedQuestionMetadata(session.question_id);
  }, [session.question_id]);

  // Derived IDs
  const studentId = `STU-${session.candidate_id ? session.candidate_id.replace(/-/g, '').slice(0, 4).toUpperCase() : '1024'}`;
  const interviewId = `INT-${session.id.replace(/-/g, '').slice(0, 4).toUpperCase()}`;
  const sessionIdFormatted = `SES-${session.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

  // ── Step 1 & 2: Hydrate Session, Profile & Progress from Supabase ─────────
  useEffect(() => {
    let isMounted = true;

    async function hydrate() {
      // 1. Fetch fresh session record
      const freshSession = await interviewSessionService.getSessionById(initialSession.id);
      if (freshSession && isMounted) {
        setSession(freshSession);
        if (freshSession.current_code_snapshot) {
          setLiveCode(freshSession.current_code_snapshot);
          initialCodeSnapshotRef.current = freshSession.current_code_snapshot;
        }
      }

      // 2. Fetch candidate profile
      if (initialSession.candidate_id) {
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('avatar_url, target_company, experience_level')
            .eq('id', initialSession.candidate_id)
            .maybeSingle();

          if (prof && isMounted) {
            setCandidateProfile({
              avatar_url: prof.avatar_url,
              target_company: prof.target_company || 'Tier 1 Tech',
              experience_level: prof.experience_level || 'L4/L5 Software Engineer',
              batch: 'Batch 2026-Q3',
            });
          }
        } catch (_) {}

        // 3. Fetch completed questions progress for this candidate
        try {
          const { data: prog } = await supabase
            .from('user_question_progress')
            .select('question_id, status')
            .eq('user_id', initialSession.candidate_id)
            .eq('status', 'completed');

          if (prog && isMounted) {
            const completed = new Set<string>(prog.map((p: any) => String(p.question_id).toUpperCase()));
            setCompletedQuestionIds(completed);
          }
        } catch (_) {}
      }
    }

    void hydrate();
    return () => {
      isMounted = false;
    };
  }, [initialSession.id, initialSession.candidate_id]);

  // ── Two-way Socket.IO Live Telemetry Connection (Admin Monitor) ───────────
  const { user } = useAuth();
  const monitorSessionIds = useMemo(() => [session.id], [session.id]);
  const { isConnected: isSocketConnected, telemetryMap } = useAdminMonitorSocket(monitorSessionIds, user);
  const activeTelemetry = telemetry || telemetryMap[session.id];

  // ── Sync with live Socket.IO telemetry ──────────────────────────────────
  useEffect(() => {
    if (!activeTelemetry) return;

    if (isPaused) {
      pausedBufferRef.current = {
        code: activeTelemetry.code,
        file: activeTelemetry.activeFile,
        cursor: activeTelemetry.cursor,
        execution: activeTelemetry.lastExecution,
      };
      return;
    }

    if (activeTelemetry.code !== undefined) {
      setLiveCode(activeTelemetry.code);
    }
    if (activeTelemetry.activeFile) {
      setActiveFile(activeTelemetry.activeFile);
    }
    if (activeTelemetry.cursor) {
      setCursor(activeTelemetry.cursor);
    }
    if (activeTelemetry.isTyping !== undefined) {
      setIsTyping(activeTelemetry.isTyping);
    }
    if (activeTelemetry.presence) {
      setPresence(activeTelemetry.presence);
    }
    if (activeTelemetry.lastExecution) {
      setLastExecution(activeTelemetry.lastExecution);
    }
    if (activeTelemetry.activityHistory?.length) {
      setActivityHistory(activeTelemetry.activityHistory);
    }
    if (activeTelemetry.lastSeenAt) {
      setLastActivityAt(activeTelemetry.lastSeenAt);
      setLastEventAt(activeTelemetry.lastSeenAt);
    }
  }, [activeTelemetry, isPaused]);

  useEffect(() => {
    setRtConnected(isSocketConnected ? 'connected' : 'disconnected');
  }, [isSocketConnected]);

  // ── Heartbeat & Duration Ticker (every second) ───────────────────────────
  useEffect(() => {
    setElapsed(formatDuration(session.started_at || session.created_at));
    const timer = setInterval(() => {
      setTick(t => t + 1);
      setElapsed(formatDuration(session.started_at || session.created_at));
    }, 1000);
    return () => clearInterval(timer);
  }, [session.started_at, session.created_at]);

  // ── Handle Visual Pause / Resume ─────────────────────────────────────────
  const handleTogglePause = useCallback(() => {
    setIsPaused(prev => {
      const next = !prev;
      if (!next) {
        // Resuming: flush paused buffer immediately
        if (pausedBufferRef.current.code !== undefined) {
          setLiveCode(pausedBufferRef.current.code);
        }
        if (pausedBufferRef.current.file) {
          setActiveFile(pausedBufferRef.current.file);
        }
        if (pausedBufferRef.current.cursor) {
          setCursor(pausedBufferRef.current.cursor);
        }
        if (pausedBufferRef.current.execution) {
          setLastExecution(pausedBufferRef.current.execution);
        }
        pausedBufferRef.current = {};
      }
      return next;
    });
  }, []);

  // ── Activity Timeline Filtering ──────────────────────────────────────────
  const filteredActivities = useMemo(() => {
    if (activityFilter === 'all') return activityHistory;
    if (activityFilter === 'code') {
      return activityHistory.filter(a => a.type.includes('CODE') || a.type.includes('TYPING'));
    }
    if (activityFilter === 'exec') {
      return activityHistory.filter(a => a.type.includes('TEST') || a.type.includes('RUN'));
    }
    if (activityFilter === 'nav') {
      return activityHistory.filter(a => a.type.includes('FILE') || a.type.includes('QUESTION'));
    }
    return activityHistory;
  }, [activityHistory, activityFilter]);

  // ── Diff Lines Computation ───────────────────────────────────────────────
  const diffLines = useMemo(() => {
    if (!showDiff) return [];
    return computeSimpleDiff(initialCodeSnapshotRef.current, liveCode);
  }, [showDiff, liveCode]);

  // Split code lines for normal line-numbered display
  const rawCodeLines = useMemo(() => {
    return liveCode.split('\n');
  }, [liveCode]);

  // Inactivity detection
  const secSinceLastActivity = timeAgoSec(lastActivityAt);
  const isInactiveOver15s = secSinceLastActivity >= 15;
  const secSinceLastEvent = timeAgoSec(lastEventAt);

  // Question counts
  const totalQuestions = questionMeta.totalInTrack || 10;
  const currentQNum = questionMeta.orderNumber || 1;
  const completedCount = completedQuestionIds.size;
  const remainingCount = Math.max(0, totalQuestions - completedCount - 1);

  return (
    <div className={`swm-modal-backdrop ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      <div className="swm-window-container">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION E: MONITOR HEADER                                         */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <header className="swm-header">
          {/* Identity & Academic Meta */}
          <div className="swm-header-identity">
            <div className="swm-avatar-badge">
              {candidateProfile?.avatar_url ? (
                <img src={candidateProfile.avatar_url} alt="" className="swm-avatar-img" />
              ) : (
                <div className="swm-avatar-fallback">
                  {session.candidate_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className={`swm-presence-indicator ${presence}`} title={`Presence: ${presence}`} />
            </div>

            <div className="swm-identity-details">
              <div className="swm-name-row">
                <h2 className="swm-candidate-title">{session.candidate_name}</h2>
                <span className="swm-id-chip" title="Student ID">{studentId}</span>
                <span className="swm-track-pill">{questionMeta.trackName}</span>
                <span className={`swm-live-pill ${presence}`}>
                  <span className="swm-pulse-dot" />
                  {presence === 'online' ? '🟢 LIVE' : presence === 'idle' ? '🟡 IDLE' : '🔴 DISCONNECTED'}
                </span>
              </div>
              <div className="swm-academic-row">
                <span><strong>Program:</strong> {questionMeta.programName}</span>
                <span className="swm-dot-sep">·</span>
                <span><strong>Course:</strong> {questionMeta.courseName}</span>
                <span className="swm-dot-sep">·</span>
                <span><strong>Interview:</strong> {interviewId}</span>
                <span className="swm-dot-sep">·</span>
                <span><strong>Session:</strong> <code>{sessionIdFormatted}</code></span>
              </div>
            </div>
          </div>

          {/* Session Progress & Realtime Health Strip */}
          <div className="swm-header-telemetry">
            <div className="swm-stat-box">
              <span className="swm-stat-label">Current Question</span>
              <span className="swm-stat-value">
                Question {currentQNum} / {totalQuestions}
              </span>
            </div>

            <div className="swm-stat-box">
              <span className="swm-stat-label">Duration</span>
              <span className="swm-stat-value timer">⏱ {elapsed}</span>
            </div>

            <div className="swm-stat-box">
              <span className="swm-stat-label">Realtime Health</span>
              <span className={`swm-stat-value rt-${rtConnected}`}>
                {rtConnected === 'connected' ? '🟢 REALTIME CONNECTED' : rtConnected === 'reconnecting' ? '🟡 RECONNECTING…' : '🔴 DISCONNECTED'}
              </span>
              <span className="swm-stat-sub">
                Last event: {secSinceLastEvent < 2 ? 'just now' : `${secSinceLastEvent}s ago`}
              </span>
            </div>

            {/* Admin Controls (Section AA) */}
            <div className="swm-header-actions">
              <button
                type="button"
                className={`swm-ctrl-btn ${isPaused ? 'active-warning' : ''}`}
                onClick={handleTogglePause}
                title={isPaused ? 'Resume live visual updates' : 'Pause visual updates to inspect without jumping'}
              >
                {isPaused ? '▶ Resume Stream' : '⏸ Pause Stream'}
              </button>

              <button
                type="button"
                className={`swm-ctrl-btn ${showDiff ? 'active-diff' : ''}`}
                onClick={() => setShowDiff(v => !v)}
                title="Toggle Code Diff view"
              >
                {showDiff ? '📄 Code View' : '🔀 Code Diff'}
              </button>

              <button
                type="button"
                className="swm-ctrl-btn"
                onClick={() => setIsFullscreen(v => !v)}
                title="Toggle Fullscreen"
              >
                {isFullscreen ? '⤡ Exit Fullscreen' : '⛶ Fullscreen'}
              </button>

              <button
                type="button"
                className="swm-close-btn"
                onClick={onClose}
                title="Close Monitor"
              >
                ✕
              </button>
            </div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION F: VIRTUAL STUDENT WORKSPACE (4-PANEL LAYOUT)             */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="swm-workspace-body">
          {/* ───────────────────────────────────────────────────────────────── */}
          {/* LEFT PANEL: Question Progress & Requirements (Section F & M)     */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <aside className="swm-panel-left">
            <div className="swm-panel-header">
              <span className="swm-panel-icon">📑</span>
              <h3>Interview Questions & Progress</h3>
            </div>

            {/* Question Progress Metrics (Section M) */}
            <div className="swm-progress-summary">
              <div className="swm-prog-item">
                <span className="swm-prog-num green">{completedCount}</span>
                <span className="swm-prog-lbl">Completed ✓</span>
              </div>
              <div className="swm-prog-item">
                <span className="swm-prog-num blue">1</span>
                <span className="swm-prog-lbl">Current →</span>
              </div>
              <div className="swm-prog-item">
                <span className="swm-prog-num gray">{remainingCount}</span>
                <span className="swm-prog-lbl">Remaining ○</span>
              </div>
            </div>

            {/* Questions Step List */}
            <div className="swm-question-stepper">
              {questionMeta.questionsInTrack.slice(0, 12).map(q => {
                const isCurrent = q.id.toUpperCase() === session.question_id.toUpperCase();
                const isDone = completedQuestionIds.has(q.id.toUpperCase());

                return (
                  <div
                    key={q.id}
                    className={`swm-step-item ${isCurrent ? 'current' : isDone ? 'completed' : 'pending'}`}
                  >
                    <span className="swm-step-marker">
                      {isDone ? '✓' : isCurrent ? '→' : '○'}
                    </span>
                    <span className="swm-step-title" title={q.title}>
                      Question {q.order}: {q.title}
                    </span>
                    {isCurrent && <span className="swm-cur-badge">CURRENT</span>}
                  </div>
                );
              })}
            </div>

            {/* Current Question Requirements */}
            <div className="swm-prompt-card">
              <div className="swm-prompt-header">
                <span className="swm-qid-badge">{session.question_id}</span>
                <span className={`swm-diff-tag diff-${questionMeta.difficulty.toLowerCase()}`}>
                  {questionMeta.difficulty}
                </span>
                <span className="swm-cat-tag">{questionMeta.category}</span>
              </div>
              <h4 className="swm-prompt-title">{questionMeta.title}</h4>
              <p className="swm-prompt-desc">{questionMeta.description}</p>
            </div>
          </aside>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* CENTER PANEL: True Live Code Editor & Diff (Section G, H, I)     */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <main className="swm-panel-center">
            {/* Live Editor Bar */}
            <div className="swm-editor-toolbar">
              <div className="swm-tab-bar">
                <div className="swm-file-tab active">
                  <span className="swm-tab-icon">📄</span>
                  <span className="swm-tab-name">{activeFile}</span>
                  <span className="swm-tab-badge">LIVE BUFFER</span>
                </div>
              </div>

              <div className="swm-editor-meta">
                {isPaused && (
                  <span className="swm-paused-chip">
                    ⏸ Visual Stream Paused
                  </span>
                )}
                <span className="swm-lang-chip">{session.language || 'javascript'}</span>
                {cursor && (
                  <span className="swm-cursor-chip">
                    Ln {cursor.line}, Col {cursor.column}
                  </span>
                )}
                <span className="swm-lines-chip">{rawCodeLines.length} lines</span>
              </div>
            </div>

            {/* Live Typing Indicator Banner (Section H) */}
            <div className={`swm-typing-strip ${isTyping ? 'typing-active' : 'typing-idle'}`}>
              <span className="swm-typing-icon">⌨️</span>
              {isTyping ? (
                <span className="swm-typing-text">
                  Student is actively typing…
                  <span className="swm-typing-dots"><span /><span /><span /></span>
                </span>
              ) : (
                <span className="swm-typing-text">Student stopped typing</span>
              )}
              {isInactiveOver15s && presence === 'online' && (
                <span className="swm-inactivity-alert">
                  ⚠️ No activity received for {secSinceLastActivity} seconds
                </span>
              )}
            </div>

            {/* Live Code Viewer Window */}
            <div className="swm-code-stage">
              {showDiff ? (
                /* CODE DIFF VIEW (Section I) */
                <div className="swm-diff-container">
                  <div className="swm-diff-header">
                    <span>🔀 Realtime Code Diff (vs Initial Checkpoint)</span>
                    <span className="swm-diff-legend">
                      <span className="leg-add">+ Added</span>
                      <span className="leg-rem">- Removed</span>
                    </span>
                  </div>
                  <pre className="swm-diff-body">
                    <code>
                      {diffLines.map((dl, idx) => (
                        <div key={idx} className={`swm-diff-line line-${dl.type}`}>
                          <span className="diff-line-num">{dl.lineNum}</span>
                          <span className="diff-sign">{dl.type === 'added' ? '+' : dl.type === 'removed' ? '-' : ' '}</span>
                          <span className="diff-content">{dl.text || ' '}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              ) : (
                /* TRUE LIVE CODE BUFFER (Section G) */
                <div className="swm-normal-code-view">
                  <div className="swm-gutter" aria-hidden="true">
                    {rawCodeLines.map((_, idx) => (
                      <span
                        key={idx + 1}
                        className={`swm-gutter-num ${cursor?.line === idx + 1 ? 'active-cursor-line' : ''}`}
                      >
                        {idx + 1}
                      </span>
                    ))}
                  </div>
                  <pre className="swm-code-pre">
                    <code>
                      {rawCodeLines.map((line, idx) => {
                        const isCursorLine = cursor?.line === idx + 1;
                        return (
                          <div
                            key={idx}
                            className={`swm-code-row ${isCursorLine ? 'row-cursor-highlight' : ''}`}
                          >
                            {line || ' '}
                            {isCursorLine && (
                              <span className="swm-realtime-cursor" aria-hidden="true">
                                |
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </code>
                  </pre>
                </div>
              )}
            </div>
          </main>

          {/* ───────────────────────────────────────────────────────────────── */}
          {/* RIGHT PANEL: Academic, Execution & Telemetry (Section F, L, N, O) */}
          {/* ───────────────────────────────────────────────────────────────── */}
          <aside className="swm-panel-right">
            {/* Student & Academic Card */}
            <div className="swm-side-card">
              <h4 className="swm-side-title">Academic & Candidate Profile</h4>
              <div className="swm-info-grid">
                <div className="swm-info-row">
                  <span className="swm-info-k">Full Name</span>
                  <span className="swm-info-v">{session.candidate_name}</span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Student ID</span>
                  <span className="swm-info-v">{studentId}</span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Email</span>
                  <span className="swm-info-v">{session.candidate_email || 'guest@candidate.edu'}</span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Program</span>
                  <span className="swm-info-v">{questionMeta.programName}</span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Course</span>
                  <span className="swm-info-v">{questionMeta.courseName}</span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Target Level</span>
                  <span className="swm-info-v">{candidateProfile?.experience_level || 'L4 Senior Frontend'}</span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Batch</span>
                  <span className="swm-info-v">{candidateProfile?.batch || '2026-Batch-A'}</span>
                </div>
              </div>
            </div>

            {/* Code Execution & Test Status (Section L) */}
            <div className="swm-side-card">
              <h4 className="swm-side-title">Live Code Execution & Tests</h4>
              <div className="swm-exec-box">
                {lastExecution ? (
                  lastExecution.status === 'running' ? (
                    <div className="swm-exec-state running">
                      <span className="swm-spinner" />
                      <span>▶ Running code…</span>
                    </div>
                  ) : lastExecution.status === 'success' ? (
                    <div className="swm-exec-state success">
                      <span className="swm-exec-icon">✅</span>
                      <div>
                        <strong>Execution completed</strong>
                        <div className="swm-exec-sub">
                          🧪 {lastExecution.total} / {lastExecution.total} tests passed ({lastExecution.runtimeMs || 0}ms)
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="swm-exec-state failed">
                      <span className="swm-exec-icon">❌</span>
                      <div>
                        <strong>Execution failed</strong>
                        <div className="swm-exec-sub">
                          🧪 {lastExecution.passed || 0} / {lastExecution.total || 0} tests passed
                        </div>
                        {lastExecution.error && (
                          <pre className="swm-exec-err">{lastExecution.error}</pre>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="swm-exec-state neutral">
                    <span>⏹️ Waiting for student to run tests</span>
                  </div>
                )}
              </div>
            </div>

            {/* Realtime Health & Connection Diagnostics (Section O & P) */}
            <div className="swm-side-card">
              <h4 className="swm-side-title">Realtime Telemetry & Health</h4>
              <div className="swm-info-grid">
                <div className="swm-info-row">
                  <span className="swm-info-k">Channel</span>
                  <span className="swm-info-v"><code>interview:{session.id.slice(0, 8)}</code></span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Presence</span>
                  <span className={`swm-info-v presence-${presence}`}>
                    {presence === 'online' ? '🟢 LIVE (Active)' : presence === 'idle' ? '🟡 IDLE' : '🔴 DISCONNECTED'}
                  </span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Realtime Link</span>
                  <span className="swm-info-v">
                    {rtConnected === 'connected' ? '🟢 CONNECTED' : '🟡 RECONNECTING…'}
                  </span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Last Packet</span>
                  <span className="swm-info-v">
                    {secSinceLastEvent < 2 ? 'just now' : `${secSinceLastEvent}s ago`}
                  </span>
                </div>
                <div className="swm-info-row">
                  <span className="swm-info-k">Activity State</span>
                  <span className="swm-info-v">
                    {isTyping ? 'Typing in editor' : isInactiveOver15s ? 'Silent > 15s' : 'Focused'}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* SECTION K: LIVE ACTIVITY TIMELINE (BOTTOM PANEL)                  */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <footer className="swm-footer-timeline">
          <div className="swm-timeline-bar">
            <div className="swm-timeline-title">
              <span className="swm-pulse-dot" />
              <strong>LIVE ACTIVITY TIMELINE</strong>
              <span className="swm-act-count">({filteredActivities.length} events)</span>
            </div>

            {/* Activity Filters */}
            <div className="swm-filter-pills">
              {(['all', 'code', 'exec', 'nav'] as const).map(f => (
                <button
                  key={f}
                  type="button"
                  className={`swm-pill-btn ${activityFilter === f ? 'active' : ''}`}
                  onClick={() => setActivityFilter(f)}
                >
                  {f === 'all' ? 'All Activity' : f === 'code' ? 'Code & Typing' : f === 'exec' ? 'Test Runs' : 'Navigation'}
                </button>
              ))}
            </div>
          </div>

          {/* Chronological Stream */}
          <div className="swm-timeline-scroll">
            {filteredActivities.length === 0 ? (
              <div className="swm-timeline-empty">No activity events recorded yet.</div>
            ) : (
              <div className="swm-timeline-items">
                {filteredActivities.map(act => (
                  <div key={act.id} className="swm-event-item">
                    <span className="swm-event-time">{formatClockTime(act.timestamp)}</span>
                    <span className="swm-event-icon">{getTimelineIcon(act.type)}</span>
                    <span className="swm-event-text">{act.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

function getTimelineIcon(type: string): string {
  switch (type) {
    case 'TYPING_STARTED':
      return '⌨';
    case 'TYPING_STOPPED':
      return '💤';
    case 'CODE_CHANGED':
      return '✏';
    case 'TEST_STARTED':
      return '▶';
    case 'TEST_COMPLETED':
      return '🧪';
    case 'FILE_OPENED':
      return '📂';
    case 'QUESTION_OPENED':
      return '📑';
    case 'SESSION_STARTED':
      return '🚀';
    case 'SESSION_ENDED':
      return '🏁';
    case 'DISCONNECTED':
      return '🔴';
    default:
      return '⚡';
  }
}
