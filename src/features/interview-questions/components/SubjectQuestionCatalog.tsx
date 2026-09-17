import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type {
  MasterSubjectId,
  MasterQuestion,
  SubjectMeta,
} from '../types/interviewQuestions.types'

const PAGE_SIZE = 25

export default function SubjectQuestionCatalog() {
  const { subject: urlSubject } = useParams<{ subject: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const subjectId = (urlSubject?.toLowerCase() || 'javascript') as MasterSubjectId

  const initialDiff = searchParams.get('difficulty')?.toUpperCase() || 'ALL'
  const initialLevel = searchParams.get('level')?.toUpperCase() || 'ALL'

  const [questions, setQuestions] = useState<MasterQuestion[]>([])
  const [subjectMeta, setSubjectMeta] = useState<SubjectMeta | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('ALL')
  const [selectedDiff, setSelectedDiff] = useState<string>(initialDiff)
  const [selectedType, setSelectedType] = useState<string>('ALL')
  const [selectedExp, setSelectedExp] = useState<string>(initialLevel)
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const d = searchParams.get('difficulty')?.toUpperCase()
    if (d && ['EASY', 'INTERMEDIATE', 'DIFFICULT', 'ALL'].includes(d)) {
      setSelectedDiff(d)
    }
  }, [searchParams])

  // Progress state subscription
  const [progressState, setProgressState] = useState(() => interviewQuestionsProgressService.getState())

  useEffect(() => {
    let mounted = true

    async function loadData() {
      try {
        setLoading(true)
        const [qList, meta] = await Promise.all([
          interviewQuestionsDataService.getSubjectQuestions(subjectId),
          interviewQuestionsDataService.getSubjectMeta(subjectId),
        ])
        if (mounted) {
          setQuestions(qList)
          setSubjectMeta(meta)
          setError(null)
          setCurrentPage(1)
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || `Failed to load questions for ${subjectId}`)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadData()

    const handleUpdate = () => {
      setProgressState(interviewQuestionsProgressService.getState())
    }
    window.addEventListener('master_bank_progress_updated', handleUpdate)

    return () => {
      mounted = false
      window.removeEventListener('master_bank_progress_updated', handleUpdate)
    }
  }, [subjectId])

  // Topics available for this subject
  const availableTopics = useMemo(() => {
    if (!questions.length) return []
    const set = new Set<string>()
    questions.forEach(q => set.add(q.topic))
    return Array.from(set).sort()
  }, [questions])

  // Real-time filtered question set
  const filteredQuestions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim()
    const completedSet = new Set(progressState.completedQuestionIds)
    const bookmarkedSet = new Set(progressState.bookmarkedQuestionIds)
    const reviewSet = new Set(progressState.needsReviewQuestionIds)

    return questions.filter(q => {
      // Search
      if (term) {
        const matchesQuestion = q.question.toLowerCase().includes(term)
        const matchesId = q.id.toLowerCase().includes(term)
        const matchesConcept = q.concept.toLowerCase().includes(term)
        const matchesTags = q.tags.some(t => t.toLowerCase().includes(term))
        if (!matchesQuestion && !matchesId && !matchesConcept && !matchesTags) {
          return false
        }
      }

      // Topic filter
      if (selectedTopic !== 'ALL' && q.topic !== selectedTopic) {
        return false
      }

      // Difficulty filter
      if (selectedDiff !== 'ALL' && q.difficulty !== selectedDiff) {
        return false
      }

      // Type filter
      if (selectedType !== 'ALL' && q.questionType !== selectedType) {
        return false
      }

      // Experience level filter
      if (selectedExp !== 'ALL' && q.experienceLevel !== selectedExp) {
        return false
      }

      // Status filter
      if (selectedStatus === 'COMPLETED' && !completedSet.has(q.id)) return false
      if (selectedStatus === 'INCOMPLETE' && completedSet.has(q.id)) return false
      if (selectedStatus === 'BOOKMARKED' && !bookmarkedSet.has(q.id)) return false
      if (selectedStatus === 'NEEDS_REVIEW' && !reviewSet.has(q.id)) return false

      return true
    })
  }, [
    questions,
    searchTerm,
    selectedTopic,
    selectedDiff,
    selectedType,
    selectedExp,
    selectedStatus,
    progressState,
  ])

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE))
  const paginatedQuestions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredQuestions.slice(start, start + PAGE_SIZE)
  }, [filteredQuestions, currentPage])

  // Current Subject Progress Stats
  const subjectStats = useMemo(() => {
    return interviewQuestionsProgressService.getSubjectStats(subjectId, questions)
  }, [subjectId, questions, progressState])

  // Handlers
  const handleToggleCompleted = (e: React.MouseEvent, qId: string) => {
    e.preventDefault()
    e.stopPropagation()
    interviewQuestionsProgressService.toggleCompleted(qId, subjectId)
  }

  const handleToggleBookmark = (e: React.MouseEvent, qId: string) => {
    e.preventDefault()
    e.stopPropagation()
    interviewQuestionsProgressService.toggleBookmark(qId, subjectId)
  }

  const handleToggleReview = (e: React.MouseEvent, qId: string) => {
    e.preventDefault()
    e.stopPropagation()
    interviewQuestionsProgressService.toggleNeedsReview(qId)
  }

  const handleRandomQuestion = () => {
    if (!questions.length) return
    const randomQ = questions[Math.floor(Math.random() * questions.length)]
    navigate(`/interview-questions/${subjectId}/${randomQ.id}`)
  }

  if (loading) {
    return (
      <div className="mqb-loading-state" id="mqb-catalog-loading" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <div className="app-route-spinner" style={{ margin: '0 auto 1.5rem', width: 44, height: 44, border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <h3 style={{ color: 'var(--mqb-text-primary)' }}>Loading {subjectId.toUpperCase()} Master Questions...</h3>
        <p style={{ color: 'var(--mqb-text-secondary)' }}>Retrieving 1,000 deep interview questions and line-by-line analyses</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mqb-error-state" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: 'var(--mqb-accent-rose)' }}>Error Loading Subject Bank</h2>
        <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 500, margin: '0 auto 1.5rem' }}>{error}</p>
        <Link to="/interview-questions" className="mqb-action-pill-btn primary">
          ← Back to All Subjects
        </Link>
      </div>
    )
  }

  return (
    <div className="mqb-catalog-view" id={`subject-catalog-${subjectId}`}>
      {/* Catalog Header */}
      <div className="mqb-catalog-header">
        <div className="mqb-breadcrumb">
          <Link to="/interview-questions">Master Question Bank</Link>
          <span>/</span>
          <span style={{ color: 'var(--mqb-text-primary)' }}>{subjectMeta?.name || subjectId.toUpperCase()}</span>
        </div>

        <div className="mqb-catalog-title-row">
          <div className="mqb-catalog-title-wrap">
            <div className="mqb-catalog-icon">{subjectMeta?.icon || '📘'}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h1 className="mqb-catalog-title">{subjectMeta?.name || subjectId.toUpperCase()}</h1>
                <span className="mqb-catalog-count-pill">1,000 Questions</span>
              </div>
              <p style={{ color: 'var(--mqb-text-secondary)', margin: '0.35rem 0 0', fontSize: '0.95rem' }}>
                {subjectMeta?.description}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="mqb-action-pill-btn"
              id="random-q-btn"
              onClick={handleRandomQuestion}
            >
              🎲 Random Question
            </button>
            <Link
              to={`/interview-questions/${subjectId}/practice`}
              className="mqb-action-pill-btn primary"
              id="start-practice-btn"
            >
              ⚡ Practice Mode
            </Link>
            <Link
              to={`/interview-questions/${subjectId}/test`}
              className="mqb-action-pill-btn"
              id="start-test-btn"
            >
              ⏱️ Timed Test
            </Link>
          </div>
        </div>

        {/* Real-time Subject Progress Strip */}
        <div style={{ marginTop: '1.25rem', background: 'var(--mqb-bg-glass)', border: '1px solid var(--mqb-border)', borderRadius: '12px', padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.9rem' }}>
              <strong>{subjectStats.completed}</strong> / {subjectStats.totalQuestions} Solved ({subjectStats.completionPct}%)
            </span>
            <span style={{ fontSize: '0.85rem', color: '#34d399' }}>● Easy: {subjectStats.easyCompleted}/{subjectStats.easyCount}</span>
            <span style={{ fontSize: '0.85rem', color: '#fbbf24' }}>● Med: {subjectStats.intermediateCompleted}/{subjectStats.intermediateCount}</span>
            <span style={{ fontSize: '0.85rem', color: '#f87171' }}>● Diff: {subjectStats.difficultCompleted}/{subjectStats.difficultCount}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--mqb-text-muted)' }}>
            <span>⭐ {subjectStats.bookmarkedCount} Bookmarked</span>
            <span>🚩 {subjectStats.needsReviewCount} Needs Review</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mqb-filter-toolbar" id="catalog-filter-toolbar">
        {/* Quick Fresher Mode Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.15rem', background: selectedDiff === 'EASY' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)', border: selectedDiff === 'EASY' ? '1px solid rgba(16,185,129,0.45)' : '1px solid var(--mqb-border)', borderRadius: '12px', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🌱</span>
            <div>
              <div style={{ fontWeight: 800, color: selectedDiff === 'EASY' ? '#34d399' : 'var(--mqb-text-primary)', fontSize: '0.95rem' }}>
                Fresher-First Learning Path (Questions 1 to 400)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--mqb-text-secondary)', marginTop: '0.15rem' }}>
                Foundational, easy-level interview questions tailored for freshers & campus recruitment.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="mqb-action-pill-btn"
            id="catalog-fresher-mode-toggle"
            onClick={() => {
              setSelectedDiff(selectedDiff === 'EASY' ? 'ALL' : 'EASY')
              setCurrentPage(1)
            }}
            style={{
              background: selectedDiff === 'EASY' ? '#10b981' : 'rgba(16,185,129,0.15)',
              color: selectedDiff === 'EASY' ? '#fff' : '#34d399',
              border: '1px solid rgba(16,185,129,0.4)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {selectedDiff === 'EASY' ? '✓ Showing Easy Only (1–400)' : '🌱 Filter: Easy Questions (1–400)'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mqb-search-row">
          <div className="mqb-search-input-wrap">
            <span className="mqb-search-icon">🔍</span>
            <input
              type="text"
              className="mqb-search-input"
              id="catalog-search-input"
              placeholder={`Search in 1,000 ${subjectMeta?.name || subjectId} questions by title, concept, or tags...`}
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          {searchTerm && (
            <button
              type="button"
              className="mqb-action-pill-btn"
              onClick={() => {
                setSearchTerm('')
                setCurrentPage(1)
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="mqb-select-filters-row">
          {/* Topic */}
          <select
            className="mqb-filter-select"
            id="filter-topic-select"
            value={selectedTopic}
            onChange={e => {
              setSelectedTopic(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="ALL">All Topics ({availableTopics.length})</option>
            {availableTopics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Difficulty */}
          <select
            className="mqb-filter-select"
            id="filter-difficulty-select"
            value={selectedDiff}
            onChange={e => {
              setSelectedDiff(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="ALL">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="DIFFICULT">Difficult</option>
          </select>

          {/* Question Type */}
          <select
            className="mqb-filter-select"
            id="filter-type-select"
            value={selectedType}
            onChange={e => {
              setSelectedType(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="ALL">All Question Types</option>
            <option value="CONCEPTUAL">Conceptual</option>
            <option value="CODE">Code Implementation</option>
            <option value="OUTPUT">Output Prediction</option>
            <option value="DEBUGGING">Debugging</option>
            <option value="COMPARISON">Comparison</option>
            <option value="ARCHITECTURE">Architecture</option>
            <option value="PERFORMANCE">Performance</option>
            <option value="SECURITY">Security</option>
            <option value="SCENARIO">Scenario</option>
            <option value="TRICKY">Tricky Corner Cases</option>
          </select>

          {/* Experience Level */}
          <select
            className="mqb-filter-select"
            id="filter-experience-select"
            value={selectedExp}
            onChange={e => {
              setSelectedExp(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="ALL">All Experience Levels</option>
            <option value="FRESHER">Fresher / Junior</option>
            <option value="1_3_YEARS">1-3 Years</option>
            <option value="3_5_YEARS">3-5 Years</option>
            <option value="5_8_YEARS">5-8 Years (Senior)</option>
            <option value="8_PLUS_YEARS">8+ Years (Staff/Principal)</option>
          </select>

          {/* Status */}
          <select
            className="mqb-filter-select"
            id="filter-status-select"
            value={selectedStatus}
            onChange={e => {
              setSelectedStatus(e.target.value)
              setCurrentPage(1)
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed Only</option>
            <option value="INCOMPLETE">Incomplete Only</option>
            <option value="BOOKMARKED">Bookmarked</option>
            <option value="NEEDS_REVIEW">Needs Review</option>
          </select>

          {/* Reset Filters */}
          {(selectedTopic !== 'ALL' || selectedDiff !== 'ALL' || selectedType !== 'ALL' || selectedExp !== 'ALL' || selectedStatus !== 'ALL' || searchTerm) && (
            <button
              type="button"
              className="mqb-action-pill-btn"
              onClick={() => {
                setSearchTerm('')
                setSelectedTopic('ALL')
                setSelectedDiff('ALL')
                setSelectedType('ALL')
                setSelectedExp('ALL')
                setSelectedStatus('ALL')
                setCurrentPage(1)
              }}
            >
              Reset Filters
            </button>
          )}

          <span style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--mqb-text-muted)' }}>
            Showing <strong>{filteredQuestions.length}</strong> of 1,000 questions
          </span>
        </div>
      </div>

      {/* Questions List */}
      {paginatedQuestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--mqb-bg-glass)', borderRadius: '16px', border: '1px solid var(--mqb-border)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔎</div>
          <h3 style={{ color: 'var(--mqb-text-primary)', margin: '0 0 0.5rem' }}>No Questions Match Your Criteria</h3>
          <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
            Try broadening your search term or resetting your difficulty and topic filters.
          </p>
          <button
            type="button"
            className="mqb-action-pill-btn"
            onClick={() => {
              setSearchTerm('')
              setSelectedTopic('ALL')
              setSelectedDiff('ALL')
              setSelectedType('ALL')
              setSelectedExp('ALL')
              setSelectedStatus('ALL')
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="mqb-question-list" id="catalog-question-list">
          {paginatedQuestions.map(q => {
            const isCompleted = interviewQuestionsProgressService.isCompleted(q.id)
            const isBookmarked = interviewQuestionsProgressService.isBookmarked(q.id)
            const isNeedsReview = interviewQuestionsProgressService.isNeedsReview(q.id)

            return (
              <Link
                key={q.id}
                to={`/interview-questions/${subjectId}/${q.id}`}
                className="mqb-qcard"
                id={`qcard-${q.id}`}
              >
                <div className="mqb-qcard-left">
                  <span className={`mqb-qcard-status-dot ${isCompleted ? 'completed' : ''}`} />
                  <div className="mqb-qcard-info">
                    <div className="mqb-qcard-meta-line">
                      <span className="mqb-qcard-id">{q.id.toUpperCase()}</span>
                      <span className={`mqb-diff-pill ${q.difficulty}`}>{q.difficulty}</span>
                      <span className="mqb-type-pill">{q.questionType}</span>
                      <span className="mqb-tag-pill">{q.topic}</span>
                      <span className="mqb-tag-pill" style={{ color: 'var(--mqb-text-muted)' }}>
                        {q.experienceLevel.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="mqb-qcard-title">{q.question}</h3>
                    <p className="mqb-qcard-snippet">{q.shortAnswer}</p>
                  </div>
                </div>

                <div className="mqb-qcard-actions">
                  {/* Needs review flag */}
                  <button
                    type="button"
                    className={`mqb-icon-btn ${isNeedsReview ? 'active-bookmark' : ''}`}
                    title={isNeedsReview ? 'Marked for review' : 'Flag for review'}
                    aria-label="Flag for review"
                    onClick={(e) => handleToggleReview(e, q.id)}
                  >
                    🚩
                  </button>

                  {/* Bookmark */}
                  <button
                    type="button"
                    className={`mqb-icon-btn ${isBookmarked ? 'active-bookmark' : ''}`}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark question'}
                    aria-label="Bookmark question"
                    onClick={(e) => handleToggleBookmark(e, q.id)}
                  >
                    ⭐
                  </button>

                  {/* Mark Completed */}
                  <button
                    type="button"
                    className={`mqb-icon-btn ${isCompleted ? 'active-completed' : ''}`}
                    title={isCompleted ? 'Mark as Incomplete' : 'Mark as Solved'}
                    aria-label="Mark completed"
                    onClick={(e) => handleToggleCompleted(e, q.id)}
                  >
                    {isCompleted ? '✅' : '⚪'}
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <button
            type="button"
            className="mqb-action-pill-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            ← Previous
          </button>
          <span style={{ fontSize: '0.9rem', color: 'var(--mqb-text-secondary)', padding: '0 0.5rem' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            type="button"
            className="mqb-action-pill-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
