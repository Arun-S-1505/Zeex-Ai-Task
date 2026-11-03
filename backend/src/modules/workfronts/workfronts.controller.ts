import { Request, Response, NextFunction } from 'express';
import { workFrontsService } from './workfronts.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class WorkFrontsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const filters = {
        siteId: req.query.siteId as string | undefined,
        status: req.query.status as string | undefined,
        activity: req.query.activity as string | undefined,
      };
      const { total, workFronts } = await workFrontsService.list(params, filters);
      return sendPaginated(res, workFronts, total, params.page, params.limit, 'Work fronts retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const workFront = await workFrontsService.getById(req.params.id as string);
      return sendSuccess(res, workFront, 'Work front details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const workFront = await workFrontsService.create(req.body, req.user?.id, req.ip);
      return sendSuccess(res, workFront, 'Work front created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const workFront = await workFrontsService.update(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, workFront, 'Work front updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await workFrontsService.delete(req.params.id as string, req.user?.id, req.ip);
      return sendSuccess(res, null, 'Work front deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async assignContractor(req: Request, res: Response, next: NextFunction) {
    try {
      const assignment = await workFrontsService.assignContractor(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, assignment, 'Contractor assigned to work front successfully');
    } catch (error) {
      next(error);
    }
  }

  async bulkImport(req: Request, res: Response, next: NextFunction) {
    try {
      const results = await workFrontsService.bulkImport(req.body.items, req.user?.id, req.ip);
      return sendSuccess(res, results, 'Work fronts bulk import completed');
    } catch (error) {
      next(error);
    }
  }
}

export const workFrontsController = new WorkFrontsController();
