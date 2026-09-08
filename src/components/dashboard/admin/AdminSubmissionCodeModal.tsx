import { useState, useEffect } from 'react'
import type { AdminSubmissionItem } from '../../../lib/adminAnalyticsService'
import { gradingService, type EvaluatorReview } from '../../../lib/gradingService'
import { CandidateSkillRadar } from '../CandidateSkillRadar'

interface AdminSubmissionCodeModalProps {
  submission: AdminSubmissionItem | null
  onClose: () => void
  onSaveReview?: (review: EvaluatorReview) => void
}

export default function AdminSubmissionCodeModal({
  submission,
  onClose,
  onSaveReview,
}: AdminSubmissionCodeModalProps) {
  const [activeTab, setActiveTab] = useState<'code' | 'grade' | 'radar'>('code')
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Grading State
  const [manualScore, setManualScore] = useState<number>(100)
  const [cleanCodeRating, setCleanCodeRating] = useState<number>(9)
  const [architectureRating, setArchitectureRating] = useState<number>(9)
  const [edgeCasesRating, setEdgeCasesRating] = useState<number>(8)
  const [decision, setDecision] = useState<'approved' | 'needs_work' | 'rejected'>('approved')
  const [notes, setNotes] = useState<string>('')
  const [existingReview, setExistingReview] = useState<EvaluatorReview | null>(null)
  const [candidateReviews, setCandidateReviews] = useState<Record<string, EvaluatorReview>>({})

  useEffect(() => {
    if (!submission) return
    setManualScore(submission.score ?? 100)
    setDecision(submission.score >= 70 ? 'approved' : 'needs_work')

    // Fetch existing review if available
    gradingService.getReviewForSubmission(submission.id).then(rev => {
      if (rev) {
        setExistingReview(rev)
        setManualScore(rev.score)
        setCleanCodeRating(rev.cleanCodeRating)
        setArchitectureRating(rev.architectureRating)
        setEdgeCasesRating(rev.edgeCasesRating)
        setDecision(rev.decision)
        setNotes(rev.notes)
      } else {
        setNotes(
          submission.score >= 100
            ? 'Candidate delivered an optimal, production-grade implementation. Clean state isolation and passing all automated test suites.'
            : 'Good initial attempt. Consider optimizing component re-renders and handling boundary edge cases.'
        )
      }
    })

    // Fetch all reviews for this candidate
    if (submission.userId) {
      gradingService.getCandidateReviews(submission.userId).then(list => {
        const map: Record<string, EvaluatorReview> = {}
        list.forEach(r => { map[r.submissionId] = r })
        setCandidateReviews(map)
      })
    }
  }, [submission])

  if (!submission) return null

  const codeContent = submission.code || '// No source code recorded for this submission.'
  const lines = codeContent.split('\n')
  const lang = submission.language || 'typescript'

  const handleCopy = () => {
    if (codeContent) {
      navigator.clipboard.writeText(codeContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const ext = lang === 'typescript' ? 'ts' : lang === 'react' ? 'tsx' : 'js'
    const filename = `submission_${submission.userName?.toLowerCase().replace(/\s+/g, '_') || 'code'}_q${submission.questionId}.${ext}`
    const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSaveEvaluation = async () => {
    setIsSaving(true)
    const review: EvaluatorReview = {
      submissionId: submission.id,
      candidateId: submission.userId,
      candidateName: submission.userName,
      candidateEmail: submission.userEmail,
      questionId: submission.questionId,
      questionTitle: submission.questionTitle,
      score: manualScore,
      cleanCodeRating,
      architectureRating,
      edgeCasesRating,
      decision,
      notes: notes.trim(),
      evaluatorName: 'Platform Administrator',
      evaluatedAt: new Date().toISOString(),
    }

    const ok = await gradingService.saveEvaluatorReview(review)
    setIsSaving(false)
    if (ok) {
      setExistingReview(review)
      setSavedSuccess(true)
      onSaveReview?.(review)
      setTimeout(() => setSavedSuccess(false), 3500)
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-card submission-code-modal"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '1050px',
          width: '96%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface, #1e293b)',
          color: 'var(--text-primary, #f8fafc)',
        }}
      >
        {/* Modal Header */}
        <div className="am-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="candidate-track-tag">
                {submission.isMachineCoding ? '⚡ Machine Coding Challenge' : 'Code Submission'}
              </span>
              {existingReview && (
                <span className="submission-pill accepted" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '11px' }}>
                  ✓ Evaluator Graded ({existingReview.score}%)
                </span>
              )}
            </div>
            <h2 style={{ margin: '4px 0 2px', fontSize: '1.35rem' }}>
              {submission.questionTitle ? `${submission.questionTitle} (#${submission.questionId})` : `Question #${submission.questionId}`}
            </h2>
            <p className="am-sub" style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Candidate: <strong>{submission.userName || 'Candidate'}</strong> ({submission.userEmail}) • Language: <strong>{lang.toUpperCase()}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '8px', marginRight: '8px' }}>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'code' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('code')}
                style={{ padding: '4px 12px', fontSize: '12px' }}
              >
                📄 Code View
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'grade' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('grade')}
                style={{ padding: '4px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>⭐</span>
                <span>Grading &amp; Review</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'radar' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setActiveTab('radar')}
                style={{ padding: '4px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <span>📊</span>
                <span>Skill Radar</span>
              </button>
            </div>

            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
              💾 Download
            </button>
            <button type="button" className="am-close-btn" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="am-body" style={{ overflowY: 'auto', flex: 1, padding: '20px 24px' }}>
          {/* Highlights Ribbon */}
          <div className="scm-meta-bar" style={{ marginBottom: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="scm-meta-tag">
              Automated Status: <span className={`submission-pill ${submission.status === 'accepted' ? 'accepted' : 'wrong'}`}>{submission.status}</span>
            </div>
            <div className="scm-meta-tag">
              Current Marks:{' '}
              <strong style={{ color: (existingReview?.score ?? submission.score) >= 100 ? '#10b981' : '#3b82f6' }}>
                {existingReview?.score ?? submission.score}%
              </strong>
            </div>
            <div className="scm-meta-tag">
              Exec Time: <strong>{submission.executionTime > 0 ? `${submission.executionTime}ms` : '35ms'}</strong>
            </div>
            <div className="scm-meta-tag">
              Submitted: <strong>{new Date(submission.createdAt).toLocaleString()}</strong>
            </div>
          </div>

          {savedSuccess && (
            <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '10px', color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span>✅</span>
              <span><strong>Evaluation Saved!</strong> Marks updated and published to candidate's portfolio dossier in Supabase.</span>
            </div>
          )}

          {activeTab === 'code' ? (
            /* Code Editor View */
            <div className="acm-editor-frame" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div className="acm-editor-header" style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="dot red" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                  <span className="dot yellow" style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
                  <span className="dot green" style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  <span style={{ marginLeft: '8px', fontWeight: 600 }}>submission.{lang === 'typescript' ? 'ts' : lang === 'react' ? 'tsx' : 'js'}</span>
                </div>
                <div className="acm-editor-meta" style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)' }}>
                  <span>{lines.length} lines</span>
                  <span>•</span>
                  <span>{codeContent.length} chars</span>
                </div>
              </div>

              <div className="acm-code-scroll" style={{ display: 'flex', maxHeight: '520px', overflowY: 'auto', background: '#0d1117' }}>
                <div className="acm-gutter" style={{ padding: '14px 10px', borderRight: '1px solid rgba(255,255,255,0.08)', userSelect: 'none', color: '#6e7681', textAlign: 'right', minWidth: '40px', fontSize: '12px', fontFamily: 'monospace' }}>
                  {lines.map((_, index) => (
                    <div key={index} className="acm-line-num">{index + 1}</div>
                  ))}
                </div>
                <pre className="acm-code-block" style={{ margin: 0, padding: '14px 16px', color: '#e6edf3', fontSize: '13px', lineHeight: '1.5', fontFamily: 'monospace', flex: 1 }}>
                  <code>
                    {lines.map((line, idx) => (
                      <div key={idx} className="acm-code-line">{line || ' '}</div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>
          ) : (
            /* Evaluator Grading Studio View */
            <div className="admin-grading-studio" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Row 1: Marks Adjustment & Hiring Decision */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {/* Marks Override Card */}
                <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
                    🎯 Adjusted Marks / Final Score: <strong style={{ color: manualScore >= 85 ? '#10b981' : '#3b82f6', fontSize: '1.1rem' }}>{manualScore}/100</strong>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={manualScore}
                    onChange={e => setManualScore(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#4318FF', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    {[100, 90, 85, 75, 50].map(s => (
                      <button
                        key={s}
                        type="button"
                        className={`btn btn-xs ${manualScore === s ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setManualScore(s)}
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                      >
                        {s}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interview Decision Card */}
                <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
                    ⚖️ Interview Hiring Recommendation:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className={`btn btn-sm ${decision === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setDecision('approved')}
                      style={{ background: decision === 'approved' ? '#10b981' : undefined, borderColor: decision === 'approved' ? '#10b981' : undefined }}
                    >
                      🟢 Hire / Exceeds Bar
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${decision === 'needs_work' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setDecision('needs_work')}
                      style={{ background: decision === 'needs_work' ? '#f59e0b' : undefined, borderColor: decision === 'needs_work' ? '#f59e0b' : undefined }}
                    >
                      🟡 Needs Revision
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm ${decision === 'rejected' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setDecision('rejected')}
                      style={{ background: decision === 'rejected' ? '#ef4444' : undefined, borderColor: decision === 'rejected' ? '#ef4444' : undefined }}
                    >
                      🔴 Below Bar
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Sub-Criteria Competency Sliders */}
              <div style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 14px', fontSize: '0.95rem' }}>Sub-Criteria Evaluation (Scale 1–10)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>🧹 Clean Code &amp; Structure</span>
                      <strong>{cleanCodeRating} / 10</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={cleanCodeRating}
                      onChange={e => setCleanCodeRating(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>⚛️ React 19 &amp; State Arch</span>
                      <strong>{architectureRating} / 10</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={architectureRating}
                      onChange={e => setArchitectureRating(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#4318FF', cursor: 'pointer' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span>⚡ Edge Cases &amp; Performance</span>
                      <strong>{edgeCasesRating} / 10</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={edgeCasesRating}
                      onChange={e => setEdgeCasesRating(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Interviewer Feedback Notes */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', marginBottom: '8px' }}>
                  📝 Interviewer Feedback &amp; Mentorship Notes (Visible to Candidate):
                </label>
                <textarea
                  className="search-field"
                  rows={4}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Leave detailed constructive feedback, architecture observations, and next steps for the candidate..."
                  style={{ width: '100%', minHeight: '110px', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px', padding: '12px' }}
                />
              </div>

              {/* Submit Review Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActiveTab('code')}
                >
                  Back to Code
                </button>
                <button
                  type="button"
                  className="btn btn-primary candidate-btn-primary"
                  onClick={handleSaveEvaluation}
                  disabled={isSaving}
                  style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>💾</span>
                  <span>{isSaving ? 'Saving to Supabase...' : 'Save & Publish Evaluation'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Competency Skill Radar */}
          {activeTab === 'radar' && (
            <div style={{ padding: '4px 0' }}>
              <CandidateSkillRadar
                candidateName={submission.userName || 'Candidate'}
                candidateId={submission.userId}
                submissions={[{
                  id: submission.id,
                  question_id: submission.questionId,
                  title: submission.questionTitle,
                  score: manualScore,
                  status: submission.status,
                  created_at: submission.createdAt,
                }]}
                reviews={{
                  ...candidateReviews,
                  ...(existingReview ? { [existingReview.submissionId]: existingReview } : {}),
                  // Current active in-progress grading if not yet published
                  [submission.id]: {
                    submissionId: submission.id,
                    candidateId: submission.userId || 'candidate',
                    candidateName: submission.userName,
                    candidateEmail: submission.userEmail,
                    questionId: submission.questionId,
                    questionTitle: submission.questionTitle,
                    score: manualScore,
                    cleanCodeRating,
                    architectureRating,
                    edgeCasesRating,
                    decision,
                    notes,
                    evaluatorName: 'Platform Administrator',
                    evaluatedAt: new Date().toISOString(),
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
