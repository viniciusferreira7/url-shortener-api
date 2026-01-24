import { sql } from 'drizzle-orm';
import { drizzleDb } from '@/infra/db/drizzle/client';
import { redisClient } from '@/infra/db/redis/client';
import type { SystemHealthRepository } from '@/system/application/repositories/system-health-repository';

export class InfraSystemHealthRepository implements SystemHealthRepository {
  constructor(
    private readonly db = drizzleDb,
    private readonly redis = redisClient
  ) {}

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      const result = await this.db.execute(sql`SELECT 1`);
      return !!result;
    } catch {
      return false;
    }
  }

  async checkCacheConnection(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}
