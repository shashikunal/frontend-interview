-- AI Resume Center Schema
-- Migration: 20261002_resume_center_schema

-- ─── Resumes Table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Untitled Resume',
  target_role TEXT DEFAULT '',
  company_name TEXT DEFAULT '',
  template TEXT DEFAULT 'professional',
  font_family TEXT DEFAULT 'Inter',
  font_size TEXT DEFAULT 'medium',
  section_order JSONB DEFAULT '["summary","skills","experience","projects","education","certifications","achievements"]',
  content JSONB NOT NULL DEFAULT '{}',
  extracted_text TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Resume Versions Table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'Version',
  target_role TEXT DEFAULT '',
  company_name TEXT DEFAULT '',
  content JSONB NOT NULL DEFAULT '{}',
  ats_score INTEGER DEFAULT 0,
  job_match_score INTEGER DEFAULT 0,
  jd_text TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Job Descriptions Table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.job_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_role TEXT NOT NULL DEFAULT '',
  company_name TEXT DEFAULT '',
  jd_text TEXT NOT NULL DEFAULT '',
  parsed_jd JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Resume Reviews Table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.resume_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE NOT NULL,
  job_description_id UUID REFERENCES public.job_descriptions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  overall_score INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0,
  job_match_score INTEGER DEFAULT 0,
  skills_match_score INTEGER DEFAULT 0,
  keyword_match_score INTEGER DEFAULT 0,
  experience_match_score INTEGER DEFAULT 0,
  project_relevance_score INTEGER DEFAULT 0,
  formatting_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  readability_score INTEGER DEFAULT 0,
  matched_skills JSONB DEFAULT '[]',
  partial_skills JSONB DEFAULT '[]',
  missing_skills JSONB DEFAULT '[]',
  optional_skills JSONB DEFAULT '[]',
  matched_keywords JSONB DEFAULT '[]',
  missing_keywords JSONB DEFAULT '[]',
  section_reviews JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  validation_result JSONB DEFAULT '{}',
  review_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Resume Files Table (for uploaded resumes) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.resume_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  storage_path TEXT DEFAULT '',
  extracted_text TEXT DEFAULT '',
  upload_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON public.resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON public.resume_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_reviews_resume_id ON public.resume_reviews(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_reviews_user_id ON public.resume_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_files_user_id ON public.resume_files(user_id);

-- ─── Updated At Trigger ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_resumes_updated_at
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_resume_versions_updated_at
  BEFORE UPDATE ON public.resume_versions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_job_descriptions_updated_at
  BEFORE UPDATE ON public.job_descriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_resume_reviews_updated_at
  BEFORE UPDATE ON public.resume_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_resume_files_updated_at
  BEFORE UPDATE ON public.resume_files
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Row Level Security ────────────────────────────────────────────────────
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_files ENABLE ROW LEVEL SECURITY;

-- Resumes RLS
CREATE POLICY "Users can view own resumes" ON public.resumes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON public.resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON public.resumes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Resume Versions RLS
CREATE POLICY "Users can view own resume_versions" ON public.resume_versions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume_versions" ON public.resume_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resume_versions" ON public.resume_versions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resume_versions" ON public.resume_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Job Descriptions RLS
CREATE POLICY "Users can view own job_descriptions" ON public.job_descriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job_descriptions" ON public.job_descriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job_descriptions" ON public.job_descriptions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job_descriptions" ON public.job_descriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Resume Reviews RLS
CREATE POLICY "Users can view own resume_reviews" ON public.resume_reviews
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume_reviews" ON public.resume_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resume_reviews" ON public.resume_reviews
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resume_reviews" ON public.resume_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Resume Files RLS
CREATE POLICY "Users can view own resume_files" ON public.resume_files
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resume_files" ON public.resume_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resume_files" ON public.resume_files
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resume_files" ON public.resume_files
  FOR DELETE USING (auth.uid() = user_id);
