# Operational Dashboard Runbook & Telemetry Guide

## Purpose
This document provides operators and site reliability engineers (SRE) with instructions on operating the Phase 12 Operational Control Center, interpreting metrics, handling alarms, and troubleshooting service degradation.

---

## 1. System Health Status Interpretation

The Operational Control Center queries health probes for all primary backing services:

| Dependency | Probe Mechanism | Degraded Condition | Action Runbook |
|---|---|---|---|
| **PostgreSQL** | `SELECT 1` ping & pool latency | Query latency > 500ms or pool exhausted | Inspect active connections via pg_stat_activity, check long-running transactions. |
| **Redis** | PING / latency check | Redis connection timeout or high memory | Check Redis memory utilization (`INFO MEMORY`), restart cluster node if unresponsive. |
| **Kafka** | Broker metadata & consumer heartbeat | Broker disconnected or consumer lag > 100 | Verify Kafka broker connectivity, inspect consumer group partitions. |
| **WebSocket** | Server listening state & socket count | Disconnections spiking or handshake errors | Check load balancer sticky sessions and memory headroom. |
| **SFU (WebRTC)** | Media bridge heartbeat & port status | ICE connection failures or packet loss | Verify STUN/TURN server responsiveness and UDP firewall port bindings. |

---

## 2. Key Operational Metrics & Thresholds

- **Active WebSocket Connections**: Monitored via Prometheus gauge `active_websocket_connections`. If drops suddenly to 0 during peak hours, investigate network ingress/ingress controller.
- **Kafka Consumer Lag**: Evaluated via Prometheus gauge `kafka_consumer_lag`. A sustained lag > 50 triggers automatic alert evaluation.
- **Notification Retry Queue**: DLQ records indicate persistent delivery failures. If `dlqQuarantined` spikes, verify third-party email/SMS provider status and credentials.
- **HTTP Latency**: 95th percentile latency tracked per route. Admin telemetry queries must resolve in < 250ms.

---

## 3. Administrative Operational Actions

### User Status Quarantine
If an account is flagged for abuse:
1. Navigate to **User Management**.
2. Search by email or User ID.
3. Select **Suspend User** and enter a required reason.
4. The system updates the profile and creates an append-only audit log entry with `action: 'USER_SUSPENDED'`.

### Meeting Emergency Interventions
If a meeting experiences unauthorized intrusion or severe technical issues:
1. Navigate to **Meeting Operations**.
2. Locate the active meeting from the real-time list.
3. Open the **Meeting Dossier Drawer** to inspect joined participants and connection states.
4. If necessary, execute **Terminate Meeting** or **Cancel Meeting**.
5. The system transitions the meeting lifecycle state, emits Kafka outbox events, and logs `MEETING_ENDED_BY_ADMIN` to the audit store.
