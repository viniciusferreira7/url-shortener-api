import { beforeEach, describe, expect, it } from 'bun:test';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { makeAuthor } from '@/test/factories/make-author';
import { makeUrl } from '@/test/factories/make-url';
import { InMemoryAuthorsRepository } from '@/test/repositories/in-memory-authors-repository';
import { InMemoryUrlsRepository } from '@/test/repositories/in-memory-urls-repository';
import { LikeUrlUseCase } from './like-url';
import { UnlikeUrlUseCase } from './unlike-url';

let authorsRepository: InMemoryAuthorsRepository;
let urlsRepository: InMemoryUrlsRepository;
let likeUseCase: LikeUrlUseCase;
let sut: UnlikeUrlUseCase;

describe('Unlike URL use case', () => {
	beforeEach(() => {
		authorsRepository = new InMemoryAuthorsRepository();
		urlsRepository = new InMemoryUrlsRepository(authorsRepository);
		likeUseCase = new LikeUrlUseCase(authorsRepository, urlsRepository);
		sut = new UnlikeUrlUseCase(authorsRepository, urlsRepository);
	});

	it('should be able to unlike a URL that was previously liked', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		// First, like the URL
		await likeUseCase.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		// Then, unlike it
		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.urlLikes).toBe(0);
		}
	});

	it('should decrement the URL like count', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 5 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		// Like first to add to author's list
		await likeUseCase.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			expect(result.value.urlLikes).toBe(5);
		}

		const updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(5);
	});

	it('should remove URL from author liked list', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		// Like the URL
		await likeUseCase.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		let updatedAuthor = await authorsRepository.findById(author.id.toString());
		expect(updatedAuthor?.urlsLikedList.currentItems).toHaveLength(1);

		// Unlike the URL
		const result = await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result.isRight()).toBe(true);

		updatedAuthor = await authorsRepository.findById(author.id.toString());
		expect(updatedAuthor?.urlsLikedList.currentItems).toHaveLength(0);
	});

	it('should not be able to unlike a URL that does not exist', async () => {
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

	it('should not be able to unlike a URL if author does not exist', async () => {
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

	it('should not go below zero when unliking a URL without previous likes', async () => {
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
			expect(result.value.urlLikes).toBe(0);
		}

		const updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(0);
	});

	it('should handle multiple authors liking and unliking the same URL', async () => {
		const author1 = makeAuthor();
		const author2 = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author1);
		await authorsRepository.create(author2);
		await urlsRepository.create(url);

		// Both authors like the URL
		await likeUseCase.execute({
			urlId: url.id.toString(),
			authorId: author1.id.toString(),
		});

		await likeUseCase.execute({
			urlId: url.id.toString(),
			authorId: author2.id.toString(),
		});

		let updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(2);

		// First author unlikes
		const result1 = await sut.execute({
			urlId: url.id.toString(),
			authorId: author1.id.toString(),
		});

		expect(result1.isRight()).toBe(true);

		if (result1.isRight()) {
			expect(result1.value.urlLikes).toBe(1);
		}

		updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(1);

		// Second author unlikes
		const result2 = await sut.execute({
			urlId: url.id.toString(),
			authorId: author2.id.toString(),
		});

		expect(result2.isRight()).toBe(true);

		if (result2.isRight()) {
			expect(result2.value.urlLikes).toBe(0);
		}

		updatedUrl = await urlsRepository.findById(url.id.toString());
		expect(updatedUrl?.likes).toBe(0);
	});

	it('should allow an author to unlike different URLs', async () => {
		const author = makeAuthor();
		const url1 = makeUrl({ isPublic: true, likes: 0 });
		const url2 = makeUrl({ isPublic: true, likes: 0 });

		await authorsRepository.create(author);
		await urlsRepository.create(url1);
		await urlsRepository.create(url2);

		// Like both URLs
		await likeUseCase.execute({
			urlId: url1.id.toString(),
			authorId: author.id.toString(),
		});

		await likeUseCase.execute({
			urlId: url2.id.toString(),
			authorId: author.id.toString(),
		});

		let updatedAuthor = await authorsRepository.findById(author.id.toString());
		expect(updatedAuthor?.urlsLikedList.currentItems).toHaveLength(2);

		// Unlike the first URL
		const result1 = await sut.execute({
			urlId: url1.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result1.isRight()).toBe(true);

		updatedAuthor = await authorsRepository.findById(author.id.toString());
		expect(updatedAuthor?.urlsLikedList.currentItems).toHaveLength(1);

		// Unlike the second URL
		const result2 = await sut.execute({
			urlId: url2.id.toString(),
			authorId: author.id.toString(),
		});

		expect(result2.isRight()).toBe(true);

		updatedAuthor = await authorsRepository.findById(author.id.toString());
		expect(updatedAuthor?.urlsLikedList.currentItems).toHaveLength(0);
	});

	it('should persist the like count decrement to repository', async () => {
		const author = makeAuthor();
		const url = makeUrl({ isPublic: true, likes: 3 });

		await authorsRepository.create(author);
		await urlsRepository.create(url);

		// Like first
		await likeUseCase.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		// Then unlike
		await sut.execute({
			urlId: url.id.toString(),
			authorId: author.id.toString(),
		});

		const persistedUrl = await urlsRepository.findById(url.id.toString());
		expect(persistedUrl?.likes).toBe(3);
	});
});
