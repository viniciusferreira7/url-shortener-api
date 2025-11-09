import { type Either, left, right } from '@/core/either';
import type { Pagination } from '@/core/entities/value-object/pagination';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Url } from '../../enterprise/entities/url';
import type { AuthorsRepository } from '../repositories/authors-repository';
import type {
	FindManyByAuthorIdParams,
	UrlsRepository,
} from '../repositories/urls-repository';

interface FetchAuthorUrlsUseCaseRequest {
	authorId: string;
	params: FindManyByAuthorIdParams;
}

type FetchAuthorUrlsUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		urls: Pagination<Url>;
	}
>;

export class FetchAuthorUrlsUseCase {
	constructor(
		private readonly authorsRepository: AuthorsRepository,
		private readonly urlsRepository: UrlsRepository
	) {}

	async execute({
		authorId,
		params,
	}: FetchAuthorUrlsUseCaseRequest): Promise<FetchAuthorUrlsUseCaseResponse> {
		const author = await this.authorsRepository.findById(authorId);

		if (!author) {
			return left(new ResourceNotFoundError());
		}

		const urls = await this.urlsRepository.findManyByAuthorId({
			authorId: author.id.toString(),
			page: params?.page ?? 1,
			perPage: params?.perPage ?? 10,
		});

		return right({ urls: urls });
	}
}
