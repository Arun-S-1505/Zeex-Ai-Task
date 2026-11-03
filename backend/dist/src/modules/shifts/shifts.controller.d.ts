import { Request, Response, NextFunction } from 'express';
export declare class ShiftsController {
    listShifts(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    createShift(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    listHandovers(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    getHandoverById(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    createHandover(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    acknowledgeHandover(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const shiftsController: ShiftsController;
//# sourceMappingURL=shifts.controller.d.ts.map