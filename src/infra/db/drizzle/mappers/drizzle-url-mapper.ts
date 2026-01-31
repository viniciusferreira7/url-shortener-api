import type { InferSelectModel } from 'drizzle-orm';
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { Url } from '@/domain/url-shortening/enterprise/entities/url';
import type { urls } from '../schema/urls';

type UrlRaw = InferSelectModel<typeof urls>;

export class DrizzleUrlMapper {
  static toDomain(raw: UrlRaw): Url {
    return Url.create(
      {
        name: raw.name,
        destinationUrl: raw.destinationUrl,
        code: raw.code,
        isPublic: raw.isPublic,
        description: raw.description,
        authorId: new UniqueEntityId(raw.authorId),
        likes: raw.likes,
        score: raw.score,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    );
  }
  static toDrizzle(url: Url): UrlRaw {
    const data: UrlRaw = {
      id: url.id.toString(),
      name: url.name,
      destinationUrl: url.destinationUrl,
      code: url.code,
      isPublic: url.isPublic,
      description: url.description ?? null,
      authorId: url.authorId.toString(),
      likes: url.likes,
      score: url.score,
      createdAt: url.createdAt,
      updatedAt: url?.updatedAt ? url.updatedAt : null,
    };

    return data;
  }
}
