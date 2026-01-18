import { RedisClient } from 'bun';
import { env } from '@/infra/env';

const redisUrl = `redis://${env.REDIS_PASSWORD ? `:${env.REDIS_PASSWORD}@` : ''}${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DB}`;

export const redisClient = new RedisClient(redisUrl);
