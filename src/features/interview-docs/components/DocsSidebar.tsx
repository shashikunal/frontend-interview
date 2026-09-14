import React, { useState, useMemo, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { SubjectId, TopicMetadata, SubtopicMetadata } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';
import { docsSearchService, type SearchResultItem } from '../services/docsSearchService';
import { docsProgressService } from '../services/docsProgressService';

interface DocsSidebarProps {
  currentSubjectId?: SubjectId;
  currentTopicId?: string;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenSearchModal?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface TreeItem {
  id: string;
  type: 'topic' | 'subtopic';
  topic: TopicMetadata;
  subtopic?: SubtopicMetadata;
  level: number;
  isExpanded: boolean;
  isActive: boolean;
  isCompleted: boolean;
  topicNumber: string;
  isLastSubtopic?: boolean;
}

export function DocsSidebar({
  currentSubjectId,
  currentTopicId,
  isOpenMobile = false,
  onCloseMobile,
  onOpenSearchModal,
  isCollapsed = false,
  onToggleCollapse,
}: DocsSidebarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [topicFilter, setTopicFilter] = useState('');
  const [expandedTopicIds, setExpandedTopicIds] = useState<Set<string>>(new Set());
  const [sidebarTab, setSidebarTab] = useState<'currentTrack' | 'allTracks'>('currentTrack');
  const [viewMode, setViewMode] = useState<'tree' | 'compact'>('tree');
  const [isWideSidebar, setIsWideSidebar] = useState(() => {
    try {
      return localStorage.getItem('docs_sidebar_wide') === 'true';
    } catch {
      return false;
    }
  });

  const toggleWideSidebar = () => {
    setIsWideSidebar(prev => {
      const next = !prev;
      try {
        localStorage.setItem('docs_sidebar_wide', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const userProgress = docsProgressService.getProgress();

  const currentSubject = currentSubjectId ? ALL_SUBJECTS_CATALOG.find(s => s.id === currentSubjectId) : null;
  const currentSubjectTopics = useMemo(() => {
    return currentSubject ? (TOPICS_BY_SUBJECT[currentSubject.id] || []) : [];
  }, [currentSubject]);

  // Keep active topic expanded by default in tree view
  useEffect(() => {
    if (currentTopicId) {
      setExpandedTopicIds(prev => {
        if (!prev.has(currentTopicId)) {
          const next = new Set(prev);
          next.add(currentTopicId);
          return next;
        }
        return prev;
      });
    }
  }, [currentTopicId]);

  // Client-side instant filter across all topics & subtopics
  const filteredTopics = useMemo(() => {
    if (!topicFilter.trim()) return currentSubjectTopics;
    const q = topicFilter.toLowerCase().trim();
    return currentSubjectTopics.filter(t => {
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.subtopics.some(s => s.title.toLowerCase().includes(q))
      );
    });
  }, [currentSubjectTopics, topicFilter]);

  // Toggle individual topic tree node
  const toggleTopicExpand = (topicId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedTopicIds(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  // Expand all tree nodes
  const handleExpandAll = () => {
    const allIds = new Set(currentSubjectTopics.map(t => t.id));
    setExpandedTopicIds(allIds);
  };

  // Collapse all tree nodes
  const handleCollapseAll = () => {
    setExpandedTopicIds(new Set());
  };

  // Build flattened tree items array for virtualizer
  const flattenedTreeItems = useMemo<TreeItem[]>(() => {
    const items: TreeItem[] = [];

    if (viewMode === 'compact') {
      // Dense mode: show all topics cleanly in compact rows for immediate scanning
      filteredTopics.forEach((topic, index) => {
        const isCompleted = userProgress.completedTopics.includes(`${topic.subjectId}:${topic.id}`);
        const topicNum = String(topic.order || index + 1).padStart(2, '0');
        items.push({
          id: topic.id,
          type: 'topic',
          topic,
          level: 0,
          isExpanded: false,
          isActive: topic.id === currentTopicId,
          isCompleted,
          topicNumber: topicNum,
        });
      });
    } else {
      // Tree mode: show topic nodes with interactive subtopic branches
      filteredTopics.forEach((topic, index) => {
        const isExpanded = expandedTopicIds.has(topic.id) || (Boolean(topicFilter.trim()));
        const isCompleted = userProgress.completedTopics.includes(`${topic.subjectId}:${topic.id}`);
        const topicNum = String(topic.order || index + 1).padStart(2, '0');

        items.push({
          id: topic.id,
          type: 'topic',
          topic,
          level: 0,
          isExpanded,
          isActive: topic.id === currentTopicId,
          isCompleted,
          topicNumber: topicNum,
        });

        if (isExpanded && topic.subtopics && topic.subtopics.length > 0) {
          topic.subtopics.forEach((sub, sIdx) => {
            items.push({
              id: `${topic.id}__${sub.id}`,
              type: 'subtopic',
              topic,
              subtopic: sub,
              level: 1,
              isExpanded: false,
              isActive: false,
              isCompleted: false,
              topicNumber: topicNum,
              isLastSubtopic: sIdx === topic.subtopics.length - 1,
            });
          });
        }
      });
    }
    return items;
  }, [filteredTopics, expandedTopicIds, currentTopicId, topicFilter, userProgress.completedTopics, viewMode]);

  // Virtualizer for smooth, high-performance rendering of tree items
  const parentScrollRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: flattenedTreeItems.length,
    getScrollElement: () => parentScrollRef.current,
    estimateSize: (index) => {
      const item = flattenedTreeItems[index];
      if (viewMode === 'compact') return 36;
      return item?.type === 'topic' ? 42 : 30;
    },
    overscan: 12,
  });

  // Auto-scroll active topic into view when mounted or updated
  useEffect(() => {
    if (currentTopicId && rowVirtualizer && flattenedTreeItems.length > 0) {
      const activeIndex = flattenedTreeItems.findIndex(item => item.id === currentTopicId);
      if (activeIndex >= 0) {
        try {
          rowVirtualizer.scrollToIndex(activeIndex, { align: 'auto' });
        } catch {
          // ignore virtualizer not ready
        }
      }
    }
  }, [currentTopicId, viewMode]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 1) {
      setSearchResults(docsSearchService.search(q, 8));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setSearchQuery('');
    setSearchResults([]);
    if (onCloseMobile) onCloseMobile();
    navigate(item.url);
  };

  return (
    <aside
      className={`docs-sidebar ${isCollapsed ? 'collapsed' : ''} ${isWideSidebar ? 'wide-sidebar' : ''} ${isOpenMobile ? 'mobile-open' : ''}`}
      aria-label="Documentation Navigation"
    >
      {/* Root Menu Navigation & Controls Header Bar */}
      <div className="sidebar-root-hub-bar">
        <button
          type="button"
          className="srh-root-btn"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            navigate('/docs');
          }}
          title="Jump to 21 Tracks Root Menu Hub (/docs)"
        >
          <span className="srh-icon">🏠</span>
          <span className="srh-title">Root Menu</span>
          <span className="srh-pill">21 Tracks</span>
        </button>

        <div className="srh-right-controls">
          <button
            type="button"
            className={`srh-tool-btn ${isWideSidebar ? 'active' : ''}`}
            onClick={toggleWideSidebar}
            title={isWideSidebar ? "Reset to Standard Width (290px)" : "Expand Sidebar Width (375px)"}
            aria-label="Toggle Sidebar Width"
          >
            ↔
          </button>
          {onToggleCollapse && (
            <button
              type="button"
              className="srh-tool-btn"
              onClick={onToggleCollapse}
              title="Hide Sidebar (Ctrl+B)"
              aria-label="Hide Sidebar"
            >
              ◀
            </button>
          )}
        </div>
      </div>

      {/* Global Quick Search Header */}
      <div className="docs-sidebar-search-wrap">
        <div className="docs-search-input-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="docs-search-input"
            placeholder="Search tracks & docs... (⌘K)"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {onOpenSearchModal && (
            <span
              className="sidebar-search-kbd"
              onClick={onOpenSearchModal}
              title="Open Global Search Modal (⌘K)"
              style={{ cursor: 'pointer' }}
            >
              ⌘K
            </span>
          )}
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="docs-search-dropdown-results">
            <div className="search-dropdown-header">
              <span>{searchResults.length} matches found</span>
            </div>
            {searchResults.map(item => (
              <div
                key={item.id}
                className="search-dropdown-item"
                onClick={() => handleSelectSearchResult(item)}
              >
                <div className="sdi-top">
                  <span className={`sdi-type-pill pill-${item.type}`}>{item.type.toUpperCase()}</span>
                  <span className="sdi-subject">{item.subjectTitle}</span>
                </div>
                <h5 className="sdi-title">{item.title}</h5>
                <p className="sdi-snippet">{item.snippet.slice(0, 95)}...</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Segmented View Switcher when inside a track: Current Track vs All Tracks Directory */}
      {currentSubject && (
        <div className="sidebar-nav-tab-strip">
          <button
            type="button"
            className={`snts-tab ${sidebarTab === 'currentTrack' ? 'active' : ''}`}
            onClick={() => setSidebarTab('currentTrack')}
          >
            <span className="snts-icon">{currentSubject.icon}</span>
            <span className="snts-label">{currentSubject.title}</span>
          </button>
          <button
            type="button"
            className={`snts-tab ${sidebarTab === 'allTracks' ? 'active' : ''}`}
            onClick={() => setSidebarTab('allTracks')}
            title="Browse all 21 tracks directly in sidebar"
          >
            <span className="snts-icon">🌐</span>
            <span className="snts-label">All Tracks</span>
            <span className="snts-count">21</span>
          </button>
        </div>
      )}

      {/* Main Sidebar Body */}
      {currentSubject && sidebarTab === 'currentTrack' ? (
        <div className="docs-active-track-sidebar">
          {/* In-Track Instant Search Filter & Smart View Modes */}
          <div className="sidebar-track-header-box">
            <div className="sidebar-topic-filter-box">
              <span className="stf-icon">⚡</span>
              <input
                type="text"
                className="sidebar-topic-filter-input"
                placeholder={`Filter ${currentSubjectTopics.length} topics...`}
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
              />
              {topicFilter && (
                <button
                  type="button"
                  className="clear-topic-filter-btn"
                  onClick={() => setTopicFilter('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Smart Visibility Controls: Tree vs Compact Dense Mode */}
            <div className="sidebar-smart-view-bar">
              <div className="ssvb-density-group">
                <button
                  type="button"
                  className={`ssvb-btn ${viewMode === 'tree' ? 'active' : ''}`}
                  onClick={() => setViewMode('tree')}
                  title="Tree View with subtopics & branches"
                >
                  🌳 Tree
                </button>
                <button
                  type="button"
                  className={`ssvb-btn ${viewMode === 'compact' ? 'active' : ''}`}
                  onClick={() => setViewMode('compact')}
                  title="Compact Dense View: view all topics at once without scrolling"
                >
                  📋 Dense ({filteredTopics.length})
                </button>
              </div>

              {viewMode === 'tree' ? (
                <div className="ssvb-actions-group">
                  <button
                    type="button"
                    className="ssvb-action-btn"
                    onClick={handleExpandAll}
                    title="Expand all topic trees"
                  >
                    ⊞ All
                  </button>
                  <button
                    type="button"
                    className="ssvb-action-btn"
                    onClick={handleCollapseAll}
                    title="Collapse all subtopics"
                  >
                    ⊟ None
                  </button>
                </div>
              ) : (
                <span className="ssvb-info-text">All {filteredTopics.length} visible</span>
              )}
            </div>
          </div>

          {/* Virtualized Topic & Subtopic Tree Structure */}
          <div
            ref={parentScrollRef}
            className={`docs-virtualized-tree-container mode-${viewMode}`}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const item = flattenedTreeItems[virtualRow.index];
                if (!item) return null;

                if (item.type === 'topic') {
                  const hasSubtopics = viewMode === 'tree' && item.topic.subtopics && item.topic.subtopics.length > 0;
                  return (
                    <div
                      key={item.id}
                      className={`tree-virtual-row tree-topic-row ${item.isActive ? 'is-active' : ''} ${viewMode === 'compact' ? 'is-compact' : ''}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        transform: `translateY(${virtualRow.start}px)`,
                        height: `${virtualRow.size}px`,
                      }}
                    >
                      <div className="tree-topic-item-inner">
                        {/* Tree Chevron Toggle (only shown in Tree Mode when subtopics exist) */}
                        {viewMode === 'tree' && (
                          hasSubtopics ? (
                            <button
                              type="button"
                              className={`tree-chevron-btn ${item.isExpanded ? 'expanded' : ''}`}
                              onClick={(e) => toggleTopicExpand(item.id, e)}
                              title={item.isExpanded ? 'Collapse subtopics' : 'Expand subtopics'}
                              aria-label="Toggle subtopics"
                            >
                              {item.isExpanded ? '▾' : '▸'}
                            </button>
                          ) : (
                            <span className="tree-leaf-spacer">•</span>
                          )
                        )}

                        {/* Topic Link */}
                        <NavLink
                          to={`/docs/${item.topic.subjectId}/${item.topic.id}`}
                          className={({ isActive }) => `tree-topic-link ${isActive ? 'active' : ''}`}
                          onClick={() => {
                            if (onCloseMobile) onCloseMobile();
                          }}
                          title={`${item.topic.title} - ${item.topic.description}`}
                        >
                          <span className="topic-number">{item.topicNumber}</span>
                          <span className="topic-title-text">{item.topic.title}</span>
                          {item.isCompleted && (
                            <span className="topic-status-check completed" title="Completed">
                              ✓
                            </span>
                          )}
                        </NavLink>
                      </div>
                    </div>
                  );
                }

                // Subtopic Leaf Node (Level 1)
                const sub = item.subtopic!;
                return (
                  <div
                    key={item.id}
                    className="tree-virtual-row tree-subtopic-row"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      height: `${virtualRow.size}px`,
                    }}
                  >
                    <a
                      href={`#${sub.id}`}
                      className="tree-subtopic-link"
                      onClick={(e) => {
                        const target =
                          document.getElementById(sub.id) ||
                          document.getElementById(sub.conceptId) ||
                          document.getElementById('overview-section');
                        if (target) {
                          e.preventDefault();
                          target.scrollIntoView({ behavior: 'smooth' });
                          window.history.pushState(null, '', `#${sub.id}`);
                        }
                        if (onCloseMobile) onCloseMobile();
                      }}
                      title={sub.title}
                    >
                      <span className="tree-branch-line">
                        {item.isLastSubtopic ? '└──' : '├──'}
                      </span>
                      <span className="tree-subtopic-dot">📄</span>
                      <span className="tree-subtopic-text">{sub.title}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Smart Bottom Status & Jump to Top Bar */}
          <div className="sidebar-bottom-bar">
            <span className="sbb-count">
              {filteredTopics.length} of {currentSubjectTopics.length} topics visible
            </span>
            <button
              type="button"
              className="sbb-top-btn"
              onClick={() => parentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
              title="Jump to Top"
            >
              ▲ Top
            </button>
          </div>
        </div>
      ) : (
        /* Root Menu / 21 Subjects Directory (When on /docs root or when All Tracks tab selected) */
        <div className="docs-subjects-accordion-list">
          <div className="accordion-heading-row">
            <span className="accordion-section-title">21 LEARNING TRACKS DIRECTORY</span>
            <div className="ahr-right" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="tracks-count-badge">708 Topics</span>
            </div>
          </div>

          {ALL_SUBJECTS_CATALOG.map(subject => {
            const topics = TOPICS_BY_SUBJECT[subject.id] || [];
            const firstTopic = topics[0];
            const progressInfo = userProgress.subjectProgress[subject.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
            const progressPercent = Math.min(100, Math.round((progressInfo.topicsRead / Math.max(1, subject.totalTopicsCount)) * 100));
            const isCurrent = subject.id === currentSubjectId;

            return (
              <div key={subject.id} className={`docs-accordion-subject-item ${isCurrent ? 'is-active-subject' : ''}`}>
                <div
                  className="subject-header-row"
                  onClick={() => {
                    if (onCloseMobile) onCloseMobile();
                    setSidebarTab('currentTrack');
                    navigate(`/docs/${subject.id}/${firstTopic?.id || ''}`);
                  }}
                >
                  <div className="subject-header-left">
                    <span className="subject-icon">{subject.icon}</span>
                    <div className="subject-title-box">
                      <span className="subject-title">
                        {subject.title}
                        {isCurrent && <span className="subject-active-tag">ACTIVE</span>}
                      </span>
                      <div className="subject-micro-bar">
                        <div className="micro-fill" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="subject-header-right">
                    <span className="subject-topic-count">{topics.length}</span>
                    <span className="subject-caret">→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
