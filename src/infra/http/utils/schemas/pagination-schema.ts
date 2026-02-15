import { z } from 'zod';

export const paginationSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    page: z.number().min(1).describe('Current page number'),

    total_pages: z.number().min(1).describe('Total number of available pages'),

    per_page: z.number().min(1).describe('Number of items returned per page'),

    result: z.array(itemSchema).describe('List of items for the current page'),
  });
