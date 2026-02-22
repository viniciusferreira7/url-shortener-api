import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UrlAlreadyLikedError } from '../../errors/url-already-liked-error';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';

interface LikeUrlUseCaseRequest {
  urlId: string;
  authorId: string;
}

type LikeUrlUseCaseResponse = Either<
  ResourceNotFoundError | UrlAlreadyLikedError | NotAllowedError,
  {
    urlLikes: number;
  }
>;

export class LikeUrlUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  public async execute({
    urlId,
    authorId,
  }: LikeUrlUseCaseRequest): Promise<LikeUrlUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);
    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const url = await this.urlsRepository.findById(urlId);
    if (!url) {
      return left(new ResourceNotFoundError());
    }

    if (!url.isPublic) {
      return left(new NotAllowedError());
    }

    const alreadyLiked = user.urlsLikedList.currentItems.some((likedUrl) =>
      likedUrl.equals(url)
    );

    if (alreadyLiked) {
      return left(new UrlAlreadyLikedError());
    }

    user.urlsLikedList.add(url);

    const newLikesCount = url.likes + 1;
    url.likes = newLikesCount;

    await this.usersRepository.save(user);
    await this.urlsRepository.save(url);

    return right({
      urlLikes: newLikesCount,
    });
  }
}
