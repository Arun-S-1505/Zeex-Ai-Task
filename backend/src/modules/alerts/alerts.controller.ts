import { Request, Response, NextFunction } from 'express';
import { alertsService } from './alerts.service.js';
import { sendSuccess } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class AlertsController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const filters = {
        siteId: req.query.siteId as string | undefined,
        zoneId: req.query.zoneId as string | undefined,
        contractorId: req.query.contractorId as string | undefined,
        severity: req.query.severity as string | undefined,
        status: req.query.status as string | undefined,
        detectionId: req.query.detectionId as string | undefined,
        assignedUserId: req.query.assignedUserId as string | undefined,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };
      const { total, alerts, summary } = await alertsService.list(params, filters);
      return res.status(200).json({
        success: true,
        message: 'Alerts retrieved successfully',
        data: alerts,
        summary,
        meta: {
          total,
          page: params.page,
          limit: params.limit,
          totalPages: Math.ceil(total / params.limit),
          hasMore: params.page * params.limit < total,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.getById(req.params.id as string);
      return sendSuccess(res, alert, 'Alert details retrieved');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.createManual(req.body, req.user?.id, req.ip);
      return sendSuccess(res, alert, 'Alert created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async acknowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.acknowledge(req.params.id as string, req.body, req.user!.id, req.ip);
      return sendSuccess(res, alert, 'Alert acknowledged successfully');
    } catch (error) {
      next(error);
    }
  }

  async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.assign(req.params.id as string, req.body, req.user!.id, req.ip);
      return sendSuccess(res, alert, 'Alert assigned successfully');
    } catch (error) {
      next(error);
    }
  }

  async takeAction(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.takeAction(req.params.id as string, req.body, req.user!.id, req.ip);
      return sendSuccess(res, alert, 'Action recorded for alert');
    } catch (error) {
      next(error);
    }
  }

  async close(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.close(req.params.id as string, req.body, req.user!.id, req.ip);
      return sendSuccess(res, alert, 'Alert closed successfully');
    } catch (error) {
      next(error);
    }
  }

  async falsePositive(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await alertsService.markFalsePositive(req.params.id as string, req.body, req.user!.id, req.ip);
      return sendSuccess(res, alert, 'Alert marked as false positive');
    } catch (error) {
      next(error);
    }
  }

  async missedDetection(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await alertsService.reportMissedDetection(req.body, req.user?.id, req.ip);
      return sendSuccess(res, record, 'Missed detection logged for model evaluation');
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await alertsService.getHistory(req.params.id as string);
      return sendSuccess(res, history, 'Alert history and action timeline');
    } catch (error) {
      next(error);
    }
  }
}

export const alertsController = new AlertsController();
