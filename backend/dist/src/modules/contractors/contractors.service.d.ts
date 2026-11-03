import { CreateContractorInput, UpdateContractorInput } from './contractors.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class ContractorsService {
    list(params: PaginationParams): Promise<{
        total: number;
        contractors: ({
            _count: {
                alerts: number;
                workFrontAssignments: number;
            };
        } & {
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
        })[];
    }>;
    getById(id: string): Promise<{
        _count: {
            alerts: number;
        };
        workFrontAssignments: ({
            workFront: {
                code: string;
                name: string;
                id: string;
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
    }>;
    create(input: CreateContractorInput, actorId?: string, ipAddress?: string): Promise<{
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
    }>;
    update(id: string, input: UpdateContractorInput, actorId?: string, ipAddress?: string): Promise<{
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
    }>;
    delete(id: string, actorId?: string, ipAddress?: string): Promise<void>;
    getPerformance(id: string, startDate?: Date, endDate?: Date): Promise<{
        contractor: {
            id: string;
            name: string;
            code: string;
        };
        totalViolations: number;
        criticalViolations: number;
        closedViolations: number;
        violationRate: number;
        resolutionRate: number;
        safetyRating: number;
        period: {
            startDate: Date;
            endDate: Date;
        };
    }>;
    getViolations(id: string, params: PaginationParams): Promise<{
        total: number;
        alerts: ({
            zone: {
                name: string;
            } | null;
            camera: {
                name: string;
                cameraCode: string;
            };
            workFront: {
                name: string;
            } | null;
            detection: {
                name: string;
                detectionCode: string;
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
        })[];
    }>;
}
export declare const contractorsService: ContractorsService;
//# sourceMappingURL=contractors.service.d.ts.map