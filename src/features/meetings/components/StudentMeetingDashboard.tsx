import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { pushClientService, type PushStatus } from '../../notifications/services/pushClientService';
import { meetingTokenService } from '../../auth/services/meetingTokenService';
import type { MeetingRecord } from '../../../../server/meetings/meetingOpsTypes';
import '../styles/StudentMeetingDashboard.css';

interface EnrichedStudentMeeting extends MeetingRecord {
  myRsvpStatus: 'pending' | 'accepted' | 'declined';
  myAttendanceStatus: 'pending' | 'attended' | 'absent' | 'late';
  googleCalendarUrl?: string;
  outlookCalendarUrl?: string;
  participantCount?: number;
}

export const StudentMeetingDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quickCode, setQuickCode] = useState('');
  const [meetings, setMeetings] = useState<EnrichedStudentMeeting[]>([]);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'TODAY' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Timezone selection (Rule 6: Production-grade timezone handling, default Asia/Kolkata)
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => {
    return localStorage.getItem('user_preferred_timezone') || 'Asia/Kolkata';
  });

  // Push notification state
  const [pushStatus, setPushStatus] = useState<PushStatus | null>(null);
  const [isPushLoading, setIsPushLoading] = useState<boolean>(false);
  const [pushFeedback, setPushFeedback] = useState<string | null>(null);

  // Selected meeting for Details modal
  const [inspectingMeeting, setInspectingMeeting] = useState<EnrichedStudentMeeting | null>(null);

  // Real-time ticking for countdown banner (Rule 18)
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNowTimestamp(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save selected timezone
  const handleTimezoneChange = (tz: string) => {
    setSelectedTimezone(tz);
    localStorage.setItem('user_preferred_timezone', tz);
  };

  // Real-time Push Notification Banner State
  const [liveAlert, setLiveAlert] = useState<{ title: string; body: string; url: string; meetingId?: string } | null>(null);

  // Load meetings assigned to this student
  const fetchMyMeetings = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const headers: Record<string, string> = { Accept: 'application/json' };
      if (user) {
        try {
          const token = await meetingTokenService.getMeetingToken('global_list', {
            id: user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: (user.role as any) || 'candidate',
          });
          if (token) headers['Authorization'] = `Bearer ${token}`;
        } catch (_) {}
      }

      const res = await fetch('/api/v1/meetings', { headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load meetings.`);
      }
      const json = await res.json();
      if (json.success) {
        setMeetings(json.meetings || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error retrieving meeting roster.');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check push support, poll active alerts, and listen for broadcast notifications
  useEffect(() => {
    pushClientService.getStatus().then(setPushStatus);

    // Initial check for active live meeting push alert
    pushClientService.getActiveMeetingNotification().then(alert => {
      if (alert) {
        setLiveAlert({
          title: alert.meetingTitle ? `🟢 Live Meeting: ${alert.meetingTitle}` : '🟢 Live Meeting Started!',
          body: alert.customMessage || 'Your interview room is now live. Click to join immediately.',
          url: alert.meetingUrl || `/meet/${alert.meetingId}`,
          meetingId: alert.meetingId,
        });
      }
    });

    const unsubscribeBroadcast = pushClientService.onNotificationReceived((data) => {
      setLiveAlert({
        title: data.title || '🟢 Live Meeting Started: Join Now!',
        body: data.body || data.customMessage || 'Your interviewer has started the session.',
        url: data.url || data.meetingUrl || `/meet/${data.meetingId}`,
        meetingId: data.meetingId,
      });
      fetchMyMeetings();
    });

    const unsubscribePoll = pushClientService.startPolling((alert) => {
      if (alert) {
        setLiveAlert({
          title: alert.meetingTitle ? `🟢 Live Meeting: ${alert.meetingTitle}` : '🟢 Live Meeting Started!',
          body: alert.customMessage || 'Your interview room is now live. Click to join immediately.',
          url: alert.meetingUrl || `/meet/${alert.meetingId}`,
          meetingId: alert.meetingId,
        });
        fetchMyMeetings();
      }
    });

    return () => {
      unsubscribeBroadcast();
      unsubscribePoll();
    };
  }, [fetchMyMeetings]);

  // Format date and time in student's selected timezone
  const formatMeetingDateTime = useCallback(
    (isoString: string) => {
      try {
        const date = new Date(isoString);
        const dateStr = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedTimezone,
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        }).format(date);

        const timeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: selectedTimezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(date);

        return { dateStr, timeStr };
      } catch {
        const d = new Date(isoString);
        return { dateStr: d.toLocaleDateString(), timeStr: d.toLocaleTimeString() };
      }
    },
    [selectedTimezone]
  );

  useEffect(() => {
    fetchMyMeetings();
  }, [fetchMyMeetings]);

  // Handle RSVP
  const handleRsvp = async (meetingId: string, status: 'accepted' | 'declined') => {
    try {
      const res = await fetch('/api/v1/meetings/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, status }),
      });
      const json = await res.json();
      if (json.success) {
        setMeetings(prev =>
          prev.map(m => (m.id === meetingId ? { ...m, myRsvpStatus: status } : m))
        );
      } else {
        alert(json.message || 'Failed to update RSVP.');
      }
    } catch (err: any) {
      alert(`Error updating RSVP: ${err.message}`);
    }
  };

  // Handle Push Permission Request (Strict Rule 8: only on explicit user click)
  const handleEnablePush = async () => {
    if (!user?.id) return;
    setIsPushLoading(true);
    setPushFeedback(null);
    const result = await pushClientService.subscribeUser(user.id);
    setIsPushLoading(false);
    setPushFeedback(result.message);
    const newStatus = await pushClientService.getStatus();
    setPushStatus(newStatus);
  };

  // Categorize meetings into tabs
  const filteredMeetings = useMemo(() => {
    const todayLocalStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: selectedTimezone,
    }).format(new Date(nowTimestamp));

    return meetings.filter(m => {
      const mDateStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: selectedTimezone,
      }).format(new Date(m.start_at));

      const startTime = new Date(m.start_at).getTime();
      const endTime = new Date(m.end_at).getTime();

      if (activeTab === 'CANCELLED') {
        return m.status === 'CANCELLED';
      }
      if (m.status === 'CANCELLED') return false;

      if (activeTab === 'TODAY') {
        return mDateStr === todayLocalStr;
      }
      if (activeTab === 'COMPLETED') {
        return m.status === 'COMPLETED' || endTime < nowTimestamp;
      }
      if (activeTab === 'UPCOMING') {
        return startTime >= nowTimestamp && m.status !== 'COMPLETED';
      }
      return true;
    });
  }, [meetings, activeTab, selectedTimezone, nowTimestamp]);

  // Find next upcoming meeting for the Live Countdown Reminder Banner
  const nextMeeting = useMemo(() => {
    const upcoming = meetings
      .filter(m => m.status !== 'CANCELLED' && m.status !== 'COMPLETED' && new Date(m.end_at).getTime() > nowTimestamp)
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    return upcoming[0] || null;
  }, [meetings, nowTimestamp]);

  // Countdown timer calculations
  const countdownText = useMemo(() => {
    if (!nextMeeting) return null;
    const diffMs = new Date(nextMeeting.start_at).getTime() - nowTimestamp;

    if (diffMs <= 0) {
      return 'SESSION IS LIVE NOW';
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [nextMeeting, nowTimestamp]);

  return (
    <div className="smd-container">
      {/* Hero Banner with Timezone Selector */}
      <div className="smd-hero-banner">
        <div className="smd-hero-left">
          <h2>
            <span>📅</span> My Meetings &amp; Interview Sessions
          </h2>
          <p>View your scheduled interviews, technical discussions, and collaborative training loops.</p>
        </div>

        <div className="smd-hero-right">
          <div className="smd-tz-selector-wrap">
            <span className="smd-tz-label">Timezone:</span>
            <select
              className="smd-tz-select"
              value={selectedTimezone}
              onChange={e => handleTimezoneChange(e.target.value)}
              title="Display meetings in your local timezone"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="UTC">UTC Universal</option>
            </select>
          </div>

          {pushStatus?.isSupported && !pushStatus.isSubscribed && (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleEnablePush}
              disabled={isPushLoading}
              title="Receive browser alerts before your meetings start"
            >
              {isPushLoading ? 'Enabling...' : '🔔 Enable Push Notifications'}
            </button>
          )}

          {pushStatus?.isSupported && pushStatus.isSubscribed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#01b574', fontWeight: 600, background: 'rgba(1, 181, 116, 0.1)', padding: '4px 10px', borderRadius: '12px' }}>
                ✓ Push Active
              </span>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  pushClientService.displayLocalNotification({
                    title: '🔔 Push Alert Verified',
                    body: 'Your device is ready to receive meeting links and interview alerts!',
                    url: '/dashboard?tab=meetings',
                  });
                  setPushFeedback('Test alert dispatched to your desktop!');
                  setTimeout(() => setPushFeedback(null), 4000);
                }}
                title="Send test desktop notification to verify delivery"
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                🧪 Test Alert
              </button>
            </div>
          )}

          {pushFeedback && (
            <span style={{ fontSize: '12px', color: '#01b574', fontWeight: 600 }}>
              {pushFeedback}
            </span>
          )}
        </div>
      </div>

      {/* Real-time Meeting Push Notification Live Alert Banner */}
      {liveAlert && (
        <div
          className="smd-live-notification-alert"
          style={{
            background: 'linear-gradient(135deg, rgba(117, 81, 255, 0.95), rgba(1, 181, 116, 0.95))',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '14px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 8px 24px rgba(117, 81, 255, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>📲</span>
            <div>
              <strong style={{ fontSize: '15px' }}>{liveAlert.title}</strong>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', opacity: 0.95 }}>{liveAlert.body}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                if (liveAlert.url.startsWith('http')) {
                  window.location.href = liveAlert.url;
                } else {
                  navigate(liveAlert.url);
                }
              }}
              style={{
                background: '#ffffff',
                color: '#111827',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              }}
            >
              Join Session Now →
            </button>
            <button
              type="button"
              onClick={() => setLiveAlert(null)}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Quick Launch & Instant Meeting Join Bar (Google Meet Style) */}
      <div className="smd-quick-launch-bar">
        <button
          type="button"
          className="smd-instant-btn"
          onClick={() => navigate('/meet')}
          title="Open Instant Meeting Hub"
        >
          <span>⚡</span> Start Instant Meeting
        </button>

        <form
          className="smd-quick-join-form"
          onSubmit={e => {
            e.preventDefault();
            if (!quickCode.trim()) return;
            let code = quickCode.trim();
            if (code.includes('/meet/')) {
              code = code.split('/meet/')[1].split('?')[0];
            }
            navigate(`/meet/${encodeURIComponent(code)}`);
          }}
        >
          <input
            type="text"
            className="smd-quick-join-input"
            placeholder="Enter meeting code or paste link"
            value={quickCode}
            onChange={e => setQuickCode(e.target.value)}
          />
          <button
            type="submit"
            className="smd-quick-join-btn"
            disabled={!quickCode.trim()}
          >
            Join
          </button>
        </form>
      </div>

      {/* Real-Time Countdown Reminder Banner (Rule 18) */}
      {nextMeeting && countdownText && (
        <div className="smd-live-reminder-banner">
          <div className="slrb-left">
            <div className="slrb-pulse-icon">⏰</div>
            <div className="slrb-info">
              <h3>Upcoming Session: {nextMeeting.title}</h3>
              <p>
                {nextMeeting.meeting_type} with {nextMeeting.trainer_name || 'Trainer'} •{' '}
                {formatMeetingDateTime(nextMeeting.start_at).timeStr} ({selectedTimezone})
              </p>
            </div>
          </div>

          <div className="slrb-countdown-box">
            <div className="slrb-timer-badge">
              <span className="slrb-timer-label">Starting In:</span>
              <span className="slrb-timer-val">{countdownText}</span>
            </div>

            <a
              href={nextMeeting.meeting_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{
                background: '#01b574',
                color: '#ffffff',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              🚀 Join {nextMeeting.meeting_provider}
            </a>
          </div>
        </div>
      )}

      {/* Tabs Row */}
      <div className="smd-tabs-row">
        <button
          type="button"
          className={`smd-tab-btn ${activeTab === 'UPCOMING' ? 'active' : ''}`}
          onClick={() => setActiveTab('UPCOMING')}
        >
          <span>⏳ Upcoming</span>
          <span className="smd-tab-badge">
            {meetings.filter(m => m.status !== 'CANCELLED' && new Date(m.start_at).getTime() >= nowTimestamp).length}
          </span>
        </button>

        <button
          type="button"
          className={`smd-tab-btn ${activeTab === 'TODAY' ? 'active' : ''}`}
          onClick={() => setActiveTab('TODAY')}
        >
          <span>📌 Today</span>
        </button>

        <button
          type="button"
          className={`smd-tab-btn ${activeTab === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          <span>✅ Completed</span>
        </button>

        <button
          type="button"
          className={`smd-tab-btn ${activeTab === 'CANCELLED' ? 'active' : ''}`}
          onClick={() => setActiveTab('CANCELLED')}
        >
          <span>🚫 Cancelled</span>
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <div className="skeleton skeleton-line" style={{ width: '200px', margin: '0 auto 12px' }} />
          Loading your scheduled meetings...
        </div>
      )}

      {errorMsg && (
        <div style={{ background: 'rgba(238,93,80,0.1)', border: '1px solid #ee5d50', padding: '14px', borderRadius: '12px', color: '#ee5d50' }}>
          {errorMsg}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredMeetings.length === 0 && (
        <div className="smd-empty-state">
          <div className="smd-empty-icon">📭</div>
          <h3>No {activeTab.toLowerCase()} meetings found</h3>
          <p>
            {activeTab === 'UPCOMING'
              ? 'You do not have any upcoming meetings scheduled right now. Check back when an interview or training session is allocated!'
              : `No sessions found in the ${activeTab.toLowerCase()} category.`}
          </p>
        </div>
      )}

      {/* Meetings Grid */}
      {!isLoading && filteredMeetings.length > 0 && (
        <div className="smd-meetings-grid">
          {filteredMeetings.map(meeting => {
            const { dateStr, timeStr } = formatMeetingDateTime(meeting.start_at);
            const endTimeStr = formatMeetingDateTime(meeting.end_at).timeStr;
            const isJoinable =
              new Date(meeting.start_at).getTime() - nowTimestamp <= 15 * 60 * 1000 &&
              new Date(meeting.end_at).getTime() >= nowTimestamp &&
              meeting.status !== 'CANCELLED';

            return (
              <div key={meeting.id} className="smd-meeting-card">
                <div>
                  <div className="smc-top-bar">
                    <span className="smc-type-pill">{meeting.meeting_type}</span>
                    <span className="smc-provider-tag">
                      <span>🔗</span> {meeting.meeting_provider}
                    </span>
                  </div>

                  <h3 className="smc-title">{meeting.title}</h3>
                  {meeting.description && <p className="smc-desc">{meeting.description}</p>}

                  <div className="smc-details-list">
                    <div className="smc-detail-row">
                      <span className="lbl">📅 Date:</span>
                      <span className="val">{dateStr}</span>
                    </div>
                    <div className="smc-detail-row">
                      <span className="lbl">⏰ Time:</span>
                      <span className="val">
                        {timeStr} – {endTimeStr} ({selectedTimezone})
                      </span>
                    </div>
                    <div className="smc-detail-row">
                      <span className="lbl">👨‍🏫 Trainer:</span>
                      <span className="val">{meeting.trainer_name || 'Assigned Instructor'}</span>
                    </div>
                    {meeting.batch_id && (
                      <div className="smc-detail-row">
                        <span className="lbl">🎓 Batch:</span>
                        <span className="val">{meeting.batch_id}</span>
                      </div>
                    )}
                  </div>

                  <div className="smc-badges-row">
                    <span className={`smc-status-badge ${meeting.status.toLowerCase()}`}>
                      Status: {meeting.status}
                    </span>

                    <span className={`smc-rsvp-badge ${meeting.myRsvpStatus}`}>
                      RSVP: {meeting.myRsvpStatus.toUpperCase()}
                    </span>

                    {meeting.myAttendanceStatus !== 'pending' && (
                      <span
                        className="smc-rsvp-badge"
                        style={{
                          background: meeting.myAttendanceStatus === 'attended' ? 'rgba(1,181,116,0.15)' : 'rgba(238,93,80,0.15)',
                          color: meeting.myAttendanceStatus === 'attended' ? '#01b574' : '#ee5d50',
                        }}
                      >
                        Attendance: {meeting.myAttendanceStatus.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions Container */}
                <div className="smc-actions-container">
                  {meeting.status === 'CANCELLED' ? (
                    <div style={{ fontSize: '13px', color: '#ee5d50', fontWeight: 600, textAlign: 'center', padding: '6px' }}>
                      Cancelled {meeting.cancellation_reason ? `: ${meeting.cancellation_reason}` : ''}
                    </div>
                  ) : isJoinable ? (
                    <a
                      href={meeting.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="smc-btn-join"
                    >
                      <span>🚀</span> Join {meeting.meeting_provider}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="smc-btn-join disabled"
                      disabled
                      title={`Meeting starts at ${timeStr}. Join button enables 15 minutes before the session.`}
                    >
                      <span>🔒</span> Starts at {timeStr}
                    </button>
                  )}

                  <div className="smc-sub-actions-row">
                    {/* Add to Calendar: Google & ICS */}
                    {meeting.googleCalendarUrl && (
                      <a
                        href={meeting.googleCalendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="smc-sub-btn"
                        title="Add to Google Calendar"
                      >
                        <span>📅</span> Google Cal
                      </a>
                    )}

                    <a
                      href={`/api/v1/meetings/ics?id=${meeting.id}`}
                      download={`${meeting.id}.ics`}
                      className="smc-sub-btn"
                      title="Download .ics Calendar Event (Outlook/Apple)"
                    >
                      <span>📥</span> .ICS
                    </a>

                    {/* RSVP Buttons */}
                    {meeting.myRsvpStatus !== 'accepted' && (
                      <button
                        type="button"
                        className="smc-sub-btn accept"
                        onClick={() => handleRsvp(meeting.id, 'accepted')}
                        title="Accept Meeting Invitation"
                      >
                        <span>✓</span> Accept
                      </button>
                    )}

                    {meeting.myRsvpStatus !== 'declined' && (
                      <button
                        type="button"
                        className="smc-sub-btn decline"
                        onClick={() => handleRsvp(meeting.id, 'declined')}
                        title="Decline Meeting"
                      >
                        <span>✗</span> Decline
                      </button>
                    )}

                    <button
                      type="button"
                      className="smc-sub-btn"
                      onClick={() => setInspectingMeeting(meeting)}
                      title="View Meeting Details"
                    >
                      <span>ℹ️</span> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meeting Details Modal */}
      {inspectingMeeting && (
        <div className="admin-modal-overlay" onClick={() => setInspectingMeeting(null)}>
          <div className="admin-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="amc-header">
              <div>
                <h3>{inspectingMeeting.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {inspectingMeeting.meeting_type} • {inspectingMeeting.meeting_provider}
                </span>
              </div>
              <button type="button" className="amc-close-btn" onClick={() => setInspectingMeeting(null)}>
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <strong style={{ color: '#ffffff', fontSize: '13px' }}>Description:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {inspectingMeeting.description || 'No additional description provided.'}
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Date &amp; Time: </span>
                  <strong>
                    {formatMeetingDateTime(inspectingMeeting.start_at).dateStr},{' '}
                    {formatMeetingDateTime(inspectingMeeting.start_at).timeStr} -{' '}
                    {formatMeetingDateTime(inspectingMeeting.end_at).timeStr} ({selectedTimezone})
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Instructor / Trainer: </span>
                  <strong>{inspectingMeeting.trainer_name || 'Staff Evaluator'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Meeting URL: </span>
                  <a
                    href={inspectingMeeting.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#7551ff', wordBreak: 'break-all' }}
                  >
                    {inspectingMeeting.meeting_url}
                  </a>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Your RSVP Status: </span>
                  <strong style={{ textTransform: 'uppercase', color: inspectingMeeting.myRsvpStatus === 'accepted' ? '#01b574' : '#ffb547' }}>
                    {inspectingMeeting.myRsvpStatus}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <a
                  href={inspectingMeeting.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  🚀 Open Meeting Link
                </a>
                <button type="button" className="btn btn-secondary" onClick={() => setInspectingMeeting(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMeetingDashboard;
