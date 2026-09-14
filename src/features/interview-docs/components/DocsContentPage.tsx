import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { SubjectId } from '../types/docs.types';
import { ALL_SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { getDocPage } from '../data/docsRegistry';
import { docsProgressService } from '../services/docsProgressService';
import { BreadcrumbNav } from './common/BreadcrumbNav';
import { SafeMarkdownViewer } from './common/SafeMarkdownViewer';
import { DocsVideoPlayer } from './DocsVideoPlayer';
import { DocsInteractivePlayground, type PlaygroundSnippetPreset } from './DocsInteractivePlayground';
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
  const [activePlaygroundSnippet, setActivePlaygroundSnippet] = useState<PlaygroundSnippetPreset | undefined>(undefined);

  // Derive interactive code presets from the topic documentation sections
  const playgroundPresets = useMemo<PlaygroundSnippetPreset[]>(() => {
    const list: PlaygroundSnippetPreset[] = [];
    if (doc?.sections) {
      doc.sections.forEach((sec, idx) => {
        if (sec.codeSnippet && sec.codeSnippet.code) {
          list.push({
            id: `section-${sec.id || idx}`,
            title: sec.heading.replace(/^\d+\.\s*/, ''),
            language: sec.codeSnippet.language || 'javascript',
            code: sec.codeSnippet.code,
          });
        }
      });
    }
    if (list.length === 0) {
      list.push({
        id: 'default-demo',
        title: `${doc?.title || 'Topic'} Demo`,
        language: 'javascript',
        code: `// ${doc?.title || 'Interactive Playground'}\nconsole.log("Mastering ${doc?.title || 'Frontend'} in real-time...");\n\nconst takeaways = ["Understand Specifications", "Practice Edge Cases", "Ace the Technical Interview"];\ntakeaways.forEach((t, i) => console.log(\`\${i + 1}. \${t}\`));`,
      });
    }
    return list;
  }, [doc]);

  const handleLoadSnippetIntoPlayground = (preset: PlaygroundSnippetPreset) => {
    setActivePlaygroundSnippet(preset);
    setTimeout(() => {
      const el = document.getElementById('interactive-playground-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

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
    { id: 'interactive-playground-section', label: '⚡ Code Playground' },
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

        {/* Dynamic Sections with Run in Playground Quick Actions */}
        {doc.sections.map(section => (
          <section key={section.id} id={section.id} className="docs-content-section">
            <h2 className="section-title">{section.heading}</h2>
            <SafeMarkdownViewer content={section.content} />
            {section.codeSnippet && (
              <div className="section-code-wrap">
                <div className="section-code-header-bar">
                  <span className="sch-lang">{section.codeSnippet.language.toUpperCase()}</span>
                  <button
                    type="button"
                    className="sch-run-btn"
                    onClick={() => handleLoadSnippetIntoPlayground({
                      id: `section-${section.id}`,
                      title: section.heading.replace(/^\d+\.\s*/, ''),
                      language: section.codeSnippet!.language || 'javascript',
                      code: section.codeSnippet!.code,
                    })}
                    title="Open and run this snippet in the interactive playground"
                  >
                    ⚡ Edit &amp; Run in Playground →
                  </button>
                </div>
                <SafeMarkdownViewer
                  content={`\`\`\`${section.codeSnippet.language}\n${section.codeSnippet.code}\n\`\`\``}
                />
              </div>
            )}
          </section>
        ))}

        {/* Section: Interactive Code Playground */}
        <section id="interactive-playground-section" className="docs-content-section playground-section">
          <h2 className="section-title">⚡ Interactive Code Playground</h2>
          <DocsInteractivePlayground
            topicTitle={doc.title}
            subjectTitle={subject.title}
            presets={playgroundPresets}
            activeSnippetOverride={activePlaygroundSnippet}
            onClearOverride={() => setActivePlaygroundSnippet(undefined)}
          />
        </section>

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
      </div>

      {/* Right Table of Contents */}
      <DocsTableOfContents items={tocItems} />
    </div>
  );
}
