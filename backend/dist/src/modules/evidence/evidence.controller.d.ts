import { Request, Response, NextFunction } from 'express';
export declare class EvidenceController {
    list(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getByAlertId(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    upload(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    download(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    delete(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const evidenceController: EvidenceController;
//# sourceMappingURL=evidence.controller.d.ts.map