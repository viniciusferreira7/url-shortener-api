import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryCacheRepository } from '@/test/repositories/in-memory-cache-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { GetUrlByCodeUseCase } from './get-url-by-code';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;
let cacheRepository: InMemoryCacheRepository;

let sut: GetUrlByCodeUseCase;

describe('Get url by code use case', () => {
	beforeEach(() => {
		authorsRepository = new InMemoryAuthorsRepository();
		urlsRepository = new InMemoryUrlsRepository(authorsRepository);
		cacheRepository = new InMemoryCacheRepository();
		sut = new GetUrlByCodeUseCase(urlsRepository, cacheRepository);
	});

	it('should be able to get url by code', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id, code: 'abc123' });

		await urlsRepository.create(url);

		const result = await sut.execute({
			code: 'abc123',
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.code).toBe('abc123');
			expect(result.value.url.id.toString()).toBe(url.id.toString());
			expect(result.value.url.name).toBe(url.name);
			expect(result.value.url.value).toBe(url.value);
		}
	});

	it('should be able to get public url by code', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({
			authorId: author.id,
			code: 'pub123',
			isPublic: true,
		});

		await urlsRepository.create(url);

		const result = await sut.execute({
			code: 'pub123',
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.isPublic).toBe(true);
			expect(result.value.url.code).toBe('pub123');
		}
	});

	it('should be able to get private url by code', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({
			authorId: author.id,
			code: 'priv456',
			isPublic: false,
		});

		await urlsRepository.create(url);

		const result = await sut.execute({
			code: 'priv456',
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.isPublic).toBe(false);
			expect(result.value.url.code).toBe('priv456');
		}
	});

	it('should return ResourceNotFoundError when url code does not exist', async () => {
		const result = await sut.execute({
			code: 'non-existent-code',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should be case-sensitive when finding by code', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id, code: 'AbC123' });

		await urlsRepository.create(url);

		const resultLowercase = await sut.execute({
			code: 'abc123',
		});

		expect(resultLowercase.isLeft()).toBe(true);

		const resultCorrect = await sut.execute({
			code: 'AbC123',
		});

		expect(resultCorrect.isRight()).toBe(true);
	});

	it('should return correct url data with all properties', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({
			authorId: author.id,
			code: 'xyz789',
			name: 'My Shortened URL',
			description: 'This URL has been shortened',
			isPublic: true,
		});

		await urlsRepository.create(url);

		const result = await sut.execute({
			code: 'xyz789',
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const retrievedUrl = result.value.url;
			expect(retrievedUrl.code).toBe('xyz789');
			expect(retrievedUrl.name).toBe('My Shortened URL');
			expect(retrievedUrl.description).toBe('This URL has been shortened');
			expect(retrievedUrl.isPublic).toBe(true);
			expect(retrievedUrl.authorId.toString()).toBe(author.id.toString());
			expect(retrievedUrl.createdAt).toBeInstanceOf(Date);
		}
	});

	it('should be able to get multiple urls with different codes', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url1 = makeUrl({ authorId: author.id, code: 'code1' });
		const url2 = makeUrl({ authorId: author.id, code: 'code2' });
		const url3 = makeUrl({ authorId: author.id, code: 'code3' });

		await urlsRepository.create(url1);
		await urlsRepository.create(url2);
		await urlsRepository.create(url3);

		const result1 = await sut.execute({ code: 'code1' });
		const result2 = await sut.execute({ code: 'code2' });
		const result3 = await sut.execute({ code: 'code3' });

		expect(result1.isRight()).toBe(true);
		expect(result2.isRight()).toBe(true);
		expect(result3.isRight()).toBe(true);

		if (result1.isRight() && result2.isRight() && result3.isRight()) {
			expect(result1.value.url.code).toBe('code1');
			expect(result2.value.url.code).toBe('code2');
			expect(result3.value.url.code).toBe('code3');
		}
	});

	it('should retrieve url even after update', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({
			authorId: author.id,
			code: 'upd123',
			name: 'Original Name',
		});

		await urlsRepository.create(url);

		url.name = 'Updated Name';
		url.updatedAt = new Date();
		await urlsRepository.save(url);

		const result = await sut.execute({
			code: 'upd123',
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.name).toBe('Updated Name');
			expect(result.value.url.code).toBe('upd123');
		}
	});

	it('should return ResourceNotFoundError when url has been deleted', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id, code: 'del123' });

		await urlsRepository.create(url);

		await urlsRepository.delete(url.id.toString());

		const result = await sut.execute({
			code: 'del123',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should find url by code even with special characters', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({
			authorId: author.id,
			code: 'a1b2_c3-d4',
		});

		await urlsRepository.create(url);

		const result = await sut.execute({
			code: 'a1b2_c3-d4',
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.code).toBe('a1b2_c3-d4');
		}
	});
});
