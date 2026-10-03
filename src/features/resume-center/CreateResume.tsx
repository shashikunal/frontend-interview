import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/hooks/useAuth'
import { resumeService } from './services/resume.service'
import type { ResumeTemplate, ResumeSection, CreateResumeInput } from './types/resume.types'

type CreateMode = 'profile' | 'upload'

const TEMPLATES: { value: ResumeTemplate; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'technical', label: 'Technical' },
]

function generateId(): string {
  return `section_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

function createEmptySection(type: ResumeSection['type'], order: number): ResumeSection {
  const titles: Record<ResumeSection['type'], string> = {
    summary: 'Professional Summary',
    skills: 'Skills',
    experience: 'Work Experience',
    projects: 'Projects',
    education: 'Education',
    certifications: 'Certifications',
    achievements: 'Achievements',
  }
  return { id: generateId(), type, title: titles[type], content: '', order }
}

export default function CreateResume() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mode, setMode] = useState<CreateMode>('profile')
  const [name, setName] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [company, setCompany] = useState('')
  const [template, setTemplate] = useState<ResumeTemplate>('professional')
  const [sections, setSections] = useState<ResumeSection[]>([
    createEmptySection('summary', 0),
    createEmptySection('skills', 1),
    createEmptySection('experience', 2),
    createEmptySection('education', 3),
  ])
  const [jobDescription, setJobDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedText, setUploadedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const updateSection = (id: string, content: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, content } : s)))
  }

  const addSection = (type: ResumeSection['type']) => {
    setSections((prev) => [...prev, createEmptySection(type, prev.length)])
  }

  const removeSection = (id: string) => {
    setSections((prev) => prev.filter((s) => s.id !== id).map((s, i) => ({ ...s, order: i })))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setError(null)
    try {
      const result = await resumeService.uploadFile(file)
      setUploadedText(result.text)
      if (!name) setName(file.name.replace(/\.[^.]+$/, ''))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!name.trim()) {
      setError('Please enter a resume name')
      return
    }
    if (!targetRole.trim()) {
      setError('Please enter a target role')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      let finalSections = sections

      if (mode === 'upload' && uploadedText) {
        const generated = await resumeService.generateResume({
          targetRole,
          company,
          jobDescription: jobDescription || undefined,
        })
        finalSections = generated.sections
      } else if (jobDescription.trim()) {
        const generated = await resumeService.generateResume({
          targetRole,
          company,
          jobDescription,
          existingSections: sections,
        })
        finalSections = generated.sections
      }

      const input: CreateResumeInput = {
        name: name.trim(),
        targetRole: targetRole.trim(),
        company: company.trim(),
        template,
        sections: finalSections,
      }

      await resumeService.createResume(input)
      navigate(`/resume-center?tab=my-resumes`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resume')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!user) return null

  return (
    <div className="create-resume">
      <div className="create-resume-header">
        <h2>Create Resume</h2>
        <p>Build a new resume from your profile or upload an existing one.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="create-mode-toggle">
        <button
          type="button"
          className={`mode-btn ${mode === 'profile' ? 'active' : ''}`}
          onClick={() => setMode('profile')}
        >
          Build from Profile
        </button>
        <button
          type="button"
          className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload Existing Resume
        </button>
      </div>

      <div className="create-resume-grid">
        <div className="create-resume-form">
          <div className="form-group">
            <label htmlFor="resume-name">Resume Name</label>
            <input
              id="resume-name"
              type="text"
              className="form-input"
              placeholder="e.g. Senior Frontend Engineer - Google"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="target-role">Target Role</label>
              <input
                id="target-role"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Frontend Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="target-company">Company</label>
              <input
                id="target-company"
                type="text"
                className="form-input"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="template-select">Template</label>
            <select
              id="template-select"
              className="form-input"
              value={template}
              onChange={(e) => setTemplate(e.target.value as ResumeTemplate)}
            >
              {TEMPLATES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {mode === 'upload' && (
            <div className="form-group">
              <label>Upload Resume File</label>
              <div className="upload-area">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleUpload}
                  id="resume-upload"
                  className="upload-input"
                />
                <label htmlFor="resume-upload" className="upload-label">
                  {isUploading ? 'Uploading...' : uploadedText ? 'File uploaded - Click to replace' : 'Click to upload PDF, DOC, or TXT'}
                </label>
              </div>
              {uploadedText && (
                <div className="uploaded-preview">
                  <h4>Extracted Text Preview</h4>
                  <textarea
                    className="form-textarea"
                    value={uploadedText}
                    onChange={(e) => setUploadedText(e.target.value)}
                    rows={6}
                    readOnly
                  />
                </div>
              )}
            </div>
          )}

          {mode === 'profile' && (
            <div className="form-group">
              <label>Resume Sections</label>
              <div className="sections-list">
                {sections.map((section) => (
                  <div key={section.id} className="section-item">
                    <div className="section-item-header">
                      <span className="section-item-title">{section.title}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeSection(section.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      className="form-textarea"
                      placeholder={`Enter ${section.title.toLowerCase()}...`}
                      value={section.content}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      rows={3}
                    />
                  </div>
                ))}
              </div>
              <div className="add-section-btns">
                {(['projects', 'certifications', 'achievements'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => addSection(type)}
                  >
                    + {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="job-desc">Job Description (Optional)</label>
            <textarea
              id="job-desc"
              className="form-textarea"
              placeholder="Paste the job description to tailor your resume..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleGenerate}
            disabled={isGenerating || isUploading}
          >
            {isGenerating ? 'Generating...' : 'Generate Resume'}
          </button>
        </div>
      </div>
    </div>
  )
}
