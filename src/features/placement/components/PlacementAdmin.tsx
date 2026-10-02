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
import { supabase } from '../../../lib/supabase/client'

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

interface StudentPlacementSummary {
  userId: string
  email: string
  name: string
  currentDay: number
  daysCompleted: number
  totalAttempts: number
  totalCorrect: number
  accuracy: number
  streakDays: number
  applications: number
  mockInterviews: number
  projects: number
  lastActivity: string | null
}

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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [studentSearch, setStudentSearch] = useState('')
  const [studentSummaries, setStudentSummaries] = useState<StudentPlacementSummary[]>([])
  const [loadingStudents, setLoadingStudents] = useState(false)

  useEffect(() => {
    if (!canManage) return
    void placementReadinessService.getConfig().then((config) => {
      setWeights(config.weights)
      setThresholds(config.thresholds)
      setGateChecklist(config.gateChecklist)
    })
    setStatuses(readLocal<Record<string, VerificationStatus>>('question_statuses', 'admin', {}))
  }, [canManage])

  useEffect(() => {
    if (!canManage) return
    setLoadingStudents(true)
    void (async () => {
      try {
        const { data: progressData } = await supabase
          .from('placement_progress')
          .select('user_id, current_day, days_completed, streak_days, total_questions_attempted, total_questions_correct, last_activity_at')
        const { data: applicationsData } = await supabase
          .from('placement_job_applications')
          .select('user_id')
        const { data: mockData } = await supabase
          .from('placement_mock_interviews')
          .select('user_id')
        const { data: projectData } = await supabase
          .from('placement_projects')
          .select('user_id')
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, email, full_name')

        const appCount = new Map<string, number>()
        for (const row of applicationsData ?? []) {
          appCount.set(row.user_id, (appCount.get(row.user_id) ?? 0) + 1)
        }
        const mockCount = new Map<string, number>()
        for (const row of mockData ?? []) {
          mockCount.set(row.user_id, (mockCount.get(row.user_id) ?? 0) + 1)
        }
        const projectCount = new Map<string, number>()
        for (const row of projectData ?? []) {
          projectCount.set(row.user_id, (projectCount.get(row.user_id) ?? 0) + 1)
        }

        const summaries: StudentPlacementSummary[] = (progressData ?? []).map((row) => {
          const profile = profilesData?.find((p) => p.id === row.user_id)
          const total = Number(row.total_questions_attempted ?? 0)
          const correct = Number(row.total_questions_correct ?? 0)
          return {
            userId: row.user_id,
            email: profile?.email ?? row.user_id,
            name: profile?.full_name ?? profile?.email ?? row.user_id,
            currentDay: Number(row.current_day ?? 1),
            daysCompleted: (row.days_completed as unknown[])?.length ?? 0,
            totalAttempts: total,
            totalCorrect: correct,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
            streakDays: Number(row.streak_days ?? 0),
            applications: appCount.get(row.user_id) ?? 0,
            mockInterviews: mockCount.get(row.user_id) ?? 0,
            projects: projectCount.get(row.user_id) ?? 0,
            lastActivity: row.last_activity_at ?? null,
          }
        })

        setStudentSummaries(summaries)
      } catch {
        setStudentSummaries([])
      } finally {
        setLoadingStudents(false)
      }
    })()
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

  const filteredQuestions = PLACEMENT_QUESTIONS.filter((q) => {
    if (questionFilter !== 'all' && effectiveStatus(q) !== questionFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        q.id.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.subcategory.toLowerCase().includes(query) ||
        q.prompt.toLowerCase().includes(query)
      )
    }
    return true
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const bulkSetStatus = (status: VerificationStatus) => {
    const next = { ...statuses }
    for (const id of selectedIds) {
      next[id] = status
    }
    setStatuses(next)
    writeLocal('question_statuses', 'admin', next)
    setSelectedIds(new Set())
  }

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

        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Search questions
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, topic, or content..."
              />
            </label>
            <label>
              &nbsp;
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedIds(new Set(filteredQuestions.map((q) => q.id)))}
              >
                Select all
              </button>
            </label>
            <label>
              &nbsp;
              <button
                type="button"
                className="btn"
                onClick={() => setSelectedIds(new Set())}
                disabled={selectedIds.size === 0}
              >
                Clear selection
              </button>
            </label>
          </div>
        </div>

        {selectedIds.size > 0 && (
          <div className="placement-callout" style={{ marginTop: 12 }}>
            <strong>{selectedIds.size} questions selected</strong>
            <div className="placement-actions" style={{ marginTop: 8 }}>
              <button type="button" className="btn btn-sm" onClick={() => bulkSetStatus('verified')}>
                Mark verified
              </button>
              <button type="button" className="btn btn-sm" onClick={() => bulkSetStatus('needs_review')}>
                Mark needs review
              </button>
              <button type="button" className="btn btn-sm" onClick={() => bulkSetStatus('incorrect')}>
                Mark incorrect
              </button>
              <button type="button" className="btn btn-sm" onClick={() => bulkSetStatus('archived')}>
                Archive
              </button>
            </div>
          </div>
        )}

        <div className="placement-table-wrap" style={{ marginTop: 12 }}>
          <table className="placement-table">
            <thead>
              <tr>
                <th></th>
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
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(question.id)}
                      onChange={() => toggleSelect(question.id)}
                    />
                  </td>
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

      <section className="placement-card" style={{ marginTop: 18 }}>
        <h2>Candidate Placement History</h2>
        <p>Overview of all candidates&apos; placement progress, attempts, and activity.</p>
        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Search candidates
              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                placeholder="Search by name or email..."
              />
            </label>
          </div>
        </div>
        {loadingStudents ? (
          <div className="placement-empty">Loading candidates...</div>
        ) : studentSummaries.length > 0 ? (
          <div className="placement-table-wrap" style={{ marginTop: 12 }}>
            <table className="placement-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Day</th>
                  <th>Days Done</th>
                  <th>Attempts</th>
                  <th>Accuracy</th>
                  <th>Streak</th>
                  <th>Apps</th>
                  <th>Mocks</th>
                  <th>Projects</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {studentSummaries
                  .filter((s) => {
                    if (!studentSearch) return true
                    const q = studentSearch.toLowerCase()
                    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q)
                  })
                  .map((s) => (
                    <tr key={s.userId}>
                      <td>
                        <strong>{s.name}</strong>
                        <br />
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.email}</span>
                      </td>
                      <td>{s.currentDay}</td>
                      <td>{s.daysCompleted}</td>
                      <td>{s.totalAttempts}</td>
                      <td>
                        <span className={`placement-badge ${s.accuracy >= 70 ? 'good' : s.accuracy >= 50 ? 'warn' : 'bad'}`}>
                          {s.accuracy}%
                        </span>
                      </td>
                      <td>{s.streakDays}</td>
                      <td>{s.applications}</td>
                      <td>{s.mockInterviews}</td>
                      <td>{s.projects}</td>
                      <td>{s.lastActivity ? new Date(s.lastActivity).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="placement-empty">No candidate data available yet.</div>
        )}
      </section>
    </div>
  )
}
