import { useState, useEffect, useMemo, useRef } from 'react'
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
import './LeetCodeIde.css'

interface RunResult {
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error'
  runtime: number
  output?: string
  expected?: string
  logs: string[]
  error?: string
}

export default function LeetCodeIde() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isSolved, toggleSolved } = useProgress()
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
  const [runResult, setRunResult] = useState<RunResult | null>(null)
  const [copied, setCopied] = useState(false)

  const runnerRef = useRef<JsRunner>(new JsRunner())

  // Initialize or reset starter code when question changes
  useEffect(() => {
    if (!parsed) return
    const key = `lc_code_${parsed.questionNumber}`
    const saved = localStorage.getItem(key)
    if (saved && saved.trim()) {
      setCode(saved)
    } else {
      setCode(parsed.starterCode || parsed.solution || '')
    }
    setRunResult(null)
    setSelectedCaseIdx(0)
  }, [parsed?.questionNumber])

  // Save code changes to localStorage
  const handleEditorChange = (val: string | undefined) => {
    const next = val ?? ''
    setCode(next)
    if (parsed) {
      localStorage.setItem(`lc_code_${parsed.questionNumber}`, next)
    }
  }

  const handleReset = () => {
    if (!parsed) return
    const initial = parsed.starterCode || parsed.solution || ''
    setCode(initial)
    localStorage.setItem(`lc_code_${parsed.questionNumber}`, initial)
    setRunResult(null)
  }

  const handleLoadSolution = () => {
    if (!parsed) return
    setCode(parsed.solution)
    if (parsed) {
      localStorage.setItem(`lc_code_${parsed.questionNumber}`, parsed.solution)
    }
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

  // Execute Code against active test case
  const executeCode = async () => {
    if (!parsed || !code.trim()) return
    setRunning(true)
    setConsoleTab('testresult')
    const activeCase = testCases[selectedCaseIdx] || testCases[0]
    const startTime = performance.now()
    const capturedLogs: string[] = []

    try {
      // Find candidate function name
      const fnMatch = code.match(/function\s+([a-zA-Z0-9_]+)\s*\(/) || code.match(/(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*\(/)
      const fnName = fnMatch ? fnMatch[1] : null

      // Build execution payload
      let execPayload = code
      if (fnName) {
        // Parse input argument values if format is `nums = [1,2], target = 3`
        let callArgs = ''
        const rawInput = activeCase.input || ''
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
          </div>
        </div>

        <div className="lc-nav-right">
          <button
            type="button"
            className="lc-btn-run"
            onClick={executeCode}
            disabled={running}
            title="Run Code (Ctrl + Enter)"
          >
            <span>▶</span> {running ? 'Running...' : 'Run Code'}
          </button>
          <button
            type="button"
            className="lc-btn-submit"
            onClick={executeCode}
            disabled={running}
            title="Submit solution"
          >
            <span>✓</span> Submit
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
        {/* LEFT PANE: DESCRIPTION & EDITORIAL */}
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
              onClick={() => setLeftTab('submissions')}
            >
              <span>🕒</span> Submissions
            </button>
          </div>

          <div className="lc-left-content">
            {leftTab === 'description' && (
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 12px' }}>
                  {parsed.questionNumber}. {parsed.title}
                </h2>

                <div className="lc-meta-strip">
                  <span className={`lc-diff-badge ${parsed.difficulty.toLowerCase()}`}>
                    {parsed.difficulty}
                  </span>
                  <span className="lc-tag-chip">{parsed.category}</span>
                  {parsed.pattern && (
                    <span className="lc-tag-chip" style={{ color: '#ffc01e', borderColor: 'rgba(255, 192, 30, 0.3)' }}>
                      ⚡ {parsed.pattern}
                    </span>
                  )}
                  <span className="lc-tag-chip">{parsed.technology}</span>
                </div>

                <div className="lc-problem-markdown">
                  {renderFormattedMarkdown(parsed.problemText)}
                </div>

                {parsed.examples.map((ex, idx) => (
                  <div key={idx} className="lc-example-box">
                    <div className="lc-example-title">{ex.title || `Example ${idx + 1}`}:</div>
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
              <div style={{ color: '#eff2f699', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>⚡</div>
                <h3 style={{ color: '#eff2f6', margin: '0 0 6px' }}>Submissions &amp; Run History</h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Your live executions and test runs are evaluated locally in the Node/V8 sandbox.
                </p>
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
                  {!runResult && !running && (
                    <div style={{ color: '#eff2f680', padding: '10px 0' }}>
                      Click <strong>▶ Run Code</strong> to execute your solution against test cases.
                    </div>
                  )}

                  {running && (
                    <div style={{ color: '#eff2f699', padding: '10px 0' }}>
                      Executing solution in sandbox...
                    </div>
                  )}

                  {runResult && (
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
    </div>
  )
}
