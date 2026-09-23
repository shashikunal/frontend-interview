# Enterprise Target Infrastructure Architecture (Phase 18)

## 1. Executive Summary
The platform architecture separates the **stateless frontend presentation tier** from the **stateful, high-throughput collaboration, event streaming, and media planes**.

```
                           [ INTERNET ]
                                │
                    ┌───────────┴───────────┐
                    │ Cloudflare / Edge WAF │
                    └───────────┬───────────┘
                                │
             ┌──────────────────┴──────────────────┐
             ▼                                     ▼
   ┌──────────────────┐                  ┌──────────────────┐
   │  Vercel / CDN    │                  │ AWS ALB Ingress  │
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

---

## 2. Component Hosting Matrix

| Component | Target Hosting | Justification |
| :--- | :--- | :--- |
| **Frontend SPA** | Vercel / Edge CDN | Static HTML/CSS/JS bundles with immutable caching (`max-age=31536000`). Global low-latency delivery. |
| **REST APIs** | Containerized Node.js (ECS / EKS) | Fast HTTP endpoints, authenticated with JWTs, resilient DB pooling. |
| **Realtime Socket.IO** | Persistent Node.js Containers (EKS) | Long-lived WebSocket connections, stateful presence sync, Redis adapter for multi-node broadcast. |
| **PostgreSQL** | AWS RDS / Supabase Multi-AZ | ACID relational storage, GIN full-text search, transactional outbox durability. |
| **Redis 7** | AWS ElastiCache / Redis Cluster | Ephemeral presence heartbeats, distributed rate limiting, token-bucket counters. |
| **Apache Kafka** | AWS MSK / Confluent Cloud | Asynchronous event bus, at-least-once outbox relay, 7-day retention. |
| **LiveKit SFU** | Dedicated EC2 / EKS C6g Compute Nodes | Low-latency WebRTC media routing, selective forwarding, UDP ports 50000-60000. |
| **Object Storage** | AWS S3 / MinIO Private Buckets | Encrypted private storage for master video recordings, presigned HMAC URL playback. |
| **Workers** | Containerized Worker Pods (Auto-scaling) | Outbox publisher, media processor, speech-to-text, notifications. |

---

## 3. Open-Source-First Technology Evaluation

| Technology | Purpose | License | Self-Hosting | Scaling Model | Operational Complexity | Current Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PostgreSQL 16** | Core relational DB | PostgreSQL License (OSI) | Excellent | Primary-replica read scaling | Low-Medium | **APPROVED (Primary DB)** |
| **Redis 7** | Ephemeral cache & presence | BSD-3-Clause | Excellent | Redis Cluster / Sentinel | Low | **APPROVED (Primary Cache)** |
| **Apache Kafka** | Event streaming & outbox | Apache 2.0 | Excellent (KRaft) | Partition-based consumer groups | Medium | **APPROVED (Event Bus)** |
| **LiveKit SFU** | WebRTC media plane | Apache 2.0 | Excellent | Horizontal node clustering | Medium | **APPROVED (Primary SFU)** |
| **MinIO** | S3-compatible media storage | AGPL v3 | Excellent | Distributed erasure-coded nodes | Low-Medium | **APPROVED (Object Storage)** |
| **Prometheus** | Metrics collection | Apache 2.0 | Excellent | Federated scrapers | Low | **APPROVED (Metrics)** |
| **OpenTelemetry** | Tracing & telemetry | Apache 2.0 | Excellent | Collector daemon | Low | **APPROVED (Tracing)** |
