import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobMatchService } from './services/jobMatch.service'
import type { JobMatchAnalysis, MatchClassification } from './types/jobMatch.types'
import ScoreBreakdown from './components/ScoreBreakdown'
import SkillGapAnalysis from './components/SkillGapAnalysis'
import ApplyRecommendation from './components/ApplyRecommendation'
import ExperienceMatch from './components/ExperienceMatch'
import './JobMatching.css'

const CLASSIFICATION_LABELS: Record<MatchClassification, string> = {
  strong_match: 'Strong Match',
  good_match: 'Good Match',
  partial_match: 'Partial Match',
  weak_match: 'Weak Match',
}

const CLASSIFICATION_COLORS: Record<MatchClassification, string> = {
  strong_match: '#10b981',
  good_match: '#3b82f6',
  partial_match: '#f59e0b',
  weak_match: '#ef4444',
}

export default function MatchResults() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, openAuthModal } = useAuth()

  const [analysis, setAnalysis] = useState<JobMatchAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [creatingResume, setCreatingResume] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  const fetchAnalysis = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await jobMatchService.getMatchAnalysis(id)
      setAnalysis(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalysis()
    }
  }, [isAuthenticated, fetchAnalysis])

  const handleSave = async () => {
    if (!analysis) return
    setSaving(true)
    setSaveMessage(null)
    try {
      await jobMatchService.analyzeJobMatch({
        resumeId: analysis.resumeId,
        jobTitle: analysis.jobTitle,
        company: analysis.company,
        jobDescription: analysis.jobDescription,
      })
      setSaveMessage('Analysis saved to your history.')
    } catch {
      setSaveMessage('Analysis is already saved.')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateResume = async () => {
    if (!analysis) return
    setCreatingResume(true)
    setError(null)
    try {
      const result = await jobMatchService.createTailoredResume(analysis.id)
      setSaveMessage(result.message || 'Tailored resume created successfully!')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create tailored resume')
    } finally {
      setCreatingResume(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="jm-page">
        <div className="jm-auth-prompt">
          <div className="jm-auth-icon">🔐</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to view your job match analysis.</p>
          <button className="jm-btn jm-btn-primary" onClick={() => openAuthModal('user')}>
            Sign In
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="jm-page">
        <div className="jm-container">
          <div className="jm-loading-state">
            <div className="jm-spinner" />
            <p>Loading analysis...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="jm-page">
        <div className="jm-container">
          <div className="jm-error-state">
            <div className="jm-error-icon">⚠️</div>
            <h3>Unable to Load Analysis</h3>
            <p>{error}</p>
            <div className="jm-error-actions">
              <button className="jm-btn jm-btn-primary" onClick={fetchAnalysis}>Retry</button>
              <Link to="/job-matching" className="jm-btn jm-btn-secondary">New Analysis</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analysis) return null

  const { result } = analysis

  return (
    <div className="jm-page">
      <div className="jm-container">
        <div className="jm-results-header">
          <div>
            <h1 className="jm-title">{analysis.jobTitle}</h1>
            {analysis.company && <p className="jm-company">{analysis.company}</p>}
            <p className="jm-meta">
              Resume: {analysis.resumeName} · {new Date(analysis.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="jm-results-actions">
            <button className="jm-btn jm-btn-secondary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Analysis'}
            </button>
            <button className="jm-btn jm-btn-primary" onClick={handleCreateResume} disabled={creatingResume}>
              {creatingResume ? 'Creating...' : 'Create Tailored Resume'}
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="jm-success-banner" role="status">
            <span>✓</span> {saveMessage}
          </div>
        )}

        {error && (
          <div className="jm-error-banner" role="alert">
            <span className="jm-error-icon">⚠️</span> {error}
          </div>
        )}

        <div className="jm-score-hero">
          <div className="jm-score-circle" style={{ borderColor: CLASSIFICATION_COLORS[result.classification] }}>
            <span className="jm-score-number">{result.overallScore}</span>
            <span className="jm-score-max">/100</span>
          </div>
          <div
            className="jm-classification-badge"
            style={{ background: `${CLASSIFICATION_COLORS[result.classification]}20`, color: CLASSIFICATION_COLORS[result.classification] }}
          >
            {CLASSIFICATION_LABELS[result.classification]}
          </div>
        </div>

        <ScoreBreakdown breakdown={result.scoreBreakdown} overallScore={result.overallScore} />

        <SkillGapAnalysis
          strong={result.skillsMatch.strong}
          partial={result.skillsMatch.partial}
          missing={result.skillsMatch.missing}
        />

        <ExperienceMatch
          experience={result.experienceAnalysis}
          responsibilities={result.responsibilityMatch}
        />

        {result.projectRelevance.length > 0 && (
          <div className="jm-section">
            <h3 className="jm-section-title">Project Relevance</h3>
            <div className="jm-project-list">
              {result.projectRelevance.map((proj, idx) => (
                <div key={idx} className="jm-project-item">
                  <div className="jm-project-header">
                    <span className="jm-project-name">{proj.projectName}</span>
                    <span className="jm-project-score">{proj.relevanceScore}%</span>
                  </div>
                  <div className="jm-project-skills">
                    {proj.relevantSkills.map((skill, sIdx) => (
                      <span key={sIdx} className="jm-skill-tag">{skill}</span>
                    ))}
                  </div>
                  {proj.notes && <p className="jm-project-notes">{proj.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="jm-section">
          <h3 className="jm-section-title">Keyword Analysis</h3>
          <div className="jm-keyword-analysis">
            <div className="jm-keyword-stat">
              <span className="jm-keyword-rate">{result.keywordAnalysis.matchRate}%</span>
              <span className="jm-keyword-label">Match Rate</span>
            </div>
            <div className="jm-keyword-columns">
              <div className="jm-keyword-col">
                <h4>Matched Keywords</h4>
                <div className="jm-keyword-tags">
                  {result.keywordAnalysis.matched.map((kw, idx) => (
                    <span key={idx} className="jm-keyword-tag jm-keyword-matched">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="jm-keyword-col">
                <h4>Missing Keywords</h4>
                <div className="jm-keyword-tags">
                  {result.keywordAnalysis.missing.map((kw, idx) => (
                    <span key={idx} className="jm-keyword-tag jm-keyword-missing">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="jm-section">
          <h3 className="jm-section-title">ATS Compatibility</h3>
          <div className="jm-ats-score">
            <div className="jm-ats-value">{result.atsCompatibility.score}/100</div>
            <div className="jm-ats-bar-track">
              <div className="jm-ats-bar-fill" style={{ width: `${result.atsCompatibility.score}%` }} />
            </div>
          </div>
          {result.atsCompatibility.issues.length > 0 && (
            <div className="jm-ats-issues">
              <h4>Issues Detected</h4>
              <ul>
                {result.atsCompatibility.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {result.atsCompatibility.recommendations.length > 0 && (
            <div className="jm-ats-recommendations">
              <h4>Recommendations</h4>
              <ul>
                {result.atsCompatibility.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <ApplyRecommendation recommendation={result.applyRecommendation} />

        <div className="jm-results-footer">
          <Link to="/job-matching" className="jm-btn jm-btn-secondary">New Analysis</Link>
          <Link to="/job-matching/history" className="jm-btn jm-btn-secondary">View History</Link>
        </div>
      </div>
    </div>
  )
}
