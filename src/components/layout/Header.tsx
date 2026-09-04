import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import AdminNotificationBell from './AdminNotificationBell'
import './Header.css'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const [term, setTerm] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false)
  const headerRef = useRef<HTMLElement | null>(null)

  const { bookmarkedCount } = useBookmarks()
  const { streak } = useProgress()
  const { user, isAuthenticated, hasFeature, openAuthModal, signOut } = useAuth()

  const hasQuestionsFull = hasFeature('questions_full')
  const hasCodingSandbox = hasFeature('coding_sandbox')
  const hasSystemDesign = hasFeature('system_design')
  const hasVideoMock = hasFeature('video_mock')
  const hasCompilerStudios = hasFeature('compiler_studios')


  const isSavedActive = location.pathname === '/questions' && location.search.includes('saved=true')

  const isActive = (path: string) => {
    if (path === '/questions') {
      return location.pathname === '/questions' && !location.search.includes('saved=true')
    }
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isPracticeActive = ['/flashcards', '/quiz', '/videos', '/code-review', '/accessibility', '/daily'].some(p => isActive(p)) || isSavedActive

  const isArchitectureActive = ['/experience', '/pathways', '/system-design', '/case-studies', '/ast-explorer', '/security', '/user-management', '/state-machine', '/capacity-estimator', '/memory-profiler', '/module-federation', '/whiteboard', '/webrtc-lab', '/local-first', '/search-engine', '/design-system', '/i18n-lab', '/sdui-lab', '/web-components', '/protocols', '/css-pipeline', '/wasm-lab', '/visualizer', '/profiler', '/resume-optimizer', '/compensation'].some(p => isActive(p))
  const isMockActive = ['/mock-interview', '/video-mock', '/behavioral', '/peer-room'].some(p => isActive(p))

  // Close dropdown on navigation
  useEffect(() => {
    setActiveDropdown(null)
    setIsUserMenuOpen(false)
  }, [location])

  const closeMenus = () => {
    setActiveDropdown(null)
    setIsUserMenuOpen(false)
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
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
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
            <Link
              to="/dashboard"
              className={`nav-link nav-link-dashboard ${isActive('/dashboard') ? 'active' : ''}`}
            >
              📊 Operations Dashboard
            </Link>
          ) : (
            /* Candidate / Standard Navigation */
            <>
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
                Questions (22K)
                {!hasQuestionsFull && <span className="nav-lock-tag">🔒</span>}
              </Link>

              {/* 2. Direct Coding Challenges Link */}
              <Link to="/coding" className={`nav-link ${isActive('/coding') ? 'active' : ''}`}>
                Coding
                {!hasCodingSandbox && <span className="nav-lock-tag">🔒</span>}
              </Link>

              {/* 3. Practice Labs Dropdown */}
              <div className="nav-dropdown-wrap">
                <button
                  type="button"
                  className={`nav-link nav-dropdown-btn ${isPracticeActive || activeDropdown === 'practice' ? 'active' : ''}`}
                  onClick={() => toggleDropdown('practice')}
                  aria-expanded={activeDropdown === 'practice'}
                >
                  Practice Labs {!hasQuestionsFull && <span className="nav-lock-tag">🔒</span>} <span className="dropdown-caret">▾</span>
                </button>
              </div>

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

              {/* 6. Dashboard */}
              <Link to="/dashboard" className={`nav-link nav-link-dashboard ${isActive('/dashboard') ? 'active' : ''}`}>
                Dashboard
                {streak > 0 && <span className="streak-badge" title={`${streak} day study streak`}>🔥 {streak}</span>}
              </Link>
            </>
          )}

          {/* 5. Theme Toggle */}
          <div className="header-toggle-wrap">
            <ThemeToggle />
          </div>

          {/* 6. User Auth Button / Profile Menu */}
          <div className="header-auth-wrap">
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  className="btn btn-primary btn-sm"
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
        </nav>
      </div>


      {/* FULL-VIEWPORT-WIDTH HORIZONTAL MEGA-DROPDOWNS */}

      {/* 1. PRACTICE MEGA-MENU */}
      {activeDropdown === 'practice' && (
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
                <span className="mega-col-title">📚 Question Bank &amp; Daily</span>
                <div className="mega-items-group">
                  <Link to="/questions" className={`mega-item ${isActive('/questions') ? 'active' : ''}`}>
                    <span className="drop-icon">📚</span>
                    <div>
                      <span className="drop-title">
                        Questions Bank
                        {!hasQuestionsFull && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">22,222 curated questions &amp; solutions</span>
                    </div>
                  </Link>

                  <Link to="/daily" className={`mega-item ${isActive('/daily') ? 'active' : ''}`}>
                    <span className="drop-icon">🔥</span>
                    <div>
                      <span className="drop-title">
                        Daily Challenge &amp; Streak
                        {!hasQuestionsFull && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">365-day heatmap &amp; live sandbox</span>
                    </div>
                  </Link>

                  <Link to="/coding" className={`mega-item ${isActive('/coding') ? 'active' : ''}`}>
                    <span className="drop-icon">💻</span>
                    <div>
                      <span className="drop-title">
                        Coding Challenges
                        {!hasCodingSandbox && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Interactive live workspace &amp; test suites</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">🧠 Active Recall &amp; Videos</span>
                <div className="mega-items-group">
                  <Link to="/flashcards" className={`mega-item ${isActive('/flashcards') ? 'active' : ''}`}>
                    <span className="drop-icon">🧠</span>
                    <div>
                      <span className="drop-title">
                        Active Recall Cards
                        {!hasQuestionsFull && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">SM-2 Spaced Repetition mastery decks</span>
                    </div>
                  </Link>

                  <Link to="/quiz" className={`mega-item ${isActive('/quiz') ? 'active' : ''}`}>
                    <span className="drop-icon">⚡</span>
                    <div>
                      <span className="drop-title">
                        Practice Quiz
                        {!hasQuestionsFull && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Time-boxed topic quiz assessments</span>
                    </div>
                  </Link>

                  <Link to="/videos" className={`mega-item ${isActive('/videos') ? 'active' : ''}`}>
                    <span className="drop-icon">🎥</span>
                    <div>
                      <span className="drop-title">
                        Video Masterclasses
                        {!hasQuestionsFull && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">725 curated engineering walkthroughs</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mega-column">
                <span className="mega-col-title">🔍 Code Quality &amp; a11y Labs</span>
                <div className="mega-items-group">
                  <Link to="/code-review" className={`mega-item ${isActive('/code-review') ? 'active' : ''}`}>
                    <span className="drop-icon">🔍</span>
                    <div>
                      <span className="drop-title">
                        AI Static Code Reviewer
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Memory leaks, AST linting &amp; 1-click fixes</span>
                    </div>
                  </Link>

                  <Link to="/accessibility" className={`mega-item ${isActive('/accessibility') ? 'active' : ''}`}>
                    <span className="drop-icon">♿</span>
                    <div>
                      <span className="drop-title">
                        Accessibility (a11y) Lab
                        {!hasCompilerStudios && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Screen reader simulator &amp; WCAG AAA tools</span>
                    </div>
                  </Link>

                  <Link to="/questions?saved=true" className={`mega-item highlight-saved ${isSavedActive ? 'active' : ''}`}>
                    <span className="drop-icon saved-star">★</span>
                    <div>
                      <span className="drop-title">
                        Saved Questions ({bookmarkedCount})
                        {!hasQuestionsFull && <span className="drop-lock-tag">🔒 PRO</span>}
                      </span>
                      <span className="drop-desc">Your personal revision bookmark deck</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
  )
}
