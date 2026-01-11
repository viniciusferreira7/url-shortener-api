import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { AnalysisRepository } from '../repositories/analysis-repository';
import type { UrlsRepository } from '../repositories/urls-repository';

interface GetUrlByCodeUseCaseRequest {
  code: string;
}

type GetUrlByCodeUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    url: Url;
  }
>;

export class GetUrlByCodeUseCase {
  constructor(
    private readonly urlsRepository: UrlsRepository,
    private readonly analysisRepository: AnalysisRepository
  ) {}

  public async execute({
    code,
  }: GetUrlByCodeUseCaseRequest): Promise<GetUrlByCodeUseCaseResponse> {
    const url = await this.urlsRepository.findByCode(code);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    const analysisKey = 'url-ranking';

    await this.analysisRepository.incrementBy(
      analysisKey,
      url.id.toString(),
      1
    );

    return right({ url });
  }
}
