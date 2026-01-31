import { afterAll, afterEach, beforeAll } from 'bun:test';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { RedisClient } from 'bun';
import * as dotenv from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzleDb } from './db/drizzle/client';
import { envSchema } from './env';

dotenv.config({ path: '.env', override: true });
dotenv.config({ path: '.env.test', override: true });

const envResult = envSchema.parse(process.env);

let redis: RedisClient;

function generateUniqueDatabaseURL(schemaId: string) {
  if (!envResult.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(envResult.DATABASE_URL);
  url.searchParams.set('schema', schemaId);
  url.searchParams.set('connect_timeout', '1000');

  return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseUrl;

  try {
    execSync('bun --env-file .env drizzle-kit push --force', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: databaseUrl },
    });
  } catch (error) {
    console.error('Failed to push database schema:', error);
    throw error;
  }

  const redisUrl = `redis://${envResult.REDIS_PASSWORD ? `:${envResult.REDIS_PASSWORD}@` : ''}${envResult.REDIS_HOST}:${Number(envResult.REDIS_PORT) || 6379}/${Number(envResult.REDIS_DB) || 1}`;
  redis = new RedisClient(redisUrl);
});

afterEach(async () => {
  if (redis) {
    await redis.send('flushdb', []);
  }
});

afterAll(async () => {
  await drizzleDb.execute(
    sql.raw(`drop schema if exists "${schemaId}" cascade`)
  );

  if (redis) {
    await redis.send('flushdb', []);
    redis.close();
  }
});
