import { Request, Response, NextFunction } from 'express';
export declare function authorize(...roles: string[]): (req: Request, _res: Response, next: NextFunction) => void;
export declare function authorizeResource(resource: string, action: string): (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=authorize.d.ts.map