import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from '../src/modules/ai/ai.service.js';
import prisma from '../src/config/database.js';

describe('AI Event Ingestion Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('processEvent - should ignore duplicate event_id for idempotency', async () => {
    const eventId = '99999999-9999-9999-9999-999999999999';
    vi.spyOn(prisma.alert, 'findUnique').mockResolvedValue({
      id: 'existing-alert-id',
      alertCode: 'ALT-2048',
      eventId,
    } as any);

    const result = await aiService.processEvent({
      event_id: eventId,
      event_type: 'detection.raw',
      schema_version: '1.0',
      site_id: '11111111-1111-1111-1111-111111111111',
      camera_id: '22222222-2222-2222-2222-222222222222',
      detection_id: 'D01',
      model_name: 'YOLO11',
      model_version: '1.0',
      confidence: 0.95,
      occurred_at: new Date(),
    });

    expect(result.status).toBe('ignored');
    expect(result.reason).toContain('already been processed');
  });

  it('processEvent - should process valid detection event and raise an alert', async () => {
    const eventId = '88888888-8888-8888-8888-888888888888';
    vi.spyOn(prisma.alert, 'findUnique').mockResolvedValue(null);
    vi.spyOn(prisma.camera, 'updateMany').mockResolvedValue({ count: 1 });
    vi.spyOn(prisma.personTrack, 'upsert').mockResolvedValue({} as any);

    vi.spyOn(prisma.detectionDefinition, 'findUnique').mockResolvedValue({
      id: 'det-1',
      detectionCode: 'D01',
      name: 'Helmet compliance',
      isActive: true,
      confidenceThreshold: 0.85,
      cooldownPeriod: 0,
      severity: 'critical',
    } as any);

    vi.spyOn(prisma.ruleInstance, 'findMany').mockResolvedValue([]);
    vi.spyOn(prisma.alert, 'findFirst').mockResolvedValue(null);

    const mockAlert: any = {
      id: 'new-alert-id',
      alertCode: 'ALT-0001',
      title: 'Helmet compliance violation',
      severity: 'critical',
      confidence: 0.96,
      status: 'raised',
      detection: { detectionCode: 'D01', name: 'Helmet compliance' },
      camera: { cameraCode: 'CAM-042', name: 'Boiler House B' },
      site: { name: 'North Plant', code: 'SITE-NP' },
      zone: null,
      workFront: null,
      contractor: null,
    };

    vi.spyOn(prisma.alert, 'create').mockResolvedValue(mockAlert);

    const result = await aiService.processEvent({
      event_id: eventId,
      event_type: 'detection.raw',
      schema_version: '1.0',
      site_id: '11111111-1111-1111-1111-111111111111',
      camera_id: '22222222-2222-2222-2222-222222222222',
      detection_id: 'D01',
      model_name: 'YOLO11',
      model_version: '1.0',
      confidence: 0.96,
      occurred_at: new Date(),
      track_id: 'track-worker-99',
    });

    expect(result.status).toBe('alert_raised');
    expect(result.alert).toHaveProperty('alertCode');
  });
});
