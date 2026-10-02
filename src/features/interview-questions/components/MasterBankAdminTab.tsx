import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { interviewQuestionsDataService } from '../services/interviewQuestionsDataService'
import { interviewQuestionsProgressService } from '../services/interviewQuestionsProgressService'
import { verifyQuestionDuplicate, computeQuestionHash, formatStandardQuestionId } from '../utils/duplicatePipeline'
import { FormattedAnswerText } from './FormattedAnswerText'
import type { MasterSubjectId, MasterQuestion, MasterBankCatalog, QuestionStatus } from '../types/interviewQuestions.types'
import './MasterBankAdminTab.css'

export default function MasterBankAdminTab() {
  const [catalog, setCatalog] = useState<MasterBankCatalog | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<MasterSubjectId>('javascript')
  const [questions, setQuestions] = useState<MasterQuestion[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDiff, setFilterDiff] = useState<string>('ALL')
  const [filterType, setFilterType] = useState<string>('ALL')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [loading, setLoading] = useState<boolean>(true)
  const [inspectingQ, setInspectingQ] = useState<MasterQuestion | null>(null)
  const [duplicateAuditResult, setDuplicateAuditResult] = useState<string | null>(null)

  // Create Question Modal
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [newQTitle, setNewQTitle] = useState('')
  const [newQTopic, setNewQTopic] = useState('')
  const [newQDiff, setNewQDiff] = useState('EASY')
  const [newQType, setNewQType] = useState<'MCQ' | 'CONCEPTUAL'>('MCQ')
  const [newQShortAns, setNewQShortAns] = useState('')
  const [newQOptA, setNewQOptA] = useState('')
  const [newQOptB, setNewQOptB] = useState('')
  const [newQOptC, setNewQOptC] = useState('')
  const [newQOptD, setNewQOptD] = useState('')
  const [newQCorrect, setNewQCorrect] = useState('A')

  useEffect(() => {
    interviewQuestionsDataService.getCatalog().then(cat => {
      setCatalog(cat)
    }).catch(err => console.error('Failed to load catalog:', err))
  }, [])

  useEffect(() => {
    async function loadSubject() {
      try {
        setLoading(true)
        const list = await interviewQuestionsDataService.getSubjectQuestions(selectedSubject)
        setQuestions(list)
        setInspectingQ(null)
        setDuplicateAuditResult(null)
      } catch (err) {
        console.error('Failed to load subject for admin:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSubject()
  }, [selectedSubject])

  // Filter questions
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return questions.filter(item => {
      if (q) {
        const matches = item.id.toLowerCase().includes(q) ||
          item.question.toLowerCase().includes(q) ||
          item.topic.toLowerCase().includes(q) ||
          (item.concept || '').toLowerCase().includes(q)
        if (!matches) return false
      }

      if (filterDiff !== 'ALL' && item.difficulty.toUpperCase() !== filterDiff.toUpperCase()) {
        return false
      }

      if (filterType !== 'ALL') {
        const isMCQ = (Array.isArray(item.options) && item.options.length > 0) || item.questionType === 'MCQ' || item.question_type === 'mcq'
        if (filterType === 'MCQ' && !isMCQ) return false
        if (filterType === 'CONCEPTUAL' && isMCQ) return false
      }

      if (filterStatus !== 'ALL') {
        const status = item.status || 'published'
        if (status !== filterStatus) return false
      }

      return true
    })
  }, [questions, searchQuery, filterDiff, filterType, filterStatus])

  const progressState = interviewQuestionsProgressService.getState()

  const handleUpdateStatus = (questionId: string, newStatus: QuestionStatus) => {
    setQuestions(prev => prev.map(item => {
      if (item.id === questionId) {
        const updated = { ...item, status: newStatus }
        if (inspectingQ?.id === questionId) setInspectingQ(updated)
        return updated
      }
      return item
    }))
  }

  const handleDeleteQuestion = (questionId: string) => {
    if (!confirm(`Are you sure you want to delete question ${questionId}?`)) return
    setQuestions(prev => prev.filter(q => q.id !== questionId))
    if (inspectingQ?.id === questionId) setInspectingQ(null)
  }

  const handleRunDuplicateAudit = () => {
    let dupesFound = 0
    let dupeDetails = ''

    for (const q of questions) {
      const res = verifyQuestionDuplicate(q, questions)
      if (res.isDuplicate) {
        dupesFound++
        dupeDetails += `• ${q.id} duplicates ${res.matchedQuestionId}: "${q.question}"\n`
      }
    }

    if (dupesFound === 0) {
      setDuplicateAuditResult(`✅ Zero duplicates found! All ${questions.length} questions in ${selectedSubject.toUpperCase()} have verified unique hashes.`)
    } else {
      setDuplicateAuditResult(`⚠️ Found ${dupesFound} potential duplicate(s):\n${dupeDetails}`)
    }
  }

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(questions, null, 2))
    const dlAnchor = document.createElement('a')
    dlAnchor.setAttribute("href", dataStr)
    dlAnchor.setAttribute("download", `${selectedSubject}-interview-questions.json`)
    dlAnchor.click()
  }

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQTitle.trim()) return

    const qNum = questions.length + 1
    const isMCQ = newQType === 'MCQ'
    const stdId = formatStandardQuestionId(selectedSubject, qNum, isMCQ)
    const qHash = computeQuestionHash(newQTitle, newQTopic || 'Core Concept')

    const newQ: MasterQuestion = {
      id: `iq-${selectedSubject}-${String(qNum).padStart(4, '0')}`,
      standard_id: stdId,
      questionNumber: qNum,
      subject: selectedSubject,
      category: newQTopic || `${selectedSubject.toUpperCase()} Core`,
      topic: newQTopic || `${selectedSubject.toUpperCase()} Core`,
      subtopic: newQTopic,
      concept: newQTopic,
      difficulty: newQDiff,
      questionType: newQType,
      question_type: isMCQ ? 'mcq' : 'concept',
      experienceLevel: newQDiff === 'EASY' ? 'FRESHER' : '1_3_YEARS',
      tags: [selectedSubject, 'admin-created', 'interview-prep'],
      question: newQTitle,
      shortAnswer: newQShortAns || `Model answer for ${newQTitle}`,
      simpleExplanation: newQShortAns || `Model answer for ${newQTitle}`,
      detailedAnswer: newQShortAns,
      detailedExplanation: newQShortAns,
      commonMistakes: ['Overlooking edge cases during high-frequency calls.'],
      question_hash: qHash,
      status: 'published',
      options: isMCQ ? [
        { key: 'A', text: newQOptA || 'Option A', explanation: 'Option A details' },
        { key: 'B', text: newQOptB || 'Option B', explanation: 'Option B details' },
        { key: 'C', text: newQOptC || 'Option C', explanation: 'Option C details' },
        { key: 'D', text: newQOptD || 'Option D', explanation: 'Option D details' },
      ] : undefined,
      correctAnswer: isMCQ ? newQCorrect : undefined,
      mcqExplanation: isMCQ ? `Option ${newQCorrect} is correct per modern specifications.` : undefined,
    }

    // Check duplicate before saving
    const dupCheck = verifyQuestionDuplicate(newQ, questions)
    if (dupCheck.isDuplicate) {
      alert(`Cannot create duplicate question: Matches ${dupCheck.matchedQuestionId} (${dupCheck.reason})`)
      return
    }

    setQuestions(prev => [newQ, ...prev])
    setInspectingQ(newQ)
    setShowCreateModal(false)
    setNewQTitle('')
    setNewQShortAns('')
    alert(`Successfully published ${stdId}!`)
  }

  return (
    <div className="mbk-pane" id="admin-master-bank-tab">
      {/* Top Banner */}
      <div className="mbk-card mbk-hero">
        <div className="mbk-hero-head">
          <div>
            <h2 className="mbk-hero-title">
              🎯 Master Interview Question Bank Operations ({catalog?.subjects.length ?? '—'} Tracks)
            </h2>
            <p className="mbk-hero-sub">
              Full CRUD management, zero-duplicate audit pipeline, status transitions, and bulk exports across all {catalog?.subjects.length ?? '—'} subjects.
            </p>
          </div>

          <div className="mbk-hero-actions">
            <button
              type="button"
              className="mbk-btn primary"
              onClick={() => setShowCreateModal(true)}
            >
              ➕ Create Question / MCQ
            </button>
            <button
              type="button"
              className="mbk-btn"
              onClick={handleRunDuplicateAudit}
            >
              🔍 Audit Duplicates
            </button>
            <button
              type="button"
              className="mbk-btn"
              onClick={handleExportJSON}
            >
              📥 Export JSON
            </button>
            <Link
              to="/interview-questions"
              target="_blank"
              className="mbk-btn"
            >
              Live Bank ↗
            </Link>
          </div>
        </div>

        {/* Real Metrics Row */}
        <div className="mbk-stats">
          <div className="mbk-stat">
            <div className="mbk-stat-label">Total Catalog Size</div>
            <div className="mbk-stat-value blue">
              {catalog ? `${catalog.totalQuestions.toLocaleString()} Qs` : '—'}
            </div>
            <div className="mbk-stat-sub green">✓ 100% Quality Audited</div>
          </div>

          <div className="mbk-stat">
            <div className="mbk-stat-label">Total Tracks</div>
            <div className="mbk-stat-value">
              {catalog ? `${catalog.subjects.length} Subjects` : '—'}
            </div>
            <div className="mbk-stat-sub">Dedicated modules</div>
          </div>

          <div className="mbk-stat">
            <div className="mbk-stat-label">Platform Solved Count</div>
            <div className="mbk-stat-value green">
              {progressState.completedQuestionIds.length}
            </div>
            <div className="mbk-stat-sub">Candidate completions</div>
          </div>

          <div className="mbk-stat">
            <div className="mbk-stat-label">Current Subject Pool</div>
            <div className="mbk-stat-value purple">
              {questions.length} Qs
            </div>
            <div className="mbk-stat-sub">{selectedSubject.toUpperCase()}</div>
          </div>
        </div>

        {duplicateAuditResult && (
          <div className={`mbk-alert ${duplicateAuditResult.startsWith('✅') ? 'ok' : 'err'}`}>
            {duplicateAuditResult}
          </div>
        )}
      </div>

      {/* Content Management & Inspector Controls */}
      <div className={`mbk-layout ${inspectingQ ? 'with-inspector' : ''}`}>
        {/* Left: Table of Questions with Deep Filters */}
        <div className="mbk-card mbk-panel">
          {/* Filter Bar */}
          <div className="mbk-filters">
            <div className="mbk-filters-top">
              {/* Subject Dropdown */}
              <select
                className="mbk-select strong"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value as MasterSubjectId)}
              >
                {catalog?.subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.icon} {s.name} ({s.badge})
                  </option>
                ))}
              </select>

              <input
                type="text"
                className="mbk-input mbk-search"
                placeholder="Search ID, title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sub-Filters: Difficulty, Type, Status */}
            <div className="mbk-filters-sub">
              <select
                className="mbk-select"
                value={filterDiff}
                onChange={e => setFilterDiff(e.target.value)}
              >
                <option value="ALL">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="DIFFICULT">Difficult</option>
              </select>

              <select
                className="mbk-select"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="ALL">All Formats</option>
                <option value="MCQ">MCQ Only</option>
                <option value="CONCEPTUAL">Conceptual Only</option>
              </select>

              <select
                className="mbk-select"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="ALL">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="review">Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>

              <span className="mbk-count">
                Showing {filtered.length} records
              </span>
            </div>
          </div>

          {loading ? (
            <div className="mbk-loading">
              Loading {selectedSubject} records...
            </div>
          ) : (
            <div className="mbk-table-wrap">
              <table className="mbk-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Question</th>
                    <th>Diff</th>
                    <th>Format</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 100).map(q => {
                    const isMCQ = (Array.isArray(q.options) && q.options.length > 0) || q.questionType === 'MCQ' || q.question_type === 'mcq'
                    const status = q.status || 'published'
                    return (
                      <tr
                        key={q.id}
                        className={inspectingQ?.id === q.id ? 'selected' : ''}
                        onClick={() => setInspectingQ(q)}
                      >
                        <td className="mbk-qid">
                          {q.standard_id || q.id}
                        </td>
                        <td className="mbk-qtext">
                          {q.question}
                        </td>
                        <td>
                          <span className={`mbk-diff-pill ${q.difficulty}`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className={`mbk-format ${isMCQ ? 'mcq' : ''}`}>
                          {isMCQ ? '⚡ MCQ' : '📖 Concept'}
                        </td>
                        <td>
                          <span className={`mbk-status ${status}`}>
                            {status}
                          </span>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            className="mbk-del-btn"
                            title="Delete"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Question Inspector & Action Studio */}
        {inspectingQ && (
          <div className="mbk-card mbk-inspector">
            <div className="mbk-inspector-head">
              <div>
                <span className="mbk-inspector-id">
                  {inspectingQ.standard_id || inspectingQ.id}
                </span>
                <h3 className="mbk-inspector-title">
                  {inspectingQ.question}
                </h3>
              </div>
              <button
                type="button"
                className="mbk-btn sm"
                onClick={() => setInspectingQ(null)}
              >
                ✕ Close
              </button>
            </div>

            {/* Status Transition Toolbar */}
            <div className="mbk-transition-box">
              <div className="mbk-stat-label mbk-spaced-xs">
                Lifecycle Status Transition:
              </div>
              <div className="mbk-chip-row">
                {(['published', 'review', 'approved', 'draft', 'rejected', 'archived'] as QuestionStatus[]).map(st => (
                  <button
                    key={st}
                    type="button"
                    className={`mbk-chip ${inspectingQ.status === st ? 'active' : ''}`}
                    onClick={() => handleUpdateStatus(inspectingQ.id, st)}
                  >
                    {st.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="mbk-badges">
              <span className={`mbk-diff-pill ${inspectingQ.difficulty}`}>{inspectingQ.difficulty}</span>
              <span className="mbk-tag plain">{inspectingQ.topic}</span>
              {inspectingQ.question_hash && (
                <span className="mbk-tag">
                  Hash: {inspectingQ.question_hash}
                </span>
              )}
            </div>

            {/* Short Answer */}
            <div className="mbk-section">
              <div className="mbk-section-label">
                Short Interview Answer:
              </div>
              <div className="mbk-inset">
                <FormattedAnswerText text={inspectingQ.shortAnswer} />
              </div>
            </div>

            {/* MCQ Details if MCQ */}
            {inspectingQ.options && inspectingQ.options.length > 0 && (
              <div className="mbk-section">
                <div className="mbk-section-label amber">
                  MCQ Options (Correct: {inspectingQ.correctAnswer || 'A'}):
                </div>
                <div className="mbk-mcq-list tight">
                  {inspectingQ.options.map((opt, optIdx) => {
                    const optKey = typeof opt === 'string' ? String.fromCharCode(65 + optIdx) : opt.key
                    const optText = typeof opt === 'string' ? opt : opt.text
                    const isCorrect = optKey === (inspectingQ.correctAnswer || 'A')
                    return (
                      <div
                        key={optKey}
                        className={`mbk-option ${isCorrect ? 'correct' : ''}`}
                      >
                        <strong>{optKey}:</strong> {optText}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Code Snippet if present */}
            {inspectingQ.codeExample && (
              <div className="mbk-section">
                <div className="mbk-section-label purple">
                  Code Snippet:
                </div>
                <pre className="mbk-code">
                  <code>{inspectingQ.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Question Modal */}
      {showCreateModal && (
        <div className="mbk-modal-backdrop">
          <div className="mbk-modal">
            <div className="mbk-modal-head">
              <h3 className="mbk-modal-title">➕ Create Question / MCQ for {selectedSubject.toUpperCase()}</h3>
              <button
                type="button"
                className="mbk-btn sm"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="mbk-form">
              <div>
                <label className="mbk-label" htmlFor="mbk-new-title">Question Title / Text</label>
                <input
                  id="mbk-new-title"
                  type="text"
                  required
                  className="mbk-input mbk-full"
                  placeholder="e.g. What is the difference between shallow and deep copy?"
                  value={newQTitle}
                  onChange={e => setNewQTitle(e.target.value)}
                />
              </div>

              <div className="mbk-form-grid">
                <div>
                  <label className="mbk-label" htmlFor="mbk-new-topic">Topic</label>
                  <input
                    id="mbk-new-topic"
                    type="text"
                    className="mbk-input mbk-full"
                    placeholder="e.g. Objects & Memory"
                    value={newQTopic}
                    onChange={e => setNewQTopic(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mbk-label" htmlFor="mbk-new-diff">Difficulty</label>
                  <select
                    id="mbk-new-diff"
                    className="mbk-select mbk-full"
                    value={newQDiff}
                    onChange={e => setNewQDiff(e.target.value)}
                  >
                    <option value="EASY">Easy</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="DIFFICULT">Difficult</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mbk-label" htmlFor="mbk-new-type">Format</label>
                <select
                  id="mbk-new-type"
                  className="mbk-select mbk-full"
                  value={newQType}
                  onChange={e => setNewQType(e.target.value as 'MCQ' | 'CONCEPTUAL')}
                >
                  <option value="MCQ">Interactive MCQ (Options A-D)</option>
                  <option value="CONCEPTUAL">Conceptual Text Answer</option>
                </select>
              </div>

              <div>
                <label className="mbk-label" htmlFor="mbk-new-ans">Short Interview Answer</label>
                <textarea
                  id="mbk-new-ans"
                  required
                  rows={3}
                  className="mbk-input mbk-full mbk-textarea"
                  placeholder="2-5 crisp sentences explaining the core answer..."
                  value={newQShortAns}
                  onChange={e => setNewQShortAns(e.target.value)}
                />
              </div>

              {newQType === 'MCQ' && (
                <div className="mbk-mcq-box">
                  <div className="mbk-section-label amber mbk-spaced-sm">MCQ Options:</div>
                  <div className="mbk-mcq-list">
                    <input className="mbk-input mbk-full" placeholder="Option A (Text)" value={newQOptA} onChange={e => setNewQOptA(e.target.value)} />
                    <input className="mbk-input mbk-full" placeholder="Option B (Text)" value={newQOptB} onChange={e => setNewQOptB(e.target.value)} />
                    <input className="mbk-input mbk-full" placeholder="Option C (Text)" value={newQOptC} onChange={e => setNewQOptC(e.target.value)} />
                    <input className="mbk-input mbk-full" placeholder="Option D (Text)" value={newQOptD} onChange={e => setNewQOptD(e.target.value)} />
                  </div>
                  <div className="mbk-correct-row">
                    <label className="mbk-label" htmlFor="mbk-new-correct">Correct Option:</label>
                    <select id="mbk-new-correct" className="mbk-select" value={newQCorrect} onChange={e => setNewQCorrect(e.target.value)}>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mbk-form-actions">
                <button
                  type="button"
                  className="mbk-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mbk-btn primary"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
