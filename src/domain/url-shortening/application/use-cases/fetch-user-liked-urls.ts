import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';

interface FetchUserLikedUrlsUseCaseRequest {
  userId: string;
}

type FetchUserLikedUrlsUseCaseResponse = Either<
  ResourceNotFoundError,
  Array<UrlWithAuthor>
>;

export class FetchUserLikedUrlsUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  async execute({
    userId,
  }: FetchUserLikedUrlsUseCaseRequest): Promise<FetchUserLikedUrlsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const likedUrls = await this.urlsRepository.findManyLikedByUserId(
      user.id.toString()
    );

    return right(likedUrls);
  }
}
