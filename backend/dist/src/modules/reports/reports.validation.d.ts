import { z } from 'zod';
export declare const createReportSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<["daily", "weekly", "monthly", "custom"]>>;
    format: z.ZodDefault<z.ZodEnum<["pdf", "excel"]>>;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    recipients: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    scheduleCron: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "custom" | "daily" | "weekly" | "monthly";
    title: string;
    format: "pdf" | "excel";
    filters?: Record<string, any> | undefined;
    recipients?: string[] | undefined;
    scheduleCron?: string | undefined;
}, {
    title: string;
    type?: "custom" | "daily" | "weekly" | "monthly" | undefined;
    format?: "pdf" | "excel" | undefined;
    filters?: Record<string, any> | undefined;
    recipients?: string[] | undefined;
    scheduleCron?: string | undefined;
}>;
export declare const scheduleReportSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodEnum<["daily", "weekly", "monthly"]>;
    format: z.ZodDefault<z.ZodEnum<["pdf", "excel"]>>;
    scheduleCron: z.ZodString;
    recipients: z.ZodArray<z.ZodString, "many">;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    type: "daily" | "weekly" | "monthly";
    title: string;
    format: "pdf" | "excel";
    recipients: string[];
    scheduleCron: string;
    filters?: Record<string, any> | undefined;
}, {
    type: "daily" | "weekly" | "monthly";
    title: string;
    recipients: string[];
    scheduleCron: string;
    format?: "pdf" | "excel" | undefined;
    filters?: Record<string, any> | undefined;
}>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ScheduleReportInput = z.infer<typeof scheduleReportSchema>;
//# sourceMappingURL=reports.validation.d.ts.map