import type Redis from 'ioredis';
import type { AnalysisRepository } from '@/domain/url-shortening/application/repositories/analysis-repository';
import { redisClient } from '../client';

export class RedisAnalysisRepository implements AnalysisRepository {
  constructor(private readonly redis: Redis) {
    this.redis = redisClient;
  }
  getCurrentId(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  increaseId(): Promise<number> {
    throw new Error('Method not implemented.');
  }
  get<T>(key: string): Promise<T | null> {
    throw new Error('Method not implemented.');
  }
  set<T>(key: string, value: T, ttl?: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  incrementBy(key: string, id: string, amount: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getUrlRanking(limit: number): Promise<(string | number)[]> {
    throw new Error('Method not implemented.');
  }
  delete(key: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
