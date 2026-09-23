# Phase 17 — Object Storage Architecture & Access Controls

## 1. Storage Topology & Driver Abstraction

Recordings are stored in private, S3-compatible buckets (MinIO, AWS S3, or Supabase Storage). The storage driver is abstracted via `server/media/objectStorageService.ts`.

### Storage Hierarchy
```
bucket-name/
  └── meetings/
      └── {meetingId}/
          └── recordings/
              ├── {recordingId}.mp4          # Final media file
              ├── {recordingId}.m4a          # Extracted audio
              └── {recordingId}_thumb.jpg    # Thumbnail
```

---

## 2. Security & Signed URL Access

Direct public reads on the bucket are disabled. All client media access follows the presigned URL protocol:

1. **Client Request**: `GET /api/v1/meetings/recording?action=ACCESS&recordingId={recordingId}`
2. **Authorization Boundary**:
   - Verify JWT and identity of caller (`caller.userId`).
   - Query PostgreSQL to ensure `recordingId` belongs to `meetingId`.
   - Verify caller is either an authorized meeting participant (`HOST`, `CO_HOST`, `PARTICIPANT`) or a platform `admin`.
3. **Signed URL Generation**:
   - Issue HMAC-SHA256 presigned GET URL with strict expiration (`TTL = 300 seconds`).
   - Browser client plays or streams directly from object storage via signed URL.
4. **IDOR Mitigation**:
   - Attackers cannot forge `meetingId` or `recordingId` query parameters to gain access to recordings from other meetings.

---

## 3. Streaming & Range Requests

To enable smooth video scrub and playback without downloading the entire video file:
* The object storage driver honors `Range: bytes=start-end` HTTP headers.
* Responds with `206 Partial Content` and appropriate `Content-Range` headers.
* Enables sub-second video seeking in modern HTML5 video elements.
