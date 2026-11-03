import { Router } from 'express';
import multer from 'multer';
import { evidenceController } from './evidence.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadEvidenceSchema } from './evidence.validation.js';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});
const router = Router();
router.use(authenticate);
router.get('/', (req, res, next) => evidenceController.list(req, res, next));
router.get('/:id', (req, res, next) => evidenceController.getById(req, res, next));
router.get('/alert/:alertId', (req, res, next) => evidenceController.getByAlertId(req, res, next));
router.post('/upload', authorize('ADMIN', 'OPERATOR'), upload.single('file'), validate(uploadEvidenceSchema), (req, res, next) => evidenceController.upload(req, res, next));
router.get('/:id/download', (req, res, next) => evidenceController.download(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => evidenceController.delete(req, res, next));
export default router;
//# sourceMappingURL=evidence.routes.js.map