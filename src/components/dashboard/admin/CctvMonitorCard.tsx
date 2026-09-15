import React from 'react';
import type { InterviewSession } from '../../../lib/interviewSessionService';
import type { LiveTelemetryItem } from '../../../hooks/useAdminMonitorSocket';
import './CctvMonitorCard.css';

export interface CctvMonitorCardProps {
  session: InterviewSession;
  camIndex: number;
  telemetry?: LiveTelemetryItem;
  onFocusCam: (session: InterviewSession) => void;
}

function trackOf(questionId?: string | null): { label: string; icon: string; kind: string } {
  const u = String(questionId || '').toUpperCase();
  if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return { label: 'Core JS', icon: '💻', kind: 'cp' };
  if (u.startsWith('DSA')) return { label: 'DSA Masterclass', icon: '🧠', kind: 'dsa' };
  if (u.startsWith('FJP')) return { label: 'Frontend JS', icon: '🌐', kind: 'fjs' };
  if (u.startsWith('Q') || u.startsWith('MC')) return { label: 'Machine Coding', icon: '⚡', kind: 'mc' };
  if (/^\d+$/.test(u)) return { label: 'Quiz Bank', icon: '❓', kind: 'quiz' };
  return { label: 'Studio', icon: '🛠️', kind: 'other' };
}

function formatElapsed(startedAt?: string | null): string {
  if (!startedAt) return '00:00';
  const start = new Date(startedAt).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const mins = Math.floor(diffSec / 60);
  const secs = diffSec % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const CctvMonitorCard: React.FC<CctvMonitorCardProps> = ({
  session,
  camIndex,
  telemetry,
  onFocusCam,
}) => {
  const track = trackOf(session.question_id);
  const isTyping = Boolean(telemetry?.isTyping);
  const presence = telemetry?.presence || (session.status === 'active' || session.status === 'in_progress' ? 'online' : 'disconnected');
  const code = telemetry?.code || session.current_code_snapshot || '// Candidate waiting to start typing...';
  const lines = code.split('\n');
  const candidateName = telemetry?.candidateName || session.candidate_name || session.candidate_email?.split('@')[0] || 'Candidate';
  const studentId = `STU-${(session.candidate_id || session.id).slice(-4).toUpperCase()}`;
  const keystrokes = telemetry?.keystrokeCount ?? code.length;
  const activeFile = telemetry?.activeFile || session.active_file || 'solution.js';

  return (
    <div className={`cctv-card ${isTyping ? 'cctv-typing-active' : ''} presence-${presence}`}>
      {/* 1. CCTV Camera Bezel Header */}
      <div className="cctv-bezel-header">
        <div className="cctv-cam-id">
          <span className="cctv-rec-dot" />
          <span className="cctv-cam-title">CAM-{camIndex.toString().padStart(2, '0')}</span>
          <span className="cctv-cam-track-badge" title={track.label}>
            {track.icon} {track.label}
          </span>
        </div>

        <div className="cctv-header-right">
          <span className="cctv-elapsed-time">⏱️ {formatElapsed(session.started_at || session.created_at)}</span>
          <span className={`cctv-status-badge ${presence}`}>
            {presence === 'online' ? (isTyping ? 'LIVE · TYPING' : 'LIVE') : presence === 'idle' ? 'IDLE' : 'OFFLINE'}
          </span>
        </div>
      </div>

      {/* 2. Candidate Mini Bar */}
      <div className="cctv-candidate-strip">
        <div className="cctv-avatar">
          {candidateName.slice(0, 2).toUpperCase()}
        </div>
        <div className="cctv-candidate-details">
          <div className="cctv-name-row">
            <span className="cctv-candidate-name">{candidateName}</span>
            <span className="cctv-student-id">{studentId}</span>
          </div>
          <div className="cctv-q-title" title={session.question_title}>
            {session.question_id ? `[${session.question_id}] ` : ''}{session.question_title || 'Coding Challenge'}
          </div>
        </div>
        <button
          type="button"
          className="cctv-focus-cam-btn"
          onClick={() => onFocusCam(session)}
          title="Open Full Monaco Code & Execution Monitor"
        >
          🔍 Focus CAM
        </button>
      </div>

      {/* 3. CCTV CRT Screen with Scanlines & Live Code */}
      <div className="cctv-screen-container" onClick={() => onFocusCam(session)}>
        <div className="cctv-scanlines-overlay" />
        
        {/* Live Typing HUD Notification */}
        {isTyping ? (
          <div className="cctv-typing-hud">
            <span className="typing-icon">⌨️</span>
            <span className="typing-text"><strong>{candidateName}</strong> is typing in <em>{activeFile}</em></span>
            <span className="typing-dots">
              <span />
              <span />
              <span />
            </span>
          </div>
        ) : (
          <div className="cctv-idle-hud">
            <span className="idle-dot" />
            <span>Feed Active · Monitoring {activeFile}</span>
          </div>
        )}

        {/* Live Streaming Code Viewport */}
        <div className="cctv-code-viewport">
          <div className="cctv-gutter">
            {lines.slice(0, 14).map((_, i) => (
              <span key={i} className="cctv-line-num">{i + 1}</span>
            ))}
          </div>
          <pre className="cctv-code-body">
            <code>
              {lines.slice(0, 14).join('\n') || '// No code keystrokes yet'}
            </code>
          </pre>
        </div>

        {/* HUD Click Overlay */}
        <div className="cctv-hover-cta">
          <span>🔍 Click to Enlarge Monaco Workspace</span>
        </div>
      </div>

      {/* 4. CCTV Footer Telemetry */}
      <div className="cctv-footer">
        <div className="cctv-footer-metrics">
          <span title="Total keystrokes recorded">⌨️ {keystrokes} keystrokes</span>
          <span>📄 {lines.length} lines</span>
          <span className="cctv-fps-tag">60 FPS SYNC</span>
        </div>
        <div className="cctv-quick-actions">
          <button
            type="button"
            className="cctv-quick-expand"
            onClick={() => onFocusCam(session)}
          >
            Inspect Feed →
          </button>
        </div>
      </div>
    </div>
  );
};
