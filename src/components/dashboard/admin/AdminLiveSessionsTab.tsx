import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewSessionService, type InterviewSession } from '../../../lib/interviewSessionService';
import './AdminLiveSessionsTab.css';

export default function AdminLiveSessionsTab() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSessions = async () => {
    try {
      const list = await interviewSessionService.listAllSessions(50);
      setSessions(list);
    } catch (err) {
      console.error('[AdminLiveSessionsTab] Failed to fetch live sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 6000); // Polling refresh
    return () => clearInterval(interval);
  }, []);

  const filteredSessions = sessions.filter(s => {
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.candidate_name.toLowerCase().includes(q) ||
        s.candidate_email.toLowerCase().includes(q) ||
        s.question_title.toLowerCase().includes(q) ||
        s.question_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = sessions.filter(s => s.status === 'active' || s.status === 'in_progress').length;
  const submittedCount = sessions.filter(s => s.status === 'submitted' || s.status === 'completed').length;

  return (
    <div className="admin-live-sessions-tab page-enter">
      {/* Header & Stats Banner */}
      <div className="live-sessions-header">
        <div>
          <h2 className="live-sessions-title">
            <span className="live-header-pulse" />
            Live Machine Coding Sessions & Interviews
          </h2>
          <p className="live-sessions-sub">
            Real-time candidate monitoring, two-way interview collaboration, Yjs synchronized code visibility, and execution tracking.
          </p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={fetchSessions}>
          🔄 Refresh Feed
        </button>
      </div>

      {/* KPI Cards */}
      <div className="live-kpi-grid">
        <div className="live-kpi-card">
          <span className="live-kpi-label">Active Coding Sessions</span>
          <span className="live-kpi-val green">{activeCount}</span>
          <span className="live-kpi-note">Live candidates in studio</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">Submissions Ready for Review</span>
          <span className="live-kpi-val purple">{submittedCount}</span>
          <span className="live-kpi-note">Completed interview sessions</span>
        </div>
        <div className="live-kpi-card">
          <span className="live-kpi-label">Total Tracked Sessions</span>
          <span className="live-kpi-val blue">{sessions.length}</span>
          <span className="live-kpi-note">Recorded in Supabase</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="live-filter-bar">
        <div className="live-search-wrap">
          <input
            type="text"
            placeholder="Search candidate name, email, or question title..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="live-search-input"
          />
        </div>

        <div className="live-status-pills">
          {['all', 'active', 'in_progress', 'submitted', 'completed'].map(st => (
            <button
              key={st}
              type="button"
              className={`live-status-pill ${filterStatus === st ? 'active' : ''}`}
              onClick={() => setFilterStatus(st)}
            >
              {st === 'all' ? 'All Sessions' : st.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      {loading ? (
        <div className="live-loading-state">
          <div className="app-route-spinner" />
          <p>Connecting to Supabase Realtime sessions ledger...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="live-empty-state">
          <span className="empty-state-icon">⚡</span>
          <h3>No Live Sessions Found</h3>
          <p>
            When a candidate opens a question at <code>/machine-coding?id=...</code>, their session will appear here with live updates.
          </p>
          <Link to="/machine-coding?id=Q001" className="btn btn-primary btn-sm" target="_blank">
            Open Machine Coding Studio as Demo Candidate →
          </Link>
        </div>
      ) : (
        <div className="live-table-wrap">
          <table className="live-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Challenge / Question</th>
                <th>Status</th>
                <th>Active File</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map(sess => {
                const isActive = sess.status === 'active' || sess.status === 'in_progress';
                return (
                  <tr key={sess.id} className={isActive ? 'session-row-active' : ''}>
                    <td>
                      <div className="cand-cell">
                        <div className="cand-avatar">
                          {sess.candidate_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong className="cand-name">{sess.candidate_name}</strong>
                          <span className="cand-email">{sess.candidate_email || 'candidate@platform.dev'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="q-cell">
                        <span className="q-title">{sess.question_title}</span>
                        <span className="q-id-pill">ID: {sess.question_id}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`live-badge ${sess.status}`}>
                        {isActive && <span className="live-mini-dot" />}
                        {sess.status.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <code className="file-code-tag">{sess.active_file || 'App.tsx'}</code>
                    </td>
                    <td>
                      <span className="time-cell">
                        {new Date(sess.last_activity_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <Link
                          to={`/machine-coding?id=${sess.question_id}&session=${sess.id}&role=admin`}
                          className="btn btn-primary btn-sm live-join-btn"
                          title="Open live collaborative workspace in Admin mode"
                        >
                          👁️ Monitor Live
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
