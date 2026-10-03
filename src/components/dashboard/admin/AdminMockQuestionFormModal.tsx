import { useState, useCallback, useEffect, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import {
  MOCK_DIFFICULTIES,
  EXPERIENCE_TIERS,
  EXPERIENCE_TIER_LABELS,
  MOCK_TECHNOLOGIES,
  type MockBankQuestion,
  type MockBankQuestionDraft,
  type ExperienceTier,
  type QuestionDifficulty,
  type QuestionType,
  type QuestionStatus,
} from '../../../lib/mockQuestionBankService'
import './AdminQuestionFormModal.css'

const QUESTION_TYPES: QuestionType[] = [
  'Theory',
  'Practical',
  'Logical',
  'Programming',
  'Debugging',
  'Scenario Based',
  'Architecture',
  'System Design',
  'Behavioral',
  'Communication',
  'Technical Explanation',
  'Problem Solving',
]

const STATUSES: QuestionStatus[] = ['DRAFT', 'REVIEW', 'APPROVED', 'PUBLISHED', 'DEPRECATED']

interface Props {
  initial?: MockBankQuestion | null
  onSave: (draft: MockBankQuestionDraft) => Promise<void>
  onClose: () => void
}

/** Comma/Enter separated multi-value field, styled like the existing tag input. */
function ListInput({
  label,
  value,
  onChange,
  placeholder,
  showHint,
}: {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  showHint?: boolean
}) {
  const [raw, setRaw] = useState('')

  const commit = useCallback(
    (text: string) => {
      const parts = text
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
      if (parts.length) onChange([...value, ...parts.filter(p => !value.includes(p))])
      setRaw('')
    },
    [value, onChange]
  )

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit(raw)
    } else if (e.key === 'Backspace' && !raw && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="aqfm-field">
      <label className="aqfm-label">{label}</label>
      <div className="aqfm-tag-wrap">
        {value.map(v => (
          <span key={v} className="aqfm-tag">
            <span>{v}</span>
            <button
              type="button"
              className="aqfm-tag-remove"
              onClick={() => onChange(value.filter(x => x !== v))}
              title={`Remove ${v}`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          className="aqfm-tag-input"
          value={raw}
          placeholder={placeholder}
          onChange={e => setRaw(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => raw && commit(raw)}
        />
      </div>
      {showHint && <span className="aqfm-tag-hint">Press Enter or comma to add · Backspace to remove last</span>}
    </div>
  )
}

export default function AdminMockQuestionFormModal({ initial, onSave, onClose }: Props) {
  const isEdit = Boolean(initial)

  const [technology, setTechnology] = useState<string>(initial?.technology ?? 'javascript')
  const [topic, setTopic] = useState(initial?.topic ?? '')
  const [subtopic, setSubtopic] = useState(initial?.subtopic ?? '')
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>(initial?.difficulty ?? 'Basic')
  const [questionType, setQuestionType] = useState<QuestionType>(initial?.questionType ?? 'Theory')
  const [experienceLevels, setExperienceLevels] = useState<ExperienceTier[]>(
    initial?.experienceLevels ?? ['0-1', '1-2']
  )
  const [status, setStatus] = useState<QuestionStatus>(initial?.status ?? 'APPROVED')
  const [estimatedTimeMinutes, setEstimatedTimeMinutes] = useState<number>(
    initial?.estimatedTimeMinutes ?? 5
  )
  const [question, setQuestion] = useState(initial?.question ?? '')
  const [expectedConcepts, setExpectedConcepts] = useState<string[]>(initial?.expectedConcepts ?? [])
  const [idealAnswerPoints, setIdealAnswerPoints] = useState<string[]>(initial?.idealAnswerPoints ?? [])
  const [commonMistakes, setCommonMistakes] = useState<string[]>(initial?.commonMistakes ?? [])
  const [followUpTopics, setFollowUpTopics] = useState<string[]>(initial?.followUpTopics ?? [])
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleTier = (tier: ExperienceTier) => {
    setExperienceLevels(prev =>
      prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
    )
  }

  const validate = (): string | null => {
    if (!topic.trim()) return 'Topic is required.'
    if (!subtopic.trim()) return 'Subtopic is required.'
    if (!question.trim()) return 'Question text is required.'
    if (experienceLevels.length === 0) return 'Select at least one experience level.'
    return null
  }

  const handleSave = async () => {
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setSaving(true)
    try {
      await onSave({
        technology,
        topic: topic.trim(),
        subtopic: subtopic.trim(),
        difficulty,
        question: question.trim(),
        questionType,
        experienceLevels,
        expectedConcepts,
        idealAnswerPoints,
        commonMistakes,
        followUpTopics,
        estimatedTimeMinutes,
        tags,
        status,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save question.')
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return createPortal(
    <div className="aqfm-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="aqfm-panel"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit Mock Bank Question' : 'Create Mock Bank Question'}
      >
        <div className="aqfm-header">
          <div className="aqfm-header-left">
            <h2>{isEdit ? `✏️ Edit: ${initial?.id}` : '➕ Create Mock Bank Question'}</h2>
            <p>
              {isEdit
                ? 'Modify this question in the AI video mock bank.'
                : 'Feed a question into the AI video mock bank (mock_question_bank).'}
            </p>
          </div>
          <button type="button" className="aqfm-close-btn" onClick={onClose} title="Close">✕</button>
        </div>

        <div className="aqfm-body">
          {error && <div className="aqfm-error">⚠️ {error}</div>}

          <div className="aqfm-section-heading">Classification</div>
          <div className="aqfm-row-3">
            <div className="aqfm-field">
              <label className="aqfm-label required">Technology</label>
              <select className="aqfm-select" value={technology} onChange={e => setTechnology(e.target.value)}>
                {MOCK_TECHNOLOGIES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="aqfm-field">
              <label className="aqfm-label required">Difficulty</label>
              <select
                className="aqfm-select"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as QuestionDifficulty)}
              >
                {MOCK_DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="aqfm-field">
              <label className="aqfm-label">Question Type</label>
              <select
                className="aqfm-select"
                value={questionType}
                onChange={e => setQuestionType(e.target.value as QuestionType)}
              >
                {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="aqfm-row-2">
            <div className="aqfm-field">
              <label className="aqfm-label required">Topic</label>
              <input
                type="text"
                className="aqfm-input"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. The Cascade & Specificity"
              />
            </div>
            <div className="aqfm-field">
              <label className="aqfm-label required">Subtopic</label>
              <input
                type="text"
                className="aqfm-input"
                value={subtopic}
                onChange={e => setSubtopic(e.target.value)}
                placeholder="e.g. Cascade Layers (@layer)"
              />
            </div>
          </div>

          {/* Experience level decides which candidates are served this question. */}
          <div className="aqfm-field">
            <label className="aqfm-label required">Experience Levels — who should see this question</label>
            <div className="aqfm-row-3">
              {EXPERIENCE_TIERS.map(tier => {
                const active = experienceLevels.includes(tier)
                return (
                  <button
                    key={tier}
                    type="button"
                    className={`aqfm-btn ${active ? 'aqfm-btn-preview' : 'aqfm-btn-cancel'}`}
                    onClick={() => toggleTier(tier)}
                    aria-pressed={active}
                    style={{ textAlign: 'left' }}
                  >
                    {active ? '✓ ' : ''}{EXPERIENCE_TIER_LABELS[tier]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="aqfm-section-heading">Question</div>
          <div className="aqfm-field">
            <label className="aqfm-label required">Question Text</label>
            <textarea
              className="aqfm-textarea tall"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="What should the interviewer ask?"
            />
          </div>

          <div className="aqfm-row-2">
            <div className="aqfm-field">
              <label className="aqfm-label">Est. Time (minutes)</label>
              <input
                type="number"
                className="aqfm-input"
                min={1}
                max={120}
                value={estimatedTimeMinutes}
                onChange={e => setEstimatedTimeMinutes(Number(e.target.value) || 1)}
              />
            </div>
            <div className="aqfm-field">
              <label className="aqfm-label">Publish Status</label>
              <select
                className="aqfm-select"
                value={status}
                onChange={e => setStatus(e.target.value as QuestionStatus)}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <span className="aqfm-tag-hint" style={{ display: 'block', marginBottom: '14px' }}>
            Candidates only receive questions with status APPROVED or PUBLISHED.
          </span>

          <div className="aqfm-section-heading">Answer Guidance</div>
          <ListInput label="Expected Concepts" value={expectedConcepts} onChange={setExpectedConcepts} placeholder="Closures, execution context" />
          <ListInput label="Ideal Answer Points" value={idealAnswerPoints} onChange={setIdealAnswerPoints} placeholder="Define, then contrast with legacy" />
          <ListInput label="Common Mistakes" value={commonMistakes} onChange={setCommonMistakes} placeholder="Confusing X with Y" />
          <ListInput label="Follow-up Topics" value={followUpTopics} onChange={setFollowUpTopics} placeholder="How does this behave under strict mode?" />
          <ListInput label="Tags" value={tags} onChange={setTags} placeholder="css, cascade" showHint />
        </div>

        <div className="aqfm-footer">
          <button type="button" className="aqfm-btn aqfm-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="aqfm-btn aqfm-btn-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Question'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}