-- Supabase Migration: 20260922_application_chat_schema.sql
-- Phase 7: Application Chat (Direct Messages + Group Chat + Presence + Typing + Read Receipts)

-- 1. Conversations Table
CREATE TABLE IF NOT EXISTS public.app_conversations (
  id VARCHAR(64) PRIMARY KEY,
  type VARCHAR(16) NOT NULL, -- 'DIRECT' | 'GROUP'
  name VARCHAR(255),          -- Group name (null for DM)
  avatar_url TEXT,
  created_by VARCHAR(64) NOT NULL,
  last_message_id VARCHAR(64),
  last_message_preview TEXT,
  last_message_sender_id VARCHAR(64),
  last_message_sender_name VARCHAR(255),
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for sorting conversations by last message timestamp
CREATE INDEX IF NOT EXISTS idx_app_conversations_last_message_at
  ON public.app_conversations (last_message_at DESC NULLS LAST);

-- 2. Conversation Participants Table
CREATE TABLE IF NOT EXISTS public.app_conversation_participants (
  conversation_id VARCHAR(64) NOT NULL REFERENCES public.app_conversations(id) ON DELETE CASCADE,
  user_id VARCHAR(64) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  role VARCHAR(32) NOT NULL DEFAULT 'MEMBER', -- 'OWNER' | 'ADMIN' | 'MEMBER'
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  last_read_message_id VARCHAR(64),
  last_read_at TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
);

-- Index for listing all conversations for a user
CREATE INDEX IF NOT EXISTS idx_app_participants_user_active
  ON public.app_conversation_participants (user_id, left_at)
  WHERE left_at IS NULL;

-- Index for finding active participants of a conversation
CREATE INDEX IF NOT EXISTS idx_app_participants_conv_active
  ON public.app_conversation_participants (conversation_id, left_at)
  WHERE left_at IS NULL;

-- 3. Application Messages Table
CREATE TABLE IF NOT EXISTS public.app_messages (
  id VARCHAR(64) PRIMARY KEY,
  conversation_id VARCHAR(64) NOT NULL REFERENCES public.app_conversations(id) ON DELETE CASCADE,
  sender_id VARCHAR(64) NOT NULL,
  sender_name VARCHAR(255) NOT NULL,
  message_type VARCHAR(32) NOT NULL DEFAULT 'USER_MESSAGE', -- 'USER_MESSAGE' | 'SYSTEM_MESSAGE'
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  client_message_id VARCHAR(64),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at TIMESTAMPTZ,
  deleted_by VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast cursor pagination index: (conversation_id, created_at DESC)
CREATE INDEX IF NOT EXISTS idx_app_messages_conv_created
  ON public.app_messages (conversation_id, created_at DESC);

-- Sender index for user audits
CREATE INDEX IF NOT EXISTS idx_app_messages_sender
  ON public.app_messages (sender_id);

-- Idempotency lookup index: (conversation_id, client_message_id)
CREATE INDEX IF NOT EXISTS idx_app_messages_client_id
  ON public.app_messages (conversation_id, client_message_id)
  WHERE client_message_id IS NOT NULL;

-- 4. Message Read Receipts / Watermark Table
CREATE TABLE IF NOT EXISTS public.app_message_read_receipts (
  conversation_id VARCHAR(64) NOT NULL REFERENCES public.app_conversations(id) ON DELETE CASCADE,
  user_id VARCHAR(64) NOT NULL,
  last_read_message_id VARCHAR(64) NOT NULL,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);
