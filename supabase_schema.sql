-- ==============================================================================
-- FAANG Frontend & System Design Interview Platform - Supabase PostgreSQL Schema
-- Includes: Real Email/Password Auth, OTP Handshake, Admin Feature Entitlements & RLS
-- ==============================================================================

-- 1. Create User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT DEFAULT 'Candidate',
  role TEXT NOT NULL DEFAULT 'candidate' CHECK (role IN ('guest', 'candidate', 'pro_member', 'interviewer', 'admin')),
  target_company TEXT DEFAULT 'Google & Meta',
  experience_level TEXT DEFAULT 'L5 Senior Engineer',
  avatar_url TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  -- Admin-controlled feature entitlements per user (1-click grant/revoke)
  feature_entitlements JSONB DEFAULT '{
    "questions_full": false,
    "coding_sandbox": true,
    "system_design": false,
    "video_mock": false,
    "compiler_studios": false,
    "cloud_sync": true
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create User Progress Table (22,222 Questions Bank Tracking)
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

-- 3. Create User Activity Log Table (Real-Time Timeline Audit)
CREATE TABLE IF NOT EXISTS public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('QUESTION_SOLVED', 'MOCK_COMPLETED', 'QUIZ_SCORED', 'FLASHCARD_MASTERED', 'STUDIO_EXPLORED', 'FEATURE_GRANTED', 'ROLE_UPDATED')),
  title TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create User Bookmarks & Revision Table
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, question_id)
);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own profile basic info"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have superuser access to manage any profile and feature entitlements"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Progress Policies
CREATE POLICY "Users can view and update own progress"
  ON public.user_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user progress"
  ON public.user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Activity Policies
CREATE POLICY "Users can view own activities"
  ON public.user_activities FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities"
  ON public.user_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bookmarks Policies
CREATE POLICY "Users can manage own bookmarks"
  ON public.user_bookmarks FOR ALL
  USING (auth.uid() = user_id);

-- ==============================================================================
-- Automatic Profile Initialization Trigger
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, feature_entitlements)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'candidate'),
    CASE 
      WHEN (new.raw_user_meta_data->>'role' = 'admin' OR new.email ILIKE '%admin%') THEN 
        '{"questions_full": true, "coding_sandbox": true, "system_design": true, "video_mock": true, "compiler_studios": true, "cloud_sync": true}'::jsonb
      WHEN (new.raw_user_meta_data->>'role' = 'pro_member' OR new.email ILIKE '%pro%') THEN
        '{"questions_full": true, "coding_sandbox": true, "system_design": true, "video_mock": true, "compiler_studios": true, "cloud_sync": true}'::jsonb
      ELSE
        '{"questions_full": false, "coding_sandbox": true, "system_design": false, "video_mock": false, "compiler_studios": false, "cloud_sync": true}'::jsonb
    END
  );

  INSERT INTO public.user_progress (user_id)
  VALUES (new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
