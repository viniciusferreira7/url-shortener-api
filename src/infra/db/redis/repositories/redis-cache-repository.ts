import type { CacheRepository } from '@/infra/cache/cache-repository';
import { redisClient } from '../client';

export class RedisCacheRepository implements CacheRepository {
  constructor(private readonly redis = redisClient) {}

  async set(key: string, value: string): Promise<void> {
    const FIFTEEN_MINUTES_TTL = 60 * 15;
    await this.redis.set(key, value, 'EX', 60 * FIFTEEN_MINUTES_TTL);
  }
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
