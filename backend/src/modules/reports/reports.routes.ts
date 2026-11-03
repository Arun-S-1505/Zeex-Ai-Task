import { Router } from 'express';
import { reportsController } from './reports.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createReportSchema, scheduleReportSchema } from './reports.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => reportsController.list(req, res, next));
router.get('/history', (req, res, next) => reportsController.list(req, res, next));
router.get('/:id', (req, res, next) => reportsController.getById(req, res, next));
router.post('/', authorize('ADMIN', 'MANAGEMENT'), validate(createReportSchema), (req, res, next) => reportsController.create(req, res, next));
router.post('/:id/generate', authorize('ADMIN', 'MANAGEMENT'), (req, res, next) => reportsController.generate(req, res, next));
router.get('/:id/download', (req, res, next) => reportsController.download(req, res, next));
router.post('/schedule', authorize('ADMIN', 'MANAGEMENT'), validate(scheduleReportSchema), (req, res, next) => reportsController.schedule(req, res, next));

export default router;
