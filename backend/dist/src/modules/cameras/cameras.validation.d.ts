import { z } from 'zod';
export declare const createCameraSchema: z.ZodObject<{
    cameraCode: z.ZodString;
    name: z.ZodString;
    ipAddress: z.ZodOptional<z.ZodString>;
    rtspUrl: z.ZodOptional<z.ZodString>;
    rtspPassword: z.ZodOptional<z.ZodString>;
    cameraType: z.ZodDefault<z.ZodEnum<["fixed", "ptz", "thermal", "panoramic"]>>;
    manufacturer: z.ZodOptional<z.ZodString>;
    model: z.ZodOptional<z.ZodString>;
    siteId: z.ZodString;
    zoneId: z.ZodOptional<z.ZodString>;
    workFrontId: z.ZodOptional<z.ZodString>;
    resolution: z.ZodDefault<z.ZodString>;
    calibrationData: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    name: string;
    siteId: string;
    cameraCode: string;
    cameraType: "fixed" | "ptz" | "thermal" | "panoramic";
    resolution: string;
    model?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    ipAddress?: string | undefined;
    rtspUrl?: string | undefined;
    rtspPassword?: string | undefined;
    manufacturer?: string | undefined;
    calibrationData?: any;
}, {
    name: string;
    siteId: string;
    cameraCode: string;
    model?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    ipAddress?: string | undefined;
    rtspUrl?: string | undefined;
    rtspPassword?: string | undefined;
    cameraType?: "fixed" | "ptz" | "thermal" | "panoramic" | undefined;
    manufacturer?: string | undefined;
    calibrationData?: any;
    resolution?: string | undefined;
}>;
export declare const updateCameraSchema: z.ZodObject<{
    cameraCode: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    ipAddress: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    rtspUrl: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    rtspPassword: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    cameraType: z.ZodOptional<z.ZodDefault<z.ZodEnum<["fixed", "ptz", "thermal", "panoramic"]>>>;
    manufacturer: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    model: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    siteId: z.ZodOptional<z.ZodString>;
    zoneId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    workFrontId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    resolution: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    calibrationData: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    model?: string | undefined;
    name?: string | undefined;
    siteId?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    ipAddress?: string | undefined;
    cameraCode?: string | undefined;
    rtspUrl?: string | undefined;
    rtspPassword?: string | undefined;
    cameraType?: "fixed" | "ptz" | "thermal" | "panoramic" | undefined;
    manufacturer?: string | undefined;
    calibrationData?: any;
    resolution?: string | undefined;
}, {
    model?: string | undefined;
    name?: string | undefined;
    siteId?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    ipAddress?: string | undefined;
    cameraCode?: string | undefined;
    rtspUrl?: string | undefined;
    rtspPassword?: string | undefined;
    cameraType?: "fixed" | "ptz" | "thermal" | "panoramic" | undefined;
    manufacturer?: string | undefined;
    calibrationData?: any;
    resolution?: string | undefined;
}>;
export declare const assignZoneSchema: z.ZodObject<{
    zoneId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    zoneId: string;
}, {
    zoneId: string;
}>;
export declare const relocateCameraSchema: z.ZodObject<{
    siteId: z.ZodOptional<z.ZodString>;
    zoneId: z.ZodOptional<z.ZodString>;
    workFrontId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    siteId?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    notes?: string | undefined;
}, {
    siteId?: string | undefined;
    zoneId?: string | undefined;
    workFrontId?: string | undefined;
    notes?: string | undefined;
}>;
export declare const calibrateCameraSchema: z.ZodObject<{
    calibrationData: z.ZodRecord<z.ZodString, z.ZodAny>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    calibrationData: Record<string, any>;
    notes?: string | undefined;
}, {
    calibrationData: Record<string, any>;
    notes?: string | undefined;
}>;
export type CreateCameraInput = z.infer<typeof createCameraSchema>;
export type UpdateCameraInput = z.infer<typeof updateCameraSchema>;
export type RelocateCameraInput = z.infer<typeof relocateCameraSchema>;
export type CalibrateCameraInput = z.infer<typeof calibrateCameraSchema>;
//# sourceMappingURL=cameras.validation.d.ts.map