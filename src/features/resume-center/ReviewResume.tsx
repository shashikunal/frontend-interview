import { useState, useEffect } from 'react'
import { useAuth } from '../auth/hooks/useAuth'
import { resumeService } from './services/resume.service'
import type { Resume, JobDescription, ResumeReview } from './types/resume.types'
import ScoreCard from './components/ScoreCard'
import SkillMatchList from './components/SkillMatchList'
import SectionReview from './components/SectionReview'
import JDParser from './components/JDParser'

export default function ReviewResume() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])
  const [selectedJD, setSelectedJD] = useState<JobDescription | null>(null)
  const [review, setReview] = useState<ResumeReview | null>(null)
  const [isLoadingResumes, setIsLoadingResumes] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    Promise.all([resumeService.listResumes(), resumeService.listJobDescriptions()])
      .then(([r, jd]) => {
        setResumes(r)
        setJobDescriptions(jd)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load data'))
      .finally(() => setIsLoadingResumes(false))
  }, [user])

  const handleAnalyze = async () => {
    if (!selectedResume) return
    setIsAnalyzing(true)
    setError(null)
    setReview(null)
    try {
      const result = await resumeService.reviewResume(selectedResume.id, selectedJD?.id)
      setReview(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleImprove = async () => {
    if (!selectedResume || !review) return
    setIsAnalyzing(true)
    setError(null)
    try {
      const result = await resumeService.analyzeResume(selectedResume.id, selectedJD?.id)
      setReview((prev) =>
        prev
          ? {
              ...prev,
              overallScore: result.overallScore,
              atsScore: result.atsScore,
              jobMatch: result.jobMatch,
              skillMatches: result.skillMatches,
              sectionReviews: result.sectionReviews,
              summary: result.summary,
            }
          : prev,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Improvement failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (!user) return null

  if (isLoadingResumes) {
    return <div className="loading-state">Loading resumes...</div>
  }

  return (
    <div className="review-resume">
      <div className="review-resume-header">
        <h2>Review Resume</h2>
        <p>Get AI-powered feedback on your resume against a job description.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="review-grid">
        <div className="review-input-panel">
          <div className="form-group">
            <label htmlFor="resume-select">Select Resume</label>
            <select
              id="resume-select"
              className="form-input"
              value={selectedResume?.id ?? ''}
              onChange={(e) => {
                const r = resumes.find((res) => res.id === e.target.value) ?? null
                setSelectedResume(r)
                setReview(null)
              }}
            >
              <option value="">Choose a resume...</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <JDParser
            onParse={(_content, _title, _company) => {}}
            savedJobDescriptions={jobDescriptions}
            onSelectSaved={setSelectedJD}
            isLoading={isAnalyzing}
          />

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleAnalyze}
            disabled={!selectedResume || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </div>

        <div className="review-results-panel">
          {isAnalyzing && (
            <div className="analyzing-state">
              <div className="spinner" />
              <p>Analyzing your resume against the job description...</p>
            </div>
          )}

          {!isAnalyzing && !review && (
            <div className="review-empty">
              <p>Select a resume and job description, then click Analyze to see results.</p>
            </div>
          )}

          {review && (
            <div className="review-results">
              <div className="review-scores">
                <ScoreCard label="Overall Score" value={review.overallScore} icon="📊" />
                <ScoreCard label="ATS Score" value={review.atsScore} icon="🤖" />
                <ScoreCard label="Job Match" value={review.jobMatch} icon="🎯" />
              </div>

              <div className="review-summary">
                <h3>Summary</h3>
                <p>{review.summary}</p>
              </div>

              <div className="review-section">
                <h3>Skill Analysis</h3>
                <SkillMatchList skills={review.skillMatches} />
              </div>

              <div className="review-section">
                <h3>Section Reviews</h3>
                <SectionReview reviews={review.sectionReviews} />
              </div>

              <div className="review-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleImprove}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Improving...' : 'Improve Resume'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
