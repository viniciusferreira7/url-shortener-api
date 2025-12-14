/** biome-ignore-all lint/correctness/noUndeclaredVariables: It`s a global variable provide by bun */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { openAPI } from 'better-auth/plugins';
import { db } from '@/infra/db/client';
import { env } from '@/infra/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    camelCase: false,
    debugLogs: env.NODE_ENV === 'development',
  }),
  plugins: [openAPI()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    password: {
      hash: (password: string) => Bun.password.hash(password),
      verify: ({ password, hash }) => Bun.password.verify(password, hash),
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
