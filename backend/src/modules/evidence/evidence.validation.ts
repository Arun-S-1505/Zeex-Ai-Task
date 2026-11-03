import { z } from 'zod';

export const uploadEvidenceSchema = z.object({
  alertId: z.string().uuid().optional(),
  type: z.enum(['image', 'video', 'snapshot', 'clip']).default('snapshot'),
  retentionClass: z.enum(['standard', 'long_term', 'permanent']).default('standard'),
  legalHold: z.coerce.boolean().default(false),
  metadata: z.any().optional(),
});

export const updateEvidenceSchema = z.object({
  legalHold: z.boolean().optional(),
  retentionClass: z.enum(['standard', 'long_term', 'permanent']).optional(),
  metadata: z.any().optional(),
});

export type UploadEvidenceInput = z.infer<typeof uploadEvidenceSchema>;
export type UpdateEvidenceInput = z.infer<typeof updateEvidenceSchema>;
