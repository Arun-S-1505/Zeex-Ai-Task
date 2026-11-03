import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    roleName: z.ZodEnum<["ADMIN", "OPERATOR", "MANAGEMENT"]>;
    phone: z.ZodOptional<z.ZodString>;
    siteId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleName: "ADMIN" | "OPERATOR" | "MANAGEMENT";
    phone?: string | undefined;
    siteId?: string | undefined;
}, {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    roleName: "ADMIN" | "OPERATOR" | "MANAGEMENT";
    phone?: string | undefined;
    siteId?: string | undefined;
}>;
export declare const updateUserSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    siteId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    siteId?: string | null | undefined;
    isActive?: boolean | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    phone?: string | undefined;
    siteId?: string | null | undefined;
    isActive?: boolean | undefined;
}>;
export declare const updateRoleSchema: z.ZodObject<{
    roleName: z.ZodEnum<["ADMIN", "OPERATOR", "MANAGEMENT"]>;
}, "strip", z.ZodTypeAny, {
    roleName: "ADMIN" | "OPERATOR" | "MANAGEMENT";
}, {
    roleName: "ADMIN" | "OPERATOR" | "MANAGEMENT";
}>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
//# sourceMappingURL=users.validation.d.ts.map