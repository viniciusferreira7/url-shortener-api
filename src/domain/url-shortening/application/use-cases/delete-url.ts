import { type Either, left, right } from '@/core/either';
import type { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';

interface DeleteUrlRequest {
  authorId: string;
  urlId: string;
}

type DeleteUrlResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    url: Url;
  }
>;

export class DeleteUrlUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  public async execute({
    authorId,
    urlId,
  }: DeleteUrlRequest): Promise<DeleteUrlResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const url = await this.urlsRepository.findById(urlId);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    await this.urlsRepository.delete(urlId);

    return right({ url });
  }
}
