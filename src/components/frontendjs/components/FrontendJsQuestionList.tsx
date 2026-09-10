// src/components/frontendjs/components/FrontendJsQuestionList.tsx
import { useState, useMemo } from 'react'
import type { FrontendJsQuestion } from '../data/frontendJsTypes'
import { frontendJsProgressService, type FrontendJsQuestionStatus } from '../lib/frontendJsProgressService'

interface Props {
  questions: FrontendJsQuestion[]
  activeQuestionId: string
  onSelectQuestion: (questionId: string) => void
  onClose?: () => void
}

type PaletteFilter =
  | 'All'
  | 'Solved'
  | 'Attempted'
  | 'In Progress'
  | 'Not Started'
  | 'Revisit'
  | 'Easy'
  | 'Medium'
  | 'Hard'
  | 'Most Asked'
  | 'Company Style'
  | 'Startup Style'

export function FrontendJsQuestionList({
  questions,
  activeQuestionId,
  onSelectQuestion,
  onClose,
}: Props) {
  const [filter, setFilter] = useState<PaletteFilter>('All')
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [page, setPage] = useState<number>(0)
  const pageSize = 100

  const solvedSet = frontendJsProgressService.getSolvedIds()
  const attemptedSet = frontendJsProgressService.getAttemptedIds()
  const revisitSet = frontendJsProgressService.getRevisitIds()

  const categories = useMemo(() => {
    const set = new Set<string>()
    questions.forEach(q => set.add(q.category))
    return ['All', ...Array.from(set)]
  }, [questions])

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchTitle = q.title.toLowerCase().includes(query)
        const matchId = q.id.toLowerCase().includes(query)
        const matchConcept = q.javascriptConcepts.some(c => c.toLowerCase().includes(query))
        const matchTopic = q.frontendTopic.toLowerCase().includes(query)
        if (!matchTitle && !matchId && !matchConcept && !matchTopic) return false
      }

      // Category
      if (categoryFilter !== 'All' && q.category !== categoryFilter) return false

      // Filter status / difficulty / tags
      if (filter === 'Solved') return solvedSet.has(q.id)
      if (filter === 'Attempted') return attemptedSet.has(q.id) && !solvedSet.has(q.id)
      if (filter === 'Revisit') return revisitSet.has(q.id)
      if (filter === 'Not Started') return !attemptedSet.has(q.id) && !solvedSet.has(q.id)
      if (filter === 'In Progress') return !!frontendJsProgressService.getDraft(q.id) && !solvedSet.has(q.id)
      if (filter === 'Easy') return q.difficulty === 'Easy'
      if (filter === 'Medium') return q.difficulty === 'Medium'
      if (filter === 'Hard') return q.difficulty === 'Hard'
      if (filter === 'Most Asked') return q.isMostAsked
      if (filter === 'Company Style') return q.companyTags.length > 0
      if (filter === 'Startup Style') return !!q.startupTag

      return true
    })
  }, [questions, searchTerm, categoryFilter, filter, solvedSet, attemptedSet, revisitSet])

  const totalPages = Math.ceil(filteredQuestions.length / pageSize)
  const paginatedQuestions = filteredQuestions.slice(page * pageSize, (page + 1) * pageSize)

  const getStatusSymbol = (status: FrontendJsQuestionStatus) => {
    switch (status) {
      case 'Solved': return '✓'
      case 'In Progress': return '●'
      case 'Attempted': return '◐'
      case 'Revisit': return '↗'
      default: return '○'
    }
  }

  return (
    <div className="fjs-question-drawer">
      <div className="fjs-qd-header">
        <div className="fjs-qd-title-row">
          <h3>Question Palette (1,000 Questions)</h3>
          {onClose && (
            <button type="button" className="fjs-qd-close" onClick={onClose}>×</button>
          )}
        </div>

        {/* Stats strip */}
        <div className="fjs-qd-stats-strip">
          <span>✓ Solved: <strong>{solvedSet.size}</strong></span>
          <span>◐ Attempted: <strong>{attemptedSet.size}</strong></span>
          <span>↗ Revisit: <strong>{revisitSet.size}</strong></span>
          <span>Remaining: <strong>{questions.length - solvedSet.size}</strong></span>
        </div>

        {/* Search input */}
        <div className="fjs-search-wrap">
          <input
            type="search"
            className="fjs-search-input"
            placeholder="Search by title, ID, topic, concept..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value)
              setPage(0)
            }}
          />
        </div>

        {/* Category dropdown */}
        <div className="fjs-cat-dropdown-row">
          <select
            className="fjs-cat-select"
            value={categoryFilter}
            onChange={e => {
              setCategoryFilter(e.target.value)
              setPage(0)
            }}
          >
            {categories.map(c => (
              <option key={c} value={c}>Category: {c}</option>
            ))}
          </select>
        </div>

        {/* Filters bar */}
        <div className="fjs-palette-filter-bar">
          {(['All', 'Solved', 'In Progress', 'Attempted', 'Revisit', 'Easy', 'Medium', 'Hard', 'Most Asked'] as PaletteFilter[]).map(f => (
            <button
              key={f}
              type="button"
              className={`fjs-pf-btn ${filter === f ? 'active' : ''}`}
              onClick={() => {
                setFilter(f)
                setPage(0)
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="fjs-palette-grid">
        {paginatedQuestions.map(q => {
          const status = frontendJsProgressService.getQuestionStatus(q.id)
          const symbol = getStatusSymbol(status)
          const isActive = q.id === activeQuestionId
          const diffCls = q.difficulty.toLowerCase()

          return (
            <button
              key={q.id}
              type="button"
              className={`fjs-palette-item ${status.toLowerCase().replace(/\s+/g, '-')} ${isActive ? 'active' : ''} diff-${diffCls}`}
              onClick={() => {
                onSelectQuestion(q.id)
                if (onClose) onClose()
              }}
              title={`${q.id}: ${q.title} (${q.difficulty} - ${status})`}
            >
              <span className="fjs-pi-num">{q.number}</span>
              <span className="fjs-pi-sym">{symbol}</span>
            </button>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="fjs-palette-pagination">
          <button
            type="button"
            className="fjs-page-btn"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
          >
            ← Prev
          </button>
          <span>Page {page + 1} of {totalPages} ({filteredQuestions.length} questions)</span>
          <button
            type="button"
            className="fjs-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
