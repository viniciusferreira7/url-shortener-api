import { type Either, right } from '@/core/either';
import type { Pagination } from '@/core/entities/value-object/pagination';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';
import type { CacheRepository } from '../repositories/cache-repository';
import type {
	FindManyWhereIsPublicParams,
	UrlsRepository,
} from '../repositories/urls-repository';

interface FindManyPublicUrlsRequest {
	search?: string;
	page?: number;
	perPage?: number;
	order?: FindManyWhereIsPublicParams['order'];
	createdAtGte?: Date;
	updatedAtGte?: Date;
}

type FetchManyPublicUrlsResponse = Either<null, Pagination<UrlWithAuthor>>;

export class FetchManyPublicUrlsUseCase {
	private fetchCount: number = 0;

	constructor(
		private readonly urlsRepository: UrlsRepository,
		private readonly cacheRepository: CacheRepository
	) {}

	private generateCacheKey(params: FindManyPublicUrlsRequest): string {
		return `public-urls:${params.search ?? ''}-${params.page ?? 1}-${params.perPage ?? 10}-${params.order ?? ''}-${params.createdAtGte?.toISOString() ?? ''}-${params.updatedAtGte?.toISOString() ?? ''}`;
	}

	public async execute(
		params: FindManyPublicUrlsRequest
	): Promise<FetchManyPublicUrlsResponse> {
		const cacheKey = this.generateCacheKey(params);

		const cachedData =
			await this.cacheRepository.get<Pagination<UrlWithAuthor>>(cacheKey);
		if (cachedData) {
			return right(cachedData);
		}

		const result = await this.urlsRepository.findManyWhereIsPublic({
			page: params.page ?? 1,
			perPage: params.perPage ?? 10,
			search: params.search,
			order: params.order,
			createdAtGte: params.createdAtGte,
			updatedAtGte: params.updatedAtGte,
		});

		await this.cacheRepository.set(cacheKey, result);

		this.fetchCount += 1;

		return right(result);
	}

	public async invalidateCache(): Promise<void> {
		await this.cacheRepository.clear();
	}

	public getFetchCount(): number {
		return this.fetchCount;
	}

	public resetFetchCount(): void {
		this.fetchCount = 0;
	}
}
