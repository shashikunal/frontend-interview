# Redis Key Family Inventory & Ephemeral State Architecture

## 1. Master Key Family Registry

| Key Pattern | Purpose | Data Type | TTL | Owner / Service | Eviction Policy | Failure Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`presence:user:{userId}`** | Real-time user online status and heartbeat | String (JSON) | 60 seconds | `presenceService.ts` | `allkeys-lru` | In-memory local fallback map |
| **`presence:meeting:{meetingId}`** | Set of active participants in a meeting room | Set | 120 seconds | `meetingPresenceService.ts` | `allkeys-lru` | Local process Set fallback |
| **`ratelimit:{ip}:{endpoint}`** | Token-bucket sliding window rate counters | String (Integer) | 60 seconds | `rateLimiter.ts` | `allkeys-lru` | Soft fail-open (allow request with logged warning) |
| **`lock:meeting:{meetingId}`** | Distributed mutex for meeting state machine | String (UUID) | 10 seconds | `meetingGuard.ts` | No eviction (`volatile-ttl`) | Local Node.js mutex fallback |
| **`token:denylist:{jti}`** | Revoked JWT token identification | String ("1") | Token Expiry remaining | `tokenService.ts` | No eviction | In-memory Set fallback |
| **`cache:metrics:operational`** | Cached admin dashboard telemetry metrics | Hash | 15 seconds | `adminService.ts` | `allkeys-lru` | Direct database query bypass |

---

## 2. Memory Limits & Eviction Strategy

- **Instance Sizing**: Configured with `maxmemory 512mb` (scaled up to 2GB in multi-node clusters).
- **Eviction Algorithm**: `maxmemory-policy allkeys-lru`.
  - When memory pressure peaks, the least recently accessed presence records or rate counters are pruned automatically.
  - Critical locks and token revocation entries use explicit expiration rather than eviction vulnerability.

---

## 3. Resilience and Failover Contract

When the connection to Redis fails (`ECONNREFUSED` or timeout):
1. **Zero Process Crashes**: The `redisClient.ts` wrapper captures connection errors without unhandled exceptions.
2. **In-Memory Fallback Layer**: An internal Node.js `Map` and `Set` structure transparently intercepts presence updates and rate limit evaluations.
3. **Automated Reconnect**: The Redis client runs an exponential backoff reconnection loop (100ms, 200ms, 400ms... up to 5000ms max delay). Upon server recovery, traffic automatically shifts back to Redis without requiring a backend restart.
