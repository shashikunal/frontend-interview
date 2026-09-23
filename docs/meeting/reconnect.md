# Phase 16 — Reconnect & Rejoin Architecture

## 1. Overview & Connection Lifecycle

Network instability, mobile cellular handoffs, and Wi-Fi blips can cause temporary interruptions during meetings. The Phase 16 reconnect architecture ensures that transient network issues do not eject participants, duplicate participant cards, or corrupt room state.

### State Transition Diagram
```
  [CONNECTED]
       │
   (Socket / ICE Disconnect)
       ▼
 [RECONNECTING] ────────(Exponential Backoff: 1s, 2s, 4s, 8s max 30s)──────┐
       │                                                                   │
   (Network Restored & Token Valid)                                (Timeout > 30s)
       │                                                                   ▼
       ▼                                                             [DISCONNECTED / LEFT]
  Re-authenticate Token
       ▼
  meeting:sync-state
       ▼
  Re-attach Media / Consumers
       ▼
  [CONNECTED]
```

---

## 2. Server-Authoritative Grace Period

When a socket disconnects abruptly without emitting `meeting:leave`:
1. `meetingPresenceService` marks the participant's presence as `reconnecting`.
2. A grace period timer (30 seconds) is initiated.
3. If the user reconnects within 30 seconds with their valid meeting token:
   - The participant's record is preserved (joined timestamp, role, pinned states, hand raised).
   - Presence transitions back to `connected`.
   - The room receives an update without removing/re-adding the user tile.
4. If the timer expires without a reconnect:
   - Presence transitions to `disconnected` / `left`.
   - WebRTC SFU producers/consumers are cleaned up.
   - Sockets in the room receive the departure notification.

---

## 3. Duplicate Protection & Re-Sync

### 3.1 Idempotent State Reconciliation
- On reconnect, clients do not re-emit speculative joins.
- Client calls `meetingCollaborationService.syncState(meetingId)`.
- Server returns the single source-of-truth participant array and active hand states.
- Client replaces or reconciles existing participant list, ensuring **zero duplicate participant entries** in the UI.

### 3.2 Chat & Event Deduplication
- Re-joining does not duplicate chat history. Chat utilizes Phase 6/14 sequence tracking and message IDs.
- Ephemeral reactions received during the disconnection window are discarded naturally (non-durable).

---

## 4. Subsystem Isolation During Reconnection
- **Signaling Drop vs. Media Drop**:
  - If the WebSocket disconnects but the WebRTC ICE connection remains intact: WebRTC audio/video continues playing seamlessly while the socket client reconnects in the background.
  - If WebRTC reconnects (ICE restart): Chat and hand raise controls remain fully functional.
  - Failure in one subsystem never cascades into a fatal abort of the entire meeting.
