import type { EvaluatedBadge } from '../../lib/badgeService'
import './BadgeCard.css'

interface Props {
  badge: EvaluatedBadge
  onClick: (badge: EvaluatedBadge) => void
}

export default function BadgeCard({ badge, onClick }: Props) {
  const { title, description, icon, tier, xp, target, unit, current, unlocked, progressPercent } = badge

  return (
    <div
      className={`badge-card tier-${tier} ${unlocked ? 'unlocked' : 'locked'}`}
      onClick={() => onClick(badge)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(badge)
        }
      }}
      aria-label={`${title} badge - ${unlocked ? 'Unlocked' : 'Locked'}`}
    >
      <div className="bc-top-row">
        <span className="bc-tier-pill">{tier}</span>
        <span className="bc-xp-pill">+{xp} XP</span>
      </div>

      <div className="bc-icon-wrap">
        <span className="bc-icon">{icon}</span>
        {unlocked && <span className="bc-unlocked-badge-mark">✓</span>}
      </div>

      <div className="bc-text">
        <h4 className="bc-title">{title}</h4>
        <p className="bc-desc">{description}</p>
      </div>

      {unlocked ? (
        <div className="bc-unlocked-hint">
          <span>✨ Unlocked &amp; Claimed</span>
        </div>
      ) : (
        <div className="bc-progress-wrap">
          <div className="bc-progress-meta">
            <span>{current} / {target} {unit}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="bc-progress-track">
            <div className="bc-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      )}
    </div>
  )
}
