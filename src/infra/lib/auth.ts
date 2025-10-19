import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/infra/db/client';
import { env } from '@/infra/env';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
		camelCase: false,
		debugLogs: env.NODE_ENV === 'development',
	}),
	emailAndPassword: {
		enabled: true,
	},
	advanced: {
		database: {
			generateId: false,
		},
	},
});
