import z from 'zod';

const envSchema = z.object({
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

  SECRET_HASH_KEY: z.string(),

  CLIENT_URL: z.url(),
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
