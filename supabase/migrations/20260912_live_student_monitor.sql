-- ==============================================================================
-- Migration: Live Multi-Student Interview Monitor & Realtime Authorization
-- Date: 2026-09-12
-- ==============================================================================

-- 1. Ensure realtime publication covers required session tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'interview_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_sessions;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'session_executions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_executions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'session_activity'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.session_activity;
  END IF;
END $$;

-- 2. Index optimization for realtime dashboard polling & lookup
CREATE INDEX IF NOT EXISTS idx_interview_sessions_admin_active 
  ON public.interview_sessions(status, last_activity_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_activity_session_time
  ON public.session_activity(session_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_executions_session_time
  ON public.session_executions(session_id, created_at DESC);

-- 3. Security: Helper function to verify if user can monitor an interview session
CREATE OR REPLACE FUNCTION public.can_monitor_interview_session(session_row_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    -- Admin or Super Admin
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
  ) OR EXISTS (
    -- Direct session admin assignment
    SELECT 1 FROM public.interview_sessions s
    WHERE s.id = session_row_id AND s.admin_id = auth.uid()
  ) OR EXISTS (
    -- Observer or Interviewer participant role
    SELECT 1 FROM public.session_participants sp
    WHERE sp.session_id = session_row_id AND sp.user_id = auth.uid() AND sp.role IN ('admin', 'interviewer', 'observer')
  );
$$;

-- 4. RLS update: Ensure Admins have global SELECT access to live interview sessions
DROP POLICY IF EXISTS "Admins can view all interview sessions" ON public.interview_sessions;
CREATE POLICY "Admins can view all interview sessions"
  ON public.interview_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
    OR candidate_id = auth.uid()
    OR admin_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.session_participants sp
      WHERE sp.session_id = interview_sessions.id AND sp.user_id = auth.uid()
    )
  );

-- 5. RLS update: session_activity & session_executions read policies
DROP POLICY IF EXISTS "Admins and participants view activity" ON public.session_activity;
CREATE POLICY "Admins and participants view activity"
  ON public.session_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
    )
    OR user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.interview_sessions s
      WHERE s.id = session_activity.session_id AND s.candidate_id = auth.uid()
    )
  );
