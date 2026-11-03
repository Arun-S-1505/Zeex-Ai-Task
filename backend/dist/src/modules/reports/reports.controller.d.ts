import { Request, Response, NextFunction } from 'express';
export declare class ReportsController {
    list(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    generate(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    download(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    schedule(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const reportsController: ReportsController;
//# sourceMappingURL=reports.controller.d.ts.map