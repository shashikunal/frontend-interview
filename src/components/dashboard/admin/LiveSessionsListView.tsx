import React from 'react';
import type { InterviewSession } from '../../../lib/interviewSessionService';
import type { LiveTelemetryItem } from '../../../hooks/useAdminMonitorSocket';
import './LiveSessionsListView.css';

export interface LiveSessionsListViewProps {
  sessions: InterviewSession[];
  telemetryMap: Record<string, LiveTelemetryItem>;
  onFocusCam: (session: InterviewSession) => void;
}

function trackOf(questionId?: string | null): { label: string; icon: string; kind: string } {
  const u = String(questionId || '').toUpperCase();
  if (u.startsWith('JS-P') || u.startsWith('JSP') || u.startsWith('CP')) return { label: 'Core JS', icon: '💻', kind: 'cp' };
  if (u.startsWith('DSA')) return { label: 'DSA', icon: '🧠', kind: 'dsa' };
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
  return `${mins}m ${secs}s`;
}

export const LiveSessionsListView: React.FC<LiveSessionsListViewProps> = ({
  sessions,
  telemetryMap,
  onFocusCam,
}) => {
  return (
    <div className="live-list-table-wrap">
      <table className="live-list-table" role="table" aria-label="Active student live feeds">
        <thead>
          <tr>
            <th>Feed ID</th>
            <th>Candidate</th>
            <th>Track &amp; Problem</th>
            <th>Typing Status</th>
            <th className="hide-mobile">Keystrokes</th>
            <th className="hide-mobile">Elapsed</th>
            <th>Presence</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s, idx) => {
            const tel = telemetryMap[s.id];
            const isTyping = Boolean(tel?.isTyping);
            const presence = tel?.presence || (s.status === 'active' || s.status === 'in_progress' ? 'online' : 'disconnected');
            const track = trackOf(s.question_id);
            const candidateName = tel?.candidateName || s.candidate_name || s.candidate_email?.split('@')[0] || 'Candidate';
            const keystrokes = tel?.keystrokeCount ?? (tel?.code?.length || s.current_code_snapshot?.length || 0);

            return (
              <tr
                key={s.id}
                className={`live-list-row ${isTyping ? 'row-typing-active' : ''}`}
                onClick={() => onFocusCam(s)}
              >
                {/* 1. Feed ID */}
                <td className="live-cam-cell">
                  <span className="live-cam-badge">
                    <span className="live-rec-dot-sm" />
                    CAM-{(idx + 1).toString().padStart(2, '0')}
                  </span>
                </td>

                {/* 2. Candidate */}
                <td>
                  <div className="candidate-cell-flex">
                    <div className="candidate-mini-avatar">
                      {candidateName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="candidate-name-bold">{candidateName}</div>
                      <div className="candidate-sub-id">
                        {s.candidate_email || `ID: ${s.candidate_id?.slice(0, 8)}...`}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 3. Track & Problem */}
                <td>
                  <div className="track-problem-wrap">
                    <span className="track-pill">
                      {track.icon} {track.label}
                    </span>
                    <span className="problem-title" title={s.question_title}>
                      {s.question_title || s.question_id || 'Coding Challenge'}
                    </span>
                  </div>
                </td>

                {/* 4. Typing Status */}
                <td>
                  {isTyping ? (
                    <div className="typing-status-pill active">
                      <span className="typing-pulse-dot" />
                      <span>Typing in {tel?.activeFile || 'code'}...</span>
                    </div>
                  ) : (
                    <div className="typing-status-pill idle">
                      <span>Idle</span>
                    </div>
                  )}
                </td>

                {/* 5. Keystrokes */}
                <td className="hide-mobile">
                  <span className="keystrokes-val">⌨️ {keystrokes}</span>
                </td>

                {/* 6. Elapsed */}
                <td className="hide-mobile">
                  <span className="elapsed-val">⏱️ {formatElapsed(s.started_at || s.created_at)}</span>
                </td>

                {/* 7. Presence */}
                <td>
                  <span className={`presence-pill ${presence}`}>
                    {presence === 'online' ? '🟢 Online' : presence === 'idle' ? '🟡 Idle' : '🔴 Offline'}
                  </span>
                </td>

                {/* 8. Action */}
                <td>
                  <button
                    type="button"
                    className="live-list-inspect-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFocusCam(s);
                    }}
                  >
                    🔍 Inspect Feed
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
