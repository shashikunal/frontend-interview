-- Phase 17: Recording, Transcription & Post-Meeting Media Pipeline
-- Schema for meeting recordings, audio assets, transcripts, and searchable dialogue segments

-- 1. Meeting Recordings Table
CREATE TABLE IF NOT EXISTS public.meeting_recordings (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    host_id TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'NOT_STARTED',
    storage_key TEXT NOT NULL,
    storage_provider TEXT NOT NULL DEFAULT 's3-minio',
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    mime_type TEXT NOT NULL DEFAULT 'video/mp4',
    thumbnail_key TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_recording_status CHECK (
        status IN ('NOT_STARTED', 'RECORDING', 'STOPPING', 'PROCESSING', 'READY', 'FAILED', 'DELETED')
    )
);

CREATE INDEX IF NOT EXISTS idx_recordings_meeting_id ON public.meeting_recordings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_recordings_status ON public.meeting_recordings(status);
CREATE INDEX IF NOT EXISTS idx_recordings_created_at ON public.meeting_recordings(created_at DESC);

-- 2. Meeting Transcripts Table
CREATE TABLE IF NOT EXISTS public.meeting_transcripts (
    id TEXT PRIMARY KEY,
    recording_id TEXT NOT NULL REFERENCES public.meeting_recordings(id) ON DELETE CASCADE,
    meeting_id TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    status TEXT NOT NULL DEFAULT 'PROCESSING',
    full_text TEXT NOT NULL DEFAULT '',
    confidence REAL NOT NULL DEFAULT 0.0,
    word_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_transcript_status CHECK (
        status IN ('PROCESSING', 'READY', 'FAILED')
    )
);

CREATE INDEX IF NOT EXISTS idx_transcripts_recording_id ON public.meeting_transcripts(recording_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_meeting_id ON public.meeting_transcripts(meeting_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_full_text_gin ON public.meeting_transcripts USING gin(to_tsvector('english', full_text));

-- 3. Transcript Segments (Diarized Timestamp Blocks)
CREATE TABLE IF NOT EXISTS public.transcript_segments (
    id TEXT PRIMARY KEY,
    transcript_id TEXT NOT NULL REFERENCES public.meeting_transcripts(id) ON DELETE CASCADE,
    start_time_seconds REAL NOT NULL,
    end_time_seconds REAL NOT NULL,
    text TEXT NOT NULL,
    speaker_id TEXT,
    speaker_name TEXT,
    confidence REAL NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_segments_transcript_id ON public.transcript_segments(transcript_id);
CREATE INDEX IF NOT EXISTS idx_segments_speaker_id ON public.transcript_segments(speaker_id);
CREATE INDEX IF NOT EXISTS idx_segments_text_gin ON public.transcript_segments USING gin(to_tsvector('english', text));

-- Comments for compliance and operational tracking
COMMENT ON TABLE public.meeting_recordings IS 'Durable metadata for meeting video/audio recordings stored in object storage';
COMMENT ON TABLE public.meeting_transcripts IS 'Aggregated text and confidence scores for recorded meetings';
COMMENT ON TABLE public.transcript_segments IS 'Granular timestamped dialogue blocks mapped to verified participants';
