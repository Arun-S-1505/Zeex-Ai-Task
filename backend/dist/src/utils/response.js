export function sendSuccess(res, data, message = 'Success', statusCode = 200, meta) {
    const response = { success: true, message, data };
    if (meta)
        response.meta = meta;
    return res.status(statusCode).json(response);
}
export function sendError(res, message, statusCode = 400, errors) {
    const response = { success: false, message };
    if (errors)
        response.errors = errors;
    return res.status(statusCode).json(response);
}
export function sendPaginated(res, data, total, page, limit, message = 'Success') {
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
//# sourceMappingURL=response.js.map