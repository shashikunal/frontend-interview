# Phase 17 — Media & Transcript Retention Policy

## 1. Overview & Data Lifecycle

To satisfy compliance regulations, privacy frameworks (GDPR, CCPA), and storage cost targets, meeting media and transcripts adhere to explicit retention schedules.

---

## 2. Retention Schedules

| Asset Type | Storage Location | Retention Period | Deletion Policy |
| :--- | :--- | :--- | :--- |
| **Raw Ingest Stream** | Temporary Egress Cache | 24 Hours | Automatically purged post-finalization |
| **Final Video Recording (.mp4)** | Object Storage Private Bucket | 90 Days (configurable) | Soft-delete metadata & purge object |
| **Extracted Audio (.m4a)** | Object Storage Private Bucket | 30 Days | Purged after transcription completion |
| **Meeting Transcript** | PostgreSQL (`meeting_transcripts`) | 365 Days | Retained for compliance search |
| **Transcript Segments** | PostgreSQL (`transcript_segments`) | 365 Days | Cascading deletion with transcript |
| **Thumbnails (.jpg)** | Object Storage Private Bucket | 90 Days | Purged alongside final video |

---

## 3. Deletion & Cleanup Procedures

1. **Host/Admin Requested Deletion**:
   - `DELETE /api/v1/meetings/recording?recordingId={id}`:
   - Sets `status = 'DELETED'` in PostgreSQL.
   - Dispatches `RecordingDeleted.v1` event via transactional outbox.
   - Background cleanup job removes video, audio, and thumbnail keys from object storage.
   - Emits immutable audit log `RECORDING_DELETED`.
2. **Automated Storage Cleanup**:
   - Scheduled hourly job detects orphaned storage keys (records with `status = 'FAILED'` or uploads with no matching metadata older than 24 hours) and issues `DeleteObject` calls.
