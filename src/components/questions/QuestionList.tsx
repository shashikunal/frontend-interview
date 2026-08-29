import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  const categoryFilter = searchParams.get('category') || ''
  const sourceFilter = searchParams.get('source') || ''
  const qParam = searchParams.get('q') || ''
  const [searchTerm, setSearchTerm] = useState(qParam)
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter)
  const [selectedSource, setSelectedSource] = useState(sourceFilter)
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { questions: allQuestions, loading, error } = useQuestions()

  const categories = useMemo(() => getCategories(allQuestions), [allQuestions])
  const sources = useMemo(() => getSources(allQuestions), [allQuestions])

  const filtered = useMemo(() => {
    let results: Question[] = searchTerm ? searchQuestions(allQuestions, searchTerm) : allQuestions
    if (selectedCategory) results = results.filter(q => q.category === selectedCategory)
    if (selectedSource) results = results.filter(q => (q.source ?? '') === selectedSource)
    if (selectedDifficulty) results = results.filter(q => q.difficulty === selectedDifficulty)
    return results
  }, [searchTerm, selectedCategory, selectedSource, selectedDifficulty, allQuestions])

  const breakdown = useMemo(() => getDifficultyBreakdown(filtered), [filtered])

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
    window.scrollTo({ top: 0 })
  }, [searchTerm, selectedCategory, selectedSource, selectedDifficulty])

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

  const hasFilters = searchTerm || selectedCategory || selectedSource || selectedDifficulty

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
      <h1>Questions</h1>

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
            setSearchParams(e.target.value ? { category: e.target.value, source: selectedSource } : { source: selectedSource })
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
            setSearchParams(e.target.value ? { source: e.target.value, category: selectedCategory } : { category: selectedCategory })
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
              setSearchParams({})
            }}
          >
            Clear filters
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <div className="empty-state">
          <h3>No questions match</h3>
          <p>Try a different keyword or clear the filters.</p>
        </div>
      ) : (
        <>
          <div className="question-grid">
            {visible.map(q => (
              <Link key={q.id} to={`/questions/${q.id}`} className={`question-card ${catClass(q.category)}`}>
                <div className="card-header">
                  <span className={`badge badge-category ${catClass(q.category)}`}>{q.category}</span>
                  <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                  {q.source && <span className="badge badge-source">{q.source}</span>}
                </div>
                <p className="card-question">{q.question}</p>
              </Link>
            ))}
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
