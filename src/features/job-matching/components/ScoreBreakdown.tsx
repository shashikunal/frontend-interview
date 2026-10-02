import type { ScoreBreakdownItem } from '../types/jobMatch.types'

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdownItem[]
  overallScore: number
}

export default function ScoreBreakdown({ breakdown, overallScore }: ScoreBreakdownProps) {
  return (
    <div className="jm-section">
      <h3 className="jm-section-title">Score Breakdown</h3>
      <div className="jm-score-breakdown">
        <div className="jm-overall-score">
          <div className="jm-overall-score-value">{overallScore}</div>
          <div className="jm-overall-score-label">Overall Match</div>
        </div>
        <div className="jm-breakdown-list">
          {breakdown.map((item, idx) => {
            const percentage = Math.round((item.score / item.maxScore) * 100)
            return (
              <div key={idx} className="jm-breakdown-item">
                <div className="jm-breakdown-header">
                  <span className="jm-breakdown-label">{item.label}</span>
                  <span className="jm-breakdown-score">
                    {item.score}/{item.maxScore}
                    <span className="jm-breakdown-weight"> (weight: {Math.round(item.weight * 100)}%)</span>
                  </span>
                </div>
                <div className="jm-breakdown-bar-track">
                  <div
                    className="jm-breakdown-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="jm-breakdown-desc">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
