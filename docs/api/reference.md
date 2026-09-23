# Complete Platform API Reference

All endpoints adhere to standard REST semantics, consistent error envelopes, strict RBAC authorization, and timing-safe token verification.

## Standard Error Response Format
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable explanation of error",
  "code": 400,
  "timestamp": "2026-09-23T14:00:00.000Z"
}
```

---

## 1. Authentication & Tokens (`/api/v1/auth`)

### POST `/api/v1/auth/token`
- **Description**: Generates an authenticated user or meeting token.
- **Authorization**: Public or Bearer token (depending on mode).
- **Request Body**:
  ```json
  {
    "userId": "usr_123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "admin"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": 1758639600,
    "user": { "id": "usr_123", "role": "admin" }
  }
  ```

---

## 2. Meetings & Lifecycle (`/api/v1/meetings`)

### POST `/api/v1/meetings`
- **Description**: Creates and schedules a new collaborative meeting.
- **Authorization**: `ADMIN` role required. Candidate tokens receive `HTTP 403 Forbidden`.
- **Request Body**:
  ```json
  {
    "title": "Senior Frontend Architecture Interview",
    "meetingType": "COLLABORATIVE",
    "scheduledStartTime": "2026-09-24T10:00:00.000Z",
    "settings": { "allowChat": true, "allowScreenShare": true }
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "meeting": {
      "id": "meet_a79f3b12",
      "title": "Senior Frontend Architecture Interview",
      "status": "SCHEDULED",
      "hostId": "usr_admin_123"
    }
  }
  ```

### POST `/api/v1/meetings/lifecycle`
- **Description**: Authoritatively transitions a meeting lifecycle state (`SCHEDULED -> STARTED -> ACTIVE -> ENDED / CANCELLED`).
- **Authorization**: Meeting `HOST` or `ADMIN`.
- **Request Body**:
  ```json
  {
    "meetingId": "meet_a79f3b12",
    "targetStatus": "STARTED"
  }
  ```
- **Response `200 OK`**: Updated meeting entity. Terminal mutations on `ENDED` or `CANCELLED` meetings return `400 INVALID_LIFECYCLE_TRANSITION`.

### POST `/api/v1/meetings/invite`
- **Description**: Generates a secure invitation token with email notification dispatch.
- **Authorization**: Meeting `HOST` or `ADMIN`.

### POST `/api/v1/meetings/join`
- **Description**: Validates participant invitation token, meeting state, and admission limits before issuing meeting tokens and STUN/TURN media credentials.
- **Authorization**: Bearer token + raw invite token.

---

## 3. Realtime Signaling & Chat (`/api/v1/meetings/chat` & `/api/socket`)

### POST `/api/v1/meetings/chat`
- **Description**: Sends an in-meeting chat message with XSS entity sanitization.
- **Authorization**: Admitted meeting participant.

### WebSocket `/api/socket`
- **Transport**: Socket.IO with WebSocket + Long-Polling fallback.
- **Handshake**: Requires `auth: { token: meetingToken }`.
- **Events**:
  - `join_room`: Joins isolated meeting room `meet:{meetingId}`.
  - `reaction`: Sends emoji (`👍`, `👏`, `❤️`, `😂`, `🎉`) throttled by token bucket (5 in 5s).
  - `host_mute_participant`: Host moderation command.
  - `raise_hand`: Toggles hand raise presence.

---

## 4. Media & Recordings (`/api/v1/media` & `/api/v1/meetings/:id/recordings`)

### POST `/api/v1/media/recordings/start`
- **Description**: Starts server-side recording of active meeting.
- **Authorization**: Meeting `HOST` or `ADMIN`.

### POST `/api/v1/media/recordings/stop`
- **Description**: Stops recording and initiates asynchronous transcription worker pipeline.

### GET `/api/v1/meetings/:id/recordings/:recId/stream`
- **Description**: Streams video recording with HTTP Range support (`206 Partial Content`).
- **Authorization**: Verified participant of meeting or `ADMIN`. Cross-meeting access rejected with `403 Forbidden`.

---

## 5. Administration & Observability (`/api/v1/admin` & `/api/v1/health`)

### GET `/api/v1/admin/dashboard`
- **Description**: Returns consolidated operational telemetry (active meetings, participants, system load, error rates).
- **Authorization**: `ADMIN` only.

### GET `/api/v1/health`
- **Description**: Liveness probe returning process uptime and basic status.

### GET `/api/v1/health/ready`
- **Description**: Readiness probe checking connectivity to PostgreSQL, Redis, Kafka, and LiveKit SFU.

### GET `/api/v1/metrics`
- **Description**: Prometheus text format telemetry metrics.
