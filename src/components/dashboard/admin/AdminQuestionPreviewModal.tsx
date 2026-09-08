import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { CustomMCQuestion } from '../../../lib/questionManagementService'
import type { MCQuestion } from '../../machinecoding/machineCodingQuestions'

type AnyQuestion = CustomMCQuestion | MCQuestion

interface Props {
  question: AnyQuestion
  onClose: () => void
  onEdit?: () => void
}

const DIFF_COLORS: Record<string, string> = {
  Easy: '#10b981',
  Medium: '#f59e0b',
  Hard: '#ef4444',
  Senior: '#a855f7',
}

const CAT_COLORS: Record<string, string> = {
  ReactJS: '#38bdf8',
  JavaScript: '#fbbf24',
  TypeScript: '#818cf8',
  'React Redux Toolkit': '#ec4899',
  'React Query': '#34d399',
  DOM: '#fb923c',
  LeetCode: '#22c55e',
}

export default function AdminQuestionPreviewModal({ question, onClose, onEdit }: Props) {
  const diff = question.difficulty
  const cat = question.category
  const isCustom = 'isCustom' in question

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const content = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 20, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        boxSizing: 'border-box',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: '#0f1629',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 860,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(99, 102, 241, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '22px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{
                background: 'rgba(99,102,241,0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {question.id}
              </span>
              <span style={{
                background: `${CAT_COLORS[cat] ?? '#94a3b8'}20`,
                color: CAT_COLORS[cat] ?? '#94a3b8',
                border: `1px solid ${CAT_COLORS[cat] ?? '#94a3b8'}40`,
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {cat}
              </span>
              <span style={{
                background: `${DIFF_COLORS[diff] ?? '#94a3b8'}20`,
                color: DIFF_COLORS[diff] ?? '#94a3b8',
                border: `1px solid ${DIFF_COLORS[diff] ?? '#94a3b8'}40`,
                borderRadius: 6,
                padding: '2px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}>
                {diff}
              </span>
              {'timeEstimate' in question && (
                <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>⏱ {question.timeEstimate}</span>
              )}
              {isCustom && (
                <span style={{
                  background: 'rgba(16,185,129,0.12)',
                  color: '#34d399',
                  border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>CUSTOM</span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>
              {question.title}
            </h2>
            {'summary' in question && question.summary && (
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#64748b' }}>{question.summary}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                style={{
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#818cf8',
                  borderRadius: 8,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                ✏️ Edit
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              style={{
                width: 36, height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#94a3b8',
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: '24px 28px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          overflowY: 'auto',
          flex: 1,
        }}>

          {/* Description */}
          {'description' in question && question.description && (
            <Section title="📋 Problem Description">
              <pre style={{
                margin: 0,
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit',
                fontSize: '0.87rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
              }}>
                {question.description}
              </pre>
            </Section>
          )}

          {/* Requirements */}
          {'requirements' in question && question.requirements?.length > 0 && (
            <Section title="✅ Requirements">
              <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {question.requirements.map((r, i) => (
                  <li key={i} style={{ fontSize: '0.87rem', color: '#cbd5e1', lineHeight: 1.5 }}>{r}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Interview Tips + Common Mistakes */}
          {'interviewTips' in question && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {question.interviewTips?.length > 0 && (
                <Section title="💡 Interview Tips">
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {question.interviewTips.map((t, i) => (
                      <li key={i} style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{t}</li>
                    ))}
                  </ul>
                </Section>
              )}
              {'commonMistakes' in question && question.commonMistakes?.length > 0 && (
                <Section title="⚠️ Common Mistakes">
                  <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {question.commonMistakes.map((m, i) => (
                      <li key={i} style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>{m}</li>
                    ))}
                  </ul>
                </Section>
              )}
            </div>
          )}

          {/* Starter Code */}
          {'starterCode' in question && question.starterCode && (
            <Section title="🚀 Starter Code">
              <pre style={{
                background: '#0d1117',
                borderRadius: 10,
                padding: '14px 16px',
                margin: 0,
                fontSize: '0.8rem',
                color: '#e2e8f0',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                overflowX: 'auto',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {question.starterCode}
              </pre>
            </Section>
          )}

          {/* Solution Code */}
          {'solutionCode' in question && question.solutionCode && (
            <Section title="🏁 Solution Code">
              <pre style={{
                background: '#0d1117',
                borderRadius: 10,
                padding: '14px 16px',
                margin: 0,
                fontSize: '0.8rem',
                color: '#a5f3fc',
                fontFamily: '"Fira Code", "Cascadia Code", monospace',
                overflowX: 'auto',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {question.solutionCode}
              </pre>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '16px 28px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          gap: 10,
          flexShrink: 0,
        }}>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              style={{
                background: 'linear-gradient(135deg,#4f46e5,#6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '9px 20px',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >✏️ Edit Question</button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8',
              borderRadius: 10,
              padding: '9px 20px',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >Close</button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#4b5563',
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

