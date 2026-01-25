import type { SecondaryStorageRepository } from '@/infra/storage/secondary-storage-repository';
import { redisClient } from '../client';

export class RedisSecondaryStorageRepository
  implements SecondaryStorageRepository
{
  constructor(private readonly redis = redisClient) {}

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }
  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
