// src/components/frontendjs/FrontendJsStudio.tsx
import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { FRONTEND_JS_QUESTIONS, questionByIdMap } from './data/frontendJsQuestions'
import type { FrontendJsQuestion, FrontendJsRunResult, FrontendJsSubmission } from './data/frontendJsTypes'
import { runFrontendJsCode } from './lib/frontendJsRunner'
import { frontendJsProgressService } from './lib/frontendJsProgressService'
import { frontendJsSubmissionService } from './lib/frontendJsSubmissionService'
import { interviewSessionService } from '../../lib/interviewSessionService'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { FrontendJsQuestionDetail } from './components/FrontendJsQuestionDetail'
import { FrontendJsTestPanel } from './components/FrontendJsTestPanel'
import { FrontendJsDashboard } from './components/FrontendJsDashboard'
import { FrontendJsInterviewMode } from './components/FrontendJsInterviewMode'
import { FrontendJsAdminTab } from './components/FrontendJsAdminTab'
import { FrontendJsLeaderboardModal } from './components/FrontendJsLeaderboardModal'
import './FrontendJsStudio.css'

interface ConsoleLog {
  level: 'log' | 'info' | 'warn' | 'error'
  message: string
}

const FJS_BATCHES = [
  { id: 'all', label: 'All 1,000', start: 1, end: 1000 },
  { id: 'b1', label: 'B1: Fundamentals (1-100)', start: 1, end: 100 },
  { id: 'b2', label: 'B2: Closures & Scopes (101-200)', start: 101, end: 200 },
  { id: 'b3', label: 'B3: Modern ES6+ (201-300)', start: 201, end: 300 },
  { id: 'b4', label: 'B4: Arrays & Transforms (301-400)', start: 301, end: 400 },
  { id: 'b5', label: 'B5: Objects & Prototypes (401-500)', start: 401, end: 500 },
  { id: 'b6', label: 'B6: Strings & Text (501-600)', start: 501, end: 600 },
  { id: 'b7', label: 'B7: Async JS & Event Loop (601-700)', start: 601, end: 700 },
  { id: 'b8', label: 'B8: DOM & Events (701-800)', start: 701, end: 800 },
  { id: 'b9', label: 'B9: Performance & Opt (801-900)', start: 801, end: 900 },
  { id: 'b10', label: 'B10: Production Scenarios (901-1000)', start: 901, end: 1000 },
]

export default function FrontendJsStudio() {
  const [searchParams] = useSearchParams()
  const { id: routeId } = useParams<{ id?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isLeaderboardTab = location.pathname.includes('/leaderboard')
  const isInterviewTab = location.pathname.includes('/interview')
  const isAdminTab = location.pathname.includes('/admin')

  // Derive question ID from query (?id=FJP-0001) or path (/frontend-javascript/question/FJP-0001 or /frontend-javascript/FJP-0001)
  const isNamedCatalog = routeId && ['questions', 'progress', 'leaderboard', 'interview', 'admin'].includes(routeId)
  const qIdParam = searchParams.get('id') || (!isNamedCatalog && routeId ? routeId : null)

  // Modals / Overlays state
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState<boolean>(isInterviewTab)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(isAdminTab)
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(isLeaderboardTab)

  // Active question resolution
  const activeQuestion = useMemo<FrontendJsQuestion | null>(() => {
    if (!qIdParam) return null
    const direct = questionByIdMap.get(qIdParam.toUpperCase())
    if (direct) return direct
    return FRONTEND_JS_QUESTIONS.find(q => q.id.toLowerCase() === qIdParam.toLowerCase() || q.slug.toLowerCase() === qIdParam.toLowerCase()) || FRONTEND_JS_QUESTIONS[0]
  }, [qIdParam])

  const handleSelectQuestion = useCallback((qid: string) => {
    navigate(`/frontend-javascript/question/${qid}`)
  }, [navigate])

  const handleBackToCatalog = useCallback(() => {
    navigate('/frontend-javascript')
  }, [navigate])

  // If no question is active, render the Canonical Machine-Level Coding Overview
  if (!activeQuestion) {
    return (
      <div className="mc-studio-container">
        <FrontendJsDashboard
          questions={FRONTEND_JS_QUESTIONS}
          onSelectQuestion={handleSelectQuestion}
          onOpenInterviewMode={() => setIsInterviewModalOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenAdminTab={() => setIsAdminModalOpen(true)}
          isAdmin={user?.role === 'admin'}
        />

        {isInterviewModalOpen && (
          <FrontendJsInterviewMode
            questions={FRONTEND_JS_QUESTIONS}
            onSelectQuestion={handleSelectQuestion}
            onExit={() => setIsInterviewModalOpen(false)}
          />
        )}

        {isAdminModalOpen && (
          <FrontendJsAdminTab
            questions={FRONTEND_JS_QUESTIONS}
            onSelectQuestion={handleSelectQuestion}
            onExit={() => setIsAdminModalOpen(false)}
          />
        )}

        {isLeaderboardOpen && (
          <FrontendJsLeaderboardModal
            onClose={() => setIsLeaderboardOpen(false)}
          />
        )}
      </div>
    )
  }

  return (
    <FrontendJsWorkspace
      question={activeQuestion}
      onBackToCatalog={handleBackToCatalog}
      onSelectQuestion={handleSelectQuestion}
    />
  )
}

interface WorkspaceProps {
  question: FrontendJsQuestion
  onBackToCatalog: () => void
  onSelectQuestion: (qid: string) => void
}

function FrontendJsWorkspace({
  question,
  onBackToCatalog,
  onSelectQuestion,
}: WorkspaceProps) {
  const { user, role } = useAuth() as { user: any; role?: string }
  const { resolvedTheme } = useTheme()

  // Live-session presence for Admin live-sessions monitoring (MC/CP/DSA parity).
  // Registers one interview_sessions row per candidate+question; best-effort.
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null)
  const autoSessionRef = useRef<string | null>(null)

  // Code state
  const [currentCode, setCurrentCode] = useState<string>('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const autosaveTimeoutRef = useRef<number | null>(null)
  const editorRef = useRef<any>(null)

  // Execution & Test State
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [runResult, setRunResult] = useState<FrontendJsRunResult | null>(null)
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([])
  const [activeSpecTab, setActiveSpecTab] = useState<'specs' | 'rubric' | 'solution' | 'tests' | 'notes'>('specs')
  const [activeTestTab, setActiveTestTab] = useState<'testcase' | 'result' | 'submissions'>('testcase')
  const [submissions, setSubmissions] = useState<FrontendJsSubmission[]>([])

  // Layout & Resizing
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(480)
  const [editorWidthPct, setEditorWidthPct] = useState<number>(55)
  const [fullscreenPanel, setFullscreenPanel] = useState<'none' | 'specs' | 'editor' | 'preview'>('none')
  const [isDraggingLeft, setIsDraggingLeft] = useState<boolean>(false)
  const [isDraggingEditor, setIsDraggingEditor] = useState<boolean>(false)
  const rightPanelRef = useRef<HTMLDivElement>(null)

  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false)
  const [paletteSearchQuery, setPaletteSearchQuery] = useState<string>('')
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState<number>(0)
  const [showShortcutsModal, setShowShortcutsModal] = useState<boolean>(false)
  const [showScorecard, setShowScorecard] = useState<boolean>(false)
  const paletteListRef = useRef<HTMLDivElement>(null)

  // Bookmark & Revisit & Solved State
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [isRevisit, setIsRevisit] = useState<boolean>(false)
  const [isSolved, setIsSolved] = useState<boolean>(false)

  // Practice Timer
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true)

  // Interview Simulation
  const [isInterviewActive, setIsInterviewActive] = useState<boolean>(false)
  const [interviewDuration, setInterviewDuration] = useState<number>(60 * 60)
  const [interviewTimeLeft, setInterviewTimeLeft] = useState<number>(60 * 60)

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }, [])

  // Navigation: Next & Prev questions
  const currentIndex = useMemo(() => {
    return FRONTEND_JS_QUESTIONS.findIndex(q => q.id === question.id)
  }, [question.id])
  const prevQuestion = currentIndex > 0 ? FRONTEND_JS_QUESTIONS[currentIndex - 1] : null
  const nextQuestion = currentIndex < FRONTEND_JS_QUESTIONS.length - 1 ? FRONTEND_JS_QUESTIONS[currentIndex + 1] : null

  // Initialize question state
  useEffect(() => {
    const draft = frontendJsProgressService.getDraft(question.id)
    setCurrentCode(draft !== null ? draft : question.starterCode)
    setIsBookmarked(frontendJsProgressService.isBookmarked(question.id))
    setIsRevisit(frontendJsProgressService.isRevisit(question.id))
    setIsSolved(frontendJsProgressService.isSolved(question.id))

    const timer = frontendJsProgressService.getTimer(question.id)
    setTimerSeconds(timer.elapsedSeconds)
    setIsTimerRunning(true)

    setSubmissions(frontendJsProgressService.getSubmissions(question.id))
    setRunResult(null)
    setConsoleLogs([])
    setActiveSpecTab('specs')
    setActiveTestTab('testcase')
    frontendJsProgressService.setLastVisitedQuestion(question.id)
  }, [question.id, question.starterCode])

  // ── LIVE SESSION REGISTRATION (Admin live-sessions parity) ──
  // Candidates only; one row per candidate+question via getOrCreateSession.
  useEffect(() => {
    if (!user?.id) return
    if (role === 'admin' || role === 'observer' || role === 'interviewer') return
    if (autoSessionRef.current === `${user.id}:${question.id}`) return
    autoSessionRef.current = `${user.id}:${question.id}`
    setLiveSessionId(null)

    interviewSessionService.getOrCreateSession({
      candidateId: user.id,
      candidateName: user.name || user.email?.split('@')[0] || 'Candidate',
      candidateEmail: user.email,
      questionId: question.id,
      questionTitle: question.title,
      language: 'javascript',
      initialFiles: { 'solution.js': question.starterCode },
    }).then(session => {
      setLiveSessionId(session?.id || null)
    }).catch(err => {
      console.warn('[FJSLiveSession] Could not register session:', err)
    })
  }, [question.id, question.title, question.starterCode, user?.id, role])

  // ── SESSION HEARTBEAT (every 30s, MC/CP/DSA parity) ──
  useEffect(() => {
    if (!liveSessionId) return
    const heartbeat = window.setInterval(() => {
      interviewSessionService.updateSessionActivity(liveSessionId, 'solution.js')
    }, 30000)
    return () => window.clearInterval(heartbeat)
  }, [liveSessionId])

  // Timer interval for standard practice
  useEffect(() => {
    if (!isTimerRunning || isInterviewActive) return
    const interval = window.setInterval(() => {
      setTimerSeconds(prev => {
        const next = prev + 1
        if (next % 10 === 0) {
          frontendJsProgressService.saveTimer(question.id, next)
        }
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isTimerRunning, isInterviewActive, question.id])

  const handleFinishInterviewRef = useRef<() => void>(() => {})
  const handleRunCodeRef = useRef<() => void>(() => {})

  // Interview mode countdown interval
  useEffect(() => {
    if (!isInterviewActive) return
    const interval = window.setInterval(() => {
      setInterviewTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleFinishInterviewRef.current()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isInterviewActive])

  // Autosave code changes with debounce
  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || ''
    setCurrentCode(val)

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current)
    }

    autosaveTimeoutRef.current = window.setTimeout(() => {
      frontendJsProgressService.saveDraft(question.id, val)
    }, 1000)
  }

  // Handle Run
  const handleRunCode = async () => {
    if (isRunning) return
    setIsRunning(true)
    setActiveTestTab('result')
    showToast('⚙️ Executing JavaScript in isolated Web Worker...')

    try {
      const allTests = [...question.testCases, ...(question.hiddenTestCases || [])]
      const res = await runFrontendJsCode(currentCode, question.functionName, allTests, 4000)
      setRunResult(res)

      if (res.consoleLogs && res.consoleLogs.length > 0) {
        setConsoleLogs(res.consoleLogs.map(l => ({ level: l.level as any, message: l.message })))
      }

      await frontendJsSubmissionService.recordAttempt({
        id: `att_${Date.now().toString(36)}`,
        questionId: question.id,
        code: currentCode,
        status: res.status,
        testsPassed: res.passedCount,
        testsTotal: res.totalCount,
        runtimeMs: res.totalRuntimeMs,
        timestamp: new Date().toISOString(),
      }, user)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setRunResult({
        success: false,
        status: 'Runtime Error',
        passedCount: 0,
        totalCount: question.testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: msg,
      })
    } finally {
      setIsRunning(false)
    }
  }

  // Handle Official Submit
  const handleSubmitSolution = async () => {
    if (isSubmitting || isRunning) return
    setIsSubmitting(true)
    setIsRunning(true)
    setActiveTestTab('result')
    showToast('🏁 Evaluating official candidate submission...')

    try {
      const allTests = [...question.testCases, ...(question.hiddenTestCases || [])]
      const res = await runFrontendJsCode(currentCode, question.functionName, allTests, 4000)
      setRunResult(res)

      // Live-session execution feed (best-effort, never blocks submit)
      if (liveSessionId) {
        void interviewSessionService.recordExecution({
          session_id: liveSessionId,
          candidate_id: user?.id,
          question_id: question.id,
          language: 'javascript',
          status: res.success ? 'success' : 'failed',
          execution_time: res.totalRuntimeMs || 0,
          tests_passed: res.passedCount,
          tests_total: res.totalCount,
        })
      }

      if (res.consoleLogs && res.consoleLogs.length > 0) {
        setConsoleLogs(res.consoleLogs.map(l => ({ level: l.level as any, message: l.message })))
      }

      const submissionScore = res.success
        ? 100
        : Math.round((res.passedCount / Math.max(1, res.totalCount)) * 80)

      const newSub: FrontendJsSubmission = {
        id: `sub_${Date.now().toString(36)}`,
        candidateId: user?.id,
        questionId: question.id,
        questionVersion: question.version || 1,
        code: currentCode,
        status: res.status,
        testsPassed: res.passedCount,
        testsTotal: res.totalCount,
        score: submissionScore,
        runtimeMs: res.totalRuntimeMs,
        hintsUsed: frontendJsProgressService.getHintsUsed(question.id),
        solutionViewed: frontendJsProgressService.isSolutionViewed(question.id),
        timeSpentSeconds: timerSeconds,
        timestamp: new Date().toISOString(),
      }

      await frontendJsSubmissionService.submit(newSub, user)
      setSubmissions(frontendJsProgressService.getSubmissions(question.id))

      if (res.success) {
        setIsSolved(true)
        showToast('🎉 All assertions passed! Solution marked Solved.')
      } else {
        showToast(`❌ Evaluation: ${res.passedCount}/${res.totalCount} passed. Check failed test cases.`)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      setRunResult({
        success: false,
        status: 'Runtime Error',
        passedCount: 0,
        totalCount: question.testCases.length,
        results: [],
        totalRuntimeMs: 0,
        consoleLogs: [],
        error: msg,
      })
    } finally {
      setIsRunning(false)
      setIsSubmitting(false)
    }
  }

  // Toggles
  const handleToggleBookmark = () => {
    const next = frontendJsProgressService.toggleBookmark(question.id)
    setIsBookmarked(next)
    showToast(next ? '★ Added to bookmarks' : '☆ Removed from bookmarks')
  }

  const handleToggleRevisit = () => {
    const next = frontendJsProgressService.toggleRevisit(question.id)
    setIsRevisit(next)
    showToast(next ? '↗ Marked for revision' : 'Revision tag cleared')
  }

  const handleToggleSolved = () => {
    const next = !isSolved
    setIsSolved(next)
    frontendJsProgressService.setSolved(question.id, next)
    showToast(next ? '✓ Marked challenge as solved' : 'Marked challenge as unsolved')
  }

  const handleResetStarter = () => {
    if (window.confirm('Reset code to the original problem starter template?')) {
      setCurrentCode(question.starterCode)
      frontendJsProgressService.saveDraft(question.id, question.starterCode)
      showToast('↺ Reset to initial starter template')
    }
  }

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
      showToast('🪄 Code document formatted')
    }
  }

  // Interview Mode Controls
  const handleStartInterview = (durSecs: number) => {
    setInterviewDuration(durSecs)
    setInterviewTimeLeft(durSecs)
    setIsInterviewActive(true)
    showToast(`⏱️ ${Math.round(durSecs / 60)}-minute mock interview simulation started!`)
  }

  const handleFinishInterview = async () => {
    setIsInterviewActive(false)
    await handleSubmitSolution()
    setShowScorecard(true)
  }

  const handleExitInterview = () => {
    if (window.confirm('Exit the active mock interview round? Your progress will be saved.')) {
      setIsInterviewActive(false)
      showToast('Interview round closed. Code draft preserved.')
    }
  }

  // Resizing mouse listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft) {
        const newWidth = Math.max(320, Math.min(e.clientX, window.innerWidth - 450))
        setLeftPanelWidth(newWidth)
      } else if (isDraggingEditor && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect()
        const relativeX = e.clientX - rect.left
        const pct = Math.max(25, Math.min(75, (relativeX / rect.width) * 100))
        setEditorWidthPct(pct)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingLeft(false)
      setIsDraggingEditor(false)
    }

    if (isDraggingLeft || isDraggingEditor) {
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingLeft, isDraggingEditor])

  handleFinishInterviewRef.current = handleFinishInterview
  handleRunCodeRef.current = handleRunCode

  // Keyboard Shortcuts (Ctrl+Enter, Ctrl+Shift+T, Ctrl+K, Ctrl+/, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (isCtrlOrCmd && e.key === 'Enter') {
        e.preventDefault()
        handleRunCodeRef.current()
      } else if (isCtrlOrCmd && e.shiftKey && (e.key === 'T' || e.key === 't')) {
        e.preventDefault()
        handleRunCodeRef.current()
      } else if (isCtrlOrCmd && (e.key === 'K' || e.key === 'k')) {
        e.preventDefault()
        setIsCommandPaletteOpen(prev => !prev)
      } else if (isCtrlOrCmd && e.key === '/') {
        e.preventDefault()
        setShowShortcutsModal(prev => !prev)
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
        setShowShortcutsModal(false)
        setShowScorecard(false)
        setFullscreenPanel('none')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filtered Questions for Spotlight Command Palette
  const filteredPaletteQuestions = useMemo(() => {
    if (!paletteSearchQuery.trim()) return FRONTEND_JS_QUESTIONS
    const q = paletteSearchQuery.toLowerCase()
    return FRONTEND_JS_QUESTIONS.filter(item =>
      item.id.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q)
    )
  }, [paletteSearchQuery])

  const formatMMSS = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="mc-studio-container mc-workspace">
      {/* 1. CANONICAL TOPBAR NAVIGATION */}
      <div className="mc-topbar">
        <div className="mc-topbar-left">
          <button
            type="button"
            className="mc-back-btn"
            onClick={onBackToCatalog}
            title="Back to Questions Hub"
          >
            <span className="mc-back-icon">←</span>
            <span className="mc-back-label">Hub</span>
          </button>

          <button
            type="button"
            className="mc-btn-palette"
            onClick={() => setIsCommandPaletteOpen(true)}
            title="Quick Search & Switch Challenge (Ctrl+K)"
          >
            <span className="mc-palette-icon">🔍</span>
            <span className="mc-palette-label">Switch</span>
            <span className="mc-btn-palette-kbd">⌘K</span>
          </button>

          <div className="mc-challenge-pill">
            <div className="mc-nav-arrows">
              <button
                type="button"
                className="mc-nav-arrow"
                disabled={!prevQuestion || isInterviewActive}
                onClick={() => !isInterviewActive && prevQuestion && onSelectQuestion(prevQuestion.id)}
                title={isInterviewActive ? 'Navigation locked during interview' : prevQuestion ? `Prev: ${prevQuestion.id}` : 'First challenge'}
              >
                ‹
              </button>
              <button
                type="button"
                className="mc-nav-arrow"
                disabled={!nextQuestion || isInterviewActive}
                onClick={() => !isInterviewActive && nextQuestion && onSelectQuestion(nextQuestion.id)}
                title={isInterviewActive ? 'Navigation locked during interview' : nextQuestion ? `Next: ${nextQuestion.id}` : 'Last challenge'}
              >
                ›
              </button>
            </div>

            <div className="mc-question-select-wrapper">
              <select
                className="mc-question-select"
                disabled={isInterviewActive}
                value={question.id}
                onChange={(e) => !isInterviewActive && onSelectQuestion(e.target.value)}
                title={`${question.id}: ${question.title}`}
              >
                {FJS_BATCHES.slice(1).map(b => (
                  <optgroup key={b.id} label={b.label}>
                    {FRONTEND_JS_QUESTIONS.slice(b.start - 1, b.end).map(q => (
                      <option key={q.id} value={q.id}>
                        {q.id}: {q.title} ({q.difficulty}) {frontendJsProgressService.isSolved(q.id) ? '✓' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <span className={`mc-badge ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>

            <button
              type="button"
              className={`mc-btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleToggleBookmark}
              title={isBookmarked ? 'Bookmarked (Click to remove)' : 'Bookmark challenge for revision'}
              aria-label="Bookmark challenge"
            >
              {isBookmarked ? '★' : '☆'}
            </button>

            <span className={`mc-status-indicator ${isSolved ? 'solved' : frontendJsProgressService.isAttempted(question.id) ? 'attempted' : 'not-started'}`}>
              {isSolved ? '✓ Solved' : frontendJsProgressService.isAttempted(question.id) ? '● Attempted' : '○ Ready'}
            </span>
          </div>

          <div className="mc-topbar-lang-box" title="JavaScript Runtime Environment (ES2026 Sandbox)">
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#f8fafc', padding: '4px 8px' }}>
              🟨 JS (ES2026)
            </span>
          </div>
        </div>

        <div className="mc-topbar-right">
          {/* Timed Interview HUD or Launcher */}
          {!isInterviewActive ? (
            <div className="mc-interview-launcher">
              <select
                className="mc-duration-select"
                value={interviewDuration}
                onChange={(e) => setInterviewDuration(Number(e.target.value))}
                title="Interview round duration"
              >
                <option value={30 * 60}>30m</option>
                <option value={45 * 60}>45m</option>
                <option value={60 * 60}>60m</option>
              </select>
              <button
                type="button"
                className="mc-action-btn mc-btn-interview-start"
                onClick={() => handleStartInterview(interviewDuration)}
                title="Begin timed FAANG interview simulation"
              >
                ⏱️ Start
              </button>
            </div>
          ) : (
            <div className="mc-active-interview-controls">
              <div
                className={`mc-interview-hud ${
                  interviewTimeLeft < 180 ? 'urgent-critical' : interviewTimeLeft < 600 ? 'urgent-warn' : 'normal'
                }`}
                title="Remaining interview round time"
              >
                <span className="mc-hud-pulse" />
                <span className="mc-hud-timer">{formatMMSS(interviewTimeLeft)}</span>
              </div>
              <button
                type="button"
                className="mc-action-btn mc-btn-interview-finish"
                onClick={handleFinishInterview}
                title="Finish interview and score submission"
              >
                🏁 Submit
              </button>
              <button
                type="button"
                className="mc-action-btn mc-btn-interview-exit"
                onClick={handleExitInterview}
                title="Exit interview and save draft"
                style={{ background: '#374151', color: '#f3f4f6', border: '1px solid #4b5563' }}
              >
                🚪 Exit
              </button>
            </div>
          )}

          {/* Standard Practice Timer Display */}
          {!isInterviewActive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(30, 41, 59, 0.6)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'monospace',
                color: '#94a3b8',
                border: '1px solid rgba(148, 163, 184, 0.2)',
              }}
              title="Session Practice Timer (Survives Refresh)"
            >
              <span>⏱️</span>
              <span style={{ color: '#f8fafc', fontWeight: 600 }}>{formatMMSS(timerSeconds)}</span>
              <button
                type="button"
                onClick={() => setIsTimerRunning(prev => !prev)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? '⏸' : '▶'}
              </button>
            </div>
          )}

          {/* Smart Utility Icon Toolbar */}
          <div className="mc-topbar-tool-group">
            <button
              type="button"
              className="mc-topbar-icon-btn"
              onClick={() => setShowScorecard(true)}
              title="Senior Staff Evaluation Scorecard"
            >
              📊
            </button>

            <button
              type="button"
              className="mc-topbar-icon-btn"
              onClick={() => setActiveSpecTab('solution')}
              disabled={isInterviewActive}
              title={isInterviewActive ? "Reference solution locked during active interview" : "Inspect Reference Solution"}
            >
              💡
            </button>

            <button
              type="button"
              className="mc-topbar-icon-btn"
              onClick={handleResetStarter}
              title="Reset Starter Template"
            >
              ↺
            </button>

            <button
              type="button"
              className="mc-topbar-icon-btn"
              onClick={() => setShowShortcutsModal(true)}
              title="Keyboard Shortcuts Cheat Sheet (Ctrl+/)"
            >
              ⌨️
            </button>
          </div>

          {/* Revisit Toggle */}
          <button
            type="button"
            className={`mc-action-btn mc-btn-solved-toggle ${isRevisit ? 'solved' : ''}`}
            onClick={handleToggleRevisit}
            title={isRevisit ? 'Flagged for revision' : 'Flag for revision'}
            style={isRevisit ? { background: 'rgba(168, 85, 247, 0.2)', borderColor: '#a855f7', color: '#c084fc' } : {}}
          >
            {isRevisit ? '↗ Revisit' : 'Revisit'}
          </button>

          {/* Solved Toggle */}
          <button
            type="button"
            className={`mc-action-btn mc-btn-solved-toggle ${isSolved ? 'solved' : ''}`}
            onClick={handleToggleSolved}
            title={isSolved ? 'Mark problem as uncompleted' : 'Mark problem as completed'}
          >
            {isSolved ? '✓ Solved' : 'Mark Solved'}
          </button>

          {/* Primary Action Buttons */}
          <button
            type="button"
            className="mc-action-btn mc-btn-tests"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Run automated assertions suite (Ctrl+Shift+T)"
          >
            {isRunning ? '🧪 Testing...' : '🧪 Tests'}
          </button>

          <button
            type="button"
            className="mc-action-btn mc-btn-run"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Execute code in sandboxed runner (Ctrl+Enter)"
          >
            {isRunning ? 'Running...' : '▶ Run Code'}
          </button>

          <button
            type="button"
            className="mc-action-btn mc-btn-submit-action"
            onClick={handleSubmitSolution}
            disabled={isRunning || isSubmitting}
            title="Submit solution for official evaluation"
          >
            {isSubmitting ? 'Evaluating...' : '🏁 Submit'}
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="mc-toast-banner" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {/* 2. CANONICAL SPLIT BODY */}
      <div className="mc-split-body">
        {/* Left Panel: Specifications, Checklist, Rubric, Notes */}
        <div
          className="mc-spec-panel"
          style={{
            width: fullscreenPanel === 'specs' ? '100%' : `${leftPanelWidth}px`,
            display: (fullscreenPanel === 'editor' || fullscreenPanel === 'preview') ? 'none' : 'flex',
            flex: fullscreenPanel === 'specs' ? 1 : undefined,
            borderRight: fullscreenPanel === 'specs' ? 'none' : undefined,
          }}
        >
          <FrontendJsQuestionDetail
            question={question}
            fullscreenPanel={fullscreenPanel}
            onToggleFullscreen={() => setFullscreenPanel(prev => prev === 'specs' ? 'none' : 'specs')}
            onAdoptSolution={(solCode) => {
              setCurrentCode(solCode)
              frontendJsProgressService.saveDraft(question.id, solCode)
              showToast('✓ Reference solution copied to active code editor')
            }}
            testResultsCount={runResult ? { passed: runResult.passedCount, total: runResult.totalCount } : null}
            activeTab={activeSpecTab}
            onTabChange={setActiveSpecTab}
          />
        </div>

        {/* Resizer divider between Specs and Right Panel */}
        {fullscreenPanel === 'none' && (
          <div
            className={`mc-resizer-col ${isDraggingLeft ? 'dragging' : ''}`}
            onMouseDown={(e) => {
              e.preventDefault()
              setIsDraggingLeft(true)
            }}
            title="Drag to resize Problem Specs"
          />
        )}

        {/* Right Area: Monaco Editor + Test Results + Console */}
        <div
          ref={rightPanelRef}
          className="mc-right-panel"
          style={{
            display: fullscreenPanel === 'specs' ? 'none' : 'flex',
            flex: 1,
          }}
        >
          <div className="mc-editor-preview-split">
            {/* Monaco Code Editor */}
            <div
              className="mc-editor-container"
              style={{
                width: fullscreenPanel === 'editor' ? '100%' : `${editorWidthPct}%`,
                display: fullscreenPanel === 'preview' ? 'none' : 'flex',
                flex: fullscreenPanel === 'editor' ? 1 : undefined,
                borderRight: fullscreenPanel === 'editor' ? 'none' : undefined,
              }}
            >
              <div className="mc-panel-header">
                <div className="mc-file-tabs-bar">
                  <div className="mc-file-tab active" title={`Primary script: ${question.functionName}.js`}>
                    <span className="mc-file-icon">🟨</span>
                    <span className="mc-file-name">{question.functionName}.js</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <button
                    type="button"
                    className="mc-icon-tool-btn"
                    onClick={handleFormatCode}
                    title="Format Code Document (Alt+F or Ctrl+S)"
                  >
                    🪄
                  </button>

                  <button
                    type="button"
                    className="mc-icon-tool-btn"
                    onClick={handleResetStarter}
                    title="Reset to initial starter template"
                  >
                    ↺
                  </button>

                  <button
                    type="button"
                    className={`mc-icon-tool-btn ${fullscreenPanel === 'editor' ? 'active' : ''}`}
                    onClick={() => setFullscreenPanel(prev => prev === 'editor' ? 'none' : 'editor')}
                    title={fullscreenPanel === 'editor' ? 'Restore Editor Size (Esc)' : 'Maximize Code Editor (Fullscreen)'}
                  >
                    {fullscreenPanel === 'editor' ? '⤓' : '⛶'}
                  </button>
                </div>
              </div>

              <div className="mc-monaco-wrapper">
                <Editor
                  height="100%"
                  path={`fjs/${question.id}/${question.functionName}.js`}
                  language="javascript"
                  theme={resolvedTheme === 'light' ? 'light' : 'vs-dark'}
                  value={currentCode}
                  onChange={handleCodeChange}
                  onMount={(editor, monaco) => {
                    editorRef.current = editor
                    if (monaco?.languages?.typescript) {
                      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                        noSemanticValidation: true,
                        noSyntaxValidation: false,
                      })
                    }

                    // Keybindings matching Machine Coding
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
                      handleRunCode()
                    })
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyT, () => {
                      handleRunCode()
                    })
                    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
                      setIsCommandPaletteOpen(prev => !prev)
                    })
                    editor.addCommand(monaco.KeyCode.Escape, () => {
                      setFullscreenPanel('none')
                      setShowShortcutsModal(false)
                      setIsCommandPaletteOpen(false)
                    })
                  }}
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    fontFamily: 'JetBrains Mono, Fira Code, Menlo, monospace',
                  }}
                />
              </div>
            </div>

            {/* Resizer divider between Editor and Test Results */}
            {fullscreenPanel === 'none' && (
              <div
                className={`mc-resizer-col ${isDraggingEditor ? 'dragging' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault()
                  setIsDraggingEditor(true)
                }}
                title="Drag to resize Editor vs Test Results"
              />
            )}

            {/* Test Results & Output Panel */}
            <div
              className="mc-preview-container"
              style={{
                display: fullscreenPanel === 'editor' ? 'none' : 'flex',
                flex: 1,
                width: fullscreenPanel === 'preview' ? '100%' : undefined,
                minWidth: 0,
              }}
            >
              <FrontendJsTestPanel
                testCases={question.testCases}
                runResult={runResult}
                isRunning={isRunning}
                activeTab={activeTestTab}
                setActiveTab={setActiveTestTab}
                submissions={submissions}
                fullscreenPanel={fullscreenPanel}
                onToggleFullscreen={() => setFullscreenPanel(prev => prev === 'preview' ? 'none' : 'preview')}
              />
            </div>
          </div>

          {/* Terminal / Console Drawer matching Machine Coding */}
          <div
            className="mc-console-drawer"
            style={{
              display: fullscreenPanel === 'editor' ? 'none' : 'flex',
            }}
          >
            <div className="mc-panel-header mc-terminal-header" style={{ borderTop: 'none' }}>
              <span className="mc-terminal-title">Terminal Output / Logs ({consoleLogs.length})</span>
              <button
                type="button"
                className="mc-clear-console-btn"
                onClick={() => setConsoleLogs([])}
              >
                Clear Console
              </button>
            </div>
            <div className="mc-console-logs">
              {consoleLogs.length === 0 ? (
                <div className="mc-console-empty">
                  No console logs or errors. Press "▶ Run Code" or "🧪 Tests" to inspect runtime output.
                </div>
              ) : (
                consoleLogs.map((log, idx) => (
                  <div key={idx} className={`mc-log-entry ${log.level}`}>
                    <span className="mc-log-level">[{log.level.toUpperCase()}]</span>
                    <span className="mc-log-msg">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMMAND PALETTE SPOTLIGHT MODAL (Ctrl+K) */}
      {isCommandPaletteOpen && (
        <div
          className="mc-palette-overlay"
          onClick={() => setIsCommandPaletteOpen(false)}
        >
          <div
            className="mc-palette-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="mc-palette-search-box">
              <span className="mc-palette-search-icon">🔍</span>
              <input
                type="text"
                autoFocus
                className="mc-palette-search-input"
                placeholder="Type to search 1,000 Frontend JavaScript challenges..."
                value={paletteSearchQuery}
                onChange={e => {
                  setPaletteSearchQuery(e.target.value)
                  setPaletteSelectedIndex(0)
                }}
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setPaletteSelectedIndex(prev => Math.min(filteredPaletteQuestions.length - 1, prev + 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setPaletteSelectedIndex(prev => Math.max(0, prev - 1))
                  } else if (e.key === 'Enter') {
                    e.preventDefault()
                    const target = filteredPaletteQuestions[paletteSelectedIndex]
                    if (target) {
                      onSelectQuestion(target.id)
                      setIsCommandPaletteOpen(false)
                    }
                  } else if (e.key === 'Escape') {
                    setIsCommandPaletteOpen(false)
                  }
                }}
              />
              <kbd className="mc-kbd">Esc</kbd>
            </div>

            <div className="mc-palette-results-list" ref={paletteListRef}>
              {filteredPaletteQuestions.length === 0 ? (
                <div className="mc-palette-empty">
                  No challenges found matching "{paletteSearchQuery}". Try another keyword.
                </div>
              ) : (
                filteredPaletteQuestions.slice(0, 100).map((q, idx) => {
                  const isSelected = idx === paletteSelectedIndex
                  const isCurrent = q.id === question.id
                  const isCompleted = frontendJsProgressService.isSolved(q.id)

                  return (
                    <div
                      key={q.id}
                      className={`mc-palette-item ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                      onMouseEnter={() => setPaletteSelectedIndex(idx)}
                      onClick={() => {
                        onSelectQuestion(q.id)
                        setIsCommandPaletteOpen(false)
                      }}
                    >
                      <div className="mc-palette-item-left">
                        <span className="mc-palette-item-id">{q.id}</span>
                        <div className="mc-palette-item-title-col">
                          <div className="mc-palette-item-title">{q.title}</div>
                          <div className="mc-palette-item-sub">
                            <span>⏱️ {q.timeEstimate || '15 mins'}</span>
                            <span>•</span>
                            <span>{q.category}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mc-palette-item-right">
                        <span className={`mc-badge ${q.difficulty.toLowerCase()}`}>
                          {q.difficulty}
                        </span>
                        {isCompleted && (
                          <span className="mc-palette-solved-pill" title="Completed">
                            ✓ Solved
                          </span>
                        )}
                        {isCurrent && (
                          <span className="mc-palette-active-pill">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            <div className="mc-palette-footer">
              <div className="mc-palette-footer-hints">
                <span className="mc-palette-hint">
                  <kbd className="mc-kbd">↑</kbd>
                  <kbd className="mc-kbd">↓</kbd>
                  <span>navigate</span>
                </span>
                <span className="mc-palette-hint">
                  <kbd className="mc-kbd">↵</kbd>
                  <span>jump to problem</span>
                </span>
                <span className="mc-palette-hint">
                  <kbd className="mc-kbd">Esc</kbd>
                  <span>dismiss</span>
                </span>
              </div>
              <span>1,000 Curriculum Challenges</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. KEYBOARD SHORTCUTS MODAL (Ctrl+/) */}
      {showShortcutsModal && (
        <div
          className="mc-shortcuts-overlay"
          onClick={() => setShowShortcutsModal(false)}
        >
          <div
            className="mc-shortcuts-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="mc-shortcuts-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>⌨️</span>
                <h3 className="mc-shortcuts-title">Keyboard Shortcuts</h3>
              </div>
              <button
                type="button"
                className="mc-shortcuts-close"
                onClick={() => setShowShortcutsModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="mc-shortcuts-body">
              <div className="mc-shortcut-row">
                <div className="mc-shortcut-info">
                  <span className="mc-shortcut-name">Run Code</span>
                  <span className="mc-shortcut-desc">Executes code in isolated Web Worker sandbox</span>
                </div>
                <div className="mc-shortcut-keys">
                  <kbd className="mc-kbd">Ctrl</kbd>
                  <span style={{ color: '#64748b' }}>+</span>
                  <kbd className="mc-kbd">Enter</kbd>
                </div>
              </div>

              <div className="mc-shortcut-row">
                <div className="mc-shortcut-info">
                  <span className="mc-shortcut-name">Run Test Suite</span>
                  <span className="mc-shortcut-desc">Runs automated unit assertions</span>
                </div>
                <div className="mc-shortcut-keys">
                  <kbd className="mc-kbd">Ctrl</kbd>
                  <span style={{ color: '#64748b' }}>+</span>
                  <kbd className="mc-kbd">Shift</kbd>
                  <span style={{ color: '#64748b' }}>+</span>
                  <kbd className="mc-kbd">T</kbd>
                </div>
              </div>

              <div className="mc-shortcut-row">
                <div className="mc-shortcut-info">
                  <span className="mc-shortcut-name">Quick Switch Problem</span>
                  <span className="mc-shortcut-desc">Instant fuzzy search across all 1,000 challenges</span>
                </div>
                <div className="mc-shortcut-keys">
                  <kbd className="mc-kbd">Ctrl</kbd>
                  <span style={{ color: '#64748b' }}>+</span>
                  <kbd className="mc-kbd">K</kbd>
                </div>
              </div>

              <div className="mc-shortcut-row">
                <div className="mc-shortcut-info">
                  <span className="mc-shortcut-name">Format Code Document</span>
                  <span className="mc-shortcut-desc">Cleans up indentation and syntax spacing</span>
                </div>
                <div className="mc-shortcut-keys">
                  <kbd className="mc-kbd">Alt</kbd>
                  <span style={{ color: '#64748b' }}>+</span>
                  <kbd className="mc-kbd">F</kbd>
                </div>
              </div>

              <div className="mc-shortcut-row">
                <div className="mc-shortcut-info">
                  <span className="mc-shortcut-name">Shortcuts Cheat Sheet</span>
                  <span className="mc-shortcut-desc">Opens this reference dialog</span>
                </div>
                <div className="mc-shortcut-keys">
                  <kbd className="mc-kbd">Ctrl</kbd>
                  <span style={{ color: '#64748b' }}>+</span>
                  <kbd className="mc-kbd">/</kbd>
                </div>
              </div>
            </div>

            <div className="mc-shortcuts-footer">
              <span>💡 Press <kbd className="mc-kbd">Esc</kbd> anytime to dismiss</span>
              <span>Works on Mac (use <kbd className="mc-kbd">⌘</kbd>) &amp; Windows</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. SCORECARD MODAL */}
      {showScorecard && (
        <div className="fjs-modal-overlay" onClick={() => setShowScorecard(false)}>
          <div className="fjs-modal-card" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <div className="fjs-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Senior Staff Evaluation Scorecard</h3>
              </div>
              <button type="button" className="fjs-modal-close" onClick={() => setShowScorecard(false)}>✕</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '4px solid #6366f1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}
                >
                  <span style={{ fontSize: '28px', fontWeight: 800 }}>
                    {runResult ? Math.round((runResult.passedCount / Math.max(1, runResult.totalCount)) * 100) : 0}%
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Score</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '16px', color: '#f8fafc' }}>
                  {question.id}: {question.title}
                </h4>
                <span className={`mc-badge ${question.difficulty.toLowerCase()}`}>
                  {question.difficulty}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#38bdf8' }}>
                    {runResult ? `${runResult.passedCount}/${runResult.totalCount}` : '0/0'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Assertions Passed</div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#a855f7' }}>
                    {formatMMSS(timerSeconds)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Time Elapsed</div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#10b981' }}>
                    {runResult ? `${runResult.totalRuntimeMs}ms` : '0ms'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Total Runtime</div>
                </div>
              </div>

              <div className="mc-interview-card" style={{ marginBottom: '16px' }}>
                <div className="mc-interview-title">🎯 Complexity &amp; Architecture Audit:</div>
                <ul className="mc-interview-list">
                  <li>Target Time Complexity: <strong>{question.timeComplexity || 'O(n)'}</strong></li>
                  <li>Target Space Complexity: <strong>{question.spaceComplexity || 'O(1)'}</strong></li>
                  <li>Runtime Status: <strong>{runResult?.status || 'Pending'}</strong></li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="mc-action-btn"
                  onClick={() => setShowScorecard(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="mc-btn-primary mc-btn-sm"
                  onClick={() => {
                    setShowScorecard(false)
                    if (nextQuestion) onSelectQuestion(nextQuestion.id)
                  }}
                  disabled={!nextQuestion}
                >
                  Next Problem ›
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
