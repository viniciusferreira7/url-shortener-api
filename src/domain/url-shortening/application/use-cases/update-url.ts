import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { AuthorsRepository } from '../repositories/authors-repository';
import type { UrlsRepository } from '../repositories/urls-repository';

interface UpdateUrlUseCaseRequest {
  urlId: string;
  authorId: string;
  name?: string;
  value?: string;
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
    private readonly authorsRepository: AuthorsRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  public async execute({
    urlId,
    authorId,
    ...updateData
  }: UpdateUrlUseCaseRequest): Promise<UpdateUrlUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    const url = await this.urlsRepository.findById(urlId);

    if (!url) {
      return left(new ResourceNotFoundError());
    }

    if (!url.authorId.equals(author.id)) {
      return left(new NotAllowedError());
    }

    if (updateData.name) {
      url.name = updateData.name;
    }

    if (updateData.value) {
      url.value = updateData.value;
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
