import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object/value-object';
import type { Url } from '../url';
import type { UrlsLikedList } from '../urls-liked-list';

export interface UserWithUrlsProps {
  authorId: UniqueEntityId;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt?: Date | null;
  urls: Url[];
  urlsLiked: UrlsLikedList;
}

export class UserWithUrls extends ValueObject<UserWithUrlsProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get name(): string {
    return this.props.authorName;
  }

  get email(): string {
    return this.props.authorEmail;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  get urls(): Url[] {
    return this.props.urls;
  }

  get urlsLiked() {
    return this.props.urlsLiked;
  }

  static create(props: UserWithUrlsProps) {
    return new UserWithUrls(props);
  }
}
