import { AIEventInput } from './ai.validation.js';
export declare class AIService {
    processEvent(event: AIEventInput): Promise<{
        status: string;
        reason: string;
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
    } | {
        status: string;
        reason: string | undefined;
        alert?: undefined;
    } | {
        status: string;
        alert: {
            site: {
                code: string;
                name: string;
                id: string;
            };
            zone: {
                code: string;
                name: string;
                id: string;
            } | null;
            camera: {
                name: string;
                id: string;
                cameraCode: string;
            };
            contractor: {
                code: string;
                name: string;
                id: string;
            } | null;
            workFront: {
                code: string;
                name: string;
                id: string;
            } | null;
            detection: {
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                severity: string;
                detectionCode: string;
                procedureReference: string | null;
                tier: number;
                primitives: import("@prisma/client/runtime/library").JsonValue | null;
                confidenceThreshold: number;
                persistenceDuration: number;
                cooldownPeriod: number;
                escalationConfig: import("@prisma/client/runtime/library").JsonValue | null;
                modelVersionId: string | null;
                category: string | null;
            };
        } & {
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
        reason?: undefined;
    }>;
}
export declare const aiService: AIService;
//# sourceMappingURL=ai.service.d.ts.map