import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import prisma from '../config/database.js';
import { UnauthorizedError } from '../utils/errors.js';
export async function authenticate(req, _res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new UnauthorizedError('No authorization token provided');
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId, isActive: true, deletedAt: null },
            include: { role: true },
        });
        if (!user) {
            throw new UnauthorizedError('User not found or account deactivated');
        }
        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: { id: user.role.id, name: user.role.name },
            siteId: user.siteId,
        };
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            next(new UnauthorizedError('Authentication token expired'));
        }
        else if (error instanceof jwt.JsonWebTokenError) {
            next(new UnauthorizedError('Invalid authentication token'));
        }
        else {
            next(error);
        }
    }
}
//# sourceMappingURL=authenticate.js.map