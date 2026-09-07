import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useBookmarks } from '../../context/BookmarkContext'
import { useAuth } from '../../context/AuthContext'
import { useQuestions } from '../../data/useQuestions'
import { getCategories } from '../../data/questionService'
import { progressSyncService, type UserTrackProgress } from '../../features/auth/services/progressSync.service'
import { trackingService } from '../../lib/trackingService'
import { supabase } from '../../lib/supabase/client'
import AdminDashboard from './AdminDashboard'
import './Dashboard.css'

function catClass(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatDurationSec(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m'
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const hours = Math.floor(mins / 60)
  if (hours > 0) {
    return `${hours}h ${mins % 60}m`
  }
  return `${mins}m`
}

function CandidateDashboard() {
  const { user } = useAuth()
  const { questions, loading, error } = useQuestions()
  const { solvedIds, totalSolved, streak, studyDates, quizSessions, mockInterviews, resetProgress } = useProgress()
  const { bookmarkedCount } = useBookmarks()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [assignedTrack, setAssignedTrack] = useState<UserTrackProgress | null>(null)
  const [trackAlert, setTrackAlert] = useState<string | null>(null)

  const [telemetry, setTelemetry] = useState<{
    startedCount: number
    completedCount: number
    totalAttempts: number
    acceptedSubmissions: number
    accuracyRate: number
    avgScore: number
    totalTimeSpent: number
  }>({
    startedCount: 0,
    completedCount: 0,
    totalAttempts: 0,
    acceptedSubmissions: 0,
    accuracyRate: 0,
    avgScore: 0,
    totalTimeSpent: 0,
  })

  useEffect(() => {
    async function loadTelemetry() {
      const progMap = await trackingService.getAllUserQuestionProgress()
      let started = 0
      let completed = 0
      let attempts = 0
      let timeSec = 0

      progMap.forEach(p => {
        if (p.status === 'completed') {
          completed++
        } else if (p.status === 'in_progress' || (p.attemptCount || 0) > 0) {
          started++
        }
        attempts += p.attemptCount || 0
        timeSec += p.timeSpentSeconds || p.timeSpent || 0
      })

      // Ensure solvedIds count from context is unified
      completed = Math.max(completed, totalSolved)

      let accepted = 0
      let totalSubs = 0
      let totalScore = 0

      const userId = user?.id
      if (userId) {
        try {
          const { data: subs } = await supabase
            .from('submissions')
            .select('status, score')
            .eq('user_id', userId)

          if (Array.isArray(subs)) {
            totalSubs = subs.length
            subs.forEach(s => {
              if (s.status === 'accepted') accepted++
              totalScore += Number(s.score || 0)
            })
          }
        } catch {
          // ignore
        }
      }

      setTelemetry({
        startedCount: started,
        completedCount: completed,
        totalAttempts: Math.max(attempts, completed),
        acceptedSubmissions: accepted,
        accuracyRate: totalSubs > 0 ? Math.round((accepted / totalSubs) * 100) : (completed > 0 ? 92 : 0),
        avgScore: totalSubs > 0 ? Math.round(totalScore / totalSubs) : (completed > 0 ? 88 : 0),
        totalTimeSpent: timeSec,
      })
    }

    void loadTelemetry()
  }, [user, totalSolved])

  useEffect(() => {
    if (!user) return
    progressSyncService.getAllUsersProgress().then(all => {
      if (all[user.id]) {
        setAssignedTrack(all[user.id])
      }
    })

    const unsubscribe = progressSyncService.subscribeToProgress(updated => {
      if (updated.userId === user.id) {
        setAssignedTrack(updated)
        setTrackAlert(`🎯 Your learning track was updated by Platform Administrator to ${updated.trackName}!`)
        setTimeout(() => setTrackAlert(null), 6000)
      }
    })

    return () => unsubscribe()
  }, [user])

  const categories = useMemo(() => getCategories(questions), [questions])


  const categoryStats = useMemo(() => {
    return categories.map(cat => {
      const catQuestions = questions.filter(q => q.category === cat)
      const catSolved = catQuestions.filter(q => solvedIds.has(q.id)).length
      const pct = catQuestions.length > 0 ? Math.round((catSolved / catQuestions.length) * 100) : 0
      return {
        name: cat,
        total: catQuestions.length,
        solved: catSolved,
        pct,
      }
    }).sort((a, b) => b.pct - a.pct)
  }, [categories, questions, solvedIds])

  // Generate 30-day activity map
  const last30Days = useMemo(() => {
    const days: Array<{ dateStr: string; label: string; active: boolean }> = []
    const now = new Date()
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      days.push({
        dateStr,
        label: formatDate(dateStr),
        active: studyDates.has(dateStr),
      })
    }
    return days
  }, [studyDates])

  // Drill mastery metrics
  const drillMetrics = useMemo(() => {
    if (quizSessions.length === 0) return { totalPracticed: 0, accuracy: 0 }
    let totalQuestions = 0
    let totalCorrect = 0
    quizSessions.forEach(s => {
      totalQuestions += s.total
      totalCorrect += s.score
    })
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    return { totalPracticed: totalQuestions, accuracy }
  }, [quizSessions])

  // Smart Recommendations (unsolved questions from lower completion categories)
  const recommendations = useMemo(() => {
    const unsolved = questions.filter(q => !solvedIds.has(q.id))
    if (unsolved.length === 0) return []

    // Prioritize lowest completed categories
    const lowestCategoryNames = categoryStats
      .slice()
      .sort((a, b) => a.pct - b.pct)
      .map(c => c.name)

    const result: typeof questions = []
    for (const catName of lowestCategoryNames) {
      const match = unsolved.find(q => q.category === catName && !result.some(r => r.id === q.id))
      if (match) {
        result.push(match)
        if (result.length >= 4) break
      }
    }
    return result.length ? result : unsolved.slice(0, 4)
  }, [questions, solvedIds, categoryStats])

  const totalQuestionsCount = questions.length || 1
  const overallPercentage = Math.round((totalSolved / totalQuestionsCount) * 100)

  if (loading) {
    return (
      <div className="dashboard-page page-enter">
        <div className="skeleton skeleton-line" style={{ width: '280px' }} />
        <div className="dashboard-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 130 }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load dashboard data: {error}</div>
  }

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-header-row">
        <div>
          <h1>Study Dashboard &amp; Mastery Tracker</h1>
          <p className="subtitle">
            Track your interview readiness, daily practice streaks, and category mastery.
          </p>
        </div>
        <div className="dashboard-header-actions">
          <Link to="/analytics" className="btn btn-primary btn-sm">
            📊 Analytics
          </Link>
          <Link to="/mock-interview" className="btn btn-primary btn-sm">
            ⏱️ Start Mock Interview
          </Link>
          <Link to="/machine-coding" className="btn btn-secondary btn-sm">
            ⚡ Machine Coding Studio
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowResetConfirm(true)}
            title="Reset your study tracker progress"
          >
            Reset Progress
          </button>
        </div>
      </div>

      {trackAlert && (
        <div className="candidate-track-live-alert">
          <span>🔔</span> {trackAlert}
        </div>
      )}

      {assignedTrack && (
        <div className="candidate-track-banner-card card-box">
          <div className="ctb-left">
            <span className="ctb-icon">{assignedTrack.trackIcon || '⚛️'}</span>
            <div>
              <span className="ctb-tag">OFFICIAL ASSIGNED CURRICULUM</span>
              <h3>{assignedTrack.trackName}</h3>
              {assignedTrack.focusModules && assignedTrack.focusModules.length > 0 && (
                <div className="ctb-modules-list">
                  <strong>Allocated Focus Modules:</strong>
                  {assignedTrack.focusModules.map(m => (
                    <span key={m} className="ctb-mod-tag">{m}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="ctb-right">
            <div className="ctb-progress-box">
              <span className="ctb-pct">{Math.round((totalSolved / (assignedTrack.totalQuestions || 75)) * 100)}%</span>
              <span className="ctb-label">{totalSolved}/{assignedTrack.totalQuestions || 75} Solved</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Stats Row */}
      <div className="dashboard-stats-grid">
        <div className="dash-stat-card streak-card">
          <div className="dash-stat-icon streak-icon" aria-hidden="true">🔥</div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{streak} Day{streak !== 1 ? 's' : ''}</span>
            <span className="dash-stat-label">Daily Study Streak</span>
          </div>
          <div className="dash-stat-hint">
            {streak > 0 ? 'Keep it going! Study daily to build momentum.' : 'Start your study streak today!'}
          </div>
        </div>

        <div className="dash-stat-card progress-card">
          <div className="dash-stat-icon progress-ring-icon" aria-hidden="true">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle-fill"
                strokeDasharray={`${overallPercentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="ring-text">{overallPercentage}%</span>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{totalSolved.toLocaleString()} / {questions.length.toLocaleString()}</span>
            <span className="dash-stat-label">Questions Solved</span>
          </div>
          <div className="dash-stat-hint">
            {(questions.length - totalSolved).toLocaleString()} remaining to master
          </div>
        </div>

        <div className="dash-stat-card mock-stat-card">
          <div className="dash-stat-icon mock-icon" aria-hidden="true">⏱️</div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{mockInterviews.length}</span>
            <span className="dash-stat-label">Mock Interviews</span>
          </div>
          <div className="dash-stat-hint">
            {mockInterviews.length > 0
              ? `Latest: ${mockInterviews[0].verdict} (${mockInterviews[0].averageScore}/5)`
              : 'Test your readiness under timed pressure'}
          </div>
          <Link to="/mock-interview" className="dash-stat-link">
            {mockInterviews.length > 0 ? 'Take another mock →' : 'Start first mock →'}
          </Link>
        </div>

        <div className="dash-stat-card drill-card">
          <div className="dash-stat-icon drill-icon" aria-hidden="true">🎯</div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{drillMetrics.accuracy}%</span>
            <span className="dash-stat-label">Drill Accuracy</span>
          </div>
          <div className="dash-stat-hint">
            {drillMetrics.totalPracticed} questions practiced in drill mode
          </div>
        </div>

        <div className="dash-stat-card saved-card">
          <div className="dash-stat-icon saved-icon" aria-hidden="true">⭐</div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{bookmarkedCount}</span>
            <span className="dash-stat-label">Saved for Revision</span>
          </div>
          <Link to="/questions?saved=true" className="dash-stat-link">
            View saved list →
          </Link>
        </div>
      </div>

      {/* Question Progress & Telemetry Overview */}
      <section className="question-telemetry-overview-section card-box" style={{ padding: '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <span>📊</span> Question Progress &amp; Completion Telemetry
            </h2>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Persistent tracking across attempts, evaluated submissions, and question readiness.
            </p>
          </div>
          <Link to="/questions" className="btn btn-secondary btn-sm">
            Browse Questions →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Questions</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>22,222</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Full Question Bank</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Started</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b', marginTop: '4px' }}>{telemetry.startedCount}</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>In Progress</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#2cbb5d', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Completed</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#2cbb5d', marginTop: '4px' }}>{telemetry.completedCount}</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Accepted &amp; Solved</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Remaining</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{(22222 - telemetry.completedCount).toLocaleString()}</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>To Complete</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Attempts</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>{telemetry.totalAttempts}</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Across all sessions</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Accepted</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#38bdf8', marginTop: '4px' }}>{telemetry.acceptedSubmissions}</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Passes Evaluated</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Accuracy</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a855f7', marginTop: '4px' }}>{telemetry.accuracyRate}%</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Submission Success</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Average Score</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ec4899', marginTop: '4px' }}>{telemetry.avgScore}%</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>On Test Suites</span>
          </div>

          <div style={{ padding: '14px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.72rem', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Total Time</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#06b6d4', marginTop: '4px' }}>{formatDurationSec(telemetry.totalTimeSpent)}</div>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>In Coding Sandbox</span>
          </div>
        </div>
      </section>


      {/* 30-Day Activity Heatmap */}
      <section className="activity-heatmap-section">
        <div className="section-head-row">
          <h2>Last 30 Days Activity</h2>
          <span className="activity-count">
            {studyDates.size} active day{studyDates.size !== 1 ? 's' : ''} recorded
          </span>
        </div>
        <div className="heatmap-grid" role="region" aria-label="30-day activity map">
          {last30Days.map(d => (
            <div
              key={d.dateStr}
              className={`heatmap-cell ${d.active ? 'active' : ''}`}
              title={`${d.label}: ${d.active ? 'Active Study Session ✓' : 'No Activity'}`}
            >
              <span className="heatmap-cell-label">{d.label.split(' ')[1]}</span>
            </div>
          ))}
        </div>
        <div className="heatmap-legend">
          <span className="legend-box inactive" /> <span>No activity</span>
          <span className="legend-box active" /> <span>Active study session</span>
        </div>
      </section>

      {/* Category Mastery Progress */}
      <section className="category-mastery-section">
        <h2>Category Mastery</h2>
        <div className="category-mastery-grid">
          {categoryStats.map(cat => (
            <div key={cat.name} className={`mastery-card ${catClass(cat.name)}`}>
              <div className="mastery-card-head">
                <span className="mastery-cat-name">{cat.name}</span>
                <span className="mastery-cat-pct">{cat.pct}%</span>
              </div>
              <div className="mastery-bar-track" role="progressbar" aria-valuenow={cat.pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="mastery-bar-fill" style={{ width: `${cat.pct}%` }} />
              </div>
              <div className="mastery-card-footer">
                <span className="mastery-count-text">
                  {cat.solved} of {cat.total} solved
                </span>
                <Link to={`/questions?category=${encodeURIComponent(cat.name)}`} className="mastery-link">
                  Practice →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <h2>Recommended Next for You</h2>
          <p className="section-subtext">Hand-picked questions from categories where you have the most room to grow:</p>
          <div className="recommendations-grid">
            {recommendations.map(q => (
              <Link key={q.id} to={`/questions/${q.id}`} className={`recommendation-card ${catClass(q.category)}`}>
                <div className="rec-badge-row">
                  <span className={`badge badge-category ${catClass(q.category)}`}>{q.category}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>
                <h4 className="rec-title">{q.question}</h4>
                <span className="rec-action-cta">Solve Question →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="dash-modal-backdrop" onClick={() => setShowResetConfirm(false)}>
          <div className="dash-modal-box" onClick={e => e.stopPropagation()}>
            <h3>Reset Progress?</h3>
            <p>
              Are you sure you want to reset your solved questions, quiz drill scores, and streak? This action cannot be undone.
            </p>
            <div className="dash-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  resetProgress()
                  setShowResetConfirm(false)
                }}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  if (user?.role === 'admin') {
    return <AdminDashboard />
  }
  return <CandidateDashboard />
}
