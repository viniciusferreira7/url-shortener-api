import { GetRankingUseCase } from '@/domain/url-shortening/application/use-cases/get-ranking';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-url-repository';
import { redisClient } from '../db/redis/client';
import { RedisAnalysisRepository } from '../db/redis/repositories/redis-analysis-repostitory';
import { env } from '../env';

export function makeGetRankingUseCase(): GetRankingUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const urlsRepository = new DrizzleUrlsRepository(
    drizzleDb,
    analysisRepository
  );

  return new GetRankingUseCase(urlsRepository, analysisRepository);
}
