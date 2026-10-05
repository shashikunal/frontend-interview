-- ==============================================================================
-- Migration: Unified Assessment Engine
-- Date: 2026-10-05
-- Description: Creates the common assessment engine tables that power
--              Frontend, Machine Coding, DSA/LeetCode, and Core Programming
--              assessments. Includes assessments, question assignments,
--              candidate assignments, attempts, answers, results, and audit.
-- ==============================================================================

-- 1. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  assessment_type TEXT NOT NULL DEFAULT 'frontend',
  instructions TEXT DEFAULT '',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  passing_marks NUMERIC DEFAULT 0,
  total_marks NUMERIC DEFAULT 0,
  maximum_attempts INTEGER NOT NULL DEFAULT 1,
  proctoring_config_id TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  question_order TEXT NOT NULL DEFAULT 'fixed',
  randomize_questions BOOLEAN NOT NULL DEFAULT FALSE,
  allow_late_start BOOLEAN NOT NULL DEFAULT FALSE,
  late_start_grace_minutes INTEGER DEFAULT 0,
  negative_marking_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  negative_marks_per_wrong NUMERIC DEFAULT 0,
  result_release_policy TEXT NOT NULL DEFAULT 'after_submission',
  show_score BOOLEAN NOT NULL DEFAULT TRUE,
  show_percentage BOOLEAN NOT NULL DEFAULT TRUE,
  show_pass_fail BOOLEAN NOT NULL DEFAULT TRUE,
  show_correct_answers BOOLEAN NOT NULL DEFAULT FALSE,
  show_explanations BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_assessments_status ON public.assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON public.assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_created_by ON public.assessments(created_by);
CREATE INDEX IF NOT EXISTS idx_assessments_start_at ON public.assessments(start_at);
CREATE INDEX IF NOT EXISTS idx_assessments_end_at ON public.assessments(end_at);

-- 2. Assessment Questions Table
CREATE TABLE IF NOT EXISTS public.assessment_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_version INTEGER NOT NULL DEFAULT 1,
  question_snapshot JSONB NOT NULL DEFAULT '{}',
  marks NUMERIC NOT NULL DEFAULT 1,
  question_order INTEGER NOT NULL DEFAULT 0,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(assessment_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_aq_assessment ON public.assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aq_question ON public.assessment_questions(question_id);
CREATE INDEX IF NOT EXISTS idx_aq_order ON public.assessment_questions(assessment_id, question_order);

-- 3. Assessment Candidate Assignments Table
CREATE TABLE IF NOT EXISTS public.assessment_candidate_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT NOT NULL DEFAULT 'assigned',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(assessment_id, candidate_id)
);

CREATE INDEX IF NOT EXISTS idx_aca_assessment ON public.assessment_candidate_assignments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aca_candidate ON public.assessment_candidate_assignments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_aca_status ON public.assessment_candidate_assignments(status);

-- 4. Assessment Attempts Table
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'NOT_STARTED',
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  total_marks NUMERIC DEFAULT 0,
  obtained_marks NUMERIC DEFAULT 0,
  percentage NUMERIC DEFAULT 0,
  result TEXT,
  previous_expiry TIMESTAMPTZ,
  extension_minutes INTEGER DEFAULT 0,
  extension_reason TEXT,
  extended_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  extended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(assessment_id, candidate_id, attempt_number)
);

CREATE INDEX IF NOT EXISTS idx_aa_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aa_candidate ON public.assessment_attempts(candidate_id);
CREATE INDEX IF NOT EXISTS idx_aa_status ON public.assessment_attempts(status);
CREATE INDEX IF NOT EXISTS idx_aa_expires ON public.assessment_attempts(expires_at);
CREATE INDEX IF NOT EXISTS idx_aa_candidate_assessment ON public.assessment_attempts(candidate_id, assessment_id);

-- 5. Attempt Questions Table (per-question state within an attempt)
CREATE TABLE IF NOT EXISTS public.attempt_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  assessment_question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_order INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'not_answered',
  marked_for_review BOOLEAN NOT NULL DEFAULT FALSE,
  first_viewed_at TIMESTAMPTZ,
  first_answered_at TIMESTAMPTZ,
  last_saved_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(attempt_id, assessment_question_id)
);

CREATE INDEX IF NOT EXISTS idx_atq_attempt ON public.attempt_questions(attempt_id);
CREATE INDEX IF NOT EXISTS idx_atq_status ON public.attempt_questions(status);
CREATE INDEX IF NOT EXISTS idx_atq_review ON public.attempt_questions(marked_for_review);

-- 6. Attempt Answers Table
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  attempt_question_id UUID NOT NULL REFERENCES public.attempt_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  selected_options JSONB DEFAULT '[]',
  code TEXT,
  language TEXT DEFAULT 'javascript',
  test_status TEXT,
  score NUMERIC DEFAULT 0,
  is_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(attempt_id, attempt_question_id)
);

CREATE INDEX IF NOT EXISTS idx_ata_attempt ON public.attempt_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_ata_question ON public.attempt_answers(attempt_question_id);

-- 7. Assessment Results Table
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_marks NUMERIC NOT NULL DEFAULT 0,
  obtained_marks NUMERIC NOT NULL DEFAULT 0,
  percentage NUMERIC NOT NULL DEFAULT 0,
  result TEXT NOT NULL DEFAULT 'FAIL',
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  time_used_seconds INTEGER DEFAULT 0,
  evaluated_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  released_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(attempt_id)
);

CREATE INDEX IF NOT EXISTS idx_ar_attempt ON public.assessment_results(attempt_id);
CREATE INDEX IF NOT EXISTS idx_ar_candidate ON public.assessment_results(candidate_id);
CREATE INDEX IF NOT EXISTS idx_ar_assessment ON public.assessment_results(assessment_id);

-- 8. Assessment Audit Logs Table
CREATE TABLE IF NOT EXISTS public.assessment_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES public.assessment_attempts(id) ON DELETE SET NULL,
  candidate_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_aal_assessment ON public.assessment_audit_logs(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aal_attempt ON public.assessment_audit_logs(attempt_id);
CREATE INDEX IF NOT EXISTS idx_aal_candidate ON public.assessment_audit_logs(candidate_id);
CREATE INDEX IF NOT EXISTS idx_aal_action ON public.assessment_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_aal_created ON public.assessment_audit_logs(created_at DESC);

-- 9. Assessment Question Audit Table (question-level timeline)
CREATE TABLE IF NOT EXISTS public.assessment_question_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES public.assessment_attempts(id) ON DELETE CASCADE,
  attempt_question_id UUID NOT NULL REFERENCES public.attempt_questions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_aqa_attempt ON public.assessment_question_audit(attempt_id);
CREATE INDEX IF NOT EXISTS idx_aqa_question ON public.assessment_question_audit(attempt_question_id);
CREATE INDEX IF NOT EXISTS idx_aqa_event ON public.assessment_question_audit(event_type);
CREATE INDEX IF NOT EXISTS idx_aqa_created ON public.assessment_question_audit(created_at DESC);

-- ==============================================================================
-- RLS Policies
-- ==============================================================================

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_candidate_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_question_audit ENABLE ROW LEVEL SECURITY;

-- Assessments: candidates see published/active, admins see all
CREATE POLICY "assessments_select" ON public.assessments FOR SELECT
  TO authenticated
  USING (status IN ('PUBLISHED', 'ACTIVE', 'COMPLETED') OR public.is_admin());

CREATE POLICY "assessments_admin_write" ON public.assessments FOR ALL
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Assessment Questions: visible if assessment is visible
CREATE POLICY "aq_select" ON public.assessment_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessments a
      WHERE a.id = assessment_id
      AND (a.status IN ('PUBLISHED', 'ACTIVE', 'COMPLETED') OR public.is_admin())
    )
  );

CREATE POLICY "aq_admin_write" ON public.assessment_questions FOR ALL
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Candidate Assignments: candidates see own, admins see all
CREATE POLICY "aca_select" ON public.assessment_candidate_assignments FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid() OR public.is_admin());

CREATE POLICY "aca_admin_write" ON public.assessment_candidate_assignments FOR ALL
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Attempts: candidates see own, admins see all
CREATE POLICY "aa_select" ON public.assessment_attempts FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid() OR public.is_admin());

CREATE POLICY "aa_insert" ON public.assessment_attempts FOR INSERT
  TO authenticated
  WITH CHECK (candidate_id = auth.uid());

CREATE POLICY "aa_update" ON public.assessment_attempts FOR UPDATE
  TO authenticated
  USING (candidate_id = auth.uid() OR public.is_admin())
  WITH CHECK (candidate_id = auth.uid() OR public.is_admin());

-- Attempt Questions: visible via attempt
CREATE POLICY "atq_select" ON public.attempt_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "atq_write" ON public.attempt_questions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  );

-- Attempt Answers: visible via attempt
CREATE POLICY "ata_select" ON public.attempt_answers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "ata_write" ON public.attempt_answers FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  );

-- Results: candidates see own released results, admins see all
CREATE POLICY "ar_select" ON public.assessment_results FOR SELECT
  TO authenticated
  USING (
    candidate_id = auth.uid() OR public.is_admin() OR released_at IS NOT NULL
  );

CREATE POLICY "ar_admin_write" ON public.assessment_results FOR ALL
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Audit Logs: admins see all, candidates see own
CREATE POLICY "aal_select" ON public.assessment_audit_logs FOR SELECT
  TO authenticated
  USING (candidate_id = auth.uid() OR public.is_admin());

CREATE POLICY "aal_admin_write" ON public.assessment_audit_logs FOR ALL
  TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Question Audit: visible via attempt
CREATE POLICY "aqa_select" ON public.assessment_question_audit FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  );

CREATE POLICY "aqa_write" ON public.assessment_question_audit FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.assessment_attempts a
      WHERE a.id = attempt_id
      AND (a.candidate_id = auth.uid() OR public.is_admin())
    )
  );

-- ==============================================================================
-- Triggers
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_assessment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_assessments_updated_at ON public.assessments;
CREATE TRIGGER trg_assessments_updated_at
  BEFORE UPDATE ON public.assessments
  FOR EACH ROW EXECUTE FUNCTION public.handle_assessment_updated_at();

DROP TRIGGER IF EXISTS trg_assessment_attempts_updated_at ON public.assessment_attempts;
CREATE TRIGGER trg_assessment_attempts_updated_at
  BEFORE UPDATE ON public.assessment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.handle_assessment_updated_at();

DROP TRIGGER IF EXISTS trg_attempt_questions_updated_at ON public.attempt_questions;
CREATE TRIGGER trg_attempt_questions_updated_at
  BEFORE UPDATE ON public.attempt_questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_assessment_updated_at();

DROP TRIGGER IF EXISTS trg_attempt_answers_updated_at ON public.attempt_answers;
CREATE TRIGGER trg_attempt_answers_updated_at
  BEFORE UPDATE ON public.attempt_answers
  FOR EACH ROW EXECUTE FUNCTION public.handle_assessment_updated_at();

-- ==============================================================================
-- Secure Functions
-- ==============================================================================

DROP FUNCTION IF EXISTS public.assessment_log_audit(UUID, UUID, UUID, TEXT, JSONB);
CREATE OR REPLACE FUNCTION public.assessment_log_audit(
  p_assessment_id UUID,
  p_action TEXT,
  p_attempt_id UUID DEFAULT NULL,
  p_candidate_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.assessment_audit_logs (assessment_id, attempt_id, candidate_id, actor_id, action, details)
  VALUES (p_assessment_id, p_attempt_id, p_candidate_id, auth.uid(), p_action, p_details)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.assessment_log_audit(UUID, TEXT, UUID, UUID, JSONB) TO authenticated;
