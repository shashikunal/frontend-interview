import React from 'react'
import type { ParsedConceptQuestion } from '../../../lib/questionTemplate'
import './Templates.css'

interface Props {
  data: ParsedConceptQuestion
  headerActions?: React.ReactNode
  hideHeader?: boolean
}

export default function ConceptQuestionView({ data, headerActions, hideHeader = false }: Props) {
  return (
    <div className="template-view-container concept-template">
      {/* 1. Header Section */}
      {!hideHeader && (
        <div className="lc-header-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <h2 className="lc-question-title">
              #{data.questionNumber} — {data.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="template-type-badge concept">
                🧠 Core Concept
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

      {/* 2. Question Statement / Overview */}
      <section className="lc-section">
        <h3 className="lc-section-title">
          <span className="section-icon">❓</span> Question Overview
        </h3>
        <div className="concept-overview">
          {data.overview}
        </div>
      </section>

      {/* 3. Deep-Dive Explanation & Approach */}
      <section className="lc-section">
        <h3 className="lc-section-title">
          <span className="section-icon">📖</span> Detailed Explanation &amp; Approach
        </h3>
        <div style={{ lineHeight: 1.75 }}>
          {data.explanation.split(/\n{2,}/).map((para, idx) => (
            <p key={idx} className="concept-explanation-para">{para}</p>
          ))}
        </div>
      </section>

      {/* 4. Example Code Snippet (if available) */}
      {data.exampleCode && (
        <section className="lc-section">
          <h3 className="lc-section-title">
            <span className="section-icon">💻</span> Code Demonstration
          </h3>
          <pre className="lc-io-code"><code>{data.exampleCode}</code></pre>
        </section>
      )}
    </div>
  )
}
