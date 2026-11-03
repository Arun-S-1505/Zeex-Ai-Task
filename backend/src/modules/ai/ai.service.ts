import prisma from '../../config/database.js';
import { ruleEngine } from '../../services/ruleEngine.js';
import { eventBus } from '../../services/eventBus.js';
import { generateAlertCode } from '../../utils/codeGenerator.js';
import { AIEventInput } from './ai.validation.js';
import logger from '../../config/logger.js';

export class AIService {
  async processEvent(event: AIEventInput) {
    // 1. Idempotency Check using event_id
    const existingAlert = await prisma.alert.findUnique({
      where: { eventId: event.event_id },
    });

    if (existingAlert) {
      logger.info({ eventId: event.event_id }, 'Duplicate AI event ignored (idempotent)');
      return {
        status: 'ignored',
        reason: 'Event has already been processed',
        alert: existingAlert,
      };
    }

    // 2. Publish raw event to event bus
    await eventBus.publish('detection.raw', event);

    // 3. Update or create person track if track_id is present
    if (event.track_id) {
      await prisma.personTrack.upsert({
        where: { trackId: event.track_id },
        update: {
          lastSeen: event.occurred_at,
          cameraId: event.camera_id,
          siteId: event.site_id,
          attributes: event.attributes,
        },
        create: {
          trackId: event.track_id,
          cameraId: event.camera_id,
          siteId: event.site_id,
          firstSeen: event.occurred_at,
          lastSeen: event.occurred_at,
          attributes: event.attributes,
        },
      });
    }

    // 4. Update camera last frame timestamp & status
    await prisma.camera.updateMany({
      where: { id: event.camera_id },
      data: {
        lastFrameAt: event.occurred_at,
        status: 'online',
      },
    });

    // 5. Evaluate event against safety rules
    const evalResult = await ruleEngine.evaluate({
      detectionCode: event.detection_id,
      cameraId: event.camera_id,
      siteId: event.site_id,
      zoneId: event.zone_id,
      workFrontId: event.workfront_id,
      confidence: event.confidence,
      occurredAt: event.occurred_at,
      trackId: event.track_id,
    });

    if (!evalResult.shouldRaiseAlert) {
      logger.debug(
        { eventId: event.event_id, reason: evalResult.reason },
        'AI event evaluated: No alert raised'
      );
      return {
        status: evalResult.isCandidate ? 'candidate_logged' : 'suppressed',
        reason: evalResult.reason,
      };
    }

    // 6. Raise Alert
    const alertCode = await generateAlertCode();
    const slaDeadline = new Date(event.occurred_at.getTime() + evalResult.slaMinutes * 60 * 1000);

    const detection = await prisma.detectionDefinition.findUnique({
      where: { id: evalResult.detectionId },
    });

    const alert = await prisma.alert.create({
      data: {
        alertCode,
        eventId: event.event_id,
        detectionId: evalResult.detectionId,
        cameraId: event.camera_id,
        siteId: event.site_id,
        zoneId: event.zone_id,
        workFrontId: event.workfront_id,
        contractorId: evalResult.contractorId,
        title: detection?.name ? `${detection.name} violation` : 'Safety violation detected',
        description: detection?.description || 'Automated AI visual safety detection violation',
        severity: evalResult.severity,
        confidence: event.confidence,
        status: 'raised',
        occurredAt: event.occurred_at,
        raisedAt: event.raised_at || new Date(),
        slaDeadline,
        modelVersion: `${event.model_name} ${event.model_version}`,
        trackId: event.track_id,
        boundingBox: event.bounding_box,
        attributes: event.attributes,
        actions: {
          create: {
            previousStatus: 'candidate',
            newStatus: 'raised',
            remarks: `Alert automatically raised by AI inference engine (${event.model_name}) with confidence ${(event.confidence * 100).toFixed(1)}%`,
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

    // 7. Attach snapshot evidence if URL or path provided in event
    if (event.snapshot_url) {
      await prisma.evidence.create({
        data: {
          alertId: alert.id,
          type: 'snapshot',
          fileName: `alert-${alert.alertCode}-snapshot.jpg`,
          filePath: event.snapshot_url,
          fileSize: 102400,
          mimeType: 'image/jpeg',
          metadata: {
            boundingBox: event.bounding_box,
            trackId: event.track_id,
            confidence: event.confidence,
          },
        },
      });
    }

    // 8. Publish to event bus (triggers Socket.IO broadcast to frontend)
    await eventBus.publish('alert.raised', alert);

    logger.info(
      { alertId: alert.id, alertCode: alert.alertCode, detectionCode: event.detection_id },
      'Alert successfully raised from AI inference event'
    );

    return {
      status: 'alert_raised',
      alert,
    };
  }
}

export const aiService = new AIService();
