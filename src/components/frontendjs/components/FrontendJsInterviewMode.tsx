// src/components/frontendjs/components/FrontendJsInterviewMode.tsx
import { useState, useEffect, useMemo } from 'react'
import type { FrontendJsQuestion } from '../data/frontendJsTypes'
import { frontendJsProgressService } from '../lib/frontendJsProgressService'

interface Props {
  questions: FrontendJsQuestion[]
  onSelectQuestion: (questionId: string) => void
  onExit: () => void
}

export function FrontendJsInterviewMode({ questions, onSelectQuestion, onExit }: Props) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3600) // 60 minutes
  const [isActive, setIsActive] = useState<boolean>(false)
  const [isFinished, setIsFinished] = useState<boolean>(false)

  // Pick 5 curated interview questions: 2 Easy, 2 Medium, 1 Hard
  const interviewSet = useMemo(() => {
    const easy = questions.filter(q => q.difficulty === 'Easy')
    const med = questions.filter(q => q.difficulty === 'Medium')
    const hard = questions.filter(q => q.difficulty === 'Hard')

    return [
      easy[Math.floor(Math.random() * easy.length)] || questions[0],
      easy[Math.floor(Math.random() * easy.length)] || questions[1],
      med[Math.floor(Math.random() * med.length)] || questions[2],
      med[Math.floor(Math.random() * med.length)] || questions[3],
      hard[Math.floor(Math.random() * hard.length)] || questions[4],
    ]
  }, [questions])

  useEffect(() => {
    let timer: number
    if (isActive && secondsRemaining > 0 && !isFinished) {
      timer = window.setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            setIsFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isActive, secondsRemaining, isFinished])

  const solvedSet = frontendJsProgressService.getSolvedIds()
  const solvedCount = interviewSet.filter(q => solvedSet.has(q.id)).length
  const totalScore = Math.round((solvedCount / interviewSet.length) * 100)

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="fjs-interview-modal-overlay">
      <div className="fjs-interview-card">
        <div className="fjs-interview-header">
          <div>
            <span className="fjs-im-pill">⏱️ 60-MINUTE SIMULATION</span>
            <h2>Frontend JavaScript Technical Interview</h2>
          </div>
          <button type="button" className="fjs-im-close" onClick={onExit}>×</button>
        </div>

        {!isActive && !isFinished ? (
          <div className="fjs-interview-intro">
            <p>
              Experience a calibrated, realistic 60-minute technical phone screen. You will tackle 5 sequential challenges:
            </p>
            <ul className="fjs-im-rules">
              <li>🟢 2 Easy Warmup Questions (Type mechanics / Core methods)</li>
              <li>🟡 2 Medium Core Questions (Closures / Promises / Array algorithms)</li>
              <li>🔴 1 Hard / Production Scenario Question (Race condition / Concurrency)</li>
              <li>🕒 Strict 60:00 countdown clock</li>
            </ul>
            <button
              type="button"
              className="fjs-btn-start-interview"
              onClick={() => setIsActive(true)}
            >
              Start 60-Minute Interview Session
            </button>
          </div>
        ) : isFinished ? (
          <div className="fjs-interview-scorecard">
            <h3>Interview Simulation Completed!</h3>
            <div className="fjs-score-circle">
              <span className="fjs-sc-val">{totalScore}%</span>
              <span className="fjs-sc-lbl">{solvedCount} / {interviewSet.length} Solved</span>
            </div>
            <div className="fjs-sc-verdict">
              {totalScore >= 80 ? (
                <span className="fjs-verdict strong-hire">🌟 Verdict: Strong Hire</span>
              ) : totalScore >= 60 ? (
                <span className="fjs-verdict hire">✓ Verdict: Lean Hire</span>
              ) : (
                <span className="fjs-verdict no-hire">Needs Practice</span>
              )}
            </div>
            <button type="button" className="fjs-btn-start-interview" onClick={onExit}>
              Return to Studio
            </button>
          </div>
        ) : (
          <div className="fjs-interview-active">
            <div className="fjs-im-timer-bar">
              <span>Time Remaining:</span>
              <span className={`fjs-timer-clock ${secondsRemaining < 300 ? 'urgent' : ''}`}>
                {formatTime(secondsRemaining)}
              </span>
              <button
                type="button"
                className="fjs-btn-finish-early"
                onClick={() => setIsFinished(true)}
              >
                Finish &amp; Submit Scorecard
              </button>
            </div>

            <div className="fjs-im-questions-list">
              {interviewSet.map((q, idx) => {
                const isSolved = solvedSet.has(q.id)
                return (
                  <div key={q.id} className="fjs-im-q-row">
                    <div className="fjs-im-q-left">
                      <span className="fjs-im-num">Q{idx + 1}</span>
                      <span className={`fjs-diff-pill ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      <strong>{q.title}</strong>
                      <span className="fjs-im-cat">({q.category})</span>
                    </div>
                    <div className="fjs-im-q-right">
                      {isSolved ? (
                        <span className="fjs-im-solved-tag">✓ Solved</span>
                      ) : (
                        <button
                          type="button"
                          className="fjs-im-solve-btn"
                          onClick={() => {
                            onSelectQuestion(q.id)
                            onExit()
                          }}
                        >
                          Open &amp; Code →
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
