# ADR 0006: Transactional Outbox Pattern for Distributed State Consistency

## Status
Accepted

## Context
When a critical state mutation occurs (such as creating a meeting or stopping a recording), two actions must happen:
1. Update the database state in PostgreSQL.
2. Publish an event to Kafka.
If the application commits to the database but crashes before publishing to Kafka (Dual-Write problem), downstream consumers never receive the event. Conversely, if the application publishes to Kafka first and the database transaction rolls back, downstream systems process an event that technically never happened (phantom state).

## Decision
Implement the **Transactional Outbox Pattern** (`server/kafka/outboxService.ts`):
1. **Atomic In-Transaction Insert**:
   - Within the exact same database transaction that creates/modifies a business entity, an outbox record is inserted into the `outbox_events` table with `status = 'PENDING'`.
   - If the business transaction rolls back, the outbox record rolls back with it, guaranteeing zero phantom events.
2. **Reliable Outbox Publisher**:
   - A dedicated background poller queries `outbox_events` for `PENDING` records in batches (e.g. 50 items).
   - The publisher transmits each event to Kafka using `kafkaClient.publish()`.
   - Upon successful broker acknowledgement, the record is transitioned to `status = 'PUBLISHED'` with `publishedAt` timestamp.
3. **Resilience & Circuit Breaker**:
   - If the Kafka broker is unavailable or errors out, the outbox record is marked `status = 'FAILED'`, its `retryCount` is incremented, and exponential backoff is scheduled.
   - The event remains safely persisted in PostgreSQL until Kafka connectivity recovers.
4. **Idempotent Consumers**:
   - All event envelopes include a globally unique `eventId` and `correlationId`. Consumers store processed `eventId`s to ensure duplicate deliveries are skipped safely.

## Alternatives Considered
- **Direct Dual-Write**: Publishing directly to Kafka inside the controller. Rejected due to vulnerability to network partitions and dual-write state drift.
- **Change Data Capture (Debezium)**: Viable for large enterprise deployments, but adds heavy operational complexity (Kafka Connect cluster) compared to an application-level outbox poller.

## Trade-offs
- *Pros*: Guarantees at-least-once event delivery, eliminates dual-write anomalies, isolates database transactions from Kafka broker latency.
- *Cons*: Introduces slight delivery latency (polling interval ~2s) and requires periodic pruning of historical `PUBLISHED` records.

## Consequences
- No critical domain event can ever be lost due to a transient Kafka network glitch.
- Meeting and user transactions complete with 100% ACID consistency.
