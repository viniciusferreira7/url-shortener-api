import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { CacheRepository } from '../repositories/cache-repository';
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
    private readonly cacheRepository: CacheRepository
  ) {}

  public async execute({
    code,
  }: GetUrlByCodeUseCaseRequest): Promise<GetUrlByCodeUseCaseResponse> {
    const url = await this.urlsRepository.findByCode(code);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    const cacheKey = 'url-ranking';

    await this.cacheRepository.incrementBy(cacheKey, url.id.toString(), 1);

    return right({ url });
  }
}
