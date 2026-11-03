import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ruleEngine } from '../src/services/ruleEngine.js';
import prisma from '../src/config/database.js';

describe('Safety Rule Engine Unit Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should suppress alert if detection definition is inactive', async () => {
    vi.spyOn(prisma.detectionDefinition, 'findUnique').mockResolvedValue({
      id: 'd-1',
      detectionCode: 'D01',
      isActive: false,
      confidenceThreshold: 0.85,
    } as any);

    const result = await ruleEngine.evaluate({
      detectionCode: 'D01',
      cameraId: 'cam-1',
      siteId: 'site-1',
      confidence: 0.95,
      occurredAt: new Date(),
    });

    expect(result.shouldRaiseAlert).toBe(false);
    expect(result.reason).toContain('inactive');
  });

  it('should flag as candidate if confidence is below threshold', async () => {
    vi.spyOn(prisma.detectionDefinition, 'findUnique').mockResolvedValue({
      id: 'd-1',
      detectionCode: 'D01',
      isActive: true,
      confidenceThreshold: 0.85,
      cooldownPeriod: 60,
      severity: 'critical',
    } as any);

    vi.spyOn(prisma.ruleInstance, 'findMany').mockResolvedValue([]);

    const result = await ruleEngine.evaluate({
      detectionCode: 'D01',
      cameraId: 'cam-1',
      siteId: 'site-1',
      confidence: 0.75, // Below 0.85
      occurredAt: new Date(),
    });

    expect(result.shouldRaiseAlert).toBe(false);
    expect(result.isCandidate).toBe(true);
    expect(result.reason).toContain('below threshold');
  });

  it('should evaluate and approve alert when confidence exceeds threshold', async () => {
    vi.spyOn(prisma.detectionDefinition, 'findUnique').mockResolvedValue({
      id: 'd-1',
      detectionCode: 'D01',
      isActive: true,
      confidenceThreshold: 0.85,
      cooldownPeriod: 0,
      severity: 'critical',
    } as any);

    vi.spyOn(prisma.ruleInstance, 'findMany').mockResolvedValue([]);

    const result = await ruleEngine.evaluate({
      detectionCode: 'D01',
      cameraId: 'cam-unique-99',
      siteId: 'site-1',
      confidence: 0.94,
      occurredAt: new Date(),
    });

    expect(result.shouldRaiseAlert).toBe(true);
    expect(result.severity).toBe('critical');
    expect(result.slaMinutes).toBe(15);
  });

  it('should calculate correct SLA minutes for different severities', async () => {
    vi.spyOn(prisma.detectionDefinition, 'findUnique').mockResolvedValue({
      id: 'd-2',
      detectionCode: 'D02',
      isActive: true,
      confidenceThreshold: 0.8,
      cooldownPeriod: 0,
      severity: 'low',
    } as any);
    vi.spyOn(prisma.ruleInstance, 'findMany').mockResolvedValue([]);

    const result = await ruleEngine.evaluate({
      detectionCode: 'D02',
      cameraId: 'cam-unique-100',
      siteId: 'site-1',
      confidence: 0.9,
      occurredAt: new Date(),
    });

    expect(result.slaMinutes).toBe(120); // Low severity = 120 mins
  });
});

