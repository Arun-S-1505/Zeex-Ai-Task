import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';
export function validate(schema, source = 'body') {
    return (req, res, next) => {
        try {
            const parsed = schema.parse(req[source]);
            req[source] = parsed;
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const errors = error.errors.map((e) => ({
                    field: e.path.join('.'),
                    message: e.message,
                }));
                sendError(res, 'Validation failed', 422, errors);
                return;
            }
            next(error);
        }
    };
}
//# sourceMappingURL=validate.js.map