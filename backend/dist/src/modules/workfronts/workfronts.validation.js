import { z } from 'zod';
export const createWorkFrontSchema = z.object({
    name: z.string().min(1, 'Work-front name is required'),
    code: z.string().min(1, 'Work-front code is required'),
    siteId: z.string().uuid('Valid site ID required'),
    zoneId: z.string().uuid().optional(),
    description: z.string().optional(),
    activity: z.string().optional(), // excavation, welding, scaffolding, confined_space, general
    status: z.enum(['active', 'pending', 'completed', 'suspended']).default('active'),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    shiftPattern: z.string().optional(),
});
export const updateWorkFrontSchema = createWorkFrontSchema.partial();
export const assignContractorSchema = z.object({
    contractorId: z.string().uuid('Valid contractor ID required'),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    shiftId: z.string().uuid().optional(),
});
export const bulkImportWorkFrontsSchema = z.object({
    items: z.array(createWorkFrontSchema),
});
//# sourceMappingURL=workfronts.validation.js.map