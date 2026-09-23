import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getAdminBearerToken } from '../../../features/auth/services/adminTokenHelper';
import './AdminControlCenter.css';

interface MeetingItem {
  id: string;
  title: string;
  description?: string;
  hostName: string;
  hostEmail: string;
  meetingType: string;
  status: string;
  scheduledStartTime: string;
  participantCount: number;
  activeParticipantCount: number;
}

interface MeetingDetails {
  meeting: MeetingItem;
  participants: Array<{
    id: string;
    email: string;
    name: string;
    assignedRole: string;
    status: string;
    expiresAt: string;
    acceptedAt?: string;
  }>;
  outboxEventsCount: number;
}

export const AdminMeetingManagementTab: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [isDetailsLoading, setIsDetailsLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Create Meeting Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newMeetingType, setNewMeetingType] = useState('COLLABORATIVE');
  const [startImmediately, setStartImmediately] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const getAdminToken = useCallback(async (forceRefresh = false) => {
    return getAdminBearerToken(user, forceRefresh);
  }, [user]);

  const loadMeetings = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setActionError(null);

    try {
      let token = await getAdminToken();
      const params = new URLSearchParams({
        page: String(page),
        limit: '10',
      });
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      let res = await fetch(`/api/v1/admin/meetings?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401) {
        token = await getAdminToken(true);
        res = await fetch(`/api/v1/admin/meetings?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load meetings.`);
      }

      const json = await res.json();
      if (json.success) {
        setMeetings(json.meetings || []);
        setPagination(json.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
      }
    } catch (err: any) {
      setActionError(err.message || 'Error fetching meeting directory.');
    } finally {
      setIsLoading(false);
    }
  }, [getAdminToken, statusFilter, searchQuery]);

  useEffect(() => {
    loadMeetings(1);
  }, [loadMeetings]);

  // Load Single Meeting Details
  const inspectMeeting = async (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setIsDetailsLoading(true);
    try {
      const token = await getAdminToken();
      const res = await fetch(`/api/v1/admin/meetings?meetingId=${encodeURIComponent(meetingId)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const json = await res.json();
      if (json.success && json.data) {
        setMeetingDetails(json.data);
      }
    } catch (err) {
      console.error('Failed to load meeting details:', err);
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // Admin Lifecycle Transition
  const handleTransition = async (targetStatus: string, reason: string) => {
    if (!selectedMeetingId) return;
    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: selectedMeetingId,
          targetStatus,
          reason,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Transition rejected by lifecycle rules.');
      }

      // Refresh directory and inspect drawer
      await loadMeetings(pagination.page);
      await inspectMeeting(selectedMeetingId);
    } catch (err: any) {
      alert(`Transition Failed: ${err.message}`);
    }
  };

  // Create New Meeting & Optional Auto-Start
  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreating(true);
    setActionError(null);

    try {
      let token = await getAdminToken();
      let res = await fetch('/api/v1/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          meetingType: newMeetingType,
        }),
      });

      if (res.status === 401) {
        token = await getAdminToken(true);
        res = await fetch('/api/v1/meetings', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: newTitle.trim(),
            description: newDescription.trim() || undefined,
            meetingType: newMeetingType,
          }),
        });
      }

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Failed to create meeting.');
      }

      const createdMeeting = json.meeting;

      if (startImmediately && createdMeeting?.id) {
        // Transition to STARTED
        await fetch('/api/v1/meetings/lifecycle', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            meetingId: createdMeeting.id,
            targetStatus: 'STARTED',
            reason: 'Created and immediately launched by administrator',
          }),
        });
        navigate(`/meet/${createdMeeting.id}`);
        return;
      }

      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      await loadMeetings(1);
    } catch (err: any) {
      setActionError(err.message || 'Error creating meeting.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="acc-container">
      <div className="acc-header">
        <div className="acc-header-left">
          <h2>Meeting Operations &amp; Real-Time Sessions</h2>
          <p>Supervise collaborative sessions, inspect participant rosters, and govern meeting lifecycles.</p>
        </div>
        <div className="acc-header-actions">
          <button
            type="button"
            className="acc-refresh-btn"
            style={{
              background: 'var(--h-brand-gradient, linear-gradient(135deg, #7551FF 0%, #4318FF 100%))',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(67, 24, 255, 0.35)',
            }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ Create Meeting
          </button>
          <button
            type="button"
            className="acc-refresh-btn"
            onClick={() => loadMeetings(pagination.page)}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Refreshing...' : '🔄 Refresh Meetings'}
          </button>
        </div>
      </div>

      {actionError && (
        <div style={{ color: '#f87171', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          ⚠️ {actionError}
        </div>
      )}

      {/* Filter and Search Toolbar */}
      <div className="acc-table-card">
        <div className="acc-table-toolbar">
          <div className="acc-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search meetings by title or ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="acc-filter-group">
            <select
              className="acc-filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (Live Now)</option>
              <option value="STARTED">Started</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ENDED">Ended</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Meetings Table */}
        <div className="acc-table-wrapper">
          <table className="acc-table">
            <thead>
              <tr>
                <th>Meeting ID</th>
                <th>Title</th>
                <th>Host</th>
                <th>Status</th>
                <th>Participants</th>
                <th>Scheduled At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No meeting sessions match the criteria.
                  </td>
                </tr>
              )}
              {meetings.map(m => (
                <tr key={m.id}>
                  <td style={{ fontFamily: 'monospace', color: '#60a5fa' }}>{m.id}</td>
                  <td style={{ fontWeight: 600 }}>{m.title}</td>
                  <td>{m.hostName || m.hostEmail}</td>
                  <td>
                    <span className={`acc-status-pill ${m.status.toLowerCase()}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>
                      {m.activeParticipantCount} active / {m.participantCount} invited
                    </span>
                  </td>
                  <td>{new Date(m.scheduledStartTime).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className="acc-page-btn"
                        onClick={() => navigate(`/meet/${m.id}`)}
                        style={{
                          fontSize: '0.75rem',
                          background: 'rgba(67, 24, 255, 0.2)',
                          borderColor: 'rgba(117, 81, 255, 0.5)',
                          color: '#a78bfa',
                          fontWeight: 700,
                        }}
                      >
                        Start / Join 🎥
                      </button>
                      <button
                        type="button"
                        className="acc-page-btn"
                        onClick={() => inspectMeeting(m.id)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        Inspect Roster 🔍
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="acc-pagination">
          <div>
            Showing {meetings.length} of {pagination.total} meetings (Page {pagination.page} of {pagination.totalPages})
          </div>
          <div className="acc-pagination-btns">
            <button
              type="button"
              className="acc-page-btn"
              disabled={pagination.page <= 1}
              onClick={() => loadMeetings(pagination.page - 1)}
            >
              ← Previous
            </button>
            <button
              type="button"
              className="acc-page-btn"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadMeetings(pagination.page + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Drawer: Meeting Details & Participant Inspection */}
      {selectedMeetingId && (
        <div className="acc-drawer-overlay" onClick={() => setSelectedMeetingId(null)}>
          <div className="acc-drawer" onClick={e => e.stopPropagation()}>
            <div className="acc-drawer-header">
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>
                Meeting Session Dossier
              </h3>
              <button
                type="button"
                className="acc-drawer-close"
                onClick={() => setSelectedMeetingId(null)}
              >
                ✕
              </button>
            </div>

            <div className="acc-drawer-body">
              {isDetailsLoading && <div>⏳ Loading details...</div>}
              {meetingDetails && (
                <>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                      {meetingDetails.meeting.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                      Host: {meetingDetails.meeting.hostName} ({meetingDetails.meeting.hostEmail})
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <span className={`acc-status-pill ${meetingDetails.meeting.status.toLowerCase()}`}>
                        {meetingDetails.meeting.status}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', alignSelf: 'center' }}>
                        Transactional Events: {meetingDetails.outboxEventsCount}
                      </span>
                    </div>
                  </div>

                  {/* Lifecycle Controls */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="acc-page-btn"
                      style={{
                        background: 'var(--h-brand-gradient, linear-gradient(135deg, #7551FF 0%, #4318FF 100%))',
                        color: '#ffffff',
                        border: 'none',
                        fontWeight: 700,
                      }}
                      onClick={() => navigate(`/meet/${meetingDetails.meeting.id}`)}
                    >
                      🎥 Launch / Join Meeting
                    </button>
                    {(meetingDetails.meeting.status === 'SCHEDULED' || meetingDetails.meeting.status === 'STARTED') && (
                      <button
                        type="button"
                        className="acc-page-btn"
                        style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid #ef4444' }}
                        onClick={() => handleTransition('CANCELLED', 'Admin operational override')}
                      >
                        ⛔ Cancel Meeting
                      </button>
                    )}
                    {(meetingDetails.meeting.status === 'STARTED' || meetingDetails.meeting.status === 'ACTIVE') && (
                      <button
                        type="button"
                        className="acc-page-btn"
                        style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid #3b82f6' }}
                        onClick={() => handleTransition('ENDED', 'Host completed session')}
                      >
                        ⏹️ End Meeting
                      </button>
                    )}
                  </div>

                  {/* Participant Roster Table */}
                  <div>
                    <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
                      Participant Roster ({meetingDetails.participants.length})
                    </h4>
                    {meetingDetails.participants.length === 0 ? (
                      <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        No invitations dispatched for this meeting.
                      </div>
                    ) : (
                      <div className="acc-table-wrapper">
                        <table className="acc-table">
                          <thead>
                            <tr>
                              <th>Participant</th>
                              <th>Role</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meetingDetails.participants.map(p => (
                              <tr key={p.id}>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{p.email}</div>
                                </td>
                                <td>{p.assignedRole}</td>
                                <td>
                                  <span className={`acc-status-pill ${p.status === 'ACCEPTED' ? 'active' : 'suspended'}`}>
                                    {p.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Meeting Modal */}
      {isCreateModalOpen && (
        <div className="acc-drawer-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="acc-drawer"
            style={{ maxWidth: '520px', height: 'auto', maxHeight: '90vh', borderRadius: '16px', margin: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="acc-drawer-header">
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✨</span> Create New Meeting Room
              </h3>
              <button
                type="button"
                className="acc-drawer-close"
                onClick={() => setIsCreateModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Senior Frontend Architecture Interview"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Description / Agenda
                </label>
                <textarea
                  rows={3}
                  placeholder="Real-time collaborative technical evaluation with WebRTC, whiteboard, and code editor."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
                  Meeting Type
                </label>
                <select
                  value={newMeetingType}
                  onChange={e => setNewMeetingType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.9rem',
                    borderRadius: '8px',
                    background: '#111c44',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="COLLABORATIVE">Collaborative Session</option>
                  <option value="INTERVIEW">Technical Interview</option>
                  <option value="SCREENING">Candidate Screening</option>
                  <option value="ARCHITECTURE_REVIEW">Architecture Review</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="startImmediately"
                  checked={startImmediately}
                  onChange={e => setStartImmediately(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#7551FF', cursor: 'pointer' }}
                />
                <label htmlFor="startImmediately" style={{ fontSize: '0.82rem', color: '#e2e8f0', cursor: 'pointer' }}>
                  Launch and join meeting immediately upon creation
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="acc-page-btn"
                  onClick={() => setIsCreateModalOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="acc-refresh-btn"
                  disabled={isCreating || !newTitle.trim()}
                  style={{
                    background: 'var(--h-brand-gradient, linear-gradient(135deg, #7551FF 0%, #4318FF 100%))',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                  }}
                >
                  {isCreating ? '⏳ Creating...' : '🚀 Create & Start'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMeetingManagementTab;
