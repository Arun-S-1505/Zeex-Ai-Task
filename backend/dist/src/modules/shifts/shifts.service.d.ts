import { CreateShiftInput, CreateShiftHandoverInput, AcknowledgeHandoverInput } from './shifts.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class ShiftsService {
    listShifts(siteId?: string): Promise<({
        site: {
            code: string;
            name: string;
            id: string;
        };
    } & {
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        startTime: string;
        endTime: string;
    })[]>;
    createShift(input: CreateShiftInput, actorId?: string, ipAddress?: string): Promise<{
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
        name: string;
        id: string;
        siteId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        startTime: string;
        endTime: string;
    }>;
    listHandovers(params: PaginationParams, shiftId?: string, status?: string): Promise<{
        total: number;
        handovers: ({
            shift: {
                site: {
                    code: string;
                    name: string;
                };
            } & {
                name: string;
                id: string;
                siteId: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                startTime: string;
                endTime: string;
            };
            outgoingUser: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            };
            incomingUser: {
                id: string;
                email: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            acknowledgedAt: Date | null;
            shiftId: string;
            outgoingUserId: string;
            incomingUserId: string | null;
            openAlerts: import("@prisma/client/runtime/library").JsonValue | null;
            unresolvedFaults: import("@prisma/client/runtime/library").JsonValue | null;
            cameraRelocations: import("@prisma/client/runtime/library").JsonValue | null;
            notes: string | null;
        })[];
    }>;
    getHandoverById(id: string): Promise<{
        shift: {
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
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startTime: string;
            endTime: string;
        };
        outgoingUser: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        incomingUser: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        acknowledgedAt: Date | null;
        shiftId: string;
        outgoingUserId: string;
        incomingUserId: string | null;
        openAlerts: import("@prisma/client/runtime/library").JsonValue | null;
        unresolvedFaults: import("@prisma/client/runtime/library").JsonValue | null;
        cameraRelocations: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }>;
    createHandover(input: CreateShiftHandoverInput, outgoingUserId: string, ipAddress?: string): Promise<{
        shift: {
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startTime: string;
            endTime: string;
        };
        outgoingUser: {
            firstName: string;
            lastName: string;
        };
        incomingUser: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        acknowledgedAt: Date | null;
        shiftId: string;
        outgoingUserId: string;
        incomingUserId: string | null;
        openAlerts: import("@prisma/client/runtime/library").JsonValue | null;
        unresolvedFaults: import("@prisma/client/runtime/library").JsonValue | null;
        cameraRelocations: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }>;
    acknowledgeHandover(id: string, input: AcknowledgeHandoverInput, incomingUserId: string, ipAddress?: string): Promise<{
        shift: {
            name: string;
            id: string;
            siteId: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            startTime: string;
            endTime: string;
        };
        outgoingUser: {
            firstName: string;
            lastName: string;
        };
        incomingUser: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        acknowledgedAt: Date | null;
        shiftId: string;
        outgoingUserId: string;
        incomingUserId: string | null;
        openAlerts: import("@prisma/client/runtime/library").JsonValue | null;
        unresolvedFaults: import("@prisma/client/runtime/library").JsonValue | null;
        cameraRelocations: import("@prisma/client/runtime/library").JsonValue | null;
        notes: string | null;
    }>;
}
export declare const shiftsService: ShiftsService;
//# sourceMappingURL=shifts.service.d.ts.map