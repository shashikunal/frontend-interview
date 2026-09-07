import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { useTheme } from '../../context/ThemeContext'
import { getById } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import { buildJsSrcDoc, buildReactSrcDoc, buildHtmlSrcDoc, isReactCode, isHtmlWorkspace } from '../../lib/runner'
import SplitPane from '../common/SplitPane'
import BrowserPreview from '../common/BrowserPreview'
import StructuredQuestionRenderer from './templates/StructuredQuestionRenderer'
import { trackingService } from '../../lib/trackingService'
import './QuestionDetail.css'

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>()
  const { resolvedTheme } = useTheme()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isSolved, toggleSolved } = useProgress()
  const { questions: allQuestions, loading } = useQuestions()
  const question = useMemo(() => getById(allQuestions, Number(id)), [allQuestions, id])
  const bookmarked = question ? isBookmarked(question.id) : false
  const solved = question ? isSolved(question.id) : false

  const [code, setCode] = useState('')
  const [output, setOutput] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState('')
  const [hasDom, setHasDom] = useState<boolean | null>(null)
  const [hasLog, setHasLog] = useState(false)
  const [running, setRunning] = useState(false)
  const [execTime, setExecTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const runIdRef = useRef(0)
  const handlersRef = useRef<(e: MessageEvent) => void>(() => {})


  useEffect(() => {
    const listener = (e: MessageEvent) => handlersRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  useEffect(() => {
    const starter = question?.code || question?.example || `// Machine Code Sandbox: ${question?.question || ''}\n// Test your implementation below:\n\nconsole.log("Interactive machine code playground ready.");\n`
    setCode(starter)
    setOutput([])
    setPreviewDoc('')
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)

    if (question?.id) {
      trackingService.trackActivity('question_viewed', 'question', question.id, {
        title: question.question || (question as any).title || `Question #${question.id}`,
        category: question.category,
      })
    }
  }, [question?.code, question?.example, question?.question, question?.id, question?.category])

  const runCode = async () => {
    const source = code || question?.code || ''
    if (!source.trim()) return
    const currentRunId = ++runIdRef.current
    const startTime = performance.now()
    setRunning(true)
    setOutput([])
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)

    const attemptPromise = question?.id ? trackingService.startQuestionAttempt(question.id) : null
    if (question?.id) {
      trackingService.trackActivity('code_run', 'question', question.id, {
        language: isReactCode(source) ? 'react' : 'javascript',
      })
    }

    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== currentRunId) return
      if (m.t === 'log') {
        setHasLog(true)
        setOutput(prev => [...prev, (m.parts ?? []).join(' ')])
      } else if (m.t === 'dom') {
        setHasDom(m.hasDom ?? false)
      } else if (m.t === 'error') {
        const duration = Math.round(performance.now() - startTime)
        setOutput(prev => [...prev, m.stack || m.message])
        setRunning(false)
        setExecTime(duration)
        if (question?.id && attemptPromise) {
          attemptPromise.then(attId => {
            void trackingService.recordCodeExecution({
              questionId: question.id,
              attemptId: attId,
              language: isReactCode(source) ? 'react' : 'javascript',
              executionStatus: 'runtime_error',
              executionTime: duration,
              errorMessage: m.stack || m.message,
            })
          }).catch(() => {})
        }
      } else if (m.t === 'done') {
        const duration = m.ms ?? Math.round(performance.now() - startTime)
        setRunning(false)
        setExecTime(duration)
        if (question?.id && attemptPromise) {
          attemptPromise.then(attId => {
            void trackingService.recordCodeExecution({
              questionId: question.id,
              attemptId: attId,
              language: isReactCode(source) ? 'react' : 'javascript',
              executionStatus: 'success',
              executionTime: duration,
            })
          }).catch(() => {})
        }
      }
    }

    try {
      if (question && isHtmlWorkspace(question)) {
        setPreviewDoc(buildHtmlSrcDoc(question.example ?? '', source, currentRunId))
      } else if (isReactCode(source)) {
        const doc = await buildReactSrcDoc({ 'App.jsx': source }, 'App.jsx', currentRunId)
        setPreviewDoc(doc)
      } else {
        setPreviewDoc(buildJsSrcDoc(source, currentRunId))
      }
    } catch (err) {
      setOutput(prev => [...prev, err instanceof Error ? err.message : String(err)])
      setRunning(false)
      setExecTime(Math.round(performance.now() - startTime))
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runCode()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [code, question])

  const handleCopyCode = () => {
    const textToCopy = code || question?.code || ''
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="question-detail page-enter">
        <div className="not-found"><p>Loading question...</p></div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="question-detail page-enter">
        <div className="not-found">
          <h2>Question not found</h2>
          <Link to="/questions" className="btn btn-primary">Back to Questions</Link>
        </div>
      </div>
    )
  }

  const currentIndex = allQuestions.findIndex(q => q.id === question.id)
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null
  const nextQuestion = currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null
  const isCoding = true

  return (
    <div className="question-detail page-enter">
      <div className="detail-nav">
        <div className="nav-group-left">
          <Link to="/questions" className="nav-back">
            <span className="nav-icon">←</span> Back to Questions
          </Link>
          <span className="nav-divider">/</span>
          <span className="nav-category-crumb">{question.category}</span>
        </div>
        <div className="nav-group-right">
          {prevQuestion && (
            <Link to={`/questions/${prevQuestion.id}`} className="nav-arrow" title={`Previous: ${prevQuestion.question}`}>
              ← Prev
            </Link>
          )}
          <Link
            to={`/coding/${question.id}`}
            className="nav-detail"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(168, 85, 247, 0.18))',
              borderColor: '#818cf8',
              color: 'var(--text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚡</span> Machine Code IDE ↗
          </Link>
          <Link to={`/questions/${question.id}/detail`} className="nav-detail">
            Detailed Workspace ↗
          </Link>
          {nextQuestion && (
            <Link to={`/questions/${nextQuestion.id}`} className="nav-arrow" title={`Next: ${nextQuestion.question}`}>
              Next →
            </Link>
          )}
        </div>
      </div>

      <div className="detail-card" key={question.id}>
        <StructuredQuestionRenderer
          question={question}
          showSolutionAccordion={true}
          headerActions={
            <>
              <button
                type="button"
                className={`detail-solved-btn ${solved ? 'solved' : ''}`}
                onClick={() => {
                  toggleSolved(question.id)
                  if (!solved) {
                    trackingService.completeQuestionAttempt(question.id, 100)
                  }
                }}
                aria-label={solved ? 'Mark as uncompleted' : 'Mark as solved'}
                title={solved ? 'Mark as uncompleted' : 'Mark as solved'}
              >
                <span className="check-icon">{solved ? '✓' : '○'}</span>
                <span>{solved ? 'Solved' : 'Mark Solved'}</span>
              </button>
              <button
                type="button"
                className={`detail-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
                onClick={() => {
                  toggleBookmark(question.id)
                  trackingService.trackActivity(
                    bookmarked ? 'question_unbookmarked' : 'question_bookmarked',
                    'question',
                    question.id,
                    { title: question.question || (question as any).title }
                  )
                }}
                aria-label={bookmarked ? 'Remove from saved questions' : 'Save question for revision'}
                title={bookmarked ? 'Remove from saved questions' : 'Save question for revision'}
              >
                <span className="star-icon">★</span>
                <span>{bookmarked ? 'Saved' : 'Save'}</span>
              </button>
              <span className="question-id-tag">#{question.id}</span>
            </>
          }
        />

          {isCoding && (
            <div className="code-section">
              <div className="code-section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3>Interactive Machine Code Playground</h3>
                  <span className="badge badge-machine-code">⚡ Monaco Editor</span>
                </div>
                <span className="keyboard-hint">Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to execute</span>
              </div>

              <SplitPane
                className="code-split"
                left={
                  <div className="code-pane code-pane-left">
                    <div className="code-window">
                      <div className="code-window-bar">
                        <div className="window-dots">
                          <span className="code-dot dot-red" />
                          <span className="code-dot dot-yellow" />
                          <span className="code-dot dot-green" />
                        </div>
                        <span className="window-filename">
                          {isReactCode(code || question.code || '') ? 'App.jsx' : 'solution.js'}
                        </span>
                        <div className="window-actions">
                          <button
                            className="window-btn"
                            onClick={handleCopyCode}
                            title="Copy code to clipboard"
                          >
                            {copied ? '✓ Copied' : 'Copy'}
                          </button>
                          <button
                            className="window-btn"
                            onClick={() => { setCode(question?.code || question?.example || ''); setOutput([]); setExecTime(null); }}
                            title="Reset code to original"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                      <div style={{ height: '340px' }}>
                        <Editor
                          height="100%"
                          theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
                          language={isReactCode(code || question.code || '') ? 'javascript' : 'javascript'}
                          value={code || question.code || ''}
                          onChange={val => setCode(val ?? '')}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            tabSize: 2,
                          }}
                        />
                      </div>
                    </div>

                    <div className="code-actions-bar">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setCode(question?.code || question?.example || ''); setOutput([]); setExecTime(null); }}
                      >
                        Reset Code
                      </button>
                      <button
                        className="btn btn-success btn-sm run-btn"
                        onClick={runCode}
                        disabled={running}
                      >
                        {running ? (
                          <>
                            <span className="spinner-dot" /> Running...
                          </>
                        ) : (
                          <>▶ Execute Code</>
                        )}
                      </button>
                      <Link
                        to={`/coding/${question.id}`}
                        className="btn btn-secondary btn-sm"
                        style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        title="Open multi-file project workspace with terminal and test runner"
                      >
                        <span>⚡</span> Full IDE Workspace ↗
                      </Link>
                    </div>
                  </div>
                }
                right={
                  <div className="code-pane code-pane-right">
                    <div className="output-section">
                      <div className="output-header">
                        <h4>Live Preview</h4>
                      </div>
                      {hasDom === false ? (
                        <div className="code-preview-empty">
                          {hasLog ? 'No DOM elements rendered — check Console logs below.' : 'Ran successfully — no DOM output.'}
                        </div>
                      ) : previewDoc ? (
                        <BrowserPreview srcDoc={previewDoc} url={`${window.location.origin}/preview`} title="preview" />
                      ) : (
                        <div className="code-preview-empty">
                          Press <strong>Execute Code</strong> to render in the sandbox.
                        </div>
                      )}
                    </div>

                    <div className="output-section console-section">
                      <div className="output-header console-header">
                        <div className="console-title-group">
                          <span className={`status-dot ${running ? 'running' : output.length > 0 ? 'success' : ''}`} />
                          <h4>Console Output</h4>
                          {execTime !== null && (
                            <span className="exec-time-badge">{execTime}ms</span>
                          )}
                        </div>
                        {output.length > 0 && (
                          <button
                            className="console-clear-btn"
                            onClick={() => setOutput([])}
                            title="Clear console output"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <pre className="code-output">
                        {output.length > 0
                          ? output.map((line, idx) => (
                              <div key={idx} className="console-line">
                                <span className="console-line-no">{idx + 1}</span>
                                <span className="console-line-text">{line}</span>
                              </div>
                            ))
                          : <span className="console-placeholder">Console output will appear here after clicking Execute...</span>}
                      </pre>
                    </div>
                  </div>
                }
              />
            </div>
          )}
      </div>
    </div>
  )
}
