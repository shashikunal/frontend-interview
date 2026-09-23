# Environment Model & Secret Management (Phase 18)

## 1. Environments Overview

| Environment | Purpose | Infrastructure Boundary | Secrets Provider |
| :--- | :--- | :--- | :--- |
| **LOCAL** | Developer workstation | Docker Compose (Postgres, Redis, Kafka, MinIO) | `.env` (gitignored) |
| **TEST / CI** | Automated testing & CI quality gates | Ephemeral containers / in-memory mocks | GitHub Actions Secrets / Environment variables |
| **STAGING** | Pre-production validation & parity | Managed Kubernetes / ECS + RDS + MSK | AWS Secrets Manager / HashiCorp Vault |
| **PRODUCTION** | Live customer workloads | High-Availability Multi-AZ Cluster | AWS Secrets Manager / HashiCorp Vault |

---

## 2. Variable Classification & Leak Prevention

### Public Variables (`VITE_*`)
- Inlined directly into compiled browser JavaScript during `vite build`.
- Strictly checked by CI and `EnvironmentValidator`: Any variable containing `SECRET`, `KEY`, or `SERVICE_ROLE` under a `VITE_*` prefix triggers a build-breaking security violation.

### Server-Only Variables
- Consumed only in Node.js processes (`server/`, `api/`).
- Never exposed in HTML headers, browser bundles, or client HTTP responses.

### High-Entropy Secrets
- Cryptographic keys: `JWT_SIGNING_SECRET`, `MEDIA_JWT_SECRET`, `STORAGE_SIGNING_SECRET`.
- Database & storage credentials: `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `S3_SECRET_KEY`, `LIVEKIT_API_SECRET`.
- **Masking Policy**: `EnvironmentValidator.getSanitizedSummary()` redacts all secret values to `[REDACTED (length: N)]`. Logs and monitoring never output raw values.

---

## 3. Startup Validation Guarantee
Before binding HTTP ports or consuming Kafka topics, the server executes:
```typescript
EnvironmentValidator.assertProductionReady();
```
If any required variable is missing or malformed, the process immediately exits with exit code `1` and a structured error summary, preventing the application from booting in an insecure state.
