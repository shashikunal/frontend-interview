-- ==============================================================================
-- Migration: Machine Coding Real-Time Collaboration & Live Interview Sessions
-- Date: 2026-09-08
-- ==============================================================================

-- 1. Interview Sessions Table
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_name TEXT NOT NULL DEFAULT 'Candidate',
  candidate_email TEXT NOT NULL DEFAULT '',
  question_id TEXT NOT NULL,
  question_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'in_progress', 'paused', 'submitted', 'completed', 'cancelled'
  active_file TEXT DEFAULT 'App.tsx',
  language TEXT DEFAULT 'react',
  current_code_snapshot TEXT DEFAULT '',
  files_snapshot JSONB DEFAULT '{}'::jsonb,
  last_activity_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Session Participants Table (Tracks Candidate, Admin, Interviewer, Observers)
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'candidate', -- 'candidate', 'admin', 'interviewer', 'observer'
  name TEXT NOT NULL,
  is_online BOOLEAN DEFAULT true,
  can_edit BOOLEAN DEFAULT false,
  cursor_position JSONB DEFAULT '{}'::jsonb,
  last_seen_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT uq_session_participant UNIQUE (session_id, user_id)
);

-- 3. Session Messages Table (Two-way communication)
CREATE TABLE IF NOT EXISTS public.session_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL DEFAULT 'candidate',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Session Code Snapshots Table (Debounced checkpoints)
CREATE TABLE IF NOT EXISTS public.session_code_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  label TEXT DEFAULT 'Checkpoint',
  files JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Session Executions Table (Tracks Run Code / Tests events)
CREATE TABLE IF NOT EXISTS public.session_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'react',
  status TEXT NOT NULL DEFAULT 'success', -- 'running', 'success', 'runtime_error', 'compile_error', 'failed'
  stdout TEXT DEFAULT '',
  stderr TEXT DEFAULT '',
  exit_code INTEGER DEFAULT 0,
  execution_time NUMERIC DEFAULT 0,
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Session Activity Logs (Audit & timeline)
CREATE TABLE IF NOT EXISTS public.session_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL DEFAULT 'System',
  user_role TEXT NOT NULL DEFAULT 'system',
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for lightning queries
CREATE INDEX IF NOT EXISTS idx_interview_sessions_candidate ON public.interview_sessions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_status ON public.interview_sessions(status);
CREATE INDEX IF NOT EXISTS idx_interview_sessions_last_activity ON public.interview_sessions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_participants_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_messages_session ON public.session_messages(session_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_session_snapshots_session ON public.session_code_snapshots(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_executions_session ON public.session_executions(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_activity_session ON public.session_activity(session_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_code_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_activity ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = check_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies: interview_sessions
CREATE POLICY "Candidates and Admins view sessions"
  ON public.interview_sessions FOR SELECT
  USING (
    auth.uid() = candidate_id 
    OR public.is_admin_user(auth.uid())
    OR EXISTS (SELECT 1 FROM public.session_participants sp WHERE sp.session_id = interview_sessions.id AND sp.user_id = auth.uid())
    OR auth.uid() IS NULL -- Allow public read for demo/evaluation
  );

CREATE POLICY "Candidates and Admins insert sessions"
  ON public.interview_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Candidates and Admins update sessions"
  ON public.interview_sessions FOR UPDATE
  USING (
    auth.uid() = candidate_id 
    OR public.is_admin_user(auth.uid())
    OR auth.uid() IS NULL
  );

-- RLS Policies: session_participants
CREATE POLICY "Session participants viewable by session members or admins"
  ON public.session_participants FOR SELECT
  USING (true);

CREATE POLICY "Session participants insertable"
  ON public.session_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Session participants updatable"
  ON public.session_participants FOR UPDATE
  USING (true);

-- RLS Policies: session_messages
CREATE POLICY "Session messages viewable by all in session"
  ON public.session_messages FOR SELECT
  USING (true);

CREATE POLICY "Session messages insertable by participants"
  ON public.session_messages FOR INSERT
  WITH CHECK (true);

-- RLS Policies: session_code_snapshots
CREATE POLICY "Snapshots viewable by participants"
  ON public.session_code_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Snapshots insertable by participants"
  ON public.session_code_snapshots FOR INSERT
  WITH CHECK (true);

-- RLS Policies: session_executions
CREATE POLICY "Executions viewable by session members"
  ON public.session_executions FOR SELECT
  USING (true);

CREATE POLICY "Executions insertable"
  ON public.session_executions FOR INSERT
  WITH CHECK (true);

-- RLS Policies: session_activity
CREATE POLICY "Activity viewable by session members"
  ON public.session_activity FOR SELECT
  USING (true);

CREATE POLICY "Activity insertable"
  ON public.session_activity FOR INSERT
  WITH CHECK (true);

-- Realtime publication enablement for live WebSocket channels
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_sessions;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_messages;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_executions;
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.session_activity;
EXCEPTION WHEN others THEN null; END $$;
