import prisma from '../../config/database.js';
import { storage } from '../../config/storage.js';
import { NotFoundError } from '../../utils/errors.js';
import { buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';
export class ReportsService {
    async list(params, type, status) {
        const where = {};
        if (type)
            where.type = type;
        if (status)
            where.status = status;
        if (params.search) {
            where.title = { contains: params.search, mode: 'insensitive' };
        }
        const [total, reports] = await Promise.all([
            prisma.report.count({ where }),
            prisma.report.findMany({
                where,
                ...buildPrismaQuery(params),
            }),
        ]);
        const formatted = reports.map((r) => ({
            ...r,
            downloadUrl: r.filePath ? storage.getUrl(r.filePath) : null,
        }));
        return { total, reports: formatted };
    }
    async getById(id) {
        const report = await prisma.report.findUnique({ where: { id } });
        if (!report)
            throw new NotFoundError('Report');
        return {
            ...report,
            downloadUrl: report.filePath ? storage.getUrl(report.filePath) : null,
        };
    }
    async create(input, actorId, ipAddress) {
        const report = await prisma.report.create({
            data: {
                title: input.title,
                type: input.type,
                format: input.format,
                filters: input.filters,
                recipients: input.recipients,
                scheduleCron: input.scheduleCron,
                generatedBy: actorId,
                status: 'pending',
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'REPORT_REQUESTED',
            entityType: 'Report',
            entityId: report.id,
            ipAddress,
            afterState: { title: report.title, type: report.type },
        });
        // Generate synchronously or trigger background worker
        return this.generateReport(report.id, actorId, ipAddress);
    }
    async generateReport(id, actorId, ipAddress) {
        const report = await prisma.report.findUnique({ where: { id } });
        if (!report)
            throw new NotFoundError('Report');
        // Generate mock CSV / PDF document content
        const csvContent = [
            'Report Title,Generated Date,Status,Platform',
            `"${report.title}","${new Date().toISOString()}","COMPLETED","SentinelAI Visual Safety"`,
            '',
            'Metric,Value,Target,Status',
            'PPE Compliance,94.8%,95.0%,Near Target',
            'Alerts Raised,1284,-,Logged',
            'Critical Incidents,7,0,Under Review',
            'Average Closure Time,18m 42s,30m,PASS',
            'Camera Availability,98.6%,98.0%,PASS',
        ].join('\n');
        const fileBuffer = Buffer.from(csvContent, 'utf-8');
        const extension = report.format === 'excel' ? 'csv' : 'txt';
        const fileName = `report-${report.type}-${Date.now()}.${extension}`;
        const filePath = await storage.save(fileBuffer, fileName, 'reports');
        const updated = await prisma.report.update({
            where: { id },
            data: {
                status: 'completed',
                filePath,
                fileSize: fileBuffer.length,
                generatedAt: new Date(),
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'REPORT_GENERATED',
            entityType: 'Report',
            entityId: id,
            ipAddress,
            afterState: { status: 'completed', filePath },
        });
        return {
            ...updated,
            downloadUrl: storage.getUrl(updated.filePath),
        };
    }
    async download(id, actorId, ipAddress) {
        const report = await prisma.report.findUnique({ where: { id } });
        if (!report || !report.filePath)
            throw new NotFoundError('Report or file');
        const buffer = await storage.get(report.filePath);
        await createAuditLog({
            userId: actorId,
            action: 'REPORT_DOWNLOADED',
            entityType: 'Report',
            entityId: id,
            ipAddress,
        });
        return {
            buffer,
            fileName: `sentinel-${report.type}-report.${report.format === 'excel' ? 'csv' : 'txt'}`,
            mimeType: report.format === 'excel' ? 'text/csv' : 'text/plain',
        };
    }
    async schedule(input, actorId, ipAddress) {
        const report = await prisma.report.create({
            data: {
                title: input.title,
                type: input.type,
                format: input.format,
                scheduleCron: input.scheduleCron,
                recipients: input.recipients,
                filters: input.filters,
                generatedBy: actorId,
                status: 'pending',
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'REPORT_SCHEDULED',
            entityType: 'Report',
            entityId: report.id,
            ipAddress,
            afterState: { scheduleCron: input.scheduleCron, recipients: input.recipients },
        });
        return report;
    }
}
export const reportsService = new ReportsService();
//# sourceMappingURL=reports.service.js.map