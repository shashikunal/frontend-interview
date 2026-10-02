-- Activity Events Table
CREATE TABLE IF NOT EXISTS activity_events (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_user_id ON activity_events(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_event_type ON activity_events(event_type);
CREATE INDEX IF NOT EXISTS idx_activity_events_created_at ON activity_events(created_at);

-- Content Progress Table
CREATE TABLE IF NOT EXISTS content_progress (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  chapter_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  subtopic_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, subtopic_id)
);

CREATE INDEX IF NOT EXISTS idx_content_progress_user_id ON content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_content_progress_subject_id ON content_progress(subject_id);

-- Mistake Book Table
CREATE TABLE IF NOT EXISTS mistake_book (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  reviewed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mistake_book_user_id ON mistake_book(user_id);
CREATE INDEX IF NOT EXISTS idx_mistake_book_reviewed ON mistake_book(reviewed);

-- Placement Test Attempts Table
CREATE TABLE IF NOT EXISTS placement_test_attempts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_placement_test_attempts_user_id ON placement_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_test_attempts_test_id ON placement_test_attempts(test_id);

-- Enable RLS
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mistake_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activity_events
CREATE POLICY "Users can view own activity events"
  ON activity_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity events"
  ON activity_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for content_progress
CREATE POLICY "Users can view own content progress"
  ON content_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content progress"
  ON content_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content progress"
  ON content_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for mistake_book
CREATE POLICY "Users can view own mistakes"
  ON mistake_book FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mistakes"
  ON mistake_book FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mistakes"
  ON mistake_book FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for placement_test_attempts
CREATE POLICY "Users can view own test attempts"
  ON placement_test_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own test attempts"
  ON placement_test_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
