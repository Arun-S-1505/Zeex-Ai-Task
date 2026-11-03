import { CreateNotificationInput, CreateEscalationInput } from './notifications.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export interface DeliveryAdapter {
    send(recipient: any, title: string, message: string): Promise<boolean>;
}
export declare class NotificationsService {
    list(recipientId: string, params: PaginationParams, isRead?: boolean): Promise<{
        total: number;
        unreadCount: number;
        notifications: ({
            alert: {
                id: string;
                alertCode: string;
                title: string;
                severity: string;
            } | null;
        } & {
            message: string;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            alertId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            recipientId: string;
            channel: string;
            isRead: boolean;
            readAt: Date | null;
            deliveryStatus: string;
            retryCount: number;
        })[];
    }>;
    getById(id: string, recipientId: string): Promise<{
        alert: {
            status: string;
            id: string;
            siteId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            alertCode: string;
            detectionId: string;
            cameraId: string;
            zoneId: string | null;
            workFrontId: string | null;
            contractorId: string | null;
            title: string;
            severity: string;
            confidence: number;
            occurredAt: Date;
            raisedAt: Date | null;
            acknowledgedAt: Date | null;
            assignedAt: Date | null;
            closedAt: Date | null;
            assignedUserId: string | null;
            modelVersion: string | null;
            ruleVersion: number | null;
            trackId: string | null;
            boundingBox: import("@prisma/client/runtime/library").JsonValue | null;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string | null;
            slaDeadline: Date | null;
            closureRemarks: string | null;
        } | null;
    } & {
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        alertId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        recipientId: string;
        channel: string;
        isRead: boolean;
        readAt: Date | null;
        deliveryStatus: string;
        retryCount: number;
    }>;
    markAsRead(id: string, recipientId: string): Promise<{
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        alertId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        recipientId: string;
        channel: string;
        isRead: boolean;
        readAt: Date | null;
        deliveryStatus: string;
        retryCount: number;
    }>;
    markAllAsRead(recipientId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    create(input: CreateNotificationInput): Promise<{
        alert: {
            status: string;
            id: string;
            siteId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            alertCode: string;
            detectionId: string;
            cameraId: string;
            zoneId: string | null;
            workFrontId: string | null;
            contractorId: string | null;
            title: string;
            severity: string;
            confidence: number;
            occurredAt: Date;
            raisedAt: Date | null;
            acknowledgedAt: Date | null;
            assignedAt: Date | null;
            closedAt: Date | null;
            assignedUserId: string | null;
            modelVersion: string | null;
            ruleVersion: number | null;
            trackId: string | null;
            boundingBox: import("@prisma/client/runtime/library").JsonValue | null;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string | null;
            slaDeadline: Date | null;
            closureRemarks: string | null;
        } | null;
    } & {
        message: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        alertId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        recipientId: string;
        channel: string;
        isRead: boolean;
        readAt: Date | null;
        deliveryStatus: string;
        retryCount: number;
    }>;
    getHistory(params: PaginationParams): Promise<{
        total: number;
        notifications: ({
            alert: {
                alertCode: string;
                title: string;
            } | null;
            recipient: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
        } & {
            message: string;
            type: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            alertId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            recipientId: string;
            channel: string;
            isRead: boolean;
            readAt: Date | null;
            deliveryStatus: string;
            retryCount: number;
        })[];
    }>;
    listEscalations(params: PaginationParams, alertId?: string): Promise<{
        total: number;
        escalations: ({
            alert: {
                status: string;
                id: string;
                alertCode: string;
                title: string;
                severity: string;
            };
        } & {
            status: string;
            level: number;
            id: string;
            createdAt: Date;
            alertId: string;
            reason: string | null;
            resolvedAt: Date | null;
            escalatedTo: string | null;
            escalatedAt: Date;
        })[];
    }>;
    getEscalationById(id: string): Promise<{
        alert: {
            status: string;
            id: string;
            siteId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            alertCode: string;
            detectionId: string;
            cameraId: string;
            zoneId: string | null;
            workFrontId: string | null;
            contractorId: string | null;
            title: string;
            severity: string;
            confidence: number;
            occurredAt: Date;
            raisedAt: Date | null;
            acknowledgedAt: Date | null;
            assignedAt: Date | null;
            closedAt: Date | null;
            assignedUserId: string | null;
            modelVersion: string | null;
            ruleVersion: number | null;
            trackId: string | null;
            boundingBox: import("@prisma/client/runtime/library").JsonValue | null;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string | null;
            slaDeadline: Date | null;
            closureRemarks: string | null;
        };
    } & {
        status: string;
        level: number;
        id: string;
        createdAt: Date;
        alertId: string;
        reason: string | null;
        resolvedAt: Date | null;
        escalatedTo: string | null;
        escalatedAt: Date;
    }>;
    createEscalation(input: CreateEscalationInput): Promise<{
        alert: {
            status: string;
            id: string;
            siteId: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            alertCode: string;
            detectionId: string;
            cameraId: string;
            zoneId: string | null;
            workFrontId: string | null;
            contractorId: string | null;
            title: string;
            severity: string;
            confidence: number;
            occurredAt: Date;
            raisedAt: Date | null;
            acknowledgedAt: Date | null;
            assignedAt: Date | null;
            closedAt: Date | null;
            assignedUserId: string | null;
            modelVersion: string | null;
            ruleVersion: number | null;
            trackId: string | null;
            boundingBox: import("@prisma/client/runtime/library").JsonValue | null;
            attributes: import("@prisma/client/runtime/library").JsonValue | null;
            eventId: string | null;
            slaDeadline: Date | null;
            closureRemarks: string | null;
        };
    } & {
        status: string;
        level: number;
        id: string;
        createdAt: Date;
        alertId: string;
        reason: string | null;
        resolvedAt: Date | null;
        escalatedTo: string | null;
        escalatedAt: Date;
    }>;
}
export declare const notificationsService: NotificationsService;
//# sourceMappingURL=notifications.service.d.ts.map