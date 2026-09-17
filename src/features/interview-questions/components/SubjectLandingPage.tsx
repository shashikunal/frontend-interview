import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type { MasterBankCatalog, SubjectMeta, SubjectProgressStat } from '../types/interviewQuestions.types'

export default function SubjectLandingPage() {
  const [catalog, setCatalog] = useState<MasterBankCatalog | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [progressState, setProgressState] = useState(() => interviewQuestionsProgressService.getState())

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const cat = await interviewQuestionsDataService.getCatalog()
        if (mounted) {
          setCatalog(cat)
          setError(null)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load master question bank catalog')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    const handleUpdate = () => {
      setProgressState(interviewQuestionsProgressService.getState())
    }

    window.addEventListener('master_bank_progress_updated', handleUpdate)
    return () => {
      mounted = false
      window.removeEventListener('master_bank_progress_updated', handleUpdate)
    }
  }, [])

  // Calculate real subject stats for all 12 subjects
  const subjectStatsMap = useMemo(() => {
    const map = new Map<string, SubjectProgressStat>()
    if (!catalog) return map

    for (const sub of catalog.subjects) {
      const stats = interviewQuestionsProgressService.getSubjectStats(sub.id)
      map.set(sub.id, stats)
    }
    return map
  }, [catalog, progressState])

  const overallStats = useMemo(() => {
    return interviewQuestionsProgressService.getOverallStats(catalog)
  }, [catalog, progressState])

  if (loading) {
    return (
      <div className="mqb-loading-state" id="mqb-loading-spinner" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="app-route-spinner" style={{ margin: '0 auto 1.5rem', width: 44, height: 44, border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <h3 style={{ color: 'var(--mqb-text-primary)' }}>Loading 12,000 Master Questions Catalog...</h3>
        <p style={{ color: 'var(--mqb-text-secondary)' }}>Indexing 12 core frontend subjects with deep answer architecture</p>
      </div>
    )
  }

  if (error || !catalog) {
    return (
      <div className="mqb-error-state" id="mqb-error-container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: 'var(--mqb-accent-rose)' }}>Unable to Initialize Master Bank</h2>
        <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 500, margin: '0 auto 1.5rem' }}>{error}</p>
        <button
          type="button"
          className="mqb-action-pill-btn primary"
          onClick={() => window.location.reload()}
        >
          🔄 Retry Initialization
        </button>
      </div>
    )
  }

  return (
    <div className="mqb-landing-view" id="master-bank-landing-page">
      {/* Hero Section */}
      <section className="mqb-hero-banner" id="mqb-hero-section">
        <div className="mqb-hero-top">
          <div className="mqb-hero-text">
            <h1>Frontend Interview Master Question Bank</h1>
            <p>
              The industry's most rigorous, exhaustive question system. 12,000 deep interview questions across 12 subjects with spoken interview scripts, line-by-line breakdowns, execution flow diagrams, and real-time candidate metrics.
            </p>
            <div className="mqb-hero-badges-row">
              <span className="mqb-hero-tag" style={{ border: '1px solid rgba(16,185,129,0.5)', background: 'rgba(16,185,129,0.12)', color: '#34d399', fontWeight: 700 }}>
                🌱 Fresher Mode: 400 Easy Questions per Subject (Starts at Q1)
              </span>
              <span className="mqb-hero-tag">🔥 12,000 Total Questions</span>
              <span className="mqb-hero-tag">🎯 12 Subjects (1,000 Each)</span>
              <span className="mqb-hero-tag">🎙️ Spoken Speech Answers</span>
              <span className="mqb-hero-tag">🔍 Line-by-Line Dissection</span>
              <span className="mqb-hero-tag">⚙️ Execution Flows</span>
              <span className="mqb-hero-tag">🚀 100% Real Candidate Metrics</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
            <Link
              to="/interview-questions/javascript?difficulty=EASY"
              className="mqb-action-pill-btn"
              id="mqb-hero-fresher-start-btn"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.4)', fontWeight: 700 }}
            >
              🌱 Start with Easy (Fresher Mode)
            </Link>
            <Link
              to="/interview-questions/practice"
              className="mqb-action-pill-btn primary"
              id="mqb-hero-start-practice-btn"
            >
              ⚡ Quick Practice Drill
            </Link>
            <Link
              to="/interview-questions/test"
              className="mqb-action-pill-btn"
              id="mqb-hero-start-test-btn"
            >
              ⏱️ Timed Mock Test
            </Link>
          </div>
        </div>

        {/* Global Platform Real Metrics */}
        <div className="mqb-stats-grid" id="mqb-global-stats-grid">
          <div className="mqb-stat-card" id="mqb-stat-total-completed">
            <div className="mqb-stat-label">Total Questions Solved</div>
            <div className="mqb-stat-val">
              {overallStats.totalCompleted.toLocaleString()}
              <span className="mqb-stat-sub">/ 12,000</span>
            </div>
            <div className="mqb-progress-track">
              <div
                className="mqb-progress-bar"
                style={{ width: `${Math.min(overallStats.overallPct, 100)}%`, background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)' }}
              />
            </div>
          </div>

          <div className="mqb-stat-card" id="mqb-stat-completion-pct">
            <div className="mqb-stat-label">Mastery Completion Rate</div>
            <div className="mqb-stat-val" style={{ color: '#38bdf8' }}>
              {overallStats.overallPct}%
            </div>
            <div className="mqb-stat-sub" style={{ marginTop: '0.5rem' }}>
              Based on verified candidate progress
            </div>
          </div>

          <div className="mqb-stat-card" id="mqb-stat-bookmarked">
            <div className="mqb-stat-label">Bookmarked for Review</div>
            <div className="mqb-stat-val" style={{ color: '#fbbf24' }}>
              {overallStats.totalBookmarked}
              <span className="mqb-stat-sub">saved</span>
            </div>
            <div className="mqb-stat-sub" style={{ marginTop: '0.5rem' }}>
              <Link to="/interview-questions/bookmarks" style={{ color: '#fbbf24', textDecoration: 'none' }}>
                Open Revision Hub →
              </Link>
            </div>
          </div>

          <div className="mqb-stat-card" id="mqb-stat-tests-completed">
            <div className="mqb-stat-label">Mock Tests Completed</div>
            <div className="mqb-stat-val" style={{ color: '#a78bfa' }}>
              {overallStats.totalTestsTaken}
              <span className="mqb-stat-sub">exams</span>
            </div>
            <div className="mqb-stat-sub" style={{ marginTop: '0.5rem' }}>
              Timed evaluation sessions
            </div>
          </div>
        </div>
      </section>

      {/* 12 Subjects Dashboard Cards Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'var(--mqb-text-primary)' }}>
            Core Subject Master Banks
          </h2>
          <p style={{ color: 'var(--mqb-text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            Each subject contains exactly 1,000 categorized questions with real-time candidate statistics.
          </p>
        </div>
      </div>

      <div className="mqb-subjects-grid" id="mqb-subjects-grid">
        {catalog.subjects.map((subject: SubjectMeta) => {
          const stats = subjectStatsMap.get(subject.id) || {
            subjectId: subject.id,
            totalQuestions: 1000,
            completed: 0,
            remaining: 1000,
            completionPct: 0,
            easyCount: 400,
            easyCompleted: 0,
            intermediateCount: 400,
            intermediateCompleted: 0,
            difficultCount: 200,
            difficultCompleted: 0,
            bookmarkedCount: 0,
            needsReviewCount: 0,
          }

          return (
            <article
              key={subject.id}
              className="mqb-subject-card"
              id={`mqb-subject-card-${subject.id}`}
              style={{ '--subject-accent': subject.color } as React.CSSProperties}
            >
              <div>
                {/* Header */}
                <div className="mqb-sc-header">
                  <div className="mqb-sc-title-wrap">
                    <div className="mqb-sc-icon">{subject.icon}</div>
                    <div>
                      <h3 className="mqb-sc-title">{subject.name}</h3>
                      <span className="mqb-sc-badge">{subject.badge}</span>
                    </div>
                  </div>
                  <span
                    className="mqb-sc-badge"
                    style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}
                  >
                    1,000 Qs
                  </span>
                </div>

                {/* Description */}
                <p className="mqb-sc-desc">{subject.description}</p>

                {/* Real Completion Progress */}
                <div className="mqb-sc-progress-row">
                  <div className="mqb-sc-progress-label">
                    <span>
                      <strong>{stats.completed}</strong> / {stats.totalQuestions} Completed
                    </span>
                    <span className="mqb-sc-progress-pct">{stats.completionPct}%</span>
                  </div>
                  <div className="mqb-progress-track">
                    <div
                      className="mqb-progress-bar"
                      style={{
                        width: `${Math.min(stats.completionPct, 100)}%`,
                        background: subject.accentGradient || 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
                      }}
                    />
                  </div>
                </div>

                {/* Real Difficulty Breakdown */}
                <div className="mqb-sc-diff-row">
                  <Link
                    to={`/interview-questions/${subject.id}?difficulty=EASY`}
                    className="mqb-sc-diff-pill easy"
                    title={`Easy: ${stats.easyCompleted} completed out of ${stats.easyCount}. Click to start with easy questions!`}
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    <span className="mqb-sc-dot" />
                    <span>🌱 Easy: {stats.easyCount}</span>
                  </Link>
                  <div className="mqb-sc-diff-pill med" title={`Intermediate: ${stats.intermediateCompleted} completed out of ${stats.intermediateCount}`}>
                    <span className="mqb-sc-dot" />
                    <span>Inter: {stats.intermediateCount}</span>
                  </div>
                  <div className="mqb-sc-diff-pill diff" title={`Difficult: ${stats.difficultCompleted} completed out of ${stats.difficultCount}`}>
                    <span className="mqb-sc-dot" />
                    <span>Diff: {stats.difficultCount}</span>
                  </div>
                </div>

                {/* Flags row: Bookmarks & Needs Review */}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--mqb-text-muted)', marginBottom: '1.25rem' }}>
                  <span>⭐ {stats.bookmarkedCount} Bookmarked</span>
                  <span>🚩 {stats.needsReviewCount} Needs Review</span>
                </div>
              </div>

              {/* Action Buttons: Easy First, Practice & Browse */}
              <div className="mqb-sc-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Link
                  to={`/interview-questions/${subject.id}?difficulty=EASY`}
                  className="mqb-sc-btn"
                  id={`fresher-easy-btn-${subject.id}`}
                  style={{
                    gridColumn: '1 / -1',
                    background: 'rgba(16,185,129,0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16,185,129,0.3)',
                    textAlign: 'center',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  🌱 Start with Easy (Fresher Qs 1–400)
                </Link>
                <Link
                  to={`/interview-questions/${subject.id}`}
                  className="mqb-sc-btn browse"
                  id={`browse-btn-${subject.id}`}
                  style={{ textAlign: 'center' }}
                >
                  All Questions
                </Link>
                <Link
                  to={`/interview-questions/${subject.id}/practice`}
                  className="mqb-sc-btn practice"
                  id={`practice-btn-${subject.id}`}
                  style={{ textAlign: 'center' }}
                >
                  Practice Drill
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
