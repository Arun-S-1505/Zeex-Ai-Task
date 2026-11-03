import prisma from '../../config/database.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { CreateZoneInput, UpdateZoneInput } from './zones.validation.js';
import { PaginationParams, buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';

export class ZonesService {
  async list(params: PaginationParams, siteId?: string) {
    const where: any = { deletedAt: null };
    if (siteId) where.siteId = siteId;

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { code: { contains: params.search, mode: 'insensitive' } },
        { zoneType: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, zones] = await Promise.all([
      prisma.zone.count({ where }),
      prisma.zone.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          site: { select: { id: true, name: true, code: true } },
          _count: {
            select: {
              cameras: { where: { deletedAt: null } },
              workFronts: { where: { deletedAt: null } },
              alerts: { where: { status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] } } },
            },
          },
        },
      }),
    ]);

    return { total, zones };
  }

  async getById(id: string) {
    const zone = await prisma.zone.findUnique({
      where: { id, deletedAt: null },
      include: {
        site: true,
        cameras: {
          where: { deletedAt: null },
          select: {
            id: true,
            cameraCode: true,
            name: true,
            status: true,
            fps: true,
            lastFrameAt: true,
          },
        },
        workFronts: { where: { deletedAt: null } },
        ruleInstances: { where: { isActive: true }, include: { detection: true } },
      },
    });

    if (!zone) throw new NotFoundError('Zone');
    return zone;
  }

  async create(input: CreateZoneInput, actorId?: string, ipAddress?: string) {
    const site = await prisma.site.findUnique({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError('Site');

    const existing = await prisma.zone.findUnique({ where: { code: input.code } });
    if (existing) throw new ConflictError(`Zone with code ${input.code} already exists`);

    const zone = await prisma.zone.create({
      data: {
        name: input.name,
        code: input.code,
        siteId: input.siteId,
        zoneType: input.zoneType,
        polygon: input.polygon,
        calibration: input.calibration,
        riskLevel: input.riskLevel,
      },
      include: { site: true },
    });

    await createAuditLog({
      userId: actorId,
      action: 'ZONE_CREATED',
      entityType: 'Zone',
      entityId: zone.id,
      ipAddress,
      afterState: zone,
    });

    return zone;
  }

  async update(id: string, input: UpdateZoneInput, actorId?: string, ipAddress?: string) {
    const zone = await prisma.zone.findUnique({ where: { id, deletedAt: null } });
    if (!zone) throw new NotFoundError('Zone');

    if (input.code && input.code !== zone.code) {
      const existing = await prisma.zone.findUnique({ where: { code: input.code } });
      if (existing) throw new ConflictError(`Zone with code ${input.code} already exists`);
    }

    const updated = await prisma.zone.update({
      where: { id },
      data: input,
      include: { site: true },
    });

    await createAuditLog({
      userId: actorId,
      action: 'ZONE_UPDATED',
      entityType: 'Zone',
      entityId: id,
      ipAddress,
      beforeState: zone,
      afterState: updated,
    });

    return updated;
  }

  async delete(id: string, actorId?: string, ipAddress?: string) {
    const zone = await prisma.zone.findUnique({ where: { id, deletedAt: null } });
    if (!zone) throw new NotFoundError('Zone');

    await prisma.zone.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });

    await createAuditLog({
      userId: actorId,
      action: 'ZONE_DELETED',
      entityType: 'Zone',
      entityId: id,
      ipAddress,
    });
  }
}

export const zonesService = new ZonesService();
