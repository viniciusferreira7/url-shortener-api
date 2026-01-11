import { FetchManyPublicUrlsUseCase } from '@/domain/url-shortening/application/use-cases/fetch-many-public-urls';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-url-repository';
import { RedisAnalysisRepository } from '../db/redisClient/repositories/redisClient-analysis-repostitory';
import { redisClient } from '../db/redisClient/client';
import { env } from '../env';

export function makeFetchManyPublicUrlsUseCase(): FetchManyPublicUrlsUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const urlsRepository = new DrizzleUrlsRepository(drizzleDb, analysisRepository);

  return new FetchManyPublicUrlsUseCase(urlsRepository);
}
