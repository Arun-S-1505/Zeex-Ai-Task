import { Request, Response, NextFunction } from 'express';
export declare class WorkFrontsController {
    list(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    create(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    update(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    assignContractor(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    bulkImport(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const workFrontsController: WorkFrontsController;
//# sourceMappingURL=workfronts.controller.d.ts.map