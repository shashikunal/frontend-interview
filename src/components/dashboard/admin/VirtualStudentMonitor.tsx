import React, { useState, useMemo, useEffect } from 'react';
import type { InterviewSession } from '../../../lib/interviewSessionService';
import { getUnifiedQuestionMetadata } from '../../../lib/questionCatalogHelper';

export interface LiveStudentTelemetry {
  isTyping: boolean;
  activeFile: string;
  code: string;
  lineCount: number;
  cursor: { line: number; column: number; at: number } | null;
  focused: boolean;
  presence: 'online' | 'idle' | 'disconnected' | 'reconnecting';
  lastSeenAt: number;
  lastExecution: {
    status: 'running' | 'success' | 'failed' | 'error';
    passed?: number;
    total?: number;
    runtimeMs?: number;
    error?: string;
    timestamp: number;
  } | null;
  activityHistory: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: number;
  }>;
}

interface VirtualStudentMonitorProps {
  session: InterviewSession;
  telemetry?: Partial<LiveStudentTelemetry>;
  onExpand?: (session: InterviewSession) => void;
  isExpanded?: boolean;
}

function relTime(ts?: number): string {
  if (!ts) return 'just now';
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 4) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  return `${Math.floor(diffSec / 3600)}h ago`;
}

function formatElapsed(startedAtIso: string): string {
  const startMs = new Date(startedAtIso).getTime();
  if (isNaN(startMs)) return '00:00';
  const diffSec = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  const m = Math.floor(diffSec / 60);
  const s = diffSec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const VirtualStudentMonitor: React.FC<VirtualStudentMonitorProps> = ({
  session,
  telemetry,
  onExpand,
  isExpanded = false,
}) => {
  const [elapsed, setElapsed] = useState<string>('00:00');

  // Timer ticker
  useEffect(() => {
    setElapsed(formatElapsed(session.started_at || session.created_at));
    const interval = setInterval(() => {
      setElapsed(formatElapsed(session.started_at || session.created_at));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.started_at, session.created_at]);

  // Derived presence
  const presence = telemetry?.presence || 'online';
  const isTyping = Boolean(telemetry?.isTyping);
  const cursor = telemetry?.cursor;
  const execution = telemetry?.lastExecution;
  const activities = telemetry?.activityHistory || [];

  // Question & Academic Metadata
  const questionMeta = useMemo(() => {
    return getUnifiedQuestionMetadata(session.question_id);
  }, [session.question_id]);

  const studentId = `STU-${session.candidate_id ? session.candidate_id.replace(/-/g, '').slice(0, 4).toUpperCase() : '1024'}`;
  const interviewId = `INT-${session.id.replace(/-/g, '').slice(0, 4).toUpperCase()}`;
  const sessionIdFormatted = `SES-${session.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;

  // Code resolution
  const activeFile = telemetry?.activeFile || session.active_file || 'solution.js';
  const initialFileSnapshot = session.files_snapshot?.[activeFile] || Object.values(session.files_snapshot || {})[0] || '';
  const currentCode = telemetry?.code !== undefined ? telemetry.code : (session.current_code_snapshot || initialFileSnapshot || '// Waiting for candidate to begin coding...');

  // Split code lines for virtual line-numbered view
  const lines = useMemo(() => {
    return currentCode.split('\n').slice(0, 24); // Show first 24 lines in card preview
  }, [currentCode]);

  const totalLines = currentCode.split('\n').length;

  return (
    <div className={`vsm-card ${presence} ${isExpanded ? 'vsm-expanded' : ''}`}>
      {/* 1. Card Top Bar: Candidate, Presence, Track, Timer */}
      <div className="vsm-topbar">
        <div className="vsm-candidate-block">
          <div className="vsm-avatar" style={{ backgroundColor: getAvatarColor(session.candidate_name) }}>
            {session.candidate_name.charAt(0).toUpperCase()}
          </div>
          <div className="vsm-candidate-meta">
            <div className="vsm-name-row">
              <strong className="vsm-candidate-name">{session.candidate_name}</strong>
              <span className="vsm-id-tag">{studentId}</span>
              <span className={`vsm-presence-pill ${presence}`}>
                <span className="vsm-pulse-dot" />
                {presence === 'online' ? 'LIVE' : presence === 'idle' ? 'IDLE' : presence === 'reconnecting' ? 'RECONNECTING' : 'DISCONNECTED'}
              </span>
            </div>
            <div className="vsm-academic-sub">
              <span>{questionMeta.programName}</span> · <span>{questionMeta.trackName}</span>
            </div>
          </div>
        </div>

        <div className="vsm-top-controls">
          <div className="vsm-timer-badge" title="Elapsed interview time">
            ⏱ {elapsed}
          </div>
          <button
            type="button"
            className="vsm-expand-btn primary-monitor-btn"
            onClick={() => onExpand?.(session)}
            title="Open Complete Realtime Virtual Monitor"
          >
            VIEW MONITOR ⤡
          </button>
        </div>
      </div>

      {/* 2. Question & File Context */}
      <div className="vsm-context-bar">
        <div className="vsm-question-info">
          <span className="vsm-qid-tag">{session.question_id}</span>
          <span className="vsm-q-order-badge">Question {questionMeta.orderNumber} / {questionMeta.totalInTrack}</span>
          <span className="vsm-qtitle" title={session.question_title}>
            {session.question_title}
          </span>
        </div>
        <div className="vsm-file-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
          </svg>
          <span>{activeFile}</span>
        </div>
      </div>

      {/* 3. Live Virtual Code Viewer */}
      <div className="vsm-code-window">
        <div className="vsm-code-window-header">
          <div className="vsm-window-dots">
            <span className="vsm-wdot red" />
            <span className="vsm-wdot yellow" />
            <span className="vsm-wdot green" />
          </div>
          <span className="vsm-editor-title">Virtual Live Code Monitor</span>
          <div className="vsm-window-status">
            {cursor && (
              <span className="vsm-cursor-pos">
                Ln {cursor.line}, Col {cursor.column}
              </span>
            )}
            <span className="vsm-line-count">{totalLines} lines</span>
          </div>
        </div>

        <div className="vsm-code-content">
          <div className="vsm-line-numbers" aria-hidden="true">
            {lines.map((_, idx) => (
              <span
                key={idx + 1}
                className={`vsm-line-num ${cursor?.line === idx + 1 ? 'vsm-active-line' : ''}`}
              >
                {idx + 1}
              </span>
            ))}
          </div>
          <pre className="vsm-code-body">
            <code>
              {lines.map((lineText, idx) => (
                <div
                  key={idx}
                  className={`vsm-code-line ${cursor?.line === idx + 1 ? 'vsm-cursor-line' : ''}`}
                >
                  {lineText || ' '}
                  {cursor?.line === idx + 1 && (
                    <span className="vsm-blinking-cursor" aria-hidden="true">|</span>
                  )}
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Live Typing Overlay Bar */}
        {isTyping && (
          <div className="vsm-typing-banner">
            <span className="vsm-typing-icon">⌨️</span>
            <span>Student is actively typing...</span>
            <div className="vsm-typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>

      {/* 4. Telemetry Status Bar: Execution & Focus */}
      <div className="vsm-telemetry-strip">
        <div className="vsm-exec-status">
          {execution ? (
            execution.status === 'running' ? (
              <span className="vsm-status-chip running">
                <span className="vsm-spinner-mini" /> Running code...
              </span>
            ) : execution.status === 'success' ? (
              <span className="vsm-status-chip success">
                ✅ {execution.total}/{execution.total} tests passed ({execution.runtimeMs || 0}ms)
              </span>
            ) : (
              <span className="vsm-status-chip failed">
                ❌ {execution.passed || 0}/{execution.total || 0} tests passed
              </span>
            )
          ) : (
            <span className="vsm-status-chip neutral">
              ⏹️ No test runs yet
            </span>
          )}
        </div>

        <div className="vsm-last-active">
          <span>Active {relTime(telemetry?.lastSeenAt)}</span>
        </div>
      </div>

      {/* 5. Live Activity Timeline Stream */}
      <div className="vsm-activity-container">
        <div className="vsm-activity-title">Live Activity Stream</div>
        {activities.length === 0 ? (
          <div className="vsm-activity-empty">Listening for candidate broadcast events...</div>
        ) : (
          <ul className="vsm-activity-list">
            {activities.slice(0, 3).map((act) => (
              <li key={act.id} className="vsm-activity-item">
                <span className="vsm-activity-icon">{getActivityIcon(act.type)}</span>
                <span className="vsm-activity-msg">{act.message}</span>
                <span className="vsm-activity-time">{relTime(act.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 6. Card Footer with VIEW MONITOR Action */}
      <div className="vsm-card-footer">
        <span className="vsm-session-id">{interviewId} · {sessionIdFormatted}</span>
        <div className="vsm-action-buttons">
          <button
            type="button"
            className="vsm-view-monitor-btn"
            onClick={() => onExpand?.(session)}
            title="Open complete Admin Realtime Virtual Workspace Monitor"
          >
            🖥️ VIEW MONITOR →
          </button>
        </div>
      </div>
    </div>
  );
};

function getActivityIcon(type: string): string {
  switch (type) {
    case 'TYPING_STARTED':
    case 'typing':
      return '⌨️';
    case 'CODE_CHANGED':
      return '✏️';
    case 'TEST_STARTED':
    case 'running':
      return '▶️';
    case 'TEST_COMPLETED':
    case 'execution':
      return '🧪';
    case 'FILE_OPENED':
      return '📄';
    case 'QUESTION_OPENED':
      return '📑';
    case 'EDITOR_FOCUSED':
      return '🎯';
    case 'EDITOR_BLURRED':
      return '💤';
    default:
      return '⚡';
  }
}

function getAvatarColor(name: string): string {
  const colors = [
    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1'
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
