import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { GetUrlByIdUseCase } from './get-url-by-id';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;

let sut: GetUrlByIdUseCase;

describe('Get url by ID use case', () => {
	beforeEach(() => {
		authorsRepository = new InMemoryAuthorsRepository();
		urlsRepository = new InMemoryUrlsRepository(authorsRepository);
		sut = new GetUrlByIdUseCase(urlsRepository);
	});

	it('should be able to get url by id', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id });

		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.id.toString()).toBe(url.id.toString());
			expect(result.value.url.name).toBe(url.name);
			expect(result.value.url.value).toBe(url.value);
			expect(result.value.url.code).toBe(url.code);
			expect(result.value.url.isPublic).toBe(url.isPublic);
		}
	});

	it('should be able to get public url by id', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id, isPublic: true });

		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.isPublic).toBe(true);
		}
	});

	it('should be able to get private url by id', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id, isPublic: false });

		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.isPublic).toBe(false);
		}
	});

	it('should return ResourceNotFoundError when url does not exist', async () => {
		const result = await sut.execute({
			urlId: 'non-existent-url',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return ResourceNotFoundError when url id is invalid format', async () => {
		const result = await sut.execute({
			urlId: 'invalid-id',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should return correct url data with all properties', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({
			authorId: author.id,
			name: 'My Test URL',
			description: 'This is a test URL',
			isPublic: true,
		});

		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const retrievedUrl = result.value.url;
			expect(retrievedUrl.name).toBe('My Test URL');
			expect(retrievedUrl.description).toBe('This is a test URL');
			expect(retrievedUrl.isPublic).toBe(true);
			expect(retrievedUrl.authorId.toString()).toBe(author.id.toString());
			expect(retrievedUrl.createdAt).toBeInstanceOf(Date);
			expect(retrievedUrl.likes).toBe(0);
		}
	});

	it('should retrieve url even after update', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id, name: 'Original Name' });

		await urlsRepository.create(url);

		url.name = 'Updated Name';
		url.updatedAt = new Date();
		await urlsRepository.save(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.url.name).toBe('Updated Name');
		}
	});

	it('should return null when url has been deleted', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const url = makeUrl({ authorId: author.id });

		await urlsRepository.create(url);

		await urlsRepository.delete(url.id.toString());

		const result = await sut.execute({
			urlId: url.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
