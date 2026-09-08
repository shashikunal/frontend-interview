import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import type { CustomMCQuestion, CustomMCQuestionDraft } from '../../../lib/questionManagementService'
import './AdminQuestionFormModal.css'

const CATEGORIES: CustomMCQuestion['category'][] = [
  'ReactJS', 'JavaScript', 'TypeScript', 'React Redux Toolkit', 'React Query', 'DOM', 'LeetCode',
]
const DIFFICULTIES: CustomMCQuestion['difficulty'][] = ['Easy', 'Medium', 'Hard', 'Senior']

const DEFAULT_STARTER = `import React, { useState } from 'react';

export default function App() {
  // TODO: Implement your solution here

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Solution</h2>
    </div>
  );
}`

const DEFAULT_SOLUTION = `import React, { useState } from 'react';

export default function App() {
  // Model solution

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Solution</h2>
    </div>
  );
}`

interface Props {
  initial?: CustomMCQuestion | null
  onSave: (draft: CustomMCQuestionDraft) => Promise<void>
  onClose: () => void
}

/* ---------- Tag Input ---------- */
function TagInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [raw, setRaw] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = useCallback(() => {
    const trimmed = raw.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setRaw('')
  }, [raw, value, onChange])

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !raw && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="aqfm-field">
      <label className="aqfm-label">{label}</label>
      <div className="aqfm-tag-wrap" onClick={() => inputRef.current?.focus()}>
        {value.map((tag, i) => (
          <span key={i} className="aqfm-tag">
            <span title={tag}>{tag}</span>
            <button
              type="button"
              className="aqfm-tag-remove"
              onClick={e => { e.stopPropagation(); onChange(value.filter((_, j) => j !== i)) }}
            >×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="aqfm-tag-input"
          value={raw}
          onChange={e => setRaw(e.target.value)}
          onKeyDown={handleKey}
          onBlur={addTag}
          placeholder={value.length === 0 ? (placeholder ?? 'Type and press Enter…') : ''}
        />
      </div>
      <span className="aqfm-tag-hint">Press Enter or comma to add · Backspace to remove last</span>
    </div>
  )
}

/* ---------- Code Text Area ---------- */
function CodeArea({
  label,
  value,
  onChange,
  lang = 'tsx',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  lang?: string
}) {
  return (
    <div className="aqfm-field">
      <label className="aqfm-label">{label}</label>
      <div className="aqfm-code-wrap">
        <div className="aqfm-code-header">
          <span>{label}</span>
          <span className="aqfm-code-lang-badge">{lang.toUpperCase()}</span>
        </div>
        <textarea
          className="aqfm-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={14}
          style={{
            fontFamily: '"Fira Code", "Cascadia Code", monospace',
            fontSize: '0.82rem',
            borderRadius: 0,
            border: 'none',
            background: '#0d1117',
            color: '#e2e8f0',
          }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}

/* ---------- Main Form Modal ---------- */
export default function AdminQuestionFormModal({ initial, onSave, onClose }: Props) {
  const isEdit = Boolean(initial)

  const [title, setTitle] = useState(initial?.title ?? '')
  const [category, setCategory] = useState<CustomMCQuestion['category']>(initial?.category ?? 'ReactJS')
  const [difficulty, setDifficulty] = useState<CustomMCQuestion['difficulty']>(initial?.difficulty ?? 'Medium')
  const [timeEstimate, setTimeEstimate] = useState(initial?.timeEstimate ?? '20 mins')
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [requirements, setRequirements] = useState<string[]>(initial?.requirements ?? [])
  const [interviewTips, setInterviewTips] = useState<string[]>(initial?.interviewTips ?? [])
  const [commonMistakes, setCommonMistakes] = useState<string[]>(initial?.commonMistakes ?? [])
  const [starterCode, setStarterCode] = useState(initial?.starterCode ?? DEFAULT_STARTER)
  const [solutionCode, setSolutionCode] = useState(initial?.solutionCode ?? DEFAULT_SOLUTION)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validate = (): string | null => {
    if (!title.trim()) return 'Question title is required.'
    if (!summary.trim()) return 'Summary is required.'
    if (!description.trim()) return 'Description is required.'
    if (requirements.length === 0) return 'Add at least one requirement.'
    if (!starterCode.trim()) return 'Starter code is required.'
    if (!solutionCode.trim()) return 'Solution code is required.'
    return null
  }

  const handleSave = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        category,
        difficulty,
        timeEstimate: timeEstimate.trim() || '20 mins',
        summary: summary.trim(),
        description: description.trim(),
        requirements,
        interviewTips,
        commonMistakes,
        starterCode,
        solutionCode,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save question.')
    } finally {
      setSaving(false)
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const content = (
    <div className="aqfm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="aqfm-panel" role="dialog" aria-modal="true" aria-label={isEdit ? 'Edit Question' : 'Create Question'}>

        {/* Header */}
        <div className="aqfm-header">
          <div className="aqfm-header-left">
            <h2>{isEdit ? `✏️ Edit: ${initial?.id}` : '➕ Create New Question'}</h2>
            <p>{isEdit ? 'Modify this custom machine coding question.' : 'Add a new question to the custom question bank.'}</p>
          </div>
          <button type="button" className="aqfm-close-btn" onClick={onClose} title="Close">✕</button>
        </div>

        {/* Body */}
        <div className="aqfm-body">
          {error && <div className="aqfm-error">⚠️ {error}</div>}

          {/* Section: Basic Info */}
          <div className="aqfm-section-heading">Basic Info</div>
          <div className="aqfm-field">
            <label className="aqfm-label required">Title</label>
            <input
              type="text"
              id="aqfm-title-input"
              className="aqfm-input"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Build a Real-time Chat Input with Emoji Support"
            />
          </div>

          <div className="aqfm-row-3">
            <div className="aqfm-field">
              <label className="aqfm-label required">Category</label>
              <select
                id="aqfm-category-select"
                className="aqfm-select"
                value={category}
                onChange={e => setCategory(e.target.value as CustomMCQuestion['category'])}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="aqfm-field">
              <label className="aqfm-label required">Difficulty</label>
              <select
                id="aqfm-diff-select"
                className="aqfm-select"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as CustomMCQuestion['difficulty'])}
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="aqfm-field">
              <label className="aqfm-label">Time Estimate</label>
              <input
                type="text"
                className="aqfm-input"
                value={timeEstimate}
                onChange={e => setTimeEstimate(e.target.value)}
                placeholder="e.g. 25 mins"
              />
            </div>
          </div>

          <div className="aqfm-field">
            <label className="aqfm-label required">Summary (1–2 lines)</label>
            <input
              type="text"
              className="aqfm-input"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Brief one-liner describing what the candidate builds"
            />
          </div>

          {/* Section: Problem Details */}
          <div className="aqfm-section-heading">Problem Details</div>
          <div className="aqfm-field">
            <label className="aqfm-label required">Description (Markdown supported)</label>
            <textarea
              className="aqfm-textarea tall"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="### Problem Description&#10;&#10;Describe what the candidate needs to build..."
              rows={5}
            />
          </div>

          <div className="aqfm-section-heading">Requirements, Tips & Pitfalls</div>
          <TagInput
            label="Requirements *"
            value={requirements}
            onChange={setRequirements}
            placeholder="e.g. Must support debounced search (type and press Enter or comma)..."
          />

          <TagInput
            label="Interview Tips (Optional)"
            value={interviewTips}
            onChange={setInterviewTips}
            placeholder="e.g. Ask about performance trade-offs..."
          />

          <TagInput
            label="Common Mistakes (Optional)"
            value={commonMistakes}
            onChange={setCommonMistakes}
            placeholder="e.g. Forgetting to clean up event listeners…"
          />

          {/* Code */}
          <div className="aqfm-section-heading">Code Templates</div>
          <CodeArea label="Starter Code *" value={starterCode} onChange={setStarterCode} lang="tsx" />
          <CodeArea label="Solution Code *" value={solutionCode} onChange={setSolutionCode} lang="tsx" />
        </div>

        {/* Footer */}
        <div className="aqfm-footer">
          <button type="button" id="aqfm-btn-cancel" className="aqfm-btn aqfm-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            id="aqfm-btn-save"
            className="aqfm-btn aqfm-btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '⏳ Saving…' : isEdit ? '💾 Save Changes' : '✨ Create Question'}
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
}
