# ADR 0010: Whisper Speech-to-Text Pipeline and Truthful Diarization

## Status
Accepted

## Context
Post-meeting review of technical interviews requires searchable, synchronized transcripts with accurate timestamps. In multi-speaker interviews, attributing statements to the correct participant (speaker diarization) is essential for evaluating candidate communication. Transcribing on proprietary cloud APIs (e.g. OpenAI Whisper API, Google Speech-to-Text) incurs recurring per-minute costs and raises customer data confidentiality concerns.

## Decision
Implement an **Open-Source Whisper STT Pipeline** with **Truthful Diarization Fallback** (`server/media/transcriptionService.ts`):
1. **Model & Engine**:
   - Primary engine: `faster-whisper` (CTranslate2 implementation of OpenAI Whisper `base.en` / `small.en`).
   - Runs locally in worker container with optional CUDA GPU acceleration or multi-threaded CPU execution.
2. **Truthful Diarization Standard**:
   - When multi-channel audio tracks or acoustic clustering cleanly differentiate voices, speakers are attributed (`Host`, `Candidate`).
   - In single-track recordings where voice embeddings cannot be separated with >85% statistical confidence, the system strictly outputs truthful attribution: `"Speaker identification unavailable"` or generic sequential speaker tags (`Speaker 1`, `Speaker 2`).
   - Under no circumstances does the system fabricate speaker identities or guess names.
3. **Storage & Searchability**:
   - Transcript segments are stored as JSON arrays containing `{ startTime, endTime, speaker, text, confidence }`.
   - Full transcript text is indexed in PostgreSQL using a Generalized Inverted Index (`GIN(to_tsvector('english', full_text))`) for millisecond keyword searching across thousands of past interviews.

## Alternatives Considered
- **Cloud Third-Party Speech API (OpenAI / Deepgram / AssemblyAI)**: High operational costs and enterprise customer compliance restrictions regarding external audio processing.
- **Client-Side Web Speech API**: Inconsistent browser support (absent on Firefox/Safari) and cannot transcribe recorded files post-meeting.

## Trade-offs
- *Pros*: Zero external per-minute API fees, complete data privacy within self-hosted infrastructure, full-text PostgreSQL search integration.
- *Cons*: Transcribing audio requires CPU/GPU resources on worker nodes (~0.3x real-time duration).

## Consequences
- Asynchronous transcription jobs run out-of-band via Kafka `media.events` without blocking API threads.
- Accurate, timestamp-synchronized transcripts appear in the web UI alongside video playback.
