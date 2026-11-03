import { camerasService } from './cameras.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class CamerasController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const filters = {
                siteId: req.query.siteId,
                zoneId: req.query.zoneId,
                status: req.query.status,
            };
            const { total, cameras } = await camerasService.list(params, filters);
            return sendPaginated(res, cameras, total, params.page, params.limit, 'Cameras retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const camera = await camerasService.getById(req.params.id);
            return sendSuccess(res, camera, 'Camera details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const camera = await camerasService.create(req.body, req.user?.id, req.ip);
            return sendSuccess(res, camera, 'Camera created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const camera = await camerasService.update(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, camera, 'Camera updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await camerasService.delete(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, null, 'Camera deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getHealth(req, res, next) {
        try {
            const health = await camerasService.getHealth(req.params.id);
            return sendSuccess(res, health, 'Camera health status');
        }
        catch (error) {
            next(error);
        }
    }
    async getStream(req, res, next) {
        try {
            const stream = await camerasService.getStream(req.params.id);
            return sendSuccess(res, stream, 'Camera stream configuration');
        }
        catch (error) {
            next(error);
        }
    }
    async getHistory(req, res, next) {
        try {
            const history = await camerasService.getHistory(req.params.id);
            return sendSuccess(res, history, 'Camera deployment history');
        }
        catch (error) {
            next(error);
        }
    }
    async assignZone(req, res, next) {
        try {
            const camera = await camerasService.assignZone(req.params.id, req.body.zoneId, req.user?.id, req.ip);
            return sendSuccess(res, camera, 'Zone assigned to camera successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async relocate(req, res, next) {
        try {
            const camera = await camerasService.relocate(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, camera, 'Camera relocated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async calibrate(req, res, next) {
        try {
            const camera = await camerasService.calibrate(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, camera, 'Camera calibrated successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
export const camerasController = new CamerasController();
//# sourceMappingURL=cameras.controller.js.map