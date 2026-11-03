import { Router } from 'express';
import { shiftsController } from './shifts.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createShiftSchema, createShiftHandoverSchema, acknowledgeHandoverSchema, } from './shifts.validation.js';
export const shiftRouter = Router();
export const handoverRouter = Router();
shiftRouter.use(authenticate);
handoverRouter.use(authenticate);
// Shifts
shiftRouter.get('/', (req, res, next) => shiftsController.listShifts(req, res, next));
shiftRouter.post('/', authorize('ADMIN'), validate(createShiftSchema), (req, res, next) => shiftsController.createShift(req, res, next));
// Shift handovers
handoverRouter.get('/', (req, res, next) => shiftsController.listHandovers(req, res, next));
handoverRouter.get('/:id', (req, res, next) => shiftsController.getHandoverById(req, res, next));
handoverRouter.post('/', authorize('ADMIN', 'OPERATOR'), validate(createShiftHandoverSchema), (req, res, next) => shiftsController.createHandover(req, res, next));
handoverRouter.post('/:id/acknowledge', authorize('ADMIN', 'OPERATOR'), validate(acknowledgeHandoverSchema), (req, res, next) => shiftsController.acknowledgeHandover(req, res, next));
//# sourceMappingURL=shifts.routes.js.map