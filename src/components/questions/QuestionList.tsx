import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import { useAuth } from '../../context/AuthContext'
import { getCategories, getSources, getDifficultyBreakdown, search as searchQuestions } from '../../data/questionService'
import { useQuestions } from '../../data/useQuestions'
import type { Question } from '../../models/question'
import { DIFFICULTIES } from '../../models/question'
import './QuestionList.css'

const PAGE_SIZE = 48

function catClass(name: string): string {
  return `cat-${name.toLowerCase().replace(/[^a-z]+/g, '-')}`
}

export default function QuestionList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isBookmarked, toggleBookmark, bookmarkedCount } = useBookmarks()
  const { isSolved, toggleSolved, totalSolved } = useProgress()
  const { hasFeature, user, openAuthModal } = useAuth()
  const hasFullAccess = hasFeature('questions_full')
  const categoryFilter = searchParams.get('category') || ''
  const sourceFilter = searchParams.get('source') || ''
  const qParam = searchParams.get('q') || ''
  const savedParam = searchParams.get('saved') === 'true'
  const statusParam = searchParams.get('status') || ''

  const [searchTerm, setSearchTerm] = useState(qParam)
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter)
  const [selectedSource, setSelectedSource] = useState(sourceFilter)
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedStatus, setSelectedStatus] = useState(statusParam)
  const [savedOnly, setSavedOnly] = useState(savedParam)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { questions: allQuestions, loading, error } = useQuestions()

  const categories = useMemo(() => getCategories(allQuestions), [allQuestions])
  const sources = useMemo(() => getSources(allQuestions), [allQuestions])

  const filtered = useMemo(() => {
    let results: Question[] = searchTerm ? searchQuestions(allQuestions, searchTerm) : allQuestions
    if (savedOnly) results = results.filter(q => isBookmarked(q.id))
    if (selectedStatus === 'solved') results = results.filter(q => isSolved(q.id))
    if (selectedStatus === 'unsolved') results = results.filter(q => !isSolved(q.id))
    if (selectedCategory) results = results.filter(q => q.category === selectedCategory)
    if (selectedSource) results = results.filter(q => (q.source ?? '') === selectedSource)
    if (selectedDifficulty) results = results.filter(q => q.difficulty === selectedDifficulty)
    return results
  }, [searchTerm, savedOnly, selectedStatus, selectedCategory, selectedSource, selectedDifficulty, allQuestions, isBookmarked, isSolved])

  const breakdown = useMemo(() => getDifficultyBreakdown(filtered), [filtered])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    window.scrollTo({ top: 0 })
  }, [searchTerm, savedOnly, selectedStatus, selectedCategory, selectedSource, selectedDifficulty])

  useEffect(() => {
    if (categoryFilter) {
      setSelectedCategory(categoryFilter)
    }
  }, [categoryFilter])

  useEffect(() => {
    if (sourceFilter) {
      setSelectedSource(sourceFilter)
    }
  }, [sourceFilter])

  useEffect(() => {
    setSearchTerm(qParam)
  }, [qParam])

  useEffect(() => {
    setSavedOnly(searchParams.get('saved') === 'true')
  }, [searchParams])

  const handleSavedToggle = () => {
    const nextSaved = !savedOnly
    setSavedOnly(nextSaved)
    const newParams = new URLSearchParams(searchParams)
    if (nextSaved) {
      newParams.set('saved', 'true')
    } else {
      newParams.delete('saved')
    }
    setSearchParams(newParams)
  }

  const hasFilters = searchTerm || savedOnly || selectedStatus || selectedCategory || selectedSource || selectedDifficulty


  if (loading) {
    return (
      <div className="question-list-page">
        <div className="skeleton skeleton-line" style={{ width: '200px' }} />
        <div className="skeleton skeleton-line" style={{ width: '100%', height: 52 }} />
        <div className="question-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 110 }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="error-note">Failed to load questions: {error}</div>
  }

  const visible = filtered.slice(0, visibleCount)

  return (
    <div className="question-list-page page-enter">
      <div className="questions-title-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>{savedOnly ? 'Saved Questions' : 'Questions'}</h1>
          <span className={`badge ${hasFullAccess ? 'badge-pro' : 'badge-candidate'}`} style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', background: hasFullAccess ? 'rgba(99, 102, 241, 0.15)' : 'var(--surface-hover)', border: '1px solid var(--border-subtle)', fontWeight: 600 }}>
            {hasFullAccess ? '⚡ 22,222 Bank Unlocked' : '🔒 Free Preview Tier (250 items)'}
          </span>
        </div>
        <button
          type="button"
          className={`saved-filter-pill ${savedOnly ? 'active' : ''}`}
          onClick={handleSavedToggle}
          title={savedOnly ? 'Show all questions' : 'Show saved questions only'}
        >
          <span className="star-icon">★</span>
          <span>Saved Questions</span>
          <span className="pill-count">{bookmarkedCount}</span>
        </button>
      </div>

      {!hasFullAccess && !savedOnly && (
        <div style={{ padding: '12px 18px', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: 'var(--radius-md)', marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>🔒 Standard Preview Access:</strong> You are browsing preview questions. Access to the full 22,222 questions bank is granted and managed by Platform Administrators.
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={openAuthModal} style={{ whiteSpace: 'nowrap' }}>
            {user ? 'View Entitlements' : 'Sign In'}
          </button>
        </div>
      )}

      <div className="filters">
        <input
          type="search"
          placeholder={`Search ${allQuestions.length.toLocaleString()} questions...`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
          aria-label="Search questions"
        />
        <select
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value)
            const newParams = new URLSearchParams(searchParams)
            if (e.target.value) newParams.set('category', e.target.value)
            else newParams.delete('category')
            setSearchParams(newParams)
          }}
          className="category-select"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={selectedSource}
          onChange={e => {
            setSelectedSource(e.target.value)
            const newParams = new URLSearchParams(searchParams)
            if (e.target.value) newParams.set('source', e.target.value)
            else newParams.delete('source')
            setSearchParams(newParams)
          }}
          className="category-select"
          aria-label="Filter by source"
        >
          <option value="">All Sources</option>
          {sources.map(s => (
            <option key={s.name} value={s.name}>{s.name} ({s.count})</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={e => setSelectedDifficulty(e.target.value)}
          className="category-select"
          aria-label="Filter by difficulty"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="category-select"
          aria-label="Filter by solved status"
        >
          <option value="">All Statuses</option>
          <option value="solved">Solved ({totalSolved})</option>
          <option value="unsolved">Unsolved ({(allQuestions.length - totalSolved).toLocaleString()})</option>
        </select>
      </div>

      <div className="difficulty-breakdown" role="group" aria-label="Difficulty breakdown">
        {DIFFICULTIES.map(d => (
          <button
            key={d}
            className={`diff-chip diff-chip-${d.toLowerCase()} ${selectedDifficulty === d ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty(prev => (prev === d ? '' : d))}
          >
            <span className={`badge badge-${d.toLowerCase()}`}>{d}</span>
            <span className="diff-count">{breakdown[d.toLowerCase() as keyof typeof breakdown].toLocaleString()}</span>
          </button>
        ))}
      </div>

      <p className="result-count">
        <strong>{filtered.length.toLocaleString()}</strong> question{filtered.length !== 1 ? 's' : ''} found
        {hasFilters && (
          <button
            className="clear-btn"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('')
              setSelectedSource('')
              setSelectedDifficulty('')
              setSelectedStatus('')
              setSavedOnly(false)
              setSearchParams({})
            }}
          >
            Clear filters
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <div className="empty-state">
          {savedOnly && bookmarkedCount === 0 ? (
            <>
              <h3>No saved questions yet ⭐</h3>
              <p>Click the star icon on any question card to save it for quick revision.</p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                onClick={() => {
                  setSavedOnly(false)
                  const newParams = new URLSearchParams(searchParams)
                  newParams.delete('saved')
                  setSearchParams(newParams)
                }}
              >
                Browse All Questions
              </button>
            </>
          ) : selectedStatus === 'solved' && totalSolved === 0 ? (
            <>
              <h3>No solved questions yet ✓</h3>
              <p>Mark questions as solved as you study to track your interview readiness.</p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: 12 }}
                onClick={() => setSelectedStatus('')}
              >
                Show All Questions
              </button>
            </>
          ) : (
            <>
              <h3>No questions match</h3>
              <p>Try a different keyword or clear the filters.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="question-grid">
            {visible.map(q => {
              const bookmarked = isBookmarked(q.id)
              const solved = isSolved(q.id)
              return (
                <div key={q.id} className={`question-card-wrapper ${catClass(q.category)}`}>
                  <Link to={`/questions/${q.id}`} className={`question-card ${catClass(q.category)} ${solved ? 'is-solved' : ''}`}>
                    <div className="card-header">
                      <span className={`badge badge-category ${catClass(q.category)}`}>{q.category}</span>
                      <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      {q.source && <span className="badge badge-source">{q.source}</span>}
                      {solved && <span className="badge badge-solved-pill">✓ Solved</span>}
                    </div>
                    <p className="card-question">{q.question}</p>
                  </Link>
                  <div className="card-actions">
                    <button
                      type="button"
                      className={`card-solved-btn ${solved ? 'solved' : ''}`}
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleSolved(q.id)
                      }}
                      aria-label={solved ? 'Mark as unsolved' : 'Mark as solved'}
                      title={solved ? 'Mark as unsolved' : 'Mark as solved'}
                    >
                      <span className="card-action-icon">{solved ? '✓' : '○'}</span>
                    </button>
                    <button
                      type="button"
                      className={`card-bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
                      onClick={e => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleBookmark(q.id)
                      }}
                      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
                      title={bookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {visibleCount < filtered.length && (
            <div className="load-more-wrap">
              <button className="btn btn-secondary" onClick={() => setVisibleCount(c => c + PAGE_SIZE)}>
                Load more ({(filtered.length - visibleCount).toLocaleString()} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}


