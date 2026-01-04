import type { InferSelectModel } from 'drizzle-orm';
import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { UrlsLikedList } from '@/domain/url-shortening/enterprise/entities/urls-liked-list';
import { User } from '@/domain/url-shortening/enterprise/entities/user';
import type { users } from '../schema';

type UserRaw = InferSelectModel<typeof users>;

export class DrizzleUserMapper {
  static toDomain(userRaw: UserRaw, likedUrls?: UrlsLikedList): User {
    return User.create(
      {
        name: userRaw.name,
        email: userRaw.email,
        password: '',
        createdAt: userRaw.createdAt,
        updatedAt: userRaw.updatedAt,
        urlsLiked: likedUrls ?? new UrlsLikedList(),
      },
      new UniqueEntityId(userRaw.id)
    );
  }

  static toUpdateDrizzle(user: User) {
    return {
      name: user.name,
      email: user.email,
      updatedAt: new Date(),
    };
  }
}
