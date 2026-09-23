# Admin API Specification

All administrative endpoints reside under `/api/v1/admin/`. They strictly require HTTP `Authorization: Bearer <token>` signed with the system JWT secret, containing `role: 'admin'`.

Any missing authentication returns `401 Unauthorized`.
Any non-admin role returns `403 Forbidden` (`INSUFFICIENT_PERMISSIONS`).

---

## 1. Dashboard Telemetry

### `GET /api/v1/admin/dashboard`
Aggregates live platform telemetry across all sub-services.

- **Headers**:
  - `Authorization: Bearer <token>` (Required)
  - `X-Correlation-Id: <id>` (Optional)
- **Response `200 OK`**:
```json
{
  "timestamp": "2026-09-23T08:50:00.000Z",
  "users": {
    "total": 42,
    "active": 39,
    "suspended": 3,
    "roles": {
      "admin": 2,
      "candidate": 30,
      "interviewer": 10
    }
  },
  "meetings": {
    "total": 15,
    "scheduled": 5,
    "active": 2,
    "completed": 7,
    "cancelled": 1,
    "activeMeetings": [
      {
        "id": "meet-123",
        "title": "System Architecture Interview",
        "hostId": "usr-admin-1",
        "status": "ACTIVE",
        "activeParticipants": 3,
        "startedAt": "2026-09-23T08:30:00.000Z"
      }
    ]
  },
  "participants": {
    "activeParticipants": 6,
    "totalJoined": 48
  },
  "chat": {
    "messagesToday": 184,
    "activeConversations": 3
  },
  "notifications": {
    "total": 120,
    "delivered": 115,
    "failed": 3,
    "retrying": 2,
    "dlqQuarantined": 3
  },
  "infrastructure": {
    "overall": "HEALTHY",
    "services": {
      "postgres": "HEALTHY",
      "redis": "HEALTHY",
      "kafka": "HEALTHY",
      "websocket": "HEALTHY",
      "sfu": "HEALTHY"
    }
  }
}
```

---

## 2. User Management

### `GET /api/v1/admin/users`
Retrieves paginated user profiles with optional search and filtering.

- **Query Parameters**:
  - `page` (number, default: 1)
  - `limit` (number, default: 20, max: 100)
  - `search` (string, optional: matches name, email, or user ID)
  - `role` (string, optional: `admin`, `candidate`, `interviewer`)
  - `status` (string, optional: `active`, `suspended`)
  - `sortBy` (string, default: `createdAt`)
  - `sortOrder` (`asc` | `desc`, default: `desc`)

- **Response `200 OK`**:
```json
{
  "users": [
    {
      "id": "usr-1",
      "email": "candidate@example.com",
      "name": "Jane Doe",
      "role": "candidate",
      "status": "active",
      "createdAt": "2026-09-20T10:00:00.000Z",
      "lastSeenAt": "2026-09-23T08:15:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

### `PATCH /api/v1/admin/users`
Updates user account status (e.g. suspension/reactivation). Emits an audit log.

- **Request Body**:
```json
{
  "userId": "usr-1",
  "status": "suspended",
  "reason": "Security violation investigation"
}
```

- **Response `200 OK`**:
```json
{
  "success": true,
  "user": {
    "id": "usr-1",
    "status": "suspended"
  }
}
```

---

## 3. Meeting Management

### `GET /api/v1/admin/meetings`
Lists paginated meetings or detailed roster for a specific meeting.

- **Query Parameters**:
  - `meetingId` (string, optional: returns single meeting dossier)
  - `page` (number, default: 1)
  - `limit` (number, default: 20, max: 100)
  - `status` (string, optional: `SCHEDULED`, `ACTIVE`, `COMPLETED`, `CANCELLED`)
  - `search` (string, optional: searches title or hostId)

- **Response `200 OK` (List)**:
```json
{
  "meetings": [
    {
      "id": "meet-123",
      "title": "System Design Round",
      "hostId": "usr-admin-1",
      "status": "ACTIVE",
      "scheduledAt": "2026-09-23T08:00:00.000Z",
      "startedAt": "2026-09-23T08:02:15.000Z",
      "endedAt": null,
      "participantCount": 3
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "totalPages": 1
  }
}
```

### `POST /api/v1/admin/meetings`
Performs an administrative lifecycle action on a meeting (`START`, `END`, `CANCEL`). Emits audit log.

- **Request Body**:
```json
{
  "meetingId": "meet-123",
  "action": "CANCEL",
  "reason": "Administrative cancellation by operator"
}
```

- **Response `200 OK`**:
```json
{
  "success": true,
  "meeting": {
    "id": "meet-123",
    "status": "CANCELLED"
  }
}
```

---

## 4. Notification Telemetry

### `GET /api/v1/admin/notifications`
Returns delivery aggregates, failure rates, and quarantined Kafka DLQ records.

- **Response `200 OK`**:
```json
{
  "timestamp": "2026-09-23T08:50:00.000Z",
  "stats": {
    "total": 150,
    "delivered": 142,
    "failed": 5,
    "retrying": 3
  },
  "channels": {
    "inApp": 90,
    "email": 45,
    "push": 15
  },
  "dlq": [
    {
      "id": "dlq-789",
      "notificationId": "notif-001",
      "recipientId": "usr-9",
      "channel": "EMAIL",
      "error": "SMTP 550 Mailbox unavailable",
      "retryCount": 5,
      "quarantinedAt": "2026-09-23T08:40:00.000Z"
    }
  ]
}
```
