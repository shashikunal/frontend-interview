import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getAdminBearerToken } from '../../auth/services/adminTokenHelper';
import '../styles/InstantMeetingLandingPage.css';

interface CarouselSlide {
  title: string;
  description: string;
  icon: string;
  tag: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    title: 'High-Fidelity Video & Screen Share',
    description: 'Ultra-low-latency WebRTC media plane with active speaker tracking, adaptive grid, and crisp screen presentation.',
    icon: '🎥',
    tag: 'WebRTC Media Plane',
  },
  {
    title: 'Collaborative Monaco Code Studio',
    description: 'Code together in real-time with syntax highlighting, multi-language execution, and instant synchronization.',
    icon: '💻',
    tag: 'Technical Interviews',
  },
  {
    title: 'Interactive System Design Whiteboard',
    description: 'Sketch distributed architectures, diagrams, and data flows on an infinite collaborative canvas.',
    icon: '📐',
    tag: 'System Design',
  },
  {
    title: 'Audited Attendance & Calendar Sync',
    description: 'Server-side attendance tracking, verified audit trails, and automatic .ics and Google Calendar integration.',
    icon: '📋',
    tag: 'Enterprise Ops',
  },
];

export const InstantMeetingLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meetingCodeOrUrl, setMeetingCodeOrUrl] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreatingInstant, setIsCreatingInstant] = useState(false);
  const [createdLaterLink, setCreatedLaterLink] = useState<string | null>(null);
  const [isLaterModalOpen, setIsLaterModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Clock in header
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
          ' • ' +
          now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper to generate a meeting room ID
  const generateRoomId = () => {
    return `meet_${Math.random().toString(36).substring(2, 8)}_${Date.now().toString(36).slice(-4)}`;
  };

  // 1. Start Instant Meeting (1-Click Google Meet Style)
  const handleStartInstantMeeting = async () => {
    setIsCreatingInstant(true);
    setIsDropdownOpen(false);

    try {
      const token = await getAdminBearerToken(user);
      const res = await fetch('/api/v1/meetings/instant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: `${user?.name || 'Instant'} Technical Meeting`,
          meeting_type: 'Technical Discussion',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.meetingUrl) {
          navigate(data.meetingUrl);
          return;
        }
      }
    } catch (err) {
      console.warn('[Instant Meeting] API fallback to direct client route:', err);
    }

    // Direct room launch fallback
    const roomId = generateRoomId();
    navigate(`/meet/${roomId}`);
  };

  // 2. Create Meeting for Later (Google Meet Style)
  const handleCreateMeetingForLater = async () => {
    setIsDropdownOpen(false);
    let targetUrl = '';

    try {
      const token = await getAdminBearerToken(user);
      const res = await fetch('/api/v1/meetings/instant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: `${user?.name || 'Scheduled'} Discussion`,
          meeting_type: 'Interview',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.meetingUrl) {
          targetUrl = `${window.location.origin}${data.meetingUrl}`;
        }
      }
    } catch {}

    if (!targetUrl) {
      const roomId = generateRoomId();
      targetUrl = `${window.location.origin}/meet/${roomId}`;
    }

    setCreatedLaterLink(targetUrl);
    setIsLaterModalOpen(true);
  };

  // 3. Join with Code or URL
  const handleJoinMeeting = () => {
    if (!meetingCodeOrUrl.trim()) return;

    let cleanInput = meetingCodeOrUrl.trim();
    // If user pasted a full URL
    if (cleanInput.includes('/meet/')) {
      const parts = cleanInput.split('/meet/');
      cleanInput = parts[parts.length - 1].split('?')[0].split('#')[0];
    } else if (cleanInput.startsWith('http')) {
      try {
        const parsed = new URL(cleanInput);
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        cleanInput = pathSegments[pathSegments.length - 1];
      } catch {}
    }

    navigate(`/meet/${encodeURIComponent(cleanInput)}`);
  };

  const handleCopyLink = () => {
    if (!createdLaterLink) return;
    navigator.clipboard.writeText(createdLaterLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="instant-meet-hub">
      {/* Top Navigation Bar */}
      <header className="instant-meet-header">
        <div className="instant-meet-brand" onClick={() => navigate('/dashboard')}>
          <div className="instant-meet-logo-badge">
            <span className="instant-meet-cam-icon">📹</span>
          </div>
          <span className="instant-meet-brand-title">
            Platform <span className="instant-meet-highlight">Meet</span>
          </span>
        </div>

        <div className="instant-meet-header-right">
          <div className="instant-meet-clock">{currentTime}</div>
          <button
            className="instant-meet-nav-link"
            onClick={() => navigate('/dashboard?tab=meeting_ops')}
            title="Meeting Operations Control Center"
          >
            📋 Meeting Ops
          </button>
          {user && (
            <div className="instant-meet-user-chip" title={user.email}>
              <div className="instant-meet-user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="instant-meet-user-name">{user.name || 'User'}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Arena */}
      <main className="instant-meet-main">
        {/* Left Hero Column */}
        <section className="instant-meet-hero">
          <div className="instant-meet-badge-pill">
            <span className="instant-meet-pulse-dot" />
            <span>Google Meet-Grade Video Collaboration</span>
          </div>

          <h1 className="instant-meet-heading">
            Enterprise video meetings. <br />
            <span className="instant-meet-heading-gradient">Now built right into your workflow.</span>
          </h1>

          <p className="instant-meet-subtext">
            Start instant 1:1 or panel technical interviews with crystal-clear audio, HD video,
            collaborative Monaco code studio, interactive whiteboard, and verifiable attendance.
          </p>

          {/* Action Row */}
          <div className="instant-meet-actions">
            {/* New Meeting Dropdown Button */}
            <div className="instant-meet-dropdown-wrapper" ref={dropdownRef}>
              <button
                className="instant-meet-btn-primary"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                disabled={isCreatingInstant}
              >
                <span className="instant-meet-btn-icon">📹</span>
                <span>{isCreatingInstant ? 'Creating...' : 'New meeting'}</span>
                <span className={`instant-meet-chevron ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {isDropdownOpen && (
                <div className="instant-meet-dropdown-menu">
                  <button
                    className="instant-meet-dropdown-item"
                    onClick={handleStartInstantMeeting}
                  >
                    <span className="instant-meet-item-icon">⚡</span>
                    <div className="instant-meet-item-text">
                      <strong>Start an instant meeting</strong>
                      <small>Create and join a live video room right now</small>
                    </div>
                  </button>

                  <button
                    className="instant-meet-dropdown-item"
                    onClick={handleCreateMeetingForLater}
                  >
                    <span className="instant-meet-item-icon">🔗</span>
                    <div className="instant-meet-item-text">
                      <strong>Create a meeting for later</strong>
                      <small>Generate a shareable link you can send to others</small>
                    </div>
                  </button>

                  <button
                    className="instant-meet-dropdown-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/dashboard?tab=meeting_ops');
                    }}
                  >
                    <span className="instant-meet-item-icon">📅</span>
                    <div className="instant-meet-item-text">
                      <strong>Schedule in Meeting Ops</strong>
                      <small>Plan recurring batches, set reminders & calendar invites</small>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Enter Code or Link Input & Join Button */}
            <div className="instant-meet-join-group">
              <div className="instant-meet-input-wrapper">
                <span className="instant-meet-keyboard-icon">⌨️</span>
                <input
                  type="text"
                  className="instant-meet-input"
                  placeholder="Enter a code or link"
                  value={meetingCodeOrUrl}
                  onChange={e => setMeetingCodeOrUrl(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleJoinMeeting();
                  }}
                />
              </div>

              <button
                className="instant-meet-btn-join"
                onClick={handleJoinMeeting}
                disabled={!meetingCodeOrUrl.trim()}
              >
                Join
              </button>
            </div>
          </div>

          <div className="instant-meet-divider" />

          <div className="instant-meet-footer-note">
            <span>💡 <strong>Quick Tip:</strong> No external accounts, downloads, or third-party plug-ins required. Everything runs natively inside your browser.</span>
          </div>
        </section>

        {/* Right Feature Showcase Carousel */}
        <section className="instant-meet-preview-pane">
          <div className="instant-meet-carousel-card">
            <div className="instant-meet-card-header">
              <span className="instant-meet-card-tag">{CAROUSEL_SLIDES[activeSlide].tag}</span>
              <span className="instant-meet-card-icon">{CAROUSEL_SLIDES[activeSlide].icon}</span>
            </div>

            <div className="instant-meet-preview-mockup">
              {activeSlide === 0 && (
                <div className="mockup-video-grid">
                  <div className="mockup-tile active-speaker">
                    <span className="mockup-avatar">👤</span>
                    <span className="mockup-name">Trainer (Interviewer)</span>
                    <span className="mockup-mic-status">🎙️</span>
                  </div>
                  <div className="mockup-tile">
                    <span className="mockup-avatar">🎓</span>
                    <span className="mockup-name">Candidate</span>
                    <span className="mockup-mic-status">🎙️</span>
                  </div>
                </div>
              )}

              {activeSlide === 1 && (
                <div className="mockup-code-editor">
                  <div className="mockup-editor-bar">
                    <span className="mockup-dot red" />
                    <span className="mockup-dot yellow" />
                    <span className="mockup-dot green" />
                    <span className="mockup-tab-title">Solution.tsx</span>
                  </div>
                  <pre className="mockup-code-lines">
                    <code>
                      {`// Concurrent State Synchronization\nfunction useDistributedPresence() {\n  const [peers, setPeers] = useState([]);\n  // Real-time collaborative mesh\n  return { peers, isLive: true };\n}`}
                    </code>
                  </pre>
                </div>
              )}

              {activeSlide === 2 && (
                <div className="mockup-whiteboard">
                  <div className="mockup-wb-box wb-box-1">Client Gateway</div>
                  <div className="mockup-wb-arrow">➔</div>
                  <div className="mockup-wb-box wb-box-2">Kafka Outbox</div>
                  <div className="mockup-wb-arrow">➔</div>
                  <div className="mockup-wb-box wb-box-3">WebRTC SFU</div>
                </div>
              )}

              {activeSlide === 3 && (
                <div className="mockup-attendance">
                  <div className="mockup-att-row">
                    <span>Alice Johnson</span>
                    <span className="mockup-att-badge present">✓ PRESENT (98%)</span>
                  </div>
                  <div className="mockup-att-row">
                    <span>Bob Martinez</span>
                    <span className="mockup-att-badge synced">📅 CALENDAR SYNCED</span>
                  </div>
                  <div className="mockup-att-row">
                    <span>Audit Log</span>
                    <span className="mockup-att-badge audit">🔒 KAFKA COMMITTED</span>
                  </div>
                </div>
              )}
            </div>

            <div className="instant-meet-card-content">
              <h3 className="instant-meet-card-title">{CAROUSEL_SLIDES[activeSlide].title}</h3>
              <p className="instant-meet-card-desc">{CAROUSEL_SLIDES[activeSlide].description}</p>
            </div>

            {/* Carousel Dots */}
            <div className="instant-meet-carousel-dots">
              {CAROUSEL_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  className={`instant-meet-dot ${idx === activeSlide ? 'active' : ''}`}
                  onClick={() => setActiveSlide(idx)}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* "Create Meeting For Later" Google Meet Style Modal */}
      {isLaterModalOpen && (
        <div className="instant-meet-modal-overlay" onClick={() => setIsLaterModalOpen(false)}>
          <div className="instant-meet-modal-card" onClick={e => e.stopPropagation()}>
            <div className="instant-meet-modal-header">
              <h2>Here's your meeting link</h2>
              <button
                className="instant-meet-modal-close"
                onClick={() => setIsLaterModalOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>

            <p className="instant-meet-modal-subtext">
              Copy this link and send it to people you want to meet with. Be sure to save it so you can use it later, too.
            </p>

            <div className="instant-meet-link-box">
              <span className="instant-meet-link-text">{createdLaterLink}</span>
              <button
                className={`instant-meet-copy-btn ${copiedLink ? 'copied' : ''}`}
                onClick={handleCopyLink}
                title="Copy meeting link"
              >
                {copiedLink ? '✓ Copied!' : '📋 Copy'}
              </button>
            </div>

            <div className="instant-meet-modal-actions">
              <button
                className="instant-meet-btn-secondary"
                onClick={() => setIsLaterModalOpen(false)}
              >
                Done
              </button>
              <button
                className="instant-meet-btn-primary"
                onClick={() => {
                  if (createdLaterLink) {
                    const parsed = new URL(createdLaterLink);
                    navigate(parsed.pathname);
                  }
                }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstantMeetingLandingPage;
