import { type Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';
import type { CacheRepository } from '../repositories/cache-repository';
import type { UrlsRepository } from '../repositories/urls-repository';

export type GetRankingUseCaseResponse = Either<
	null,
	{
		ranking: UrlWithAuthor[];
	}
>;

export class GetRankingUseCase {
	constructor(
		private readonly urlsRepository: UrlsRepository,
		private readonly cacheRepository: CacheRepository
	) {}

	public async execute(): Promise<GetRankingUseCaseResponse> {
		const scores = await this.cacheRepository.getUrlRanking(10);

		const urlIds = scores
			.filter((value, index) => {
				return index % 2 === 0 && typeof value === 'string';
			})
			.map(String);

		const urls = await this.urlsRepository.findManyByIds(urlIds);

		const ranking = scores.reduce<UrlWithAuthor[]>((acc, current, index) => {
			const urlWithAuthor = urls.find((item) => {
				if (typeof current === 'string' && index % 2 === 0) {
					return item.urlId.equals(new UniqueEntityId(current));
				}

				return false;
			});

			const score = Number(scores[index + 1]);

			if (urlWithAuthor && Number.isFinite(score)) {
				urlWithAuthor.score = score;

				acc.push(urlWithAuthor);
			}

			return acc;
		}, []);

		return right({ ranking: ranking });
	}
}
