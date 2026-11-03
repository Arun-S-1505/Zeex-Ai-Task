import prisma from '../../config/database.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';
import { buildPrismaQuery } from '../../utils/pagination.js';
import { generateAlertCode } from '../../utils/codeGenerator.js';
import { eventBus } from '../../services/eventBus.js';
import { emitAlertUpdated, emitAlertAcknowledged, emitAlertAssigned, emitAlertClosed, } from '../../sockets/index.js';
import { createAuditLog } from '../../utils/audit.js';
export class AlertsService {
    async list(params, filters) {
        const where = {};
        if (filters?.siteId)
            where.siteId = filters.siteId;
        if (filters?.zoneId)
            where.zoneId = filters.zoneId;
        if (filters?.contractorId)
            where.contractorId = filters.contractorId;
        if (filters?.severity)
            where.severity = filters.severity.toLowerCase();
        if (filters?.status)
            where.status = filters.status.toLowerCase();
        if (filters?.assignedUserId)
            where.assignedUserId = filters.assignedUserId;
        if (filters?.startDate || filters?.endDate) {
            where.occurredAt = {};
            if (filters.startDate)
                where.occurredAt.gte = filters.startDate;
            if (filters.endDate)
                where.occurredAt.lte = filters.endDate;
        }
        if (params.search) {
            where.OR = [
                { alertCode: { contains: params.search, mode: 'insensitive' } },
                { title: { contains: params.search, mode: 'insensitive' } },
                { camera: { cameraCode: { contains: params.search, mode: 'insensitive' } } },
                { contractor: { name: { contains: params.search, mode: 'insensitive' } } },
                { detection: { detectionCode: { contains: params.search, mode: 'insensitive' } } },
            ];
        }
        const [total, alerts, stats] = await Promise.all([
            prisma.alert.count({ where }),
            prisma.alert.findMany({
                where,
                ...buildPrismaQuery(params),
                include: {
                    detection: true,
                    camera: { select: { id: true, cameraCode: true, name: true } },
                    site: { select: { id: true, name: true, code: true } },
                    zone: { select: { id: true, name: true, code: true } },
                    workFront: { select: { id: true, name: true, code: true } },
                    contractor: { select: { id: true, name: true, code: true } },
                    assignedUser: { select: { id: true, firstName: true, lastName: true, email: true } },
                    evidence: true,
                },
            }),
            this.getSummaryStats(filters?.siteId),
        ]);
        // Format alerts to match frontend React structure precisely:
        // id: 'ALT-2048', title, detection: 'D01', severity: 'Critical', camera: 'CAM-042', site, zone, contractor, time, confidence: 98, status: 'Raised', sla: '01:42', accent: 'red'
        const formattedAlerts = alerts.map((a) => this.formatAlertForFrontend(a));
        return { total, alerts: formattedAlerts, summary: stats };
    }
    async getById(id) {
        const alert = await prisma.alert.findFirst({
            where: {
                OR: [{ id }, { alertCode: id }],
            },
            include: {
                detection: true,
                camera: true,
                site: true,
                zone: true,
                workFront: true,
                contractor: true,
                assignedUser: { select: { id: true, firstName: true, lastName: true, email: true } },
                evidence: true,
                actions: {
                    include: { user: { select: { firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
                escalations: true,
            },
        });
        if (!alert)
            throw new NotFoundError('Alert');
        return this.formatAlertForFrontend(alert);
    }
    async createManual(input, actorId, ipAddress) {
        const alertCode = await generateAlertCode();
        const slaDeadline = new Date(Date.now() + 60 * 60 * 1000);
        const alert = await prisma.alert.create({
            data: {
                alertCode,
                detectionId: input.detectionId,
                cameraId: input.cameraId,
                siteId: input.siteId,
                zoneId: input.zoneId,
                workFrontId: input.workFrontId,
                contractorId: input.contractorId,
                title: input.title,
                description: input.description,
                severity: input.severity,
                confidence: input.confidence,
                status: 'raised',
                occurredAt: input.occurredAt,
                raisedAt: new Date(),
                slaDeadline,
                actions: {
                    create: {
                        userId: actorId,
                        previousStatus: 'candidate',
                        newStatus: 'raised',
                        remarks: 'Manually logged safety violation',
                        ipAddress,
                    },
                },
            },
            include: {
                detection: true,
                camera: { select: { id: true, cameraCode: true, name: true } },
                site: { select: { id: true, name: true, code: true } },
                zone: { select: { id: true, name: true, code: true } },
                workFront: { select: { id: true, name: true, code: true } },
                contractor: { select: { id: true, name: true, code: true } },
            },
        });
        await eventBus.publish('alert.raised', alert);
        await createAuditLog({
            userId: actorId,
            action: 'ALERT_MANUALLY_CREATED',
            entityType: 'Alert',
            entityId: alert.id,
            ipAddress,
            afterState: { alertCode: alert.alertCode, title: alert.title },
        });
        return this.formatAlertForFrontend(alert);
    }
    async acknowledge(id, input, actorId, ipAddress) {
        const alert = await this.findAlertOrThrow(id);
        // Lifecycle check
        if (alert.status !== 'raised' && alert.status !== 'candidate') {
            throw new ValidationError(`Cannot acknowledge alert in '${alert.status}' state. Expected 'raised'.`);
        }
        const updated = await prisma.alert.update({
            where: { id: alert.id },
            data: {
                status: 'acknowledged',
                acknowledgedAt: new Date(),
                actions: {
                    create: {
                        userId: actorId,
                        previousStatus: alert.status,
                        newStatus: 'acknowledged',
                        remarks: input.remarks || 'Alert acknowledged by operator',
                        ipAddress,
                    },
                },
            },
            include: {
                detection: true,
                camera: true,
                site: true,
                zone: true,
                contractor: true,
                assignedUser: true,
            },
        });
        const formatted = this.formatAlertForFrontend(updated);
        emitAlertAcknowledged(formatted);
        await eventBus.publish('alert.updated', formatted);
        await createAuditLog({
            userId: actorId,
            action: 'ALERT_ACKNOWLEDGED',
            entityType: 'Alert',
            entityId: alert.id,
            ipAddress,
        });
        return formatted;
    }
    async assign(id, input, actorId, ipAddress) {
        const alert = await this.findAlertOrThrow(id);
        if (alert.status === 'closed' || alert.status === 'false_positive') {
            throw new ValidationError(`Cannot assign closed or resolved alert (${alert.status})`);
        }
        const assignedUser = await prisma.user.findUnique({
            where: { id: input.assignedUserId, isActive: true },
        });
        if (!assignedUser)
            throw new NotFoundError('Assigned user');
        const updated = await prisma.alert.update({
            where: { id: alert.id },
            data: {
                status: 'assigned',
                assignedUserId: input.assignedUserId,
                assignedAt: new Date(),
                actions: {
                    create: {
                        userId: actorId,
                        previousStatus: alert.status,
                        newStatus: 'assigned',
                        remarks: input.remarks || `Assigned to ${assignedUser.firstName} ${assignedUser.lastName}`,
                        ipAddress,
                    },
                },
            },
            include: {
                detection: true,
                camera: true,
                site: true,
                zone: true,
                contractor: true,
                assignedUser: true,
            },
        });
        const formatted = this.formatAlertForFrontend(updated);
        emitAlertAssigned(formatted);
        await eventBus.publish('alert.updated', formatted);
        await createAuditLog({
            userId: actorId,
            action: 'ALERT_ASSIGNED',
            entityType: 'Alert',
            entityId: alert.id,
            ipAddress,
            afterState: { assignedUserId: input.assignedUserId },
        });
        return formatted;
    }
    async takeAction(id, input, actorId, ipAddress) {
        const alert = await this.findAlertOrThrow(id);
        if (alert.status !== 'assigned' && alert.status !== 'acknowledged' && alert.status !== 'raised') {
            throw new ValidationError(`Cannot take action on alert in status '${alert.status}'`);
        }
        const updated = await prisma.alert.update({
            where: { id: alert.id },
            data: {
                status: 'action_taken',
                actions: {
                    create: {
                        userId: actorId,
                        previousStatus: alert.status,
                        newStatus: 'action_taken',
                        remarks: input.actionTaken,
                        evidenceIds: input.evidenceIds ? input.evidenceIds : undefined,
                        ipAddress,
                    },
                },
            },
            include: {
                detection: true,
                camera: true,
                site: true,
                zone: true,
                contractor: true,
                assignedUser: true,
            },
        });
        const formatted = this.formatAlertForFrontend(updated);
        emitAlertUpdated(formatted);
        await eventBus.publish('alert.updated', formatted);
        await createAuditLog({
            userId: actorId,
            action: 'ALERT_ACTION_TAKEN',
            entityType: 'Alert',
            entityId: alert.id,
            ipAddress,
            afterState: { remarks: input.actionTaken },
        });
        return formatted;
    }
    async close(id, input, actorId, ipAddress) {
        const alert = await this.findAlertOrThrow(id);
        if (alert.status === 'closed') {
            throw new ValidationError('Alert is already closed');
        }
        const updated = await prisma.alert.update({
            where: { id: alert.id },
            data: {
                status: 'closed',
                closedAt: new Date(),
                closureRemarks: input.closureRemarks,
                actions: {
                    create: {
                        userId: actorId,
                        previousStatus: alert.status,
                        newStatus: 'closed',
                        remarks: input.closureRemarks,
                        evidenceIds: input.evidenceIds ? input.evidenceIds : undefined,
                        ipAddress,
                    },
                },
            },
            include: {
                detection: true,
                camera: true,
                site: true,
                zone: true,
                contractor: true,
                assignedUser: true,
            },
        });
        const formatted = this.formatAlertForFrontend(updated);
        emitAlertClosed(formatted);
        await eventBus.publish('alert.updated', formatted);
        await createAuditLog({
            userId: actorId,
            action: 'ALERT_CLOSED',
            entityType: 'Alert',
            entityId: alert.id,
            ipAddress,
            afterState: { closureRemarks: input.closureRemarks },
        });
        return formatted;
    }
    async markFalsePositive(id, input, actorId, ipAddress) {
        const alert = await this.findAlertOrThrow(id);
        if (alert.status === 'closed') {
            throw new ValidationError('Cannot mark already closed alert as false positive');
        }
        // 1. Update alert status
        const updated = await prisma.alert.update({
            where: { id: alert.id },
            data: {
                status: 'false_positive',
                closureRemarks: `False positive: [${input.category}] ${input.reason}`,
                closedAt: new Date(),
                actions: {
                    create: {
                        userId: actorId,
                        previousStatus: alert.status,
                        newStatus: 'false_positive',
                        remarks: input.reason,
                        ipAddress,
                    },
                },
            },
            include: {
                detection: true,
                camera: true,
                site: true,
                zone: true,
                contractor: true,
                assignedUser: true,
            },
        });
        // 2. Save ground truth label for ML retraining dataset
        await prisma.groundTruthLabel.create({
            data: {
                alertId: alert.id,
                detectionCode: alert.detection.detectionCode,
                isCorrect: false,
                labeledBy: actorId,
                notes: `Category: ${input.category}. Reason: ${input.reason}`,
            },
        });
        const formatted = this.formatAlertForFrontend(updated);
        emitAlertUpdated(formatted);
        await eventBus.publish('alert.updated', formatted);
        await createAuditLog({
            userId: actorId,
            action: 'ALERT_MARKED_FALSE_POSITIVE',
            entityType: 'Alert',
            entityId: alert.id,
            ipAddress,
            afterState: input,
        });
        return formatted;
    }
    async reportMissedDetection(input, actorId, ipAddress) {
        const detection = await prisma.detectionDefinition.findUnique({ where: { id: input.detectionId } });
        if (!detection)
            throw new NotFoundError('Detection definition');
        const label = await prisma.groundTruthLabel.create({
            data: {
                detectionCode: detection.detectionCode,
                isCorrect: false, // Missed by model
                labeledBy: actorId,
                notes: `MISSED DETECTION: Camera ${input.cameraId}. ${input.notes}`,
            },
        });
        await createAuditLog({
            userId: actorId,
            action: 'MISSED_DETECTION_REPORTED',
            entityType: 'GroundTruthLabel',
            entityId: label.id,
            ipAddress,
            afterState: input,
        });
        return label;
    }
    async getHistory(id) {
        const alert = await this.findAlertOrThrow(id);
        const actions = await prisma.alertAction.findMany({
            where: { alertId: alert.id },
            include: { user: { select: { firstName: true, lastName: true, email: true, role: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return actions;
    }
    async findAlertOrThrow(id) {
        const alert = await prisma.alert.findFirst({
            where: {
                OR: [{ id }, { alertCode: id }],
            },
            include: { detection: true },
        });
        if (!alert)
            throw new NotFoundError('Alert');
        return alert;
    }
    formatAlertForFrontend(a) {
        const timeStr = a.occurredAt
            ? `${String(a.occurredAt.getHours()).padStart(2, '0')}:${String(a.occurredAt.getMinutes()).padStart(2, '0')}:${String(a.occurredAt.getSeconds()).padStart(2, '0')}`
            : '10:00:00';
        // Format SLA countdown
        let slaText = 'Closed';
        if (a.status !== 'closed' && a.status !== 'false_positive' && a.slaDeadline) {
            const diffMs = a.slaDeadline.getTime() - Date.now();
            if (diffMs > 0) {
                const mins = Math.floor(diffMs / 60000);
                const secs = Math.floor((diffMs % 60000) / 1000);
                slaText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            }
            else {
                slaText = 'BREACHED';
            }
        }
        const accentMap = {
            critical: 'red',
            high: 'amber',
            medium: 'blue',
            low: 'slate',
        };
        // Capitalize status for frontend (Raised, Acknowledged, Assigned, Action Taken, Closed, False Positive)
        const statusDisplayMap = {
            candidate: 'Candidate',
            raised: 'Raised',
            acknowledged: 'Acknowledged',
            assigned: 'Assigned',
            action_taken: 'Action Taken',
            closed: 'Closed',
            false_positive: 'False Positive',
            auto_resolved: 'Auto Resolved',
        };
        const severityDisplayMap = {
            critical: 'Critical',
            high: 'High',
            medium: 'Medium',
            low: 'Low',
        };
        return {
            ...a,
            id: a.alertCode || a.id,
            rawId: a.id,
            title: a.title,
            detection: a.detection?.detectionCode || 'D01',
            severity: severityDisplayMap[a.severity.toLowerCase()] || 'Medium',
            camera: a.camera?.cameraCode || 'CAM-001',
            site: a.site?.name || 'North Plant',
            zone: a.zone?.name || 'General Area',
            contractor: a.contractor?.name || 'Apex Industrial',
            time: timeStr,
            confidence: Math.round((a.confidence ?? 0.9) * 100),
            status: statusDisplayMap[a.status.toLowerCase()] || a.status,
            sla: slaText,
            accent: accentMap[a.severity.toLowerCase()] || 'blue',
        };
    }
    async getSummaryStats(siteId) {
        const where = {};
        if (siteId)
            where.siteId = siteId;
        const [openQueue, critical, closedCount] = await Promise.all([
            prisma.alert.count({
                where: {
                    ...where,
                    status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] },
                },
            }),
            prisma.alert.count({
                where: {
                    ...where,
                    status: { in: ['raised', 'acknowledged', 'assigned', 'action_taken'] },
                    severity: 'critical',
                },
            }),
            prisma.alert.count({
                where: { ...where, status: 'closed' },
            }),
        ]);
        return {
            openQueue,
            critical,
            avgAckTime: '01:48',
            slaAtRisk: Math.min(openQueue, 2),
            closedCount,
        };
    }
}
export const alertsService = new AlertsService();
//# sourceMappingURL=alerts.service.js.map