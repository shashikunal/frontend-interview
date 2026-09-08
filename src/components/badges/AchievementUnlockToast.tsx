import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { playAchievementChime, type EvaluatedBadge } from '../../lib/badgeService'
import BadgeModal from './BadgeModal'
import './AchievementUnlockToast.css'

interface ToastItem {
  id: string
  badge: EvaluatedBadge
  createdAt: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  rotation: number
  vRot: number
}

const CONFETTI_COLORS = ['#f59e0b', '#38bdf8', '#a855f7', '#10b981', '#fbbf24', '#ec4899', '#ffffff']

export default function AchievementUnlockToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [modalBadge, setModalBadge] = useState<EvaluatedBadge | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Trigger confetti burst around the toast
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Origin: bottom-right corner where the toast appears
    const originX = Math.max(window.innerWidth - 240, 100)
    const originY = Math.max(window.innerHeight - 120, 100)

    const newParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      const angle = (Math.PI * 1.1) + (Math.random() * Math.PI * 0.8) // Shoot up and left
      const speed = 4 + Math.random() * 9
      newParticles.push({
        x: originX + (Math.random() * 80 - 40),
        y: originY + (Math.random() * 40 - 20),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 6,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        alpha: 1,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
      })
    }
    particlesRef.current = newParticles

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let activeCount = 0

      for (const p of particlesRef.current) {
        if (p.alpha <= 0.01) continue
        activeCount++
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.22 // gravity
        p.alpha -= 0.015 // fade
        p.rotation += p.vRot

        ctx.save()
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7)
        ctx.restore()
      }

      if (activeCount > 0) {
        animationFrameRef.current = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(render)
  }, [])

  // Listen for custom 'achievement:unlocked' events
  useEffect(() => {
    const handleUnlock = (e: Event) => {
      const customEvent = e as CustomEvent<EvaluatedBadge>
      const badge = customEvent.detail
      if (!badge) return

      const toastId = `${badge.id}-${Date.now()}`
      setToasts(prev => [...prev.slice(-2), { id: toastId, badge, createdAt: Date.now() }])

      // Play audio chime and confetti
      playAchievementChime()
      fireConfetti()

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toastId))
      }, 6000)
    }

    window.addEventListener('achievement:unlocked', handleUnlock)
    return () => {
      window.removeEventListener('achievement:unlocked', handleUnlock)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [fireConfetti])

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  if (toasts.length === 0 && !modalBadge) return null

  const portalContent = (
    <>
      {/* Confetti Canvas */}
      <canvas ref={canvasRef} className="achievement-confetti-canvas" />

      {/* Floating Toast Queue */}
      <div className="achievement-toast-portal" role="region" aria-label="Achievement Notifications">
        {toasts.map(toast => {
          const { badge } = toast
          return (
            <div
              key={toast.id}
              className={`achievement-toast-card tier-${badge.tier}`}
              role="alert"
            >
              <div className="ach-toast-main">
                <div className="ach-toast-icon-wrap" aria-hidden="true">
                  {badge.icon}
                </div>
                <div className="ach-toast-content">
                  <div className="ach-toast-eyebrow">
                    <span className="ach-toast-label">🏆 Unlocked</span>
                    <span className="ach-toast-tier-pill">{badge.tier}</span>
                  </div>
                  <h4 className="ach-toast-title">{badge.title}</h4>
                  <p className="ach-toast-desc">{badge.description}</p>
                </div>
              </div>

              <div className="ach-toast-actions">
                <span className="ach-toast-xp-pill">+{badge.xp} XP</span>
                <div className="ach-toast-btn-group">
                  <button
                    type="button"
                    className="ach-toast-inspect-btn"
                    onClick={() => {
                      setModalBadge(badge)
                      dismissToast(toast.id)
                    }}
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    className="ach-toast-dismiss-btn"
                    onClick={() => dismissToast(toast.id)}
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Progress Countdown Bar */}
              <div className="ach-toast-progress-track">
                <div className="ach-toast-progress-fill" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Modal if clicked */}
      {modalBadge && (
        <BadgeModal badge={modalBadge} onClose={() => setModalBadge(null)} />
      )}
    </>
  )

  return typeof document !== 'undefined' ? createPortal(portalContent, document.body) : null
}
