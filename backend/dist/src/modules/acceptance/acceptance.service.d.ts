import { CreateMeasurementInput, SignoffInput } from './acceptance.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class AcceptanceService {
    getConsole(): Promise<{
        status: string;
        soakTest48h: {
            status: string;
            hoursElapsed: number;
            crashCount: number;
            memoryLeakObserved: boolean;
            throughputAverageFps: number;
        };
        keySlaMetrics: {
            metric: string;
            measured: string;
            target: string;
            status: string;
        }[];
        recentMeasurements: {
            status: string;
            target: number | null;
            id: string;
            createdAt: Date;
            notes: string | null;
            category: string | null;
            metricName: string;
            metricValue: number;
            unit: string | null;
            measuredAt: Date;
            signedOffBy: string | null;
            signedOffAt: Date | null;
        }[];
    }>;
    listMetrics(params: PaginationParams, category?: string): Promise<{
        total: number;
        records: {
            status: string;
            target: number | null;
            id: string;
            createdAt: Date;
            notes: string | null;
            category: string | null;
            metricName: string;
            metricValue: number;
            unit: string | null;
            measuredAt: Date;
            signedOffBy: string | null;
            signedOffAt: Date | null;
        }[];
    }>;
    createMeasurement(input: CreateMeasurementInput, actorId?: string, ipAddress?: string): Promise<{
        status: string;
        target: number | null;
        id: string;
        createdAt: Date;
        notes: string | null;
        category: string | null;
        metricName: string;
        metricValue: number;
        unit: string | null;
        measuredAt: Date;
        signedOffBy: string | null;
        signedOffAt: Date | null;
    }>;
    signoff(id: string, input: SignoffInput, actorId: string, ipAddress?: string): Promise<{
        status: string;
        target: number | null;
        id: string;
        createdAt: Date;
        notes: string | null;
        category: string | null;
        metricName: string;
        metricValue: number;
        unit: string | null;
        measuredAt: Date;
        signedOffBy: string | null;
        signedOffAt: Date | null;
    }>;
}
export declare const acceptanceService: AcceptanceService;
//# sourceMappingURL=acceptance.service.d.ts.map