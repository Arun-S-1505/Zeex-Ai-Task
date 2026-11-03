import { z } from 'zod';
export declare const createManualAlertSchema: z.ZodObject<{
    detectionId: z.ZodString;
    cameraId: z.ZodString;
    siteId: z.ZodString;
    zoneId: z.ZodOptional<z.ZodString>;
    workFrontId: z.ZodOptional<z.ZodString>;
    contractorId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    severity: z.ZodDefault<z.ZodEnum<["critical", "high", "medium", "low"]>>;
    confidence: z.ZodDefault<z.ZodNumber>;
    occurredAt: z.ZodDefault<z.ZodDate>;
}, "strip", z.ZodTypeAny, {
    siteId: string;
    detectionId: string;
    cameraId: string;
    title: string;
    severity: "critical" | "high" | "medium" | "low";
    confidence: number;
    occurredAt: Date;
    description?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    contractorId?: string | undefined;
}, {
    siteId: string;
    detectionId: string;
    cameraId: string;
    title: string;
    description?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    contractorId?: string | undefined;
    severity?: "critical" | "high" | "medium" | "low" | undefined;
    confidence?: number | undefined;
    occurredAt?: Date | undefined;
}>;
export declare const updateAlertSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<["critical", "high", "medium", "low"]>>;
    contractorId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    contractorId?: string | null | undefined;
    title?: string | undefined;
    severity?: "critical" | "high" | "medium" | "low" | undefined;
}, {
    description?: string | undefined;
    contractorId?: string | null | undefined;
    title?: string | undefined;
    severity?: "critical" | "high" | "medium" | "low" | undefined;
}>;
export declare const acknowledgeAlertSchema: z.ZodObject<{
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    remarks?: string | undefined;
}, {
    remarks?: string | undefined;
}>;
export declare const assignAlertSchema: z.ZodObject<{
    assignedUserId: z.ZodString;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    assignedUserId: string;
    remarks?: string | undefined;
}, {
    assignedUserId: string;
    remarks?: string | undefined;
}>;
export declare const takeActionSchema: z.ZodObject<{
    actionTaken: z.ZodString;
    evidenceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    remarks: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    actionTaken: string;
    remarks?: string | undefined;
    evidenceIds?: string[] | undefined;
}, {
    actionTaken: string;
    remarks?: string | undefined;
    evidenceIds?: string[] | undefined;
}>;
export declare const closeAlertSchema: z.ZodObject<{
    closureRemarks: z.ZodString;
    evidenceIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    closureRemarks: string;
    evidenceIds?: string[] | undefined;
}, {
    closureRemarks: string;
    evidenceIds?: string[] | undefined;
}>;
export declare const falsePositiveSchema: z.ZodObject<{
    reason: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["lighting_glare", "occlusion", "background_object", "model_error", "other"]>>;
}, "strip", z.ZodTypeAny, {
    category: "other" | "lighting_glare" | "occlusion" | "background_object" | "model_error";
    reason: string;
}, {
    reason: string;
    category?: "other" | "lighting_glare" | "occlusion" | "background_object" | "model_error" | undefined;
}>;
export declare const missedDetectionSchema: z.ZodObject<{
    cameraId: z.ZodString;
    detectionId: z.ZodString;
    occurredAt: z.ZodDate;
    notes: z.ZodString;
    snapshotUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    detectionId: string;
    cameraId: string;
    occurredAt: Date;
    notes: string;
    snapshotUrl?: string | undefined;
}, {
    detectionId: string;
    cameraId: string;
    occurredAt: Date;
    notes: string;
    snapshotUrl?: string | undefined;
}>;
export type CreateManualAlertInput = z.infer<typeof createManualAlertSchema>;
export type UpdateAlertInput = z.infer<typeof updateAlertSchema>;
export type AcknowledgeAlertInput = z.infer<typeof acknowledgeAlertSchema>;
export type AssignAlertInput = z.infer<typeof assignAlertSchema>;
export type TakeActionInput = z.infer<typeof takeActionSchema>;
export type CloseAlertInput = z.infer<typeof closeAlertSchema>;
export type FalsePositiveInput = z.infer<typeof falsePositiveSchema>;
export type MissedDetectionInput = z.infer<typeof missedDetectionSchema>;
//# sourceMappingURL=alerts.validation.d.ts.map