import { type Either, left, right } from '@/core/either';
import type { Pagination } from '@/core/entities/value-object/pagination';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type {
  FindManyByAuthorIdParams,
  UrlsRepository,
} from '../repositories/urls-repository';
import type { UsersRepository } from '../repositories/users-repository';

interface FetchUserUrlsUseCaseRequest {
  authorId: string;
  params?: Omit<FindManyByAuthorIdParams, 'authorId'>;
}

type FetchUserUrlsUseCaseResponse = Either<
  ResourceNotFoundError,
  Pagination<Url>
>;

export class FetchUserUrlsUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly urlsRepository: UrlsRepository
  ) {}

  async execute({
    authorId,
    params,
  }: FetchUserUrlsUseCaseRequest): Promise<FetchUserUrlsUseCaseResponse> {
    const user = await this.usersRepository.findById(authorId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const urls = await this.urlsRepository.findManyByAuthorId({
      authorId: user.id.toString(),
      page: params?.page ?? 1,
      perPage: params?.perPage ?? 10,
      search: params?.search,
      isPublic: params?.isPublic,
      createdAtGte: params?.createdAtGte,
      updatedAtGte: params?.updatedAtGte,
      order: params?.order,
    });

    return right(urls);
  }
}
