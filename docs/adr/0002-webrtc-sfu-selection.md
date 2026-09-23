# ADR 0002: WebRTC Selective Forwarding Unit (SFU) Media Architecture

## Status
Accepted

## Context
High-definition video and audio collaboration for technical interviews requires low latency (<200ms glass-to-glass), multi-party scalability (up to 50 participants per room), and dynamic bitrate adaptation (simulcast / SVC). Peer-to-peer (Mesh) architecture scales at $O(N^2)$ uplink bandwidth, which collapses consumer browser connections beyond 3–4 participants. Multipoint Control Units (MCU) transcode all streams on the server, requiring high CPU and GPU infrastructure costs.

## Decision
Adopt a **Selective Forwarding Unit (SFU)** media plane with **LiveKit** as the primary media server:
1. **Media Plane Isolation**: Raw audio and video RTP streams route exclusively through the SFU. Under zero circumstances do media packets flow through the application backend, PostgreSQL, Redis, or Kafka.
2. **Token-Based Signaling Handshake**: The application control plane (`server/meetings/mediaTokenService.ts`) authenticates users, validates meeting status, and generates cryptographic, short-lived media tokens containing ICE servers (STUN/TURN) and granular track permissions (`canPublishAudio`, `canPublishVideo`, `canSubscribe`).
3. **Simulcast & Dynamic Layer Switching**: The SFU inspects downlink network conditions and forwards appropriate resolution/framerate layers (1080p, 720p, 360p) without re-encoding media, minimizing server load.

## Alternatives Considered
- **Peer-to-Peer Mesh**: Rejected due to high client upstream bandwidth exhaustion in multi-party meetings.
- **MCU (Multipoint Control Unit)**: Rejected due to prohibitive transcoding compute costs and added transcoding latency.
- **Janus / mediasoup**: Viable SFU options, but LiveKit was selected for its modern WebRTC protocol compliance, built-in TURN/STUN coordination, active open-source ecosystem, and zero-configuration clustering via Redis.

## Trade-offs
- *Pros*: Scalable to dozens of participants, low server CPU overhead, sub-second room join times, automatic network quality adaptation.
- *Cons*: Requires running an external stateful media container (`livekit/livekit-server`) alongside the backend.

## Consequences
- Strict control-plane vs. media-plane boundary is enforced.
- Signaling failures or chat interruptions never drop or corrupt active WebRTC audio/video feeds.
