import { Request, Response, NextFunction } from 'express';
export declare class AIController {
    handleEvent(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
export declare const aiController: AIController;
//# sourceMappingURL=ai.controller.d.ts.map