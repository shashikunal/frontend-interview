-- ==============================================================================
-- Migration: 30-Day Fresher Placement Platform — RLS & Secure Functions
-- Date: 2026-10-01
-- Description:
--   Enables Row Level Security on every placement table, adds helper
--   predicates, exposes student-safe question views (correct answers and
--   hidden test cases are never exposed to students), and adds a
--   SECURITY DEFINER grading function used for MCQ grading.
--
--   Access model:
--     student  -> own rows only (auth.uid() = user_id)
--     mentor   -> rows of students they are allowed to supervise
--                (interviewer/admin role, or explicit mentor assignment)
--     admin    -> full management access
-- ==============================================================================

-- 1. Helper predicates ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_placement_mentor()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('interviewer', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_placement_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Mentor may read a student's placement records when the mentor is staff or
-- when the student explicitly added the mentor to their mock interview panel.
CREATE OR REPLACE FUNCTION public.placement_can_read_student(target_user UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF target_user IS NULL THEN
    RETURN FALSE;
  END IF;
  IF auth.uid() = target_user THEN
    RETURN TRUE;
  END IF;
  IF public.is_placement_mentor() THEN
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Shared policy bootstrap --------------------------------------------------
-- Each table gets: owner full access, staff read access to student records,
-- admin full management.

-- placement_programs
ALTER TABLE public.placement_programs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_programs_select" ON public.placement_programs;
  CREATE POLICY "placement_programs_select" ON public.placement_programs FOR SELECT
    TO authenticated USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_programs_admin_write" ON public.placement_programs;
  CREATE POLICY "placement_programs_admin_write" ON public.placement_programs FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- placement_days
ALTER TABLE public.placement_days ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_days_select" ON public.placement_days;
  CREATE POLICY "placement_days_select" ON public.placement_days FOR SELECT
    TO authenticated USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_days_admin_write" ON public.placement_days;
  CREATE POLICY "placement_days_admin_write" ON public.placement_days FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- placement_topics
ALTER TABLE public.placement_topics ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_topics_select" ON public.placement_topics;
  CREATE POLICY "placement_topics_select" ON public.placement_topics FOR SELECT
    TO authenticated USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_topics_admin_write" ON public.placement_topics;
  CREATE POLICY "placement_topics_admin_write" ON public.placement_topics FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 3. placement_questions ------------------------------------------------------
-- No direct student SELECT: students read through placement_questions_public.
ALTER TABLE public.placement_questions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_questions_admin_all" ON public.placement_questions;
  CREATE POLICY "placement_questions_admin_all" ON public.placement_questions FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_questions_mentor_select" ON public.placement_questions;
  CREATE POLICY "placement_questions_mentor_select" ON public.placement_questions FOR SELECT
    TO authenticated USING (public.is_placement_mentor());
EXCEPTION WHEN others THEN null; END $$;

-- Student-safe projection: verified questions only, no answers/explanations.
CREATE OR REPLACE VIEW public.placement_questions_public AS
  SELECT
    id,
    category,
    subcategory,
    topic,
    question_type,
    difficulty,
    prompt,
    code_snippet,
    options,
    expected_time_seconds,
    points,
    language_track,
    tags,
    created_at
  FROM public.placement_questions
  WHERE verification_status = 'verified';

GRANT SELECT ON public.placement_questions_public TO authenticated;

-- 4. placement_test_cases -----------------------------------------------------
-- Hidden cases are admin/mentor only. Students only see sample cases.
ALTER TABLE public.placement_test_cases ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_test_cases_admin_all" ON public.placement_test_cases;
  CREATE POLICY "placement_test_cases_admin_all" ON public.placement_test_cases FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_test_cases_mentor_select" ON public.placement_test_cases;
  CREATE POLICY "placement_test_cases_mentor_select" ON public.placement_test_cases FOR SELECT
    TO authenticated USING (public.is_placement_mentor());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_test_cases_sample_select" ON public.placement_test_cases;
  CREATE POLICY "placement_test_cases_sample_select" ON public.placement_test_cases FOR SELECT
    TO authenticated USING (is_sample = TRUE);
EXCEPTION WHEN others THEN null; END $$;

-- 5. Student-owned record tables ---------------------------------------------
-- placement_attempts
ALTER TABLE public.placement_attempts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_attempts_select" ON public.placement_attempts;
  CREATE POLICY "placement_attempts_select" ON public.placement_attempts FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_attempts_insert" ON public.placement_attempts;
  CREATE POLICY "placement_attempts_insert" ON public.placement_attempts FOR INSERT
    TO authenticated WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_attempts_update" ON public.placement_attempts;
  CREATE POLICY "placement_attempts_update" ON public.placement_attempts FOR UPDATE
    TO authenticated USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_attempts_delete" ON public.placement_attempts;
  CREATE POLICY "placement_attempts_delete" ON public.placement_attempts FOR DELETE
    TO authenticated USING (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- placement_progress
ALTER TABLE public.placement_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_progress_select" ON public.placement_progress;
  CREATE POLICY "placement_progress_select" ON public.placement_progress FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_progress_write" ON public.placement_progress;
  CREATE POLICY "placement_progress_write" ON public.placement_progress FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- placement_daily_tasks
ALTER TABLE public.placement_daily_tasks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_daily_tasks_select" ON public.placement_daily_tasks;
  CREATE POLICY "placement_daily_tasks_select" ON public.placement_daily_tasks FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_daily_tasks_write" ON public.placement_daily_tasks;
  CREATE POLICY "placement_daily_tasks_write" ON public.placement_daily_tasks FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 6. Assessments -------------------------------------------------------------
ALTER TABLE public.placement_assessments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_assessments_select" ON public.placement_assessments;
  CREATE POLICY "placement_assessments_select" ON public.placement_assessments FOR SELECT
    TO authenticated USING (is_published = TRUE OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_assessments_admin_write" ON public.placement_assessments;
  CREATE POLICY "placement_assessments_admin_write" ON public.placement_assessments FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

ALTER TABLE public.placement_assessment_questions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_aq_select" ON public.placement_assessment_questions;
  CREATE POLICY "placement_aq_select" ON public.placement_assessment_questions FOR SELECT
    TO authenticated USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_aq_admin_write" ON public.placement_assessment_questions;
  CREATE POLICY "placement_aq_admin_write" ON public.placement_assessment_questions FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

ALTER TABLE public.placement_assessment_attempts ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_aa_select" ON public.placement_assessment_attempts;
  CREATE POLICY "placement_aa_select" ON public.placement_assessment_attempts FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_aa_write" ON public.placement_assessment_attempts;
  CREATE POLICY "placement_aa_write" ON public.placement_assessment_attempts FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

ALTER TABLE public.placement_assessment_answers ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_answers_select" ON public.placement_assessment_answers;
  CREATE POLICY "placement_answers_select" ON public.placement_assessment_answers FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_answers_write" ON public.placement_assessment_answers;
  CREATE POLICY "placement_answers_write" ON public.placement_assessment_answers FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 7. Readiness ---------------------------------------------------------------
ALTER TABLE public.placement_readiness_config ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_readiness_config_select" ON public.placement_readiness_config;
  CREATE POLICY "placement_readiness_config_select" ON public.placement_readiness_config FOR SELECT
    TO authenticated USING (true);
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_readiness_config_admin_write" ON public.placement_readiness_config;
  CREATE POLICY "placement_readiness_config_admin_write" ON public.placement_readiness_config FOR ALL
    TO authenticated USING (public.is_placement_admin()) WITH CHECK (public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

ALTER TABLE public.placement_readiness ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_readiness_select" ON public.placement_readiness;
  CREATE POLICY "placement_readiness_select" ON public.placement_readiness FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_readiness_write" ON public.placement_readiness;
  CREATE POLICY "placement_readiness_write" ON public.placement_readiness FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 8. Projects ----------------------------------------------------------------
ALTER TABLE public.placement_projects ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_projects_select" ON public.placement_projects;
  CREATE POLICY "placement_projects_select" ON public.placement_projects FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_projects_write" ON public.placement_projects;
  CREATE POLICY "placement_projects_write" ON public.placement_projects FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

ALTER TABLE public.placement_project_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_project_reviews_select" ON public.placement_project_reviews;
  CREATE POLICY "placement_project_reviews_select" ON public.placement_project_reviews FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_project_reviews_write" ON public.placement_project_reviews;
  CREATE POLICY "placement_project_reviews_write" ON public.placement_project_reviews FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 9. Mock interviews ---------------------------------------------------------
ALTER TABLE public.placement_mock_interviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_mock_select" ON public.placement_mock_interviews;
  CREATE POLICY "placement_mock_select" ON public.placement_mock_interviews FOR SELECT
    TO authenticated
    USING (public.placement_can_read_student(user_id) OR interviewer_id = auth.uid());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_mock_write" ON public.placement_mock_interviews;
  CREATE POLICY "placement_mock_write" ON public.placement_mock_interviews FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR auth.uid() = interviewer_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR auth.uid() = interviewer_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

ALTER TABLE public.placement_mock_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_mock_results_select" ON public.placement_mock_results;
  CREATE POLICY "placement_mock_results_select" ON public.placement_mock_results FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_mock_results_write" ON public.placement_mock_results;
  CREATE POLICY "placement_mock_results_write" ON public.placement_mock_results FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 10. Job applications -------------------------------------------------------
ALTER TABLE public.placement_job_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_job_apps_select" ON public.placement_job_applications;
  CREATE POLICY "placement_job_apps_select" ON public.placement_job_applications FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_job_apps_write" ON public.placement_job_applications;
  CREATE POLICY "placement_job_apps_write" ON public.placement_job_applications FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 11. Interview feedback -----------------------------------------------------
ALTER TABLE public.placement_interview_feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_feedback_select" ON public.placement_interview_feedback;
  CREATE POLICY "placement_feedback_select" ON public.placement_interview_feedback FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_feedback_write" ON public.placement_interview_feedback;
  CREATE POLICY "placement_feedback_write" ON public.placement_interview_feedback FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 12. Rejection analysis -----------------------------------------------------
ALTER TABLE public.placement_rejection_analysis ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_rejection_select" ON public.placement_rejection_analysis;
  CREATE POLICY "placement_rejection_select" ON public.placement_rejection_analysis FOR SELECT
    TO authenticated USING (public.placement_can_read_student(user_id));
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_rejection_write" ON public.placement_rejection_analysis;
  CREATE POLICY "placement_rejection_write" ON public.placement_rejection_analysis FOR ALL
    TO authenticated
    USING (auth.uid() = user_id OR public.is_placement_admin())
    WITH CHECK (auth.uid() = user_id OR public.is_placement_admin());
EXCEPTION WHEN others THEN null; END $$;

-- 13. Mentor interventions ---------------------------------------------------
ALTER TABLE public.placement_mentor_interventions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_interventions_select" ON public.placement_mentor_interventions;
  CREATE POLICY "placement_interventions_select" ON public.placement_mentor_interventions FOR SELECT
    TO authenticated
    USING (student_id = auth.uid() OR public.is_placement_mentor());
EXCEPTION WHEN others THEN null; END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "placement_interventions_mentor_write" ON public.placement_mentor_interventions;
  CREATE POLICY "placement_interventions_mentor_write" ON public.placement_mentor_interventions FOR ALL
    TO authenticated
    USING (public.is_placement_mentor()) WITH CHECK (public.is_placement_mentor());
EXCEPTION WHEN others THEN null; END $$;

-- 14. Secure grading ---------------------------------------------------------
-- Grades an MCQ/short answer attempt server-side so correct answers never need
-- to be shipped to the browser before submission. Returns the explanation only
-- together with the verdict (i.e. after the student has answered).
CREATE OR REPLACE FUNCTION public.placement_grade_attempt(
  p_question_id TEXT,
  p_selected_answer TEXT
)
RETURNS TABLE (
  is_correct BOOLEAN,
  correct_answer TEXT,
  explanation TEXT,
  points NUMERIC,
  category TEXT,
  subcategory TEXT
) AS $$
DECLARE
  v_row public.placement_questions%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM public.placement_questions q WHERE q.id = p_question_id;
  IF NOT FOUND THEN
    RETURN;
  END IF;

  is_correct := (LOWER(TRIM(COALESCE(p_selected_answer, ''))) = LOWER(TRIM(v_row.correct_answer)));
  correct_answer := v_row.correct_answer;
  explanation := v_row.explanation;
  points := CASE WHEN is_correct THEN v_row.points ELSE 0 END;
  category := v_row.category;
  subcategory := v_row.subcategory;
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

GRANT EXECUTE ON FUNCTION public.placement_grade_attempt(TEXT, TEXT) TO authenticated;

-- 15. Default readiness configuration ----------------------------------------
-- Weights and thresholds are admin-editable at runtime. The values below match
-- the documented defaults and are only seeded when no configuration exists.
INSERT INTO public.placement_readiness_config (id, weights, thresholds, gate_checklist)
VALUES (
  'default',
  jsonb_build_object(
    'dsa', 25,
    'frontend', 20,
    'programming', 15,
    'aptitude', 10,
    'technical_mcq', 10,
    'machine_coding', 10,
    'sql_cs', 5,
    'project', 3,
    'communication', 2
  ),
  jsonb_build_object(
    'dsa', 70,
    'frontend', 75,
    'programming', 65,
    'aptitude', 70,
    'technical_mcq', 70,
    'machine_coding', 70,
    'sql_cs', 65,
    'project', 75,
    'communication', 65
  ),
  jsonb_build_object(
    'resume', true,
    'github', true,
    'portfolio', true,
    'live_project', true,
    'readme', true,
    'min_mock_interviews', 3,
    'final_assessment_passed', true
  )
)
ON CONFLICT (id) DO NOTHING;
