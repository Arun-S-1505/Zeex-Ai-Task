import { AppError } from '../utils/errors.js';
import logger from '../config/logger.js';
export function errorHandler(err, _req, res, _next) {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...('errors' in err ? { errors: err.errors } : {}),
        });
        return;
    }
    logger.error({ err }, 'Unhandled server error');
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
}
//# sourceMappingURL=errorHandler.js.map