import { Request, Response, NextFunction } from 'express';
import { systemHealthService } from './system-health.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class SystemHealthController {
  async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const health = await systemHealthService.getSystemHealth();
      return sendSuccess(res, health, 'System health check');
    } catch (error) {
      next(error);
    }
  }

  async getMetrics(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await systemHealthService.getMetrics();
      return sendSuccess(res, metrics, 'System performance metrics');
    } catch (error) {
      next(error);
    }
  }

  async getStorage(_req: Request, res: Response, next: NextFunction) {
    try {
      const storage = await systemHealthService.getStorageMetrics();
      return sendSuccess(res, storage, 'Storage telemetry metrics');
    } catch (error) {
      next(error);
    }
  }

  async getNetwork(_req: Request, res: Response, next: NextFunction) {
    try {
      const network = await systemHealthService.getNetworkMetrics();
      return sendSuccess(res, network, 'Network telemetry metrics');
    } catch (error) {
      next(error);
    }
  }

  // Fault tickets
  async listFaults(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const status = req.query.status as string | undefined;
      const severity = req.query.severity as string | undefined;
      const { total, tickets } = await systemHealthService.listFaultTickets(params, status, severity);
      return sendPaginated(res, tickets, total, params.page, params.limit, 'Fault tickets retrieved');
    } catch (error) {
      next(error);
    }
  }

  async createFault(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await systemHealthService.createFaultTicket(req.body, req.user?.id, req.ip);
      return sendSuccess(res, ticket, 'Fault ticket created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateFault(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await systemHealthService.updateFaultTicket(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, ticket, 'Fault ticket updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async closeFault(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await systemHealthService.closeFaultTicket(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, ticket, 'Fault ticket closed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const systemHealthController = new SystemHealthController();
