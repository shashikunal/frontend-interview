import { useState } from 'react'
import type { AdminSubmissionItem } from '../../../lib/adminAnalyticsService'

interface AdminSubmissionCodeModalProps {
  submission: AdminSubmissionItem | null
  onClose: () => void
}

export default function AdminSubmissionCodeModal({
  submission,
  onClose,
}: AdminSubmissionCodeModalProps) {
  const [copied, setCopied] = useState(false)

  if (!submission) return null

  const handleCopy = () => {
    if (submission.code) {
      navigator.clipboard.writeText(submission.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card submission-code-modal" onClick={e => e.stopPropagation()}>
        <div className="am-header">
          <div>
            <span className="am-badge">Candidate Code Submission</span>
            <h2>Question #{submission.questionId}</h2>
            <p className="am-sub">
              By: <strong>{submission.userName || 'Candidate'}</strong> ({submission.userEmail}) • Language: <strong>{submission.language}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? '✓ Copied' : '📋 Copy Code'}
            </button>
            <button type="button" className="am-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="am-body">
          {/* Submission Highlights */}
          <div className="scm-meta-bar">
            <div className="scm-meta-tag">
              Status: <span className={`submission-pill ${submission.status === 'accepted' ? 'accepted' : 'wrong'}`}>{submission.status}</span>
            </div>
            <div className="scm-meta-tag">
              Score: <strong>{submission.score}%</strong>
            </div>
            <div className="scm-meta-tag">
              Exec Time: <strong>{submission.executionTime}ms</strong>
            </div>
            <div className="scm-meta-tag">
              Submitted: <strong>{new Date(submission.createdAt).toLocaleString()}</strong>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="scm-code-container">
            <pre className="scm-code-pre">
              <code>{submission.code || '// No code recorded for this submission.'}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
