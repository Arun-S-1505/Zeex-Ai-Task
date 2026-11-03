import { contractorsService } from './contractors.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class ContractorsController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const { total, contractors } = await contractorsService.list(params);
            return sendPaginated(res, contractors, total, params.page, params.limit, 'Contractors retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const contractor = await contractorsService.getById(req.params.id);
            return sendSuccess(res, contractor, 'Contractor details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const contractor = await contractorsService.create(req.body, req.user?.id, req.ip);
            return sendSuccess(res, contractor, 'Contractor created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const contractor = await contractorsService.update(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, contractor, 'Contractor updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await contractorsService.delete(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, null, 'Contractor deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getPerformance(req, res, next) {
        try {
            const startDate = req.query.startDate ? new Date(req.query.startDate) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate) : undefined;
            const performance = await contractorsService.getPerformance(req.params.id, startDate, endDate);
            return sendSuccess(res, performance, 'Contractor performance data');
        }
        catch (error) {
            next(error);
        }
    }
    async getViolations(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const { total, alerts } = await contractorsService.getViolations(req.params.id, params);
            return sendPaginated(res, alerts, total, params.page, params.limit, 'Contractor violations retrieved');
        }
        catch (error) {
            next(error);
        }
    }
}
export const contractorsController = new ContractorsController();
//# sourceMappingURL=contractors.controller.js.map