import { type Either, right } from '@/core/either';
import type { Pagination } from '@/core/entities/value-object/pagination';
import type { UrlWithAuthor } from '../../enterprise/entities/value-object/url-with-author';
import type {
  FindManyWhereIsPublicParams,
  UrlsRepository,
} from '../repositories/urls-repository';

interface FindManyPublicUrlsRequest {
  search?: string;
  page?: number;
  perPage?: number;
  order?: FindManyWhereIsPublicParams['order'];
  createdAtGte?: Date;
  updatedAtGte?: Date;
}

type FetchManyPublicUrlsResponse = Either<null, Pagination<UrlWithAuthor>>;

export class FetchManyPublicUrlsUseCase {
  constructor(private readonly urlsRepository: UrlsRepository) {}

  public async execute(
    params: FindManyPublicUrlsRequest
  ): Promise<FetchManyPublicUrlsResponse> {
    const result = await this.urlsRepository.findManyWhereIsPublic({
      page: params.page ?? 1,
      perPage: params.perPage ?? 10,
      search: params.search,
      order: params.order,
      createdAtGte: params.createdAtGte,
      updatedAtGte: params.updatedAtGte,
      isPublic: true,
    });

    return right(result);
  }
}
