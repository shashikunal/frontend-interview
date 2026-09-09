import React, { useState } from 'react'
import type { DSAQuestion } from '../data/dsaTypes'

interface Props {
  questions: DSAQuestion[]
  onStartSession: (selectedQuestions: DSAQuestion[]) => void
  onClose: () => void
}

export const DSAInterviewMode: React.FC<Props> = ({
  questions,
  onStartSession,
  onClose,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(45)
  const [problemCount, setProblemCount] = useState<number>(2)
  const [difficultyTier, setDifficultyTier] = useState<'mixed' | 'easy_medium' | 'medium_hard'>('mixed')

  const handleStart = () => {
    let pool = [...questions]
    if (difficultyTier === 'easy_medium') {
      pool = pool.filter(q => q.difficulty === 'Easy' || q.difficulty === 'Medium')
    } else if (difficultyTier === 'medium_hard') {
      pool = pool.filter(q => q.difficulty === 'Medium' || q.difficulty === 'Difficult')
    }

    // Shuffle and pick
    const shuffled = [...pool].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, problemCount)
    onStartSession(selected)
  }

  return (
    <div className="dsa-modal-overlay">
      <div className="dsa-interview-modal">
        <div className="dsa-modal-header">
          <h2>⏱️ DSA Mock Interview Mode</h2>
          <button className="dsa-icon-btn" onClick={onClose}>✕</button>
        </div>

        <div className="dsa-modal-body">
          <p className="dsa-modal-desc">
            Simulate a real FAANG / Tier-1 technical phone screen or on-site DSA round.
            Solve algorithmic problems against a live countdown timer.
          </p>

          <div className="dsa-modal-form-group">
            <label>Interview Duration:</label>
            <div className="dsa-option-cards">
              {[30, 45, 60].map(mins => (
                <button
                  key={mins}
                  className={`dsa-option-card ${durationMinutes === mins ? 'selected' : ''}`}
                  onClick={() => setDurationMinutes(mins)}
                >
                  <span className="dsa-opt-title">{mins} Minutes</span>
                  <span className="dsa-opt-sub">
                    {mins === 30 ? 'Sprint' : mins === 45 ? 'Standard Phone Screen' : 'On-Site Deep Dive'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="dsa-modal-form-group">
            <label>Number of Problems:</label>
            <div className="dsa-option-cards">
              {[1, 2, 3].map(cnt => (
                <button
                  key={cnt}
                  className={`dsa-option-card ${problemCount === cnt ? 'selected' : ''}`}
                  onClick={() => setProblemCount(cnt)}
                >
                  <span className="dsa-opt-title">{cnt} Problem{cnt > 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="dsa-modal-form-group">
            <label>Difficulty Tier:</label>
            <div className="dsa-option-cards">
              <button
                className={`dsa-option-card ${difficultyTier === 'easy_medium' ? 'selected' : ''}`}
                onClick={() => setDifficultyTier('easy_medium')}
              >
                <span className="dsa-opt-title">Junior / Mid</span>
                <span className="dsa-opt-sub">Easy & Medium</span>
              </button>
              <button
                className={`dsa-option-card ${difficultyTier === 'mixed' ? 'selected' : ''}`}
                onClick={() => setDifficultyTier('mixed')}
              >
                <span className="dsa-opt-title">Standard FAANG</span>
                <span className="dsa-opt-sub">Balanced Blend</span>
              </button>
              <button
                className={`dsa-option-card ${difficultyTier === 'medium_hard' ? 'selected' : ''}`}
                onClick={() => setDifficultyTier('medium_hard')}
              >
                <span className="dsa-opt-title">Senior / Staff</span>
                <span className="dsa-opt-sub">Medium & Hard</span>
              </button>
            </div>
          </div>
        </div>

        <div className="dsa-modal-footer">
          <button className="dsa-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="dsa-btn-primary" onClick={handleStart}>
            🚀 Start Timed Interview
          </button>
        </div>
      </div>
    </div>
  )
}
