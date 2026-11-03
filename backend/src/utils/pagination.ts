import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

export function getPaginationParams(query: any): PaginationParams {
  return paginationSchema.parse(query);
}

export function buildPrismaQuery(params: PaginationParams): { skip: number; take: number; orderBy?: any } {
  const query: { skip: number; take: number; orderBy?: any } = {
    skip: (params.page - 1) * params.limit,
    take: params.limit,
  };
  if (params.sortBy) {
    query.orderBy = { [params.sortBy]: params.sortOrder || 'desc' };
  } else {
    query.orderBy = { createdAt: 'desc' };
  }
  return query;
}
