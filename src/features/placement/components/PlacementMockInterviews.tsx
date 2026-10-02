import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { placementApplicationsService } from '../services/placementApplications.service'
import type {
  PlacementMockInterview,
  PlacementMockResult,
} from '../types/placement.types'

const MOCK_TYPES: PlacementMockInterview['mockType'][] = [
  'full',
  'dsa',
  'frontend',
  'machine_coding',
  'project',
  'communication',
  'hr',
  'language',
]

const RESULT_LABELS: Record<PlacementMockResult['result'], string> = {
  pending: 'Pending',
  strong_hire: 'Strong hire',
  hire: 'Hire',
  lean_hire: 'Lean hire',
  lean_no_hire: 'Lean no hire',
  no_hire: 'No hire',
}

export default function PlacementMockInterviews() {
  const { user } = useAuth()
  const userId = user?.id
  const [mocks, setMocks] = useState<PlacementMockInterview[]>([])
  const [results, setResults] = useState<PlacementMockResult[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    mockType: 'full' as PlacementMockInterview['mockType'],
    scheduledAt: '',
    durationMinutes: 60,
    interviewerName: '',
  })
  const [resultDraft, setResultDraft] = useState<Record<string, { score: number; feedback: string }>>({})

  const refresh = async () => {
    if (!userId) return
    setLoading(true)
    setMocks(await placementApplicationsService.getMockInterviews(userId))
    setResults(await placementApplicationsService.getMockResults(userId))
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const schedule = async () => {
    if (!userId || !form.title.trim()) return
    await placementApplicationsService.saveMockInterview(userId, {
      title: form.title.trim(),
      mockType: form.mockType,
      scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
      conductedAt: null,
      durationMinutes: Number(form.durationMinutes) || 60,
      interviewerName: form.interviewerName.trim(),
      status: 'scheduled',
      notes: '',
    })
    setForm({ title: '', mockType: 'full', scheduledAt: '', durationMinutes: 60, interviewerName: '' })
    await refresh()
  }

  const complete = async (mock: PlacementMockInterview) => {
    if (!userId) return
    await placementApplicationsService.saveMockInterview(userId, {
      ...mock,
      status: 'completed',
      conductedAt: new Date().toISOString(),
    })
    const draft = resultDraft[mock.id]
    if (draft) {
      await placementApplicationsService.saveMockResult(userId, {
        mockId: mock.id,
        result: 'pending',
        overallScore: Number(draft.score) || 0,
        areaScores: {},
        strengths: [],
        improvements: [],
        questionsFailed: [],
        questionsPassed: [],
        feedback: draft.feedback,
      })
    }
    await refresh()
  }

  const completedCount = mocks.filter((m) => m.status === 'completed').length

  return (
    <div>
      <div className="placement-grid cols-3" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{mocks.length}</span>
          <span className="label">Mock interviews scheduled</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{completedCount}</span>
          <span className="label">Completed</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{Math.max(0, 3 - completedCount)}</span>
          <span className="label">Remaining for job-ready gate</span>
        </div>
      </div>

      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>Schedule a mock interview</h2>
        <p className="placement-inline-note">
          Day 28 is a full mock across aptitude, technical MCQ, DSA, frontend, language, SQL,
          project and communication. Record every mock so the job-ready gate and mentor
          intervention can use the real numbers.
        </p>
        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Title
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Full mock — Day 28"
              />
            </label>
            <label>
              Type
              <select
                value={form.mockType}
                onChange={(e) =>
                  setForm({ ...form, mockType: e.target.value as PlacementMockInterview['mockType'] })
                }
              >
                {MOCK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Scheduled at
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              />
            </label>
            <label>
              Duration (minutes)
              <input
                type="number"
                min={15}
                max={180}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
              />
            </label>
            <label>
              Interviewer name (optional)
              <input
                value={form.interviewerName}
                onChange={(e) => setForm({ ...form, interviewerName: e.target.value })}
                placeholder="Peer / mentor"
              />
            </label>
          </div>
          <div className="placement-actions">
            <button type="button" className="btn btn-primary" onClick={() => void schedule()}>
              Schedule mock
            </button>
            <Link className="btn" to="/mock-interview">
              Open existing mock interview runner
            </Link>
            <Link className="btn" to="/mock-coding">
              Open machine coding mock
            </Link>
          </div>
        </div>
      </div>

      <section className="placement-card">
        <h2>Mock interviews</h2>
        {loading ? (
          <div className="placement-empty">Loading…</div>
        ) : mocks.length ? (
          <ul className="placement-list">
            {mocks.map((mock) => {
              const result = results.find((r) => r.mockId === mock.id)
              return (
                <li key={mock.id}>
                  <div className="placement-item-body">
                    <p className="placement-item-title">{mock.title}</p>
                    <p className="placement-item-meta">
                      {mock.mockType.replace('_', ' ')} · {mock.durationMinutes} min
                      {mock.scheduledAt ? ` · ${new Date(mock.scheduledAt).toLocaleString()}` : ''}
                      {mock.interviewerName ? ` · ${mock.interviewerName}` : ''}
                    </p>
                    {result ? (
                      <p className="placement-item-meta">
                        Result: {RESULT_LABELS[result.result]} · score {result.overallScore}%
                        {result.feedback ? ` · ${result.feedback}` : ''}
                      </p>
                    ) : mock.status === 'completed' ? (
                      <div className="placement-form" style={{ marginTop: 8 }}>
                        <div className="placement-form-row">
                          <label>
                            Score (%)
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={resultDraft[mock.id]?.score ?? ''}
                              onChange={(e) =>
                                setResultDraft((d) => ({
                                  ...d,
                                  [mock.id]: {
                                    score: Number(e.target.value),
                                    feedback: d[mock.id]?.feedback ?? '',
                                  },
                                }))
                              }
                            />
                          </label>
                          <label>
                            Feedback
                            <input
                              value={resultDraft[mock.id]?.feedback ?? ''}
                              onChange={(e) =>
                                setResultDraft((d) => ({
                                  ...d,
                                  [mock.id]: {
                                    score: d[mock.id]?.score ?? 0,
                                    feedback: e.target.value,
                                  },
                                }))
                              }
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => void complete(mock)}
                        >
                          Save result
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <span
                    className={`placement-badge ${
                      mock.status === 'completed' ? 'good' : mock.status === 'scheduled' ? 'info' : 'warn'
                    }`}
                  >
                    {mock.status}
                  </span>
                  {mock.status === 'scheduled' && (
                    <button type="button" className="btn btn-sm" onClick={() => void complete(mock)}>
                      Mark completed
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="placement-empty">
            No data available yet. Schedule your first mock interview — the job-ready gate requires
            at least 3 completed mocks.
          </div>
        )}
      </section>
    </div>
  )
}
