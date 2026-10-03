interface ScoreCardProps {
  label: string
  value: number | null
  max?: number
  icon?: string
  description?: string
}

function getScoreColor(value: number, max: number): string {
  const pct = (value / max) * 100
  if (pct >= 75) return '#10b981'
  if (pct >= 50) return '#f59e0b'
  return '#ef4444'
}

export default function ScoreCard({ label, value, max = 100, icon, description }: ScoreCardProps) {
  const displayValue = value !== null ? Math.round(value) : null
  const color = displayValue !== null ? getScoreColor(displayValue, max) : 'var(--text-muted)'

  return (
    <div className="score-card">
      <div className="score-card-header">
        {icon && <span className="score-card-icon">{icon}</span>}
        <span className="score-card-label">{label}</span>
      </div>
      <div className="score-card-value" style={{ color }}>
        {displayValue !== null ? (
          <>
            {displayValue}
            <span className="score-card-max">/{max}</span>
          </>
        ) : (
          '—'
        )}
      </div>
      {description && <p className="score-card-desc">{description}</p>}
    </div>
  )
}
