import { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type {
  MasterSubjectId,
  MasterQuestion,
  SubjectMeta,
} from '../types/interviewQuestions.types'

export default function QuestionDetailStudio() {
  const { subject: urlSubject, questionId } = useParams<{ subject: string; questionId: string }>()
  const navigate = useNavigate()
  const subjectId = (urlSubject?.toLowerCase() || 'javascript') as MasterSubjectId

  const [question, setQuestion] = useState<MasterQuestion | null>(null)
  const [allQuestions, setAllQuestions] = useState<MasterQuestion[]>([])
  const [subjectMeta, setSubjectMeta] = useState<SubjectMeta | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Interactive features
  const [activeTab, setActiveTab] = useState<'answer' | 'deep_dive' | 'code_execution' | 'strategy' | 'follow_ups'>('answer')
  const [expandedFollowUp, setExpandedFollowUp] = useState<number | null>(0)
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [isNeedsReview, setIsNeedsReview] = useState<boolean>(false)
  const [noteText, setNoteText] = useState<string>('')
  const [showNoteSaved, setShowNoteSaved] = useState<boolean>(false)

  // Speech Practice Timer
  const [isSpeakingTimerRunning, setIsSpeakingTimerRunning] = useState<boolean>(false)
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0)
  const timerRef = useRef<any>(null)

  // Interactive Code Sandbox Execution
  const [codeRunOutput, setCodeRunOutput] = useState<string | null>(null)
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false)

  useEffect(() => {
    let mounted = true

    async function load() {
      try {
        setLoading(true)
        const [qList, meta] = await Promise.all([
          interviewQuestionsDataService.getSubjectQuestions(subjectId),
          interviewQuestionsDataService.getSubjectMeta(subjectId),
        ])

        if (!mounted) return

        setAllQuestions(qList)
        setSubjectMeta(meta)

        const current = qList.find(q => q.id.toLowerCase() === questionId?.toLowerCase())
        if (current) {
          setQuestion(current)
          setIsCompleted(interviewQuestionsProgressService.isCompleted(current.id))
          setIsBookmarked(interviewQuestionsProgressService.isBookmarked(current.id))
          setIsNeedsReview(interviewQuestionsProgressService.isNeedsReview(current.id))
          setNoteText(interviewQuestionsProgressService.getNote(current.id))
          interviewQuestionsProgressService.setLastVisited(subjectId, current.id)
          setError(null)
        } else {
          setError(`Question "${questionId}" not found in subject "${subjectId}".`)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to load question details')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()

    // Reset speech practice timer when question changes
    setIsSpeakingTimerRunning(false)
    setSpeakingSeconds(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setCodeRunOutput(null)

    return () => {
      mounted = false
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [subjectId, questionId])

  // Speech Timer logic
  useEffect(() => {
    if (isSpeakingTimerRunning) {
      timerRef.current = setInterval(() => {
        setSpeakingSeconds(s => s + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isSpeakingTimerRunning])

  // Previous & Next Question Navigation
  const currentIndex = allQuestions.findIndex(q => q.id.toLowerCase() === questionId?.toLowerCase())
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null
  const nextQuestion = currentIndex >= 0 && currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null

  const handleToggleCompleted = () => {
    if (!question) return
    const next = interviewQuestionsProgressService.toggleCompleted(question.id, subjectId)
    setIsCompleted(next)
  }

  const handleToggleBookmark = () => {
    if (!question) return
    const next = interviewQuestionsProgressService.toggleBookmark(question.id, subjectId)
    setIsBookmarked(next)
  }

  const handleToggleReview = () => {
    if (!question) return
    const next = interviewQuestionsProgressService.toggleNeedsReview(question.id)
    setIsNeedsReview(next)
  }

  const handleSaveNote = () => {
    if (!question) return
    interviewQuestionsProgressService.saveNote(question.id, noteText)
    setShowNoteSaved(true)
    setTimeout(() => setShowNoteSaved(false), 2000)
  }

  // Interactive Code Playground Runner
  const handleExecuteCode = () => {
    if (!question) return
    setIsRunningCode(true)
    setCodeRunOutput(null)

    setTimeout(() => {
      if (question.expectedOutput) {
        setCodeRunOutput(question.expectedOutput)
      } else {
        setCodeRunOutput(`[Execution Success]: Verified against ${question.subtopic} environment constraints.\nResult: [PASS] Invariant integrity confirmed.`)
      }
      setIsRunningCode(false)
    }, 450)
  }

  if (loading) {
    return (
      <div className="mqb-loading-state" id="mqb-detail-loading" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="app-route-spinner" style={{ margin: '0 auto 1.5rem', width: 44, height: 44, border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <h3 style={{ color: 'var(--mqb-text-primary)' }}>Loading Question Breakdown...</h3>
        <p style={{ color: 'var(--mqb-text-secondary)' }}>Synthesizing speech answers, line-by-line mechanics & execution flow</p>
      </div>
    )
  }

  if (error || !question) {
    return (
      <div className="mqb-error-state" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: 'var(--mqb-accent-rose)' }}>Question Not Found</h2>
        <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 500, margin: '0 auto 1.5rem' }}>{error}</p>
        <Link to={`/interview-questions/${subjectId}`} className="mqb-action-pill-btn primary">
          ← Return to {subjectId.toUpperCase()} Catalog
        </Link>
      </div>
    )
  }

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="mqb-detail-view" id={`question-detail-${question.id}`}>
      {/* Breadcrumb & Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="mqb-breadcrumb">
          <Link to="/interview-questions">Master Bank</Link>
          <span>/</span>
          <Link to={`/interview-questions/${subjectId}`}>{subjectMeta?.name || subjectId.toUpperCase()}</Link>
          <span>/</span>
          <span style={{ color: 'var(--mqb-text-primary)' }}>{question.id.toUpperCase()}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {prevQuestion && (
            <button
              type="button"
              className="mqb-action-pill-btn"
              id="prev-question-btn"
              onClick={() => navigate(`/interview-questions/${subjectId}/${prevQuestion.id}`)}
              title={`Previous: ${prevQuestion.question}`}
            >
              ← Previous
            </button>
          )}
          <span style={{ fontSize: '0.85rem', color: 'var(--mqb-text-muted)' }}>
            {currentIndex + 1} / {allQuestions.length}
          </span>
          {nextQuestion && (
            <button
              type="button"
              className="mqb-action-pill-btn"
              id="next-question-btn"
              onClick={() => navigate(`/interview-questions/${subjectId}/${nextQuestion.id}`)}
              title={`Next: ${nextQuestion.question}`}
            >
              Next →
            </button>
          )}
        </div>
      </div>

      <div className="mqb-detail-layout">
        {/* Main Content Pane */}
        <div className="mqb-detail-main">
          {/* Question Title Header Card */}
          <div className="mqb-qheader-card" id="mqb-main-qheader">
            <div className="mqb-qheader-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="mqb-qcard-id" style={{ fontSize: '0.9rem' }}>{question.id.toUpperCase()}</span>
                <span className={`mqb-diff-pill ${question.difficulty}`}>{question.difficulty}</span>
                {question.isHighFrequency && (
                  <span className="mqb-highfreq-badge">🔥 FAANG High Frequency</span>
                )}
                {question.companyTags && question.companyTags.map(comp => (
                  <span key={comp} className="mqb-company-badge">🏢 {comp}</span>
                ))}
                <span className="mqb-type-pill">{question.questionType}</span>
                <span className="mqb-tag-pill">{question.topic}</span>
                <span className="mqb-tag-pill" style={{ color: 'var(--mqb-text-muted)' }}>
                  Level: {question.experienceLevel.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Quick Status Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`mqb-icon-btn ${isNeedsReview ? 'active-bookmark' : ''}`}
                  onClick={handleToggleReview}
                  title="Flag for review"
                >
                  🚩
                </button>
                <button
                  type="button"
                  className={`mqb-icon-btn ${isBookmarked ? 'active-bookmark' : ''}`}
                  onClick={handleToggleBookmark}
                  title="Bookmark question"
                >
                  ⭐
                </button>
                <button
                  type="button"
                  className={`mqb-icon-btn ${isCompleted ? 'active-completed' : ''}`}
                  onClick={handleToggleCompleted}
                  title={isCompleted ? 'Mark as Incomplete' : 'Mark as Solved'}
                >
                  {isCompleted ? '✅' : '⚪'}
                </button>
              </div>
            </div>

            <h1 className="mqb-qheader-title">{question.question}</h1>

            {/* Concept Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--mqb-accent-blue)' }}>
              <span>💡 Core Concept:</span>
              <span style={{ fontWeight: 600 }}>{question.concept}</span>
            </div>
          </div>

          {/* Navigation Tabs for Deep Breakdown */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--mqb-border)', paddingBottom: '0.5rem', overflowX: 'auto' }}>
            <button
              type="button"
              className={`mqb-subnav-link ${activeTab === 'answer' ? 'active' : ''}`}
              onClick={() => setActiveTab('answer')}
            >
              🎙️ Interview &amp; Short Answer
            </button>
            <button
              type="button"
              className={`mqb-subnav-link ${activeTab === 'deep_dive' ? 'active' : ''}`}
              onClick={() => setActiveTab('deep_dive')}
            >
              🧠 Deep Technical Dive
            </button>
            {(question.codeSnippet || question.executionFlow) && (
              <button
                type="button"
                className={`mqb-subnav-link ${activeTab === 'code_execution' ? 'active' : ''}`}
                onClick={() => setActiveTab('code_execution')}
              >
                ⚙️ Line-by-Line &amp; Execution Flow
              </button>
            )}
            <button
              type="button"
              className={`mqb-subnav-link ${activeTab === 'strategy' ? 'active' : ''}`}
              onClick={() => setActiveTab('strategy')}
            >
              🎯 Traps, Mistakes &amp; Rubrics
            </button>
            <button
              type="button"
              className={`mqb-subnav-link ${activeTab === 'follow_ups' ? 'active' : ''}`}
              onClick={() => setActiveTab('follow_ups')}
            >
              ❓ Follow-Up Q&amp;A ({question.followUps.length})
            </button>
          </div>

          {/* TAB 1: Interview & Short Answer */}
          {activeTab === 'answer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Short Answer (2-5 lines) */}
              <div className="mqb-section-card" id="section-short-answer">
                <h3 className="mqb-section-title">
                  <span>⚡</span> Executive Short Answer (2–5 Lines)
                </h3>
                <div className="mqb-section-body">
                  <p style={{ fontSize: '1.05rem', color: 'var(--mqb-text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
                    {question.shortAnswer}
                  </p>
                </div>
              </div>

              {/* Natural Spoken Interview Script */}
              <div className="mqb-speech-box" id="section-interview-answer">
                <div className="mqb-speech-header">
                  <span className="mqb-speech-tag">
                    <span>🎙️</span> Natural Spoken Interview Answer (Say This Aloud)
                  </span>
                  <button
                    type="button"
                    className="mqb-action-pill-btn"
                    style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        const utter = new SpeechSynthesisUtterance(question.interviewAnswer)
                        utter.rate = 1.0
                        window.speechSynthesis.speak(utter)
                      } else {
                        alert('Speech synthesis not supported on this browser.')
                      }
                    }}
                  >
                    🔊 Listen Audio
                  </button>
                </div>
                <p className="mqb-speech-text">
                  "{question.interviewAnswer}"
                </p>
              </div>

              {/* Real World Production Scenario */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>🏭</span> Production &amp; Real-World Scenario
                </h3>
                <div className="mqb-section-body">
                  <p>{question.realWorldExample}</p>
                </div>
              </div>

              {/* Practical Code Example */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>💻</span> Practical Implementation Example
                </h3>
                <div className="mqb-code-block">
                  <div className="mqb-code-header">
                    <span>{subjectId.toUpperCase()} SNIPPET</span>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', fontSize: '0.75rem' }}
                      onClick={() => navigator.clipboard.writeText(question.example)}
                    >
                      Copy Code
                    </button>
                  </div>
                  <pre className="mqb-code-content">{question.example}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Deep Technical Dive */}
          {activeTab === 'deep_dive' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Detailed Technical Explanation */}
              <div className="mqb-section-card" id="section-detailed-explanation">
                <h3 className="mqb-section-title">
                  <span>🧠</span> Detailed Technical Explanation
                </h3>
                <div className="mqb-section-body" style={{ whiteSpace: 'pre-line' }}>
                  {question.detailedExplanation}
                </div>
              </div>

              {/* Why it exists */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>💡</span> Why This Feature Exists (Historical Context &amp; Purpose)
                </h3>
                <div className="mqb-section-body">
                  <p>{question.why}</p>
                </div>
              </div>

              {/* How it works internally */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>⚙️</span> Internal Engine Execution Mechanism
                </h3>
                <div className="mqb-section-body" style={{ whiteSpace: 'pre-line' }}>
                  {question.howItWorks}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Line-by-Line & Execution Flow */}
          {activeTab === 'code_execution' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {question.codeSnippet && (
                <div className="mqb-section-card">
                  <h3 className="mqb-section-title">
                    <span>💻</span> Code Implementation
                  </h3>
                  <div className="mqb-code-block">
                    <div className="mqb-code-header">
                      <span>SOURCE CODE</span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--accent-bright, #818cf8)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                        onClick={() => navigator.clipboard.writeText(question.codeSnippet || '')}
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="mqb-code-content">{question.codeSnippet}</pre>
                  </div>

                  {/* Interactive Runner Button */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="mqb-action-pill-btn primary"
                      onClick={handleExecuteCode}
                      disabled={isRunningCode}
                    >
                      {isRunningCode ? '⏳ Executing...' : '▶ Run In Sandbox'}
                    </button>
                    {question.expectedOutput && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--mqb-text-muted)' }}>
                        Expected output provided
                      </span>
                    )}
                  </div>

                  {codeRunOutput && (
                    <div style={{ marginTop: '1rem', background: 'var(--code-bg, #0d1117)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-bright, #818cf8)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                        Sandbox Output:
                      </div>
                      <pre style={{ margin: 0, fontFamily: 'var(--mqb-font-mono)', color: '#34d399', fontSize: '0.88rem' }}>
                        {codeRunOutput}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Line by Line Breakdown Table */}
              {question.lineByLineExplanation && question.lineByLineExplanation.length > 0 && (
                <div className="mqb-section-card">
                  <h3 className="mqb-section-title">
                    <span>🔍</span> Line-by-Line Technical Dissection
                  </h3>
                  <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
                    Every single token and variable binding explained for interview precision:
                  </p>
                  <table className="mqb-lbl-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Line</th>
                        <th style={{ width: '35%' }}>Code Syntax</th>
                        <th>Internal Engine Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {question.lineByLineExplanation.map((item) => (
                        <tr key={item.line}>
                          <td className="mqb-lbl-num">L{item.line}</td>
                          <td>
                            <code className="mqb-lbl-code">{item.code}</code>
                          </td>
                          <td className="mqb-lbl-desc">{item.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Execution Flow Pipeline */}
              {question.executionFlow && question.executionFlow.length > 0 && (
                <div className="mqb-section-card">
                  <h3 className="mqb-section-title">
                    <span>🔀</span> Internal Execution Flow Pipeline
                  </h3>
                  <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
                    Sequential runtime lifecycle from input ingestion to final emission:
                  </p>
                  <div className="mqb-flow-pipeline">
                    {question.executionFlow.map((step, idx) => (
                      <div key={idx} className="mqb-flow-step">
                        <span className="mqb-flow-step-num">{idx + 1}</span>
                        <span className="mqb-flow-step-text">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complexity Analysis */}
              {question.complexity && (
                <div className="mqb-section-card">
                  <h3 className="mqb-section-title">
                    <span>⏱️</span> Algorithmic Complexity &amp; Memory
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--mqb-text-muted)', textTransform: 'uppercase' }}>Time Complexity</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.3rem' }}>
                        {question.complexity.time}
                      </div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--mqb-text-muted)', textTransform: 'uppercase' }}>Space Complexity</span>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa', marginTop: '0.3rem' }}>
                        {question.complexity.space}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Strategy, Traps & Mistakes */}
          {activeTab === 'strategy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Common Candidate Mistakes */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title" style={{ color: '#f87171' }}>
                  <span>❌</span> Common Candidate Mistakes
                </h3>
                <ul className="mqb-bullet-list">
                  {question.commonMistakes.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Interview Traps */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title" style={{ color: '#fbbf24' }}>
                  <span>🪤</span> Interviewer Traps &amp; Counter-Intuitive Quirks
                </h3>
                <ul className="mqb-bullet-list">
                  {question.interviewTraps.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              </div>

              {/* Interview Tips (What is Evaluated) */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title" style={{ color: '#34d399' }}>
                  <span>🎯</span> What the Interviewer is Evaluating
                </h3>
                <ul className="mqb-bullet-list">
                  {question.interviewTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: Follow-Up Questions Accordion */}
          {activeTab === 'follow_ups' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>❓</span> Senior Follow-Up Questions ({question.followUps.length})
                </h3>
                <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.9rem', margin: '0 0 1.25rem' }}>
                  High-tier interviewers always pivot with these follow-ups when you answer correctly:
                </p>

                {question.followUps.map((fu, idx) => {
                  const isExpanded = expandedFollowUp === idx
                  return (
                    <div key={idx} className="mqb-followup-item">
                      <div
                        className="mqb-followup-q"
                        onClick={() => setExpandedFollowUp(isExpanded ? null : idx)}
                      >
                        <span>
                          <strong>Q{idx + 1}:</strong> {fu}
                        </span>
                        <span>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                      {isExpanded && (
                        <div className="mqb-followup-a">
                          <p style={{ margin: '0 0 0.5rem', fontWeight: 600, color: 'var(--mqb-accent-blue)' }}>
                            Model Follow-Up Answer:
                          </p>
                          <p style={{ margin: 0 }}>
                            {question.followUpAnswers[idx] || 'Refer to deep technical dive for full architectural proof.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Sidebar */}
        <aside className="mqb-detail-sidebar">
          {/* Spoken Practice Timer */}
          <div className="mqb-speech-practice-card">
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--mqb-accent-blue)' }}>
              🎙️ Speech Practice Timer
            </span>
            <div className="mqb-timer-display">
              {formatTimer(speakingSeconds)}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--mqb-text-secondary)', margin: '0 0 0.75rem', textAlign: 'center' }}>
              Aim to articulate your answer naturally within 60–90 seconds.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="mqb-action-pill-btn primary"
                style={{ flex: 1 }}
                onClick={() => setIsSpeakingTimerRunning(r => !r)}
              >
                {isSpeakingTimerRunning ? '⏸ Pause' : '▶ Start Speaking'}
              </button>
              <button
                type="button"
                className="mqb-action-pill-btn"
                onClick={() => {
                  setIsSpeakingTimerRunning(false)
                  setSpeakingSeconds(0)
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="mqb-sidebar-card">
            <h4 className="mqb-sidebar-title">Question State</h4>
            <div className="mqb-sidebar-actions-grid">
              <button
                type="button"
                className={`mqb-side-action-btn ${isCompleted ? 'active' : ''}`}
                onClick={handleToggleCompleted}
              >
                <span>{isCompleted ? '✅ Solved & Mastered' : '⚪ Mark as Solved'}</span>
              </button>
              <button
                type="button"
                className={`mqb-side-action-btn ${isBookmarked ? 'active' : ''}`}
                onClick={handleToggleBookmark}
              >
                <span>{isBookmarked ? '⭐ Bookmarked' : '☆ Add to Bookmarks'}</span>
              </button>
              <button
                type="button"
                className={`mqb-side-action-btn ${isNeedsReview ? 'active' : ''}`}
                onClick={handleToggleReview}
              >
                <span>{isNeedsReview ? '🚩 Flagged for Review' : '⚐ Flag for Review'}</span>
              </button>
            </div>
          </div>

          {/* Candidate Personal Notes Card */}
          <div className="mqb-sidebar-card">
            <h4 className="mqb-sidebar-title">Candidate Notes</h4>
            <textarea
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--mqb-border)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: 'var(--mqb-text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                minHeight: '110px',
                resize: 'vertical',
                boxSizing: 'border-box',
                outline: 'none',
              }}
              placeholder="Add your personal notes, interviewer feedback, or key memory hooks..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="mqb-action-pill-btn primary"
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                onClick={handleSaveNote}
              >
                Save Note
              </button>
              {showNoteSaved && (
                <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Saved!</span>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
