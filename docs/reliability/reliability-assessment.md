# Reliability Assessment — InterviewPrep Platform
## Phase 14: Reliability, Resilience & Disaster Recovery

**Date:** 2026-09-23  
**Version:** 1.0  
**Scope:** All platform subsystems (Phases 1–13)

---

## 1. Executive Summary

This document is the authoritative reliability audit for the InterviewPrep platform. It covers every production subsystem, maps failure modes and blast radius, assigns risk severity, and specifies the hardening measures implemented in Phase 14.

### Target SLA

| Metric | Target |
|--------|--------|
| **Availability** | 99.5% (≤ 3.65 hrs/month downtime) |
| **RPO (Recovery Point Objective)** | 1 hour |
| **RTO (Recovery Time Objective)** | 15 minutes |
| **MTTR (Mean Time to Recovery)** | < 10 minutes for non-DB failures |
| **Graceful Degradation** | All non-DB services degrade instead of crash |

---

## 2. Subsystem Failure Matrix

### 2.1 Frontend

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| JS bundle load failure (CDN) | Low | All users | Vercel CDN redundancy | — |
| Auth token expiry mid-session | Medium | Active users | Auto-refresh in `AuthProvider` | Verify refresh retry logic |
| WebSocket connection drop | High | Active meetings | Client reconnect on disconnect | Heartbeat watchdog |
| API fetch timeout | Medium | Feature degraded | `fetch` with no timeout | Add timeout wrapper |
| Stale React state after reconnect | Medium | Meeting users | — | Socket state reconciliation |

### 2.2 API Layer (Vercel Serverless)

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Uncaught async rejection | Medium | Request crash | None | Global unhandled rejection guard |
| Missing env variable | Low | Full service down | Startup check absent | Env validation at boot |
| Concurrent request overload | Low | Throttling | Rate limiter (Redis/memory) | Bulkhead on critical paths |
| Cold start latency spike | Medium | Timeout UX | — | Document; acceptable |
| CORS misconfiguration | Low | Browser block | `isOriginAllowed` guard | — |

### 2.3 Authentication & Token Service

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| JWT signing key missing | Low | All auth fails | Startup env check | Validate at boot |
| Token revocation store unavailable | Medium | Logout race | Redis fallback to memory | Circuit breaker on Redis check |
| Refresh token replay | Low | Account takeover | Rotation + revocation | Already hardened (Phase 13) |
| Clock skew > JWT `exp` drift | Low | Intermittent auth fail | 30s leeway in verify | — |

### 2.4 PostgreSQL (Supabase)

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Connection timeout | Medium | API 500s | Supabase managed pool | Retry with backoff on select queries |
| Query timeout (slow query) | Low | Request hang | No timeout | 5s query timeout enforcement |
| Supabase region outage | Very Low | Full DB down | — | Local in-memory fallback for read-heavy paths |
| RLS policy misconfiguration | Low | Data leak | RLS enabled + tested | — |
| Write conflict (concurrent inserts) | Low | Duplicate records | Unique constraints | — |

### 2.5 Redis

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Connection refused | High (dev) | Presence/rate-limit degraded | In-memory fallback active | Circuit breaker to stop retry storm |
| Memory exhaustion | Low | Key evictions | `maxmemory` policy | Document config recommendation |
| Network partition | Low | Presence stale | Fallback layer | TTL-based self-heal |
| Retry storm on reconnect | Medium | CPU spike | `retryStrategy` with max 3 | Cap + circuit breaker |

### 2.6 Kafka / Transactional Outbox

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Broker unreachable | High (dev) | Events buffered | In-memory fallback + outbox | Bounded retry backoff |
| Outbox poller crash | Low | Events stuck PENDING | `setInterval` + try/catch | Restart guard + alert |
| DLQ growing unbounded | Low | Memory leak | Map-based storage | Prune DLQ > 1000 entries |
| Consumer handler throws | Medium | Event lost | Retry 3× → DLQ | Exponential backoff delay |
| Duplicate event delivery | Medium | Double-process | Idempotency Set per group | — |

### 2.7 WebSocket / Socket.IO

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Client disconnect without cleanup | High | Room leak | `disconnect` handler | Stale session pruner |
| Flood of connect events | Medium | Memory/CPU | Rate limiter | Bulkhead on `connection` |
| Payload > 1MB | Low | Disconnect | `maxHttpBufferSize: 1e6` | — |
| Auth failure at handshake | Medium | Rejected gracefully | `authenticateSocket` | — |
| Redis presence stuck ONLINE | Medium | Stale presence | TTL on presence keys | Watchdog to sync |

### 2.8 WebRTC / SFU

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| SFU server unreachable | Low | No video/audio | Client-side fallback message | — |
| ICE negotiation failure | Medium | No peer connection | Client retry | — |
| Media token expired | Medium | Kick from room | Short-lived token (15min) | — |

### 2.9 Meeting Lifecycle

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Invalid state transition | Low | 400 error | `VALID_TRANSITIONS` map | Idempotency guard |
| Meeting not found mid-session | Low | 404 during join | Check before join | — |
| Concurrent lifecycle calls | Low | Race condition | In-memory Map (single-process) | Idempotency guard |
| Host disconnects during ACTIVE | Medium | Meeting orphaned | No auto-end | Add timeout-based auto-end |

### 2.10 Meeting & Application Chat

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Message to non-existent room | Low | Message lost | Room check before emit | — |
| Message flood | Medium | CPU spike | No per-user limit | Rate limit on `chat:message` |
| HTML injection via message | Low | XSS | Entity encoding sanitizer | — |
| Chat history unbounded | Low | Memory leak | — | Cap history at 500/room |

### 2.11 Notification Service

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Email provider timeout | Medium | Email not sent | — | Timeout + retry |
| In-app notification queue overflow | Low | Dropped notifications | — | Cap in-memory store |
| Push delivery failure | Medium | Silent fail | No retry | DLQ routing |

### 2.12 Background Jobs (Outbox Poller, Presence Cleanup)

| Failure Mode | Probability | Blast Radius | Current Mitigation | Phase 14 Action |
|---|---|---|---|---|
| Poller throws unhandled rejection | Low | Polling stops | `.catch()` wrapper | Error counter + alert |
| `setInterval` drift | Low | Timing skew | — | Acceptable |
| Process killed mid-poll | Low | PUBLISHING → stuck | Timeout recovery on restart | — |

---

## 3. Risk Severity Classification

| Severity | Count | Subsystems |
|---|---|---|
| **CRITICAL** | 3 | PostgreSQL outage, Auth key missing, Uncaught API rejection |
| **HIGH** | 8 | Redis retry storm, WebSocket leak, Outbox DLQ growth, Chat flood, Token revocation race |
| **MEDIUM** | 14 | Connection timeouts, Stale presence, Meeting orphan, Notification drop |
| **LOW** | 12 | ICE failure, Clock skew, Payload size, Memory limits |

---

## 4. Phase 14 Implementation Summary

The following resilience primitives are implemented as new infrastructure:

| Module | Location | Purpose |
|---|---|---|
| `CircuitBreaker` | `server/resilience/circuitBreaker.ts` | CLOSED/OPEN/HALF_OPEN state machine for all I/O calls |
| `RetryPolicy` | `server/resilience/retryPolicy.ts` | Exponential backoff with jitter for transient failures |
| `TimeoutWrapper` | `server/resilience/timeoutWrapper.ts` | Hard deadline for any async operation |
| `Bulkhead` | `server/resilience/bulkhead.ts` | Concurrency limiter to prevent cascade overload |
| `GracefulShutdown` | `server/resilience/gracefulShutdown.ts` | SIGTERM/SIGINT drain handler |
| `SocketResilience` | `server/resilience/socketResilience.ts` | Heartbeat watchdog + stale session pruner |
| `MeetingGuard` | `server/meetings/meetingGuard.ts` | Idempotent meeting lifecycle state machine guard |
| `ApiResilience` | `server/resilience/apiResilience.ts` | Global uncaught exception/rejection process handlers |

---

## 5. Dependency Risk Map

```
Browser ──► Vercel Edge ──► API Serverless Functions ──► Supabase (PostgreSQL)
                │                                    ├──► Redis (Presence/Rate Limit)
                │                                    └──► Kafka (Events/Outbox)
                │
                └──► Socket.IO Server ──► Meeting Chat ──► In-memory state
                                      ──► App Chat ──────► Redis Presence
                                      ──► WebRTC/SFU ────► External media server
```

**Single Points of Failure:**
1. **Supabase PostgreSQL** — No local replica; mitigated by read retry + health check.
2. **JWT Signing Key** — Application cannot authenticate without it; validated at startup.
3. **Socket.IO process** — Stateful; stale sessions cleaned by watchdog.

---

## 6. Recovery Runbooks

See:
- [`backup-restore.md`](./backup-restore.md) — Database backup and restoration procedure
- [`disaster-recovery.md`](./disaster-recovery.md) — Full DR plan with RPO/RTO targets
