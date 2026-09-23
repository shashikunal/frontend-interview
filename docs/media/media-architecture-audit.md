# Phase 17 — Media & Recording Capabilities Baseline Audit

## 1. Executive Summary

This audit assesses the existing media, WebRTC/SFU configuration, storage, Kafka event pipeline, and meeting lifecycle state prior to implementing Phase 17 (Recording, Transcription & Post-Meeting Media Pipeline).

---

## 2. Existing Media & SFU Capabilities (Phases 4 & 16)

* **Signaling & WebRTC Tokens**:
  - `server/meetings/mediaTokenService.ts`: Generates HS256 JWT tokens containing track permissions (`canPublishAudio`, `canPublishVideo`, `canPublishScreen`, `canSubscribe`, `canModerate`).
  - `src/features/meetings/services/mediaRoomClientService.ts`: Handles WebRTC track acquisition (`getUserMedia`, `getDisplayMedia`), active speaker energy analysis, and device enumeration.
  - `server/meetings/meetingPresenceService.ts` (Phase 16): Authoritative room presence (`online`, `joining`, `connected`, `reconnecting`, `disconnected`, `left`), hand raising, reactions, and host moderation.
* **Meeting Settings**:
  - `server/meetings/meetingTypes.ts`: Defines `recordingEnabled: boolean` in `DEFAULT_MEETING_SETTINGS` (defaults to `false`).

---

## 3. Storage Capabilities Audit

* **Current State**:
  - `src/lib/supabase/client.ts`: Supabase client initialized for PostgreSQL queries.
  - No dedicated S3 or MinIO client exists yet.
* **Phase 17 Requirement**:
  - Implement a private S3/MinIO compatible object storage abstraction (`objectStorageService.ts`) with private bucket isolation, presigned URL generation with strict TTLs, and range request support for video streaming.
  - Zero raw media blobs inside PostgreSQL or Kafka.

---

## 4. Kafka & Transactional Outbox Pipeline (Phase 9)

* **Current State**:
  - `server/kafka/topicStrategy.ts`: Manages topics (`meeting.events`, `chat.events`, `notification.events`, `audit.events`, `dead-letter.events`).
  - `server/kafka/outboxService.ts`: Provides atomic event registration alongside domain database transactions.
  - `server/kafka/consumerService.ts`: Implements consumer groups with idempotency and retry with DLQ.
* **Phase 17 Requirement**:
  - Register `recording.events` topic in `topicStrategy.ts`.
  - Add versioned recording domain events (`RecordingStarted.v1`, `RecordingStopped.v1`, `RecordingCompleted.v1`, `RecordingProcessingStarted.v1`, `RecordingProcessingCompleted.v1`, `RecordingProcessingFailed.v1`, `RecordingDeleted.v1`, `TranscriptCompleted.v1`).
  - Register `media-processing-group` consumer in `consumerService.ts` to trigger asynchronous post-processing.

---

## 5. PostgreSQL Schema & Migrations

* **Current State**:
  - Tables exist for meetings, meeting messages, audit logs, and application chat.
* **Phase 17 Requirement**:
  - Create migration `20260923_meeting_recordings_and_transcripts.sql` containing:
    1. `meeting_recordings`: Session metadata, file size, storage keys, MIME type, durations.
    2. `meeting_transcripts`: Language, full text, confidence, status.
    3. `transcript_segments`: Granular timestamped dialogue blocks with speaker identity.
    4. Full-text search index (`tsvector`) for keyword retrieval.

---

## 6. Transcription & Diarization Capabilities

* **Current State**:
  - No speech-to-text service exists.
* **Phase 17 Requirement**:
  - Implement provider abstraction supporting open-source Whisper / faster-whisper and local processing.
  - Correlate speaker diarization strictly with verified meeting presence timelines. If unverified, designate `"Speaker identification unavailable"` (zero fake guessing).

---

## 7. Gaps Summary

| Capability | Current Status | Required in Phase 17 |
| :--- | :--- | :--- |
| Recording Lifecycle State Machine | Not Implemented | `NOT_STARTED` &rarr; `RECORDING` &rarr; `STOPPING` &rarr; `PROCESSING` &rarr; `READY` &rarr; `FAILED` &rarr; `DELETED` |
| S3/MinIO Object Storage Driver | Not Implemented | Private bucket storage, presigned URLs, streaming support |
| Asynchronous Media Processing Worker | Not Implemented | Kafka-driven validation, audio extraction, transcription |
| Speech-to-Text Engine | Not Implemented | Open-source Whisper abstraction & full-text search |
| Host Recording UI & Player | Not Implemented | Record button, active disclosure banner, synchronized transcript video player |
