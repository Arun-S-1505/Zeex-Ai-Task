import prisma from '../config/database.js';
import logger from '../config/logger.js';

export interface EvaluationInput {
  detectionCode: string;
  cameraId: string;
  siteId: string;
  zoneId?: string;
  workFrontId?: string;
  confidence: number;
  occurredAt: Date;
  trackId?: string;
}

export interface EvaluationResult {
  shouldRaiseAlert: boolean;
  isCandidate: boolean;
  reason?: string;
  detectionId: string;
  severity: string;
  confidenceThreshold: number;
  slaMinutes: number;
  ruleInstanceId?: string;
  contractorId?: string;
}

// In-memory cache for detection cooldown tracking: key -> timestamp
const cooldownCache = new Map<string, number>();

export class RuleEngineService {
  /**
   * Evaluate safety detection event against detection definition and active rules
   */
  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    // 1. Fetch detection definition
    const detection = await prisma.detectionDefinition.findUnique({
      where: { detectionCode: input.detectionCode },
    });

    if (!detection || !detection.isActive) {
      return {
        shouldRaiseAlert: false,
        isCandidate: false,
        reason: `Detection ${input.detectionCode} not found or inactive`,
        detectionId: detection?.id || '',
        severity: 'low',
        confidenceThreshold: 1.0,
        slaMinutes: 60,
      };
    }

    // 2. Fetch specific rule instances if any for this camera/zone/workfront
    const rules = await prisma.ruleInstance.findMany({
      where: {
        detectionId: detection.id,
        isActive: true,
        OR: [
          { cameraId: input.cameraId },
          { zoneId: input.zoneId },
          { workFrontId: input.workFrontId },
          { cameraId: null, zoneId: null, workFrontId: null }, // default global rule
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    // Pick most specific rule (camera > zone > workfront > global)
    const specificRule =
      rules.find((r) => r.cameraId === input.cameraId) ||
      rules.find((r) => r.zoneId === input.zoneId) ||
      rules.find((r) => r.workFrontId === input.workFrontId) ||
      rules[0];

    // Determine effective thresholds
    const confidenceThreshold = specificRule?.confidenceOverride ?? detection.confidenceThreshold;
    const cooldownSeconds = specificRule?.cooldownOverride ?? detection.cooldownPeriod;
    const severity = specificRule?.severityOverride ?? detection.severity;

    // Check time restrictions if specified on the rule
    if (specificRule?.timeRestrictions) {
      const now = new Date(input.occurredAt);
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const restrictions = specificRule.timeRestrictions as {
        startTime?: string;
        endTime?: string;
        daysOfWeek?: number[];
      };

      if (restrictions.daysOfWeek && !restrictions.daysOfWeek.includes(now.getDay())) {
        return {
          shouldRaiseAlert: false,
          isCandidate: false,
          reason: 'Outside permitted day of week for rule',
          detectionId: detection.id,
          severity,
          confidenceThreshold,
          slaMinutes: this.getSlaMinutes(severity),
        };
      }

      if (restrictions.startTime && restrictions.endTime) {
        if (currentTime < restrictions.startTime || currentTime > restrictions.endTime) {
          return {
            shouldRaiseAlert: false,
            isCandidate: false,
            reason: 'Outside active time window for rule',
            detectionId: detection.id,
            severity,
            confidenceThreshold,
            slaMinutes: this.getSlaMinutes(severity),
          };
        }
      }
    }

    // 3. Confidence check
    if (input.confidence < confidenceThreshold) {
      return {
        shouldRaiseAlert: false,
        isCandidate: true, // flagged as candidate but not raised
        reason: `Confidence ${input.confidence.toFixed(2)} is below threshold ${confidenceThreshold.toFixed(2)}`,
        detectionId: detection.id,
        severity,
        confidenceThreshold,
        slaMinutes: this.getSlaMinutes(severity),
        ruleInstanceId: specificRule?.id,
      };
    }

    // 4. Cooldown check per (camera + detection)
    const cooldownKey = `${input.cameraId}:${input.detectionCode}`;
    const lastTriggered = cooldownCache.get(cooldownKey);
    const nowMs = input.occurredAt.getTime();

    if (lastTriggered && (nowMs - lastTriggered) < cooldownSeconds * 1000) {
      const remainingSeconds = Math.ceil((cooldownSeconds * 1000 - (nowMs - lastTriggered)) / 1000);
      logger.debug({ cooldownKey, remainingSeconds }, 'Alert suppressed due to active cooldown window');
      return {
        shouldRaiseAlert: false,
        isCandidate: true,
        reason: `Cooldown active (${remainingSeconds}s remaining)`,
        detectionId: detection.id,
        severity,
        confidenceThreshold,
        slaMinutes: this.getSlaMinutes(severity),
        ruleInstanceId: specificRule?.id,
      };
    }

    // 5. Contractor attribution based on approved time-bound work-front mappings
    let contractorId: string | undefined;
    if (input.workFrontId) {
      const assignment = await prisma.contractorWorkFront.findFirst({
        where: {
          workFrontId: input.workFrontId,
          isActive: true,
          startDate: { lte: input.occurredAt },
          OR: [{ endDate: null }, { endDate: { gte: input.occurredAt } }],
        },
        include: { contractor: true },
      });
      if (assignment) {
        contractorId = assignment.contractorId;
      }
    }

    // Set cooldown
    cooldownCache.set(cooldownKey, nowMs);

    return {
      shouldRaiseAlert: true,
      isCandidate: false,
      detectionId: detection.id,
      severity,
      confidenceThreshold,
      slaMinutes: this.getSlaMinutes(severity),
      ruleInstanceId: specificRule?.id,
      contractorId,
    };
  }

  private getSlaMinutes(severity: string): number {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 15;
      case 'high':
        return 30;
      case 'medium':
        return 60;
      case 'low':
      default:
        return 120;
    }
  }
}

export const ruleEngine = new RuleEngineService();
export default ruleEngine;
