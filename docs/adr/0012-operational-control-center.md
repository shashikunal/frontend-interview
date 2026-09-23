# ADR 0012: Operational Control Center and Real Telemetry Aggregation

## Context
Phase 12 requires a unified Admin Dashboard / Operational Control Center. Previous phases introduced isolated systems: Auth & RBAC (Phases 1-3), WebRTC/Meetings (Phases 4-6), Chat (Phase 7), Redis Presence & Rate Limiting (Phase 8), Kafka & Outbox (Phase 9), Notifications (Phase 10), and Observability & Audit Logging (Phase 11).
The administrative control plane must provide holistic operational control without duplicating storage, without faking metrics, and without violating RBAC boundaries.

## Decision
1. **Consolidated Backend Service Layer (`server/admin/adminService.ts`)**:
   Instead of forcing the frontend to perform 10+ disjoint API queries, an administrative aggregation layer computes unified telemetry concurrently using existing services (`meetingService`, `invitationService`, `healthService`, `notificationService`, `auditService`, and Prometheus metrics).
2. **Dual-Layer RBAC**:
   - Frontend: Guards routes and UI components.
   - Backend: Every `/api/v1/admin/*` endpoint validates JWT token signature, expiry, and `role === 'admin'`. Non-admins receive `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`).
3. **Strict Data Grounding**:
   Zero mock data, zero hardcoded KPIs. All figures represent real database records, Redis counters, Kafka DLQ entries, or Prometheus gauges.
4. **Server-Side Pagination & Bounded Queries**:
   User and meeting indices enforce `page`, `limit` (max 100), and search parameters to prevent unbounded memory consumption.
5. **Durable Audit Integration**:
   Every administrative modification (account suspension, meeting cancellation) emits a server-side audit event.

## Consequences
- Operations team has real-time, low-latency visibility into platform health and active sessions.
- No sensitive credentials or tokens can leak via admin endpoints due to strict object serialization filters.
- All previous Phase 1-11 functionality remains intact and fully backward-compatible.
