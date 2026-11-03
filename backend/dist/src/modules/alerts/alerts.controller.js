import { alertsService } from './alerts.service.js';
import { sendSuccess } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class AlertsController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const filters = {
                siteId: req.query.siteId,
                zoneId: req.query.zoneId,
                contractorId: req.query.contractorId,
                severity: req.query.severity,
                status: req.query.status,
                detectionId: req.query.detectionId,
                assignedUserId: req.query.assignedUserId,
                startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
            };
            const { total, alerts, summary } = await alertsService.list(params, filters);
            return res.status(200).json({
                success: true,
                message: 'Alerts retrieved successfully',
                data: alerts,
                summary,
                meta: {
                    total,
                    page: params.page,
                    limit: params.limit,
                    totalPages: Math.ceil(total / params.limit),
                    hasMore: params.page * params.limit < total,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const alert = await alertsService.getById(req.params.id);
            return sendSuccess(res, alert, 'Alert details retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const alert = await alertsService.createManual(req.body, req.user?.id, req.ip);
            return sendSuccess(res, alert, 'Alert created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async acknowledge(req, res, next) {
        try {
            const alert = await alertsService.acknowledge(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, alert, 'Alert acknowledged successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async assign(req, res, next) {
        try {
            const alert = await alertsService.assign(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, alert, 'Alert assigned successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async takeAction(req, res, next) {
        try {
            const alert = await alertsService.takeAction(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, alert, 'Action recorded for alert');
        }
        catch (error) {
            next(error);
        }
    }
    async close(req, res, next) {
        try {
            const alert = await alertsService.close(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, alert, 'Alert closed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async falsePositive(req, res, next) {
        try {
            const alert = await alertsService.markFalsePositive(req.params.id, req.body, req.user.id, req.ip);
            return sendSuccess(res, alert, 'Alert marked as false positive');
        }
        catch (error) {
            next(error);
        }
    }
    async missedDetection(req, res, next) {
        try {
            const record = await alertsService.reportMissedDetection(req.body, req.user?.id, req.ip);
            return sendSuccess(res, record, 'Missed detection logged for model evaluation');
        }
        catch (error) {
            next(error);
        }
    }
    async getHistory(req, res, next) {
        try {
            const history = await alertsService.getHistory(req.params.id);
            return sendSuccess(res, history, 'Alert history and action timeline');
        }
        catch (error) {
            next(error);
        }
    }
}
export const alertsController = new AlertsController();
//# sourceMappingURL=alerts.controller.js.map