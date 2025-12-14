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

	CASSANDRA_CLUSTER_NAME: z.string().optional().default('url-shortener-cluster'),
	CASSANDRA_DC: z.string().optional().default('dc1'),
	CASSANDRA_RACK: z.string().optional().default('rack1'),
	CASSANDRA_ENDPOINT_SNITCH: z.string().optional().default('GossipingPropertyFileSnitch'),
	CASSANDRA_NUM_TOKENS: z.coerce.number().optional().default(256),

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
