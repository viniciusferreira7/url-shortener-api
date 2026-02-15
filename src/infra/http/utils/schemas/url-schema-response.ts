import z from 'zod';

export const urlSchemaResponse = z.object({
  id: z.uuid().describe('ID of URL'),
  author_id: z.uuid().describe('ID of author'),
  name: z.string().describe('Name of URL'),
  code: z
    .string()
    .describe(
      'Code of URL, where it will used to redirect when request destination URL'
    ),
  description: z.string().nullable().describe('Description of URL'),
  is_public: z
    .boolean()
    .describe(
      'If set with true value URL can be viewed by another users, otherwise only author can see the URL'
    ),
  likes: z.number().describe('Number likes that URL got'),
  score: z.number().min(0).describe('Number of time that URL was accessed'),
  destination_url: z.url().describe('Destination URL is original URL'),
  created_at: z.string().describe('Identifier when URL was created'),
  updated_at: z.string().describe('Identifier when URL was updated').nullable(),
});
