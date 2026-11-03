import { z } from 'zod';

export const createZoneSchema = z.object({
  name: z.string().min(1, 'Zone name is required'),
  code: z.string().min(1, 'Zone code is required'),
  siteId: z.string().uuid('Valid site ID required'),
  zoneType: z.enum(['exclusion', 'ppe_mandatory', 'hot_work', 'confined_space', 'general']).default('general'),
  polygon: z.any().optional(), // GeoJSON or polygon vertices
  calibration: z.any().optional(), // Camera-space calibration metadata
  riskLevel: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
});

export const updateZoneSchema = createZoneSchema.partial();

export type CreateZoneInput = z.infer<typeof createZoneSchema>;
export type UpdateZoneInput = z.infer<typeof updateZoneSchema>;
