import { z } from 'zod';

export const createCameraSchema = z.object({
  cameraCode: z.string().min(1, 'Camera code is required (e.g. CAM-042)'),
  name: z.string().min(1, 'Camera name is required'),
  ipAddress: z.string().ip().optional(),
  rtspUrl: z.string().optional(),
  rtspPassword: z.string().optional(),
  cameraType: z.enum(['fixed', 'ptz', 'thermal', 'panoramic']).default('fixed'),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  siteId: z.string().uuid('Valid site ID required'),
  zoneId: z.string().uuid().optional(),
  workFrontId: z.string().uuid().optional(),
  resolution: z.string().default('1080p'),
  calibrationData: z.any().optional(),
});

export const updateCameraSchema = createCameraSchema.partial();

export const assignZoneSchema = z.object({
  zoneId: z.string().uuid('Valid zone ID required'),
});

export const relocateCameraSchema = z.object({
  siteId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  workFrontId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export const calibrateCameraSchema = z.object({
  calibrationData: z.record(z.any()),
  notes: z.string().optional(),
});

export type CreateCameraInput = z.infer<typeof createCameraSchema>;
export type UpdateCameraInput = z.infer<typeof updateCameraSchema>;
export type RelocateCameraInput = z.infer<typeof relocateCameraSchema>;
export type CalibrateCameraInput = z.infer<typeof calibrateCameraSchema>;
