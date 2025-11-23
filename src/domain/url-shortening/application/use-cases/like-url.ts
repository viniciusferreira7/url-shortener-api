import { type Either, left, right } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { UrlAlreadyLikedError } from '../../errors/url-already-liked-error';
import type { AuthorsRepository } from '../repositories/authors-repository';
import type { UrlsRepository } from '../repositories/urls-repository';

interface LikeUrlUseCaseRequest {
	urlId: string;
	authorId: string;
}

type LikeUrlUseCaseResponse = Either<
	ResourceNotFoundError | UrlAlreadyLikedError | NotAllowedError,
	{
		urlLikes: number;
	}
>;

export class LikeUrlUseCase {
	constructor(
		private readonly authorsRepository: AuthorsRepository,
		private readonly urlsRepository: UrlsRepository
	) {}

	public async execute({
		urlId,
		authorId,
	}: LikeUrlUseCaseRequest): Promise<LikeUrlUseCaseResponse> {
		const author = await this.authorsRepository.findById(authorId);
		if (!author) {
			return left(new ResourceNotFoundError());
		}

		const url = await this.urlsRepository.findById(urlId);
		if (!url) {
			return left(new ResourceNotFoundError());
		}

		if (!url.isPublic) {
			return left(new NotAllowedError());
		}

		const alreadyLiked = author.urlsLikedList.currentItems.some((likedUrl) =>
			likedUrl.equals(url)
		);
		if (alreadyLiked) {
			return left(new UrlAlreadyLikedError());
		}

		author.urlsLikedList.add(url);

		const newLikesCount = url.likes + 1;
		url.likes = newLikesCount;

		await this.authorsRepository.save(author);
		await this.urlsRepository.save(url);

		return right({
			urlLikes: newLikesCount,
		});
	}
}
