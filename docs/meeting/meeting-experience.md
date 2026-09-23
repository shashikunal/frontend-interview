# Phase 16: Meeting Experience & Architecture Guide

**Document:** `docs/meeting/meeting-experience.md`  
**Status:** Implemented & Verified  
**Scope:** Phase 16 — Advanced Meeting Collaboration & Media Experience  

---

## 1. Architectural Model & Plane Separation

The collaboration platform implements a strict separation of concerns between the **Control Plane** and the **Media Plane**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                       AUTHENTICATED CLIENT BROWSER                     │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼ Control Plane (Signaling)       ▼ Media Plane (RTP/SRTP)
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│  Socket.IO / HTTPS REST Gateway      │  │  WebRTC Selective Forwarding │
│  - Authentication & JWT Validation   │  │  Unit (SFU) Media Node       │
│  - Authoritative Participant Roster  │  │  - Low-Latency Opus Audio    │
│  - Hand Raise State & Moderation     │  │  - Adaptive VP8/H.264 Video  │
│  - Ephemeral Emoji Reactions         │  │  - Dynamic Screen Share Track│
│  - In-Meeting Chat & Announcements   │  │  - Audio Analyzer & Levels   │
└──────────────────┬───────────────────┘  └──────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  Durable Persistence & Events        │
│  - PostgreSQL: Durable Meetings      │
│  - Redis: Ephemeral Presence/Buckets │
│  - Kafka Outbox: Lifecycle Events    │
└──────────────────────────────────────┘
```

### Media Plane Rule
Media bytes (audio, video, screen share) are **never** transmitted through PostgreSQL, Redis, Kafka, or ordinary REST APIs. Only the dedicated SFU media plane routes media streams.

---

## 2. Standardized Participant Model

Every participant in the meeting is tracked across both client and server using a unified, normalized state model:

| Field | Type | Description | Authoritative Source |
| :--- | :--- | :--- | :--- |
| `userId` | `string` | Unique identifier of participant | Server Auth JWT |
| `socketId` | `string` | Active WebSocket socket connection ID | Socket Server |
| `displayName` | `string` | Display name of candidate or interviewer | Server Profile / Token |
| `avatarUrl` | `string?` | Optional avatar image URL | Server Profile / Token |
| `role` | `'HOST' \| 'CO_HOST' \| 'PARTICIPANT' \| 'OBSERVER'` | In-meeting RBAC role | Meeting Token Claims |
| `micState` | `boolean` | Microphone publishing status (`true` = unmuted) | Local Device + Server Signal |
| `cameraState` | `boolean` | Camera publishing status (`true` = on) | Local Device + Server Signal |
| `screenShareState` | `boolean` | Screen share publishing status | Local Device + Server Signal |
| `handRaised` | `boolean` | Current hand raised status | Server Realtime State |
| `handRaisedAt` | `string?` | ISO timestamp when hand was raised | Server Realtime State |
| `connectionState` | `'online' \| 'joining' \| 'connected' \| 'reconnecting' \| 'disconnected' \| 'left'` | Current presence state | Server Presence Engine |
| `connectionQuality` | `'EXCELLENT' \| 'GOOD' \| 'POOR' \| 'LOST'` | WebRTC network telemetry grade | Client WebRTC Telemetry |
| `joinedAt` | `string` | ISO timestamp when user joined call | Server Realtime State |
| `leftAt` | `string?` | ISO timestamp when user left call | Server Realtime State |

---

## 3. Presence States & Transitions

```
[JOINING]
    │
    ▼ (WebRTC & Socket connected)
[CONNECTED] ◄────────┐
    │                │ (Network recovered)
    ▼ (Interruption) │
[RECONNECTING] ──────┘
    │ (Timeout / Socket close)
    ▼
[DISCONNECTED]
    │ (Explicit leave / Kicked)
    ▼
  [LEFT]
```

Presence states are synchronized to all participants in real time over WebSocket room broadcasts.

---

## 4. Failure Isolation Architecture

1. **Chat Failure Isolation:** If the chat WebSocket encounters network degradation or fails, ongoing WebRTC audio and video streams remain completely uninterrupted.
2. **Media Reconnect Isolation:** If media tracks reconnect or renegotiate, the in-meeting chat history and message drawer remain intact without message duplication or state loss.
3. **Subsystem Independence:** Device unplug (e.g. camera disconnected) degrades gracefully by displaying a camera off placeholder while audio continues without call drop.
