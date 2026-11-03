import prisma from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import { CreateNotificationInput, CreateEscalationInput } from './notifications.validation.js';
import { PaginationParams, buildPrismaQuery } from '../../utils/pagination.js';
import { emitNotification } from '../../sockets/index.js';
import logger from '../../config/logger.js';

// Pluggable delivery adapters
export interface DeliveryAdapter {
  send(recipient: any, title: string, message: string): Promise<boolean>;
}

class EmailAdapter implements DeliveryAdapter {
  async send(recipient: any, title: string, message: string): Promise<boolean> {
    logger.info({ to: recipient.email, title }, `[Email Mock] Sent email: ${message}`);
    return true;
  }
}

class SmsAdapter implements DeliveryAdapter {
  async send(recipient: any, title: string, message: string): Promise<boolean> {
    logger.info({ to: recipient.phone, title }, `[SMS Mock] Sent SMS: ${message}`);
    return true;
  }
}

class PushAdapter implements DeliveryAdapter {
  async send(recipient: any, title: string, message: string): Promise<boolean> {
    logger.info({ userId: recipient.id, title }, `[Push Mock] Sent mobile push notification: ${message}`);
    return true;
  }
}

const adapters: Record<string, DeliveryAdapter> = {
  email: new EmailAdapter(),
  sms: new SmsAdapter(),
  push: new PushAdapter(),
};

export class NotificationsService {
  async list(recipientId: string, params: PaginationParams, isRead?: boolean) {
    const where: any = { recipientId };
    if (isRead !== undefined) where.isRead = isRead;

    const [total, unreadCount, notifications] = await Promise.all([
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { recipientId, isRead: false } }),
      prisma.notification.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          alert: {
            select: { id: true, alertCode: true, title: true, severity: true },
          },
        },
      }),
    ]);

    return { total, unreadCount, notifications };
  }

  async getById(id: string, recipientId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, recipientId },
      include: { alert: true },
    });
    if (!notification) throw new NotFoundError('Notification');
    return notification;
  }

  async markAsRead(id: string, recipientId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, recipientId },
    });
    if (!notification) throw new NotFoundError('Notification');

    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async markAllAsRead(recipientId: string) {
    return prisma.notification.updateMany({
      where: { recipientId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  async create(input: CreateNotificationInput) {
    const recipient = await prisma.user.findUnique({
      where: { id: input.recipientId },
    });
    if (!recipient) throw new NotFoundError('Recipient user');

    // Deliver via external channel adapter if not in_app
    let deliveryStatus = 'delivered';
    if (input.channel !== 'in_app' && adapters[input.channel]) {
      try {
        await adapters[input.channel].send(recipient, input.title, input.message);
      } catch (err: any) {
        logger.error({ err }, 'Notification delivery adapter failed');
        deliveryStatus = 'failed';
      }
    }

    const notification = await prisma.notification.create({
      data: {
        recipientId: input.recipientId,
        alertId: input.alertId,
        type: input.type,
        title: input.title,
        message: input.message,
        channel: input.channel,
        deliveryStatus,
        metadata: input.metadata,
      },
      include: { alert: true },
    });

    // Real-time socket delivery
    emitNotification(input.recipientId, notification);

    return notification;
  }

  async getHistory(params: PaginationParams) {
    const [total, notifications] = await Promise.all([
      prisma.notification.count(),
      prisma.notification.findMany({
        ...buildPrismaQuery(params),
        include: {
          recipient: { select: { id: true, firstName: true, lastName: true, email: true } },
          alert: { select: { alertCode: true, title: true } },
        },
      }),
    ]);
    return { total, notifications };
  }

  // ===================== ESCALATIONS =====================

  async listEscalations(params: PaginationParams, alertId?: string) {
    const where: any = {};
    if (alertId) where.alertId = alertId;

    const [total, escalations] = await Promise.all([
      prisma.escalation.count({ where }),
      prisma.escalation.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          alert: {
            select: { id: true, alertCode: true, title: true, severity: true, status: true },
          },
        },
      }),
    ]);
    return { total, escalations };
  }

  async getEscalationById(id: string) {
    const escalation = await prisma.escalation.findUnique({
      where: { id },
      include: { alert: true },
    });
    if (!escalation) throw new NotFoundError('Escalation');
    return escalation;
  }

  async createEscalation(input: CreateEscalationInput) {
    const alert = await prisma.alert.findUnique({ where: { id: input.alertId } });
    if (!alert) throw new NotFoundError('Alert');

    const escalation = await prisma.escalation.create({
      data: {
        alertId: input.alertId,
        level: input.level,
        escalatedTo: input.escalatedTo,
        reason: input.reason,
        status: 'active',
      },
      include: { alert: true },
    });

    logger.warn(
      { alertCode: alert.alertCode, level: input.level, escalatedTo: input.escalatedTo },
      'Alert escalated'
    );

    return escalation;
  }
}

export const notificationsService = new NotificationsService();
