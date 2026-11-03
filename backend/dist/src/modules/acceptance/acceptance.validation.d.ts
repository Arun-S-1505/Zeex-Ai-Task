import { z } from 'zod';
export declare const createMeasurementSchema: z.ZodObject<{
    metricName: z.ZodString;
    metricValue: z.ZodNumber;
    target: z.ZodOptional<z.ZodNumber>;
    unit: z.ZodOptional<z.ZodString>;
    category: z.ZodDefault<z.ZodEnum<["latency", "availability", "accuracy", "evidence", "soak_test"]>>;
    status: z.ZodDefault<z.ZodEnum<["pass", "fail", "pending"]>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "pass" | "fail";
    category: "evidence" | "latency" | "availability" | "accuracy" | "soak_test";
    metricName: string;
    metricValue: number;
    target?: number | undefined;
    notes?: string | undefined;
    unit?: string | undefined;
}, {
    metricName: string;
    metricValue: number;
    status?: "pending" | "pass" | "fail" | undefined;
    target?: number | undefined;
    notes?: string | undefined;
    category?: "evidence" | "latency" | "availability" | "accuracy" | "soak_test" | undefined;
    unit?: string | undefined;
}>;
export declare const signoffSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
}, {
    notes?: string | undefined;
}>;
export type CreateMeasurementInput = z.infer<typeof createMeasurementSchema>;
export type SignoffInput = z.infer<typeof signoffSchema>;
//# sourceMappingURL=acceptance.validation.d.ts.map