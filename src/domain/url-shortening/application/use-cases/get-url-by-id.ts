import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { UrlsRepository } from '../repositories/urls-repository';

interface GetUrlByIdUseCaseRequest {
  urlId: string;
}

type GetUrlByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    url: Url;
  }
>;

export class GetUrlByIdUseCase {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  public async execute({
    urlId,
  }: GetUrlByIdUseCaseRequest): Promise<GetUrlByIdUseCaseResponse> {
    const url = await this.urlsRepository.findById(urlId);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    return right({ url });
  }
}
