import { Request, Response, NextFunction } from 'express';
import { analyticsService, AnalyticsFilter } from './analytics.service.js';
import { sendSuccess } from '../../utils/response.js';

export class AnalyticsController {
  private extractFilter(req: Request): AnalyticsFilter {
    return {
      siteId: req.query.siteId as string | undefined,
      contractorId: req.query.contractorId as string | undefined,
      severity: req.query.severity as string | undefined,
      detectionId: req.query.detectionId as string | undefined,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    };
  }

  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getOverview(this.extractFilter(req));
      return sendSuccess(res, data, 'Overview analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getExecutiveSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getExecutiveSummary(this.extractFilter(req));
      return sendSuccess(res, data, 'Executive summary retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getPpeCompliance(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getPpeCompliance(this.extractFilter(req));
      return sendSuccess(res, data, 'PPE compliance analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getContractorAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getContractorAnalytics(this.extractFilter(req));
      return sendSuccess(res, data, 'Contractor analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getCameraHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const siteId = req.query.siteId as string | undefined;
      const data = await analyticsService.getCameraHealthAnalytics(siteId);
      return sendSuccess(res, data, 'Camera health analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getAlertAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await analyticsService.getAlertAnalytics(this.extractFilter(req));
      return sendSuccess(res, data, 'Alert analytics retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getActivityAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const activityType = req.params.activityType as string;
      const data = await analyticsService.getActivityAnalytics(activityType);
      return sendSuccess(res, data, `${activityType} activity analytics retrieved`);
    } catch (error) {
      next(error);
    }
  }
}

export const analyticsController = new AnalyticsController();
