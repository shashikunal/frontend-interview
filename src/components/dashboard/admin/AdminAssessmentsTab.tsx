import React, { useState, useCallback } from 'react'
import { useAssessments, useCreateAssessment, usePublishAssessment, useUnpublishAssessment, useArchiveAssessment, useDuplicateAssessment, useDeleteAssessment, useAdminStats } from '../../features/assessment-engine'
import type { Assessment, AssessmentType, AssessmentStatus, CreateAssessmentInput } from '../../features/assessment-engine'
import './AdminAssessmentsTab.css'

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  DRAFT: 'Draft',
  READY: 'Ready',
  PUBLISHED: 'Published',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived',
}

const TYPE_LABELS: Record<AssessmentType, string> = {
  frontend: 'Frontend',
  'machine-coding': 'Machine Coding',
  dsa: 'DSA / LeetCode',
  'core-programming': 'Core Programming',
}

const STATUS_COLORS: Record<AssessmentStatus, string> = {
  DRAFT: '#8b949e',
  READY: '#58a6ff',
  PUBLISHED: '#3fb950',
  ACTIVE: '#f0883e',
  COMPLETED: '#a371f7',
  ARCHIVED: '#484f58',
}

export default function AdminAssessmentsTab() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null)
  const [viewingAssessment, setViewingAssessment] = useState<Assessment | null>(null)
  const [filterStatus, setFilterStatus] = useState<AssessmentStatus | ''>('')
  const [filterType, setFilterType] = useState<AssessmentType | ''>('')
  const [search, setSearch] = useState('')

  const { data, isLoading, error } = useAssessments({
    status: filterStatus || undefined,
    assessment_type: filterType || undefined,
    search: search || undefined,
    limit: 100,
  })
  const { data: stats } = useAdminStats()
  const createMutation = useCreateAssessment()
  const publishMutation = usePublishAssessment()
  const unpublishMutation = useUnpublishAssessment()
  const archiveMutation = useArchiveAssessment()
  const duplicateMutation = useDuplicateAssessment()
  const deleteMutation = useDeleteAssessment()

  const handleCreate = useCallback(async (input: CreateAssessmentInput) => {
    await createMutation.mutateAsync(input)
    setShowCreateModal(false)
  }, [createMutation])

  const handlePublish = useCallback(async (id: string) => {
    await publishMutation.mutateAsync(id)
  }, [publishMutation])

  const handleUnpublish = useCallback(async (id: string) => {
    await unpublishMutation.mutateAsync(id)
  }, [unpublishMutation])

  const handleArchive = useCallback(async (id: string) => {
    await archiveMutation.mutateAsync(id)
  }, [archiveMutation])

  const handleDuplicate = useCallback(async (id: string) => {
    await duplicateMutation.mutateAsync(id)
  }, [duplicateMutation])

  const handleDelete = useCallback(async (id: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      await deleteMutation.mutateAsync(id)
    }
  }, [deleteMutation])

  if (isLoading) return <div className="admin-assessments-loading">Loading assessments...</div>
  if (error) return <div className="admin-assessments-error">Error loading assessments</div>

  const assessments = data?.assessments || []

  return (
    <div className="admin-assessments-tab">
      <div className="admin-assessments-header">
        <h2>Assessment Management</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create Assessment
        </button>
      </div>

      {stats && (
        <div className="admin-assessments-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.total_assessments}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.active_assessments}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.completed_assessments}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.total_candidates}</span>
            <span className="stat-label">Candidates</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.average_score}%</span>
            <span className="stat-label">Avg Score</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.pass_rate}%</span>
            <span className="stat-label">Pass Rate</span>
          </div>
        </div>
      )}

      <div className="admin-assessments-filters">
        <input
          type="text"
          placeholder="Search assessments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-assessments-search"
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as AssessmentStatus | '')}>
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value as AssessmentType | '')}>
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {assessments.length === 0 ? (
        <div className="admin-assessments-empty">
          <p>No assessments found. Create your first assessment to get started.</p>
        </div>
      ) : (
        <div className="admin-assessments-list">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="admin-assessment-card">
              <div className="admin-assessment-card-header">
                <h3>{assessment.title}</h3>
                <span
                  className="admin-assessment-status"
                  style={{ backgroundColor: STATUS_COLORS[assessment.status] }}
                >
                  {STATUS_LABELS[assessment.status]}
                </span>
              </div>
              <div className="admin-assessment-card-meta">
                <span className="admin-assessment-type">{TYPE_LABELS[assessment.assessment_type]}</span>
                <span>{assessment.duration_minutes} min</span>
                <span>{assessment.total_marks} marks</span>
                <span>Pass: {assessment.passing_marks}</span>
                <span>Max attempts: {assessment.maximum_attempts}</span>
              </div>
              {assessment.description && (
                <p className="admin-assessment-description">{assessment.description}</p>
              )}
              <div className="admin-assessment-card-actions">
                <button className="btn btn-sm" onClick={() => setViewingAssessment(assessment)}>
                  View
                </button>
                <button className="btn btn-sm" onClick={() => setEditingAssessment(assessment)}>
                  Edit
                </button>
                {assessment.status === 'DRAFT' || assessment.status === 'READY' ? (
                  <button className="btn btn-sm btn-success" onClick={() => handlePublish(assessment.id)}>
                    Publish
                  </button>
                ) : null}
                {assessment.status === 'PUBLISHED' || assessment.status === 'ACTIVE' ? (
                  <button className="btn btn-sm btn-warning" onClick={() => handleUnpublish(assessment.id)}>
                    Unpublish
                  </button>
                ) : null}
                <button className="btn btn-sm" onClick={() => handleDuplicate(assessment.id)}>
                  Duplicate
                </button>
                {assessment.status !== 'ARCHIVED' ? (
                  <button className="btn btn-sm btn-danger" onClick={() => handleArchive(assessment.id)}>
                    Archive
                  </button>
                ) : null}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(assessment.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <AssessmentFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          isLoading={createMutation.isPending}
        />
      )}

      {editingAssessment && (
        <AssessmentFormModal
          assessment={editingAssessment}
          onClose={() => setEditingAssessment(null)}
          onSubmit={async (input) => {
            const { useUpdateAssessment } = await import('../../features/assessment-engine')
            const mutation = useUpdateAssessment()
            await mutation.mutateAsync({ id: editingAssessment.id, input })
            setEditingAssessment(null)
          }}
          isLoading={false}
        />
      )}

      {viewingAssessment && (
        <AssessmentDetailModal
          assessment={viewingAssessment}
          onClose={() => setViewingAssessment(null)}
        />
      )}
    </div>
  )
}

function AssessmentFormModal({
  assessment,
  onClose,
  onSubmit,
  isLoading,
}: {
  assessment?: Assessment
  onClose: () => void
  onSubmit: (input: CreateAssessmentInput) => Promise<void>
  isLoading: boolean
}) {
  const [title, setTitle] = useState(assessment?.title || '')
  const [description, setDescription] = useState(assessment?.description || '')
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(assessment?.assessment_type || 'frontend')
  const [instructions, setInstructions] = useState(assessment?.instructions || '')
  const [durationMinutes, setDurationMinutes] = useState(assessment?.duration_minutes || 60)
  const [passingMarks, setPassingMarks] = useState(assessment?.passing_marks || 0)
  const [maximumAttempts, setMaximumAttempts] = useState(assessment?.maximum_attempts || 1)
  const [startDate, setStartDate] = useState(assessment?.start_at ? assessment.start_at.slice(0, 10) : '')
  const [startTime, setStartTime] = useState(assessment?.start_at ? assessment.start_at.slice(11, 16) : '')
  const [endDate, setEndDate] = useState(assessment?.end_at ? assessment.end_at.slice(0, 10) : '')
  const [endTime, setEndTime] = useState(assessment?.end_at ? assessment.end_at.slice(11, 16) : '')
  const [timezone, setTimezone] = useState(assessment?.timezone || 'UTC')
  const [allowLateStart, setAllowLateStart] = useState(assessment?.allow_late_start || false)
  const [lateStartGrace, setLateStartGrace] = useState(assessment?.late_start_grace_minutes || 0)
  const [negativeMarking, setNegativeMarking] = useState(assessment?.negative_marking_enabled || false)
  const [negativeMarks, setNegativeMarks] = useState(assessment?.negative_marks_per_wrong || 0)
  const [resultRelease, setResultRelease] = useState(assessment?.result_release_policy || 'after_submission')
  const [showScore, setShowScore] = useState(assessment?.show_score ?? true)
  const [showPercentage, setShowPercentage] = useState(assessment?.show_percentage ?? true)
  const [showPassFail, setShowPassFail] = useState(assessment?.show_pass_fail ?? true)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(assessment?.show_correct_answers || false)
  const [showExplanations, setShowExplanations] = useState(assessment?.show_explanations || false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const startAt = startDate && startTime ? new Date(`${startDate}T${startTime}:00Z`).toISOString() : null
    const endAt = endDate && endTime ? new Date(`${endDate}T${endTime}:00Z`).toISOString() : null

    await onSubmit({
      title,
      description,
      assessment_type: assessmentType,
      instructions,
      duration_minutes: durationMinutes,
      start_at: startAt,
      end_at: endAt,
      timezone,
      passing_marks: passingMarks,
      maximum_attempts: maximumAttempts,
      allow_late_start: allowLateStart,
      late_start_grace_minutes: lateStartGrace,
      negative_marking_enabled: negativeMarking,
      negative_marks_per_wrong: negativeMarks,
      result_release_policy: resultRelease,
      show_score: showScore,
      show_percentage: showPercentage,
      show_pass_fail: showPassFail,
      show_correct_answers: showCorrectAnswers,
      show_explanations: showExplanations,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-assessment-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{assessment ? 'Edit Assessment' : 'Create Assessment'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Assessment Type</label>
            <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}>
              <option value="frontend">Frontend</option>
              <option value="machine-coding">Machine Coding</option>
              <option value="dsa">DSA / LeetCode</option>
              <option value="core-programming">Core Programming</option>
            </select>
          </div>
          <div className="form-group">
            <label>Instructions</label>
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration (minutes)</label>
              <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} min={1} />
            </div>
            <div className="form-group">
              <label>Passing Marks</label>
              <input type="number" value={passingMarks} onChange={(e) => setPassingMarks(Number(e.target.value))} min={0} />
            </div>
            <div className="form-group">
              <label>Max Attempts</label>
              <input type="number" value={maximumAttempts} onChange={(e) => setMaximumAttempts(Number(e.target.value))} min={1} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Timezone</label>
            <input type="text" value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </div>
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" checked={allowLateStart} onChange={(e) => setAllowLateStart(e.target.checked)} />
              Allow Late Start
            </label>
          </div>
          {allowLateStart && (
            <div className="form-group">
              <label>Late Start Grace (minutes)</label>
              <input type="number" value={lateStartGrace} onChange={(e) => setLateStartGrace(Number(e.target.value))} min={0} />
            </div>
          )}
          <div className="form-group checkbox">
            <label>
              <input type="checkbox" checked={negativeMarking} onChange={(e) => setNegativeMarking(e.target.checked)} />
              Enable Negative Marking
            </label>
          </div>
          {negativeMarking && (
            <div className="form-group">
              <label>Marks per Wrong Answer</label>
              <input type="number" value={negativeMarks} onChange={(e) => setNegativeMarks(Number(e.target.value))} min={0} step={0.5} />
            </div>
          )}
          <div className="form-group">
            <label>Result Release Policy</label>
            <select value={resultRelease} onChange={(e) => setResultRelease(e.target.value as typeof resultRelease)}>
              <option value="immediately">Immediately</option>
              <option value="after_submission">After Submission</option>
              <option value="after_manual_evaluation">After Manual Evaluation</option>
              <option value="after_assessment_closes">After Assessment Closes</option>
              <option value="admin_only">Admin Only</option>
            </select>
          </div>
          <div className="form-group">
            <label>Result Visibility</label>
            <div className="checkbox-group">
              <label><input type="checkbox" checked={showScore} onChange={(e) => setShowScore(e.target.checked)} /> Show Score</label>
              <label><input type="checkbox" checked={showPercentage} onChange={(e) => setShowPercentage(e.target.checked)} /> Show Percentage</label>
              <label><input type="checkbox" checked={showPassFail} onChange={(e) => setShowPassFail(e.target.checked)} /> Show Pass/Fail</label>
              <label><input type="checkbox" checked={showCorrectAnswers} onChange={(e) => setShowCorrectAnswers(e.target.checked)} /> Show Correct Answers</label>
              <label><input type="checkbox" checked={showExplanations} onChange={(e) => setShowExplanations(e.target.checked)} /> Show Explanations</label>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving...' : assessment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AssessmentDetailModal({ assessment, onClose }: { assessment: Assessment; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-assessment-detail" onClick={(e) => e.stopPropagation()}>
        <h2>{assessment.title}</h2>
        <div className="detail-section">
          <h3>Details</h3>
          <dl>
            <dt>Type</dt><dd>{TYPE_LABELS[assessment.assessment_type]}</dd>
            <dt>Status</dt><dd>{STATUS_LABELS[assessment.status]}</dd>
            <dt>Duration</dt><dd>{assessment.duration_minutes} minutes</dd>
            <dt>Total Marks</dt><dd>{assessment.total_marks}</dd>
            <dt>Passing Marks</dt><dd>{assessment.passing_marks}</dd>
            <dt>Max Attempts</dt><dd>{assessment.maximum_attempts}</dd>
            <dt>Timezone</dt><dd>{assessment.timezone}</dd>
            {assessment.start_at && <><dt>Starts</dt><dd>{new Date(assessment.start_at).toLocaleString()}</dd></>}
            {assessment.end_at && <><dt>Ends</dt><dd>{new Date(assessment.end_at).toLocaleString()}</dd></>}
          </dl>
        </div>
        {assessment.description && (
          <div className="detail-section">
            <h3>Description</h3>
            <p>{assessment.description}</p>
          </div>
        )}
        {assessment.instructions && (
          <div className="detail-section">
            <h3>Instructions</h3>
            <p>{assessment.instructions}</p>
          </div>
        )}
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
