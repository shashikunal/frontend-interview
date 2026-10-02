import { useState } from 'react'
import type { JobDescription } from '../types/resume.types'

interface JDParserProps {
  onParse: (content: string, title: string, company: string) => void
  savedJobDescriptions: JobDescription[]
  onSelectSaved: (jd: JobDescription) => void
  isLoading?: boolean
}

export default function JDParser({ onParse, savedJobDescriptions, onSelectSaved, isLoading }: JDParserProps) {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [showSaved, setShowSaved] = useState(false)

  const handleParse = () => {
    if (!content.trim()) return
    onParse(content, title, company)
  }

  const handleSelectSaved = (jd: JobDescription) => {
    setContent(jd.content)
    setTitle(jd.title)
    setCompany(jd.company)
    onSelectSaved(jd)
    setShowSaved(false)
  }

  return (
    <div className="jd-parser">
      <div className="jd-parser-header">
        <h3>Job Description</h3>
        {savedJobDescriptions.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setShowSaved(!showSaved)}
          >
            {showSaved ? 'Hide Saved' : 'Select Saved JD'}
          </button>
        )}
      </div>

      {showSaved && (
        <div className="jd-saved-list">
          {savedJobDescriptions.map((jd) => (
            <button
              key={jd.id}
              type="button"
              className="jd-saved-item"
              onClick={() => handleSelectSaved(jd)}
            >
              <span className="jd-saved-title">{jd.title}</span>
              <span className="jd-saved-company">{jd.company}</span>
            </button>
          ))}
        </div>
      )}

      <div className="jd-parser-form">
        <div className="jd-parser-row">
          <input
            type="text"
            className="jd-input"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="jd-input"
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
        <textarea
          className="jd-textarea"
          placeholder="Paste the full job description here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
        />
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleParse}
          disabled={!content.trim() || isLoading}
        >
          {isLoading ? 'Parsing...' : 'Parse JD'}
        </button>
      </div>
    </div>
  )
}
