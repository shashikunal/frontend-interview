import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { SubjectId } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from '../data/subjectsCatalog';
import { docsProgressService } from '../services/docsProgressService';

export function DocsTracksLanding() {
  const { subjectId } = useParams<{ subjectId?: SubjectId }>();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const userProgress = docsProgressService.getProgress();

  const categories = ['ALL', 'Core Web', 'Languages', 'React Ecosystem', 'Architecture & Fullstack', 'Networking & APIs', 'Performance & Tooling'];

  const filteredSubjects = useMemo(() => {
    if (subjectId) {
      return ALL_SUBJECTS_CATALOG.filter(s => s.id === subjectId);
    }
    if (activeCategory === 'ALL') return ALL_SUBJECTS_CATALOG;
    return ALL_SUBJECTS_CATALOG.filter(s => s.category === activeCategory);
  }, [subjectId, activeCategory]);

  return (
    <div className="docs-landing-container">
      {/* Hero Header */}
      <div className="docs-landing-hero">
        <div className="dl-badge">🎓 FRONTEND INTERVIEW UNIVERSITY</div>
        <h1 className="dl-title">Master Frontend Technical Interviews</h1>
        <p className="dl-subtitle">
          21 curated technical learning tracks combining MDN-grade technical depth, embedded interactive video walkthroughs, and LeetCode-style interview problem banks.
        </p>

        {/* Category Filter Tabs */}
        {!subjectId && (
          <div className="category-filter-chips">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                className={`cat-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 21 Tracks Grid */}
      <div className="tracks-landing-grid">
        {filteredSubjects.map(subject => {
          const topics = TOPICS_BY_SUBJECT[subject.id] || [];
          const progress = userProgress.subjectProgress[subject.id] || { topicsRead: 0, questionsPracticed: 0, masteredCount: 0 };
          const firstTopic = topics[0];

          return (
            <div key={subject.id} className="subject-track-card">
              <Link to={`/docs/${subject.id}/${firstTopic?.id || ''}`} className="stc-header-link">
                <div className="stc-top">
                  <span className="stc-icon">{subject.icon}</span>
                  <span className="stc-badge">{subject.badge}</span>
                </div>
                <h3 className="stc-title">{subject.title}</h3>
              </Link>
              <p className="stc-tagline">{subject.tagline}</p>

              {/* Topics preview list */}
              <div className="stc-topics-box">
                <span className="stc-topics-label">Core Modules:</span>
                <ul className="stc-topics-list">
                  {topics.slice(0, 4).map(t => (
                    <li key={t.id}>
                      <Link to={`/docs/${subject.id}/${t.id}`} className="stc-topic-link">
                        <span>•</span> {t.title}
                      </Link>
                    </li>
                  ))}
                  {topics.length > 4 && (
                    <li className="stc-more-topics">+ {topics.length - 4} more technical modules</li>
                  )}
                </ul>
              </div>

              {/* Card Footer */}
              <div className="stc-footer">
                <div className="stc-meta">
                  <span>⏱️ ~{subject.estimatedHours} Hours</span>
                  <span>📖 {progress.topicsRead}/{topics.length} Read</span>
                </div>
                {firstTopic ? (
                  <Link to={`/docs/${subject.id}/${firstTopic.id}`} className="stc-start-btn">
                    Start Track →
                  </Link>
                ) : (
                  <span className="stc-coming-soon">Modules in Prep</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
