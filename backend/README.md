# 🛡️ SentinelAI - AI-Powered Visual Safety Surveillance Platform Backend

Enterprise-grade, production-oriented Node.js backend powering **SentinelAI**: an AI-Powered Visual Safety Surveillance Platform used in industrial plants, factories, and construction sites.

---

## 🏗️ 1. Project Architecture

The backend is built with a modular, scalable architecture separating routing, controllers, services, validation, and database queries:

```
backend/
├── prisma/
│   ├── schema.prisma          # 27+ Relational Models (UUID PKs, indexes, audit trails)
│   └── seed.ts                # Realistic industrial seed data (sites, cameras, D01-D54, alerts)
├── src/
│   ├── config/                # Environment, Prisma client, Storage adapters, Redis, Logger, Swagger
│   ├── middleware/            # JWT authentication, RBAC authorization, Zod validation, error handler, rate limiters
│   ├── modules/               # Domain modules: auth, users, sites, zones, cameras, contractors,
│   │                          # workfronts, detections, rules, ai, alerts, evidence,
│   │                          # notifications, analytics, reports, system-health, shifts, acceptance, audit-logs
│   ├── services/              # Rule engine (cooldown, confidence, time windows), Event Bus (EventEmitter / NATS abstraction)
│   ├── sockets/               # Real-time WebSockets with room-based access control (user, site, role)
│   ├── utils/                 # Standard responses, pagination, audit helpers, custom AppError classes
│   ├── app.ts                 # Express application with security headers, CORS, compression
│   └── server.ts              # HTTP + Socket.IO server bootstrap & graceful shutdown
├── tests/                     # Vitest test suite for auth, cameras, alerts, ai-events, evidence, analytics
├── uploads/                   # Local storage directory for development snapshots and video clips
├── Dockerfile                 # Multi-stage production container build
├── docker-compose.yml         # Containerized PostgreSQL 16, Redis 7, and Backend API
├── package.json
└── tsconfig.json
```

---

## 📋 2. Prerequisites

- **Node.js**: `v20.x` or `v22.x`
- **PostgreSQL**: `v15+` or `v16`
- **Redis**: `v7+` (optional for local development, background queues)
- **Docker & Docker Compose** (optional for containerized deployment)

---

## 🚀 3. Quick Start & Installation

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env

# 4. Generate Prisma Client
npm run prisma:generate

# 5. Run Database Migrations
npx prisma db push # or npm run prisma:migrate

# 6. Seed Realistic Industrial Data
npm run prisma:seed

# 7. Start Development Server
npm run dev
```

The API will be available at:
- **API Base URL**: `http://localhost:3001/api/v1`
- **Interactive Swagger Docs**: `http://localhost:3001/api/docs`
- **Swagger JSON Spec**: `http://localhost:3001/api/docs.json`
- **WebSocket Gateway**: `ws://localhost:3001`

---

## 🔑 4. Default Development Credentials

The seed script creates 3 default accounts representing the platform's core roles:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **ADMIN** | `admin@sentinel.ai` | `Password123!` | Full system access, users, camera configuration, detection registry, rules, audit logs |
| **OPERATOR** | `operator@sentinel.ai` | `Password123!` | Live monitoring, alert triage (acknowledge, assign, action, close, false positive), evidence upload, shift handovers |
| **MANAGEMENT** | `management@sentinel.ai` | `Password123!` | Executive dashboard, safety analytics, contractor rankings, report builder, acceptance signoff |

---

## ⚙️ 5. Environment Variables (`.env`)

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | Runtime environment (`development`, `production`, `test`) |
| `PORT` | `3001` | HTTP and WebSocket port |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection URL |
| `JWT_SECRET` | (min 32 chars) | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | (min 32 chars) | Secret key for signing refresh tokens |
| `JWT_EXPIRES_IN` | `15m` | Access token lifespan |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifespan |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection URL |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |
| `STORAGE_TYPE` | `local` | `local` or `s3` object storage adapter |
| `STORAGE_LOCAL_PATH` | `./uploads` | Directory for local file storage |

---

## ⚡ 6. Real-Time WebSocket Events (Socket.IO)

The backend provides authenticated WebSocket connections (`ws://localhost:3001`) with automatic room-based subscriptions:
- `user:<userId>`
- `role:<roleName>` (ADMIN, OPERATOR, MANAGEMENT)
- `site:<siteId>`

### Emitted Events:
- `new_alert`: Fired when AI inference or operator creates an alert
- `alert_updated`: Fired on status changes (Acknowledged, Assigned, Action Taken)
- `alert_acknowledged`: Fired when operator acknowledges alert
- `alert_assigned`: Fired when alert is assigned to an operator
- `alert_closed`: Fired on alert closure with corrective action remarks
- `camera_status_changed`: Fired when camera transitions between online/stale/offline
- `system_health_updated`: Fired when system metrics or inference status updates
- `notification_received`: Targeted real-time notification to user
- `evidence_ready`: Fired when new snapshot or video clip is processed

---

## 🤖 7. AI Detection Integration Endpoint

### `POST /api/v1/ai/events`
Receives detection events from external inference engines (YOLO11, ByteTrack, RTMPose, NVIDIA DeepStream/Triton):

```json
{
  "event_id": "88888888-8888-8888-8888-888888888888",
  "event_type": "detection.raw",
  "schema_version": "1.0",
  "site_id": "11111111-1111-1111-1111-111111111111",
  "camera_id": "22222222-2222-2222-2222-222222222222",
  "detection_id": "D01",
  "model_name": "YOLO11",
  "model_version": "1.0",
  "track_id": "anonymous-track-123",
  "confidence": 0.94,
  "zone_id": "33333333-3333-3333-3333-333333333333",
  "workfront_id": "44444444-4444-4444-4444-444444444444",
  "occurred_at": "2026-11-01T10:42:18Z",
  "bounding_box": { "x": 0.1, "y": 0.2, "width": 0.3, "height": 0.4 }
}
```

### Safety Rule Evaluation Logic:
1. **Idempotency**: Duplicate `event_id` is automatically skipped.
2. **Rule Match**: Evaluates camera, zone, workfront overrides against detection definition (D01-D54).
3. **Confidence Threshold**: Suppressed if confidence is below threshold.
4. **Cooldown Check**: Suppresses duplicate alerts within the configured cooldown window.
5. **Contractor Attribution**: Automatically mapped via approved time-bound work-front assignments.
6. **Alert Creation & Broadcast**: Creates Alert record + AlertAction audit log + triggers real-time WebSocket broadcast.

---

## 📊 8. Frontend-to-Backend Integration Matrix

The backend is custom-tailored to power every screen, component, and interaction in the React frontend:

| Frontend Screen | API Endpoint | Method | Response Shape / Data Mapped |
|---|---|---|---|
| **Executive Dashboard** | `/api/v1/analytics/overview` | `GET` | 4 metric cards, risk distribution%, top risk locations, daily trends |
| **Live Site View** | `/api/v1/cameras` | `GET` | Formatted cameras (`id`, `name`, `state`, `people`, `last`, `activeAlertsCount`) |
| **Camera Stream** | `/api/v1/cameras/:id/stream` | `GET` | Streaming URL without exposing RTSP password |
| **Real-Time Alerts** | `/api/v1/alerts` | `GET` | Formatted alerts (`id`, `title`, `detection`, `severity`, `camera`, `site`, `zone`, `contractor`, `time`, `confidence`, `status`, `sla`, `accent`) |
| **Alert Triage: Ack** | `/api/v1/alerts/:id/acknowledge` | `POST` | Transition: `Raised` → `Acknowledged` |
| **Alert Triage: Assign** | `/api/v1/alerts/:id/assign` | `POST` | Transition: `Acknowledged` → `Assigned` |
| **Alert Triage: Action** | `/api/v1/alerts/:id/action` | `POST` | Transition: `Assigned` → `Action Taken` |
| **Alert Triage: Close** | `/api/v1/alerts/:id/close` | `POST` | Transition: `Action Taken` → `Closed` with corrective remarks |
| **Alert: False Positive**| `/api/v1/alerts/:id/false-positive` | `POST` | Transition: `False Positive`, logs ML ground truth label |
| **PPE Compliance** | `/api/v1/analytics/ppe-compliance` | `GET` | Overall compliance%, people assessed, open violations, item-wise compliance |
| **Contractor Performance**| `/api/v1/analytics/contractors` | `GET` | Contractor violation rates, compliance rankings, trends |
| **Detection Registry** | `/api/v1/detections` | `GET` | Full catalogue D01-D54 with tier, thresholds, status |
| **Work-Front Registry** | `/api/v1/workfronts` | `GET` | Active work fronts, assigned contractors, status |
| **Evidence Vault** | `/api/v1/evidence` | `GET` | Evidence records with signed download URLs |
| **Shift Handover** | `/api/v1/shift-handovers` | `GET/POST` | Shift summary, open alerts, unresolved faults |
| **Acceptance & SLA** | `/api/v1/acceptance` | `GET` | SLA latency metrics, soak test results, audit status |
| **System Health** | `/api/v1/system/health` | `GET` | Camera online ratio, service health, fault tickets |
| **Audit Logs** | `/api/v1/audit-logs` | `GET` | Immutable append-only audit trail with actor & state |

---

## 🧪 9. Running Tests

```bash
# Run Vitest test suite
npm test

# Run tests in watch mode
npm run test:watch
```

Tests cover authentication, RBAC, camera stream security, alert lifecycle state transitions, AI event idempotency, evidence legal hold protection, and analytics calculation formulas.

---

## 🐳 10. Docker Deployment

```bash
# Start PostgreSQL, Redis, and API via Docker Compose
docker-compose up -d --build

# View logs
docker-compose logs -f api
```
