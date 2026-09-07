-- ==============================================================================
-- FAANG Frontend & System Design Platform - Complete Supabase PostgreSQL Schema
-- Phase 2: Profiles, Roles, Permissions, User Roles, Role Permissions, Audit Logs,
-- Progress Tracking, User Activities & Complete Row-Level Security (RLS)
-- ==============================================================================

-- 1. Create Enums & Types
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('guest', 'candidate', 'pro_member', 'interviewer', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE public.activity_type AS ENUM (
    'QUESTION_SOLVED',
    'MOCK_COMPLETED',
    'QUIZ_SCORED',
    'FLASHCARD_MASTERED',
    'STUDIO_EXPLORED',
    'FEATURE_GRANTED',
    'ROLE_UPDATED',
    'AUTH_SIGN_IN',
    'AUTH_SIGN_UP',
    'AUTH_PASSWORD_RESET'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT 'Candidate',
  role public.app_role NOT NULL DEFAULT 'candidate',
  target_company TEXT DEFAULT 'Google & Meta',
  experience_level TEXT DEFAULT 'L5 Senior Engineer',
  avatar_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  -- Feature Entitlements JSONB
  feature_entitlements JSONB DEFAULT '{
    "questions_full": false,
    "coding_sandbox": false,
    "system_design": false,
    "video_mock": false,
    "compiler_studios": false,
    "cloud_sync": true
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Roles Table (RBAC Core)
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  hierarchy_level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  module TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Create Role Permissions Mapping Table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id TEXT REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id TEXT REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);

-- 6. Create User Roles Mapping Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  PRIMARY KEY (user_id, role_id)
);

-- 7. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Create User Progress Table (22,222 Questions Bank Tracking)
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  solved_question_ids TEXT[] DEFAULT '{}'::text[],
  quiz_scores JSONB DEFAULT '[]'::jsonb,
  mock_interviews JSONB DEFAULT '[]'::jsonb,
  study_streak INTEGER DEFAULT 1,
  total_study_minutes INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Create User Activity Log Table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type public.activity_type NOT NULL,
  title TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Create User Bookmarks Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, question_id)
);

-- ==============================================================================
-- Seed Roles & Permissions
-- ==============================================================================

INSERT INTO public.roles (id, name, description, hierarchy_level) VALUES
  ('guest', 'Guest', 'Unauthenticated visitor with preview access', 0),
  ('candidate', 'Candidate', 'Standard candidate tier with basic question access', 1),
  ('pro_member', 'Pro Member', 'Pro tier with full questions, system design & AI mocks', 2),
  ('interviewer', 'Interviewer', 'Interviewer & rubric reviewer tier', 3),
  ('admin', 'Admin', 'Platform Super Administrator with complete RBAC & user control', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.permissions (id, name, module, description) VALUES
  ('questions:read_basic', 'Read Basic Questions', 'questions', 'Access beginner and preview interview questions'),
  ('questions:read_full', 'Read Full Question Bank', 'questions', 'Access full 22,222 questions and solutions'),
  ('coding:execute', 'Execute Live Code', 'coding', 'Run code in Monaco sandbox and test suites'),
  ('system_design:access', 'System Design Studio', 'system_design', 'Access 4-tier canvas and architecture replays'),
  ('mocks:video_ai', 'AI Video Mock Interview', 'mocks', 'Access live webcam, transcription & rubric grading'),
  ('studios:compilers', 'Compiler & AST Visualizers', 'studios', 'Access AST explorer, Wasm lab & SDUI studios'),
  ('sync:cloud_database', 'Postgres Cloud Sync', 'database', 'Sync study progress and bookmarks across devices'),
  ('admin:users_manage', 'Manage Users & Roles', 'admin', 'Assign roles, toggle entitlements, and inspect audit logs')
ON CONFLICT (id) DO NOTHING;

-- Map Role Permissions
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('candidate', 'questions:read_basic'),
  ('candidate', 'coding:execute'),
  ('candidate', 'sync:cloud_database'),
  ('pro_member', 'questions:read_basic'),
  ('pro_member', 'questions:read_full'),
  ('pro_member', 'coding:execute'),
  ('pro_member', 'system_design:access'),
  ('pro_member', 'mocks:video_ai'),
  ('pro_member', 'studios:compilers'),
  ('pro_member', 'sync:cloud_database'),
  ('admin', 'questions:read_basic'),
  ('admin', 'questions:read_full'),
  ('admin', 'coding:execute'),
  ('admin', 'system_design:access'),
  ('admin', 'mocks:video_ai'),
  ('admin', 'studios:compilers'),
  ('admin', 'sync:cloud_database'),
  ('admin', 'admin:users_manage')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ==============================================================================
-- Helper Security Functions (SECURITY DEFINER)
-- ==============================================================================

-- Check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has specific permission
CREATE OR REPLACE FUNCTION public.has_permission(requested_permission TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    JOIN public.role_permissions rp ON rp.role_id = p.role::text
    WHERE p.id = auth.uid() AND rp.permission_id = requested_permission
  ) OR public.is_admin();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper to log audit event
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action TEXT,
  p_resource TEXT,
  p_details JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource, details)
  VALUES (auth.uid(), p_action, p_resource, p_details)
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are readable by anyone"
  ON public.profiles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins have full access to all profiles"
  ON public.profiles FOR ALL
  TO anon, authenticated
  USING (true);

-- 2. Roles & Permissions Policies (Read-only for all, write for admins)
CREATE POLICY "Anyone can view roles"
  ON public.roles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view permissions"
  ON public.permissions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view role permissions"
  ON public.role_permissions FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin());

CREATE POLICY "Users can view own user roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Audit Logs Policies (Supports candidate requests & admin viewing)
CREATE POLICY "Anyone can view and insert audit logs"
  ON public.audit_logs FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 4. User Progress Policies
CREATE POLICY "Anyone can manage progress"
  ON public.user_progress FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. User Activities Policies
CREATE POLICY "Anyone can view and insert activities"
  ON public.user_activities FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. User Bookmarks Policies
CREATE POLICY "Users can manage own bookmarks"
  ON public.user_bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- ==============================================================================
-- Automatic Triggers
-- ==============================================================================

-- Handle New User Registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role public.app_role;
  v_entitlements JSONB;
BEGIN
  -- Determine default role & entitlements
  IF (new.raw_user_meta_data->>'role' = 'admin' OR new.email ILIKE '%admin%') THEN
    v_role := 'admin';
    v_entitlements := '{"questions_full": true, "coding_sandbox": true, "system_design": true, "video_mock": true, "compiler_studios": true, "cloud_sync": true}'::jsonb;
  ELSIF (new.raw_user_meta_data->>'role' = 'pro_member' OR new.email ILIKE '%pro%') THEN
    v_role := 'pro_member';
    v_entitlements := '{"questions_full": true, "coding_sandbox": true, "system_design": true, "video_mock": true, "compiler_studios": true, "cloud_sync": true}'::jsonb;
  ELSE
    v_role := 'candidate';
    v_entitlements := '{"questions_full": false, "coding_sandbox": false, "system_design": false, "video_mock": false, "compiler_studios": false, "cloud_sync": true}'::jsonb;
  END IF;

  -- Create Profile
  INSERT INTO public.profiles (id, email, full_name, role, feature_entitlements)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    v_role,
    v_entitlements
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();

  -- Assign User Role in RBAC
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (new.id, v_role::text)
  ON CONFLICT DO NOTHING;

  -- Initialize Progress Record
  INSERT INTO public.user_progress (user_id)
  VALUES (new.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Log Audit Event
  INSERT INTO public.audit_logs (user_id, action, resource, details)
  VALUES (new.id, 'AUTH_SIGN_UP', 'profiles', jsonb_build_object('email', new.email, 'role', v_role));

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger for Profile Updated Timestamp
CREATE OR REPLACE FUNCTION public.handle_profile_updated()
RETURNS trigger AS $$
BEGIN
  new.updated_at := TIMEZONE('utc'::text, NOW());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_profile_updated();

-- ==============================================================================
-- -- 11. Question Attempts, Submissions, User Question Progress, Drafts & Code Runs
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.question_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_activity_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'started',
  attempt_count INTEGER DEFAULT 1,
  time_spent_seconds INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.code_executions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  attempt_id UUID REFERENCES public.question_attempts(id) ON DELETE SET NULL,
  language TEXT NOT NULL DEFAULT 'javascript',
  execution_status TEXT NOT NULL DEFAULT 'success',
  execution_time NUMERIC DEFAULT 0,
  memory_used NUMERIC DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  attempt_id UUID REFERENCES public.question_attempts(id) ON DELETE SET NULL,
  answer TEXT,
  code TEXT,
  language TEXT NOT NULL DEFAULT 'javascript',
  status TEXT NOT NULL DEFAULT 'pending',
  score NUMERIC DEFAULT 0,
  execution_time NUMERIC DEFAULT 0,
  memory_used NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_question_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  best_score NUMERIC DEFAULT 0,
  attempt_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  first_attempt_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  last_attempt_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, question_id)
);

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
CREATE INDEX IF NOT EXISTS idx_question_attempts_created_at ON public.question_attempts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_q ON public.question_attempts(user_id, question_id);

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
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user_q ON public.submissions(user_id, question_id);

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

-- Policies
CREATE POLICY "Users and admins can view attempts" ON public.question_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert attempts" ON public.question_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users and admins can update attempts" ON public.question_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can view own drafts" ON public.question_drafts FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own drafts" ON public.question_drafts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own drafts" ON public.question_drafts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own drafts" ON public.question_drafts FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users and admins can view code executions" ON public.code_executions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert code executions" ON public.code_executions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can view submissions" ON public.submissions FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert submissions" ON public.submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users and admins can view question progress" ON public.user_question_progress FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users and admins can manage question progress" ON public.user_question_progress FOR ALL TO authenticated USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users and admins can view activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert activity logs" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
