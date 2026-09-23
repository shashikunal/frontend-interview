# ADR 0004: Redis Ephemeral Presence, Coordination, and Rate Limiting

## Status
Accepted

## Context
Real-time collaboration introduces high-frequency transient state updates: online/offline presence heartbeats, typing indicators, active speaker highlights, and API rate limiting tokens. Routing these transient updates directly to PostgreSQL would cause severe disk I/O bottlenecking, database connection pool exhaustion, and lock contention.

## Decision
Utilize **Redis 7** exclusively for **ephemeral, coordination, and high-frequency caching workloads**:
1. **Key Families & TTL Strategy**:
   - `presence:user:{userId}`: User online status and heartbeat timestamp (`TTL: 60s`).
   - `presence:meeting:{meetingId}`: Redis Set of active socket connections in the meeting room (`TTL: 120s`).
   - `ratelimit:{ip}:{endpoint}`: Sliding-window / token-bucket rate counters (`TTL: 60s`).
   - `lock:meeting:{meetingId}`: Distributed mutex for meeting state machine transitions (`TTL: 10s`).
   - `cache:metrics:operational`: Aggregated admin metrics cached for fast retrieval (`TTL: 15s`).
2. **Eviction Policy**: Configured with `maxmemory-policy allkeys-lru` to ensure memory exhaustion gracefully prunes stale presence records rather than rejecting writes.
3. **Resilient Local Fallback**: When Redis is temporarily unreachable, the `server/redis/redisClient.ts` layer automatically activates an in-memory Map fallback. This guarantees that local development and single-instance deployments function reliably without crashing.

## Alternatives Considered
- **In-Memory JavaScript State Only**: Fails across multi-process or multi-container deployments where socket connections are distributed across multiple backend nodes.
- **PostgreSQL Unlogged Tables**: Higher latency (>5ms) compared to sub-millisecond in-memory Redis queries.

## Trade-offs
- *Pros*: Sub-millisecond latency for presence and rate checks, atomic increment (`INCR`) and TTL expiry operations, built-in Pub/Sub for cross-node Socket.IO adapters.
- *Cons*: Additional infrastructure dependency; state is non-durable and will be lost on container restart (acceptable by design for ephemeral presence).

## Consequences
- Redis is strictly forbidden from holding primary durable domain records.
- Redis outages degrade presence to local memory without corrupting PostgreSQL database transactions.
