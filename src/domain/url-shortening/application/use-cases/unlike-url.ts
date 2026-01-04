import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';

interface UnlikeUrlUseCaseRequest {
  urlId: string;
  authorId: string;
}

type UnlikeUrlUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    urlLikes: number;
  }
>;

export class UnlikeUrlUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  public async execute({
    urlId,
    authorId,
  }: UnlikeUrlUseCaseRequest): Promise<UnlikeUrlUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);
    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const url = await this.urlsRepository.findById(urlId);
    if (!url) {
      return left(new ResourceNotFoundError());
    }

    user.urlsLikedList.remove(url);

    const newLikesCount = Math.max(0, url.likes - 1);
    url.likes = newLikesCount;

    await this.usersRepository.save(user);
    await this.urlsRepository.save(url);

    return right({
      urlLikes: newLikesCount,
    });
  }
}
