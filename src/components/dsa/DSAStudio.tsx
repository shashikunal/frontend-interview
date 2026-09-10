import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { DSA_QUESTIONS } from './data/dsaQuestions'
import type { DSARunResult, DSASubmission, DSATestCase } from './data/dsaTypes'
import { runDSACode } from './lib/dsaRunner'
import { dsaProgressService } from './lib/dsaProgressService'
import { dsaSubmissionService } from './lib/dsaSubmissionService'
import { interviewSessionService } from '../../lib/interviewSessionService'
import { useAuth } from '../../context/AuthContext'
import { DSAQuestionDetail } from './components/DSAQuestionDetail'
import { DSATestPanel } from './components/DSATestPanel'
import { DSAQuestionList } from './components/DSAQuestionList'
import { DSADashboard } from './DSADashboard'
import './DSAStudio.css'

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

  // Editor configuration
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [fontSize, setFontSize] = useState<number>(14)
  const editorRef = useRef<any>(null)
  const sessionIdRef = useRef<string | null>(null)
  const updateCodeTimeoutRef = useRef<number | null>(null)

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

  // Live session sync to Admin Real-time Candidate Monitor
  useEffect(() => {
    let active = true
    const candidateId = user?.id || `cand_${Date.now().toString(36)}`
    const candidateName = user?.name || 'Candidate'
    const candidateEmail = user?.email || 'candidate@faang.io'

    interviewSessionService
      .getOrCreateSession({
        candidateId,
        candidateName,
        candidateEmail,
        questionId: question.id,
        questionTitle: `${question.number}. ${question.title}`,
        language,
        initialFiles: {
          [language === 'typescript' ? 'solution.ts' : 'solution.js']: code,
        },
      })
      .then(sess => {
        if (active && sess) {
          sessionIdRef.current = sess.id
        }
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [question.id, language, user])

  // Load code from localStorage on question / language change
  useEffect(() => {
    const saved = dsaProgressService.getCode(question.id, language)
    if (saved !== null) {
      setCode(saved)
    } else {
      setCode(language === 'javascript' ? question.starterCodeJS : question.starterCodeTS)
    }
    setRunResult(null)
    setActiveTestTab('testcase')
    setCustomInput(question.testCases[0]?.input || '[]')
    setUseCustomInput(false)

    // Load submissions
    setSubmissions(dsaProgressService.getSubmissions(question.id))
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

  // Handle code change
  const handleCodeChange = (newVal: string | undefined) => {
    const val = newVal || ''
    setCode(val)
    dsaProgressService.saveCode(question.id, language, val)

    // Debounce live code snapshot to Admin monitor
    if (sessionIdRef.current) {
      if (updateCodeTimeoutRef.current) clearTimeout(updateCodeTimeoutRef.current)
      updateCodeTimeoutRef.current = window.setTimeout(() => {
        if (sessionIdRef.current) {
          const fileName = language === 'typescript' ? 'solution.ts' : 'solution.js'
          interviewSessionService
            .saveSnapshot(sessionIdRef.current, { [fileName]: val }, 'DSA Code Autosave')
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
      dsaProgressService.saveCode(question.id, language, initial)
    }
  }

  // Run Code (Visible test cases or custom testcase)
  const handleRunCode = async () => {
    setIsRunning(true)
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
    setIsSubmitting(true)
    setIsRunning(true)
    setActiveTestTab('result')

    // Evaluate against all test cases
    const result = await runDSACode(code, language, question.functionName, question.testCases, 5000)
    setRunResult(result)
    setIsRunning(false)
    setIsSubmitting(false)

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

  // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRunCode()
      } else if (e.key === 'Escape') {
        if (fullscreenPanel !== 'none') {
          setFullscreenPanel('none')
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [code, language, question, useCustomInput, customInput, fullscreenPanel])

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
              height="100%"
              language={language === 'typescript' ? 'typescript' : 'javascript'}
              theme={editorTheme}
              value={code}
              onChange={handleCodeChange}
              onMount={(editor) => {
                editorRef.current = editor
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
