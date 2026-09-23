# Disaster Recovery Plan
## InterviewPrep Platform — Phase 14: Reliability, Resilience & Disaster Recovery

**Owner:** Platform Engineering  
**Last updated:** 2026-09-23  
**Classification:** Internal Operations

---

## 1. Recovery Objectives

| Metric | Target | Notes |
|---|---|---|
| **RPO** (Recovery Point Objective) | **1 hour** | Maximum data loss acceptable; achieved via Supabase automated hourly snapshots |
| **RTO** (Recovery Time Objective) | **15 minutes** | Maximum downtime to restore service; achieved via graceful shutdown + auto-reconnect |
| **MTTR** (Mean Time to Recovery) | **< 10 minutes** | For non-DB failures (Redis, Kafka, WebSocket) with fallback layers |
| **Availability Target** | **99.5%** | ≤ 3.65 hours/month scheduled or unscheduled downtime |

---

## 2. Incident Severity Classification

| Severity | Definition | Example | Target RTO |
|---|---|---|---|
| **P1 — Critical** | Complete service unavailability | Supabase down, Auth broken | 15 min |
| **P2 — Major** | Core feature unavailable | Meetings unavailable, WebSocket offline | 30 min |
| **P3 — Degraded** | Non-critical feature degraded | Redis offline (fallback active), Kafka fallback | 2 hours |
| **P4 — Minor** | Single user or cosmetic issue | One socket disconnected | Best-effort |

---

## 3. Failure Scenarios & Recovery Playbooks

### 3.1 Scenario: PostgreSQL / Supabase Outage

**Detection:** `/api/v1/health/dependencies` returns `database: DOWN` or `DEGRADED`

**Impact:** Authentication, meeting data, candidate history unavailable

**Recovery Steps:**
1. Check [Supabase Status Page](https://status.supabase.com)
2. If regional outage: wait for Supabase restoration (no customer action required)
3. If config error (wrong env vars): update `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` and redeploy
4. If data corruption: trigger Point-in-Time Recovery (see `backup-restore.md`)
5. Verify with: `curl https://[app]/api/v1/health/dependencies`

**Graceful Degradation:**
- Application returns structured errors instead of crashing
- Static pages and auth-free routes continue serving
- `postgresCircuitBreaker` prevents retry storms

---

### 3.2 Scenario: Redis Outage

**Detection:** `/api/v1/health/dependencies` returns `redis: DEGRADED`

**Impact:** Presence tracking shows stale; rate limiting uses in-memory fallback (weaker)

**Recovery Steps:**
1. Redis in-memory fallback is **automatically active** — no immediate action needed
2. Restart Redis instance: `redis-server` or reconnect to Redis Cloud instance
3. Application auto-reconnects via `ioredis` retry strategy
4. Presence rebuilds within 30s as clients heartbeat

**No user intervention required for P3 severity.**

---

### 3.3 Scenario: Kafka Broker Outage

**Detection:** `/api/v1/health/dependencies` returns `kafka: DEGRADED`

**Impact:** Events buffered in outbox; notifications delayed

**Recovery Steps:**
1. Resilient fallback is **automatically active** — events queued in memory
2. Restart Kafka broker
3. `KafkaClientManager` auto-reconnects; outbox poller replays pending events
4. Monitor: `outboxPending` counter in health endpoint drops to 0

**No data loss for events recorded in outbox before broker restart.**

---

### 3.4 Scenario: WebSocket Server Restart

**Detection:** All Socket.IO clients disconnect simultaneously

**Impact:** Active meeting sessions interrupted; collaborative editors reset

**Recovery Steps:**
1. Clients auto-reconnect within 5–30s (Socket.IO reconnect policy)
2. Meeting in-memory state is **reset on restart** — participants must rejoin
3. Chat history is lost for the current session (persisted messages remain in DB)

**RTO: < 30 seconds (automatic client reconnect)**

---

### 3.5 Scenario: Full Application Server Crash

**Detection:** All health endpoints unreachable; Vercel deployment error

**Recovery Steps:**
1. Check Vercel deployment logs: `vercel logs`
2. If crashing on startup: check for missing env variables (`VITE_SUPABASE_URL`, `JWT_SECRET`)
3. Roll back to last stable deployment: `vercel rollback`
4. Redeploy: `vercel deploy --prod` (or push to `main` branch if CI/CD is configured)
5. Verify: `curl https://[app]/api/v1/health/live`

---

### 3.6 Scenario: Security Breach / Token Compromise

**Detection:** Suspicious activity in audit logs; unauthorized admin access

**Recovery Steps:**
1. **Immediately**: Rotate `JWT_SECRET` and `ADMIN_SECRET` in Vercel environment variables
2. Redeploy application (invalidates all existing tokens)
3. Review audit logs: `/api/v1/admin/audit-logs`
4. Reset affected user accounts via Supabase Dashboard
5. Review CORS and rate limiter config

> [!CAUTION]
> Rotating `JWT_SECRET` invalidates **all active sessions**. All users must re-login.

---

## 4. Runbook: Full DR Drill

Execute quarterly to validate recovery capability.

```bash
# Step 1: Simulate Redis failure
# Set REDIS_URL to an invalid address in .env, restart server
# Expected: redis status = DEGRADED, app continues serving

# Step 2: Simulate Kafka failure
# Set KAFKA_BROKERS to an invalid address
# Expected: kafka status = DEGRADED, outbox buffers events

# Step 3: Simulate outbox failure
# node scripts/test-phase14-reliability.mjs --simulate-outbox-failure
# Expected: retries with backoff, events eventually published or DLQ'd

# Step 4: Simulate stale sockets
# node scripts/test-phase14-reliability.mjs --simulate-stale-sockets
# Expected: heartbeat watchdog disconnects stale sockets after 2 missed pings

# Step 5: Restore normal operation
# Revert env variables, restart server
# Verify: curl http://localhost:5173/api/v1/health/dependencies
```

---

## 5. Communication Plan

| Audience | Channel | Trigger |
|---|---|---|
| Internal team | Slack #incidents | Any P1/P2 |
| End users | Status page banner | P1 > 5min |
| Stakeholders | Email | P1 > 15min |

---

## 6. Post-Incident Review

After every P1/P2 incident:
1. Complete within 48 hours of resolution
2. Document in `docs/adr/` as an Architecture Decision Record
3. Update this DR plan with lessons learned
4. Add regression test to Phase 14 test suite

---

## 7. Dependencies & Contacts

| Dependency | Provider | Status Page |
|---|---|---|
| PostgreSQL | Supabase | https://status.supabase.com |
| Hosting/CDN | Vercel | https://www.vercel-status.com |
| Redis | Self-hosted / Redis Cloud | Provider-specific |
| Kafka | Self-hosted / Confluent | Provider-specific |
| Email | Resend | https://status.resend.com |
| WebRTC/SFU | LiveKit | https://status.livekit.io |
