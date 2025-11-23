import type { UseCaseError } from '@/core/errors/use-case-error';

export class UrlAlreadyLikedError extends Error implements UseCaseError {
	constructor() {
		super('Url already liked');
	}
}
