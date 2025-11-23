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

	async delete(key: string): Promise<void> {
		this.cache.delete(key);
	}

	async clear(): Promise<void> {
		this.cache.clear();
	}
}
