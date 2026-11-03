import { z } from 'zod';
export declare const createZoneSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    siteId: z.ZodString;
    zoneType: z.ZodDefault<z.ZodEnum<["exclusion", "ppe_mandatory", "hot_work", "confined_space", "general"]>>;
    polygon: z.ZodOptional<z.ZodAny>;
    calibration: z.ZodOptional<z.ZodAny>;
    riskLevel: z.ZodDefault<z.ZodEnum<["critical", "high", "medium", "low"]>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    siteId: string;
    zoneType: "exclusion" | "ppe_mandatory" | "hot_work" | "confined_space" | "general";
    riskLevel: "critical" | "high" | "medium" | "low";
    polygon?: any;
    calibration?: any;
}, {
    code: string;
    name: string;
    siteId: string;
    zoneType?: "exclusion" | "ppe_mandatory" | "hot_work" | "confined_space" | "general" | undefined;
    polygon?: any;
    calibration?: any;
    riskLevel?: "critical" | "high" | "medium" | "low" | undefined;
}>;
export declare const updateZoneSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    siteId: z.ZodOptional<z.ZodString>;
    zoneType: z.ZodOptional<z.ZodDefault<z.ZodEnum<["exclusion", "ppe_mandatory", "hot_work", "confined_space", "general"]>>>;
    polygon: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    calibration: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    riskLevel: z.ZodOptional<z.ZodDefault<z.ZodEnum<["critical", "high", "medium", "low"]>>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    siteId?: string | undefined;
    zoneType?: "exclusion" | "ppe_mandatory" | "hot_work" | "confined_space" | "general" | undefined;
    polygon?: any;
    calibration?: any;
    riskLevel?: "critical" | "high" | "medium" | "low" | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    siteId?: string | undefined;
    zoneType?: "exclusion" | "ppe_mandatory" | "hot_work" | "confined_space" | "general" | undefined;
    polygon?: any;
    calibration?: any;
    riskLevel?: "critical" | "high" | "medium" | "low" | undefined;
}>;
export type CreateZoneInput = z.infer<typeof createZoneSchema>;
export type UpdateZoneInput = z.infer<typeof updateZoneSchema>;
//# sourceMappingURL=zones.validation.d.ts.map