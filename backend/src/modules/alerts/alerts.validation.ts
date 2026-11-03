import { z } from 'zod';

export const createManualAlertSchema = z.object({
  detectionId: z.string().uuid('Valid detection definition ID required'),
  cameraId: z.string().uuid('Valid camera ID required'),
  siteId: z.string().uuid('Valid site ID required'),
  zoneId: z.string().uuid().optional(),
  workFrontId: z.string().uuid().optional(),
  contractorId: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  confidence: z.number().min(0).max(1).default(1.0),
  occurredAt: z.coerce.date().default(() => new Date()),
});

export const updateAlertSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  contractorId: z.string().uuid().nullable().optional(),
});

export const acknowledgeAlertSchema = z.object({
  remarks: z.string().optional(),
});

export const assignAlertSchema = z.object({
  assignedUserId: z.string().uuid('Valid user ID required'),
  remarks: z.string().optional(),
});

export const takeActionSchema = z.object({
  actionTaken: z.string().min(1, 'Action description is required'),
  evidenceIds: z.array(z.string().uuid()).optional(),
  remarks: z.string().optional(),
});

export const closeAlertSchema = z.object({
  closureRemarks: z.string().min(1, 'Corrective action remarks are required to close an alert'),
  evidenceIds: z.array(z.string().uuid()).optional(),
});

export const falsePositiveSchema = z.object({
  reason: z.string().min(1, 'Reason for marking false positive is required'),
  category: z.enum(['lighting_glare', 'occlusion', 'background_object', 'model_error', 'other']).default('model_error'),
});

export const missedDetectionSchema = z.object({
  cameraId: z.string().uuid(),
  detectionId: z.string().uuid(),
  occurredAt: z.coerce.date(),
  notes: z.string().min(1),
  snapshotUrl: z.string().optional(),
});

export type CreateManualAlertInput = z.infer<typeof createManualAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
export type AcknowledgeAlertInput = z.infer<typeof acknowledgeAlertSchema>;
export type AssignAlertInput = z.infer<typeof assignAlertSchema>;
export type TakeActionInput = z.infer<typeof takeActionSchema>;
export type CloseAlertInput = z.infer<typeof closeAlertSchema>;
export type FalsePositiveInput = z.infer<typeof falsePositiveSchema>;
export type MissedDetectionInput = z.infer<typeof missedDetectionSchema>;
