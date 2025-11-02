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

export class UrlWithAuthor extends ValueObject<UrlWithAuthorProps> {}
//TODO: create methods
