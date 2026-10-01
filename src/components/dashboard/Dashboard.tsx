import { useMemo, useState, useEffect, lazy, Suspense } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { pushClientService } from '../../features/notifications/services/pushClientService'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'
import { useQuestions } from '../../data/useQuestions'
import { leaderboardService, type CandidateMCSubmission } from '../../lib/leaderboardService'
import { gradingService, type EvaluatorReview } from '../../lib/gradingService'
import AdminDashboard from './AdminDashboard'
import { dsaSubmissionService } from '../dsa/lib/dsaSubmissionService'
import { dsaProgressService } from '../dsa/lib/dsaProgressService'
import type { DSASubmission } from '../dsa/data/dsaTypes'
import { DSA_QUESTIONS } from '../dsa/data/dsaQuestions'
import { mcProgressService } from '../machinecoding/lib/mcProgressService'
import { MACHINE_CODING_CATALOG } from '../machinecoding/data/machineCodingCatalog'
import { coreProgrammingProgressService } from '../coreprogramming/lib/coreProgrammingProgressService'
import { coreProgrammingSubmissionService } from '../coreprogramming/lib/coreProgrammingSubmissionService'
import type { CoreProgrammingSubmission } from '../coreprogramming/data/coreProgrammingTypes'
import { CORE_PROGRAMMING_QUESTIONS } from '../coreprogramming/data/coreProgrammingQuestions'
import { frontendJsProgressService } from '../frontendjs/lib/frontendJsProgressService'
import { frontendJsSubmissionService } from '../frontendjs/lib/frontendJsSubmissionService'
import type { FrontendJsSubmission } from '../frontendjs/data/frontendJsTypes'
import { FRONTEND_JS_QUESTIONS } from '../frontendjs/data/frontendJsQuestions'
import { docsProgressService } from '../../features/interview-docs/services/docsProgressService'
import { useDashboardView } from './hooks/useDashboardView'
import { DashboardWorkspaceNav } from './DashboardWorkspaceNav'
import { DashboardOverview } from './views/DashboardOverview'
import { DashboardActivity } from './views/DashboardActivity'
import { DashboardProgress } from './views/DashboardProgress'
import { DashboardAnalytics } from './views/DashboardAnalytics'
import { DashboardUpcoming } from './views/DashboardUpcoming'
import { DashboardProfile } from './views/DashboardProfile'
import './Dashboard.css'

const FaangReadinessDossierModal = lazy(() => import('../../features/performance-history/components/student/FaangReadinessDossierModal'))

function CandidateDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { questions, loading, error } = useQuestions()
  const { totalSolved, streak, resetProgress } = useProgress()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [, setLoadingMC] = useState(false)

  // Real-time Live Meeting Push Alerts from Admin
  const [liveMeetingAlert, setLiveMeetingAlert] = useState<{
    id?: string
    meetingId: string
    meetingTitle?: string
    meetingUrl?: string
    customMessage?: string
    trainerName?: string
    timestamp?: string
  } | null>(null)

  useEffect(() => {
    // Initial fetch for active live meeting push alert
    pushClientService.getActiveMeetingNotification().then(alert => {
      if (alert) setLiveMeetingAlert(alert)
    })

    const unsubBroadcast = pushClientService.onNotificationReceived((data) => {
      setLiveMeetingAlert({
        meetingId: data.meetingId,
        meetingTitle: data.title || data.meetingTitle || 'Live Technical Interview Room',
        meetingUrl: data.url || data.meetingUrl || `/meet/${data.meetingId}`,
        customMessage: data.body || data.customMessage,
        timestamp: new Date().toISOString(),
      })
    })

    return () => {
      unsubBroadcast()
    }
  }, [])

  // Real-time Docs & Full Syllabus Tracking State
  const [docsSyllabusStats, setDocsSyllabusStats] = useState(() => docsProgressService.getSyllabusStats())
  useEffect(() => {
    const handleDocsUpdate = () => setDocsSyllabusStats(docsProgressService.getSyllabusStats())
    window.addEventListener('docs_progress_updated', handleDocsUpdate)
    return () => window.removeEventListener('docs_progress_updated', handleDocsUpdate)
  }, [])

  // Machine Coding Submissions State
  const [mcSubmissions, setMcSubmissions] = useState<CandidateMCSubmission[]>([])
  const [reviewsMap, setReviewsMap] = useState<Record<string, EvaluatorReview>>({})
  const [viewingMCSubmission, setViewingMCSubmission] = useState<CandidateMCSubmission | null>(null)
  const [viewingSubmission, setViewingSubmission] = useState<{
    id: string
    questionId: string
    title: string
    category: string
    tech: string
    status: string
    score?: number | string
    code: string
    language: string
    testsPassed?: number
    testsTotal?: number
    runtimeMs?: number
    timestamp?: string
    studioUrl?: string
    isMachineCoding?: boolean
  } | null>(null)
  const [mcCopied, setMcCopied] = useState<boolean>(false)

  // DSA Submissions State
  const [dsaSubmissions, setDsaSubmissions] = useState<DSASubmission[]>([])
  const [dsaSolvedCount, setDsaSolvedCount] = useState<number>(0)

  // Core Programming Submissions State
  const [cpSubmissions, setCpSubmissions] = useState<CoreProgrammingSubmission[]>([])
  const [cpSolvedCount, setCpSolvedCount] = useState<number>(0)

  // Frontend JS Submissions State
  const [fjsSubmissions, setFjsSubmissions] = useState<FrontendJsSubmission[]>([])
  const [fjsSolvedCount, setFjsSolvedCount] = useState<number>(0)

  // Prevent background page scrolling while dashboard modals are open & handle Escape key
  useEffect(() => {
    if (viewingMCSubmission || viewingSubmission || showResetConfirm) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (viewingMCSubmission) setViewingMCSubmission(null)
          if (viewingSubmission) setViewingSubmission(null)
          if (showResetConfirm) setShowResetConfirm(false)
        }
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = originalOverflow
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [viewingMCSubmission, viewingSubmission, showResetConfirm])

  // URL Search Parameters Source of Truth for Dashboard Workspace View (?view=overview | activity | progress | analytics | upcoming)
  const { currentView, setView } = useDashboardView()
  const [showDossierModal, setShowDossierModal] = useState(false)

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

    // Load Core Programming Submissions and Solved Count
    coreProgrammingSubmissionService.fetchUserSubmissions(user?.id).then(setCpSubmissions)
    setCpSolvedCount(coreProgrammingProgressService.getSolvedIds().size)

    // Load Frontend JS Submissions and Solved Count
    frontendJsSubmissionService.fetchUserSubmissions(user?.id).then(setFjsSubmissions)
    setFjsSolvedCount(frontendJsProgressService.getSolvedIds().size)
    // Scalar dep: whole-`user` identity changes per render and refetch storms.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Live sync Core Programming progress
  useEffect(() => {
    const syncCP = () => {
      setCpSolvedCount(coreProgrammingProgressService.getSolvedIds().size)
      coreProgrammingSubmissionService.fetchUserSubmissions(user?.id).then(setCpSubmissions)
    }
    return coreProgrammingProgressService.subscribe(syncCP)
  }, [user?.id])

  // Live sync Frontend JS progress
  useEffect(() => {
    const syncFJS = () => {
      setFjsSolvedCount(frontendJsProgressService.getSolvedIds().size)
      frontendJsSubmissionService.fetchUserSubmissions(user?.id).then(setFjsSubmissions)
    }
    return frontendJsProgressService.subscribe(syncFJS)
  }, [user?.id])

  // Machine Coding Curriculum Progress (Isolated from DSA)
  const [mcSolvedIds, setMcSolvedIds] = useState<Set<string>>(() => mcProgressService.getSolvedIds())

  useEffect(() => {
    mcProgressService.setUserId(user?.id)
    const syncMC = () => {
      setMcSolvedIds(mcProgressService.getSolvedIds())
    }
    syncMC()
    return mcProgressService.subscribe(syncMC)
  }, [user?.id])



  const totalQuestionsCount = questions.length || 1
  const overallPercentage = Math.round((totalSolved / totalQuestionsCount) * 100)
  const totalCatalogCount = useMemo(() => {
    return MACHINE_CODING_CATALOG.length + DSA_QUESTIONS.length + CORE_PROGRAMMING_QUESTIONS.length + FRONTEND_JS_QUESTIONS.length;
  }, []);

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
      {/* Admin Testing / Preview Mode Indicator */}
      {/* Candidate Welcome Hero Banner */}
      <div className="candidate-hero-banner card-box">
        <div className="candidate-hero-content">
          <div className="candidate-hero-tags">
            <span className="candidate-track-tag">
              <span className="live-pulse-dot" /> Frontend Master Track
            </span>
            <span className="candidate-streak-pill">
              🔥 {streak} Day Streak
            </span>
          </div>
          <h1 className="candidate-hero-title">
            {user?.name ? `Welcome back, ${user.name}` : 'Welcome back, Candidate'} <span className="wave-hand">👋</span>
          </h1>
          <p className="candidate-hero-subtitle">
            Track your interview readiness, solve technical challenges, and accelerate towards senior engineering mastery.
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

      {/* Live Admin Meeting Push Notification Banner */}
      {liveMeetingAlert && (
        <div className="candidate-live-meeting-push-banner" id="candidate-live-meeting-banner">
          <div className="clm-left">
            <div className="clm-badge-pulse">
              <span className="clm-dot" /> LIVE INTERVIEW SESSION DISPATCHED
            </div>
            <h3 className="clm-title">{liveMeetingAlert.meetingTitle || 'Live Technical Interview Room'}</h3>
            <p className="clm-desc">
              {liveMeetingAlert.customMessage || 'Your mentor has started the live interview session. Click below to join the call immediately.'}
            </p>
            <div className="clm-meta">
              {liveMeetingAlert.timestamp && (
                <span className="clm-meta-pill">⏰ Sent: {new Date(liveMeetingAlert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              )}
              <span className="clm-meta-pill">⚡ Host: {liveMeetingAlert.trainerName || 'Platform Trainer'}</span>
              <span className="clm-meta-pill clm-meta-url" title={liveMeetingAlert.meetingUrl || `/meet/${liveMeetingAlert.meetingId}`}>
                🔗 {liveMeetingAlert.meetingUrl || `/meet/${liveMeetingAlert.meetingId}`}
              </span>
            </div>
          </div>
          <div className="clm-right">
            <button
              type="button"
              className="btn-join-meeting-pulse"
              onClick={() => {
                const targetUrl = liveMeetingAlert.meetingUrl || `/meet/${liveMeetingAlert.meetingId}`
                if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                  window.open(targetUrl, '_blank', 'noopener,noreferrer')
                } else {
                  navigate(targetUrl)
                }
              }}
            >
              🚀 Join Meeting Room
            </button>
            <button
              type="button"
              className="btn-clm-dismiss"
              onClick={() => setLiveMeetingAlert(null)}
              title="Dismiss alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Integrated Workspace View Selector Navigation */}
      <DashboardWorkspaceNav activeView={currentView} onSelectView={setView} />

      {/* Active Workspace Content (Only active view is rendered) */}
      {currentView === 'overview' && (
        <DashboardOverview
          totalSolved={totalSolved}
          totalCatalogCount={totalCatalogCount}
          overallPercentage={overallPercentage}
          streak={streak}
          docsSyllabusStats={docsSyllabusStats}
          mcSolvedCount={mcSolvedIds.size}
          mcTotalCatalog={MACHINE_CODING_CATALOG.length}
          dsaSolvedCount={dsaSolvedCount}
          dsaTotalCatalog={DSA_QUESTIONS.length}
          cpSolvedCount={cpSolvedCount}
          cpTotalCatalog={CORE_PROGRAMMING_QUESTIONS.length}
          fjsSolvedCount={fjsSolvedCount}
          fjsTotalCatalog={FRONTEND_JS_QUESTIONS.length}
          onOpenDossier={() => setShowDossierModal(true)}
          onSelectView={setView}
        />
      )}

      {currentView === 'activity' && (
        <DashboardActivity
          mcSubmissions={mcSubmissions}
          dsaSubmissions={dsaSubmissions}
          cpSubmissions={cpSubmissions}
          fjsSubmissions={fjsSubmissions}
          onViewSubmission={setViewingSubmission}
        />
      )}

      {currentView === 'progress' && (
        <DashboardProgress
          totalSolved={totalSolved}
          totalCatalogCount={totalCatalogCount}
          overallPercentage={overallPercentage}
          streak={streak}
          docsSyllabusStats={docsSyllabusStats}
          mcSolvedCount={mcSolvedIds.size}
          mcTotalCatalog={MACHINE_CODING_CATALOG.length}
          dsaSolvedCount={dsaSolvedCount}
          dsaTotalCatalog={DSA_QUESTIONS.length}
          cpSolvedCount={cpSolvedCount}
          cpTotalCatalog={CORE_PROGRAMMING_QUESTIONS.length}
          fjsSolvedCount={fjsSolvedCount}
          fjsTotalCatalog={FRONTEND_JS_QUESTIONS.length}
        />
      )}

      {currentView === 'analytics' && <DashboardAnalytics />}

      {currentView === 'upcoming' && <DashboardUpcoming />}

      {currentView === 'profile' && <DashboardProfile />}

      {/* Technical Readiness Dossier Modal */}
      {showDossierModal && (
        <Suspense fallback={null}>
          <FaangReadinessDossierModal
            candidateId={user?.id || 'usr_candidate_demo'}
            candidateName={user?.name || 'Candidate Evaluator'}
            onClose={() => setShowDossierModal(false)}
          />
        </Suspense>
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

      {/* Candidate Code Viewer Modal (DSA, Core Programming, Frontend JS) */}
      {viewingSubmission && (
        <div className="dash-modal-backdrop" onClick={() => setViewingSubmission(null)} style={{ zIndex: 1100 }}>
          <div className="dash-modal-box mc-code-modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: '920px', width: '95%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <span className="candidate-track-tag" style={{ marginBottom: '6px' }}>
                  {viewingSubmission.category} • #{viewingSubmission.questionId}
                </span>
                <h3 style={{ margin: '4px 0 2px', fontSize: '1.25rem' }}>{viewingSubmission.title}</h3>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Status: <span className={`submission-pill ${viewingSubmission.status === 'Accepted' || viewingSubmission.status === 'accepted' ? 'accepted' : 'wrong'}`} style={{ marginLeft: '4px', fontSize: '11px' }}>{viewingSubmission.status}</span>
                  {viewingSubmission.score !== undefined && (
                    <> • Score: <strong style={{ color: Number(viewingSubmission.score) >= 100 ? '#10b981' : Number(viewingSubmission.score) >= 70 ? '#3b82f6' : '#ef4444' }}>{viewingSubmission.score}%</strong></>
                  )}
                  {viewingSubmission.testsPassed !== undefined && viewingSubmission.testsTotal !== undefined && (
                    <> • Tests: <strong>{viewingSubmission.testsPassed}/{viewingSubmission.testsTotal} passed</strong></>
                  )}
                  {viewingSubmission.runtimeMs !== undefined && (
                    <> • Runtime: <strong>{viewingSubmission.runtimeMs} ms</strong></>
                  )}
                  {viewingSubmission.timestamp && (
                    <> • Submitted: {new Date(viewingSubmission.timestamp).toLocaleString()}</>
                  )}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    navigator.clipboard.writeText(viewingSubmission.code)
                    setMcCopied(true)
                    setTimeout(() => setMcCopied(false), 2000)
                  }}
                >
                  {mcCopied ? '✓ Copied' : '📋 Copy Code'}
                </button>
                {viewingSubmission.studioUrl && (
                  <Link
                    to={viewingSubmission.studioUrl}
                    className="btn btn-primary btn-sm candidate-btn-primary"
                  >
                    Open in Studio →
                  </Link>
                )}
                <button
                  type="button"
                  className="h-modal-close-icon"
                  onClick={() => setViewingSubmission(null)}
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
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>solution.{viewingSubmission.language === 'python' ? 'py' : viewingSubmission.language === 'java' ? 'java' : viewingSubmission.language === 'cpp' ? 'cpp' : 'js'}</span>
                </div>
                <span>{viewingSubmission.code.split('\n').length} lines</span>
              </div>
              <pre style={{ margin: 0, padding: '16px', maxHeight: '450px', overflowY: 'auto', background: '#0d1117', color: '#e6edf3', fontSize: '13px', lineHeight: '1.5', fontFamily: 'monospace' }}>
                <code>{viewingSubmission.code || '// No source code recorded.'}</code>
              </pre>
            </div>

            <div className="dash-modal-actions" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setViewingSubmission(null)}
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
  const [searchParams] = useSearchParams()
  const forcedView = (searchParams.get('view') || searchParams.get('role') || '').toLowerCase()

  if (user?.role === 'admin' && forcedView !== 'candidate' && forcedView !== 'student') {
    return <AdminDashboard />
  }
  return <CandidateDashboard />
}
