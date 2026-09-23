# ADR 0008: Stateless HMAC-SHA256 JWT Authentication and Hierarchical RBAC

## Status
Accepted

## Context
The platform supports multi-tenant collaborative roles: Administrators, Interviewers/Hosts, Candidates/Participants, Observers, and Guests. Access control must prevent privilege escalation, prevent IDOR (Insecure Direct Object Reference) exploits across meetings and recordings, and operate statelessly to enable high-throughput API verification without hitting the database on every single request.

## Decision
Implement **HMAC-SHA256 JWT Authentication** and **Hierarchical RBAC** (`server/auth/tokenService.ts`, `server/auth/rbacMiddleware.ts`):
1. **Token Hierarchy & Lifecycles**:
   - **Access Token**: Short-lived (15 minutes). Carries `userId`, `email`, `role`, and global permissions. Verified using timing-safe cryptographic comparison.
   - **Meeting Token**: Highly scoped, ephemeral token (up to meeting duration + 15m buffer). Bound strictly to a specific `meetingId`, `participantId`, and meeting-level capabilities (`canShareScreen`, `canChat`, `canModerate`).
   - **Refresh Token**: Long-lived (7 days) with single-use rotation. Upon use, the previous refresh token is immediately revoked in Redis/DB to protect against replay attacks.
2. **Hierarchical RBAC Enforcement**:
   - `ADMIN`: Full operational oversight, user management, meeting scheduling, audit queries, system health.
   - `HOST`: Meeting room control, remote mute, recording start/stop, invitation management.
   - `PARTICIPANT / CANDIDATE`: Join invited meetings, audio/video publish, chat, whiteboard, screen share.
   - **Strict Backend Gate**: Backend APIs enforce `requireRole('admin')` or `requirePermission(...)`. Client-side route guards provide UX navigation hints only; all authorization decisions are authoritatively validated on the backend with HTTP `401 Unauthorized` or `403 Forbidden`.
3. **Anti-IDOR Protection**:
   - Attempting to access or mutate resources (e.g. `/api/v1/recordings/:id`, `/api/v1/meetings/:id`) verifies that the requesting `userId` is either an authoritative `ADMIN` or an authorized participant/owner of the resource.

## Alternatives Considered
- **Stateful Server-Side Sessions (in DB/Redis)**: Introduces database read overhead on every API request and complicates edge deployment.
- **Asymmetric RSA/ECDSA (RS256)**: Adds key rotation complexity and signature verification CPU overhead unnecessary for a centralized backend issuing and verifying its own tokens.

## Trade-offs
- *Pros*: Completely stateless verification, sub-millisecond CPU overhead, zero database lookups on authenticated requests, granular permission scoping.
- *Cons*: Cannot revoke an individual active access token before its 15-minute expiration without maintaining a token revocation denylist in Redis.

## Consequences
- Unprivileged users can never execute administrative actions even if frontend UI buttons are modified or exposed in DevTools.
- Cross-tenant IDOR access attempts are strictly rejected at the middleware layer.
