import { Router } from 'express';
import { notificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createNotificationSchema, createEscalationSchema } from './notifications.validation.js';

export const notificationRouter = Router();
export const escalationRouter = Router();

notificationRouter.use(authenticate);
escalationRouter.use(authenticate);

// Notification endpoints
notificationRouter.get('/', (req, res, next) => notificationsController.list(req, res, next));
notificationRouter.get('/history', authorize('ADMIN'), (req, res, next) => notificationsController.getHistory(req, res, next));
notificationRouter.get('/:id', (req, res, next) => notificationsController.getById(req, res, next));
notificationRouter.patch('/:id/read', (req, res, next) => notificationsController.markAsRead(req, res, next));
notificationRouter.post('/read-all', (req, res, next) => notificationsController.markAllAsRead(req, res, next));
notificationRouter.post('/', authorize('ADMIN'), validate(createNotificationSchema), (req, res, next) => notificationsController.create(req, res, next));

// Escalation endpoints
escalationRouter.get('/', (req, res, next) => notificationsController.listEscalations(req, res, next));
escalationRouter.get('/:id', (req, res, next) => notificationsController.getEscalationById(req, res, next));
escalationRouter.post('/', authorize('ADMIN', 'OPERATOR'), validate(createEscalationSchema), (req, res, next) => notificationsController.createEscalation(req, res, next));
