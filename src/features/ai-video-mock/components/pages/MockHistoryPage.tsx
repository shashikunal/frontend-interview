import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { MockInterviewSession } from '../../types/mock.types';
import { mockSessionService } from '../../services/mockSessionService';

export default function MockHistoryPage() {
  const [sessions, setSessions] = useState<MockInterviewSession[]>([]);

  useEffect(() => {
    setSessions(mockSessionService.getAllLocalSessions());
  }, []);

  return (
    <div style={{ maxWidth: 960, margin: '32px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 6px' }}>Interview History</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Review past interview sessions, executive scorecards, and historical evaluation trends.
          </p>
        </div>

        <Link to="/ai-video-mock/setup" className="ai-vm-btn-primary">
          + Start New Interview
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="ai-vm-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
          <h3 style={{ margin: '0 0 8px' }}>No Mock Interviews Recorded Yet</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 460, margin: '0 auto 20px' }}>
            Configure your first mock interview to evaluate your technical and verbal communication skills against senior FAANG rubrics.
          </p>
          <Link to="/ai-video-mock/setup" className="ai-vm-btn-primary">
            Start Your First Mock Interview →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sessions.map(s => {
            const sc = s.scorecard;
            const dateStr = new Date(s.startedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={s.id}
                className="ai-vm-card"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', textTransform: 'capitalize' }}>
                      {s.config.primaryTechnology} Interview
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 6,
                        background: s.state === 'COMPLETED' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: s.state === 'COMPLETED' ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {s.state}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {dateStr} · {s.totalQuestions} Questions · {s.config.experienceTier}y tier
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  {sc ? (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: sc.overallScore >= 8.0 ? '#10b981' : '#818cf8' }}>
                        {sc.overallScore} / 10
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Grade: {sc.letterGrade}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>In Progress</div>
                  )}

                  <Link
                    to={s.state === 'COMPLETED' ? `/ai-video-mock/result/${s.id}` : `/ai-video-mock/session/${s.id}`}
                    className="ai-vm-btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    {s.state === 'COMPLETED' ? 'View Scorecard →' : 'Resume Session →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
