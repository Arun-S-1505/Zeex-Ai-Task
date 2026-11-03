import { Router } from 'express';
import { zonesController } from './zones.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createZoneSchema, updateZoneSchema } from './zones.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => zonesController.list(req, res, next));
router.get('/:id', (req, res, next) => zonesController.getById(req, res, next));
router.post('/', authorize('ADMIN'), validate(createZoneSchema), (req, res, next) => zonesController.create(req, res, next));
router.put('/:id', authorize('ADMIN'), validate(updateZoneSchema), (req, res, next) => zonesController.update(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => zonesController.delete(req, res, next));

export default router;
