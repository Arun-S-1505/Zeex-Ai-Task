import { Router } from 'express';
import { sitesController } from './sites.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createSiteSchema, updateSiteSchema } from './sites.validation.js';
const router = Router();
router.use(authenticate);
router.get('/', (req, res, next) => sitesController.list(req, res, next));
router.get('/:id', (req, res, next) => sitesController.getById(req, res, next));
router.post('/', authorize('ADMIN'), validate(createSiteSchema), (req, res, next) => sitesController.create(req, res, next));
router.put('/:id', authorize('ADMIN'), validate(updateSiteSchema), (req, res, next) => sitesController.update(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => sitesController.delete(req, res, next));
export default router;
//# sourceMappingURL=sites.routes.js.map