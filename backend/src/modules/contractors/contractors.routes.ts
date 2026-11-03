import { Router } from 'express';
import { contractorsController } from './contractors.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createContractorSchema, updateContractorSchema } from './contractors.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => contractorsController.list(req, res, next));
router.get('/:id', (req, res, next) => contractorsController.getById(req, res, next));
router.post('/', authorize('ADMIN'), validate(createContractorSchema), (req, res, next) => contractorsController.create(req, res, next));
router.put('/:id', authorize('ADMIN'), validate(updateContractorSchema), (req, res, next) => contractorsController.update(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => contractorsController.delete(req, res, next));

router.get('/:id/performance', (req, res, next) => contractorsController.getPerformance(req, res, next));
router.get('/:id/violations', (req, res, next) => contractorsController.getViolations(req, res, next));

export default router;
