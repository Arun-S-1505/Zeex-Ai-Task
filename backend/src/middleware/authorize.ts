import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors.js';

export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required'));
      return;
    }
    if (roles.length > 0 && !roles.includes(req.user.role.name)) {
      next(new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`));
      return;
    }
    next();
  };
}

export function authorizeResource(resource: string, action: string) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      next(new ForbiddenError('Authentication required'));
      return;
    }

    if (req.user.role.name === 'ADMIN') {
      next();
      return;
    }

    const rolePermissions: Record<string, Record<string, string[]>> = {
      OPERATOR: {
        alerts: ['read', 'create', 'update', 'acknowledge', 'assign', 'action', 'close', 'false_positive'],
        cameras: ['read'],
        evidence: ['read', 'upload', 'download'],
        notifications: ['read', 'update'],
        shifts: ['read', 'create'],
        'shift-handovers': ['read', 'create', 'acknowledge'],
        sites: ['read'],
        zones: ['read'],
        'work-fronts': ['read'],
        contractors: ['read'],
        detections: ['read'],
        rules: ['read'],
        analytics: ['read'],
        'system-health': ['read'],
        faults: ['read', 'create'],
      },
      MANAGEMENT: {
        alerts: ['read'],
        cameras: ['read'],
        evidence: ['read', 'download'],
        notifications: ['read', 'update'],
        analytics: ['read'],
        reports: ['read', 'create', 'download'],
        contractors: ['read'],
        sites: ['read'],
        zones: ['read'],
        'work-fronts': ['read'],
        detections: ['read'],
        rules: ['read'],
        acceptance: ['read', 'signoff'],
        'system-health': ['read'],
      },
    };

    const permissions = rolePermissions[req.user.role.name];
    if (!permissions || !permissions[resource]?.includes(action)) {
      next(new ForbiddenError(`Access denied for ${action} on ${resource}`));
      return;
    }

    next();
  };
}
