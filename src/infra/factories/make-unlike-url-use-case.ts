import { UnlikeUrlUseCase } from '@/domain/url-shortening/application/use-cases/unlike-url';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-url-repository';
import { DrizzleUsersRepository } from '../db/drizzle/repositories/drizzle-users-repository';
import { redisClient } from '../db/redis/client';
import { RedisAnalysisRepository } from '../db/redis/repositories/redis-analysis-repository';
import { env } from '../env';

export function makeUnlikeUrlUseCase(): UnlikeUrlUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const usersRepository = new DrizzleUsersRepository(drizzleDb);
  const urlsRepository = new DrizzleUrlsRepository(
    drizzleDb,
    analysisRepository
  );

  return new UnlikeUrlUseCase(usersRepository, urlsRepository);
}
