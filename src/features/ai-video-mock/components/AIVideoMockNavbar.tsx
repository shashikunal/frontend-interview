import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ollamaProvider } from '../services/providers/ollamaProvider';

interface DropdownItem {
  label: string;
  path: string;
  icon: string;
  desc: string;
}

interface DropdownGroup {
  id: string;
  label: string;
  icon: string;
  items: DropdownItem[];
}

export default function AIVideoMockNavbar() {
  const location = useLocation();
  const [ollamaStatus, setOllamaStatus] = useState<{ available: boolean; message: string }>({
    available: false,
    message: 'Checking Ollama...',
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ollamaProvider.isAvailable().then(res => {
      setOllamaStatus({ available: res.available, message: res.statusMessage });
    });
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const coreLinks = [
    { label: 'Overview', path: '/ai-video-mock', icon: '🏠' },
    { label: 'Start Mock', path: '/ai-video-mock/setup', icon: '⚡' },
    { label: 'History', path: '/ai-video-mock/history', icon: '📜' },
  ];

  const dropdownGroups: DropdownGroup[] = [
    {
      id: 'mock-types',
      label: 'Mock Types',
      icon: '🎯',
      items: [
        { label: 'Job Role Mock', path: '/ai-video-mock/job-interview', icon: '💼', desc: 'Target specific job descriptions & tech stacks' },
        { label: 'Resume-Based Mock', path: '/ai-video-mock/resume-interview', icon: '📄', desc: 'Tailored questions parsed from your resume' },
        { label: 'Project Deep Dive', path: '/ai-video-mock/project-interview', icon: '🚀', desc: 'In-depth architecture & trade-off analysis' },
        { label: 'Improve Answer', path: '/ai-video-mock/improve', icon: '✨', desc: 'Iterative feedback to level up your responses' },
      ],
    },
    {
      id: 'practice-prep',
      label: 'Practice & Skills',
      icon: '🧠',
      items: [
        { label: 'Practice Weak Areas', path: '/ai-video-mock/practice', icon: '🎯', desc: 'Targeted drilling on lower-scoring topics' },
        { label: 'Question Bank', path: '/ai-video-mock/question-bank', icon: '📚', desc: '400+ curated FAANG questions with specs' },
        { label: 'Skills & Trends', path: '/ai-video-mock/skills', icon: '📈', desc: 'Skill readiness matrix & market benchmarks' },
      ],
    },
    {
      id: 'governance',
      label: 'Audit & Admin',
      icon: '🛡️',
      items: [
        { label: 'System Audit', path: '/ai-video-mock/system-audit', icon: '⚙️', desc: 'Provider health, sandbox tests & audio diagnostics' },
        { label: 'Admin Lifecycle', path: '/ai-video-mock/admin-audit', icon: '🛡️', desc: 'Candidate session logs & evaluation oversight' },
      ],
    },
  ];

  const isGroupActive = (group: DropdownGroup) => {
    return group.items.some(item => location.pathname === item.path);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(prev => (prev === id ? null : id));
  };

  return (
    <nav ref={navRef} className="ai-vm-navbar" aria-label="AI Video Mock Navigation">
      <div className="ai-vm-nav-left">
        <Link to="/ai-video-mock" className="ai-vm-logo-pill">
          <span className="ai-vm-logo-icon">🎙️</span>
          <span className="ai-vm-logo-text">AI Video Mock Studio</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="ai-vm-nav-links-desktop">
          {/* Core Direct Links */}
          {coreLinks.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`ai-vm-nav-link ${isActive ? 'active' : ''}`}
              >
                <span className="ai-vm-nav-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* Categorized Dropdowns */}
          {dropdownGroups.map(group => {
            const hasActiveChild = isGroupActive(group);
            const isOpen = openDropdown === group.id;

            return (
              <div key={group.id} className="ai-vm-dropdown-wrap">
                <button
                  type="button"
                  onClick={() => toggleDropdown(group.id)}
                  className={`ai-vm-dropdown-trigger ${hasActiveChild ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                  aria-expanded={isOpen}
                >
                  <span className="ai-vm-nav-link-icon">{group.icon}</span>
                  <span>{group.label}</span>
                  <span className="ai-vm-dropdown-chevron">{isOpen ? '▲' : '▼'}</span>
                  {hasActiveChild && <span className="ai-vm-active-dot" />}
                </button>

                {isOpen && (
                  <div className="ai-vm-dropdown-menu">
                    {group.items.map(item => {
                      const isItemActive = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`ai-vm-dropdown-item ${isItemActive ? 'active' : ''}`}
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="ai-vm-dropdown-item-icon">{item.icon}</span>
                          <div className="ai-vm-dropdown-item-content">
                            <span className="ai-vm-dropdown-item-title">{item.label}</span>
                            <span className="ai-vm-dropdown-item-desc">{item.desc}</span>
                          </div>
                          {isItemActive && <span className="ai-vm-check-indicator">✓</span>}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="ai-vm-nav-right">
        <div
          className={`ai-vm-provider-chip ${ollamaStatus.available ? 'online' : 'offline'}`}
          title={ollamaStatus.message}
        >
          <span className="ai-vm-status-pulse" />
          <span className="ai-vm-chip-text">
            {ollamaStatus.available ? 'Ollama Online' : 'Rule Engine (Offline AI)'}
          </span>
        </div>

        <Link to="/ai-video-mock/setup" className="ai-vm-btn-primary ai-vm-btn-new-mock">
          <span>+</span>
          <span>New Mock</span>
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="ai-vm-mobile-toggle"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="ai-vm-mobile-drawer">
          <div className="ai-vm-mobile-section">
            <div className="ai-vm-mobile-heading">Main Navigation</div>
            {coreLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`ai-vm-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {dropdownGroups.map(group => (
            <div key={group.id} className="ai-vm-mobile-section">
              <div className="ai-vm-mobile-heading">{group.icon} {group.label}</div>
              {group.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`ai-vm-mobile-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  <div>
                    <div>{item.label}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
