-- ==============================================================================
-- Migration: Hiring Evaluation & Candidate History System
-- Date: 2026-09-12
-- Description:
--   Creates tables for candidate hiring evaluations, evaluation history (audit trail),
--   and configures strict RLS to ensure students cannot access hiring notes or
--   evaluations, while administrators have full management access.
-- ==============================================================================

-- 1. Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Hiring Evaluations Table
CREATE TABLE IF NOT EXISTS public.hiring_evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Hire', 'Consider', 'Reject', 'Pending')),
  overall_rating NUMERIC NOT NULL DEFAULT 3 CHECK (overall_rating >= 1 AND overall_rating <= 5),
  rubric_problem_solving INTEGER CHECK (rubric_problem_solving BETWEEN 1 AND 5),
  rubric_code_quality INTEGER CHECK (rubric_code_quality BETWEEN 1 AND 5),
  rubric_communication INTEGER CHECK (rubric_communication BETWEEN 1 AND 5),
  rubric_architecture INTEGER CHECK (rubric_architecture BETWEEN 1 AND 5),
  recommendation TEXT,
  notes TEXT,
  strengths TEXT,
  weaknesses TEXT,
  final_comments TEXT,
  evaluated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  evaluated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT uq_candidate_hiring_evaluation UNIQUE (candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_hiring_eval_candidate ON public.hiring_evaluations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_hiring_eval_status ON public.hiring_evaluations(status);
CREATE INDEX IF NOT EXISTS idx_hiring_eval_evaluated_at ON public.hiring_evaluations(evaluated_at DESC);

-- Enable RLS
ALTER TABLE public.hiring_evaluations ENABLE ROW LEVEL SECURITY;

-- Admins can read hiring evaluations (Students CANNOT)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can view hiring evaluations" ON public.hiring_evaluations;
  CREATE POLICY "Admins can view hiring evaluations"
    ON public.hiring_evaluations FOR SELECT
    TO authenticated
    USING (public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

-- Admins can insert hiring evaluations
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can insert hiring evaluations" ON public.hiring_evaluations;
  CREATE POLICY "Admins can insert hiring evaluations"
    ON public.hiring_evaluations FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

-- Admins can update hiring evaluations
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can update hiring evaluations" ON public.hiring_evaluations;
  CREATE POLICY "Admins can update hiring evaluations"
    ON public.hiring_evaluations FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 3. Hiring Evaluation History (Audit trail of decisions)
CREATE TABLE IF NOT EXISTS public.hiring_evaluation_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id UUID REFERENCES public.hiring_evaluations(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  overall_rating NUMERIC NOT NULL,
  notes TEXT,
  recommendation TEXT,
  evaluated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_hiring_hist_candidate ON public.hiring_evaluation_history(candidate_id);
CREATE INDEX IF NOT EXISTS idx_hiring_hist_created ON public.hiring_evaluation_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.hiring_evaluation_history ENABLE ROW LEVEL SECURITY;

-- Admins can read evaluation history
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can view hiring history" ON public.hiring_evaluation_history;
  CREATE POLICY "Admins can view hiring history"
    ON public.hiring_evaluation_history FOR SELECT
    TO authenticated
    USING (public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

-- Admins can insert evaluation history
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can insert hiring history" ON public.hiring_evaluation_history;
  CREATE POLICY "Admins can insert hiring history"
    ON public.hiring_evaluation_history FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());
EXCEPTION WHEN others THEN null; END $$;
