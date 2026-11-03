import { CreateFaultTicketInput, UpdateFaultTicketInput, CloseFaultTicketInput } from './system-health.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class SystemHealthService {
    getSystemHealth(): Promise<{
        status: string;
        timestamp: Date;
        uptime: string;
        aiInference: {
            status: string;
            latencyMs: number;
            modelVersion: string;
            fpsThroughput: number;
            lastEventProcessed: Date;
        };
        services: ({
            name: string;
            status: string;
            latencyMs: number;
            streamsActive?: undefined;
            availableGb?: undefined;
            clientsConnected?: undefined;
        } | {
            name: string;
            status: string;
            streamsActive: number;
            latencyMs?: undefined;
            availableGb?: undefined;
            clientsConnected?: undefined;
        } | {
            name: string;
            status: string;
            availableGb: number;
            latencyMs?: undefined;
            streamsActive?: undefined;
            clientsConnected?: undefined;
        } | {
            name: string;
            status: string;
            clientsConnected: number;
            latencyMs?: undefined;
            streamsActive?: undefined;
            availableGb?: undefined;
        })[];
        infrastructure: {
            camerasTotal: number;
            camerasOnline: number;
            openFaultTickets: number;
        };
    }>;
    getMetrics(): Promise<{
        cpuUsagePercent: number;
        memoryUsedMb: number;
        memoryTotalMb: number;
        systemMemoryFreeGb: number;
        systemMemoryTotalGb: number;
        osUptimeHours: number;
        platform: NodeJS.Platform;
        nodeVersion: string;
    }>;
    getStorageMetrics(): Promise<{
        storageUsedMb: number;
        storageUsedGb: number;
        storageTotalGb: number;
        evidenceObjectsCount: number;
        retentionPolicyDays: number;
        legalHoldCount: number;
    }>;
    getNetworkMetrics(): Promise<{
        avgCameraLatencyMs: number;
        packetLossPercent: number;
        bandwidthIngressMbps: number;
        bandwidthEgressMbps: number;
        networkJitterMs: number;
    }>;
    listFaultTickets(params: PaginationParams, status?: string, severity?: string): Promise<{
        total: number;
        tickets: {
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            severity: string;
            closedAt: Date | null;
            entityType: string;
            entityId: string | null;
            ticketCode: string;
            assignedTo: string | null;
            resolvedAt: Date | null;
        }[];
    }>;
    createFaultTicket(input: CreateFaultTicketInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        severity: string;
        closedAt: Date | null;
        entityType: string;
        entityId: string | null;
        ticketCode: string;
        assignedTo: string | null;
        resolvedAt: Date | null;
    }>;
    updateFaultTicket(id: string, input: UpdateFaultTicketInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        severity: string;
        closedAt: Date | null;
        entityType: string;
        entityId: string | null;
        ticketCode: string;
        assignedTo: string | null;
        resolvedAt: Date | null;
    }>;
    closeFaultTicket(id: string, input: CloseFaultTicketInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        severity: string;
        closedAt: Date | null;
        entityType: string;
        entityId: string | null;
        ticketCode: string;
        assignedTo: string | null;
        resolvedAt: Date | null;
    }>;
}
export declare const systemHealthService: SystemHealthService;
//# sourceMappingURL=system-health.service.d.ts.map