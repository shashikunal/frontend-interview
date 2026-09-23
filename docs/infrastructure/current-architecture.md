# Current Architecture Audit — Production Infrastructure & DevOps (Phase 18)

## 1. System Inventory

| Subsystem | Current Implementation | Hosting / Runtime Boundary | State / Storage |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript + Vite | Client-Side SPA (Static assets, CDN / Vercel Edge) | Client memory, IndexedDB |
| **API Layer** | Node.js Serverless handlers (`api/v1/*`) | Node.js runtime / Vercel Serverless / Express dev middleware | Stateless |
| **Realtime Signaling** | Socket.IO (`api/socket.js`, `server/socket/*`) | Stateful Node.js WebSocket process | In-Memory + Redis Adapter |
| **Media Plane (SFU)** | WebRTC / LiveKit SFU Driver (`server/meetings/*`) | External LiveKit SFU cluster | Ephemeral UDP/TCP media streams |
| **Database** | PostgreSQL / Supabase (`supabase/migrations/*`) | Supabase / Self-hosted PostgreSQL 16 | Durable ACID relational data |
| **Cache & Presence** | Redis (`server/redis/*`) | Redis 7+ standalone / cluster | In-memory key-value, ephemeral TTL |
| **Event Bus & Outbox** | Apache Kafka + Outbox (`server/kafka/*`) | Kafka KRaft broker / MSK / Confluent | Durable event streaming (7d retention) |
| **Object Storage** | S3 / MinIO (`server/media/objectStorageService.ts`) | Private S3 Bucket / MinIO Cluster | Audio/video blobs, master recordings |
| **Async Workers** | Outbox Worker, Consumer Service, Media Processing Worker | Long-running background Node.js worker containers | Stateless compute |
| **Observability** | Prometheus Metrics, Structured Logger, Tracer (`server/observability/*`) | Prometheus + OpenTelemetry Collector + Grafana | Time-series metrics, JSON logs |

---

## 2. Component Boundaries & Vercel Mapping

### Suitable for Vercel:
- **Static Frontend SPA**: HTML, CSS, client-side bundles compiled into `dist/`.
- **Stateless HTTP API Endpoints**: Fast REST endpoints (`api/v1/health`, `api/v1/meetings`, etc.) that execute within standard serverless timeouts ($< 15\text{s}$).

### NOT Suitable for Vercel (Must run on dedicated containerized infrastructure):
1. **Socket.IO Realtime Signaling**: Requires persistent HTTP upgrade connections, heartbeat pings, and sticky sessions. Serverless functions terminate connections on request completion.
2. **Kafka Event Consumers**: Long-running poll loop processes (`server/kafka/consumerService.ts`) listening continuously to Kafka consumer groups.
3. **Media Processing & Speech-to-Text Workers**: CPU/memory intensive tasks (FFmpeg audio extraction, Whisper STT) that exceed serverless execution limits.
4. **LiveKit WebRTC SFU**: Requires bidirectional high-bandwidth UDP media ports (50000–60000) and low-latency network routing.
5. **Stateful Databases & Caches**: PostgreSQL, Redis, and MinIO.

---

## 3. Deployment Topology (Target)

```
                            [ INTERNET ]
                                 │
                     ┌───────────┴───────────┐
                     │ Cloudflare / CDN WAF  │
                     └───────────┬───────────┘
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
    ┌──────────────────┐                  ┌──────────────────┐
    │  Vercel / Edge   │                  │ Ingress / Alb    │
    │  (Static SPA)    │                  │ (TLS 1.3 Term)   │
    └──────────────────┘                  └────────┬─────────┘
                                                   │
                  ┌────────────────────────────────┼─────────────────┐
                  ▼                                ▼                 ▼
        ┌──────────────────┐             ┌──────────────────┐  ┌─────────────┐
        │ API Services     │             │ Realtime Node    │  │ LiveKit SFU │
        │ (Container Pods) │             │ (Socket.IO Pods) │  │ (UDP Media) │
        └─────────┬────────┘             └────────┬─────────┘  └──────┬──────┘
                  │                               │                   │
                  ├───────────────────────────────┴───────────────────┤
                  ▼                                                   ▼
        ┌────────────────────────────────────────────────────────┐ ┌──────────────┐
        │ Private VPC Subnets                                    │ │ MinIO / S3   │
        │ ┌──────────────┐  ┌─────────────┐  ┌─────────────────┐ │ │ (Private     │
        │ │ PostgreSQL   │  │ Redis 7     │  │ Kafka KRaft     │ │ │  Recordings) │
        │ │ (Primary/Rep)│  │ (Cluster)   │  │ (3x Brokers)    │ │ └──────────────┘
        │ └──────────────┘  └─────────────┘  └────────┬────────┘ │
        │                                             ▼          │
        │                                  ┌──────────────────┐  │
        │                                  │ Background       │  │
        │                                  │ Workers          │  │
        │                                  └──────────────────┘  │
        └────────────────────────────────────────────────────────┘
```
