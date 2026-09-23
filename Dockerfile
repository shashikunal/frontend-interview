# ==============================================================================
# Multi-Stage Production Dockerfile — Enterprise Frontend & Collaboration Server
# Phase 18 Production Infrastructure & Container Hardening
# ==============================================================================

# ─── Stage 1: Build Dependencies & Compile Assets ───────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files for deterministic caching
COPY package.json package-lock.json ./

# Clean install all dependencies (including devDependencies needed for build)
RUN npm ci --no-audit --prefer-offline

# Copy source code and build configs
COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ ./src/
COPY server/ ./server/
COPY api/ ./api/
COPY public/ ./public/

# Build client bundle and compile TypeScript
RUN npm run build

# Prune devDependencies to keep runtime dependencies only
RUN npm prune --production

# ─── Stage 2: Hardened Production Runtime ───────────────────────────────────
FROM node:22-alpine AS runner

# Install dumb-init for proper PID 1 signal forwarding (SIGTERM / SIGINT)
RUN apk add --no-cache dumb-init wget

# Set environment
ENV NODE_ENV=production \
    PORT=5173

WORKDIR /app

# Copy production dependencies and compiled artifacts from builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/server ./server
COPY --from=builder --chown=node:node /app/api ./api
COPY --from=builder --chown=node:node /app/package.json ./package.json

# SECURITY: Run as non-root unprivileged node user (UID 1000)
USER node

# Expose default HTTP application port
EXPOSE 5173

# Container Healthcheck using Phase 11 health liveness endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:5173/api/v1/health || exit 1

# Signal handling via dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Default start command launches the server runner
CMD ["node", "api/socket.js"]
