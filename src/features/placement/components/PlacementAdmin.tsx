import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { placementReadinessService, DEFAULT_READINESS_CONFIG } from '../services/placementReadiness.service'
import {
  PLACEMENT_QUESTIONS,
  getVerifiedQuestions,
} from '../data/questions'
import type {
  PlacementQuestionRecord,
  ReadinessCategory,
  ReadinessWeights,
  ReadinessThresholds,
  VerificationStatus,
} from '../types/placement.types'
import { readLocal, writeLocal } from '../services/placementStorage'

const CATEGORY_LABELS: Record<ReadinessCategory, string> = {
  dsa: 'DSA',
  frontend: 'Frontend',
  programming: 'Programming',
  aptitude: 'Aptitude',
  technical_mcq: 'Technical MCQ',
  machine_coding: 'Machine Coding',
  sql_cs: 'SQL / CS',
  project: 'Project',
  communication: 'Communication',
}

const VERIFICATION_STATES: VerificationStatus[] = [
  'verified',
  'needs_review',
  'incorrect',
  'duplicate',
  'archived',
]

export default function PlacementAdmin() {
  const { user, hasPermission } = useAuth()
  const canManage = hasPermission('admin')

  const [weights, setWeights] = useState<ReadinessWeights>(DEFAULT_READINESS_CONFIG.weights)
  const [thresholds, setThresholds] = useState<ReadinessThresholds>(
    DEFAULT_READINESS_CONFIG.thresholds,
  )
  const [gateChecklist, setGateChecklist] = useState(DEFAULT_READINESS_CONFIG.gateChecklist)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [questionFilter, setQuestionFilter] = useState<'all' | VerificationStatus>('all')
  const [statuses, setStatuses] = useState<Record<string, VerificationStatus>>({})

  useEffect(() => {
    if (!canManage) return
    void placementReadinessService.getConfig().then((config) => {
      setWeights(config.weights)
      setThresholds(config.thresholds)
      setGateChecklist(config.gateChecklist)
    })
    setStatuses(readLocal<Record<string, VerificationStatus>>('question_statuses', 'admin', {}))
  }, [canManage])

  if (!canManage) {
    return (
      <div className="placement-empty">
        Placement administration (readiness weights, thresholds and question verification) is
        available to administrators only.
      </div>
    )
  }

  const save = async () => {
    setSaving(true)
    await placementReadinessService.saveConfig({ weights, thresholds, gateChecklist }, user?.id)
    setSaving(false)
    setMessage('Readiness weights and thresholds saved. Student readiness will use them immediately.')
  }

  const setStatus = (id: string, status: VerificationStatus) => {
    const next = { ...statuses, [id]: status }
    setStatuses(next)
    writeLocal('question_statuses', 'admin', next)
  }

  const effectiveStatus = (question: PlacementQuestionRecord): VerificationStatus =>
    statuses[question.id] ?? question.verificationStatus

  const filteredQuestions = PLACEMENT_QUESTIONS.filter((q) =>
    questionFilter === 'all' ? true : effectiveStatus(q) === questionFilter,
  )

  const counts = VERIFICATION_STATES.map((status) => ({
    status,
    count: PLACEMENT_QUESTIONS.filter((q) => effectiveStatus(q) === status).length,
  }))

  return (
    <div>
      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Readiness configuration</h2>
        <p>
          Weights decide how each area contributes to the overall readiness score. Thresholds
          decide the job-ready gate. Neither is hardcoded in the student UI — changing them here
          changes the calculation for every student.
        </p>
        {message && <div className="placement-callout success">{message}</div>}

        <h3 style={{ marginTop: 16 }}>Weights (%)</h3>
        <div className="placement-form">
          {(Object.keys(weights) as ReadinessCategory[]).map((category) => (
            <div className="placement-weight-row" key={category}>
              <strong>{CATEGORY_LABELS[category]}</strong>
              <input
                type="number"
                min={0}
                max={100}
                value={weights[category]}
                onChange={(e) => setWeights({ ...weights, [category]: Number(e.target.value) })}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={thresholds[category]}
                onChange={(e) => setThresholds({ ...thresholds, [category]: Number(e.target.value) })}
                title="Job-ready threshold (%)"
              />
              <span className="placement-inline-note">
                weight {weights[category]}% · threshold {thresholds[category]}%
              </span>
            </div>
          ))}
        </div>
        <p className="placement-inline-note">
          Left column: weight. Middle column: job-ready threshold (%). Weights are normalised at
          calculation time so they do not have to add up to 100.
        </p>

        <h3 style={{ marginTop: 16 }}>Job-ready gate checklist</h3>
        <div className="placement-form">
          <div className="placement-form-row">
            <label>
              Minimum mock interviews
              <input
                type="number"
                min={0}
                max={20}
                value={gateChecklist.min_mock_interviews}
                onChange={(e) =>
                  setGateChecklist({
                    ...gateChecklist,
                    min_mock_interviews: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
        </div>

        <div className="placement-actions">
          <button type="button" className="btn btn-primary" disabled={saving} onClick={() => void save()}>
            {saving ? 'Saving…' : 'Save configuration'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setWeights(DEFAULT_READINESS_CONFIG.weights)
              setThresholds(DEFAULT_READINESS_CONFIG.thresholds)
              setGateChecklist(DEFAULT_READINESS_CONFIG.gateChecklist)
            }}
          >
            Reset to defaults
          </button>
        </div>
      </div>

      <section className="placement-card">
        <h2>Question verification</h2>
        <p>
          Only <strong>verified</strong> questions appear in official assessments and student
          practice. Questions marked <em>needs review</em>, <em>incorrect</em>,{' '}
          <em>duplicate</em> or <em>archived</em> are withheld automatically.
        </p>
        <div className="placement-actions" style={{ marginTop: 0 }}>
          {counts.map((entry) => (
            <button
              key={entry.status}
              type="button"
              className={`placement-badge ${questionFilter === entry.status ? 'info' : ''}`}
              onClick={() => setQuestionFilter(entry.status)}
            >
              {entry.status.replace('_', ' ')}: {entry.count}
            </button>
          ))}
          <button
            type="button"
            className={`placement-badge ${questionFilter === 'all' ? 'info' : ''}`}
            onClick={() => setQuestionFilter('all')}
          >
            all: {PLACEMENT_QUESTIONS.length}
          </button>
          <span className="placement-badge good">
            {getVerifiedQuestions().length} currently visible to students
          </span>
        </div>

        <div className="placement-table-wrap" style={{ marginTop: 12 }}>
          <table className="placement-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Prompt</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.slice(0, 150).map((question) => (
                <tr key={question.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{question.id}</td>
                  <td>{question.category}</td>
                  <td>{question.subcategory}</td>
                  <td>{question.questionType}</td>
                  <td>{question.difficulty}</td>
                  <td style={{ maxWidth: 320, color: 'var(--text-secondary)' }}>
                    {question.prompt.slice(0, 140)}
                    {question.prompt.length > 140 ? '…' : ''}
                  </td>
                  <td>
                    <select
                      value={effectiveStatus(question)}
                      onChange={(e) =>
                        setStatus(question.id, e.target.value as VerificationStatus)
                      }
                    >
                      {VERIFICATION_STATES.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredQuestions.length > 150 && (
          <p className="placement-inline-note">
            Showing the first 150 of {filteredQuestions.length} matching questions. Narrow the
            filter to see more.
          </p>
        )}
      </section>
    </div>
  )
}
