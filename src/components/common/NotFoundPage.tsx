import { useState, useMemo } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import './NotFoundPage.css'

interface QuickDestination {
  title: string
  path: string
  icon: string
  category: string
  description: string
}

const ALL_DESTINATIONS: QuickDestination[] = [
  {
    title: 'Candidate Dashboard',
    path: '/dashboard',
    icon: '📊',
    category: 'Hub',
    description: 'Track progress, active streaks, and performance analytics.',
  },
  {
    title: 'Machine Coding Studio',
    path: '/machine-coding',
    icon: '⚡',
    category: 'Studio',
    description: 'Interactive component building with live DOM previews.',
  },
  {
    title: 'DSA Algorithm Bank',
    path: '/dsa',
    icon: '🧠',
    category: 'Curriculum',
    description: '1,000 FAANG data structures and algorithms questions.',
  },
  {
    title: 'Core JavaScript Studio',
    path: '/core-programming',
    icon: '☕',
    category: 'Studio',
    description: 'Closures, Event Loop, Promises, and deep polyfills.',
  },
  {
    title: 'Frontend JS Studio',
    path: '/frontend-javascript',
    icon: '🌐',
    category: 'Studio',
    description: 'Web APIs, DOM manipulation, custom hooks, and events.',
  },
  {
    title: 'AI Video Mock Interview',
    path: '/ai-video-mock',
    icon: '🤖',
    category: 'Practice',
    description: 'Full video interview simulation with Ollama & Whisper feedback.',
  },
  {
    title: 'Global Leaderboard',
    path: '/leaderboard',
    icon: '🏆',
    category: 'Platform',
    description: 'Peer benchmarking, ranks, and track competency scoring.',
  },
  {
    title: 'System Design Studies',
    path: '/system-design',
    icon: '📐',
    category: 'Curriculum',
    description: 'Distributed architectures and frontend system design blueprints.',
  },
]

export default function NotFoundPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return ALL_DESTINATIONS.slice(0, 6)
    const q = searchQuery.toLowerCase().trim()
    return ALL_DESTINATIONS.filter(
      d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.path.toLowerCase().includes(q)
    )
  }, [searchQuery])

  return (
    <div className="notfound-container">
      <div className="notfound-ambient-glow" />

      <div className="notfound-card">
        <div className="notfound-badge">
          <span className="notfound-badge-dot" />
          HTTP 404 • Destination Not Found
        </div>

        <div className="notfound-glitch-title">404</div>

        <h1 className="notfound-heading">Route Matrix Disconnected</h1>
        <p className="notfound-desc">
          The requested page or studio asset does not exist in the neural registry or may have been relocated.
        </p>

        <div className="notfound-path-chip">
          <span>📍</span>
          <code>{location.pathname}</code>
        </div>

        {/* Dynamic Route Finder */}
        <div className="notfound-search-box">
          <span className="notfound-search-icon">🔍</span>
          <input
            type="text"
            className="notfound-search-input"
            placeholder="Search destination studio (e.g. DSA, Machine Coding, Mock)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Link Grid */}
        <div className="notfound-quick-links">
          {filteredDestinations.map(dest => (
            <Link key={dest.path} to={dest.path} className="notfound-link-card">
              <span className="notfound-link-icon">{dest.icon}</span>
              <span>{dest.title}</span>
            </Link>
          ))}
          {filteredDestinations.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '16px', color: 'var(--text-muted)' }}>
              No matching destinations found for "{searchQuery}". Try browsing below.
            </div>
          )}
        </div>

        {/* Main Action Buttons */}
        <div className="notfound-actions">
          <button
            type="button"
            className="notfound-btn-secondary"
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1)
              } else {
                navigate('/dashboard')
              }
            }}
          >
            ← Go Back
          </button>
          <Link to="/dashboard" className="notfound-btn-primary">
            🚀 Open Candidate Dashboard
          </Link>
          <Link to="/" className="notfound-btn-secondary">
            🏠 Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
