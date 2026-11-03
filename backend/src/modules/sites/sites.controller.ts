import { Request, Response, NextFunction } from 'express';
import { sitesService } from './sites.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class SitesController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const { total, sites } = await sitesService.list(params);
      return sendPaginated(res, sites, total, params.page, params.limit, 'Sites retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const site = await sitesService.getById(req.params.id as string);
      return sendSuccess(res, site, 'Site details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const site = await sitesService.create(req.body, req.user?.id, req.ip);
      return sendSuccess(res, site, 'Site created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const site = await sitesService.update(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, site, 'Site updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await sitesService.delete(req.params.id as string, req.user?.id, req.ip);
      return sendSuccess(res, null, 'Site deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const sitesController = new SitesController();
