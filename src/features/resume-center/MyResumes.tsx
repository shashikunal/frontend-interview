import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import { resumeService } from './services/resume.service'
import type { Resume } from './types/resume.types'

export default function MyResumes() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    loadResumes()
  }, [user])

  const loadResumes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await resumeService.listResumes({ sortBy: 'updatedAt', sortOrder: 'desc' })
      setResumes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await resumeService.deleteResume(id)
      setResumes((prev) => prev.filter((r) => r.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const handleDuplicate = async (resume: Resume) => {
    try {
      await resumeService.createResume({
        name: `${resume.name} (Copy)`,
        targetRole: resume.targetRole,
        company: resume.company,
        template: resume.template,
        sections: resume.sections,
      })
      loadResumes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Duplicate failed')
    }
  }

  const handleDownload = (resume: Resume) => {
    const content = resume.sections
      .sort((a, b) => a.order - b.order)
      .map((s) => `${s.title}\n${s.content}`)
      .join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.name.replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!user) return null

  if (isLoading) {
    return <div className="loading-state">Loading resumes...</div>
  }

  return (
    <div className="my-resumes">
      <div className="my-resumes-header">
        <h2>My Resumes</h2>
        <p>Manage all your saved resumes.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {resumes.length === 0 ? (
        <div className="empty-state">
          <p>No resumes yet. Create your first resume to get started.</p>
        </div>
      ) : (
        <div className="resumes-table-wrap">
          <table className="resumes-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Target Role</th>
                <th>Company</th>
                <th>ATS Score</th>
                <th>Job Match</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.id}>
                  <td className="resume-name">{resume.name}</td>
                  <td>{resume.targetRole}</td>
                  <td>{resume.company}</td>
                  <td>
                    {resume.atsScore !== null ? (
                      <span className={`score-badge ${resume.atsScore >= 75 ? 'good' : resume.atsScore >= 50 ? 'warn' : 'bad'}`}>
                        {resume.atsScore}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {resume.jobMatch !== null ? (
                      <span className={`score-badge ${resume.jobMatch >= 75 ? 'good' : resume.jobMatch >= 50 ? 'warn' : 'bad'}`}>
                        {resume.jobMatch}%
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="resume-date">
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="resume-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/resume-center/edit/${resume.id}`)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => navigate(`/resume-center?tab=review&resumeId=${resume.id}`)}
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDuplicate(resume)}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleDownload(resume)}
                      >
                        Download
                      </button>
                      {deleteConfirm === resume.id ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(resume.id)}
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteConfirm(resume.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
