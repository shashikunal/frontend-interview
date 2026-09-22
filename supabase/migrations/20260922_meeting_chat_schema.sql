-- Supabase Migration: 20260922_meeting_chat_schema.sql
-- Phase 6: Production-Grade Meeting Chat Schema & PostgreSQL Persistence

CREATE TABLE IF NOT EXISTS public.meeting_messages (
  id VARCHAR(64) PRIMARY KEY,
  meeting_id VARCHAR(64) NOT NULL,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_role VARCHAR(32) NOT NULL DEFAULT 'PARTICIPANT',
  recipient_id VARCHAR(64) NOT NULL DEFAULT 'ALL',
  recipient_name VARCHAR(255),
  message_type VARCHAR(32) NOT NULL DEFAULT 'USER_MESSAGE',
  content TEXT NOT NULL,
  code_language VARCHAR(64),
  reply_to_message_id VARCHAR(64),
  reply_to_snippet VARCHAR(255),
  reactions JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by VARCHAR(64),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- High-performance cursor pagination index for meeting messages ordered by creation time
CREATE INDEX IF NOT EXISTS idx_meeting_messages_meeting_created
  ON public.meeting_messages (meeting_id, created_at DESC);

-- Index for sender message queries
CREATE INDEX IF NOT EXISTS idx_meeting_messages_sender
  ON public.meeting_messages (sender_id);

-- Index for message threading lookups
CREATE INDEX IF NOT EXISTS idx_meeting_messages_reply
  ON public.meeting_messages (reply_to_message_id)
  WHERE reply_to_message_id IS NOT NULL;

-- Meeting chat settings column on meetings table (if meetings table exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meetings') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'meetings' AND column_name = 'allow_chat') THEN
      ALTER TABLE public.meetings ADD COLUMN allow_chat BOOLEAN NOT NULL DEFAULT TRUE;
    END IF;
  END IF;
END $$;
