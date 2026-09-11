-- ==============================================================================
-- Migration: Repair missing track tables (apply in Supabase Dashboard > SQL Editor)
-- Date: 2026-09-12
-- Description:
--   Live project is missing public.core_programming_submissions,
--   public.frontend_js_submissions and public.frontend_js_attempts
--   (schema-cache errors), while the app already reads/writes them.
--   Canonical `submissions` remains the source of truth — these dedicated
--   tables are best-effort mirrors. This file is idempotent and safe to
--   re-run. It does NOT touch submissions, question_attempts, dsa_* tables.
-- ==============================================================================

-- 0. Helper (same as 20260906) so policies work even on fresh projects
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. core_programming_submissions (id TEXT so client `sub_xxx` ids fit)
CREATE TABLE IF NOT EXISTS public.core_programming_submissions (
  id TEXT PRIMARY KEY DEFAULT ('cp_sub_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'wrong_answer',
  score NUMERIC DEFAULT 0,
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  execution_time_ms NUMERIC DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cp_sub_user_id ON public.core_programming_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_cp_sub_qid ON public.core_programming_submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_cp_sub_created ON public.core_programming_submissions(created_at DESC);

ALTER TABLE public.core_programming_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own core programming submissions" ON public.core_programming_submissions;
  CREATE POLICY "Users can read own core programming submissions"
    ON public.core_programming_submissions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own core programming submissions" ON public.core_programming_submissions;
  CREATE POLICY "Users can insert own core programming submissions"
    ON public.core_programming_submissions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 2. frontend_js_submissions (id UUID, let DB default — never send `sub_xxx`)
CREATE TABLE IF NOT EXISTS public.frontend_js_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_version INTEGER DEFAULT 1 NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'wrong_answer' CHECK (status IN ('accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compile_error')),
  score INTEGER DEFAULT 0,
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  execution_time_ms NUMERIC DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  solution_viewed BOOLEAN DEFAULT false,
  time_spent_seconds INTEGER DEFAULT 0,
  idempotency_key TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fjs_sub_user_id ON public.frontend_js_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_question_id ON public.frontend_js_submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_status ON public.frontend_js_submissions(status);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_created_at ON public.frontend_js_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_idempotency ON public.frontend_js_submissions(idempotency_key);

ALTER TABLE public.frontend_js_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users view own frontend_js submissions" ON public.frontend_js_submissions;
  CREATE POLICY "Users view own frontend_js submissions"
    ON public.frontend_js_submissions FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users insert own frontend_js submissions" ON public.frontend_js_submissions;
  CREATE POLICY "Users insert own frontend_js submissions"
    ON public.frontend_js_submissions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 3. frontend_js_attempts (id UUID, let DB default — never send `att_xxx`)
CREATE TABLE IF NOT EXISTS public.frontend_js_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '',
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  runtime_ms NUMERIC DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fjs_att_user_id ON public.frontend_js_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_fjs_att_question_id ON public.frontend_js_attempts(question_id);

ALTER TABLE public.frontend_js_attempts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users view own frontend_js attempts" ON public.frontend_js_attempts;
  CREATE POLICY "Users view own frontend_js attempts"
    ON public.frontend_js_attempts FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id OR public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users insert own frontend_js attempts" ON public.frontend_js_attempts;
  CREATE POLICY "Users insert own frontend_js attempts"
    ON public.frontend_js_attempts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id OR public.is_admin());
EXCEPTION WHEN others THEN null; END $$;
