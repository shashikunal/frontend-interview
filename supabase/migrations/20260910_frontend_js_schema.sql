-- ==============================================================================
-- Frontend JavaScript Programming (1,000 Questions) - Isolated Supabase Schema
-- Dedicated, technically isolated tables for questions, submissions, attempts,
-- progress, bookmarks, notes, sessions, reports, and audit logs.
-- ==============================================================================

-- 1. Frontend JS Question Metadata / Overrides
CREATE TABLE IF NOT EXISTS public.frontend_js_questions (
  id TEXT PRIMARY KEY,                       -- e.g. 'FJP-0001'
  version INTEGER DEFAULT 1 NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT '',
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  frontend_topic TEXT NOT NULL,
  javascript_concepts TEXT[] DEFAULT '{}'::text[],
  interview_type TEXT DEFAULT 'Coding',
  frequency_rank TEXT DEFAULT 'Standard',
  is_most_asked BOOLEAN DEFAULT false,
  company_tags TEXT[] DEFAULT '{}'::text[],
  startup_tag TEXT DEFAULT '',
  scenario_type TEXT DEFAULT '',
  problem_statement TEXT NOT NULL,
  input_description TEXT DEFAULT '',
  output_description TEXT DEFAULT '',
  examples JSONB DEFAULT '[]'::jsonb,
  starter_code TEXT NOT NULL,
  test_cases JSONB DEFAULT '[]'::jsonb,
  hidden_test_cases JSONB DEFAULT '[]'::jsonb,
  solution TEXT NOT NULL,
  explanation TEXT DEFAULT '',
  hints TEXT[] DEFAULT '{}'::text[],
  time_complexity TEXT DEFAULT 'O(N)',
  space_complexity TEXT DEFAULT 'O(1)',
  status TEXT DEFAULT 'Published' CHECK (status IN ('Draft', 'Review', 'Approved', 'Published', 'Archived')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Frontend JS Candidate Submissions (Permanent Historical Ledger)
CREATE TABLE IF NOT EXISTS public.frontend_js_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_version INTEGER DEFAULT 1 NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'wrong_answer', 'runtime_error', 'time_limit_exceeded', 'compile_error')),
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

-- 3. Frontend JS Candidate Attempts (All Run/Test Actions)
CREATE TABLE IF NOT EXISTS public.frontend_js_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL,
  tests_passed INTEGER DEFAULT 0,
  tests_total INTEGER DEFAULT 0,
  runtime_ms NUMERIC DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Frontend JS Candidate Progress Summary
CREATE TABLE IF NOT EXISTS public.frontend_js_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  solved_question_ids TEXT[] DEFAULT '{}'::text[],
  attempted_question_ids TEXT[] DEFAULT '{}'::text[],
  revisit_question_ids TEXT[] DEFAULT '{}'::text[],
  total_score INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 1,
  last_solved_date DATE DEFAULT CURRENT_DATE,
  total_time_spent_seconds INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Frontend JS Bookmarks
CREATE TABLE IF NOT EXISTS public.frontend_js_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, question_id)
);

-- 6. Frontend JS Personal Notes
CREATE TABLE IF NOT EXISTS public.frontend_js_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, question_id)
);

-- 7. Frontend JS Unfinished Code Drafts
CREATE TABLE IF NOT EXISTS public.frontend_js_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  code TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (user_id, question_id)
);

-- 8. Frontend JS Candidate Reports (Moderation Queue)
CREATE TABLE IF NOT EXISTS public.frontend_js_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question_id TEXT NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN (
    'Incorrect question',
    'Broken starter code',
    'Duplicate question',
    'Incorrect expected output',
    'Unclear problem',
    'Broken tests',
    'Incorrect solution',
    'Other issue'
  )),
  description TEXT NOT NULL,
  candidate_email TEXT DEFAULT '',
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Investigating', 'Resolved', 'Dismissed')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Frontend JS Admin Audit Trail
CREATE TABLE IF NOT EXISTS public.frontend_js_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,                      -- e.g. 'QUESTION_EDITED', 'QUESTION_APPROVED', 'REPORT_RESOLVED'
  question_id TEXT,
  version INTEGER,
  old_value JSONB DEFAULT '{}'::jsonb,
  new_value JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_fjs_sub_user_id ON public.frontend_js_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_question_id ON public.frontend_js_submissions(question_id);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_status ON public.frontend_js_submissions(status);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_created_at ON public.frontend_js_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fjs_sub_idempotency ON public.frontend_js_submissions(idempotency_key);

CREATE INDEX IF NOT EXISTS idx_fjs_att_user_id ON public.frontend_js_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_fjs_att_question_id ON public.frontend_js_attempts(question_id);

CREATE INDEX IF NOT EXISTS idx_fjs_prog_user_id ON public.frontend_js_progress(user_id);

CREATE INDEX IF NOT EXISTS idx_fjs_bm_user_id ON public.frontend_js_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_fjs_bm_user_q ON public.frontend_js_bookmarks(user_id, question_id);

CREATE INDEX IF NOT EXISTS idx_fjs_reports_status ON public.frontend_js_reports(status);
CREATE INDEX IF NOT EXISTS idx_fjs_reports_q_id ON public.frontend_js_reports(question_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.frontend_js_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frontend_js_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Questions: public can read published questions; admins have full access
CREATE POLICY "Public can view published questions"
  ON public.frontend_js_questions FOR SELECT
  TO anon, authenticated
  USING (status = 'Published' OR public.is_admin());

CREATE POLICY "Admins manage questions"
  ON public.frontend_js_questions FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Submissions: user can view/insert own submissions; admins can view all
CREATE POLICY "Users view own frontend_js submissions"
  ON public.frontend_js_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users insert own frontend_js submissions"
  ON public.frontend_js_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Attempts
CREATE POLICY "Users view own frontend_js attempts"
  ON public.frontend_js_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users insert own frontend_js attempts"
  ON public.frontend_js_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Progress
CREATE POLICY "Users view own frontend_js progress"
  ON public.frontend_js_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users update own frontend_js progress"
  ON public.frontend_js_progress FOR ALL
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Bookmarks & Notes & Drafts
CREATE POLICY "Users manage own bookmarks"
  ON public.frontend_js_bookmarks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own notes"
  ON public.frontend_js_notes FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own drafts"
  ON public.frontend_js_drafts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reports: users can create reports; admins view/manage all
CREATE POLICY "Users create reports"
  ON public.frontend_js_reports FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage reports"
  ON public.frontend_js_reports FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Audit logs: only admins view/insert audit logs
CREATE POLICY "Admins manage audit logs"
  ON public.frontend_js_audit_logs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
