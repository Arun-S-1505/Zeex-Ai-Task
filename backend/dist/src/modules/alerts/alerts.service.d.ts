import { CreateManualAlertInput, AcknowledgeAlertInput, AssignAlertInput, TakeActionInput, CloseAlertInput, FalsePositiveInput, MissedDetectionInput } from './alerts.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export interface AlertFilterOptions {
    siteId?: string;
    zoneId?: string;
    contractorId?: string;
    severity?: string;
    status?: string;
    detectionId?: string;
    assignedUserId?: string;
    startDate?: Date;
    endDate?: Date;
}
export declare class AlertsService {
    list(params: PaginationParams, filters?: AlertFilterOptions): Promise<{
        total: number;
        alerts: any[];
        summary: {
            openQueue: number;
            critical: number;
            avgAckTime: string;
            slaAtRisk: number;
            closedCount: number;
        };
    }>;
    getById(id: string): Promise<any>;
    createManual(input: CreateManualAlertInput, actorId?: string, ipAddress?: string): Promise<any>;
    acknowledge(id: string, input: AcknowledgeAlertInput, actorId: string, ipAddress?: string): Promise<any>;
    assign(id: string, input: AssignAlertInput, actorId: string, ipAddress?: string): Promise<any>;
    takeAction(id: string, input: TakeActionInput, actorId: string, ipAddress?: string): Promise<any>;
    close(id: string, input: CloseAlertInput, actorId: string, ipAddress?: string): Promise<any>;
    markFalsePositive(id: string, input: FalsePositiveInput, actorId: string, ipAddress?: string): Promise<any>;
    reportMissedDetection(input: MissedDetectionInput, actorId?: string, ipAddress?: string): Promise<{
        id: string;
        createdAt: Date;
        alertId: string | null;
        notes: string | null;
        detectionCode: string;
        isCorrect: boolean;
        labeledBy: string | null;
    }>;
    getHistory(id: string): Promise<({
        user: {
            email: string;
            firstName: string;
            lastName: string;
            role: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isSystem: boolean;
            };
        } | null;
    } & {
        id: string;
        createdAt: Date;
        alertId: string;
        userId: string | null;
        previousStatus: string;
        newStatus: string;
        remarks: string | null;
        evidenceIds: import("@prisma/client/runtime/library").JsonValue | null;
        ipAddress: string | null;
    })[]>;
    private findAlertOrThrow;
    private formatAlertForFrontend;
    private getSummaryStats;
}
export declare const alertsService: AlertsService;
//# sourceMappingURL=alerts.service.d.ts.map