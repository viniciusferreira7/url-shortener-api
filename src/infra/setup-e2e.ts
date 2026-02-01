import { afterAll, afterEach, beforeAll } from 'bun:test';
import { execSync } from 'node:child_process';
import { RedisClient } from 'bun';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzleDb } from './db/drizzle/client';
import { envSchema } from './env';

dotenv.config({ path: '.env.test', override: true });

const envResult = envSchema.parse(process.env);

let redis: RedisClient;

beforeAll(async () => {
  try {
    execSync('bun drizzle-kit push --force', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to push database schema:', error);
    throw error;
  }

  const redisUrl = `redis://${envResult.REDIS_PASSWORD ? `:${envResult.REDIS_PASSWORD}@` : ''}${envResult.REDIS_HOST}:${Number(envResult.REDIS_PORT) || 6379}/${Number(envResult.REDIS_DB) || 1}`;
  redis = new RedisClient(redisUrl);
});

afterEach(async () => {
  await drizzleDb.execute(
    sql`TRUNCATE TABLE urls, users, sessions, accounts, verifications CASCADE`
  );

  if (redis) {
    await redis.send('flushdb', []);
    await redis.del('code_id');
  }
});

afterAll(async () => {
  if (redis) {
    redis.close();
  }
});
