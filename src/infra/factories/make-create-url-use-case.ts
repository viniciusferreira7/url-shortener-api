import { CreateUrlUseCase } from '@/domain/url-shortening/application/use-cases/create-url';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-urls-repository';
import { DrizzleUsersRepository } from '../db/drizzle/repositories/drizzle-users-repository';
import { redisClient } from '../db/redis/client';
import { RedisAnalysisRepository } from '../db/redis/repositories/redis-analysis-repository';
import { RedisCacheRepository } from '../db/redis/repositories/redis-cache-repository';
import { env } from '../env';
import { HashUrlCodeGenerator } from '../url-code/hash-url-code-generator';

export function makeCreateUrlUseCase(): CreateUrlUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const cacheRepository = new RedisCacheRepository();
  const usersRepository = new DrizzleUsersRepository(drizzleDb);
  const urlsRepository = new DrizzleUrlsRepository(
    drizzleDb,
    analysisRepository,
    cacheRepository
  );
  const urlCodeGenerator = new HashUrlCodeGenerator();

  return new CreateUrlUseCase(
    usersRepository,
    urlsRepository,
    analysisRepository,
    urlCodeGenerator
  );
}
