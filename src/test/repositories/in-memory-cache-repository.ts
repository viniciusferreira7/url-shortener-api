import type { CacheRepository } from '@/domain/url-shortening/application/repositories/cache-repository';

interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
}

export class InMemoryCacheRepository implements CacheRepository {
  private currentId: number = 0;
  private cache: Map<string, CacheEntry<unknown>> = new Map();

  async getCurrentId(): Promise<number> {
    return this.currentId;
  }

  async increaseId(): Promise<number> {
    this.currentId += 1;
    return this.currentId;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiresAt = ttl ? Date.now() + ttl : undefined;

    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  async incrementBy(key: string, id: string, amount: number): Promise<void> {
    const entry = this.cache.get(key);
    const currentValue = entry
      ? ((entry.value as Record<string, number>)[id] ?? 0)
      : 0;

    const cacheData = (entry?.value as Record<string, number>) || {};
    cacheData[id] = currentValue + amount;

    await this.set(
      key,
      cacheData as unknown,
      entry?.expiresAt ? entry.expiresAt - Date.now() : undefined
    );
  }

  async getUrlRanking(limit: number): Promise<Array<string | number>> {
    const entry = this.cache.get('url-ranking');

    if (!entry) {
      return [];
    }

    const ranking = entry.value as Record<string, number>;

    const sortedEntries = Object.entries(ranking)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, limit);

    const result: Array<string | number> = [];
    for (const [id, score] of sortedEntries) {
      result.push(id, score);
    }

    return result;
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}
