# Rollback Procedures & Incident Mitigation (Phase 18)

## 1. Principles of Safe Rollback
1. **Never Assume Instant Database Rollbacks**: Dropping columns or rolling back migrations with live traffic risks data loss or application crashes. Migrations must follow the **Expand-Contract** pattern so that code version $N-1$ runs seamlessly with schema version $N$.
2. **Atomic Ingress Switching**: Blue/Green or canary traffic routing allows shifting 100% of user traffic back to the previous deployment within seconds if errors spike.

---

## 2. Component Rollback Runbook

### A. Frontend Rollback (Vercel / CDN)
- **Action**: In the Vercel dashboard or via CLI, promote the prior successful deployment ID:
  ```bash
  vercel rollback [deployment-url-or-id]
  ```
- **RTO**: $< 30\text{ seconds}$. Client browsers instantly receive the previous static bundle hash.

### B. API & Realtime Containers (ECS / EKS)
- **Action**: Update the Kubernetes deployment / ECS service definition to point to the prior image tag (`:previous-stable`):
  ```bash
  kubectl rollout undo deployment/interviewprep-api
  kubectl rollout undo deployment/interviewprep-realtime
  ```
- **Verification**: Ensure `/api/v1/health` reports status `UP`.

### C. Database Migration Rollback
- If a forward-compatible migration was deployed, no immediate DB rollback is needed.
- If a critical bug exists in a new column or table:
  1. Roll back the application container to stop writing to that column.
  2. Apply a corrective additive migration.
  3. Never drop tables containing newly generated customer data during an incident.

### D. Kafka Consumers & Workers
- **Action**: Revert worker container images to previous release. Kafka consumer groups automatically rebalance partitions across the restored worker pods.
