import { FetchManyPublicUrlsUseCase } from '@/domain/url-shortening/application/use-cases/fetch-many-public-urls';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-urls-repository';
import { redisClient } from '../db/redis/client';
import { RedisAnalysisRepository } from '../db/redis/repositories/redis-analysis-repository';
import { RedisCacheRepository } from '../db/redis/repositories/redis-cache-repository';
import { env } from '../env';

export function makeFetchManyPublicUrlsUseCase(): FetchManyPublicUrlsUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const cacheRepository = new RedisCacheRepository();
  const urlsRepository = new DrizzleUrlsRepository(
    drizzleDb,
    analysisRepository,
    cacheRepository
  );

  return new FetchManyPublicUrlsUseCase(urlsRepository);
}
