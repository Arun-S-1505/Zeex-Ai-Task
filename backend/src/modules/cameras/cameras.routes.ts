import { Router } from 'express';
import { camerasController } from './cameras.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createCameraSchema,
  updateCameraSchema,
  assignZoneSchema,
  relocateCameraSchema,
  calibrateCameraSchema,
} from './cameras.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res, next) => camerasController.list(req, res, next));
router.get('/:id', (req, res, next) => camerasController.getById(req, res, next));
router.post('/', authorize('ADMIN'), validate(createCameraSchema), (req, res, next) => camerasController.create(req, res, next));
router.put('/:id', authorize('ADMIN'), validate(updateCameraSchema), (req, res, next) => camerasController.update(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => camerasController.delete(req, res, next));

router.get('/:id/health', (req, res, next) => camerasController.getHealth(req, res, next));
router.get('/:id/stream', (req, res, next) => camerasController.getStream(req, res, next));
router.get('/:id/history', (req, res, next) => camerasController.getHistory(req, res, next));
router.post('/:id/assign-zone', authorize('ADMIN'), validate(assignZoneSchema), (req, res, next) => camerasController.assignZone(req, res, next));
router.post('/:id/relocate', authorize('ADMIN'), validate(relocateCameraSchema), (req, res, next) => camerasController.relocate(req, res, next));
router.post('/:id/calibrate', authorize('ADMIN'), validate(calibrateCameraSchema), (req, res, next) => camerasController.calibrate(req, res, next));

export default router;
