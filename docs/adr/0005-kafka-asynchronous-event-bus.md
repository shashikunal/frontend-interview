# ADR 0005: Apache Kafka Asynchronous Event Bus and DLQ Routing

## Status
Accepted

## Context
Cross-domain workflows—such as notifying candidates when a meeting is scheduled, triggering asynchronous transcription when a recording completes, and emitting compliance audit records—must not execute synchronously inside HTTP request cycles. Direct synchronous coupling introduces high latency, cascading failures, and distributed state inconsistency if a downstream service fails.

## Decision
Adopt **Apache Kafka** (via `kafkajs`) as the asynchronous, distributed event backbone:
1. **Domain Topics**:
   - `meeting.events`: Meeting lifecycle events (`MeetingCreated.v1`, `MeetingStarted.v1`, `MeetingEnded.v1`, `MeetingCancelled.v1`). Partition key: `meetingId`.
   - `chat.events`: High-level messaging audit events. Partition key: `conversationId`.
   - `notification.events`: Asynchronous email, SMS, and in-app alerts. Partition key: `userId`.
   - `media.events`: Recording completed and transcription events (`RecordingCompleted.v1`). Partition key: `recordingId`.
   - `audit.events`: Security and administrative compliance logs. Partition key: `actorId`.
2. **Consumer Group Isolation**: Separate consumer groups (`notification-worker-group`, `transcription-worker-group`, `audit-worker-group`) read independently at their own pace without head-of-line blocking.
3. **Dead-Letter Queue (DLQ)**: Poison messages or permanent processing errors route to `{topic}.dlq` after exponential retries (up to 3 attempts with jitter), preventing consumer crash loops.
4. **Prohibited Workloads**: Kafka is strictly prohibited from transporting raw audio/video WebRTC media streams, normal synchronous HTTP request/response payloads, or low-latency typing events.

## Alternatives Considered
- **RabbitMQ**: Simpler for point-to-point queues, but lacks Kafka's immutable event log replayability and high-throughput partition ordering guarantees.
- **AWS SQS/SNS**: Cloud-vendor proprietary lock-in; unsuited for open-source self-hosted container deployments.

## Trade-offs
- *Pros*: Complete decoupling of producers and consumers, guaranteed per-partition ordering, replayable event logs, fault isolation.
- *Cons*: Operational complexity of Kafka/ZooKeeper/KRaft broker cluster.

## Consequences
- Upstream HTTP endpoints return sub-50ms responses because heavy downstream work is queued on Kafka.
- Producer outages are prevented via the Transactional Outbox pattern (ADR 0006).
