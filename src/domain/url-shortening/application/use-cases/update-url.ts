import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';

interface UpdateUrlUseCaseRequest {
  urlId: string;
  authorId: string;
  name?: string;
  destinationUrl?: string;
  description?: string | null;
  isPublic?: boolean;
}

type UpdateUrlUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    url: Url;
  }
>;

export class UpdateUrlUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  public async execute({
    urlId,
    authorId,
    ...updateData
  }: UpdateUrlUseCaseRequest): Promise<UpdateUrlUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const url = await this.urlsRepository.findById(urlId);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    if (!url.authorId.equals(user.id)) {
      return left(new NotAllowedError());
    }

    if (updateData.name) {
      url.name = updateData.name;
    }

    if (updateData.destinationUrl) {
      url.destinationUrl = updateData.destinationUrl;
    }

    if (updateData.description !== undefined) {
      url.description = updateData.description;
    }

    if (updateData.isPublic !== undefined) {
      url.isPublic = updateData.isPublic;
    }

    url.updatedAt = new Date();

    await this.urlsRepository.save(url);

    return right({ url });
  }
}
