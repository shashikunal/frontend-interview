import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { EvaluatedBadge } from '../../lib/badgeService'
import './BadgeModal.css'

interface Props {
  badge: EvaluatedBadge | null
  onClose: () => void
}

export default function BadgeModal({ badge, onClose }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!badge) return null

  const { title, description, icon, tier, xp, target, unit, current, unlocked, progressPercent, unlockedAt } = badge

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  const content = (
    <div
      className="bm-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className={`bm-card tier-${tier}`}>
        <button
          type="button"
          className="bm-close-btn"
          onClick={onClose}
          aria-label="Close badge modal"
        >
          ✕
        </button>

        <div className="bm-halo">
          <span>{icon}</span>
        </div>

        <h3 className="bm-title">{title}</h3>
        <span className="bm-tier-tag">{tier.toUpperCase()} TIER</span>

        <p className="bm-desc">{description}</p>

        <div className="bm-details-box">
          <div className="bm-row">
            <span className="bm-row-label">Status</span>
            <span className="bm-row-val" style={{ color: unlocked ? '#10b981' : '#f59e0b' }}>
              {unlocked ? '✨ Unlocked' : '🔒 Locked'}
            </span>
          </div>

          <div className="bm-row">
            <span className="bm-row-label">XP Reward</span>
            <span className="bm-row-val" style={{ color: '#818cf8' }}>+{xp} XP</span>
          </div>

          <div className="bm-row">
            <span className="bm-row-label">Goal Requirement</span>
            <span className="bm-row-val">
              {current} / {target} {unit} ({progressPercent}%)
            </span>
          </div>

          {unlocked && formattedDate && (
            <div className="bm-row">
              <span className="bm-row-label">Unlocked Date</span>
              <span className="bm-row-val">{formattedDate}</span>
            </div>
          )}
        </div>

        <div className="bm-actions">
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
}
