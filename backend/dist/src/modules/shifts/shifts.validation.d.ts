import { z } from 'zod';
export declare const createShiftSchema: z.ZodObject<{
    name: z.ZodString;
    siteId: z.ZodString;
    startTime: z.ZodString;
    endTime: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    siteId: string;
    startTime: string;
    endTime: string;
}, {
    name: string;
    siteId: string;
    startTime: string;
    endTime: string;
}>;
export declare const createShiftHandoverSchema: z.ZodObject<{
    shiftId: z.ZodString;
    incomingUserId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    shiftId: string;
    incomingUserId?: string | undefined;
    notes?: string | undefined;
}, {
    shiftId: string;
    incomingUserId?: string | undefined;
    notes?: string | undefined;
}>;
export declare const acknowledgeHandoverSchema: z.ZodObject<{
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    notes?: string | undefined;
}, {
    notes?: string | undefined;
}>;
export type CreateShiftInput = z.infer<typeof createShiftSchema>;
export type CreateShiftHandoverInput = z.infer<typeof createShiftHandoverSchema>;
export type AcknowledgeHandoverInput = z.infer<typeof acknowledgeHandoverSchema>;
//# sourceMappingURL=shifts.validation.d.ts.map