import { UpdateUrlUseCase } from '@/domain/url-shortening/application/use-cases/update-url';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-url-repository';
import { DrizzleUsersRepository } from '../db/drizzle/repositories/drizzle-users-repository';
import { RedisAnalysisRepository } from '../db/redisClient/repositories/redisClient-analysis-repostitory';
import { redisClient } from '../db/redisClient/client';
import { env } from '../env';

export function makeUpdateUrlUseCase(): UpdateUrlUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const usersRepository = new DrizzleUsersRepository(drizzleDb);
  const urlsRepository = new DrizzleUrlsRepository(drizzleDb, analysisRepository);

  return new UpdateUrlUseCase(usersRepository, urlsRepository);
}
