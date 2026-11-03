import { z } from 'zod';
export const createNotificationSchema = z.object({
    recipientId: z.string().uuid('Valid recipient user ID required'),
    alertId: z.string().uuid().optional(),
    type: z.enum(['in_app', 'email', 'sms', 'push']).default('in_app'),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    channel: z.enum(['in_app', 'email', 'sms', 'push']).default('in_app'),
    metadata: z.record(z.any()).optional(),
});
export const createEscalationSchema = z.object({
    alertId: z.string().uuid('Valid alert ID required'),
    level: z.number().int().min(1).max(5).default(1),
    escalatedTo: z.string().min(1, 'Target contact/role is required'),
    reason: z.string().min(1, 'Reason for escalation is required'),
});
//# sourceMappingURL=notifications.validation.js.map