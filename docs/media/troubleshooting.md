# Phase 17 — Media Pipeline Troubleshooting & Operational Diagnostics

## 1. Common Operational Scenarios

### 1.1 Recording Stuck in `STOPPING`
* **Root Cause**: Egress process failed to acknowledge file completion or object storage upload hung.
* **Remediation**:
  - The `recordingService` watchdog detects recordings in `STOPPING` for > 120 seconds.
  - Automatically polls the storage key existence. If the file exists, updates status to `PROCESSING`; if missing, transitions to `FAILED` with diagnostic metadata.

### 1.2 Presigned URL Returns 403 Forbidden
* **Root Cause**:
  - Caller does not belong to the target `meetingId`.
  - Presigned URL TTL expired (default 300s).
  - Storage provider secret mismatch.
* **Remediation**: Re-request `/api/v1/meetings/recording?action=ACCESS` to acquire a fresh signed URL with active authentication.

### 1.3 Transcription Job Retrying Continuously
* **Root Cause**: Corrupted audio payload or out-of-memory error on speech-to-text inference node.
* **Remediation**:
  - Worker limits retries to 3 attempts.
  - After 3rd attempt, job routes to `dead-letter.events` (DLQ).
  - Recording marked `READY` with a flag `transcriptStatus: 'FAILED'` so video playback remains accessible.

---

## 2. Health & Diagnostic Telemetry

* **Storage Probe**: Health check checks object storage bucket accessibility and latency.
* **Queue Depth**: Prometheus gauge `media_processing_queue_depth` monitors backlog of unprocessed recordings.
* **Audit Traces**: Every privileged action logs actor ID, IP address, and resource ID to `audit_logs`.
