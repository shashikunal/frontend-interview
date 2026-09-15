import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { docsSearchService, type SearchResultItem, QUICK_ACTIONS } from '../services/docsSearchService';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { docsProgressService } from '../services/docsProgressService';
import '../styles/DocsCommandPalette.css';

export interface DocsCommandPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const RECENT_SEARCHES_KEY = 'docs_command_palette_recent';
const MAX_RECENTS = 5;

export function DocsCommandPalette({ isOpen: propIsOpen, onClose: propOnClose }: DocsCommandPaletteProps) {
  const navigate = useNavigate();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;

  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'subject' | 'topic' | 'question' | 'action' | 'favorite'>('all');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [bookmarkVersion, setBookmarkVersion] = useState(0);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Close handler
  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  // Synchronize bookmark changes across all components
  useEffect(() => {
    const handleBookmarkChange = () => {
      setBookmarkVersion(v => v + 1);
    };
    window.addEventListener('docs_progress_updated', handleBookmarkChange);
    return () => window.removeEventListener('docs_progress_updated', handleBookmarkChange);
  }, []);

  // Global keydown listener for Cmd/Ctrl+K & custom events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (propIsOpen !== undefined) {
          if (isOpen && propOnClose) propOnClose();
        } else {
          setInternalIsOpen(prev => !prev);
        }
      }
    };

    const handleCustomOpen = () => {
      if (propIsOpen === undefined) {
        setInternalIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [isOpen, propIsOpen, propOnClose]);

  // Reset & focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedType('all');
      setSelectedSubjectId('all');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      // Load recents
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) setRecentSearches(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  // Execute Search
  useEffect(() => {
    if (selectedType === 'favorite') {
      const items = docsSearchService.search(query, 50, 'favorite', selectedSubjectId);
      setResults(items);
      setSelectedIndex(0);
    } else if (query.trim().length > 0) {
      const items = docsSearchService.search(query, 30, selectedType, selectedSubjectId);
      setResults(items);
      setSelectedIndex(0);
    } else {
      if (selectedType !== 'all' || selectedSubjectId !== 'all') {
        // If query is empty but filter is applied, show filtered quick actions or subjects
        const items = docsSearchService.search('', 30, selectedType, selectedSubjectId);
        setResults(items);
      } else {
        setResults([]);
      }
      setSelectedIndex(0);
    }
  }, [query, selectedType, selectedSubjectId, bookmarkVersion]);

  // Keep selected item in viewport
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Save recent search
  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENTS);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
    handleClose();
    if (item.url.startsWith('http')) {
      window.location.href = item.url;
    } else {
      navigate(item.url);
    }
  };

  // Toggle bookmark on an item
  const handleToggleItemBookmark = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    if (item.type === 'topic' && item.subjectId && item.topicId) {
      docsProgressService.toggleDocBookmark(item.subjectId, item.topicId);
      setBookmarkVersion(v => v + 1);
    } else if (item.type === 'question') {
      const rawQId = item.id.replace(/^q_/, '');
      docsProgressService.toggleQuestionBookmark(rawQId);
      setBookmarkVersion(v => v + 1);
    }
  };

  // Total bookmarked count
  const favoritesCount = useMemo(() => {
    const p = docsProgressService.getProgress();
    return (p.bookmarkedDocs?.length || 0) + (p.bookmarkedQuestions?.length || 0);
  }, [bookmarkVersion]);

  // Keyboard navigation
  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    const activeItems = results.length > 0 ? results : (query.trim() === '' && selectedType === 'all' && selectedSubjectId === 'all') ? QUICK_ACTIONS : [];

    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < activeItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : activeItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeItems[selectedIndex]) {
        handleSelect(activeItems[selectedIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const types: ('all' | 'subject' | 'topic' | 'question' | 'action' | 'favorite')[] = ['all', 'favorite', 'subject', 'topic', 'question', 'action'];
      const nextIdx = (types.indexOf(selectedType) + 1) % types.length;
      setSelectedType(types[nextIdx]);
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
      // Toggle favorite on currently selected item
      e.preventDefault();
      if (activeItems[selectedIndex]) {
        const item = activeItems[selectedIndex];
        if (item.type === 'topic' && item.subjectId && item.topicId) {
          docsProgressService.toggleDocBookmark(item.subjectId, item.topicId);
          setBookmarkVersion(v => v + 1);
        } else if (item.type === 'question') {
          const rawQId = item.id.replace(/^q_/, '');
          docsProgressService.toggleQuestionBookmark(rawQId);
          setBookmarkVersion(v => v + 1);
        }
      }
    }
  };

  // Highlight helper
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const tokens = highlight.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return text;
    const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="cmd-highlight-mark">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Featured 21 Tracks for quick jump
  const featuredTracks = useMemo(() => {
    return ALL_SUBJECTS_CATALOG.slice(0, 8);
  }, []);

  if (!isOpen) return null;

  const isShowingDefaultRecommendations = query.trim() === '' && selectedType === 'all' && selectedSubjectId === 'all';

  return (
    <div className="command-palette-backdrop" onClick={handleClose}>
      <div
        className="command-palette-dialog"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Global Command Palette"
      >
        {/* Header with Search Input */}
        <div className="cmd-header">
          <span className="cmd-search-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            placeholder={
              selectedType === 'favorite'
                ? "Filter your bookmarked topics & questions..."
                : "Type a command, question, track (e.g. React, Closures, Mock, CSS)..."
            }
            value={query}
            onChange={e => setQuery(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="cmd-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              title="Clear query"
            >
              ✕
            </button>
          )}
          <kbd className="cmd-kbd-esc" onClick={handleClose} title="Press ESC to close">ESC</kbd>
        </div>

        {/* Filter Navigation Bar */}
        <div className="cmd-filters-bar">
          <div className="cmd-type-pills" role="tablist">
            <button
              type="button"
              className={`cmd-pill ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`cmd-pill cmd-pill-favorite ${selectedType === 'favorite' ? 'active' : ''}`}
              onClick={() => setSelectedType('favorite')}
              title="View all bookmarked topics & questions"
            >
              ⭐ Favorites {favoritesCount > 0 && <span className="cmd-pill-count">({favoritesCount})</span>}
            </button>
            <button
              type="button"
              className={`cmd-pill ${selectedType === 'subject' ? 'active' : ''}`}
              onClick={() => setSelectedType('subject')}
            >
              Tracks (21)
            </button>
            <button
              type="button"
              className={`cmd-pill ${selectedType === 'topic' ? 'active' : ''}`}
              onClick={() => setSelectedType('topic')}
            >
              Topics &amp; Docs
            </button>
            <button
              type="button"
              className={`cmd-pill ${selectedType === 'question' ? 'active' : ''}`}
              onClick={() => setSelectedType('question')}
            >
              Questions (200+)
            </button>
            <button
              type="button"
              className={`cmd-pill ${selectedType === 'action' ? 'active' : ''}`}
              onClick={() => setSelectedType('action')}
            >
              ⚡ Quick Actions
            </button>
          </div>

          <div className="cmd-track-select-wrap">
            <select
              className="cmd-track-select"
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              aria-label="Filter by Track"
            >
              <option value="all">All 21 Tracks</option>
              {ALL_SUBJECTS_CATALOG.map(s => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recent Searches Pills (if any and query is empty) */}
        {recentSearches.length > 0 && query.trim() === '' && selectedType === 'all' && (
          <div className="cmd-recent-searches">
            <span className="cmd-recent-label">🕒 Recent:</span>
            <div className="cmd-recent-tags">
              {recentSearches.map(term => (
                <button
                  key={term}
                  type="button"
                  className="cmd-recent-pill"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </button>
              ))}
              <button
                type="button"
                className="cmd-recent-clear-link"
                onClick={clearRecentSearches}
                title="Clear recent searches"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Results Container */}
        <div className="cmd-results-container" ref={listRef}>
          {/* Favorites Empty State */}
          {selectedType === 'favorite' && results.length === 0 && (
            <div className="cmd-fav-empty-state">
              <div className="cfe-icon">⭐</div>
              <h4 className="cfe-heading">No Bookmarked Favorites Yet</h4>
              <p className="cfe-desc">
                Save your most important interview questions and core architecture topics by clicking the star icon (<span className="cfe-star">☆</span>) on any item in search or doc pages.
              </p>
              <div className="cfe-shortcuts-tip">
                Tip: Press <kbd>⌘D</kbd> or <kbd>Ctrl+D</kbd> while hovering over any result to quickly bookmark it!
              </div>
              <div className="cfe-suggestions-row">
                <span className="cfe-suggestions-label">Popular topics to save:</span>
                <div className="cfe-chips">
                  {['React Intro', 'Closures', 'Event Loop', 'Flexbox & Grid', 'Server Actions'].map(term => (
                    <button
                      key={term}
                      type="button"
                      className="cfe-chip"
                      onClick={() => {
                        setSelectedType('all');
                        setQuery(term);
                      }}
                    >
                      🔍 {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Default state: Quick Actions & Featured Tracks */}
          {isShowingDefaultRecommendations && (
            <div className="cmd-empty-state-suggestions">
              <div className="cmd-section-header">
                <span className="cmd-section-title">⚡ Quick Actions &amp; Studios</span>
                <span className="cmd-section-count">{QUICK_ACTIONS.length} shortcuts</span>
              </div>
              <div className="cmd-items-group">
                {QUICK_ACTIONS.map((action, idx) => (
                  <div
                    key={action.id}
                    ref={el => { itemRefs.current[idx] = el; }}
                    className={`cmd-result-item cmd-action-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleSelect(action)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="cmd-item-icon-wrap action-glow">
                      <span className="cmd-item-icon">{action.icon || '⚡'}</span>
                    </div>
                    <div className="cmd-item-main">
                      <div className="cmd-item-topline">
                        <span className="cmd-badge cmd-badge-action">{action.badge}</span>
                        <span className="cmd-title">{action.title}</span>
                      </div>
                      <p className="cmd-snippet">{action.snippet}</p>
                    </div>
                    <div className="cmd-item-right">
                      <kbd className="cmd-enter-kbd">↵</kbd>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cmd-section-header" style={{ marginTop: '20px' }}>
                <span className="cmd-section-title">🌐 Popular Tracks (Instant Jump)</span>
                <span className="cmd-section-count">21 Available</span>
              </div>
              <div className="cmd-tracks-quick-grid">
                {featuredTracks.map(track => (
                  <button
                    key={track.id}
                    type="button"
                    className="cmd-track-quick-btn"
                    onClick={() => {
                      handleClose();
                      navigate(`/docs/${track.id}`);
                    }}
                  >
                    <span className="ctq-icon">{track.icon}</span>
                    <span className="ctq-title">{track.title}</span>
                    <span className="ctq-badge">{track.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Active Search Results or Favorites */}
          {!isShowingDefaultRecommendations && selectedType !== 'favorite' && results.length === 0 && (
            <div className="cmd-no-results">
              <div className="cnr-icon">🔍</div>
              <h4 className="cnr-heading">No matching results found</h4>
              <p className="cnr-desc">
                We could not find anything matching &ldquo;<strong>{query}</strong>&rdquo;
                {selectedType !== 'all' ? ` in category "${selectedType}"` : ''}
                {selectedSubjectId !== 'all' ? ` for track "${selectedSubjectId}"` : ''}.
              </p>
              <div className="cnr-suggestions">
                <span className="cnr-suggestions-label">Try searching for:</span>
                <div className="cnr-suggestion-chips">
                  {['React', 'Closures', 'Flexbox', 'Ollama', 'Next.js', 'Event Loop', 'TypeScript', 'INP'].map(s => (
                    <button
                      key={s}
                      type="button"
                      className="cnr-chip-btn"
                      onClick={() => {
                        setQuery(s);
                        setSelectedType('all');
                        setSelectedSubjectId('all');
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div className="cmd-items-group">
              {results.map((item, idx) => {
                const isQuestion = item.type === 'question';
                const isSubject = item.type === 'subject';
                const isAction = item.type === 'action';
                const canBookmark = item.type === 'topic' || item.type === 'question';

                let badgeClass = 'cmd-badge-doc';
                if (isSubject) badgeClass = 'cmd-badge-track';
                else if (isAction) badgeClass = 'cmd-badge-action';
                else if (isQuestion) {
                  const diff = item.badge?.toLowerCase();
                  if (diff === 'easy') badgeClass = 'cmd-badge-easy';
                  else if (diff === 'hard') badgeClass = 'cmd-badge-hard';
                  else badgeClass = 'cmd-badge-medium';
                }

                return (
                  <div
                    key={item.id}
                    ref={el => { itemRefs.current[idx] = el; }}
                    className={`cmd-result-item ${idx === selectedIndex ? 'selected' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className={`cmd-item-icon-wrap ${isAction ? 'action-glow' : ''}`}>
                      <span className="cmd-item-icon">{item.icon || (isQuestion ? '❓' : isSubject ? '🌐' : '📄')}</span>
                    </div>
                    <div className="cmd-item-main">
                      <div className="cmd-item-topline">
                        <span className={`cmd-badge ${badgeClass}`}>
                          {item.badge || item.type.toUpperCase()}
                        </span>
                        {item.isBookmarked && (
                          <span className="cmd-badge cmd-badge-saved">
                            ★ SAVED
                          </span>
                        )}
                        {item.subjectTitle && (
                          <span className="cmd-subject-crumb">
                            {item.subjectTitle}
                          </span>
                        )}
                        <span className="cmd-title">
                          {renderHighlighted(item.title, query)}
                        </span>
                      </div>
                      <p className="cmd-snippet">
                        {renderHighlighted(item.snippet.slice(0, 160), query)}
                        {item.snippet.length > 160 ? '...' : ''}
                      </p>
                    </div>

                    <div className="cmd-item-right">
                      {canBookmark && (
                        <button
                          type="button"
                          className={`cmd-item-fav-btn ${item.isBookmarked ? 'bookmarked' : ''}`}
                          onClick={(e) => handleToggleItemBookmark(e, item)}
                          title={item.isBookmarked ? 'Remove from favorites (Cmd+D)' : 'Add to favorites (Cmd+D)'}
                          aria-label={item.isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {item.isBookmarked ? '★' : '☆'}
                        </button>
                      )}
                      <kbd className="cmd-enter-kbd">↵</kbd>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Keyboard Hints & Count */}
        <div className="cmd-footer">
          <div className="cmd-footer-hints">
            <span className="cmd-hint"><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
            <span className="cmd-hint"><kbd>↵ Enter</kbd> Open</span>
            <span className="cmd-hint"><kbd>⌘D</kbd> Save / Star</span>
            <span className="cmd-hint"><kbd>Tab</kbd> Filter</span>
            <span className="cmd-hint"><kbd>Esc</kbd> Close</span>
          </div>
          <div className="cmd-footer-meta">
            {results.length > 0 ? (
              <span className="cmd-meta-count">{results.length} results</span>
            ) : selectedType === 'favorite' ? (
              <span className="cmd-meta-count">{favoritesCount} bookmarked items</span>
            ) : (
              <span className="cmd-meta-count">21 Tracks • 700+ Topics • 200+ Questions</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
