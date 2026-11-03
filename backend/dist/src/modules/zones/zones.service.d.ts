import { CreateZoneInput, UpdateZoneInput } from './zones.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class ZonesService {
    list(params: PaginationParams, siteId?: string): Promise<{
        total: number;
        zones: ({
            site: {
                code: string;
                name: string;
                id: string;
            };
            _count: {
                cameras: number;
                workFronts: number;
                alerts: number;
            };
        } & {
            code: string;
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            zoneType: string;
            polygon: import("@prisma/client/runtime/library").JsonValue | null;
            calibration: import("@prisma/client/runtime/library").JsonValue | null;
            riskLevel: string;
        })[];
    }>;
    getById(id: string): Promise<{
        site: {
            code: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            timezone: string;
        };
        cameras: {
            status: string;
            name: string;
            id: string;
            cameraCode: string;
            fps: number | null;
            lastFrameAt: Date | null;
        }[];
        workFronts: {
            code: string;
            status: string;
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            description: string | null;
            zoneId: string | null;
            activity: string | null;
            startDate: Date | null;
            endDate: Date | null;
            shiftPattern: string | null;
        }[];
        ruleInstances: ({
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
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            detectionId: string;
            cameraId: string | null;
            zoneId: string | null;
            workFrontId: string | null;
            confidenceOverride: number | null;
            persistenceOverride: number | null;
            cooldownOverride: number | null;
            severityOverride: string | null;
            timeRestrictions: import("@prisma/client/runtime/library").JsonValue | null;
            version: number;
        })[];
    } & {
        code: string;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        zoneType: string;
        polygon: import("@prisma/client/runtime/library").JsonValue | null;
        calibration: import("@prisma/client/runtime/library").JsonValue | null;
        riskLevel: string;
    }>;
    create(input: CreateZoneInput, actorId?: string, ipAddress?: string): Promise<{
        site: {
            code: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            timezone: string;
        };
    } & {
        code: string;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        zoneType: string;
        polygon: import("@prisma/client/runtime/library").JsonValue | null;
        calibration: import("@prisma/client/runtime/library").JsonValue | null;
        riskLevel: string;
    }>;
    update(id: string, input: UpdateZoneInput, actorId?: string, ipAddress?: string): Promise<{
        site: {
            code: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            city: string | null;
            state: string | null;
            country: string | null;
            latitude: number | null;
            longitude: number | null;
            timezone: string;
        };
    } & {
        code: string;
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        zoneType: string;
        polygon: import("@prisma/client/runtime/library").JsonValue | null;
        calibration: import("@prisma/client/runtime/library").JsonValue | null;
        riskLevel: string;
    }>;
    delete(id: string, actorId?: string, ipAddress?: string): Promise<void>;
}
export declare const zonesService: ZonesService;
//# sourceMappingURL=zones.service.d.ts.map