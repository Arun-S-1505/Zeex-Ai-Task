import { Router } from 'express';
import { authController } from './auth.controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authLimiter } from '../../middleware/rateLimiter.js';
import { registerSchema, loginSchema, refreshSchema } from './auth.validation.js';
const router = Router();
router.post('/register', authLimiter, validate(registerSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', authLimiter, validate(loginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/logout', authenticate, (req, res, next) => authController.logout(req, res, next));
router.post('/refresh', validate(refreshSchema), (req, res, next) => authController.refresh(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getMe(req, res, next));
export default router;
//# sourceMappingURL=auth.routes.js.map