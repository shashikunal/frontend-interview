# Admin Dashboard & Operational Control Center

## Overview
Phase 12 delivers the unified **Operational Control Center** and **Admin Dashboard** for the platform. It provides administrative operators with real-time operational visibility, telemetry, user management, meeting operations, notification monitoring, and audit log inspection powered strictly by real backend data sources:
- **PostgreSQL**: Durable storage for profiles, meetings, participant records, and outbox logs.
- **Redis**: Real-time presence counters, rate limiting counters, and low-latency operational state.
- **Kafka**: Event-driven streaming, dead-letter queue (DLQ) state, and asynchronous notification delivery tracking.
- **Prometheus Metrics**: Live service-level telemetry across HTTP, WebSockets, Kafka lag, and database connections.
- **Audit Logs**: Tamper-evident logging of administrative actions and security-relevant state changes.

---

## Architecture & Security Model

### 1. Dual-Layer RBAC Enforcement
- **Client Route Protection**: The Admin Dashboard checks user profile state and redirects non-admins away with explicit 403 Forbidden feedback.
- **API Guard Middleware**: Every administrative endpoint (`/api/v1/admin/*`) independently extracts the JWT, verifies the cryptographic signature, validates token expiry, and checks `role === 'admin'`. Non-admin requests immediately abort with HTTP `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`).
- **No Secret Leakage**: Passwords, hashed credentials, private tokens, webhook secrets, and sensitive payloads are strictly redacted before serialization.

### 2. Consolidated Telemetry Aggregator
- `adminService.getDashboardOverview()` collects telemetry concurrently across:
  - Users: Total count, active status breakdown, role counts (`admin` vs `candidate`/`interviewer`).
  - Meetings: Total scheduled, active, completed, and cancelled.
  - Participants: Current active presence and total recorded attendees.
  - Chat: Total messages sent, active interview conversations.
  - Notifications: Delivery aggregates and Kafka dead-letter queues.
  - Infrastructure Health: Live health status from PostgreSQL, Redis, Kafka, WebSockets, and SFU.

---

## Operational Modules

### 1. Control Center (`AdminControlCenterTab.tsx`)
- **System Health Banner**: Reflects live aggregate infrastructure status (`HEALTHY`, `DEGRADED`, `UNHEALTHY`).
- **Real-Time KPIs**: Dynamic metric cards displaying live system statistics.
- **Operational Metrics Grid**: Gauge metrics for WebSocket connections, Kafka consumer lag, notification retry queue, and HTTP throughput.
- **Quick Links**: One-click jumps to User Management, Meeting Operations, Notification Telemetry, System Health, and Audit Logs.

### 2. User Management (`UserManagement.tsx`)
- Server-side search by name, email, and user ID.
- Filtering by role (`admin`, `candidate`, `interviewer`) and status (`active`, `suspended`).
- Administrative status toggling with mandatory audit record emission.

### 3. Meeting Operations (`AdminMeetingManagementTab.tsx`)
- Paginated meeting index displaying meeting ID, title, host, lifecycle state, start/end timestamps, and participant count.
- Filter by status (`SCHEDULED`, `ACTIVE`, `COMPLETED`, `CANCELLED`).
- Meeting Dossier Drawer with detailed roster inspection (attendee role, join/leave timestamps, audio/video status) and outbox event counts.
- Administrative lifecycle transitions (`START`, `END`, `CANCEL`) with full audit traceability.

### 4. Notification & DLQ Monitor (`AdminNotificationMonitorTab.tsx`)
- Delivery metrics: Total processed, delivered, failed, and retrying.
- Channel breakdown: In-App, Email, Web Push.
- Dead-Letter Queue (DLQ) table: Displays quarantined Kafka notifications, recipient IDs, failure reasons, and retry attempt counters.

### 5. Audit Log Inspector (`AuditLogViewer.tsx`)
- Search by actor ID, target resource, action name, and correlation ID.
- Time-range filters and pagination.
- Full context drawer showing event payload, client IP, user agent, and timestamp.

---

## Requirement Traceability Matrix

| Requirement ID | Description | Status | Verification |
|---|---|---|---|
| `REQ-ADMIN-001` | Admin-only dashboard access | `VERIFIED` | Client RBAC + server 403 test |
| `REQ-ADMIN-002` | Admin API authorization | `VERIFIED` | `test-phase12-admin-dashboard.mjs` |
| `REQ-ADMIN-003` | User management & status toggle | `VERIFIED` | Paginated search + PATCH user status test |
| `REQ-ADMIN-004` | Meeting management & lifecycle ops | `VERIFIED` | Paginated meeting list + POST transition test |
| `REQ-ADMIN-005` | Participant monitoring & dossier | `VERIFIED` | Participant metrics & roster test |
| `REQ-ADMIN-006` | Notification & DLQ monitoring | `VERIFIED` | Delivery stats + DLQ listing test |
| `REQ-ADMIN-007` | Audit log viewer integration | `VERIFIED` | Filtered audit query test |
| `REQ-ADMIN-008` | System health integration | `VERIFIED` | Live dependency health check test |
| `REQ-ADMIN-009` | Operational metrics integration | `VERIFIED` | Prometheus metrics gauge test |
| `REQ-ADMIN-010` | Analytics on real persisted data | `VERIFIED` | Aggregated dashboard telemetry test |
| `REQ-ADMIN-011` | Realtime admin telemetry | `VERIFIED` | Telemetry refresh + WebSocket integration |
| `REQ-ADMIN-012` | Responsive UI with design theme | `VERIFIED` | CSS styling + responsive breakpoints |
| `REQ-ADMIN-013` | Security & sensitive data redaction | `VERIFIED` | Redaction assertion test |
| `REQ-ADMIN-014` | Performance & server-side pagination | `VERIFIED` | Bounded pagination tests |
| `REQ-ADMIN-015` | Automated test suite | `VERIFIED` | 24/24 Phase 12 tests passed |
| `REQ-ADMIN-016` | Documentation & ADR | `VERIFIED` | Docs and ADR artifacts generated |
