import { type Either, right } from '@/core/either';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';
import type { UrlsRepository } from '../repositories/urls-repository';

interface GetRankingByMostLikedRequest {
	limit?: number;
}

export type GetRankingByMostLikedResponse = Either<
	null,
	{
		ranking: UrlWithAuthor[];
	}
>;

export class GetRankingByMostLikedUseCase {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	public async execute({
		limit = 10,
	}: GetRankingByMostLikedRequest = {}): Promise<GetRankingByMostLikedResponse> {
		const result = await this.urlsRepository.findManyByMostLiked(limit);

		return right({ ranking: result });
	}
}
