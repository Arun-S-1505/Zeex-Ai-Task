import { authService } from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
export class AuthController {
    async register(req, res, next) {
        try {
            const result = await authService.register(req.body, req.ip, req.headers['user-agent']);
            return sendSuccess(res, result, 'User registered successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const result = await authService.login(req.body, req.ip, req.headers['user-agent']);
            return sendSuccess(res, result, 'Login successful');
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res, next) {
        try {
            if (req.user) {
                await authService.logout(req.user.id, req.ip, req.headers['user-agent']);
            }
            return sendSuccess(res, null, 'Logged out successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async refresh(req, res, next) {
        try {
            const result = await authService.refresh(req.body.refreshToken);
            return sendSuccess(res, result, 'Token refreshed successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            const user = await authService.getMe(req.user.id);
            return sendSuccess(res, user, 'Current user profile');
        }
        catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
//# sourceMappingURL=auth.controller.js.map