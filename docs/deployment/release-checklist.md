# Production Release Pre-Flight Checklist (Phase 18)

Every release candidate must be verified against this checklist before production traffic migration.

## 1. Code & Build Verification
- [ ] CI pipeline fully green on target commit.
- [ ] `npm run lint` (`oxlint`) passes with 0 errors.
- [ ] `npx tsc -b` compiles cleanly with zero errors.
- [ ] All unit, integration, and regression tests passed.
- [ ] `npm run build` completes successfully and generates `dist/`.
- [ ] CycloneDX SBOM generated and archived.

## 2. Infrastructure & Environment Validation
- [ ] `EnvironmentValidator.assertProductionReady()` executed on target environment.
- [ ] Zero secret leakage under `VITE_*` public variables.
- [ ] All required secrets securely provisioned in Secret Manager / Vault.
- [ ] TLS certificates valid and renewed (> 30 days before expiration).

## 3. Database & Migrations
- [ ] Migration scripts reviewed for backward-compatibility (Expand-Contract pattern).
- [ ] Pre-deployment database backup / snapshot taken and verified.
- [ ] GIN full-text search indexes verified on `transcript_segments`.
- [ ] No destructive `DROP COLUMN` or table locks executed without transition phase.

## 4. Cache, Messaging & Media
- [ ] Redis cluster reachability and password authentication verified.
- [ ] Kafka topics provisioned with appropriate partitions and retention (`scripts/init-kafka-topics.mjs`).
- [ ] LiveKit SFU signaling and media ports verified.
- [ ] S3/MinIO private bucket access verified with presigned URLs.

## 5. Observability & Health
- [ ] Health endpoints responding 200 OK (`/api/v1/health`, `/api/v1/health/ready`).
- [ ] Prometheus scraping active on `/api/v1/metrics`.
- [ ] Alerting rules loaded into Alertmanager.
- [ ] Audit logging functioning for administrative actions.

## 6. Rollback Readiness
- [ ] Previous known-good container image tagged and available in registry.
- [ ] Database rollback migration script tested on staging.
- [ ] On-call engineer and deployment coordinator assigned.
