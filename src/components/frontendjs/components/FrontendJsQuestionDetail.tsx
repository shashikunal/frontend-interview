// src/components/frontendjs/components/FrontendJsQuestionDetail.tsx
import React, { useState, useEffect } from 'react'
import type { FrontendJsQuestion, FrontendJsReport } from '../data/frontendJsTypes'
import { frontendJsProgressService } from '../lib/frontendJsProgressService'

interface Props {
  question: FrontendJsQuestion
  fullscreenPanel: 'none' | 'specs' | 'editor' | 'preview'
  onToggleFullscreen: () => void
  onAdoptSolution: (code: string) => void
  testResultsCount?: { passed: number; total: number } | null
  activeTab: 'specs' | 'rubric' | 'solution' | 'tests' | 'notes'
  onTabChange: (tab: 'specs' | 'rubric' | 'solution' | 'tests' | 'notes') => void
}

export function FrontendJsQuestionDetail({
  question,
  fullscreenPanel,
  onToggleFullscreen,
  onAdoptSolution,
  testResultsCount,
  activeTab,
  onTabChange,
}: Props) {
  const [unlockedHints, setUnlockedHints] = useState<number>(0)
  const [checkedList, setCheckedList] = useState<Record<number, boolean>>({})
  const [candidateNote, setCandidateNote] = useState<string>('')
  const [noteSavedAt, setNoteSavedAt] = useState<string>('')

  // Candidate Reporting Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false)
  const [reportType, setReportType] = useState<FrontendJsReport['reportType']>('Incorrect question')
  const [reportDescription, setReportDescription] = useState<string>('')
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false)

  useEffect(() => {
    setUnlockedHints(frontendJsProgressService.getHintsUsed(question.id))
    setCandidateNote(frontendJsProgressService.getNote(question.id))
    setNoteSavedAt('')
    setCheckedList({})
    setReportSubmitted(false)
  }, [question.id])

  const unlockNextHint = () => {
    if (unlockedHints < question.hints.length) {
      const next = unlockedHints + 1
      setUnlockedHints(next)
      frontendJsProgressService.incrementHintUsed(question.id)
    }
  }

  const handleSaveNote = () => {
    frontendJsProgressService.saveNote(question.id, candidateNote)
    setNoteSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
  }

  const handleDeleteNote = () => {
    if (window.confirm('Clear all notes for this challenge?')) {
      setCandidateNote('')
      frontendJsProgressService.saveNote(question.id, '')
      setNoteSavedAt('')
    }
  }

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportDescription.trim()) return

    frontendJsProgressService.addReport({
      id: `rep_${Date.now().toString(36)}`,
      questionId: question.id,
      reportType,
      description: reportDescription.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    })
    setReportSubmitted(true)
    setTimeout(() => {
      setIsReportModalOpen(false)
      setReportDescription('')
      setReportSubmitted(false)
    }, 1500)
  }

  // Derive Checklist items from question requirements or constraints
  const checklistItems = [
    `Implement function: \`${question.functionName}\` adhering to specs`,
    `Handle boundary values, empty inputs, and null/undefined`,
    `Ensure target Time Complexity: ${question.timeComplexity || 'O(n)'}`,
    `Ensure target Space Complexity: ${question.spaceComplexity || 'O(1)'}`,
    'Validate all automated unit assertions pass cleanly',
  ]

  const checkedCount = Object.values(checkedList).filter(Boolean).length

  return (
    <>
      <div className="mc-spec-tabs">
        <div className="mc-spec-tabs-list">
          <button
            type="button"
            className={`mc-spec-tab ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => onTabChange('specs')}
          >
            Specs
          </button>
          <button
            type="button"
            className={`mc-spec-tab ${activeTab === 'rubric' ? 'active' : ''}`}
            onClick={() => onTabChange('rubric')}
          >
            Rubric
          </button>
          <button
            type="button"
            className={`mc-spec-tab ${activeTab === 'solution' ? 'active' : ''}`}
            onClick={() => onTabChange('solution')}
          >
            💡 Solution
          </button>
          <button
            type="button"
            className={`mc-spec-tab ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => onTabChange('tests')}
          >
            🧪 Tests {testResultsCount ? `(${testResultsCount.passed}/${testResultsCount.total})` : ''}
          </button>
          <button
            type="button"
            className={`mc-spec-tab ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => onTabChange('notes')}
          >
            📝 Notes {candidateNote.trim() ? '●' : ''}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            className="mc-icon-tool-btn"
            onClick={() => setIsReportModalOpen(true)}
            title="Report problem issue or bug"
            style={{ fontSize: '13px' }}
          >
            🚩
          </button>
          <button
            type="button"
            className={`mc-icon-tool-btn ${fullscreenPanel === 'specs' ? 'active' : ''}`}
            onClick={onToggleFullscreen}
            title={fullscreenPanel === 'specs' ? 'Restore Specs Size (Esc)' : 'Maximize Specs (Fullscreen)'}
          >
            {fullscreenPanel === 'specs' ? '⤓' : '⛶'}
          </button>
        </div>
      </div>

      <div className="mc-spec-content">
        {/* TAB 1: SPECS */}
        {activeTab === 'specs' && (
          <div>
            <h2 className="mc-spec-title">{question.id}: {question.title}</h2>
            <div className="mc-spec-tags">
              <span className={`mc-badge ${question.difficulty.toLowerCase()}`}>
                {question.difficulty}
              </span>
              <span className="mc-spec-tag-time">⏱️ {question.timeEstimate || '15 mins'}</span>
              <span className="mc-spec-tag-cat">🏷️ {question.category}</span>
              {question.companyTags && question.companyTags.length > 0 && (
                <span className="mc-spec-tag-cat">🏢 {question.companyTags.slice(0, 3).join(', ')}</span>
              )}
              {question.startupTag && (
                <span className="mc-spec-tag-cat">⚡ {question.startupTag}</span>
              )}
            </div>

            {/* Problem Statement */}
            <div className="mc-spec-section-heading">
              <span>📋</span> Problem Statement
            </div>
            <div className="mc-spec-problem-box">
              <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', margin: 0 }}>
                {question.problemStatement || (question as any).description}
              </p>
            </div>

            {/* Candidate Checklist */}
            <h4 className="mc-checklist-heading">
              Candidate Checklist ({checkedCount}/{checklistItems.length}):
            </h4>
            <div className="mc-checklist">
              {checklistItems.map((item, idx) => {
                const isChecked = !!checkedList[idx]
                return (
                  <label key={idx} className={`mc-checklist-item ${isChecked ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => setCheckedList(prev => ({ ...prev, [idx]: !isChecked }))}
                    />
                    <span className="mc-checklist-text">{item}</span>
                  </label>
                )
              })}
            </div>

            {/* Examples & Test Scenarios */}
            {question.examples && question.examples.length > 0 && (
              <>
                <div className="mc-spec-section-heading">
                  <span>🧪</span> Examples &amp; Expected Outputs
                </div>
                <div className="mc-spec-examples-list">
                  {question.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="mc-spec-example-card">
                      <div className="mc-spec-example-title">{ex.title || `Example ${exIdx + 1}`}</div>
                      {ex.input && (
                        <div className="mc-spec-example-row">
                          <span className="mc-spec-example-label">Input:</span>
                          <code>{ex.input}</code>
                        </div>
                      )}
                      {ex.output && (
                        <div className="mc-spec-example-row">
                          <span className="mc-spec-example-label">Output:</span>
                          <code>{ex.output}</code>
                        </div>
                      )}
                      {ex.explanation && (
                        <div className="mc-spec-example-row">
                          <span className="mc-spec-example-label">Explanation:</span>
                          <span>{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Technical Constraints */}
            {question.constraints && question.constraints.length > 0 && (
              <>
                <div className="mc-spec-section-heading">
                  <span>⚡</span> Technical Constraints
                </div>
                <ul className="mc-spec-constraints-list">
                  {question.constraints.map((c, cIdx) => (
                    <li key={cIdx} className="mc-spec-constraint-item">
                      <span className="mc-spec-constraint-bullet">▸</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Progressive Hints */}
            {question.hints && question.hints.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <div className="mc-spec-section-heading">
                  <span>💡</span> Progressive Interview Hints ({unlockedHints}/{question.hints.length})
                </div>
                {question.hints.slice(0, unlockedHints).map((hint, hIdx) => (
                  <div key={hIdx} className="mc-spec-example-card" style={{ marginBottom: '8px' }}>
                    <div className="mc-spec-example-title" style={{ color: '#38bdf8' }}>Hint #{hIdx + 1}</div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{hint}</div>
                  </div>
                ))}
                {unlockedHints < question.hints.length && (
                  <button
                    type="button"
                    className="mc-btn-primary mc-btn-sm"
                    onClick={unlockNextHint}
                    style={{ marginTop: '6px' }}
                  >
                    🔓 Unlock Hint #{unlockedHints + 1}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RUBRIC */}
        {activeTab === 'rubric' && (
          <div>
            <h3 className="mc-rubric-heading">
              Senior Staff Evaluation Rubric
            </h3>

            <div className="mc-interview-card">
              <div className="mc-interview-title">🎯 What Interviewers Look For:</div>
              <ul className="mc-interview-list">
                <li>Optimal Time Complexity: <strong>{question.timeComplexity || 'O(n)'}</strong></li>
                <li>Optimal Space Complexity: <strong>{question.spaceComplexity || 'O(1)'}</strong></li>
                <li>Clear algorithmic rationale before jumping into implementation</li>
                <li>Handling boundary conditions: empty structures, negative values, null/undefined</li>
                <li>Idiomatic ES2026 JavaScript with clean separation of logic</li>
              </ul>
            </div>

            <div className="mc-pitfalls-card">
              <div className="mc-pitfalls-title">⚠️ Common Candidate Traps:</div>
              <ul className="mc-pitfalls-list">
                <li>Direct mutation of input arrays or objects when pure returns are expected</li>
                <li>Missing edge case: empty strings, single-element collections, NaN comparisons</li>
                <li>Inefficient O(n²) string concatenations or nested loops</li>
                <li>Assuming arguments will always match exact primitive types</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: SOLUTION */}
        {activeTab === 'solution' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '15px', color: '#c084fc' }}>Senior Staff Reference Solution</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)' }}>
                  Language: JavaScript (ES2026 Standard)
                </span>
              </div>
              <button
                type="button"
                className="mc-btn-primary mc-btn-sm"
                onClick={() => onAdoptSolution(question.solution || (question as any).solutionCode)}
              >
                Copy to Editor
              </button>
            </div>
            <pre style={{
              background: '#0d1117',
              padding: '14px',
              borderRadius: '8px',
              border: '1px solid #30363d',
              fontSize: '12px',
              overflowX: 'auto',
              color: '#e6edf3',
              lineHeight: '1.5'
            }}>
              {question.solution || (question as any).solutionCode}
            </pre>
            {question.explanation && (
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '13px', color: '#38bdf8' }}>Solution Approach &amp; Explanation</h4>
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>{question.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTES */}
        {activeTab === 'notes' && (
          <div>
            <div className="mc-notes-header">
              <div>
                <h3 className="mc-notes-title">Candidate Scratchpad &amp; Revision Notes</h3>
                <p className="mc-notes-subtitle">Private notes scoped to your account and this challenge. Saved locally and synced.</p>
              </div>
              {noteSavedAt && <span className="mc-notes-saved-badge">✓ Last saved {noteSavedAt}</span>}
            </div>
            <textarea
              className="mc-notes-textarea"
              value={candidateNote}
              onChange={(e) => setCandidateNote(e.target.value)}
              placeholder="Document your architecture decisions, edge cases, interviewer discussions, time/space complexity, or revision notes for this challenge..."
              rows={12}
            />
            <div className="mc-notes-actions">
              <div className="mc-notes-stats">
                <span>{candidateNote.length} characters</span>
                <span>•</span>
                <span>{candidateNote.trim() ? candidateNote.trim().split(/\s+/).length : 0} words</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {candidateNote.trim() && (
                  <button
                    type="button"
                    className="btn btn-ghost-danger btn-sm"
                    onClick={handleDeleteNote}
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                  >
                    🗑️ Clear
                  </button>
                )}
                <button
                  type="button"
                  className="mc-btn-primary mc-btn-sm"
                  onClick={handleSaveNote}
                >
                  💾 Save Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Report Modal */}
      {isReportModalOpen && (
        <div className="fjs-modal-overlay" onClick={() => setIsReportModalOpen(false)}>
          <div className="fjs-modal-card" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="fjs-modal-header">
              <h3 style={{ margin: 0, fontSize: '16px' }}>🚩 Report Problem Issue</h3>
              <button type="button" className="fjs-modal-close" onClick={() => setIsReportModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSendReport} style={{ padding: '20px' }}>
              {reportSubmitted ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#34d399' }}>
                  ✓ Report submitted successfully. Our engineering team will review it.
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>
                      Issue Category
                    </label>
                    <select
                      className="mc-select"
                      style={{ width: '100%' }}
                      value={reportType}
                      onChange={e => setReportType(e.target.value as any)}
                    >
                      <option value="Incorrect question">Incorrect question statement</option>
                      <option value="Incorrect test case">Incorrect test case</option>
                      <option value="Ambiguous description">Ambiguous description</option>
                      <option value="Solution flaw">Flawed reference solution</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '6px', color: '#94a3b8' }}>
                      Detailed Explanation
                    </label>
                    <textarea
                      className="mc-notes-textarea"
                      rows={4}
                      placeholder="Explain the discrepancy, expected vs actual behavior..."
                      value={reportDescription}
                      onChange={e => setReportDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      type="button"
                      className="mc-action-btn"
                      onClick={() => setIsReportModalOpen(false)}
                      style={{ background: 'none', border: '1px solid rgba(148,163,184,0.3)' }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="mc-btn-primary mc-btn-sm">
                      Submit Report
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
