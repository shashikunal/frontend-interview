import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuestions } from '../../data/useQuestions'
import { useBookmarks } from '../../context/BookmarkContext'
import { useProgress } from '../../context/ProgressContext'
import type { Question } from '../../models/question'
import './Pathways.css'

export interface CompanyPathway {
  id: string
  name: string
  ticker: string
  sector: string
  icon: string
  accentColor: string
  tagline: string
  levelMapping: string
  salaryRange: string
  interviewFocus: string[]
  hiringBarSummary: string
  rounds: Array<{
    name: string
    duration: string
    type: 'Coding' | 'System Design' | 'Screen' | 'Behavioral'
    description: string
    tips: string[]
  }>
  filterKeywords: string[]
  recommendedTrack: 'balanced' | 'react' | 'javascript' | 'architecture'
}

export default function Pathways() {
  const { questions } = useQuestions()
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const { isSolved, toggleSolved } = useProgress()
  const navigate = useNavigate()

  const [companies, setCompanies] = useState<CompanyPathway[]>([])
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('comp-1')
  const [selectedRoundTab, setSelectedRoundTab] = useState<'rounds' | 'questions' | 'rubric'>('rounds')
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Fetch companies dataset
  useEffect(() => {
    fetch('/data/companies.json')
      .then(res => res.json())
      .then((data: CompanyPathway[]) => {
        setCompanies(data)
        if (data.length > 0) {
          setSelectedCompanyId(data[0].id)
        }
      })
      .catch(err => {
        console.error('Failed to load companies dataset:', err)
      })
  }, [])

  // Sectors list
  const sectors = useMemo(() => {
    const list = Array.from(new Set(companies.map(c => c.sector)))
    return ['All', ...list]
  }, [companies])

  // Filter companies by search & sector
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSector = selectedSector === 'All' || c.sector === selectedSector
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || c.name.toLowerCase().includes(q) ||
        c.ticker.toLowerCase().includes(q) ||
        c.interviewFocus.some(f => f.toLowerCase().includes(q))
      return matchesSector && matchesSearch
    })
  }, [companies, selectedSector, searchQuery])

  // Paginated companies
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredCompanies.slice(start, start + pageSize)
  }, [filteredCompanies, currentPage, pageSize])

  const totalPages = Math.ceil(filteredCompanies.length / pageSize) || 1

  // Active selected company
  const selectedCompany = useMemo(() => {
    return companies.find(c => c.id === selectedCompanyId) || companies[0] || null
  }, [companies, selectedCompanyId])

  // Curate questions for selected company
  const companyQuestions = useMemo(() => {
    if (!questions || !selectedCompany) return []
    const kws = selectedCompany.filterKeywords.map(k => k.toLowerCase())

    let filtered = questions.filter(q => {
      const text = `${q.question} ${q.category} ${q.answer}`.toLowerCase()
      return kws.some(kw => text.includes(kw))
    })

    if (difficultyFilter !== 'All') {
      filtered = filtered.filter(q => q.difficulty === difficultyFilter)
    }

    return filtered.slice(0, 40)
  }, [questions, selectedCompany, difficultyFilter])

  // Readiness calculation
  const solvedCompanyCount = useMemo(() => {
    return companyQuestions.filter(q => isSolved(q.id)).length
  }, [companyQuestions, isSolved])

  const readinessPercentage = companyQuestions.length > 0
    ? Math.round((solvedCompanyCount / companyQuestions.length) * 100)
    : 0

  const launchCompanyMock = () => {
    navigate('/mock-interview')
  }

  return (
    <div className="pathways-page page-enter">
      {/* Header */}
      <div className="pathways-header">
        <div>
          <span className="pathway-badge">🎯 600+ Global Tech Companies Directory</span>
          <h1>Company-Specific Interview Pathways &amp; Mocks</h1>
          <p className="subtitle">
            Explore 620+ top-tier tech companies across Big Tech, Fintech, AI, SaaS, E-Commerce, DevTools, and Unicorn Startups with tailored round structures, rubrics, and high-yield question decks.
          </p>
        </div>
      </div>

      {/* Search & Sector Filter Bar */}
      <div className="companies-filter-card">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="company-search-input"
            placeholder="Search 600+ companies by name, ticker, or tech stack (e.g. Stripe, React, OpenAI)..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => {
                setSearchQuery('')
                setCurrentPage(1)
              }}
            >
              ✕
            </button>
          )}
        </div>

        <div className="sector-pills-row">
          {sectors.map(sec => (
            <button
              key={sec}
              type="button"
              className={`sector-pill ${selectedSector === sec ? 'active' : ''}`}
              onClick={() => {
                setSelectedSector(sec)
                setCurrentPage(1)
              }}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Companies Selector Grid */}
      <div className="companies-selector-grid">
        {paginatedCompanies.map(comp => (
          <button
            key={comp.id}
            type="button"
            className={`company-card ${selectedCompany?.id === comp.id ? 'active' : ''}`}
            onClick={() => setSelectedCompanyId(comp.id)}
          >
            <div className="company-card-top">
              <span className="company-icon">{comp.icon}</span>
              <span className="company-ticker">{comp.ticker}</span>
            </div>
            <h3 className="company-name">{comp.name}</h3>
            <span className="company-sector-badge">{comp.sector}</span>
            <span className="company-levels">{comp.levelMapping}</span>
            <div className="company-tags">
              {comp.interviewFocus.slice(0, 2).map(f => (
                <span key={f} className="focus-pill">{f}</span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="companies-pagination">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          >
            ◀ Prev Page
          </button>
          <span className="page-indicator">
            Page <strong>{currentPage}</strong> of {totalPages} ({filteredCompanies.length} Companies)
          </span>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          >
            Next Page ▶
          </button>
        </div>
      )}

      {/* Selected Company Dossier View */}
      {selectedCompany && (
        <>
          <div className="company-dossier-hero">
            <div className="dossier-hero-left">
              <div className="dossier-title-row">
                <span className="hero-icon">{selectedCompany.icon}</span>
                <div>
                  <h2>{selectedCompany.name} Frontend Pathway</h2>
                  <span className="hero-tagline">{selectedCompany.tagline}</span>
                </div>
              </div>
              <p className="dossier-hiring-bar">{selectedCompany.hiringBarSummary}</p>
              <div className="dossier-meta-row">
                <span className="meta-item">🏢 Sector: <strong>{selectedCompany.sector}</strong></span>
                <span className="meta-item">🎯 Levels: <strong>{selectedCompany.levelMapping}</strong></span>
                <span className="meta-item">💰 Compensation: <strong>{selectedCompany.salaryRange}</strong></span>
              </div>
            </div>

            {/* Readiness Meter & 1-Click Mock Launcher */}
            <div className="dossier-hero-right">
              <div className="readiness-box">
                <span className="readiness-label">Your {selectedCompany.name} Readiness:</span>
                <div className="readiness-bar-wrap">
                  <div className="readiness-bar-fill" style={{ width: `${readinessPercentage}%` }} />
                </div>
                <span className="readiness-stats">{solvedCompanyCount} / {companyQuestions.length} High-Yield Questions Solved ({readinessPercentage}%)</span>
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg launch-company-mock-btn"
                onClick={launchCompanyMock}
              >
                🚀 Launch {selectedCompany.name} Mock Interview
              </button>
            </div>
          </div>

          {/* Pathway Detail Tabs */}
          <div className="pathway-tabs-bar">
            <button
              type="button"
              className={`pathway-tab ${selectedRoundTab === 'rounds' ? 'active' : ''}`}
              onClick={() => setSelectedRoundTab('rounds')}
            >
              📋 {selectedCompany.name} Interview Loop ({selectedCompany.rounds.length} Rounds)
            </button>
            <button
              type="button"
              className={`pathway-tab ${selectedRoundTab === 'questions' ? 'active' : ''}`}
              onClick={() => setSelectedRoundTab('questions')}
            >
              📚 High-Yield Question Deck ({companyQuestions.length} Questions)
            </button>
            <button
              type="button"
              className={`pathway-tab ${selectedRoundTab === 'rubric' ? 'active' : ''}`}
              onClick={() => setSelectedRoundTab('rubric')}
            >
              🏆 {selectedCompany.name} Hiring Bar &amp; Evaluation Rubric
            </button>
          </div>

          {/* 1. ROUNDS TAB */}
          {selectedRoundTab === 'rounds' && (
            <div className="rounds-container">
              <div className="rounds-timeline-list">
                {selectedCompany.rounds.map((round, idx) => (
                  <div key={idx} className="round-card">
                    <div className="round-card-header">
                      <span className="round-step-badge">Stage {idx + 1}</span>
                      <h3>{round.name}</h3>
                      <span className="round-duration">⏱️ {round.duration}</span>
                      <span className={`round-type-badge type-${round.type.toLowerCase().replace(/\s+/g, '-')}`}>{round.type}</span>
                    </div>
                    <p className="round-desc">{round.description}</p>
                    <div className="round-tips-box">
                      <strong>Staff Engineer Tips for this round:</strong>
                      <ul>
                        {round.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. HIGH-YIELD QUESTIONS TAB */}
          {selectedRoundTab === 'questions' && (
            <div className="questions-deck-container">
              <div className="deck-filter-bar">
                <span>Filter by Difficulty:</span>
                <div className="filter-pill-group">
                  {(['All', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                    <button
                      key={diff}
                      type="button"
                      className={`pill-btn ${difficultyFilter === diff ? 'active' : ''}`}
                      onClick={() => setDifficultyFilter(diff)}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="deck-cards-list">
                {companyQuestions.map((q: Question) => (
                  <div key={q.id} className="deck-question-card">
                    <div className="deck-card-top">
                      <div className="deck-card-tags">
                        <span className={`badge badge-category cat-${q.category.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{q.category}</span>
                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                      </div>
                      <div className="deck-card-actions">
                        <button
                          type="button"
                          className={`solved-toggle-btn ${isSolved(q.id) ? 'solved' : ''}`}
                          onClick={() => toggleSolved(q.id)}
                        >
                          {isSolved(q.id) ? '✓ Solved' : '○ Mark Solved'}
                        </button>
                        <button
                          type="button"
                          className={`detail-bookmark-btn ${isBookmarked(q.id) ? 'bookmarked' : ''}`}
                          onClick={() => toggleBookmark(q.id)}
                        >
                          <span className="star-icon">★</span>
                        </button>
                      </div>
                    </div>
                    <h4 className="deck-q-title">{q.question}</h4>
                    <div className="deck-q-footer">
                      <Link to={`/questions/${q.id}`} className="deck-practice-link">
                        Practice Question &amp; View Solution →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. RUBRIC TAB */}
          {selectedRoundTab === 'rubric' && (
            <div className="company-rubric-container">
              <div className="rubric-summary-card">
                <h3>How {selectedCompany.name} Evaluates Frontend Candidates</h3>
                <p>To receive a <strong>Hire / Strong Hire</strong> verdict at {selectedCompany.name}, candidates must demonstrate excellence across these key areas:</p>

                <div className="rubric-pillars-grid">
                  <div className="pillar-box">
                    <h4>1. Technical Mastery ({selectedCompany.interviewFocus[0] || 'Core JS'})</h4>
                    <p>Clean, modular, bug-free implementation of data structures and DOM interfaces with zero reliance on framework shortcuts.</p>
                  </div>
                  <div className="pillar-box">
                    <h4>2. Problem Solving &amp; Speed</h4>
                    <p>Ability to navigate ambiguous product requirements and deliver resilient, tested code under 45-minute interview constraints.</p>
                  </div>
                  <div className="pillar-box">
                    <h4>3. Production Web Vitals</h4>
                    <p>Proactive anticipation of browser bottlenecks (LCP, INP, memory leaks, virtualization, accessible keyboard navigation).</p>
                  </div>
                  <div className="pillar-box">
                    <h4>4. Communication &amp; Leadership</h4>
                    <p>Clear, structured thinking out loud, receptive collaboration with interviewer hints, and strong engineering ownership.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
