import { z } from 'zod';
export const createShiftSchema = z.object({
    name: z.string().min(1, 'Shift name is required (e.g. Day Shift)'),
    siteId: z.string().uuid('Valid site ID required'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm (e.g. 08:00)'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:mm (e.g. 16:00)'),
});
export const createShiftHandoverSchema = z.object({
    shiftId: z.string().uuid('Valid shift ID required'),
    incomingUserId: z.string().uuid().optional(),
    notes: z.string().optional(),
});
export const acknowledgeHandoverSchema = z.object({
    notes: z.string().optional(),
});
//# sourceMappingURL=shifts.validation.js.map