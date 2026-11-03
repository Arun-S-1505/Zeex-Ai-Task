import { detectionsService } from './detections.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class DetectionsController {
    async listDetections(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const tier = req.query.tier ? parseInt(req.query.tier) : undefined;
            const category = req.query.category;
            const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
            const { total, detections } = await detectionsService.listDetections(params, tier, category, isActive);
            return sendPaginated(res, detections, total, params.page, params.limit, 'Detection definitions retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getDetectionById(req, res, next) {
        try {
            const detection = await detectionsService.getDetectionById(req.params.id);
            return sendSuccess(res, detection, 'Detection definition details');
        }
        catch (error) {
            next(error);
        }
    }
    async createDetection(req, res, next) {
        try {
            const detection = await detectionsService.createDetection(req.body, req.user?.id, req.ip);
            return sendSuccess(res, detection, 'Detection definition created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async updateDetection(req, res, next) {
        try {
            const detection = await detectionsService.updateDetection(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, detection, 'Detection definition updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async updateDetectionStatus(req, res, next) {
        try {
            const detection = await detectionsService.updateDetectionStatus(req.params.id, req.body.isActive, req.user?.id, req.ip);
            return sendSuccess(res, detection, 'Detection status updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getDetectionHistory(req, res, next) {
        try {
            const history = await detectionsService.getDetectionHistory(req.params.id);
            return sendSuccess(res, history, 'Detection history retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    // ===================== RULES =====================
    async listRules(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const detectionId = req.query.detectionId;
            const cameraId = req.query.cameraId;
            const zoneId = req.query.zoneId;
            const { total, rules } = await detectionsService.listRules(params, detectionId, cameraId, zoneId);
            return sendPaginated(res, rules, total, params.page, params.limit, 'Rules retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getRuleById(req, res, next) {
        try {
            const rule = await detectionsService.getRuleById(req.params.id);
            return sendSuccess(res, rule, 'Rule details');
        }
        catch (error) {
            next(error);
        }
    }
    async createRule(req, res, next) {
        try {
            const rule = await detectionsService.createRule(req.body, req.user?.id, req.ip);
            return sendSuccess(res, rule, 'Rule instance created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async updateRule(req, res, next) {
        try {
            const rule = await detectionsService.updateRule(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, rule, 'Rule instance updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async deleteRule(req, res, next) {
        try {
            await detectionsService.deleteRule(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, null, 'Rule instance deactivated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
export const detectionsController = new DetectionsController();
//# sourceMappingURL=detections.controller.js.map