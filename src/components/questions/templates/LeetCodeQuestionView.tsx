import React, { useState } from 'react'
import type { ParsedLeetCodeQuestion } from '../../../lib/questionTemplate'
import './Templates.css'

interface Props {
  data: ParsedLeetCodeQuestion
  showSolutionAccordion?: boolean
  headerActions?: React.ReactNode
  hideHeader?: boolean
}

export default function LeetCodeQuestionView({
  data,
  showSolutionAccordion = true,
  headerActions,
  hideHeader = false,
}: Props) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="template-view-container leetcode-template">
      {/* 1. Header Section */}
      {!hideHeader && (
        <div className="lc-header-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <h2 className="lc-question-title">
              #{data.questionNumber} — {data.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="template-type-badge leetcode">
                ⚡ LeetCode Problem
              </span>
              {headerActions}
            </div>
          </div>

        <div className="lc-meta-grid">
          <div className="lc-meta-item">
            <span className="lc-meta-label">Difficulty:</span>
            <span className={`badge badge-${data.difficulty.toLowerCase()}`}>
              {data.difficulty}
            </span>
          </div>

          <div className="lc-meta-item">
            <span className="lc-meta-label">Category:</span>
            <span className="lc-meta-val">{data.category}</span>
          </div>

          {data.pattern && (
            <div className="lc-meta-item">
              <span className="lc-meta-label">Pattern:</span>
              <span className="badge badge-source" style={{ color: '#f59e0b', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                {data.pattern}
              </span>
            </div>
          )}

          <div className="lc-meta-item">
            <span className="lc-meta-label">Technology:</span>
            <span className="lc-meta-val">{data.technology}</span>
          </div>
        </div>
      </div>
      )}

      {/* 2. Problem Statement */}
      <section className="lc-section">
        <h3 className="lc-section-title">
          <span className="section-icon">📋</span> Problem
        </h3>
        <div className="lc-problem-body">
          {data.problemText}
        </div>
      </section>

      {/* 3. Examples Section */}
      {data.examples.length > 0 && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">💡</span> Examples
          </h3>

          {data.examples.map((ex, idx) => (
            <div key={idx} className="lc-example-card">
              <span className="lc-example-head">{ex.title || `Example ${idx + 1}`}</span>

              {ex.input && (
                <div className="lc-io-block">
                  <span className="lc-io-label">Input</span>
                  <pre className="lc-io-code"><code>{ex.input}</code></pre>
                </div>
              )}

              {ex.output && (
                <div className="lc-io-block">
                  <span className="lc-io-label">Output</span>
                  <pre className="lc-io-code"><code>{ex.output}</code></pre>
                </div>
              )}

              {ex.explanation && (
                <div className="lc-io-explanation">
                  <strong>Explanation: </strong> {ex.explanation}
                </div>
              )}

              {!ex.input && !ex.output && ex.raw && (
                <pre className="lc-io-code"><code>{ex.raw}</code></pre>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 4. Constraints (preserved only if existing) */}
      {data.constraints.length > 0 && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">📏</span> Constraints
          </h3>
          <ul className="lc-constraints-list">
            {data.constraints.map((c, idx) => (
              <li key={idx}><code>{c}</code></li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. Candidate Task */}
      {data.functionSignature && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">💻</span> Candidate Task
          </h3>
          <div className="lc-task-box">
            <p style={{ margin: '0 0 10px', color: 'var(--text-secondary)' }}>
              Implement the solution matching the function signature below:
            </p>
            <pre className="lc-io-code"><code>{data.functionSignature}</code></pre>
          </div>
        </section>
      )}

      {/* 6. Complexity (preserved from existing explanation if available) */}
      {(data.timeComplexity || data.spaceComplexity) && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">⚡</span> Complexity
          </h3>
          <div className="lc-complexity-grid">
            {data.timeComplexity && (
              <div className="lc-complexity-card">
                <span className="lc-complexity-label">Time Complexity</span>
                <span className="lc-complexity-val">{data.timeComplexity}</span>
              </div>
            )}
            {data.spaceComplexity && (
              <div className="lc-complexity-card">
                <span className="lc-complexity-label">Space Complexity</span>
                <span className="lc-complexity-val">{data.spaceComplexity}</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. Hints (preserved if present, never fabricated) */}
      {data.hints.length > 0 && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">💡</span> Hints
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.hints.map((hint, idx) => (
              <div key={idx} className="lc-hint-item">
                <strong>Hint {idx + 1}: </strong> {hint}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Interview Follow-Ups (preserved if present) */}
      {data.followUps && data.followUps.length > 0 && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">🎯</span> Interview Follow-Ups
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.followUps.map((fu, idx) => (
              <div key={idx} className="lc-followup-item">
                <strong>Follow-up {idx + 1}: </strong> {fu}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Solution & Explanation */}
      {showSolutionAccordion && (
        <section className="lc-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="lc-section-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span className="section-icon">📖</span> Reference Solution &amp; Explanation
            </h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? 'Hide Solution' : 'Reveal Solution'}
            </button>
          </div>

          {showSolution && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Explanation &amp; Approach
                </h4>
                <div style={{ background: 'var(--surface-hover)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', lineHeight: 1.7 }}>
                  {data.explanation.split(/\n{2,}/).map((p, i) => (
                    <p key={i} style={{ margin: '0 0 10px' }}>{p}</p>
                  ))}
                </div>
              </div>

              {data.solution && (
                <div>
                  <h4 style={{ margin: '0 0 8px', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    Solution Implementation
                  </h4>
                  <pre className="lc-io-code"><code>{data.solution}</code></pre>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
