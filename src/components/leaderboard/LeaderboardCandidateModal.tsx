import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LeaderboardEntry } from '../../lib/leaderboardService';
import './LeaderboardCandidateModal.css';

interface LeaderboardCandidateModalProps {
  entry: LeaderboardEntry;
  onClose: () => void;
  isAdmin?: boolean;
  isCurrentUser?: boolean;
}

function formatSpeedTime(seconds: number): string {
  if (!seconds || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

function getPaceBadge(seconds: number) {
  if (!seconds || seconds <= 0) {
    return { label: '🎯 Steady Pace', color: '#64748b', desc: 'Standard assessment tempo' };
  }
  if (seconds <= 300) {
    return { label: '⚡ Blitz Velocity', color: '#10b981', desc: 'Top 5% speed (< 5m avg)' };
  }
  if (seconds <= 600) {
    return { label: '🏎️ Fast Velocity', color: '#6366f1', desc: 'Top 20% speed (< 10m avg)' };
  }
  if (seconds > 1200) {
    return { label: '🧠 Methodical Analysis', color: '#f59e0b', desc: 'Deep thorough problem solver (> 20m)' };
  }
  return { label: '🎯 Steady Tempo', color: '#3b82f6', desc: 'Consistent 10-20m solving rhythm' };
}

export default function LeaderboardCandidateModal({
  entry,
  onClose,
  isAdmin = false,
  isCurrentUser = false,
}: LeaderboardCandidateModalProps) {
  const navigate = useNavigate();
  const pace = getPaceBadge(entry.avgTimeSpentSeconds);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="lb-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lb-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="lb-modal-header">
          <div className="lb-modal-user-info">
            <div
              className="lb-modal-avatar"
              style={{ background: entry.avatarColor }}
            >
              {entry.initials}
            </div>
            <div>
              <div className="lb-modal-name-row">
                <h3 className="lb-modal-name">{entry.name}</h3>
                <span className={`lb-modal-rank-badge ${entry.rank <= 3 ? `top-${entry.rank}` : ''}`}>
                  {entry.rank <= 3 ? ['🥇 1st', '🥈 2nd', '🥉 3rd'][entry.rank - 1] : `#${entry.rank}`}
                </span>
                <span className={`lb-modal-tier-badge ${entry.tier}`}>
                  {entry.tier.toUpperCase()}
                </span>
              </div>
              <div className="lb-modal-sub-row">
                {entry.company && <span>🏢 {entry.company} · </span>}
                <span>{entry.level || 'Candidate'}</span>
                <span className="lb-modal-id-tag">ID: {entry.userId.slice(0, 8)}...</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="lb-modal-close-btn"
            onClick={onClose}
            aria-label="Close candidate inspection modal"
          >
            ✕
          </button>
        </div>

        {/* Telemetry KPI Cards */}
        <div className="lb-modal-kpi-grid">
          <div className="lb-modal-kpi-card">
            <span className="kpi-label">TOTAL SCORE</span>
            <div className="kpi-val" style={{ color: '#4318ff' }}>{entry.totalScore}</div>
            <span className="kpi-sub">Verified platform points</span>
          </div>

          <div className="lb-modal-kpi-card">
            <span className="kpi-label">SPEED &amp; PACE</span>
            <div className="kpi-val" style={{ color: pace.color }}>
              {formatSpeedTime(entry.avgTimeSpentSeconds)}
            </div>
            <span className="kpi-sub" style={{ color: pace.color, fontWeight: 600 }}>
              {pace.label}
            </span>
          </div>

          <div className="lb-modal-kpi-card">
            <span className="kpi-label">ACCURACY RATE</span>
            <div className="kpi-val" style={{ color: '#10b981' }}>{entry.accuracyRate}%</div>
            <span className="kpi-sub">{entry.questionsCompleted} solved</span>
          </div>

          <div className="lb-modal-kpi-card">
            <span className="kpi-label">ACTIVE STREAK</span>
            <div className="kpi-val" style={{ color: '#f59e0b' }}>🔥 {entry.streak}d</div>
            <span className="kpi-sub">Daily solve consistency</span>
          </div>
        </div>

        {/* Earned Badges */}
        {entry.badges && entry.badges.length > 0 && (
          <div className="lb-modal-section">
            <h4 className="lb-modal-section-title">🏅 Verified Competency Badges</h4>
            <div className="lb-modal-badges-wrap">
              {entry.badges.map((b) => (
                <div
                  key={b.id}
                  className="lb-badge-pill"
                  style={{ borderColor: b.color || 'rgba(99, 102, 241, 0.4)' }}
                >
                  <span className="badge-emoji">{b.emoji}</span>
                  <span className="badge-text">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        <div className="lb-modal-section">
          <h4 className="lb-modal-section-title">⚡ Recent Challenge Submissions</h4>
          {entry.recentQuestions && entry.recentQuestions.length > 0 ? (
            <div className="lb-modal-questions-list">
              {entry.recentQuestions.map((q, idx) => (
                <div key={`${q.id}-${idx}`} className="lb-modal-q-item">
                  <div className="q-item-left">
                    <span className="q-bullet">✓</span>
                    <div>
                      <span className="q-title">{q.title}</span>
                      <span className="q-lang-tag">{q.language || 'JavaScript'}</span>
                    </div>
                  </div>
                  <div className="q-item-right">
                    <span className="q-score">{q.score} pts</span>
                    {q.status && <span className="q-status">{q.status}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="lb-modal-empty-q">
              <span>Candidate has verified challenges recorded across live studios.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="lb-modal-footer">
          {(isAdmin || isCurrentUser) && (
            <button
              type="button"
              className="lb-modal-dossier-btn"
              onClick={() => {
                onClose();
                if (isAdmin) {
                  navigate(`/admin/candidates/${entry.userId}/performance`);
                } else {
                  navigate('/my-performance');
                }
              }}
            >
              🏆 View Full FAANG Dossier →
            </button>
          )}
          <button
            type="button"
            className="lb-modal-practice-btn"
            onClick={() => {
              onClose();
              navigate('/dsa');
            }}
          >
            🚀 Practice DSA &amp; Challenges
          </button>
        </div>
      </div>
    </div>
  );
}
