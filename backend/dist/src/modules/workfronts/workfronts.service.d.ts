import { CreateWorkFrontInput, UpdateWorkFrontInput, AssignContractorInput } from './workfronts.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class WorkFrontsService {
    list(params: PaginationParams, filters?: {
        siteId?: string;
        status?: string;
        activity?: string;
    }): Promise<{
        total: number;
        workFronts: ({
            site: {
                code: string;
                name: string;
                id: string;
            };
            _count: {
                cameras: number;
                alerts: number;
            };
            zone: {
                code: string;
                name: string;
                id: string;
            } | null;
            contractorAssignments: ({
                contractor: {
                    code: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                workFrontId: string;
                contractorId: string;
                shiftId: string | null;
                startDate: Date;
                endDate: Date | null;
            })[];
        } & {
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
        zone: {
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
        } | null;
        cameras: {
            status: string;
            name: string;
            id: string;
            cameraCode: string;
            recordingStatus: string;
            fps: number | null;
            lastFrameAt: Date | null;
        }[];
        alerts: {
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
        }[];
        contractorAssignments: ({
            contractor: {
                code: string;
                name: string;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                address: string | null;
                contactPerson: string | null;
                contactEmail: string | null;
                contactPhone: string | null;
                registrationNumber: string | null;
                safetyRating: number | null;
            };
        } & {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            workFrontId: string;
            contractorId: string;
            shiftId: string | null;
            startDate: Date;
            endDate: Date | null;
        })[];
    } & {
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
    }>;
    create(input: CreateWorkFrontInput, actorId?: string, ipAddress?: string): Promise<{
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
        zone: {
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
        } | null;
    } & {
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
    }>;
    update(id: string, input: UpdateWorkFrontInput, actorId?: string, ipAddress?: string): Promise<{
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
        zone: {
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
        } | null;
    } & {
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
    }>;
    delete(id: string, actorId?: string, ipAddress?: string): Promise<void>;
    assignContractor(workFrontId: string, input: AssignContractorInput, actorId?: string, ipAddress?: string): Promise<{
        contractor: {
            code: string;
            name: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            address: string | null;
            contactPerson: string | null;
            contactEmail: string | null;
            contactPhone: string | null;
            registrationNumber: string | null;
            safetyRating: number | null;
        };
        workFront: {
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
        };
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        workFrontId: string;
        contractorId: string;
        shiftId: string | null;
        startDate: Date;
        endDate: Date | null;
    }>;
    bulkImport(items: CreateWorkFrontInput[], actorId?: string, ipAddress?: string): Promise<({
        code: string;
        success: boolean;
        id: string;
        error?: undefined;
    } | {
        code: string;
        success: boolean;
        error: any;
        id?: undefined;
    })[]>;
}
export declare const workFrontsService: WorkFrontsService;
//# sourceMappingURL=workfronts.service.d.ts.map