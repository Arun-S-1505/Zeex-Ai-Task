import { Response } from 'express';
export declare function sendSuccess(res: Response, data: any, message?: string, statusCode?: number, meta?: any): Response<any, Record<string, any>>;
export declare function sendError(res: Response, message: string, statusCode?: number, errors?: any[]): Response<any, Record<string, any>>;
export declare function sendPaginated(res: Response, data: any[], total: number, page: number, limit: number, message?: string): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map