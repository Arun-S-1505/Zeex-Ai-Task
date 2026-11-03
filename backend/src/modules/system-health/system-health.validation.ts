import { z } from 'zod';

export const createFaultTicketSchema = z.object({
  entityType: z.enum(['camera', 'server', 'network', 'ai_service']),
  entityId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  assignedTo: z.string().optional(),
});

export const updateFaultTicketSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
});

export const closeFaultTicketSchema = z.object({
  resolutionNotes: z.string().min(1, 'Resolution notes are required to close ticket'),
});

export type CreateFaultTicketInput = z.infer<typeof createFaultTicketSchema>;
export type UpdateFaultTicketInput = z.infer<typeof updateFaultTicketSchema>;
export type CloseFaultTicketInput = z.infer<typeof closeFaultTicketSchema>;
