import { type Either, left, right } from '@/core/either';
import type { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { AuthorsRepository } from '../repositories/authors-repository';
import type { UrlsRepository } from '../repositories/urls-repository';

interface DeleteUrlRequest {
	authorId: string;
	urlId: string;
}

type DeleteUrlResponse = Either<
	NotAllowedError | ResourceNotFoundError,
	{
		url: Url;
	}
>;

export class DeleteUrlUseCase {
	constructor(
		private readonly authorsRepository: AuthorsRepository,
		private readonly urlsRepository: UrlsRepository
	) {}

	public async execute({
		authorId,
		urlId,
	}: DeleteUrlRequest): Promise<DeleteUrlResponse> {
		const author = await this.authorsRepository.findById(authorId);

		if (!author) {
			return left(new ResourceNotFoundError());
		}

		const url = await this.urlsRepository.findById(urlId);

		if (!url) {
			return left(new ResourceNotFoundError());
		}

		await this.urlsRepository.delete(urlId);

		return right({ url });
	}
}
