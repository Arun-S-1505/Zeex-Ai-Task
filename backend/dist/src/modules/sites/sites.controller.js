import { sitesService } from './sites.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class SitesController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const { total, sites } = await sitesService.list(params);
            return sendPaginated(res, sites, total, params.page, params.limit, 'Sites retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const site = await sitesService.getById(req.params.id);
            return sendSuccess(res, site, 'Site details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const site = await sitesService.create(req.body, req.user?.id, req.ip);
            return sendSuccess(res, site, 'Site created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const site = await sitesService.update(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, site, 'Site updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await sitesService.delete(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, null, 'Site deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
export const sitesController = new SitesController();
//# sourceMappingURL=sites.controller.js.map