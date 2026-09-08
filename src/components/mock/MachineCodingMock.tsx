import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { MACHINE_CODING_QUESTIONS, type MCQuestion } from '../machinecoding/machineCodingQuestions'
import { getQuestionTestCases } from '../machinecoding/data/machineCodingTests'
import { buildMachineCodingSrcDoc } from '../../lib/runner'
import AIFeedbackReport from './AIFeedbackReport'
import './MachineCodingMock.css'

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------
type MockState = 'setup' | 'active' | 'results'
type TrackType = 'mixed' | 'react' | 'javascript' | 'dom' | 'leetcode'
type DifficultyFilter = 'mixed' | 'Easy' | 'Medium' | 'Hard'

interface QuestionResult {
  question: MCQuestion
  timeSpentSeconds: number
  testsRun: number
  testsPassed: number
  code: string
  score: number // 0-100
  autoAdvanced: boolean // true if timer expired
}

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------
const TRACKS: { id: TrackType; icon: string; title: string; desc: string }[] = [
  { id: 'mixed', icon: '⚡', title: 'Full Stack Frontend', desc: 'Mix of React, JS, DOM and algorithm challenges.' },
  { id: 'react', icon: '⚛️', title: 'React Specialist', desc: 'Hooks, state, components and React 19 patterns.' },
  { id: 'javascript', icon: '🟨', title: 'JavaScript & Algorithms', desc: 'Closures, async, polyfills and data structures.' },
  { id: 'dom', icon: '🌐', title: 'DOM & Web APIs', desc: 'Events, drag & drop, observers, and native browser APIs.' },
]

const DURATIONS = [
  { minutes: 30, questionsCount: 3, label: '30 Min · 3 Questions' },
  { minutes: 45, questionsCount: 4, label: '45 Min · 4 Questions' },
  { minutes: 60, questionsCount: 5, label: '60 Min · 5 Questions' },
]

const DIFF_FILTERS: { id: DifficultyFilter; label: string }[] = [
  { id: 'mixed', label: '🎲 Mixed' },
  { id: 'Easy', label: '🟢 Easy Only' },
  { id: 'Medium', label: '🟡 Medium' },
  { id: 'Hard', label: '🔴 Hard Only' },
]

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
function fmt(secs: number): string {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function scoreQuestion(result: Pick<QuestionResult, 'testsRun' | 'testsPassed' | 'timeSpentSeconds' | 'autoAdvanced'>, perQSecs: number): number {
  if (result.testsRun === 0) return 0
  const testScore = result.testsPassed / Math.max(1, result.testsRun)
  const timeEfficiency = Math.max(0, 1 - result.timeSpentSeconds / (perQSecs * 1.1))
  const autoAdvancePenalty = result.autoAdvanced ? 0.15 : 0
  return Math.round(Math.min(100, (testScore * 60 + timeEfficiency * 20 + (testScore > 0 ? 20 : 0) - autoAdvancePenalty * 100)))
}

function pickQuestions(track: TrackType, diff: DifficultyFilter, count: number): MCQuestion[] {
  let pool = MACHINE_CODING_QUESTIONS.slice()

  if (track === 'react') pool = pool.filter(q => q.category === 'ReactJS')
  else if (track === 'javascript') pool = pool.filter(q => q.category === 'JavaScript' || q.category === 'TypeScript')
  else if (track === 'dom') pool = pool.filter(q => q.category === 'DOM')
  else if (track === 'leetcode') pool = pool.filter(q => q.category === 'LeetCode')

  if (diff !== 'mixed') pool = pool.filter(q => q.difficulty === diff)
  if (pool.length < count) pool = MACHINE_CODING_QUESTIONS.slice() // fallback

  // Shuffle and take count
  const shuffled = pool.sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function verdictFromScore(score: number): { text: string; cls: string } {
  if (score >= 82) return { text: '⭐ STRONG HIRE', cls: 'strong-hire' }
  if (score >= 65) return { text: '✅ HIRE', cls: 'hire' }
  if (score >= 45) return { text: '⚖️ LEAN HIRE', cls: 'lean-hire' }
  return { text: '⏳ NEEDS PRACTICE', cls: 'needs-practice' }
}

function verdictColorFromScore(score: number): string {
  if (score >= 82) return '#10b981'
  if (score >= 65) return '#6366f1'
  if (score >= 45) return '#f59e0b'
  return '#ef4444'
}

// ----------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------
function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="mcm-section">
      <button type="button" className="mcm-section-toggle" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <span className={`mcm-section-toggle-icon ${open ? 'open' : ''}`}>▼</span>
      </button>
      {open && <div className="mcm-section-body">{children}</div>}
    </div>
  )
}

// ----------------------------------------------------------------
// Main component
// ----------------------------------------------------------------
export default function MachineCodingMock() {
  const [mockState, setMockState] = useState<MockState>('setup')

  // Setup config
  const [track, setTrack] = useState<TrackType>('mixed')
  const [totalMinutes, setTotalMinutes] = useState(45)
  const [diffFilter, setDiffFilter] = useState<DifficultyFilter>('mixed')

  // Active session
  const [questions, setQuestions] = useState<MCQuestion[]>([])
  const [qIdx, setQIdx] = useState(0)
  const [globalSecs, setGlobalSecs] = useState(0)
  const [qElapsedSecs, setQElapsedSecs] = useState(0)
  const [code, setCode] = useState('')
  const [results, setResults] = useState<QuestionResult[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const [previewDoc, setPreviewDoc] = useState('')
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [testsRun, setTestsRun] = useState(0)
  const [testsPassed, setTestsPassed] = useState(0)
  const [showFinishDialog, setShowFinishDialog] = useState(false)
  const [currentLang, setCurrentLang] = useState<'react' | 'javascript'>('react')

  // Results
  const [finalResults, setFinalResults] = useState<QuestionResult[]>([])
  const [sessionDurationSecs, setSessionDurationSecs] = useState(0)

  const runIdRef = useRef(0)
  const msgHandlerRef = useRef<(e: MessageEvent) => void>(() => {})

  // Per-question time limit = total / questions * 0.8 (leave 20% buffer)
  const questionCount = useMemo(() => DURATIONS.find(d => d.minutes === totalMinutes)?.questionsCount ?? 4, [totalMinutes])
  const perQLimit = useMemo(() => Math.round((totalMinutes * 60) / questionCount * 0.85), [totalMinutes, questionCount])

  // Listen for iframe messages
  useEffect(() => {
    const listener = (e: MessageEvent) => msgHandlerRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  // Global countdown
  useEffect(() => {
    if (mockState !== 'active' || isPaused) return
    if (globalSecs <= 0) {
      // Time's up — auto finish
      handleAutoFinish()
      return
    }
    const t = setInterval(() => {
      setGlobalSecs(p => {
        if (p <= 1) { clearInterval(t); return 0 }
        return p - 1
      })
      setQElapsedSecs(p => p + 1)
    }, 1000)
    return () => clearInterval(t)
  }, [mockState, isPaused, globalSecs]) // eslint-disable-line

  // Per-question auto-advance
  useEffect(() => {
    if (mockState !== 'active') return
    if (qElapsedSecs >= perQLimit) {
      void advanceQuestion(true)
    }
  }, [qElapsedSecs, perQLimit, mockState]) // eslint-disable-line

  const currentQ = questions[qIdx]

  // Reset code when question changes
  useEffect(() => {
    if (!currentQ) return
    setCode(currentQ.starterCode || '')
    setPreviewDoc('')
    setConsoleLogs([])
    setHasRun(false)
    setTestsRun(0)
    setTestsPassed(0)
    setQElapsedSecs(0)
    setCurrentLang(
      currentQ.category === 'JavaScript' || currentQ.category === 'LeetCode' || currentQ.category === 'TypeScript'
        ? 'javascript'
        : 'react'
    )
  }, [currentQ?.id]) // eslint-disable-line

  const startMock = () => {
    const qs = pickQuestions(track, diffFilter, questionCount)
    setQuestions(qs)
    setQIdx(0)
    setGlobalSecs(totalMinutes * 60)
    setQElapsedSecs(0)
    setResults([])
    setIsPaused(false)
    setCode(qs[0]?.starterCode || '')
    setPreviewDoc('')
    setConsoleLogs([])
    setHasRun(false)
    setTestsRun(0)
    setTestsPassed(0)
    setMockState('active')
  }

  const recordCurrentResult = useCallback((autoAdvanced = false): QuestionResult | null => {
    if (!currentQ) return null
    const score = scoreQuestion({ testsRun, testsPassed, timeSpentSeconds: qElapsedSecs, autoAdvanced }, perQLimit)
    return {
      question: currentQ,
      timeSpentSeconds: qElapsedSecs,
      testsRun,
      testsPassed,
      code,
      score,
      autoAdvanced,
    }
  }, [currentQ, testsRun, testsPassed, qElapsedSecs, code, perQLimit])

  const advanceQuestion = useCallback(async (autoAdvanced = false) => {
    const rec = recordCurrentResult(autoAdvanced)
    const newResults = rec ? [...results, rec] : results

    if (qIdx >= questions.length - 1) {
      // Last question — finish
      setFinalResults(newResults)
      setSessionDurationSecs(totalMinutes * 60 - globalSecs)
      setMockState('results')
    } else {
      setResults(newResults)
      setQIdx(i => i + 1)
    }
  }, [recordCurrentResult, results, qIdx, questions.length, globalSecs, totalMinutes])

  const handleAutoFinish = useCallback(() => {
    const rec = recordCurrentResult(true)
    const allResults = rec ? [...results, rec] : results
    setFinalResults(allResults)
    setSessionDurationSecs(totalMinutes * 60)
    setMockState('results')
  }, [recordCurrentResult, results, totalMinutes])

  const handleFinishEarly = () => {
    setShowFinishDialog(false)
    const rec = recordCurrentResult(false)
    const allResults = rec ? [...results, rec] : results
    setFinalResults(allResults)
    setSessionDurationSecs(totalMinutes * 60 - globalSecs)
    setMockState('results')
  }

  // Run code in sandbox
  const runCode = useCallback(async () => {
    if (!currentQ || !code.trim()) return
    setRunning(true)
    setConsoleLogs([])
    setPreviewDoc('')
    setHasRun(true)

    const thisRunId = ++runIdRef.current
    const logs: string[] = []
    let passed = 0
    let total = 0

    msgHandlerRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== thisRunId) return
      if (m.t === 'log') {
        const txt: string = (m.parts ?? []).join(' ')
        logs.push(txt)
        if (txt.includes('✓') || txt.includes('✅') || txt.includes('PASS')) passed++
        if (txt.includes('✗') || txt.includes('❌') || txt.includes('FAIL') || txt.includes('[Error]')) total++
        setConsoleLogs(p => [...p, txt])
      } else if (m.t === 'error') {
        const errTxt = m.stack || m.message || 'Runtime error'
        logs.push(`[Error] ${errTxt}`)
        setConsoleLogs(p => [...p, `[Error] ${errTxt}`])
        setRunning(false)
      } else if (m.t === 'done') {
        const passCount = logs.filter(l => l.includes('✓') || l.includes('✅')).length
        const failCount = logs.filter(l => l.includes('✗') || l.includes('❌') || l.includes('[Error]')).length
        const allTests = Math.max(1, passCount + failCount)
        setTestsPassed(passCount)
        setTestsRun(allTests)
        total = allTests
        passed = passCount
        setRunning(false)
      }
    }

    try {
      const testCases = getQuestionTestCases(currentQ)
      const testScript = testCases.length > 0
        ? `\n// Auto test harness\n(async () => {\n  const root = document.getElementById('root') || document.body;\n  const wait = (ms) => new Promise(r => setTimeout(r, ms));\n  const fireClick = (el) => el && el.click();\n  const expect = (cond, msg) => {\n    if (cond) { console.log('✓ ' + (msg || 'Pass')); }\n    else { console.log('✗ ' + (msg || 'Fail')); }\n  };\n  await wait(300);\n  ${testCases.map(tc => tc.assertion).join('\n  await wait(100);\n  ')}\n})();`
        : ''

      const filesWithTests: Record<string, string> = currentLang === 'react'
        ? { 'App.tsx': code }
        : { 'script.js': code + testScript }

      const doc = await buildMachineCodingSrcDoc(filesWithTests, currentLang, thisRunId)
      setPreviewDoc(doc)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setConsoleLogs(p => [...p, `[Build Error] ${msg}`])
      setRunning(false)
    }
  }, [currentQ, code, currentLang])

  // ----------------------------------------------------------------
  // Computed for active UI
  // ----------------------------------------------------------------
  const qPct = Math.max(0, 1 - qElapsedSecs / perQLimit)
  const qTimerClass = qPct < 0.15 ? 'critical' : qPct < 0.3 ? 'warning' : ''
  const globalTimerClass = globalSecs < 300 ? 'critical' : globalSecs < 600 ? 'warning' : ''

  // ----------------------------------------------------------------
  // Overall score from final results
  // ----------------------------------------------------------------
  const overallScore = useMemo(() => {
    if (finalResults.length === 0) return 0
    return Math.round(finalResults.reduce((s, r) => s + r.score, 0) / finalResults.length)
  }, [finalResults])

  const verdict = verdictFromScore(overallScore)
  const ringColor = verdictColorFromScore(overallScore)
  const circumference = 2 * Math.PI * 78
  const dashOffset = circumference * (1 - overallScore / 100)

  // ================================================================
  // RENDER
  // ================================================================
  return (
    <div className="mcm-page">

      {/* ============================================================
          SETUP
          ============================================================ */}
      {mockState === 'setup' && (
        <div className="mcm-setup">
          <div className="mcm-setup-badge">🎤 Machine Coding · Mock Interview</div>
          <h1>Coding Interview Simulator</h1>
          <p className="subtitle">
            Timed machine coding questions with live sandbox execution, automatic test validation,
            and a scored post-session report card.
          </p>

          <div className="mcm-setup-card">
            {/* Track */}
            <div>
              <div className="mcm-section-label">1 · Interview Track</div>
              <div className="mcm-track-grid">
                {TRACKS.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    id={`mcm-track-${t.id}`}
                    className={`mcm-track-card ${track === t.id ? 'active' : ''}`}
                    onClick={() => setTrack(t.id)}
                  >
                    <span className="mcm-track-icon">{t.icon}</span>
                    <div>
                      <div className="mcm-track-title">{t.title}</div>
                      <div className="mcm-track-desc">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="mcm-section-label">2 · Duration</div>
              <div className="mcm-pills">
                {DURATIONS.map(d => (
                  <button
                    key={d.minutes}
                    type="button"
                    id={`mcm-dur-${d.minutes}`}
                    className={`mcm-pill ${totalMinutes === d.minutes ? 'active' : ''}`}
                    onClick={() => setTotalMinutes(d.minutes)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <div className="mcm-section-label">3 · Difficulty</div>
              <div className="mcm-pills">
                {DIFF_FILTERS.map(d => (
                  <button
                    key={d.id}
                    type="button"
                    id={`mcm-diff-${d.id}`}
                    className={`mcm-pill ${diffFilter === d.id ? 'active' : ''}`}
                    onClick={() => setDiffFilter(d.id)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: '0.85rem', color: '#94a3b8', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <span>⏱ <strong style={{ color: '#c7d2fe' }}>{totalMinutes} min</strong> total</span>
              <span>📋 <strong style={{ color: '#c7d2fe' }}>{questionCount} questions</strong></span>
              <span>⏰ ~<strong style={{ color: '#c7d2fe' }}>{Math.round(perQLimit / 60)} min</strong> per question</span>
              <span>🏷️ <strong style={{ color: '#c7d2fe' }}>{TRACKS.find(t2 => t2.id === track)?.title}</strong> track</span>
            </div>

            <button
              type="button"
              id="mcm-start-btn"
              className="mcm-start-btn"
              onClick={startMock}
            >
              🎤 Start Interview
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          ACTIVE INTERVIEW
          ============================================================ */}
      {mockState === 'active' && currentQ && (
        <div className="mcm-active">
          {/* Top bar */}
          <div className="mcm-topbar">
            <div className="mcm-topbar-left">
              <span className="mcm-logo">⚡ Mock Interview</span>
              <span className="mcm-q-badge">Q {qIdx + 1} / {questions.length}</span>
            </div>

            <div className="mcm-topbar-center">
              <span className={`mcm-global-timer ${globalTimerClass}`}>{fmt(globalSecs)}</span>
              <span className="mcm-timer-label">Session Remaining</span>
            </div>

            <div className="mcm-topbar-right">
              <button
                type="button"
                className="mcm-finish-btn"
                onClick={() => setShowFinishDialog(true)}
              >
                ⏹ Finish Early
              </button>
            </div>
          </div>

          {/* Per-question sub-timer bar */}
          <div className="mcm-subtimer-bar">
            <div
              className={`mcm-subtimer-fill ${qTimerClass}`}
              style={{ width: `${qPct * 100}%` }}
            />
          </div>

          {/* Body split */}
          <div className="mcm-body">
            {/* Left: question panel */}
            <div className="mcm-panel-left">
              <div className="mcm-question-header">
                <div className="mcm-q-meta">
                  <span className={`mcm-diff-badge ${currentQ.difficulty}`}>{currentQ.difficulty}</span>
                  <span className="mcm-cat-badge">{currentQ.category}</span>
                  <span style={{ fontSize: '0.72rem', color: '#374151' }}>⏱ {currentQ.timeEstimate}</span>
                </div>
                <h2 className="mcm-q-title">{currentQ.title}</h2>
                <p className="mcm-q-summary">{currentQ.summary}</p>
                <div className="mcm-q-subtimer-label">
                  <span>This question</span>
                  <strong className={qTimerClass}>{fmt(Math.max(0, perQLimit - qElapsedSecs))} left</strong>
                </div>
              </div>

              <CollapsibleSection title="📋 Description">
                <pre className="mcm-desc-text">{currentQ.description}</pre>
              </CollapsibleSection>

              <CollapsibleSection title="✅ Requirements">
                <ul className="mcm-req-list">
                  {currentQ.requirements.map((r, i) => (
                    <li key={i} className="mcm-req-item">{r}</li>
                  ))}
                </ul>
              </CollapsibleSection>

              {currentQ.interviewTips.length > 0 && (
                <CollapsibleSection title="💡 Tips" defaultOpen={false}>
                  <ul className="mcm-tip-list">
                    {currentQ.interviewTips.map((t, i) => (
                      <li key={i} className="mcm-tip-item">{t}</li>
                    ))}
                  </ul>
                </CollapsibleSection>
              )}

              {/* Test summary inline */}
              {hasRun && (
                <div style={{ padding: '12px 20px' }}>
                  <div className={`mcm-test-summary ${testsPassed === testsRun && testsRun > 0 ? 'all-pass' : testsPassed > 0 ? 'partial' : 'none-pass'}`}>
                    {testsPassed === testsRun && testsRun > 0
                      ? `✅ All ${testsRun} tests passing!`
                      : `${testsPassed} / ${testsRun} tests passed`}
                  </div>
                </div>
              )}

              {/* Footer nav */}
              <div className="mcm-panel-left-footer">
                <button
                  type="button"
                  id="mcm-next-btn"
                  className="mcm-next-btn"
                  onClick={() => void advanceQuestion(false)}
                >
                  {qIdx >= questions.length - 1 ? '🏁 Finish & See Results' : `Next Question → (${qIdx + 2}/${questions.length})`}
                </button>
              </div>
            </div>

            {/* Right: editor + preview */}
            <div className="mcm-panel-right">
              {/* Editor toolbar */}
              <div className="mcm-editor-topbar">
                <div className="mcm-lang-pills">
                  <button
                    type="button"
                    className={`mcm-lang-pill ${currentLang === 'react' ? 'active' : ''}`}
                    onClick={() => setCurrentLang('react')}
                  >⚛️ React / TSX</button>
                  <button
                    type="button"
                    className={`mcm-lang-pill ${currentLang === 'javascript' ? 'active' : ''}`}
                    onClick={() => setCurrentLang('javascript')}
                  >🟨 JavaScript</button>
                </div>
                <button
                  type="button"
                  id="mcm-run-btn"
                  className="mcm-run-btn"
                  onClick={() => void runCode()}
                  disabled={running}
                >
                  {running ? '⏳ Running…' : '▶ Run & Test'}
                </button>
              </div>

              {/* Monaco editor */}
              <div className="mcm-editor-area">
                <Editor
                  height="100%"
                  defaultLanguage={currentLang === 'react' ? 'typescript' : 'javascript'}
                  language={currentLang === 'react' ? 'typescript' : 'javascript'}
                  value={code}
                  onChange={v => setCode(v ?? '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    padding: { top: 10, bottom: 10 },
                    fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                    fontLigatures: true,
                    tabSize: 2,
                  }}
                />
              </div>

              {/* Preview + console */}
              <div className="mcm-bottom-area">
                <div className="mcm-preview-pane">
                  {previewDoc ? (
                    <iframe
                      className="mcm-preview-iframe"
                      srcDoc={previewDoc}
                      sandbox="allow-scripts allow-same-origin"
                      title="Live Preview"
                    />
                  ) : (
                    <div className="mcm-preview-empty">
                      Click ▶ Run & Test to see preview
                    </div>
                  )}
                </div>
                <div className="mcm-console-pane">
                  <div className="mcm-console-header">Console Output</div>
                  {consoleLogs.length === 0 ? (
                    <div className="mcm-console-empty">No output yet…</div>
                  ) : (
                    consoleLogs.map((line, i) => {
                      const cls = line.includes('✓') || line.includes('✅') ? 'pass'
                        : line.includes('✗') || line.includes('❌') || line.startsWith('[Error]') ? 'fail'
                        : ''
                      return <div key={i} className={`mcm-console-line ${cls}`}>{line}</div>
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          RESULTS SCORECARD
          ============================================================ */}
      {mockState === 'results' && (
        <div className="mcm-results">
          <div className="mcm-setup-badge">🏁 Interview Complete</div>
          <h1>Session Scorecard</h1>
          <p className="mcm-results-sub">
            {fmt(sessionDurationSecs)} session · {finalResults.length} questions completed
          </p>

          {/* Score Ring */}
          <div className="mcm-score-ring-wrap">
            <div className="mcm-score-ring">
              <svg className="mcm-score-ring-svg" viewBox="0 0 180 180">
                <circle className="mcm-score-ring-bg" cx="90" cy="90" r="78" />
                <circle
                  className="mcm-score-ring-fill"
                  cx="90" cy="90" r="78"
                  stroke={ringColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="mcm-score-ring-center">
                <span className="mcm-score-big" style={{ color: ringColor }}>{overallScore}</span>
                <span className="mcm-score-pts">/ 100</span>
              </div>
            </div>
          </div>

          {/* Verdict */}
          <div className={`mcm-verdict ${verdict.cls}`}>{verdict.text}</div>

          {/* Stats grid */}
          <div className="mcm-stats-grid">
            <div className="mcm-stat-card">
              <div className="mcm-stat-value">{finalResults.length}</div>
              <div className="mcm-stat-label">Questions</div>
            </div>
            <div className="mcm-stat-card">
              <div className="mcm-stat-value">
                {finalResults.reduce((s, r) => s + r.testsPassed, 0)} /
                {finalResults.reduce((s, r) => s + r.testsRun, 0)}
              </div>
              <div className="mcm-stat-label">Tests Passed</div>
            </div>
            <div className="mcm-stat-card">
              <div className="mcm-stat-value">
                {fmt(Math.round(finalResults.reduce((s, r) => s + r.timeSpentSeconds, 0) / Math.max(1, finalResults.length)))}
              </div>
              <div className="mcm-stat-label">Avg Time / Q</div>
            </div>
            <div className="mcm-stat-card">
              <div className="mcm-stat-value">
                {finalResults.filter(r => !r.autoAdvanced).length} / {finalResults.length}
              </div>
              <div className="mcm-stat-label">Completed In Time</div>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="mcm-breakdown-title">Per-Question Breakdown</div>
          <table className="mcm-breakdown-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Difficulty</th>
                <th>Time</th>
                <th>Tests</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {finalResults.map((r, i) => (
                <tr key={r.question.id}>
                  <td style={{ color: '#4b5563', fontWeight: 700 }}>{i + 1}</td>
                  <td>
                    <span style={{ color: '#f1f5f9', fontWeight: 500, fontSize: '0.85rem' }}>{r.question.title}</span>
                    {r.autoAdvanced && (
                      <span style={{ marginLeft: 8, fontSize: '0.68rem', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 4, padding: '1px 6px' }}>
                        ⏰ Time Expired
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`mcm-diff-badge ${r.question.difficulty}`}>{r.question.difficulty}</span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>{fmt(r.timeSpentSeconds)}</td>
                  <td style={{ color: r.testsPassed === r.testsRun && r.testsRun > 0 ? '#34d399' : r.testsPassed > 0 ? '#fbbf24' : '#ef4444', fontWeight: 600 }}>
                    {r.testsRun > 0 ? `${r.testsPassed}/${r.testsRun}` : '—'}
                  </td>
                  <td>
                    <div className="mcm-q-score-bar">
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.9rem', color: verdictColorFromScore(r.score), minWidth: 32 }}>
                        {r.score}
                      </span>
                      <div className="mcm-q-score-track">
                        <div className="mcm-q-score-fill" style={{ width: `${r.score}%`, background: verdictColorFromScore(r.score) }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Action buttons */}
          <div className="mcm-results-footer">
            <button
              type="button"
              id="mcm-print-btn"
              className="mcm-btn-secondary"
              onClick={() => window.print()}
            >
              🖨️ Print / Save PDF
            </button>
            <button
              type="button"
              id="mcm-restart-btn"
              className="mcm-btn-restart"
              onClick={() => setMockState('setup')}
            >
              🔄 Try Again
            </button>
            <Link to="/machine-coding" className="mcm-btn-secondary">
              ← Back to Machine Coding
            </Link>
          </div>

          {/* AI Feedback Panel */}
          <AIFeedbackReport
            payload={{
              questions: finalResults.map(r => ({
                question: {
                  id: r.question.id,
                  title: r.question.title,
                  category: r.question.category,
                  difficulty: r.question.difficulty,
                  requirements: r.question.requirements,
                },
                code: r.code,
                timeSpentSeconds: r.timeSpentSeconds,
                testsPassed: r.testsPassed,
                testsRun: r.testsRun,
                language: r.question.category === 'JavaScript' || r.question.category === 'LeetCode' || r.question.category === 'TypeScript' ? 'javascript' : 'react',
              })),
              perQLimit,
              totalScore: overallScore,
              sessionDurationSeconds: finalResults.reduce((acc, r) => acc + r.timeSpentSeconds, 0),
            }}
          />
        </div>
      )}

      {/* ============================================================
          FINISH EARLY DIALOG
          ============================================================ */}
      {showFinishDialog && (
        <div className="mcm-finish-dialog" onClick={e => { if (e.target === e.currentTarget) setShowFinishDialog(false) }}>
          <div className="mcm-finish-dialog-card">
            <div style={{ fontSize: '2.5rem' }}>⏹</div>
            <h3>Finish Interview Early?</h3>
            <p>
              You've completed <strong style={{ color: '#94a3b8' }}>{qIdx + 1}</strong> of{' '}
              <strong style={{ color: '#94a3b8' }}>{questions.length}</strong> questions.
              Your results so far will be scored.
            </p>
            <div className="mcm-finish-dialog-btns">
              <button
                type="button"
                onClick={() => setShowFinishDialog(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: 10, padding: '9px 20px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}
              >
                Keep Going
              </button>
              <button
                type="button"
                id="mcm-confirm-finish-btn"
                onClick={handleFinishEarly}
                style={{ background: 'linear-gradient(135deg,#dc2626,#ef4444)', color: '#fff', border: 'none', borderRadius: 10, padding: '9px 20px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
              >
                ⏹ Finish Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React from 'react'
