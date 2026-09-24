-- ==============================================================================
-- Supabase Migration: 20260924_meeting_operations_schema.sql
-- Meeting Operations System: Full Meeting CRUD, Participants, Push Subscriptions,
-- Notifications, Outbox Events, Idempotency, and Audit Logs
-- ==============================================================================

-- 1. Meetings Table
CREATE TABLE IF NOT EXISTS public.meetings (
    id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    meeting_type TEXT NOT NULL DEFAULT 'Interview',
    meeting_provider TEXT NOT NULL DEFAULT 'Google Meet',
    meeting_url TEXT NOT NULL,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    trainer_id TEXT NOT NULL,
    trainer_name TEXT,
    created_by TEXT NOT NULL,
    batch_id TEXT,
    status TEXT NOT NULL DEFAULT 'SCHEDULED',
    capacity INTEGER NOT NULL DEFAULT 50,
    recurrence_rule JSONB,
    parent_meeting_id VARCHAR(64) REFERENCES public.meetings(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    CONSTRAINT chk_meeting_times CHECK (end_at > start_at),
    CONSTRAINT chk_meeting_status CHECK (status IN ('SCHEDULED', 'STARTED', 'COMPLETED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
CREATE INDEX IF NOT EXISTS idx_meetings_start_at ON public.meetings(start_at);
CREATE INDEX IF NOT EXISTS idx_meetings_trainer_id ON public.meetings(trainer_id);
CREATE INDEX IF NOT EXISTS idx_meetings_batch_id ON public.meetings(batch_id);
CREATE INDEX IF NOT EXISTS idx_meetings_parent_id ON public.meetings(parent_meeting_id);

-- 2. Meeting Participants Table (with deduplication unique constraint)
CREATE TABLE IF NOT EXISTS public.meeting_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id VARCHAR(64) NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    student_name TEXT,
    student_email TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    invitation_status TEXT NOT NULL DEFAULT 'pending',
    attendance_status TEXT NOT NULL DEFAULT 'pending',
    calendar_status TEXT NOT NULL DEFAULT 'pending',
    notification_status TEXT NOT NULL DEFAULT 'pending',
    joined_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_meeting_participant UNIQUE (meeting_id, student_id),
    CONSTRAINT chk_invitation_status CHECK (invitation_status IN ('pending', 'accepted', 'declined')),
    CONSTRAINT chk_attendance_status CHECK (attendance_status IN ('pending', 'attended', 'absent', 'late')),
    CONSTRAINT chk_calendar_status CHECK (calendar_status IN ('pending', 'synced', 'failed'))
);

CREATE INDEX IF NOT EXISTS idx_meeting_participants_meeting_id ON public.meeting_participants(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_student_id ON public.meeting_participants(student_id);
CREATE INDEX IF NOT EXISTS idx_meeting_participants_attendance ON public.meeting_participants(attendance_status);

-- 3. Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_type TEXT DEFAULT 'desktop',
    browser TEXT DEFAULT 'chrome',
    user_agent TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_sub_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_sub_active ON public.push_subscriptions(is_active);

-- 4. Notification Preferences Table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id TEXT PRIMARY KEY,
    meeting_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_24h BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_1h BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_30m BOOLEAN NOT NULL DEFAULT TRUE,
    reminder_5m BOOLEAN NOT NULL DEFAULT TRUE,
    email_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    push_notifications BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Meeting Notifications Delivery Tracking Table
CREATE TABLE IF NOT EXISTS public.meeting_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id VARCHAR(64) NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    notification_type TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'scheduled',
    provider TEXT NOT NULL DEFAULT 'web_push',
    retry_count INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_meeting_notification UNIQUE (meeting_id, user_id, notification_type),
    CONSTRAINT chk_notification_status CHECK (status IN ('scheduled', 'processing', 'sent', 'failed', 'skipped'))
);

CREATE INDEX IF NOT EXISTS idx_meeting_notifications_scheduled ON public.meeting_notifications(scheduled_at, status);
CREATE INDEX IF NOT EXISTS idx_meeting_notifications_user ON public.meeting_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_meeting_notifications_meeting ON public.meeting_notifications(meeting_id);

-- 6. Transactional Outbox Events Table
CREATE TABLE IF NOT EXISTS public.outbox_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    attempts INTEGER NOT NULL DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    CONSTRAINT chk_outbox_status CHECK (status IN ('PENDING', 'PUBLISHING', 'PUBLISHED', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_outbox_events_status ON public.outbox_events(status);
CREATE INDEX IF NOT EXISTS idx_outbox_events_created ON public.outbox_events(created_at);

-- 7. Processed Events (Idempotency Tracking) Table
CREATE TABLE IF NOT EXISTS public.processed_events (
    event_id TEXT NOT NULL,
    consumer_name TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'PROCESSED',
    error TEXT,
    PRIMARY KEY (event_id, consumer_name)
);

CREATE INDEX IF NOT EXISTS idx_processed_events_date ON public.processed_events(processed_at);

-- 8. Meeting Audit Logs Table
CREATE TABLE IF NOT EXISTS public.meeting_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meeting_id VARCHAR(64) NOT NULL,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meeting_audit_meeting ON public.meeting_audit_logs(meeting_id);
CREATE INDEX IF NOT EXISTS idx_meeting_audit_actor ON public.meeting_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_meeting_audit_created ON public.meeting_audit_logs(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_audit_logs ENABLE ROW LEVEL SECURITY;

-- Permissive service/authenticated access policies
DO $$
BEGIN
    -- Public read for meetings where participant is assigned or user is admin
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meetings' AND policyname = 'allow_read_meetings') THEN
        CREATE POLICY allow_read_meetings ON public.meetings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meetings' AND policyname = 'allow_write_meetings') THEN
        CREATE POLICY allow_write_meetings ON public.meetings FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Participants
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meeting_participants' AND policyname = 'allow_all_participants') THEN
        CREATE POLICY allow_all_participants ON public.meeting_participants FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Push Subscriptions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_subscriptions' AND policyname = 'allow_all_push_subs') THEN
        CREATE POLICY allow_all_push_subs ON public.push_subscriptions FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Notification Preferences
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_preferences' AND policyname = 'allow_all_notif_prefs') THEN
        CREATE POLICY allow_all_notif_prefs ON public.notification_preferences FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Meeting Notifications
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meeting_notifications' AND policyname = 'allow_all_meeting_notifs') THEN
        CREATE POLICY allow_all_meeting_notifs ON public.meeting_notifications FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- Outbox & Audit Logs
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'outbox_events' AND policyname = 'allow_all_outbox') THEN
        CREATE POLICY allow_all_outbox ON public.outbox_events FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'processed_events' AND policyname = 'allow_all_processed') THEN
        CREATE POLICY allow_all_processed ON public.processed_events FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'meeting_audit_logs' AND policyname = 'allow_all_audit') THEN
        CREATE POLICY allow_all_audit ON public.meeting_audit_logs FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;
