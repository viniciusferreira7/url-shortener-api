import type { CacheRepository } from '@/domain/url-shortening/application/repositories/cache-repository';

export class InMemoryCacheRepository implements CacheRepository {
	private currentId: number = 0;

	async getCurrentId(): Promise<number> {
		return this.currentId;
	}

	async increaseId(): Promise<number> {
		this.currentId += 1;
		return this.currentId;
	}
}
