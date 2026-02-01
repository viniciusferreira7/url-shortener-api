import z from 'zod';

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    PORT: z.coerce.number().default(3333),

    DATABASE_URL: z.url(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),

    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_DB: z.coerce.number().default(0),
    REDIS_PASSWORD: z.string(),
    REDIS_CODE_ID: z.coerce.number(),

    CLIENT_URL: z.url(),

    SECRET_HASH_KEY: z.string(),

    JWT_SECRET: z.string(),
    API_KEY: z.string().optional(),

    GH_TOKEN: z.string(),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'test' && !data.API_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['API_KEY'],
        message: 'API_KEY is required in non-test environments',
      });
    }
  });

const envSchemaResult = envSchema.safeParse(process.env);

if (envSchemaResult.success === false) {
  console.error(
    '❌ Invalid environment variables',
    envSchemaResult.error.issues
  );
  throw new Error('Invalid environment variables');
}

export const env = envSchemaResult.data;
