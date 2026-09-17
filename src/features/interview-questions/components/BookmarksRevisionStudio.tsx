// src/features/interview-questions/components/BookmarksRevisionStudio.tsx
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import type { MasterQuestion, MasterSubjectId } from '../types/interviewQuestions.types'

export default function BookmarksRevisionStudio() {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'needs_review'>('bookmarks')
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL')
  const [questionsMap, setQuestionsMap] = useState<Map<string, MasterQuestion>>(new Map())
  const [loading, setLoading] = useState<boolean>(true)
  const [progressState, setProgressState] = useState(() => interviewQuestionsProgressService.getState())

  useEffect(() => {
    let mounted = true

    async function loadSavedQuestions() {
      try {
        setLoading(true)
        const relevantIds = [
          ...progressState.bookmarkedQuestionIds,
          ...progressState.needsReviewQuestionIds,
        ]

        // Group by subject prefix: iq-{subject}-{num}
        const subjectsToLoad = new Set<MasterSubjectId>()
        for (const id of relevantIds) {
          const parts = id.split('-')
          if (parts.length >= 2) {
            subjectsToLoad.add(parts[1] as MasterSubjectId)
          }
        }

        const map = new Map<string, MasterQuestion>()
        for (const sub of subjectsToLoad) {
          const qList = await interviewQuestionsDataService.getSubjectQuestions(sub)
          qList.forEach(q => map.set(q.id, q))
        }

        if (mounted) {
          setQuestionsMap(map)
        }
      } catch (err) {
        console.error('Failed to load saved questions:', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadSavedQuestions()

    const handleUpdate = () => {
      setProgressState(interviewQuestionsProgressService.getState())
    }
    window.addEventListener('master_bank_progress_updated', handleUpdate)

    return () => {
      mounted = false
      window.removeEventListener('master_bank_progress_updated', handleUpdate)
    }
  }, [progressState.bookmarkedQuestionIds.length, progressState.needsReviewQuestionIds.length])

  // Questions to display based on active tab
  const displayQuestions = useMemo(() => {
    const targetIds = activeTab === 'bookmarks'
      ? progressState.bookmarkedQuestionIds
      : progressState.needsReviewQuestionIds

    const list: MasterQuestion[] = []
    for (const id of targetIds) {
      const q = questionsMap.get(id)
      if (q) {
        if (selectedSubject === 'ALL' || q.subject === selectedSubject) {
          list.push(q)
        }
      }
    }
    return list
  }, [activeTab, selectedSubject, questionsMap, progressState])

  return (
    <div className="mqb-catalog-view" id="bookmarks-revision-view">
      {/* Header */}
      <div className="mqb-catalog-header">
        <div className="mqb-breadcrumb">
          <Link to="/interview-questions">Master Bank</Link>
          <span>/</span>
          <span>Revision &amp; Bookmarks Hub</span>
        </div>

        <div className="mqb-catalog-title-row">
          <div>
            <h1 className="mqb-catalog-title">⭐ Revision &amp; Bookmarks Hub</h1>
            <p style={{ color: 'var(--mqb-text-secondary)', margin: '0.35rem 0 0' }}>
              Your personalized repository of flagged questions, saved patterns, and high-priority concepts.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/interview-questions/test" className="mqb-action-pill-btn primary">
              ⏱️ Timed Test on Saved
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs & Subject Filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className={`mqb-subnav-link ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            ⭐ Bookmarked ({progressState.bookmarkedQuestionIds.length})
          </button>
          <button
            type="button"
            className={`mqb-subnav-link ${activeTab === 'needs_review' ? 'active' : ''}`}
            onClick={() => setActiveTab('needs_review')}
          >
            🚩 Needs Review ({progressState.needsReviewQuestionIds.length})
          </button>
        </div>

        <div>
          <select
            className="mqb-filter-select"
            value={selectedSubject}
            onChange={e => setSelectedSubject(e.target.value)}
          >
            <option value="ALL">All Subjects</option>
            <option value="javascript">JavaScript</option>
            <option value="react">ReactJS</option>
            <option value="typescript">TypeScript</option>
            <option value="redux">Redux</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="es6">ES6</option>
            <option value="es7">ES7</option>
            <option value="es8">ES8</option>
            <option value="dom">DOM</option>
            <option value="bom">BOM</option>
            <option value="web-apis">Web APIs</option>
          </select>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="app-route-spinner" style={{ margin: '0 auto 1.5rem', width: 40, height: 40, border: '3px solid rgba(56,189,248,0.2)', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: 'var(--mqb-text-secondary)' }}>Loading your saved questions...</p>
        </div>
      ) : displayQuestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--mqb-bg-glass)', borderRadius: '16px', border: '1px solid var(--mqb-border)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            {activeTab === 'bookmarks' ? '⭐' : '🚩'}
          </div>
          <h3 style={{ color: 'var(--mqb-text-primary)', margin: '0 0 0.5rem' }}>
            No {activeTab === 'bookmarks' ? 'Bookmarked Questions' : 'Questions Flagged For Review'}
          </h3>
          <p style={{ color: 'var(--mqb-text-secondary)', maxWidth: 450, margin: '0 auto 1.5rem' }}>
            Browse any of the 12 subject catalogs and click the star or flag icon to organize your personal revision list.
          </p>
          <Link to="/interview-questions" className="mqb-action-pill-btn primary">
            Explore 12,000 Questions →
          </Link>
        </div>
      ) : (
        <div className="mqb-question-list">
          {displayQuestions.map(q => {
            const isCompleted = interviewQuestionsProgressService.isCompleted(q.id)
            const isBookmarked = interviewQuestionsProgressService.isBookmarked(q.id)
            const isNeedsReview = interviewQuestionsProgressService.isNeedsReview(q.id)

            return (
              <Link
                key={q.id}
                to={`/interview-questions/${q.subject}/${q.id}`}
                className="mqb-qcard"
              >
                <div className="mqb-qcard-left">
                  <span className={`mqb-qcard-status-dot ${isCompleted ? 'completed' : ''}`} />
                  <div className="mqb-qcard-info">
                    <div className="mqb-qcard-meta-line">
                      <span className="mqb-qcard-id">{q.id.toUpperCase()}</span>
                      <span className="mqb-tag-pill" style={{ color: '#38bdf8' }}>{q.subject.toUpperCase()}</span>
                      <span className={`mqb-diff-pill ${q.difficulty}`}>{q.difficulty}</span>
                      <span className="mqb-tag-pill">{q.topic}</span>
                    </div>
                    <h3 className="mqb-qcard-title">{q.question}</h3>
                    <p className="mqb-qcard-snippet">{q.shortAnswer}</p>
                  </div>
                </div>

                <div className="mqb-qcard-actions">
                  <button
                    type="button"
                    className={`mqb-icon-btn ${isNeedsReview ? 'active-bookmark' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      interviewQuestionsProgressService.toggleNeedsReview(q.id)
                    }}
                    title="Flag for review"
                  >
                    🚩
                  </button>
                  <button
                    type="button"
                    className={`mqb-icon-btn ${isBookmarked ? 'active-bookmark' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      interviewQuestionsProgressService.toggleBookmark(q.id, q.subject)
                    }}
                    title="Bookmark"
                  >
                    ⭐
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
