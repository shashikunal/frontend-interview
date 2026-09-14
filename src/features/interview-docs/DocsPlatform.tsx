import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, useParams, useLocation } from 'react-router-dom';
import type { SubjectId } from './types/docs.types';
import { ALL_SUBJECTS_CATALOG, TOPICS_BY_SUBJECT } from './data/subjectsCatalog';
import { DocsSidebar } from './components/DocsSidebar';
import { DocsTracksLanding } from './components/DocsTracksLanding';
import { DocsContentPage } from './components/DocsContentPage';
import { DocsPracticeStudio } from './components/DocsPracticeStudio';
import { DocsFlashcardsStudio } from './components/DocsFlashcardsStudio';
import { DocsInterviewStudio } from './components/DocsInterviewStudio';
import { DocsReadinessDashboard } from './components/DocsReadinessDashboard';
import { DocsQuickRevisionStudio } from './components/DocsQuickRevisionStudio';
import { DocsComparisonStudio } from './components/DocsComparisonStudio';
import { DocsStudyPlanStudio } from './components/DocsStudyPlanStudio';
import { DocsUberMenu } from './components/DocsUberMenu';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import './styles/DocsPlatform.css';

/**
 * Automatically redirects from /docs/:subjectId (e.g. /docs/react)
 * directly into the subject's first topic (/docs/:subjectId/:firstTopicId)
 * instead of staying on the landing cards view.
 */
function SubjectRedirect() {
  const { subjectId } = useParams<{ subjectId: SubjectId }>();
  if (subjectId && TOPICS_BY_SUBJECT[subjectId] && TOPICS_BY_SUBJECT[subjectId].length > 0) {
    const firstTopic = TOPICS_BY_SUBJECT[subjectId][0];
    return <Navigate to={`/docs/${subjectId}/${firstTopic.id}`} replace />;
  }
  return <DocsTracksLanding />;
}

export default function DocsPlatform() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isUberMenuOpen, setIsUberMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('docs_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem('docs_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Global keyboard shortcuts: Cmd/Ctrl+K (Search), Cmd/Ctrl+B (Toggle Sidebar)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebarCollapse();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Extract subjectId and topicId from pathname if present
  const pathParts = location.pathname.replace(/^\/docs\/?/, '').split('/');
  const isSpecialSection = ['practice', 'flashcards', 'interview', 'readiness', 'revision', 'comparisons'].includes(pathParts[0]);
  const activeSubjectId = (pathParts[0] && !isSpecialSection)
    ? (pathParts[0] as SubjectId)
    : undefined;
  const activeTopicId = pathParts[1] || undefined;
  const activeSubject = activeSubjectId ? ALL_SUBJECTS_CATALOG.find(s => s.id === activeSubjectId) : null;

  return (
    <div className="docs-platform-root">
      {/* Global Cmd/Ctrl+K Search Dialog */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Full Curriculum Ubermenu (Megamenu Modal) */}
      <DocsUberMenu
        isOpen={isUberMenuOpen}
        onClose={() => setIsUberMenuOpen(false)}
        currentSubjectId={activeSubjectId}
      />

      {/* Sleek Top Navigation Bar containing all 7 Documentation Studios & Navigation Modes */}
      <header className="docs-top-navbar" role="navigation" aria-label="Documentation Navigation Bar">
        <div className="docs-top-nav-left">
          <NavLink to="/docs" className="docs-brand-badge" end>
            <span className="docs-brand-icon">📚</span>
            <span className="docs-brand-text">Frontend MasterDocs</span>
            <span className="docs-brand-badge-pill">708 Topics</span>
          </NavLink>

          {/* Sidebar Hide/Expand User Toggle Button */}
          <button
            type="button"
            className={`docs-top-sidebar-toggle-btn ${isSidebarCollapsed ? 'is-collapsed' : ''}`}
            onClick={toggleSidebarCollapse}
            title={isSidebarCollapsed ? 'Expand Curriculum Sidebar (Ctrl+B)' : 'Hide Curriculum Sidebar (Ctrl+B)'}
            aria-label="Toggle Sidebar Visibility"
          >
            <span className="stb-icon">{isSidebarCollapsed ? '◧' : '◨'}</span>
            <span className="stb-text">{isSidebarCollapsed ? 'Expand' : 'Hide'}</span>
            <kbd className="stb-kbd">⌘B</kbd>
          </button>
        </div>

        <nav className="docs-top-nav-modes" aria-label="Documentation Studios">
          <NavLink
            to="/docs"
            end
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">📚</span>
            <span className="dtn-label">Tracks</span>
          </NavLink>
          <NavLink
            to="/docs/practice"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">🎯</span>
            <span className="dtn-label">Practice</span>
          </NavLink>
          <NavLink
            to="/docs/flashcards"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">🗂️</span>
            <span className="dtn-label">Cards</span>
          </NavLink>
          <NavLink
            to="/docs/revision"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">⚡</span>
            <span className="dtn-label">Revision</span>
          </NavLink>
          <NavLink
            to="/docs/comparisons"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">⚖️</span>
            <span className="dtn-label">Diffs</span>
          </NavLink>
          <NavLink
            to="/docs/interview"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">🎙️</span>
            <span className="dtn-label">Interview</span>
          </NavLink>
          <NavLink
            to="/docs/study-plan"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">🗺️</span>
            <span className="dtn-label">Roadmap</span>
          </NavLink>
          <NavLink
            to="/docs/readiness"
            className={({ isActive }) => `dtn-link ${isActive ? 'active' : ''}`}
          >
            <span className="dtn-icon">📊</span>
            <span className="dtn-label">Readiness</span>
          </NavLink>
        </nav>

        <div className="docs-top-nav-right">
          {/* Ubermenu Track Switcher Trigger Button (in Top Bar) */}
          <button
            type="button"
            className={`docs-top-ubermenu-trigger ${isUberMenuOpen ? 'active' : ''}`}
            onClick={() => setIsUberMenuOpen(prev => !prev)}
            title="Open All 21 Tracks Ubermenu"
            aria-expanded={isUberMenuOpen}
            aria-haspopup="dialog"
          >
            <span className="dtu-icon">{activeSubject ? activeSubject.icon : '🌐'}</span>
            <span className="dtu-title">{activeSubject ? activeSubject.title : 'All 21 Tracks'}</span>
            <span className="dtu-count-badge">
              {activeSubject ? `${TOPICS_BY_SUBJECT[activeSubject.id]?.length || 0} Modules` : '21 Tracks'}
            </span>
            <span className={`dtu-arrow ${isUberMenuOpen ? 'open' : ''}`}>▾</span>
          </button>

          <button
            type="button"
            className="docs-top-search-btn"
            onClick={() => setIsSearchModalOpen(true)}
            title="Search all tracks, topics & questions (⌘K)"
          >
            <span className="dts-icon">🔍</span>
            <span className="dts-text">Search...</span>
            <kbd className="dts-kbd">⌘K</kbd>
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Toggle Button */}
      <div className="docs-mobile-top-bar">
        <button
          type="button"
          className="docs-mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(prev => !prev)}
          aria-label="Toggle Documentation Navigation"
        >
          <span className="toggle-icon">☰</span>
          <span className="toggle-text">21 Tracks &amp; Topics</span>
        </button>

        <button
          type="button"
          className="docs-mobile-search-trigger"
          onClick={() => setIsSearchModalOpen(true)}
        >
          🔍 Search <kbd>⌘K</kbd>
        </button>
      </div>

      <div className="docs-platform-shell">
        {/* Left Navigation Sidebar - Focused, elegant, and dedicated exclusively to curriculum navigation */}
        <DocsSidebar
          currentSubjectId={activeSubjectId}
          currentTopicId={activeTopicId}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />

        {/* Floating Sidebar Expand Button (when sidebar is collapsed) */}
        {isSidebarCollapsed && (
          <button
            type="button"
            className="docs-floating-expand-tab"
            onClick={toggleSidebarCollapse}
            title="Expand Curriculum Sidebar (Ctrl+B)"
            aria-label="Expand Documentation Sidebar"
          >
            <span className="fet-icon">◧</span>
            <span className="fet-label">Curriculum</span>
            <span className="fet-arrow">›</span>
          </button>
        )}

        {/* Mobile Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="docs-mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content View */}
        <main className={`docs-main-viewport ${isSidebarCollapsed ? 'sidebar-hidden' : ''}`}>
          <Routes>
            <Route path="/" element={<DocsTracksLanding />} />
            <Route path="practice" element={<DocsPracticeStudio />} />
            <Route path="flashcards" element={<DocsFlashcardsStudio />} />
            <Route path="interview" element={<DocsInterviewStudio />} />
            <Route path="revision" element={<DocsQuickRevisionStudio />} />
            <Route path="comparisons" element={<DocsComparisonStudio />} />
            <Route path="study-plan" element={<DocsStudyPlanStudio />} />
            <Route path="readiness" element={<DocsReadinessDashboard />} />
            <Route path=":subjectId" element={<SubjectRedirect />} />
            <Route path=":subjectId/:topicId" element={<DocsContentPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
