# ADR 0001: Modular Monolith Architecture vs. Microservices

## Status
Accepted

## Context
The platform requires rich collaboration features: meeting scheduling, participant admission, WebRTC signaling, in-meeting chat, direct/group application messaging, collaborative whiteboarding, recording, transcription, and administrative oversight. Designing this system as 8+ microservices would introduce excessive operational overhead (service discovery, distributed transactions, inter-service network hops, network serialization, and deployment complexity) for a unified web application.

## Decision
Adopt a **Modular Monolith** architecture:
1. **Single Deployable Container & Monolithic Backend**: The application backend runs as a single, cohesive Node.js/TypeScript process encapsulated within clearly separated domain modules:
   - `server/auth/`: Authentication, tokens, and RBAC guards.
   - `server/meetings/`: Meeting lifecycle, admission guards, and media tokens.
   - `server/chat/`: Application and in-meeting messaging.
   - `server/media/`: Recording orchestrator and transcription pipeline.
   - `server/redis/`: Presence and rate limiting coordinator.
   - `server/kafka/`: Outbox poller, event publisher, and asynchronous consumers.
   - `server/observability/`: Metrics, structured logger, and health probes.
2. **In-Process Domain Decoupling**: Modules communicate via typed in-memory interfaces, transactional database tables, and the asynchronous Kafka event bus, avoiding point-to-point HTTP couplings between internal modules.
3. **Stateless Scale-Out**: By externalizing ephemeral state to Redis and durable state to PostgreSQL, multiple instances of the modular monolith can scale horizontally behind a load balancer.

## Alternatives Considered
- **Microservices (8 independent services)**: Rejected due to distributed transaction complexity, network latency, high infrastructure costs, and unnecessary deployment orchestration overhead.
- **Pure Serverless / Edge Functions**: Incompatible with persistent WebSocket connections, WebRTC signaling state, and background outbox polling threads.

## Trade-offs
- *Pros*: Extreme developer velocity, shared TypeScript types across frontend and backend, single-command local development via Docker Compose, zero network latency for internal module calls.
- *Cons*: Requires strict discipline to prevent circular imports between domains; memory leaks in one module could impact the shared process if uncontained.

## Consequences
- Clean domain boundaries are maintained via isolated service folders in `server/`.
- Cross-cutting concerns (auth, rate limiting, logging, tracing) are applied uniformly through standard Express/Connect middleware.
