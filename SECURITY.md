# Security Architecture & Platform Hardening

This document outlines the security architecture, authorization controls, and defense-in-depth measures implemented across the AI/Frontend Interview Platform.

---

## 1. Threat Model & Roles

The platform enforces strict role-based access control (RBAC) across three principal personas:

| Role | Permissions & Scope |
| :--- | :--- |
| **Platform Administrator (`admin`)** | Full access to operations command center, candidate analytics, telemetry streams, track allocations, feature entitlements, and audit logs. |
| **Assigned Interviewer / Admin** | Access to assigned collaborative interview sessions (`interview_sessions`), candidate code review, evaluation dossiers, and live feedback. |
| **Candidate (`candidate`)** | Access restricted strictly to own profile, attempts, submissions, practice questions, and collaborative sessions in which they are the designated candidate. |
| **Anonymous / Unauthenticated** | Read-only access to public question catalogs and curriculum landing pages; zero access to user telemetry, code execution, or realtime sessions. |

---

## 2. Real-Time Collaboration & Yjs WebSockets Security

### Session Eavesdropping & Tampering Prevention
Collaborative coding sessions are powered by Yjs documents synchronized over Supabase Realtime WebSocket channels (`session_collab_<sessionId>`).

- **Pre-Join Authorization Gate:**
  Direct construction of `new SupabaseYjsProvider()` is restricted. Clients MUST use `SupabaseYjsProvider.create(sessionId, doc, currentUser, options)`.
- **Server-Side Verification:**
  `SupabaseYjsProvider.create()` executes `interviewSessionService.verifySessionAccess(sessionId)` before subscribing to the WebSocket channel or attaching presence listeners.
- **Database Function Enforcement (`is_session_member`):**
  The database verifies that `auth.uid()` matches either:
  1. `interview_sessions.candidate_id`
  2. `interview_sessions.admin_id`
  3. A user with `app_role = 'admin'` in `user_roles` or `profiles.role = 'admin'`

```typescript
// Enforced static factory pattern
const provider = await SupabaseYjsProvider.create(
  sessionId,
  yDoc,
  { id: user.id, name: user.name, role: user.role }
);
```

If unauthorized, provider creation throws an error and rejects the connection before any code buffers are transmitted.

---

## 3. Database Row Level Security (RLS) Policies

All database tables have Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).

### Session Sub-Tables Hardening
Previous configurations permitted any authenticated user to insert or read snapshots from other candidates' sessions. The hardened policies enforce:

1. **`interview_sessions`**:
   - `SELECT`: Candidates see their own sessions; admins see all sessions.
   - `INSERT`: Candidates can only insert records where `candidate_id = auth.uid()`; admins can insert any session.
   - `UPDATE`: Only assigned admin or candidate can update session state.
2. **`session_participants`**:
   - Limited strictly to users where `is_session_member(session_id) = true`.
3. **`session_messages`**:
   - Only session participants can read or insert chat messages.
4. **`session_code_snapshots` & `session_executions`**:
   - Write and read access restricted to session members.
5. **`question_attempts` & `submissions`**:
   - Candidates can only insert and read rows where `user_id = auth.uid()`.
   - Administrators have elevated access for candidate evaluation and reporting.

---

## 4. Idempotency, Anti-Spam & Rate Limiting

1. **Submission Idempotency (`idempotency_key`):**
   - Submissions support an `idempotencyKey` parameter.
   - If a duplicate submission is received within a short window (e.g. rapid double-clicks or network retries), the existing submission record is returned without re-running tests or corrupting leaderboard marks.
2. **Debounced Draft Persistence:**
   - Auto-saving user drafts is throttled using a 1,500ms debounce timer per question and language to prevent database I/O saturation.
3. **Telemetry Spam Prevention:**
   - `question_viewed` activity logs are debounced via in-memory caching with a 60-second window per question ID.

---

## 5. Track Category Consistency & Schema Constraints

To prevent data drift across heterogeneous tracks (Machine Coding, LeetCode/DSA, Core JavaScript, Frontend JS, and AI Mock Interviews):

- **Database Check Constraints:**
  `question_attempts.category` and `submissions.category` strictly enforce valid categories:
  ```sql
  CHECK (category IN ('MACHINE_CODING', 'DSA', 'CORE_PROGRAMMING', 'FRONTEND_JS', 'THEORY', 'AI_MOCK'))
  ```
- **Indexed Queries:**
  Composite indexes on `(user_id, category)` guarantee sub-millisecond lookups for candidate dashboards and administrative aggregations.

---

## 6. Device Fingerprinting & Multi-Device Auditing

The `device_sessions` table monitors active candidate login devices, browsers, and IP metadata:
- Detects simultaneous multi-session access during live interviews.
- Tracks `last_seen_at` and session revocation flags for compromised credentials.

---

## 7. Reporting a Vulnerability

If you discover a potential security flaw in this platform, please do not disclose it publicly. Contact the administrative security team directly at `security@faang-interview.internal`.
