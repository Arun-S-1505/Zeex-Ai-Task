import { Request, Response, NextFunction } from 'express';
export declare class SystemHealthController {
    getHealth(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getMetrics(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getStorage(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getNetwork(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    listFaults(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    createFault(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    updateFault(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    closeFault(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const systemHealthController: SystemHealthController;
//# sourceMappingURL=system-health.controller.d.ts.map