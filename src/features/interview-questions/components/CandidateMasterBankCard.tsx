// src/features/interview-questions/components/CandidateMasterBankCard.tsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'

export default function CandidateMasterBankCard() {
  const [overallStats, setOverallStats] = useState(() => interviewQuestionsProgressService.getOverallStats())

  useEffect(() => {
    const handleUpdate = () => {
      setOverallStats(interviewQuestionsProgressService.getOverallStats())
    }
    window.addEventListener('master_bank_progress_updated', handleUpdate)
    return () => window.removeEventListener('master_bank_progress_updated', handleUpdate)
  }, [])

  return (
    <div
      className="dashboard-card"
      id="candidate-master-bank-card"
      style={{
        background: 'linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(30,41,59,0.7) 100%)',
        border: '1px solid rgba(56,189,248,0.25)',
        borderRadius: '18px',
        padding: '1.5rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem', width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🎯
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary, #fff)' }}>
              Frontend Interview Master Bank
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary, #94a3b8)' }}>
              12,000 Questions across 12 Subject Tracks
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link
            to="/interview-questions/javascript?difficulty=EASY"
            className="mqb-action-pill-btn"
            id="dashboard-fresher-easy-btn"
            style={{ fontSize: '0.85rem', background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)', fontWeight: 700 }}
          >
            🌱 Start Easy (Fresher)
          </Link>
          <Link
            to="/interview-questions"
            className="mqb-action-pill-btn primary"
            style={{ fontSize: '0.85rem' }}
          >
            Open Master Bank →
          </Link>
        </div>
      </div>

      {/* Progress Metric */}
      <div style={{ margin: '1.25rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary, #94a3b8)' }}>
          <span>
            <strong style={{ color: 'var(--text-primary, #fff)' }}>{overallStats.totalCompleted.toLocaleString()}</strong> of {overallStats.totalQuestions.toLocaleString()} Solved
          </span>
          <span style={{ fontWeight: 700, color: '#38bdf8' }}>{overallStats.overallPct}% Completed</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(overallStats.overallPct, 100)}%`,
              background: 'linear-gradient(90deg, #0ea5e9, #38bdf8, #818cf8)',
              borderRadius: '9999px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Bookmarked</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>{overallStats.totalBookmarked}</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Needs Review</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f87171' }}>{overallStats.totalNeedsReview}</div>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Tests Taken</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a78bfa' }}>{overallStats.totalTestsTaken}</div>
        </div>
      </div>
    </div>
  )
}
