import { Request, Response, NextFunction } from 'express';
import { detectionsService } from './detections.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';

export class DetectionsController {
  async listDetections(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const tier = req.query.tier ? parseInt(req.query.tier as string) : undefined;
      const category = req.query.category as string | undefined;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined;
      const { total, detections } = await detectionsService.listDetections(params, tier, category, isActive);
      return sendPaginated(res, detections, total, params.page, params.limit, 'Detection definitions retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getDetectionById(req: Request, res: Response, next: NextFunction) {
    try {
      const detection = await detectionsService.getDetectionById(req.params.id as string);
      return sendSuccess(res, detection, 'Detection definition details');
    } catch (error) {
      next(error);
    }
  }

  async createDetection(req: Request, res: Response, next: NextFunction) {
    try {
      const detection = await detectionsService.createDetection(req.body, req.user?.id, req.ip);
      return sendSuccess(res, detection, 'Detection definition created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateDetection(req: Request, res: Response, next: NextFunction) {
    try {
      const detection = await detectionsService.updateDetection(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, detection, 'Detection definition updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async updateDetectionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const detection = await detectionsService.updateDetectionStatus(req.params.id as string, req.body.isActive, req.user?.id, req.ip);
      return sendSuccess(res, detection, 'Detection status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async getDetectionHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await detectionsService.getDetectionHistory(req.params.id as string);
      return sendSuccess(res, history, 'Detection history retrieved');
    } catch (error) {
      next(error);
    }
  }

  // ===================== RULES =====================

  async listRules(req: Request, res: Response, next: NextFunction) {
    try {
      const params = getPaginationParams(req.query);
      const detectionId = req.query.detectionId as string | undefined;
      const cameraId = req.query.cameraId as string | undefined;
      const zoneId = req.query.zoneId as string | undefined;
      const { total, rules } = await detectionsService.listRules(params, detectionId, cameraId, zoneId);
      return sendPaginated(res, rules, total, params.page, params.limit, 'Rules retrieved');
    } catch (error) {
      next(error);
    }
  }

  async getRuleById(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await detectionsService.getRuleById(req.params.id as string);
      return sendSuccess(res, rule, 'Rule details');
    } catch (error) {
      next(error);
    }
  }

  async createRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await detectionsService.createRule(req.body, req.user?.id, req.ip);
      return sendSuccess(res, rule, 'Rule instance created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await detectionsService.updateRule(req.params.id as string, req.body, req.user?.id, req.ip);
      return sendSuccess(res, rule, 'Rule instance updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      await detectionsService.deleteRule(req.params.id as string, req.user?.id, req.ip);
      return sendSuccess(res, null, 'Rule instance deactivated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const detectionsController = new DetectionsController();
