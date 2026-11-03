import prisma from '../../config/database.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';
export class SitesService {
    async list(params) {
        const where = { deletedAt: null };
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { code: { contains: params.search, mode: 'insensitive' } },
                { city: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [total, sites] = await Promise.all([
            prisma.site.count({ where }),
            prisma.site.findMany({
                where,
                ...buildPrismaQuery(params),
                include: {
                    _count: {
                        select: {
                            cameras: { where: { deletedAt: null } },
                            zones: { where: { deletedAt: null } },
                            workFronts: { where: { deletedAt: null } },
                            alerts: { where: { status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] } } },
                        },
                    },
                },
            }),
        ]);
        return { total, sites };
    }
    async getById(id) {
        const site = await prisma.site.findUnique({
            where: { id, deletedAt: null },
            include: {
                zones: { where: { deletedAt: null } },
                cameras: {
                    where: { deletedAt: null },
                    select: {
                        id: true,
                        cameraCode: true,
                        name: true,
                        status: true,
                        recordingStatus: true,
                        fps: true,
                        lastFrameAt: true,
                        zone: { select: { id: true, name: true } },
                    },
                },
                workFronts: { where: { deletedAt: null } },
                _count: {
                    select: {
                        cameras: { where: { deletedAt: null } },
                        zones: { where: { deletedAt: null } },
                        alerts: true,
                    },
                },
            },
        });
        if (!site)
            throw new NotFoundError('Site');
        return site;
    }
    async create(input, actorId, ipAddress) {
        const existing = await prisma.site.findUnique({ where: { code: input.code } });
        if (existing)
            throw new ConflictError(`Site with code ${input.code} already exists`);
        const site = await prisma.site.create({ data: input });
        await createAuditLog({
            userId: actorId,
            action: 'SITE_CREATED',
            entityType: 'Site',
            entityId: site.id,
            ipAddress,
            afterState: site,
        });
        return site;
    }
    async update(id, input, actorId, ipAddress) {
        const site = await prisma.site.findUnique({ where: { id, deletedAt: null } });
        if (!site)
            throw new NotFoundError('Site');
        if (input.code && input.code !== site.code) {
            const existing = await prisma.site.findUnique({ where: { code: input.code } });
            if (existing)
                throw new ConflictError(`Site with code ${input.code} already exists`);
        }
        const updated = await prisma.site.update({
            where: { id },
            data: input,
        });
        await createAuditLog({
            userId: actorId,
            action: 'SITE_UPDATED',
            entityType: 'Site',
            entityId: id,
            ipAddress,
            beforeState: site,
            afterState: updated,
        });
        return updated;
    }
    async delete(id, actorId, ipAddress) {
        const site = await prisma.site.findUnique({ where: { id, deletedAt: null } });
        if (!site)
            throw new NotFoundError('Site');
        await prisma.site.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
        await createAuditLog({
            userId: actorId,
            action: 'SITE_DELETED',
            entityType: 'Site',
            entityId: id,
            ipAddress,
        });
    }
}
export const sitesService = new SitesService();
//# sourceMappingURL=sites.service.js.map