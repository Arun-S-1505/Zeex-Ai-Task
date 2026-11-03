import { z } from 'zod';

export const createReportSchema = z.object({
  title: z.string().min(1, 'Report title is required'),
  type: z.enum(['daily', 'weekly', 'monthly', 'custom']).default('daily'),
  format: z.enum(['pdf', 'excel']).default('pdf'),
  filters: z.record(z.any()).optional(),
  recipients: z.array(z.string().email()).optional(),
  scheduleCron: z.string().optional(),
});

export const scheduleReportSchema = z.object({
  title: z.string().min(1),
  type: z.enum(['daily', 'weekly', 'monthly']),
  format: z.enum(['pdf', 'excel']).default('pdf'),
  scheduleCron: z.string().min(1, 'Cron expression is required'),
  recipients: z.array(z.string().email()),
  filters: z.record(z.any()).optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ScheduleReportInput = z.infer<typeof scheduleReportSchema>;
