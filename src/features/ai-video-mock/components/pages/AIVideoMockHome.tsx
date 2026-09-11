import { Link } from 'react-router-dom';
import { ALL_TECHNOLOGY_TRACKS } from '../../types/questionBank.types';

export default function AIVideoMockHome() {
  return (
    <div className="ai-vm-hero">
      <div className="ai-vm-hero-header">
        <div className="ai-vm-hero-eyebrow">
          <span>⚡ Next-Generation Mock Assessment</span>
        </div>
        <h1 className="ai-vm-hero-title">
          Realistic AI Video Mock Interview Platform
        </h1>
        <p className="ai-vm-hero-subtitle">
          Experience true FAANG-level interviews with live speech recognition, real-time code execution,
          expected answer comparison, dynamic follow-ups, and evidence-based seniority assessments.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <Link to="/ai-video-mock/setup" className="ai-vm-btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
            🚀 Start Custom Mock Interview
          </Link>
          <Link to="/ai-video-mock/system-audit" className="ai-vm-btn-secondary" style={{ padding: '12px 24px', fontSize: '1rem' }}>
            🔍 System Diagnostic Audit
          </Link>
        </div>
      </div>

      <div className="ai-vm-grid-3">
        <div className="ai-vm-card">
          <div className="ai-vm-card-icon">🎙️</div>
          <h3>Speech-Driven Technical Discussion</h3>
          <p>
            Answer architectural and theoretical questions through verbal discussion. Live speech recognition
            transcribes your response, extracts technical concepts, and compares against senior rubrics.
          </p>
          <Link to="/ai-video-mock/setup" className="ai-vm-btn-secondary" style={{ width: '100%' }}>
            Try Verbal Mock →
          </Link>
        </div>

        <div className="ai-vm-card">
          <div className="ai-vm-card-icon">💻</div>
          <h3>Deterministic Sandbox Execution</h3>
          <p>
            For programming questions, write clean JavaScript & TypeScript code in a Monaco editor with
            isolated Web Worker execution, test assertions, and automated code review.
          </p>
          <Link to="/ai-video-mock/setup" className="ai-vm-btn-secondary" style={{ width: '100%' }}>
            Practice Coding Round →
          </Link>
        </div>

        <div className="ai-vm-card">
          <div className="ai-vm-card-icon">📄</div>
          <h3>Job Description → Custom Mock</h3>
          <p>
            Paste any job description to extract required competencies, architecture scope, and leadership
            expectations. The platform generates a tailored interview mapped directly to that role.
          </p>
          <Link to="/ai-video-mock/job-interview" className="ai-vm-btn-secondary" style={{ width: '100%' }}>
            Tailor for Target Job →
          </Link>
        </div>
      </div>

      {/* 16 Tracks Banner */}
      <div style={{ marginTop: 48, background: 'var(--surface)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            📚 16 Verified Interview Tracks (300+ Genuine Questions Each)
          </h3>
          <Link to="/ai-video-mock/question-bank" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>
            Explore All 5,120+ Questions →
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {ALL_TECHNOLOGY_TRACKS.map(t => (
            <Link
              key={t.id}
              to={`/ai-video-mock/setup?track=${t.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              <span>{t.icon}</span>
              <span style={{ fontWeight: 600 }}>{t.label}</span>
              <span style={{ fontSize: '0.72rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '1px 5px', borderRadius: 4 }}>320 Qs</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
