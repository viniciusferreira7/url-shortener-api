import { and, eq } from 'drizzle-orm';
import type { UsersRepository } from '@/domain/url-shortening/application/repositories/users-repository';
import { UrlsLikedList } from '@/domain/url-shortening/enterprise/entities/urls-liked-list';
import type { User } from '@/domain/url-shortening/enterprise/entities/user';
import type { drizzleDb } from '../client';
import { DrizzleUrlMapper } from '../mappers/drizzle-url-mapper';
import { DrizzleUserMapper } from '../mappers/drizzle-user-mapper';
import { schema } from '../schema';

export class DrizzleUsersRepository implements UsersRepository {
  constructor(private readonly db: typeof drizzleDb) {}

  async findByEmail(email: string): Promise<User | null> {
    const [userRaw] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email));

    if (!userRaw) return null;

    const likedUrls = await this.db
      .select({ urls: schema.urls })
      .from(schema.userUrlLikes)
      .innerJoin(schema.urls, eq(schema.userUrlLikes.urlId, schema.urls.id))
      .where(eq(schema.userUrlLikes.userId, userRaw.id));

    const urlsLikedList = new UrlsLikedList(
      likedUrls.map((row) => DrizzleUrlMapper.toDomain(row.urls))
    );

    return DrizzleUserMapper.toDomain(userRaw, urlsLikedList);
  }

  async findById(id: string): Promise<User | null> {
    const [userResult, likedUrls] = await Promise.all([
      this.db.select().from(schema.users).where(eq(schema.users.id, id)),
      this.db
        .select({ urls: schema.urls })
        .from(schema.userUrlLikes)
        .innerJoin(schema.urls, eq(schema.userUrlLikes.urlId, schema.urls.id))
        .where(eq(schema.userUrlLikes.userId, id)),
    ]);

    const [userRaw] = userResult;

    if (!userRaw) return null;

    const urlsLikedList = new UrlsLikedList(
      likedUrls.map((row) => DrizzleUrlMapper.toDomain(row.urls))
    );

    return DrizzleUserMapper.toDomain(userRaw, urlsLikedList);
  }

  async save(user: User): Promise<User> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(schema.users)
        .set(DrizzleUserMapper.toUpdateDrizzle(user))
        .where(eq(schema.users.id, user.id.toString()));

      const newLikes = user.urlsLikedList.getNewItems();
      const removedLikes = user.urlsLikedList.getRemovedItems();

      if (newLikes.length > 0) {
        await tx.insert(schema.userUrlLikes).values(
          newLikes.map((url) => ({
            userId: user.id.toString(),
            urlId: url.id.toString(),
          }))
        );
      }

      if (removedLikes.length > 0) {
        const deletePromises = removedLikes.map((url) =>
          tx
            .delete(schema.userUrlLikes)
            .where(
              and(
                eq(schema.userUrlLikes.userId, user.id.toString()),
                eq(schema.userUrlLikes.urlId, url.id.toString())
              )
            )
        );
        await Promise.all(deletePromises);
      }
    });

    return user;
  }
}
