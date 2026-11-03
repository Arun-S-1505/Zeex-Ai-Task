import { Request, Response, NextFunction } from 'express';
export declare class AlertsController {
    list(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    acknowledge(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    assign(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    takeAction(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    close(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    falsePositive(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    missedDetection(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getHistory(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const alertsController: AlertsController;
//# sourceMappingURL=alerts.controller.d.ts.map