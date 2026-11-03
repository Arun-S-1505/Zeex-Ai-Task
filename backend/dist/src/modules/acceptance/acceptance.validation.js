import { z } from 'zod';
export const createMeasurementSchema = z.object({
    metricName: z.string().min(1, 'Metric name is required'),
    metricValue: z.number(),
    target: z.number().optional(),
    unit: z.string().optional(),
    category: z.enum(['latency', 'availability', 'accuracy', 'evidence', 'soak_test']).default('latency'),
    status: z.enum(['pass', 'fail', 'pending']).default('pass'),
    notes: z.string().optional(),
});
export const signoffSchema = z.object({
    notes: z.string().optional(),
});
//# sourceMappingURL=acceptance.validation.js.map