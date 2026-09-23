# Phase 11 — Observability, Health & Audit Runbook

## 1. Architecture Overview

Phase 11 introduces a comprehensive, production-grade observability and operational telemetry subsystem:

```
                          ┌──────────────────────────────────────────────┐
                          │                Client Request                │
                          └──────────────────────┬───────────────────────┘
                                                 │ X-Request-Id / traceparent
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Express / HTTP & Socket.IO Gateway                                                              │
│  - Correlation Context Provider (AsyncLocalStorage: requestId, correlationId, causationId)      │
│  - OpenTelemetry Trace Context (W3C traceparent generation / propagation)                       │
│  - Rate Limiting & Auth Gateways (Structured Security Auditing & Metric Emission)              │
└────────────────┬───────────────────────────────────────────────────────────────┬────────────────┘
                 │                                                               │
                 ▼                                                               ▼
┌─────────────────────────────────┐                             ┌─────────────────────────────────┐
│ Prometheus Metrics Registry     │                             │ Durable Audit Logging           │
│  - Low-cardinality counters     │                             │  - PostgreSQL public.audit_logs │
│  - Latency histograms (p50/p95) │                             │  - Append-only immutability     │
│  - Gauge indicators (active WS) │                             │  - In-memory resilient buffer   │
└────────────────┬────────────────┘                             └────────────────┬────────────────┘
                 │                                                               │
                 ▼                                                               ▼
        /api/v1/metrics                                                   /api/v1/audit
  (Prometheus scrape target)                                       (Admin operational viewer)
```

---

## 2. Core Components Inventory

| Module | File Path | Purpose |
|---|---|---|
| **Types & Contracts** | `server/observability/types.ts` | Type definitions for logs, audits, metrics, health, and traces |
| **Correlation Context** | `server/observability/correlation.ts` | AsyncLocalStorage-backed `requestId`, `correlationId`, W3C traceparent |
| **Structured Logger** | `server/observability/logger.ts` | JSON structured logging, log level filtering, credential redaction |
| **OpenTelemetry Tracing** | `server/observability/tracing.ts` | Distributed span management, trace parent propagation, error tracking |
| **Prometheus Metrics** | `server/observability/metrics.ts` | Bounded-cardinality Prometheus registry & metrics collector |
| **Durable Audit Logger** | `server/observability/auditService.ts` | PostgreSQL `audit_logs` append-only logger with in-memory fallback |
| **Health & Readiness** | `server/observability/healthService.ts` | Liveness, readiness, and dependency health checks |
| **Operational Alerting** | `server/observability/alerting.ts` | Threshold rules for API errors, outbox lag, Kafka DLQ, Redis state |
| **System Health UI** | `src/components/dashboard/admin/AdminSystemHealthTab.tsx` | Real-time Admin Health & Audit inspection dashboard |

---

## 3. Endpoints & Telemetry Contract

### 3.1. Liveness Probe (`GET /api/v1/health`)
- **Status 200**: App process is running and accepting event loop cycles.
- **Payload**:
  ```json
  {
    "status": "HEALTHY",
    "uptimeSeconds": 1420.5,
    "timestamp": "2026-09-23T06:00:00.000Z",
    "version": "1.0.0",
    "environment": "production"
  }
  ```

### 3.2. Readiness Probe (`GET /api/v1/health/ready`)
- **Status 200**: App and critical dependencies (PostgreSQL) are operational.
- **Status 200 (Degraded)**: Optional dependencies (Redis, Kafka) are in fallback mode; requests can still proceed.
- **Status 503**: Critical dependency (PostgreSQL) is unreachable.

### 3.3. Dependency Deep Health (`GET /api/v1/health/dependencies`)
- Evaluates PostgreSQL, Redis, Kafka, Socket.IO, Notifications, and SFU.
- Evaluates active operational alerts (e.g., consumer lag, outbox backlog).

### 3.4. Prometheus Scrape Target (`GET /api/v1/metrics`)
- Standard Prometheus text exposition format (version 0.0.4).
- Scraped by Prometheus agents every 15s.

### 3.5. Audit Inspection (`GET /api/v1/audit`)
- **Access**: Strictly gated to `admin` role via RBAC middleware.
- **Filtering**: `action`, `actorUserId`, `resourceType`, `resourceId`, `limit`, `offset`.

---

## 4. Privacy & Credential Redaction Rules

The logging and tracing layers automatically redact sensitive keys matching:
- `password`, `token`, `secret`, `authorization`, `cookie`, `apiKey`, `key`, `credential`, `database_url`, `redis_url`, `refreshToken`, `accessToken`.
- Message content bodies are NEVER dumped into metric labels or logs without deliberate truncation and hashing.
- Metric labels are strictly bounded (status codes, predefined actions, error categories). No raw `userId`, `conversationId`, or `messageId` in metric labels.

---

## 5. Diagnostic Runbooks & Troubleshooting

### 5.1. How do I diagnose a Meeting Join Failure?
1. Inspect response headers from the join request for `X-Request-Id` and `X-Correlation-Id`.
2. Search structured logs:
   ```bash
   grep '"action":"MEETING_JOIN_ATTEMPT"' logs/app.log | grep '<correlationId>'
   ```
3. Check Prometheus metrics:
   - `meeting_join_total{status="failure",role="..."}`
4. Check Audit logs via Admin Dashboard under "System Health" -> "Audit Logs" or:
   ```bash
   curl -H "Authorization: Bearer <adminToken>" "http://localhost:3000/api/v1/audit?action=MEETING_JOIN_FAILED"
   ```
5. If SFU token error: check SFU health in `/api/v1/health/dependencies`.

### 5.2. How do I diagnose Chat Delivery Failure?
1. Check WebSocket connection gauge in Prometheus:
   - `websocket_active_connections`
2. Check message rejection metric:
   - `chat_messages_total{status="rejected"}`
3. Filter structured logs for `CHAT_MESSAGE_DELIVERY_FAILURE`:
   ```bash
   grep '"errorCategory":"DEPENDENCY_FAILURE"' logs/app.log
   ```
4. Verify Redis presence and pub/sub health:
   ```bash
   curl "http://localhost:3000/api/v1/health/dependencies"
   ```

### 5.3. How do I diagnose Kafka Consumer Lag?
1. Query `/api/v1/health/kafka` and `/api/v1/health/dependencies`.
2. Inspect Prometheus metric `kafka_consumer_lag_events`.
3. Check Outbox Backlog gauge: `kafka_outbox_backlog_records`.
4. If outbox backlog > 50, alert `OUTBOX_BACKLOG_HIGH` will fire.
5. Action: Check if Kafka brokers are reachable at configured port; verify worker partition balancing.

### 5.4. How do I diagnose Notification Failure?
1. Inspect metric `notification_deliveries_total{channel="push|email",status="failure"}`.
2. Check `notification_dlq_count` in Prometheus.
3. Review structured logs with `operation: "notification_dispatch"`:
   ```bash
   grep '"operation":"notification_dispatch"' logs/app.log | grep '"level":"ERROR"'
   ```
4. Verify provider API quotas or credentials in environment variables (`RESEND_API_KEY`, `WEB_PUSH_VAPID_KEY`).

### 5.5. How do I diagnose Redis Failure?
1. Check `/api/v1/health/dependencies` -> `dependencies.redis`.
2. If state is `DEGRADED`, verify whether in-memory fallback layer is serving cache & rate limiting.
3. Inspect `redis_command_errors_total` counter in Prometheus.
4. Check Redis server connectivity:
   ```bash
   redis-cli -u $REDIS_URL ping
   ```

### 5.6. How do I diagnose Database Failure?
1. Check readiness endpoint: `GET /api/v1/health/ready`. If returning 503, database connectivity is down.
2. Query `/api/v1/health/dependencies` -> `dependencies.database.metrics`.
3. Review connection pool count and latency.
4. Filter structured logs for `DATABASE_CONNECTION_ERROR` or `query_timeout`.
5. Check Supabase / PostgreSQL server status, network firewall, or connection pool limits.

---

## 6. Audit Immutability & Retention Policy

1. **Storage**: Durable rows stored in PostgreSQL `public.audit_logs`.
2. **Access Control**: Row Level Security (RLS) ensures only users with `role = 'admin'` have `SELECT` access.
3. **No Modification / Deletion**: Normal users have `0` access. Database policies forbid `UPDATE` and `DELETE` on `audit_logs` during normal operations.
4. **Retention Window**:
   - Hot storage: 90 days in active `public.audit_logs` table.
   - Cold archive: Automated cron exports records older than 90 days to encrypted S3 / cold storage, partitioned by month.
   - Indexing: `CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);`
   - Truncation/Pruning: Strictly forbidden for non-superuser database connections.
