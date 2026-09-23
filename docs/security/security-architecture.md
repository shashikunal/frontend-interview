# Security Architecture & Hardening Specification

## 1. Role-Based Access Control (RBAC) Matrix

| Action / Capability | ADMIN | HOST | PARTICIPANT / CANDIDATE | OBSERVER | GUEST |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Create / Schedule Meeting** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Start Meeting as Host** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Admit Participants** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **End / Cancel Meeting** | ✅ | ✅ (Own) | ❌ | ❌ | ❌ |
| **Publish Audio / Video** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Share Screen** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Send In-Meeting Chat** | ✅ | ✅ | ✅ | ✅ | ❌ (View Only) |
| **Send Emoji Reactions** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Remote Mute / Kick** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Start / Stop Recording** | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Stream / Play Recording** | ✅ | ✅ | ✅ (If Admitted) | ❌ | ❌ |
| **Access Admin Dashboard** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **View Audit Logs & Telemetry**| ✅ | ❌ | ❌ | ❌ | ❌ |

> [!CRITICAL]
> All authorization rules are enforced strictly on the backend via Express middleware (`requireRole('admin')`, `requirePermission(...)`). Frontend UI hiding is treated purely as UX convenience.

---

## 2. Anti-IDOR (Insecure Direct Object Reference) Protection

To prevent cross-tenant and cross-user data harvesting:
1. **Recording Streaming (`/api/v1/meetings/:id/recordings/:recId/stream`)**:
   - Validates that the requesting user's identity is an authoritative `ADMIN` OR exists in the meeting's verified participant list.
   - Cross-meeting requests return `HTTP 403 Forbidden`.
2. **Application Chat (`/api/v1/chat/conversations/:id/messages`)**:
   - Accessing a conversation requires active membership in the participant array. Non-members receive `HTTP 403 Forbidden`.
3. **Audit Log Inspection (`/api/v1/admin/audit`)**:
   - Strictly reserved for `ADMIN` role. Non-admin calls immediately terminate with `HTTP 403`.

---

## 3. Defense-in-Depth Security Headers

Enforced across all responses via `server/security/securityHeaders.ts`:
- **Content-Security-Policy (CSP)**:
  `default-src 'self'; script-src 'self' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; connect-src 'self' wss: https:; media-src 'self' blob:; frame-ancestors 'none';`
- **X-Frame-Options**: `DENY` (blocks clickjacking attacks).
- **X-Content-Type-Options**: `nosniff` (prevents MIME sniffing).
- **Referrer-Policy**: `strict-origin-when-cross-origin`.
- **Cross-Origin-Opener-Policy (COOP)**: `same-origin`.
- **CORS Configuration**:
  - Dynamically reflects validated origins from allowlist.
  - Strictly disallows wildcard `*` when `credentials: true` is enabled.

---

## 4. Input Sanitization & Attack Prevention

- **XSS Prevention**: All in-meeting chat and application messages pass through HTML entity sanitization (`<` -> `&lt;`, `>` -> `&gt;`, `"` -> `&quot;`).
- **SQL Injection Prevention**: Supabase and PostgreSQL queries utilize parameterized prepared statements and type-safe query builders (`eq()`, `select()`).
- **Rate Limiting**: IP-based and token-based sliding window limiters restrict join attempts (max 15/min), reaction spam (5 in 5s), and login attempts (5 in 15m).

---

## 5. Secret Management & Environment Security

- **Zero Secret Leaks**: Verified by `server/config/envValidator.ts` and automated CI quality gates.
- Client bundles compiled with Vite strictly exclude backend secrets (`JWT_SECRET`, `KAFKA_PASSWORD`, `DATABASE_PASSWORD`).
- Structured logging (`server/observability/logger.ts`) automatically redacts passwords, tokens, API keys, and authorization headers (`[REDACTED]`).
