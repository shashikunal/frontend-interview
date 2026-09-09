import React, { useMemo } from 'react'
import type { DSASubmission } from '../data/dsaTypes'

interface Props {
  submissions: DSASubmission[]
}

export const DSAHeatmap: React.FC<Props> = ({ submissions }) => {
  // Aggregate submissions by date YYYY-MM-DD
  const dateCounts = useMemo(() => {
    const map = new Map<string, number>()
    submissions.forEach(s => {
      const dateStr = s.timestamp.split('T')[0]
      map.set(dateStr, (map.get(dateStr) || 0) + 1)
    })
    return map
  }, [submissions])

  // Build last 24 weeks (168 days) of cells
  const days = useMemo(() => {
    const result: { dateStr: string; count: number; dayOfWeek: number }[] = []
    const today = new Date()

    // 24 weeks = 168 days
    for (let i = 167; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const count = dateCounts.get(dateStr) || 0
      result.push({
        dateStr,
        count,
        dayOfWeek: d.getDay(), // 0 = Sun, 6 = Sat
      })
    }
    return result
  }, [dateCounts])

  const totalActiveDays = useMemo(() => {
    return Array.from(dateCounts.values()).filter(c => c > 0).length
  }, [dateCounts])

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(255, 255, 255, 0.06)'
    if (count === 1) return 'rgba(34, 197, 94, 0.35)'
    if (count <= 3) return 'rgba(34, 197, 94, 0.65)'
    return '#22c55e'
  }

  return (
    <div className="dsa-heatmap-card">
      <div className="dsa-hm-header">
        <div className="dsa-hm-title-box">
          <span className="dsa-hm-icon">🟩</span>
          <h4>Submission Activity Heatmap</h4>
        </div>
        <div className="dsa-hm-stats">
          <span>Active Days: <strong>{totalActiveDays}</strong></span>
          <span>•</span>
          <span>Total Submissions: <strong>{submissions.length}</strong></span>
        </div>
      </div>

      <div className="dsa-hm-grid-container">
        <div className="dsa-hm-grid">
          {days.map(d => (
            <div
              key={d.dateStr}
              className="dsa-hm-cell"
              style={{ background: getColor(d.count) }}
              title={`${d.count} submission${d.count !== 1 ? 's' : ''} on ${d.dateStr}`}
            />
          ))}
        </div>
      </div>

      <div className="dsa-hm-footer">
        <span className="dsa-hm-legend-label">Less</span>
        <div className="dsa-hm-legend-cells">
          <span style={{ background: 'rgba(255, 255, 255, 0.06)' }} />
          <span style={{ background: 'rgba(34, 197, 94, 0.35)' }} />
          <span style={{ background: 'rgba(34, 197, 94, 0.65)' }} />
          <span style={{ background: '#22c55e' }} />
        </div>
        <span className="dsa-hm-legend-label">More</span>
      </div>
    </div>
  )
}
