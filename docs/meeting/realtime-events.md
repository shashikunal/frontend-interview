# Phase 16 — Realtime Meeting Events Specification

## 1. Overview & Architecture

Meeting collaboration relies on an authoritative control plane implemented over WebSocket/Socket.IO. This control plane is strictly segregated from the WebRTC media plane (audio, video, and screen share routing handled by the SFU).

### Architecture Boundary
```
+-----------------------------------------------------------+
|                      CONTROL PLANE                        |
|  - Realtime Event Ingestion & Scoping                     |
|  - Authoritative In-Memory Room Presence                  |
|  - Token-Bucket Reaction Rate Limiting (5/5s)             |
|  - Host Moderation Verification (Mute/Kick/Lower Hand)    |
|  - Room-scoped Broadcasts via Socket.IO                   |
+-----------------------------------------------------------+
                            |
           [Strict Isolation: No Media Bytes]
                            |
+-----------------------------------------------------------+
|                       MEDIA PLANE                         |
|  - Mediasoup SFU / WebRTC PeerConnections                 |
|  - Encrypted Audio/Video RTP Packets                      |
|  - Screen Share RTP Streams                               |
+-----------------------------------------------------------+
```

---

## 2. Event Envelope & Scoping

All collaboration events adhere to the standard envelope schema:

```json
{
  "event": "meeting:reaction",
  "version": "1.0",
  "meetingId": "meet-uuid-1234",
  "timestamp": "2026-09-23T10:45:00.000Z",
  "correlationId": "corr-uuid-5678",
  "actorId": "usr-uuid-9999",
  "payload": { ... }
}
```

### Event Scoping Security
1. **Room Scoping**: Every event is delivered strictly to participants within `meeting:${meetingId}`.
2. **Session Verification**: The emitting socket must be authenticated via `socket.data.user` and verified as an active member of `meetingId`.
3. **No Cross-Meeting Leakage**: Event handlers validate that the emitting socket is currently joined to the target `meetingId`. Emitting to unjoined meetings is rejected with an error.

---

## 3. Realtime Event Registry

### 3.1 Participant Lifecycle & Presence
- `meeting:participant:state` (Broadcast)
  - Emitted when a participant joins, updates state, or changes presence (`online`, `joining`, `connected`, `reconnecting`, `disconnected`, `left`).
  - Payload:
    ```typescript
    {
      meetingId: string;
      participant: {
        userId: string;
        displayName: string;
        role: 'HOST' | 'CO_HOST' | 'PARTICIPANT';
        micState: 'active' | 'muted';
        cameraState: 'active' | 'off';
        screenShareState: 'active' | 'off';
        handRaised: boolean;
        presence: 'online' | 'joining' | 'connected' | 'reconnecting' | 'disconnected' | 'left';
        joinedAt: string;
      }
    }
    ```

- `meeting:sync-state` (Client -> Server -> Ack)
  - Requested during initial join or post-reconnection reconciliation to retrieve authoritative participant state, active hands, and recent history.

### 3.2 Hand Raising
- `meeting:hand:raise` (Client -> Server)
  - Sets `handRaised = true` on authoritative server state with timestamp.
  - Broadcasts `meeting:participant:state` with `handRaised: true`.

- `meeting:hand:lower` (Client -> Server)
  - Self-lowering by participant.
  - Broadcasts `meeting:participant:state` with `handRaised: false`.

- `meeting:hand:host-lower` (Client -> Server)
  - Moderation action: Host/Co-host forces lowering of another participant's hand.
  - Payload: `{ meetingId: string, targetUserId: string }`.
  - Authorized strictly for users with `role: 'HOST'` or `role: 'CO_HOST'`.

### 3.3 Ephemeral Reactions
- `meeting:reaction` (Client -> Server -> Broadcast)
  - Ephemeral emoji reaction broadcast across the meeting.
  - Strict Allowlist: `['👍', '👏', '❤️', '😂', '🎉']`. Arbitrary strings, HTML, or large payloads are rejected.
  - Rate Limiting: 5 reactions per 5-second sliding window per user.
  - Non-Persistent: Transient visual animation, not stored in PostgreSQL.

### 3.4 Host Moderation
- `meeting:host:mute-participant` (Client -> Server -> Targeted Event)
  - Host requests participant mute.
  - Forwarded to `targetUserId` as a client-side instruction to mute media track. (Browser security prohibits remote unmute/eavesdropping).

- `meeting:host:remove-participant` (Client -> Server -> Room / Direct)
  - Host expels participant from meeting.
  - Server adds `targetUserId` to `blacklistedUsers` set for this room.
  - Server forcibly disconnects target socket from meeting room and SFU.
  - Target receives `{ reason: 'Removed by host' }` and transitions to expelled view.

- `meeting:host:end-meeting` (Client -> Server -> Room)
  - Host terminates meeting for all attendees.
  - Updates DB lifecycle to `ENDED`, closes SFU router/producers, and notifies all sockets.

---

## 4. Idempotency & Reconnection Guarantees

1. **Duplicate Event Protection**: Sockets track `correlationId` to avoid processing repeated broadcasts.
2. **Reconnection State Sync**: On reconnect, clients invoke `meeting:sync-state` rather than blindly appending duplicate participant entries.
3. **Graceful Presence Degrade**: On socket disconnect without explicit leave, status transitions to `reconnecting` for 30 seconds before transitioning to `disconnected` / `left`.
