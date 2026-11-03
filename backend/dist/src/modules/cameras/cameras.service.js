import prisma from '../../config/database.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import { buildPrismaQuery } from '../../utils/pagination.js';
import { createAuditLog } from '../../utils/audit.js';
const SAFE_CAMERA_SELECT = {
    id: true,
    cameraCode: true,
    name: true,
    ipAddress: true,
    rtspUrl: true,
    cameraType: true,
    manufacturer: true,
    model: true,
    siteId: true,
    zoneId: true,
    workFrontId: true,
    status: true,
    recordingStatus: true,
    fps: true,
    bitrate: true,
    lastFrameAt: true,
    networkLatency: true,
    tamperingStatus: true,
    calibrationData: true,
    resolution: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
    site: { select: { id: true, name: true, code: true } },
    zone: { select: { id: true, name: true, code: true } },
    workFront: { select: { id: true, name: true, code: true } },
    _count: {
        select: {
            alerts: {
                where: { status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] } },
            },
        },
    },
};
export class CamerasService {
    async list(params, filters) {
        const where = { deletedAt: null };
        if (filters?.siteId)
            where.siteId = filters.siteId;
        if (filters?.zoneId)
            where.zoneId = filters.zoneId;
        if (filters?.status)
            where.status = filters.status;
        if (params.search) {
            where.OR = [
                { name: { contains: params.search, mode: 'insensitive' } },
                { cameraCode: { contains: params.search, mode: 'insensitive' } },
                { ipAddress: { contains: params.search, mode: 'insensitive' } },
            ];
        }
        const [total, cameras] = await Promise.all([
            prisma.camera.count({ where }),
            prisma.camera.findMany({
                where,
                ...buildPrismaQuery(params),
                select: SAFE_CAMERA_SELECT,
            }),
        ]);
        // Format for frontend convenience (matching App.tsx properties: id, name, site, state, people, last)
        const formattedCameras = cameras.map((c) => ({
            ...c,
            state: c.status,
            people: Math.floor(Math.random() * 15) + 1, // dynamically calculated or simulated
            last: c.lastFrameAt ? `${Math.floor((Date.now() - c.lastFrameAt.getTime()) / 1000)}s ago` : 'N/A',
            activeAlertsCount: c._count.alerts,
        }));
        return { total, cameras: formattedCameras };
    }
    async getById(id) {
        const camera = await prisma.camera.findUnique({
            where: { id, deletedAt: null },
            select: SAFE_CAMERA_SELECT,
        });
        if (!camera)
            throw new NotFoundError('Camera');
        return camera;
    }
    async create(input, actorId, ipAddress) {
        const site = await prisma.site.findUnique({ where: { id: input.siteId, deletedAt: null } });
        if (!site)
            throw new NotFoundError('Site');
        const existing = await prisma.camera.findUnique({ where: { cameraCode: input.cameraCode } });
        if (existing)
            throw new ConflictError(`Camera with code ${input.cameraCode} already exists`);
        const camera = await prisma.camera.create({
            data: {
                cameraCode: input.cameraCode,
                name: input.name,
                ipAddress: input.ipAddress,
                rtspUrl: input.rtspUrl,
                rtspPassword: input.rtspPassword,
                cameraType: input.cameraType,
                manufacturer: input.manufacturer,
                model: input.model,
                siteId: input.siteId,
                zoneId: input.zoneId,
                workFrontId: input.workFrontId,
                resolution: input.resolution,
                calibrationData: input.calibrationData,
                status: 'online',
                recordingStatus: 'active',
                fps: 25.0,
                bitrate: 4096.0,
                lastFrameAt: new Date(),
                networkLatency: 45.0,
            },
            select: SAFE_CAMERA_SELECT,
        });
        // Record deployment
        await prisma.cameraDeployment.create({
            data: {
                cameraId: camera.id,
                zoneId: input.zoneId,
                workFrontId: input.workFrontId,
                action: 'install',
                performedBy: actorId,
                notes: 'Initial installation and configuration',
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'CAMERA_CREATED',
            entityType: 'Camera',
            entityId: camera.id,
            ipAddress,
            afterState: { cameraCode: camera.cameraCode, name: camera.name },
        });
        return camera;
    }
    async update(id, input, actorId, ipAddress) {
        const camera = await prisma.camera.findUnique({ where: { id, deletedAt: null } });
        if (!camera)
            throw new NotFoundError('Camera');
        if (input.cameraCode && input.cameraCode !== camera.cameraCode) {
            const existing = await prisma.camera.findUnique({ where: { cameraCode: input.cameraCode } });
            if (existing)
                throw new ConflictError(`Camera with code ${input.cameraCode} already exists`);
        }
        const updated = await prisma.camera.update({
            where: { id },
            data: input,
            select: SAFE_CAMERA_SELECT,
        });
        await createAuditLog({
            userId: actorId,
            action: 'CAMERA_UPDATED',
            entityType: 'Camera',
            entityId: id,
            ipAddress,
            beforeState: { name: camera.name, status: camera.status },
            afterState: { name: updated.name, status: updated.status },
        });
        return updated;
    }
    async delete(id, actorId, ipAddress) {
        const camera = await prisma.camera.findUnique({ where: { id, deletedAt: null } });
        if (!camera)
            throw new NotFoundError('Camera');
        await prisma.camera.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false, status: 'offline' },
        });
        await prisma.cameraDeployment.create({
            data: {
                cameraId: id,
                action: 'decommission',
                performedBy: actorId,
                notes: 'Camera decommissioned and soft-deleted',
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'CAMERA_DELETED',
            entityType: 'Camera',
            entityId: id,
            ipAddress,
        });
    }
    async getHealth(id) {
        const camera = await prisma.camera.findUnique({
            where: { id, deletedAt: null },
            select: {
                id: true,
                cameraCode: true,
                name: true,
                status: true,
                recordingStatus: true,
                fps: true,
                bitrate: true,
                lastFrameAt: true,
                networkLatency: true,
                tamperingStatus: true,
            },
        });
        if (!camera)
            throw new NotFoundError('Camera');
        const isHealthy = camera.status === 'online' &&
            camera.tamperingStatus === 'normal' &&
            (camera.networkLatency ?? 0) < 200;
        return {
            ...camera,
            isHealthy,
            healthScore: isHealthy ? 98 : 45,
            lastChecked: new Date(),
        };
    }
    async getStream(id) {
        const camera = await prisma.camera.findUnique({
            where: { id, deletedAt: null },
            select: {
                id: true,
                cameraCode: true,
                name: true,
                status: true,
                resolution: true,
                fps: true,
            },
        });
        if (!camera)
            throw new NotFoundError('Camera');
        // Never return raw RTSP credentials. Return HLS/WebRTC streaming endpoint proxy URL
        return {
            cameraId: camera.id,
            cameraCode: camera.cameraCode,
            name: camera.name,
            status: camera.status,
            streamUrl: `/api/v1/streams/live/${camera.id}/index.m3u8`,
            webRtcUrl: `wss://stream.sentinel.ai/webrtc/${camera.id}`,
            simulatedFeed: true,
            resolution: camera.resolution || '1080p',
            fps: camera.fps || 25,
        };
    }
    async getHistory(id) {
        const deployments = await prisma.cameraDeployment.findMany({
            where: { cameraId: id },
            orderBy: { deployedAt: 'desc' },
        });
        return deployments;
    }
    async assignZone(id, zoneId, actorId, ipAddress) {
        const [camera, zone] = await Promise.all([
            prisma.camera.findUnique({ where: { id, deletedAt: null } }),
            prisma.zone.findUnique({ where: { id: zoneId, deletedAt: null } }),
        ]);
        if (!camera)
            throw new NotFoundError('Camera');
        if (!zone)
            throw new NotFoundError('Zone');
        const updated = await prisma.camera.update({
            where: { id },
            data: { zoneId },
            select: SAFE_CAMERA_SELECT,
        });
        await prisma.cameraDeployment.create({
            data: {
                cameraId: id,
                zoneId,
                action: 'assign_zone',
                performedBy: actorId,
                notes: `Assigned to zone ${zone.name}`,
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'CAMERA_ZONE_ASSIGNED',
            entityType: 'Camera',
            entityId: id,
            ipAddress,
            afterState: { zoneId, zoneName: zone.name },
        });
        return updated;
    }
    async relocate(id, input, actorId, ipAddress) {
        const camera = await prisma.camera.findUnique({ where: { id, deletedAt: null } });
        if (!camera)
            throw new NotFoundError('Camera');
        const updated = await prisma.camera.update({
            where: { id },
            data: {
                siteId: input.siteId || camera.siteId,
                zoneId: input.zoneId ?? camera.zoneId,
                workFrontId: input.workFrontId ?? camera.workFrontId,
            },
            select: SAFE_CAMERA_SELECT,
        });
        await prisma.cameraDeployment.create({
            data: {
                cameraId: id,
                zoneId: input.zoneId,
                workFrontId: input.workFrontId,
                action: 'relocate',
                performedBy: actorId,
                notes: input.notes || 'Camera relocated',
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'CAMERA_RELOCATED',
            entityType: 'Camera',
            entityId: id,
            ipAddress,
            beforeState: { siteId: camera.siteId, zoneId: camera.zoneId },
            afterState: { siteId: updated.siteId, zoneId: updated.zoneId },
        });
        return updated;
    }
    async calibrate(id, input, actorId, ipAddress) {
        const camera = await prisma.camera.findUnique({ where: { id, deletedAt: null } });
        if (!camera)
            throw new NotFoundError('Camera');
        const updated = await prisma.camera.update({
            where: { id },
            data: { calibrationData: input.calibrationData },
            select: SAFE_CAMERA_SELECT,
        });
        await prisma.cameraDeployment.create({
            data: {
                cameraId: id,
                action: 'calibrate',
                performedBy: actorId,
                notes: input.notes || 'Camera calibration updated',
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'CAMERA_CALIBRATED',
            entityType: 'Camera',
            entityId: id,
            ipAddress,
        });
        return updated;
    }
}
export const camerasService = new CamerasService();
//# sourceMappingURL=cameras.service.js.map