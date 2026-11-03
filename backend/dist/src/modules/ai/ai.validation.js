import { z } from 'zod';
export const aiEventSchema = z.object({
    event_id: z.string().uuid('Valid event UUID required'),
    event_type: z.enum(['detection.raw', 'frame.meta', 'track.update', 'camera.health']).default('detection.raw'),
    schema_version: z.string().default('1.0'),
    site_id: z.string().uuid(),
    camera_id: z.string().uuid(),
    occurred_at: z.coerce.date(),
    raised_at: z.coerce.date().optional(),
    detection_id: z.string().regex(/^D[0-9]{2}$/, 'Must be valid detection code (e.g. D01)'),
    model_name: z.string().default('YOLO11'),
    model_version: z.string().default('1.0'),
    track_id: z.string().optional(),
    confidence: z.number().min(0).max(1),
    zone_id: z.string().uuid().optional(),
    workfront_id: z.string().uuid().optional(),
    attributes: z.record(z.any()).optional().default({}),
    bounding_box: z
        .object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number(),
    })
        .optional(),
    snapshot_url: z.string().optional(),
});
//# sourceMappingURL=ai.validation.js.map