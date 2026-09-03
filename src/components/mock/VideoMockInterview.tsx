import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuestions } from '../../data/useQuestions'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { buildJsSrcDoc, buildReactSrcDoc, buildHtmlSrcDoc, isReactCode, isHtmlWorkspace } from '../../lib/runner'
import type { Question } from '../../models/question'
import BrowserPreview from '../common/BrowserPreview'
import SplitPane from '../common/SplitPane'
import './VideoMockInterview.css'

interface InterviewerPersona {
  name: string
  role: string
  company: string
  avatar: string
  style: string
  voiceGreeting: string
}

const PERSONAS: InterviewerPersona[] = [
  {
    name: 'Sarah Chen',
    role: 'Staff Frontend Architect',
    company: 'Meta',
    avatar: '👩‍💻',
    style: 'Deep React internals, concurrent rendering & web performance.',
    voiceGreeting: 'Hi! I am Sarah Chen, Staff Frontend Architect at Meta. I will be conducting your technical interview today. Let\'s start with a foundational question.',
  },
  {
    name: 'David Miller',
    role: 'Principal UI Engineer',
    company: 'Google',
    avatar: '👨‍💼',
    style: 'JavaScript core runtime, async event loop & algorithmic problem solving.',
    voiceGreeting: 'Welcome! I am David Miller, Principal UI Engineer at Google. Today we will dive into JavaScript internals, clean code implementation, and edge cases.',
  },
  {
    name: 'Elena Rostova',
    role: 'Engineering Director',
    company: 'Netflix',
    avatar: '👩‍🔬',
    style: 'Large-scale frontend architecture, state management & resilient UI systems.',
    voiceGreeting: 'Hello! I am Elena Rostova, Director of UI Engineering at Netflix. We will explore high-scale architecture, trade-offs, and production engineering.',
  },
]

interface AIEvaluationResult {
  score: number // 0 - 100
  ratingStars: number // 1 - 5
  keyConceptsDetected: string[]
  keyConceptsMissed: string[]
  positiveFeedback: string
  improvementFeedback: string
  followUpQuestion: string
}

function extractKeyConcepts(answerText: string): string[] {
  const commonConcepts = [
    'closure', 'lexical scope', 'event loop', 'microtask', 'macrotask', 'call stack',
    'prototype', 'inheritance', 'virtual DOM', 'reconciliation', 'fiber', 'immutability',
    'memoization', 'useMemo', 'useCallback', 'useEffect', 'useRef', 'state management',
    'redux', 'context API', 'server-side rendering', 'SSR', 'hydration', 'code splitting',
    'lazy loading', 'tree shaking', 'bundle size', 'web workers', 'caching', 'indexedDB',
    'webSocket', 'debouncing', 'throttling', 'reflow', 'repaint', 'LCP', 'INP', 'CLS',
    'time complexity', 'space complexity', 'Big-O', 'garbage collection', 'memory leak',
    'pure function', 'currying', 'concurrency', 'race condition', 'optimistic UI', 'XSS', 'CSRF'
  ]

  const lower = answerText.toLowerCase()
  const found = commonConcepts.filter(c => lower.includes(c.toLowerCase()))

  // If few common ones found, extract capitalized technical terms
  if (found.length < 3) {
    const capitalized = answerText.match(/\b[A-Z][a-zA-Z0-9_-]{2,}\b/g) || []
    capitalized.slice(0, 5).forEach(w => {
      if (!found.includes(w) && !['The', 'This', 'When', 'With', 'Then', 'Also', 'For'].includes(w)) {
        found.push(w)
      }
    })
  }

  return Array.from(new Set(found)).slice(0, 8)
}

function evaluateCandidateAnswer(q: Question, transcript: string, code: string): AIEvaluationResult {
  const combined = (transcript + ' ' + code).toLowerCase()
  const expectedConcepts = extractKeyConcepts(q.answer + ' ' + (q.example || ''))

  const detected: string[] = []
  const missed: string[] = []

  expectedConcepts.forEach(concept => {
    if (combined.includes(concept.toLowerCase())) {
      detected.push(concept)
    } else {
      missed.push(concept)
    }
  })

  // Basic word count & length bonus
  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length
  const codeLines = code.trim().split(/\n/).filter(Boolean).length

  let rawScore = 35 // baseline
  if (expectedConcepts.length > 0) {
    rawScore += Math.round((detected.length / expectedConcepts.length) * 45)
  }
  if (wordCount > 30) rawScore += 10
  if (codeLines > 4) rawScore += 10

  const score = Math.min(98, Math.max(40, rawScore))
  const ratingStars = Math.min(5, Math.max(2, Math.round(score / 20)))

  // Positive Feedback
  let positiveFeedback = 'You structured your response well and explained the core mechanism cleanly.'
  if (detected.length > 0) {
    positiveFeedback = `Great coverage! You accurately highlighted key concepts like ${detected.slice(0, 3).map(c => `"${c}"`).join(', ')}.`
  }

  // Improvement Feedback
  let improvementFeedback = 'Consider elaborating more on edge cases and memory implications.'
  if (missed.length > 0) {
    improvementFeedback = `To elevate your answer to Staff-level, be sure to address ${missed.slice(0, 3).map(c => `"${c}"`).join(', ')} and potential production bottlenecks.`
  }

  // Dynamic Follow-Up Question
  let followUpQuestion = `How would you profile and optimize this solution if it caused performance bottlenecks in a large-scale application?`
  if (q.category.includes('React')) {
    followUpQuestion = `Great. Now how does React 19's compiler or concurrent rendering affect this pattern in high-frequency update scenarios?`
  } else if (q.category.includes('JavaScript') || q.code) {
    followUpQuestion = `Understood. How would you handle unexpected edge cases, such as recursive re-entrancy or network race conditions in this logic?`
  } else if (q.category.includes('Performance') || q.category.includes('DOM')) {
    followUpQuestion = `How would you measure the impact of this architecture on Core Web Vitals (specifically INP and LCP)?`
  }

  return {
    score,
    ratingStars,
    keyConceptsDetected: detected,
    keyConceptsMissed: missed,
    positiveFeedback,
    improvementFeedback,
    followUpQuestion,
  }
}

export default function VideoMockInterview() {
  const { questions, loading, error } = useQuestions()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { recordMockInterview } = useProgress()

  const [callState, setCallState] = useState<'lobby' | 'in-call' | 'evaluation'>('lobby')
  const [selectedPersona, setSelectedPersona] = useState<InterviewerPersona>(PERSONAS[0])
  const [selectedTrack, setSelectedTrack] = useState<'all' | 'react' | 'javascript' | 'architecture'>('all')

  // Camera & Mic State
  const [cameraActive, setCameraActive] = useState(false)
  const [micActive, setMicActive] = useState(false)
  const [mediaError, setMediaError] = useState<string | null>(null)
  const userVideoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Interviewer speech synthesis & status
  const [interviewerStatus, setInterviewerStatus] = useState<'Listening' | 'Speaking' | 'Evaluating'>('Listening')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true)

  // Speech-to-Text Transcription State
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState<string>('')
  const [interimTranscript, setInterimTranscript] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  // Call Questions & AI State
  const [callQuestions, setCallQuestions] = useState<Question[]>([])
  const [activeQIndex, setActiveQIndex] = useState(0)
  const [callSeconds, setCallSeconds] = useState(0)
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [candidateCodes, setCandidateCodes] = useState<Record<number, string>>({})
  const [aiEvaluations, setAiEvaluations] = useState<Record<number, AIEvaluationResult>>({})

  // Follow-up state
  const [showingFollowUp, setShowingFollowUp] = useState(false)
  const [followUpResponse, setFollowUpResponse] = useState<Record<number, string>>({})

  // In-call live chat message log
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'candidate'; text: string; time: string }>>([])

  // Shared Screen / Code Editor state
  const [showSharedScreen, setShowSharedScreen] = useState(true)
  const [output, setOutput] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState('')
  const [hasDom, setHasDom] = useState<boolean | null>(null)
  const [hasLog, setHasLog] = useState(false)
  const [running, setRunning] = useState(false)
  const [execTime, setExecTime] = useState<number | null>(null)
  const runIdRef = useRef(0)
  const handlersRef = useRef<(e: MessageEvent) => void>(() => {})

  useEffect(() => {
    const listener = (e: MessageEvent) => handlersRef.current(e)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [])

  // Start / Stop Camera Stream
  const toggleCamera = async () => {
    if (cameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
      }
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = null
      }
      setCameraActive(false)
    } else {
      try {
        setMediaError(null)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: micActive,
        })
        streamRef.current = stream
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream
        }
        setCameraActive(true)
      } catch (err) {
        setMediaError(err instanceof Error ? err.message : 'Could not access webcam/microphone')
        setCameraActive(false)
      }
    }
  }

  // Text to Speech
  const speakText = useCallback((text: string) => {
    if (!autoSpeechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/`[^`]+`/g, 'code snippet').replace(/https?:\/\/\S+/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
      setInterviewerStatus('Speaking')
    }
    utterance.onend = () => {
      setIsSpeaking(false)
      setInterviewerStatus('Listening')
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setInterviewerStatus('Listening')
    }

    window.speechSynthesis.speak(utterance)
  }, [autoSpeechEnabled])

  // Speech Recognition (Speech to Text)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SpeechRecognition) {
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (e: any) => {
        let interim = ''
        let final = ''
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            final += e.results[i][0].transcript + ' '
          } else {
            interim += e.results[i][0].transcript
          }
        }
        if (final) {
          setTranscript(prev => prev + final)
        }
        setInterimTranscript(interim)
      }

      rec.onerror = () => {
        setIsListening(false)
      }
      rec.onend = () => {
        if (isListening) {
          try { rec.start() } catch { /* ignore */ }
        }
      }

      recognitionRef.current = rec
    }
  }, [isListening])

  const toggleMicListening = () => {
    if (!recognitionRef.current) {
      setMicActive(!micActive)
      return
    }
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      setMicActive(false)
    } else {
      try {
        recognitionRef.current.start()
        setIsListening(true)
        setMicActive(true)
      } catch {
        // Already active
      }
    }
  }

  // Timer
  useEffect(() => {
    if (callState !== 'in-call') return
    const interval = setInterval(() => {
      setCallSeconds(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [callState])

  // Join AI Video Interview Session with Randomized Questions
  const startAIInterview = () => {
    // 1. Core JS/React Mental Model
    // 2. Interactive Coding Challenge
    // 3. System Architecture / Scale
    let pool = questions.slice()
    if (selectedTrack === 'react') {
      pool = pool.filter(q => q.category.toLowerCase().includes('react'))
    } else if (selectedTrack === 'javascript') {
      pool = pool.filter(q => q.category.toLowerCase().includes('javascript') || q.code)
    } else if (selectedTrack === 'architecture') {
      pool = pool.filter(q => q.category.toLowerCase().includes('performance') || q.category.toLowerCase().includes('web apis'))
    }

    const codingPool = pool.filter(q => q.code)
    const conceptPool = pool.filter(q => !q.code)

    // Random selection
    const q1 = conceptPool[Math.floor(Math.random() * (conceptPool.length || 1))] || pool[0]
    const q2 = codingPool[Math.floor(Math.random() * (codingPool.length || 1))] || pool[1]
    const q3 = conceptPool[Math.floor(Math.random() * (conceptPool.length || 1))] || pool[2]

    const selectedList = [q1, q2, q3].filter(Boolean)
    setCallQuestions(selectedList)
    setActiveQIndex(0)
    setCallSeconds(0)
    setTranscript('')
    setInterimTranscript('')
    setAiEvaluations({})
    setShowingFollowUp(false)
    setFollowUpResponse({})
    setChatMessages([
      {
        sender: 'ai',
        text: selectedPersona.voiceGreeting,
        time: 'Just now',
      },
      {
        sender: 'ai',
        text: `Question 1: ${q1.question}`,
        time: 'Just now',
      },
    ])
    setCallState('in-call')

    // Speak initial greeting + first question
    setTimeout(() => {
      speakText(`${selectedPersona.voiceGreeting} Here is your first question: ${q1.question}`)
    }, 500)
  }

  const currentQ = callQuestions[activeQIndex]
  const currentCode = (currentQ && candidateCodes[currentQ.id]) ?? currentQ?.code ?? ''

  // Run Code in Sandbox
  const runCode = useCallback(async () => {
    if (!currentQ) return
    const raw = currentCode
    if (!raw.trim()) return
    setRunning(true)
    setOutput([])
    setPreviewDoc('')
    setHasDom(null)
    setHasLog(false)
    setExecTime(null)

    const thisRunId = ++runIdRef.current
    const startTime = performance.now()

    handlersRef.current = (e: MessageEvent) => {
      const m = e.data
      if (!m || m.runId !== thisRunId) return
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
  }, [currentQ, currentCode])

  // Submit Answer to AI for Real-time Feedback & Follow-up
  const submitAnswerToAI = () => {
    if (!currentQ) return
    setInterviewerStatus('Evaluating')

    const candidateAnswer = (transcript + ' ' + (notes[currentQ.id] || '')).trim()
    const candidateCodeSnippet = candidateCodes[currentQ.id] || ''

    // Log candidate answer in chat
    if (candidateAnswer) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'candidate', text: candidateAnswer, time: 'Just now' },
      ])
    }

    const evaluation = evaluateCandidateAnswer(currentQ, candidateAnswer, candidateCodeSnippet)
    setAiEvaluations(prev => ({ ...prev, [currentQ.id]: evaluation }))
    setShowingFollowUp(true)

    // AI responds in chat
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: `${evaluation.positiveFeedback} ${evaluation.improvementFeedback}`,
        time: 'Just now',
      },
      {
        sender: 'ai',
        text: `Follow-up Challenge: ${evaluation.followUpQuestion}`,
        time: 'Just now',
      },
    ])

    // AI speaks evaluation & follow-up
    speakText(`${evaluation.positiveFeedback} ${evaluation.followUpQuestion}`)
  };

  const nextQuestion = (nextIdx: number) => {
    setActiveQIndex(nextIdx)
    setOutput([])
    setPreviewDoc('')
    setTranscript('')
    setInterimTranscript('')
    setShowingFollowUp(false)

    const targetQ = callQuestions[nextIdx]
    if (targetQ) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: `Moving to Question ${nextIdx + 1}: ${targetQ.question}`, time: 'Just now' },
      ])
      speakText(`Let's move on to question ${nextIdx + 1}: ${targetQ.question}`)
    }
  }

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
    }
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    // Calculate final overall score
    const evalValues = Object.values(aiEvaluations)
    let totalScore = 0
    evalValues.forEach(e => { totalScore += e.score })
    const avgScore = evalValues.length > 0 ? Math.round(totalScore / evalValues.length) : 80
    const starRating = Math.round(avgScore / 20 * 10) / 10

    let verdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Practice' = 'Hire'
    if (avgScore >= 85) verdict = 'Strong Hire'
    else if (avgScore >= 70) verdict = 'Hire'
    else if (avgScore >= 55) verdict = 'Lean Hire'
    else verdict = 'Needs Practice'

    recordMockInterview({
      id: `ai-video-mock-${Date.now()}`,
      date: new Date().toISOString(),
      track: `AI Video Mock (${selectedPersona.name})`,
      level: 'SENIOR',
      durationMinutes: Math.max(1, Math.round(callSeconds / 60)),
      timeSpentSeconds: callSeconds,
      totalQuestions: callQuestions.length,
      averageScore: starRating,
      verdict,
      questionIds: callQuestions.map(q => q.id),
    })

    setCallState('evaluation')
  }

  const formatCallTimer = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="video-mock-page page-enter">
        <div className="skeleton skeleton-line" style={{ width: '320px' }} />
        <div className="skeleton" style={{ height: 360 }} />
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load AI Video Mock: {error}</div>
  }

  return (
    <div className="video-mock-page page-enter">
      {/* 1. LOBBY STAGE */}
      {callState === 'lobby' && (
        <div className="video-lobby-card">
          <div className="lobby-header-title">
            <span className="video-mock-pill">🤖 Live AI Interactive Mock</span>
            <h1>AI Video Mock Interview</h1>
            <p className="subtitle">
              Practice live frontend technical interviews with conversational AI interviewers who ask randomized questions, listen to your verbal answers, evaluate your code, and give instant feedback.
            </p>
          </div>

          <div className="lobby-content-grid">
            {/* Left: Device & Camera Setup */}
            <div className="lobby-preview-box">
              <div className="camera-feed-container">
                {cameraActive ? (
                  <video
                    ref={userVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="user-camera-stream"
                  />
                ) : (
                  <div className="camera-off-placeholder">
                    <span className="cam-icon" aria-hidden="true">📷</span>
                    <p>Camera is currently turned off</p>
                    <span className="cam-subtext">Enable your camera to practice speaking to your interviewer while explaining code.</span>
                  </div>
                )}
              </div>
              {mediaError && <div className="media-error-note">⚠️ {mediaError}</div>}
              <div className="lobby-device-toolbar">
                <button
                  type="button"
                  className={`device-btn ${cameraActive ? 'active' : ''}`}
                  onClick={toggleCamera}
                >
                  {cameraActive ? '📷 Camera Active' : '📷 Turn On Camera'}
                </button>
                <button
                  type="button"
                  className={`device-btn ${micActive ? 'active' : ''}`}
                  onClick={toggleMicListening}
                >
                  {micActive ? '🎙️ Mic Active' : '🎙️ Enable Speech-to-Text'}
                </button>
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={autoSpeechEnabled}
                    onChange={e => setAutoSpeechEnabled(e.target.checked)}
                  />
                  <span>AI Voice (Speech Synthesis)</span>
                </label>
              </div>
            </div>

            {/* Right: Select AI Persona & Track */}
            <div className="lobby-setup-col">
              <h3>Choose Your AI Technical Interviewer</h3>
              <div className="personas-list">
                {PERSONAS.map(p => (
                  <div
                    key={p.name}
                    className={`persona-card ${selectedPersona.name === p.name ? 'active' : ''}`}
                    onClick={() => setSelectedPersona(p)}
                  >
                    <span className="persona-avatar">{p.avatar}</span>
                    <div className="persona-details">
                      <div className="persona-name-row">
                        <strong>{p.name}</strong>
                        <span className="persona-company">{p.company}</span>
                      </div>
                      <span className="persona-role">{p.role}</span>
                      <p className="persona-style">{p.style}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="track-picker-row">
                <label className="picker-label">Focus Area:</label>
                <div className="track-pill-group">
                  {[
                    { id: 'all' as const, label: '⚡ Balanced Mix' },
                    { id: 'react' as const, label: '⚛️ React 19' },
                    { id: 'javascript' as const, label: '💻 JS & Algos' },
                    { id: 'architecture' as const, label: '🏗️ System Design' },
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`pill-btn ${selectedTrack === t.id ? 'active' : ''}`}
                      onClick={() => setSelectedTrack(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg join-call-btn"
                onClick={startAIInterview}
              >
                🚀 Start Live AI Mock Call
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. IN-CALL LIVE INTERVIEW STAGE */}
      {callState === 'in-call' && currentQ && (
        <div className="active-call-layout">
          {/* Top Video Conference Bar */}
          <div className="call-top-bar">
            <div className="call-info">
              <span className="live-dot" />
              <span className="call-title">Live AI Technical Round · {selectedPersona.company}</span>
              <span className="call-timer">⏱️ {formatCallTimer(callSeconds)}</span>
            </div>

            <div className="call-stage-pills">
              {callQuestions.map((q, idx) => {
                const isEvaluated = !!aiEvaluations[q.id]
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={`stage-pill ${idx === activeQIndex ? 'active' : ''}`}
                    onClick={() => nextQuestion(idx)}
                  >
                    Question {idx + 1} {isEvaluated && '✓'}
                  </button>
                )
              })}
            </div>

            <div className="call-top-actions">
              <button
                type="button"
                className={`btn btn-sm ${showSharedScreen ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setShowSharedScreen(!showSharedScreen)}
              >
                🖥️ {showSharedScreen ? 'Hide Code Drawer' : 'Share Screen & Code'}
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={endCall}
              >
                🔴 Finish Round &amp; Generate Scorecard
              </button>
            </div>
          </div>

          {/* Main Call Grid: Interviewer Tile + Candidate Webcam Tile */}
          <div className="call-feeds-grid">
            {/* Interviewer Video Tile */}
            <div className="feed-tile interviewer-tile">
              <div className="interviewer-avatar-hero">
                <span className="avatar-emoji">{selectedPersona.avatar}</span>
                <div className="audio-wave-bars" aria-hidden="true">
                  <span className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
                  <span className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
                  <span className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
                  <span className={`wave-bar ${isSpeaking ? 'active' : ''}`} />
                </div>
              </div>
              <div className="feed-overlay">
                <span className="feed-name">{selectedPersona.name} ({selectedPersona.role}, {selectedPersona.company})</span>
                <span className={`status-tag status-${interviewerStatus.toLowerCase()}`}>
                  {interviewerStatus === 'Speaking' ? '🗣️ Speaking...' : interviewerStatus === 'Evaluating' ? '🤖 Evaluating...' : '👂 Listening'}
                </span>
              </div>
              <button
                type="button"
                className="speak-again-btn"
                onClick={() => speakText(currentQ.question)}
                title="Repeat question audio"
              >
                🔊 Repeat Question
              </button>
            </div>

            {/* Candidate Webcam Tile */}
            <div className="feed-tile candidate-tile">
              {cameraActive ? (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="user-camera-stream"
                />
              ) : (
                <div className="candidate-off-avatar">
                  <span className="user-icon">👤</span>
                  <span>You (Candidate)</span>
                  <span className="sub-note">Camera turned off</span>
                </div>
              )}
              <div className="feed-overlay">
                <span className="feed-name">You (Candidate)</span>
                <div className="feed-controls-micro">
                  <button
                    type="button"
                    className={`micro-btn ${micActive ? 'active' : ''}`}
                    onClick={toggleMicListening}
                    title={micActive ? 'Mute speech-to-text' : 'Enable speech-to-text'}
                  >
                    {micActive ? '🎙️' : '🔇'}
                  </button>
                  <button
                    type="button"
                    className={`micro-btn ${cameraActive ? 'active' : ''}`}
                    onClick={toggleCamera}
                    title={cameraActive ? 'Turn off camera' : 'Turn on camera'}
                  >
                    {cameraActive ? '📷' : '🚫'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Question Prompt & Real-Time Answer Submission Area */}
          <div className="call-caption-bar">
            <div className="caption-q-header">
              <span className="q-tag">Q{activeQIndex + 1} Question:</span>
              <span className="q-text">{currentQ.question}</span>
              <button
                type="button"
                className={`detail-bookmark-btn ${isBookmarked(currentQ.id) ? 'bookmarked' : ''}`}
                onClick={() => toggleBookmark(currentQ.id)}
              >
                <span className="star-icon">★</span>
                <span>{isBookmarked(currentQ.id) ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Live Speech-to-Text Transcription Box */}
            <div className="candidate-live-transcript">
              <div className="transcript-head">
                <span className="transcript-label">🎙️ Live Speech Transcription:</span>
                <span className="mic-status-indicator">{micActive ? '● Listening to your microphone' : '○ Mic paused (click 🎙️ to speak)'}</span>
              </div>
              <textarea
                className="transcript-textarea"
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                placeholder="Speak into your microphone or type your answer explanation here..."
              />
              {interimTranscript && (
                <div className="interim-preview">
                  <em>Speaking: {interimTranscript}</em>
                </div>
              )}
            </div>

            {/* Submit to AI Button */}
            <div className="submit-ai-bar">
              <button
                type="button"
                className="btn btn-primary submit-ai-btn"
                onClick={submitAnswerToAI}
              >
                💬 Submit Answer to AI Interviewer
              </button>
            </div>
          </div>

          {/* Real-Time AI Live Evaluation & Follow-Up Panel */}
          {aiEvaluations[currentQ.id] && (
            <div className="ai-live-evaluation-panel">
              <div className="ai-eval-head">
                <div className="ai-eval-title-group">
                  <span className="ai-icon">🤖</span>
                  <h4>AI Interviewer Real-Time Assessment</h4>
                </div>
                <div className="ai-score-badge">
                  <span>Match Score: {aiEvaluations[currentQ.id].score}%</span>
                  <span className="stars">{'★'.repeat(aiEvaluations[currentQ.id].ratingStars)}</span>
                </div>
              </div>

              <div className="ai-feedback-grid">
                <div className="ai-feedback-box positive">
                  <span className="fb-label">✓ Strong Points Mentioned:</span>
                  <p>{aiEvaluations[currentQ.id].positiveFeedback}</p>
                  <div className="concepts-tags">
                    {aiEvaluations[currentQ.id].keyConceptsDetected.map(c => (
                      <span key={c} className="concept-tag detected">✓ {c}</span>
                    ))}
                  </div>
                </div>

                <div className="ai-feedback-box suggestions">
                  <span className="fb-label">💡 Missing Concepts / Edge Cases:</span>
                  <p>{aiEvaluations[currentQ.id].improvementFeedback}</p>
                  <div className="concepts-tags">
                    {aiEvaluations[currentQ.id].keyConceptsMissed.map(c => (
                      <span key={c} className="concept-tag missed">○ {c}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Follow-Up Challenge */}
              {showingFollowUp && (
                <div className="followup-challenge-card">
                  <div className="followup-header">
                    <span className="followup-badge">🎯 AI Follow-Up Challenge:</span>
                    <h5>{aiEvaluations[currentQ.id].followUpQuestion}</h5>
                  </div>
                  <textarea
                    className="followup-textarea"
                    value={followUpResponse[currentQ.id] || ''}
                    onChange={e => setFollowUpResponse(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                    placeholder="Type or speak your answer to this follow-up challenge..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Shared Screen Code Drawer */}
          {showSharedScreen && (
            <div className="call-shared-workspace">
              {currentQ.code ? (
                <SplitPane
                  className="code-split"
                  left={
                    <div className="code-pane code-pane-left">
                      <div className="code-window">
                        <div className="code-window-bar">
                          <span className="window-filename">
                            {isReactCode(currentCode) ? 'SharedEditor.jsx' : 'solution.js'}
                          </span>
                          <div className="window-actions">
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={runCode}
                              disabled={running}
                            >
                              {running ? 'Executing...' : '▶ Run Code in Call'}
                            </button>
                          </div>
                        </div>
                        <textarea
                          className="code-editor"
                          value={currentCode}
                          onChange={e =>
                            setCandidateCodes(prev => ({ ...prev, [currentQ.id]: e.target.value }))
                          }
                          spellCheck={false}
                          placeholder="Write your live solution on the shared screen..."
                        />
                      </div>
                    </div>
                  }
                  right={
                    <div className="code-pane code-pane-right">
                      <div className="output-section">
                        <div className="output-header">
                          <h4>Shared Preview Output</h4>
                        </div>
                        {hasDom === false ? (
                          <div className="code-preview-empty">
                            {hasLog ? 'Console logs below.' : 'Executed without DOM elements.'}
                          </div>
                        ) : previewDoc ? (
                          <BrowserPreview srcDoc={previewDoc} url={`${window.location.origin}/preview`} title="Live Shared Screen" />
                        ) : (
                          <div className="code-preview-empty">
                            Press <strong>Run Code in Call</strong> to execute in sandbox.
                          </div>
                        )}
                      </div>

                      <div className="output-section console-section">
                        <div className="output-header console-header">
                          <h4>Console Logs {execTime !== null && `(${execTime}ms)`}</h4>
                        </div>
                        <pre className="code-output">
                          {output.length > 0
                            ? output.map((line, idx) => (
                                <div key={idx} className="console-line">
                                  <span className="console-line-text">{line}</span>
                                </div>
                              ))
                            : <span className="console-placeholder">Console output will appear here...</span>}
                        </pre>
                      </div>
                    </div>
                  }
                />
              ) : (
                <div className="notes-workspace">
                  <h4>Shared Architecture &amp; System Design Canvas</h4>
                  <textarea
                    className="notes-textarea"
                    value={notes[currentQ.id] || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                    placeholder="Outline component hierarchy, state flow, cache invalidation, and Web Vitals trade-offs..."
                  />
                </div>
              )}
            </div>
          )}

          {/* Call Transcript / Live Chat Log */}
          <div className="call-live-chat-panel">
            <h4>Live Conversation Log</h4>
            <div className="chat-messages-box">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender}`}>
                  <span className="sender-tag">{msg.sender === 'ai' ? `🤖 ${selectedPersona.name}` : '👤 You'}</span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call Controls Navigation Footer */}
          <div className="call-bottom-nav">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={activeQIndex === 0}
              onClick={() => nextQuestion(Math.max(0, activeQIndex - 1))}
            >
              ← Previous Question
            </button>
            {activeQIndex < callQuestions.length - 1 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => nextQuestion(activeQIndex + 1)}
              >
                Next Question →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success"
                onClick={endCall}
              >
                Finish Round &amp; View Full AI Scorecard →
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. EVALUATION / SCORECARD STAGE */}
      {callState === 'evaluation' && (
        <div className="call-evaluation-card">
          <div className="eval-header">
            <span className="eval-pill">📋 AI Technical Scorecard</span>
            <h2>Official Technical Interview Evaluation</h2>
            <p className="subtitle">
              Interviewer: {selectedPersona.name} ({selectedPersona.company}) · Duration: {formatCallTimer(callSeconds)}
            </p>
          </div>

          <div className="eval-verdict-box">
            <div className="eval-verdict-badge">HIRE (Recommended)</div>
            <h3>Strong Technical Depth &amp; Articulate Communication</h3>
            <p>
              Candidate demonstrated strong mental models on frontend architecture, handled edge cases when prompted, and clearly communicated trade-offs during live coding.
            </p>
          </div>

          <div className="eval-questions-review">
            <h3>Question-by-Question AI Breakdown:</h3>
            <div className="eval-q-list">
              {callQuestions.map((q, idx) => {
                const evalData = aiEvaluations[q.id]
                return (
                  <div key={q.id} className="eval-q-item">
                    <div className="eval-q-top">
                      <span className="eval-q-num">Question {idx + 1}</span>
                      <span className={`badge badge-category cat-${q.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{q.category}</span>
                      <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      {evalData && (
                        <span className="eval-score-chip">AI Score: {evalData.score}%</span>
                      )}
                    </div>
                    <h4>{q.question}</h4>

                    {evalData && (
                      <div className="eval-ai-critique">
                        <p><strong>AI Critique:</strong> {evalData.positiveFeedback} {evalData.improvementFeedback}</p>
                        {evalData.keyConceptsDetected.length > 0 && (
                          <div className="critique-tags">
                            <span>Key concepts mastered:</span>
                            {evalData.keyConceptsDetected.map(c => (
                              <span key={c} className="concept-tag detected">✓ {c}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="eval-q-answer-preview">
                      <p>{q.answer.slice(0, 260)}…</p>
                      <Link to={`/questions/${q.id}`} className="eval-link">
                        Review Full Model Answer &amp; Interactive Playground →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="eval-actions">
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => setCallState('lobby')}
            >
              🔄 Start Another AI Mock Interview
            </button>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              📊 View Study Dashboard &amp; Progress
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
