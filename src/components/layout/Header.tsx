import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useProgress } from '../../context/ProgressContext'
import { useBookmarks } from '../../context/BookmarkContext'
import { useAuth } from '../../context/AuthContext'
import { badgeService } from '../../lib/badgeService'
import ThemeToggle from './ThemeToggle'
import AdminNotificationBell from './AdminNotificationBell'
import './Header.css'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)

  const { streak, solvedIds, mockInterviews } = useProgress()
  const { bookmarkedCount } = useBookmarks()
  const { user, isAuthenticated, hasFeature, openAuthModal, signOut } = useAuth()

  const levelInfo = useMemo(() => {
    const solvedCount = solvedIds.size
    const strongHireCount = mockInterviews.filter(m => m.verdict === 'Strong Hire').length
    const mockCount = mockInterviews.length
    const machineCodingCount = Math.max(
      mockInterviews.reduce((acc, m) => acc + ((m.testCasesPassed && m.testCasesPassed > 0) ? 1 : 0), 0),
      solvedCount > 0 ? 1 : 0
    )
    const stats = { solvedCount, streakDays: streak, mockCount, strongHireCount, bookmarkedCount, machineCodingCount }
    const badges = badgeService.evaluateBadges(stats)
    return badgeService.calculateLevelInfo(badges)
  }, [solvedIds.size, streak, mockInterviews, bookmarkedCount])

  const hasQuestionsFull = hasFeature('questions_full')
  const hasCodingSandbox = hasFeature('coding_sandbox')
  const hasSystemDesign = hasFeature('system_design')
  const hasVideoMock = hasFeature('video_mock')
  const hasCompilerStudios = hasFeature('compiler_studios')

  const isActive = (path: string) => {
    if (path === '/questions') {
      return location.pathname === '/questions' && !location.search.includes('saved=true')
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isArchitectureActive = ['/experience', '/pathways', '/system-design', '/case-studies', '/ast-explorer', '/security', '/user-management', '/state-machine', '/capacity-estimator', '/memory-profiler', '/module-federation', '/whiteboard', '/webrtc-lab', '/local-first', '/search-engine', '/design-system', '/i18n-lab', '/sdui-lab', '/web-components', '/protocols', '/css-pipeline', '/wasm-lab', '/visualizer', '/profiler', '/resume-optimizer', '/compensation'].some(p => isActive(p))
  const isMockActive = ['/mock-interview', '/video-mock', '/behavioral', '/peer-room'].some(p => isActive(p))
  const isMachineCodingActive = isActive('/machine-coding') || isActive('/machine-level-coding')

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
              <form className="header-search" onSubmit={onSearch} role="search">
                <input
                  type="search"
                  className="header-search-input"
                  placeholder="Search 22,222 questions…"
                  value={term}
                  onChange={e => setTerm(e.target.value)}
                  aria-label="Search all questions"
                />
              </form>

              {/* 1. Direct Questions Bank Link */}
              <Link to="/questions" className={`nav-link ${isActive('/questions') ? 'active' : ''}`}>
                Questions
                {!hasQuestionsFull && <span className="nav-lock-tag">🔒</span>}
              </Link>

              {/* 2. Direct Machine Coding Masterclass Link */}
              <Link to="/machine-coding" className={`nav-link ${isMachineCodingActive ? 'active' : ''}`}>
                Machine Coding
                {!hasCodingSandbox && <span className="nav-lock-tag">🔒</span>}
              </Link>

              {/* 2b. Leaderboard */}
              <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                🏆 Leaderboard
              </Link>

              {/* 3. Video Masterclass (Only practice lab preserved) */}
              <Link to="/videos" className={`nav-link ${isActive('/videos') ? 'active' : ''}`}>
                🎥 Videos
                {!hasQuestionsFull && <span className="nav-lock-tag">🔒</span>}
              </Link>

              {/* 4. Architecture & Career Dropdown */}
              <div className="nav-dropdown-wrap">
                <button
                  type="button"
                  className={`nav-link nav-dropdown-btn ${isArchitectureActive || activeDropdown === 'architecture' ? 'active' : ''}`}
                  onClick={() => toggleDropdown('architecture')}
                  aria-expanded={activeDropdown === 'architecture'}
                >
                  Architecture {!hasSystemDesign && <span className="nav-lock-tag">🔒</span>} <span className="dropdown-caret">▾</span>
                </button>
              </div>

              {/* 5. Mock Interviews Dropdown */}
              <div className="nav-dropdown-wrap">
                <button
                  type="button"
                  className={`nav-link nav-dropdown-btn ${isMockActive || activeDropdown === 'mock' ? 'active' : ''}`}
                  onClick={() => toggleDropdown('mock')}
                  aria-expanded={activeDropdown === 'mock'}
                >
                  Mocks {!hasVideoMock && <span className="nav-lock-tag">🔒</span>} <span className="dropdown-caret">▾</span>
                </button>
              </div>

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

        {/* Header Right Actions: Theme Toggle, Auth, Mobile Menu Toggle */}
        <div className="header-right-actions">
          {/* 5. Theme Toggle */}
          <div className="header-toggle-wrap">
            <ThemeToggle />
          </div>

          {/* 6. User Auth Button / Profile Menu */}
          <div className="header-auth-wrap">
            {isAuthenticated && (
              <Link
                to="/profile"
                className="header-level-pill"
                title={`Candidate Level ${levelInfo.level}: ${levelInfo.title} (${levelInfo.currentXp} XP)`}
              >
                <span className="hlp-badge">L{levelInfo.level}</span>
                <span className="hlp-xp">{levelInfo.currentXp} XP</span>
              </Link>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <AdminNotificationBell />
            )}

            {isAuthenticated && user ? (
              <div className="user-profile-menu-wrap">
                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={() => setIsUserMenuOpen(prev => !prev)}
                  title={`Signed in as ${user.email} (${user.role.toUpperCase()})`}
                >
                  <span className="u-avatar-icon">👨‍💻</span>
                  <span className={`u-role-pill ${user.role}`}>
                    {user.role === 'admin' ? 'ADMIN' : user.role === 'pro_member' ? 'PRO' : 'CANDIDATE'}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown-menu">
                    <div className="ud-header">
                      <strong>{user.name}</strong>
                      <span className="ud-email">{user.email}</span>
                      <span className={`ud-badge ${user.role}`}>{user.role.toUpperCase()}</span>
                    </div>

                    <div className="ud-level-card">
                      <div className="ud-lvl-row">
                        <span className="ud-lvl-tag">L{levelInfo.level}</span>
                        <div className="ud-lvl-info">
                          <span className="ud-lvl-name">{levelInfo.title}</span>
                          <span className="ud-lvl-pts">{levelInfo.currentXp} / {levelInfo.xpForNextLevel} XP</span>
                        </div>
                      </div>
                      <div className="ud-lvl-track">
                        <div className="ud-lvl-bar" style={{ width: `${levelInfo.progressPercent}%` }} />
                      </div>
                      <Link
                        to="/profile"
                        className="ud-ach-link"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        🏅 {levelInfo.totalBadgesUnlocked} / {levelInfo.totalBadgesCount} Badges Unlocked →
                      </Link>
                    </div>

                    <div className="ud-divider" />

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
                          to="/profile"
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
                  className="btn btn-secondary btn-sm"
                  style={{ fontWeight: 700 }}
                  onClick={() => openAuthModal('user')}
                >
                  🔐 User Login
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm header-admin-login-btn"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                    border: 'none',
                    fontWeight: 700,
                  }}
                  onClick={() => openAuthModal('admin')}
                >
                  🛡️ Admin Login
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

      {/* 2. ARCHITECTURE MEGA-MENU */}
      {activeDropdown === 'architecture' && (
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

              {/* Column 1: Career & Pathways */}
              <div className="mega-column">
                <span className="mega-col-title">🎯 Career &amp; Negotiations</span>
                <div className="mega-items-group">
                  <Link to="/experience" className={`mega-item ${isActive('/experience') ? 'active' : ''}`}>
                    <span className="drop-icon">🎯</span>
                    <div>
                      <span className="drop-title">
                        0-20y Career Ladder
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Google L3-L8 &amp; Meta E3-E8 rubrics</span>
                    </div>
                  </Link>

                  <Link to="/pathways" className={`mega-item ${isActive('/pathways') ? 'active' : ''}`}>
                    <span className="drop-icon">🏢</span>
                    <div>
                      <span className="drop-title">
                        620+ Company Pathways
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">FAANG &amp; unicorn question tracks</span>
                    </div>
                  </Link>

                  <Link to="/resume-optimizer" className={`mega-item ${isActive('/resume-optimizer') ? 'active' : ''}`}>
                    <span className="drop-icon">📄</span>
                    <div>
                      <span className="drop-title">
                        ATS Resume Optimizer
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Google XYZ formula &amp; ATS scanner</span>
                    </div>
                  </Link>

                  <Link to="/compensation" className={`mega-item ${isActive('/compensation') ? 'active' : ''}`}>
                    <span className="drop-icon">💰</span>
                    <div>
                      <span className="drop-title">
                        Offer Negotiation &amp; TC
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">4-year vesting models &amp; scripts</span>
                    </div>
                  </Link>

                  <Link to="/design-system" className={`mega-item ${isActive('/design-system') ? 'active' : ''}`}>
                    <span className="drop-icon">🎨</span>
                    <div>
                      <span className="drop-title">
                        Design System &amp; Tokens
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">HSL palettes, type scale &amp; tokens</span>
                    </div>
                  </Link>
                </div>
              </div>


              {/* Column 2: System Architecture */}
              <div className="mega-column">
                <span className="mega-col-title">🏗️ System Design &amp; Replays</span>
                <div className="mega-items-group">
                  <Link to="/system-design" className={`mega-item ${isActive('/system-design') ? 'active' : ''}`}>
                    <span className="drop-icon">🏗️</span>
                    <div>
                      <span className="drop-title">
                        System Design Studio
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Interactive 4-tier design canvas</span>
                    </div>
                  </Link>

                  <Link to="/case-studies" className={`mega-item ${isActive('/case-studies') ? 'active' : ''}`}>
                    <span className="drop-icon">📐</span>
                    <div>
                      <span className="drop-title">
                        FAANG Architecture Replays
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Figma, Meta, Uber &amp; Netflix blueprints</span>
                    </div>
                  </Link>

                  <Link to="/capacity-estimator" className={`mega-item ${isActive('/capacity-estimator') ? 'active' : ''}`}>
                    <span className="drop-icon">📐</span>
                    <div>
                      <span className="drop-title">
                        Capacity Sizing Estimator
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">QPS, DAU, RAM Cache &amp; Storage</span>
                    </div>
                  </Link>

                  <Link to="/whiteboard" className={`mega-item ${isActive('/whiteboard') ? 'active' : ''}`}>
                    <span className="drop-icon">🎨</span>
                    <div>
                      <span className="drop-title">
                        Collaborative Whiteboard
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Real-time canvas &amp; CRDT sync</span>
                    </div>
                  </Link>

                  <Link to="/webrtc-lab" className={`mega-item ${isActive('/webrtc-lab') ? 'active' : ''}`}>
                    <span className="drop-icon">📡</span>
                    <div>
                      <span className="drop-title">
                        WebRTC &amp; ICE Lab
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">SDP handshake, STUN/TURN &amp; SFU</span>
                    </div>
                  </Link>

                  <Link to="/local-first" className={`mega-item ${isActive('/local-first') ? 'active' : ''}`}>
                    <span className="drop-icon">💾</span>
                    <div>
                      <span className="drop-title">
                        Local-First &amp; Offline Sync
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Optimistic UI &amp; Vector Clocks</span>
                    </div>
                  </Link>

                  <Link to="/search-engine" className={`mega-item ${isActive('/search-engine') ? 'active' : ''}`}>
                    <span className="drop-icon">⚡</span>
                    <div>
                      <span className="drop-title">
                        Client Search &amp; BM25
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Inverted Index, BM25 &amp; Trie</span>
                    </div>
                  </Link>
                </div>
              </div>




              {/* Column 3: Compilers & Micro-Frontends */}
              <div className="mega-column">
                <span className="mega-col-title">⚡ Compilers &amp; Micro-Frontends</span>
                <div className="mega-items-group">
                  <Link to="/ast-explorer" className={`mega-item ${isActive('/ast-explorer') ? 'active' : ''}`}>
                    <span className="drop-icon">⚡</span>
                    <div>
                      <span className="drop-title">
                        AST &amp; Babel Compiler
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Live AST visualizer &amp; visitor plugin</span>
                    </div>
                  </Link>

                  <Link to="/module-federation" className={`mega-item ${isActive('/module-federation') ? 'active' : ''}`}>
                    <span className="drop-icon">🌐</span>
                    <div>
                      <span className="drop-title">
                        Micro-Frontends Studio
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Webpack 5 / Vite Module Federation</span>
                    </div>
                  </Link>

                  <Link to="/state-machine" className={`mega-item ${isActive('/state-machine') ? 'active' : ''}`}>
                    <span className="drop-icon">⚙️</span>
                    <div>
                      <span className="drop-title">
                        State Machine &amp; XState
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Visual FSM &amp; TypeScript export</span>
                    </div>
                  </Link>

                  <Link to="/protocols" className={`mega-item ${isActive('/protocols') ? 'active' : ''}`}>
                    <span className="drop-icon">📡</span>
                    <div>
                      <span className="drop-title">
                        API Protocols &amp; GraphQL
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Over-fetching, N+1 &amp; Protobuf</span>
                    </div>
                  </Link>

                  <Link to="/wasm-lab" className={`mega-item ${isActive('/wasm-lab') ? 'active' : ''}`}>
                    <span className="drop-icon">⚡</span>
                    <div>
                      <span className="drop-title">
                        WebAssembly &amp; SIMD Lab
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Native bytecode &amp; linear memory</span>
                    </div>
                  </Link>

                  <Link to="/sdui-lab" className={`mega-item ${isActive('/sdui-lab') ? 'active' : ''}`}>
                    <span className="drop-icon">📱</span>
                    <div>
                      <span className="drop-title">
                        Server-Driven UI &amp; RSC
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Dynamic JSON schema &amp; Islands</span>
                    </div>
                  </Link>

                  <Link to="/web-components" className={`mega-item ${isActive('/web-components') ? 'active' : ''}`}>
                    <span className="drop-icon">🛡️</span>
                    <div>
                      <span className="drop-title">
                        Shadow DOM &amp; Components
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Encapsulated styles, slots &amp; hooks</span>
                    </div>
                  </Link>
                </div>
              </div>





              {/* Column 4: Security & Performance */}
              <div className="mega-column">
                <span className="mega-col-title">🔒 Security &amp; Performance</span>
                <div className="mega-items-group">
                  <Link to="/security" className={`mega-item ${isActive('/security') ? 'active' : ''}`}>
                    <span className="drop-icon">🔒</span>
                    <div>
                      <span className="drop-title">
                        Web Security Lab
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">OWASP XSS, CSRF &amp; CSP sandbox</span>
                    </div>
                  </Link>

                  <Link to="/user-management" className={`mega-item ${isActive('/user-management') ? 'active' : ''}`}>
                    <span className="drop-icon">🛡️</span>
                    <div>
                      <span className="drop-title">
                        User Management &amp; Auth
                        <span className="drop-lock-tag" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}>🛡️ ADMIN</span>
                      </span>
                      <span className="drop-desc">OTP lifecycle, RBAC &amp; Postgres RLS</span>
                    </div>
                  </Link>


                  <Link to="/memory-profiler" className={`mega-item ${isActive('/memory-profiler') ? 'active' : ''}`}>
                    <span className="drop-icon">🧠</span>
                    <div>
                      <span className="drop-title">
                        Memory &amp; GC Profiler
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">V8 heap &amp; detached DOM leaks</span>
                    </div>
                  </Link>

                  <Link to="/profiler" className={`mega-item ${isActive('/profiler') ? 'active' : ''}`}>
                    <span className="drop-icon">⚡</span>
                    <div>
                      <span className="drop-title">
                        Performance Profiler Lab
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Layout thrashing &amp; Web Vitals</span>
                    </div>
                  </Link>

                  <Link to="/visualizer" className={`mega-item ${isActive('/visualizer') ? 'active' : ''}`}>
                    <span className="drop-icon">🌀</span>
                    <div>
                      <span className="drop-title">
                        Event Loop &amp; Fiber
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Step-by-step concurrency visualizer</span>
                    </div>
                  </Link>

                  <Link to="/css-pipeline" className={`mega-item ${isActive('/css-pipeline') ? 'active' : ''}`}>
                    <span className="drop-icon">🎨</span>
                    <div>
                      <span className="drop-title">
                        CSS Render Pipeline
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Reflow, repaint &amp; GPU 120fps</span>
                    </div>
                  </Link>

                  <Link to="/i18n-lab" className={`mega-item ${isActive('/i18n-lab') ? 'active' : ''}`}>
                    <span className="drop-icon">🌍</span>
                    <div>
                      <span className="drop-title">
                        i18n &amp; RTL Studio
                        {!hasSystemDesign && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Arabic RTL mirroring &amp; Intl APIs</span>
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
                        {!hasVideoMock && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Calibrated questions with realistic countdown clock</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">🎥 AI &amp; Behavioral</span>
                <div className="mega-items-group">
                  <Link to="/video-mock" className={`mega-item highlight-ai ${isActive('/video-mock') ? 'active' : ''}`}>
                    <span className="drop-icon">🎥</span>
                    <div>
                      <span className="drop-title">
                        AI Video Mock Interview
                        {!hasVideoMock && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Live webcam, speech audio transcription &amp; grading</span>
                    </div>
                  </Link>

                  <Link to="/behavioral" className={`mega-item ${isActive('/behavioral') ? 'active' : ''}`}>
                    <span className="drop-icon">🤝</span>
                    <div>
                      <span className="drop-title">
                        FAANG STAR Behavioral
                        {!hasVideoMock && <span className="drop-lock-tag">🔒 PRO</span>}
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
                        {!hasVideoMock && <span className="drop-lock-tag">🔒 PRO</span>}
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
                <Link to="/questions" className={`mobile-nav-item ${isActive('/questions') ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">📚</span>
                  <div className="m-text">
                    <span className="m-label">Questions Bank</span>
                    <span className="m-sub">22,222 questions</span>
                  </div>
                  {!hasQuestionsFull && <span className="nav-lock-tag">🔒</span>}
                </Link>

                <Link to="/machine-coding" className={`mobile-nav-item ${isMachineCodingActive ? 'active' : ''}`} onClick={closeMobileMenu}>
                  <span className="m-icon">⚡</span>
                  <div className="m-text">
                    <span className="m-label">Machine Coding</span>
                    <span className="m-sub">Live sandbox &amp; tests</span>
                  </div>
                  {!hasCodingSandbox && <span className="nav-lock-tag">🔒</span>}
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

              {/* Collapsible Architecture Section */}
              <div className="mobile-accordion">
                <button
                  type="button"
                  className={`mobile-accordion-toggle ${mobileExpandedSection === 'architecture' ? 'open' : ''}`}
                  onClick={() => setMobileExpandedSection(prev => prev === 'architecture' ? null : 'architecture')}
                >
                  <span className="m-accordion-label">
                    <span className="m-icon">🏛️</span> Architecture &amp; System Design
                  </span>
                  <span className="m-accordion-caret">{mobileExpandedSection === 'architecture' ? '▲' : '▼'}</span>
                </button>

                {mobileExpandedSection === 'architecture' && (
                  <div className="mobile-accordion-content">
                    <Link to="/system-design" className="mobile-sublink" onClick={closeMobileMenu}>📐 System Design Canvas</Link>
                    <Link to="/case-studies" className="mobile-sublink" onClick={closeMobileMenu}>🏢 Real-world Case Studies</Link>
                    <Link to="/security" className="mobile-sublink" onClick={closeMobileMenu}>🛡️ Web Security Sandbox</Link>
                    <Link to="/module-federation" className="mobile-sublink" onClick={closeMobileMenu}>🧩 Microfrontends (MFE)</Link>
                    <Link to="/webrtc-lab" className="mobile-sublink" onClick={closeMobileMenu}>📹 WebRTC Lab</Link>
                    <Link to="/local-first" className="mobile-sublink" onClick={closeMobileMenu}>💾 Local-First Architecture</Link>
                    <Link to="/design-system" className="mobile-sublink" onClick={closeMobileMenu}>🎨 Enterprise Design System</Link>
                    <Link to="/profiler" className="mobile-sublink" onClick={closeMobileMenu}>⚡ Performance Profiler</Link>
                    <Link to="/resume-optimizer" className="mobile-sublink" onClick={closeMobileMenu}>📄 AI Resume Optimizer</Link>
                    <Link to="/compensation" className="mobile-sublink" onClick={closeMobileMenu}>💰 Compensation &amp; Offers</Link>
                  </div>
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

                <div className="mobile-user-level-card">
                  <div className="ud-lvl-row">
                    <span className="ud-lvl-tag">L{levelInfo.level}</span>
                    <div className="ud-lvl-info">
                      <span className="ud-lvl-name">{levelInfo.title}</span>
                      <span className="ud-lvl-pts">{levelInfo.currentXp} / {levelInfo.xpForNextLevel} XP</span>
                    </div>
                  </div>
                  <div className="ud-lvl-track">
                    <div className="ud-lvl-bar" style={{ width: `${levelInfo.progressPercent}%` }} />
                  </div>
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
