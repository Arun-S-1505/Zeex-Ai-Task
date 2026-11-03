import prisma from '../config/database.js';
export async function createAuditLog(params) {
    return prisma.auditLog.create({
        data: {
            userId: params.userId,
            action: params.action,
            entityType: params.entityType,
            entityId: params.entityId,
            beforeState: params.beforeState ?? undefined,
            afterState: params.afterState ?? undefined,
            ipAddress: params.ipAddress,
            userAgent: params.userAgent,
            metadata: params.metadata ?? undefined,
        },
    });
}
//# sourceMappingURL=audit.js.map