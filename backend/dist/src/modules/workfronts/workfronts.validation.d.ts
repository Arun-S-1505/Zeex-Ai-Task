import { z } from 'zod';
export declare const createWorkFrontSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    siteId: z.ZodString;
    zoneId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    activity: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["active", "pending", "completed", "suspended"]>>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    shiftPattern: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    status: "active" | "pending" | "completed" | "suspended";
    name: string;
    siteId: string;
    description?: string | undefined;
    zoneId?: string | undefined;
    activity?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    shiftPattern?: string | undefined;
}, {
    code: string;
    name: string;
    siteId: string;
    status?: "active" | "pending" | "completed" | "suspended" | undefined;
    description?: string | undefined;
    zoneId?: string | undefined;
    activity?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    shiftPattern?: string | undefined;
}>;
export declare const updateWorkFrontSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    siteId: z.ZodOptional<z.ZodString>;
    zoneId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    activity: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["active", "pending", "completed", "suspended"]>>>;
    startDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    shiftPattern: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    status?: "active" | "pending" | "completed" | "suspended" | undefined;
    name?: string | undefined;
    siteId?: string | undefined;
    description?: string | undefined;
    zoneId?: string | undefined;
    activity?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    shiftPattern?: string | undefined;
}, {
    code?: string | undefined;
    status?: "active" | "pending" | "completed" | "suspended" | undefined;
    name?: string | undefined;
    siteId?: string | undefined;
    description?: string | undefined;
    zoneId?: string | undefined;
    activity?: string | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
    shiftPattern?: string | undefined;
}>;
export declare const assignContractorSchema: z.ZodObject<{
    contractorId: z.ZodString;
    startDate: z.ZodDate;
    endDate: z.ZodOptional<z.ZodDate>;
    shiftId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contractorId: string;
    startDate: Date;
    shiftId?: string | undefined;
    endDate?: Date | undefined;
}, {
    contractorId: string;
    startDate: Date;
    shiftId?: string | undefined;
    endDate?: Date | undefined;
}>;
export declare const bulkImportWorkFrontsSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        code: z.ZodString;
        siteId: z.ZodString;
        zoneId: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        activity: z.ZodOptional<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["active", "pending", "completed", "suspended"]>>;
        startDate: z.ZodOptional<z.ZodDate>;
        endDate: z.ZodOptional<z.ZodDate>;
        shiftPattern: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        status: "active" | "pending" | "completed" | "suspended";
        name: string;
        siteId: string;
        description?: string | undefined;
        zoneId?: string | undefined;
        activity?: string | undefined;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
        shiftPattern?: string | undefined;
    }, {
        code: string;
        name: string;
        siteId: string;
        status?: "active" | "pending" | "completed" | "suspended" | undefined;
        description?: string | undefined;
        zoneId?: string | undefined;
        activity?: string | undefined;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
        shiftPattern?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        code: string;
        status: "active" | "pending" | "completed" | "suspended";
        name: string;
        siteId: string;
        description?: string | undefined;
        zoneId?: string | undefined;
        activity?: string | undefined;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
        shiftPattern?: string | undefined;
    }[];
}, {
    items: {
        code: string;
        name: string;
        siteId: string;
        status?: "active" | "pending" | "completed" | "suspended" | undefined;
        description?: string | undefined;
        zoneId?: string | undefined;
        activity?: string | undefined;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
        shiftPattern?: string | undefined;
    }[];
}>;
export type CreateWorkFrontInput = z.infer<typeof createWorkFrontSchema>;
export type UpdateWorkFrontInput = z.infer<typeof updateWorkFrontSchema>;
export type AssignContractorInput = z.infer<typeof assignContractorSchema>;
//# sourceMappingURL=workfronts.validation.d.ts.map