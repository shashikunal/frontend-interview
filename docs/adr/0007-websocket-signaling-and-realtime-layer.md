# ADR 0007: Socket.IO Realtime Signaling and Isolation from Media Plane

## Status
Accepted

## Context
Realtime interactions in collaborative technical interviews encompass text chat, active speaker highlights, whiteboard vectors, code editor document sync (Yjs), emoji reactions, and host moderation commands (mute, kick). These require bi-directional, low-latency, event-driven transport with automatic fallback to HTTP long-polling when strict enterprise firewalls block raw WebSockets.

## Decision
Adopt **Socket.IO** (`api/socket.js`, `server/socket/index.ts`) as the primary real-time communication engine:
1. **Authentication & Room Authorization**:
   - Every connection handshake validates a short-lived HMAC-SHA256 meeting/access JWT.
   - Socket connections join isolated meeting rooms (`meet:${meetingId}`) only after checking user permissions.
   - Cross-room packet leakage and unauthorized eavesdropping are blocked by server-side room guards.
2. **Rate Limiting & Abuse Prevention**:
   - Token-bucket rate limiting restricts emoji reactions (5 per 5s) and text messages (10 per 10s).
   - Strict input validation sanitizes text (`<script>` to `&lt;script&gt;`) and restricts reaction payloads to an approved emoji allowlist (`👍`, `👏`, `❤️`, `😂`, `🎉`).
3. **Strict Media Plane Isolation**:
   - Socket.IO carries ONLY application metadata, signaling, chat, and collaborative delta events.
   - Raw RTP video and audio streams route exclusively through the WebRTC SFU (ADR 0002).
   - If the Socket.IO connection drops or disconnects, active WebRTC video and audio tracks remain completely uninterrupted.
4. **Horizontal Scaling**:
   - Multi-node deployments use the `@socket.io/redis-adapter` to broadcast events across server instances via Redis Pub/Sub channels.

## Alternatives Considered
- **Raw WebSockets (`ws` library)**: Lacks built-in room isolation, auto-reconnection backoff, and HTTP long-polling fallback for corporate proxy environments.
- **Server-Sent Events (SSE)**: Unidirectional only; requires a separate HTTP POST channel for client-to-server messages, doubling network roundtrips.

## Trade-offs
- *Pros*: Battle-tested reconnection resilience, native room multiplexing, automated HTTP fallback, seamless Redis adapter clustering.
- *Cons*: Slight protocol packet wrapper overhead compared to raw WebSockets.

## Consequences
- Chat glitches or temporary signaling reconnects do not disrupt live media streaming.
- Host moderation actions (remote mute, kick) execute instantaneously across all room participants.
