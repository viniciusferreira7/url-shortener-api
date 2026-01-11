import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { Url } from '../../enterprise/entities/url';
import type { AnalysisRepository } from '../repositories/analysis-repository';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';
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
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository,
    private readonly analysisRepository: AnalysisRepository,
    private readonly urlCodeGenerator: UrlCodeGenerator
  ) {}
  public async execute({
    authorId,
    ...urlData
  }: CreateUrlUseCaseRequest): Promise<CreateUrlUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const nextId = await this.analysisRepository.increaseId();

    const codeCreated = this.urlCodeGenerator.encode(nextId);

    const url = Url.create({
      authorId: user.id,
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
