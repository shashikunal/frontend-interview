# ADR 0011: Vercel Edge Application Boundary and Container Infrastructure

## Status
Accepted

## Context
The platform comprises static client assets (React 19, Vite, Monaco Editor, styling), dynamic serverless REST API endpoints (`api/v1/*`), and persistent stateful infrastructure (Socket.IO signaling, WebRTC SFU, Kafka, Redis, PostgreSQL, and background outbox pollers). A common deployment error is attempting to run persistent WebSockets or long-running workers on Vercel Serverless Functions, which terminate after 15–30 seconds.

## Decision
Establish a **Rigid Architectural Boundary** between Vercel Edge/Serverless and Self-Hosted/Containerized Infrastructure:
1. **Vercel Deployment Boundary (Frontend & Stateless APIs)**:
   - **Static Frontend**: React 19 single-page application built via `vite build` distributed globally on Vercel Edge CDN.
   - **Stateless API Handlers**: `/api/v1/auth/*`, `/api/v1/health/*`, and read-only queries suitable for execution on Vercel Serverless Functions.
   - **Zero Persistent Sockets on Vercel**: Vercel does not host the WebSocket server or the LiveKit SFU.
2. **Containerized / Dedicated Infrastructure (Stateful Backend)**:
   - **Multi-Stage Dockerfile**: Builds the full modular monolith on `node:22-alpine` running as unprivileged user `node` (UID 1000) with `dumb-init` signal handling.
   - **Persistent Workloads**: Socket.IO signaling server, LiveKit SFU media routing, Redis cache/presence cluster, Kafka event brokers, and outbox background pollers deploy in containerized environments (Docker Compose / Kubernetes / ECS).
   - **Reverse Proxy**: NGINX / Cloudflare routes `/api/socket` and WebRTC traffic to the containerized stateful cluster, while routing `/` and standard static routes to Vercel CDN.

## Alternatives Considered
- **All-in-Vercel**: Impossible due to serverless execution timeout limits and lack of persistent TCP/UDP connections for WebSockets and WebRTC RTP media.
- **Pure Self-Hosted (No Vercel)**: Viable, but misses out on Vercel's global CDN distribution, instant frontend preview deployments, and edge caching for static assets.

## Trade-offs
- *Pros*: Best-of-both-worlds: blazing fast edge CDN for the React application, combined with reliable, uninterrupted persistent socket connections for video collaboration.
- *Cons*: Requires managing both a Vercel project and a containerized backend cluster.

## Consequences
- The repository supports dual runtime modes:
  - Local all-in-one execution via Vite + Socket.IO plugin for instant developer setup.
  - Production split architecture via Dockerfile + Vercel deployment.
