import * as dotenv from 'dotenv';

dotenv.config({ path: '.env', override: true });

dotenv.config({ path: '.env.test', override: true });

import { afterAll, beforeAll } from 'bun:test';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { afterEach } from 'node:test';
import { RedisClient } from 'bun';
import { sql } from 'drizzle-orm';
import { drizzleDb } from './db/drizzle/client';
import { envSchema } from './env';

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

  execSync('bun db:push');

  const redisUrl = `redis://${envResult.REDIS_PASSWORD ? `:${envResult.REDIS_PASSWORD}@` : ''}${envResult.REDIS_HOST}:${Number(envResult.REDIS_PORT) || 6379}/${Number(envResult.REDIS_DB) || 1}`;
  redis = new RedisClient(redisUrl);
});

afterEach(async () => {
  if (redis) {
    await redis.send('FLUSHDB', []);
  }
});

afterAll(async () => {
  await drizzleDb.execute(sql`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

  if (redis) {
    await redis.send('FLUSHDB', []);
    redis.close();
  }
});
