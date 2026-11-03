import { Response } from 'express';

export function sendSuccess(res: Response, data: any, message = 'Success', statusCode = 200, meta?: any) {
  const response: any = { success: true, message, data };
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
}

export function sendError(res: Response, message: string, statusCode = 400, errors?: any[]) {
  const response: any = { success: false, message };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

export function sendPaginated(res: Response, data: any[], total: number, page: number, limit: number, message = 'Success') {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
}

