import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { MockInterviewSession, InterviewAnswer } from '../../types/mock.types';
import { mockSessionService } from '../../services/mockSessionService';
import MockQuestionResultModal from './MockQuestionResultModal';
import MockVideoReplayModal from './MockVideoReplayModal';

export default function MockFinalResultPage() {
  const params = useParams<{ sessionId?: string; id?: string }>();
  const sessionId = params.sessionId || params.id || '';
  const [session, setSession] = useState<MockInterviewSession | null>(null);
  const [inspectAnswer, setInspectAnswer] = useState<InterviewAnswer | null>(null);
  const [videoReplayAnswer, setVideoReplayAnswer] = useState<InterviewAnswer | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const s = mockSessionService.getSession(sessionId);
    if (s) setSession(s);
  }, [sessionId]);

  if (!session || !session.scorecard) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Scorecard loading or not found...</div>;
  }

  const sc = session.scorecard;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(session, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mock_scorecard_${session.id}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{ maxWidth: 1080, margin: '32px auto', padding: '0 20px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', marginBottom: 4 }}>
            Interview Assessment Report · {session.config.primaryTechnology.toUpperCase()}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Executive Performance Scorecard
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            type="button"
            className="ai-vm-btn-secondary"
            onClick={handleExportJSON}
            title="Download complete session report in JSON format"
          >
            📥 Export Report
          </button>
          <Link to="/ai-video-mock/setup" className="ai-vm-btn-secondary">
            + New Interview
          </Link>
          <Link to="/ai-video-mock/practice" className="ai-vm-btn-primary">
            🎯 Practice Weak Areas
          </Link>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="ai-vm-card" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center', marginBottom: 24 }}>
        <div className="ai-vm-score-circle">
          <div className="ai-vm-score-big">{sc.overallScore}</div>
          <div className="ai-vm-grade-tag">Grade: {sc.letterGrade}</div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', margin: '0 0 6px' }}>
            Seniority Readiness: {sc.seniorityAssessment.demonstratedLevel}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '0 0 12px', lineHeight: 1.5 }}>
            Target: {sc.seniorityAssessment.expectedLevel} ({session.config.experienceTier}y experience) · Readiness Score: {sc.seniorityAssessment.readinessPercentage}%
          </p>
          <div style={{ width: '100%', height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                background: sc.seniorityAssessment.readinessPercentage >= 75 ? '#10b981' : '#f59e0b',
                width: `${sc.seniorityAssessment.readinessPercentage}%`,
              }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evaluation Confidence</span>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>🟢 {sc.confidence}</span>
        </div>
      </div>

      {/* Competency Pillars Breakdown */}
      <div className="ai-vm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 16 }}>Competency Pillars Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {Object.entries(sc.competencyPillars).map(([pillar, val]) => (
            <div key={pillar} style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginBottom: 4 }}>
                {pillar.replace(/([A-Z])/g, ' $1')}
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: val >= 8.0 ? '#10b981' : val >= 6.5 ? '#818cf8' : '#f59e0b' }}>
                {val} <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>/ 10</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="ai-vm-card">
          <h3 style={{ fontSize: '1rem', color: '#10b981', marginBottom: 12 }}>✓ Demonstrated Strengths</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.88rem', lineHeight: 1.6 }}>
            {sc.strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="ai-vm-card">
          <h3 style={{ fontSize: '1rem', color: '#ef4444', marginBottom: 12 }}>⚠️ Identified Improvement Areas</h3>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.88rem', lineHeight: 1.6 }}>
            {sc.weaknesses.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Report */}
      <div className="ai-vm-card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Question-by-Question Deep Dive</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {session.answers.map(ans => {
            const e = ans.evaluation;
            return (
              <div
                key={ans.id}
                onClick={() => setInspectAnswer(ans)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: 'var(--bg)',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#818cf8' }}>
                    Q{ans.questionNumber}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ans.question.question}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ans.question.topic} · {ans.question.subtopic}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: e && e.numericScore >= 8.0 ? '#10b981' : '#f59e0b' }}>
                    {e?.numericScore ?? '—'} / 10
                  </span>
                  <button
                    type="button"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setVideoReplayAnswer(ans);
                    }}
                    className="ai-vm-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    title="Watch your recorded video response"
                  >
                    📹 Watch Video
                  </button>
                  <Link
                    to={`/ai-video-mock/improve?sessionId=${session.id}&questionId=${ans.questionId}`}
                    onClick={(ev) => ev.stopPropagation()}
                    className="ai-vm-btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 10px', textDecoration: 'none' }}
                  >
                    🔄 Try Again
                  </Link>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Review Breakdown →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Learning Plan */}
      <div className="ai-vm-card">
        <h3 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Targeted Learning Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {sc.learningPlan.map((lp, i) => (
            <div key={i} style={{ background: 'var(--bg)', padding: 14, borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{lp.topic}</span>
                <span style={{ fontSize: '0.7rem', color: lp.priority === 'High' ? '#ef4444' : '#f59e0b', fontWeight: 700 }}>
                  {lp.priority} Priority
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.4 }}>
                {lp.reason}
              </p>
              <ul style={{ margin: 0, paddingLeft: 16, fontSize: '0.78rem', color: 'var(--text-primary)' }}>
                {lp.actionItems.map((act, j) => (
                  <li key={j}>{act}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for inspection */}
      {inspectAnswer && (
        <MockQuestionResultModal
          answer={inspectAnswer}
          onNextQuestion={() => setInspectAnswer(null)}
          isLastQuestion={false}
        />
      )}

      {/* Modal for video replay */}
      {videoReplayAnswer && (
        <MockVideoReplayModal
          answer={videoReplayAnswer}
          onClose={() => setVideoReplayAnswer(null)}
        />
      )}
    </div>
  );
}
