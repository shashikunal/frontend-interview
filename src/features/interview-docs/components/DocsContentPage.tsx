import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { SubjectId } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { getDocPage } from '../data/docsRegistry';
import { docsProgressService } from '../services/docsProgressService';
import { BreadcrumbNav } from './common/BreadcrumbNav';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';
import { DocsVideoPlayer } from './DocsVideoPlayer';
import { DocsQuestionsVirtualizer } from './DocsQuestionsVirtualizer';
import { DocsTableOfContents } from './DocsTableOfContents';

export function DocsContentPage() {
  const { subjectId, topicId } = useParams<{ subjectId: SubjectId; topicId: string }>();

  const subject = useMemo(() => {
    return ALL_SUBJECTS_CATALOG.find(s => s.id === subjectId);
  }, [subjectId]);

  const doc = useMemo(() => {
    if (!subjectId || !topicId) return undefined;
    return getDocPage(subjectId, topicId);
  }, [subjectId, topicId]);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (subjectId && topicId) {
      docsProgressService.recordTopicVisit(subjectId, topicId);
      const userProgress = docsProgressService.getProgress();
      setIsBookmarked(userProgress.bookmarkedDocs.includes(`${subjectId}:${topicId}`));
      setIsCompleted(docsProgressService.isTopicCompleted(subjectId, topicId));

      // If URL has hash, scroll to heading, otherwise scroll to top
      if (window.location.hash) {
        const targetId = window.location.hash.replace('#', '');
        setTimeout(() => {
          const targetEl = document.getElementById(targetId);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [subjectId, topicId]);

  // Esc key exits focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFocusMode) {
        setIsFocusMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusMode]);

  const handleToggleDocBookmark = () => {
    if (subjectId && topicId) {
      const result = docsProgressService.toggleDocBookmark(subjectId, topicId);
      setIsBookmarked(result);
    }
  };

  const handleToggleCompleted = () => {
    if (subjectId && topicId) {
      const result = docsProgressService.toggleTopicCompleted(subjectId, topicId);
      setIsCompleted(result);
    }
  };

  if (!subject || !doc) {
    return (
      <div className="docs-not-found-container">
        <span className="dnf-icon">📖</span>
        <h2>Topic Documentation In Preparation</h2>
        <p>The technical documentation for this module is currently undergoing schema verification.</p>
        <Link to={`/docs/${subjectId || 'html'}`} className="docs-back-btn">
          ← Return to {subject?.title || 'Subjects Catalog'}
        </Link>
      </div>
    );
  }

  // Generate Table of Contents items
  const tocItems = [
    { id: 'overview-section', label: 'Overview' },
    { id: 'why-matters-section', label: 'Why It Matters' },
    { id: 'how-it-works-section', label: 'How It Works' },
    ...(doc.syntaxReference ? [{ id: 'syntax-section', label: 'Syntax & Specification' }] : []),
    ...doc.sections.map(s => ({ id: s.id, label: s.heading })),
    { id: 'video-explanation', label: 'Video Walkthrough' },
    { id: 'interview-questions-section', label: `Questions (${doc.questions.length})` },
  ];

  return (
    <div className={`docs-page-layout ${isFocusMode ? 'focus-mode-active' : ''}`}>
      <div className="docs-article-container">
        {/* Focus Mode Sticky Banner */}
        {isFocusMode && (
          <div className="docs-focus-mode-indicator-bar">
            <span className="dfm-text">🖥️ <strong>Focus Mode Active</strong> — Sidebar collapsed for immersive documentation reading</span>
            <button
              type="button"
              className="docs-exit-focus-pill"
              onClick={() => setIsFocusMode(false)}
              title="Exit Focus Mode (Esc)"
            >
              ✕ Exit Focus (Esc)
            </button>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <BreadcrumbNav
          items={[
            { label: subject.title, path: `/docs/${subject.id}` },
            { label: doc.title },
          ]}
        />

        {/* Title & Metadata Banner */}
        <header className="docs-article-header">
          <div className="docs-header-top-row">
            <div className="docs-header-badges">
              <span className="docs-category-pill">{subject.category.toUpperCase()}</span>
              <span className="docs-importance-pill">🔥 MUST KNOW</span>
              <span className="docs-depth-pill">DEPTH: SENIOR / ARCHITECT</span>
            </div>
            <div className="docs-header-controls">
              <button
                type="button"
                className={`docs-focus-mode-btn ${isFocusMode ? 'active' : ''}`}
                onClick={() => setIsFocusMode(prev => !prev)}
                title={isFocusMode ? 'Exit Focus Mode (Esc)' : 'Enter Focus Mode for distraction-free reading'}
              >
                {isFocusMode ? '✕ Exit Focus' : '🖥️ Focus Mode'}
              </button>
              <button
                type="button"
                className={`docs-complete-topic-btn ${isCompleted ? 'completed' : ''}`}
                onClick={handleToggleCompleted}
                title={isCompleted ? 'Mark topic as incomplete' : 'Mark topic complete to update learning path'}
              >
                {isCompleted ? '✓ Topic Completed' : '○ Mark Complete'}
              </button>
              <button
                type="button"
                className={`docs-bookmark-doc-btn ${isBookmarked ? 'active' : ''}`}
                onClick={handleToggleDocBookmark}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Document'}
              >
                {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
            </div>
          </div>
          <h1 className="docs-main-title">{doc.title}</h1>
          <p className="docs-description-lead">{doc.description}</p>
        </header>

        {/* Section: Overview */}
        <section id="overview-section" className="docs-content-section">
          <h2 className="section-title">Overview</h2>
          <SafeMarkdownViewer content={doc.overview} />
        </section>

        {/* Section: Why It Matters */}
        <section id="why-matters-section" className="docs-content-section">
          <h2 className="section-title">Why Does It Matter?</h2>
          <SafeMarkdownViewer content={doc.whyItMatters} />
        </section>

        {/* Section: How It Works */}
        <section id="how-it-works-section" className="docs-content-section">
          <h2 className="section-title">How It Works Under the Hood</h2>
          <SafeMarkdownViewer content={doc.howItWorks} />
        </section>

        {/* Section: Syntax Reference */}
        {doc.syntaxReference && (
          <section id="syntax-section" className="docs-content-section">
            <h2 className="section-title">Syntax &amp; Formal Reference</h2>
            <SafeMarkdownViewer content={`\`\`\`typescript\n${doc.syntaxReference}\n\`\`\``} />
          </section>
        )}

        {/* Dynamic Sections */}
        {doc.sections.map(section => (
          <section key={section.id} id={section.id} className="docs-content-section">
            <h2 className="section-title">{section.heading}</h2>
            <SafeMarkdownViewer content={section.content} />
            {section.codeSnippet && (
              <div className="section-code-wrap">
                <SafeMarkdownViewer
                  content={`\`\`\`${section.codeSnippet.language}\n${section.codeSnippet.code}\n\`\`\``}
                />
              </div>
            )}
          </section>
        ))}

        {/* Section: Common Mistakes */}
        {doc.commonMistakes && doc.commonMistakes.length > 0 && (
          <section className="docs-content-section pitfalls-section">
            <h2 className="section-title text-danger">⚠️ Common Production Mistakes &amp; Gotchas</h2>
            <ul className="docs-pitfalls-list">
              {doc.commonMistakes.map((mistake, mIdx) => (
                <li key={mIdx}>{mistake}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Section: Video Player */}
        <section className="docs-content-section">
          <h2 className="section-title">Video Walkthrough &amp; Explanation</h2>
          <DocsVideoPlayer
            video={doc.video}
            videoList={doc.videoList}
            topicTitle={doc.title}
            subjectTitle={subject.title}
          />
        </section>

        {/* Section: Interview Questions with TanStack Virtualizer */}
        <section id="interview-questions-section" className="docs-content-section questions-section">
          <DocsQuestionsVirtualizer
            questions={doc.questions}
            subjectId={subject.id}
            subjectTitle={subject.title}
            topicId={doc.topicId}
            topicTitle={doc.title}
          />
        </section>

        {/* Topic Completion Footer Banner */}
        <div className="docs-completion-banner">
          <div className="dcb-left">
            <span className={`dcb-status-badge ${isCompleted ? 'completed' : ''}`}>
              {isCompleted ? '✓ COMPLETED' : '○ IN PROGRESS'}
            </span>
            <h4>{isCompleted ? 'Topic Mastered & Recorded in Learning Path' : 'Finished reviewing this topic?'}</h4>
            <p>Marking this topic complete updates your 21-track roadmap and readiness score.</p>
          </div>
          <button
            type="button"
            className={`dcb-toggle-btn ${isCompleted ? 'completed' : ''}`}
            onClick={handleToggleCompleted}
          >
            {isCompleted ? 'Mark as Incomplete' : '✓ Mark Topic Complete'}
          </button>
        </div>

        {/* Previous & Next Navigation */}
        <nav className="docs-prev-next-nav" aria-label="Previous and next topic">
          {doc.previousTopic ? (
            <Link
              to={`/docs/${doc.previousTopic.subjectId}/${doc.previousTopic.topicId}`}
              className="docs-nav-card prev-card"
            >
              <span className="nav-direction">← Previous Topic</span>
              <span className="nav-target-title">{doc.previousTopic.title}</span>
            </Link>
          ) : <div />}

          {doc.nextTopic && (
            <Link
              to={`/docs/${doc.nextTopic.subjectId}/${doc.nextTopic.topicId}`}
              className="docs-nav-card next-card"
            >
              <span className="nav-direction">Next Topic →</span>
              <span className="nav-target-title">{doc.nextTopic.title}</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Right Column: Sticky Table of Contents */}
      <DocsTableOfContents items={tocItems} />
    </div>
  );
}
