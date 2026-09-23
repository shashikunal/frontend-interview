# Phase 17 — Recording Architecture & Lifecycle State Machine

## 1. Overview & Architectural Boundaries

The recording pipeline decouples media streaming from control plane management and asynchronous background processing:

```
[Media Plane: WebRTC/SFU] ───(Egress Stream)───> [Object Storage (MinIO/S3)]
                                                         │
                                               (Upload Completed)
                                                         │
[Meeting Host/Admin] ──> [Control Plane] ────────> [Transactional Outbox]
                             │                           │
                   (PostgreSQL Metadata)                 ▼
                             │                 [Kafka: recording.events]
                             │                           │
                             │                           ▼
                             └─────────────────> [Media Processing Worker]
                                                         │
                                                (Audio Extraction &
                                                 Whisper Transcription)
                                                         │
                                                         ▼
                                            [Durable Transcripts + Notification]
```

### Strict Plane Isolation:
* **Media Plane**: High-throughput audio and video streams flow directly into object storage via egress sinks.
* **Control Plane**: REST and WebSocket APIs govern lifecycle state transitions, permissions, and metadata persistence.
* **Never**: Raw media blobs are never passed to PostgreSQL, Redis, Kafka, or REST JSON payloads.

---

## 2. Recording Lifecycle State Machine

The recording lifecycle enforces strict, deterministic transitions:

```
   [NOT_STARTED]
         │
         ▼  (Host/Admin starts recording)
    [RECORDING]
         │
         ▼  (Host/Admin stops recording OR meeting ends)
    [STOPPING]
         │
         ▼  (Media finalized & uploaded to Object Storage)
    [PROCESSING] ──(Validation, Audio Extraction, Whisper STT)──┐
         │                                                      │
         ├───────────────────────────────────────┐              │
         ▼ (Processing succeeded)                ▼ (Failed)     │
      [READY]                                 [FAILED]          │
         │                                       │              │
         └───────────────┬───────────────────────┘              │
                         │                                      │
                         ▼ (Host/Admin deletes)                 │
                     [DELETED] <────────────────────────────────┘
```

### Valid Transition Matrix
| From State | Allowed Target States | Trigger |
| :--- | :--- | :--- |
| `NOT_STARTED` | `RECORDING` | Privileged start command verified |
| `RECORDING` | `STOPPING`, `FAILED` | Stop command issued or media stream interrupted |
| `STOPPING` | `PROCESSING`, `FAILED`| Egress sink finalized or timed out |
| `PROCESSING` | `READY`, `FAILED` | Background worker validates media and completes transcription |
| `READY` | `DELETED` | Privileged deletion |
| `FAILED` | `DELETED`, `PROCESSING` | Manual retry or deletion |
| `DELETED` | None | Terminal state |

---

## 3. Idempotency & Concurrency Protection
* **Double-Start Protection**: Calling start on an already active recording returns the existing session record idempotently without creating duplicate files.
* **Double-Stop Protection**: Consecutive stop requests transition the state once; subsequent calls return the in-flight `STOPPING` or `PROCESSING` state.
* **Meeting Termination Hook**: When a meeting concludes (`transitionStatus -> ENDED`), any active recording automatically transitions to `STOPPING` asynchronously without blocking the meeting termination API.
