import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { UrlsRepository } from '../repositories/urls-repository';
import type { Url } from '../../enterprise/entities/url';

interface GetUrlByCodeUseCaseRequest {
	code: string;
}

type GetUrlByCodeUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		url: Url;
	}
>;

export class GetUrlByCodeUseCase {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	public async execute({
		code,
	}: GetUrlByCodeUseCaseRequest): Promise<GetUrlByCodeUseCaseResponse> {
		const url = await this.urlsRepository.findByCode(code);

		if (!url) {
			return left(new ResourceNotFoundError());
		}

		return right({ url });
	}
}
