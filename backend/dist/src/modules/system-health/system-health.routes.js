import { Router } from 'express';
import { systemHealthController } from './system-health.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createFaultTicketSchema, updateFaultTicketSchema, closeFaultTicketSchema, } from './system-health.validation.js';
export const systemRouter = Router();
export const faultRouter = Router();
// Public basic health probe
systemRouter.get('/health', (req, res, next) => systemHealthController.getHealth(req, res, next));
// Authenticated system observability
systemRouter.get('/metrics', authenticate, authorize('ADMIN', 'MANAGEMENT'), (req, res, next) => systemHealthController.getMetrics(req, res, next));
systemRouter.get('/storage', authenticate, authorize('ADMIN', 'MANAGEMENT'), (req, res, next) => systemHealthController.getStorage(req, res, next));
systemRouter.get('/network', authenticate, authorize('ADMIN', 'MANAGEMENT'), (req, res, next) => systemHealthController.getNetwork(req, res, next));
// Fault Tickets
faultRouter.use(authenticate);
faultRouter.get('/', (req, res, next) => systemHealthController.listFaults(req, res, next));
faultRouter.post('/', authorize('ADMIN', 'OPERATOR'), validate(createFaultTicketSchema), (req, res, next) => systemHealthController.createFault(req, res, next));
faultRouter.put('/:id', authorize('ADMIN', 'OPERATOR'), validate(updateFaultTicketSchema), (req, res, next) => systemHealthController.updateFault(req, res, next));
faultRouter.post('/:id/close', authorize('ADMIN', 'OPERATOR'), validate(closeFaultTicketSchema), (req, res, next) => systemHealthController.closeFault(req, res, next));
//# sourceMappingURL=system-health.routes.js.map