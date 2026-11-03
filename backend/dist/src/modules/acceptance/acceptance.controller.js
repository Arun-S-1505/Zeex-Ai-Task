import { acceptanceService } from './acceptance.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class AcceptanceController {
    async getConsole(_req, res, next) {
        try {
            const data = await acceptanceService.getConsole();
            return sendSuccess(res, data, 'Acceptance & SLA console state');
        }
        catch (error) {
            next(error);
        }
    }
    async listMetrics(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const category = req.query.category;
            const { total, records } = await acceptanceService.listMetrics(params, category);
            return sendPaginated(res, records, total, params.page, params.limit, 'Acceptance metrics retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async createMeasurement(req, res, next) {
        try {
            const record = await acceptanceService.createMeasurement(req.body, req.user?.id, req.ip);
            return sendSuccess(res, record, 'Acceptance measurement recorded', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async signoff(req, res, next) {
        try {
            const record = await acceptanceService.signoff(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, record, 'Acceptance record signed off');
        }
        catch (error) {
            next(error);
        }
    }
}
export const acceptanceController = new AcceptanceController();
//# sourceMappingURL=acceptance.controller.js.map