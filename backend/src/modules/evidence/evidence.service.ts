import crypto from 'crypto';
import prisma from '../../config/database.js';
import { storage } from '../../config/storage.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../../utils/errors.js';
import { UploadEvidenceInput, UpdateEvidenceInput } from './evidence.validation.js';
import { PaginationParams, buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';
import { eventBus } from '../../services/eventBus.js';

export class EvidenceService {
  async list(params: PaginationParams, alertId?: string, type?: string) {
    const where: any = { deletedAt: null };
    if (alertId) where.alertId = alertId;
    if (type) where.type = type;

    if (params.search) {
      where.OR = [
        { fileName: { contains: params.search, mode: 'insensitive' } },
        { alert: { alertCode: { contains: params.search, mode: 'insensitive' } } },
      ];
    }

    const [total, evidence] = await Promise.all([
      prisma.evidence.count({ where }),
      prisma.evidence.findMany({
        where,
        ...buildPrismaQuery(params),
        include: {
          alert: {
            select: {
              id: true,
              alertCode: true,
              title: true,
              severity: true,
              camera: { select: { cameraCode: true, name: true } },
            },
          },
        },
      }),
    ]);

    const formatted = evidence.map((e) => ({
      ...e,
      url: storage.getUrl(e.filePath),
    }));

    return { total, evidence: formatted };
  }

  async getById(id: string, actorId: string, ipAddress?: string) {
    const evidence = await prisma.evidence.findUnique({
      where: { id, deletedAt: null },
      include: {
        alert: {
          include: {
            camera: true,
            site: true,
            zone: true,
            contractor: true,
          },
        },
      },
    });

    if (!evidence) throw new NotFoundError('Evidence');

    // Chain-of-custody logging: Record access log
    await prisma.evidenceAccessLog.create({
      data: {
        evidenceId: evidence.id,
        userId: actorId,
        action: 'view',
        ipAddress,
      },
    });

    return {
      ...evidence,
      url: storage.getUrl(evidence.filePath),
    };
  }

  async getByAlertId(alertId: string, actorId: string, ipAddress?: string) {
    const items = await prisma.evidence.findMany({
      where: { alertId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });

    for (const item of items) {
      await prisma.evidenceAccessLog.create({
        data: {
          evidenceId: item.id,
          userId: actorId,
          action: 'view',
          ipAddress,
        },
      });
    }

    return items.map((e) => ({
      ...e,
      url: storage.getUrl(e.filePath),
    }));
  }

  async upload(
    file: Express.Multer.File,
    input: UploadEvidenceInput,
    actorId: string,
    ipAddress?: string
  ) {
    if (!file) throw new ValidationError('File is required');

    // Compute SHA-256 hash
    const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

    // Save to storage
    const uniqueFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const folder = input.alertId ? `alerts/${input.alertId}` : 'general';
    const filePath = await storage.save(file.buffer, uniqueFileName, folder);

    // Save record to database
    const evidence = await prisma.evidence.create({
      data: {
        alertId: input.alertId,
        type: input.type,
        fileName: file.originalname,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        hash,
        retentionClass: input.retentionClass,
        legalHold: input.legalHold,
        metadata: input.metadata,
        uploadedBy: actorId,
      },
      include: { alert: true },
    });

    // Chain of custody log
    await prisma.evidenceAccessLog.create({
      data: {
        evidenceId: evidence.id,
        userId: actorId,
        action: 'upload',
        ipAddress,
      },
    });

    await createAuditLog({
      userId: actorId,
      action: 'EVIDENCE_UPLOADED',
      entityType: 'Evidence',
      entityId: evidence.id,
      ipAddress,
      afterState: { fileName: evidence.fileName, hash: evidence.hash, size: evidence.fileSize },
    });

    await eventBus.publish('evidence.ready', evidence);

    return {
      ...evidence,
      url: storage.getUrl(evidence.filePath),
    };
  }

  async download(id: string, actorId: string, ipAddress?: string) {
    const evidence = await prisma.evidence.findUnique({
      where: { id, deletedAt: null },
    });
    if (!evidence) throw new NotFoundError('Evidence');

    const fileBuffer = await storage.get(evidence.filePath);

    // Chain of custody log
    await prisma.evidenceAccessLog.create({
      data: {
        evidenceId: evidence.id,
        userId: actorId,
        action: 'download',
        ipAddress,
      },
    });

    await createAuditLog({
      userId: actorId,
      action: 'EVIDENCE_DOWNLOADED',
      entityType: 'Evidence',
      entityId: evidence.id,
      ipAddress,
    });

    return {
      buffer: fileBuffer,
      fileName: evidence.fileName,
      mimeType: evidence.mimeType,
    };
  }

  async delete(id: string, actorId: string, ipAddress?: string) {
    const evidence = await prisma.evidence.findUnique({
      where: { id, deletedAt: null },
    });
    if (!evidence) throw new NotFoundError('Evidence');

    if (evidence.legalHold) {
      throw new ForbiddenError('Evidence is locked under legal hold and cannot be deleted');
    }

    await prisma.evidence.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await createAuditLog({
      userId: actorId,
      action: 'EVIDENCE_SOFT_DELETED',
      entityType: 'Evidence',
      entityId: id,
      ipAddress,
    });
  }
}

export const evidenceService = new EvidenceService();
