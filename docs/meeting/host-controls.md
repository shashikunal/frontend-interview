# Phase 16 — Host Moderation Controls & Policy

## 1. Overview & RBAC Rules

Host controls provide meeting owners and designated co-hosts with authoritative administrative tools to moderate participation, maintain decorum, and safeguard meeting security.

### Roles & Capabilities Matrix
| Capability | Host | Co-Host | Participant |
| :--- | :---: | :---: | :---: |
| Request Participant Mute | Allowed | Allowed | Denied |
| Lower Participant's Hand | Allowed | Allowed | Denied |
| Remove (Kick) Participant | Allowed | Allowed | Denied |
| End Meeting for All | Allowed | Denied | Denied |
| Self Mute/Unmute | Allowed | Allowed | Allowed |
| Self Raise/Lower Hand | Allowed | Allowed | Allowed |
| Ephemeral Reactions | Allowed | Allowed | Allowed |

---

## 2. Moderation Operations

### 2.1 Lower Participant Hand
- **Endpoint / Event**: `meeting:hand:host-lower`
- **Payload**: `{ meetingId: string, targetUserId: string }`
- **Validation**:
  1. Verifies caller has role `HOST` or `CO_HOST` in `meetingPresenceService`.
  2. Ensures target participant exists and currently has `handRaised === true`.
  3. Updates authoritative server state.
  4. Emits `meeting:participant:state` updating `handRaised: false` to all participants.

### 2.2 Remote Participant Mute Request
- **Endpoint / Event**: `meeting:host:mute-participant`
- **Payload**: `{ meetingId: string, targetUserId: string }`
- **Validation**:
  1. Verifies caller has role `HOST` or `CO_HOST`.
  2. Emits targeted event directly to `targetUserId`'s active sockets.
  3. Target client automatically turns off its audio track and displays toast notification.

### 2.3 Expel (Remove) Participant
- **Endpoint / Event**: `meeting:host:remove-participant`
- **Payload**: `{ meetingId: string, targetUserId: string, reason?: string }`
- **Validation & Enforcement**:
  1. Caller verified as `HOST` or `CO_HOST`.
  2. Cannot kick the primary Host.
  3. `targetUserId` is added to room `blacklistedUsers` set in `meetingPresenceService`.
  4. Server forcibly disconnects the target socket and closes SFU consumer/producer sessions.
  5. The target's browser is transitioned to a locked "Removed from Meeting" view.
  6. Subsequent rejoin attempts by `targetUserId` are immediately rejected with `403 Forbidden` (`USER_KICKED_FROM_MEETING`).

### 2.4 End Meeting for All
- **Endpoint / Event**: `meeting:host:end-meeting`
- **Payload**: `{ meetingId: string }`
- **Validation & Enforcement**:
  1. Caller verified as meeting `HOST`.
  2. Meeting lifecycle in PostgreSQL is updated to `ENDED`.
  3. All participant sessions are disconnected.
  4. SFU router is closed and cleaned up.
  5. Sockets receive `meeting:ended` notification and display the "Meeting Ended" screen.
