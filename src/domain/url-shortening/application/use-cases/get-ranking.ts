import { type Either, right } from '@/core/either';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';
import type { AnalysisRepository } from '../repositories/analysis-repository';
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
    private readonly analysisRepository: AnalysisRepository
  ) {}

  public async execute(): Promise<GetRankingUseCaseResponse> {
    const urlRanking = await this.analysisRepository.getUrlRanking(10);

    const urlIds = urlRanking
      .filter((value, index) => {
        return index % 2 === 0 && typeof value === 'string';
      })
      .map(String);

    const ranking = await this.urlsRepository.findManyByIds(urlIds, urlRanking);

    return right({ ranking });
  }
}
