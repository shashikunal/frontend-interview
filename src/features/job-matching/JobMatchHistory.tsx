import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobMatchService } from './services/jobMatch.service'
import type { JobMatchAnalysis, MatchClassification } from './types/jobMatch.types'
import './JobMatching.css'

const CLASSIFICATION_COLORS: Record<MatchClassification, string> = {
  strong_match: '#10b981',
  good_match: '#3b82f6',
  partial_match: '#f59e0b',
  weak_match: '#ef4444',
}

export default function JobMatchHistory() {
  const navigate = useNavigate()
  const { isAuthenticated, openAuthModal } = useAuth()

  const [analyses, setAnalyses] = useState<JobMatchAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await jobMatchService.getMatchHistory()
      setAnalyses(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory()
    }
  }, [isAuthenticated, fetchHistory])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) return
    setDeletingId(id)
    setError(null)
    try {
      await jobMatchService.deleteMatchAnalysis(id)
      setAnalyses(prev => prev.filter(a => a.id !== id))
      setActionMessage('Analysis deleted.')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete analysis')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateResume = async (analysisId: string) => {
    setActionMessage('Creating tailored resume...')
    try {
      const result = await jobMatchService.createTailoredResume(analysisId)
      setActionMessage(result.message || 'Tailored resume created!')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create tailored resume')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="jm-page">
        <div className="jm-auth-prompt">
          <div className="jm-auth-icon">🔐</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to view your job match history.</p>
          <button className="jm-btn jm-btn-primary" onClick={() => openAuthModal('user')}>
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="jm-page">
      <div className="jm-container">
        <div className="jm-header">
          <h1 className="jm-title">Job Match History</h1>
          <p className="jm-subtitle">Review your past job match analyses and take action.</p>
        </div>

        {actionMessage && (
          <div className="jm-success-banner" role="status">
            <span>✓</span> {actionMessage}
          </div>
        )}

        {error && (
          <div className="jm-error-banner" role="alert">
            <span className="jm-error-icon">⚠️</span> {error}
            <button className="jm-error-close" onClick={() => setError(null)} aria-label="Dismiss error">×</button>
          </div>
        )}

        {loading ? (
          <div className="jm-loading-state">
            <div className="jm-spinner" />
            <p>Loading history...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="jm-empty-state">
            <div className="jm-empty-icon">📋</div>
            <h3>No Analyses Yet</h3>
            <p>Run your first job match analysis to see results here.</p>
            <Link to="/job-matching" className="jm-btn jm-btn-primary">
              Start New Analysis
            </Link>
          </div>
        ) : (
          <div className="jm-history-list">
            {analyses.map(analysis => (
              <div key={analysis.id} className="jm-history-card">
                <div className="jm-history-main">
                  <div className="jm-history-info">
                    <h3 className="jm-history-title">{analysis.jobTitle}</h3>
                    {analysis.company && <p className="jm-history-company">{analysis.company}</p>}
                    <p className="jm-history-meta">
                      {new Date(analysis.createdAt).toLocaleDateString()} · Resume: {analysis.resumeName}
                    </p>
                  </div>
                  <div className="jm-history-score">
                    <span
                      className="jm-history-score-value"
                      style={{ color: CLASSIFICATION_COLORS[analysis.result.classification] }}
                    >
                      {analysis.result.overallScore}
                    </span>
                    <span className="jm-history-score-label">/100</span>
                  </div>
                </div>
                <div className="jm-history-actions">
                  <Link
                    to={`/job-matching/results/${analysis.id}`}
                    className="jm-btn jm-btn-sm jm-btn-secondary"
                  >
                    View
                  </Link>
                  <button
                    className="jm-btn jm-btn-sm jm-btn-secondary"
                    onClick={() => navigate(`/job-matching?resumeId=${analysis.resumeId}&jobTitle=${encodeURIComponent(analysis.jobTitle)}&company=${encodeURIComponent(analysis.company || '')}&jd=${encodeURIComponent(analysis.jobDescription)}`)}
                  >
                    Review Again
                  </button>
                  <button
                    className="jm-btn jm-btn-sm jm-btn-primary"
                    onClick={() => handleCreateResume(analysis.id)}
                  >
                    Create Tailored Resume
                  </button>
                  <button
                    className="jm-btn jm-btn-sm jm-btn-danger"
                    onClick={() => handleDelete(analysis.id)}
                    disabled={deletingId === analysis.id}
                  >
                    {deletingId === analysis.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
