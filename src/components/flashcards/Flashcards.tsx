import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useQuestions } from '../../data/useQuestions'
import { useProgress } from '../../context/ProgressContext'
import './Flashcards.css'


export interface CardState {
  id: number
  interval: number // in days
  repetitions: number
  easeFactor: number
  dueDate: number // timestamp
  lastReviewed?: number
  lastQuality?: number
}

const STORAGE_KEY = 'fe_interview_flashcards_v1'

export default function Flashcards() {
  const { questions } = useQuestions()
  const { markSolved, streak } = useProgress()

  const [cardsState, setCardsState] = useState<Record<number, CardState>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  const [selectedDeck, setSelectedDeck] = useState<string>('All')
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [sessionReviewedCount, setSessionReviewedCount] = useState<number>(0)
  const [sessionCorrectCount, setSessionCorrectCount] = useState<number>(0)

  // Save cards state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsState))
    } catch (e) {
      console.error('Failed to save flashcards:', e)
    }
  }, [cardsState])

  // Deck Categories
  const decks = [
    { id: 'All', label: '🌟 All High-Yield Concepts' },
    { id: 'JavaScript', label: '⚡ JavaScript & Event Loop' },
    { id: 'ReactJS', label: '⚛️ React 19 & Architecture' },
    { id: 'System Design', label: '🏗️ System Design & Web Vitals' },
    { id: 'DOM & Web APIs', label: '🌐 DOM & Browser APIs' },
    { id: 'CSS', label: '🎨 CSS & Animations' },
    { id: 'TypeScript', label: '🔷 TypeScript' },
  ]

  // Filter deck questions
  const activeDeckQuestions = useMemo(() => {
    if (!questions) return []
    let filtered = questions.filter(q => q.question && q.answer)

    if (selectedDeck !== 'All') {
      filtered = filtered.filter(q => q.category.toLowerCase().includes(selectedDeck.toLowerCase()))
    }

    // Sort by due cards first, then unreviewed cards
    const now = Date.now()
    return filtered.sort((a, b) => {
      const stateA = cardsState[a.id]
      const stateB = cardsState[b.id]

      if (!stateA && !stateB) return 0
      if (!stateA) return -1
      if (!stateB) return 1

      const dueA = stateA.dueDate <= now
      const dueB = stateB.dueDate <= now
      if (dueA && !dueB) return -1
      if (!dueA && dueB) return 1
      return stateA.dueDate - stateB.dueDate
    })
  }, [questions, selectedDeck, cardsState])

  const currentQuestion = activeDeckQuestions[currentIndex] || activeDeckQuestions[0]

  // SM-2 Spaced Repetition Algorithm Calculation
  const handleRating = useCallback((quality: 1 | 2 | 3 | 4) => {
    if (!currentQuestion) return

    const now = Date.now()
    const current = cardsState[currentQuestion.id] || {
      id: currentQuestion.id,
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      dueDate: now,
    }

    let nextInterval = 1
    let nextReps = current.repetitions
    let nextEase = current.easeFactor

    if (quality === 1) {
      // Again: Reset interval
      nextInterval = 1
      nextReps = 0
      nextEase = Math.max(1.3, nextEase - 0.2)
    } else if (quality === 2) {
      // Hard
      nextInterval = Math.max(1, Math.round(current.interval * 1.2))
      nextEase = Math.max(1.3, nextEase - 0.15)
    } else if (quality === 3) {
      // Good
      if (current.repetitions === 0) {
        nextInterval = 1
      } else if (current.repetitions === 1) {
        nextInterval = 3
      } else {
        nextInterval = Math.round(current.interval * nextEase)
      }
      nextReps += 1
    } else if (quality === 4) {
      // Easy
      if (current.repetitions === 0) {
        nextInterval = 3
      } else if (current.repetitions === 1) {
        nextInterval = 6
      } else {
        nextInterval = Math.round(current.interval * nextEase * 1.3)
      }
      nextReps += 1
      nextEase += 0.15
    }

    const nextDueDate = now + nextInterval * 24 * 60 * 60 * 1000

    setCardsState(prev => ({
      ...prev,
      [currentQuestion.id]: {
        id: currentQuestion.id,
        interval: nextInterval,
        repetitions: nextReps,
        easeFactor: Number(nextEase.toFixed(2)),
        dueDate: nextDueDate,
        lastReviewed: now,
        lastQuality: quality,
      },
    }))

    // Track session stats
    setSessionReviewedCount(c => c + 1)
    if (quality >= 3) {
      setSessionCorrectCount(c => c + 1)
      markSolved(currentQuestion.id)
    }

    // Move to next card
    setIsFlipped(false)
    if (currentIndex < activeDeckQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentQuestion, cardsState, currentIndex, activeDeckQuestions.length, markSolved])

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        setIsFlipped(f => !f)
      } else if (isFlipped) {
        if (e.key === '1') handleRating(1)
        else if (e.key === '2') handleRating(2)
        else if (e.key === '3') handleRating(3)
        else if (e.key === '4') handleRating(4)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFlipped, handleRating])

  const restartDeck = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionReviewedCount(0)
    setSessionCorrectCount(0)
  }

  const isFinished = currentIndex >= activeDeckQuestions.length && activeDeckQuestions.length > 0

  return (
    <div className="flashcards-page page-enter">
      {/* Header */}
      <div className="flashcards-header">
        <div>
          <span className="flashcard-badge">🧠 SM-2 Spaced Repetition</span>
          <h1>Active Recall Flashcards</h1>
          <p className="subtitle">
            Master high-yield frontend interview concepts with Anki-style spaced repetition, active recall rating, and automated review intervals.
          </p>
        </div>

        <div className="session-quick-stats">
          <span className="stat-chip">🔥 <strong>{streak}</strong> Day Streak</span>
          <span className="stat-chip">Cards Reviewed: <strong>{sessionReviewedCount}</strong></span>
          <span className="stat-chip success">
            Accuracy: <strong>{sessionReviewedCount > 0 ? Math.round((sessionCorrectCount / sessionReviewedCount) * 100) : 100}%</strong>
          </span>
        </div>
      </div>

      {/* Deck Selector Pills */}
      <div className="deck-pills-bar">
        {decks.map(d => (
          <button
            key={d.id}
            type="button"
            className={`deck-pill-btn ${selectedDeck === d.id ? 'active' : ''}`}
            onClick={() => {
              setSelectedDeck(d.id)
              setCurrentIndex(0)
              setIsFlipped(false)
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Main Flashcard Stage */}
      {!isFinished && currentQuestion ? (
        <div className="flashcard-stage-container">
          {/* Progress Tracker */}
          <div className="card-progress-bar-wrap">
            <div
              className="card-progress-bar-fill"
              style={{ width: `${((currentIndex + 1) / activeDeckQuestions.length) * 100}%` }}
            />
          </div>
          <div className="card-counter-row">
            <span>Card <strong>{currentIndex + 1}</strong> of {activeDeckQuestions.length}</span>
            <span className="keyboard-hint">💡 Press <kbd>Space</kbd> to flip · Keys <kbd>1</kbd>-<kbd>4</kbd> to rate</span>
          </div>

          {/* 3D Flip Card Container */}
          <div
            className={`flip-card-perspective ${isFlipped ? 'flipped' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="flip-card-inner">
              {/* Card FRONT */}
              <div className="flip-card-face flip-card-front">
                <div className="face-header">
                  <span className={`badge badge-category cat-${currentQuestion.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                    {currentQuestion.category}
                  </span>
                  <span className={`badge badge-${currentQuestion.difficulty.toLowerCase()}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="face-body">
                  <h3 className="card-question-text">{currentQuestion.question}</h3>
                </div>

                <div className="face-footer">
                  <span className="flip-prompt-text">
                    👆 Click card or press <kbd className="mini-kbd">Space</kbd> to reveal answer
                  </span>
                </div>
              </div>

              {/* Card BACK */}
              <div className="flip-card-face flip-card-back">
                <div className="face-header">
                  <span className="back-title-badge">🎯 Staff Architect Answer</span>
                  <span className={`badge badge-${currentQuestion.difficulty.toLowerCase()}`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>

                <div className="face-body back-body">
                  <p className="card-answer-text">{currentQuestion.answer}</p>
                  {currentQuestion.example && (
                    <pre className="card-code-preview">
                      <code>{currentQuestion.example}</code>
                    </pre>
                  )}
                </div>

                <div className="face-footer">
                  <span className="flip-prompt-text">
                    Rate your recall below to schedule next review interval
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SM-2 Recall Rating Buttons (Visible when flipped) */}
          <div className={`rating-controls-bar ${isFlipped ? 'visible' : ''}`}>
            <span className="rate-instruction">How well did you recall this answer?</span>
            <div className="rating-buttons-group">
              <button
                type="button"
                className="btn-rate rate-again"
                onClick={e => {
                  e.stopPropagation()
                  handleRating(1)
                }}
              >
                <span className="rate-shortcut">1</span>
                <strong>Again</strong>
                <span className="interval-tag">&lt; 1 day</span>
              </button>

              <button
                type="button"
                className="btn-rate rate-hard"
                onClick={e => {
                  e.stopPropagation()
                  handleRating(2)
                }}
              >
                <span className="rate-shortcut">2</span>
                <strong>Hard</strong>
                <span className="interval-tag">~ 2 days</span>
              </button>

              <button
                type="button"
                className="btn-rate rate-good"
                onClick={e => {
                  e.stopPropagation()
                  handleRating(3)
                }}
              >
                <span className="rate-shortcut">3</span>
                <strong>Good</strong>
                <span className="interval-tag">~ 4-6 days</span>
              </button>

              <button
                type="button"
                className="btn-rate rate-easy"
                onClick={e => {
                  e.stopPropagation()
                  handleRating(4)
                }}
              >
                <span className="rate-shortcut">4</span>
                <strong>Easy</strong>
                <span className="interval-tag">&gt; 10 days</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Deck Complete Screen */
        <div className="deck-complete-card">
          <span className="complete-icon">🎉</span>
          <h2>Deck Review Complete!</h2>
          <p>You have successfully reviewed all due cards in the <strong>{selectedDeck}</strong> deck.</p>

          <div className="complete-stats-grid">
            <div className="comp-stat-box">
              <span className="stat-num">{sessionReviewedCount}</span>
              <span className="stat-label">Cards Reviewed</span>
            </div>
            <div className="comp-stat-box">
              <span className="stat-num success">
                {sessionReviewedCount > 0 ? Math.round((sessionCorrectCount / sessionReviewedCount) * 100) : 100}%
              </span>
              <span className="stat-label">Recall Accuracy</span>
            </div>
            <div className="comp-stat-box">
              <span className="stat-num highlight">🔥 {streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>

          <div className="complete-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={restartDeck}
            >
              🔄 Review Deck Again
            </button>
            <Link to="/mock-interview" className="btn btn-primary">
              ⏱️ Take a Timed Mock Interview →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
