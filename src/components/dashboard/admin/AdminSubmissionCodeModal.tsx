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

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-card submission-code-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '1000px', width: '95%', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
        <div className="am-header">
          <div>
            <span className="am-badge">Candidate Code Submission</span>
            <h2 style={{ margin: '4px 0 2px' }}>Question #{submission.questionId}</h2>
            <p className="am-sub">
              Candidate: <strong>{submission.userName || 'Candidate'}</strong> ({submission.userEmail}) • Language: <strong>{lang.toUpperCase()}</strong>
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
              {copied ? '✓ Copied' : '📋 Copy Code'}
            </button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleDownload}>
              💾 Download
            </button>
            <button type="button" className="am-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        <div className="am-body" style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
          {/* Submission Highlights Ribbon */}
          <div className="scm-meta-bar" style={{ marginBottom: '16px' }}>
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

          {/* Editor Frame with Line Numbers */}
          <div className="acm-editor-frame">
            <div className="acm-editor-header">
              <div className="acm-window-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="acm-editor-filename">
                <span>📄</span>
                <span>submission.{lang === 'typescript' ? 'ts' : lang === 'react' ? 'tsx' : 'js'}</span>
              </div>
              <div className="acm-editor-meta">
                <span>{lines.length} lines</span>
                <span>•</span>
                <span>{codeContent.length} chars</span>
              </div>
            </div>

            <div className="acm-code-scroll">
              <div className="acm-gutter">
                {lines.map((_, index) => (
                  <div key={index} className="acm-line-num">
                    {index + 1}
                  </div>
                ))}
              </div>
              <pre className="acm-code-block">
                <code>
                  {lines.map((line, idx) => (
                    <div key={idx} className="acm-code-line">
                      {line || ' '}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
