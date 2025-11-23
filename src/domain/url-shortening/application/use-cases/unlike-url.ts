import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { AuthorsRepository } from '../repositories/authors-repository';
import type { UrlsRepository } from '../repositories/urls-repository';

interface UnlikeUrlUseCaseRequest {
	urlId: string;
	authorId: string;
}

type UnlikeUrlUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		urlLikes: number;
	}
>;

export class UnlikeUrlUseCase {
	constructor(
		private readonly authorsRepository: AuthorsRepository,
		private readonly urlsRepository: UrlsRepository
	) {}

	public async execute({
		urlId,
		authorId,
	}: UnlikeUrlUseCaseRequest): Promise<UnlikeUrlUseCaseResponse> {
		const author = await this.authorsRepository.findById(authorId);
		if (!author) {
			return left(new ResourceNotFoundError());
		}

		const url = await this.urlsRepository.findById(urlId);
		if (!url) {
			return left(new ResourceNotFoundError());
		}

		author.urlsLikedList.remove(url);

		const newLikesCount = Math.max(0, url.likes - 1);
		url.likes = newLikesCount;

		await this.authorsRepository.save(author);
		await this.urlsRepository.save(url);

		return right({
			urlLikes: newLikesCount,
		});
	}
}
