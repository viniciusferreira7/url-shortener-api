import { z } from 'zod';

export const urlWithAuthorSchemaResponse = z.object({
  url_id: z.uuid().describe('Unique identifier of the URL'),
  author_id: z.uuid().describe('Unique identifier of the author'),
  url_name: z.string().describe('Name of the URL'),
  url_code: z
    .string()
    .describe('Short code of the URL, used to redirect to the destination URL'),
  url_description: z.string().nullable().describe('Description of the URL'),
  url_is_public: z
    .boolean()
    .describe(
      'If true, the URL can be viewed by other users; otherwise only the author can view it'
    ),
  url_likes: z.number().describe('Total number of likes this URL has received'),
  score: z
    .number()
    .min(0)
    .optional()
    .describe('Number of times the URL was accessed'),
  destination_url: z.string().url().describe('Original destination URL'),
  created_at: z.string().describe('ISO date when the URL was created'),
  updated_at: z
    .string()
    .nullable()
    .optional()
    .describe('ISO date when the URL was last updated'),
});
