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

export class AuthorWithUrls extends ValueObject<AuthorWithUrlsProps> {}
