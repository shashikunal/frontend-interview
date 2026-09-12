-- ==============================================================================
-- Migration: Audit Fixes — Category Columns, Device Sessions, Security Fixes
-- Date: 2026-09-11
-- Description:
--   1. Add `category` and `language` columns to question_attempts
--   2. Add `category`, `passed_tests`, `total_tests`, `compiler_output`,
--      `error_message`, `idempotency_key` to submissions
--   3. Add `admin_id` to interview_sessions
--   4. Create device_sessions table
--   5. Fix permissive RLS on session sub-tables (session_participants,
--      session_messages, session_code_snapshots, session_executions, session_activity)
--   6. Fix interview_sessions INSERT policy (was WITH CHECK (true))
-- ==============================================================================

-- ==============================================================================
-- 1. question_attempts — add category and language columns
-- ==============================================================================
DO $$ BEGIN
  ALTER TABLE public.question_attempts
    ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'MACHINE_CODING'
      CHECK (category IN ('MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING', 'FRONTEND_JS', 'THEORY', 'AI_MOCK'));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.question_attempts
    ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'javascript';
EXCEPTION WHEN others THEN null; END $$;

-- Index for track-level filtering
CREATE INDEX IF NOT EXISTS idx_question_attempts_category
  ON public.question_attempts(category);
CREATE INDEX IF NOT EXISTS idx_question_attempts_category_user
  ON public.question_attempts(user_id, category);

-- ==============================================================================
-- 2. submissions — add category, test results, error info, idempotency_key
-- ==============================================================================
DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'MACHINE_CODING'
      CHECK (category IN ('MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING', 'FRONTEND_JS', 'THEORY', 'AI_MOCK'));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS passed_tests INTEGER DEFAULT 0;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS total_tests INTEGER DEFAULT 0;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS compiler_output TEXT DEFAULT '';
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS error_message TEXT DEFAULT '';
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
EXCEPTION WHEN others THEN null; END $$;

-- Unique constraint on idempotency_key (ignore if already exists)
DO $$ BEGIN
  ALTER TABLE public.submissions
    ADD CONSTRAINT uq_submissions_idempotency UNIQUE (idempotency_key);
EXCEPTION WHEN duplicate_table THEN null; WHEN others THEN null; END $$;

CREATE INDEX IF NOT EXISTS idx_submissions_category
  ON public.submissions(category);
CREATE INDEX IF NOT EXISTS idx_submissions_category_user
  ON public.submissions(user_id, category);
CREATE INDEX IF NOT EXISTS idx_submissions_idempotency
  ON public.submissions(idempotency_key);

-- ==============================================================================
-- 3. interview_sessions — add admin_id column
-- ==============================================================================
DO $$ BEGIN
  ALTER TABLE public.interview_sessions
    ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
EXCEPTION WHEN others THEN null; END $$;

CREATE INDEX IF NOT EXISTS idx_interview_sessions_admin
  ON public.interview_sessions(admin_id);

-- ==============================================================================
-- 4. device_sessions table — tracks browser/device info per user login
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.device_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Browser fingerprint (browser-observable, NOT hardware-exact)
  browser TEXT DEFAULT '',
  browser_version TEXT DEFAULT '',
  operating_system TEXT DEFAULT '',
  device_type TEXT DEFAULT 'Desktop'
    CHECK (device_type IN ('Desktop', 'Tablet', 'Mobile', 'Unknown')),
  screen_width INTEGER DEFAULT 0,
  screen_height INTEGER DEFAULT 0,
  timezone TEXT DEFAULT '',
  language TEXT DEFAULT '',
  logical_cpu_count INTEGER DEFAULT 0,  -- navigator.hardwareConcurrency
  device_memory_gb NUMERIC DEFAULT 0,   -- navigator.deviceMemory (if available)
  user_agent TEXT DEFAULT '',
  -- IP captured server-side (deferred — requires edge function)
  ip_address TEXT DEFAULT '',
  ip_source TEXT DEFAULT 'unknown'
    CHECK (ip_source IN ('edge_function', 'x_forwarded_for', 'unknown')),
  -- Session lifecycle
  first_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Dedup: same user + same user_agent treated as same device session
  CONSTRAINT uq_device_session_user_agent UNIQUE (user_id, user_agent)
);

CREATE INDEX IF NOT EXISTS idx_device_sessions_user_id
  ON public.device_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_last_seen
  ON public.device_sessions(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_device_sessions_browser
  ON public.device_sessions(browser);

ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- Users can view their own device sessions; admins can view all
CREATE POLICY "Users view own device sessions"
  ON public.device_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Only the authenticated user can upsert their own device session
CREATE POLICY "Users upsert own device sessions"
  ON public.device_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- 5. Fix permissive RLS on interview session sub-tables
-- Previously all used USING (true) — anyone could read any session data
-- Replace with: must be a participant in the session OR admin
-- ==============================================================================

-- Helper: check if user is a participant in a given session
-- (candidate_id on the session OR in session_participants OR admin)
CREATE OR REPLACE FUNCTION public.is_session_member(p_session_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.interview_sessions s
      WHERE s.id = p_session_id
        AND (s.candidate_id = auth.uid() OR s.admin_id = auth.uid())
    )
    OR EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = p_session_id
        AND sp.user_id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---- session_participants ----
DROP POLICY IF EXISTS "Session participants viewable by session members or admins"
  ON public.session_participants;
DROP POLICY IF EXISTS "Session participants insertable"
  ON public.session_participants;
DROP POLICY IF EXISTS "Session participants updatable"
  ON public.session_participants;

CREATE POLICY "Session participants select — members or admins"
  ON public.session_participants FOR SELECT
  TO authenticated
  USING (public.is_session_member(session_id));

CREATE POLICY "Session participants insert — members or admins"
  ON public.session_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_session_member(session_id)
  );

CREATE POLICY "Session participants update — own record"
  ON public.session_participants FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ---- session_messages ----
DROP POLICY IF EXISTS "Session messages viewable by all in session" ON public.session_messages;
DROP POLICY IF EXISTS "Session messages insertable by participants" ON public.session_messages;

CREATE POLICY "Session messages select — members or admins"
  ON public.session_messages FOR SELECT
  TO authenticated
  USING (public.is_session_member(session_id));

CREATE POLICY "Session messages insert — members or admins"
  ON public.session_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid() = sender_id OR sender_id IS NULL)
    AND public.is_session_member(session_id)
  );

-- ---- session_code_snapshots ----
DROP POLICY IF EXISTS "Snapshots viewable by participants" ON public.session_code_snapshots;
DROP POLICY IF EXISTS "Snapshots insertable by participants" ON public.session_code_snapshots;

CREATE POLICY "Snapshots select — members or admins"
  ON public.session_code_snapshots FOR SELECT
  TO authenticated
  USING (public.is_session_member(session_id));

CREATE POLICY "Snapshots insert — members or admins"
  ON public.session_code_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (public.is_session_member(session_id));

-- ---- session_executions ----
DROP POLICY IF EXISTS "Executions viewable by session members" ON public.session_executions;
DROP POLICY IF EXISTS "Executions insertable" ON public.session_executions;

CREATE POLICY "Executions select — members or admins"
  ON public.session_executions FOR SELECT
  TO authenticated
  USING (public.is_session_member(session_id));

CREATE POLICY "Executions insert — members or admins"
  ON public.session_executions FOR INSERT
  TO authenticated
  WITH CHECK (public.is_session_member(session_id));

-- ---- session_activity ----
DROP POLICY IF EXISTS "Activity viewable by session members" ON public.session_activity;
DROP POLICY IF EXISTS "Activity insertable" ON public.session_activity;

CREATE POLICY "Activity select — members or admins"
  ON public.session_activity FOR SELECT
  TO authenticated
  USING (public.is_session_member(session_id));

CREATE POLICY "Activity insert — members or admins"
  ON public.session_activity FOR INSERT
  TO authenticated
  WITH CHECK (public.is_session_member(session_id));

-- ==============================================================================
-- 6. Fix interview_sessions INSERT policy
-- Was: WITH CHECK (true) — anyone could create a session
-- Now: must be the candidate_id or an admin
-- ==============================================================================
DROP POLICY IF EXISTS "Candidates and Admins insert sessions" ON public.interview_sessions;

CREATE POLICY "Candidates and Admins insert sessions"
  ON public.interview_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = candidate_id
    OR public.is_admin()
  );

-- ==============================================================================
-- 7. Backfill category from question_id prefix where feasible
-- (Best-effort; non-prefixed IDs remain as MACHINE_CODING default)
-- ==============================================================================
UPDATE public.question_attempts
  SET category = 'DSA'
  WHERE question_id LIKE 'DSA%'
    AND category = 'MACHINE_CODING';

UPDATE public.question_attempts
  SET category = 'CORE_PROGRAMMING'
  WHERE question_id LIKE 'CP-%'
    AND category = 'MACHINE_CODING';

UPDATE public.question_attempts
  SET category = 'FRONTEND_JS'
  WHERE question_id LIKE 'FJP-%'
    AND category = 'MACHINE_CODING';

UPDATE public.submissions
  SET category = 'DSA'
  WHERE question_id LIKE 'DSA%'
    AND category = 'MACHINE_CODING';

UPDATE public.submissions
  SET category = 'CORE_PROGRAMMING'
  WHERE question_id LIKE 'CP-%'
    AND category = 'MACHINE_CODING';

UPDATE public.submissions
  SET category = 'FRONTEND_JS'
  WHERE question_id LIKE 'FJP-%'
    AND category = 'MACHINE_CODING';

-- ==============================================================================
-- Done. Apply this migration in Supabase SQL Editor or via `supabase db push`.
-- ==============================================================================
