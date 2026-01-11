import { defineConfig } from 'drizzle-kit';
import { env } from '@/infra/env';

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: 'src/infra/db/drizzle/schema/*',
  out: 'src/infra/db/drizzle/migrations',
  casing: 'snake_case',
});
