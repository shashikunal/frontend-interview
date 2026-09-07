import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { useTheme } from '../../context/ThemeContext'
import { getById } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import type { Question } from '../../models/question'
import {
  parseLeetCodeTemplate,
  renderFormattedMarkdown,
  type TestCaseItem,
} from '../../lib/questionTemplate'
import { JsRunner, type LogLevel } from '../../lib/runner'
import {
  trackingService,
  type SubmissionRecord,
  type UserQuestionProgress,
} from '../../lib/trackingService'
import './LeetCodeIde.css'

interface RunResult {
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error'
  runtime: number
  output?: string
  expected?: string
  logs: string[]
  error?: string
  totalCases?: number
  passedCases?: number
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s'
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

export default function LeetCodeIde() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isSolved, markSolved, toggleSolved } = useProgress()
  const { questions: allQuestions, loading } = useQuestions()

  const question: Question | undefined = useMemo(() => {
    return getById(allQuestions, Number(id))
  }, [allQuestions, id])

  const parsed = useMemo(() => {
    if (!question) return null
    return parseLeetCodeTemplate(question)
  }, [question])

  const bookmarked = question ? isBookmarked(question.id) : false
  const solved = question ? isSolved(question.id) : false

  // Navigation indices
  const currentIndex = useMemo(() => {
    return allQuestions.findIndex(q => q.id === Number(id))
  }, [allQuestions, id])
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null
  const nextQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null

  // Tab states
  const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'submissions'>('description')
  const [consoleTab, setConsoleTab] = useState<'testcase' | 'testresult'>('testcase')
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0)
  const [code, setCode] = useState('')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [copied, setCopied] = useState(false)

  // Tracking & Persistence State
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null)
  const [questionProgress, setQuestionProgress] = useState<UserQuestionProgress | null>(null)
  const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'idle'>('idle')
  const [submissionsList, setSubmissionsList] = useState<SubmissionRecord[]>([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [inspectingSub, setInspectingSub] = useState<SubmissionRecord | null>(null)

  const runnerRef = useRef<JsRunner>(new JsRunner())
  const activeAttemptIdRef = useRef<string | null>(null)
  activeAttemptIdRef.current = activeAttemptId

  // Load Submissions History
  const loadSubmissions = useCallback(async (qId: number) => {
    setLoadingSubmissions(true)
    try {
      const subs = await trackingService.getQuestionSubmissions(qId)
      setSubmissionsList(subs)
    } finally {
      setLoadingSubmissions(false)
    }
  }, [])

  // Initialize or resume question session, progress, and draft
  useEffect(() => {
    if (!question || !parsed) return

    let isMounted = true

    // 1. Log question view
    void trackingService.trackActivity('question_viewed', 'question', question.id, {
      title: parsed.title,
      difficulty: parsed.difficulty,
      category: question.category,
    })

    // 2. Start or Resume Attempt
    trackingService.startOrResumeQuestionAttempt(question.id).then(attId => {
      if (isMounted) setActiveAttemptId(attId)
    })

    // 3. Load Progress
    trackingService.getUserQuestionProgress(question.id).then(prog => {
      if (isMounted) setQuestionProgress(prog)
    })

    // 4. Load Draft or Starter Code
    trackingService.getDraft(question.id, 'javascript').then(draft => {
      if (!isMounted) return
      if (draft?.code && draft.code.trim()) {
        setCode(draft.code)
        setDraftStatus('saved')
      } else {
        const localKey = `lc_code_${parsed.questionNumber}`
        const localSaved = localStorage.getItem(localKey)
        if (localSaved && localSaved.trim()) {
          setCode(localSaved)
          setDraftStatus('saved')
        } else {
          setCode(parsed.starterCode || parsed.solution || '')
          setDraftStatus('idle')
        }
      }
    })

    // 5. Preload Submissions
    void loadSubmissions(question.id)

    setRunResult(null)
    setSelectedCaseIdx(0)

    // Listen to draft saved event
    const handleDraftSaved = (e: Event) => {
      const customEvent = e as CustomEvent<{ questionId: string }>
      if (customEvent.detail?.questionId === String(question.id)) {
        setDraftStatus('saved')
      }
    }
    window.addEventListener('platform_draft_saved', handleDraftSaved)

    return () => {
      isMounted = false
      window.removeEventListener('platform_draft_saved', handleDraftSaved)
    }
  }, [question?.id, parsed?.questionNumber, loadSubmissions])

  // Save code changes with debouncing
  const handleEditorChange = (val: string | undefined) => {
    const next = val ?? ''
    setCode(next)
    setDraftStatus('saving')

    if (parsed && question) {
      localStorage.setItem(`lc_code_${parsed.questionNumber}`, next)
      trackingService.saveDraft(question.id, next, 'javascript', activeAttemptIdRef.current)
    }
  }

  const handleReset = () => {
    if (!parsed || !question) return
    const initial = parsed.starterCode || parsed.solution || ''
    setCode(initial)
    localStorage.setItem(`lc_code_${parsed.questionNumber}`, initial)
    trackingService.saveDraft(question.id, initial, 'javascript', activeAttemptIdRef.current)
    setRunResult(null)
    setDraftStatus('saved')
  }

  const handleLoadSolution = () => {
    if (!parsed || !question) return
    setCode(parsed.solution)
    localStorage.setItem(`lc_code_${parsed.questionNumber}`, parsed.solution)
    trackingService.saveDraft(question.id, parsed.solution, 'javascript', activeAttemptIdRef.current)
    setDraftStatus('saved')
    setLeftTab('description')
  }

  const handleCopySolution = () => {
    if (!parsed?.solution) return
    navigator.clipboard.writeText(parsed.solution)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const testCases: TestCaseItem[] = useMemo(() => {
    if (parsed?.parsedTestCases && parsed.parsedTestCases.length > 0) {
      return parsed.parsedTestCases
    }
    return [
      {
        id: 1,
        input: parsed?.examples[0]?.input || 'No input specified',
        expected: parsed?.examples[0]?.output,
      },
    ]
  }, [parsed])

  // Helper to construct execution harness for a test case
  const buildTestHarness = (userCode: string, testCase: TestCaseItem): string => {
    const fnMatch = userCode.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) || userCode.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*\(/)
    const fnName = fnMatch ? fnMatch[1] : null

    let execPayload = userCode
    if (fnName) {
      let callArgs = ''
      const rawInput = testCase.input || ''
      const assignments = rawInput.split(/,\s*(?=[a-zA-Z0-9_]+\s*=)/)
      if (assignments.length > 0 && assignments[0].includes('=')) {
        const vals = assignments.map(a => {
          const eqIdx = a.indexOf('=')
          return eqIdx > -1 ? a.slice(eqIdx + 1).trim() : a.trim()
        })
        callArgs = vals.join(', ')
      } else {
        callArgs = rawInput
      }

      execPayload += `\n\ntry {\n  const __res = ${fnName}(${callArgs});\n  console.log('__RESULT__:' + JSON.stringify(__res));\n} catch(e) {\n  console.error(e);\n}`
    }
    return execPayload
  }

  // 1. RUN CODE: Execute against current testcase (recorded in code_executions, NOT submission)
  const executeRunCode = async () => {
    if (!parsed || !question || !code.trim()) return
    setRunning(true)
    setConsoleTab('testresult')
    const activeCase = testCases[selectedCaseIdx] || testCases[0]
    const startTime = performance.now()
    const capturedLogs: string[] = []

    try {
      const execPayload = buildTestHarness(code, activeCase)
      runnerRef.current.stop()
      const runner = new JsRunner()
      runnerRef.current = runner

      let actualResultStr: string | undefined
      let hadError = false
      let errorMessage = ''

      const outputPromise = new Promise<{ ms: number }>((resolve) => {
        const timeout = setTimeout(() => {
          resolve({ ms: Math.round(performance.now() - startTime) })
        }, 3000)

        runner.run(
          { 'main.js': execPayload },
          'main.js',
          {
            onLog: (lvl: LogLevel, parts: string[]) => {
              const text = parts.join(' ')
              if (text.startsWith('__RESULT__:')) {
                actualResultStr = text.replace('__RESULT__:', '')
              } else {
                capturedLogs.push(text)
                if (lvl === 'error') {
                  hadError = true
                  errorMessage = text
                }
              }
            },
            onFiles: () => {},
            onDone: (ms: number) => {
              clearTimeout(timeout)
              resolve({ ms })
            },
            onError: (msg: string, stack?: string) => {
              hadError = true
              errorMessage = stack || msg
              clearTimeout(timeout)
              resolve({ ms: Math.round(performance.now() - startTime) })
            },
          }
        )
      })

      const { ms } = await outputPromise
      const elapsed = ms || Math.round(performance.now() - startTime)

      // Record Code Execution
      void trackingService.recordCodeExecution({
        questionId: question.id,
        attemptId: activeAttemptId,
        language: 'javascript',
        executionStatus: hadError ? 'runtime_error' : 'success',
        executionTime: elapsed,
        errorMessage: hadError ? errorMessage : undefined,
      })

      if (hadError) {
        setRunResult({
          status: 'Runtime Error',
          runtime: elapsed,
          logs: capturedLogs,
          error: errorMessage,
        })
      } else {
        const expectedClean = (activeCase.expected || '').trim()
        const isMatch = expectedClean && actualResultStr
          ? actualResultStr.replace(/\s+/g, '') === expectedClean.replace(/\s+/g, '')
          : true

        setRunResult({
          status: isMatch ? 'Accepted' : 'Wrong Answer',
          runtime: elapsed,
          output: actualResultStr ?? (capturedLogs[capturedLogs.length - 1] || 'Code executed successfully'),
          expected: activeCase.expected,
          logs: capturedLogs,
        })
      }
    } catch (err: unknown) {
      setRunResult({
        status: 'Runtime Error',
        runtime: Math.round(performance.now() - startTime),
        logs: capturedLogs,
        error: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setRunning(false)
    }
  }

  // 2. SUBMIT: Evaluates against ALL test cases, creates submission, updates progress & attempt
  const handleSubmitSolution = async () => {
    if (!parsed || !question || !code.trim() || submitting) return
    setSubmitting(true)
    setConsoleTab('testresult')
    const startTime = performance.now()

    let passedCases = 0
    let hadRuntimeError = false
    let lastErrorMsg = ''
    let lastOutput = ''
    const capturedLogs: string[] = []

    try {
      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i]
        const execPayload = buildTestHarness(code, tc)
        const runner = new JsRunner()

        let caseActual: string | undefined
        let caseError = false

        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 2500)
          runner.run(
            { 'main.js': execPayload },
            'main.js',
            {
              onLog: (lvl: LogLevel, parts: string[]) => {
                const text = parts.join(' ')
                if (text.startsWith('__RESULT__:')) {
                  caseActual = text.replace('__RESULT__:', '')
                } else {
                  capturedLogs.push(`[Case ${i + 1}] ${text}`)
                  if (lvl === 'error') {
                    caseError = true
                    lastErrorMsg = text
                  }
                }
              },
              onFiles: () => {},
              onDone: () => {
                clearTimeout(timeout)
                resolve()
              },
              onError: (msg: string) => {
                caseError = true
                lastErrorMsg = msg
                clearTimeout(timeout)
                resolve()
              },
            }
          )
        })

        if (caseError) {
          hadRuntimeError = true
          break
        }

        const expClean = (tc.expected || '').trim()
        const isMatch = expClean && caseActual
          ? caseActual.replace(/\s+/g, '') === expClean.replace(/\s+/g, '')
          : Boolean(caseActual)

        if (isMatch) {
          passedCases++
        }
        if (caseActual) lastOutput = caseActual
      }

      const totalElapsed = Math.round(performance.now() - startTime)
      const isAllPassed = !hadRuntimeError && passedCases === testCases.length
      const submissionStatus = hadRuntimeError
        ? 'runtime_error'
        : isAllPassed
          ? 'accepted'
          : 'wrong_answer'
      const score = Math.round((passedCases / testCases.length) * 100)

      // Set Run Result in UI
      setRunResult({
        status: isAllPassed ? 'Accepted' : hadRuntimeError ? 'Runtime Error' : 'Wrong Answer',
        runtime: totalElapsed,
        output: lastOutput || (isAllPassed ? 'All test cases passed' : `${passedCases}/${testCases.length} passed`),
        expected: testCases[0]?.expected,
        logs: capturedLogs,
        error: hadRuntimeError ? lastErrorMsg : undefined,
        totalCases: testCases.length,
        passedCases,
      })

      // Record Submission to Supabase & Local Mirror
      const subRecord = await trackingService.recordSubmission({
        questionId: question.id,
        attemptId: activeAttemptId,
        code,
        language: 'javascript',
        status: submissionStatus,
        score,
        executionTime: totalElapsed,
      })

      // If accepted: mark solved in context and update progress status
      if (isAllPassed) {
        markSolved(question.id)
        setQuestionProgress(prev => ({
          userId: prev?.userId || 'current',
          questionId: String(question.id),
          status: 'completed',
          bestScore: 100,
          attemptCount: (prev?.attemptCount || 0) + 1,
          timeSpent: (prev?.timeSpent || 0) + Math.round(totalElapsed / 1000),
          firstAttemptAt: prev?.firstAttemptAt || new Date().toISOString(),
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }))
      } else {
        setQuestionProgress(prev => ({
          userId: prev?.userId || 'current',
          questionId: String(question.id),
          status: prev?.status === 'completed' ? 'completed' : 'in_progress',
          bestScore: Math.max(prev?.bestScore || 0, score),
          attemptCount: (prev?.attemptCount || 0) + 1,
          timeSpent: (prev?.timeSpent || 0) + Math.round(totalElapsed / 1000),
          firstAttemptAt: prev?.firstAttemptAt || new Date().toISOString(),
          completedAt: prev?.completedAt,
          updatedAt: new Date().toISOString(),
        }))
      }

      // Prepend to submissions list
      setSubmissionsList(prev => [subRecord, ...prev])
    } catch (err) {
      console.error('Submission execution failure:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="leetcode-ide-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#eff2f680' }}>Loading LeetCode Workspace...</p>
      </div>
    )
  }

  if (!question || !parsed) {
    return (
      <div className="leetcode-ide-wrapper" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: '#eff2f6' }}>Problem not found</h2>
        <Link to="/questions" className="lc-btn-run" style={{ marginTop: 12 }}>
          Back to Question Bank
        </Link>
      </div>
    )
  }

  // Derive current question lifecycle status
  const isCompleted = questionProgress?.status === 'completed' || solved
  const isInProgress = !isCompleted && (questionProgress?.status === 'in_progress' || (questionProgress?.attemptCount || 0) > 0)
  const attemptCount = questionProgress?.attemptCount || (isInProgress || isCompleted ? 1 : 0)
  const bestScore = questionProgress?.bestScore || (isCompleted ? 100 : 0)
  const timeSpentSecs = questionProgress?.timeSpent || 0

  return (
    <div className="leetcode-ide-wrapper">
      {/* 1. TOP NAVBAR */}
      <header className="lc-navbar">
        <div className="lc-nav-left">
          <Link to="/questions" className="lc-nav-back-btn" title="Back to Questions List">
            ← Problem List
          </Link>
          <div className="lc-nav-switchers">
            <button
              type="button"
              className="lc-nav-icon-btn"
              disabled={!prevQuestion}
              onClick={() => prevQuestion && navigate(`/coding/${prevQuestion.id}`)}
              title={prevQuestion ? `Prev: #${prevQuestion.id}` : 'No previous problem'}
            >
              ◀
            </button>
            <button
              type="button"
              className="lc-nav-icon-btn"
              disabled={!nextQuestion}
              onClick={() => nextQuestion && navigate(`/coding/${nextQuestion.id}`)}
              title={nextQuestion ? `Next: #${nextQuestion.id}` : 'No next problem'}
            >
              ▶
            </button>
          </div>
          <div className="lc-nav-title-group">
            <h1 className="lc-nav-problem-title">
              {parsed.questionNumber}. {parsed.title}
            </h1>
            <span className={`lc-diff-badge ${parsed.difficulty.toLowerCase()}`}>
              {parsed.difficulty}
            </span>

            {/* Lifecycle Status Pill */}
            {isCompleted ? (
              <span className="lc-status-badge completed" title="Question Solved & Verified">
                ✓ Completed
              </span>
            ) : isInProgress ? (
              <span className="lc-status-badge in-progress" title="Question Attempt In Progress">
                ◐ In Progress
              </span>
            ) : (
              <span className="lc-status-badge not-started" title="Question Not Yet Attempted">
                ○ Not Started
              </span>
            )}
          </div>
        </div>

        <div className="lc-nav-right">
          {/* Telemetry metadata chips */}
          <div className="lc-telemetry-row">
            <span className="lc-telemetry-chip" title="Total submission attempts">
              Attempts: <strong>{attemptCount}</strong>
            </span>
            {bestScore > 0 && (
              <span className="lc-telemetry-chip" title="Best score achieved">
                Best: <strong>{bestScore}%</strong>
              </span>
            )}
            {timeSpentSecs > 0 && (
              <span className="lc-telemetry-chip" title="Total time recorded">
                ⏱ {formatDuration(timeSpentSecs)}
              </span>
            )}
          </div>

          {/* Run Code Button (separate from submit) */}
          <button
            type="button"
            className="lc-btn-run"
            onClick={executeRunCode}
            disabled={running || submitting}
            title="Run Code on selected testcase (Ctrl + Enter)"
          >
            <span>▶</span> {running ? 'Running...' : 'Run Code'}
          </button>

          {/* Submit Button (evaluates full suite, records submission) */}
          <button
            type="button"
            className="lc-btn-submit"
            onClick={handleSubmitSolution}
            disabled={running || submitting}
            title="Submit solution for official evaluation"
          >
            <span>✓</span> {submitting ? 'Evaluating...' : 'Submit'}
          </button>

          <button
            type="button"
            className="lc-nav-icon-btn"
            onClick={() => toggleSolved(question.id)}
            title={solved ? 'Mark as Unsolved' : 'Mark as Solved'}
            style={{ color: solved ? '#2cbb5d' : 'inherit', fontSize: '1rem' }}
          >
            {solved ? '✓ Solved' : '○ Mark Solved'}
          </button>

          <button
            type="button"
            className="lc-nav-icon-btn"
            onClick={() => toggleBookmark(question.id)}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark Problem'}
            style={{ color: bookmarked ? '#ffc01e' : 'inherit', fontSize: '1.1rem' }}
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>
      </header>

      {/* 2. SPLIT WORKSPACE BODY */}
      <div className="lc-workspace-body">
        {/* LEFT PANE: DESCRIPTION & EDITORIAL & SUBMISSIONS */}
        <section className="lc-left-pane" style={{ width: '45%' }}>
          <div className="lc-pane-tabs-bar">
            <button
              type="button"
              className={`lc-tab-btn ${leftTab === 'description' ? 'active' : ''}`}
              onClick={() => setLeftTab('description')}
            >
              <span>📋</span> Description
            </button>
            <button
              type="button"
              className={`lc-tab-btn ${leftTab === 'editorial' ? 'active' : ''}`}
              onClick={() => setLeftTab('editorial')}
            >
              <span>📖</span> Editorial
            </button>
            <button
              type="button"
              className={`lc-tab-btn ${leftTab === 'submissions' ? 'active' : ''}`}
              onClick={() => {
                setLeftTab('submissions')
                void loadSubmissions(question.id)
              }}
            >
              <span>🕒</span> Submissions ({submissionsList.length})
            </button>
          </div>

          <div className="lc-left-content">
            {leftTab === 'description' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 12px' }}>
                  {parsed.questionNumber}. {parsed.title}
                </h2>

                <div className="lc-description-markdown">
                  {(parsed.problemText || '').split(/\n{2,}/).map((p: string, i: number) => (
                    <p key={i} style={{ margin: '0 0 12px', lineHeight: 1.65 }}>
                      {renderFormattedMarkdown(p)}
                    </p>
                  ))}
                </div>

                {parsed.examples.map((ex, idx) => (
                  <div key={idx} className="lc-example-card">
                    <div className="lc-example-title">Example {idx + 1}:</div>
                    {ex.input && (
                      <div className="lc-example-row">
                        <strong>Input:</strong>
                        <span className="lc-example-code">{ex.input}</span>
                      </div>
                    )}
                    {ex.output && (
                      <div className="lc-example-row">
                        <strong>Output:</strong>
                        <span className="lc-example-code">{ex.output}</span>
                      </div>
                    )}
                    {ex.explanation && (
                      <div className="lc-example-row" style={{ marginTop: 6 }}>
                        <strong>Explanation:</strong>
                        <span style={{ color: '#eff2f6aa' }}>{ex.explanation}</span>
                      </div>
                    )}
                    {!ex.input && !ex.output && ex.raw && (
                      <div className="lc-example-code">{ex.raw}</div>
                    )}
                  </div>
                ))}

                {parsed.constraints.length > 0 && (
                  <div className="lc-constraints-block">
                    <h4>Constraints:</h4>
                    <ul>
                      {parsed.constraints.map((c, idx) => (
                        <li key={idx}>
                          <code className="lc-inline-code">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {leftTab === 'editorial' && (
              <div className="lc-editorial-section">
                <div>
                  <h3 style={{ fontSize: '1.15rem', margin: '0 0 10px' }}>Approach &amp; Explanation</h3>
                  <div style={{ color: '#eff2f6dd', lineHeight: 1.7 }}>
                    {parsed.explanation.split(/\n{2,}/).map((p, i) => (
                      <p key={i} style={{ margin: '0 0 12px' }}>
                        {renderFormattedMarkdown(p)}
                      </p>
                    ))}
                  </div>
                </div>

                {(parsed.timeComplexity || parsed.spaceComplexity) && (
                  <div>
                    <h3 style={{ fontSize: '1.15rem', margin: '0 0 10px' }}>Complexity Analysis</h3>
                    <div className="lc-complexity-box">
                      {parsed.timeComplexity && (
                        <div className="lc-complexity-pill">
                          <span className="lc-complexity-label">Time Complexity</span>
                          <span className="lc-complexity-value">{parsed.timeComplexity}</span>
                        </div>
                      )}
                      {parsed.spaceComplexity && (
                        <div className="lc-complexity-pill">
                          <span className="lc-complexity-label">Space Complexity</span>
                          <span className="lc-complexity-value">{parsed.spaceComplexity}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {parsed.solution && (
                  <div>
                    <div className="lc-solution-header">
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#eff2f6' }}>
                        Reference Implementation
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button type="button" className="lc-copy-btn" onClick={handleCopySolution}>
                          {copied ? '✓ Copied' : 'Copy'}
                        </button>
                        <button type="button" className="lc-copy-btn" onClick={handleLoadSolution}>
                          Load into Editor
                        </button>
                      </div>
                    </div>
                    <div className="lc-solution-code-block">
                      <pre className="lc-solution-pre">
                        <code>{parsed.solution}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {leftTab === 'submissions' && (
              <div className="lc-submissions-container">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#eff2f6' }}>Submission History</h3>
                  <button
                    type="button"
                    className="lc-btn-editor-action"
                    onClick={() => loadSubmissions(question.id)}
                    disabled={loadingSubmissions}
                  >
                    {loadingSubmissions ? 'Refreshing...' : '↻ Refresh'}
                  </button>
                </div>

                {submissionsList.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px 20px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>⚡</div>
                    <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#eff2f6' }}>No Submissions Yet</p>
                    <p style={{ margin: 0, fontSize: '0.85rem' }}>
                      Click <strong>Submit</strong> to evaluate your solution against test suites and log submission history.
                    </p>
                  </div>
                ) : (
                  <table className="lc-submissions-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Runtime</th>
                        <th>Score</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionsList.map((sub, idx) => (
                        <tr key={sub.id || idx}>
                          <td>
                            <span className={`lc-sub-badge ${sub.status}`}>
                              {sub.status === 'accepted' ? '✓ Accepted' : sub.status === 'runtime_error' ? '⚡ Error' : '✗ Wrong'}
                            </span>
                          </td>
                          <td>{sub.executionTime} ms</td>
                          <td>{sub.score}%</td>
                          <td style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                            {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                            {new Date(sub.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="lc-btn-view-code"
                              onClick={() => setInspectingSub(sub)}
                            >
                              Code
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT PANE: MONACO EDITOR + TESTCASES */}
        <section className="lc-right-pane">
          {/* Editor Header Toolbar */}
          <div className="lc-editor-toolbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="lc-lang-select">JavaScript</span>
              <span className={`lc-draft-indicator ${draftStatus === 'saving' ? 'saving' : ''}`}>
                {draftStatus === 'saving' ? '○ Saving draft...' : draftStatus === 'saved' ? '● Draft saved' : ''}
              </span>
            </div>
            <div className="lc-editor-actions">
              <button
                type="button"
                className="lc-btn-editor-action"
                onClick={handleReset}
                title="Reset code to starter template"
              >
                ↺ Reset
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="lc-monaco-container">
            <Editor
              height="100%"
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              language="javascript"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 13.5,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Bottom Console / Testcases Panel */}
          <div className="lc-bottom-console">
            <div className="lc-console-tabs-bar">
              <div className="lc-console-tab-group">
                <button
                  type="button"
                  className={`lc-console-tab-btn ${consoleTab === 'testcase' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('testcase')}
                >
                  <span>✓</span> Testcase
                </button>
                <button
                  type="button"
                  className={`lc-console-tab-btn ${consoleTab === 'testresult' ? 'active' : ''}`}
                  onClick={() => setConsoleTab('testresult')}
                >
                  <span>📊</span> Test Result
                </button>
              </div>
            </div>

            <div className="lc-console-body">
              {consoleTab === 'testcase' && (
                <div>
                  <div className="lc-testcase-chips">
                    {testCases.map((tc, idx) => (
                      <button
                        key={tc.id}
                        type="button"
                        className={`lc-chip-case ${selectedCaseIdx === idx ? 'active' : ''}`}
                        onClick={() => setSelectedCaseIdx(idx)}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div className="lc-case-input-label">Input Parameters</div>
                    <div className="lc-case-input-box">
                      {testCases[selectedCaseIdx]?.input || 'No input defined'}
                    </div>
                  </div>
                </div>
              )}

              {consoleTab === 'testresult' && (
                <div>
                  {!runResult && !running && !submitting && (
                    <div style={{ color: '#eff2f680', padding: '10px 0' }}>
                      Click <strong>▶ Run Code</strong> for instant test checks, or <strong>✓ Submit</strong> to evaluate all test cases.
                    </div>
                  )}

                  {(running || submitting) && (
                    <div style={{ color: '#eff2f699', padding: '10px 0' }}>
                      {submitting ? 'Evaluating solution against all test cases...' : 'Executing code in sandbox...'}
                    </div>
                  )}

                  {runResult && !running && !submitting && (
                    <div>
                      <div className="lc-status-row">
                        <span
                          className={`lc-status-pill ${
                            runResult.status === 'Accepted' ? 'accepted' : 'wrong'
                          }`}
                        >
                          {runResult.status === 'Accepted' ? '✓ Accepted' : `✗ ${runResult.status}`}
                        </span>
                        <span className="lc-runtime-pill">
                          Runtime: {runResult.runtime} ms
                        </span>
                        {runResult.totalCases && (
                          <span className="lc-runtime-pill" style={{ color: '#38bdf8' }}>
                            Cases Passed: {runResult.passedCases}/{runResult.totalCases}
                          </span>
                        )}
                      </div>

                      <div className="lc-diff-comparison">
                        {runResult.output && (
                          <div className="lc-diff-block">
                            <div className="lc-case-input-label">Output</div>
                            <div className="lc-case-input-box" style={{ color: '#00b8a3' }}>
                              {runResult.output}
                            </div>
                          </div>
                        )}

                        {runResult.expected && (
                          <div className="lc-diff-block">
                            <div className="lc-case-input-label">Expected</div>
                            <div className="lc-case-input-box">
                              {runResult.expected}
                            </div>
                          </div>
                        )}

                        {runResult.error && (
                          <div className="lc-diff-block">
                            <div className="lc-case-input-label" style={{ color: '#ef4743' }}>Error Output</div>
                            <div className="lc-case-input-box" style={{ color: '#ef4743' }}>
                              {runResult.error}
                            </div>
                          </div>
                        )}

                        {runResult.logs.length > 0 && (
                          <div className="lc-diff-block">
                            <div className="lc-case-input-label">Stdout / Logs</div>
                            <pre className="lc-case-input-box" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                              {runResult.logs.join('\n')}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Historical Submission Code Modal */}
      {inspectingSub && (
        <div className="lc-modal-overlay" onClick={() => setInspectingSub(null)}>
          <div className="lc-modal-content" onClick={e => e.stopPropagation()}>
            <div className="lc-modal-header">
              <div>
                <h3 className="lc-modal-title">
                  Submission Code ({inspectingSub.status === 'accepted' ? 'Accepted' : inspectingSub.status})
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Submitted on {new Date(inspectingSub.createdAt).toLocaleString()} • Runtime: {inspectingSub.executionTime}ms • Score: {inspectingSub.score}%
                </span>
              </div>
              <button
                type="button"
                className="lc-modal-close"
                onClick={() => setInspectingSub(null)}
              >
                ✕
              </button>
            </div>
            <pre className="lc-modal-body">
              {inspectingSub.code || inspectingSub.answer || '// No code recorded for this submission'}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
