import prisma from '../../config/database.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import {
  CreateShiftInput,
  CreateShiftHandoverInput,
  AcknowledgeHandoverInput,
} from './shifts.validation.js';
import { PaginationParams, buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';

export class ShiftsService {
  async listShifts(siteId?: string) {
    const where: any = { isActive: true };
    if (siteId) where.siteId = siteId;

    return prisma.shift.findMany({
      where,
      include: { site: { select: { id: true, name: true, code: true } } },
      orderBy: { startTime: 'asc' },
    });
  }

  async createShift(input: CreateShiftInput, actorId?: string, ipAddress?: string) {
    const site = await prisma.site.findUnique({ where: { id: input.siteId } });
    if (!site) throw new NotFoundError('Site');

    const shift = await prisma.shift.create({
      data: input,
      include: { site: true },
    });

    await createAuditLog({
      userId: actorId,
      action: 'SHIFT_PATTERN_CREATED',
      entityType: 'Shift',
      entityId: shift.id,
      ipAddress,
      afterState: shift,
    });

    return shift;
  }

  async listHandovers(params: PaginationParams, shiftId?: string, status?: string) {
    const where: any = {};
    if (shiftId) where.shiftId = shiftId;
    if (status) where.status = status;

    const [total, handovers] = await Promise.all([
      prisma.shiftHandover.count({ where }),
      prisma.shiftHandover.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          shift: { include: { site: { select: { name: true, code: true } } } },
          outgoingUser: { select: { id: true, firstName: true, lastName: true, email: true } },
          incomingUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    return { total, handovers };
  }

  async getHandoverById(id: string) {
    const handover = await prisma.shiftHandover.findUnique({
      where: { id },
      include: {
        shift: { include: { site: true } },
        outgoingUser: { select: { id: true, firstName: true, lastName: true, email: true } },
        incomingUser: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });

    if (!handover) throw new NotFoundError('Shift handover record');
    return handover;
  }

  async createHandover(input: CreateShiftHandoverInput, outgoingUserId: string, ipAddress?: string) {
    const shift = await prisma.shift.findUnique({ where: { id: input.shiftId } });
    if (!shift) throw new NotFoundError('Shift');

    // Automatically snapshot current operational state
    const [openAlerts, unresolvedFaults, recentRelocations] = await Promise.all([
      prisma.alert.findMany({
        where: {
          siteId: shift.siteId,
          status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] },
        },
        select: {
          id: true,
          alertCode: true,
          title: true,
          severity: true,
          status: true,
          camera: { select: { cameraCode: true, name: true } },
        },
      }),
      prisma.faultTicket.findMany({
        where: { status: { in: ['open', 'in_progress'] } },
        select: { ticketCode: true, title: true, severity: true, entityType: true },
      }),
      prisma.cameraDeployment.findMany({
        where: {
          action: 'relocate',
          deployedAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) },
        },
        include: { camera: { select: { cameraCode: true, name: true } } },
      }),
    ]);

    const handover = await prisma.shiftHandover.create({
      data: {
        shiftId: input.shiftId,
        outgoingUserId,
        incomingUserId: input.incomingUserId,
        openAlerts: openAlerts as any,
        unresolvedFaults: unresolvedFaults as any,
        cameraRelocations: recentRelocations as any,
        notes: input.notes,
        status: 'pending',
      },
      include: {
        shift: true,
        outgoingUser: { select: { firstName: true, lastName: true } },
        incomingUser: { select: { firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      userId: outgoingUserId,
      action: 'SHIFT_HANDOVER_INITIATED',
      entityType: 'ShiftHandover',
      entityId: handover.id,
      ipAddress,
      afterState: { shiftName: shift.name, openAlertsCount: openAlerts.length },
    });

    return handover;
  }

  async acknowledgeHandover(id: string, input: AcknowledgeHandoverInput, incomingUserId: string, ipAddress?: string) {
    const handover = await prisma.shiftHandover.findUnique({ where: { id } });
    if (!handover) throw new NotFoundError('Shift handover record');

    if (handover.status === 'completed' || handover.status === 'acknowledged') {
      throw new ValidationError('Shift handover has already been acknowledged');
    }

    const updated = await prisma.shiftHandover.update({
      where: { id },
      data: {
        status: 'completed',
        incomingUserId,
        acknowledgedAt: new Date(),
        notes: input.notes ? `${handover.notes || ''}\n[Incoming Operator Note]: ${input.notes}` : handover.notes,
      },
      include: {
        shift: true,
        outgoingUser: { select: { firstName: true, lastName: true } },
        incomingUser: { select: { firstName: true, lastName: true } },
      },
    });

    await createAuditLog({
      userId: incomingUserId,
      action: 'SHIFT_HANDOVER_ACKNOWLEDGED',
      entityType: 'ShiftHandover',
      entityId: id,
      ipAddress,
    });

    return updated;
  }
}

export const shiftsService = new ShiftsService();
