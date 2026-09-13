import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { DSA_QUESTIONS } from './data/dsaQuestions'
import type { DSARunResult, DSASubmission, DSATestCase } from './data/dsaTypes'
import { runDSACode } from './lib/dsaRunner'
import { dsaProgressService } from './lib/dsaProgressService'
import { dsaSubmissionService } from './lib/dsaSubmissionService'
import { interviewSessionService } from '../../lib/interviewSessionService'
import { useInterviewSocket } from '../../hooks/useInterviewSocket'
import { useAuth } from '../../context/AuthContext'
import { DSAQuestionDetail } from './components/DSAQuestionDetail'
import { DSATestPanel } from './components/DSATestPanel'
import { DSAQuestionList } from './components/DSAQuestionList'
import { DSADashboard } from './DSADashboard'
import './DSAStudio.css'

// In-flight live-session creations keyed by candidate+question+language.
// Makes the check-then-insert getOrCreateSession safe under StrictMode
// double-effects: concurrent mounts share one promise, one session row.
const dsaSessionInflight = new Map<string, Promise<{ id: string } | null>>()

// Canonical code for a question+language: saved draft, else static starter.
// Pure synchronous read so onMount can establish the exact model content
// without depending on React state timing.
function resolveDSACode(
  question: { id: string; starterCodeJS: string; starterCodeTS: string },
  language: 'javascript' | 'typescript',
): string {
  const saved = dsaProgressService.getCode(question.id, language)
  if (saved !== null) return saved
  return language === 'javascript' ? question.starterCodeJS : question.starterCodeTS
}

export default function DSAStudio() {
  const [searchParams] = useSearchParams()
  const { id: routeId } = useParams<{ id?: string }>()
  const location = useLocation()

  const isBookmarks = location.pathname.includes('/bookmarks')
  const isProgress = location.pathname.includes('/progress')
  const isNamedCatalog = routeId && ['questions', 'progress', 'bookmarks'].includes(routeId)

  // Active question ID: from ?id= or /dsa/:id or /dsa/question/:id
  const qIdParam = searchParams.get('id') || (!isNamedCatalog && routeId ? routeId : null)

  // If no question ID provided, render the comprehensive DSADashboard
  if (!qIdParam) {
    return (
      <DSADashboard
        initialFilter={isBookmarks ? 'Bookmarked' : 'All'}
        initialFocusProgress={isProgress}
      />
    )
  }

  // Unknown ids render an explicit error, never a silent wrong question:
  // recording work against DSA_QUESTIONS[0] would corrupt attempts/history.
  const known = DSA_QUESTIONS.some(q => q.id === qIdParam)
  if (!known) {
    return (
      <div className="dsa-workspace">
        <div style={{ margin: 'auto', textAlign: 'center', padding: 48 }}>
          <h2>Question not found</h2>
          <p>No DSA question matches “{qIdParam}”. Check the link or pick a question below.</p>
          <button className="dsa-btn dsa-btn-run" onClick={() => window.history.back()}>
            Go back
          </button>
        </div>
      </div>
    )
  }

  return <DSAStudioWorkspace questionId={qIdParam} />
}

interface WorkspaceProps {
  questionId: string
}

function DSAStudioWorkspace({ questionId }: WorkspaceProps) {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Find question
  const question = useMemo(() => {
    return DSA_QUESTIONS.find(q => q.id === questionId) || DSA_QUESTIONS[0]
  }, [questionId])

  // Language state
  const [language, setLanguage] = useState<'javascript' | 'typescript'>('javascript')

  // Code state
  const [code, setCode] = useState<string>('')
  // Stable read of the latest code for session snapshots without retriggering effects
  const codeRef = useRef(code)
  codeRef.current = code

  // Editor configuration
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [fontSize, setFontSize] = useState<number>(14)
  const editorRef = useRef<any>(null)
  const sessionIdRef = useRef<string | null>(null)
  const updateCodeTimeoutRef = useRef<number | null>(null)
  const editorDisposablesRef = useRef<Array<{ dispose: () => void }>>([])

  // Dispose per-editor listeners when the question/language changes or the
  // workspace unmounts. (@monaco-editor/react disposes the editor itself;
  // this covers the cursor/focus subscriptions registered in onMount.)
  useEffect(() => {
    const qid = question.id
    const lang = language
    return () => {
      if (import.meta.env?.DEV) {
        console.debug('[DSA033][MONACO] dispose', { questionId: qid, language: lang })
      }
      for (const d of editorDisposablesRef.current) {
        try {
          d.dispose()
        } catch (_) {}
      }
      editorDisposablesRef.current = []
      editorRef.current = null
    }
  }, [question.id, language])

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [runResult, setRunResult] = useState<DSARunResult | null>(null)
  const [activeTestTab, setActiveTestTab] = useState<'testcase' | 'result'>('testcase')

  // Custom input state
  const [customInput, setCustomInput] = useState<string>('')
  const [useCustomInput, setUseCustomInput] = useState<boolean>(false)

  // Drawer & Panel sizes
  const [isListDrawerOpen, setIsListDrawerOpen] = useState<boolean>(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(460)
  const [bottomPanelHeight, setBottomPanelHeight] = useState<number>(260)
  const [fullscreenPanel, setFullscreenPanel] = useState<'none' | 'specs' | 'editor' | 'test'>('none')
  const isDraggingLeft = useRef<boolean>(false)
  const isDraggingBottom = useRef<boolean>(false)

  // Auto-resize Monaco editor when fullscreenPanel toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current && typeof editorRef.current.layout === 'function') {
        editorRef.current.layout()
      }
    }, 50)
    return () => clearTimeout(timer)
  }, [fullscreenPanel])

  // Timer state
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true)

  // Submissions list for current question
  const [submissions, setSubmissions] = useState<DSASubmission[]>([])
  const [liveSessionId, setLiveSessionId] = useState<string | null>(null)

  // Live session sync to Admin Real-time Candidate Monitor.
  // In-flight guard: getOrCreateSession is check-then-insert, so two concurrent
  // calls (StrictMode setup/cleanup/setup) would both observe "no session" and
  // INSERT duplicate interview_sessions rows. Concurrent callers share one promise.
  // Deps are scalars: `user` object identity changes per render and must not retrigger.
  const userId = user?.id
  const userName = user?.name
  const userEmail = user?.email
  useEffect(() => {
    let active = true
    // Guests pass no id: service persists NULL candidate_id (FK-safe) instead of fake ids
    const candidateId = userId
    const candidateName = userName || 'Candidate'
    const candidateEmail = userEmail || 'candidate@faang.io'
    const inflightKey = `${candidateId || 'guest'}:${question.id}:${language}`
    const pending = dsaSessionInflight.get(inflightKey)
    const task = pending || interviewSessionService.getOrCreateSession({
      candidateId,
      candidateName,
      candidateEmail,
      questionId: question.id,
      questionTitle: `${question.number}. ${question.title}`,
      language,
      initialFiles: {
        [language === 'typescript' ? 'solution.ts' : 'solution.js']: codeRef.current,
      },
    })
    if (!pending) {
      dsaSessionInflight.set(inflightKey, task)
      void task.finally(() => {
        if (dsaSessionInflight.get(inflightKey) === task) {
          dsaSessionInflight.delete(inflightKey)
        }
      })
    }

    task
      .then(sess => {
        if (active && sess) {
          sessionIdRef.current = sess.id
          setLiveSessionId(sess.id)
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, language, userId])

  const fileName = language === 'typescript' ? 'solution.ts' : 'solution.js'

  // ── REALTIME TWO-WAY SOCKET.IO (Telemetry for Admin Virtual Monitor) ──
  const {
    emitCodeChange,
    emitCursorMove,
    emitFocus,
    emitCodeRun,
    bindMonacoEditor,
  } = useInterviewSocket({
    sessionId: liveSessionId,
    questionId: question.id,
    questionTitle: `${question.number}. ${question.title}`,
    track: 'dsa',
    language,
    activeFile: fileName,
    code,
    user,
  })

  // Heartbeat keeps admin "last seen" fresh (MC/CP parity)
  useEffect(() => {
    const heartbeat = window.setInterval(() => {
      if (sessionIdRef.current) {
        interviewSessionService.updateSessionActivity(sessionIdRef.current)
      }
    }, 30000)
    return () => window.clearInterval(heartbeat)
  }, [])

  // Load code from localStorage on question / language change.
  // Editor binding is staged HERE (not in onMount): this effect is the single
  // place where the authoritative code for this question is established, so
  // any bind staged here necessarily carries the current question's code.
  // Staging in onMount raced the load and bound stale (previous-question)
  // code, permanently sticking the old template in the editor.
  useEffect(() => {
    if (import.meta.env?.DEV) {
      console.debug('[DSA033][PAGE] workspace effect', { questionId: question.id, language })
    }
    const target = resolveDSACode(question, language)
    if (import.meta.env?.DEV) {
      console.debug('[DSA033][TEMPLATE] lookup result', {
        questionId: question.id,
        language,
        source: dsaProgressService.getCode(question.id, language) !== null ? 'saved-draft' : 'starter',
        len: target.length,
      })
    }
    setCode(target)
    setRunResult(null)
    setActiveTestTab('testcase')
    setCustomInput(question.testCases[0]?.input || '[]')
    setUseCustomInput(false)

    // Load submissions
    setSubmissions(dsaProgressService.getSubmissions(question.id))

    // Stage the mounted editor for the sync-gated Yjs auto-bind. The editor
    // (if mounted) belongs to this question, and this effect runs after the
    // code state for this question is set, so the staged bind cannot carry
    // stale previous-question code.
    if (editorRef.current) {
      bindMonacoEditor(editorRef.current, fileName, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, language])

  // Timer effect
  useEffect(() => {
    let interval: number | undefined
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setTimerSeconds((s: number) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Splitter drag handlers
  const handleLeftMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingLeft.current) {
      const newWidth = Math.max(300, Math.min(800, e.clientX))
      setLeftPanelWidth(newWidth)
    }
  }, [])

  const handleLeftMouseUp = useCallback(() => {
    isDraggingLeft.current = false
    window.removeEventListener('mousemove', handleLeftMouseMove)
    window.removeEventListener('mouseup', handleLeftMouseUp)
  }, [handleLeftMouseMove])

  const startLeftDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingLeft.current = true
    window.addEventListener('mousemove', handleLeftMouseMove)
    window.addEventListener('mouseup', handleLeftMouseUp)
  }

  const handleBottomMouseMove = useCallback((e: MouseEvent) => {
    if (isDraggingBottom.current) {
      const newHeight = Math.max(120, Math.min(500, window.innerHeight - e.clientY))
      setBottomPanelHeight(newHeight)
    }
  }, [])

  const handleBottomMouseUp = useCallback(() => {
    isDraggingBottom.current = false
    window.removeEventListener('mousemove', handleBottomMouseMove)
    window.removeEventListener('mouseup', handleBottomMouseUp)
  }, [handleBottomMouseMove])

  const startBottomDrag = (e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingBottom.current = true
    window.addEventListener('mousemove', handleBottomMouseMove)
    window.addEventListener('mouseup', handleBottomMouseUp)
  }

  // Handle code change with immediate cursor streaming
  // Set when a model change originates from our own programmatic sync
  // (question load, reset, submission view). The onChange echo of that sync
  // must not re-save/re-emit, and must not disturb state.
  const suppressNextChangeRef = useRef(false)
  // A submission selected for viewing carries code that is neither draft nor
  // starter. onMount consumes it for the remounted model, then clears it.
  const pendingCodeRef = useRef<string | null>(null)

  // Bring the live Monaco model to `next` without touching React state.
  // Used for programmatic changes only; user typing flows through onChange.
  const syncEditorModel = (next: string) => {
    const ed = editorRef.current
    const model = ed?.getModel?.()
    if (!ed || !model || model.getValue() === next) return
    suppressNextChangeRef.current = true
    try {
      ed.executeEdits('dsa-sync', [{ range: model.getFullModelRange(), text: next }])
      ed.pushUndoStop?.()
    } finally {
      // onDidChangeModelContent fires synchronously inside executeEdits,
      // so the flag is consumed by handleCodeChange below before we clear it.
      suppressNextChangeRef.current = false
    }
  }

  const handleCodeChange = (newVal: string | undefined) => {
    if (suppressNextChangeRef.current) return
    const val = newVal || ''
    setCode(val)

    const pos = editorRef.current?.getPosition()
    const cursor = pos ? { line: pos.lineNumber, column: pos.column } : undefined
    emitCodeChange(val, fileName, cursor)
    if (pos) {
      emitCursorMove(pos.lineNumber, pos.column)
    }

    dsaProgressService.saveCode(question.id, language, val)

    // Debounce live code snapshot to Admin monitor
    if (sessionIdRef.current) {
      if (updateCodeTimeoutRef.current) clearTimeout(updateCodeTimeoutRef.current)
      updateCodeTimeoutRef.current = window.setTimeout(() => {
        if (sessionIdRef.current) {
          const fName = language === 'typescript' ? 'solution.ts' : 'solution.js'
          interviewSessionService
            .saveSnapshot(sessionIdRef.current, { [fName]: val }, 'DSA Code Autosave')
            .catch(() => {})
        }
      }, 1200)
    }
  }

  // Format code document
  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run()
    }
  }

  // Reset code to starter template
  const handleResetCode = () => {
    if (window.confirm('Reset code to the original starter template for this problem?')) {
      const initial = language === 'javascript' ? question.starterCodeJS : question.starterCodeTS
      setCode(initial)
      syncEditorModel(initial)
      emitCodeChange(initial, fileName)
      dsaProgressService.saveCode(question.id, language, initial)
    }
  }

  // Run Code (Visible test cases or custom testcase)
  const handleRunCode = async () => {
    if (isRunning || isSubmitting) return
    setIsRunning(true)
    emitCodeRun({ status: 'running' })
    setActiveTestTab('result')

    let targetCases: DSATestCase[]
    if (useCustomInput) {
      targetCases = [
        {
          id: 'custom_run',
          input: customInput,
          expectedOutput: 'null',
          isHidden: false,
        },
      ]
    } else {
      targetCases = question.testCases.filter((t: DSATestCase) => !t.isHidden)
    }

    const result = await runDSACode(code, language, question.functionName, targetCases)
    setRunResult(result)
    setIsRunning(false)

    emitCodeRun({
      status: result.success ? 'success' : 'failed',
      passed: result.passedCount,
      total: result.totalCount,
      runtimeMs: result.totalRuntimeMs,
    })

    // Report execution event to Admin live monitor
    if (sessionIdRef.current) {
      interviewSessionService
        .recordExecution({
          session_id: sessionIdRef.current,
          candidate_id: user?.id,
          question_id: question.id,
          language,
          status: result.success ? 'success' : 'failed',
          execution_time: result.totalRuntimeMs,
          tests_passed: result.passedCount,
          tests_total: result.totalCount,
          stdout: result.consoleLogs.map(l => l.message).join('\n'),
        })
        .catch(() => {})
    }
  }

  // Submit Solution (All test cases including hidden ones)
  const handleSubmitCode = async () => {
    if (isSubmitting || isRunning) return
    setIsSubmitting(true)
    setIsRunning(true)
    emitCodeRun({ status: 'running' })
    setActiveTestTab('result')

    // Evaluate against all test cases
    const result = await runDSACode(code, language, question.functionName, question.testCases, 5000)
    setRunResult(result)
    setIsRunning(false)
    setIsSubmitting(false)

    emitCodeRun({
      status: result.success ? 'success' : 'failed',
      passed: result.passedCount,
      total: result.totalCount,
      runtimeMs: result.totalRuntimeMs,
    })

    // Log submission record
    const sub: DSASubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      questionId: question.id,
      language,
      code,
      status: result.status,
      testsPassed: result.passedCount,
      testsTotal: result.totalCount,
      runtimeMs: result.totalRuntimeMs,
      timestamp: new Date().toISOString(),
    }

    await dsaSubmissionService.submit(sub, user)
    setSubmissions(dsaProgressService.getSubmissions(question.id))

    // Record submission to Admin live session
    if (sessionIdRef.current) {
      interviewSessionService
        .recordExecution({
          session_id: sessionIdRef.current,
          candidate_id: user?.id,
          question_id: question.id,
          language,
          status: result.success ? 'success' : 'failed',
          execution_time: result.totalRuntimeMs,
          tests_passed: result.passedCount,
          tests_total: result.totalCount,
          stdout: `Submission: ${result.status} (${result.passedCount}/${result.totalCount})`,
        })
        .catch(() => {})
    }
  }

  // Navigate Prev / Next Question
  const currentIndex = DSA_QUESTIONS.findIndex(q => q.id === question.id)
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      navigate(`/dsa?id=${DSA_QUESTIONS[currentIndex - 1].id}`)
    }
  }

  const handleNextQuestion = () => {
    if (currentIndex < DSA_QUESTIONS.length - 1) {
      navigate(`/dsa?id=${DSA_QUESTIONS[currentIndex + 1].id}`)
    }
  }

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run.
  // Registered ONCE per question/language: the handler reads mutable state via
  // refs, so typing (setCode on every keystroke) does not tear down and re-add
  // this window listener on every keypress.
  const runCodeRef = useRef(handleRunCode)
  runCodeRef.current = handleRunCode
  const fullscreenRef = useRef(fullscreenPanel)
  fullscreenRef.current = fullscreenPanel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runCodeRef.current()
      } else if (e.key === 'Escape') {
        if (fullscreenRef.current !== 'none') {
          setFullscreenPanel('none')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question.id, language])

  // Format timer
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="dsa-studio-container">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="dsa-topbar">
        <div className="dsa-topbar-left">
          <button
            className="dsa-nav-btn"
            onClick={() => navigate('/dsa')}
            title="Return to DSA Dashboard"
          >
            ← Problems Dashboard
          </button>

          <button
            className="dsa-nav-btn"
            onClick={() => setIsListDrawerOpen((prev: boolean) => !prev)}
            title="Browse all 1,000 questions"
          >
            📋 Problem List
          </button>

          <div className="dsa-nav-prevnext">
            <button
              className="dsa-arrow-btn"
              disabled={currentIndex <= 0}
              onClick={handlePrevQuestion}
              title="Previous Problem"
            >
              ◀ Prev
            </button>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, padding: '0 4px', userSelect: 'none' }}>
              Question {question.number} / {DSA_QUESTIONS.length}
            </span>
            <button
              className="dsa-arrow-btn"
              disabled={currentIndex >= DSA_QUESTIONS.length - 1}
              onClick={handleNextQuestion}
              title="Next Problem"
            >
              Next ▶
            </button>
          </div>

          <div className="dsa-topbar-title-wrap">
            <span className="dsa-topbar-title">
              {question.number}. {question.title}
            </span>
            <span className={`dsa-diff-pill ${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
          </div>
        </div>

        {/* Center: Language toggle & Timer */}
        <div className="dsa-topbar-center">
          <div className="dsa-lang-selector-group">
            <button
              className={`dsa-lang-pill ${language === 'javascript' ? 'active' : ''}`}
              onClick={() => setLanguage('javascript')}
            >
              JavaScript
            </button>
            <button
              className={`dsa-lang-pill ${language === 'typescript' ? 'active' : ''}`}
              onClick={() => setLanguage('typescript')}
            >
              TypeScript
            </button>
          </div>

          <div
            className="dsa-timer-box"
            onClick={() => setIsTimerRunning((prev: boolean) => !prev)}
            title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
          >
            <span>{isTimerRunning ? '⏱️' : '⏸️'}</span>
            <span>{formatTimer(timerSeconds)}</span>
          </div>
        </div>

          {/* Right: Reset, Format, Run, Submit buttons */}
        <div className="dsa-topbar-right">
          <button
            className="dsa-btn-reset"
            onClick={handleFormatCode}
            title="Auto-format code document"
          >
            🪄 Format
          </button>

          <button
            className="dsa-btn-reset"
            onClick={handleResetCode}
            title="Reset code to starter template"
          >
            Reset
          </button>

          <button
            className="dsa-btn-run"
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting}
            title="Run Code (Ctrl + Enter)"
          >
            {isRunning && !isSubmitting ? 'Running...' : '▶ Run Code'}
          </button>

          <button
            className="dsa-btn-submit"
            onClick={handleSubmitCode}
            disabled={isRunning || isSubmitting}
            title="Submit solution against all hidden tests"
          >
            {isSubmitting ? 'Evaluating...' : '🚀 Submit'}
          </button>
        </div>
      </header>

      {/* ================= WORKSPACE PANELS ================= */}
      <div className="dsa-workspace">
        {/* LEFT PANEL: Problem Statement, Editorial, Hints, Submissions */}
        <div
          className="dsa-left-panel"
          style={{
            width: fullscreenPanel === 'specs' ? '100%' : leftPanelWidth,
            display: (fullscreenPanel === 'editor' || fullscreenPanel === 'test') ? 'none' : 'flex',
            flex: fullscreenPanel === 'specs' ? 1 : undefined,
            borderRight: fullscreenPanel === 'specs' ? 'none' : undefined,
          }}
        >
          <DSAQuestionDetail
            question={question}
            submissions={submissions}
            onSelectSubmission={sub => {
              if (sub.code) {
                setCode(sub.code)
                setLanguage(sub.language)
                // A viewed submission is neither draft nor starter: hand it
                // to the (possibly remounting) editor explicitly so model and
                // state cannot disagree. The remount path consumes it in
                // onMount; the no-remount path applies it right away.
                pendingCodeRef.current = sub.code
                syncEditorModel(sub.code)
              }
            }}
            fullscreenPanel={fullscreenPanel}
            onToggleFullscreen={() => setFullscreenPanel(prev => prev === 'specs' ? 'none' : 'specs')}
          />
        </div>

        {/* RESIZABLE SPLITTER (Vertical) */}
        {fullscreenPanel === 'none' && (
          <div className="dsa-splitter" onMouseDown={startLeftDrag} />
        )}

        {/* RIGHT PANEL: Monaco Editor + Test Execution Panel */}
        <div
          className="dsa-right-panel"
          style={{
            display: fullscreenPanel === 'specs' ? 'none' : 'flex',
            flex: 1,
            width: fullscreenPanel !== 'none' ? '100%' : undefined,
          }}
        >
          {/* Editor Header Bar (Theme, Font Size, Fullscreen) */}
          <div style={{ display: fullscreenPanel === 'test' ? 'none' : 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#181818', padding: '4px 12px', borderBottom: '1px solid var(--border)', fontSize: '11px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span>Code Editor</span>
              <span style={{ color: 'var(--border-strong)' }}>|</span>
              <button
                type="button"
                onClick={() => setEditorTheme((t: string) => t === 'vs-dark' ? 'light' : 'vs-dark')}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '11px' }}
              >
                {editorTheme === 'vs-dark' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span>Font:</span>
                {[12, 14, 16].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    style={{
                      background: fontSize === sz ? 'var(--surface-hover)' : 'transparent',
                      border: '1px solid ' + (fontSize === sz ? 'var(--border-strong)' : 'transparent'),
                      borderRadius: '4px',
                      color: fontSize === sz ? 'var(--text-primary)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '11px',
                      padding: '1px 5px',
                    }}
                  >
                    {sz}px
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={`dsa-fullscreen-btn ${fullscreenPanel === 'editor' ? 'active' : ''}`}
                onClick={() => setFullscreenPanel(prev => prev === 'editor' ? 'none' : 'editor')}
                title={fullscreenPanel === 'editor' ? 'Restore Editor Size (Esc)' : 'Maximize Code Editor (Fullscreen)'}
                aria-label={fullscreenPanel === 'editor' ? 'Restore Editor Size' : 'Maximize Code Editor'}
              >
                {fullscreenPanel === 'editor' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="14" y1="10" x2="21" y2="3" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div
            className="dsa-editor-wrapper"
            style={{
              display: fullscreenPanel === 'test' ? 'none' : 'flex',
              flex: 1,
              height: fullscreenPanel === 'editor' ? '100%' : undefined,
            }}
          >
            <Editor
              key={`${question.id}_${language}`}
              height="100%"
              language={language === 'typescript' ? 'typescript' : 'javascript'}
              theme={editorTheme}
              // UNCONTROLLED on purpose: a controlled `value` made the lib
              // re-apply lagging state over the live model during rapid typing
              // (lost/interleaved keystrokes). defaultValue seeds the model at
              // creation; the exact content is then enforced synchronously in
              // onMount below, and user typing flows model->state via onChange.
              defaultValue={code}
              onChange={handleCodeChange}
              onMount={(editor) => {
                // No binding here: binding is staged in the question-load
                // effect above, which runs after this question's code is set.
                // Binding here would capture stale previous-question code.
                editorRef.current = editor
                // The remounted model was created from the previous render's
                // (stale) code. Establish this question's exact content now,
                // computed synchronously (draft, viewed submission, or starter)
                // so correctness never depends on state/effect timing.
                const target = pendingCodeRef.current ?? resolveDSACode(question, language)
                pendingCodeRef.current = null
                syncEditorModel(target)
                if (import.meta.env?.DEV) {
                  const modelVal = editor.getModel()?.getValue() ?? ''
                  console.debug('[DSA033][MONACO] create', {
                    questionId: question.id,
                    language,
                    modelLen: modelVal.length,
                    modelHead: modelVal.slice(0, 80),
                    modelMatchesTarget: modelVal === target,
                  })
                }
                // Every registration must be disposed on unmount/question
                // change, or remounts stack duplicate cursor/focus listeners.
                editorDisposablesRef.current = [
                  editor.onDidChangeCursorPosition(e => {
                    emitCursorMove(e.position.lineNumber, e.position.column)
                  }),
                  editor.onDidFocusEditorWidget(() => emitFocus(true)),
                  editor.onDidBlurEditorWidget(() => emitFocus(false)),
                ]
              }}
              options={{
                fontSize: fontSize,
                fontFamily: "'Fira Code', 'Courier New', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                automaticLayout: true,
                tabSize: 2,
                folding: true,
                cursorBlinking: 'smooth',
                renderWhitespace: 'selection',
                formatOnPaste: true,
                formatOnType: true,
              }}
            />
          </div>

          {/* RESIZABLE SPLITTER (Horizontal) */}
          {fullscreenPanel === 'none' && (
            <div className="dsa-horizontal-splitter" onMouseDown={startBottomDrag} />
          )}

          {/* BOTTOM PANEL: Test Cases and Test Results */}
          <div
            className="dsa-bottom-panel"
            style={{
              display: fullscreenPanel === 'editor' ? 'none' : 'flex',
              height: fullscreenPanel === 'test' ? '100%' : bottomPanelHeight,
              flex: fullscreenPanel === 'test' ? 1 : undefined,
              borderTop: fullscreenPanel === 'test' ? 'none' : undefined,
            }}
          >
            <DSATestPanel
              testCases={question.testCases}
              runResult={runResult}
              isRunning={isRunning}
              customInput={customInput}
              onCustomInputChange={setCustomInput}
              useCustomInput={useCustomInput}
              onToggleCustomInput={setUseCustomInput}
              activeTab={activeTestTab}
              onTabChange={setActiveTestTab}
              fullscreenPanel={fullscreenPanel}
              onToggleFullscreen={() => setFullscreenPanel(prev => prev === 'test' ? 'none' : 'test')}
            />
          </div>
        </div>
      </div>

      {/* ================= QUESTION LIST DRAWER ================= */}
      {isListDrawerOpen && (
        <div className="dsa-qlist-drawer">
          <DSAQuestionList
            questions={DSA_QUESTIONS}
            currentId={question.id}
            onSelect={id => {
              setIsListDrawerOpen(false)
              navigate(`/dsa?id=${id}`)
            }}
            onClose={() => setIsListDrawerOpen(false)}
          />
        </div>
      )}
    </div>
  )
}
