import prisma from '../../config/database.js';
import { NotFoundError, ConflictError, ValidationError } from '../../utils/errors.js';
import {
  CreateWorkFrontInput,
  UpdateWorkFrontInput,
  AssignContractorInput,
} from './workfronts.validation.js';
import { PaginationParams, buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';

export class WorkFrontsService {
  async list(params: PaginationParams, filters?: { siteId?: string; status?: string; activity?: string }) {
    const where: any = { deletedAt: null };
    if (filters?.siteId) where.siteId = filters.siteId;
    if (filters?.status) where.status = filters.status;
    if (filters?.activity) where.activity = filters.activity;

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { code: { contains: params.search, mode: 'insensitive' } },
        { activity: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, workFronts] = await Promise.all([
      prisma.workFront.count({ where }),
      prisma.workFront.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          site: { select: { id: true, name: true, code: true } },
          zone: { select: { id: true, name: true, code: true } },
          contractorAssignments: {
            where: { isActive: true },
            include: { contractor: { select: { id: true, name: true, code: true } } },
          },
          _count: {
            select: {
              cameras: { where: { deletedAt: null } },
              alerts: { where: { status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] } } },
            },
          },
        },
      }),
    ]);

    return { total, workFronts };
  }

  async getById(id: string) {
    const workFront = await prisma.workFront.findUnique({
      where: { id, deletedAt: null },
      include: {
        site: true,
        zone: true,
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
          },
        },
        contractorAssignments: {
          include: { contractor: true },
          orderBy: { startDate: 'desc' },
        },
        alerts: {
          where: { status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] } },
          take: 10,
          orderBy: { occurredAt: 'desc' },
        },
      },
    });

    if (!workFront) throw new NotFoundError('WorkFront');
    return workFront;
  }

  async create(input: CreateWorkFrontInput, actorId?: string, ipAddress?: string) {
    const site = await prisma.site.findUnique({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError('Site');

    const existing = await prisma.workFront.findUnique({ where: { code: input.code } });
    if (existing) throw new ConflictError(`WorkFront code ${input.code} already exists`);

    const workFront = await prisma.workFront.create({
      data: input,
      include: { site: true, zone: true },
    });

    await createAuditLog({
      userId: actorId,
      action: 'WORKFRONT_CREATED',
      entityType: 'WorkFront',
      entityId: workFront.id,
      ipAddress,
      afterState: workFront,
    });

    return workFront;
  }

  async update(id: string, input: UpdateWorkFrontInput, actorId?: string, ipAddress?: string) {
    const workFront = await prisma.workFront.findUnique({ where: { id, deletedAt: null } });
    if (!workFront) throw new NotFoundError('WorkFront');

    if (input.code && input.code !== workFront.code) {
      const existing = await prisma.workFront.findUnique({ where: { code: input.code } });
      if (existing) throw new ConflictError(`WorkFront code ${input.code} already exists`);
    }

    const updated = await prisma.workFront.update({
      where: { id },
      data: input,
      include: { site: true, zone: true },
    });

    await createAuditLog({
      userId: actorId,
      action: 'WORKFRONT_UPDATED',
      entityType: 'WorkFront',
      entityId: id,
      ipAddress,
      beforeState: workFront,
      afterState: updated,
    });

    return updated;
  }

  async delete(id: string, actorId?: string, ipAddress?: string) {
    const workFront = await prisma.workFront.findUnique({ where: { id, deletedAt: null } });
    if (!workFront) throw new NotFoundError('WorkFront');

    await prisma.workFront.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false, status: 'completed' },
    });

    await createAuditLog({
      userId: actorId,
      action: 'WORKFRONT_DELETED',
      entityType: 'WorkFront',
      entityId: id,
      ipAddress,
    });
  }

  async assignContractor(workFrontId: string, input: AssignContractorInput, actorId?: string, ipAddress?: string) {
    const workFront = await prisma.workFront.findUnique({ where: { id: workFrontId, deletedAt: null } });
    if (!workFront) throw new NotFoundError('WorkFront');

    const contractor = await prisma.contractor.findUnique({ where: { id: input.contractorId, deletedAt: null } });
    if (!contractor) throw new NotFoundError('Contractor');

    // Conflict detection: check overlapping assignments for the same workfront & contractor
    const overlapping = await prisma.contractorWorkFront.findFirst({
      where: {
        workFrontId,
        contractorId: input.contractorId,
        isActive: true,
        startDate: { lte: input.endDate || new Date('2099-12-31') },
        OR: [
          { endDate: null },
          { endDate: { gte: input.startDate } },
        ],
      },
    });

    if (overlapping) {
      throw new ConflictError('Conflicting contractor assignment exists in the selected date window');
    }

    const assignment = await prisma.contractorWorkFront.create({
      data: {
        workFrontId,
        contractorId: input.contractorId,
        startDate: input.startDate,
        endDate: input.endDate,
        shiftId: input.shiftId,
      },
      include: { contractor: true, workFront: true },
    });

    await createAuditLog({
      userId: actorId,
      action: 'CONTRACTOR_ASSIGNED_TO_WORKFRONT',
      entityType: 'WorkFront',
      entityId: workFrontId,
      ipAddress,
      afterState: { contractorId: contractor.id, contractorName: contractor.name, startDate: input.startDate },
    });

    return assignment;
  }

  async bulkImport(items: CreateWorkFrontInput[], actorId?: string, ipAddress?: string) {
    const results = [];
    for (const item of items) {
      try {
        const created = await this.create(item, actorId, ipAddress);
        results.push({ code: item.code, success: true, id: created.id });
      } catch (err: any) {
        results.push({ code: item.code, success: false, error: err.message });
      }
    }
    return results;
  }
}

export const workFrontsService = new WorkFrontsService();
