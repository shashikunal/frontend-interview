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
import { leaderboardService, type CandidateMCSubmission } from '../../lib/leaderboardService'
import { gradingService, type EvaluatorReview } from '../../lib/gradingService'
import { CandidateSkillRadar } from './CandidateSkillRadar'
import AdminDashboard from './AdminDashboard'
import { dsaSubmissionService } from '../dsa/lib/dsaSubmissionService'
import { dsaProgressService } from '../dsa/lib/dsaProgressService'
import type { DSASubmission } from '../dsa/data/dsaTypes'
import { DSA_QUESTIONS } from '../dsa/data/dsaQuestions'
import { mcProgressService } from '../machinecoding/lib/mcProgressService'
import { MACHINE_CODING_CATALOG } from '../machinecoding/data/machineCodingCatalog'
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

  // Machine Coding Submissions State
  const [mcSubmissions, setMcSubmissions] = useState<CandidateMCSubmission[]>([])
  const [reviewsMap, setReviewsMap] = useState<Record<string, EvaluatorReview>>({})
  const [loadingMC, setLoadingMC] = useState<boolean>(true)
  const [viewingMCSubmission, setViewingMCSubmission] = useState<CandidateMCSubmission | null>(null)
  const [mcCopied, setMcCopied] = useState<boolean>(false)
  const [mcSearch, setMcSearch] = useState<string>('')

  // DSA Submissions State
  const [dsaSubmissions, setDsaSubmissions] = useState<DSASubmission[]>([])
  const [dsaSolvedCount, setDsaSolvedCount] = useState<number>(0)
  const [activeSubmissionsTab, setActiveSubmissionsTab] = useState<'mc' | 'dsa'>('mc')
  const [dsaSearch, setDsaSearch] = useState<string>('')

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

  // Fetch real Machine Coding submissions from Supabase & local storage
  useEffect(() => {
    async function loadMC() {
      setLoadingMC(true)
      try {
        const [list, reviews] = await Promise.all([
          leaderboardService.getCandidateMachineCodingSubmissions(user?.id, user?.email),
          gradingService.getAllEvaluatorReviews(),
        ])
        setMcSubmissions(list)
        setReviewsMap(reviews)
      } catch (err) {
        console.warn('Failed loading MC submissions:', err)
      } finally {
        setLoadingMC(false)
      }
    }
    void loadMC()

    // Load DSA Submissions and Solved Count
    dsaSubmissionService.fetchUserSubmissions(user?.id).then(setDsaSubmissions)
    setDsaSolvedCount(dsaProgressService.getSolvedIds().size)
  }, [user])

  // Machine Coding Curriculum Progress (Isolated from DSA)
  const [mcSolvedIds, setMcSolvedIds] = useState<Set<string>>(() => mcProgressService.getSolvedIds())
  const [mcAttemptedIds, setMcAttemptedIds] = useState<Set<string>>(() => mcProgressService.getAttemptedIds())
  const [mcBookmarkedIds, setMcBookmarkedIds] = useState<Set<string>>(() => mcProgressService.getBookmarkedIds())

  useEffect(() => {
    mcProgressService.setUserId(user?.id)
    const syncMC = () => {
      setMcSolvedIds(mcProgressService.getSolvedIds())
      setMcAttemptedIds(mcProgressService.getAttemptedIds())
      setMcBookmarkedIds(mcProgressService.getBookmarkedIds())
    }
    syncMC()
    return mcProgressService.subscribe(syncMC)
  }, [user?.id])

  const nextMCQuestion = useMemo(() => {
    const found = MACHINE_CODING_CATALOG.find(q => !mcSolvedIds.has(q.id))
    return found || MACHINE_CODING_CATALOG[0]
  }, [mcSolvedIds])

  const mcStats = useMemo(() => {
    const total = mcSubmissions.length
    if (total === 0) return { total: 0, avgMarks: 0, perfectCount: 0, passedCount: 0, totalTime: 0 }
    let sumMarks = 0
    let perfect = 0
    let passed = 0
    let time = 0
    mcSubmissions.forEach(s => {
      const effScore = reviewsMap[s.id]?.score ?? s.score
      sumMarks += effScore
      time += s.executionTime
      if (effScore >= 100) perfect++
      if (effScore >= 70 || s.status === 'accepted') passed++
    })
    return {
      total,
      avgMarks: Math.round(sumMarks / total),
      perfectCount: perfect,
      passedCount: passed,
      totalTime: time,
    }
  }, [mcSubmissions, reviewsMap])

  const filteredMCSubmissions = useMemo(() => {
    if (!mcSearch.trim()) return mcSubmissions
    const term = mcSearch.toLowerCase()
    return mcSubmissions.filter(
      s =>
        s.questionId.toLowerCase().includes(term) ||
        s.questionTitle.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
    )
  }, [mcSubmissions, mcSearch])

  const filteredDSASubmissions = useMemo(() => {
    if (!dsaSearch.trim()) return dsaSubmissions
    const term = dsaSearch.toLowerCase()
    return dsaSubmissions.filter(s => {
      const q = DSA_QUESTIONS.find(item => item.id === s.questionId)
      return (
        s.questionId.toLowerCase().includes(term) ||
        (q && q.title.toLowerCase().includes(term)) ||
        s.language.toLowerCase().includes(term)
      )
    })
  }, [dsaSubmissions, dsaSearch])

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
      {/* Horizon Candidate Welcome Banner */}
      <div className="candidate-hero-banner card-box">
        <div className="candidate-hero-content">
          <div className="candidate-hero-tags">
            <span className="candidate-track-tag">
              <span className="live-pulse-dot" /> {user?.targetCompany ? `Target: ${user.targetCompany}` : 'Frontend Master Track'}
            </span>
            {user?.experienceLevel && (
              <span className="candidate-exp-tag">{user.experienceLevel}</span>
            )}
            <span className="candidate-streak-pill">
              🔥 {streak} Day Streak
            </span>
          </div>
          <h1 className="candidate-hero-title">
            {user?.name ? `Welcome back, ${user.name}` : 'Welcome back, Candidate'} <span className="wave-hand">👋</span>
          </h1>
          <p className="candidate-hero-subtitle">
            Track your interview readiness, solve technical challenges, and accelerate towards FAANG-grade mastery.
          </p>
        </div>

        <div className="candidate-hero-actions">
          <Link to="/mock-interview" className="btn btn-primary candidate-btn-primary">
            <span>⏱️</span> Start Mock Interview
          </Link>
          <Link to="/machine-coding" className="btn btn-secondary candidate-btn-secondary">
            <span>⚡</span> Machine Coding Studio
          </Link>
          <Link to="/analytics" className="btn btn-secondary candidate-btn-secondary">
            <span>📊</span> Analytics
          </Link>
          <button
            type="button"
            className="btn btn-ghost-danger candidate-btn-reset"
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
          <div className="dash-stat-top">
            <div className="dash-stat-icon streak-icon" aria-hidden="true">🔥</div>
            <span className="dash-stat-badge streak-badge">Active</span>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{streak} Day{streak !== 1 ? 's' : ''}</span>
            <span className="dash-stat-label">Daily Study Streak</span>
          </div>
          <div className="dash-stat-hint">
            {streak > 0 ? 'Keep it going! Study daily to build momentum.' : 'Start your study streak today!'}
          </div>
        </div>

        <div className="dash-stat-card progress-card">
          <div className="dash-stat-top">
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
            <span className="dash-stat-badge progress-badge">{overallPercentage}% Complete</span>
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
          <div className="dash-stat-top">
            <div className="dash-stat-icon mock-icon" aria-hidden="true">⏱️</div>
            <span className="dash-stat-badge mock-badge">Timed Mode</span>
          </div>
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
          <div className="dash-stat-top">
            <div className="dash-stat-icon drill-icon" aria-hidden="true">🎯</div>
            <span className="dash-stat-badge drill-badge">Quiz Drill</span>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{drillMetrics.accuracy}%</span>
            <span className="dash-stat-label">Drill Accuracy</span>
          </div>
          <div className="dash-stat-hint">
            {drillMetrics.totalPracticed} questions practiced in drill mode
          </div>
        </div>

        <div className="dash-stat-card saved-card">
          <div className="dash-stat-top">
            <div className="dash-stat-icon saved-icon" aria-hidden="true">⭐</div>
            <span className="dash-stat-badge saved-badge">Revision</span>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{bookmarkedCount}</span>
            <span className="dash-stat-label">Saved for Revision</span>
          </div>
          <div className="dash-stat-hint">
            Bookmarked questions for quick revision
          </div>
          <Link to="/questions?saved=true" className="dash-stat-link">
            View saved list →
          </Link>
        </div>

        {/* DSA 1,000 Questions Solved Card */}
        <div className="dash-stat-card" style={{ borderLeft: '4px solid #10b981' }}>
          <div className="dash-stat-top">
            <div className="dash-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>🧠</div>
            <span className="dash-stat-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>DSA Masterclass</span>
          </div>
          <div className="dash-stat-info">
            <span className="dash-stat-num">{dsaSolvedCount} / 1,000</span>
            <span className="dash-stat-label">Algorithmic Problems Solved</span>
          </div>
          <div className="dash-stat-hint">
            {1000 - dsaSolvedCount} LeetCode challenges remaining
          </div>
          <Link to="/dsa" className="dash-stat-link" style={{ color: '#10b981' }}>
            Open DSA Studio →
          </Link>
        </div>
      </div>

      {/* Question Progress & Telemetry Overview */}
      <section className="candidate-telemetry-section card-box">
        <div className="telemetry-section-head">
          <div className="telemetry-title-wrap">
            <div className="telemetry-title-icon">📊</div>
            <div>
              <h2 className="telemetry-title">
                Question Progress &amp; Completion Telemetry
              </h2>
              <p className="telemetry-subtitle">
                Persistent performance metrics across coding attempts, sandbox runs, and verified test suites.
              </p>
            </div>
          </div>
          <Link to="/questions" className="telemetry-browse-btn">
            Browse Questions <span>→</span>
          </Link>
        </div>

        <div className="candidate-telemetry-grid">
          <div className="telemetry-tile tile-bank">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Question Bank</span>
              <span className="telemetry-tile-icon">📚</span>
            </div>
            <div className="telemetry-tile-value">22,222</div>
            <span className="telemetry-tile-sub">Curated Problems</span>
          </div>

          <div className="telemetry-tile tile-started">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Started</span>
              <span className="telemetry-tile-icon">⏳</span>
            </div>
            <div className="telemetry-tile-value">{telemetry.startedCount}</div>
            <span className="telemetry-tile-sub">In Progress</span>
          </div>

          <div className="telemetry-tile tile-completed">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Completed</span>
              <span className="telemetry-tile-icon">✅</span>
            </div>
            <div className="telemetry-tile-value">{telemetry.completedCount}</div>
            <span className="telemetry-tile-sub">Accepted &amp; Solved</span>
          </div>

          <div className="telemetry-tile tile-remaining">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Remaining</span>
              <span className="telemetry-tile-icon">🎯</span>
            </div>
            <div className="telemetry-tile-value">{(22222 - telemetry.completedCount).toLocaleString()}</div>
            <span className="telemetry-tile-sub">To Complete</span>
          </div>

          <div className="telemetry-tile tile-attempts">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Total Attempts</span>
              <span className="telemetry-tile-icon">🔁</span>
            </div>
            <div className="telemetry-tile-value">{telemetry.totalAttempts}</div>
            <span className="telemetry-tile-sub">Across All Sessions</span>
          </div>

          <div className="telemetry-tile tile-accepted">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Accepted</span>
              <span className="telemetry-tile-icon">🏆</span>
            </div>
            <div className="telemetry-tile-value">{telemetry.acceptedSubmissions}</div>
            <span className="telemetry-tile-sub">Evaluated Passes</span>
          </div>

          <div className="telemetry-tile tile-accuracy">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Accuracy Rate</span>
              <span className="telemetry-tile-icon">🎯</span>
            </div>
            <div className="telemetry-tile-value">{telemetry.accuracyRate}%</div>
            <span className="telemetry-tile-sub">Submission Success</span>
          </div>

          <div className="telemetry-tile tile-score">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Average Score</span>
              <span className="telemetry-tile-icon">📈</span>
            </div>
            <div className="telemetry-tile-value">{telemetry.avgScore}%</div>
            <span className="telemetry-tile-sub">On Test Suites</span>
          </div>

          <div className="telemetry-tile tile-time">
            <div className="telemetry-tile-header">
              <span className="telemetry-tile-label">Coding Time</span>
              <span className="telemetry-tile-icon">⚡</span>
            </div>
            <div className="telemetry-tile-value">{formatDurationSec(telemetry.totalTimeSpent)}</div>
            <span className="telemetry-tile-sub">In Coding Sandbox</span>
          </div>
        </div>
      </section>

      {/* Machine Coding Submissions & Marks Evaluation Ledger */}
      <section className="candidate-mc-section card-box">
        <div className="telemetry-section-head">
          <div className="telemetry-title-wrap">
            <div className="telemetry-title-icon" style={{ background: 'rgba(67, 24, 255, 0.12)', color: '#4318FF' }}>⚡</div>
            <div>
              <h2 className="telemetry-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span>Machine Coding Submissions &amp; Marks</span>
                <span className="live-status-pill" style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <span className="live-pulse-dot" /> Supabase Synced
                </span>
              </h2>
              <p className="telemetry-subtitle">
                Real-time evaluation ledger of interactive React challenges, live unit test assertions, and official marks tracked with your Candidate ID.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/machine-coding" className="btn btn-primary candidate-btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
              <span>⚡</span> Studio Workspace
            </Link>
            <Link to="/leaderboard?category=machine-coding" className="btn btn-secondary candidate-btn-secondary" style={{ padding: '8px 14px', fontSize: '13px' }}>
              <span>🏆</span> Rankings
            </Link>
          </div>
        </div>

        {/* MC Curriculum Progress Summary (Isolated 500-question tracking) */}
        <div className="mc-stats-summary-grid" style={{ marginBottom: '14px' }}>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">⚡</span>
            <div>
              <span className="mc-summary-num">500</span>
              <span className="mc-summary-label">Total Curriculum</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">✅</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#10b981' }}>{mcSolvedIds.size}</span>
              <span className="mc-summary-label">Solved Challenges</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">⏳</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#eab308' }}>{mcAttemptedIds.size}</span>
              <span className="mc-summary-label">Attempted</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">🎯</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#38bdf8' }}>{Math.max(0, 500 - mcSolvedIds.size)}</span>
              <span className="mc-summary-label">Remaining</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">★</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#fbbf24' }}>{mcBookmarkedIds.size}</span>
              <span className="mc-summary-label">Bookmarked</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">📈</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#8b5cf6' }}>{Math.round((mcSolvedIds.size / 500) * 100)}%</span>
              <span className="mc-summary-label">Progress Rate</span>
            </div>
          </div>
        </div>

        {/* Continue Practice Hero Card */}
        {nextMCQuestion && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(67, 24, 255, 0.08), rgba(56, 189, 248, 0.06))',
            border: '1px solid rgba(67, 24, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#4318FF', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                🚀 Continue Practice • Up Next
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {nextMCQuestion.id}: {nextMCQuestion.title}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {nextMCQuestion.category} • {nextMCQuestion.difficulty} • ⏱️ {nextMCQuestion.timeEstimate}
              </div>
            </div>
            <Link
              to={`/machine-coding?id=${nextMCQuestion.id}`}
              className="btn btn-primary candidate-btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Resume Challenge →
            </Link>
          </div>
        )}

        {/* MC Submissions Ledger Stats Row */}
        <div className="mc-stats-summary-grid">
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">📝</span>
            <div>
              <span className="mc-summary-num">{mcSubmissions.length}</span>
              <span className="mc-summary-label">Challenges Submitted</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">🎯</span>
            <div>
              <span className="mc-summary-num" style={{ color: mcStats.avgMarks >= 85 ? '#10b981' : '#4318FF' }}>
                {mcStats.avgMarks}%
              </span>
              <span className="mc-summary-label">Average Marks</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">💎</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#8b5cf6' }}>
                {mcStats.perfectCount}
              </span>
              <span className="mc-summary-label">100% Full Marks</span>
            </div>
          </div>
          <div className="mc-summary-tile">
            <span className="mc-summary-icon">✅</span>
            <div>
              <span className="mc-summary-num" style={{ color: '#10b981' }}>
                {mcStats.passedCount}
              </span>
              <span className="mc-summary-label">Evaluated Passes</span>
            </div>
          </div>
        </div>

        {/* Candidate Skill Radar & Competency Scorecard */}
        <CandidateSkillRadar
          candidateName={user?.name || user?.email?.split('@')[0] || 'Candidate'}
          candidateId={user?.id}
          submissions={mcSubmissions.map(s => ({
            id: s.id,
            question_id: s.questionId,
            title: s.questionTitle,
            score: reviewsMap[s.id]?.score ?? s.score,
            status: s.status,
            created_at: s.createdAt,
          }))}
          reviews={reviewsMap}
        />

        {/* Submissions Category Toggle Tabs */}
        <div style={{ display: 'flex', gap: '8px', margin: '24px 0 16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeSubmissionsTab === 'mc' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubmissionsTab('mc')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>⚡</span>
            <span>Machine Coding Challenges ({mcSubmissions.length})</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeSubmissionsTab === 'dsa' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveSubmissionsTab('dsa')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>🧠</span>
            <span>DSA Algorithmic Challenges ({dsaSubmissions.length})</span>
          </button>
        </div>

        {activeSubmissionsTab === 'dsa' ? (
          dsaSubmissions.length === 0 ? (
            <div className="mc-empty-box">
              <span style={{ fontSize: '2.4rem' }}>🧠</span>
              <h3 style={{ marginTop: '10px', marginBottom: '6px' }}>No DSA Submissions Yet</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 18px', fontSize: '0.92rem' }}>
                Start solving from our 1,000 algorithmic questions covering Two Pointers, Dynamic Programming, Trees, and Graphs.
              </p>
              <Link to="/dsa" className="btn btn-primary candidate-btn-primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
                <span>🚀</span> Launch DSA Studio
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 14px', gap: '12px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  className="search-field"
                  placeholder="Filter your DSA submissions..."
                  value={dsaSearch}
                  onChange={e => setDsaSearch(e.target.value)}
                  style={{ maxWidth: '340px', width: '100%' }}
                />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Showing {filteredDSASubmissions.length} of {dsaSubmissions.length} submissions
                </span>
              </div>

              <div className="table-responsive">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Problem</th>
                      <th>Difficulty</th>
                      <th>Language</th>
                      <th>Status</th>
                      <th>Test Cases</th>
                      <th>Runtime</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDSASubmissions.map(sub => {
                      const q = DSA_QUESTIONS.find(item => item.id === sub.questionId)
                      const isAcc = sub.status === 'Accepted'
                      return (
                        <tr key={sub.id}>
                          <td>
                            <span className="sub-time">
                              {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="sub-date">
                              {new Date(sub.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              #{sub.questionId} {q ? q.title : 'Algorithmic Problem'}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{q?.topic || 'Algorithms'}</span>
                          </td>
                          <td>
                            <span className={`badge badge-${(q?.difficulty || 'medium').toLowerCase()}`}>
                              {q?.difficulty || 'Medium'}
                            </span>
                          </td>
                          <td>
                            <span className="tech-badge">{sub.language}</span>
                          </td>
                          <td>
                            <span className={`status-pill ${isAcc ? 'status-pill-passed' : 'status-pill-failed'}`}>
                              {isAcc ? '✓ Accepted' : '✗ ' + sub.status}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>
                            {sub.testsPassed} / {sub.testsTotal}
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            {sub.runtimeMs} ms
                          </td>
                          <td>
                            <Link
                              to={`/dsa?id=${sub.questionId}`}
                              className="btn btn-sm btn-primary"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                            >
                              Open Studio →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )
        ) : loadingMC ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div className="app-route-spinner" />
            <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading your machine coding submissions from Supabase...</p>
          </div>
        ) : mcSubmissions.length === 0 ? (
          <div className="mc-empty-box">
            <span style={{ fontSize: '2.4rem' }}>⚡</span>
            <h3 style={{ marginTop: '10px', marginBottom: '6px' }}>No Machine Coding Submissions Yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 18px', fontSize: '0.92rem' }}>
              Step into the Machine Coding Studio to solve real-world React UI components, execute automated unit test assertions, and build your tracked portfolio.
            </p>

            <div className="mc-starter-grid">
              <Link to="/machine-coding?id=Q001" className="mc-starter-card">
                <div>
                  <span className="candidate-track-tag">#Q001 • Easy</span>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>Counter with Step &amp; Limits</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>State &amp; component logic with boundary constraints.</p>
                </div>
                <span style={{ color: '#4318FF', fontWeight: 600, fontSize: '0.82rem', marginTop: '12px' }}>Start Coding →</span>
              </Link>
              <Link to="/machine-coding?id=Q002" className="mc-starter-card">
                <div>
                  <span className="candidate-track-tag">#Q002 • Medium</span>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>Accordion Component</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Multi-collapse animated accordion with keyboard support.</p>
                </div>
                <span style={{ color: '#4318FF', fontWeight: 600, fontSize: '0.82rem', marginTop: '12px' }}>Start Coding →</span>
              </Link>
              <Link to="/machine-coding?id=Q003" className="mc-starter-card">
                <div>
                  <span className="candidate-track-tag">#Q003 • Medium</span>
                  <h4 style={{ margin: '8px 0 4px', fontSize: '1rem' }}>Star Rating Component</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Hover previews, half-star precision, and accessible states.</p>
                </div>
                <span style={{ color: '#4318FF', fontWeight: 600, fontSize: '0.82rem', marginTop: '12px' }}>Start Coding →</span>
              </Link>
            </div>

            <Link to="/machine-coding" className="btn btn-primary candidate-btn-primary" style={{ display: 'inline-flex', padding: '10px 24px' }}>
              <span>🚀</span> Launch Machine Coding Studio
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 14px', gap: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="search-field"
                placeholder="Filter your submitted machine coding questions..."
                value={mcSearch}
                onChange={e => setMcSearch(e.target.value)}
                style={{ maxWidth: '340px', width: '100%' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                Showing {filteredMCSubmissions.length} of {mcSubmissions.length} submissions
              </span>
            </div>

            <div className="table-responsive">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Challenge</th>
                    <th>Category</th>
                    <th>Tech</th>
                    <th>Status</th>
                    <th>Marks / Score</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMCSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: 'var(--text-muted)' }}>
                        No submissions matching "{mcSearch}"
                      </td>
                    </tr>
                  ) : (
                    filteredMCSubmissions.map(sub => {
                      const review = reviewsMap[sub.id]
                      const effectiveScore = review?.score ?? sub.score
                      return (
                        <tr key={sub.id}>
                          <td>
                            <span className="sub-time">
                              {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="sub-date">
                              {new Date(sub.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                <span className="aq-qid-tag" style={{ fontWeight: 700 }}>#{sub.questionId}</span>
                                <span className={`badge badge-${(sub.difficulty || 'medium').toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                                  {sub.difficulty}
                                </span>
                                {review && (
                                  <span className="submission-pill" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', fontSize: '10px', padding: '1px 6px', fontWeight: 700 }}>
                                    ⭐ Evaluator Graded
                                  </span>
                                )}
                              </div>
                              <strong style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                                {sub.questionTitle}
                              </strong>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-category" style={{ fontSize: '11px' }}>
                              {sub.category}
                            </span>
                          </td>
                          <td>
                            <span className="lang-tag">{sub.language}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span className={`submission-pill ${effectiveScore >= 70 ? 'accepted' : 'wrong'}`}>
                                {effectiveScore >= 70 ? '✓ Evaluated & Passed' : '⚠️ Needs Revision'}
                              </span>
                              {review && (
                                <span style={{ fontSize: '10px', fontWeight: 700, color: review.decision === 'approved' ? '#10b981' : review.decision === 'needs_work' ? '#f59e0b' : '#ef4444' }}>
                                  {review.decision === 'approved' ? '🟢 Hire Recommendation' : review.decision === 'needs_work' ? '🟡 Re-evaluate' : '🔴 Below Bar'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ fontSize: '14px', color: effectiveScore >= 100 ? '#10b981' : effectiveScore >= 70 ? '#3b82f6' : '#ef4444' }}>
                                  {effectiveScore}%
                                </strong>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                                  ({effectiveScore}/100)
                                </span>
                              </div>
                              {review ? (
                                <span style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 600 }}>
                                  ⭐ Verified by {review.evaluatorName}
                                </span>
                              ) : (
                                <span style={{ fontSize: '10px', color: effectiveScore >= 100 ? '#10b981' : 'var(--text-secondary)', fontWeight: 600 }}>
                                  {sub.testsPassed}/{sub.testsTotal} test assertions passed
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <Link
                                to={`/machine-coding?id=${sub.questionId}`}
                                className="btn btn-sm btn-primary candidate-btn-primary"
                                style={{ padding: '4px 10px', fontSize: '12px' }}
                                title="Re-open in Machine Coding Studio"
                              >
                                ⚡ Studio
                              </Link>
                              <button
                                type="button"
                                className="btn btn-sm btn-secondary"
                                onClick={() => setViewingMCSubmission(sub)}
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                                title="View Submitted Code & Review"
                              >
                                👁️ Code
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* 30-Day Activity Heatmap */}
      <section className="activity-heatmap-section card-box">
        <div className="section-head-row">
          <div>
            <h2 className="dash-section-title">Last 30 Days Study Activity</h2>
            <p className="dash-section-sub">Consistency is key to mastering technical interviews.</p>
          </div>
          <span className="activity-count-badge">
            <span className="pulse-dot-green" /> {studyDates.size} active day{studyDates.size !== 1 ? 's' : ''} recorded
          </span>
        </div>
        <div className="heatmap-container">
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
        </div>
        <div className="heatmap-legend">
          <div className="legend-item">
            <span className="legend-box inactive" /> <span>No activity</span>
          </div>
          <div className="legend-item">
            <span className="legend-box active" /> <span>Active study session</span>
          </div>
        </div>
      </section>

      {/* Category Mastery Progress */}
      <section className="category-mastery-section">
        <div className="section-head-row">
          <div>
            <h2 className="dash-section-title">Category Mastery</h2>
            <p className="dash-section-sub">Track syllabus completion and focus on weaker topics.</p>
          </div>
          <Link to="/questions" className="section-link-cta">
            View All Categories →
          </Link>
        </div>
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
                  Practice <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <section className="recommendations-section">
          <div className="section-head-row">
            <div>
              <h2 className="dash-section-title">Recommended Next for You</h2>
              <p className="dash-section-sub">Hand-picked questions from categories where you have the most room to grow:</p>
            </div>
          </div>
          <div className="recommendations-grid">
            {recommendations.map(q => (
              <Link key={q.id} to={`/questions/${q.id}`} className={`recommendation-card ${catClass(q.category)}`}>
                <div className="rec-badge-row">
                  <span className={`badge badge-category ${catClass(q.category)}`}>{q.category}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>
                <h4 className="rec-title">{q.question}</h4>
                <div className="rec-footer">
                  <span className="rec-action-cta">Solve Question <span>→</span></span>
                </div>
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

      {/* Candidate Machine Coding Solution Code Modal */}
      {viewingMCSubmission && (
        <div className="dash-modal-backdrop" onClick={() => setViewingMCSubmission(null)} style={{ zIndex: 1100 }}>
          <div className="dash-modal-box mc-code-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <span className="candidate-track-tag" style={{ marginBottom: '6px' }}>
                  ⚡ Machine Coding Solution • #{viewingMCSubmission.questionId}
                </span>
                <h3 style={{ margin: '4px 0 2px', fontSize: '1.25rem' }}>{viewingMCSubmission.questionTitle}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Marks: <strong style={{ color: viewingMCSubmission.score >= 100 ? '#10b981' : '#3b82f6' }}>{viewingMCSubmission.score}/100</strong> • 
                  Status: <span className="submission-pill accepted" style={{ marginLeft: '4px', fontSize: '11px' }}>{viewingMCSubmission.status}</span> • 
                  Submitted: {new Date(viewingMCSubmission.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingMCSubmission.code)
                    setMcCopied(true)
                    setTimeout(() => setMcCopied(false), 2000)
                  }}
                >
                  {mcCopied ? '✓ Copied' : '📋 Copy Code'}
                </button>
                <Link
                  to={`/machine-coding?id=${viewingMCSubmission.questionId}`}
                  className="btn btn-primary btn-sm candidate-btn-primary"
                >
                  ⚡ Open in Studio
                </Link>
                <button
                  type="button"
                  className="h-modal-close-icon"
                  onClick={() => setViewingMCSubmission(null)}
                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '20px', color: 'var(--text-secondary)', padding: '4px 8px' }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="acm-editor-frame" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="acm-editor-header" style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="dot red" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span className="dot yellow" style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  <span className="dot green" style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>submission.{viewingMCSubmission.language === 'react' ? 'tsx' : 'ts'}</span>
                </div>
                <span>{viewingMCSubmission.code.split('\n').length} lines</span>
              </div>
              <pre style={{ margin: 0, padding: '16px', maxHeight: '420px', overflowY: 'auto', background: '#0d1117', color: '#e6edf3', fontSize: '13px', lineHeight: '1.5', fontFamily: 'monospace' }}>
                <code>{viewingMCSubmission.code || '// No source code recorded.'}</code>
              </pre>
            </div>

            {/* Evaluator Review & Feedback Card */}
            {reviewsMap[viewingMCSubmission.id] && (
              <div style={{ marginTop: '16px', padding: '16px 20px', background: 'rgba(67, 24, 255, 0.06)', border: '1px solid rgba(67, 24, 255, 0.2)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>⭐</span>
                    <strong style={{ fontSize: '0.95rem' }}>Official Evaluator Assessment &amp; Feedback</strong>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Evaluated by <strong>{reviewsMap[viewingMCSubmission.id].evaluatorName}</strong> on {new Date(reviewsMap[viewingMCSubmission.id].evaluatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Clean Code</div>
                    <strong style={{ fontSize: '14px', color: '#10b981' }}>{reviewsMap[viewingMCSubmission.id].cleanCodeRating} / 10</strong>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>React Architecture</div>
                    <strong style={{ fontSize: '14px', color: '#4318FF' }}>{reviewsMap[viewingMCSubmission.id].architectureRating} / 10</strong>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Edge Cases</div>
                    <strong style={{ fontSize: '14px', color: '#f59e0b' }}>{reviewsMap[viewingMCSubmission.id].edgeCasesRating} / 10</strong>
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Hiring Recommendation</div>
                    <strong style={{ fontSize: '13px', color: reviewsMap[viewingMCSubmission.id].decision === 'approved' ? '#10b981' : '#f59e0b' }}>
                      {reviewsMap[viewingMCSubmission.id].decision === 'approved' ? '🟢 Hire / Exceeds Bar' : '🟡 Needs Revision'}
                    </strong>
                  </div>
                </div>

                {reviewsMap[viewingMCSubmission.id].notes && (
                  <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', borderLeft: '3px solid #8b5cf6', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.5' }}>
                    "{reviewsMap[viewingMCSubmission.id].notes}"
                  </div>
                )}
              </div>
            )}

            <div className="dash-modal-actions" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingMCSubmission(null)}
              >
                Close
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
