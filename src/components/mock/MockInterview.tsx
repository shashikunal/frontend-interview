import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuestions } from '../../data/useQuestions'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress, type FAANGPillars } from '../../context/ProgressContext'
import { buildJsSrcDoc, buildReactSrcDoc, buildHtmlSrcDoc, isReactCode, isHtmlWorkspace } from '../../lib/runner'
import type { Question } from '../../models/question'
import BrowserPreview from '../common/BrowserPreview'
import SplitPane from '../common/SplitPane'
import './MockInterview.css'

export type TrackType = 'balanced' | 'react' | 'javascript' | 'architecture'
export type SeniorityLevel = 'junior' | 'mid' | 'senior' | 'staff'
export type InterviewState = 'setup' | 'active' | 'results'

const TRACKS = [
  {
    id: 'balanced' as TrackType,
    title: 'Balanced Frontend Loop',
    desc: 'Full-stack frontend: JS core runtime, React 19, web performance, CSS layout, and DOM APIs.',
    icon: '⚡',
  },
  {
    id: 'react' as TrackType,
    title: 'React Specialist',
    desc: 'Deep React hooks, reconciliation, concurrent rendering, state machines, and memoization.',
    icon: '⚛️',
  },
  {
    id: 'javascript' as TrackType,
    title: 'JavaScript & Algorithms',
    desc: 'Event loop, async concurrency, closures, prototype chain, polyfills, and algorithms.',
    icon: '💻',
  },
  {
    id: 'architecture' as TrackType,
    title: 'System Design & Web Vitals',
    desc: 'Large-scale frontend architecture, micro-frontends, caching, state, security, and Core Web Vitals.',
    icon: '🏗️',
  },
]

const DURATIONS = [
  { minutes: 30, questionsCount: 3, label: '30 Min (Express · 3 Qs)' },
  { minutes: 45, questionsCount: 4, label: '45 Min (Standard · 4 Qs)' },
  { minutes: 60, questionsCount: 5, label: '60 Min (Full Loop · 5 Qs)' },
]

function catClass(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
}

function getHint(q: Question, level: number): { type: string; title: string; content: string } {
  if (level === 1) {
    return {
      type: 'Clarify',
      title: '1. Scoping & Constraints Clarification',
      content: `• Expected Inputs & Types: Check for null, undefined, and empty collections.\n• Mutation Policy: Do not mutate argument references directly.\n• Edge Cases: Handle zero/negative bounds, rapid invocations, and async race conditions.`,
    }
  }
  if (level === 2) {
    const hintKeywords = q.answer.slice(0, 180).replace(/`[^`]+`/g, '...').trim()
    return {
      type: 'Nudge',
      title: '2. Conceptual Nudge (Think Out Loud)',
      content: `Think about the internal mechanism: ${hintKeywords}… Consider which data structure or closure scope keeps track of state between invocations without polluting global scope.`,
    }
  }
  return {
    type: 'Blueprint',
    title: '3. Architectural Pseudocode Blueprint',
    content: `1. Initialize closure state (e.g. cache Map, timer ID, or memoized ref).\n2. Return an inner function that intercepts arguments.\n3. Validate inputs -> check cache/timer -> execute or schedule target handler -> return result.`,
  }
}

export default function MockInterview() {
  const { questions, loading, error } = useQuestions()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { recordMockInterview } = useProgress()

  const [state, setState] = useState<InterviewState>('setup')
  const [selectedTrack, setSelectedTrack] = useState<TrackType>('balanced')
  const [selectedDuration, setSelectedDuration] = useState(45)
  const [selectedLevel, setSelectedLevel] = useState<SeniorityLevel>('senior')

  // Interview active state
  const [interviewQuestions, setInterviewQuestions] = useState<Question[]>([])
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [candidateNotes, setCandidateNotes] = useState<Record<number, string>>({})
  const [candidateCode, setCandidateCode] = useState<Record<number, string>>({})
  const [showSolutions, setShowSolutions] = useState<Record<number, boolean>>({})

  // Industry-Standard: FAANG 4 Pillars Rubric
  const [fourPillars, setFourPillars] = useState<Record<number, FAANGPillars>>({})

  // Industry-Standard: Progressive Hints Tracker
  const [hintsLevel, setHintsLevel] = useState<Record<number, number>>({})

  // Playground state for coding questions
  const [output, setOutput] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState('')
  const [hasDom, setHasDom] = useState<boolean | null>(null)
  const [hasLog, setHasLog] = useState(false)
  const [running, setRunning] = useState(false)
  const [execTime, setExecTime] = useState<number | null>(null)
  const runIdRef = useRef(0)
  const handlersRef = useRef<(e: MessageEvent) => void>(() => {})

  // Unit Test Run Results
  const [testResults, setTestResults] = useState<Record<number, { passed: number; total: number; logs: string[] }>>({})

  useEffect(() => {
    const listener = (e: MessageEvent) => handlersRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  // Start interview session
  const startInterview = () => {
    const config = DURATIONS.find(d => d.minutes === selectedDuration) || DURATIONS[1]
    const count = config.questionsCount

    let pool = questions.slice()
    if (selectedTrack === 'react') {
      pool = pool.filter(q => q.category.toLowerCase().includes('react'))
    } else if (selectedTrack === 'javascript') {
      pool = pool.filter(q => q.category.toLowerCase().includes('javascript') || q.category.toLowerCase().includes('algorithm') || q.code)
    } else if (selectedTrack === 'architecture') {
      pool = pool.filter(q => q.category.toLowerCase().includes('performance') || q.category.toLowerCase().includes('design') || q.category.toLowerCase().includes('web apis'))
    }

    if (selectedLevel === 'junior') {
      pool = pool.filter(q => q.difficulty === 'Easy' || q.difficulty === 'Medium')
    } else if (selectedLevel === 'senior' || selectedLevel === 'staff') {
      pool = pool.filter(q => q.difficulty === 'Medium' || q.difficulty === 'Hard')
    }

    if (pool.length < count) pool = questions.slice()

    const codingPool = pool.filter(q => q.code)
    const conceptPool = pool.filter(q => !q.code)

    const selected: Question[] = []
    if (codingPool.length > 0) {
      selected.push(codingPool[Math.floor(Math.random() * codingPool.length)])
    }
    while (selected.length < count) {
      const source = selected.length % 2 === 1 && codingPool.length > 1 ? codingPool : (conceptPool.length ? conceptPool : pool)
      const randomQ = source[Math.floor(Math.random() * source.length)]
      if (!selected.some(q => q.id === randomQ.id)) {
        selected.push(randomQ)
      }
    }

    setInterviewQuestions(selected)
    setCurrentQIndex(0)
    setSecondsRemaining(selectedDuration * 60)
    setElapsedSeconds(0)
    setIsPaused(false)
    setCandidateNotes({})
    setCandidateCode({})
    setShowSolutions({})
    setFourPillars({})
    setHintsLevel({})
    setTestResults({})
    setOutput([])
    setPreviewDoc('')
    setState('active')
  }

  // Timer loop
  useEffect(() => {
    if (state !== 'active' || isPaused) return
    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
      setElapsedSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [state, isPaused])

  const currentQ = interviewQuestions[currentQIndex]

  // Code runner
  const activeCode = (currentQ && candidateCode[currentQ.id]) ?? currentQ?.code ?? ''

  const runCode = useCallback(async () => {
    if (!currentQ) return
    const raw = activeCode
    if (!raw.trim()) return
    setRunning(true)
    setOutput([])
    setPreviewDoc('')
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)

    const thisRunId = ++runIdRef.current
    const startTime = performance.now()
    const collectedLogs: string[] = []

    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== thisRunId) return
      if (m.t === 'log') {
        const text = (m.parts ?? []).join(' ')
        collectedLogs.push(text)
        setHasLog(true)
        setOutput(prev => [...prev, text])
      } else if (m.t === 'dom') {
        setHasDom(m.hasDom ?? false)
      } else if (m.t === 'error') {
        const errText = m.stack || m.message
        collectedLogs.push(`[Error] ${errText}`)
        setOutput(prev => [...prev, errText])
        setRunning(false)
        setExecTime(Math.round(performance.now() - startTime))
      } else if (m.t === 'done') {
        setRunning(false)
        setExecTime(m.ms ?? Math.round(performance.now() - startTime))

        // Analyze test check marks
        const passedTests = collectedLogs.filter(l => l.includes('✓') || l.includes('✅')).length
        const failedTests = collectedLogs.filter(l => l.includes('✗') || l.includes('❌') || l.includes('[Error]')).length
        const totalTests = Math.max(1, passedTests + failedTests)

        setTestResults(prev => ({
          ...prev,
          [currentQ.id]: {
            passed: passedTests,
            total: totalTests,
            logs: collectedLogs,
          },
        }))
      }
    }

    try {
      if (isHtmlWorkspace(currentQ)) {
        setPreviewDoc(buildHtmlSrcDoc(currentQ.example ?? '', raw, thisRunId))
      } else if (isReactCode(raw)) {
        const doc = await buildReactSrcDoc({ 'App.jsx': raw }, 'App.jsx', thisRunId)
        setPreviewDoc(doc)
      } else {
        setPreviewDoc(buildJsSrcDoc(raw, thisRunId))
      }
    } catch (err: unknown) {
      setOutput([`[Compilation Error] ${err instanceof Error ? err.message : String(err)}`])
      setRunning(false)
      setExecTime(Math.round(performance.now() - startTime))
    }
  }, [currentQ, activeCode])

  const setPillarRating = (qId: number, field: keyof FAANGPillars, value: number) => {
    setFourPillars(prev => {
      const current = prev[qId] || { problemSolving: 3, codeCraft: 3, architecture: 3, communication: 3 }
      return {
        ...prev,
        [qId]: { ...current, [field]: value },
      }
    })
  }

  const requestNextHint = (qId: number) => {
    setHintsLevel(prev => ({
      ...prev,
      [qId]: Math.min(3, (prev[qId] || 0) + 1),
    }))
  }

  // Calculate Average Pillar Scores & Level Calibration
  const { avgPillars, overallScore, calibratedLevel, verdict } = useMemo(() => {
    if (interviewQuestions.length === 0) {
      return {
        avgPillars: { problemSolving: 3, codeCraft: 3, architecture: 3, communication: 3 },
        overallScore: 3,
        calibratedLevel: 'L4 (Mid-Level)' as const,
        verdict: 'Hire' as const,
      }
    }

    let ps = 0, cc = 0, arch = 0, comm = 0
    let evaluatedCount = 0

    interviewQuestions.forEach(q => {
      const r = fourPillars[q.id] || { problemSolving: 3.5, codeCraft: 3.5, architecture: 3.5, communication: 3.5 }
      ps += r.problemSolving
      cc += r.codeCraft
      arch += r.architecture
      comm += r.communication
      evaluatedCount++
    })

    const avg = {
      problemSolving: Math.round((ps / evaluatedCount) * 10) / 10,
      codeCraft: Math.round((cc / evaluatedCount) * 10) / 10,
      architecture: Math.round((arch / evaluatedCount) * 10) / 10,
      communication: Math.round((comm / evaluatedCount) * 10) / 10,
    }

    // Hint usage penalty (-0.15 per hint level used)
    let totalHints = 0
    Object.values(hintsLevel).forEach(lvl => { totalHints += lvl })
    const hintPenalty = Math.min(0.6, totalHints * 0.1)

    const rawOverall = (avg.problemSolving + avg.codeCraft + avg.architecture + avg.communication) / 4 - hintPenalty
    const overall = Math.max(1.5, Math.min(5.0, Math.round(rawOverall * 10) / 10))

    let calLevel: 'L3 (Associate)' | 'L4 (Mid-Level)' | 'L5 (Senior)' | 'L6 (Staff/Principal)' = 'L4 (Mid-Level)'
    let verd: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Practice' = 'Hire'

    if (overall >= 4.4) {
      calLevel = 'L6 (Staff/Principal)'
      verd = 'Strong Hire'
    } else if (overall >= 3.7) {
      calLevel = 'L5 (Senior)'
      verd = 'Hire'
    } else if (overall >= 2.8) {
      calLevel = 'L4 (Mid-Level)'
      verd = 'Lean Hire'
    } else {
      calLevel = 'L3 (Associate)'
      verd = 'Needs Practice'
    }

    return {
      avgPillars: avg,
      overallScore: overall,
      calibratedLevel: calLevel,
      verdict: verd,
    }
  }, [interviewQuestions, fourPillars, hintsLevel])

  const finishInterview = () => {
    let hintsCount = 0
    Object.values(hintsLevel).forEach(h => { hintsCount += h })

    let testsPassed = 0
    let testsTotal = 0
    Object.values(testResults).forEach(t => {
      testsPassed += t.passed
      testsTotal += t.total
    })

    recordMockInterview({
      id: `mock-${Date.now()}`,
      date: new Date().toISOString(),
      track: TRACKS.find(t => t.id === selectedTrack)?.title || selectedTrack,
      level: selectedLevel.toUpperCase(),
      calibratedLevel,
      durationMinutes: selectedDuration,
      timeSpentSeconds: elapsedSeconds,
      totalQuestions: interviewQuestions.length,
      averageScore: overallScore,
      verdict,
      pillars: avgPillars,
      hintsUsedCount: hintsCount,
      testCasesPassed: testsPassed,
      totalTestCases: testsTotal,
      questionIds: interviewQuestions.map(q => q.id),
    })

    setState('results')
  }

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="mock-interview-page page-enter">
        <div className="skeleton skeleton-line" style={{ width: '300px' }} />
        <div className="skeleton" style={{ height: 320 }} />
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load interview simulator: {error}</div>
  }

  return (
    <div className="mock-interview-page page-enter">
      {/* 1. SETUP STAGE */}
      {state === 'setup' && (
        <div className="mock-setup-container">
          <div className="mock-setup-header">
            <span className="mock-setup-pill">⏱️ FAANG Industry Standard</span>
            <h1>Timed Mock Interview Simulator</h1>
            <p className="subtitle">
              Simulate realistic technical interview loops with automated unit tests, progressive AI hints, FAANG 4-pillar rubrics, and L3-L6 level calibration.
            </p>
            <div className="video-mode-callout">
              <span className="callout-icon">📹</span>
              <div>
                <strong>Want a remote video call simulation?</strong>
                <span> Practice with your live webcam, voice interviewer (TTS), and real-time speech-to-text.</span>
              </div>
              <Link to="/video-mock" className="btn btn-primary btn-sm">
                Try Video Mock Call →
              </Link>
            </div>
          </div>

          <div className="setup-card">
            {/* Track Selector */}
            <div className="setup-section">
              <label className="setup-label">1. Choose Interview Track</label>
              <div className="track-grid">
                {TRACKS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    className={`track-card ${selectedTrack === t.id ? 'active' : ''}`}
                    onClick={() => setSelectedTrack(t.id)}
                  >
                    <span className="track-icon">{t.icon}</span>
                    <div className="track-info">
                      <span className="track-title">{t.title}</span>
                      <span className="track-desc">{t.desc}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration & Seniority Selector */}
            <div className="setup-row">
              <div className="setup-section flex-1">
                <label className="setup-label">2. Interview Duration</label>
                <div className="radio-pills">
                  {DURATIONS.map(d => (
                    <button
                      key={d.minutes}
                      type="button"
                      className={`pill-btn ${selectedDuration === d.minutes ? 'active' : ''}`}
                      onClick={() => setSelectedDuration(d.minutes)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="setup-section flex-1">
                <label className="setup-label">3. Target Seniority Level</label>
                <div className="radio-pills">
                  {(['junior', 'mid', 'senior', 'staff'] as SeniorityLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-btn ${selectedLevel === lvl ? 'active' : ''}`}
                      onClick={() => setSelectedLevel(lvl)}
                    >
                      {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAANG Assessment Guidelines */}
            <div className="setup-tips-banner">
              <h4>FAANG 4-Pillar Evaluation Criteria</h4>
              <ul>
                <li><strong>1. Problem Solving:</strong> Clarify constraints, scope edge cases, and think out loud before writing code.</li>
                <li><strong>2. Code Craft:</strong> Write clean, idiomatic JavaScript/React with modularity, type safety, and test assertions.</li>
                <li><strong>3. System Architecture:</strong> Discuss DOM memory, Web Vitals (LCP/INP), caching, and network boundaries.</li>
                <li><strong>4. Communication:</strong> Articulate engineering trade-offs and respond productively to hints.</li>
              </ul>
            </div>

            <div className="setup-action-row">
              <button
                type="button"
                className="btn btn-primary btn-lg start-interview-btn"
                onClick={startInterview}
              >
                🚀 Begin FAANG Mock Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVE INTERVIEW STAGE */}
      {state === 'active' && currentQ && (
        <div className="mock-active-container">
          {/* Top Control Bar with Urgency Timer */}
          <div className="mock-control-bar">
            <div className="timer-badge-wrap">
              <span
                className={`timer-display ${
                  secondsRemaining < 120 ? 'urgent-red' : secondsRemaining < 300 ? 'urgent-amber' : ''
                }`}
              >
                ⏱️ {formatTimer(secondsRemaining)}
              </span>
              <button
                type="button"
                className="btn-pause"
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? 'Resume interview' : 'Pause timer'}
              >
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
            </div>

            {/* Question Navigation Tabs */}
            <div className="question-nav-tabs">
              {interviewQuestions.map((q, idx) => {
                const hasPillars = !!fourPillars[q.id]
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`q-tab-btn ${idx === currentQIndex ? 'active' : ''} ${
                      hasPillars ? 'completed' : ''
                    }`}
                    onClick={() => {
                      setCurrentQIndex(idx)
                      setOutput([])
                      setPreviewDoc('')
                    }}
                  >
                    Q{idx + 1} {hasPillars && <span className="tab-check">✓</span>}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={finishInterview}
            >
              Finish &amp; View Calibration →
            </button>
          </div>

          {/* Main Interview Stage Layout */}
          <div className="interview-main-content">
            {/* Question Header */}
            <div className="interview-q-header">
              <div className="q-title-row">
                <span className="q-order-badge">Question {currentQIndex + 1} of {interviewQuestions.length}</span>
                <span className={`badge badge-category ${catClass(currentQ.category)}`}>
                  {currentQ.category}
                </span>
                <span className={`badge badge-${currentQ.difficulty.toLowerCase()}`}>
                  {currentQ.difficulty}
                </span>
                <button
                  type="button"
                  className={`detail-bookmark-btn ${isBookmarked(currentQ.id) ? 'bookmarked' : ''}`}
                  onClick={() => toggleBookmark(currentQ.id)}
                  title="Bookmark question"
                >
                  <span className="star-icon">★</span>
                  <span>{isBookmarked(currentQ.id) ? 'Saved' : 'Save'}</span>
                </button>
              </div>
              <h2>{currentQ.question}</h2>
            </div>

            {/* AI Progressive Hint & Clarification Toolbar */}
            <div className="progressive-hints-bar">
              <div className="hint-header-left">
                <span className="hint-icon">💡</span>
                <strong>AI Interviewer Assistance:</strong>
                <span className="hint-count-text">
                  Level {hintsLevel[currentQ.id] || 0} of 3 used
                </span>
              </div>
              <div className="hint-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => requestNextHint(currentQ.id)}
                  disabled={(hintsLevel[currentQ.id] || 0) >= 3}
                >
                  {(hintsLevel[currentQ.id] || 0) === 0
                    ? '❓ 1. Clarify Constraints'
                    : (hintsLevel[currentQ.id] || 0) === 1
                    ? '💡 2. Request Nudge'
                    : (hintsLevel[currentQ.id] || 0) === 2
                    ? '🔍 3. Request Blueprint'
                    : '✓ All Hints Unlocked'}
                </button>
              </div>
            </div>

            {/* Revealed Hints Box */}
            {(hintsLevel[currentQ.id] || 0) > 0 && (
              <div className="unlocked-hints-card">
                {[1, 2, 3].slice(0, hintsLevel[currentQ.id] || 0).map(lvl => {
                  const h = getHint(currentQ, lvl)
                  return (
                    <div key={lvl} className="hint-item">
                      <h5>{h.title}</h5>
                      <pre className="hint-text">{h.content}</pre>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Code / Workspace Area */}
            <div className="interview-workspace">
              {currentQ.code ? (
                <div className="coding-split-container">
                  <div className="workspace-header">
                    <h3>Shared Screen &amp; Code Sandbox</h3>
                    <span className="workspace-subtext">Implement the solution with modularity, edge case handling, and test assertions.</span>
                  </div>

                  <SplitPane
                    className="code-split"
                    left={
                      <div className="code-pane code-pane-left">
                        <div className="code-window">
                          <div className="code-window-bar">
                            <span className="window-filename">
                              {isReactCode(activeCode) ? 'Solution.jsx' : 'solution.js'}
                            </span>
                            <div className="window-actions">
                              <button
                                type="button"
                                className="btn btn-success btn-sm"
                                onClick={runCode}
                                disabled={running}
                              >
                                {running ? 'Running Tests...' : '▶ Run Unit Tests & Code'}
                              </button>
                            </div>
                          </div>
                          <textarea
                            className="code-editor"
                            value={activeCode}
                            onChange={e =>
                              setCandidateCode(prev => ({ ...prev, [currentQ.id]: e.target.value }))
                            }
                            spellCheck={false}
                            placeholder="Write your implementation here..."
                          />
                        </div>
                      </div>
                    }
                    right={
                      <div className="code-pane code-pane-right">
                        {/* Live Test Results Header */}
                        {testResults[currentQ.id] && (
                          <div className="test-results-banner">
                            <span className="test-badge">
                              {testResults[currentQ.id].passed === testResults[currentQ.id].total
                                ? '✅ All Tests Passed'
                                : `⚠️ ${testResults[currentQ.id].passed} / ${testResults[currentQ.id].total} Tests Passed`}
                            </span>
                          </div>
                        )}

                        <div className="output-section">
                          <div className="output-header">
                            <h4>Shared Preview Output</h4>
                          </div>
                          {hasDom === false ? (
                            <div className="code-preview-empty">
                              {hasLog ? 'Console logs below.' : 'Executed without DOM output.'}
                            </div>
                          ) : previewDoc ? (
                            <BrowserPreview srcDoc={previewDoc} url={`${window.location.origin}/preview`} title="Live Output" />
                          ) : (
                            <div className="code-preview-empty">
                              Click <strong>Run Unit Tests &amp; Code</strong> to execute in the sandbox.
                            </div>
                          )}
                        </div>

                        <div className="output-section console-section">
                          <div className="output-header console-header">
                            <h4>Console Logs &amp; Assertions {execTime !== null && `(${execTime}ms)`}</h4>
                          </div>
                          <pre className="code-output">
                            {output.length > 0
                              ? output.map((line, idx) => (
                                  <div key={idx} className="console-line">
                                    <span className="console-line-text">{line}</span>
                                  </div>
                                ))
                              : <span className="console-placeholder">Unit test logs and assertions will display here...</span>}
                          </pre>
                        </div>
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="conceptual-workspace">
                  <div className="workspace-header">
                    <h3>Architecture &amp; System Design Canvas</h3>
                    <span className="workspace-subtext">Structure your explanation: core mental model, component boundaries, state flow, caching, and Web Vitals.</span>
                  </div>
                  <textarea
                    className="notes-textarea"
                    placeholder="Structure your answer here:
1. Core Mental Model & Requirements
2. Component Hierarchy & State Lifecycle
3. Network / Caching / Performance Optimizations
4. Edge Cases & Failure Recovery..."
                    value={candidateNotes[currentQ.id] || ''}
                    onChange={e =>
                      setCandidateNotes(prev => ({ ...prev, [currentQ.id]: e.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            {/* FAANG 4-Pillar Evaluation Card */}
            <div className="rubric-assessment-card">
              <div className="rubric-header">
                <div>
                  <h4>FAANG 4-Pillar Engineering Rubric</h4>
                  <p>Rate your performance on this question across core hiring dimensions:</p>
                </div>
                <button
                  type="button"
                  className={`btn btn-secondary btn-sm toggle-sol-btn ${showSolutions[currentQ.id] ? 'active' : ''}`}
                  onClick={() =>
                    setShowSolutions(prev => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }))
                  }
                >
                  {showSolutions[currentQ.id] ? 'Hide Solution' : '👁️ Reveal Model Solution'}
                </button>
              </div>

              <div className="rubric-grid">
                {[
                  { key: 'problemSolving' as const, label: '1. Problem Solving', desc: 'Constraint scoping & edge cases' },
                  { key: 'codeCraft' as const, label: '2. Code Craft', desc: 'Modularity, clean code & testing' },
                  { key: 'architecture' as const, label: '3. System Design', desc: 'DOM efficiency & Web Vitals' },
                  { key: 'communication' as const, label: '4. Communication', desc: 'Thinking out loud & trade-offs' },
                ].map(dim => {
                  const currentScore = fourPillars[currentQ.id]?.[dim.key] || 3
                  return (
                    <div key={dim.key} className="rubric-item">
                      <div className="rubric-item-header">
                        <span className="rubric-label">{dim.label}</span>
                        <span className="rubric-val">{currentScore}/5</span>
                      </div>
                      <span className="rubric-subdesc">{dim.desc}</span>
                      <div className="star-rating-row">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${star <= currentScore ? 'active' : ''}`}
                            onClick={() => setPillarRating(currentQ.id, dim.key, star)}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Reveal Solution Box */}
              {showSolutions[currentQ.id] && (
                <div className="revealed-solution-box">
                  <div className="sol-badge">Staff Reference Solution</div>
                  <div className="sol-text">
                    <p>{currentQ.answer}</p>
                    {currentQ.example && (
                      <div className="sol-example">
                        <h5>Implementation Example:</h5>
                        <pre><code>{currentQ.example}</code></pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="interview-nav-footer">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={currentQIndex === 0}
                onClick={() => {
                  setCurrentQIndex(Math.max(0, currentQIndex - 1))
                  setOutput([])
                  setPreviewDoc('')
                }}
              >
                ← Previous Question
              </button>

              {currentQIndex < interviewQuestions.length - 1 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setCurrentQIndex(currentQIndex + 1)
                    setOutput([])
                    setPreviewDoc('')
                  }}
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={finishInterview}
                >
                  Finish &amp; View FAANG Calibration →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. FINAL RESULTS & FAANG LEVEL CALIBRATION SCORECARD */}
      {state === 'results' && (
        <div className="mock-results-container printable-dossier">
          <div className="results-header">
            <span className="results-pill">📋 FAANG Evaluation Report</span>
            <h1>Technical Interview Calibration Dossier</h1>
            <p className="subtitle">
              Comprehensive assessment of engineering competence, problem solving, system architecture, and level calibration.
            </p>
          </div>

          {/* Level Calibration Verdict Card */}
          <div className={`verdict-card verdict-${verdict.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="verdict-left">
              <span className="verdict-label">Calibrated Engineering Level:</span>
              <div className="verdict-level-tag">{calibratedLevel}</div>
              <h2 className="verdict-title">{verdict}</h2>
              <p className="verdict-summary">
                {verdict === 'Strong Hire'
                  ? 'Demonstrated Staff-level architectural mastery, proactive edge case handling, and zero-defect code execution.'
                  : verdict === 'Hire'
                  ? 'Strong Senior-level execution, clean component abstraction, and solid problem decomposition.'
                  : verdict === 'Lean Hire'
                  ? 'Solid foundation across core frontend patterns with opportunities to improve edge case handling and speed.'
                  : 'Requires additional practice in algorithm efficiency, state management, and thinking out loud.'}
              </p>
            </div>
            <div className="verdict-score-bubble">
              <span className="score-num">{overallScore}</span>
              <span className="score-max">/ 5.0</span>
            </div>
          </div>

          {/* 4-Pillar Radar Breakdown */}
          <div className="results-rubric-grid">
            <div className="rubric-metric-card">
              <span className="metric-title">1. Problem Solving</span>
              <span className="metric-score">{avgPillars.problemSolving} / 5.0</span>
              <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${(avgPillars.problemSolving / 5) * 100}%` }} />
              </div>
            </div>

            <div className="rubric-metric-card">
              <span className="metric-title">2. Code Craft &amp; Testing</span>
              <span className="metric-score">{avgPillars.codeCraft} / 5.0</span>
              <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${(avgPillars.codeCraft / 5) * 100}%` }} />
              </div>
            </div>

            <div className="rubric-metric-card">
              <span className="metric-title">3. System Architecture</span>
              <span className="metric-score">{avgPillars.architecture} / 5.0</span>
              <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${(avgPillars.architecture / 5) * 100}%` }} />
              </div>
            </div>

            <div className="rubric-metric-card">
              <span className="metric-title">4. Communication &amp; Trade-offs</span>
              <span className="metric-score">{avgPillars.communication} / 5.0</span>
              <div className="metric-bar-track">
                <div className="metric-bar-fill" style={{ width: `${(avgPillars.communication / 5) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Question-by-Question Review */}
          <div className="results-questions-section">
            <h3>Interview Question Review &amp; Solutions:</h3>
            <div className="results-q-list">
              {interviewQuestions.map((q, idx) => (
                <div key={q.id} className="results-q-card">
                  <div className="results-q-head">
                    <div>
                      <span className="q-badge-no">Q{idx + 1}</span>
                      <span className={`badge badge-category ${catClass(q.category)}`}>
                        {q.category}
                      </span>
                      <span className={`badge badge-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <div className="results-q-actions">
                      {testResults[q.id] && (
                        <span className="test-chip">
                          ✓ {testResults[q.id].passed}/{testResults[q.id].total} Tests
                        </span>
                      )}
                      <button
                        type="button"
                        className={`detail-bookmark-btn ${isBookmarked(q.id) ? 'bookmarked' : ''}`}
                        onClick={() => toggleBookmark(q.id)}
                      >
                        <span className="star-icon">★</span>
                        <span>{isBookmarked(q.id) ? 'Saved' : 'Save'}</span>
                      </button>
                    </div>
                  </div>
                  <h4 className="results-q-title">{q.question}</h4>
                  <div className="results-q-solution-preview">
                    <p>{q.answer.slice(0, 240)}…</p>
                    <Link to={`/questions/${q.id}`} className="results-detail-link">
                      Review Complete Model Solution &amp; Live Sandbox →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="results-footer-actions no-print">
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => window.print()}
            >
              🖨️ Export FAANG Evaluation Packet (PDF)
            </button>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setState('setup')}
            >
              🔄 Take Another Mock Interview
            </button>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              📊 View Study Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
