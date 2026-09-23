# Phase 17 — Asynchronous Media Processing Pipeline & Kafka Workers

## 1. Overview & Worker Architecture

When a meeting recording is finalized, the media processing workflow runs completely asynchronously outside of the user-facing HTTP request cycle:

```
[Recording Service]
       │
   (Outbox)
       ▼
 [Kafka Topic: recording.events]
       │
       ▼
 [Consumer Group: media-processing-group]
       │
       ├─► 1. Media Integrity Validation (header, duration, codec check)
       │
       ├─► 2. Audio Extraction & Downsampling (16kHz mono for speech-to-text)
       │
       ├─► 3. Speech-to-Text Transcription via Whisper Provider
       │
       ├─► 4. Speaker Diarization Alignment with Room Presence
       │
       ├─► 5. Database Persistence (meeting_transcripts & transcript_segments)
       │
       └─► 6. Dispatch Notification Event (NotificationRequested.v1)
```

---

## 2. Event Envelope & Schemas

Post-processing events adhere to the standard versioned envelope:
* `RecordingStarted.v1`: Emitted when recording egress begins.
* `RecordingStopped.v1`: Emitted when stop command is confirmed.
* `RecordingCompleted.v1`: Emitted when raw media blob is secured in object storage.
* `RecordingProcessingStarted.v1`: Emitted when worker claims the job.
* `RecordingProcessingCompleted.v1`: Emitted when validation and transcription succeed; recording transitions to `READY`.
* `RecordingProcessingFailed.v1`: Emitted when processing permanently fails; recording transitions to `FAILED`.

---

## 3. Resilience & Failure Handling
* **Idempotent Job Processing**: The worker checks the current status in `meeting_recordings`. If already `READY`, the job is marked acknowledged without re-processing.
* **Exponential Backoff**: Transient errors (e.g. storage timeout, model busy) retry with exponential backoff and jitter up to 3 attempts.
* **Poison Message Routing**: Repeated failures beyond max retries are routed to `dead-letter.events` (DLQ) with error diagnostics.
