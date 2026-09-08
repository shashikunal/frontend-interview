import { useState } from 'react'
import aiFeedbackService, {
  type AIFeedbackReport,
  type FeedbackRequest,
  gradeToColor,
  gradeToPercent,
} from '../../lib/aiFeedbackService'
import './AIFeedbackReport.css'

interface Props {
  payload: FeedbackRequest
}

// ── Severity icon helper ────────────────────────────────────────────
function SeverityIcon({ s }: { s: 'critical' | 'warning' | 'info' }) {
  if (s === 'critical') return <span>🔴</span>
  if (s === 'warning')  return <span>🟡</span>
  return <span>🔵</span>
}

// ── Main component ──────────────────────────────────────────────────
export default function AIFeedbackReport({ payload }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [report, setReport] = useState<AIFeedbackReport | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const generate = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      let result: AIFeedbackReport
      try {
        result = await aiFeedbackService.analyze(payload)
      } catch {
        // API unreachable (local dev) — use browser-side fallback
        result = aiFeedbackService.localFallback(payload)
      }
      setReport(result)
      setStatus('done')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  // ── Idle: show trigger button ───────────────────────────────────
  if (status === 'idle') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <button
          type="button"
          id="aifr-generate-btn"
          className="aifr-trigger-btn"
          onClick={() => void generate()}
        >
          🤖 Get AI Feedback
        </button>
      </div>
    )
  }

  // ── Loading skeleton ────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="aifr-wrap">
        <div className="aifr-skeleton">
          <div className="aifr-spinner" />
          <p className="aifr-skeleton-msg">🤖 Analyzing your code…</p>
          <p className="aifr-skeleton-sub">GPT-4o is reviewing your implementation quality, patterns, and test results</p>
        </div>
      </div>
    )
  }

  // ── Error state ─────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="aifr-wrap">
        <div className="aifr-error">
          ⚠️ {errorMsg || 'Failed to generate AI feedback.'}
          <button
            type="button"
            style={{ marginLeft: 'auto', background: 'none', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 8, padding: '5px 12px', cursor: 'pointer', fontSize: '0.8rem' }}
            onClick={() => void generate()}
          >Retry</button>
        </div>
      </div>
    )
  }

  if (!report) return null

  const gradeColor = gradeToColor(report.overallGrade)
  const gradePct   = gradeToPercent(report.overallGrade)

  // ── Full report ─────────────────────────────────────────────────
  return (
    <div className="aifr-wrap">
      {/* Header */}
      <div className="aifr-header">
        <span className="aifr-ai-badge">
          {report.isAiFeedback ? '✨ GPT-4o Analysis' : '🔍 Auto Analysis'}
        </span>
        {!report.isAiFeedback && (
          <span className="aifr-fallback-badge">⚡ Rule-based fallback</span>
        )}
        <h3 className="aifr-title">AI Interview Feedback</h3>
      </div>

      {/* Grade + Summary */}
      <div className="aifr-top-row">
        <div className="aifr-grade-block">
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }} />
          <div
            className="aifr-grade-letter"
            style={{ color: gradeColor, textShadow: `0 0 30px ${gradeColor}60` }}
          >
            {report.overallGrade}
          </div>
          <div
            className="aifr-grade-label"
            style={{ color: gradeColor + '90' }}
          >
            {gradePct}%
          </div>
        </div>

        <div className="aifr-summary-block">
          <p className="aifr-summary-text">{report.summary}</p>
          {report.interviewerNote && (
            <div className="aifr-interviewer-note">
              <span className="aifr-interviewer-avatar">👔</span>
              <p className="aifr-interviewer-quote">"{report.interviewerNote}"</p>
            </div>
          )}
        </div>
      </div>

      {/* Strengths + Improvements */}
      <div className="aifr-two-col">
        {report.strengths?.length > 0 && (
          <div className="aifr-card">
            <div className="aifr-card-title green">✅ Strengths</div>
            <ul className="aifr-list">
              {report.strengths.map((s, i) => (
                <li key={i} className="aifr-list-item">
                  <span className="aifr-list-dot green" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.improvements?.length > 0 && (
          <div className="aifr-card">
            <div className="aifr-card-title amber">⚠️ Improvements</div>
            <ul className="aifr-list">
              {report.improvements.map((m, i) => (
                <li key={i} className="aifr-list-item">
                  <span className="aifr-list-dot amber" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Code Smells */}
      {report.codeSmells?.length > 0 && (
        <div className="aifr-smells-section">
          <div className="aifr-smells-title">🔍 Code Review Findings</div>
          <div className="aifr-smell-list">
            {report.codeSmells.map((smell, i) => (
              <div key={i} className={`aifr-smell-card ${smell.severity}`}>
                <SeverityIcon s={smell.severity} />
                <div className="aifr-smell-content">
                  <p className="aifr-smell-title">{smell.title}</p>
                  <p className="aifr-smell-desc">{smell.description}</p>
                </div>
                <span className={`aifr-smell-severity ${smell.severity}`}>
                  {smell.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {report.nextSteps?.length > 0 && (
        <div className="aifr-next-section">
          <div className="aifr-next-title">🚀 Next Steps</div>
          <ol className="aifr-next-list">
            {report.nextSteps.map((step, i) => (
              <li key={i} className="aifr-next-item">
                <span className="aifr-next-num">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
