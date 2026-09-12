-- ==============================================================================
-- AI VIDEO MOCK INTERVIEW PLATFORM - SUPABASE SCHEMA MIGRATION
-- Migration Date: 2026-09-11
-- Description: Multi-track AI mock interview platform tables, session states,
-- evaluations, expected answer rubrics, recording metadata, and RLS policies.
-- ==============================================================================

-- 1. Mock Question Bank Table
CREATE TABLE IF NOT EXISTS mock_question_bank (
  id TEXT PRIMARY KEY,
  technology TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Basic', 'Intermediate', 'Advanced', 'Expert')),
  question TEXT NOT NULL,
  question_type TEXT NOT NULL,
  experience_levels TEXT[] NOT NULL,
  expected_concepts TEXT[] NOT NULL,
  ideal_answer_points TEXT[] NOT NULL,
  common_mistakes TEXT[] NOT NULL,
  follow_up_topics TEXT[] NOT NULL,
  estimated_time_minutes INT NOT NULL DEFAULT 5,
  tags TEXT[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (status IN ('DRAFT', 'VALIDATING', 'REVIEW', 'APPROVED', 'PUBLISHED', 'DEPRECATED')),
  quality_score NUMERIC(5,2) NOT NULL DEFAULT 95.00,
  review_status TEXT NOT NULL DEFAULT 'APPROVED' CHECK (review_status IN ('PENDING', 'APPROVED', 'REJECTED')),
  version INT NOT NULL DEFAULT 1,
  rubric JSONB NOT NULL DEFAULT '{}'::jsonb,
  programming_spec JSONB,
  machine_coding_spec JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mqb_tech ON mock_question_bank(technology);
CREATE INDEX IF NOT EXISTS idx_mqb_difficulty ON mock_question_bank(difficulty);
CREATE INDEX IF NOT EXISTS idx_mqb_status ON mock_question_bank(status);

-- 2. Mock Interview Sessions Table
CREATE TABLE IF NOT EXISTS mock_interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  state TEXT NOT NULL DEFAULT 'DRAFT' CHECK (state IN ('DRAFT', 'READY', 'IN_PROGRESS', 'PAUSED', 'SUBMITTING', 'EVALUATING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED')),
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  blueprint JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_question_index INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 5,
  integrity_signals JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_paused_seconds INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mis_user ON mock_interview_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mis_state ON mock_interview_sessions(state);
CREATE INDEX IF NOT EXISTS idx_mis_created ON mock_interview_sessions(created_at DESC);

-- 3. Mock Interview Answers Table
CREATE TABLE IF NOT EXISTS mock_interview_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_number INT NOT NULL,
  question_snapshot JSONB NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('speech', 'code', 'machine-coding')),
  status TEXT NOT NULL DEFAULT 'UNANSWERED' CHECK (status IN ('UNANSWERED', 'RECORDING', 'SUBMITTED', 'SKIPPED', 'EVALUATED')),
  raw_transcript TEXT,
  cleaned_transcript TEXT,
  transcript_confidence NUMERIC(4,3),
  transcript_provider TEXT,
  submitted_code TEXT,
  code_language TEXT,
  coding_test_results JSONB,
  video_metadata JSONB,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  dynamic_follow_up TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mia_session ON mock_interview_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_mia_user ON mock_interview_answers(user_id);

-- 4. Mock Answer Evaluations Table
CREATE TABLE IF NOT EXISTS mock_answer_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID NOT NULL REFERENCES mock_interview_answers(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  numeric_score NUMERIC(3,1) NOT NULL,
  letter_grade TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'High' CHECK (confidence IN ('High', 'Medium', 'Low')),
  confidence_reason TEXT,
  correct_concepts TEXT[] NOT NULL DEFAULT '{}',
  missing_concepts TEXT[] NOT NULL DEFAULT '{}',
  incorrect_concepts TEXT[] NOT NULL DEFAULT '{}',
  why_marks_lost TEXT[] NOT NULL DEFAULT '{}',
  positive_highlights TEXT[] NOT NULL DEFAULT '{}',
  experience_aware_feedback TEXT,
  improved_answer TEXT,
  rubric_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  self_correction_detected BOOLEAN NOT NULL DEFAULT FALSE,
  honest_i_dont_know BOOLEAN NOT NULL DEFAULT FALSE,
  model_info JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mae_answer ON mock_answer_evaluations(answer_id);
CREATE INDEX IF NOT EXISTS idx_mae_session ON mock_answer_evaluations(session_id);

-- 5. Mock Final Scorecards Table
CREATE TABLE IF NOT EXISTS mock_final_scorecards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID UNIQUE NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_score NUMERIC(3,1) NOT NULL,
  letter_grade TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'High',
  competency_pillars JSONB NOT NULL,
  seniority_assessment JSONB NOT NULL,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  weaknesses TEXT[] NOT NULL DEFAULT '{}',
  recurring_weaknesses JSONB NOT NULL DEFAULT '[]'::jsonb,
  critical_gaps TEXT[] NOT NULL DEFAULT '{}',
  communication_summary JSONB NOT NULL,
  learning_plan JSONB NOT NULL,
  target_role_readiness JSONB NOT NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mfs_user ON mock_final_scorecards(user_id);
CREATE INDEX IF NOT EXISTS idx_mfs_session ON mock_final_scorecards(session_id);

-- 6. Candidate Weaknesses Tracking Table
CREATE TABLE IF NOT EXISTS mock_candidate_weaknesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  technology TEXT NOT NULL,
  average_score NUMERIC(3,1) NOT NULL,
  occurrences INT NOT NULL DEFAULT 1,
  last_missed_concepts TEXT[] NOT NULL DEFAULT '{}',
  last_evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, topic, technology)
);

CREATE INDEX IF NOT EXISTS idx_mcw_user ON mock_candidate_weaknesses(user_id);

-- 7. Candidate Question Feedback Table
CREATE TABLE IF NOT EXISTS mock_question_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating TEXT NOT NULL CHECK (rating IN ('good', 'too_easy', 'too_difficult', 'ambiguous', 'incorrect', 'outdated', 'irrelevant')),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Evaluation Challenges Table
CREATE TABLE IF NOT EXISTS mock_evaluation_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id UUID NOT NULL REFERENCES mock_answer_evaluations(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES mock_interview_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'UPHELD', 'OVERRIDDEN')),
  admin_override_score NUMERIC(3,1),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- NOTE: every FOR ALL / INSERT policy carries an explicit WITH CHECK so
-- client inserts actually succeed; reads additionally allow platform admins.
-- Re-runnable: all policies are dropped before creation.
-- ==============================================================================
ALTER TABLE mock_question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_interview_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_answer_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_final_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_candidate_weaknesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_question_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_evaluation_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Question bank is readable by authenticated users and guests" ON mock_question_bank;
DROP POLICY IF EXISTS "Admins can manage the question bank" ON mock_question_bank;
DROP POLICY IF EXISTS "Users can manage own interview sessions" ON mock_interview_sessions;
DROP POLICY IF EXISTS "Users can manage own interview answers" ON mock_interview_answers;
DROP POLICY IF EXISTS "Users can view own answer evaluations" ON mock_answer_evaluations;
DROP POLICY IF EXISTS "Users can insert own answer evaluations" ON mock_answer_evaluations;
DROP POLICY IF EXISTS "Users can view own scorecards" ON mock_final_scorecards;
DROP POLICY IF EXISTS "Users can view own weaknesses" ON mock_candidate_weaknesses;
DROP POLICY IF EXISTS "Users can submit question feedback" ON mock_question_feedback;
DROP POLICY IF EXISTS "Admins can review question feedback" ON mock_question_feedback;
DROP POLICY IF EXISTS "Users can submit and view own evaluation challenges" ON mock_evaluation_challenges;
DROP POLICY IF EXISTS "Admins can review evaluation challenges" ON mock_evaluation_challenges;

-- Question Bank: Readable by everyone (including anon/candidates), manageable by admins
CREATE POLICY "Question bank is readable by authenticated users and guests"
  ON mock_question_bank FOR SELECT
  USING (true);

-- Question Bank: platform admins can insert/update/delete (update permission)
CREATE POLICY "Admins can manage the question bank"
  ON mock_question_bank FOR ALL
  USING (public.is_admin() OR auth.role() = 'service_role')
  WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

-- Sessions: Candidates manage own sessions (WITH CHECK so inserts work)
CREATE POLICY "Users can manage own interview sessions"
  ON mock_interview_sessions FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Answers: Candidates manage their own answers (WITH CHECK so inserts work)
CREATE POLICY "Users can manage own interview answers"
  ON mock_interview_answers FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Evaluations: Candidates view own; app inserts own evaluations (client-side rubric)
CREATE POLICY "Users can view own answer evaluations"
  ON mock_answer_evaluations FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role' OR public.is_admin());

CREATE POLICY "Users can insert own answer evaluations"
  ON mock_answer_evaluations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Scorecards: Candidates manage own scorecards (WITH CHECK so inserts work)
CREATE POLICY "Users can view own scorecards"
  ON mock_final_scorecards FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role' OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Weaknesses: Candidates manage own weaknesses (WITH CHECK so upserts work)
CREATE POLICY "Users can view own weaknesses"
  ON mock_candidate_weaknesses FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

-- Feedback: Authenticated users insert; admins review
CREATE POLICY "Users can submit question feedback"
  ON mock_question_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Admins can review question feedback"
  ON mock_question_feedback FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role' OR public.is_admin());

-- Challenges: Candidates manage own; admins review all
CREATE POLICY "Users can submit and view own evaluation challenges"
  ON mock_evaluation_challenges FOR ALL
  USING (auth.uid() = user_id OR auth.role() = 'service_role')
  WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Admins can review evaluation challenges"
  ON mock_evaluation_challenges FOR SELECT
  USING (public.is_admin() OR auth.role() = 'service_role');
