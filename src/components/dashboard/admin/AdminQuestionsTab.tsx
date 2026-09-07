import { useState, useMemo } from 'react'
import type { AdminQuestionStat } from '../../../lib/adminAnalyticsService'

interface AdminQuestionsTabProps {
  questionsList?: AdminQuestionStat[]
  initialStats?: AdminQuestionStat[]
  onRefresh?: () => void
}

export default function AdminQuestionsTab({
  questionsList,
  initialStats,
  onRefresh,
}: AdminQuestionsTabProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const effectiveList = questionsList || initialStats || []

  const filtered = useMemo(() => {
    return effectiveList.filter(q => {
      const matchesSearch = !search || q.id.toLowerCase().includes(search.toLowerCase()) || q.title.toLowerCase().includes(search.toLowerCase())
      const matchesCat = categoryFilter === 'ALL' || q.category.toLowerCase().includes(categoryFilter.toLowerCase())
      return matchesSearch && matchesCat
    })
  }, [effectiveList, search, categoryFilter])

  return (
    <div className="admin-questions-tab">
      <div className="card-box aq-panel">
        <div className="aq-header">
          <div>
            <h3>Question Bank Performance &amp; Analytics ({filtered.length})</h3>
            <p className="aq-desc">
              Track candidate attempts, completion rates, submission success, and time spent across the question bank.
            </p>
          </div>

          <div className="aq-controls">
            <input
              type="text"
              className="search-field"
              placeholder="Search question ID or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="role-dropdown"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="Machine Coding">Machine Coding</option>
              <option value="Frontend Core">Frontend Core</option>
              <option value="React">ReactJS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="System Design">System Design</option>
            </select>

            <button type="button" className="btn btn-secondary btn-sm" onClick={onRefresh}>
              🔄 Refresh
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Question ID</th>
                <th>Title / Challenge</th>
                <th>Category</th>
                <th>Candidates Attempted</th>
                <th>Submissions</th>
                <th>Completion Rate</th>
                <th>Success Rate</th>
                <th>Avg Attempts</th>
                <th>Avg Time Spent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No question performance data found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map(q => (
                  <tr key={q.id}>
                    <td>
                      <span className="aq-qid-tag">{q.id}</span>
                    </td>
                    <td>
                      <span className="aq-title">{q.title}</span>
                    </td>
                    <td>
                      <span className="aq-category-badge">{q.category}</span>
                    </td>
                    <td>
                      <strong>{q.attemptsCount}</strong>
                    </td>
                    <td>
                      {q.submissionsCount}
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="mini-track">
                          <div className="mini-fill" style={{ width: `${q.completionRate}%` }} />
                        </div>
                        <span className="mini-pct">{q.completionRate}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${q.successRate >= 60 ? 'badge-active' : 'badge-suspended'}`}>
                        {q.successRate}%
                      </span>
                    </td>
                    <td>
                      {q.avgAttempts}x
                    </td>
                    <td>
                      {q.avgTimeSpentSeconds > 0 ? `${Math.round(q.avgTimeSpentSeconds / 60)}m` : '< 1m'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
