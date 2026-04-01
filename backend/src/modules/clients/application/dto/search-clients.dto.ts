import { createZodDto } from 'nestjs-zod/dto';
import { z } from 'zod';

export const SSearchClients = z.object({
  q: z
    .string()
    .transform((s) => s.trim())
    .pipe(z.string().min(1, 'Search query is required')),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type SearchClientsQuery = z.infer<typeof SSearchClients>;

export class SearchClientsQueryDto extends createZodDto(SSearchClients) {}
