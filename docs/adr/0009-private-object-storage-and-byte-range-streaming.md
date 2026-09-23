# ADR 0009: Private Object Storage and Byte-Range Video Streaming

## Status
Accepted

## Context
Meeting recordings represent sensitive, confidential interview artifacts containing candidate video, audio, and code. Storing video files directly on local server disks or in PostgreSQL is unacceptable due to disk exhaustion, backup bloat, and security vulnerabilities. Furthermore, browsers playing 200MB+ video recordings require smooth seeking without downloading the entire file into browser memory first.

## Decision
Adopt **Private S3-Compatible Object Storage** with **HTTP 206 Partial Content Streaming** (`server/media/objectStorageService.ts`):
1. **Private Bucket Policy**:
   - The bucket `interviewprep-recordings-private` is completely private with public ACLs disabled.
   - Files are stored with secure keys: `recordings/{meetingId}/{recordingId}.mp4`.
2. **Short-Lived Presigned URLs & Gateway Streaming**:
   - Presigned download and playback URLs are signed using HMAC-SHA256 with a strict 300-second (5-minute) TTL.
   - Direct gateway streaming supports standard HTTP Range requests (`Range: bytes=start-end`), responding with `206 Partial Content`, `Content-Range`, and `Accept-Ranges: bytes`. This enables instant video scrubbing and seeking in HTML5 `<video>` players.
3. **Anti-IDOR Access Control**:
   - The recording streaming endpoint (`/api/v1/meetings/:id/recordings/:recId/stream`) enforces JWT verification. Only the meeting host, admitted participants, or admins can stream or download the recording.
4. **Local Fallback Storage**:
   - For local development and test environments where MinIO or AWS S3 is not configured, the storage service automatically falls back to an isolated local disk directory (`storage/recordings/`) while maintaining the identical Range streaming and security contract.

## Alternatives Considered
- **Public S3 Bucket with Obfuscated Filenames**: Rejected due to high risk of data leaks and lack of compliance with privacy standards.
- **PostgreSQL Large Objects (BLOB/bytea)**: Rejected as database bloat destroys backup performance and query response times.

## Trade-offs
- *Pros*: Infinite storage scalability, near-zero server memory footprint during streaming via chunked readable streams, instant browser seeking.
- *Cons*: Requires managing object storage credentials and lifecycle retention policies (pruning raw files after 90 days).

## Consequences
- Recordings are completely secure from unauthenticated downloads.
- Candidates and interviewers experience smooth, responsive video playback.
