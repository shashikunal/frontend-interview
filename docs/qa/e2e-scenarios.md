# Master End-to-End User Journey Scenarios (Phase 19)

## User Journey 1: Admin Meeting Creation & Scheduling
- **Actor**: Platform Administrator (`usr_admin`)
- **Flow**:
  1. Authenticates via `/api/v1/auth/token` with Admin credentials.
  2. Submits `POST /api/v1/meetings` with title, schedule time, and collaboration settings.
  3. Receives 201 Created with unique meeting ID (`meet_*`).
  4. System dispatches `MeetingCreated.v1` to Kafka via Transactional Outbox.
  5. Database records meeting with initial status `SCHEDULED`.

---

## User Journey 2: Candidate Invitation & Secure Meeting Admission
- **Actor**: Candidate (`usr_candidate`)
- **Flow**:
  1. Admin invites candidate via `POST /api/v1/meetings/invite`.
  2. Transactional outbox records `NotificationRequested.v1`.
  3. Candidate authenticates and receives scoped JWT meeting token (`PARTICIPANT` role).
  4. Candidate opens `/meet/:meetingId`.
  5. Meeting room initializes Socket.IO signaling connection at `/api/socket`.
  6. Server authorizes admission and registers room presence (`joining -> connected`).

---

## User Journey 3: Real-Time Multi-Party Collaboration
- **Actors**: Host (`usr_admin`), Candidate Alice (`usr_alice`), Candidate Bob (`usr_bob`)
- **Flow**:
  1. All 3 peers receive STUN/TURN ICE credentials via `POST /api/v1/meetings/media-token`.
  2. WebRTC SFU establishes bidirectional tracks (mic, camera).
  3. Alice raises hand via `meeting:hand:raise`; dock displays animated hand badge.
  4. Host views raised hand and lowers it via `meeting:host:lower-hand`.
  5. Bob broadcasts ephemeral reaction `🎉`; token-bucket rate limiter permits up to 5 per 5s.
  6. Host shares screen; participants view screen layer alongside video tiles.

---

## User Journey 4: Meeting Recording, Processing & Searchable Transcript
- **Actors**: Host & Participants
- **Flow**:
  1. Host initiates recording via `POST /api/v1/meetings/:id/recording/start`.
  2. Meeting room renders active recording warning banner.
  3. Host stops recording; state transitions to `STOPPING -> PROCESSING`.
  4. Meeting ends non-blockingly via `POST /api/v1/meetings/lifecycle`.
  5. Media processing worker claims `RecordingCompleted.v1` event.
  6. Audio extracted and transcribed into timestamped dialogue segments.
  7. Recording state updates to `READY`.
  8. Participants navigate to `/meetings/:meetingId/recordings/:recordingId` to view synced playback and search transcript keywords.

---

## User Journey 5: Operational Governance, Auditing & Health Monitoring
- **Actor**: Platform Security Officer & Site Reliability Engineer
- **Flow**:
  1. Accesses `/admin` dashboard.
  2. Queries Prometheus metrics at `/api/v1/metrics`.
  3. Queries immutable append-only audit log at `/api/v1/audit`.
  4. Verifies system health endpoints (`/api/v1/health` and `/api/v1/health/ready`).
  5. Rejection verified: Non-admin users attempting to query `/api/v1/audit` receive 403 Forbidden.

---

## User Journey 6: Application Direct Messaging & Unread Tracking
- **Actors**: Alice & Bob
- **Flow**:
  1. Alice initiates direct conversation with Bob via `appChatService.getOrCreateDirectConversation()`.
  2. Alice sends message via `/api/v1/chat`.
  3. Bob receives real-time message event via Socket.IO.
  4. Bob marks conversation as read; unread counter updates to 0.
  5. Conversation history retrieved with cursor pagination.
