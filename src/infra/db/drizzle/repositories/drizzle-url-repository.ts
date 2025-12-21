import type { Pagination } from '@/core/entities/value-object/pagination';
import type {
  FindManyByAuthorIdParams,
  FindManyParams,
  FindManyWhereIsPublicParams,
  UrlsRepository,
} from '@/domain/url-shortening/application/repositories/urls-repository';
import type { Url } from '@/domain/url-shortening/enterprise/entities/url';
import type { UrlWithAuthor } from '@/domain/url-shortening/enterprise/entities/value-object/url-with-author';
import type { drizzleDb } from '../client';

export class DrizzleUrlsRepository implements UrlsRepository {
  constructor(private readonly db: typeof drizzleDb) {}
  create(url: Url): Promise<Url> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }
  findByCode(code: string): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }
  save(url: Url): Promise<Url> {
    throw new Error('Method not implemented.');
  }
  delete(urlId: string): Promise<Url | null> {
    throw new Error('Method not implemented.');
  }
  findMany(params: FindManyParams): Promise<Pagination<Url>> {
    throw new Error('Method not implemented.');
  }
  findManyWhereIsPublic(
    params: FindManyWhereIsPublicParams
  ): Promise<Pagination<UrlWithAuthor>> {
    throw new Error('Method not implemented.');
  }
  findManyByAuthorId(
    params: FindManyByAuthorIdParams
  ): Promise<Pagination<Url>> {
    throw new Error('Method not implemented.');
  }
  findManyByIds(ids: string[]): Promise<Array<UrlWithAuthor>> {
    throw new Error('Method not implemented.');
  }
  findManyByMostLiked(limit: number): Promise<Array<UrlWithAuthor>> {
    throw new Error('Method not implemented.');
  }
}
