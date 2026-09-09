import React, { useState, useEffect } from 'react'
import type { DSAQuestion, DSASubmission } from '../data/dsaTypes'
import { dsaProgressService } from '../lib/dsaProgressService'

interface Props {
  question: DSAQuestion
  submissions: DSASubmission[]
  onSelectSubmission?: (sub: DSASubmission) => void
}

export const DSAQuestionDetail: React.FC<Props> = ({
  question,
  submissions,
  onSelectSubmission,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'hints' | 'submissions' | 'notes'>('description')
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [isRevisit, setIsRevisit] = useState<boolean>(false)
  const [revealedHints, setRevealedHints] = useState<number>(0)
  const [noteContent, setNoteContent] = useState<string>('')
  const [solutionLang, setSolutionLang] = useState<'javascript' | 'typescript'>('javascript')
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false)

  // Sync state on question change
  useEffect(() => {
    setIsBookmarked(dsaProgressService.isBookmarked(question.id))
    setIsRevisit(dsaProgressService.isRevisit(question.id))
    setNoteContent(dsaProgressService.getNote(question.id))
    setRevealedHints(0)
    setCopiedSolution(false)
  }, [question.id])

  const handleToggleBookmark = () => {
    const newState = dsaProgressService.toggleBookmark(question.id)
    setIsBookmarked(newState)
  }

  const handleToggleRevisit = () => {
    const newState = dsaProgressService.toggleRevisit(question.id)
    setIsRevisit(newState)
  }

  const handleSaveNote = (val: string) => {
    setNoteContent(val)
    dsaProgressService.saveNote(question.id, val)
  }

  const handleCopySolution = () => {
    const text = solutionLang === 'javascript' ? question.solutionJS : question.solutionTS
    navigator.clipboard.writeText(text)
    setCopiedSolution(true)
    setTimeout(() => setCopiedSolution(false), 2000)
  }

  return (
    <div className="dsa-detail-wrapper">
      {/* Top Detail Navigation Tabs */}
      <div className="dsa-detail-tabs">
        <button
          className={`dsa-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          📄 Description
        </button>
        <button
          className={`dsa-tab-btn ${activeTab === 'editorial' ? 'active' : ''}`}
          onClick={() => setActiveTab('editorial')}
        >
          💡 Editorial
        </button>
        <button
          className={`dsa-tab-btn ${activeTab === 'hints' ? 'active' : ''}`}
          onClick={() => setActiveTab('hints')}
        >
          🧩 Hints ({question.hints.length})
        </button>
        <button
          className={`dsa-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          🕒 Submissions ({submissions.length})
        </button>
        <button
          className={`dsa-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          📝 Notes {noteContent.trim() ? '•' : ''}
        </button>
      </div>

      <div className="dsa-detail-body">
        {/* ================= DESCRIPTION TAB ================= */}
        {activeTab === 'description' && (
          <div className="dsa-tab-content">
            <div className="dsa-problem-header">
              <div className="dsa-title-badge-row">
                <h2 className="dsa-problem-title">
                  {question.number}. {question.title}
                </h2>
                <div className="dsa-header-actions">
                  <button
                    className={`dsa-revisit-btn ${isRevisit ? 'revisit' : ''}`}
                    onClick={handleToggleRevisit}
                    title={isRevisit ? 'Marked for Revisit' : 'Mark to Revisit Later'}
                  >
                    {isRevisit ? '⚑ Marked Revisit' : '⚐ Revisit'}
                  </button>
                  <button
                    className={`dsa-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
                    onClick={handleToggleBookmark}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                  >
                    {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
                  </button>
                </div>
              </div>

              <div className="dsa-meta-row">
                <span className={`dsa-diff-pill ${question.difficulty.toLowerCase()}`}>
                  {question.difficulty}
                </span>
                <span className="dsa-topic-pill">{question.topic}</span>
                {question.pattern.map(p => (
                  <span key={p} className="dsa-pattern-pill">{p}</span>
                ))}
              </div>

              {question.companies && question.companies.length > 0 && (
                <div className="dsa-companies-row">
                  <span className="dsa-companies-label">Asked by:</span>
                  {question.companies.map(c => (
                    <span key={c} className="dsa-company-tag">{c}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Problem Statement */}
            <div className="dsa-problem-statement">
              {question.problemStatement.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Examples */}
            <div className="dsa-examples-section">
              <h3>Examples</h3>
              {question.examples.map((ex, idx) => (
                <div key={idx} className="dsa-example-card">
                  <div className="dsa-example-title">Example {idx + 1}:</div>
                  <div className="dsa-example-line">
                    <span className="dsa-ex-label">Input:</span> <code>{ex.input}</code>
                  </div>
                  <div className="dsa-example-line">
                    <span className="dsa-ex-label">Output:</span> <code>{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <div className="dsa-example-line">
                      <span className="dsa-ex-label">Explanation:</span> <span>{ex.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="dsa-constraints-section">
              <h3>Constraints:</h3>
              <ul className="dsa-constraints-list">
                {question.constraints.map((c, idx) => (
                  <li key={idx}><code>{c}</code></li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="dsa-tags-section">
              <h3>Related Topics & Tags:</h3>
              <div className="dsa-tags-list">
                {question.tags.map(t => (
                  <span key={t} className="dsa-tag-chip">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= EDITORIAL TAB ================= */}
        {activeTab === 'editorial' && (
          <div className="dsa-tab-content">
            <div className="dsa-editorial-section">
              <h3>💡 High-Level Approach</h3>
              <p className="dsa-editorial-desc">{question.approach}</p>

              <h3>🎯 Step-by-Step Breakdown</h3>
              <div className="dsa-step-box">
                {question.stepByStepExplanation.split('\n').map((st, i) => (
                  <div key={i} className="dsa-step-item">{st}</div>
                ))}
              </div>

              <div className="dsa-complexity-grid">
                <div className="dsa-complexity-card">
                  <div className="dsa-c-label">Time Complexity</div>
                  <div className="dsa-c-val">{question.timeComplexity}</div>
                </div>
                <div className="dsa-complexity-card">
                  <div className="dsa-c-label">Space Complexity</div>
                  <div className="dsa-c-val">{question.spaceComplexity}</div>
                </div>
                <div className="dsa-complexity-card">
                  <div className="dsa-c-label">Optimal Strategy</div>
                  <div className="dsa-c-val">{question.optimalApproach}</div>
                </div>
              </div>

              <div className="dsa-solution-block">
                <div className="dsa-solution-bar">
                  <div className="dsa-sol-lang-tabs">
                    <button
                      className={`dsa-sol-tab ${solutionLang === 'javascript' ? 'active' : ''}`}
                      onClick={() => setSolutionLang('javascript')}
                    >
                      JavaScript
                    </button>
                    <button
                      className={`dsa-sol-tab ${solutionLang === 'typescript' ? 'active' : ''}`}
                      onClick={() => setSolutionLang('typescript')}
                    >
                      TypeScript
                    </button>
                  </div>
                  <button className="dsa-copy-code-btn" onClick={handleCopySolution}>
                    {copiedSolution ? '✓ Copied!' : '📋 Copy Solution'}
                  </button>
                </div>
                <pre className="dsa-code-display">
                  <code>{solutionLang === 'javascript' ? question.solutionJS : question.solutionTS}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================= HINTS TAB ================= */}
        {activeTab === 'hints' && (
          <div className="dsa-tab-content">
            <div className="dsa-hints-container">
              <p className="dsa-hints-intro">
                Try to solve the problem without revealing all hints at once. Progressively unlock hints if you get stuck:
              </p>

              {question.hints.map((hint, idx) => {
                const isRevealed = idx < revealedHints
                return (
                  <div key={idx} className={`dsa-hint-card ${isRevealed ? 'unlocked' : 'locked'}`}>
                    <div className="dsa-hint-header">
                      <span className="dsa-hint-num">Hint {idx + 1}</span>
                      {!isRevealed && idx === revealedHints && (
                        <button
                          className="dsa-unlock-hint-btn"
                          onClick={() => setRevealedHints(prev => prev + 1)}
                        >
                          👁️ Reveal Hint
                        </button>
                      )}
                    </div>
                    {isRevealed ? (
                      <div className="dsa-hint-text">{hint}</div>
                    ) : (
                      <div className="dsa-hint-placeholder">
                        {idx === revealedHints ? 'Click reveal to read this hint.' : 'Unlock previous hints first.'}
                      </div>
                    )}
                  </div>
                )
              })}

              {revealedHints < question.hints.length && (
                <button
                  className="dsa-reveal-all-btn"
                  onClick={() => setRevealedHints(question.hints.length)}
                >
                  Reveal All Hints
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= SUBMISSIONS TAB ================= */}
        {activeTab === 'submissions' && (
          <div className="dsa-tab-content">
            <div className="dsa-submissions-container">
              <h3>Submission History</h3>
              {submissions.length === 0 ? (
                <div className="dsa-no-subs">
                  <p>You haven't submitted any code for this question yet.</p>
                  <span>Click <strong>Submit</strong> above after testing your solution.</span>
                </div>
              ) : (
                <div className="dsa-submissions-list">
                  {submissions.map((sub, idx) => {
                    const isAccepted = sub.status === 'Accepted'
                    return (
                      <div
                        key={sub.id || idx}
                        className={`dsa-sub-item ${isAccepted ? 'accepted' : 'failed'}`}
                        onClick={() => onSelectSubmission?.(sub)}
                      >
                        <div className="dsa-sub-main">
                          <span className={`dsa-sub-status ${isAccepted ? 'status-ok' : 'status-err'}`}>
                            {sub.status}
                          </span>
                          <span className="dsa-sub-tests">
                            {sub.testsPassed} / {sub.testsTotal} test cases passed
                          </span>
                        </div>
                        <div className="dsa-sub-meta">
                          <span className="dsa-sub-lang">{sub.language}</span>
                          <span className="dsa-sub-runtime">{sub.runtimeMs} ms</span>
                          <span className="dsa-sub-time">
                            {new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= NOTES TAB ================= */}
        {activeTab === 'notes' && (
          <div className="dsa-tab-content">
            <div className="dsa-notes-container">
              <div className="dsa-notes-header">
                <h3>Personal Notes</h3>
                <span className="dsa-notes-autosave">Auto-saved to your device</span>
              </div>
              <textarea
                className="dsa-notes-textarea"
                placeholder="Write down edge cases, patterns, questions to revisit later, or algorithmic complexity takeaways..."
                value={noteContent}
                onChange={e => handleSaveNote(e.target.value)}
                rows={14}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
