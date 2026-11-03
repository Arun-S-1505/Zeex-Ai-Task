import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createUserSchema, updateUserSchema, updateRoleSchema } from './users.validation.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'MANAGEMENT'), (req, res, next) => usersController.list(req, res, next));
router.get('/:id', authorize('ADMIN', 'MANAGEMENT'), (req, res, next) => usersController.getById(req, res, next));
router.post('/', authorize('ADMIN'), validate(createUserSchema), (req, res, next) => usersController.create(req, res, next));
router.put('/:id', authorize('ADMIN'), validate(updateUserSchema), (req, res, next) => usersController.update(req, res, next));
router.patch('/:id/role', authorize('ADMIN'), validate(updateRoleSchema), (req, res, next) => usersController.updateRole(req, res, next));
router.delete('/:id', authorize('ADMIN'), (req, res, next) => usersController.delete(req, res, next));

export default router;
