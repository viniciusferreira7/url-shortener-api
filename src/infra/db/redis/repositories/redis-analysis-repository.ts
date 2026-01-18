import type { RedisClient } from 'bun';
import type { AnalysisRepository } from '@/domain/url-shortening/application/repositories/analysis-repository';
import { env } from '@/infra/env';
import { redisClient } from '../client';

export class RedisAnalysisRepository implements AnalysisRepository {
  constructor(
    private readonly redis: RedisClient,
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

  async incrementBy(key: string, id: string, amount: number): Promise<void> {
    await this.redis.send('ZINCRBY', [key, amount.toString(), id]);
  }

  async getUrlRanking(limit: number): Promise<(string | number)[]> {
    const score = await this.redis.send('ZRANGE', [
      'url-ranking',
      '1',
      limit.toString(),
      'WITHSCORES'
    ]);

    return score;
  }
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
