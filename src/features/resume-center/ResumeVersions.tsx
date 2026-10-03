import { useState, useEffect } from 'react'
import { useAuth } from '../auth/hooks/useAuth'
import { resumeService } from './services/resume.service'
import type { Resume, ResumeVersion } from './types/resume.types'

interface ResumeVersionsProps {
  resume: Resume | null
}

export default function ResumeVersions({ resume }: ResumeVersionsProps) {
  const { user } = useAuth()
  const [versions, setVersions] = useState<ResumeVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)

  useEffect(() => {
    if (!resume || !user) return
    loadVersions()
  }, [resume, user])

  const loadVersions = async () => {
    if (!resume) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await resumeService.listVersions(resume.id)
      setVersions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load versions')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitch = async (versionId: string) => {
    if (!resume) return
    setError(null)
    try {
      await resumeService.switchVersion(resume.id, versionId)
      loadVersions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch version')
    }
  }

  const handleCreateVersion = async () => {
    if (!resume) return
    const name = `Version ${versions.length + 1}`
    setError(null)
    try {
      await resumeService.createVersion(resume.id, name)
      loadVersions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create version')
    }
  }

  const toggleCompare = (versionId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(versionId)) return prev.filter((id) => id !== versionId)
      if (prev.length >= 2) return [prev[1], versionId]
      return [...prev, versionId]
    })
  }

  if (!user) return null

  if (!resume) {
    return (
      <div className="resume-versions">
        <div className="resume-versions-header">
          <h2>Resume Versions</h2>
          <p>Select a resume to manage its versions.</p>
        </div>
        <div className="empty-state">
          <p>Go to My Resumes and select a resume to view its versions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="resume-versions">
      <div className="resume-versions-header">
        <h2>Resume Versions</h2>
        <p>Manage versions for: {resume.name}</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="versions-toolbar">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={handleCreateVersion}
          disabled={isLoading}
        >
          Create Version
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => setShowCompare(!showCompare)}
          disabled={versions.length < 2}
        >
          {showHideCompareLabel(showCompare)}
        </button>
      </div>

      {isLoading ? (
        <div className="loading-state">Loading versions...</div>
      ) : versions.length === 0 ? (
        <div className="empty-state">
          <p>No versions yet. Create your first version to start tracking changes.</p>
        </div>
      ) : (
        <div className="versions-list">
          {versions.map((version) => (
            <div
              key={version.id}
              className={`version-card ${version.isActive ? 'active' : ''}`}
            >
              <div className="version-card-header">
                <span className="version-name">{version.name}</span>
                {version.isActive && <span className="version-active-badge">Active</span>}
              </div>
              <div className="version-card-meta">
                <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                <span>{version.sections.length} sections</span>
              </div>
              <div className="version-card-actions">
                {!version.isActive && (
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => handleSwitch(version.id)}
                  >
                    Set Active
                  </button>
                )}
                {showCompare && (
                  <label className="compare-check">
                    <input
                      type="checkbox"
                      checked={compareIds.includes(version.id)}
                      onChange={() => toggleCompare(version.id)}
                    />
                    Compare
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showCompare && compareIds.length === 2 && (
        <div className="version-compare">
          <h3>Version Comparison</h3>
          <div className="compare-grid">
            {compareIds.map((id) => {
              const version = versions.find((v) => v.id === id)
              if (!version) return null
              return (
                <div key={id} className="compare-column">
                  <h4>{version.name}</h4>
                  <div className="compare-sections">
                    {version.sections
                      .sort((a, b) => a.order - b.order)
                      .map((s) => (
                        <div key={s.id} className="compare-section">
                          <strong>{s.title}</strong>
                          <p>{s.content || '(empty)'}</p>
                        </div>
                      ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function showHideCompareLabel(show: boolean): string {
  return show ? 'Hide Compare' : 'Compare Versions'
}
