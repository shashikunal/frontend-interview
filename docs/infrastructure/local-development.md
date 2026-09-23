# Local Development & Infrastructure Runbook (Phase 18)

## 1. Prerequisites
- **Node.js**: v22.0.0 or higher
- **Docker & Docker Compose**: v2.20+
- **NPM**: v10+

---

## 2. Quickstart Workflow

### Step 1: Start Supporting Infrastructure
Launch PostgreSQL, Redis, Kafka, MinIO, LiveKit SFU, and Prometheus in the background:
```bash
docker compose up -d
```

Verify all containers are healthy:
```bash
docker compose ps
```

### Step 2: Initialize Topics & Buckets
Ensure required Kafka topics and storage buckets exist:
```bash
node scripts/init-kafka-topics.mjs
```

### Step 3: Install & Start Development Server
```bash
npm install
npm run dev
```
The application will be accessible at:
- **Web App**: `http://localhost:5173`
- **MinIO Console**: `http://localhost:9001` (User: `minioadmin`, Pass: `minioadminpassword123`)
- **Prometheus Metrics**: `http://localhost:9090`
- **LiveKit Dashboard/API**: `http://localhost:7880`

---

## 3. Maintenance Commands

### Resetting Infrastructure & Volumes
To completely purge test data and recreate clean containers:
```bash
docker compose down -v
docker compose up -d
```

### Viewing Container Logs
```bash
docker compose logs -f [postgres|redis|kafka|minio|livekit|prometheus]
```

### Running Automated Test Verification
```bash
node scripts/test-phase18-infrastructure-readiness.mjs
```
