import { Router } from 'express';
import { alertsController } from './alerts.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createManualAlertSchema,
  acknowledgeAlertSchema,
  assignAlertSchema,
  takeActionSchema,
  closeAlertSchema,
  falsePositiveSchema,
  missedDetectionSchema,
} from './alerts.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => alertsController.list(req, res, next));
router.get('/:id', (req, res, next) => alertsController.getById(req, res, next));
router.post('/', authorize('ADMIN', 'OPERATOR'), validate(createManualAlertSchema), (req, res, next) => alertsController.create(req, res, next));
router.post('/:id/acknowledge', authorize('ADMIN', 'OPERATOR'), validate(acknowledgeAlertSchema), (req, res, next) => alertsController.acknowledge(req, res, next));
router.post('/:id/assign', authorize('ADMIN', 'OPERATOR'), validate(assignAlertSchema), (req, res, next) => alertsController.assign(req, res, next));
router.post('/:id/action', authorize('ADMIN', 'OPERATOR'), validate(takeActionSchema), (req, res, next) => alertsController.takeAction(req, res, next));
router.post('/:id/close', authorize('ADMIN', 'OPERATOR'), validate(closeAlertSchema), (req, res, next) => alertsController.close(req, res, next));
router.post('/:id/false-positive', authorize('ADMIN', 'OPERATOR'), validate(falsePositiveSchema), (req, res, next) => alertsController.falsePositive(req, res, next));
router.post('/missed', authorize('ADMIN', 'OPERATOR'), validate(missedDetectionSchema), (req, res, next) => alertsController.missedDetection(req, res, next));
router.get('/:id/history', (req, res, next) => alertsController.getHistory(req, res, next));

export default router;
