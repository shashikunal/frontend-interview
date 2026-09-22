// src/features/interview-questions/components/MCQInteractiveCard.tsx
import React, { useState } from 'react'
import type { MasterQuestion, MCQOption } from '../types/interviewQuestions.types'
import { FormattedAnswerText } from './FormattedAnswerText'

interface MCQInteractiveCardProps {
  question: MasterQuestion
  onSpeakExplanation?: (text: string) => void
}

export const MCQInteractiveCard: React.FC<MCQInteractiveCardProps> = ({
  question,
  onSpeakExplanation,
}) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const isAnswered = selectedKey !== null

  // Normalize options array
  const rawOptions = question.options || []
  const options: MCQOption[] = rawOptions.map((opt, index) => {
    const defaultKey = String.fromCharCode(65 + index) // A, B, C, D
    if (typeof opt === 'string') {
      // Check if string starts with "A. " or "A) "
      const match = opt.match(/^([A-Da-d])[\.\)]\s*(.*)$/)
      if (match) {
        return {
          key: match[1].toUpperCase(),
          text: match[2],
        }
      }
      return {
        key: defaultKey,
        text: opt,
      }
    }
    return {
      key: opt.key || defaultKey,
      text: opt.text,
      explanation: opt.explanation,
    }
  })

  const correctAnswerKey = (question.correctAnswer || 'A').toUpperCase()
  const isSelectedCorrect = selectedKey?.toUpperCase() === correctAnswerKey

  const handleSelect = (key: string) => {
    setSelectedKey(key)
  }

  const handleReset = () => {
    setSelectedKey(null)
  }

  // Explanation string for TTS
  const fullExplanationForSpeech = `
    ${isSelectedCorrect ? 'Correct!' : 'Incorrect.'}
    The correct answer is Option ${correctAnswerKey}.
    ${question.mcqExplanation || question.simpleExplanation || question.shortAnswer || ''}
  `

  return (
    <div
      className="mqb-section-card"
      id={`mcq-card-${question.id}`}
      style={{
        border: '1px solid var(--mqb-border)',
        borderRadius: '16px',
        padding: '1.5rem',
        background: 'var(--mqb-bg-card)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🎯</span>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--mqb-text-primary)' }}>
            Multiple Choice Practice
          </span>
        </div>
        {isAnswered && (
          <button
            type="button"
            className="mqb-action-pill-btn"
            onClick={handleReset}
            style={{ fontSize: '0.8rem' }}
            aria-label="Try question again"
          >
            🔄 Try Again
          </button>
        )}
      </div>

      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--mqb-text-primary)', marginBottom: '1.25rem', lineHeight: '1.6' }}>
        {question.mcqQuestion || question.question}
      </p>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {options.map((opt) => {
          const isSelected = selectedKey === opt.key
          const isThisCorrect = opt.key.toUpperCase() === correctAnswerKey

          let borderColor = 'var(--mqb-border)'
          let bgColor = 'var(--mqb-card-subtle-bg)'
          let textColor = 'var(--mqb-text-primary)'

          if (isAnswered) {
            if (isThisCorrect) {
              borderColor = 'var(--mqb-easy-border)'
              bgColor = 'var(--mqb-easy-bg)'
              textColor = 'var(--mqb-easy-text)'
            } else if (isSelected && !isThisCorrect) {
              borderColor = 'var(--mqb-diff-border)'
              bgColor = 'var(--mqb-diff-bg)'
              textColor = 'var(--mqb-diff-text)'
            }
          } else if (isSelected) {
            borderColor = 'var(--mqb-accent-bright)'
            bgColor = 'rgba(99, 102, 241, 0.1)'
          }

          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelect(opt.key)}
              disabled={isAnswered}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1.15rem',
                borderRadius: '12px',
                border: `1.5px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                textAlign: 'left',
                cursor: isAnswered ? 'default' : 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                fontSize: '0.98rem',
                lineHeight: '1.5',
              }}
              aria-label={`Option ${opt.key}: ${opt.text}`}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  background: isAnswered && isThisCorrect
                    ? 'rgba(16, 185, 129, 0.25)'
                    : isAnswered && isSelected && !isThisCorrect
                    ? 'rgba(239, 68, 68, 0.25)'
                    : 'rgba(255, 255, 255, 0.08)',
                  color: textColor,
                  flexShrink: 0,
                }}
              >
                {opt.key}
              </span>
              <span style={{ flex: 1 }}>{opt.text}</span>
            </button>
          )
        })}
      </div>

      {/* Answer & Explanation Feedback */}
      {isAnswered && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1.25rem',
            borderRadius: '14px',
            border: `1.5px solid ${isSelectedCorrect ? 'var(--mqb-easy-border)' : 'var(--mqb-diff-border)'}`,
            background: isSelectedCorrect ? 'var(--mqb-easy-bg)' : 'var(--mqb-diff-bg)',
          }}
        >
          {/* Visual Feedback Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: isSelectedCorrect ? 'var(--mqb-easy-text)' : 'var(--mqb-diff-text)',
                }}
              >
                {isSelectedCorrect ? '✓ Correct' : '✕ Incorrect'}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--mqb-text-primary)' }}>
                • Correct Answer: <strong>Option {correctAnswerKey}</strong>
              </span>
            </div>

            {onSpeakExplanation && (
              <button
                type="button"
                className="mqb-action-pill-btn"
                onClick={() => onSpeakExplanation(fullExplanationForSpeech)}
                aria-label="Read MCQ explanation aloud"
              >
                🔊 Listen
              </button>
            )}
          </div>

          {/* Explanation */}
          <div style={{ color: 'var(--mqb-text-primary)', marginTop: '0.5rem' }}>
            <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--mqb-text-primary)' }}>
              Why?
            </h4>
            <div style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--mqb-text-secondary)', marginBottom: '1rem' }}>
              <FormattedAnswerText
                text={
                  question.mcqExplanation ||
                  question.simpleExplanation ||
                  question.detailedAnswer ||
                  question.shortAnswer ||
                  'Option ' + correctAnswerKey + ' is the correct answer according to web specifications.'
                }
              />
            </div>

            {/* Why other options are wrong */}
            {options.some(o => o.key.toUpperCase() !== correctAnswerKey && (o.explanation || (question.wrongOptionExplanations && question.wrongOptionExplanations[o.key]))) && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--mqb-diff-text)' }}>
                  Why the other options are wrong:
                </h4>
                <ul className="mqb-bullet-list" style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {options
                    .filter(o => o.key.toUpperCase() !== correctAnswerKey)
                    .map(o => {
                      const exp = o.explanation || (question.wrongOptionExplanations ? question.wrongOptionExplanations[o.key] : '')
                      if (!exp) return null
                      return (
                        <li key={o.key} style={{ fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '0.35rem' }}>
                          <strong>{o.key}.</strong> {exp}
                        </li>
                      )
                    })}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
