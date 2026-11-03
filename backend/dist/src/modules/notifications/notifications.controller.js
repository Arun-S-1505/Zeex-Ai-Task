import { notificationsService } from './notifications.service.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { getPaginationParams } from '../../utils/pagination.js';
export class NotificationsController {
    async list(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;
            const { total, unreadCount, notifications } = await notificationsService.list(req.user.id, params, isRead);
            return res.status(200).json({
                success: true,
                message: 'Notifications retrieved',
                data: notifications,
                unreadCount,
                meta: {
                    total,
                    page: params.page,
                    limit: params.limit,
                    totalPages: Math.ceil(total / params.limit),
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getById(req, res, next) {
        try {
            const notification = await notificationsService.getById(req.params.id, req.user.id);
            return sendSuccess(res, notification, 'Notification details');
        }
        catch (error) {
            next(error);
        }
    }
    async markAsRead(req, res, next) {
        try {
            const notification = await notificationsService.markAsRead(req.params.id, req.user.id);
            return sendSuccess(res, notification, 'Notification marked as read');
        }
        catch (error) {
            next(error);
        }
    }
    async markAllAsRead(req, res, next) {
        try {
            await notificationsService.markAllAsRead(req.user.id);
            return sendSuccess(res, null, 'All notifications marked as read');
        }
        catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            const notification = await notificationsService.create(req.body);
            return sendSuccess(res, notification, 'Notification dispatched', 201);
        }
        catch (error) {
            next(error);
        }
    }
    async getHistory(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const { total, notifications } = await notificationsService.getHistory(params);
            return sendPaginated(res, notifications, total, params.page, params.limit, 'Notification delivery history');
        }
        catch (error) {
            next(error);
        }
    }
    // Escalations
    async listEscalations(req, res, next) {
        try {
            const params = getPaginationParams(req.query);
            const alertId = req.query.alertId;
            const { total, escalations } = await notificationsService.listEscalations(params, alertId);
            return sendPaginated(res, escalations, total, params.page, params.limit, 'Escalations retrieved');
        }
        catch (error) {
            next(error);
        }
    }
    async getEscalationById(req, res, next) {
        try {
            const escalation = await notificationsService.getEscalationById(req.params.id);
            return sendSuccess(res, escalation, 'Escalation details');
        }
        catch (error) {
            next(error);
        }
    }
    async createEscalation(req, res, next) {
        try {
            const escalation = await notificationsService.createEscalation(req.body);
            return sendSuccess(res, escalation, 'Alert escalated successfully', 201);
        }
        catch (error) {
            next(error);
        }
    }
}
export const notificationsController = new NotificationsController();
//# sourceMappingURL=notifications.controller.js.map