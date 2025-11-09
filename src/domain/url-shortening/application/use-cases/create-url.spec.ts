import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryCacheRepository } from '@/test/repositories/in-memory-cache-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { Base62UrlCodeGenerator } from '@/test/url-code/url-code-generator';
import { CreateUrlUseCase } from './create-url';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;
let cacheRepository: InMemoryCacheRepository;
let urlCodeGenerator: Base62UrlCodeGenerator;

let sut: CreateUrlUseCase;

describe('Create url use case', () => {
	beforeEach(() => {
		authorsRepository = new InMemoryAuthorsRepository();
		urlsRepository = new InMemoryUrlsRepository();
		cacheRepository = new InMemoryCacheRepository();
		urlsRepository = new InMemoryUrlsRepository();
		urlCodeGenerator = new Base62UrlCodeGenerator();
		sut = new CreateUrlUseCase(
			authorsRepository,
			urlsRepository,
			cacheRepository,
			urlCodeGenerator
		);
	});

	it('should be able to create url shortener', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl();

		const result = await sut.execute({
			authorId: author.id.toString(),
			name: url.name,
			value: url.value,
			description: url.description,
			isPublic: false,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual(
			expect.objectContaining({
				url: expect.objectContaining({
					authorId: author.id,
					name: url.name,
					value: url.value,
					description: url.description,
					isPublic: false,
					code: expect.any(String),
				}),
			})
		);
	});

	it('should not be able to create url shortener without author', async () => {
		const url = makeUrl();

		const result = await sut.execute({
			authorId: 'non-author',
			name: url.name,
			value: url.value,
			description: url.description,
			isPublic: false,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
