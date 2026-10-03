-- =============================================================================
-- custom_mc_questions — admin-authored question bank.
--
-- Context: src/lib/questionManagementService.ts already reads and writes this
-- table (AdminQuestionsTab -> AdminQuestionFormModal -> create/update), but no
-- CREATE TABLE for it existed anywhere in the repo. Every admin upload was
-- silently failing and falling back to an in-memory array, so all uploaded
-- questions were lost on page reload.
--
-- This migration creates the table so admin-authored questions persist, and
-- exposes them to the student-facing /peer-room question picker.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.custom_mc_questions (
  -- questionManagementService.create() does not send an id, so the PK needs a
  -- server-side default.
  id TEXT PRIMARY KEY
    DEFAULT ('cq_' || substr(md5(random()::text || clock_timestamp()::text), 1, 16)),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'ReactJS',
  difficulty TEXT NOT NULL DEFAULT 'Medium'
    CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Senior')),
  time_estimate TEXT NOT NULL DEFAULT '20 mins',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '[]',
  interview_tips TEXT NOT NULL DEFAULT '[]',
  common_mistakes TEXT NOT NULL DEFAULT '[]',
  starter_code TEXT NOT NULL DEFAULT '',
  solution_code TEXT NOT NULL DEFAULT '',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- The service layer always filters/order by these columns.
CREATE INDEX IF NOT EXISTS idx_custom_mc_questions_live
  ON public.custom_mc_questions (is_deleted, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_custom_mc_questions_category
  ON public.custom_mc_questions (category, difficulty);

-- -----------------------------------------------------------------------------
-- Row Level Security
--
-- - Students (any authenticated user) may READ live questions. /peer-room is
--   already behind FeatureGuard, so authentication is required. solution_code is
--   intentionally readable here: the peer-room interviewer role renders hints
--   from these rows, mirroring how the feature worked with local data before.
-- - Writes are admin-only, matching the rest of the RBAC schema.
-- -----------------------------------------------------------------------------
ALTER TABLE public.custom_mc_questions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "custom_mc_questions_student_read" ON public.custom_mc_questions;
  CREATE POLICY "custom_mc_questions_student_read"
    ON public.custom_mc_questions FOR SELECT
    TO authenticated
    USING (is_deleted = false);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "custom_mc_questions_admin_all" ON public.custom_mc_questions;
  CREATE POLICY "custom_mc_questions_admin_all"
    ON public.custom_mc_questions FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
EXCEPTION WHEN others THEN null; END $$;

GRANT SELECT ON public.custom_mc_questions TO authenticated;
GRANT ALL ON public.custom_mc_questions TO authenticated;

-- -----------------------------------------------------------------------------
-- created_at / updated_at maintenance
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.touch_custom_mc_questions()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_custom_mc_questions_touch ON public.custom_mc_questions;
CREATE TRIGGER trg_custom_mc_questions_touch
  BEFORE UPDATE ON public.custom_mc_questions
  FOR EACH ROW EXECUTE FUNCTION public.touch_custom_mc_questions();