-- ==============================================================================
-- Migration: 30-Day Fresher Placement Platform — Schema
-- Date: 2026-10-01
-- Description:
--   Creates the placement program schema: 30-day curriculum projection,
--   question bank, attempts/progress, assessments, readiness scoring,
--   project defense, mock interviews, job application tracking, interview
--   feedback, rejection analysis and mentor interventions.
--
--   This migration is purely additive. No existing table is altered or dropped.
--
--   Content source of truth for curriculum wording lives in the frontend
--   (src/features/placement/data). The placement_days / placement_topics tables
--   are a synced projection so admins can manage and report on curriculum.
-- ==============================================================================

-- 1. Placement programs --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_programs (
  id TEXT PRIMARY KEY DEFAULT ('prog_' || gen_random_uuid()),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  duration_days INTEGER NOT NULL DEFAULT 30,
  target_roles TEXT[] DEFAULT '{}',
  target_regions TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_programs_status ON public.placement_programs(status);

-- 2. Placement days -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_days (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.placement_programs(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL CHECK (day_number BETWEEN 1 AND 365),
  phase TEXT NOT NULL,
  title TEXT NOT NULL,
  focus TEXT NOT NULL,
  description TEXT DEFAULT '',
  goals TEXT[] DEFAULT '{}',
  is_milestone BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT uq_placement_day_number UNIQUE (program_id, day_number)
);

CREATE INDEX IF NOT EXISTS idx_placement_days_program ON public.placement_days(program_id);
CREATE INDEX IF NOT EXISTS idx_placement_days_number ON public.placement_days(program_id, day_number);

-- 3. Placement topics ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_topics (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.placement_programs(id) ON DELETE CASCADE,
  day_id TEXT REFERENCES public.placement_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  description TEXT DEFAULT '',
  resource_route TEXT DEFAULT '',
  expected_minutes INTEGER DEFAULT 30,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_topics_day ON public.placement_topics(day_id);
CREATE INDEX IF NOT EXISTS idx_placement_topics_program ON public.placement_topics(program_id);
CREATE INDEX IF NOT EXISTS idx_placement_topics_category ON public.placement_topics(category);

-- 4. Placement question bank --------------------------------------------------
-- Student-facing reads go through the placement_questions_public view (see RLS
-- migration) so that correct answers and explanations are never exposed before
-- a question is graded.
CREATE TABLE IF NOT EXISTS public.placement_questions (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  topic TEXT DEFAULT '',
  question_type TEXT NOT NULL DEFAULT 'mcq'
    CHECK (question_type IN ('mcq', 'output', 'debugging', 'scenario', 'concept', 'coding', 'subjective')),
  difficulty TEXT NOT NULL DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'easy-medium', 'medium', 'hard')),
  prompt TEXT NOT NULL,
  code_snippet TEXT,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL DEFAULT '',
  expected_time_seconds INTEGER NOT NULL DEFAULT 60,
  points NUMERIC NOT NULL DEFAULT 1,
  language_track TEXT CHECK (language_track IN ('java', 'python', 'javascript', 'any')),
  verification_status TEXT NOT NULL DEFAULT 'verified'
    CHECK (verification_status IN ('verified', 'needs_review', 'incorrect', 'duplicate', 'archived')),
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_questions_category ON public.placement_questions(category);
CREATE INDEX IF NOT EXISTS idx_placement_questions_subcategory ON public.placement_questions(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_placement_questions_difficulty ON public.placement_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_placement_questions_type ON public.placement_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_placement_questions_verification ON public.placement_questions(verification_status);
CREATE INDEX IF NOT EXISTS idx_placement_questions_topic ON public.placement_questions(topic);

-- 5. Placement test cases (hidden cases for coding questions) -----------------
CREATE TABLE IF NOT EXISTS public.placement_test_cases (
  id TEXT PRIMARY KEY DEFAULT ('ptc_' || gen_random_uuid()),
  question_id TEXT NOT NULL REFERENCES public.placement_questions(id) ON DELETE CASCADE,
  input TEXT NOT NULL,
  expected_output TEXT NOT NULL,
  is_sample BOOLEAN NOT NULL DEFAULT FALSE,
  explanation TEXT DEFAULT '',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_test_cases_question ON public.placement_test_cases(question_id);
CREATE INDEX IF NOT EXISTS idx_placement_test_cases_sample ON public.placement_test_cases(question_id, is_sample);

-- 6. Placement attempts (per-question practice / interview-mode submissions) --
CREATE TABLE IF NOT EXISTS public.placement_attempts (
  id TEXT PRIMARY KEY DEFAULT ('pa_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES public.placement_programs(id) ON DELETE SET NULL,
  question_id TEXT REFERENCES public.placement_questions(id) ON DELETE SET NULL,
  day_id TEXT,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  mode TEXT NOT NULL DEFAULT 'practice'
    CHECK (mode IN ('practice', 'interview', 'assessment', 'daily', 'weakness')),
  selected_answer TEXT,
  submitted_code TEXT,
  language TEXT DEFAULT '',
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  score NUMERIC NOT NULL DEFAULT 0,
  max_score NUMERIC NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  attempts_count INTEGER NOT NULL DEFAULT 1,
  hints_used INTEGER NOT NULL DEFAULT 0,
  result_status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (result_status IN ('passed', 'failed', 'partial', 'submitted', 'timeout')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_attempts_user ON public.placement_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_user_category ON public.placement_attempts(user_id, category);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_user_created ON public.placement_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_question ON public.placement_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_program ON public.placement_attempts(program_id);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_mode ON public.placement_attempts(user_id, mode);

-- 7. Placement progress (per user per program) --------------------------------
CREATE TABLE IF NOT EXISTS public.placement_progress (
  id TEXT PRIMARY KEY DEFAULT ('pp_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES public.placement_programs(id) ON DELETE CASCADE,
  enrollment_status TEXT NOT NULL DEFAULT 'active'
    CHECK (enrollment_status IN ('active', 'paused', 'completed', 'placement_mode', 'withdrawn')),
  current_day INTEGER NOT NULL DEFAULT 1,
  days_completed INTEGER[] NOT NULL DEFAULT '{}',
  day_started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  total_questions_attempted INTEGER NOT NULL DEFAULT 0,
  total_questions_correct INTEGER NOT NULL DEFAULT 0,
  total_time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  weak_topics TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT uq_placement_progress_user_program UNIQUE (user_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_placement_progress_user ON public.placement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_progress_program ON public.placement_progress(program_id);
CREATE INDEX IF NOT EXISTS idx_placement_progress_status ON public.placement_progress(enrollment_status);

-- 8. Daily task completion ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_daily_tasks (
  id TEXT PRIMARY KEY DEFAULT ('pdt_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES public.placement_programs(id) ON DELETE CASCADE,
  day_id TEXT,
  day_number INTEGER NOT NULL,
  task_key TEXT NOT NULL,
  task_label TEXT NOT NULL,
  category TEXT NOT NULL,
  target_count INTEGER NOT NULL DEFAULT 1,
  completed_count INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT uq_placement_daily_task UNIQUE (user_id, program_id, day_number, task_key)
);

CREATE INDEX IF NOT EXISTS idx_placement_daily_tasks_user ON public.placement_daily_tasks(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_placement_daily_tasks_day ON public.placement_daily_tasks(user_id, day_id);

-- 9. Assessments (weekly + final) --------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_assessments (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL REFERENCES public.placement_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  assessment_type TEXT NOT NULL DEFAULT 'weekly'
    CHECK (assessment_type IN ('weekly', 'final', 'mock', 'screening', 'custom')),
  day_number INTEGER,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  question_count INTEGER NOT NULL DEFAULT 50,
  total_points NUMERIC NOT NULL DEFAULT 100,
  passing_score NUMERIC NOT NULL DEFAULT 60,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_assessments_program ON public.placement_assessments(program_id);
CREATE INDEX IF NOT EXISTS idx_placement_assessments_type ON public.placement_assessments(assessment_type);

-- 10. Assessment questions ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_assessment_questions (
  id TEXT PRIMARY KEY DEFAULT ('paq_' || gen_random_uuid()),
  assessment_id TEXT NOT NULL REFERENCES public.placement_assessments(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.placement_questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  points NUMERIC NOT NULL DEFAULT 1,
  CONSTRAINT uq_placement_assessment_question UNIQUE (assessment_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_placement_aq_assessment ON public.placement_assessment_questions(assessment_id);

-- 11. Assessment attempts -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_assessment_attempts (
  id TEXT PRIMARY KEY DEFAULT ('paa_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES public.placement_assessments(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES public.placement_programs(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'submitted', 'timed_out', 'abandoned')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  submitted_at TIMESTAMPTZ,
  duration_seconds INTEGER DEFAULT 0,
  score NUMERIC NOT NULL DEFAULT 0,
  max_score NUMERIC NOT NULL DEFAULT 100,
  percentage NUMERIC NOT NULL DEFAULT 0,
  correct_count INTEGER NOT NULL DEFAULT 0,
  wrong_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  weak_topics TEXT[] DEFAULT '{}',
  category_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_aa_user ON public.placement_assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_aa_assessment ON public.placement_assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_placement_aa_user_created ON public.placement_assessment_attempts(user_id, created_at DESC);

-- 12. Assessment answers ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_assessment_answers (
  id TEXT PRIMARY KEY DEFAULT ('pans_' || gen_random_uuid()),
  attempt_id TEXT NOT NULL REFERENCES public.placement_assessment_attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL REFERENCES public.placement_questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  submitted_code TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  points_awarded NUMERIC NOT NULL DEFAULT 0,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT uq_placement_answer UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_placement_answers_attempt ON public.placement_assessment_answers(attempt_id);
CREATE INDEX IF NOT EXISTS idx_placement_answers_user ON public.placement_assessment_answers(user_id);

-- 13. Readiness configuration (admin-managed weights + thresholds) ------------
CREATE TABLE IF NOT EXISTS public.placement_readiness_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  weights JSONB NOT NULL DEFAULT '{}'::jsonb,
  thresholds JSONB NOT NULL DEFAULT '{}'::jsonb,
  gate_checklist JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 14. Readiness snapshots -----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_readiness (
  id TEXT PRIMARY KEY DEFAULT ('pr_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL REFERENCES public.placement_programs(id) ON DELETE CASCADE,
  overall_score NUMERIC NOT NULL DEFAULT 0,
  category_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  weights_used JSONB NOT NULL DEFAULT '{}'::jsonb,
  thresholds_used JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_job_ready BOOLEAN NOT NULL DEFAULT FALSE,
  blocking_reasons TEXT[] DEFAULT '{}',
  checklist_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_readiness_user ON public.placement_readiness(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_readiness_program ON public.placement_readiness(program_id);
CREATE INDEX IF NOT EXISTS idx_placement_readiness_computed ON public.placement_readiness(computed_at DESC);

-- 15. Projects ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_projects (
  id TEXT PRIMARY KEY DEFAULT ('ppj_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES public.placement_programs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tech_stack TEXT[] DEFAULT '{}',
  repo_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  readme_url TEXT DEFAULT '',
  has_readme BOOLEAN NOT NULL DEFAULT FALSE,
  has_screenshots BOOLEAN NOT NULL DEFAULT FALSE,
  has_auth BOOLEAN NOT NULL DEFAULT FALSE,
  has_error_handling BOOLEAN NOT NULL DEFAULT FALSE,
  has_deployment BOOLEAN NOT NULL DEFAULT FALSE,
  architecture_notes TEXT DEFAULT '',
  api_notes TEXT DEFAULT '',
  database_notes TEXT DEFAULT '',
  deployment_notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'in_progress', 'ready_for_review', 'defended', 'needs_work')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_projects_user ON public.placement_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_projects_status ON public.placement_projects(status);

-- 16. Project reviews (defense) ----------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_project_reviews (
  id TEXT PRIMARY KEY DEFAULT ('ppr_' || gen_random_uuid()),
  project_id TEXT NOT NULL REFERENCES public.placement_projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  review_type TEXT NOT NULL DEFAULT 'self'
    CHECK (review_type IN ('self', 'peer', 'mentor', 'system')),
  score NUMERIC NOT NULL DEFAULT 0,
  max_score NUMERIC NOT NULL DEFAULT 100,
  clarity_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  architecture_score INTEGER DEFAULT 0,
  deployment_score INTEGER DEFAULT 0,
  communication_score INTEGER DEFAULT 0,
  questions_asked JSONB NOT NULL DEFAULT '[]'::jsonb,
  strengths TEXT DEFAULT '',
  improvements TEXT DEFAULT '',
  verdict TEXT NOT NULL DEFAULT 'pending'
    CHECK (verdict IN ('pending', 'pass', 'needs_work', 'fail')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_project_reviews_project ON public.placement_project_reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_placement_project_reviews_user ON public.placement_project_reviews(user_id);

-- 17. Mock interviews ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_mock_interviews (
  id TEXT PRIMARY KEY DEFAULT ('pmi_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id TEXT REFERENCES public.placement_programs(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  mock_type TEXT NOT NULL DEFAULT 'full'
    CHECK (mock_type IN ('full', 'dsa', 'frontend', 'machine_coding', 'project', 'communication', 'hr', 'language')),
  scheduled_at TIMESTAMPTZ,
  conducted_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  interviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interviewer_name TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_mock_user ON public.placement_mock_interviews(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_mock_status ON public.placement_mock_interviews(status);
CREATE INDEX IF NOT EXISTS idx_placement_mock_type ON public.placement_mock_interviews(mock_type);

-- 18. Mock results ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_mock_results (
  id TEXT PRIMARY KEY DEFAULT ('pmr_' || gen_random_uuid()),
  mock_id TEXT NOT NULL REFERENCES public.placement_mock_interviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  result TEXT NOT NULL DEFAULT 'pending'
    CHECK (result IN ('pending', 'strong_hire', 'hire', 'lean_hire', 'lean_no_hire', 'no_hire')),
  overall_score NUMERIC NOT NULL DEFAULT 0,
  area_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  strengths TEXT[] DEFAULT '{}',
  improvements TEXT[] DEFAULT '{}',
  questions_failed TEXT[] DEFAULT '{}',
  questions_passed TEXT[] DEFAULT '{}',
  feedback TEXT DEFAULT '',
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_mock_results_mock ON public.placement_mock_results(mock_id);
CREATE INDEX IF NOT EXISTS idx_placement_mock_results_user ON public.placement_mock_results(user_id);

-- 19. Job applications --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_job_applications (
  id TEXT PRIMARY KEY DEFAULT ('pja_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT DEFAULT '',
  job_url TEXT DEFAULT '',
  source TEXT DEFAULT '',
  applied_at DATE,
  status TEXT NOT NULL DEFAULT 'saved'
    CHECK (status IN ('saved', 'applied', 'online_assessment', 'shortlisted', 'technical_round', 'hr_round', 'selected', 'rejected', 'no_response', 'withdrawn')),
  interview_date TIMESTAMPTZ,
  current_round TEXT DEFAULT '',
  salary_range TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_apps_user ON public.placement_job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_apps_status ON public.placement_job_applications(status);
CREATE INDEX IF NOT EXISTS idx_placement_apps_user_status ON public.placement_job_applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_placement_apps_created ON public.placement_job_applications(created_at DESC);

-- 20. Interview feedback ------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_interview_feedback (
  id TEXT PRIMARY KEY DEFAULT ('pif_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id TEXT REFERENCES public.placement_job_applications(id) ON DELETE SET NULL,
  mock_id TEXT REFERENCES public.placement_mock_interviews(id) ON DELETE SET NULL,
  company TEXT DEFAULT '',
  role TEXT DEFAULT '',
  round TEXT NOT NULL DEFAULT '',
  interview_date TIMESTAMPTZ,
  questions_asked TEXT[] DEFAULT '{}',
  questions_failed TEXT[] DEFAULT '{}',
  questions_passed TEXT[] DEFAULT '{}',
  area_results JSONB NOT NULL DEFAULT '{}'::jsonb,
  result TEXT NOT NULL DEFAULT 'pending'
    CHECK (result IN ('pending', 'cleared', 'rejected', 'holding', 'withdrawn')),
  feedback TEXT DEFAULT '',
  recorded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_feedback_user ON public.placement_interview_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_feedback_application ON public.placement_interview_feedback(application_id);
CREATE INDEX IF NOT EXISTS idx_placement_feedback_result ON public.placement_interview_feedback(result);
CREATE INDEX IF NOT EXISTS idx_placement_feedback_created ON public.placement_interview_feedback(created_at DESC);

-- 21. Rejection analysis (derived from real interview results) ----------------
CREATE TABLE IF NOT EXISTS public.placement_rejection_analysis (
  id TEXT PRIMARY KEY DEFAULT ('pra_' || gen_random_uuid()),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_size INTEGER NOT NULL DEFAULT 5,
  analysis JSONB NOT NULL DEFAULT '{}'::jsonb,
  weak_topics TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  source_feedback_ids UUID[] DEFAULT '{}',
  computed_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_rejection_user ON public.placement_rejection_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_rejection_computed ON public.placement_rejection_analysis(computed_at DESC);

-- 22. Mentor interventions ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.placement_mentor_interventions (
  id TEXT PRIMARY KEY DEFAULT ('pmi_int_' || gen_random_uuid()),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status_label TEXT NOT NULL DEFAULT 'At Risk'
    CHECK (status_label IN ('At Risk', 'Needs Intervention', 'Improving', 'Almost Ready', 'Job Ready')),
  problem TEXT NOT NULL,
  evidence TEXT NOT NULL DEFAULT '',
  recommended_action TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  trigger_key TEXT DEFAULT '',
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

CREATE INDEX IF NOT EXISTS idx_placement_interventions_student ON public.placement_mentor_interventions(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_interventions_status ON public.placement_mentor_interventions(status_label);
CREATE INDEX IF NOT EXISTS idx_placement_interventions_resolved ON public.placement_mentor_interventions(resolved);
CREATE INDEX IF NOT EXISTS idx_placement_interventions_priority ON public.placement_mentor_interventions(priority);
