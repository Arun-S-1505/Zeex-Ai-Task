import { z } from 'zod';
export const createSiteSchema = z.object({
    name: z.string().min(1, 'Site name is required'),
    code: z.string().min(1, 'Site code is required'),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    timezone: z.string().default('UTC'),
});
export const updateSiteSchema = createSiteSchema.partial();
//# sourceMappingURL=sites.validation.js.map