import { faker } from '@faker-js/faker';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { UrlsLikedList } from '@/domain/url-shortening/enterprise/entities/urls-liked-list';
import { User } from '@/domain/url-shortening/enterprise/entities/user';

export function makeUser(
  override: Partial<{
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt?: Date | null;
    urlsLiked?: UrlsLikedList;
  }> = {},
  id?: UniqueEntityId
) {
  const name = override?.name ?? faker.person.firstName();

  const user = User.create(
    {
      name,
      email:
        override?.email ??
        faker.internet.email({
          firstName: name,
          lastName: faker.person.lastName(),
        }),
      password: override?.password ?? faker.internet.password({}),
      createdAt: override?.createdAt ?? new Date(),
      updatedAt: override?.updatedAt ?? null,
      urlsLiked: override?.urlsLiked ?? new UrlsLikedList(),
    },
    id
  );

  return user;
}
