-- ==============================================================================
-- Migration: Core Programming & DSA Tables and Row-Level Security
-- Date: 2026-09-11
-- Description:
--   Ensures dedicated tables for core_programming_submissions, core_programming_progress,
--   dsa_submissions, and dsa_progress exist in Supabase with production RLS policies.
-- ==============================================================================

-- 1. core_programming_submissions table
CREATE TABLE IF NOT EXISTS public.core_programming_submissions (
  id TEXT PRIMARY KEY DEFAULT ('cp_sub_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'wrong_answer', -- 'accepted', 'wrong_answer', 'runtime_error', 'time_limit'
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
    USING (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own core programming submissions" ON public.core_programming_submissions;
  CREATE POLICY "Users can insert own core programming submissions"
    ON public.core_programming_submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION WHEN others THEN null; END $$;

-- 2. core_programming_progress table
CREATE TABLE IF NOT EXISTS public.core_programming_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  solved_question_ids TEXT[] DEFAULT '{}',
  attempted_question_ids TEXT[] DEFAULT '{}',
  total_score NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.core_programming_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own core programming progress" ON public.core_programming_progress;
  CREATE POLICY "Users can read own core programming progress"
    ON public.core_programming_progress FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can upsert own core programming progress" ON public.core_programming_progress;
  CREATE POLICY "Users can upsert own core programming progress"
    ON public.core_programming_progress FOR ALL
    USING (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
    WITH CHECK (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION WHEN others THEN null; END $$;

-- 3. dsa_submissions table
CREATE TABLE IF NOT EXISTS public.dsa_submissions (
  id TEXT PRIMARY KEY DEFAULT ('dsa_sub_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'wrong_answer',
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  runtime_ms NUMERIC DEFAULT 0,
  score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dsa_sub_user_id ON public.dsa_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_dsa_sub_qid ON public.dsa_submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_dsa_sub_created ON public.dsa_submissions(created_at DESC);

ALTER TABLE public.dsa_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can read own dsa submissions" ON public.dsa_submissions;
  CREATE POLICY "Users can read own dsa submissions"
    ON public.dsa_submissions FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can insert own dsa submissions" ON public.dsa_submissions;
  CREATE POLICY "Users can insert own dsa submissions"
    ON public.dsa_submissions FOR INSERT
    WITH CHECK (auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION WHEN others THEN null; END $$;
