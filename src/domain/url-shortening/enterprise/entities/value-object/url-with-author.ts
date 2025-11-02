import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object/value-object';

export interface UrlWithAuthorProps {
	urlId: UniqueEntityId;
	urlName: string;
	UrlValue: string;
	UrlDescription: string;
	UrlIsPublic: boolean;
	authorId: UniqueEntityId;
	authorName: string;
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

	get urlValue(): string {
		return this.props.UrlValue;
	}

	get urlDescription(): string {
		return this.props.UrlDescription;
	}

	get urlIsPublic(): boolean {
		return this.props.UrlIsPublic;
	}

	get authorId(): UniqueEntityId {
		return this.props.authorId;
	}

	get authorName(): string {
		return this.props.authorName;
	}

	get createdAt(): Date {
		return this.props.createdAt;
	}

	get updatedAt(): Date | null | undefined {
		return this.props.updatedAt;
	}
}
