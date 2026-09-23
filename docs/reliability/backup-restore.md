# Backup & Restore Runbook
## InterviewPrep Platform — Phase 14: Reliability, Resilience & Disaster Recovery

**Owner:** Platform Engineering  
**Review cadence:** Quarterly  
**Last updated:** 2026-09-23

---

## 1. Data Inventory

| Data Store | Technology | Persistence | Backup Method |
|---|---|---|---|
| **Primary Database** | Supabase PostgreSQL | Cloud-managed | Supabase automated daily backups + PITR |
| **Session/Presence State** | Redis (ioredis) | Ephemeral | Not backed up — reconstructed on restart |
| **Event Outbox** | In-memory `Map` | Ephemeral | Flushed to Kafka on graceful shutdown |
| **Audit Logs** | In-memory `Map` → DB | Semi-persistent | Backed up via PostgreSQL backup |
| **User files/videos** | Supabase Storage | Cloud-managed | Supabase Storage replication |

---

## 2. PostgreSQL (Supabase) Backup

### 2.1 Automated Backups (Managed)
Supabase automatically creates:
- **Daily snapshots** retained for 7 days (Pro plan) or 30 days (Enterprise)
- **Point-in-Time Recovery (PITR)** with up to 30 days of WAL logs (Enterprise)

Access via: **Supabase Dashboard → Project → Database → Backups**

### 2.2 Manual Backup Procedure

```bash
# Option A: pg_dump via Supabase connection string
pg_dump \
  --dbname="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  --format=custom \
  --no-acl \
  --no-owner \
  --file="backup_$(date +%Y%m%d_%H%M%S).dump"

# Option B: Using the backup script (if configured)
node scripts/backup-db.mjs
```

**Backup location:** `scripts/backups/` directory (git-ignored)  
**Retention:** 30 days locally, indefinite on S3/GCS if configured

### 2.3 Restore Procedure

```bash
# Restore from pg_dump backup
pg_restore \
  --dbname="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" \
  --no-acl \
  --no-owner \
  --clean \
  backup_YYYYMMDD_HHMMSS.dump

# Verify restore
node scripts/inspect-db-schema-and-data.mjs
```

> [!WARNING]
> Always restore to a **staging environment first**. Verify data integrity before restoring production.

### 2.4 Point-In-Time Recovery

Via Supabase Dashboard:
1. Navigate to **Database → Backups**
2. Select **Point-in-Time Recovery**
3. Choose target timestamp
4. Confirm restore (creates new branch or overwrites)

---

## 3. Redis State Recovery

Redis is used for:
- User presence (`presence:{userId}`)
- Rate limit counters (`ratelimit:{userId}:{window}`)
- Token revocation list

**Redis is ephemeral.** Loss of Redis data results in:
- All users appear OFFLINE (presence rebuilt on reconnect within 30s)
- Rate limit counters reset (acceptable; minor abuse window)
- Token revocation list cleared (see security note below)

> [!IMPORTANT]
> After a Redis flush/restart, **actively revoked tokens may be temporarily valid** until the next token rotation cycle (15 min). For high-security deployments, consider persisting the revocation list in PostgreSQL.

### Recovery Steps
1. Restart Redis with `redis-server` or equivalent
2. Application auto-reconnects via `ioredis` retry strategy
3. Presence data rebuilds as clients reconnect
4. No manual intervention required

---

## 4. Kafka / Outbox Recovery

Kafka is used for event streaming and the transactional outbox.

**If Kafka broker restarts:**
1. `KafkaClientManager` auto-reconnects with 2-retry backoff
2. Pending outbox events remain in memory and are republished automatically once Kafka reconnects
3. No data loss for events already in the outbox

**If application server restarts (outbox events lost):**
- Events in `PENDING` state are lost
- `PUBLISHED` events are already in Kafka — no action needed
- `FAILED` events are lost — review audit logs to identify missing events

> [!TIP]
> For production, persist the outbox in PostgreSQL instead of in-memory `Map` for true transactional guarantees across restarts.

---

## 5. Application State Recovery

| Component | Recovery Action | Time |
|---|---|---|
| Meeting in-memory store | Restart → empty store; seed meetings only | < 5s |
| WebSocket connections | Clients auto-reconnect | 5–30s |
| Auth tokens | Stateless JWT; no recovery needed | 0s |
| Audit logs | Recent in-memory logs lost; DB logs persist | — |

---

## 6. Backup Validation Schedule

| Frequency | Task |
|---|---|
| **Daily** | Supabase automated snapshot (automated) |
| **Weekly** | Manually trigger `node scripts/backup-db.mjs` and confirm file is non-zero |
| **Monthly** | Restore backup to staging and run smoke tests |
| **Quarterly** | Full DR drill — see `disaster-recovery.md` |
