# Disaster Recovery & Operational Rollback Runbook

## 1. PostgreSQL Disaster Recovery & Point-In-Time Recovery (PITR)

### 1.1 Recovery Objectives
- **Recovery Point Objective (RPO)**: < 5 Minutes (continuous Write-Ahead Log archiving).
- **Recovery Time Objective (RTO)**: < 30 Minutes for full database reconstruction.

### 1.2 Base Backup & WAL Archive Architecture
- Daily base backups generated via `pg_basebackup` or Supabase automated daily snapshots, stored in separate, geographically replicated object storage.
- Continuous WAL streaming to secure S3 bucket (`s3://interviewprep-backups-wal/`).

### 1.3 Point-In-Time Restore Procedure
1. Provision target PostgreSQL instance with identical major version (PostgreSQL 15).
2. Stop postgres service:
   ```bash
   systemctl stop postgresql
   ```
3. Restore base backup to `$PGDATA`.
4. Configure `postgresql.conf`:
   ```ini
   restore_command = 'aws s3 cp s3://interviewprep-backups-wal/%f %p'
   recovery_target_time = '2026-09-23 12:00:00 UTC'
   recovery_target_action = 'promote'
   ```
5. Create signal file:
   ```bash
   touch $PGDATA/recovery.signal
   ```
6. Start postgres and monitor recovery log until target timestamp promotion is reached.

---

## 2. Kafka Broker Disruption & Partition Rebalancing

### 2.1 Symptoms
- Kafka health check `/api/v1/health/kafka` indicates unassigned partitions or broker disconnect.
- Application logs show: `[BrokerPool] Connection error: connect ECONNREFUSED`.

### 2.2 Immediate Automated Mitigation
- The Transactional Outbox publisher automatically transitions to buffer mode; domain events accumulate safely in the PostgreSQL `outbox_events` table without loss.

### 2.3 Recovery Steps
1. Inspect container logs:
   ```bash
   docker logs --tail 100 frontend-interview-kafka-1
   ```
2. Restart broker cluster:
   ```bash
   docker-compose restart kafka
   ```
3. Verify topic metadata:
   ```bash
   docker-compose exec kafka kafka-topics.sh --bootstrap-server localhost:9092 --list
   ```
4. Verify consumer group lag returns to 0 as the outbox dispatcher drains accumulated backlog.

---

## 3. Deployment Rollback Procedures

### 3.1 Vercel Frontend Rollback
1. Access the Vercel Project Deployment Dashboard.
2. Select the previously verified green deployment hash.
3. Click **Instant Rollback**. Traffic shifts immediately at the edge CDN in < 5 seconds.

### 3.2 Containerized Backend Rollback
1. Re-tag the previously certified Docker image:
   ```bash
   docker-compose pull backend:previous-stable
   ```
2. Execute rolling restart:
   ```bash
   docker-compose up -d --no-deps backend
   ```
3. Confirm readiness:
   ```bash
   curl -f http://localhost:3000/api/v1/health/ready
   ```

### 3.3 Database Migration Rollback
- Every migration in `supabase/migrations/` has an associated rollback script in `docs/deployment/rollback.md`.
- Ensure schema rollbacks preserve data backward-compatibility (e.g. deprecate column before dropping).
