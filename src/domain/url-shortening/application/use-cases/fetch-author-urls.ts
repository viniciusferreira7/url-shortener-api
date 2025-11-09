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
	params?: Omit<FindManyByAuthorIdParams, 'authorId'>;
}

type FetchAuthorUrlsUseCaseResponse = Either<
	ResourceNotFoundError,
	Pagination<Url>
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
			search: params?.search,
			isPublic: params?.isPublic,
			createdAtGte: params?.createdAtGte,
			updatedAtGte: params?.updatedAtGte,
			order: params?.order,
		});

		return right(urls);
	}
}
