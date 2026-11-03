import { Router } from 'express';
import { aiController } from './ai.controller.js';
import { validate } from '../../middleware/validate.js';
import { aiEventLimiter } from '../../middleware/rateLimiter.js';
import { aiEventSchema } from './ai.validation.js';
const router = Router();
// Ingestion endpoint for AI inference engine
router.post('/events', aiEventLimiter, validate(aiEventSchema), (req, res, next) => aiController.handleEvent(req, res, next));
export default router;
//# sourceMappingURL=ai.routes.js.map