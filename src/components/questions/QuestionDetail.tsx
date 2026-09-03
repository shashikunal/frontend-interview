import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { getById } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import { buildJsSrcDoc, buildReactSrcDoc, buildHtmlSrcDoc, isReactCode, isHtmlWorkspace } from '../../lib/runner'
import SplitPane from '../common/SplitPane'
import BrowserPreview from '../common/BrowserPreview'
import './QuestionDetail.css'

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isSolved, toggleSolved } = useProgress()
  const { questions: allQuestions, loading } = useQuestions()
  const question = useMemo(() => getById(allQuestions, Number(id)), [allQuestions, id])
  const bookmarked = question ? isBookmarked(question.id) : false
  const solved = question ? isSolved(question.id) : false
  const [showAnswer, setShowAnswer] = useState(true)

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
    setCode(question?.code || '')
    setOutput([])
    setPreviewDoc('')
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)
  }, [question?.code])

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

    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== currentRunId) return
      if (m.t === 'log') {
        setHasLog(true)
        setOutput(prev => [...prev, (m.parts ?? []).join(' ')])
      } else if (m.t === 'dom') {
        setHasDom(m.hasDom ?? false)
      } else if (m.t === 'error') {
        setOutput(prev => [...prev, m.stack || m.message])
        setRunning(false)
        setExecTime(Math.round(performance.now() - startTime))
      } else if (m.t === 'done') {
        setRunning(false)
        setExecTime(m.ms ?? Math.round(performance.now() - startTime))
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      runCode()
    }
  }

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
  const isCoding = !!question.code

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
        <div className="detail-header">
          <div className="detail-header-top">
            <h2>{question.question}</h2>
            <div className="detail-header-actions">
              <button
                type="button"
                className={`detail-solved-btn ${solved ? 'solved' : ''}`}
                onClick={() => toggleSolved(question.id)}
                aria-label={solved ? 'Mark as uncompleted' : 'Mark as solved'}
                title={solved ? 'Mark as uncompleted' : 'Mark as solved'}
              >
                <span className="check-icon">{solved ? '✓' : '○'}</span>
                <span>{solved ? 'Solved' : 'Mark Solved'}</span>
              </button>
              <button
                type="button"
                className={`detail-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
                onClick={() => toggleBookmark(question.id)}
                aria-label={bookmarked ? 'Remove from saved questions' : 'Save question for revision'}
                title={bookmarked ? 'Remove from saved questions' : 'Save question for revision'}
              >
                <span className="star-icon">★</span>
                <span>{bookmarked ? 'Saved' : 'Save'}</span>
              </button>
              <span className="question-id-tag">#{question.id}</span>
            </div>

          </div>
          <div className="detail-meta">
            <span className={`badge badge-category cat-${question.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
              {question.category}
            </span>
            <span className={`badge badge-${question.difficulty.toLowerCase()}`}>
              {question.difficulty}
            </span>
            {question.source && (
              <span className="badge badge-source">
                {question.source}
              </span>
            )}
          </div>
        </div>


        <div className="detail-body">
          <div className="section-toolbar">
            <button
              className={`toggle-answer-btn ${showAnswer ? 'active' : ''}`}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              {showAnswer ? 'Hide Explanation & Solution' : 'Show Explanation & Solution'}
            </button>
          </div>

          {showAnswer && (
            <div className="answer-section">
              <div className="answer-header">
                <span className="answer-label">Explanation & Approach</span>
              </div>
              <div className="answer-content">
                {question.answer.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
          )}

          {showAnswer && !isCoding && question.example && (
            <div className="code-section">
              <div className="code-section-header">
                <h3>Example Code</h3>
              </div>
              <div className="code-window">
                <div className="code-window-bar">
                  <div className="window-dots">
                    <span className="code-dot dot-red" />
                    <span className="code-dot dot-yellow" />
                    <span className="code-dot dot-green" />
                  </div>
                  <span className="window-filename">example.js</span>
                </div>
                <textarea
                  className="code-editor code-editor-readonly"
                  value={question.example}
                  readOnly
                  spellCheck={false}
                />
              </div>
            </div>
          )}

          {isCoding && (
            <div className="code-section">
              <div className="code-section-header">
                <h3>Interactive Playground</h3>
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
                            onClick={() => { setCode(question?.code || ''); setOutput([]); setExecTime(null); }}
                            title="Reset code to original"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="code-editor"
                        value={code || question.code || ''}
                        onChange={e => setCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        placeholder="Type or edit your JavaScript / React code here..."
                      />
                    </div>

                    <div className="code-actions-bar">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setCode(question?.code || ''); setOutput([]); setExecTime(null); }}
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
    </div>
  )
}
