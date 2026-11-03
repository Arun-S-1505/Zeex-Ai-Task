import { z } from 'zod';
export declare const aiEventSchema: z.ZodObject<{
    event_id: z.ZodString;
    event_type: z.ZodDefault<z.ZodEnum<["detection.raw", "frame.meta", "track.update", "camera.health"]>>;
    schema_version: z.ZodDefault<z.ZodString>;
    site_id: z.ZodString;
    camera_id: z.ZodString;
    occurred_at: z.ZodDate;
    raised_at: z.ZodOptional<z.ZodDate>;
    detection_id: z.ZodString;
    model_name: z.ZodDefault<z.ZodString>;
    model_version: z.ZodDefault<z.ZodString>;
    track_id: z.ZodOptional<z.ZodString>;
    confidence: z.ZodNumber;
    zone_id: z.ZodOptional<z.ZodString>;
    workfront_id: z.ZodOptional<z.ZodString>;
    attributes: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    bounding_box: z.ZodOptional<z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        y: number;
        x: number;
        width: number;
        height: number;
    }, {
        y: number;
        x: number;
        width: number;
        height: number;
    }>>;
    snapshot_url: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    confidence: number;
    attributes: Record<string, any>;
    event_id: string;
    event_type: "frame.meta" | "detection.raw" | "track.update" | "camera.health";
    schema_version: string;
    site_id: string;
    camera_id: string;
    occurred_at: Date;
    detection_id: string;
    model_name: string;
    model_version: string;
    raised_at?: Date | undefined;
    track_id?: string | undefined;
    zone_id?: string | undefined;
    workfront_id?: string | undefined;
    bounding_box?: {
        y: number;
        x: number;
        width: number;
        height: number;
    } | undefined;
    snapshot_url?: string | undefined;
}, {
    confidence: number;
    event_id: string;
    site_id: string;
    camera_id: string;
    occurred_at: Date;
    detection_id: string;
    attributes?: Record<string, any> | undefined;
    event_type?: "frame.meta" | "detection.raw" | "track.update" | "camera.health" | undefined;
    schema_version?: string | undefined;
    raised_at?: Date | undefined;
    model_name?: string | undefined;
    model_version?: string | undefined;
    track_id?: string | undefined;
    zone_id?: string | undefined;
    workfront_id?: string | undefined;
    bounding_box?: {
        y: number;
        x: number;
        width: number;
        height: number;
    } | undefined;
    snapshot_url?: string | undefined;
}>;
export type AIEventInput = z.infer<typeof aiEventSchema>;
//# sourceMappingURL=ai.validation.d.ts.map