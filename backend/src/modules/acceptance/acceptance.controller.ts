import { Request, Response, NextFunction } from 'express';
import { acceptanceService } from './acceptance.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class AcceptanceController {
  async getConsole(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await acceptanceService.getConsole();
      return sendSuccess(res, data, 'Acceptance & SLA console state');
    } catch (error) {
      next(error);
    }
  }

  async listMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const category = req.query.category as string | undefined;
      const { total, records } = await acceptanceService.listMetrics(params, category);
      return sendPaginated(res, records, total, params.page, params.limit, 'Acceptance metrics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createMeasurement(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await acceptanceService.createMeasurement(req.body, req.user?.id, req.ip);
      return sendSuccess(res, record, 'Acceptance measurement recorded', 201);
    } catch (error) {
      next(error);
    }
  }

  async signoff(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await acceptanceService.signoff(req.params.id as string, req.body, req.user!.id, req.ip);
      return sendSuccess(res, record, 'Acceptance record signed off');
    } catch (error) {
      next(error);
    }
  }
}

export const acceptanceController = new AcceptanceController();
