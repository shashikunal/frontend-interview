import { Routes, Route, Link, useLocation } from 'react-router-dom'
import SubjectLandingPage from './components/SubjectLandingPage'
import SubjectQuestionCatalog from './components/SubjectQuestionCatalog'
import QuestionDetailStudio from './components/QuestionDetailStudio'
import PracticeDrillStudio from './components/PracticeDrillStudio'
import MockTestStudio from './components/MockTestStudio'
import BookmarksRevisionStudio from './components/BookmarksRevisionStudio'
import './MasterQuestionBank.css'

export default function MasterQuestionBankApp() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/interview-questions') {
      return location.pathname === '/interview-questions'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="mqb-app-container" id="master-question-bank-root">
      {/* Background Atmosphere Glows */}
      <div className="mqb-glow-sphere-1" />
      <div className="mqb-glow-sphere-2" />

      <div className="mqb-content-inner">
        {/* Module Sub-Header Navigation Bar */}
        <header className="mqb-subnav-bar" id="mqb-top-nav">
          <div className="mqb-subnav-left">
            <Link to="/interview-questions" className="mqb-subnav-brand">
              <span>🎯</span>
              <span className="mqb-subnav-brand-text">Master Question Bank</span>
              <span className="mqb-subnav-brand-badge">1,500 Real Qs</span>
            </Link>

            <nav className="mqb-subnav-links">
              <Link
                to="/interview-questions"
                className={`mqb-subnav-link ${isActive('/interview-questions') && !location.pathname.includes('/practice') && !location.pathname.includes('/test') && !location.pathname.includes('/bookmarks') ? 'active' : ''}`}
              >
                All Subjects
              </Link>
              <Link
                to="/interview-questions/practice"
                className={`mqb-subnav-link ${isActive('/interview-questions/practice') ? 'active' : ''}`}
              >
                Flashcard Practice
              </Link>
              <Link
                to="/interview-questions/test"
                className={`mqb-subnav-link ${isActive('/interview-questions/test') ? 'active' : ''}`}
              >
                Mock Test
              </Link>
              <Link
                to="/interview-questions/bookmarks"
                className={`mqb-subnav-link ${isActive('/interview-questions/bookmarks') ? 'active' : ''}`}
              >
                Saved &amp; Review
              </Link>
            </nav>
          </div>

          <div className="mqb-subnav-right">
            <Link to="/dashboard" className="mqb-action-pill-btn">
              📊 Candidate Dashboard
            </Link>
          </div>
        </header>

        {/* Subroutes */}
        <Routes>
          <Route path="/" element={<SubjectLandingPage />} />
          <Route path="/practice" element={<PracticeDrillStudio />} />
          <Route path="/test" element={<MockTestStudio />} />
          <Route path="/bookmarks" element={<BookmarksRevisionStudio />} />
          <Route path="/:subject" element={<SubjectQuestionCatalog />} />
          <Route path="/:subject/practice" element={<PracticeDrillStudio />} />
          <Route path="/:subject/test" element={<MockTestStudio />} />
          <Route path="/:subject/:questionId" element={<QuestionDetailStudio />} />
        </Routes>
      </div>
    </div>
  )
}
