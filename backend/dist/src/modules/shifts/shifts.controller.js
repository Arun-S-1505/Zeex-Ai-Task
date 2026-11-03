import { shiftsService } from './shifts.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class ShiftsController {
    async listShifts(req, res, next) {
        try {
            const siteId = req.query.siteId;
            const shifts = await shiftsService.listShifts(siteId);
            return sendSuccess(res, shifts, 'Shift definitions retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async createShift(req, res, next) {
        try {
            const shift = await shiftsService.createShift(req.body, req.user?.id, req.ip);
            return sendSuccess(res, shift, 'Shift created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async listHandovers(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const shiftId = req.query.shiftId;
            const status = req.query.status;
            const { total, handovers } = await shiftsService.listHandovers(params, shiftId, status);
            return sendPaginated(res, handovers, total, params.page, params.limit, 'Shift handovers retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getHandoverById(req, res, next) {
        try {
            const handover = await shiftsService.getHandoverById(req.params.id);
            return sendSuccess(res, handover, 'Shift handover details');
        }
        catch (error) {
            next(error);
        }
    }
    async createHandover(req, res, next) {
        try {
            const handover = await shiftsService.createHandover(req.body, req.user.id, req.ip);
            return sendSuccess(res, handover, 'Shift handover initiated', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async acknowledgeHandover(req, res, next) {
        try {
            const handover = await shiftsService.acknowledgeHandover(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, handover, 'Shift handover acknowledged and completed');
        }
        catch (error) {
            next(error);
        }
    }
}
export const shiftsController = new ShiftsController();
//# sourceMappingURL=shifts.controller.js.map