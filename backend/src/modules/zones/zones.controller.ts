import { Request, Response, NextFunction } from 'express';
import { zonesService } from './zones.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class ZonesController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const siteId = req.query.siteId as string | undefined;
      const { total, zones } = await zonesService.list(params, siteId);
      return sendPaginated(res, zones, total, params.page, params.limit, 'Zones retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const zone = await zonesService.getById(req.params.id as string);
      return sendSuccess(res, zone, 'Zone details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const zone = await zonesService.create(req.body, req.user?.id, req.ip);
      return sendSuccess(res, zone, 'Zone created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const zone = await zonesService.update(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, zone, 'Zone updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await zonesService.delete(req.params.id as string, req.user?.id, req.ip);
      return sendSuccess(res, null, 'Zone deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const zonesController = new ZonesController();
