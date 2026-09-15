import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { AuthUserProfile } from '../../../features/auth/types/auth.types';
import { docsProgressService } from '../../../features/interview-docs/services/docsProgressService';
import '../DocsSyllabusTracker.css';

interface AdminDocsSyllabusViewProps {
  profiles: AuthUserProfile[];
}

export function AdminDocsSyllabusView({ profiles }: AdminDocsSyllabusViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Query parameter states
  const activeCandidateId = searchParams.get('candidateId') || searchParams.get('candidate');
  const searchTerm = searchParams.get('q') || '';
  const roleFilter = searchParams.get('role') || 'ALL';
  const progressFilter = searchParams.get('progress') || 'ALL';
  const trackCategoryFilter = searchParams.get('trackCategory') || 'All';
  const trackSearchTerm = searchParams.get('trackSearch') || '';

  // Helper to update search params without losing other active params
  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'ALL' || val === 'All') {
        next.delete(key);
      } else {
        next.set(key, val);
      }
    });
    setSearchParams(next);
  };

  // Compute multi-candidate syllabus tracking data
  const { metrics, candidates } = useMemo(() => {
    return docsProgressService.getAllCandidatesDocsProgress(profiles);
  }, [profiles]);

  // Selected candidate for deep-dive in-route audit
  const selectedCandidate = useMemo(() => {
    if (!activeCandidateId) return null;
    return (
      candidates.find(c => c.userId === activeCandidateId) ||
      candidates.find(c => c.userEmail.toLowerCase() === activeCandidateId.toLowerCase()) ||
      null
    );
  }, [candidates, activeCandidateId]);

  // Filter candidates for the overview table based on search, role, and progress tier
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      // Search
      const matchSearch =
        !searchTerm ||
        c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.topTrackName.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchSearch) return false;

      // Role filter
      if (roleFilter !== 'ALL' && c.userRole !== roleFilter) return false;

      // Progress tier filter
      if (progressFilter === 'HIGH' && c.completionPercentage < 50) return false;
      if (progressFilter === 'ACTIVE' && (c.completionPercentage <= 0 || c.completionPercentage >= 50)) return false;
      if (progressFilter === 'ZERO' && c.completionPercentage > 0) return false;

      return true;
    });
  }, [candidates, searchTerm, roleFilter, progressFilter]);

  // Categories available for candidate's 21 tracks
  const candidateTrackCategories = useMemo(() => {
    if (!selectedCandidate) return [];
    const set = new Set<string>();
    selectedCandidate.trackBreakdown.forEach(t => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [selectedCandidate]);

  // Filtered tracks for candidate's in-route audit
  const candidateFilteredTracks = useMemo(() => {
    if (!selectedCandidate) return [];
    return selectedCandidate.trackBreakdown.filter(t => {
      if (trackCategoryFilter !== 'All' && t.category !== trackCategoryFilter) return false;
      if (
        trackSearchTerm &&
        !t.title.toLowerCase().includes(trackSearchTerm.toLowerCase()) &&
        !t.badge.toLowerCase().includes(trackSearchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [selectedCandidate, trackCategoryFilter, trackSearchTerm]);

  // =========================================================================
  // VIEW 1: DEDICATED IN-ROUTE CANDIDATE SYLLABUS AUDIT VIEW (?candidateId=...)
  // =========================================================================
  if (activeCandidateId) {
    if (!selectedCandidate) {
      return (
        <div className="admin-docs-syllabus-view">
          <div className="adsv-not-found-card">
            <div className="adsv-not-found-icon">⚠️</div>
            <h3>Candidate Profile Not Found</h3>
            <p>No candidate with identifier &ldquo;{activeCandidateId}&rdquo; was found in the syllabus registry.</p>
            <button
              type="button"
              className="adsv-back-btn"
              onClick={() => updateParams({ candidateId: null, trackCategory: null, trackSearch: null })}
            >
              ← Return to All Candidates
            </button>
          </div>
        </div>
      );
    }

    const readinessColor =
      selectedCandidate.completionPercentage >= 70
        ? '#10b981'
        : selectedCandidate.completionPercentage >= 30
        ? '#f59e0b'
        : '#6366f1';

    return (
      <div className="admin-docs-syllabus-view adsv-audit-page-view">
        {/* Navigation Breadcrumb Bar */}
        <div className="adsv-audit-nav-bar">
          <button
            type="button"
            className="adsv-back-btn"
            onClick={() => updateParams({ candidateId: null, trackCategory: null, trackSearch: null })}
            title="Return to Candidates Syllabus Registry"
          >
            ← Back to All Candidates
          </button>
          <div className="adsv-breadcrumbs">
            <span
              className="adsv-breadcrumb-link"
              onClick={() => updateParams({ candidateId: null, trackCategory: null, trackSearch: null })}
            >
              Docs Operations
            </span>
            <span className="adsv-breadcrumb-sep">/</span>
            <span className="adsv-breadcrumb-current">
              Audit: {selectedCandidate.userName}
            </span>
          </div>
        </div>

        {/* Candidate Dossier Hero Card */}
        <div className="adsv-audit-hero-card">
          <div className="adsv-audit-hero-left">
            <div className="adsv-audit-avatar">
              {selectedCandidate.userName.charAt(0).toUpperCase()}
            </div>
            <div className="adsv-audit-hero-info">
              <div className="adsv-audit-name-row">
                <h2 className="adsv-audit-candidate-name">{selectedCandidate.userName}</h2>
                <span
                  className="adsv-audit-role-tag"
                  style={{
                    background: selectedCandidate.userRole === 'admin' ? 'rgba(239, 68, 68, 0.16)' : 'rgba(99, 102, 241, 0.16)',
                    color: selectedCandidate.userRole === 'admin' ? '#f87171' : '#818cf8',
                    border: `1px solid ${selectedCandidate.userRole === 'admin' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                  }}
                >
                  {selectedCandidate.userRole}
                </span>
              </div>
              <p className="adsv-audit-email">{selectedCandidate.userEmail}</p>
              <div className="adsv-audit-target-pills">
                <span className="adsv-audit-pill">🎯 Target: Google / Meta</span>
                <span className="adsv-audit-pill">💼 Level: L5 Senior Frontend</span>
                <span className="adsv-audit-pill">⚡ ID: {selectedCandidate.userId}</span>
              </div>
            </div>
          </div>

          <div className="adsv-audit-hero-right">
            <div className="adsv-audit-score-ring">
              <div className="adsv-audit-score-val" style={{ color: readinessColor }}>
                {selectedCandidate.completionPercentage}%
              </div>
              <div className="adsv-audit-score-lbl">Syllabus Completion</div>
            </div>
          </div>
        </div>

        {/* 4 In-Depth Metric Cards */}
        <div className="adsv-metrics-grid">
          <div className="adsv-stat-card">
            <div className="adsv-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.16)', color: '#818cf8' }}>
              🎓
            </div>
            <div>
              <h3 className="adsv-stat-num">
                {selectedCandidate.totalCompletedTopics} / {selectedCandidate.totalSyllabusTopics}
              </h3>
              <p className="adsv-stat-label">Syllabus Topics Mastered</p>
            </div>
          </div>

          <div className="adsv-stat-card">
            <div className="adsv-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.14)', color: '#34d399' }}>
              ⚡
            </div>
            <div>
              <h3 className="adsv-stat-num">{selectedCandidate.activeTracksCount} / 21</h3>
              <p className="adsv-stat-label">Active Modules Explored</p>
            </div>
          </div>

          <div className="adsv-stat-card">
            <div className="adsv-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.14)', color: '#38bdf8' }}>
              🔖
            </div>
            <div>
              <h3 className="adsv-stat-num">{selectedCandidate.bookmarkedCount}</h3>
              <p className="adsv-stat-label">Bookmarked for Revision</p>
            </div>
          </div>

          <div className="adsv-stat-card">
            <div className="adsv-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.14)', color: '#fbbf24' }}>
              🏆
            </div>
            <div>
              <h3 className="adsv-stat-num" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                {selectedCandidate.topTrackName}
              </h3>
              <p className="adsv-stat-label">Primary Studied Track</p>
            </div>
          </div>
        </div>

        {/* Track Category Toolbar & Filter Pills */}
        <div className="adsv-audit-filter-panel">
          <div className="adsv-audit-filter-header">
            <div>
              <h3 className="adsv-audit-subhead">
                <span>📚</span> 21-Track Curriculum Breakdown ({candidateFilteredTracks.length} tracks shown)
              </h3>
              <p className="adsv-audit-subtext">
                Filter and inspect individual track completion, mastery percentages, and topic titles for this candidate.
              </p>
            </div>

            <div className="adsv-audit-track-search">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Filter track by name or badge..."
                value={trackSearchTerm}
                onChange={e => updateParams({ trackSearch: e.target.value })}
                className="adsv-audit-search-input"
              />
            </div>
          </div>

          <div className="adsv-category-pills">
            {candidateTrackCategories.map(cat => {
              const isActive = trackCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`adsv-cat-pill ${isActive ? 'active' : ''}`}
                  onClick={() => updateParams({ trackCategory: cat })}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 21 Tracks Grid Cards */}
        <div className="adsv-audit-tracks-grid">
          {candidateFilteredTracks.map(t => {
            const barColor =
              t.completionPercentage >= 50
                ? '#10b981'
                : t.completedTopicsCount > 0
                ? '#6366f1'
                : 'rgba(255, 255, 255, 0.1)';

            return (
              <div key={t.subjectId} className="adsv-audit-track-card">
                <div className="adsv-atc-top">
                  <div className="adsv-atc-header">
                    <span className="adsv-atc-icon">{t.icon}</span>
                    <div>
                      <h4 className="adsv-atc-title">{t.title}</h4>
                      <div className="adsv-atc-sub">
                        <span>{t.category}</span>
                        <span>•</span>
                        <span className="adsv-atc-badge">{t.badge}</span>
                      </div>
                    </div>
                  </div>
                  <div className="adsv-atc-score" style={{ color: barColor }}>
                    {t.completionPercentage}%
                  </div>
                </div>

                <div className="adsv-prog-bar" style={{ marginTop: '14px', height: '7px' }}>
                  <div
                    className="adsv-prog-fill"
                    style={{
                      width: `${t.completionPercentage}%`,
                      background: barColor,
                    }}
                  />
                </div>

                <div className="adsv-atc-bottom">
                  <span className="adsv-atc-counts">
                    <strong>{t.completedTopicsCount}</strong> / {t.totalTopicsCount} topics mastered
                  </span>
                  <Link
                    to={`/docs/${t.subjectId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="adsv-atc-link"
                    title="Open live documentation for this track in new tab"
                  >
                    Open Track Docs ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completed Topics History */}
        {selectedCandidate.completedTopicTitles.length > 0 && (
          <div className="adsv-completed-topics-panel">
            <h3 className="adsv-audit-subhead">
              <span>✓</span> Mastered Topic Titles ({selectedCandidate.completedTopicTitles.length})
            </h3>
            <div className="cdt-completed-chips" style={{ marginTop: '12px' }}>
              {selectedCandidate.completedTopicTitles.map((title, idx) => (
                <span key={idx} className="cdt-chip">
                  <span>✓</span>
                  <span>{title}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: EXECUTIVE CANDIDATE DIRECTORY TABLE VIEW (Default)
  // =========================================================================
  return (
    <div className="admin-docs-syllabus-view">
      {/* Executive Header */}
      <div className="adsv-header-bar">
        <div>
          <h2 className="adsv-header-title">
            <span>📚</span> Documentation &amp; Syllabus Coverage Operations
          </h2>
          <p className="adsv-header-desc">
            Monitor real-time syllabus completion, track engagement, and topic mastery across all candidates.
          </p>
        </div>
      </div>

      {/* Executive Metrics Row */}
      <div className="adsv-metrics-grid">
        <div className="adsv-stat-card">
          <div className="adsv-stat-icon" style={{ background: 'rgba(99, 102, 241, 0.16)', color: '#818cf8' }}>
            📖
          </div>
          <div>
            <h3 className="adsv-stat-num">{metrics.totalTopicsCompletedAcrossPlatform}</h3>
            <p className="adsv-stat-label">Total Topics Completed Across Platform</p>
          </div>
        </div>

        <div className="adsv-stat-card">
          <div className="adsv-stat-icon" style={{ background: 'rgba(16, 185, 129, 0.14)', color: '#34d399' }}>
            📊
          </div>
          <div>
            <h3 className="adsv-stat-num">{metrics.averageCandidateCompletionPct}%</h3>
            <p className="adsv-stat-label">Avg Candidate Syllabus Mastery</p>
          </div>
        </div>

        <div className="adsv-stat-card">
          <div className="adsv-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.14)', color: '#38bdf8' }}>
            👥
          </div>
          <div>
            <h3 className="adsv-stat-num">{metrics.activeLearnersCount} / {metrics.totalRegisteredCandidates}</h3>
            <p className="adsv-stat-label">Active Candidate Readers</p>
          </div>
        </div>

        <div className="adsv-stat-card">
          <div className="adsv-stat-icon" style={{ background: 'rgba(245, 158, 11, 0.14)', color: '#fbbf24' }}>
            🏆
          </div>
          <div>
            <h3 className="adsv-stat-num" style={{ fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
              {metrics.mostStudiedTrack}
            </h3>
            <p className="adsv-stat-label">Most Studied Track</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="adsv-toolbar">
        <div className="adsv-search-box">
          <span>🔍</span>
          <input
            type="text"
            className="adsv-search-input"
            placeholder="Search candidate by name, email, or track..."
            value={searchTerm}
            onChange={e => updateParams({ q: e.target.value })}
          />
        </div>

        <div className="adsv-filters">
          <select
            className="adsv-select"
            value={roleFilter}
            onChange={e => updateParams({ role: e.target.value })}
          >
            <option value="ALL">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="pro_member">Pro Member</option>
            <option value="admin">Administrator</option>
          </select>

          <select
            className="adsv-select"
            value={progressFilter}
            onChange={e => updateParams({ progress: e.target.value })}
          >
            <option value="ALL">All Progress Tiers</option>
            <option value="HIGH">High Progress (&ge; 50%)</option>
            <option value="ACTIVE">In Progress (1% - 49%)</option>
            <option value="ZERO">Not Started (0%)</option>
          </select>
        </div>
      </div>

      {/* Candidates Syllabus Table */}
      <div className="adsv-table-card">
        <table className="adsv-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Role</th>
              <th>Syllabus Completed</th>
              <th>Primary Track</th>
              <th>Last Topic Read</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No candidates match the selected filters.
                </td>
              </tr>
            ) : (
              filteredCandidates.map(c => {
                const barColor =
                  c.completionPercentage >= 50
                    ? '#10b981'
                    : c.completionPercentage > 0
                    ? '#6366f1'
                    : 'rgba(255,255,255,0.1)';

                return (
                  <tr key={c.userId}>
                    <td>
                      <div
                        className="adsv-user-cell"
                        style={{ cursor: 'pointer' }}
                        onClick={() => updateParams({ candidateId: c.userId })}
                        title="Click to view full syllabus audit"
                      >
                        <div className="adsv-avatar">
                          {c.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="adsv-user-name">{c.userName}</div>
                          <div className="adsv-user-email">{c.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: c.userRole === 'admin' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: c.userRole === 'admin' ? '#f87171' : '#818cf8',
                          textTransform: 'uppercase',
                        }}
                      >
                        {c.userRole}
                      </span>
                    </td>
                    <td>
                      <div className="adsv-prog-cell">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                          <span><strong>{c.totalCompletedTopics}</strong> / {c.totalSyllabusTopics} topics</span>
                          <span style={{ fontWeight: 800, color: barColor }}>{c.completionPercentage}%</span>
                        </div>
                        <div className="adsv-prog-bar">
                          <div
                            className="adsv-prog-fill"
                            style={{
                              width: `${c.completionPercentage}%`,
                              background: barColor,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.topTrackName}
                      </span>
                      {c.topTrackCompleted > 0 && (
                        <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {c.topTrackCompleted} topics mastered
                        </span>
                      )}
                    </td>
                    <td>
                      {c.lastVisited ? (
                        <div>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                            {c.lastVisited.topicTitle}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {c.lastVisited.subjectTitle}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>No topics visited yet</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="adsv-inspect-btn"
                        onClick={() => updateParams({ candidateId: c.userId })}
                        title="Inspect full 21-track syllabus breakdown via route"
                      >
                        🔍 Full Syllabus Audit →
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
