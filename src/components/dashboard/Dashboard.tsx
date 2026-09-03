import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useBookmarks } from '../../context/BookmarkContext'
import { useQuestions } from '../../data/useQuestions'
import { getCategories } from '../../data/questionService'
import './Dashboard.css'

function catClass(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
  const { questions, loading, error } = useQuestions()
  const { solvedIds, totalSolved, streak, studyDates, quizSessions, mockInterviews, resetProgress } = useProgress()
  const { bookmarkedCount } = useBookmarks()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

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
          <Link to="/mock-interview" className="btn btn-primary btn-sm">
            ⏱️ Start Mock Interview
          </Link>
          <Link to="/quiz" className="btn btn-secondary btn-sm">
            ⚡ Practice Drill
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
