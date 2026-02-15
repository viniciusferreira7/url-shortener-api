import z from 'zod';

export const orderSchema = z
  .enum([
    'created_at',
    'updated_at',
    'title',
    'description',
    'destinationUrl',
    '-created_at',
    '-updated_at',
    '-title',
    '-description',
    '-destinationUrl',
  ])
  .optional()
  .describe(
    "Sort order. Use '-' prefix for descending order. Example: '-created_at'"
  );
