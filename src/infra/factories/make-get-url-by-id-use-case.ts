import { GetUrlByIdUseCase } from '@/domain/url-shortening/application/use-cases/get-url-by-id';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-url-repository';
import { RedisAnalysisRepository } from '../db/redis/repositories/redis-analysis-repostitory';
import { redisClient } from '../db/redis/client';
import { env } from '../env';

export function makeGetUrlByIdUseCase(): GetUrlByIdUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const urlsRepository = new DrizzleUrlsRepository(drizzleDb, analysisRepository);

  return new GetUrlByIdUseCase(urlsRepository);
}
