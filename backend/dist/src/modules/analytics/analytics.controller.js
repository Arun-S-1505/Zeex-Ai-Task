import { analyticsService } from './analytics.service.js';
import { sendSuccess } from '../../utils/response.js';
export class AnalyticsController {
    extractFilter(req) {
        return {
            siteId: req.query.siteId,
            contractorId: req.query.contractorId,
            severity: req.query.severity,
            detectionId: req.query.detectionId,
            startDate: req.query.startDate ? new Date(req.query.startDate) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate) : undefined,
        };
    }
    async getOverview(req, res, next) {
        try {
            const data = await analyticsService.getOverview(this.extractFilter(req));
            return sendSuccess(res, data, 'Overview analytics retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getExecutiveSummary(req, res, next) {
        try {
            const data = await analyticsService.getExecutiveSummary(this.extractFilter(req));
            return sendSuccess(res, data, 'Executive summary retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getPpeCompliance(req, res, next) {
        try {
            const data = await analyticsService.getPpeCompliance(this.extractFilter(req));
            return sendSuccess(res, data, 'PPE compliance analytics retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getContractorAnalytics(req, res, next) {
        try {
            const data = await analyticsService.getContractorAnalytics(this.extractFilter(req));
            return sendSuccess(res, data, 'Contractor analytics retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getCameraHealth(req, res, next) {
        try {
            const siteId = req.query.siteId;
            const data = await analyticsService.getCameraHealthAnalytics(siteId);
            return sendSuccess(res, data, 'Camera health analytics retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getAlertAnalytics(req, res, next) {
        try {
            const data = await analyticsService.getAlertAnalytics(this.extractFilter(req));
            return sendSuccess(res, data, 'Alert analytics retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getActivityAnalytics(req, res, next) {
        try {
            const activityType = req.params.activityType;
            const data = await analyticsService.getActivityAnalytics(activityType);
            return sendSuccess(res, data, `${activityType} activity analytics retrieved`);
        }
        catch (error) {
            next(error);
        }
    }
}
export const analyticsController = new AnalyticsController();
//# sourceMappingURL=analytics.controller.js.map