import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'
import { bankTotals, fmtCount, fmtK } from '../../data/bankTotals'
import ThemeToggle from './ThemeToggle'
import './Header.css'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const { streak } = useProgress()
  const { user, isAuthenticated, openAuthModal, signOut } = useAuth()


  const isActive = (path: string) => {
    if (path === '/questions') {
      return location.pathname === '/questions' && !location.search.includes('saved=true')
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isResumeActive = ['/resume-builder', '/resume-center', '/resume-optimizer'].some(p => isActive(p))
  const isMockActive = ['/mock-interview', '/video-mock', '/ai-video-mock', '/behavioral', '/peer-room'].some(p => isActive(p))
  const isMachineCodingActive = isActive('/machine-coding') || isActive('/machine-level-coding')
  const isDsaActive = isActive('/dsa')
  const isCoreProgActive = isActive('/core-programming') || isActive('/frontend-programming')
  const isFrontendJsActive = isActive('/frontend-javascript') || isActive('/frontend-js')
  const isCodingActive = isMachineCodingActive || isDsaActive || isCoreProgActive || isFrontendJsActive

  // Close dropdown and mobile menu on navigation
  useEffect(() => {
    setActiveDropdown(null)
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const closeMenus = () => {
    setActiveDropdown(null)
    setIsUserMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const next = !prev
      document.body.style.overflow = next ? 'hidden' : ''
      return next
    })
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    document.body.style.overflow = ''
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
        setIsUserMenuOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null)
        setIsUserMenuOpen(false)
        closeMobileMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [])


  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = term.trim()
    navigate(q ? `/questions?q=${encodeURIComponent(q)}` : '/questions')
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(prev => (prev === name ? null : name))
  }

  return (
    <>
      <header className="header" ref={headerRef}>
      <div className="header-inner">
        <Link to={isAuthenticated && user?.role === 'admin' ? '/dashboard' : '/'} className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">Interview<span className="logo-accent">Prep</span></span>
          {isAuthenticated && user?.role === 'admin' && (
            <span className="admin-header-pill">🛡️ ADMIN CONSOLE</span>
          )}
        </Link>

        <nav className="nav" aria-label="Main navigation">
          {isAuthenticated && user?.role === 'admin' ? (
            /* Admin Only Navigation: Only Dashboard */
            <div className="desktop-nav-items">
              <Link
                to="/dashboard"
                className={`nav-link nav-link-dashboard ${isActive('/dashboard') ? 'active' : ''}`}
              >
                📊 Operations Dashboard
              </Link>
            </div>
          ) : (
            /* Candidate / Standard Navigation */
            <div className="desktop-nav-items">

              {/* 1a. Master Question Bank */}
              <Link to="/interview-questions" className={`nav-link ${isActive('/interview-questions') ? 'active' : ''}`}>
                Master Bank <span style={{ fontSize: '0.66rem', padding: '0.1rem 0.32rem', borderRadius: '4px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff', fontWeight: 700, marginLeft: '0.15rem' }}>{fmtK(bankTotals.masterBankQuestions)}</span>
              </Link>

              {/* 1. Direct Questions Bank Link */}
              <Link to="/questions" className={`nav-link ${isActive('/questions') ? 'active' : ''}`}>
                Questions
              </Link>

              {/* 1b. Interview Docs */}
              <Link to="/docs" className={`nav-link ${isActive('/docs') ? 'active' : ''}`}>
                Docs
              </Link>

              {/* 2. Coding Dropdown */}
              <div className="nav-dropdown-wrap">
                <button
                  type="button"
                  className={`nav-link nav-dropdown-btn ${isCodingActive || activeDropdown === 'coding' ? 'active' : ''}`}
                  onClick={() => toggleDropdown('coding')}
                  aria-expanded={activeDropdown === 'coding'}
                >
                  Coding <span className="dropdown-caret">▾</span>
                </button>
              </div>

              {/* 2b. Leaderboard */}
              <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                Leaderboard
              </Link>

              {/* 3. Video Masterclass */}
              <Link to="/videos" className={`nav-link ${isActive('/videos') ? 'active' : ''}`}>
                Videos
              </Link>

              {/* 5. Mock Interviews Dropdown */}
              <div className="nav-dropdown-wrap">
                <button
                  type="button"
                  className={`nav-link nav-dropdown-btn ${isMockActive || activeDropdown === 'mock' ? 'active' : ''}`}
                  onClick={() => toggleDropdown('mock')}
                  aria-expanded={activeDropdown === 'mock'}
                >
                  Mocks <span className="dropdown-caret">▾</span>
                </button>
              </div>

              {/* 5b. Resume Builder */}
              <Link to="/resume-builder" className={`nav-link ${isResumeActive ? 'active' : ''}`}>
                Resume
              </Link>

              {/* 6. Dashboard (Only when authenticated) */}
              {isAuthenticated && (
                <Link to="/dashboard" className={`nav-link nav-link-dashboard ${isActive('/dashboard') ? 'active' : ''}`}>
                  Dashboard
                  {streak > 0 && <span className="streak-badge" title={`${streak} day study streak`}>🔥 {streak}</span>}
                </Link>
              )}
            </div>
          )}
        </nav>

        {/* Header Right Actions: Command Palette, Theme Toggle, Auth, Mobile Menu Toggle */}
        <div className="header-right-actions">
          {/* Single Unified Global Search Bar */}
          <div className="header-unified-search">
            <form onSubmit={onSearch} role="search" className="hus-form">
              <span className="hus-icon" aria-hidden="true">🔍</span>
              <input
                type="search"
                className="hus-input"
                placeholder="Search questions & topics..."
                value={term}
                onChange={e => setTerm(e.target.value)}
                aria-label="Search all questions and topics"
              />
              <button
                type="button"
                className="hus-kbd-btn"
                onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                title="Open Command Palette (Ctrl+K)"
                aria-label="Open Command Palette (Ctrl+K)"
              >
                <kbd className="hus-kbd">⌘K</kbd>
              </button>
            </form>
          </div>

          {/* 5. Theme Toggle & Offline Status */}
          <div className="header-toggle-wrap">
            <ThemeToggle />
            {!isOnline && (
              <div
                className="header-offline-status-badge"
                title="You are currently offline. MasterDocs and cached studios remain fully available!"
                role="status"
                aria-live="polite"
              >
                <span className="header-offline-dot" />
                <span className="header-offline-text">Offline</span>
              </div>
            )}
          </div>

          {/* 6. User Auth Button / Profile Menu */}
          <div className="header-auth-wrap">


            

            {isAuthenticated && user ? (
              <div className="user-profile-menu-wrap">
                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  title={`Signed in as ${user.email} (${user.role.toUpperCase()})`}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name || 'User Avatar'}
                      className="header-user-avatar-img"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <span className="u-avatar-icon">👨‍💻</span>
                  )}
                  <span className={`u-role-pill ${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="ud-header">
                      <strong>{user.name}</strong>
                      <span className="ud-email">{user.email}</span>
                      <span className={`ud-badge ${user.role}`}>{user.role.toUpperCase()}</span>
                    </div>



                    {user.role === 'admin' ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="ud-profile-link ud-mgmt-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          🛡️ Admin Operations Command Center
                        </Link>
                        <Link
                          to="/user-management"
                          className="ud-profile-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          ⚙️ RBAC &amp; Permissions Studio
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard?view=profile"
                          className="ud-profile-link"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          👤 View Profile &amp; Progress Tracker
                        </Link>
                        <button
                          type="button"
                          className="ud-profile-link"
                          style={{
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                          }}
                          onClick={() => {
                            setIsUserMenuOpen(false)
                            openAuthModal('admin')
                          }}
                        >
                          🛡️ Admin Portal Login
                        </button>
                      </>
                    )}

                    <div className="ud-divider" />

                    <button
                      type="button"
                      className="ud-logout-btn"
                      onClick={() => {
                        signOut()
                        setIsUserMenuOpen(false)
                      }}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>

            ) : (
              <div className="header-guest-auth-btns">
                <button
                  type="button"
                  className="btn btn-primary btn-sm header-signin-btn"
                  onClick={() => openAuthModal('user')}
                >
                  <span className="btn-icon">🔐</span> <span className="btn-text">Sign In</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm header-admin-login-btn"
                  onClick={() => openAuthModal('admin')}
                  title="Admin Portal Login"
                  aria-label="Admin Portal Login"
                >
                  <span className="btn-icon">🛡️</span> <span className="admin-btn-text">Admin</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-bar top" />
            <span className="hamburger-bar mid" />
            <span className="hamburger-bar bot" />
          </button>
        </div>
      </div>


      {/* FULL-VIEWPORT-WIDTH HORIZONTAL MEGA-DROPDOWNS */}

      {/* 1. CODING MEGA-MENU */}
      {activeDropdown === 'coding' && (
        <div
          className="mega-menu-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) closeMenus()
          }}
        >
          <div
            className="mega-menu-content"
            onClick={e => {
              if ((e.target as HTMLElement).closest('a')) closeMenus()
            }}
          >
            <div className="mega-menu-inner four-cols">
              <div className="mega-column">
                <span className="mega-col-title">⚡ Interactive Studios</span>
                <div className="mega-items-group">
                  <Link to="/machine-coding" className={`mega-item ${isMachineCodingActive ? 'active' : ''}`}>
                    <span className="drop-icon">⚡</span>
                    <div>
                      <span className="drop-title">
                        Machine-Level Coding
                      </span>
                      <span className="drop-desc">Component build sandbox with auto-test harness</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">🧠 Algorithmic Mastery</span>
                <div className="mega-items-group">
                  <Link to="/dsa" className={`mega-item ${isDsaActive ? 'active' : ''}`}>
                    <span className="drop-icon">🧠</span>
                    <div>
                      <span className="drop-title">
                        LeetCode / DSA
                      </span>
                      <span className="drop-desc">1,000 curated data structures &amp; algorithm problems</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">🎯 Core JavaScript</span>
                <div className="mega-items-group">
                  <Link to="/core-programming" className={`mega-item ${isCoreProgActive ? 'active' : ''}`}>
                    <span className="drop-icon">🎯</span>
                    <div>
                      <span className="drop-title">
                        Core Programming
                      </span>
                      <span className="drop-desc">500 curated JavaScript problems across 13 domains</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">💻 Pure JavaScript Engineering</span>
                <div className="mega-items-group">
                  <Link to="/frontend-javascript" className={`mega-item ${isFrontendJsActive ? 'active' : ''}`}>
                    <span className="drop-icon">💻</span>
                    <div>
                      <span className="drop-title">
                        Frontend JavaScript Programming
                      </span>
                      <span className="drop-desc">1,000 unique frontend JS challenges &amp; mock simulator</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOCKS MEGA-MENU */}
      {activeDropdown === 'mock' && (
        <div
          className="mega-menu-overlay"
          onClick={e => {
            if (e.target === e.currentTarget) closeMenus()
          }}
        >
          <div
            className="mega-menu-content"
            onClick={e => {
              if ((e.target as HTMLElement).closest('a')) closeMenus()
            }}
          >
            <div className="mega-menu-inner">

              <div className="mega-column">
                <span className="mega-col-title">⏱️ Timed Simulations</span>
                <div className="mega-items-group">
                  <Link to="/mock-coding" className={`mega-item ${isActive('/mock-coding') ? 'active' : ''}`}>
                    <span className="drop-icon">🎤</span>
                    <div>
                      <span className="drop-title">
                        Machine Coding Mock
                      </span>
                      <span className="drop-desc">Timed component sandbox with auto-test harness</span>
                    </div>
                  </Link>

                  <Link to="/mock-interview" className={`mega-item ${isActive('/mock-interview') ? 'active' : ''}`}>
                    <span className="drop-icon">⏱️</span>
                    <div>
                      <span className="drop-title">
                        Timed Mock Simulator
                      </span>
                      <span className="drop-desc">Calibrated questions with realistic countdown clock</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">🎥 AI &amp; Behavioral</span>
                <div className="mega-items-group">
                  <Link to="/ai-video-mock" className={`mega-item highlight-ai ${isActive('/ai-video-mock') ? 'active' : ''}`}>
                    <span className="drop-icon">🎙️</span>
                    <div>
                      <span className="drop-title" style={{ color: '#818cf8', fontWeight: 700 }}>
                        AI Video Mock Studio 2.0
                        <span className="drop-lock-tag" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>NEW</span>
                      </span>
                      <span className="drop-desc">{fmtCount(bankTotals.mockBankTracks)} tracks, {fmtCount(bankTotals.mockBankQuestions)} questions, senior comparison &amp; sandbox</span>
                    </div>
                  </Link>

                  <Link to="/video-mock" className={`mega-item ${isActive('/video-mock') ? 'active' : ''}`}>
                    <span className="drop-icon">🎥</span>
                    <div>
                      <span className="drop-title">
                        AI Video Mock (Legacy)
                      </span>
                      <span className="drop-desc">Live webcam, speech audio transcription &amp; grading</span>
                    </div>
                  </Link>

                  <Link to="/behavioral" className={`mega-item ${isActive('/behavioral') ? 'active' : ''}`}>
                    <span className="drop-icon">🤝</span>
                    <div>
                      <span className="drop-title">
                        FAANG STAR Behavioral
                      </span>
                      <span className="drop-desc">Amazon 16 Leadership Principles &amp; Googleyness</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">👥 Peer-to-Peer Live</span>
                <div className="mega-items-group">
                  <Link to="/peer-room" className={`mega-item ${isActive('/peer-room') ? 'active' : ''}`}>
                    <span className="drop-icon">👥</span>
                    <div>
                      <span className="drop-title">
                        Peer Mock Room (Live WebRTC)
                      </span>
                      <span className="drop-desc">1-on-1 peer video room with shared code &amp; rubric</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>

    {typeof document !== 'undefined' && createPortal(
      <>
        {/* Mobile Navigation Backdrop & Drawer */}
        <div
          className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={closeMobileMenu}
          aria-hidden={!isMobileMenuOpen}
        />

        <aside
          className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}
          aria-label="Mobile Navigation"
          aria-hidden={!isMobileMenuOpen}
        >
        <div className="mobile-drawer-header">
          <Link to={isAuthenticated && user?.role === 'admin' ? '/dashboard' : '/'} className="logo" onClick={closeMobileMenu}>
            <span className="logo-mark" aria-hidden="true" />
            <span className="logo-text">Interview<span className="logo-accent">Prep</span></span>
          </Link>
          <div className="mobile-drawer-header-actions">
            <ThemeToggle />
            <button
              type="button"
              className="mobile-drawer-close-btn"
              onClick={closeMobileMenu}
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mobile-drawer-body">
          {!(isAuthenticated && user?.role === 'admin') && (
            <form className="mobile-search-form" onSubmit={(e) => { onSearch(e); closeMobileMenu(); }} role="search">
              <input
                type="search"
                className="mobile-search-input"
                placeholder="Search questions & topics…"
                value={term}
                onChange={e => setTerm(e.target.value)}
                aria-label="Search all questions"
              />
              <button type="submit" className="mobile-search-btn" aria-label="Search">🔍</button>
            </form>
          )}

          {isAuthenticated && user?.role === 'admin' ? (
            <div className="mobile-nav-group">
              <span className="mobile-group-title">Admin Management</span>
              <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="m-icon">📊</span>
                <span className="m-label">Operations Dashboard</span>
              </Link>
              <Link to="/user-management" className={`mobile-nav-item ${isActive('/user-management') ? 'active' : ''}`} onClick={closeMobileMenu}>
                <span className="m-icon">⚙️</span>
                <span className="m-label">RBAC &amp; Permissions</span>
              </Link>
            </div>
          ) : (
            <>
              <div className="mobile-nav-group">
                <span className="mobile-group-title">Practice &amp; Learn</span>
                <Link to="/interview-questions" className={`mobile-nav-item ${isActive('/interview-questions') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🎯</span>
                  <div className="m-text">
                    <span className="m-label">Master Question Bank</span>
                    <span className="m-sub">{fmtCount(bankTotals.masterBankQuestions)} deep interview questions</span>
                  </div>
                  <span className="m-badge-pill" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: '#fff' }}>{fmtK(bankTotals.masterBankQuestions)}</span>
                </Link>

                <Link to="/docs" className={`mobile-nav-item ${isActive('/docs') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🎓</span>
                  <div className="m-text">
                    <span className="m-label">Interview Docs</span>
                    <span className="m-sub">21 technical tracks &amp; guides</span>
                  </div>
                </Link>

                <Link to="/questions" className={`mobile-nav-item ${isActive('/questions') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">📚</span>
                  <div className="m-text">
                    <span className="m-label">Questions Bank</span>
                    <span className="m-sub">{fmtCount(bankTotals.mainBankQuestions)} questions</span>
                  </div>
                </Link>

                <Link to="/machine-coding" className={`mobile-nav-item ${isMachineCodingActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">⚡</span>
                  <div className="m-text">
                    <span className="m-label">Machine Coding</span>
                    <span className="m-sub">Live sandbox &amp; tests</span>
                  </div>
                </Link>

                <Link to="/dsa" className={`mobile-nav-item ${isDsaActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🧠</span>
                  <div className="m-text">
                    <span className="m-label">DSA Masterclass</span>
                    <span className="m-sub">1,000 algorithmic questions</span>
                  </div>
                </Link>

                <Link to="/core-programming" className={`mobile-nav-item ${isCoreProgActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🎯</span>
                  <div className="m-text">
                    <span className="m-label">Core Programming</span>
                    <span className="m-sub">500 core JavaScript challenges</span>
                  </div>
                </Link>

                <Link to="/frontend-javascript" className={`mobile-nav-item ${isFrontendJsActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">💻</span>
                  <div className="m-text">
                    <span className="m-label">Frontend JavaScript Programming</span>
                    <span className="m-sub">1,000 production JS questions</span>
                  </div>
                </Link>

                <Link to="/mock-coding" className={`mobile-nav-item ${isActive('/mock-coding') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🎤</span>
                  <div className="m-text">
                    <span className="m-label">Machine Coding Mock</span>
                    <span className="m-sub">Full interview simulator</span>
                  </div>
                  <span className="m-badge-pill">NEW</span>
                </Link>

                <Link to="/leaderboard" className={`mobile-nav-item ${isActive('/leaderboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🏆</span>
                  <div className="m-text">
                    <span className="m-label">Leaderboard</span>
                    <span className="m-sub">Rankings &amp; XP</span>
                  </div>
                </Link>

                <Link to="/videos" className={`mobile-nav-item ${isActive('/videos') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">🎥</span>
                  <div className="m-text">
                    <span className="m-label">Video Masterclass</span>
                    <span className="m-sub">Curated breakdown labs</span>
                  </div>
                </Link>

                {isAuthenticated ? (
                  <Link to="/dashboard" className={`mobile-nav-item ${isActive('/dashboard') ? 'active' : ''}`} onClick={closeMobileMenu}>
                    <span className="m-icon">📈</span>
                    <div className="m-text">
                      <span className="m-label">Dashboard &amp; Progress</span>
                      <span className="m-sub">Personal analytics</span>
                    </div>
                    {streak > 0 && <span className="streak-badge">🔥 {streak}</span>}
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="mobile-nav-item"
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                    onClick={() => {
                      closeMobileMenu()
                      openAuthModal('user')
                    }}
                  >
                    <span className="m-icon">📈</span>
                    <div className="m-text">
                      <span className="m-label">Dashboard &amp; Progress</span>
                      <span className="m-sub">Sign in to track personal stats</span>
                    </div>
                    <span className="nav-lock-tag">🔒</span>
                  </button>
                )}
              </div>

              {/* Collapsible Mocks Section */}
              <div className="mobile-accordion">
                <button
                  type="button"
                  className={`mobile-accordion-toggle ${mobileExpandedSection === 'mock' ? 'open' : ''}`}
                  onClick={() => setMobileExpandedSection(prev => prev === 'mock' ? null : 'mock')}
                >
                  <span className="m-accordion-label">
                    <span className="m-icon">🎙️</span> Mock Interviews
                  </span>
                  <span className="m-accordion-caret">{mobileExpandedSection === 'mock' ? '▲' : '▼'}</span>
                </button>

                {mobileExpandedSection === 'mock' && (
                  <div className="mobile-accordion-content">
                    <Link to="/ai-video-mock" className="mobile-sublink" style={{ color: '#818cf8', fontWeight: 700 }} onClick={closeMobileMenu}>🎙️ AI Video Mock Studio 2.0 (NEW)</Link>
                    <Link to="/mock-interview" className="mobile-sublink" onClick={closeMobileMenu}>⏱️ Timed Mock Simulator</Link>
                    <Link to="/video-mock" className="mobile-sublink" onClick={closeMobileMenu}>🎥 AI Video Mock Interview</Link>
                    <Link to="/behavioral" className="mobile-sublink" onClick={closeMobileMenu}>🤝 FAANG STAR Behavioral</Link>
                    <Link to="/peer-room" className="mobile-sublink" onClick={closeMobileMenu}>👥 Peer-to-Peer Live Room</Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Account & Profile Footer */}
          <div className="mobile-drawer-footer">
            {isAuthenticated && user ? (
              <div className="mobile-user-box">
                <div className="mobile-user-details">
                  <span className="m-user-avatar">👨‍💻</span>
                  <div className="m-user-text">
                    <strong className="m-user-name">{user.name}</strong>
                    <span className="m-user-email">{user.email}</span>
                  </div>
                  <span className={`ud-badge ${user.role}`}>{user.role.toUpperCase()}</span>
                </div>



                <div className="mobile-user-actions">
                  {user.role === 'admin' ? (
                    <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={closeMobileMenu}>
                      🛡️ Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/profile" className="btn btn-secondary btn-sm" style={{ width: '100%' }} onClick={closeMobileMenu}>
                      👤 View Profile
                    </Link>
                  )}
                  <button
                    type="button"
                    className="ud-logout-btn"
                    style={{ width: '100%' }}
                    onClick={() => {
                      signOut()
                      closeMobileMenu()
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="mobile-guest-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    closeMobileMenu()
                    openAuthModal('user')
                  }}
                >
                  🔐 User Login
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    closeMobileMenu()
                    openAuthModal('admin')
                  }}
                >
                  🛡️ Admin Login
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>,
    document.body
  )}
</>
)
}
