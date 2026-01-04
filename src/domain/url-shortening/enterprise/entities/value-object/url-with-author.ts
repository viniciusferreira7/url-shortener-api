import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object/value-object';

export interface UrlWithAuthorProps {
  urlId: UniqueEntityId;
  urlName: string;
  urlDestination: string;
  urlDescription: string | null;
  urlIsPublic: boolean;
  urlCode: string;
  authorId: UniqueEntityId;
  authorName: string;
  score?: number;
  urlLikes: number;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class UrlWithAuthor extends ValueObject<UrlWithAuthorProps> {
  get urlId(): UniqueEntityId {
    return this.props.urlId;
  }

  get urlName(): string {
    return this.props.urlName;
  }

  get urlDestination(): string {
    return this.props.urlDestination;
  }

  get urlCode(): string {
    return this.props.urlCode;
  }

  get urlDescription(): string | null {
    return this.props.urlDescription;
  }

  get urlIsPublic(): boolean {
    return this.props.urlIsPublic;
  }

  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get authorName(): string {
    return this.props.authorName;
  }

  get score(): number | undefined {
    return this.props.score;
  }

  get urlLikes(): number {
    return this.props.urlLikes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  set score(score: number | undefined) {
    this.props.score = score;
  }

  static create(props: UrlWithAuthorProps) {
    return new UrlWithAuthor(props);
  }
}
