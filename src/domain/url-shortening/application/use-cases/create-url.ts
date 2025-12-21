import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Url } from '../../enterprise/entities/url';
import type { AuthorsRepository } from '../repositories/authors-repository';
import type { CacheRepository } from '../repositories/cache-repository';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UrlCodeGenerator } from '../url-code/url-code-generator';

interface CreateUrlUseCaseRequest {
  authorId: string;
  name: string;
  destinationUrl: string;
  isPublic: boolean;
  description?: string | null;
}

type CreateUrlUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    url: Url;
  }
>;

export class CreateUrlUseCase {
  constructor(
    private readonly authorsRepository: AuthorsRepository,
    private readonly urlsRepository: UrlsRepository,
    private readonly cacheRepository: CacheRepository,
    private readonly urlCodeGenerator: UrlCodeGenerator
  ) {}
  public async execute({
    authorId,
    ...urlData
  }: CreateUrlUseCaseRequest): Promise<CreateUrlUseCaseResponse> {
    const author = await this.authorsRepository.findById(authorId);

    if (!author) {
      return left(new ResourceNotFoundError());
    }

    const nextId = await this.cacheRepository.increaseId();

    const codeCreated = this.urlCodeGenerator.encode(nextId);

    const url = Url.create({
      authorId: author.id,
      code: codeCreated,
      name: urlData.name,
      destinationUrl: urlData.destinationUrl,
      description: urlData.description,
      isPublic: urlData.isPublic,
      createdAt: new Date(),
      likes: 0,
    });

    await this.urlsRepository.create(url);

    return right({ url });
  }
}
