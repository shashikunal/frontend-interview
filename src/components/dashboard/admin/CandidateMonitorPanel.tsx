import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { InterviewSession } from '../../../lib/interviewSessionService';
import type { LiveTelemetryItem } from '../../../hooks/useAdminMonitorSocket';
import { bindMonacoToYDoc } from '../../../lib/realtime/yjsSync';
import type { MonacoBinding } from 'y-monaco';
import type * as Y from 'yjs';
import './CandidateMonitorPanel.css';

export interface CandidateMonitorPanelProps {
  session: InterviewSession;
  telemetry?: LiveTelemetryItem;
  getYDoc: (sessionId: string) => Y.Doc;
}

type MonitorTab = 'code' | 'activity' | 'interview' | 'execution' | 'details';

function formatElapsed(startedAt?: string | null): string {
  if (!startedAt) return '00:00 elapsed';
  const start = new Date(startedAt).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')} elapsed`;
}

function formatClock(timestamp: number): string {
  const d = new Date(timestamp);
  return d.toTimeString().split(' ')[0];
}

export const CandidateMonitorPanel: React.FC<CandidateMonitorPanelProps> = ({
  session,
  telemetry,
  getYDoc,
}) => {
  const [activeTab, setActiveTab] = useState<MonitorTab>('code');
  const [selectedFile, setSelectedFile] = useState<string>(
    telemetry?.activeFile || session.active_file || 'solution.js'
  );

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);

  // Sync selected file when telemetry pushes file switch
  useEffect(() => {
    if (telemetry?.activeFile && telemetry.activeFile !== selectedFile) {
      setSelectedFile(telemetry.activeFile);
    }
  }, [telemetry?.activeFile]);

  // Determine presence
  const presence = telemetry?.presence || (session.status === 'active' || session.status === 'in_progress' ? 'online' : 'disconnected');
  const isTyping = Boolean(telemetry?.isTyping);

  // Candidate identifiers
  const candidateName = session.candidate_name || session.candidate_email?.split('@')[0] || 'Candidate';
  const studentId = `STU-${(session.candidate_id || session.id).slice(-4).toUpperCase()}`;
  const questionTitle = session.question_title || session.question_id || 'Coding Assessment';

  // Available files for multi-file sessions
  const availableFiles = useMemo(() => {
    const files = new Set<string>();
    files.add(selectedFile);
    files.add('solution.js');
    if (session.files_snapshot) {
      Object.keys(session.files_snapshot).forEach(f => files.add(f));
    }
    return Array.from(files);
  }, [session.files_snapshot, selectedFile]);

  // Bind Monaco to Yjs on mount or file switch
  const handleEditorMount = useCallback((editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance;
    const ydoc = getYDoc(session.id);
    const initialCode = telemetry?.code || session.current_code_snapshot || '';

    if (bindingRef.current) {
      try { bindingRef.current.destroy(); } catch (_) {}
      bindingRef.current = null;
    }

    bindingRef.current = bindMonacoToYDoc(
      ydoc,
      selectedFile,
      editorInstance,
      initialCode
    );
  }, [session.id, selectedFile, getYDoc, telemetry?.code, session.current_code_snapshot]);

  // Re-bind when selectedFile changes
  useEffect(() => {
    if (editorRef.current) {
      const ydoc = getYDoc(session.id);
      if (bindingRef.current) {
        try { bindingRef.current.destroy(); } catch (_) {}
        bindingRef.current = null;
      }
      bindingRef.current = bindMonacoToYDoc(
        ydoc,
        selectedFile,
        editorRef.current,
        telemetry?.code || ''
      );
    }
  }, [selectedFile, session.id, getYDoc]);

  // Cleanup binding on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        try { bindingRef.current.destroy(); } catch (_) {}
        bindingRef.current = null;
      }
    };
  }, []);

  // Execution state
  const exec = telemetry?.lastExecution;

  return (
    <div className={`candidate-monitor-panel status-${presence}`}>
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="cmp-header">
        <div className="cmp-user-info">
          <div className={`cmp-avatar ${isTyping ? 'typing' : ''}`}>
            {candidateName.charAt(0).toUpperCase()}
          </div>
          <div className="cmp-names">
            <div className="cmp-name-row">
              <span className="cmp-candidate-name">{candidateName}</span>
              <span className="cmp-session-badge">{studentId}</span>
            </div>
            <div className="cmp-subtext-row">
              <span>{session.question_id}</span>
              <span>•</span>
              <span>{formatElapsed(session.started_at || session.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="cmp-header-meta">
          <span className={`cmp-presence-badge ${presence}`}>
            <span className="cmp-dot" />
            {presence === 'online' ? (isTyping ? 'TYPING' : 'LIVE') : presence.toUpperCase()}
          </span>
          <span className="cmp-track-badge">
            {session.question_id.startsWith('DSA') ? 'DSA' : session.question_id.startsWith('FJP') ? 'FRONTEND' : 'CORE PROG'}
          </span>
        </div>
      </div>

      {/* ── TABS BAR ─────────────────────────────────────────────────────── */}
      <div className="cmp-tabs-bar">
        <button
          type="button"
          className={`cmp-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          <span>💻 Code</span>
          {isTyping && <span className="cmp-tab-badge">typing</span>}
        </button>
        <button
          type="button"
          className={`cmp-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <span>⚡ Activity</span>
          {telemetry?.activityHistory?.length ? (
            <span className="cmp-tab-badge">{telemetry.activityHistory.length}</span>
          ) : null}
        </button>
        <button
          type="button"
          className={`cmp-tab-btn ${activeTab === 'interview' ? 'active' : ''}`}
          onClick={() => setActiveTab('interview')}
        >
          <span>📋 Interview</span>
        </button>
        <button
          type="button"
          className={`cmp-tab-btn ${activeTab === 'execution' ? 'active' : ''}`}
          onClick={() => setActiveTab('execution')}
        >
          <span>▶ Execution</span>
          {exec?.status && (
            <span className={`cmp-tab-badge ${exec.status}`}>
              {exec.status === 'success' ? '✓' : exec.status === 'running' ? '⏳' : '✗'}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`cmp-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <span>ℹ Details</span>
        </button>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────────────── */}
      <div className="cmp-tab-content">
        {/* 1. CODE TAB */}
        {activeTab === 'code' && (
          <>
            <div className="cmp-code-toolbar">
              <div className="cmp-code-left">
                {availableFiles.length > 1 ? (
                  <select
                    className="cmp-file-select"
                    value={selectedFile}
                    onChange={e => setSelectedFile(e.target.value)}
                  >
                    {availableFiles.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                ) : (
                  <code style={{ color: '#38bdf8', fontSize: 11 }}>{selectedFile}</code>
                )}
                <span className="cmp-live-sync-indicator">
                  <span className="cmp-dot" /> LIVE SYNC (YJS)
                </span>
              </div>
              <div className="cmp-code-right">
                {telemetry?.cursor ? (
                  <span className="cmp-cursor-pos">
                    Ln {telemetry.cursor.line}, Col {telemetry.cursor.column}
                  </span>
                ) : (
                  <span className="cmp-cursor-pos">Editor Active</span>
                )}
              </div>
            </div>

            <div className="cmp-monaco-wrapper">
              <Editor
                height="100%"
                language={session.language || 'javascript'}
                theme="vs-dark"
                value={telemetry?.code || session.current_code_snapshot || ''}
                onMount={handleEditorMount}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  folding: true,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  renderLineHighlight: 'all',
                  domReadOnly: true,
                }}
              />
            </div>
          </>
        )}

        {/* 2. ACTIVITY TAB */}
        {activeTab === 'activity' && (
          <div className="cmp-activity-feed">
            {telemetry?.activityHistory && telemetry.activityHistory.length > 0 ? (
              telemetry.activityHistory.map(item => (
                <div key={item.id} className="cmp-activity-row">
                  <span className="cmp-activity-time">{formatClock(item.timestamp)}</span>
                  <span className="cmp-activity-msg">{item.message}</span>
                </div>
              ))
            ) : (
              <div className="cmp-empty-list">No activity recorded yet for this session.</div>
            )}
          </div>
        )}

        {/* 3. INTERVIEW TAB */}
        {activeTab === 'interview' && (
          <div className="cmp-interview-pane">
            <div className="cmp-q-card">
              <div className="cmp-q-title">{questionTitle}</div>
              <div style={{ color: '#94a3b8', fontSize: 12 }}>
                Question ID: <strong style={{ color: '#e2e8f0' }}>{session.question_id}</strong>
              </div>
            </div>

            <div className="cmp-stats-grid">
              <div className="cmp-stat-box">
                <span className="cmp-stat-lbl">Track</span>
                <span className="cmp-stat-val" style={{ fontSize: 13 }}>
                  {session.question_id.startsWith('DSA') ? 'DSA Masterclass' : 'Core Programming'}
                </span>
              </div>
              <div className="cmp-stat-box">
                <span className="cmp-stat-lbl">Duration</span>
                <span className="cmp-stat-val" style={{ fontSize: 13 }}>
                  {formatElapsed(session.started_at || session.created_at)}
                </span>
              </div>
              <div className="cmp-stat-box">
                <span className="cmp-stat-lbl">Status</span>
                <span className="cmp-stat-val" style={{ fontSize: 13, color: '#34d399' }}>
                  {session.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 4. EXECUTION TAB */}
        {activeTab === 'execution' && (
          <div className="cmp-exec-pane">
            <div className="cmp-exec-header">
              <span className="cmp-stat-lbl">Test Execution Engine</span>
              {exec ? (
                <span className={`cmp-exec-status-pill ${exec.status}`}>
                  {exec.status.toUpperCase()}
                  {exec.runtimeMs ? ` (${exec.runtimeMs}ms)` : ''}
                </span>
              ) : (
                <span className="cmp-exec-status-pill">NO RUNS YET</span>
              )}
            </div>

            {exec ? (
              <>
                <div style={{ fontSize: 12, color: '#cbd5e1' }}>
                  Result: <strong>{exec.passed ?? 0}</strong> / <strong>{exec.total ?? 0}</strong> tests passed.
                </div>
                <div className="cmp-exec-output">
                  {exec.output || exec.error || (exec.status === 'running' ? 'Executing tests against sandbox...' : 'Execution completed.')}
                </div>
              </>
            ) : (
              <div className="cmp-empty-list">Student has not run code tests yet.</div>
            )}
          </div>
        )}

        {/* 5. DETAILS TAB */}
        {activeTab === 'details' && (
          <div className="cmp-details-table">
            <span className="cmp-dt-label">Student Name:</span>
            <span className="cmp-dt-val">{candidateName}</span>

            <span className="cmp-dt-label">Student ID:</span>
            <span className="cmp-dt-val">{studentId}</span>

            <span className="cmp-dt-label">Email:</span>
            <span className="cmp-dt-val">{session.candidate_email || 'guest@interview.local'}</span>

            <span className="cmp-dt-label">Session ID:</span>
            <span className="cmp-dt-val">{session.id}</span>

            <span className="cmp-dt-label">Started At:</span>
            <span className="cmp-dt-val">
              {new Date(session.started_at || session.created_at).toLocaleString()}
            </span>

            <span className="cmp-dt-label">Last Active:</span>
            <span className="cmp-dt-val">
              {telemetry?.lastSeenAt ? new Date(telemetry.lastSeenAt).toLocaleTimeString() : 'Just now'}
            </span>

            <span className="cmp-dt-label">Realtime Link:</span>
            <span className="cmp-dt-val" style={{ color: '#34d399' }}>
              Socket.IO + Yjs Active
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
