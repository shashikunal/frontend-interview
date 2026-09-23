# Production Security & Threat Mitigation (Phase 18)

## 1. Network Boundary Isolation
- **Public DMZ**: Only Edge CDN / Cloudflare and the ALB Ingress are publicly accessible on ports 80/443 (HTTP/HTTPS) and UDP 50000–60000 (LiveKit media).
- **Private Subnets**: Database (PostgreSQL 5432), Cache (Redis 6379), and Event Bus (Kafka 9092) are strictly unexposed to the public internet. They only accept traffic from within the VPC security group.
- **TLS 1.3 Encryption**: All client-to-server traffic is encrypted using TLS 1.3. Internal service-to-service communication uses mTLS with automated certificate rotation.

---

## 2. Secrets Management & Zero-Leakage Policy
- **No Hardcoded Secrets**: Credentials must never be committed to git or baked into Docker images.
- **Client Bundle Protection**: The `EnvironmentValidator` validates that no secrets (`*_SECRET`, `*_KEY`, `SERVICE_ROLE`) are exposed under `VITE_*` prefixes.
- **Secret Redaction**: Production logs sanitize all auth tokens, passwords, and private keys.

---

## 3. Supply-Chain Security & Dependency Integrity
- **Lockfile Enforcement**: Builds strictly use `npm ci` to ensure lockfile determinism.
- **Audit Gate**: CI runs `npm audit --omit=dev --audit-level=critical` to block known vulnerable packages.
- **Software Bill of Materials (SBOM)**: Every release generates a CycloneDX SBOM (`scripts/generate-sbom.mjs`) tracking versions, hashes, and licenses.
- **Container Hardening**: Multi-stage Docker builds discard compilers and run as unprivileged user `node` (UID 1000).
