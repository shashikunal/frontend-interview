# ADR 0003: PostgreSQL Authoritative Source of Truth

## Status
Accepted

## Context
A mission-critical collaboration platform requires strong consistency, transactional ACID guarantees, relational integrity, and durable audit logs for users, meetings, participant admission, messaging history, and recording metadata. Ephemeral stores (such as Redis or browser localStorage) cannot be trusted as authoritative durable storage.

## Decision
Designate **PostgreSQL** (via Supabase Managed Postgres) as the **Sole Durable Source of Truth**:
1. **Durable Entities**:
   - `users`: User identities, hashed credentials, roles (`admin`, `candidate`, `interviewer`), and entitlements.
   - `meetings`: Meeting metadata, lifecycle state (`SCHEDULED`, `STARTED`, `ACTIVE`, `ENDED`, `CANCELLED`), hosts, and configuration settings.
   - `meeting_invitations`: Secure invitation tokens, hashed join secrets, expiration timestamps, and admission status.
   - `meeting_messages` & `chat_messages`: Immutable, durable chat history with sanitized text payloads.
   - `recordings` & `transcripts`: Recording lifecycle state, object storage keys, duration, file sizes, and GIN indexed Whisper transcripts.
   - `outbox_events`: Transactional outbox log for Kafka event dispatching.
   - `audit_logs`: Append-only compliance log recording all administrative and lifecycle mutations.
2. **Relational Constraints & Foreign Keys**: Mandatory `FOREIGN KEY ... ON DELETE CASCADE/SET NULL`, unique indexes on email and invitation tokens, and schema check constraints enforce domain validity at the storage layer.
3. **No Blind Fallbacks**: Business state is never written solely to Redis or localStorage; in offline or disconnected scenarios, durable mutations fail gracefully rather than silently masquerading as saved.

## Alternatives Considered
- **NoSQL Document Database (MongoDB/DynamoDB)**: Rejected due to lack of multi-entity ACID transactions across meeting creation and outbox publishing, and complex relational integrity enforcement.
- **Redis as Primary Store**: Rejected because Redis persistence (RDB/AOF) does not guarantee zero data loss under crash scenarios and lacks relational query capabilities.

## Trade-offs
- *Pros*: Complete ACID transactional guarantees, declarative foreign key constraints, rich full-text search (pg_trgm and GIN indexing on transcripts), rock-solid point-in-time recovery (WAL archiving).
- *Cons*: Requires connection pooling (`pgbouncer`) to handle thousands of concurrent server connections.

## Consequences
- Every critical domain transaction commits to PostgreSQL first before publishing to Kafka or signaling clients.
- If Redis restarts or crashes, PostgreSQL ensures zero durable state loss.
