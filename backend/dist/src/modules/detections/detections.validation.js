import { z } from 'zod';
export const createDetectionSchema = z.object({
    detectionCode: z.string().regex(/^D[0-9]{2}$/, 'Detection code must be in format D01-D54'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    procedureReference: z.string().optional(),
    tier: z.number().int().min(1).max(3).default(1),
    primitives: z.array(z.string()).optional(),
    confidenceThreshold: z.number().min(0).max(1).default(0.85),
    persistenceDuration: z.number().int().min(0).default(3),
    cooldownPeriod: z.number().int().min(0).default(60),
    severity: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
    escalationConfig: z.record(z.any()).optional(),
    modelVersionId: z.string().uuid().optional(),
    category: z.string().default('ppe'),
    isActive: z.boolean().default(true),
});
export const updateDetectionSchema = createDetectionSchema.partial();
export const updateDetectionStatusSchema = z.object({
    isActive: z.boolean(),
});
export const createRuleSchema = z.object({
    name: z.string().min(1, 'Rule name is required'),
    detectionId: z.string().uuid('Valid detection definition ID required'),
    cameraId: z.string().uuid().optional(),
    zoneId: z.string().uuid().optional(),
    workFrontId: z.string().uuid().optional(),
    confidenceOverride: z.number().min(0).max(1).optional(),
    persistenceOverride: z.number().int().min(0).optional(),
    cooldownOverride: z.number().int().min(0).optional(),
    severityOverride: z.enum(['critical', 'high', 'medium', 'low']).optional(),
    timeRestrictions: z.record(z.any()).optional(),
    isActive: z.boolean().default(true),
});
export const updateRuleSchema = createRuleSchema.partial();
//# sourceMappingURL=detections.validation.js.map