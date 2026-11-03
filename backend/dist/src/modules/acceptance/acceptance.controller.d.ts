import { Request, Response, NextFunction } from 'express';
export declare class AcceptanceController {
    getConsole(_req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    listMetrics(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    createMeasurement(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    signoff(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const acceptanceController: AcceptanceController;
//# sourceMappingURL=acceptance.controller.d.ts.map