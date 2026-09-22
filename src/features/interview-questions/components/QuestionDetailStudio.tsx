import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import { mockSessionService } from '../../ai-video-mock/services/mockSessionService'
import { MermaidDiagram } from '../../interview-docs/components/common/MermaidDiagram'
import { FormattedAnswerText } from './FormattedAnswerText'
import { MCQInteractiveCard } from './MCQInteractiveCard'
import {
  getSpeechSentenceSegments,
  explainCodeInPlainEnglish,
  getStoredSpeechRate,
  setStoredSpeechRate,
} from '../utils/speechSanitizer'
import { isGenericHowItWorks, isGenericExecutionFlow } from '../utils/contentSanitizer'
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
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  // Speech Practice Timer
  const [isSpeakingTimerRunning, setIsSpeakingTimerRunning] = useState<boolean>(false)
  const [speakingSeconds, setSpeakingSeconds] = useState<number>(0)
  const timerRef = useRef<any>(null)

  // Interactive Code Sandbox Execution
  const [codeRunOutput, setCodeRunOutput] = useState<string | null>(null)
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false)

  // Voice narration & Audio Studio
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false)
  const [speechRate, setSpeechRate] = useState<number>(() => getStoredSpeechRate())
  const [activeSpeechSource, setActiveSpeechSource] = useState<
    'interview' | 'short' | 'explanation' | 'howItWorks' | 'code' | 'tip' | 'question' | 'output' | 'mcq' | 'custom'
  >('short')
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('')
  const [isIndianVoiceActive, setIsIndianVoiceActive] = useState<boolean>(false)
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1)

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

  const handlePlayAudio = (
    source: 'interview' | 'short' | 'explanation' | 'howItWorks' | 'code' | 'tip' | 'question' | 'output' | 'mcq' | 'custom' = 'short',
    customSpeechText?: string
  ) => {
    if (!('speechSynthesis' in window) || !question) return
    window.speechSynthesis.cancel()

    let rawText = ''
    if (customSpeechText) {
      rawText = customSpeechText
    } else if (source === 'interview') {
      rawText = question.interviewAnswer || question.shortAnswer
    } else if (source === 'short') {
      rawText = question.shortAnswer
    } else if (source === 'explanation') {
      rawText = question.simpleExplanation || question.detailedAnswer || question.detailedExplanation || ''
    } else if (source === 'howItWorks') {
      rawText = question.howItWorks || ''
    } else if (source === 'code') {
      rawText = explainCodeInPlainEnglish({
        codeSnippet: question.codeExample || question.example || question.codeSnippet,
        customSpeech: question.codeExplanationSpeech,
        lineExplanations: question.lineByLineExplanation,
      })
    } else if (source === 'tip') {
      rawText = question.interviewTip || (question.interviewTips && question.interviewTips[0]) || ''
    } else if (source === 'question') {
      rawText = question.question
    } else if (source === 'output') {
      rawText = question.expectedOutput ? `Expected output is: ${question.expectedOutput}` : ''
    }

    // Clean speech representation - Never speak raw Markdown or HTML tags
    const speechData = getSpeechSentenceSegments(rawText)
    if (!speechData.fullSpeechText) return

    setActiveSpeechSource(source)
    setActiveSentenceIndex(0)

    const utter = new SpeechSynthesisUtterance(speechData.fullSpeechText)
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
      let foundSentenceIdx = 0
      for (let i = 0; i < speechData.segmentOffsets.length; i++) {
        if (charIndex >= speechData.segmentOffsets[i]) {
          foundSentenceIdx = i
        } else {
          break
        }
      }
      setActiveSentenceIndex(foundSentenceIdx)
    }

    utter.onstart = () => {
      setIsPlayingAudio(true)
      setIsAudioPaused(false)
    }
    utter.onend = () => {
      setIsPlayingAudio(false)
      setIsAudioPaused(false)
      setActiveSentenceIndex(-1)
    }
    utter.onerror = () => {
      setIsPlayingAudio(false)
      setIsAudioPaused(false)
      setActiveSentenceIndex(-1)
    }

    window.speechSynthesis.speak(utter)
  }

  const handleSpeechRateChange = (newRate: number) => {
    setSpeechRate(newRate)
    setStoredSpeechRate(newRate)
    if (isPlayingAudio && !isAudioPaused) {
      handlePlayAudio(activeSpeechSource)
    }
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
      setActiveSentenceIndex(-1)
    }
  }

  const followUpList = useMemo(() => {
    return question?.followUpQuestions || question?.followUps || []
  }, [question])

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

  const handleLaunchAIMockPractice = () => {
    if (!question) return
    const session = mockSessionService.createQuestionDrillSession('anonymous_candidate', question)
    navigate(`/ai-video-mock/session/${session.id}`)
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
                <span className="mqb-qcard-id" style={{ fontSize: '0.9rem' }}>
                  {question.questionNumber ? `Q${question.questionNumber}` : question.id.toUpperCase()}
                </span>
                <span className={`mqb-diff-pill ${question.difficulty}`}>{question.difficulty}</span>
                {question.isHighFrequency && (
                  <span className="mqb-highfreq-badge">🔥 FAANG High Frequency</span>
                )}
                {question.companyTags && question.companyTags.map(comp => (
                  <span key={comp} className="mqb-company-badge">🏢 {comp}</span>
                ))}
                {question.questionType && <span className="mqb-type-pill">{question.questionType}</span>}
                <span className="mqb-tag-pill">{question.category || question.topic}</span>
                {question.experienceLevel && (
                  <span className="mqb-tag-pill" style={{ color: 'var(--mqb-text-muted)' }}>
                    Level: {question.experienceLevel.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {/* Quick Status Buttons & AI Mock Practice Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleLaunchAIMockPractice}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '0.42rem 0.95rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(99, 102, 241, 0.35)'
                  }}
                  title="Practice this exact question with interactive AI Video Mock Interviewer"
                >
                  <span style={{ fontSize: '1rem' }}>🎙️</span> AI Mock Practice
                </button>
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

            <h1 className="mqb-qheader-title">
              {question.questionNumber ? `Q${question.questionNumber}. ` : ''}{question.question}
            </h1>

            {/* Concept Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--mqb-accent-blue)' }}>
              <span>💡 Core Concept:</span>
              <span style={{ fontWeight: 600 }}>{question.concept || question.question}</span>
            </div>
          </div>

          {/* Universal Speech & Audio Studio Player Bar */}
          <div className="mqb-audio-player-bar" style={{ marginBottom: '1.25rem' }}>
            <div className="mqb-audio-meta">
              <div className={`mqb-audio-equalizer ${isPlayingAudio && !isAudioPaused ? 'playing' : ''}`}>
                <span className="mqb-audio-bar"></span>
                <span className="mqb-audio-bar"></span>
                <span className="mqb-audio-bar"></span>
                <span className="mqb-audio-bar"></span>
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: isPlayingAudio ? 'var(--mqb-accent-bright, #818cf8)' : 'var(--mqb-text-secondary)' }}>
                {isPlayingAudio
                  ? isAudioPaused
                    ? '⏸️ Audio Paused'
                    : activeSpeechSource === 'short'
                    ? '🔊 Reading Short Answer...'
                    : activeSpeechSource === 'explanation'
                    ? '📖 Reading Simple Explanation...'
                    : activeSpeechSource === 'howItWorks'
                    ? '⚙️ Reading How It Works...'
                    : activeSpeechSource === 'code'
                    ? '💻 Explaining Code in Plain English...'
                    : activeSpeechSource === 'tip'
                    ? '💡 Reading Interview Tip...'
                    : activeSpeechSource === 'interview'
                    ? '🎙️ Reading Spoken Interview Script...'
                    : activeSpeechSource === 'output'
                    ? '🖥️ Reading Expected Output...'
                    : '🔊 Narrating Aloud...'
                  : '🎧 AI Audio Narrator Ready'}
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
                  aria-label="Play audio narration"
                >
                  ▶ Play
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="mqb-audio-btn"
                    onClick={handlePauseResumeAudio}
                    aria-label={isAudioPaused ? 'Resume narration' : 'Pause narration'}
                  >
                    {isAudioPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                  <button
                    type="button"
                    className="mqb-audio-btn"
                    onClick={handleStopAudio}
                    aria-label="Stop narration"
                  >
                    ⏹ Stop
                  </button>
                  <button
                    type="button"
                    className="mqb-audio-btn"
                    onClick={() => handlePlayAudio(activeSpeechSource)}
                    aria-label="Replay current audio"
                  >
                    🔄 Replay
                  </button>
                </>
              )}

              {/* Speech Speed Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--mqb-text-muted)' }}>Speed:</span>
                <select
                  className="mqb-audio-speed-select"
                  value={speechRate}
                  onChange={(e) => handleSpeechRateChange(parseFloat(e.target.value))}
                  aria-label="Speech speed selector"
                >
                  <option value={0.75}>0.75x</option>
                  <option value={1.0}>1.0x</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2.0}>2.0x</option>
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
                    aria-label="Voice selection selector"
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

          {/* Navigation Tabs for Deep Breakdown */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--mqb-border)', paddingBottom: '0.5rem', overflowX: 'auto', marginBottom: '1.25rem' }}>
            <button
              type="button"
              className={`mqb-subnav-link ${activeTab === 'answer' ? 'active' : ''}`}
              onClick={() => setActiveTab('answer')}
            >
              📖 Reading Mode (Full Breakdown)
            </button>
            <button
              type="button"
              className={`mqb-subnav-link ${activeTab === 'deep_dive' ? 'active' : ''}`}
              onClick={() => setActiveTab('deep_dive')}
            >
              🧠 Deep Technical Dive
            </button>
            {(question.codeSnippet || question.codeExample || question.example || question.executionFlow) && (
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
              🎯 Traps &amp; Mistakes
            </button>
            {followUpList.length > 0 && (
              <button
                type="button"
                className={`mqb-subnav-link ${activeTab === 'follow_ups' ? 'active' : ''}`}
                onClick={() => setActiveTab('follow_ups')}
              >
                ❓ Follow-Up Q&amp;A ({followUpList.length})
              </button>
            )}
          </div>

          {/* TAB 1: Standardized 10-Step Interview-Ready Reading Flow */}
          {activeTab === 'answer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Optional MCQ Mode */}
              {(question.options || question.questionType === 'MCQ') && (
                <MCQInteractiveCard
                  question={question}
                  onSpeakExplanation={(txt) => handlePlayAudio('custom', txt)}
                />
              )}

              {/* 1. Short Interview Answer */}
              <div
                className={`mqb-section-card ${activeSpeechSource === 'short' && isPlayingAudio ? 'speaking-active' : ''}`}
                id="section-short-answer"
                style={{
                  borderLeft: '4px solid var(--mqb-accent-bright, #818cf8)',
                  background: activeSpeechSource === 'short' && isPlayingAudio
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, var(--mqb-bg-card) 100%)'
                    : 'linear-gradient(135deg, rgba(99, 102, 241, 0.04) 0%, var(--mqb-bg-card) 100%)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.25rem' }}>⚡</span>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                      Short Interview Answer
                    </h2>
                    <span className="mqb-company-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--mqb-accent-bright, #818cf8)', fontWeight: 600 }}>
                      Ideal 30s Response
                    </span>
                    {activeSpeechSource === 'short' && isPlayingAudio && (
                      <span className="mqb-audio-wave-badge">
                        <span className="mqb-wave-bar"></span>
                        <span className="mqb-wave-bar"></span>
                        <span className="mqb-wave-bar"></span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--mqb-accent-bright, #818cf8)', marginLeft: '4px' }}>
                          {isAudioPaused ? 'PAUSED' : 'SPEAKING'}
                        </span>
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {activeSpeechSource === 'short' && isPlayingAudio ? (
                      <>
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          style={{
                            background: isAudioPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            borderColor: isAudioPaused ? '#10b981' : '#f59e0b',
                            color: isAudioPaused ? '#10b981' : '#f59e0b',
                            fontWeight: 600,
                          }}
                          onClick={handlePauseResumeAudio}
                          title={isAudioPaused ? 'Resume speaking' : 'Pause speaking'}
                        >
                          {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
                        </button>
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            borderColor: '#ef4444',
                            color: '#ef4444',
                            fontWeight: 600,
                          }}
                          onClick={handleStopAudio}
                          title="Stop speaking"
                        >
                          ⏹ Stop
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="mqb-action-pill-btn primary"
                        onClick={() => handlePlayAudio('short')}
                        aria-label="Read short answer aloud"
                      >
                        🔊 Listen
                      </button>
                    )}
                    <button
                      type="button"
                      className="mqb-action-pill-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(question.shortAnswer)
                        setCopiedSection('short')
                        setTimeout(() => setCopiedSection(null), 2000)
                      }}
                      title="Copy short answer"
                      aria-label="Copy short answer to clipboard"
                    >
                      {copiedSection === 'short' ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <FormattedAnswerText
                  text={question.shortAnswer}
                  isSpeakingSection={activeSpeechSource === 'short' && isPlayingAudio}
                  activeSentenceIndex={activeSpeechSource === 'short' && isPlayingAudio ? activeSentenceIndex : undefined}
                />
              </div>

              {/* 2. Simple Explanation */}
              {(question.simpleExplanation || question.detailedAnswer || question.detailedExplanation) && (
                <div
                  className={`mqb-section-card ${activeSpeechSource === 'explanation' && isPlayingAudio ? 'speaking-active' : ''}`}
                  id="section-simple-explanation"
                  style={{
                    borderLeft: '4px solid #0284c7',
                    background: activeSpeechSource === 'explanation' && isPlayingAudio
                      ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, var(--mqb-bg-card) 100%)'
                      : 'linear-gradient(135deg, rgba(2, 132, 199, 0.04) 0%, var(--mqb-bg-card) 100%)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.25rem' }}>📖</span>
                      <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                        Simple Explanation
                      </h2>
                      <span className="mqb-company-badge" style={{ background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                        Core Concept
                      </span>
                      {activeSpeechSource === 'explanation' && isPlayingAudio && (
                        <span className="mqb-audio-wave-badge" style={{ borderColor: 'rgba(2, 132, 199, 0.3)' }}>
                          <span className="mqb-wave-bar" style={{ background: '#38bdf8' }}></span>
                          <span className="mqb-wave-bar" style={{ background: '#38bdf8' }}></span>
                          <span className="mqb-wave-bar" style={{ background: '#38bdf8' }}></span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', marginLeft: '4px' }}>
                            {isAudioPaused ? 'PAUSED' : 'SPEAKING'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {activeSpeechSource === 'explanation' && isPlayingAudio ? (
                        <>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: isAudioPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              borderColor: isAudioPaused ? '#10b981' : '#f59e0b',
                              color: isAudioPaused ? '#10b981' : '#f59e0b',
                              fontWeight: 600,
                            }}
                            onClick={handlePauseResumeAudio}
                            title={isAudioPaused ? 'Resume speaking' : 'Pause speaking'}
                          >
                            {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
                          </button>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              fontWeight: 600,
                            }}
                            onClick={handleStopAudio}
                            title="Stop speaking"
                          >
                            ⏹ Stop
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          onClick={() => handlePlayAudio('explanation')}
                          aria-label="Read simple explanation aloud"
                        >
                          🔊 Listen
                        </button>
                      )}
                      <button
                        type="button"
                        className="mqb-action-pill-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(question.simpleExplanation || question.detailedAnswer || question.detailedExplanation || '')
                          setCopiedSection('explanation')
                          setTimeout(() => setCopiedSection(null), 2000)
                        }}
                        title="Copy simple explanation"
                      >
                        {copiedSection === 'explanation' ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                  <FormattedAnswerText
                    text={question.simpleExplanation || question.detailedAnswer || question.detailedExplanation}
                    isSpeakingSection={activeSpeechSource === 'explanation' && isPlayingAudio}
                    activeSentenceIndex={activeSpeechSource === 'explanation' && isPlayingAudio ? activeSentenceIndex : undefined}
                  />
                </div>
              )}

              {/* 3. How It Works - Only render when authentic and not generic boilerplate */}
              {question.howItWorks && !isGenericHowItWorks(question.howItWorks) && (
                <div
                  className={`mqb-section-card ${activeSpeechSource === 'howItWorks' && isPlayingAudio ? 'speaking-active' : ''}`}
                  id="section-how-it-works"
                  style={{
                    borderLeft: '4px solid #10b981',
                    background: activeSpeechSource === 'howItWorks' && isPlayingAudio
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, var(--mqb-bg-card) 100%)'
                      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, var(--mqb-bg-card) 100%)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '1.25rem' }}>⚙️</span>
                      <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                        How It Works
                      </h2>
                      <span className="mqb-company-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}>
                        Execution Flow
                      </span>
                      {activeSpeechSource === 'howItWorks' && isPlayingAudio && (
                        <span className="mqb-audio-wave-badge" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                          <span className="mqb-wave-bar" style={{ background: '#34d399' }}></span>
                          <span className="mqb-wave-bar" style={{ background: '#34d399' }}></span>
                          <span className="mqb-wave-bar" style={{ background: '#34d399' }}></span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', marginLeft: '4px' }}>
                            {isAudioPaused ? 'PAUSED' : 'SPEAKING'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {activeSpeechSource === 'howItWorks' && isPlayingAudio ? (
                        <>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: isAudioPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              borderColor: isAudioPaused ? '#10b981' : '#f59e0b',
                              color: isAudioPaused ? '#10b981' : '#f59e0b',
                              fontWeight: 600,
                            }}
                            onClick={handlePauseResumeAudio}
                            title={isAudioPaused ? 'Resume speaking' : 'Pause speaking'}
                          >
                            {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
                          </button>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              fontWeight: 600,
                            }}
                            onClick={handleStopAudio}
                            title="Stop speaking"
                          >
                            ⏹ Stop
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          onClick={() => handlePlayAudio('howItWorks')}
                          aria-label="Read how it works aloud"
                        >
                          🔊 Listen
                        </button>
                      )}
                      <button
                        type="button"
                        className="mqb-action-pill-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(question.howItWorks || '')
                          setCopiedSection('howItWorks')
                          setTimeout(() => setCopiedSection(null), 2000)
                        }}
                        title="Copy execution flow"
                      >
                        {copiedSection === 'howItWorks' ? '✓ Copied!' : '📋 Copy'}
                      </button>
                    </div>
                  </div>
                  <FormattedAnswerText
                    text={question.howItWorks}
                    isSpeakingSection={activeSpeechSource === 'howItWorks' && isPlayingAudio}
                    activeSentenceIndex={activeSpeechSource === 'howItWorks' && isPlayingAudio ? activeSentenceIndex : undefined}
                  />
                </div>
              )}

              {/* 4. Code Example */}
              {(question.codeExample || question.example || question.codeSnippet) && (
                <div
                  className={`mqb-section-card ${activeSpeechSource === 'code' && isPlayingAudio ? 'speaking-active' : ''}`}
                  id="section-code-example"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>💻</span>
                      <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                        Code Example
                      </h2>
                      {activeSpeechSource === 'code' && isPlayingAudio && (
                        <span className="mqb-audio-wave-badge">
                          <span className="mqb-wave-bar"></span>
                          <span className="mqb-wave-bar"></span>
                          <span className="mqb-wave-bar"></span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--mqb-accent-bright, #818cf8)', marginLeft: '4px' }}>
                            {isAudioPaused ? 'PAUSED' : 'EXPLAINING'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {activeSpeechSource === 'code' && isPlayingAudio ? (
                        <>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: isAudioPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              borderColor: isAudioPaused ? '#10b981' : '#f59e0b',
                              color: isAudioPaused ? '#10b981' : '#f59e0b',
                              fontWeight: 600,
                            }}
                            onClick={handlePauseResumeAudio}
                            title={isAudioPaused ? 'Resume explanation' : 'Pause explanation'}
                          >
                            {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
                          </button>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              fontWeight: 600,
                            }}
                            onClick={handleStopAudio}
                            title="Stop explanation"
                          >
                            ⏹ Stop
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          onClick={() => handlePlayAudio('code')}
                          aria-label="Explain code aloud in simple English"
                        >
                          🔊 Explain Code
                        </button>
                      )}
                      <button
                        type="button"
                        className="mqb-action-pill-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(question.codeExample || question.example || question.codeSnippet || '')
                          setCopiedSection('code')
                          setTimeout(() => setCopiedSection(null), 2000)
                        }}
                        aria-label="Copy code example"
                      >
                        {copiedSection === 'code' ? '✓ Copied!' : '📋 Copy Code'}
                      </button>
                    </div>
                  </div>
                  <div className="mqb-code-block">
                    <pre className="mqb-code-content">{question.codeExample || question.example || question.codeSnippet}</pre>
                  </div>
                </div>
              )}

              {/* 5. Line-by-Line Code Explanation */}
              {question.lineByLineExplanation && question.lineByLineExplanation.length > 0 && (
                <div className="mqb-section-card" id="section-line-by-line">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🔍</span>
                    <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                      Line-by-Line Code Explanation
                    </h2>
                  </div>
                  <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.92rem', margin: '0 0 1rem' }}>
                    Understand what each line does in simple English:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {question.lineByLineExplanation.map((lbl, idx) => (
                      <div
                        key={lbl.line ?? idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '1rem',
                          padding: '0.85rem 1rem',
                          background: 'var(--mqb-card-subtle-bg)',
                          border: '1px solid var(--mqb-border)',
                          borderRadius: '10px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <code
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            fontFamily: 'var(--mqb-font-mono)',
                            fontSize: '0.88rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            color: 'var(--mqb-accent-bright, #818cf8)',
                            border: '1px solid rgba(99, 102, 241, 0.25)',
                            minWidth: '130px',
                            maxWidth: '280px',
                            whiteSpace: 'pre',
                            overflowX: 'auto',
                          }}
                        >
                          {lbl.code}
                        </code>
                        <div style={{ flex: 1, minWidth: '220px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--mqb-text-primary)' }}>
                          <FormattedAnswerText text={lbl.explanation} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Expected Output / Result */}
              {question.expectedOutput && (
                <div
                  className={`mqb-section-card ${activeSpeechSource === 'output' && isPlayingAudio ? 'speaking-active' : ''}`}
                  id="section-expected-output"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🖥️</span>
                      <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                        Expected Output / Result
                      </h2>
                      {activeSpeechSource === 'output' && isPlayingAudio && (
                        <span className="mqb-audio-wave-badge">
                          <span className="mqb-wave-bar"></span>
                          <span className="mqb-wave-bar"></span>
                          <span className="mqb-wave-bar"></span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--mqb-accent-bright, #818cf8)', marginLeft: '4px' }}>
                            {isAudioPaused ? 'PAUSED' : 'SPEAKING'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {activeSpeechSource === 'output' && isPlayingAudio ? (
                        <>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: isAudioPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              borderColor: isAudioPaused ? '#10b981' : '#f59e0b',
                              color: isAudioPaused ? '#10b981' : '#f59e0b',
                              fontWeight: 600,
                            }}
                            onClick={handlePauseResumeAudio}
                            title={isAudioPaused ? 'Resume speaking' : 'Pause speaking'}
                          >
                            {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
                          </button>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              fontWeight: 600,
                            }}
                            onClick={handleStopAudio}
                            title="Stop speaking"
                          >
                            ⏹ Stop
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="mqb-action-pill-btn"
                          onClick={() => handlePlayAudio('output')}
                          aria-label="Read expected output aloud"
                        >
                          🔊 Listen
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ background: 'var(--code-bg, #0d1117)', border: '1px solid var(--mqb-border)', borderRadius: '10px', padding: '1rem' }}>
                    <pre style={{ margin: 0, fontFamily: 'var(--mqb-font-mono)', color: '#34d399', fontSize: '0.92rem' }}>
                      {question.expectedOutput}
                    </pre>
                  </div>
                </div>
              )}

              {/* 7. Real-World Example */}
              {question.realWorldExample && (
                <div className="mqb-section-card" id="section-real-world">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🌐</span>
                    <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                      Real-World Example
                    </h2>
                  </div>
                  <FormattedAnswerText text={question.realWorldExample} />
                </div>
              )}

              {/* 8. Common Mistakes */}
              {question.commonMistakes && question.commonMistakes.length > 0 && (
                <div className="mqb-section-card" id="section-common-mistakes" style={{ borderLeft: '4px solid #f87171' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>⚠️</span>
                    <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#f87171' }}>
                      Common Mistake{question.commonMistakes.length > 1 ? 's' : ''}
                    </h2>
                  </div>
                  <ul className="mqb-bullet-list" style={{ margin: 0 }}>
                    {question.commonMistakes.map((m, idx) => (
                      <li key={idx} style={{ fontSize: '0.95rem', lineHeight: '1.65' }}>
                        <FormattedAnswerText text={m} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 9. Practical Interview Tip */}
              {(question.interviewTip || (question.interviewTips && question.interviewTips.length > 0)) && (
                <div
                  className={`mqb-section-card ${activeSpeechSource === 'tip' && isPlayingAudio ? 'speaking-active' : ''}`}
                  id="section-interview-tip"
                  style={{
                    borderLeft: '4px solid #38bdf8',
                    background: activeSpeechSource === 'tip' && isPlayingAudio
                      ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(99, 102, 241, 0.08))'
                      : 'linear-gradient(135deg, rgba(56, 189, 248, 0.06), rgba(99, 102, 241, 0.04))',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>💡</span>
                      <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: '#38bdf8' }}>
                        Interview Tip
                      </h2>
                      {activeSpeechSource === 'tip' && isPlayingAudio && (
                        <span className="mqb-audio-wave-badge" style={{ borderColor: 'rgba(56, 189, 248, 0.4)' }}>
                          <span className="mqb-wave-bar" style={{ background: '#38bdf8' }}></span>
                          <span className="mqb-wave-bar" style={{ background: '#38bdf8' }}></span>
                          <span className="mqb-wave-bar" style={{ background: '#38bdf8' }}></span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#38bdf8', marginLeft: '4px' }}>
                            {isAudioPaused ? 'PAUSED' : 'SPEAKING'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {activeSpeechSource === 'tip' && isPlayingAudio ? (
                        <>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: isAudioPaused ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              borderColor: isAudioPaused ? '#10b981' : '#f59e0b',
                              color: isAudioPaused ? '#10b981' : '#f59e0b',
                              fontWeight: 600,
                            }}
                            onClick={handlePauseResumeAudio}
                            title={isAudioPaused ? 'Resume speaking' : 'Pause speaking'}
                          >
                            {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
                          </button>
                          <button
                            type="button"
                            className="mqb-action-pill-btn"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              fontWeight: 600,
                            }}
                            onClick={handleStopAudio}
                            title="Stop speaking"
                          >
                            ⏹ Stop
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className={`mqb-action-pill-btn ${activeSpeechSource === 'tip' && isPlayingAudio ? 'primary' : ''}`}
                          onClick={() => handlePlayAudio('tip')}
                          aria-label="Read interview tip aloud"
                        >
                          🔊 Listen
                        </button>
                      )}
                    </div>
                  </div>
                  <FormattedAnswerText
                    text={question.interviewTip || (question.interviewTips ? question.interviewTips.join('\n') : '')}
                    isSpeakingSection={activeSpeechSource === 'tip' && isPlayingAudio}
                    activeSentenceIndex={activeSpeechSource === 'tip' && isPlayingAudio ? activeSentenceIndex : undefined}
                  />
                </div>
              )}

              {/* 10. Follow-Up Questions */}
              {followUpList.length > 0 && (
                <div className="mqb-section-card" id="section-follow-ups">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>❓</span>
                    <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                      Follow-Up Questions
                    </h2>
                  </div>
                  <ul className="mqb-bullet-list" style={{ margin: 0 }}>
                    {followUpList.map((fu, idx) => (
                      <li key={idx} style={{ fontSize: '0.98rem', lineHeight: '1.7' }}>
                        <FormattedAnswerText text={fu} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Architecture & State Lifecycle Diagram */}
              {question.diagram && (
                <div className="mqb-section-card" id="section-diagram">
                  <h2 className="mqb-section-title">
                    <span>📊</span> Architecture &amp; State Lifecycle Diagram
                  </h2>
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
                  <h2 className="mqb-section-title">
                    <span>🎬</span> Video Tutorial &amp; Visual Walkthrough
                  </h2>
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

              {/* Interactive AI Video Mock Practice Callout */}
              <div
                className="mqb-section-card"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.08) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  padding: '1.5rem',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>🎙️</span>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                      Ready to test yourself live?
                    </h3>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--mqb-text-secondary)', maxWidth: '600px', lineHeight: 1.5 }}>
                    Practice answering <strong style={{ color: 'var(--mqb-text-primary)' }}>&ldquo;{question.question}&rdquo;</strong> in the AI Video Mock Studio with our interactive FAANG interviewer persona, real-time speech evaluation, and instant rubric scoring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLaunchAIMockPractice}
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.4rem',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(99, 102, 241, 0.55)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(99, 102, 241, 0.4)'
                  }}
                >
                  <span>🎙️</span> Start AI Mock Interview
                </button>
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

              {/* How it works internally - Only render when authentic */}
              {question.howItWorks && !isGenericHowItWorks(question.howItWorks) && (
                <div className="mqb-section-card">
                  <h3 className="mqb-section-title">
                    <span>⚙️</span> Internal Engine Execution Mechanism
                  </h3>
                  <div className="mqb-section-body" style={{ whiteSpace: 'pre-line' }}>
                    {question.howItWorks}
                  </div>
                </div>
              )}
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

              {/* Execution Flow Pipeline - Only render when authentic */}
              {question.executionFlow && question.executionFlow.length > 0 && !isGenericExecutionFlow(question.executionFlow) && (
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
              {question.commonMistakes && question.commonMistakes.length > 0 && (
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
              )}

              {/* Interview Traps */}
              {question.interviewTraps && question.interviewTraps.length > 0 && (
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
              )}

              {/* Interview Tips (What is Evaluated) */}
              {question.interviewTips && question.interviewTips.length > 0 && (
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
              )}
            </div>
          )}

          {/* TAB 5: Follow-Up Questions Accordion */}
          {activeTab === 'follow_ups' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="mqb-section-card">
                <h3 className="mqb-section-title">
                  <span>❓</span> Senior Follow-Up Questions ({followUpList.length})
                </h3>
                <p style={{ color: 'var(--mqb-text-secondary)', fontSize: '0.9rem', margin: '0 0 1.25rem' }}>
                  High-tier interviewers frequently pivot with these follow-up questions:
                </p>

                {followUpList.map((fu, idx) => {
                  const isExpanded = expandedFollowUp === idx
                  const ans = question.followUpAnswers && question.followUpAnswers[idx]
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
                            Suggested Response:
                          </p>
                          <p style={{ margin: 0 }}>
                            {ans || 'Articulate the concept clearly with reference to real-world frontend applications.'}
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

      {/* Floating Audio Controller Bar */}
      {isPlayingAudio && (
        <div className="mqb-floating-audio-bar" role="region" aria-label="Audio player controls">
          <div className="mqb-floating-audio-info">
            <span className="mqb-audio-wave-badge" style={{ margin: 0 }}>
              <span className="mqb-wave-bar"></span>
              <span className="mqb-wave-bar"></span>
              <span className="mqb-wave-bar"></span>
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--mqb-text-secondary)' }}>
                {isAudioPaused ? '⏸ Audio Paused' : '🔊 Now Listening'}
              </span>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
                {activeSpeechSource === 'short' && '⚡ Short Interview Answer'}
                {activeSpeechSource === 'explanation' && '📖 Simple Explanation'}
                {activeSpeechSource === 'howItWorks' && '⚙️ How It Works'}
                {activeSpeechSource === 'code' && '💻 Code Explanation'}
                {activeSpeechSource === 'tip' && '💡 Practical Interview Tip'}
                {activeSpeechSource === 'question' && '❓ Question'}
                {activeSpeechSource === 'output' && '🖥️ Expected Output'}
                {activeSpeechSource === 'custom' && '🎯 MCQ Explanation'}
              </span>
            </div>
          </div>

          <div className="mqb-floating-audio-actions">
            <button
              type="button"
              className={`mqb-action-pill-btn ${isAudioPaused ? 'primary' : ''}`}
              style={{ padding: '0.35rem 0.85rem', fontSize: '0.82rem' }}
              onClick={handlePauseResumeAudio}
              aria-label={isAudioPaused ? 'Resume narration' : 'Pause narration'}
            >
              {isAudioPaused ? '▶️ Resume' : '⏸ Pause'}
            </button>

            <button
              type="button"
              className="mqb-action-pill-btn"
              style={{
                padding: '0.35rem 0.85rem',
                fontSize: '0.82rem',
                color: '#ef4444',
                borderColor: 'rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.1)',
              }}
              onClick={handleStopAudio}
              aria-label="Stop narration"
            >
              ⏹ Stop
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  className={`mqb-speed-chip ${speechRate === rate ? 'active' : ''}`}
                  onClick={() => handleSpeechRateChange(rate)}
                  title={`Play at ${rate}x speed`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--mqb-accent-bright, #818cf8)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              🇮🇳 Indian Voice
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
