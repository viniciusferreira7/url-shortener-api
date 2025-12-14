import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object/value-object';
import type { Url } from '../url';

export interface AuthorWithUrlsProps {
  authorId: UniqueEntityId;
  authorName: string;
  authorEmail: string;
  createdAt: Date;
  updatedAt?: Date | null;
  urls: Url[];
}

export class AuthorWithUrls extends ValueObject<AuthorWithUrlsProps> {
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

  static create(props: AuthorWithUrlsProps) {
    return new AuthorWithUrls(props);
  }
}
