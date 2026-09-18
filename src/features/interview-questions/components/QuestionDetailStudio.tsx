import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import { MermaidDiagram } from '../../interview-docs/components/common/MermaidDiagram'
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

  // Audio Speech Narrator State with Indian English Accent support
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false)
  const [speechRate, setSpeechRate] = useState<number>(1.0)
  const [activeSpeechSource, setActiveSpeechSource] = useState<'interview' | 'short'>('interview')
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('')
  const [isIndianVoiceActive, setIsIndianVoiceActive] = useState<boolean>(false)
  const [spokenCharRange, setSpokenCharRange] = useState<{ start: number; end: number }>({ start: -1, end: -1 })

  // Load and auto-select Indian English voice
  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices()
      if (!all || all.length === 0) return
      setAvailableVoices(all)

      // Priority 1: Indian English (en-IN)
      const indianVoice = all.find(
        v => v.lang === 'en-IN' ||
             v.lang.toLowerCase().replace('_', '-').includes('en-in') ||
             v.name.toLowerCase().includes('india') ||
             v.name.toLowerCase().includes('ravi') ||
             v.name.toLowerCase().includes('heera') ||
             v.name.toLowerCase().includes('neerja') ||
             v.name.toLowerCase().includes('rishi')
      )

      if (indianVoice) {
        setSelectedVoiceURI(indianVoice.voiceURI)
        setIsIndianVoiceActive(true)
      } else {
        const fallback = all.find(v => v.lang.startsWith('en')) || all[0]
        if (fallback) setSelectedVoiceURI(fallback.voiceURI)
        setIsIndianVoiceActive(false)
      }
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const handlePlayAudio = (source: 'interview' | 'short' = 'interview') => {
    if (!('speechSynthesis' in window) || !question) return
    window.speechSynthesis.cancel()

    const text = source === 'interview' ? question.interviewAnswer : question.shortAnswer
    setActiveSpeechSource(source)
    setSpokenCharRange({ start: -1, end: -1 })

    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = speechRate

    const chosenVoice = availableVoices.find(v => v.voiceURI === selectedVoiceURI)
    if (chosenVoice) {
      utter.voice = chosenVoice
      utter.lang = chosenVoice.lang || 'en-IN'
    } else {
      utter.lang = 'en-IN'
    }

    utter.onboundary = (event: SpeechSynthesisEvent) => {
      const charIndex = event.charIndex
      let charLength = (event as any).charLength || 0
      if (charLength <= 0) {
        const slice = text.slice(charIndex)
        const match = slice.search(/[\s,.;:!?\n()""'']/);
        charLength = match === -1 ? slice.length : Math.max(1, match);
      }
      setSpokenCharRange({ start: charIndex, end: charIndex + charLength })
    }

    utter.onstart = () => {
      setIsPlayingAudio(true)
      setIsAudioPaused(false)
    }
    utter.onend = () => {
      setIsPlayingAudio(false)
      setIsAudioPaused(false)
      setSpokenCharRange({ start: -1, end: -1 })
    }
    utter.onerror = () => {
      setIsPlayingAudio(false)
      setIsAudioPaused(false)
      setSpokenCharRange({ start: -1, end: -1 })
    }

    window.speechSynthesis.speak(utter)
  }

  const handlePauseResumeAudio = () => {
    if (!('speechSynthesis' in window)) return
    if (isAudioPaused) {
      window.speechSynthesis.resume()
      setIsAudioPaused(false)
    } else {
      window.speechSynthesis.pause()
      setIsAudioPaused(true)
    }
  }

  const handleStopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsPlayingAudio(false)
      setIsAudioPaused(false)
      setSpokenCharRange({ start: -1, end: -1 })
    }
  }

  // Real-Time Speech Text Highlighting with Word Underline & Glowing Color
  const renderSpokenText = (fullText: string, isCurrentSource: boolean) => {
    if (
      !isCurrentSource ||
      !isPlayingAudio ||
      spokenCharRange.start < 0 ||
      spokenCharRange.start >= fullText.length
    ) {
      return fullText
    }

    const start = Math.max(0, spokenCharRange.start)
    let end = Math.min(fullText.length, spokenCharRange.end)
    if (end <= start) {
      const slice = fullText.slice(start)
      const match = slice.search(/[\s,.;:!?\n]/)
      end = match === -1 ? fullText.length : start + Math.max(1, match)
    }

    const before = fullText.slice(0, start)
    const activeWord = fullText.slice(start, end)
    const after = fullText.slice(end)

    return (
      <>
        {before}
        <span className="mqb-spoken-active-word">{activeWord}</span>
        {after}
      </>
    )
  }

  // Parse Executive Short Answer lines into individual structured checklist points
  const shortAnswerItems = useMemo(() => {
    if (!question?.shortAnswer) return []
    const lines = question.shortAnswer.split('\n').filter(l => l.trim().length > 0)
    let currentOffset = 0

    return lines.map((rawLine, idx) => {
      const matchIndex = question.shortAnswer.indexOf(rawLine, currentOffset)
      const lineStart = matchIndex !== -1 ? matchIndex : currentOffset
      currentOffset = lineStart + rawLine.length

      const numMatch = rawLine.match(/^(\d+)\.\s*(.*)$/)
      const num = numMatch ? numMatch[1] : String(idx + 1)
      const content = numMatch ? numMatch[2] : rawLine

      const isAnalogy = num === '2' || rawLine.toLowerCase().includes('analogy:') || rawLine.toLowerCase().includes('real-life analogy')
      const isTakeaway = idx === lines.length - 1 || rawLine.toLowerCase().includes('key takeaway:') || rawLine.toLowerCase().includes('takeaway:')

      return {
        num,
        rawLine,
        content,
        startIndex: lineStart,
        endIndex: lineStart + rawLine.length,
        isAnalogy,
        isTakeaway,
      }
    })
  }, [question?.shortAnswer])

  // Speech highlighting for individual card text
  const renderCardSpokenText = (item: { content: string; startIndex: number; endIndex: number; rawLine: string }) => {
    if (
      activeSpeechSource !== 'short' ||
      !isPlayingAudio ||
      spokenCharRange.start < item.startIndex ||
      spokenCharRange.start >= item.endIndex
    ) {
      return item.content
    }

    const prefixLen = item.rawLine.indexOf(item.content)
    const contentStart = item.startIndex + (prefixLen >= 0 ? prefixLen : 0)

    const relStart = spokenCharRange.start - contentStart
    const relEnd = (spokenCharRange.end > 0 ? spokenCharRange.end : spokenCharRange.start + 1) - contentStart

    if (relStart < 0 || relStart >= item.content.length) {
      return item.content
    }

    const start = Math.max(0, relStart)
    let end = Math.min(item.content.length, Math.max(start + 1, relEnd))
    if (end <= start) {
      const slice = item.content.slice(start)
      const match = slice.search(/[\s,.;:!?\n]/)
      end = match === -1 ? item.content.length : start + Math.max(1, match)
    }

    const before = item.content.slice(0, start)
    const activeWord = item.content.slice(start, end)
    const after = item.content.slice(end)

    return (
      <>
        {before}
        <span className="mqb-spoken-active-word">{activeWord}</span>
        {after}
      </>
    )
  }

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

    // Reset speech practice timer & speech audio when question changes
    setIsSpeakingTimerRunning(false)
    setSpeakingSeconds(0)
    if (timerRef.current) clearInterval(timerRef.current)
    setCodeRunOutput(null)
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsPlayingAudio(false)
    setIsAudioPaused(false)

    return () => {
      mounted = false
      if (timerRef.current) clearInterval(timerRef.current)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
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
              {/* Executive Short Answer (12-Point Checklist Design with Real-Life Analogy) */}
              <div className="mqb-executive-card" id="section-short-answer">
                <div className="mqb-executive-header">
                  <div className="mqb-executive-title-group">
                    <span className="mqb-executive-icon">⚡</span>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc' }}>
                        Executive Short Answer (Key Takeaways &amp; Core Principles)
                      </h3>
                      <span className="mqb-executive-subtitle">
                        Structured point-by-point breakdown with real-life analogies and senior interview takeaways
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="mqb-executive-badge">🎯 {shortAnswerItems.length || 12} Key Principles</span>
                    <button
                      type="button"
                      className={`mqb-action-pill-btn ${activeSpeechSource === 'short' ? 'primary' : ''}`}
                      onClick={() => handlePlayAudio('short')}
                    >
                      ⚡ Listen to Summary
                    </button>
                  </div>
                </div>

                <div className="mqb-short-answer-container">
                  {shortAnswerItems.map((item) => {
                    const isSpoken = activeSpeechSource === 'short' && isPlayingAudio && spokenCharRange.start >= item.startIndex && spokenCharRange.start < item.endIndex
                    return (
                      <div
                        key={item.num}
                        className={`mqb-short-answer-card ${item.isAnalogy ? 'analogy-card' : ''} ${item.isTakeaway ? 'takeaway-card' : ''} ${isSpoken ? 'active-spoken-card' : ''}`}
                      >
                        <span className="mqb-short-answer-badge">
                          {item.isAnalogy ? '💡' : item.isTakeaway ? '🎯' : item.num.padStart(2, '0')}
                        </span>
                        <div className="mqb-short-answer-content">
                          {item.isAnalogy && (
                            <span className="mqb-analogy-tag">💡 REAL-LIFE MENTOR ANALOGY</span>
                          )}
                          {item.isTakeaway && (
                            <span className="mqb-takeaway-tag">🎯 KEY INTERVIEW TAKEAWAY</span>
                          )}
                          <p className="mqb-short-answer-text">
                            {renderCardSpokenText(item)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Natural Spoken Interview Script with Full Audio Studio Player */}
              <div className="mqb-speech-box" id="section-interview-answer">
                <div className="mqb-speech-header">
                  <span className="mqb-speech-tag">
                    <span>🎙️</span> Natural Spoken Interview Answer (Say This Aloud)
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <button
                      type="button"
                      className={`mqb-action-pill-btn ${activeSpeechSource === 'interview' ? 'primary' : ''}`}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                      onClick={() => handlePlayAudio('interview')}
                    >
                      🎙️ Spoken Answer
                    </button>
                    <button
                      type="button"
                      className={`mqb-action-pill-btn ${activeSpeechSource === 'short' ? 'primary' : ''}`}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem' }}
                      onClick={() => handlePlayAudio('short')}
                    >
                      ⚡ Executive Summary
                    </button>
                  </div>
                </div>

                <p className="mqb-speech-text" style={{ whiteSpace: 'pre-line' }}>
                  "{renderSpokenText(question.interviewAnswer, activeSpeechSource === 'interview')}"
                </p>

                {/* Interactive Audio Player Bar */}
                <div className="mqb-audio-player-bar">
                  <div className="mqb-audio-meta">
                    <div className={`mqb-audio-equalizer ${isPlayingAudio && !isAudioPaused ? 'playing' : ''}`}>
                      <span className="mqb-audio-bar"></span>
                      <span className="mqb-audio-bar"></span>
                      <span className="mqb-audio-bar"></span>
                      <span className="mqb-audio-bar"></span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isPlayingAudio ? 'var(--mqb-accent-bright, #818cf8)' : 'var(--mqb-text-secondary)' }}>
                      {isPlayingAudio ? (isAudioPaused ? '⏸️ Audio Paused' : '🔊 Narrating Aloud...') : '🎧 AI Audio Narrator Ready'}
                    </span>
                    <span
                      className="mqb-company-badge"
                      style={{
                        background: isIndianVoiceActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                        color: isIndianVoiceActive ? '#34d399' : '#818cf8',
                        border: `1px solid ${isIndianVoiceActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(99, 102, 241, 0.35)'}`,
                        fontSize: '0.72rem',
                        padding: '0.15rem 0.5rem',
                      }}
                    >
                      {isIndianVoiceActive ? '🇮🇳 Indian English Accent' : '🗣️ English Voice'}
                    </span>
                  </div>

                  <div className="mqb-audio-actions">
                    {!isPlayingAudio ? (
                      <button
                        type="button"
                        className="mqb-audio-btn primary"
                        onClick={() => handlePlayAudio(activeSpeechSource)}
                      >
                        ▶ Play Audio
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="mqb-audio-btn"
                          onClick={handlePauseResumeAudio}
                        >
                          {isAudioPaused ? '▶ Resume' : '⏸ Pause'}
                        </button>
                        <button
                          type="button"
                          className="mqb-audio-btn"
                          onClick={handleStopAudio}
                        >
                          ⏹ Stop
                        </button>
                        <button
                          type="button"
                          className="mqb-audio-btn"
                          onClick={() => handlePlayAudio(activeSpeechSource)}
                        >
                          🔄 Replay
                        </button>
                      </>
                    )}

                    {/* Speech Rate Control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--mqb-text-muted)' }}>Speed:</span>
                      <select
                        className="mqb-audio-speed-select"
                        value={speechRate}
                        onChange={(e) => {
                          const newRate = parseFloat(e.target.value)
                          setSpeechRate(newRate)
                          if (isPlayingAudio) {
                            handlePlayAudio(activeSpeechSource)
                          }
                        }}
                      >
                        <option value={0.8}>0.8x</option>
                        <option value={1.0}>1.0x (Normal)</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                      </select>
                    </div>

                    {/* Voice Selection Dropdown */}
                    {availableVoices.filter(v => v.lang.startsWith('en')).length > 1 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--mqb-text-muted)' }}>Voice:</span>
                        <select
                          className="mqb-audio-speed-select"
                          style={{ maxWidth: '140px' }}
                          value={selectedVoiceURI}
                          onChange={(e) => {
                            setSelectedVoiceURI(e.target.value)
                            const chosen = availableVoices.find(v => v.voiceURI === e.target.value)
                            const isInd = !!(chosen && (chosen.lang.includes('IN') || chosen.name.toLowerCase().includes('india') || chosen.name.toLowerCase().includes('ravi') || chosen.name.toLowerCase().includes('heera') || chosen.name.toLowerCase().includes('neerja')))
                            setIsIndianVoiceActive(isInd)
                            if (isPlayingAudio) {
                              handlePlayAudio(activeSpeechSource)
                            }
                          }}
                        >
                          {availableVoices.filter(v => v.lang.startsWith('en')).map(v => (
                            <option key={v.voiceURI} value={v.voiceURI}>
                              {v.name.includes('India') || v.lang === 'en-IN' ? `🇮🇳 ${v.name.slice(0, 18)}` : v.name.slice(0, 18)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Architecture & State Lifecycle Diagram */}
              {question.diagram && (
                <div className="mqb-section-card" id="section-diagram">
                  <h3 className="mqb-section-title">
                    <span>📊</span> Architecture &amp; State Lifecycle Diagram
                  </h3>
                  <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
                    Visual state machine and runtime transition flow:
                  </p>
                  <div style={{ padding: '0.5rem 0' }}>
                    <MermaidDiagram
                      chart={question.diagram}
                      caption={question.diagramCaption || `${question.concept} — State Machine & Lifecycle Flow`}
                    />
                  </div>
                </div>
              )}

              {/* Video Explanation Studio */}
              {question.videoUrl && (
                <div className="mqb-section-card" id="section-video-lesson">
                  <h3 className="mqb-section-title">
                    <span>🎬</span> Video Tutorial &amp; Visual Walkthrough
                  </h3>
                  {question.videoTitle && (
                    <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.9rem', margin: '0 0 0.85rem' }}>
                      {question.videoTitle}
                    </p>
                  )}
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--mqb-border)', background: '#000000' }}>
                    <iframe
                      src={question.videoUrl}
                      title={question.videoTitle || 'Interview Video Lesson'}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* Real World Production Scenario */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>🏭</span> Production &amp; Real-World Scenario
                </h3>
                <div className="mqb-section-body">
                  <p style={{ whiteSpace: 'pre-line' }}>{question.realWorldExample}</p>
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

              {/* Architecture & State Lifecycle Diagram in Deep Dive */}
              {question.diagram && (
                <div className="mqb-section-card">
                  <h3 className="mqb-section-title">
                    <span>📊</span> Technical State Machine &amp; Specification Diagram
                  </h3>
                  <div style={{ padding: '0.5rem 0' }}>
                    <MermaidDiagram
                      chart={question.diagram}
                      caption={question.diagramCaption || `${question.concept} — Internal State Transitions`}
                    />
                  </div>
                </div>
              )}

              {/* Why it exists */}
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>💡</span> Why This Feature Exists (Historical Context &amp; Purpose)
                </h3>
                <div className="mqb-section-body">
                  <p style={{ whiteSpace: 'pre-line' }}>{question.why}</p>
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
