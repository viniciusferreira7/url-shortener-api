import type Redis from 'ioredis';
import type { AnalysisRepository } from '@/domain/url-shortening/application/repositories/analysis-repository';
import { env } from '@/infra/env';
import { redisClient } from '../client';

export class RedisAnalysisRepository implements AnalysisRepository {
  constructor(
    private readonly redis: Redis,
    private readonly envService: typeof env
  ) {
    this.redis = redisClient;
    this.envService = env;
  }
  async getCurrentId(): Promise<number> {
    const defaultId = this.envService.REDIS_CODE_ID;

    await this.redis.set('code_id', defaultId, 'NX');

    const codeId = await this.redis.get('code_id');

    const id = Number(codeId);

    if (Number.isNaN(id)) {
      throw new Error('Invalid code_id value in Redis');
    }

    return id;
  }

  async increaseId(): Promise<number> {
    const defaultId = this.envService.REDIS_CODE_ID;

    await this.redis.set('code_id', defaultId, 'NX');

    const codeId = await this.redis.incr('code_id');

    const id = Number(codeId);

    if (Number.isNaN(id)) {
      throw new Error('Invalid code_id value in Redis');
    }

    return id;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = await this.redis.get(key);

    if (!entry) return null;

    return JSON.parse(entry) as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const serialized = JSON.stringify(value);

    await this.redis.set(key, serialized);

    if (ttl) {
      await this.redis.expire(key, ttl);
    }
  }

  async incrementBy(key: string, id: string, amount: number): Promise<void> {
    await this.redis.zincrby(key, amount, id);
  }

  async getUrlRanking(limit: number): Promise<(string | number)[]> {
    const score = await this.redis.zrange(
      'url-ranking',
      1,
      limit,
      'WITHSCORES'
    );

    return score;
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
