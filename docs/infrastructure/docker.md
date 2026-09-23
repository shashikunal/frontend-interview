# Container Strategy & Hardening (Phase 18)

## 1. Multi-Stage Build Architecture
- **Stage 1 (`builder`)**: Uses `node:22-alpine` with build tools (`python3`, `make`, `g++`). Executes `npm ci`, runs `npm run build` (`tsc -b && vite build`), and executes `npm prune --production` to eliminate development dependencies.
- **Stage 2 (`runner`)**: Minimal production image containing only production dependencies, compiled `dist/`, and runtime handlers. Drastically reduces image attack surface and final image size ($< 180\text{MB}$).

---

## 2. Container Security Controls
1. **Non-Root Execution**: Runs under the unprivileged `node` user (UID 1000). The container has zero root capabilities.
2. **Process Supervision**: Uses `dumb-init` as PID 1 to ensure POSIX signals (`SIGTERM`, `SIGINT`) are forwarded to the Node.js event loop, allowing Phase 14 graceful shutdown handlers (`gracefulShutdown.ts`) to finish in-flight requests and drain Kafka consumers.
3. **Automated Healthcheck**: Built-in `HEALTHCHECK` queries `/api/v1/health` with a 30s interval and 3-retry limit.
4. **Vulnerability Scanning**: CI executes container vulnerability scans using Trivy/Grype to detect CVEs in Alpine base packages.
