import { Router } from 'express';
import { workFrontsController } from './workfronts.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createWorkFrontSchema,
  updateWorkFrontSchema,
  assignContractorSchema,
  bulkImportWorkFrontsSchema,
} from './workfronts.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => workFrontsController.list(req, res, next));
router.get('/:id', (req, res, next) => workFrontsController.getById(req, res, next));
router.post('/', authorize('ADMIN'), validate(createWorkFrontSchema), (req, res, next) => workFrontsController.create(req, res, next));
router.put('/:id', authorize('ADMIN'), validate(updateWorkFrontSchema), (req, res, next) => workFrontsController.update(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => workFrontsController.delete(req, res, next));

router.post('/:id/assign-contractor', authorize('ADMIN', 'OPERATOR'), validate(assignContractorSchema), (req, res, next) => workFrontsController.assignContractor(req, res, next));
router.post('/bulk-import', authorize('ADMIN'), validate(bulkImportWorkFrontsSchema), (req, res, next) => workFrontsController.bulkImport(req, res, next));

export default router;
