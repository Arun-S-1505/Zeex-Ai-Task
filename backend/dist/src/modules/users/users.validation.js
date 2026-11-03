import { z } from 'zod';
export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    roleName: z.enum(['ADMIN', 'OPERATOR', 'MANAGEMENT']),
    phone: z.string().optional(),
    siteId: z.string().uuid().optional(),
});
export const updateUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    siteId: z.string().uuid().nullable().optional(),
    isActive: z.boolean().optional(),
});
export const updateRoleSchema = z.object({
    roleName: z.enum(['ADMIN', 'OPERATOR', 'MANAGEMENT']),
});
//# sourceMappingURL=users.validation.js.map