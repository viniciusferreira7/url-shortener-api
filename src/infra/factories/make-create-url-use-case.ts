import { CreateUrlUseCase } from '@/domain/url-shortening/application/use-cases/create-url';
import { drizzleDb } from '../db/drizzle/client';
import { DrizzleUrlsRepository } from '../db/drizzle/repositories/drizzle-url-repository';
import { DrizzleUsersRepository } from '../db/drizzle/repositories/drizzle-users-repository';
import { redisClient } from '../db/redis/client';
import { RedisAnalysisRepository } from '../db/redis/repositories/redis-analysis-repostitory';
import { env } from '../env';
import { Base62UrlCodeGenerator } from '../url-code/base62-url-code-generator';

export function makeCreateUrlUseCase(): CreateUrlUseCase {
  const analysisRepository = new RedisAnalysisRepository(redisClient, env);
  const usersRepository = new DrizzleUsersRepository(drizzleDb);
  const urlsRepository = new DrizzleUrlsRepository(
    drizzleDb,
    analysisRepository
  );
  const urlCodeGenerator = new Base62UrlCodeGenerator();

  return new CreateUrlUseCase(
    usersRepository,
    urlsRepository,
    analysisRepository,
    urlCodeGenerator
  );
}
