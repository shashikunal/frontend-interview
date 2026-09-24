import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAdminBearerToken } from '../../../features/auth/services/adminTokenHelper';
import { profileService } from '../../../features/auth/services/profile.service';
import { pushClientService } from '../../../features/notifications/services/pushClientService';
import type { AuthUserProfile } from '../../../features/auth/types/auth.types';
import type {
  MeetingRecord,
  MeetingType,
  MeetingProvider,
  MeetingOpsDashboardStats,
  RecurrenceRule,
} from '../../../../server/meetings/meetingOpsTypes';
import './AdminControlCenter.css';
import './AdminMeetingManagementTab.css';

const MEETING_TYPES: MeetingType[] = [
  'Interview',
  'Training',
  'Mock Interview',
  'Technical Discussion',
  'HR Discussion',
  'Workshop',
  'ELP Session',
  'Other',
];

const MEETING_PROVIDERS: MeetingProvider[] = [
  'Platform Meet (Built-in)',
  'Google Meet',
  'Zoom',
  'Microsoft Teams',
  'Custom URL',
];

const generatePlatformRoomUrl = () => {
  const roomId = `meet_${Math.random().toString(36).substring(2, 8)}_${Date.now().toString(36).slice(-4)}`;
  return `/meet/${roomId}`;
};

const BATCH_OPTIONS = [
  'Batch 2026-Alpha',
  'Batch 2026-Beta',
  'Batch 2026-Gamma',
  'FAANG Fast-Track',
  'Frontend Architecture Mastery',
];

export const AdminMeetingManagementTab: React.FC = () => {
  const { user } = useAuth();

  // State
  const [meetings, setMeetings] = useState<MeetingRecord[]>([]);
  const [stats, setStats] = useState<MeetingOpsDashboardStats>({
    todayMeetingsCount: 0,
    upcomingMeetingsCount: 0,
    completedMeetingsCount: 0,
    cancelledMeetingsCount: 0,
    studentsAssignedCount: 0,
    pendingRsvpsCount: 0,
    notificationFailuresCount: 0,
    calendarSyncFailuresCount: 0,
  });

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [batchFilter, setBatchFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Timezone Handling (Rule 6: Production-grade, default Asia/Kolkata)
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => {
    return localStorage.getItem('admin_preferred_timezone') || 'Asia/Kolkata';
  });

  // Profiles for Trainer & Student dropdowns
  const [allProfiles, setAllProfiles] = useState<AuthUserProfile[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [isTestNotifModalOpen, setIsTestNotifModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Active meeting for inspect / edit / assign
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(null);
  const [meetingDetailsData, setMeetingDetailsData] = useState<any>(null);

  // Create / Edit Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<MeetingType>('Interview');
  const [formProvider, setFormProvider] = useState<MeetingProvider>('Platform Meet (Built-in)');
  const [formUrl, setFormUrl] = useState(() => generatePlatformRoomUrl());
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formStartTime, setFormStartTime] = useState('14:00');
  const [formEndTime, setFormEndTime] = useState('15:00');
  const [formTrainerId, setFormTrainerId] = useState('');
  const [formBatchId, setFormBatchId] = useState('');
  const [formCapacity, setFormCapacity] = useState(50);
  const [formSelectedStudents, setFormSelectedStudents] = useState<string[]>([]);

  // Recurrence Form State
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceFreq, setRecurrenceFreq] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [recurrenceInterval, setRecurrenceInterval] = useState(1);
  const [recurrenceCount, setRecurrenceCount] = useState(4);

  // Reminder Preferences Form State
  const [reminder24h, setReminder24h] = useState(true);
  const [reminder1h, setReminder1h] = useState(true);
  const [reminder30m, setReminder30m] = useState(true);
  const [reminder5m, setReminder5m] = useState(true);

  // Form Validation Message
  const [formValidationMsg, setFormValidationMsg] = useState<string | null>(null);

  // Diagnostic Test Panel State
  const [diagStudentId, setDiagStudentId] = useState('');
  const [diagNotifType, setDiagNotifType] = useState('REMINDER_30M');
  const [diagResult, setDiagResult] = useState<any>(null);
  const [diagRunning, setDiagRunning] = useState(false);

  // Token helper
  const getAdminToken = useCallback(async (forceRefresh = false) => {
    return getAdminBearerToken(user, forceRefresh);
  }, [user]);

  // Load profiles on mount
  useEffect(() => {
    profileService.getAllProfiles().then(profiles => {
      setAllProfiles(profiles);
      if (profiles.length > 0) {
        setFormTrainerId(profiles[0].id);
        setDiagStudentId(profiles[0].id);
      }
    });
  }, []);

  // Format date and time according to admin's selected timezone
  const formatDateTime = useCallback(
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

  // Load Meetings & Dashboard Stats
  const loadMeetings = useCallback(
    async (page: number = 1) => {
      setIsLoading(true);
      setActionError(null);
      try {
        let token = await getAdminToken();
        const params = new URLSearchParams({
          page: String(page),
          limit: '10',
        });
        if (statusFilter !== 'ALL') params.set('status', statusFilter);
        if (typeFilter !== 'ALL') params.set('meetingType', typeFilter);
        if (batchFilter !== 'ALL') params.set('batchId', batchFilter);
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
          throw new Error(`HTTP ${res.status}: Failed to load meeting roster.`);
        }

        const json = await res.json();
        if (json.success) {
          setMeetings(json.meetings || []);
          setPagination(json.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
          if (json.dashboardStats) {
            setStats(json.dashboardStats);
          }
        }
      } catch (err: any) {
        setActionError(err.message || 'Error fetching meetings.');
      } finally {
        setIsLoading(false);
      }
    },
    [getAdminToken, statusFilter, typeFilter, batchFilter, searchQuery]
  );

  useEffect(() => {
    loadMeetings(1);
  }, [loadMeetings]);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Push Meeting Link to Students
  const handlePushLinkToStudents = async (meeting: MeetingRecord) => {
    try {
      const res = await pushClientService.sendMeetingPushNotification({
        meetingId: meeting.id,
        customMessage: `Interview session: "${meeting.title}". Link: ${meeting.meeting_url}`,
      });
      if (res.success) {
        showToast(`📲 Push notification sent to students for "${meeting.title}"!`);
      } else {
        alert(res.message || 'Failed to dispatch push notification.');
      }
    } catch (err: any) {
      alert(`Error sending push notification: ${err.message}`);
    }
  };

  // Inspect Single Meeting Details
  const inspectMeeting = async (meetingId: string) => {
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
        setMeetingDetailsData(json.data);
        setSelectedMeeting(json.data.meeting);
        setIsDetailsModalOpen(true);
      }
    } catch (err: any) {
      alert(`Failed to load meeting details: ${err.message}`);
    }
  };

  const handleProviderChange = (newProvider: MeetingProvider) => {
    setFormProvider(newProvider);
    if (newProvider === 'Platform Meet (Built-in)') {
      setFormUrl(generatePlatformRoomUrl());
    } else if (newProvider === 'Google Meet') {
      setFormUrl('https://meet.google.com/new');
    } else if (newProvider === 'Zoom') {
      setFormUrl('https://zoom.us/join');
    } else if (newProvider === 'Microsoft Teams') {
      setFormUrl('https://teams.microsoft.com');
    } else {
      setFormUrl('');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormTitle('');
    setFormDesc('');
    setFormType('Interview');
    setFormProvider('Platform Meet (Built-in)');
    setFormUrl(generatePlatformRoomUrl());
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormStartTime('14:00');
    setFormEndTime('15:00');
    setFormBatchId('Batch 2026-Alpha');
    setFormCapacity(50);
    setFormSelectedStudents([]);
    setIsRecurring(false);
    setFormValidationMsg(null);
    setIsCreateModalOpen(true);
  };

  // Start Instant Meeting (Google Meet Style)
  const handleStartInstantMeeting = async () => {
    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action: 'instant',
          title: `${user?.name || 'Trainer'}'s Instant Meeting`,
          meeting_type: 'Interview',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.meetingUrl) {
          window.open(data.meetingUrl, '_blank');
          loadMeetings(1);
          return;
        }
      }
    } catch (err) {
      console.warn('[Admin Meeting Ops] Instant meeting fallback:', err);
    }

    const roomId = generatePlatformRoomUrl();
    window.open(roomId, '_blank');
    loadMeetings(1);
  };

  // Open Edit Modal
  const handleOpenEditModal = (meeting: MeetingRecord) => {
    setSelectedMeeting(meeting);
    setFormTitle(meeting.title);
    setFormDesc(meeting.description || '');
    setFormType(meeting.meeting_type);
    setFormProvider(meeting.meeting_provider);
    setFormUrl(meeting.meeting_url);
    const startObj = new Date(meeting.start_at);
    const endObj = new Date(meeting.end_at);
    setFormDate(startObj.toISOString().split('T')[0]);
    setFormStartTime(startObj.toTimeString().slice(0, 5));
    setFormEndTime(endObj.toTimeString().slice(0, 5));
    setFormTrainerId(meeting.trainer_id);
    setFormBatchId(meeting.batch_id || '');
    setFormCapacity(meeting.capacity);
    setFormValidationMsg(null);
    setIsEditModalOpen(true);
  };

  // Submit Create Meeting
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationMsg(null);

    // Validation
    if (!formTitle.trim()) {
      setFormValidationMsg('Meeting title is required.');
      return;
    }
    const isValidUrl =
      formUrl.trim().startsWith('/') ||
      formUrl.trim().startsWith('http://') ||
      formUrl.trim().startsWith('https://');

    if (!formUrl.trim() || !isValidUrl) {
      setFormValidationMsg('Please enter a valid meeting URL (e.g. /meet/room_id or https://...)');
      return;
    }
    const startIso = new Date(`${formDate}T${formStartTime}:00`).toISOString();
    const endIso = new Date(`${formDate}T${formEndTime}:00`).toISOString();

    if (new Date(endIso) <= new Date(startIso)) {
      setFormValidationMsg('End time must be strictly after start time.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getAdminToken();
      const trainerObj = allProfiles.find(p => p.id === formTrainerId);

      const recurrenceRule: RecurrenceRule | null = isRecurring
        ? {
            frequency: recurrenceFreq,
            interval: recurrenceInterval,
            count: recurrenceCount,
          }
        : null;

      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          title: formTitle.trim(),
          description: formDesc.trim(),
          meeting_type: formType,
          meeting_provider: formProvider,
          meeting_url: formUrl.trim(),
          start_at: startIso,
          end_at: endIso,
          timezone: selectedTimezone,
          trainer_id: formTrainerId,
          trainer_name: trainerObj?.name || 'Assigned Trainer',
          batch_id: formBatchId || undefined,
          capacity: Number(formCapacity) || 50,
          student_ids: formSelectedStudents,
          recurrence: recurrenceRule,
          reminders: {
            reminder_24h: reminder24h,
            reminder_1h: reminder1h,
            reminder_30m: reminder30m,
            reminder_5m: reminder5m,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error || 'Failed to create meeting.');
      }

      setIsCreateModalOpen(false);
      showToast(`Meeting "${formTitle}" scheduled successfully!`);
      await loadMeetings(1);
    } catch (err: any) {
      setFormValidationMsg(err.message || 'Error creating meeting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Meeting
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting) return;
    setFormValidationMsg(null);

    const startIso = new Date(`${formDate}T${formStartTime}:00`).toISOString();
    const endIso = new Date(`${formDate}T${formEndTime}:00`).toISOString();

    if (new Date(endIso) <= new Date(startIso)) {
      setFormValidationMsg('End time must be after start time.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getAdminToken();
      const trainerObj = allProfiles.find(p => p.id === formTrainerId);

      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update',
          meetingId: selectedMeeting.id,
          updates: {
            title: formTitle.trim(),
            description: formDesc.trim(),
            meeting_type: formType,
            meeting_provider: formProvider,
            meeting_url: formUrl.trim(),
            start_at: startIso,
            end_at: endIso,
            trainer_id: formTrainerId,
            trainer_name: trainerObj?.name || selectedMeeting.trainer_name,
            batch_id: formBatchId,
            capacity: Number(formCapacity),
          },
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Update failed.');
      }

      setIsEditModalOpen(false);
      showToast(`Meeting "${formTitle}" updated!`);
      await loadMeetings(pagination.page);
    } catch (err: any) {
      setFormValidationMsg(err.message || 'Failed to update meeting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel Meeting
  const handleCancelMeeting = async (meeting: MeetingRecord) => {
    const reason = window.prompt(`Enter cancellation reason for "${meeting.title}":`, 'Instructor schedule conflict');
    if (reason === null) return;

    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel',
          meetingId: meeting.id,
          reason,
          scope: 'THIS_OCCURRENCE',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Cancellation failed.');
      showToast(`Cancelled meeting "${meeting.title}".`);
      await loadMeetings(pagination.page);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // Duplicate Meeting
  const handleDuplicateMeeting = async (meeting: MeetingRecord) => {
    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'duplicate',
          meetingId: meeting.id,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Duplicate failed.');
      showToast(`Duplicated meeting as "${json.meeting?.title}".`);
      await loadMeetings(1);
    } catch (err: any) {
      alert(`Duplicate Error: ${err.message}`);
    }
  };

  // Open Assign Students Modal
  const handleOpenAssignModal = (meeting: MeetingRecord) => {
    setSelectedMeeting(meeting);
    setFormSelectedStudents([]);
    setIsAssignModalOpen(true);
  };

  // Submit Assign Students
  const handleAssignStudentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMeeting || formSelectedStudents.length === 0) return;

    setIsSubmitting(true);
    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'assign_students',
          meetingId: selectedMeeting.id,
          studentIds: formSelectedStudents,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Assignment failed.');

      setIsAssignModalOpen(false);
      showToast(`Assigned ${json.added} student(s) (${json.skippedDuplicate} duplicates skipped).`);
      await loadMeetings(pagination.page);
    } catch (err: any) {
      alert(`Assignment Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mark Attendance
  const handleMarkAttendance = async (studentId: string, status: 'attended' | 'absent' | 'late') => {
    if (!selectedMeeting) return;
    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/admin/meetings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'mark_attendance',
          meetingId: selectedMeeting.id,
          studentId,
          attendanceStatus: status,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || 'Attendance update failed.');
      showToast(`Recorded attendance: ${status.toUpperCase()}`);
      await inspectMeeting(selectedMeeting.id);
    } catch (err: any) {
      alert(`Attendance Error: ${err.message}`);
    }
  };

  // Run Diagnostic Test Notification
  const handleRunTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagStudentId) return;

    setDiagRunning(true);
    setDiagResult(null);

    try {
      const token = await getAdminToken();
      const res = await fetch('/api/v1/notifications/test', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: diagStudentId,
          notificationType: diagNotifType,
          meetingId: meetings[0]?.id,
        }),
      });

      const json = await res.json();
      setDiagResult(json);
    } catch (err: any) {
      setDiagResult({ success: false, error: err.message });
    } finally {
      setDiagRunning(false);
    }
  };

  return (
    <div className="acc-container">
      {/* Top Header */}
      <div className="acc-header">
        <div className="acc-header-left">
          <h2>Meeting Operations &amp; Enterprise Sessions</h2>
          <p>Production scheduling, student roster allocation, Web Push reminders, and attendance tracking.</p>
        </div>

        <div className="acc-header-actions">
          {/* Timezone Selector */}
          <div className="smd-tz-selector-wrap" style={{ margin: 0 }}>
            <span className="smd-tz-label">Display TZ:</span>
            <select
              className="smd-tz-select"
              value={selectedTimezone}
              onChange={e => {
                setSelectedTimezone(e.target.value);
                localStorage.setItem('admin_preferred_timezone', e.target.value);
              }}
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="UTC">UTC Universal</option>
            </select>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={() => setIsTestNotifModalOpen(true)}
            title="Diagnose Kafka &amp; Push Notification Delivery"
          >
            🔔 Test Notifications
          </button>

          <button
            type="button"
            className="acc-refresh-btn"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
            onClick={handleStartInstantMeeting}
            title="Start an instant Google Meet-style meeting right now"
          >
            <span>⚡</span> Instant Meeting
          </button>

          <button
            type="button"
            className="acc-refresh-btn"
            style={{ background: 'var(--h-brand-gradient, linear-gradient(135deg, #7551FF 0%, #4318FF 100%))', color: '#ffffff', fontWeight: 700 }}
            onClick={handleOpenCreateModal}
          >
            <span>➕</span> Create Meeting
          </button>

          <button
            type="button"
            className="acc-refresh-btn"
            onClick={() => loadMeetings(pagination.page)}
            disabled={isLoading}
          >
            <span>🔄</span> Refresh
          </button>
        </div>
      </div>

      {successToast && (
        <div style={{ background: 'rgba(1,181,116,0.15)', border: '1px solid #01b574', color: '#01b574', padding: '12px 18px', borderRadius: '12px', fontWeight: 600 }}>
          ✅ {successToast}
        </div>
      )}

      {actionError && (
        <div style={{ background: 'rgba(238,93,80,0.15)', border: '1px solid #ee5d50', color: '#ee5d50', padding: '12px 18px', borderRadius: '12px', fontWeight: 600 }}>
          ⚠️ {actionError}
        </div>
      )}

      {/* 8 Metric Dashboard Cards (Rule 21) */}
      <div className="amm-stats-grid">
        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle blue">📅</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Today's Meetings</span>
            <span className="amm-stat-val">{stats.todayMeetingsCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle green">⏳</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Upcoming Meetings</span>
            <span className="amm-stat-val">{stats.upcomingMeetingsCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle amber">✅</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Completed</span>
            <span className="amm-stat-val">{stats.completedMeetingsCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle red">🚫</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Cancelled</span>
            <span className="amm-stat-val">{stats.cancelledMeetingsCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle purple">👥</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Students Assigned</span>
            <span className="amm-stat-val">{stats.studentsAssignedCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle amber">📩</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Pending RSVPs</span>
            <span className="amm-stat-val">{stats.pendingRsvpsCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle red">🔔</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Notification Failures</span>
            <span className="amm-stat-val">{stats.notificationFailuresCount}</span>
          </div>
        </div>

        <div className="amm-stat-card">
          <div className="amm-stat-icon-circle blue">🗓️</div>
          <div className="amm-stat-info">
            <span className="amm-stat-label">Calendar Failures</span>
            <span className="amm-stat-val">{stats.calendarSyncFailuresCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="amm-filter-bar">
        <input
          type="text"
          className="amm-search-input"
          placeholder="Search by title, trainer, ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <div className="amm-filter-group">
          <select
            className="amm-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="STARTED">Started</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            className="amm-select"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="ALL">All Types</option>
            {MEETING_TYPES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            className="amm-select"
            value={batchFilter}
            onChange={e => setBatchFilter(e.target.value)}
          >
            <option value="ALL">All Batches</option>
            {BATCH_OPTIONS.map(b => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Meetings Table (Rule 21) */}
      <div className="amm-table-card">
        <div className="amm-table-wrap">
          <table className="amm-table">
            <thead>
              <tr>
                <th>Title &amp; Provider</th>
                <th>Date &amp; Time</th>
                <th>Trainer</th>
                <th>Batch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                    Loading meeting roster...
                  </td>
                </tr>
              )}

              {!isLoading && meetings.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--h-text-muted)' }}>
                    No meeting records match the current filters.
                  </td>
                </tr>
              )}

              {!isLoading &&
                meetings.map(m => {
                  const { dateStr, timeStr } = formatDateTime(m.start_at);
                  const endStr = formatDateTime(m.end_at).timeStr;

                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="amm-meeting-title-cell">
                          <span className="amm-title-link" onClick={() => inspectMeeting(m.id)}>
                            {m.title}
                          </span>
                          <span className="amm-provider-tag">
                            <span>🔗</span> {m.meeting_provider} • {m.meeting_type}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{dateStr}</div>
                        <div style={{ fontSize: '11px', color: 'var(--h-text-muted)' }}>
                          {timeStr} – {endStr}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{m.trainer_name || 'Staff Instructor'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--h-text-muted)' }}>ID: {m.trainer_id.slice(0, 10)}...</div>
                      </td>

                      <td>
                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px' }}>
                          {m.batch_id || 'Individual'}
                        </span>
                      </td>

                      <td>
                        <span className={`amm-badge ${m.status.toLowerCase()}`}>{m.status}</span>
                      </td>

                      <td>
                        <div className="amm-actions-cell">
                          <button
                            type="button"
                            className="amm-btn-sm primary"
                            onClick={() => inspectMeeting(m.id)}
                            title="Inspect Meeting Details, Participants &amp; Attendance"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            className="amm-btn-sm"
                            onClick={() => handleOpenEditModal(m)}
                            title="Edit Meeting Schedule or Details"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="amm-btn-sm"
                            onClick={() => handleOpenAssignModal(m)}
                            title="Assign Individual Students or Batches"
                          >
                            Assign
                          </button>

                          <button
                            type="button"
                            className="amm-btn-sm"
                            onClick={() => handlePushLinkToStudents(m)}
                            title="Send Meeting Link to Students via Web Push"
                            style={{ background: 'rgba(117, 81, 255, 0.15)', color: '#a78bfa', borderColor: 'rgba(117, 81, 255, 0.35)', fontWeight: 600 }}
                          >
                            📲 Push
                          </button>

                          <button
                            type="button"
                            className="amm-btn-sm"
                            onClick={() => handleDuplicateMeeting(m)}
                            title="Duplicate Meeting"
                          >
                            Copy
                          </button>

                          <a
                            href={`/api/v1/admin/meetings?id=${m.id}&format=ics`}
                            download={`${m.id}.ics`}
                            className="amm-btn-sm"
                            title="Download iCalendar .ics"
                          >
                            .ICS
                          </a>

                          {m.status !== 'CANCELLED' && (
                            <button
                              type="button"
                              className="amm-btn-sm danger"
                              onClick={() => handleCancelMeeting(m)}
                              title="Cancel Meeting"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE MEETING */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
          <div className="amm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="amc-header">
              <h3>➕ Schedule New Meeting &amp; Training Session</h3>
              <button type="button" className="amc-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                ✕
              </button>
            </div>

            {formValidationMsg && (
              <div style={{ background: 'rgba(238,93,80,0.15)', color: '#ee5d50', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                ⚠️ {formValidationMsg}
              </div>
            )}

            <form onSubmit={handleCreateSubmit}>
              <div className="amm-form-group">
                <label>Meeting Title *</label>
                <input
                  type="text"
                  className="amm-form-input"
                  placeholder="e.g. React 19 Concurrent Fiber Architecture Loop"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className="amm-form-group">
                <label>Description</label>
                <textarea
                  className="amm-form-textarea"
                  rows={2}
                  placeholder="Overview of agenda, topics evaluated, or study requirements..."
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                />
              </div>

              <div className="amm-form-grid-2">
                <div className="amm-form-group">
                  <label>Meeting Type *</label>
                  <select
                    className="amm-form-input"
                    value={formType}
                    onChange={e => setFormType(e.target.value as MeetingType)}
                  >
                    {MEETING_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="amm-form-group">
                  <label>Meeting Provider *</label>
                  <select
                    className="amm-form-input"
                    value={formProvider}
                    onChange={e => handleProviderChange(e.target.value as MeetingProvider)}
                  >
                    {MEETING_PROVIDERS.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="amm-form-group">
                <label>Meeting URL *</label>
                <input
                  type="text"
                  className="amm-form-input"
                  placeholder="/meet/room_id or https://..."
                  value={formUrl}
                  onChange={e => setFormUrl(e.target.value)}
                  required
                />
              </div>

              <div className="amm-form-grid-2">
                <div className="amm-form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    className="amm-form-input"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    required
                  />
                </div>

                <div className="amm-form-group">
                  <label>Trainer / Evaluator *</label>
                  <select
                    className="amm-form-input"
                    value={formTrainerId}
                    onChange={e => setFormTrainerId(e.target.value)}
                  >
                    {allProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="amm-form-grid-2">
                <div className="amm-form-group">
                  <label>Start Time *</label>
                  <input
                    type="time"
                    className="amm-form-input"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="amm-form-group">
                  <label>End Time *</label>
                  <input
                    type="time"
                    className="amm-form-input"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="amm-form-grid-2">
                <div className="amm-form-group">
                  <label>Batch Assignment</label>
                  <select
                    className="amm-form-input"
                    value={formBatchId}
                    onChange={e => setFormBatchId(e.target.value)}
                  >
                    <option value="">No Batch (Assign Individually)</option>
                    {BATCH_OPTIONS.map(b => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="amm-form-group">
                  <label>Max Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    className="amm-form-input"
                    value={formCapacity}
                    onChange={e => setFormCapacity(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Recurring Switch */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', marginBottom: '14px' }}>
                <label className="amm-checkbox-row">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={e => setIsRecurring(e.target.checked)}
                  />
                  <span>🔁 Recurring Meeting Series</span>
                </label>

                {isRecurring && (
                  <div className="amm-form-grid-2" style={{ marginTop: '12px' }}>
                    <div className="amm-form-group">
                      <label>Frequency</label>
                      <select
                        className="amm-form-input"
                        value={recurrenceFreq}
                        onChange={e => setRecurrenceFreq(e.target.value as any)}
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                      </select>
                    </div>

                    <div className="amm-form-group">
                      <label>Interval</label>
                      <input
                        type="number"
                        min={1}
                        max={12}
                        className="amm-form-input"
                        value={recurrenceInterval}
                        onChange={e => setRecurrenceInterval(Number(e.target.value))}
                      />
                    </div>

                    <div className="amm-form-group">
                      <label>Number of Occurrences (Max 30)</label>
                      <input
                        type="number"
                        min={2}
                        max={30}
                        className="amm-form-input"
                        value={recurrenceCount}
                        onChange={e => setRecurrenceCount(Number(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Automated Reminder Settings */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--h-text-muted)', textTransform: 'uppercase' }}>
                  ⏰ Automated Server Reminders
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                  <label className="amm-checkbox-row">
                    <input type="checkbox" checked={reminder24h} onChange={e => setReminder24h(e.target.checked)} />
                    <span>24 Hours Prior</span>
                  </label>
                  <label className="amm-checkbox-row">
                    <input type="checkbox" checked={reminder1h} onChange={e => setReminder1h(e.target.checked)} />
                    <span>1 Hour Prior</span>
                  </label>
                  <label className="amm-checkbox-row">
                    <input type="checkbox" checked={reminder30m} onChange={e => setReminder30m(e.target.checked)} />
                    <span>30 Minutes Prior</span>
                  </label>
                  <label className="amm-checkbox-row">
                    <input type="checkbox" checked={reminder5m} onChange={e => setReminder5m(e.target.checked)} />
                    <span>5 Minutes Prior</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : '💾 Schedule Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MEETING */}
      {/* ========================================================================= */}
      {isEditModalOpen && selectedMeeting && (
        <div className="admin-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="amm-modal-card" onClick={e => e.stopPropagation()}>
            <div className="amc-header">
              <h3>✏️ Edit Meeting: {selectedMeeting.title}</h3>
              <button type="button" className="amc-close-btn" onClick={() => setIsEditModalOpen(false)}>
                ✕
              </button>
            </div>

            {formValidationMsg && (
              <div style={{ background: 'rgba(238,93,80,0.15)', color: '#ee5d50', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                ⚠️ {formValidationMsg}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div className="amm-form-group">
                <label>Meeting Title *</label>
                <input
                  type="text"
                  className="amm-form-input"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  required
                />
              </div>

              <div className="amm-form-group">
                <label>Description</label>
                <textarea
                  className="amm-form-textarea"
                  rows={2}
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                />
              </div>

              <div className="amm-form-grid-2">
                <div className="amm-form-group">
                  <label>Type</label>
                  <select
                    className="amm-form-input"
                    value={formType}
                    onChange={e => setFormType(e.target.value as MeetingType)}
                  >
                    {MEETING_TYPES.map(t => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="amm-form-group">
                  <label>Provider</label>
                  <select
                    className="amm-form-input"
                    value={formProvider}
                    onChange={e => handleProviderChange(e.target.value as MeetingProvider)}
                  >
                    {MEETING_PROVIDERS.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="amm-form-group">
                <label>URL *</label>
                <input
                  type="text"
                  className="amm-form-input"
                  value={formUrl}
                  onChange={e => setFormUrl(e.target.value)}
                  required
                />
              </div>

              <div className="amm-form-grid-2">
                <div className="amm-form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    className="amm-form-input"
                    value={formStartTime}
                    onChange={e => setFormStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="amm-form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    className="amm-form-input"
                    value={formEndTime}
                    onChange={e => setFormEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ASSIGN STUDENTS */}
      {/* ========================================================================= */}
      {isAssignModalOpen && selectedMeeting && (
        <div className="admin-modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="amm-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="amc-header">
              <h3>👥 Assign Students to Session</h3>
              <button type="button" className="amc-close-btn" onClick={() => setIsAssignModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignStudentsSubmit}>
              <p style={{ fontSize: '13px', color: 'var(--h-text-muted)', marginBottom: '14px' }}>
                Assigning students to: <strong>{selectedMeeting.title}</strong>. Students will receive Web Push alerts and Google Calendar invitations.
              </p>

              <div className="amm-form-group">
                <label>Select Candidates ({allProfiles.length} Available):</label>
                <div style={{ maxHeight: '200px', overflowY: 'auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px' }}>
                  {allProfiles.map(p => {
                    const isChecked = formSelectedStudents.includes(p.id);
                    return (
                      <label key={p.id} className="amm-checkbox-row" style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormSelectedStudents(prev => [...prev, p.id]);
                            } else {
                              setFormSelectedStudents(prev => prev.filter(id => id !== p.id));
                            }
                          }}
                        />
                        <span>
                          <strong>{p.name}</strong> ({p.email}) - {p.role}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: 'var(--h-text-muted)' }}>
                  {formSelectedStudents.length} candidate(s) selected
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || formSelectedStudents.length === 0}>
                    {isSubmitting ? 'Assigning...' : 'Assign Selected'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MEETING DETAILS & ATTENDANCE RECORDING */}
      {/* ========================================================================= */}
      {isDetailsModalOpen && selectedMeeting && meetingDetailsData && (
        <div className="admin-modal-overlay" onClick={() => setIsDetailsModalOpen(false)}>
          <div className="amm-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
            <div className="amc-header">
              <div>
                <h3>{selectedMeeting.title}</h3>
                <span style={{ fontSize: '12px', color: 'var(--h-text-muted)' }}>
                  ID: {selectedMeeting.id} • {selectedMeeting.meeting_provider}
                </span>
              </div>
              <button type="button" className="amc-close-btn" onClick={() => setIsDetailsModalOpen(false)}>
                ✕
              </button>
            </div>

            <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span className={`amm-badge ${selectedMeeting.status.toLowerCase()}`}>
                  Status: {selectedMeeting.status}
                </span>
                <span className="amm-badge scheduled">Type: {selectedMeeting.meeting_type}</span>
                <span className="amm-badge scheduled">Capacity: {selectedMeeting.capacity}</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', fontSize: '13px' }}>
                <div>URL: <a href={selectedMeeting.meeting_url} target="_blank" rel="noreferrer" style={{ color: '#7551ff' }}>{selectedMeeting.meeting_url}</a></div>
                <div style={{ marginTop: '4px' }}>Time: {formatDateTime(selectedMeeting.start_at).dateStr}, {formatDateTime(selectedMeeting.start_at).timeStr} ({selectedTimezone})</div>
              </div>

              {/* Participant Roster & Attendance Marking (Rule 20) */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#ffffff' }}>
                  👥 Participant Roster &amp; Attendance ({meetingDetailsData.participants?.length || 0})
                </h4>
                <div style={{ maxHeight: '220px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' }}>
                  <table className="amm-table">
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>RSVP</th>
                        <th>Attendance</th>
                        <th>Mark Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(meetingDetailsData.participants || []).length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ textAlign: 'center', color: 'var(--h-text-muted)' }}>
                            No students assigned yet. Click 'Assign' to add candidates.
                          </td>
                        </tr>
                      ) : (
                        meetingDetailsData.participants.map((p: any) => (
                          <tr key={p.id}>
                            <td>
                              <strong>{p.student_id}</strong>
                            </td>
                            <td>
                              <span className="amm-badge" style={{ color: p.invitation_status === 'accepted' ? '#01b574' : '#ffb547' }}>
                                {p.invitation_status}
                              </span>
                            </td>
                            <td>
                              <span className="amm-badge" style={{ color: p.attendance_status === 'attended' ? '#01b574' : '#ee5d50' }}>
                                {p.attendance_status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  type="button"
                                  className="amm-btn-sm"
                                  onClick={() => handleMarkAttendance(p.student_id, 'attended')}
                                  title="Mark Attended"
                                >
                                  ✅ Attended
                                </button>
                                <button
                                  type="button"
                                  className="amm-btn-sm danger"
                                  onClick={() => handleMarkAttendance(p.student_id, 'absent')}
                                  title="Mark Absent"
                                >
                                  ❌ Absent
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Audit History (Rule 23) */}
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#ffffff' }}>
                  📜 Audit &amp; Event Timeline ({meetingDetailsData.auditLogs?.length || 0})
                </h4>
                <div style={{ maxHeight: '160px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                  {(meetingDetailsData.auditLogs || []).map((l: any) => (
                    <div key={l.id} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span style={{ color: '#7551ff' }}>[{new Date(l.created_at).toLocaleTimeString()}]</span>{' '}
                      <strong style={{ color: '#ffffff' }}>{l.action}</strong> by {l.actor_id}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handlePushLinkToStudents(selectedMeeting)}
                title="Send Web Push notification to all assigned candidates"
                style={{ background: '#7551ff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                📲 Push Link to Students
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setIsDetailsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOTIFICATION TESTING PANEL (Rule 29) */}
      {/* ========================================================================= */}
      {isTestNotifModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsTestNotifModalOpen(false)}>
          <div className="amm-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="amc-header">
              <h3>🔔 Admin Notification Diagnostic Panel</h3>
              <button type="button" className="amc-close-btn" onClick={() => setIsTestNotifModalOpen(false)}>
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--h-text-muted)' }}>
              Verify end-to-end Kafka event publishing, idempotent consumer worker execution, and Web Push dispatch.
            </p>

            <form onSubmit={handleRunTestNotification}>
              <div className="amm-form-group">
                <label>Select Target Student *</label>
                <select
                  className="amm-form-input"
                  value={diagStudentId}
                  onChange={e => setDiagStudentId(e.target.value)}
                >
                  {allProfiles.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="amm-form-group">
                <label>Notification Type *</label>
                <select
                  className="amm-form-input"
                  value={diagNotifType}
                  onChange={e => setDiagNotifType(e.target.value)}
                >
                  <option value="REMINDER_30M">REMINDER_30M (30 Minutes Before)</option>
                  <option value="REMINDER_5M">REMINDER_5M (5 Minutes Before)</option>
                  <option value="MEETING_CREATED">MEETING_CREATED</option>
                  <option value="MEETING_UPDATED">MEETING_UPDATED</option>
                  <option value="MEETING_CANCELLED">MEETING_CANCELLED</option>
                  <option value="MEETING_STARTED">MEETING_STARTED</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={diagRunning} style={{ width: '100%', marginTop: '10px' }}>
                {diagRunning ? 'Dispatching Test Event...' : '🚀 Dispatch Test Web Push'}
              </button>
            </form>

            {/* Diagnostic Output Results */}
            {diagResult && (
              <div className="amm-diag-card">
                <div style={{ fontWeight: 700, fontSize: '13px', color: '#ffffff', marginBottom: '8px' }}>
                  Diagnostic Pipeline Telemetry:
                </div>
                <div className="amm-diag-row">
                  <span>Push Subscription Found:</span>
                  <strong>{diagResult.subscriptionFound ? '✅ YES' : '⚠️ NO ACTIVE SUBSCRIPTION'}</strong>
                </div>
                <div className="amm-diag-row">
                  <span>Kafka Event Created:</span>
                  <strong>{diagResult.kafkaEventCreated ? '✅ YES' : '❌ NO'}</strong>
                </div>
                <div className="amm-diag-row">
                  <span>Kafka Consumer Idempotency Check:</span>
                  <strong>{diagResult.kafkaConsumerProcessed ? '✅ PROCESSED' : '❌ FAILED'}</strong>
                </div>
                <div className="amm-diag-row">
                  <span>Web Push Transmission:</span>
                  <strong>{diagResult.pushSent ? '✅ DELIVERED' : '⚠️ SKIPPED'}</strong>
                </div>
                <div className="amm-diag-row">
                  <span>Result Verdict:</span>
                  <span className="amm-badge scheduled">{diagResult.result || 'OK'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMeetingManagementTab;
