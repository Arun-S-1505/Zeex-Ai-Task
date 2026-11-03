import { Router } from 'express';
import { detectionsController } from './detections.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createDetectionSchema, updateDetectionSchema, updateDetectionStatusSchema, createRuleSchema, updateRuleSchema, } from './detections.validation.js';
export const detectionRouter = Router();
export const ruleRouter = Router();
detectionRouter.use(authenticate);
ruleRouter.use(authenticate);
// Detections routes
detectionRouter.get('/', (req, res, next) => detectionsController.listDetections(req, res, next));
detectionRouter.get('/:id', (req, res, next) => detectionsController.getDetectionById(req, res, next));
detectionRouter.post('/', authorize('ADMIN'), validate(createDetectionSchema), (req, res, next) => detectionsController.createDetection(req, res, next));
detectionRouter.put('/:id', authorize('ADMIN'), validate(updateDetectionSchema), (req, res, next) => detectionsController.updateDetection(req, res, next));
detectionRouter.patch('/:id/status', authorize('ADMIN'), validate(updateDetectionStatusSchema), (req, res, next) => detectionsController.updateDetectionStatus(req, res, next));
detectionRouter.get('/:id/history', (req, res, next) => detectionsController.getDetectionHistory(req, res, next));
// Rules routes
ruleRouter.get('/', (req, res, next) => detectionsController.listRules(req, res, next));
ruleRouter.get('/:id', (req, res, next) => detectionsController.getRuleById(req, res, next));
ruleRouter.post('/', authorize('ADMIN'), validate(createRuleSchema), (req, res, next) => detectionsController.createRule(req, res, next));
ruleRouter.put('/:id', authorize('ADMIN'), validate(updateRuleSchema), (req, res, next) => detectionsController.updateRule(req, res, next));
ruleRouter.delete('/:id', authorize('ADMIN'), (req, res, next) => detectionsController.deleteRule(req, res, next));
//# sourceMappingURL=detections.routes.js.map