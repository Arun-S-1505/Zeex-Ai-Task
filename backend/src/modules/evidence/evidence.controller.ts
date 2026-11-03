import { Request, Response, NextFunction } from 'express';
import { evidenceService } from './evidence.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class EvidenceController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const alertId = req.query.alertId as string | undefined;
      const type = req.query.type as string | undefined;
      const { total, evidence } = await evidenceService.list(params, alertId, type);
      return sendPaginated(res, evidence, total, params.page, params.limit, 'Evidence retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const evidence = await evidenceService.getById(req.params.id as string, req.user!.id, req.ip);
      return sendSuccess(res, evidence, 'Evidence details');
    } catch (error) {
      next(error);
    }
  }

  async getByAlertId(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await evidenceService.getByAlertId(req.params.alertId as string, req.user!.id, req.ip);
      return sendSuccess(res, items, 'Alert evidence records');
    } catch (error) {
      next(error);
    }
  }

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const evidence = await evidenceService.upload(
        req.file!,
        req.body,
        req.user!.id,
        req.ip
      );
      return sendSuccess(res, evidence, 'Evidence uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const { buffer, fileName, mimeType } = await evidenceService.download(
        req.params.id as string,
        req.user!.id,
        req.ip
      );
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      return res.send(buffer);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await evidenceService.delete(req.params.id as string, req.user!.id, req.ip);
      return sendSuccess(res, null, 'Evidence deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const evidenceController = new EvidenceController();
