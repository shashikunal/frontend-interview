import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import {
  getSpeechSentenceSegments,
  getStoredSpeechRate,
} from '../utils/speechSanitizer'
import { SkeletonLoader } from '../../../components/common/SkeletonLoader'
import { FormattedAnswerText } from './FormattedAnswerText'
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

  // Voice narration
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [isAudioPaused, setIsAudioPaused] = useState<boolean>(false)
  const [speechRate] = useState<number>(() => getStoredSpeechRate())
  const [activeSpeechSource, setActiveSpeechSource] = useState<'short' | 'explanation'>('short')
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('')
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(-1)

  // Load and auto-select Indian English voice
  useEffect(() => {
    if (!('speechSynthesis' in window)) return

    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices()
      if (!all || all.length === 0) return
      setAvailableVoices(all)

      // Prefer Indian English (en-IN), else any English voice
      const indianVoice = all.find(
        v => v.lang === 'en-IN' ||
             v.lang.toLowerCase().replace('_', '-').includes('en-in') ||
             v.name.toLowerCase().includes('india')
      )

      const chosen = indianVoice || all.find(v => v.lang.startsWith('en')) || all[0]
      if (chosen) setSelectedVoiceURI(chosen.voiceURI)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const handlePlayAudio = (source: 'short' | 'explanation' = 'short') => {
    if (!('speechSynthesis' in window) || !question) return
    window.speechSynthesis.cancel()

    const rawText = source === 'explanation'
      ? question.simpleExplanation || question.detailedAnswer || question.detailedExplanation || ''
      : question.shortAnswer

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

    // Reset speech audio when question changes
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsPlayingAudio(false)
    setIsAudioPaused(false)

    return () => {
      mounted = false
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [subjectId, questionId])

  // Previous & Next Question Navigation
  const currentIndex = allQuestions.findIndex(q => q.id.toLowerCase() === questionId?.toLowerCase())
  const prevQuestion = currentIndex > 0 ? allQuestions[currentIndex - 1] : null
  const nextQuestion = currentIndex >= 0 && currentIndex < allQuestions.length - 1 ? allQuestions[currentIndex + 1] : null

  if (loading) {
    return (
      <div style={{ padding: '24px' }}>
        <SkeletonLoader variant="studio" />
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

  return (
    <div className="mqb-detail-view" id={`question-detail-${question.id}`}>

      {/* Breadcrumb */}
      <div className="mqb-breadcrumb" style={{ marginBottom: '1.25rem' }}>
        <Link to="/interview-questions">All Subjects</Link>
        <span>/</span>
        <Link to={`/interview-questions/${subjectId}`}>
          {subjectMeta?.name || subjectId.toUpperCase()}
        </Link>
      </div>

      {/* Question title */}
      <h1 className="mqb-qheader-title">{question.question}</h1>

      {/* Meta line + prev/next */}
      <div className="mqb-qmeta-line">
        <span>
          {currentIndex + 1} / {allQuestions.length}
        </span>
        <span aria-hidden="true">·</span>
        <span className={`mqb-diff-pill ${question.difficulty}`}>{question.difficulty}</span>
        <span aria-hidden="true">·</span>
        <span>{question.topic}</span>
        <span style={{ flex: 1 }} />
        {prevQuestion && (
          <button
            type="button"
            className="mqb-action-pill-btn"
            id="prev-question-btn"
            onClick={() => navigate(`/interview-questions/${subjectId}/${prevQuestion.id}`)}
            title={`Previous: ${prevQuestion.question}`}
          >
            ← Prev
          </button>
        )}
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

      <div className="mqb-detail-layout">
        <div className="mqb-detail-main">
          {/* Short Interview Answer */}
          <section className="mqb-section-card" id="section-short-answer">
            <div className="mqb-section-card-head">
              <h2 className="mqb-section-title" style={{ margin: 0 }}>
                Answer
              </h2>
              {activeSpeechSource === 'short' && isPlayingAudio ? (
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    type="button"
                    className="mqb-action-pill-btn"
                    onClick={handlePauseResumeAudio}
                    aria-label={isAudioPaused ? 'Resume narration' : 'Pause narration'}
                  >
                    {isAudioPaused ? '▶ Resume' : '⏸ Pause'}
                  </button>
                  <button
                    type="button"
                    className="mqb-action-pill-btn"
                    onClick={handleStopAudio}
                    aria-label="Stop narration"
                  >
                    ⏹ Stop
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="mqb-action-pill-btn primary"
                  onClick={() => handlePlayAudio('short')}
                  aria-label="Read the answer aloud"
                >
                  🔊 Listen
                </button>
              )}
            </div>
            <FormattedAnswerText
              text={question.shortAnswer}
              isSpeakingSection={activeSpeechSource === 'short' && isPlayingAudio}
              activeSentenceIndex={activeSpeechSource === 'short' && isPlayingAudio ? activeSentenceIndex : undefined}
            />
          </section>

          {/* Simple Explanation */}
          {(question.simpleExplanation || question.detailedAnswer || question.detailedExplanation) && (
            <section className="mqb-section-card" id="section-simple-explanation">
              <h2 className="mqb-section-title">Explanation</h2>
              <FormattedAnswerText
                text={question.simpleExplanation || question.detailedAnswer || question.detailedExplanation}
                isSpeakingSection={activeSpeechSource === 'explanation' && isPlayingAudio}
                activeSentenceIndex={activeSpeechSource === 'explanation' && isPlayingAudio ? activeSentenceIndex : undefined}
              />
            </section>
          )}

          {/* Follow-Up Questions */}
          {followUpList.length > 0 && (
            <section className="mqb-section-card" id="section-follow-ups">
              <h2 className="mqb-section-title">Follow-Up Questions</h2>
              <ol className="mqb-plain-fups">
                {followUpList.map((fu, idx) => (
                  <li key={idx}>
                    <p className="mqb-plain-fup-q">{fu}</p>
                    {question.followUpAnswers && question.followUpAnswers[idx] && (
                      <p className="mqb-plain-fup-a">{question.followUpAnswers[idx]}</p>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
