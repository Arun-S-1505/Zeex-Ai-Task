import { z } from 'zod';
export declare const createContractorSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    contactPerson: z.ZodOptional<z.ZodString>;
    contactEmail: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    registrationNumber: z.ZodOptional<z.ZodString>;
    safetyRating: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    safetyRating: number;
    address?: string | undefined;
    contactPerson?: string | undefined;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
    registrationNumber?: string | undefined;
}, {
    code: string;
    name: string;
    address?: string | undefined;
    contactPerson?: string | undefined;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
    registrationNumber?: string | undefined;
    safetyRating?: number | undefined;
}>;
export declare const updateContractorSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    contactPerson: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    contactEmail: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    contactPhone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    registrationNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    safetyRating: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    address?: string | undefined;
    contactPerson?: string | undefined;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
    registrationNumber?: string | undefined;
    safetyRating?: number | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    address?: string | undefined;
    contactPerson?: string | undefined;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
    registrationNumber?: string | undefined;
    safetyRating?: number | undefined;
}>;
export type CreateContractorInput = z.infer<typeof createContractorSchema>;
export type UpdateContractorInput = z.infer<typeof updateContractorSchema>;
//# sourceMappingURL=contractors.validation.d.ts.map