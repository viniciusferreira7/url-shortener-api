import type { InferSelectModel } from 'drizzle-orm';
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { UrlWithAuthor } from '@/domain/url-shortening/enterprise/entities/value-object/url-with-author';
import type { urls, users } from '../schema';

type UrlRaw = InferSelectModel<typeof urls>;
type UserRaw = InferSelectModel<typeof users>;

export class DrizzleUrlWithAuthorMapper {
  static toDomain(
    urlRaw: UrlRaw,
    userRaw: UserRaw,
    score?: number
  ): UrlWithAuthor {
    return UrlWithAuthor.create({
      urlId: new UniqueEntityId(urlRaw.id),
      urlName: urlRaw.name,
      urlDestination: urlRaw.destinationUrl,
      urlDescription: urlRaw.description,
      urlIsPublic: urlRaw.isPublic,
      urlCode: urlRaw.code,
      authorId: new UniqueEntityId(userRaw.id),
      authorName: userRaw.name,
      score: score,
      urlLikes: urlRaw.likes,
      createdAt: urlRaw.createdAt,
      updatedAt: urlRaw.updatedAt,
    });
  }

  static fromCache(
    data: ReturnType<typeof DrizzleUrlWithAuthorMapper.toDrizzle>
  ): UrlWithAuthor {
    return UrlWithAuthor.create({
      urlId: new UniqueEntityId(data.url.id),
      urlName: data.url.name,
      urlDestination: data.url.destinationUrl,
      urlDescription: data.url.description,
      urlIsPublic: data.url.isPublic,
      urlCode: data.url.code,
      authorId: new UniqueEntityId(data.user.id),
      authorName: data.user.name,
      score: data.score,
      urlLikes: data.url.likes,
      createdAt: data.url.createdAt,
      updatedAt: data.url.updatedAt,
    });
  }
  static toDrizzle(urlWithAuthor: UrlWithAuthor): {
    url: UrlRaw;
    user: Partial<UserRaw> & Pick<UserRaw, 'id' | 'name'>;
    score: number;
  } {
    return {
      url: {
        id: urlWithAuthor.urlId.toString(),
        name: urlWithAuthor.urlName,
        destinationUrl: urlWithAuthor.urlDestination,
        code: urlWithAuthor.urlCode,
        isPublic: urlWithAuthor.urlIsPublic,
        description: urlWithAuthor.urlDescription ?? null,
        authorId: urlWithAuthor.authorId.toString(),
        likes: urlWithAuthor.urlLikes,
        score: urlWithAuthor.score ?? 0,
        createdAt: urlWithAuthor.createdAt,
        updatedAt: urlWithAuthor.updatedAt ?? null,
      },
      user: {
        id: urlWithAuthor.authorId.toString(),
        name: urlWithAuthor.authorName,
      },
      score: urlWithAuthor.score ?? 0,
    };
  }
}
