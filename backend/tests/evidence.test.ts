import { describe, it, expect, vi, beforeEach } from 'vitest';
import { evidenceService } from '../src/modules/evidence/evidence.service.js';
import prisma from '../src/config/database.js';

describe('Evidence Vault Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('list - should list evidence objects with signed URLs', async () => {
    vi.spyOn(prisma.evidence, 'count').mockResolvedValue(1);
    vi.spyOn(prisma.evidence, 'findMany').mockResolvedValue([
      {
        id: 'ev-1',
        type: 'snapshot',
        fileName: 'ALT-2048-frame.jpg',
        filePath: 'alerts/alt-1/frame.jpg',
        fileSize: 102400,
        mimeType: 'image/jpeg',
        retentionClass: 'standard',
        legalHold: false,
        createdAt: new Date(),
        alert: { alertCode: 'ALT-2048', title: 'No helmet detected', severity: 'critical' },
      } as any,
    ]);

    const result = await evidenceService.list({ page: 1, limit: 10 });
    expect(result.total).toBe(1);
    expect(result.evidence[0].fileName).toBe('ALT-2048-frame.jpg');
    expect(result.evidence[0]).toHaveProperty('url');
  });

  it('delete - should prevent deletion when legalHold is true', async () => {
    vi.spyOn(prisma.evidence, 'findUnique').mockResolvedValue({
      id: 'ev-locked',
      legalHold: true,
      deletedAt: null,
    } as any);

    await expect(evidenceService.delete('ev-locked', 'user-1')).rejects.toThrow('legal hold');
  });
});
