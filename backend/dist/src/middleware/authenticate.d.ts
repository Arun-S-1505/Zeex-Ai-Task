import { Request, Response, NextFunction } from 'express';
export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: {
        id: string;
        name: string;
    };
    siteId: string | null;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=authenticate.d.ts.map