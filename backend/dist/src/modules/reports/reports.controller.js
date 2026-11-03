import { reportsService } from './reports.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class ReportsController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const type = req.query.type;
            const status = req.query.status;
            const { total, reports } = await reportsService.list(params, type, status);
            return sendPaginated(res, reports, total, params.page, params.limit, 'Reports retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const report = await reportsService.getById(req.params.id);
            return sendSuccess(res, report, 'Report details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const report = await reportsService.create(req.body, req.user?.id, req.ip);
            return sendSuccess(res, report, 'Report created and generated', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async generate(req, res, next) {
        try {
            const report = await reportsService.generateReport(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, report, 'Report generated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async download(req, res, next) {
        try {
            const { buffer, fileName, mimeType } = await reportsService.download(req.params.id, req.user?.id, req.ip);
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            return res.send(buffer);
        }
        catch (error) {
            next(error);
        }
    }
    async schedule(req, res, next) {
        try {
            const report = await reportsService.schedule(req.body, req.user?.id, req.ip);
            return sendSuccess(res, report, 'Report schedule created', 201);
        }
        catch (error) {
            next(error);
        }
    }
}
export const reportsController = new ReportsController();
//# sourceMappingURL=reports.controller.js.map