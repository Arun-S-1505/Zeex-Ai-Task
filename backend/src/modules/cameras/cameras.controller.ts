import { Request, Response, NextFunction } from 'express';
import { camerasService } from './cameras.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class CamerasController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const filters = {
        siteId: req.query.siteId as string | undefined,
        zoneId: req.query.zoneId as string | undefined,
        status: req.query.status as string | undefined,
      };
      const { total, cameras } = await camerasService.list(params, filters);
      return sendPaginated(res, cameras, total, params.page, params.limit, 'Cameras retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await camerasService.getById(req.params.id as string);
      return sendSuccess(res, camera, 'Camera details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await camerasService.create(req.body, req.user?.id, req.ip);
      return sendSuccess(res, camera, 'Camera created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await camerasService.update(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, camera, 'Camera updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await camerasService.delete(req.params.id as string, req.user?.id, req.ip);
      return sendSuccess(res, null, 'Camera deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const health = await camerasService.getHealth(req.params.id as string);
      return sendSuccess(res, health, 'Camera health status');
    } catch (error) {
      next(error);
    }
  }

  async getStream(req: Request, res: Response, next: NextFunction) {
    try {
      const stream = await camerasService.getStream(req.params.id as string);
      return sendSuccess(res, stream, 'Camera stream configuration');
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await camerasService.getHistory(req.params.id as string);
      return sendSuccess(res, history, 'Camera deployment history');
    } catch (error) {
      next(error);
    }
  }

  async assignZone(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await camerasService.assignZone(req.params.id as string, req.body.zoneId, req.user?.id, req.ip);
      return sendSuccess(res, camera, 'Zone assigned to camera successfully');
    } catch (error) {
      next(error);
    }
  }

  async relocate(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await camerasService.relocate(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, camera, 'Camera relocated successfully');
    } catch (error) {
      next(error);
    }
  }

  async calibrate(req: Request, res: Response, next: NextFunction) {
    try {
      const camera = await camerasService.calibrate(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, camera, 'Camera calibrated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const camerasController = new CamerasController();
