import { describe, it, expect, vi, beforeEach } from 'vitest';
import { alertsService } from '../src/modules/alerts/alerts.service.js';
import prisma from '../src/config/database.js';

describe('Alert Management System Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('list - should return formatted alerts and summary metrics', async () => {
    vi.spyOn(prisma.alert, 'count').mockResolvedValue(12);
    vi.spyOn(prisma.alert, 'findMany').mockResolvedValue([
      {
        id: 'alt-uuid-1',
        alertCode: 'ALT-2048',
        title: 'No helmet detected',
        severity: 'critical',
        confidence: 0.98,
        status: 'raised',
        occurredAt: new Date(),
        detection: { detectionCode: 'D01', name: 'Helmet compliance' },
        camera: { cameraCode: 'CAM-042', name: 'Boiler House B' },
        site: { name: 'North Plant' },
        zone: { name: 'Boiler House B' },
        contractor: { name: 'Apex Industrial' },
        assignedUser: null,
        evidence: [],
      } as any,
    ]);

    const result = await alertsService.list({ page: 1, limit: 10 });
    expect(result.alerts[0].id).toBe('ALT-2048');
    expect(result.alerts[0].confidence).toBe(98);
    expect(result.alerts[0].accent).toBe('red');
    expect(result.summary).toHaveProperty('openQueue');
  });

  it('acknowledge - should transition raised alert to acknowledged state', async () => {
    vi.spyOn(prisma.alert, 'findFirst').mockResolvedValue({
      id: 'alt-uuid-1',
      alertCode: 'ALT-2048',
      status: 'raised',
      detection: { detectionCode: 'D01' },
    } as any);

    vi.spyOn(prisma.alert, 'update').mockResolvedValue({
      id: 'alt-uuid-1',
      alertCode: 'ALT-2048',
      status: 'acknowledged',
      severity: 'critical',
      occurredAt: new Date(),
      detection: { detectionCode: 'D01' },
      camera: { cameraCode: 'CAM-042' },
      site: { name: 'North Plant' },
      zone: { name: 'Boiler House B' },
      contractor: { name: 'Apex Industrial' },
    } as any);
    vi.spyOn(prisma.auditLog, 'create').mockResolvedValue({} as any);

    const result = await alertsService.acknowledge('alt-uuid-1', { remarks: 'Acknowledged' }, 'user-1');
    expect(result.status).toBe('Acknowledged');
  });

  it('close - should close alert with corrective action remarks', async () => {
    vi.spyOn(prisma.alert, 'findFirst').mockResolvedValue({
      id: 'alt-uuid-1',
      alertCode: 'ALT-2048',
      status: 'action_taken',
      detection: { detectionCode: 'D01' },
    } as any);

    vi.spyOn(prisma.alert, 'update').mockResolvedValue({
      id: 'alt-uuid-1',
      alertCode: 'ALT-2048',
      status: 'closed',
      severity: 'critical',
      occurredAt: new Date(),
      detection: { detectionCode: 'D01' },
      camera: { cameraCode: 'CAM-042' },
      site: { name: 'North Plant' },
      zone: { name: 'Boiler House B' },
      contractor: { name: 'Apex Industrial' },
    } as any);
    vi.spyOn(prisma.auditLog, 'create').mockResolvedValue({} as any);

    const result = await alertsService.close('alt-uuid-1', { closureRemarks: 'Worker put on helmet' }, 'user-1');
    expect(result.status).toBe('Closed');
  });

  it('markFalsePositive - should transition to false_positive and record ground truth label', async () => {
    vi.spyOn(prisma.alert, 'findFirst').mockResolvedValue({
      id: 'alt-uuid-1',
      alertCode: 'ALT-2048',
      status: 'raised',
      detection: { detectionCode: 'D01' },
    } as any);

    vi.spyOn(prisma.alert, 'update').mockResolvedValue({
      id: 'alt-uuid-1',
      alertCode: 'ALT-2048',
      status: 'false_positive',
      severity: 'critical',
      occurredAt: new Date(),
      detection: { detectionCode: 'D01' },
      camera: { cameraCode: 'CAM-042' },
      site: { name: 'North Plant' },
      zone: { name: 'Boiler House B' },
      contractor: { name: 'Apex Industrial' },
    } as any);

    vi.spyOn(prisma.groundTruthLabel, 'create').mockResolvedValue({} as any);
    vi.spyOn(prisma.auditLog, 'create').mockResolvedValue({} as any);

    const result = await alertsService.markFalsePositive(
      'alt-uuid-1',
      { reason: 'Occlusion by pipe', category: 'occlusion' },
      'user-1'
    );
    expect(result.status).toBe('False Positive');
  });
});
