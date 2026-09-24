/**
 * Meeting Operations Domain Models & Types
 * Production Implementation conforming to Specification
 */

export type MeetingType =
  | 'Interview'
  | 'Training'
  | 'Mock Interview'
  | 'Technical Discussion'
  | 'HR Discussion'
  | 'Workshop'
  | 'ELP Session'
  | 'Other';

export type MeetingProvider =
  | 'Platform Meet (Built-in)'
  | 'Google Meet'
  | 'Zoom'
  | 'Microsoft Teams'
  | 'Custom URL';

export type MeetingStatus = 'SCHEDULED' | 'STARTED' | 'IN_PROGRESS' | 'ACTIVE' | 'COMPLETED' | 'ENDED' | 'CANCELLED';

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export type AttendanceStatus = 'pending' | 'attended' | 'present' | 'absent' | 'late';

export type CalendarStatus = 'pending' | 'synced' | 'failed';

export type NotificationStatus = 'scheduled' | 'processing' | 'sent' | 'failed' | 'skipped';

export type NotificationType =
  | 'MEETING_CREATED'
  | 'MEETING_UPDATED'
  | 'MEETING_CANCELLED'
  | 'REMINDER_24H'
  | 'REMINDER_1H'
  | 'REMINDER_30M'
  | 'REMINDER_5M'
  | 'MEETING_STARTED'
  | 'RSVP_REQUIRED'
  | 'CALENDAR_SYNC_FAILED'
  | 'NOTIFICATION_FAILED';

export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  interval: number; // e.g. every 1 week
  count?: number; // total occurrences
  until?: string; // ISO end date
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday...
}

export interface MeetingRecord {
  id: string;
  title: string;
  description?: string;
  meeting_type: MeetingType;
  meeting_provider: MeetingProvider;
  meeting_url: string;
  start_at: string;
  end_at: string;
  timezone: string;
  trainer_id: string;
  trainer_name?: string;
  created_by: string;
  batch_id?: string;
  status: MeetingStatus;
  capacity: number;
  recurrence_rule?: RecurrenceRule | null;
  parent_meeting_id?: string | null;
  created_at: string;
  updated_at: string;
  cancelled_at?: string | null;
  cancellation_reason?: string | null;
}

export interface MeetingParticipantRecord {
  id: string;
  meeting_id: string;
  student_id: string;
  student_name?: string;
  student_email?: string;
  status?: string;
  invitation_status: InvitationStatus;
  attendance_status: AttendanceStatus;
  calendar_status: CalendarStatus;
  notification_status: string;
  joined_at?: string | null;
  left_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PushSubscriptionRecord {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  device_type?: string;
  browser?: string;
  user_agent?: string;
  is_active: boolean;
  last_seen_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferencesRecord {
  user_id: string;
  meeting_notifications: boolean;
  reminder_24h: boolean;
  reminder_1h: boolean;
  reminder_30m: boolean;
  reminder_5m: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  updated_at: string;
}

export interface MeetingNotificationRecord {
  id: string;
  meeting_id: string;
  user_id: string;
  notification_type: NotificationType;
  scheduled_at: string;
  sent_at?: string | null;
  delivered_at?: string | null;
  clicked_at?: string | null;
  status: NotificationStatus;
  provider: 'web_push' | 'email' | 'in_app';
  retry_count: number;
  error?: string | null;
  created_at: string;
}

export interface MeetingAuditLogRecord {
  id: string;
  meeting_id: string;
  actor_id: string;
  action: string;
  old_value?: Record<string, any> | null;
  new_value?: Record<string, any> | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface CreateMeetingDTO {
  title: string;
  description?: string;
  meeting_type: MeetingType;
  meeting_provider: MeetingProvider;
  meeting_url: string;
  start_at: string;
  end_at: string;
  timezone?: string;
  trainer_id: string;
  trainer_name?: string;
  batch_id?: string;
  capacity?: number;
  student_ids?: string[];
  recurrence?: RecurrenceRule | null;
  reminders?: {
    reminder_24h?: boolean;
    reminder_1h?: boolean;
    reminder_30m?: boolean;
    reminder_5m?: boolean;
  };
}

export interface UpdateMeetingDTO {
  title?: string;
  description?: string;
  meeting_type?: MeetingType;
  meeting_provider?: MeetingProvider;
  meeting_url?: string;
  start_at?: string;
  end_at?: string;
  timezone?: string;
  trainer_id?: string;
  trainer_name?: string;
  batch_id?: string;
  capacity?: number;
  status?: MeetingStatus;
  edit_scope?: 'THIS_OCCURRENCE' | 'THIS_AND_FUTURE' | 'ALL_OCCURRENCES';
}

export interface MeetingOpsDashboardStats {
  todayMeetingsCount: number;
  upcomingMeetingsCount: number;
  completedMeetingsCount: number;
  cancelledMeetingsCount: number;
  studentsAssignedCount: number;
  pendingRsvpsCount: number;
  notificationFailuresCount: number;
  calendarSyncFailuresCount: number;
}
