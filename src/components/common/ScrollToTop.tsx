import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './ScrollToTop.css'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Scroll to top automatically whenever the route / pathname changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [pathname])

  // Track window scroll position and calculate progress percentage
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0

      setScrollProgress(Math.min(100, Math.max(0, progress)))
      setVisible(currentScroll > 240)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Circular progress SVG parameters
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference

  return (
    <button
      type="button"
      className={`scroll-to-top-btn ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <svg className="scroll-progress-ring" width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
        <circle
          className="scroll-progress-bg"
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="3"
        />
        <circle
          className="scroll-progress-fill"
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <svg
        className="scroll-arrow-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
      <span className="scroll-tooltip">Back to top</span>
    </button>
  )
}
