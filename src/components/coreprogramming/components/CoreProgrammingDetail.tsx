// src/components/coreprogramming/components/CoreProgrammingDetail.tsx
import React, { useState, useEffect } from 'react';
import type { CoreProgrammingQuestion, CoreProgrammingSubmission } from '../data/coreProgrammingTypes';
import { coreProgrammingProgressService } from '../lib/coreProgrammingProgressService';

interface Props {
  question: CoreProgrammingQuestion;
  submissions?: CoreProgrammingSubmission[];
  onAdoptSolution: (code: string) => void;
  onSelectSubmission?: (sub: CoreProgrammingSubmission) => void;
  fullscreenPanel?: 'none' | 'specs' | 'editor' | 'preview' | 'test';
  onToggleFullscreen?: () => void;
}

export const CoreProgrammingDetail: React.FC<Props> = ({
  question,
  submissions = [],
  onAdoptSolution,
  onSelectSubmission,
  fullscreenPanel = 'none',
  onToggleFullscreen,
}) => {
  const [activeTab, setActiveTab] = useState<'description' | 'editorial' | 'hints' | 'submissions' | 'notes'>('description');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isRevisit, setIsRevisit] = useState<boolean>(false);
  const [revealedHints, setRevealedHints] = useState<number>(0);
  const [checkedList, setCheckedList] = useState<Record<number, boolean>>({});
  const [candidateNote, setCandidateNote] = useState<string>('');
  const [copiedSolution, setCopiedSolution] = useState<boolean>(false);

  // Sync state on question change
  useEffect(() => {
    setIsBookmarked(coreProgrammingProgressService.isBookmarked(question.id));
    setIsRevisit(coreProgrammingProgressService.isRevisit(question.id));
    setCandidateNote(coreProgrammingProgressService.getNote(question.id));
    setRevealedHints(coreProgrammingProgressService.getHintsUsed(question.id) || 0);
    setCopiedSolution(false);
    setCheckedList({});
    setActiveTab('description');
  }, [question.id]);

  const handleToggleBookmark = () => {
    const newState = coreProgrammingProgressService.toggleBookmark(question.id);
    setIsBookmarked(newState);
  };

  const handleToggleRevisit = () => {
    const newState = coreProgrammingProgressService.toggleRevisit(question.id);
    setIsRevisit(newState);
  };

  const handleUnlockHint = () => {
    if (question.hints && revealedHints < question.hints.length) {
      const next = revealedHints + 1;
      setRevealedHints(next);
      coreProgrammingProgressService.incrementHintUsed(question.id);
    }
  };

  const handleRevealAllHints = () => {
    if (question.hints) {
      setRevealedHints(question.hints.length);
      for (let i = revealedHints; i < question.hints.length; i++) {
        coreProgrammingProgressService.incrementHintUsed(question.id);
      }
    }
  };

  const handleSaveNote = (val: string) => {
    setCandidateNote(val);
    coreProgrammingProgressService.saveNote(question.id, val);
  };

  const handleCopySolution = () => {
    navigator.clipboard.writeText(question.solution);
    setCopiedSolution(true);
    setTimeout(() => setCopiedSolution(false), 2000);
  };

  const checklistItems = [
    `Implement function: \`${question.functionName}\` according to specification`,
    `Handle boundary conditions, null/undefined, and falsy values (0, "", false, NaN)`,
    `Ensure target Time Complexity: ${question.timeComplexity || 'O(n)'}`,
    `Ensure target Space Complexity: ${question.spaceComplexity || 'O(1)'}`,
    'Verify all automated assertions pass without mutation leaks',
  ];
  const checkedCount = Object.values(checkedList).filter(Boolean).length;

  return (
    <div className="dsa-detail-wrapper" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Detail Navigation Tabs */}
      <div className="dsa-detail-tabs cp-detail-tabs">
        <div className="cp-detail-tabs-list">
          <button
            type="button"
            className={`dsa-tab-btn cp-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>Description</span>
          </button>
          <button
            type="button"
            className={`dsa-tab-btn cp-tab-btn ${activeTab === 'editorial' ? 'active' : ''}`}
            onClick={() => setActiveTab('editorial')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6" />
              <path d="M10 22h4" />
              <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
            </svg>
            <span>Editorial</span>
          </button>
          <button
            type="button"
            className={`dsa-tab-btn cp-tab-btn ${activeTab === 'hints' ? 'active' : ''}`}
            onClick={() => setActiveTab('hints')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>Hints ({question.hints ? question.hints.length : 0})</span>
          </button>
          <button
            type="button"
            className={`dsa-tab-btn cp-tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Submissions ({submissions.length})</span>
          </button>
          <button
            type="button"
            className={`dsa-tab-btn cp-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Notes {candidateNote.trim() ? '•' : ''}</span>
          </button>
        </div>

        {onToggleFullscreen && (
          <button
            type="button"
            className={`cp-icon-tool-btn cp-fullscreen-btn ${fullscreenPanel === 'specs' ? 'active' : ''}`}
            onClick={onToggleFullscreen}
            title={fullscreenPanel === 'specs' ? 'Restore size (Esc)' : 'Maximize panel'}
            aria-label={fullscreenPanel === 'specs' ? 'Restore size' : 'Maximize panel'}
          >
            {fullscreenPanel === 'specs' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="4 14 10 14 10 20" />
                <polyline points="20 10 14 10 14 4" />
                <line x1="14" y1="10" x2="21" y2="3" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            )}
          </button>
        )}
      </div>

      <div className="dsa-detail-body cp-detail-body">
        {/* ================= 1. DESCRIPTION TAB ================= */}
        {activeTab === 'description' && (
          <div className="dsa-tab-content cp-tab-content">
            {/* Breadcrumbs */}
            <div className="mc-spec-breadcrumb cp-spec-breadcrumb">
              <span>Core Programming</span>
              <span className="mc-spec-breadcrumb-sep">›</span>
              <span>{question.category}</span>
              <span className="mc-spec-breadcrumb-sep">›</span>
              <span className="mc-spec-breadcrumb-current">{question.id}</span>
            </div>

            <div className="dsa-problem-header cp-problem-header">
              <div className="dsa-title-badge-row cp-title-badge-row">
                <h2 className="dsa-problem-title cp-problem-title">
                  {question.id}: {question.title}
                </h2>
                <div className="dsa-header-actions cp-header-actions">
                  <button
                    type="button"
                    className={`cp-action-btn cp-action-revisit ${isRevisit ? 'active' : ''}`}
                    onClick={handleToggleRevisit}
                    title={isRevisit ? 'Marked for Revisit' : 'Mark to Revisit Later'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={isRevisit ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                    <span>{isRevisit ? 'Revisit' : 'Revisit'}</span>
                  </button>
                  <button
                    type="button"
                    className={`cp-action-btn cp-action-bookmark ${isBookmarked ? 'active' : ''}`}
                    onClick={handleToggleBookmark}
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                  </button>
                </div>
              </div>

              <div className="dsa-meta-row cp-meta-row">
                <span className={`dsa-diff-pill cp-diff-pill ${question.difficulty.toLowerCase()}`}>
                  {question.difficulty}
                </span>
                <span className="dsa-topic-pill cp-topic-pill">{question.category}</span>
                {question.expectedTime && (
                  <span className="dsa-pattern-pill cp-pattern-pill">⏱️ {question.expectedTime}</span>
                )}
                {question.questionType && (
                  <span className="dsa-pattern-pill cp-pattern-pill">📦 {question.questionType}</span>
                )}
              </div>
            </div>

            {/* Problem Statement */}
            <div className="dsa-problem-statement cp-problem-statement">
              {question.problemStatement.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Candidate Checklist */}
            <div className="cp-checklist-container">
              <div className="cp-checklist-heading">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
                <span>Candidate Implementation Checklist ({checkedCount}/{checklistItems.length})</span>
              </div>
              <div className="mc-checklist cp-checklist">
                {checklistItems.map((item, idx) => {
                  const isChecked = !!checkedList[idx];
                  return (
                    <label
                      key={idx}
                      className={`mc-checklist-item cp-checklist-item ${isChecked ? 'checked' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setCheckedList(prev => ({ ...prev, [idx]: !isChecked }))}
                      />
                      <span className="mc-checklist-text cp-checklist-text">{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Examples */}
            {question.examples && question.examples.length > 0 && (
              <div className="dsa-examples-section cp-examples-section">
                <h3 className="cp-section-heading">
                  Examples &amp; Expected Outputs
                </h3>
                {question.examples.map((ex, idx) => (
                  <div key={idx} className="dsa-example-card cp-example-card">
                    <div className="cp-example-header">
                      {ex.title || `Example ${idx + 1}`}
                    </div>
                    {ex.input && (
                      <div className="cp-example-row">
                        <span className="cp-example-label">Input:</span>
                        <code className="cp-example-code">{ex.input}</code>
                      </div>
                    )}
                    {ex.output && (
                      <div className="cp-example-row">
                        <span className="cp-example-label">Output:</span>
                        <code className="cp-example-code cp-output-code">{ex.output}</code>
                      </div>
                    )}
                    {ex.explanation && (
                      <div className="cp-example-row cp-explanation-row">
                        <span className="cp-example-label">Explanation:</span>
                        <span className="cp-explanation-text">{ex.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints & Complexity Targets */}
            {question.constraints && question.constraints.length > 0 && (
              <div className="dsa-constraints-section" style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
                  Constraints &amp; Complexity Targets
                </h3>
                <ul className="dsa-constraints-list" style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {question.constraints.map((c, idx) => (
                    <li key={idx} style={{ marginBottom: '4px' }}><code>{c}</code></li>
                  ))}
                  {question.timeComplexity && (
                    <li style={{ marginTop: '4px' }}>Target Time Complexity: <code>{question.timeComplexity}</code></li>
                  )}
                  {question.spaceComplexity && (
                    <li>Target Space Complexity: <code>{question.spaceComplexity}</code></li>
                  )}
                </ul>
              </div>
            )}

            {/* Related Topics & Tags */}
            {question.tags && question.tags.length > 0 && (
              <div className="dsa-tags-section" style={{ marginTop: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Tags &amp; Concepts
                </h3>
                <div className="dsa-tags-list" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {question.tags.map(t => (
                    <span key={t} className="dsa-tag-chip" style={{ fontSize: '11px', padding: '3px 8px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 2. EDITORIAL TAB ================= */}
        {activeTab === 'editorial' && (
          <div className="dsa-tab-content">
            <div className="dsa-editorial-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  💡 Reference Solution &amp; Architectural Rationale
                </h3>
                <div className="cp-editorial-actions">
                  <button
                    type="button"
                    className="cp-copy-code-btn"
                    onClick={handleCopySolution}
                    title="Copy reference code"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>{copiedSolution ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    className="cp-adopt-btn"
                    onClick={() => onAdoptSolution(question.solution)}
                    title="Adopt reference solution into code editor"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
                    </svg>
                    <span>Adopt in Editor</span>
                  </button>
                </div>
              </div>

              {/* Solution Code Block */}
              <pre
                style={{
                  background: '#0d1117',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontFamily: '"Fira Code", monospace, Menlo, Consolas',
                  overflowX: 'auto',
                  color: '#e2e8f0',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  lineHeight: '1.5',
                }}
              >
                <code>{question.solution}</code>
              </pre>

              {/* Complexity Grid */}
              <div className="dsa-complexity-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
                <div className="dsa-complexity-card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div className="dsa-c-label" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time Complexity</div>
                  <div className="dsa-c-val" style={{ fontSize: '14px', fontWeight: 600, color: '#38bdf8', marginTop: '2px' }}>{question.timeComplexity || 'O(n)'}</div>
                </div>
                <div className="dsa-complexity-card" style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(148, 163, 184, 0.1)' }}>
                  <div className="dsa-c-label" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Space Complexity</div>
                  <div className="dsa-c-val" style={{ fontSize: '14px', fontWeight: 600, color: '#34d399', marginTop: '2px' }}>{question.spaceComplexity || 'O(1)'}</div>
                </div>
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent, #818cf8)', marginBottom: '8px' }}>
                    Approach &amp; Trade-offs
                  </h4>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 3. HINTS TAB ================= */}
        {activeTab === 'hints' && (
          <div className="dsa-tab-content">
            <div className="dsa-hints-container">
              <p className="dsa-hints-intro" style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Simulating realistic interview conditions: Try to reason through edge cases before revealing hints.
              </p>

              {question.hints && question.hints.length > 0 ? (
                question.hints.map((hint, idx) => {
                  const isRevealed = idx < revealedHints;
                  return (
                    <div
                      key={idx}
                      className={`dsa-hint-card ${isRevealed ? 'unlocked' : 'locked'}`}
                      style={{
                        padding: '14px',
                        background: isRevealed ? 'rgba(99, 102, 241, 0.08)' : 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid ' + (isRevealed ? 'rgba(99, 102, 241, 0.25)' : 'rgba(148, 163, 184, 0.1)'),
                        borderRadius: '8px',
                        marginBottom: '10px',
                      }}
                    >
                      <div className="dsa-hint-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isRevealed ? '6px' : 0 }}>
                        <span className="dsa-hint-num" style={{ fontWeight: 600, fontSize: '13px', color: isRevealed ? '#818cf8' : 'var(--text-muted)' }}>
                          Hint {idx + 1}
                        </span>
                        {!isRevealed && idx === revealedHints && (
                          <button
                            type="button"
                            className="cp-unlock-hint-btn"
                            onClick={handleUnlockHint}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>Reveal Hint</span>
                          </button>
                        )}
                      </div>
                      {isRevealed ? (
                        <div className="dsa-hint-text" style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          {hint}
                        </div>
                      ) : (
                        <div className="dsa-hint-placeholder" style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          {idx === revealedHints ? 'Click reveal to read this hint.' : 'Unlock preceding hints first.'}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No hints available for this problem.</div>
              )}

              {question.hints && revealedHints < question.hints.length && (
                <button
                  type="button"
                  className="dsa-reveal-all-btn"
                  onClick={handleRevealAllHints}
                  style={{
                    marginTop: '12px',
                    background: 'transparent',
                    border: '1px dashed var(--border-strong)',
                    color: 'var(--text-muted)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Reveal All Hints
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= 4. SUBMISSIONS TAB ================= */}
        {activeTab === 'submissions' && (
          <div className="dsa-tab-content">
            <div className="dsa-submissions-container">
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
                Submission History
              </h3>
              {submissions.length === 0 ? (
                <div className="dsa-no-subs" style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  <p>No recorded submissions for this challenge yet.</p>
                  <span>Click <strong>🏁 Submit</strong> in the topbar to evaluate your solution against all test suites.</span>
                </div>
              ) : (
                <div className="dsa-submissions-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {submissions.map((sub, idx) => {
                    const isAccepted = sub.status === 'Accepted';
                    return (
                      <div
                        key={sub.id || idx}
                        className={`dsa-sub-item ${isAccepted ? 'accepted' : 'failed'}`}
                        onClick={() => onSelectSubmission?.(sub)}
                        style={{
                          padding: '12px 14px',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid ' + (isAccepted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'),
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="dsa-sub-main" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span
                            className={`dsa-sub-status ${isAccepted ? 'status-ok' : 'status-err'}`}
                            style={{ fontWeight: 700, fontSize: '13px', color: isAccepted ? '#34d399' : '#f87171' }}
                          >
                            {sub.status}
                          </span>
                          <span className="dsa-sub-tests" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {sub.testsPassed} / {sub.testsTotal} passed
                          </span>
                        </div>
                        <div className="dsa-sub-meta" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                          <span>⏱️ {sub.runtimeMs} ms</span>
                          <span>{new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= 5. NOTES TAB ================= */}
        {activeTab === 'notes' && (
          <div className="dsa-tab-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="dsa-notes-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="dsa-notes-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Personal Scratchpad</h3>
                <span className="dsa-notes-autosave" style={{ fontSize: '11px', color: '#34d399' }}>Auto-saved to local storage</span>
              </div>
              <textarea
                className="dsa-notes-textarea"
                placeholder="Write your notes, edge cases, time/space complexity notes, or things to remember here..."
                value={candidateNote}
                onChange={e => handleSaveNote(e.target.value)}
                rows={16}
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: '260px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  resize: 'none',
                }}
              />
              {candidateNote && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Clear your notes for this question?')) {
                        handleSaveNote('');
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#f87171',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
