import prisma from '../../config/database.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';
export class DetectionsService {
    async listDetections(params, tier, category, isActive) {
        const where = {};
        if (tier !== undefined)
            where.tier = tier;
        if (category)
            where.category = category;
        if (isActive !== undefined)
            where.isActive = isActive;
        if (params.search) {
            where.OR = [
                { detectionCode: { contains: params.search, mode: 'insensitive' } },
                { name: { contains: params.search, mode: 'insensitive' } },
                { description: { contains: params.search, mode: 'insensitive' } },
                { category: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [total, detections] = await Promise.all([
            prisma.detectionDefinition.count({ where }),
            prisma.detectionDefinition.findMany({
                where,
                ...buildPrismaQuery(params),
                include: {
                    modelVersion: true,
                    _count: {
                        select: {
                            ruleInstances: { where: { isActive: true } },
                            alerts: { where: { status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] } } },
                        },
                    },
                },
            }),
        ]);
        return { total, detections };
    }
    async getDetectionById(id) {
        const detection = await prisma.detectionDefinition.findFirst({
            where: {
                OR: [{ id: id }, { detectionCode: id }],
            },
            include: {
                modelVersion: true,
                ruleInstances: {
                    include: {
                        camera: { select: { id: true, cameraCode: true, name: true } },
                        zone: { select: { id: true, name: true, code: true } },
                    },
                },
                _count: { select: { alerts: true } },
            },
        });
        if (!detection)
            throw new NotFoundError('Detection definition');
        return detection;
    }
    async createDetection(input, actorId, ipAddress) {
        const existing = await prisma.detectionDefinition.findUnique({
            where: { detectionCode: input.detectionCode },
        });
        if (existing)
            throw new ConflictError(`Detection code ${input.detectionCode} already exists`);
        const detection = await prisma.detectionDefinition.create({
            data: input,
            include: { modelVersion: true },
        });
        await createAuditLog({
            userId: actorId,
            action: 'DETECTION_DEFINITION_CREATED',
            entityType: 'DetectionDefinition',
            entityId: detection.id,
            ipAddress,
            afterState: detection,
        });
        return detection;
    }
    async updateDetection(id, input, actorId, ipAddress) {
        const detection = await prisma.detectionDefinition.findUnique({ where: { id } });
        if (!detection)
            throw new NotFoundError('Detection definition');
        const updated = await prisma.detectionDefinition.update({
            where: { id },
            data: input,
            include: { modelVersion: true },
        });
        await createAuditLog({
            userId: actorId,
            action: 'DETECTION_DEFINITION_UPDATED',
            entityType: 'DetectionDefinition',
            entityId: id,
            ipAddress,
            beforeState: detection,
            afterState: updated,
        });
        return updated;
    }
    async updateDetectionStatus(id, isActive, actorId, ipAddress) {
        const detection = await prisma.detectionDefinition.findUnique({ where: { id } });
        if (!detection)
            throw new NotFoundError('Detection definition');
        const updated = await prisma.detectionDefinition.update({
            where: { id },
            data: { isActive },
        });
        await createAuditLog({
            userId: actorId,
            action: 'DETECTION_STATUS_CHANGED',
            entityType: 'DetectionDefinition',
            entityId: id,
            ipAddress,
            beforeState: { isActive: detection.isActive },
            afterState: { isActive },
        });
        return updated;
    }
    async getDetectionHistory(id) {
        const logs = await prisma.auditLog.findMany({
            where: {
                entityType: 'DetectionDefinition',
                entityId: id,
            },
            orderBy: { createdAt: 'desc' },
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
        });
        return logs;
    }
    // ===================== RULES =====================
    async listRules(params, detectionId, cameraId, zoneId) {
        const where = {};
        if (detectionId)
            where.detectionId = detectionId;
        if (cameraId)
            where.cameraId = cameraId;
        if (zoneId)
            where.zoneId = zoneId;
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { detection: { name: { contains: params.search, mode: 'insensitive' } } },
                { detection: { detectionCode: { contains: params.search, mode: 'insensitive' } } },
            ];
        }
        const [total, rules] = await Promise.all([
            prisma.ruleInstance.count({ where }),
            prisma.ruleInstance.findMany({
                where,
                ...buildPrismaQuery(params),
                include: {
                    detection: true,
                    camera: { select: { id: true, cameraCode: true, name: true, site: true } },
                    zone: { select: { id: true, name: true, code: true } },
                },
            }),
        ]);
        return { total, rules };
    }
    async getRuleById(id) {
        const rule = await prisma.ruleInstance.findUnique({
            where: { id },
            include: {
                detection: true,
                camera: true,
                zone: true,
            },
        });
        if (!rule)
            throw new NotFoundError('Rule instance');
        return rule;
    }
    async createRule(input, actorId, ipAddress) {
        const detection = await prisma.detectionDefinition.findUnique({ where: { id: input.detectionId } });
        if (!detection)
            throw new NotFoundError('Detection definition');
        const rule = await prisma.ruleInstance.create({
            data: input,
            include: { detection: true, camera: true, zone: true },
        });
        await createAuditLog({
            userId: actorId,
            action: 'RULE_INSTANCE_CREATED',
            entityType: 'RuleInstance',
            entityId: rule.id,
            ipAddress,
            afterState: rule,
        });
        return rule;
    }
    async updateRule(id, input, actorId, ipAddress) {
        const rule = await prisma.ruleInstance.findUnique({ where: { id } });
        if (!rule)
            throw new NotFoundError('Rule instance');
        const updated = await prisma.ruleInstance.update({
            where: { id },
            data: {
                ...input,
                version: { increment: 1 },
            },
            include: { detection: true, camera: true, zone: true },
        });
        await createAuditLog({
            userId: actorId,
            action: 'RULE_INSTANCE_UPDATED',
            entityType: 'RuleInstance',
            entityId: id,
            ipAddress,
            beforeState: rule,
            afterState: updated,
        });
        return updated;
    }
    async deleteRule(id, actorId, ipAddress) {
        const rule = await prisma.ruleInstance.findUnique({ where: { id } });
        if (!rule)
            throw new NotFoundError('Rule instance');
        await prisma.ruleInstance.update({
            where: { id },
            data: { isActive: false },
        });
        await createAuditLog({
            userId: actorId,
            action: 'RULE_INSTANCE_DEACTIVATED',
            entityType: 'RuleInstance',
            entityId: id,
            ipAddress,
        });
    }
}
export const detectionsService = new DetectionsService();
//# sourceMappingURL=detections.service.js.map