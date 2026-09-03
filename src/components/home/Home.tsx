import { Link } from 'react-router-dom'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'
import { getStats, getCodingCount, getSources, getDifficultyBreakdown } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import { DIFFICULTIES } from '../../models/question'
import './Home.css'

const CATEGORY_SLUGS: Record<string, string> = {
  'JavaScript & ES6': 'javascript-es6',
  'ReactJS': 'reactjs',
  'TypeScript': 'typescript',
  'CSS': 'css',
  'Frontend Performance': 'frontend-performance',
  'DOM & Web APIs': 'dom-web-apis',
}

export default function Home() {
  const { questions, loading, error } = useQuestions()
  const { bookmarkedCount } = useBookmarks()
  const { totalSolved, streak } = useProgress()
  const { user, isAuthenticated, openAuthModal } = useAuth()


  if (loading) {
    return (
      <div className="home">
        <div className="skeleton skeleton-line" style={{ width: '55%', margin: '30px auto' }} />
        <div className="skeleton skeleton-line" style={{ width: '35%', margin: '0 auto 40px' }} />
        <div className="category-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load questions: {error}</div>
  }

  const stats = getStats(questions)
  const codingCount = getCodingCount(questions)
  const sources = getSources(questions)
  const breakdown = getDifficultyBreakdown(questions)
  const totalDiff = breakdown.easy + breakdown.medium + breakdown.hard || 1
  const diffPct = (n: number) => `${Math.round((n / totalDiff) * 100)}%`
  const overallProgressPct = Math.round((totalSolved / (questions.length || 1)) * 100)

  return (
    <div className="home page-enter">
      <section className="hero-section">
        <span className="hero-pill">
          <span className="hero-dot" aria-hidden="true" />
          {stats.total.toLocaleString()} questions ready
        </span>
        <h1 className="hero-title">
          Ace your next<br />
          <span className="hero-gradient">frontend interview</span>
        </h1>
        <p className="description">
          A {stats.total.toLocaleString()}-question bank spanning LeetCode-style algorithms,
          FrontendMasters-style interviews, and curated platform challenges — with full
          explanations and hands-on coding snippets.
        </p>
        <div className="hero-actions">
          <Link to="/questions" className="btn btn-primary">📚 Practice Questions (22,222)</Link>
          <Link to="/coding" className="btn btn-secondary">💻 Coding Challenges</Link>
          <Link to="/system-design" className="btn btn-secondary">🏗️ System Design</Link>
          <Link to="/quiz" className="btn btn-secondary">⚡ Timed Quiz</Link>
          <Link to="/dashboard" className="btn btn-secondary">
            {streak > 0 ? `🔥 ${streak} Day Streak · Tracker` : '📊 Study Tracker'}
          </Link>
          {bookmarkedCount > 0 && (
            <Link to="/questions?saved=true" className="btn btn-saved-hero">
              ★ Saved for Revision ({bookmarkedCount})
            </Link>
          )}
        </div>



        <div className="stat-row">
          <div className="stat-chip">
            <span className="stat-value">{stats.total.toLocaleString()}</span>
            <span className="stat-label">Questions</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{stats.byCategory.length}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{sources.length}</span>
            <span className="stat-label">Sources</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{codingCount.toLocaleString()}</span>
            <span className="stat-label">Code Challenges</span>
          </div>
        </div>

        <div className="diff-bar" role="img" aria-label="Difficulty distribution" title="Difficulty distribution">
          <span className="diff-seg easy" style={{ width: diffPct(breakdown.easy) }} />
          <span className="diff-seg medium" style={{ width: diffPct(breakdown.medium) }} />
          <span className="diff-seg hard" style={{ width: diffPct(breakdown.hard) }} />
        </div>
        <div className="diff-legend">
          {DIFFICULTIES.map(d => (
            <span key={d} className="diff-legend-item">
              <span className={`badge badge-${d.toLowerCase()}`}>{d}</span>
              <span className="diff-legend-count">{breakdown[d.toLowerCase() as keyof typeof breakdown].toLocaleString()}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="home-progress-section">
        <div className="home-progress-card">
          <div className="home-progress-left">
            <div className="progress-streak-bubble">
              <span className="flame-emoji" aria-hidden="true">🔥</span>
              <div className="streak-bubble-info">
                <span className="streak-num">{streak}</span>
                <span className="streak-text">Day Streak</span>
              </div>
            </div>
            <div className="home-progress-details">
              <div className="hp-user-badge-row">
                <h3>{isAuthenticated && user ? `Welcome back, ${user.name}!` : 'Your Interview Readiness Tracker'}</h3>
                {isAuthenticated && user && (
                  <span className={`hp-role-tag ${user.role}`}>
                    {user.role === 'admin' ? '🔒 ADMIN' : user.role === 'pro_member' ? '⚡ PRO MEMBER' : 'CANDIDATE'}
                  </span>
                )}
              </div>
              <p>{totalSolved.toLocaleString()} of {questions.length.toLocaleString()} questions mastered ({overallProgressPct}%) • Synced to Supabase Cloud</p>
              <div className="home-progress-bar">
                <div className="home-progress-fill" style={{ width: `${Math.max(overallProgressPct, 1)}%` }} />
              </div>
            </div>
          </div>
          <div className="home-progress-right-actions">
            {isAuthenticated ? (
              <Link to="/profile" className="btn btn-primary btn-sm">
                👤 View Profile Hub →
              </Link>
            ) : (
              <button type="button" className="btn btn-primary btn-sm" onClick={openAuthModal}>
                🔐 Sign In (OTP) →
              </button>
            )}
            <Link to="/user-management" className="btn btn-secondary btn-sm">
              🛡️ Auth Studio
            </Link>
          </div>
        </div>
      </section>


      {bookmarkedCount > 0 && (
        <section className="saved-revision-section">
          <div className="saved-revision-card">
            <div className="saved-revision-left">
              <span className="saved-revision-star">★</span>
              <div>
                <h3>Personal Revision Deck</h3>
                <p>You have {bookmarkedCount} question{bookmarkedCount !== 1 ? 's' : ''} saved for targeted review before your interviews.</p>
              </div>
            </div>
            <Link to="/questions?saved=true" className="btn btn-primary btn-sm">
              Review Saved Questions →
            </Link>
          </div>
        </section>
      )}


      <section className="sources-section">
        <h2>Browse by source</h2>
        <div className="source-grid">
          {sources.map(s => (
            <Link
              key={s.name}
              to={`/questions?source=${encodeURIComponent(s.name)}`}
              className="source-card"
            >
              <span className="source-name">{s.name}</span>
              <span className="source-count">{s.count.toLocaleString()} questions</span>
              <span className="source-arrow" aria-hidden="true">&rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="categories-section">
        <h2>Explore by category</h2>
        <div className="category-grid">
          {stats.byCategory.map(cat => (
            <Link
              key={cat.name}
              to={`/questions?category=${encodeURIComponent(cat.name)}`}
              className={`category-card cat-${CATEGORY_SLUGS[cat.name] ?? ''}`}
            >
              <span className="category-accent" aria-hidden="true" />
              <span className="category-name">{cat.name}</span>
              <span className="category-count">{cat.count.toLocaleString()} questions</span>
              <span className="category-arrow" aria-hidden="true">&rarr;</span>
            </Link>
          ))}
        </div>
      </section>

      {codingCount > 0 && (
        <section className="coding-section">
          <div className="coding-inner">
            <div>
              <h2>Coding Challenges</h2>
              <p>Predict the output, trace the execution, sharpen your instincts — {codingCount.toLocaleString()} real snippets to work through.</p>
            </div>
            <Link to="/coding" className="btn btn-primary">Start Practicing</Link>
          </div>
        </section>
      )}
    </div>
  )
}

