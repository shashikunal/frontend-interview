import React, { useState } from 'react'
import type { ParsedDomQuestion } from '../../../lib/questionTemplate'
import './Templates.css'

interface Props {
  data: ParsedDomQuestion
  showSolutionAccordion?: boolean
  headerActions?: React.ReactNode
  hideHeader?: boolean
}

export default function DomBrowserQuestionView({
  data,
  showSolutionAccordion = true,
  headerActions,
  hideHeader = false,
}: Props) {
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="template-view-container dom-template">
      {/* 1. Header Section */}
      {!hideHeader && (
        <div className="lc-header-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <h2 className="lc-question-title">
              #{data.questionNumber} — {data.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="template-type-badge dom-browser">
                🌐 DOM &amp; Web APIs
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

      {/* 3. Requirements */}
      {data.requirements.length > 0 && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">✅</span> Requirements
          </h3>
          <ul className="lc-constraints-list">
            {data.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* 4. HTML/DOM Markup (if available) */}
      {data.htmlDom && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">🌐</span> HTML / DOM Structure
          </h3>
          <pre className="lc-io-code"><code>{data.htmlDom}</code></pre>
        </section>
      )}

      {/* 5. Candidate Task */}
      <section className="lc-section">
        <h3 className="lc-section-title">
          <span className="section-icon">💻</span> Candidate Task
        </h3>
        <div className="lc-task-box">
          <p style={{ margin: 0, color: 'var(--text-primary)' }}>
            {data.candidateTask}
          </p>
        </div>
      </section>

      {/* 6. Performance / Complexity (if present) */}
      {data.performance && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">⚡</span> Performance &amp; Web Vitals
          </h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            {data.performance}
          </p>
        </section>
      )}

      {/* 7. Solution & Explanation */}
      {showSolutionAccordion && (
        <section className="lc-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="lc-section-title" style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span className="section-icon">📖</span> Implementation &amp; Solution
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
                  Architectural Explanation
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
                    DOM Solution Code
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
