import { and, asc, desc, eq, gte, ilike, inArray, or, sql } from 'drizzle-orm';
import { Pagination } from '@/core/entities/value-object/pagination';
import type { CacheRepository } from '@/domain/url-shortening/application/repositories/cache-repository';
import type {
  FindManyByAuthorIdParams,
  FindManyParams,
  FindManyWhereIsPublicParams,
  UrlsRepository,
} from '@/domain/url-shortening/application/repositories/urls-repository';
import type { Url } from '@/domain/url-shortening/enterprise/entities/url';
import type { UrlWithAuthor } from '@/domain/url-shortening/enterprise/entities/value-object/url-with-author';
import type { drizzleDb } from '../client';
import { DrizzleUrlMapper } from '../mappers/drizzle-url-mapper';
import { DrizzleUrlWithAuthorMapper } from '../mappers/drizzle-url-with-author-mapper copy';
import { schema } from '../schema';

export class DrizzleUrlsRepository implements UrlsRepository {
  constructor(
    private readonly db: typeof drizzleDb,
    private readonly cacheRepository: CacheRepository
  ) {}
  async create(url: Url): Promise<Url> {
    const [urlRaw] = await this.db
      .insert(schema.urls)
      .values(DrizzleUrlMapper.toDrizzle(url))
      .returning();

    return DrizzleUrlMapper.toDomain(urlRaw);
  }
  async findById(id: string): Promise<Url | null> {
    const [urlRaw] = await this.db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.id, id));

    if (!urlRaw) return null;

    return DrizzleUrlMapper.toDomain(urlRaw);
  }
  async findByCode(code: string): Promise<Url | null> {
    const [urlRaw] = await this.db
      .select()
      .from(schema.urls)
      .where(eq(schema.urls.code, code));

    if (!urlRaw) return null;

    return DrizzleUrlMapper.toDomain(urlRaw);
  }
  async save(url: Url): Promise<Url> {
    const [urlRaw] = await this.db
      .update(schema.urls)
      .set(DrizzleUrlMapper.toDrizzle(url))
      .returning();

    return DrizzleUrlMapper.toDomain(urlRaw);
  }
  async delete(urlId: string): Promise<Url | null> {
    const [urlRaw] = await this.db
      .delete(schema.urls)
      .where(eq(schema.urls.id, urlId))
      .returning();

    if (!urlRaw) return null;

    return DrizzleUrlMapper.toDomain(urlRaw);
  }
  async findMany(params: FindManyParams): Promise<Pagination<Url>> {
    const filters = [];

    const order = [];

    if (params?.search) {
      filters.push(
        or(
          ilike(schema.urls.name, params?.search),
          ilike(schema.urls.description, params?.search),
          ilike(schema.urls.destinationUrl, params?.search)
        )
      );
    }
    if (params?.isPublic !== undefined) {
      filters.push(eq(schema.urls.isPublic, params.isPublic));
    }
    if (params?.createdAtGte) {
      filters.push(gte(schema.urls.createdAt, params.createdAtGte));
    }
    if (params?.updatedAtGte) {
      filters.push(gte(schema.urls.updatedAt, params.updatedAtGte));
    }
    if (params?.order) {
      const isDesc = params.order.startsWith('-');
      const key = isDesc ? params.order.slice(1) : params.order;

      const columnMap = {
        title: schema.urls.name,
        description: schema.urls.description,
        destinationUrl: schema.urls.destinationUrl,
        isPublic: schema.urls.isPublic,
        created_at: schema.urls.createdAt,
        updated_at: schema.urls.updatedAt,
      } as const;

      const column = columnMap[key as keyof typeof columnMap];

      order.push(isDesc ? desc(column) : asc(column));
    }

    const perPage = params?.perPage ?? 10;
    const page = params?.page ?? 1;

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    order.push(asc(schema.urls.id));

    const [{ total }, urlsPaginated] = await Promise.all([
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.urls)
        .where(whereClause)
        .then((rows) => rows[0]),
      this.db
        .select()
        .from(schema.urls)
        .where(whereClause)
        .orderBy(...order)
        .limit(perPage)
        .offset((page - 1) * perPage),
    ]);

    return Pagination.create({
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      result: urlsPaginated.map(DrizzleUrlMapper.toDomain),
    });
  }

  async findManyWhereIsPublic(
    params: FindManyWhereIsPublicParams
  ): Promise<Pagination<UrlWithAuthor>> {
    const filters = [];

    const order = [];

    if (params?.search) {
      filters.push(
        or(
          ilike(schema.urls.name, params?.search),
          ilike(schema.urls.description, params?.search),
          ilike(schema.urls.destinationUrl, params?.search)
        )
      );
    }
    if (params?.isPublic !== undefined) {
      filters.push(eq(schema.urls.isPublic, params.isPublic));
    }
    if (params?.createdAtGte) {
      filters.push(gte(schema.urls.createdAt, params.createdAtGte));
    }
    if (params?.updatedAtGte) {
      filters.push(gte(schema.urls.updatedAt, params.updatedAtGte));
    }
    if (params?.order) {
      const isDesc = params.order.startsWith('-');
      const key = isDesc ? params.order.slice(1) : params.order;

      const columnMap = {
        title: schema.urls.name,
        description: schema.urls.description,
        destinationUrl: schema.urls.destinationUrl,
        isPublic: schema.urls.isPublic,
        created_at: schema.urls.createdAt,
        updated_at: schema.urls.updatedAt,
      } as const;

      const column = columnMap[key as keyof typeof columnMap];

      order.push(isDesc ? desc(column) : asc(column));
    }

    const perPage = params?.perPage ?? 10;
    const page = params?.page ?? 1;

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    order.push(asc(schema.urls.id));

    const [{ total }, urlsPaginated, urlRanking] = await Promise.all([
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.urls)
        .where(whereClause)
        .then((rows) => rows[0]),
      this.db
        .select()
        .from(schema.urls)
        .innerJoin(schema.users, eq(schema.urls.authorId, schema.users.id))
        .where(whereClause)
        .orderBy(...order)
        .limit(perPage)
        .offset((page - 1) * perPage),
      this.cacheRepository.getUrlRanking(10),
    ]);

    return Pagination.create({
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      result: urlsPaginated.map((urlWithAuthor) => {
        const urlIdIndex = urlRanking.findIndex(
          (value, index) =>
            typeof value === 'string' &&
            index % 2 === 0 &&
            urlWithAuthor.urls.id === value
        );

        const score = Number(urlRanking[urlIdIndex + 1] ?? 0);

        return DrizzleUrlWithAuthorMapper.toDomain(
          urlWithAuthor.urls,
          urlWithAuthor.users,
          score
        );
      }),
    });
  }
  async findManyByAuthorId(
    params: FindManyByAuthorIdParams
  ): Promise<Pagination<Url>> {
    const filters = [];

    filters.push(eq(schema.urls.authorId, params.authorId));

    const order = [];

    if (params?.search) {
      filters.push(
        or(
          ilike(schema.urls.name, params?.search),
          ilike(schema.urls.description, params?.search),
          ilike(schema.urls.destinationUrl, params?.search)
        )
      );
    }
    if (params?.isPublic !== undefined) {
      filters.push(eq(schema.urls.isPublic, params.isPublic));
    }
    if (params?.createdAtGte) {
      filters.push(gte(schema.urls.createdAt, params.createdAtGte));
    }
    if (params?.updatedAtGte) {
      filters.push(gte(schema.urls.updatedAt, params.updatedAtGte));
    }
    if (params?.order) {
      const isDesc = params.order.startsWith('-');
      const key = isDesc ? params.order.slice(1) : params.order;

      const columnMap = {
        title: schema.urls.name,
        description: schema.urls.description,
        destinationUrl: schema.urls.destinationUrl,
        isPublic: schema.urls.isPublic,
        created_at: schema.urls.createdAt,
        updated_at: schema.urls.updatedAt,
      } as const;

      const column = columnMap[key as keyof typeof columnMap];

      order.push(isDesc ? desc(column) : asc(column));
    }

    const perPage = params?.perPage ?? 10;
    const page = params?.page ?? 1;

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    order.push(asc(schema.urls.id));

    const [{ total }, urlsPaginated] = await Promise.all([
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(schema.urls)
        .where(whereClause)
        .then((rows) => rows[0]),
      this.db
        .select()
        .from(schema.urls)
        .where(whereClause)
        .orderBy(...order)
        .limit(perPage)
        .offset((page - 1) * perPage),
    ]);

    return Pagination.create({
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
      result: urlsPaginated.map(DrizzleUrlMapper.toDomain),
    });
  }
  async findManyByIds(ids: string[]): Promise<Array<UrlWithAuthor>> {
    if (ids.length === 0) return [];

    const [urlsWithAuthors, urlRanking] = await Promise.all([
      this.db
        .select()
        .from(schema.urls)
        .innerJoin(schema.users, eq(schema.urls.authorId, schema.users.id))
        .where(inArray(schema.urls.id, ids)),
      this.cacheRepository.getUrlRanking(10),
    ]);

    return urlsWithAuthors.map((urlWithAuthor) => {
      const urlIdIndex = urlRanking.findIndex(
        (value, index) =>
          typeof value === 'string' &&
          index % 2 === 0 &&
          urlWithAuthor.urls.id === value
      );

      const score = Number(urlRanking[urlIdIndex + 1] ?? 0);

      return DrizzleUrlWithAuthorMapper.toDomain(
        urlWithAuthor.urls,
        urlWithAuthor.users,
        score
      );
    });
  }
  async findManyByMostLiked(limit: number): Promise<Array<UrlWithAuthor>> {
    const [urlsWithAuthors, urlRanking] = await Promise.all([
      this.db
        .select()
        .from(schema.urls)
        .innerJoin(schema.users, eq(schema.urls.authorId, schema.users.id))
        .orderBy(desc(schema.urls.likes))
        .limit(limit),
      this.cacheRepository.getUrlRanking(10),
    ]);

    return urlsWithAuthors.map((urlWithAuthor) => {
      const urlIdIndex = urlRanking.findIndex(
        (value, index) =>
          typeof value === 'string' &&
          index % 2 === 0 &&
          urlWithAuthor.urls.id === value
      );

      const score = Number(urlRanking[urlIdIndex + 1] ?? 0);

      return DrizzleUrlWithAuthorMapper.toDomain(
        urlWithAuthor.urls,
        urlWithAuthor.users,
        score
      );
    });
  }

  async findManyLikedByUserId(userId: string): Promise<Array<UrlWithAuthor>> {
    const [urlsWithAuthors, urlRanking] = await Promise.all([
      this.db
        .select({
          urls: schema.urls,
          users: schema.users,
        })
        .from(schema.userUrlLikes)
        .innerJoin(schema.urls, eq(schema.userUrlLikes.urlId, schema.urls.id))
        .innerJoin(schema.users, eq(schema.urls.authorId, schema.users.id))
        .where(eq(schema.userUrlLikes.userId, userId)),
      this.cacheRepository.getUrlRanking(10),
    ]);

    return urlsWithAuthors.map((urlWithAuthor) => {
      const urlIdIndex = urlRanking.findIndex(
        (value, index) =>
          typeof value === 'string' &&
          index % 2 === 0 &&
          urlWithAuthor.urls.id === value
      );

      const score = Number(urlRanking[urlIdIndex + 1] ?? 0);

      return DrizzleUrlWithAuthorMapper.toDomain(
        urlWithAuthor.urls,
        urlWithAuthor.users,
        score
      );
    });
  }
}
