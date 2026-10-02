import type { Resume } from './types/resume.types'

interface ResumePreviewProps {
  resume: Resume
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order)

  const handleExportPDF = () => {
    const content = sortedSections
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

  const handleExportDOCX = () => {
    const content = sortedSections
      .map((s) => `${s.title}\n${s.content}`)
      .join('\n\n')
    const blob = new Blob([content], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.name.replace(/\s+/g, '_')}.doc`
    a.click()
    URL.revokeObjectURL(url)
  }

  const spacingMap: Record<string, string> = {
    compact: '0.5em',
    normal: '1em',
    relaxed: '1.5em',
  }

  return (
    <div className="resume-preview">
      <div className="preview-header">
        <h3>Preview</h3>
        <div className="preview-actions">
          <button type="button" className="btn btn-sm btn-secondary" onClick={handleExportPDF}>
            Export PDF
          </button>
          <button type="button" className="btn btn-sm btn-secondary" onClick={handleExportDOCX}>
            Export DOCX
          </button>
        </div>
      </div>

      <div
        className={`preview-canvas template-${resume.template}`}
        style={{
          fontFamily: resume.font,
          gap: spacingMap[resume.spacing] ?? '1em',
        }}
      >
        <div className="preview-resume">
          <div className="preview-resume-header">
            <h2 className="preview-resume-name">{resume.name}</h2>
            <p className="preview-resume-role">
              {resume.targetRole}
              {resume.company && ` at ${resume.company}`}
            </p>
          </div>

          {sortedSections.map((section) => (
            <div key={section.id} className="preview-section">
              <h4 className="preview-section-title">{section.title}</h4>
              <div className="preview-section-content">
                {section.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
