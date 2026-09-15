import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { docsProgressService, type SyllabusOverallStats } from '../../features/interview-docs/services/docsProgressService';
import { docsSearchService } from '../../features/interview-docs/services/docsSearchService';
import './DocsSyllabusTracker.css';

export function CandidateDocsSyllabusTracker() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stats, setStats] = useState<SyllabusOverallStats>(() => docsProgressService.getSyllabusStats());

  // URL-driven query parameters
  const selectedCategory = searchParams.get('docsCategory') || 'All';
  const showHistory = searchParams.get('docsHistory') === 'true';
  const showBookmarks = searchParams.get('docsTab') === 'bookmarks';

  const handleSelectCategory = (cat: string) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('docsCategory');
    } else {
      next.set('docsCategory', cat);
    }
    setSearchParams(next, { replace: true });
  };

  const handleToggleHistory = () => {
    const next = new URLSearchParams(searchParams);
    if (showHistory) {
      next.delete('docsHistory');
    } else {
      next.set('docsHistory', 'true');
    }
    setSearchParams(next, { replace: true });
  };

  const handleToggleBookmarksTab = () => {
    const next = new URLSearchParams(searchParams);
    if (showBookmarks) {
      next.delete('docsTab');
    } else {
      next.set('docsTab', 'bookmarks');
    }
    setSearchParams(next, { replace: true });
  };

  // Auto-refresh when docs progress changes
  useEffect(() => {
    const handleUpdate = () => {
      setStats(docsProgressService.getSyllabusStats());
    };
    window.addEventListener('docs_progress_updated', handleUpdate);
    return () => window.removeEventListener('docs_progress_updated', handleUpdate);
  }, []);

  // Filter tracks by category
  const categories = useMemo(() => {
    const set = new Set<string>();
    stats.trackBreakdown.forEach(t => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, [stats.trackBreakdown]);

  const filteredTracks = useMemo(() => {
    if (selectedCategory === 'All') return stats.trackBreakdown;
    return stats.trackBreakdown.filter(t => t.category === selectedCategory);
  }, [stats.trackBreakdown, selectedCategory]);

  const lastVisited = stats.lastVisited;

  const bookmarkedItems = useMemo(() => {
    return docsSearchService.getBookmarkedItems();
  }, [stats]);

  return (
    <div className="candidate-docs-tracker" id="candidate-syllabus-tracker">
      {/* Tracker Header */}
      <div className="cdt-header">
        <div className="cdt-header-left">
          <div className="cdt-title-row">
            <span className="cdt-icon">📚</span>
            <h2 className="cdt-title">Documentation &amp; Full Syllabus Tracker</h2>
            <span className="cdt-badge">All 21 Tracks Active</span>
          </div>
          <p className="cdt-subtitle">
            Comprehensive curriculum coverage across Core Web, JavaScript, React 19, TypeScript, System Design, and Enterprise Tooling.
          </p>
        </div>

        <div className="cdt-header-actions">
          <Link to="/docs" className="cdt-action-btn primary">
            <span>📖</span> Open Docs University →
          </Link>
          <Link to="/docs/readiness" className="cdt-action-btn secondary">
            <span>🎯</span> Readiness Report
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="cdt-kpi-grid">
        {/* KPI 1: Overall Syllabus Completion */}
        <div className="cdt-kpi-card">
          <div className="cdt-kpi-icon" style={{ background: 'rgba(99, 102, 241, 0.16)', color: '#818cf8' }}>
            🎓
          </div>
          <div className="cdt-kpi-content">
            <div className="cdt-kpi-value">
              <span>{stats.completionPercentage}%</span>
              <span className="cdt-kpi-sub">({stats.totalCompletedTopics} / {stats.totalSyllabusTopics} Topics)</span>
            </div>
            <div className="cdt-kpi-label">Full Syllabus Completed</div>
            <div className="cdt-progress-bar-wrap">
              <div
                className="cdt-progress-bar-fill"
                style={{
                  width: `${Math.max(stats.completionPercentage, 2)}%`,
                  background: stats.completionPercentage >= 70 ? '#10b981' : stats.completionPercentage >= 30 ? '#f59e0b' : 'linear-gradient(90deg, #4f46e5 0%, #a855f7 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI 2: Active Tracks Explored */}
        <div className="cdt-kpi-card">
          <div className="cdt-kpi-icon" style={{ background: 'rgba(16, 185, 129, 0.14)', color: '#10b981' }}>
            🚀
          </div>
          <div className="cdt-kpi-content">
            <div className="cdt-kpi-value">
              <span>{stats.activeTracksCount} / {stats.totalTracksCount}</span>
              <span className="cdt-kpi-sub">Tracks Active</span>
            </div>
            <div className="cdt-kpi-label">Active Learning Tracks</div>
            <div className="cdt-progress-bar-wrap">
              <div
                className="cdt-progress-bar-fill"
                style={{
                  width: `${Math.round((stats.activeTracksCount / Math.max(1, stats.totalTracksCount)) * 100)}%`,
                  background: '#10b981',
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI 3: Bookmarked Docs for Revision */}
        <div
          className={`cdt-kpi-card ${showBookmarks ? 'active-kpi' : ''}`}
          onClick={handleToggleBookmarksTab}
          style={{ cursor: 'pointer' }}
          title={showBookmarks ? 'Click to show curriculum grid' : 'Click to view saved bookmarks & favorites'}
        >
          <div className="cdt-kpi-icon" style={{ background: 'rgba(251, 191, 36, 0.16)', color: '#fbbf24' }}>
            ⭐
          </div>
          <div className="cdt-kpi-content">
            <div className="cdt-kpi-value">
              <span>{stats.bookmarkedCount}</span>
              <span className="cdt-kpi-sub">Saved Favorites</span>
            </div>
            <div className="cdt-kpi-label">Saved for Technical Revision</div>
            <div className="cdt-progress-bar-wrap">
              <div
                className="cdt-progress-bar-fill"
                style={{
                  width: `${Math.min(100, stats.bookmarkedCount * 10)}%`,
                  background: '#fbbf24',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resume Learning Section */}
      {lastVisited && !showBookmarks && (
        <div className="cdt-resume-banner">
          <div className="cdt-resume-left">
            <span className="cdt-resume-tag">Jump Back In</span>
            <div className="cdt-resume-title-wrap">
              <span className="cdt-resume-subject">{lastVisited.subjectTitle}</span>
              <span className="cdt-resume-arrow">›</span>
              <span className="cdt-resume-topic">{lastVisited.topicTitle}</span>
            </div>
          </div>
          <Link
            to={`/docs/${lastVisited.subjectId}/${lastVisited.topicId}`}
            className="cdt-resume-btn"
          >
            <span>Resume Learning</span>
            <span>→</span>
          </Link>
        </div>
      )}

      {/* Category Tabs & Bookmarks Filter */}
      <div className="cdt-filter-bar">
        <button
          type="button"
          className={`cdt-filter-btn ${!showBookmarks && selectedCategory === 'All' ? 'active' : ''}`}
          onClick={() => {
            if (showBookmarks) handleToggleBookmarksTab();
            handleSelectCategory('All');
          }}
        >
          All Tracks
        </button>
        <button
          type="button"
          className={`cdt-filter-btn cdt-filter-btn-fav ${showBookmarks ? 'active' : ''}`}
          onClick={handleToggleBookmarksTab}
        >
          ⭐ Saved Bookmarks ({stats.bookmarkedCount})
        </button>
        {categories.filter(c => c !== 'All').map(cat => (
          <button
            key={cat}
            type="button"
            className={`cdt-filter-btn ${!showBookmarks && selectedCategory === cat ? 'active' : ''}`}
            onClick={() => {
              if (showBookmarks) handleToggleBookmarksTab();
              handleSelectCategory(cat);
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Bookmarks Section (when active) */}
      {showBookmarks && (
        <div className="cdt-bookmarks-panel">
          <div className="cdt-bookmarks-header">
            <div className="cbh-left">
              <h3 className="cbh-title">⭐ Your Saved Bookmarks &amp; Favorites</h3>
              <p className="cbh-desc">
                High-priority topics and technical interview questions pinned for quick review, active recall, and mock prep.
              </p>
            </div>
            <button
              type="button"
              className="cdt-open-cmd-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            >
              🔍 Search &amp; Add (Ctrl+K)
            </button>
          </div>

          {bookmarkedItems.length === 0 ? (
            <div className="cdt-bookmarks-empty">
              <span className="cbe-icon">⭐</span>
              <h4>No Bookmarked Topics or Questions Yet</h4>
              <p>
                Save items while studying in the documentation or press <kbd>Ctrl+K</kbd> to search and star key topics.
              </p>
              <Link to="/docs" className="cdt-browse-btn">Browse All 21 Tracks →</Link>
            </div>
          ) : (
            <div className="cdt-bookmarks-list">
              {bookmarkedItems.map(item => (
                <div key={item.id} className="cdt-bookmark-item">
                  <div className="cbi-left">
                    <span className="cbi-icon">{item.icon || (item.type === 'question' ? '❓' : '📄')}</span>
                    <div className="cbi-meta">
                      <div className="cbi-topline">
                        <span className={`cbi-type-badge ${item.type === 'question' ? 'badge-question' : 'badge-topic'}`}>
                          {item.type.toUpperCase()}
                        </span>
                        {item.subjectTitle && <span className="cbi-subject">{item.subjectTitle}</span>}
                        {item.badge && <span className="cbi-badge">{item.badge}</span>}
                      </div>
                      <h5 className="cbi-title">{item.title}</h5>
                      <p className="cbi-snippet">{item.snippet.slice(0, 140)}...</p>
                    </div>
                  </div>

                  <div className="cbi-right">
                    <Link to={item.url} className="cbi-study-btn">
                      Study Now →
                    </Link>
                    <button
                      type="button"
                      className="cbi-remove-btn"
                      onClick={() => {
                        if (item.type === 'topic' && item.subjectId && item.topicId) {
                          docsProgressService.toggleDocBookmark(item.subjectId, item.topicId);
                        } else if (item.type === 'question') {
                          const qId = item.id.replace(/^q_/, '');
                          docsProgressService.toggleQuestionBookmark(qId);
                        }
                      }}
                      title="Remove bookmark"
                    >
                      ★ Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 21-Track Curriculum Grid (when bookmarks not active) */}
      {!showBookmarks && (
        <div className="cdt-tracks-grid">
          {filteredTracks.map(track => {
            const isStarted = track.completedTopicsCount > 0;
            const fillColor = track.completionPercentage >= 70
              ? '#10b981'
              : track.completionPercentage >= 30
              ? '#f59e0b'
              : isStarted
              ? '#6366f1'
              : 'rgba(255,255,255,0.1)';

            return (
              <div key={track.subjectId} className="cdt-track-card">
                <div>
                  <div className="cdt-track-head">
                    <span className="cdt-track-icon">{track.icon}</span>
                    <div className="cdt-track-meta">
                      <h5 className="cdt-track-title">{track.title}</h5>
                      <span className="cdt-track-cat">{track.category} • {track.badge}</span>
                    </div>
                    <span className="cdt-track-pct">{track.completionPercentage}%</span>
                  </div>

                  <div className="cdt-track-bar-wrap">
                    <div
                      className="cdt-track-bar-fill"
                      style={{
                        width: `${track.completionPercentage}%`,
                        background: fillColor,
                      }}
                    />
                  </div>
                </div>

                <div className="cdt-track-foot">
                  <span>{track.completedTopicsCount} / {track.totalTopicsCount} Topics</span>
                  <Link to={`/docs/${track.subjectId}`} className="cdt-track-link">
                    {isStarted ? 'Continue →' : 'Start Track →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Topics History Accordion */}
      {stats.recentCompletedTopics.length > 0 && (
        <>
          <button
            type="button"
            className="cdt-history-toggle"
            onClick={handleToggleHistory}
          >
            <span>{showHistory ? '▼' : '▶'}</span>
            <span>Completed Topics History ({stats.recentCompletedTopics.length})</span>
          </button>

          {showHistory && (
            <div className="cdt-completed-chips">
              {stats.recentCompletedTopics.map(item => (
                <Link
                  key={item.key}
                  to={`/docs/${item.subjectId}/${item.topicId}`}
                  className="cdt-chip"
                  title={`Completed in ${item.subjectTitle}`}
                >
                  <span>✓</span>
                  <span><strong>{item.subjectTitle}:</strong> {item.topicTitle}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
