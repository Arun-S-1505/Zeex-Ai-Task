import { Request, Response, NextFunction } from 'express';
import { contractorsService } from './contractors.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class ContractorsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const { total, contractors } = await contractorsService.list(params);
      return sendPaginated(res, contractors, total, params.page, params.limit, 'Contractors retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const contractor = await contractorsService.getById(req.params.id as string);
      return sendSuccess(res, contractor, 'Contractor details');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const contractor = await contractorsService.create(req.body, req.user?.id, req.ip);
      return sendSuccess(res, contractor, 'Contractor created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const contractor = await contractorsService.update(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, contractor, 'Contractor updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await contractorsService.delete(req.params.id as string, req.user?.id, req.ip);
      return sendSuccess(res, null, 'Contractor deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      const performance = await contractorsService.getPerformance(req.params.id as string, startDate, endDate);
      return sendSuccess(res, performance, 'Contractor performance data');
    } catch (error) {
      next(error);
    }
  }

  async getViolations(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const { total, alerts } = await contractorsService.getViolations(req.params.id as string, params);
      return sendPaginated(res, alerts, total, params.page, params.limit, 'Contractor violations retrieved');
    } catch (error) {
      next(error);
    }
  }
}

export const contractorsController = new ContractorsController();
