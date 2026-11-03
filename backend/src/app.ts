import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalLimiter } from './middleware/rateLimiter.js';

// Import Route Modules
import authRouter from './modules/auth/auth.routes.js';
import usersRouter from './modules/users/users.routes.js';
import sitesRouter from './modules/sites/sites.routes.js';
import zonesRouter from './modules/zones/zones.routes.js';
import camerasRouter from './modules/cameras/cameras.routes.js';
import contractorsRouter from './modules/contractors/contractors.routes.js';
import workFrontsRouter from './modules/workfronts/workfronts.routes.js';
import { detectionRouter, ruleRouter } from './modules/detections/detections.routes.js';
import aiRouter from './modules/ai/ai.routes.js';
import alertsRouter from './modules/alerts/alerts.routes.js';
import evidenceRouter from './modules/evidence/evidence.routes.js';
import { notificationRouter, escalationRouter } from './modules/notifications/notifications.routes.js';
import analyticsRouter from './modules/analytics/analytics.routes.js';
import reportsRouter from './modules/reports/reports.routes.js';
import { systemRouter, faultRouter } from './modules/system-health/system-health.routes.js';
import { shiftRouter, handoverRouter } from './modules/shifts/shifts.routes.js';
import acceptanceRouter from './modules/acceptance/acceptance.routes.js';
import auditLogsRouter from './modules/audit-logs/audit-logs.routes.js';

const app = express();

// Security and compression middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      return callback(null, true); // Dev-friendly permissive CORS
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API requests
app.use('/api', globalLimiter);

// Serve static uploads for evidence and files
app.use('/uploads', express.static(path.resolve(env.STORAGE_LOCAL_PATH)));

// API Documentation via Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Root and Health endpoints
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SentinelAI Visual Safety Surveillance Platform API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'OPERATIONAL',
  });
});

// Mount Module Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/sites', sitesRouter);
app.use('/api/v1/zones', zonesRouter);
app.use('/api/v1/cameras', camerasRouter);
app.use('/api/v1/contractors', contractorsRouter);
app.use('/api/v1/workfronts', workFrontsRouter);
app.use('/api/v1/detections', detectionRouter);
app.use('/api/v1/rules', ruleRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/alerts', alertsRouter);
app.use('/api/v1/evidence', evidenceRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/escalations', escalationRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1/system', systemRouter);
app.use('/api/v1/faults', faultRouter);
app.use('/api/v1/shifts', shiftRouter);
app.use('/api/v1/shift-handovers', handoverRouter);
app.use('/api/v1/acceptance', acceptanceRouter);
app.use('/api/v1/audit-logs', auditLogsRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
