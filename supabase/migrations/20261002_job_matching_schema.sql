-- AI Job Matching Schema
-- Migration: 20261002_job_matching_schema

CREATE TABLE IF NOT EXISTS public.job_match_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL DEFAULT '',
  company_name TEXT DEFAULT '',
  job_description TEXT NOT NULL DEFAULT '',
  overall_score INTEGER DEFAULT 0,
  ats_score INTEGER DEFAULT 0,
  skills_score INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  responsibility_score INTEGER DEFAULT 0,
  project_score INTEGER DEFAULT 0,
  keyword_score INTEGER DEFAULT 0,
  education_score INTEGER DEFAULT 0,
  certification_score INTEGER DEFAULT 0,
  classification TEXT DEFAULT 'Weak Match',
  matched_skills JSONB DEFAULT '[]',
  partial_skills JSONB DEFAULT '[]',
  missing_skills JSONB DEFAULT '[]',
  optional_skills JSONB DEFAULT '[]',
  matched_responsibilities JSONB DEFAULT '[]',
  missing_responsibilities JSONB DEFAULT '[]',
  matched_keywords JSONB DEFAULT '[]',
  missing_keywords JSONB DEFAULT '[]',
  experience_analysis JSONB DEFAULT '{}',
  project_analysis JSONB DEFAULT '[]',
  ats_analysis JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  apply_recommendation TEXT DEFAULT '',
  apply_reasons JSONB DEFAULT '[]',
  score_breakdown JSONB DEFAULT '{}',
  analysis_result JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_job_match_analyses_user_id ON public.job_match_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_job_match_analyses_resume_id ON public.job_match_analyses(resume_id);

CREATE TRIGGER trg_job_match_analyses_updated_at
  BEFORE UPDATE ON public.job_match_analyses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.job_match_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own job_match_analyses" ON public.job_match_analyses
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own job_match_analyses" ON public.job_match_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own job_match_analyses" ON public.job_match_analyses
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own job_match_analyses" ON public.job_match_analyses
  FOR DELETE USING (auth.uid() = user_id);
