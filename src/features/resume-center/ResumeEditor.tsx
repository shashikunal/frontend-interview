import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import { resumeService } from './services/resume.service'
import type { Resume, ResumeSection, ResumeTemplate, ResumeSectionType } from './types/resume.types'
import ResumePreview from './ResumePreview'

const TEMPLATES: { value: ResumeTemplate; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'technical', label: 'Technical' },
]

const FONTS = [
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'system-ui, sans-serif', label: 'System UI' },
  { value: "'Courier New', monospace", label: 'Courier New' },
]

const SPACING = [
  { value: 'compact', label: 'Compact' },
  { value: 'normal', label: 'Normal' },
  { value: 'relaxed', label: 'Relaxed' },
]

function generateId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export default function ResumeEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [resume, setResume] = useState<Resume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!user || !id) return
    resumeService
      .getResume(id)
      .then(setResume)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load resume'))
      .finally(() => setIsLoading(false))
  }, [user, id])

  const autoSave = useCallback(
    (updated: Resume) => {
      if (!resume) return
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(async () => {
        setIsSaving(true)
        try {
          await resumeService.updateResume(resume.id, {
            name: updated.name,
            targetRole: updated.targetRole,
            company: updated.company,
            template: updated.template,
            font: updated.font,
            spacing: updated.spacing,
            sections: updated.sections,
          })
        } catch {
        } finally {
          setIsSaving(false)
        }
      }, 1000)
    },
    [resume],
  )

  const updateResume = (updates: Partial<Resume>) => {
    if (!resume) return
    const updated = { ...resume, ...updates }
    setResume(updated)
    autoSave(updated)
  }

  const updateSection = (sectionId: string, content: string) => {
    if (!resume) return
    const sections = resume.sections.map((s) => (s.id === sectionId ? { ...s, content } : s))
    updateResume({ sections })
  }

  const addSection = (type: ResumeSectionType) => {
    if (!resume) return
    const titles: Record<ResumeSectionType, string> = {
      summary: 'Professional Summary',
      skills: 'Skills',
      experience: 'Work Experience',
      projects: 'Projects',
      education: 'Education',
      certifications: 'Certifications',
      achievements: 'Achievements',
    }
    const newSection: ResumeSection = {
      id: generateId(),
      type,
      title: titles[type],
      content: '',
      order: resume.sections.length,
    }
    updateResume({ sections: [...resume.sections, newSection] })
  }

  const removeSection = (sectionId: string) => {
    if (!resume) return
    const sections = resume.sections
      .filter((s) => s.id !== sectionId)
      .map((s, i) => ({ ...s, order: i }))
    updateResume({ sections })
  }

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    if (!resume) return
    const idx = resume.sections.findIndex((s) => s.id === sectionId)
    if (idx < 0) return
    const newIdx = direction === 'up' ? idx - 1 : idx + 1
    if (newIdx < 0 || newIdx >= resume.sections.length) return
    const sections = [...resume.sections]
    ;[sections[idx], sections[newIdx]] = [sections[newIdx], sections[idx]]
    updateResume({ sections: sections.map((s, i) => ({ ...s, order: i })) })
  }

  if (!user) return null
  if (isLoading) return <div className="loading-state">Loading editor...</div>
  if (!resume) return <div className="error-banner">Resume not found</div>

  return (
    <div className="resume-editor">
      <div className="editor-header">
        <div>
          <h2>Edit Resume</h2>
          <p>Make changes to your resume. Auto-save is enabled.</p>
        </div>
        <div className="editor-header-actions">
          <span className="save-status">{isSaving ? 'Saving...' : 'Saved'}</span>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/resume-center?tab=my-resumes')}
          >
            Back to List
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className={`editor-layout ${showPreview ? 'with-preview' : ''}`}>
        <div className="editor-main">
          <div className="editor-meta">
            <div className="form-group">
              <label htmlFor="edit-name">Resume Name</label>
              <input
                id="edit-name"
                type="text"
                className="form-input"
                value={resume.name}
                onChange={(e) => updateResume({ name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-role">Target Role</label>
                <input
                  id="edit-role"
                  type="text"
                  className="form-input"
                  value={resume.targetRole}
                  onChange={(e) => updateResume({ targetRole: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-company">Company</label>
                <input
                  id="edit-company"
                  type="text"
                  className="form-input"
                  value={resume.company}
                  onChange={(e) => updateResume({ company: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="editor-controls">
            <div className="control-group">
              <label>Template</label>
              <div className="template-btns">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`template-btn ${resume.template === t.value ? 'active' : ''}`}
                    onClick={() => updateResume({ template: t.value })}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="control-group">
              <label htmlFor="font-select">Font</label>
              <select
                id="font-select"
                className="form-input"
                value={resume.font}
                onChange={(e) => updateResume({ font: e.target.value })}
              >
                {FONTS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="control-group">
              <label htmlFor="spacing-select">Spacing</label>
              <select
                id="spacing-select"
                className="form-input"
                value={resume.spacing}
                onChange={(e) => updateResume({ spacing: e.target.value })}
              >
                {SPACING.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="editor-sections">
            <div className="sections-header">
              <h3>Sections</h3>
              <div className="add-section-btns">
                {(['summary', 'skills', 'experience', 'projects', 'education', 'certifications', 'achievements'] as const).map(
                  (type) => (
                    <button
                      key={type}
                      type="button"
                      className="btn btn-sm btn-secondary"
                      onClick={() => addSection(type)}
                    >
                      + {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ),
                )}
              </div>
            </div>

            {resume.sections
              .sort((a, b) => a.order - b.order)
              .map((section, idx) => (
                <div key={section.id} className="editor-section">
                  <div className="editor-section-header">
                    <span className="section-title">{section.title}</span>
                    <div className="section-actions">
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => moveSection(section.id, 'up')}
                        disabled={idx === 0}
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={() => moveSection(section.id, 'down')}
                        disabled={idx === resume.sections.length - 1}
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeSection(section.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <textarea
                    className="form-textarea"
                    value={section.content}
                    onChange={(e) => updateSection(section.id, e.target.value)}
                    rows={4}
                    placeholder={`Enter ${section.title.toLowerCase()}...`}
                  />
                </div>
              ))}
          </div>
        </div>

        {showPreview && (
          <div className="editor-preview">
            <ResumePreview resume={resume} />
          </div>
        )}
      </div>
    </div>
  )
}
