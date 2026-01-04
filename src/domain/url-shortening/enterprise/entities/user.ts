import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import type { UrlsLikedList } from './urls-liked-list';

interface UserProps {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date | null;
  urlsLiked: UrlsLikedList;
}

export class User extends AggregateRoot<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get urlsLikedList() {
    return this.props.urlsLiked;
  }

  public static create(
    props: Optional<UserProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    return new User(
      {
        ...props,
        createdAt: props?.createdAt ?? new Date(),
      },
      id
    );
  }
}
