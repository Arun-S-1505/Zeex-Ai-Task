import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '../src/modules/analytics/analytics.service.js';
import prisma from '../src/config/database.js';

describe('Analytics & Dashboards Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getOverview - should return 4 core metric cards and top risk locations', async () => {
    vi.spyOn(prisma.alert, 'count').mockResolvedValue(1284);
    vi.spyOn(prisma.camera, 'count').mockResolvedValue(128);

    const result = await analyticsService.getOverview();
    expect(result.metrics).toHaveProperty('totalAlerts');
    expect(result.metrics).toHaveProperty('criticalIncidents');
    expect(result.metrics).toHaveProperty('safetyCompliance');
    expect(result.metrics).toHaveProperty('avgClosureTime');
    expect(result).toHaveProperty('riskDistribution');
    expect(result).toHaveProperty('topRiskLocations');
  });

  it('getPpeCompliance - should calculate compliance rate based on assessed people', async () => {
    vi.spyOn(prisma.alert, 'count').mockResolvedValue(28);
    vi.spyOn(prisma.personTrack, 'count').mockResolvedValue(18492);

    const result = await analyticsService.getPpeCompliance();
    expect(result.metrics).toHaveProperty('overallCompliance');
    expect(result.metrics).toHaveProperty('peopleAssessed');
    expect(result.metrics).toHaveProperty('openViolations');
    expect(result.metrics).toHaveProperty('unassessable');
    expect(result).toHaveProperty('itemWiseCompliance');
    expect(result.itemWiseCompliance.length).toBeGreaterThan(0);
  });

  it('getContractorAnalytics - should compute contractor ranking and safety scores', async () => {
    vi.spyOn(prisma.contractor, 'findMany').mockResolvedValue([
      { id: 'c-1', name: 'Apex Industrial', code: 'CNT-001', safetyRating: 96.8, _count: { alerts: 2 } },
      { id: 'c-2', name: 'BuildRight JV', code: 'CNT-002', safetyRating: 89.4, _count: { alerts: 5 } },
    ] as any);

    const result = await analyticsService.getContractorAnalytics();
    expect(result.rankings.length).toBe(2);
    expect(result.rankings[0].name).toBe('Apex Industrial');
    expect(result.metrics).toHaveProperty('contractorsAssessed');
  });
});
