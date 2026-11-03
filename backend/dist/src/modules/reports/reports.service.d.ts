import { CreateReportInput, ScheduleReportInput } from './reports.validation.js';
import { PaginationParams } from '../../utils/pagination.js';
export declare class ReportsService {
    list(params: PaginationParams, type?: string, status?: string): Promise<{
        total: number;
        reports: {
            downloadUrl: string | null;
            type: string;
            status: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            filePath: string | null;
            fileSize: number | null;
            format: string;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
            recipients: import("@prisma/client/runtime/library").JsonValue | null;
            scheduleCron: string | null;
            generatedBy: string | null;
            templateVersion: number;
            generatedAt: Date | null;
        }[];
    }>;
    getById(id: string): Promise<{
        downloadUrl: string | null;
        type: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        filePath: string | null;
        fileSize: number | null;
        format: string;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        recipients: import("@prisma/client/runtime/library").JsonValue | null;
        scheduleCron: string | null;
        generatedBy: string | null;
        templateVersion: number;
        generatedAt: Date | null;
    }>;
    create(input: CreateReportInput, actorId?: string, ipAddress?: string): Promise<{
        downloadUrl: string;
        type: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        filePath: string | null;
        fileSize: number | null;
        format: string;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        recipients: import("@prisma/client/runtime/library").JsonValue | null;
        scheduleCron: string | null;
        generatedBy: string | null;
        templateVersion: number;
        generatedAt: Date | null;
    }>;
    generateReport(id: string, actorId?: string, ipAddress?: string): Promise<{
        downloadUrl: string;
        type: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        filePath: string | null;
        fileSize: number | null;
        format: string;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        recipients: import("@prisma/client/runtime/library").JsonValue | null;
        scheduleCron: string | null;
        generatedBy: string | null;
        templateVersion: number;
        generatedAt: Date | null;
    }>;
    download(id: string, actorId?: string, ipAddress?: string): Promise<{
        buffer: Buffer<ArrayBufferLike>;
        fileName: string;
        mimeType: string;
    }>;
    schedule(input: ScheduleReportInput, actorId?: string, ipAddress?: string): Promise<{
        type: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        filePath: string | null;
        fileSize: number | null;
        format: string;
        filters: import("@prisma/client/runtime/library").JsonValue | null;
        recipients: import("@prisma/client/runtime/library").JsonValue | null;
        scheduleCron: string | null;
        generatedBy: string | null;
        templateVersion: number;
        generatedAt: Date | null;
    }>;
}
export declare const reportsService: ReportsService;
//# sourceMappingURL=reports.service.d.ts.map