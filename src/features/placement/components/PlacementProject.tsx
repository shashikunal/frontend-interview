import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth'
import { placementApplicationsService } from '../services/placementApplications.service'
import type { PlacementProject, PlacementProjectReview } from '../types/placement.types'

const DEFENSE_QUESTIONS = [
  'Why did you choose this stack?',
  'How does authentication work in your project?',
  'How does the API layer work?',
  'Where is the data stored and why that choice?',
  'How do you handle API failure?',
  'How do you handle loading and empty states?',
  'How did you deploy it?',
  'What happens if 1000 users use the application at once?',
  'What was your hardest bug and how did you solve it?',
  'What would you improve with two more weeks?',
]

const EMPTY_PROJECT: Omit<PlacementProject, 'id' | 'userId'> = {
  title: '',
  description: '',
  techStack: [],
  repoUrl: '',
  liveUrl: '',
  readmeUrl: '',
  hasReadme: false,
  hasScreenshots: false,
  hasAuth: false,
  hasErrorHandling: false,
  hasDeployment: false,
  architectureNotes: '',
  apiNotes: '',
  databaseNotes: '',
  deploymentNotes: '',
  status: 'draft',
}

export default function PlacementProject() {
  const { user } = useAuth()
  const userId = user?.id
  const [projects, setProjects] = useState<PlacementProject[]>([])
  const [reviews, setReviews] = useState<PlacementProjectReview[]>([])
  const [draft, setDraft] = useState(EMPTY_PROJECT)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [techStackText, setTechStackText] = useState('')
  const [defenseAnswers, setDefenseAnswers] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const refresh = async () => {
    if (!userId) return
    setProjects(await placementApplicationsService.getProjects(userId))
    setReviews(await placementApplicationsService.getProjectReviews(userId))
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const save = async () => {
    if (!userId || !draft.title.trim()) return
    setSaving(true)
    await placementApplicationsService.saveProject(userId, {
      ...draft,
      id: editingId ?? undefined,
      techStack: techStackText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    })
    setDraft(EMPTY_PROJECT)
    setTechStackText('')
    setEditingId(null)
    setSaving(false)
    await refresh()
  }

  const edit = (project: PlacementProject) => {
    setEditingId(project.id)
    setDraft({ ...project })
    setTechStackText(project.techStack.join(', '))
  }

  const completeDefense = async () => {
    if (!userId || !projects[0]) return
    const answered = Object.entries(defenseAnswers).filter(([, v]) => v.trim().length > 0)
    const score = Math.round((answered.length / DEFENSE_QUESTIONS.length) * 100)
    await placementApplicationsService.saveProjectReview(userId, {
      projectId: projects[0].id,
      reviewType: 'self',
      score,
      maxScore: 100,
      clarityScore: score,
      technicalScore: score,
      architectureScore: score,
      deploymentScore: score,
      communicationScore: score,
      questionsAsked: answered.map(([question, answer]) => ({ question, answer, rating: 3 })),
      strengths: '',
      improvements: answered.length < DEFENSE_QUESTIONS.length ? 'Some defense questions are still unanswered.' : '',
      verdict: score >= 75 ? 'pass' : score >= 50 ? 'needs_work' : 'fail',
    })
    setDefenseAnswers({})
    await refresh()
  }

  const project = projects[0]
  const completeness = project
    ? Math.round(
        ([
          project.repoUrl,
          project.liveUrl,
          project.hasReadme,
          project.hasScreenshots,
          project.hasAuth,
          project.hasErrorHandling,
          project.hasDeployment,
          project.architectureNotes,
          project.apiNotes,
          project.databaseNotes,
        ].filter(Boolean).length /
          10) *
          100,
      )
    : 0

  return (
    <div>
      <div className="placement-grid cols-3" style={{ marginBottom: 18 }}>
        <div className="placement-card placement-stat">
          <span className="value">{project ? `${completeness}%` : '—'}</span>
          <span className="label">Project completeness</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{project?.status ?? 'none'}</span>
          <span className="label">Status</span>
        </div>
        <div className="placement-card placement-stat">
          <span className="value">{reviews.length}</span>
          <span className="label">Defense reviews</span>
        </div>
      </div>

      {project && completeness < 100 && (
        <div className="placement-callout" style={{ marginBottom: 18 }}>
          <strong>Project Checklist — {completeness}% complete</strong>
          <div className="placement-progress-track" style={{ marginTop: 8 }}>
            <div className="placement-progress-fill" style={{ width: `${completeness}%` }} />
          </div>
          <ul style={{ margin: '12px 0 0', paddingLeft: 18 }}>
            {!project.repoUrl && <li>Add GitHub repository URL</li>}
            {!project.liveUrl && <li>Add live deployment URL</li>}
            {!project.hasReadme && <li>Write a README</li>}
            {!project.hasScreenshots && <li>Add screenshots</li>}
            {!project.hasAuth && <li>Implement authentication</li>}
            {!project.hasErrorHandling && <li>Add error handling</li>}
            {!project.hasDeployment && <li>Deploy the project</li>}
            {!project.architectureNotes && <li>Document architecture</li>}
            {!project.apiNotes && <li>Document API layer</li>}
            {!project.databaseNotes && <li>Document database choices</li>}
          </ul>
        </div>
      )}

      <div className="placement-card" style={{ marginBottom: 18 }}>
        <h2>{editingId ? 'Edit project' : 'Register your project'}</h2>
        <p>
          One real project, defended properly: repository, README, live URL, stack, architecture,
          API, database, authentication, error handling and deployment. Nothing here is filled in
          for you — an item only counts when you provide the actual link or note.
        </p>
        <div className="placement-form" style={{ marginTop: 12 }}>
          <div className="placement-form-row">
            <label>
              Project title
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                placeholder="e.g. Job application tracker"
              />
            </label>
            <label>
              Status
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft({ ...draft, status: e.target.value as PlacementProject['status'] })
                }
              >
                <option value="draft">Draft</option>
                <option value="in_progress">In progress</option>
                <option value="ready_for_review">Ready for review</option>
                <option value="defended">Defended</option>
                <option value="needs_work">Needs work</option>
              </select>
            </label>
            <label>
              Tech stack (comma separated)
              <input
                value={techStackText}
                onChange={(e) => setTechStackText(e.target.value)}
                placeholder="React, TypeScript, Supabase"
              />
            </label>
          </div>
          <label>
            Description
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </label>
          <div className="placement-form-row">
            <label>
              GitHub repository URL
              <input
                value={draft.repoUrl}
                onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                placeholder="https://github.com/..."
              />
            </label>
            <label>
              Live URL
              <input
                value={draft.liveUrl}
                onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
                placeholder="https://..."
              />
            </label>
            <label>
              README URL
              <input
                value={draft.readmeUrl}
                onChange={(e) => setDraft({ ...draft, readmeUrl: e.target.value })}
              />
            </label>
          </div>
          <div className="placement-form-row">
            <label>
              Architecture notes
              <textarea
                rows={2}
                value={draft.architectureNotes}
                onChange={(e) => setDraft({ ...draft, architectureNotes: e.target.value })}
              />
            </label>
            <label>
              API notes
              <textarea
                rows={2}
                value={draft.apiNotes}
                onChange={(e) => setDraft({ ...draft, apiNotes: e.target.value })}
              />
            </label>
            <label>
              Database notes
              <textarea
                rows={2}
                value={draft.databaseNotes}
                onChange={(e) => setDraft({ ...draft, databaseNotes: e.target.value })}
              />
            </label>
          </div>
          <div className="placement-form-row">
            <label>
              Deployment notes
              <textarea
                rows={2}
                value={draft.deploymentNotes}
                onChange={(e) => setDraft({ ...draft, deploymentNotes: e.target.value })}
              />
            </label>
          </div>
          <div className="placement-checklist">
            {(
              [
                ['hasReadme', 'README written'],
                ['hasScreenshots', 'Project screenshots added'],
                ['hasAuth', 'Authentication implemented'],
                ['hasErrorHandling', 'Error and loading states implemented'],
                ['hasDeployment', 'Deployed to a live URL'],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={draft[key]}
                  onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="placement-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={saving || !draft.title.trim()}
              onClick={() => void save()}
            >
              {saving ? 'Saving…' : editingId ? 'Update project' : 'Save project'}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setEditingId(null)
                  setDraft(EMPTY_PROJECT)
                  setTechStackText('')
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="placement-grid cols-2">
        <section className="placement-card">
          <h2>Project defense rehearsal</h2>
          <p className="placement-inline-note">
            Answer each question out loud before writing anything. The self-review is stored so a
            mentor can see exactly where the defence is still weak.
          </p>
          {!project ? (
            <div className="placement-empty">Register a project before rehearsing the defence.</div>
          ) : (
            <>
              <div className="placement-form" style={{ marginTop: 12 }}>
                {DEFENSE_QUESTIONS.map((question) => (
                  <label key={question}>
                    {question}
                    <textarea
                      rows={2}
                      value={defenseAnswers[question] ?? ''}
                      onChange={(e) =>
                        setDefenseAnswers((d) => ({ ...d, [question]: e.target.value }))
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="placement-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => void completeDefense()}
                >
                  Save self defence review
                </button>
              </div>
            </>
          )}
        </section>

        <section className="placement-card">
          <h2>Defense reviews</h2>
          {reviews.length ? (
            <ul className="placement-list">
              {reviews.map((review) => (
                <li key={review.id}>
                  <div className="placement-item-body">
                    <p className="placement-item-title">
                      {review.reviewType} review — {review.score}/{review.maxScore}
                    </p>
                    <p className="placement-item-meta">
                      {new Date(review.createdAt).toLocaleString()}
                      {review.improvements ? ` · ${review.improvements}` : ''}
                    </p>
                  </div>
                  <span
                    className={`placement-badge ${
                      review.verdict === 'pass' ? 'good' : review.verdict === 'fail' ? 'bad' : 'warn'
                    }`}
                  >
                    {review.verdict}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="placement-empty">
              No data available yet. Complete a self defence review to create the first record.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
