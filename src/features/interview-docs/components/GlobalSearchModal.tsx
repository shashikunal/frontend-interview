import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { docsSearchService, type SearchResultItem } from '../services/docsSearchService';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'subject' | 'topic' | 'question'>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Execute search
  useEffect(() => {
    if (query.trim().length > 1) {
      let res = docsSearchService.search(query, 20);

      if (selectedType !== 'all') {
        res = res.filter(r => r.type === selectedType);
      }

      if (selectedTag !== 'all') {
        res = res.filter(r => r.subjectId === selectedTag || (r.tags || []).includes(selectedTag));
      }

      setResults(res);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, selectedType, selectedTag]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1 < results.length ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.url);
  };

  // Helper to highlight matching keyword
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="search-highlight-mark">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="global-search-modal-backdrop" onClick={onClose}>
      <div
        className="global-search-dialog"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="gsm-input-header">
          <span className="gsm-search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="gsm-input"
            placeholder="Search all 21 tracks, documentation, code & questions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="gsm-clear-btn"
              onClick={() => setQuery('')}
            >
              ✕
            </button>
          )}
          <span className="gsm-kbd-esc" onClick={onClose}>ESC</span>
        </div>

        {/* Filter Chips Bar */}
        <div className="gsm-filter-chips-row">
          <div className="gsm-type-pills">
            <button
              type="button"
              className={`gsm-chip ${selectedType === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedType('all')}
            >
              All Types
            </button>
            <button
              type="button"
              className={`gsm-chip ${selectedType === 'topic' ? 'active' : ''}`}
              onClick={() => setSelectedType('topic')}
            >
              Docs &amp; Topics
            </button>
            <button
              type="button"
              className={`gsm-chip ${selectedType === 'question' ? 'active' : ''}`}
              onClick={() => setSelectedType('question')}
            >
              Interview Questions
            </button>
          </div>

          <div className="gsm-track-filter">
            <select
              className="gsm-track-select"
              value={selectedTag}
              onChange={e => setSelectedTag(e.target.value)}
            >
              <option value="all">All Tracks</option>
              {ALL_SUBJECTS_CATALOG.map(s => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results View */}
        <div className="gsm-results-list">
          {query.trim().length > 1 && results.length === 0 && (
            <div className="gsm-no-results">
              <span className="no-res-icon">🔍</span>
              <p>No matching topics, code, or interview questions found for &ldquo;<strong>{query}</strong>&rdquo;.</p>
              <span className="no-res-hint">Try searching for concepts like <em>Closures</em>, <em>INP</em>, <em>Module Federation</em>, or <em>Loaders</em>.</span>
            </div>
          )}

          {results.map((item, idx) => (
            <div
              key={item.id}
              className={`gsm-result-item ${idx === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSelect(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <div className="gri-left">
                <div className="gri-badge-row">
                  <span className={`gri-type-pill pill-${item.type}`}>
                    {item.type.toUpperCase()}
                  </span>
                  <span className="gri-subject">{item.subjectTitle}</span>
                </div>
                <h4 className="gri-title">{renderHighlighted(item.title, query)}</h4>
                <p className="gri-snippet">{renderHighlighted(item.snippet.slice(0, 140), query)}...</p>
              </div>
              <div className="gri-right">
                <span className="gri-arrow">↵</span>
              </div>
            </div>
          ))}

          {query.trim().length <= 1 && (
            <div className="gsm-popular-searches">
              <span className="ps-label">⚡ Popular Topics &amp; Questions:</span>
              <div className="ps-tags-cloud">
                {['Closures', 'Event Loop', 'Server Actions', 'RSC', 'RTK Query', 'CORS', 'INP', 'Module Federation', 'Discriminative Unions', 'CustomEvent'].map(term => (
                  <button
                    key={term}
                    type="button"
                    className="ps-tag-btn"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Key Hints */}
        <div className="gsm-footer">
          <span className="gsm-hint">Navigate: <kbd>↑</kbd> <kbd>↓</kbd></span>
          <span className="gsm-hint">Select: <kbd>↵ Enter</kbd></span>
          <span className="gsm-hint">Close: <kbd>Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
