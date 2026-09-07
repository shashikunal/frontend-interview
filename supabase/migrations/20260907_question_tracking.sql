-- ==============================================================================
-- Migration: Question Tracking, Attempts, Drafts, Code Runs & User Progress
-- Date: 2026-09-07
-- ==============================================================================

-- 1. Question Attempts Table
CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_activity_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'started', -- 'started', 'in_progress', 'completed', 'abandoned'
  attempt_count INTEGER DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add missing columns to question_attempts if table already existed
DO $$ BEGIN
  ALTER TABLE public.question_attempts ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;
  ALTER TABLE public.question_attempts ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());
EXCEPTION
  WHEN others THEN null;
END $$;

-- 2. Question Drafts Table (Auto-saved debounced user code)
CREATE TABLE IF NOT EXISTS public.question_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  attempt_id UUID REFERENCES public.question_attempts(id) ON DELETE SET NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  code TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT uq_question_drafts_user_q_lang UNIQUE (user_id, question_id, language)
);

-- 3. Code Executions Table (Tracks "Run Code" actions separately from submissions)
CREATE TABLE IF NOT EXISTS public.code_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  attempt_id UUID REFERENCES public.question_attempts(id) ON DELETE SET NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  execution_status TEXT NOT NULL DEFAULT 'success', -- 'success', 'runtime_error', 'compile_error', 'time_limit'
  execution_time NUMERIC DEFAULT 0, -- ms
  memory_used NUMERIC DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Submissions Table (Tracks evaluated submissions)
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
  execution_time NUMERIC DEFAULT 0,
  memory_used NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. User Question Progress Table (Maintains per-user per-question best status)
CREATE TABLE IF NOT EXISTS public.user_question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  best_score NUMERIC DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  first_attempt_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  last_attempt_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT uq_user_question_progress UNIQUE (user_id, question_id)
);

-- Add missing columns to user_question_progress if already existed
DO $$ BEGIN
  ALTER TABLE public.user_question_progress ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER DEFAULT 0;
  ALTER TABLE public.user_question_progress ADD COLUMN IF NOT EXISTS last_attempt_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());
EXCEPTION
  WHEN others THEN null;
END $$;

-- 6. Activity Logs Table (System-wide activity audit)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON public.question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON public.question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_status ON public.question_attempts(status);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_q ON public.question_attempts(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_created_at ON public.question_attempts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_question_drafts_user_id ON public.question_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_drafts_user_q ON public.question_drafts(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_question_drafts_updated_at ON public.question_drafts(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_code_executions_user_id ON public.code_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_code_executions_question_id ON public.code_executions(question_id);
CREATE INDEX IF NOT EXISTS idx_code_executions_user_q ON public.code_executions(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_code_executions_created_at ON public.code_executions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_question_id ON public.submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_submissions_attempt_id ON public.submissions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON public.submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_user_q ON public.submissions(user_id, question_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_q_progress_user ON public.user_question_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_q_progress_question ON public.user_question_progress(question_id);
CREATE INDEX IF NOT EXISTS idx_user_q_progress_status ON public.user_question_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_q_progress_user_q ON public.user_question_progress(user_id, question_id);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_question_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Question Attempts Policies
DROP POLICY IF EXISTS "Users and admins can view attempts" ON public.question_attempts;
CREATE POLICY "Users and admins can view attempts"
  ON public.question_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert attempts" ON public.question_attempts;
CREATE POLICY "Users can insert attempts"
  ON public.question_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users and admins can update attempts" ON public.question_attempts;
CREATE POLICY "Users and admins can update attempts"
  ON public.question_attempts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 2. Question Drafts Policies
DROP POLICY IF EXISTS "Users can view own drafts" ON public.question_drafts;
CREATE POLICY "Users can view own drafts"
  ON public.question_drafts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert own drafts" ON public.question_drafts;
CREATE POLICY "Users can insert own drafts"
  ON public.question_drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own drafts" ON public.question_drafts;
CREATE POLICY "Users can update own drafts"
  ON public.question_drafts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own drafts" ON public.question_drafts;
CREATE POLICY "Users can delete own drafts"
  ON public.question_drafts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Code Executions Policies
DROP POLICY IF EXISTS "Users and admins can view code executions" ON public.code_executions;
CREATE POLICY "Users and admins can view code executions"
  ON public.code_executions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert code executions" ON public.code_executions;
CREATE POLICY "Users can insert code executions"
  ON public.code_executions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 4. Submissions Policies
DROP POLICY IF EXISTS "Users and admins can view submissions" ON public.submissions;
CREATE POLICY "Users and admins can view submissions"
  ON public.submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert submissions" ON public.submissions;
CREATE POLICY "Users can insert submissions"
  ON public.submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 5. User Question Progress Policies
DROP POLICY IF EXISTS "Users and admins can view question progress" ON public.user_question_progress;
CREATE POLICY "Users and admins can view question progress"
  ON public.user_question_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users and admins can manage question progress" ON public.user_question_progress;
CREATE POLICY "Users and admins can manage question progress"
  ON public.user_question_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- 6. Activity Logs Policies
DROP POLICY IF EXISTS "Users and admins can view activity logs" ON public.activity_logs;
CREATE POLICY "Users and admins can view activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert activity logs" ON public.activity_logs;
CREATE POLICY "Users can insert activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
