import { usersService } from './users.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class UsersController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const role = req.query.role;
            const siteId = req.query.siteId;
            const { total, users } = await usersService.list(params, role, siteId);
            return sendPaginated(res, users, total, params.page, params.limit, 'Users retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const user = await usersService.getById(req.params.id);
            return sendSuccess(res, user, 'User details');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const user = await usersService.create(req.body, req.user?.id, req.ip);
            return sendSuccess(res, user, 'User created successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const user = await usersService.update(req.params.id, req.body, req.user?.id, req.ip);
            return sendSuccess(res, user, 'User updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async updateRole(req, res, next) {
        try {
            const user = await usersService.updateRole(req.params.id, req.body.roleName, req.user?.id, req.ip);
            return sendSuccess(res, user, 'User role updated successfully');
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            await usersService.delete(req.params.id, req.user?.id, req.ip);
            return sendSuccess(res, null, 'User deleted successfully');
        }
        catch (error) {
            next(error);
        }
    }
}
export const usersController = new UsersController();
//# sourceMappingURL=users.controller.js.map