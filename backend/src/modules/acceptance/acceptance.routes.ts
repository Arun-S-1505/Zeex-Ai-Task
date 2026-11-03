import { Router } from 'express';
import { acceptanceController } from './acceptance.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createMeasurementSchema, signoffSchema } from './acceptance.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => acceptanceController.getConsole(req, res, next));
router.get('/metrics', (req, res, next) => acceptanceController.listMetrics(req, res, next));
router.get('/history', (req, res, next) => acceptanceController.listMetrics(req, res, next));
router.post('/measurements', authorize('ADMIN'), validate(createMeasurementSchema), (req, res, next) => acceptanceController.createMeasurement(req, res, next));
router.post('/:id/signoff', authorize('ADMIN', 'MANAGEMENT'), validate(signoffSchema), (req, res, next) => acceptanceController.signoff(req, res, next));

export default router;
