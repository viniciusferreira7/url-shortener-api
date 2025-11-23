import { beforeEach, describe, expect, it } from 'bun:test';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { UrlAlreadyLikedError } from '../../errors/url-already-liked-error';
import { LikeUrlUseCase } from './like-url';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;
let sut: LikeUrlUseCase;

describe('Like URL use case', () => {
	beforeEach(() => {
		authorsRepository = new InMemoryAuthorsRepository();
		urlsRepository = new InMemoryUrlsRepository(authorsRepository);
		sut = new LikeUrlUseCase(authorsRepository, urlsRepository);
	});

	it('should be able to like a public URL', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.urlLikes).toBe(1);
		}
	});

	it('should not be able to like a private URL', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: false, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(NotAllowedError);
		}
	});

	it('should increment the URL like count', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 5 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.urlLikes).toBe(6);
		}

		const updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(6);
	});

	it('should add URL to author liked list', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		const updatedAuthor = await authorsRepository.findById(
			author.id.toString()
		);
		expect(updatedAuthor?.urlsLikedList.currentItems).toContainEqual(url);
	});

	it('should not be able to like a URL that does not exist', async () => {
		const author = makeAuthor();

		await authorsRepository.create(author);

		const result = await sut.execute({
			urlId: 'non-existent-id',
			authorId: author.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		}
	});

	it('should not be able to like a URL if author does not exist', async () => {
		const url = makeUrl({ isPublic: true, likes: 0 });

		await urlsRepository.create(url);

		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: 'non-existent-id',
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		}
	});

	it('should not be able to like the same URL twice', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		const firstLike = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(firstLike.isRight()).toBe(true);

		const secondLike = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(secondLike.isLeft()).toBe(true);
		if (secondLike.isLeft()) {
			expect(secondLike.value).toBeInstanceOf(UrlAlreadyLikedError);
		}
	});

	it('should handle multiple authors liking the same URL', async () => {
		const author1 = makeAuthor();
		const author2 = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author1);
		await authorsRepository.create(author2);
		await urlsRepository.create(url);

		const result1 = await sut.execute({
			urlId: url.id.toString(),
			authorId: author1.id.toString(),
		});

		const result2 = await sut.execute({
			urlId: url.id.toString(),
			authorId: author2.id.toString(),
		});

		expect(result1.isRight()).toBe(true);
		expect(result2.isRight()).toBe(true);

		if (result1.isRight() && result2.isRight()) {
			expect(result1.value.urlLikes).toBe(1);
			expect(result2.value.urlLikes).toBe(2);
		}

		const updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(2);
	});

	it('should allow an author to like different URLs', async () => {
		const author = makeAuthor();
		const url1 = makeUrl({ isPublic: true, likes: 0 });
		const url2 = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url1);
		await urlsRepository.create(url2);

		const result1 = await sut.execute({
			urlId: url1.id.toString(),
			authorId: author.id.toString(),
		});

		const result2 = await sut.execute({
			urlId: url2.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result1.isRight()).toBe(true);
		expect(result2.isRight()).toBe(true);

		const updatedAuthor = await authorsRepository.findById(
			author.id.toString()
		);
		expect(updatedAuthor?.urlsLikedList.currentItems).toHaveLength(2);
	});

	it('should persist the like count to repository', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 3 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		const persistedUrl = await urlsRepository.findById(url.id.toString());
		expect(persistedUrl?.likes).toBe(4);
	});
});
