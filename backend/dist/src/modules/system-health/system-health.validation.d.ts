import { z } from 'zod';
export declare const createFaultTicketSchema: z.ZodObject<{
    entityType: z.ZodEnum<["camera", "server", "network", "ai_service"]>;
    entityId: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    severity: z.ZodDefault<z.ZodEnum<["critical", "high", "medium", "low"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    severity: "critical" | "high" | "medium" | "low";
    entityType: "camera" | "server" | "network" | "ai_service";
    description?: string | undefined;
    entityId?: string | undefined;
    assignedTo?: string | undefined;
}, {
    title: string;
    entityType: "camera" | "server" | "network" | "ai_service";
    description?: string | undefined;
    severity?: "critical" | "high" | "medium" | "low" | undefined;
    entityId?: string | undefined;
    assignedTo?: string | undefined;
}>;
export declare const updateFaultTicketSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    severity: z.ZodOptional<z.ZodEnum<["critical", "high", "medium", "low"]>>;
    assignedTo: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["open", "in_progress", "resolved", "closed"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "closed" | "open" | "in_progress" | "resolved" | undefined;
    description?: string | undefined;
    title?: string | undefined;
    severity?: "critical" | "high" | "medium" | "low" | undefined;
    assignedTo?: string | undefined;
}, {
    status?: "closed" | "open" | "in_progress" | "resolved" | undefined;
    description?: string | undefined;
    title?: string | undefined;
    severity?: "critical" | "high" | "medium" | "low" | undefined;
    assignedTo?: string | undefined;
}>;
export declare const closeFaultTicketSchema: z.ZodObject<{
    resolutionNotes: z.ZodString;
}, "strip", z.ZodTypeAny, {
    resolutionNotes: string;
}, {
    resolutionNotes: string;
}>;
export type CreateFaultTicketInput = z.infer<typeof createFaultTicketSchema>;
export type UpdateFaultTicketInput = z.infer<typeof updateFaultTicketSchema>;
export type CloseFaultTicketInput = z.infer<typeof closeFaultTicketSchema>;
//# sourceMappingURL=system-health.validation.d.ts.map