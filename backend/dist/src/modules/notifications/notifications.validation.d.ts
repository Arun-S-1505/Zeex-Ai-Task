import { z } from 'zod';
export declare const createNotificationSchema: z.ZodObject<{
    recipientId: z.ZodString;
    alertId: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["in_app", "email", "sms", "push"]>>;
    title: z.ZodString;
    message: z.ZodString;
    channel: z.ZodDefault<z.ZodEnum<["in_app", "email", "sms", "push"]>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    type: "push" | "email" | "in_app" | "sms";
    title: string;
    recipientId: string;
    channel: "push" | "email" | "in_app" | "sms";
    alertId?: string | undefined;
    metadata?: Record<string, any> | undefined;
}, {
    message: string;
    title: string;
    recipientId: string;
    type?: "push" | "email" | "in_app" | "sms" | undefined;
    alertId?: string | undefined;
    metadata?: Record<string, any> | undefined;
    channel?: "push" | "email" | "in_app" | "sms" | undefined;
}>;
export declare const createEscalationSchema: z.ZodObject<{
    alertId: z.ZodString;
    level: z.ZodDefault<z.ZodNumber>;
    escalatedTo: z.ZodString;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    level: number;
    alertId: string;
    reason: string;
    escalatedTo: string;
}, {
    alertId: string;
    reason: string;
    escalatedTo: string;
    level?: number | undefined;
}>;
export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type CreateEscalationInput = z.infer<typeof createEscalationSchema>;
//# sourceMappingURL=notifications.validation.d.ts.map