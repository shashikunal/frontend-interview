import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { jobMatchService } from './services/jobMatch.service'
import type { SavedResume } from './types/jobMatch.types'
import './JobMatching.css'

const ANALYSIS_STEPS = [
  'Uploading resume data...',
  'Parsing job description...',
  'Extracting skills & requirements...',
  'Analyzing experience match...',
  'Evaluating project relevance...',
  'Running keyword analysis...',
  'Checking ATS compatibility...',
  'Generating recommendations...',
]

export default function JobMatching() {
  const navigate = useNavigate()
  const { user, isAuthenticated, openAuthModal } = useAuth()

  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [loadingResumes, setLoadingResumes] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    jobMatchService
      .getSavedResumes()
      .then(data => {
        if (!cancelled) {
          setResumes(data)
          setLoadingResumes(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load saved resumes. Please try again.')
          setLoadingResumes(false)
        }
      })
    return () => { cancelled = true }
  }, [isAuthenticated])

  const handleAnalyze = useCallback(async () => {
    if (!selectedResumeId) {
      setError('Please select a resume')
      return
    }
    if (!jobTitle.trim()) {
      setError('Please enter a target job title')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description')
      return
    }

    setError(null)
    setIsAnalyzing(true)
    setAnalysisStep(0)

    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => Math.min(prev + 1, ANALYSIS_STEPS.length - 1))
    }, 1200)

    try {
      const result = await jobMatchService.analyzeJobMatch({
        resumeId: selectedResumeId,
        jobTitle: jobTitle.trim(),
        company: company.trim() || undefined,
        jobDescription: jobDescription.trim(),
      })
      clearInterval(stepInterval)
      navigate(`/job-matching/results/${result.id}`)
    } catch (err: unknown) {
      clearInterval(stepInterval)
      setIsAnalyzing(false)
      setError(err instanceof Error ? err.message : 'Analysis failed. Please try again.')
    }
  }, [selectedResumeId, jobTitle, company, jobDescription, navigate])

  if (!isAuthenticated) {
    return (
      <div className="jm-page">
        <div className="jm-auth-prompt">
          <div className="jm-auth-icon">🔐</div>
          <h2>Sign In Required</h2>
          <p>Please sign in to analyze job matches and track your progress.</p>
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
          <h1 className="jm-title">AI Job Matching</h1>
          <p className="jm-subtitle">
            Analyze how well your resume matches a job description and get actionable recommendations.
          </p>
        </div>

        {error && (
          <div className="jm-error-banner" role="alert">
            <span className="jm-error-icon">⚠️</span>
            <span>{error}</span>
            <button className="jm-error-close" onClick={() => setError(null)} aria-label="Dismiss error">×</button>
          </div>
        )}

        <div className="jm-form-card">
          <div className="jm-form-group">
            <label className="jm-label" htmlFor="resume-select">Select Resume</label>
            {loadingResumes ? (
              <div className="jm-loading-text">Loading resumes...</div>
            ) : (
              <select
                id="resume-select"
                className="jm-select"
                value={selectedResumeId}
                onChange={e => setSelectedResumeId(e.target.value)}
              >
                <option value="">-- Choose a resume --</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}
            {resumes.length === 0 && !loadingResumes && (
              <p className="jm-hint">No saved resumes found. Upload one from the Resume Center first.</p>
            )}
          </div>

          <div className="jm-form-group">
            <label className="jm-label" htmlFor="job-title">Target Job Title</label>
            <input
              id="job-title"
              type="text"
              className="jm-input"
              placeholder="e.g. Senior Frontend Engineer"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
            />
          </div>

          <div className="jm-form-group">
            <label className="jm-label" htmlFor="company">
              Company <span className="jm-optional">(optional)</span>
            </label>
            <input
              id="company"
              type="text"
              className="jm-input"
              placeholder="e.g. Google"
              value={company}
              onChange={e => setCompany(e.target.value)}
            />
          </div>

          <div className="jm-form-group">
            <label className="jm-label" htmlFor="job-description">Job Description</label>
            <textarea
              id="job-description"
              className="jm-textarea"
              rows={10}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
            />
            <p className="jm-hint">{jobDescription.length} characters</p>
          </div>

          <button
            className="jm-btn jm-btn-primary jm-btn-analyze"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Job Match'}
          </button>
        </div>

        {isAnalyzing && (
          <div className="jm-progress-overlay">
            <div className="jm-progress-card">
              <div className="jm-spinner" />
              <h3>Analyzing Your Match</h3>
              <div className="jm-progress-steps">
                {ANALYSIS_STEPS.map((step, idx) => (
                  <div
                    key={idx}
                    className={`jm-progress-step ${idx < analysisStep ? 'jm-step-done' : ''} ${idx === analysisStep ? 'jm-step-active' : ''}`}
                  >
                    <span className="jm-step-icon">
                      {idx < analysisStep ? '✓' : idx === analysisStep ? '●' : '○'}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
