import { zonesService } from './zones.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class ZonesController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const siteId = req.query.siteId;
            const { total, zones } = await zonesService.list(params, siteId);
            return sendPaginated(res, zones, total, params.page, params.limit, 'Zones retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const zone = await zonesService.getById(req.params.id);
            return sendSuccess(res, zone, 'Zone details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const zone = await zonesService.create(req.body, req.user?.id, req.ip);
            return sendSuccess(res, zone, 'Zone created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const zone = await zonesService.update(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, zone, 'Zone updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await zonesService.delete(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, null, 'Zone deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
export const zonesController = new ZonesController();
//# sourceMappingURL=zones.controller.js.map