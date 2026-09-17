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
              The industry's most authentic, non-duplicated question system. {overallStats.totalQuestions.toLocaleString()} deep, unique interview questions across 12 subjects with spoken interview scripts, line-by-line breakdowns, execution flow diagrams, and real-time candidate metrics.
            </p>
            <div className="mqb-hero-badges-row">
              <span className="mqb-hero-tag fresher-tag">
                🌱 Fresher-Friendly Foundational Path
              </span>
              <span className="mqb-hero-tag">🔥 {overallStats.totalQuestions.toLocaleString()} Real Non-Duplicated Questions</span>
              <span className="mqb-hero-tag">🎯 12 Core Subjects</span>
              <span className="mqb-hero-tag">🎙️ Spoken Speech Answers</span>
              <span className="mqb-hero-tag">🔍 Line-by-Line Dissection</span>
              <span className="mqb-hero-tag">⚙️ Execution Flows</span>
              <span className="mqb-hero-tag">🚀 100% Real Candidate Metrics</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0, flexWrap: 'wrap' }}>
            <Link
              to="/interview-questions/javascript?difficulty=EASY"
              className="mqb-action-pill-btn fresher-btn"
              id="mqb-hero-fresher-start-btn"
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
              <span className="mqb-stat-sub">/ {overallStats.totalQuestions.toLocaleString()}</span>
            </div>
            <div className="mqb-progress-track">
              <div
                className="mqb-progress-bar"
                style={{ width: `${Math.min(overallStats.overallPct, 100)}%`, background: 'var(--mqb-grad-brand)' }}
              />
            </div>
          </div>

          <div className="mqb-stat-card" id="mqb-stat-completion-pct">
            <div className="mqb-stat-label">Mastery Completion Rate</div>
            <div className="mqb-stat-val cyan-accent">
              {overallStats.overallPct}%
            </div>
            <div className="mqb-stat-sub" style={{ marginTop: '0.5rem' }}>
              Based on verified candidate progress
            </div>
          </div>

          <div className="mqb-stat-card" id="mqb-stat-bookmarked">
            <div className="mqb-stat-label">Bookmarked for Review</div>
            <div className="mqb-stat-val med-accent">
              {overallStats.totalBookmarked}
              <span className="mqb-stat-sub">saved</span>
            </div>
            <div className="mqb-stat-sub" style={{ marginTop: '0.5rem' }}>
              <Link to="/interview-questions/bookmarks" style={{ color: 'var(--mqb-med-text)', textDecoration: 'none' }}>
                Open Revision Hub →
              </Link>
            </div>
          </div>

          <div className="mqb-stat-card" id="mqb-stat-tests-completed">
            <div className="mqb-stat-label">Mock Tests Completed</div>
            <div className="mqb-stat-val purple-accent">
              {overallStats.totalTestsTaken}
              <span className="mqb-stat-sub">exams</span>
            </div>
            <div className="mqb-stat-sub" style={{ marginTop: '0.5rem' }}>
              Timed evaluation sessions
            </div>
          </div>
        </div>
      </section>

      {/* Top-Asked FAANG Interview Hub & Quick Recommended Prep */}
      <section style={{ background: 'var(--mqb-bg-glass)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🔥</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--mqb-text-primary)' }}>
                FAANG High-Frequency Interview Hub
              </h2>
              <span className="mqb-highfreq-badge">Top-Asked Real Questions</span>
            </div>
            <p style={{ color: 'var(--mqb-text-secondary)', margin: '0.35rem 0 0', fontSize: '0.9rem' }}>
              Curated target question pools tagged by Tier-1 tech companies (Google, Meta, Amazon, Microsoft, Netflix, Apple).
            </p>
          </div>
          <Link
            to="/interview-questions/javascript?highFreq=true"
            className="mqb-action-pill-btn"
            style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)', fontWeight: 700 }}
          >
            🔥 Explore High-Frequency Pool →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.85rem' }}>
          <Link
            to="/interview-questions/javascript?company=Google"
            style={{ textDecoration: 'none', background: 'var(--mqb-bg-card)', border: '1px solid var(--mqb-border)', padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--mqb-text-primary)', transition: 'transform 0.2s ease' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>🏢 Google Interview Suite</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mqb-text-muted)' }}>JS Core, Engine & V8 Optimization</div>
            </div>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>→</span>
          </Link>

          <Link
            to="/interview-questions/react?company=Meta"
            style={{ textDecoration: 'none', background: 'var(--mqb-bg-card)', border: '1px solid var(--mqb-border)', padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--mqb-text-primary)', transition: 'transform 0.2s ease' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>🏢 Meta (Facebook) Suite</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mqb-text-muted)' }}>React Internals, Fiber & Reconciliation</div>
            </div>
            <span style={{ color: '#818cf8', fontWeight: 700 }}>→</span>
          </Link>

          <Link
            to="/interview-questions/dom?company=Amazon"
            style={{ textDecoration: 'none', background: 'var(--mqb-bg-card)', border: '1px solid var(--mqb-border)', padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--mqb-text-primary)', transition: 'transform 0.2s ease' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>🏢 Amazon Suite</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mqb-text-muted)' }}>DOM Tree & Mutation Architecture</div>
            </div>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>→</span>
          </Link>

          <Link
            to="/interview-questions/web-apis?company=Microsoft"
            style={{ textDecoration: 'none', background: 'var(--mqb-bg-card)', border: '1px solid var(--mqb-border)', padding: '0.85rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--mqb-text-primary)', transition: 'transform 0.2s ease' }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>🏢 Microsoft Suite</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--mqb-text-muted)' }}>Modern Web APIs & Async Workflows</div>
            </div>
            <span style={{ color: '#34d399', fontWeight: 700 }}>→</span>
          </Link>
        </div>
      </section>

      {/* 12 Subjects Dashboard Cards Grid */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.25rem', color: 'var(--mqb-text-primary)' }}>
            Core Subject Master Banks
          </h2>
          <p style={{ color: 'var(--mqb-text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            100% authentic, curated real-world technical interview questions with live candidate stats.
          </p>
        </div>
      </div>

      <div className="mqb-subjects-grid" id="mqb-subjects-grid">
        {catalog.subjects.map((subject: SubjectMeta) => {
          const stats = subjectStatsMap.get(subject.id) || {
            subjectId: subject.id,
            totalQuestions: subject.totalQuestions || 125,
            completed: 0,
            remaining: subject.totalQuestions || 125,
            completionPct: 0,
            easyCount: Math.round((subject.totalQuestions || 125) * 0.4),
            easyCompleted: 0,
            intermediateCount: Math.round((subject.totalQuestions || 125) * 0.4),
            intermediateCompleted: 0,
            difficultCount: Math.round((subject.totalQuestions || 125) * 0.2),
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
                  <span className="mqb-catalog-count-pill">
                    {subject.totalQuestions || stats.totalQuestions} Qs
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
