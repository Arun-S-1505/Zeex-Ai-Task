import { z } from 'zod';

export const createContractorSchema = z.object({
  name: z.string().min(1, 'Contractor name is required'),
  code: z.string().min(1, 'Contractor code is required'),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  address: z.string().optional(),
  registrationNumber: z.string().optional(),
  safetyRating: z.number().min(0).max(100).default(90.0),
});

export const updateContractorSchema = createContractorSchema.partial();

export type CreateContractorInput = z.infer<typeof createContractorSchema>;
export type UpdateContractorInput = z.infer<typeof updateContractorSchema>;
