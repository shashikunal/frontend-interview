-- ==============================================================================
-- Migration: Complete User Account, Admin Account & Supabase Activity Tracking
-- Version: 20260906_activity_tracking_and_admin
-- Description: Creates question_attempts, submissions, user_question_progress,
--              activity_logs, indexes, RLS policies, and admin promotion function.
-- ==============================================================================

-- 1. Ensure public.profiles has all necessary columns
DO $$ BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_company TEXT DEFAULT 'Google & Meta';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'L5 Senior Engineer';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
EXCEPTION
  WHEN undefined_table THEN null;
END $$;

-- 2. Create Question Attempts Table
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'started', -- 'started', 'in_progress', 'completed', 'abandoned'
  attempt_count INTEGER DEFAULT 1,
  time_spent INTEGER DEFAULT 0, -- elapsed time in seconds
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  attempt_id UUID REFERENCES public.question_attempts(id) ON DELETE SET NULL,
  answer TEXT,
  code TEXT,
  language TEXT NOT NULL DEFAULT 'javascript',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'accepted', 'wrong_answer', 'runtime_error', 'compile_error', 'time_limit', 'failed'
  score NUMERIC DEFAULT 0,
  execution_time NUMERIC DEFAULT 0, -- ms
  memory_used NUMERIC DEFAULT 0, -- KB or MB
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create User Question Progress Table (per-question progress)
CREATE TABLE IF NOT EXISTS public.user_question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  best_score NUMERIC DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- seconds
  first_attempt_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, question_id)
);

-- 5. Create General Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'login', 'logout', 'question_viewed', 'question_started', 'code_run', 'answer_submitted', 'submission_accepted', 'submission_failed', 'question_completed', etc.
  entity_type TEXT NOT NULL, -- 'question', 'submission', 'mock', 'user', 'system'
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- 6. Performance Indexes
-- ==============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Question Attempts
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON public.question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON public.question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_status ON public.question_attempts(status);
CREATE INDEX IF NOT EXISTS idx_question_attempts_created_at ON public.question_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_q ON public.question_attempts(user_id, question_id);

-- Submissions
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_question_id ON public.submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_submissions_attempt_id ON public.submissions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user_q ON public.submissions(user_id, question_id);

-- User Question Progress
CREATE INDEX IF NOT EXISTS idx_user_q_progress_user ON public.user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_q_progress_question ON public.user_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_q_progress_status ON public.user_question_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_q_progress_user_q ON public.user_question_progress(user_id, question_id);

-- Activity Logs
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created ON public.activity_logs(user_id, created_at DESC);

-- ==============================================================================
-- 7. Row-Level Security (RLS)
-- ==============================================================================

-- Helper is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Question Attempts Policies
DROP POLICY IF EXISTS "Users can view own attempts" ON public.question_attempts;
CREATE POLICY "Users can view own attempts"
  ON public.question_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own attempts" ON public.question_attempts;
CREATE POLICY "Users can insert own attempts"
  ON public.question_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own attempts" ON public.question_attempts;
CREATE POLICY "Users can update own attempts"
  ON public.question_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Submissions Policies
DROP POLICY IF EXISTS "Users can view own submissions" ON public.submissions;
CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own submissions" ON public.submissions;
CREATE POLICY "Users can insert own submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User Question Progress Policies
DROP POLICY IF EXISTS "Users can view own question progress" ON public.user_question_progress;
CREATE POLICY "Users can view own question progress"
  ON public.user_question_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert/update own question progress" ON public.user_question_progress;
CREATE POLICY "Users can insert/update own question progress"
  ON public.user_question_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Activity Logs Policies
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_logs;
CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- ==============================================================================
-- 8. Secure Admin Promotion Function
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.promote_user_to_admin(target_email TEXT)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Security check: only superuser or current admin can promote
  IF NOT (public.is_admin() OR auth.uid() IS NULL) THEN
    RAISE EXCEPTION 'Unauthorized: Only platform administrators can assign admin privileges.';
  END IF;

  SELECT id INTO v_user_id
  FROM public.profiles
  WHERE LOWER(email) = LOWER(TRIM(target_email));

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User with given email not found.');
  END IF;

  -- Update profiles table
  UPDATE public.profiles
  SET role = 'admin',
      feature_entitlements = '{"questions_full": true, "coding_sandbox": true, "system_design": true, "video_mock": true, "compiler_studios": true, "cloud_sync": true}'::jsonb,
      updated_at = NOW()
  WHERE id = v_user_id;

  -- Upsert user_roles if table exists
  BEGIN
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (v_user_id, 'admin')
    ON CONFLICT (user_id, role_id) DO NOTHING;
  EXCEPTION
    WHEN undefined_table THEN null;
  END;

  -- Record audit log
  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'ROLE_UPDATED', 'user', v_user_id::text, jsonb_build_object('promoted_email', target_email, 'new_role', 'admin'));

  RETURN jsonb_build_object('success', true, 'message', 'User successfully promoted to platform admin.', 'user_id', v_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
