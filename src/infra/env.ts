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

	REDIS_URL: z.url(),
	REDIS_PASSWORD: z.string(),

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
