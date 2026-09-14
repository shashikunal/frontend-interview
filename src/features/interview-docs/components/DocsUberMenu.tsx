import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubjectId, SubjectMetadata } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';
import { docsProgressService } from '../services/docsProgressService';

interface DocsUberMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubjectId?: SubjectId;
}

export function DocsUberMenu({ isOpen, onClose, currentSubjectId }: DocsUberMenuProps) {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const userProgress = docsProgressService.getProgress();

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setFilterText('');
      setSelectedCategory('All');
    }
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All'];
    ALL_SUBJECTS_CATALOG.forEach(s => {
      if (!cats.includes(s.category)) {
        cats.push(s.category);
      }
    });
    return cats;
  }, []);

  // Filter subjects based on search text and category
  const filteredSubjects = useMemo(() => {
    const q = filterText.toLowerCase().trim();
    return ALL_SUBJECTS_CATALOG.filter(s => {
      const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
      const matchesQuery = !q || (
        s.title.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q))
      );
      return matchesCategory && matchesQuery;
    });
  }, [filterText, selectedCategory]);

  const handleSelectTrack = (subject: SubjectMetadata) => {
    const topics = TOPICS_BY_SUBJECT[subject.id] || [];
    const firstTopic = topics[0];
    onClose();
    if (firstTopic) {
      navigate(`/docs/${subject.id}/${firstTopic.id}`);
    } else {
      navigate(`/docs/${subject.id}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="docs-ubermenu-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Learning Tracks Directory">
      <div className="docs-ubermenu-modal" onClick={e => e.stopPropagation()}>
        {/* Ubermenu Header */}
        <div className="ubermenu-header">
          <div className="ubermenu-header-left">
            <div className="ubermenu-badge">🌐 ALL 21 TRACKS • 708 TOPICS</div>
            <h2 className="ubermenu-title">Frontend Engineering Curriculum Directory</h2>
            <p className="ubermenu-subtitle">
              Jump to any comprehensive learning track with production code snippets, deep-dive architectures, and interview Q&amp;A.
            </p>
          </div>
          <button
            type="button"
            className="ubermenu-close-btn"
            onClick={onClose}
            title="Close Ubermenu (Esc)"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Ubermenu Search & Filter Bar */}
        <div className="ubermenu-filter-bar">
          <div className="ubermenu-search-box">
            <span className="usb-icon">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              className="usb-input"
              placeholder="Search 21 tracks (e.g. React, TypeScript, Performance, CSS, Next.js)..."
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
            />
            {filterText && (
              <button
                type="button"
                className="usb-clear-btn"
                onClick={() => setFilterText('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="ubermenu-category-pills">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`ubermenu-cat-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                {cat === 'All' ? ` (${ALL_SUBJECTS_CATALOG.length})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Tracks Grid */}
        <div className="ubermenu-grid">
          {filteredSubjects.map(subject => {
            const topics = TOPICS_BY_SUBJECT[subject.id] || [];
            const isCurrent = subject.id === currentSubjectId;
            const progress = userProgress.subjectProgress[subject.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
            const progressPercent = Math.min(100, Math.round((progress.topicsRead / Math.max(1, subject.totalTopicsCount)) * 100));

            return (
              <div
                key={subject.id}
                className={`ubermenu-card ${isCurrent ? 'current-active' : ''}`}
                onClick={() => handleSelectTrack(subject)}
              >
                <div className="uc-top">
                  <div className="uc-icon-wrap">
                    <span className="uc-icon">{subject.icon}</span>
                  </div>
                  <div className="uc-badges">
                    <span className="uc-category-badge">{subject.category}</span>
                    <span className="uc-badge">{subject.badge}</span>
                  </div>
                </div>

                <h4 className="uc-title">
                  {subject.title}
                  {isCurrent && <span className="uc-active-dot" title="Current Active Track">● ACTIVE</span>}
                </h4>

                <p className="uc-tagline">{subject.tagline}</p>

                <div className="uc-meta-row">
                  <span className="uc-modules-count">
                    <strong>{topics.length}</strong> Modules
                  </span>
                  <span className="uc-dot">•</span>
                  <span className="uc-hours">~{subject.estimatedHours} hrs</span>
                  <span className="uc-dot">•</span>
                  <span className="uc-progress-label">{progressPercent}% done</span>
                </div>

                <div className="uc-progress-bar">
                  <div className="uc-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                <div className="uc-tags">
                  {subject.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="uc-tag">{tag}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubjects.length === 0 && (
          <div className="ubermenu-empty">
            <span className="ue-icon">🔎</span>
            <h4>No tracks matching "{filterText}"</h4>
            <p>Try searching for "React", "State", "CSS", "Performance", or select "All" categories.</p>
          </div>
        )}

        {/* Ubermenu Footer */}
        <div className="ubermenu-footer">
          <span className="uf-info">
            Tip: Press <kbd>Esc</kbd> to close • Click any track to jump directly to its complete curriculum
          </span>
          <button
            type="button"
            className="uf-all-tracks-btn"
            onClick={() => {
              onClose();
              navigate('/docs');
            }}
          >
            Open Full Tracks Landing Page →
          </button>
        </div>
      </div>
    </div>
  );
}
