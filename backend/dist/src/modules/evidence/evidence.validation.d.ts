import { z } from 'zod';
export declare const uploadEvidenceSchema: z.ZodObject<{
    alertId: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["image", "video", "snapshot", "clip"]>>;
    retentionClass: z.ZodDefault<z.ZodEnum<["standard", "long_term", "permanent"]>>;
    legalHold: z.ZodDefault<z.ZodBoolean>;
    metadata: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    type: "snapshot" | "image" | "video" | "clip";
    retentionClass: "standard" | "long_term" | "permanent";
    legalHold: boolean;
    alertId?: string | undefined;
    metadata?: any;
}, {
    type?: "snapshot" | "image" | "video" | "clip" | undefined;
    alertId?: string | undefined;
    metadata?: any;
    retentionClass?: "standard" | "long_term" | "permanent" | undefined;
    legalHold?: boolean | undefined;
}>;
export declare const updateEvidenceSchema: z.ZodObject<{
    legalHold: z.ZodOptional<z.ZodBoolean>;
    retentionClass: z.ZodOptional<z.ZodEnum<["standard", "long_term", "permanent"]>>;
    metadata: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    metadata?: any;
    retentionClass?: "standard" | "long_term" | "permanent" | undefined;
    legalHold?: boolean | undefined;
}, {
    metadata?: any;
    retentionClass?: "standard" | "long_term" | "permanent" | undefined;
    legalHold?: boolean | undefined;
}>;
export type UploadEvidenceInput = z.infer<typeof uploadEvidenceSchema>;
export type UpdateEvidenceInput = z.infer<typeof updateEvidenceSchema>;
//# sourceMappingURL=evidence.validation.d.ts.map